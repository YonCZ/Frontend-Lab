import express from "express";
import chokidar from "chokidar";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const projectsDir = path.join(root, "projects");
const distDir = path.join(root, "dist");
const port = Number(process.env.PORT || 4173);
const serveDist = process.argv.includes("--serve-dist");

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
    special,
  });
  if (data.builds.some((build) => !normalise(build).entry)) {
    throw new Error(`invalid build entry in ${id}`);
  }
  const builds = data.builds.map((build) => normalise(build));
  const specials = (Array.isArray(data.special) ? data.special : [])
    .map((build) => normalise(build, true))
    .filter((build) => build.entry);
  return {
    id,
    name: data.name.trim(),
    brief: typeof data.brief === "string" ? data.brief : "",
    demo: data.demo === true,
    cover: filePath(id, data.cover),
    builds: [...builds, ...specials],
    experiment: data.experiment ?? null,
    runs: await readJson(path.join(projectsDir, id, "runs", "status.json"), null),
  };
}

async function state() {
  const catalog = await readJson(path.join(projectsDir, "catalog.json"), []);
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
  return { projects, failed, promptPath, prompt, revision: Date.now() };
}

const app = express();
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
}

chokidar.watch(projectsDir, { ignoreInitial: true }).on("all", broadcast);

app.listen(port, "127.0.0.1", () => {
  console.log(
    serveDist
      ? `Frontend Lab on http://localhost:${port}`
      : `Frontend Lab API on http://localhost:${port}`,
  );
});
