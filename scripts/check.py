"""Structural QA for a local build, without looking at a screenshot.

Usage:
  python3 scripts/check.py --url http://localhost:5173/projects/demo/builds/01/index.html
  python3 scripts/check.py --url ... --width 1440

Checks: console errors, page errors, failed local requests, images that did not
decode, horizontal overflow, empty body, and that the page settled at the
requested width. Prints PASS/FAIL lines and exits non-zero on failure.
"""
import argparse
import sys

parser = argparse.ArgumentParser()
parser.add_argument("--url", required=True)
parser.add_argument("--width", type=int, default=1440)
parser.add_argument("--height", type=int, default=900)
parser.add_argument("--wait", type=int, default=800)
args = parser.parse_args()

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("Playwright is not installed. Ask for it to be set up; do not npm install a browser.")

origin = "/".join(args.url.split("/")[:3])
problems = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": args.width, "height": args.height})
    console = []
    page.on("console", lambda message: console.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: problems.append(f"page error: {error}"))
    page.on("response", lambda response: problems.append(f"HTTP {response.status}: {response.url}")
            if response.status >= 400 and response.url.startswith(origin) else None)
    response = page.goto(args.url, wait_until="load", timeout=30000)
    page.wait_for_timeout(args.wait)

    if response is None or not response.ok:
        problems.append(f"page did not load: {response.status if response else 'no response'}")
    if console:
        problems.extend(f"console error: {line}" for line in console)

    text = page.locator("body").inner_text().strip()
    if len(text) < 20:
        problems.append("body has almost no text")

    broken = page.evaluate("""() => [...document.images]
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.getAttribute('src'))""")
    if broken:
        problems.append("images did not decode: " + ", ".join(map(str, broken)))

    overflow = page.evaluate("""() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth})""")
    if overflow["scroll"] > overflow["client"] + 1:
        problems.append(f"horizontal overflow: {overflow['scroll']} > {overflow['client']}")

    print(f"url: {args.url}")
    print(f"title: {page.title()!r}")
    print(f"text: {len(text)} chars, images: {page.locator('img').count()}")
    browser.close()

if problems:
    print("FAIL")
    for problem in dict.fromkeys(problems):
        print(f"- {problem}")
    sys.exit(1)

print("PASS: no console errors, failed requests, broken images or overflow")
