# Frontend Lab

A local gallery for comparing frontend builds made by different models and skills from the same brief. Builds are folders served as-is, so agents can keep writing simple HTML; the lab is a small dynamic app around them that updates while builds land.

## Quick start

```sh
npm install
npm run dev
```

Open <http://localhost:5173/>. One Node process runs Express and mounts Vite in middleware mode, so there is a single port: API, build folders, HMR and the app all live there.

A production build is available when you want a frozen bundle:

```sh
npm start          # builds the UI and the static pages, then serves everything on http://localhost:4173
```

## Structure

```
index.html              Vite entry for the lab app
iterator.html           standalone iterator viewer shell
previews.html           standalone previews list
src/                    React + TypeScript UI only
  App.tsx               routes: gallery, project preview, /iterators, /iterators/new
  components/           Gallery, Iterators, NewIterator, AppBar, Preview, MenuBar
  api.ts                state fetch, SSE subscription, status updates
styles.css              the lab app stylesheet
server/index.mjs        Express: API, gate, /projects, static pages, dist
public/
  pages.css             styles for the standalone viewer and previews list
  assets/               Geist, the lab icon, provider marks
  fonts/                local font kit
projects/
  catalog.json          portable slugs shown in the gallery
  catalog.local.json    machine-local slugs, ignored by git
  status.local.json     Working / Settled state, ignored by git
  <slug>/
    project.json        manifest: brief, builds, optional experiment
    inputs/             authored copy and source images, when needed
    verify.json         optional project checks
    builds/...          one folder per variant
    runs/...            job and verification records, ignored by git
iterators/              editable derivatives of selected designs
prompts/frontend-base.md
scripts/                prepare, publish, verify, screenshots, fonts
templates/              minimal static and Vite starters
skills/                 companion skills used by agents
```

`iterators/` and `projects/*/runs/` and `dist/` are local working data. A fresh checkout has `projects/catalog.json` with `demo` and `build-lab`; add local projects to `catalog.local.json`.

The gallery groups projects into **Working** and **Settled**. A checker on a working card moves it to Settled, and the up arrow on a settled card moves it back. The state lives in `projects/status.local.json` and is updated through `POST /api/projects/:id/status`. Group open and closed state is stored in the browser.

The iterator listing and creation form are React routes at `/iterators` and `/iterators/new`. The viewer at `/iterator/:id` stays a standalone shell, because it loads arbitrary copied builds in an iframe.

## Build contract

Every manifest build declares how it is produced:

```json
{
  "model": "A model",
  "skill": "Frontend Design",
  "variant": 1,
  "entry": "builds/01/index.html",
  "build": "static"
}
```

- `static`: `entry` is a file in the build folder, served as-is. No build step.
- `vite`: the folder has `src/`, `package.json` and `vite.config.ts`, and `entry` is `dist/index.html`. Run `npx vite build` before publishing. `dist/` is disposable.

Register a build through one command:

```sh
python3 scripts/publish.py --project build-lab \
  --folder builds/deepseek-free/apple-design-plus/1 \
  --model "DeepSeek V4.1 Flash Free" --skill "Apple Design +" --variant 1 \
  --build vite --entry dist/index.html
```

`publish.py` rebuilds Vite when needed, runs `scripts/verify.py` at 1440, writes `projects/<id>/runs/<key>.json`, and only then adds or updates the manifest entry. A failed build never reaches `project.json`.

Rebuild every Vite entry after a checkout:

```sh
python3 scripts/rebuild.py
```

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
      "entry": "builds/01/index.html",
      "build": "static"
    }
  ]
}
```

`entry` and `cover` are relative to the project folder. Leave out `skill` for a baseline build. The first build opens by default; the menu bar switches model, skill and variant, and **Compare** pins a second build side by side. Projects with `"demo": true` show a Demo badge.

Authored copy and source images can live in `projects/<slug>/inputs/`. Keep the brief in `project.json` unless it is long enough to deserve its own file.

## Verification

`scripts/verify.py` is the shared gate: HTTP status, console errors, page errors, failed requests, broken images, empty body, and horizontal overflow at 1440. Add `--mobile`, or `"mobile": true` in the project config, for a 390 pass. It accepts a project id so it can load `projects/<id>/verify.json`:

```json
{
  "requiredText": ["Book a seat"],
  "selectors": [".booking-form"],
  "requiredAssets": ["hero.jpg"],
  "script": "verify/flow.py",
  "wait": 1200
}
```

`script` is a Python file relative to the project. It exports `run(page, url)` and returns a list of problem strings, or `None`. Keep product flows and required photos there, not in the shared skill.

`scripts/check.py` is the fast single-width wrapper used by agents. It runs the same engine at 1440 with no phone pass.

```sh
python3 scripts/check.py --url http://localhost:5173/projects/demo/1/index.html
python3 scripts/verify.py --url ... --project build-lab --json
```

Playwright is already available:

```sh
python3 -m pip install playwright
python3 -m playwright install chromium
```

## React and Motion without installs

The lab root already has `react`, `react-dom`, `motion`, `vite` and `@vitejs/plugin-react` in `node_modules`. Node resolves them upward, so a build folder inside the repo needs no install of its own.

```sh
cp -R templates/react-motion projects/<project>/builds/<variant>
# edit src/, then:
cd projects/<project>/builds/<variant> && npx vite build
```

The build writes `dist/index.html`. Point the manifest entry at it and set `"build": "vite"`. `base: "./"` is already set, so the folder works under any path in the lab.

Do not run `npm install` inside a build folder. Only add a dependency at the lab root.

## The build queue

`scripts/` also contains the harness used to run many builds across models and skills.

- `scripts/prepare-job.py` prepares build folders and prints the composed prompt for a thread.
- `scripts/queue-driver.py` tracks jobs; its `register` command now calls `scripts/publish.py`, so registration has one path.
- `scripts/rebuild.py` rebuilds every `"build": "vite"` entry.
- `public/fonts/` holds the OFL families. Add more with `python3 scripts/fetch-fonts.py "Family Name"`.
- `scripts/shot.py` takes one-command screenshots (`--url`, `--out`, `--full`, `--selector`, `--contact "a,b"`).

Prepare a prompt for two variants of one preset:

```sh
python3 scripts/prepare-job.py frontend-design --variants 2
python3 scripts/prepare-job.py frontend-design --variants 2 --brand "Trio"   # default brand is Demos
```

The generated prompt points at the local font kit, `scripts/check.py`, `scripts/shot.py`, and the preview server on `http://localhost:5173`.

Placeholders in `prompts/frontend-base.md`: `{{build_root}}`, `{{variants}}`, `{{variant_plural}}`, `{{variant_dirs}}`, `{{assets_instruction}}`, `{{project_brief}}`, `{{skills_line}}`, `{{tools_line}}`, `{{base_url}}`.

Queue commands target the first project in `projects/catalog.json` unless `QUEUE_PROJECT` is set:

```sh
echo '{"threads":{"<thread-id>":"completed"}}' | python3 scripts/queue-driver.py sync
python3 scripts/queue-driver.py register <job-key>
python3 scripts/queue-driver.py plan
python3 scripts/queue-driver.py mark <job-key> running <thread-id>
```

The scripts expect an `experiment` block (`model`, `maxConcurrent`, `basePrompt`, `skills`, `presets`).

## Skills

`skills/frontend-spedup/SKILL.md` is a verification-first companion skill: run structural checks before spending screenshots, then look at at most two images. Project-specific checks belong in `verify.json`, not in the shared skill.

Design skills are referenced by absolute path in the prompt, not auto-discovered, so an agent cannot load extra skills you did not assign.

## Notes

- Builds run from disk with real relative paths, so scripts, assets and `localStorage` behave normally. Keep the server bound to localhost and only run builds you trust.
- Nothing here calls a model provider; point your own runner at the composed prompt and write the result into a build folder.
- `projects/ca-trio/` holds the authored source content for the Trio client project. It has no manifest and is not shown in the gallery.
- Provider marks in `public/assets/providers/` come from [whichai.dev](https://www.whichai.dev/).
- No credentials, run logs or personal projects are included. `projects/*/runs/` and `dist/` are gitignored.
