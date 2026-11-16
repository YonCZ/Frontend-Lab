import express from "express";
import fsSync from "node:fs";
import chokidar from "chokidar";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const projectsDir = path.join(root, "projects");
const distDir = path.join(root, "dist");
const iteratorsDir = path.join(root, "iterators");
const noStore = (response) => response.set("Cache-Control", "no-store");
const pageDir = () => (serveDist ? distDir : root);

const port = Number(process.env.PORT || 4173);
const serveDist = process.argv.includes("--serve-dist");
const dev = process.env.NODE_ENV === "development" && !serveDist;

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const segment = /^[a-zA-Z0-9_][a-zA-Z0-9_.-]*$/;

const filePath = (id, relative) =>
  typeof relative === "string" && relative.split("/").every((part) => segment.test(part))
    ? `projects/${id}/${relative}`
    : null;

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function loadProject(id) {
  const data = await readJson(path.join(projectsDir, id, "project.json"), null);
  if (!data || typeof data.name !== "string" || !Array.isArray(data.builds)) {
    throw new Error(`invalid manifest for ${id}`);
  }
  const normalise = (build, special = false) => ({
    model: typeof build.model === "string" ? build.model.trim() : "",
    skill:
      typeof build.skill === "string" && build.skill.trim()
        ? build.skill.trim()
        : "No skill",
    variant: build.variant,
    entry: filePath(id, build.entry),
    build: build.build === "vite" ? "vite" : "static",
    special,
  });
  if (data.builds.some((build) => !normalise(build).entry)) {
    throw new Error(`invalid build entry in ${id}`);
  }
  const builds = data.builds.map((build) => normalise(build));
  const specials = (Array.isArray(data.special) ? data.special : [])
    .map((build) => normalise(build, true))
    .filter((build) => build.entry);
  let hasClientList = false;
  try {
    await fs.access(path.join(projectsDir, id, "client.json"));
    hasClientList = true;
  } catch {
    /* no client preview */
  }
  return {
    id,
    name: data.name.trim(),
    brief: typeof data.brief === "string" ? data.brief : "",
    demo: data.demo === true,
    cover: filePath(id, data.cover),
    builds: [...builds, ...specials],
    experiment: data.experiment ?? null,
    preview: hasClientList,
    kind: data.kind === "iterator" ? "iterator" : "generator",
    sources: Array.isArray(data.sources) ? data.sources : [],
    runs: await readJson(path.join(projectsDir, id, "runs", "status.json"), null),
  };
}

async function state() {
  const localCatalog = await readJson(path.join(projectsDir, "catalog.local.json"), null);
  const catalog =
    localCatalog ?? (await readJson(path.join(projectsDir, "catalog.json"), []));
  const ids = Array.isArray(catalog)
    ? [...new Set(catalog.filter((id) => typeof id === "string" && slug.test(id)))]
    : [];
  const results = await Promise.allSettled(ids.map(loadProject));
  const projects = [];
  const failed = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") projects.push(result.value);
    else failed.push(ids[index]);
  });
  const promptPath =
    projects.find((project) => project.experiment?.basePrompt)?.experiment.basePrompt ||
    "prompts/frontend-base.md";
  let prompt = "";
  try {
    prompt = await fs.readFile(path.join(root, promptPath), "utf8");
  } catch {
    /* no shared prompt */
  }
  return { projects, failed, promptPath, prompt, revision: nextRevision(projects, failed, promptPath, prompt) };
}

let stateRevision = 0;
let stateSignature = "";

function nextRevision(projects, failed, promptPath, prompt) {
  const signature = JSON.stringify({
    projects: projects.map((project) => [project.id, project.name, project.builds, project.cover, project.demo]),
    failed,
    promptPath,
    prompt,
  });
  if (signature !== stateSignature) {
    stateSignature = signature;
    stateRevision += 1;
  }
  return stateRevision;
}

const app = express();
/* the public tunnel only serves the client preview, never the lab itself */
const tunnelHost = /\.trycloudflare\.com$/i;
const clientHost = (process.env.CLIENT_HOST || "").trim().toLowerCase();
const isClientHost = (hostname) => clientHost ? hostname.toLowerCase() === clientHost : tunnelHost.test(hostname);
const clientPaths = [/^\/preview\//, /^\/triopreview\/?$/, /^\/iterator-files\//, /^\/projects\/trio\/client\.json$/, /^\/assets\//, /^\/favicon\.ico$/];
app.use((request, response, next) => {
  if (!isClientHost(request.hostname)) return next();
  if (request.method !== "GET" && request.method !== "HEAD") return response.status(404).end();
  if (clientPaths.some((pattern) => pattern.test(request.path))) return next();
  return response.redirect(302, "/preview/trio");
});
const clients = new Set();

app.get("/api/state", async (_request, response) => {
  response.set("Cache-Control", "no-store");
  response.json(await state());
});

app.get("/api/events", (request, response) => {
  response.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-store",
    Connection: "keep-alive",
  });
  response.flushHeaders();
  response.write(": connected\n\n");
  clients.add(response);
  const heartbeat = setInterval(() => response.write(": ping\n\n"), 25000);
  request.on("close", () => {
    clearInterval(heartbeat);
    clients.delete(response);
  });
});

let broadcastTimer;
function broadcast() {
  clearTimeout(broadcastTimer);
  broadcastTimer = setTimeout(async () => {
    const payload = await state();
    for (const client of clients) {
      client.write(`event: state\ndata: ${JSON.stringify(payload)}\n\n`);
    }
  }, 200);
}

app.get(["/iterator/:id/admin", "/iterator/:id/admin/", "/iterator/:id", "/iterator/:id/"], (_request, response) => {
  noStore(response);
  response.sendFile(path.join(pageDir(), "iterator.html"));
});

app.get("/iterators", (_request, response) => {
  noStore(response);
  response.sendFile(path.join(pageDir(), "iterators.html"));
});

app.get("/iterators/new", (_request, response) => {
  noStore(response);
  response.sendFile(path.join(pageDir(), "iterators-new.html"));
});

app.get("/previews", (_request, response) => {
  noStore(response);
  response.sendFile(path.join(pageDir(), "previews.html"));
});

app.use(express.json({ limit: "2mb" }));

async function loadIterator(id) {
  const data = await readJson(path.join(iteratorsDir, id, "project.json"), null);
  if (!data || typeof data.name !== "string") return null;
  const builds = (Array.isArray(data.builds) ? data.builds : [])
    .filter((build) => build && typeof build.entry === "string")
    .map((build) => ({
      model: build.model || "Iterator",
      skill: build.skill || "Edited",
      variant: Number(build.variant) || 1,
      entry: build.entry,
      url: `/iterator-files/${id}/${build.entry}`,
    }));
  const sources = (Array.isArray(data.sources) ? data.sources : []).map((source, index) => ({
    label: source.label || `Source ${index + 1}`,
    project: source.project || "",
    model: source.model || "",
    skill: source.skill || "",
    copy: source.copy || `sources/${String(index + 1).padStart(2, "0")}`,
    url: `/iterator-files/${id}/${source.copy}/dist/index.html`,
  }));
  return { id, name: data.name, brief: data.brief || "", builds, sources };
}

app.get("/api/iterators", async (_request, response) => {
  response.set("Cache-Control", "no-store");
  let ids = [];
  try {
    const entries = await fs.readdir(iteratorsDir, { withFileTypes: true });
    ids = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    ids = [];
  }
  const results = await Promise.all(ids.map(loadIterator));
  response.json({ iterators: results.filter(Boolean) });
});

app.get("/api/iterators/:id", async (request, response) => {
  response.set("Cache-Control", "no-store");
  const found = await loadIterator(request.params.id);
  if (!found) {
    response.status(404).json({ error: "iterator not found" });
    return;
  }
  response.json(found);
});

app.post("/api/iterators", async (request, response) => {
  const body = request.body ?? {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const sources = Array.isArray(body.sources) ? body.sources : [];
  if (!name || !sources.length) {
    response.status(400).json({ error: "name and at least one source are required" });
    return;
  }
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  if (!slug) {
    response.status(400).json({ error: "name needs letters or digits" });
    return;
  }
  const projectPath = path.join(iteratorsDir, slug);
  if (fsSync.existsSync(projectPath)) {
    response.status(409).json({ error: `a project called ${slug} already exists` });
    return;
  }
  const manifest = {
    name,
    kind: "iterator",
    brief: "Iterator workspace. Chosen designs are copied into sources/ and edited or merged into new builds.",
    builds: [],
    sources: [],
    experiment: null,
  };
  try {
    await fs.mkdir(path.join(projectPath, "sources"), { recursive: true });
    for (const [index, source] of sources.entries()) {
      const entry = typeof source.entry === "string" ? source.entry : "";
      if (!entry || entry.includes("..")) continue;
      const from = path.join(root, entry);
      const entryDir = path.dirname(from);
      const sourceDir = path.basename(entryDir) === "dist" ? path.dirname(entryDir) : entryDir;
      const to = path.join(projectPath, "sources", String(index + 1).padStart(2, "0"));
      await fs.cp(sourceDir, to, { recursive: true });
      manifest.sources.push({
        label: typeof source.label === "string" ? source.label : `Source ${index + 1}`,
        project: typeof source.project === "string" ? source.project : "",
        model: typeof source.model === "string" ? source.model : "",
        skill: typeof source.skill === "string" ? source.skill : "",
        entry,
        copy: `sources/${String(index + 1).padStart(2, "0")}`,
        preview: entry,
      });
    }
    await fs.writeFile(path.join(projectPath, "project.json"), JSON.stringify(manifest, null, 2) + "\n");
    response.status(201).json({ id: slug });
  } catch (error) {
    response.status(500).json({ error: String(error.message || error) });
  }
});

app.get(["/preview/:id", "/preview/:id/"], (_request, response) => {
  noStore(response);
  response.sendFile(path.join(root, "preview.html"));
});

app.get("/triopreview", (_request, response) => {
  noStore(response);
  response.sendFile(path.join(root, "triopreview.html"));
});

app.use(
  "/iterator-files",
  express.static(iteratorsDir, { setHeaders: (response) => response.set("Cache-Control", "no-store") }),
);

app.use(
  "/projects",
  express.static(projectsDir, {
    etag: true,
    lastModified: true,
    setHeaders(response, filePath) {
      if (filePath.endsWith(".json")) response.set("Cache-Control", "no-store");
      else response.set("Cache-Control", "no-cache");
    },
  }),
);

if (serveDist) {
  app.use(express.static(distDir, { index: false }));
  app.get(/.*/, (_request, response) => {
    response.sendFile(path.join(distDir, "index.html"));
  });
} else if (dev) {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

const ignored = (filePath, stats) =>
  Boolean(stats?.isSocket?.() || stats?.isFIFO?.()) ||
  filePath.includes(`${path.sep}.taste-skill`) ||
  filePath.includes(`${path.sep}.web-verify`) ||
  filePath.includes(`${path.sep}node_modules`) ||
  filePath.includes(`${path.sep}dist`) ||
  filePath.includes(`${path.sep}public`) ||
  filePath.includes(`${path.sep}assets`) ||
  filePath.includes(`${path.sep}thumbs`) ||
  filePath.includes(`${path.sep}previews`) ||
  filePath.includes(`${path.sep}fonts`);

chokidar
  .watch(projectsDir, { ignoreInitial: true, ignored })
  .on("all", broadcast)
  .on("error", (error) => console.error("watch error:", error.message));

app.listen(port, "127.0.0.1", () => {
  const mode = serveDist ? "production" : dev ? "development (HMR)" : "api";
  console.log(`Frontend Lab ${mode} on http://localhost:${port}`);
});
