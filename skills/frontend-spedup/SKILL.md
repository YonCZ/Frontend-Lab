---
name: frontend-spedup
description: Fast verification loop for frontend builds. Use together with any design skill. Prove the page works with assertions and cheap checks before you spend time on screenshots.
---

# Frontend speed-up

Check the page before you look at it. A screenshot costs seconds. A failed request check costs milliseconds.

## Order of work

1. Build the page.
2. Run the structural check and fix every failure.
3. Run the project's own checks from `projects/<id>/verify.json` if it has them.
4. Look at images
5. Fix what you found, repeat until you are satisfied

## Cheap checks before screenshots

- `node --check` every script you wrote.
- The page loads with HTTP 200.
- No page errors in the console.
- No horizontal overflow at 1440.
- Assert the project's main flow. Project-specific checks belong in `projects/<id>/verify.json`, not in this shared skill.

## Screenshot budget

- Never re-read an unchanged image. One look per change set.

## When something looks wrong

Name the cause with an assertion first: computed style, bounding box, class list, text content. Then fix it. Take a screenshot to confirm the fix, not to find the bug.

## Do not

- Install Playwright, Chromium, or any browser. It is already available.
- Replace assertions with "it looks fine".
- Start, restart or kill the lab server. It is already running on port 5173. If it fails, stop and report.
