---
name: frontend-spedup
description: Fast verification loop for frontend builds. Use together with any design skill. Prove the page works with assertions and cheap checks before spending vision passes on screenshots.
---

# Frontend speed-up

Pictures last, assertions first. Screenshots are the most expensive thing you do; structural checks are nearly free.

## Order of work

1. Build the page.
2. Run the structural check and fix every failure.
3. Only then look at images, at most two.
4. Fix what you found, re-run the check, and re-screenshot only what changed.

## Cheap checks — do these instead of screenshots

- `node --check app.js` for every script you wrote.
- Every local asset exists: grep the HTML/CSS for `src=`/`url(` and `curl -o /dev/null -w "%{http_code}"` each path.
- DOM assertions: page title, `h1`, primary CTA and cart/checkout buttons present; body text over 200 characters.
- No horizontal overflow at 1440: `document.documentElement.scrollWidth <= clientWidth + 1`.
- Images decoded: every `img` has `naturalWidth > 0`.
- Console clean: no page errors, no failed local requests.
- One interaction pass: add to cart changes the count, a dialog opens and closes, a form submits to a visible confirmation.

## Screenshot budget

- One full-page image at 1000px wide, JPEG.
- One contact sheet of the sections you changed, not one image per section.
- Never re-read an unchanged image. One look per change set.

## When something looks wrong

Name the cause with an assertion first — computed style, bounding box, class list, text content — then fix it. Take a screenshot only to confirm the fix, not to discover the bug.

## Do not

- Install Playwright, Chromium, or any browser; it is already available.
- Download fonts from Google Fonts; use the local kit.
- Take a screenshot after every edit, or screenshot the same section twice.
- Replace assertions with "it looks fine".
