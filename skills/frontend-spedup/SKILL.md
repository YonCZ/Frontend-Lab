---
name: frontend-spedup
description: Fast verification loop for frontend builds. Use together with any design skill. Prove the page works with assertions and cheap checks before you spend time on screenshots.
---

# Frontend speed-up

Check the page before you look at it. A screenshot costs seconds. A failed request check costs milliseconds.

## Order of work

1. Build the page.
2. Run the structural check and fix every failure.
3. Look at images
4. Fix what you found, repeat until you are satisfied

## Cheap checks before screenshots

- `node --check app.js` for every script you wrote.
- Every local asset exists. Grep the HTML and CSS for `src=` and `url(`, then `curl -o /dev/null -w "%{http_code}"` each path.
- DOM assertions: page title, `h1`, primary CTA and cart/checkout buttons are present. Body text runs past 200 characters.
- No horizontal overflow at 1440: `document.documentElement.scrollWidth <= clientWidth + 1`.
- Every `img` reports `naturalWidth > 0`.
- No page errors and no failed local requests.
- One interaction pass: adding to cart changes the count, a dialog opens and closes, a form submits to a visible confirmation.

## Screenshot budget

- Never re-read an unchanged image. One look per change set.

## When something looks wrong

Name the cause with an assertion first: computed style, bounding box, class list, text content. Then fix it. Take a screenshot to confirm the fix, not to find the bug.

## Do not

- Install Playwright, Chromium, or any browser. It is already available.
- Replace assertions with "it looks fine".
