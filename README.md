# Frontend Lab

A local gallery for comparing frontend builds made by different models and skills from the same brief. Builds are plain static folders served as-is, so agents can keep writing simple HTML; the lab is a small dynamic app around them that updates itself while builds land.

## Quick start

```sh
npm install
npm run dev
```

Open <http://localhost:5173/>. One Node process runs Express and mounts Vite in middleware mode, so there is a single port: API, build folders, HMR and the app all live there.

A production build is available when you want a frozen bundle:

```sh
npm start          # builds the UI, then serves everything on http://localhost:4173
```

## How it works

```
index.html              Vite entry
src/                    React + TypeScript UI
  App.tsx               routing (project / build / against in the URL)
  components/           Gallery, Preview, icon and model marks
  api.ts                state fetch + SSE subscription
server/index.mjs        Express: /api/state, /api/events, /projects, dist
projects/
  catalog.json          slugs shown in the gallery
  <project-slug>/
    project.json        manifest: brief, builds, optional experiment
    builds/...          one static folder per variant
prompts/frontend-base.md
scripts/                optional queue helpers (prepare-job.py, queue-driver.py)
```

- `GET /api/state` — catalog, manifests, queued/running job status, shared prompt.
- `GET /api/events` — SSE stream; the server watches `projects/**` with chokidar (including `runs/status.json`) and pushes a fresh state whenever files change.
- `/projects/*` — the builds themselves, with `no-store` on JSON.

Two kinds of live update:

- **Content** (builds, manifests, job status) is pushed over SSE in every mode, dev or production. Agents only have to write files; cards and the open preview update without a reload.
- **App code** (`src/`, CSS) is hot-swapped by Vite in `npm run dev`. A production bundle is fixed until it is rebuilt, same as any React or Next app.

## Add a project

Create `projects/<slug>/`, add the slug to `projects/catalog.json`, and describe its builds:

```json
{
  "name": "My product site",
  "brief": "Build an English-language product page for this brief.",
  "cover": "cover.jpg",
  "builds": [
    {
      "model": "A model",
      "skill": "Frontend Design",
      "variant": 1,
      "entry": "builds/01/index.html"
    }
  ]
}
```

`entry` and `cover` are relative to the project folder. Leave out `skill` for a baseline build. The first build opens by default; the rail switches model, skill and variant, and **VS** compares two builds side by side. Projects with `"demo": true` show a Demo badge.

`projects/morrow-notes` and `projects/index-editions` are sample projects. Delete them and clear `projects/catalog.json` to start empty.

## Optional: the build queue

`scripts/` contains the harness used to run many builds across models and skills, plus a font kit and a screenshot helper.

- `fonts/` — 16 OFL families (latin, 400/700) with ready `font.css` files; agents copy what they need into `assets/fonts/`.
- `scripts/shot.py` — one-command screenshots (`--url`, `--out`, `--full`, `--selector`), 1000px wide, JPEG by default.

Verification uses Playwright:

```sh
python3 -m pip install playwright
python3 -m playwright install chromium
```

Prepare a prompt for two variants of one preset:

```sh
python3 scripts/prepare-job.py frontend-design --variants 2
```

The generated prompt also points at the local font kit, `scripts/shot.py`, and the preview server on `http://localhost:5173`.

Placeholders in `prompts/frontend-base.md`: `{{build_root}}`, `{{variants}}`, `{{variant_plural}}`, `{{variant_dirs}}`, `{{assets_instruction}}`, `{{project_brief}}`, `{{skills_line}}`, `{{tools_line}}`, `{{base_url}}`.

Queue commands target the first project in `projects/catalog.json` unless `QUEUE_PROJECT` is set:

```sh
echo '{"threads":{"<thread-id>":"completed"}}' | python3 scripts/queue-driver.py sync
python3 scripts/queue-driver.py register <job-key>   # verifies in Chromium, updates project.json
python3 scripts/queue-driver.py plan
python3 scripts/queue-driver.py mark <job-key> running <thread-id>
```

`sync` expects a thread-id → status map from whatever runs your agents. The scripts expect an `experiment` block (`model`, `maxConcurrent`, `basePrompt`, `skills`, `presets`).

## Notes

- Builds run from disk with real relative paths, so scripts, assets and `localStorage` behave normally. Keep the server bound to localhost and only run builds you trust.
- Nothing here calls a model provider; point your own runner at the composed prompt and write the result into a build folder.
- No credentials, run logs or personal projects are included. `projects/*/runs/` and `dist/` are gitignored.
