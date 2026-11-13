# Frontend Lab

A local gallery for comparing frontend builds made by different models and skills from the same brief. Each build is a plain static folder, so anything you can open in a browser works here — no framework or build step required for the gallery itself.

![Frontend Lab](./assets/lab.svg)

## Quick start

```sh
python3 -m http.server 4173 --bind localhost
```

Open <http://localhost:4173/>.

## How it is organised

```
index.html            gallery shell
app.js                gallery logic (projects, models, skills, variants, compare)
styles.css
assets/               fonts and icon
prompts/frontend-base.md   prompt template used by the build scripts
scripts/prepare-job.py     build a prompt for one project + preset
scripts/queue-driver.py    track status, verify builds, plan the next run
projects/
  catalog.json        slugs shown in the gallery
  <project-slug>/
    project.json      manifest: brief, builds, optional experiment
    builds/...        one static folder per variant
```

Add a project by creating `projects/<slug>/`, putting its builds inside, and adding the slug to `projects/catalog.json`. Path segments may use letters, digits, underscores, hyphens and dots; project slugs are lowercase with hyphens.

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

`entry` and `cover` are relative to the project folder. Leave out `skill` for a baseline build. The first build opens by default; the rail switches model, skill and variant, and **VS** compares two builds side by side. A project with `"demo": true` shows a Demo badge.

`projects/morrow-notes` and `projects/index-editions` are small sample projects so the gallery is not empty on first run. Delete them and clear `projects/catalog.json` to start from scratch.

## Optional: the build queue

`scripts/` contains the harness used to run many builds across models and skills. It needs Playwright for verification:

```sh
python3 -m pip install playwright
python3 -m playwright install chromium
```

Prepare a prompt for two variants of one preset:

```sh
python3 scripts/prepare-job.py frontend-design --variants 2
```

The prompt is composed from `prompts/frontend-base.md` with these placeholders filled in: `{{project_brief}}`, `{{variants}}`, `{{variant_plural}}`, `{{variant_dirs}}` and `{{assets_instruction}}`.

Queue commands (they operate on the first project in `projects/catalog.json` unless `QUEUE_PROJECT` is set):

```sh
echo '{"threads":{"<thread-id>":"completed"}}' | python3 scripts/queue-driver.py sync
python3 scripts/queue-driver.py register <job-key>   # verifies in Chromium, adds to project.json
python3 scripts/queue-driver.py plan                 # active jobs, free slots, next launches
python3 scripts/queue-driver.py mark <job-key> running <thread-id>
```

`sync` expects a map of thread id to status from whatever runs your agents. The scripts assume a project manifest with an `experiment` block (`model`, `maxConcurrent`, `basePrompt`, `skills`, `presets`); see the comment at the top of `queue-driver.py` for the shape they expect.

## Notes

- The gallery serves builds straight from disk, so scripts, relative assets and `localStorage` behave like a real site. Keep the server bound to `localhost` and only run builds you trust.
- Nothing here talks to a model provider. Point your own agent runner (T3 Code, OpenCode, a script) at the prompt and write the result into a build folder.
- No credentials, run logs or personal projects are included. `projects/*/runs/` is ignored by git.
