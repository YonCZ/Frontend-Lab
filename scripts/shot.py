"""Take a screenshot of a local build with Playwright.

Usage:
  python3 scripts/shot.py --url http://localhost:5173/projects/demo/builds/01/index.html --out /tmp/shot.jpg
  python3 scripts/shot.py --url ... --out section.jpg --selector ".pricing"
  python3 scripts/shot.py --url ... --out full.jpg --full

Defaults: 1000px wide viewport, no full page, JPEG quality 70.
Playwright and Chromium are expected to be installed already; this script
never installs anything.
"""
import argparse
import sys
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--url", required=True)
parser.add_argument("--out", required=True)
parser.add_argument("--width", type=int, default=1000)
parser.add_argument("--height", type=int, default=800)
parser.add_argument("--full", action="store_true")
parser.add_argument("--selector", action="append", default=[])
parser.add_argument("--quality", type=int, default=70)
parser.add_argument("--wait", type=int, default=350, help="milliseconds after load")
parser.add_argument("--contact", default="", help="comma-separated selectors stitched into one image")
args = parser.parse_args()

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("Playwright is not installed. Ask for it to be set up; do not npm install a browser.")

out = Path(args.out)
out.parent.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": args.width, "height": args.height}, device_scale_factor=1)
    page.goto(args.url, wait_until="load", timeout=30000)
    page.wait_for_timeout(args.wait)
    if args.contact:
        from io import BytesIO
        from PIL import Image
        parts = []
        for selector in [item.strip() for item in args.contact.split(",") if item.strip()]:
            target = page.locator(selector).first
            target.scroll_into_view_if_needed()
            page.wait_for_timeout(150)
            parts.append(Image.open(BytesIO(target.screenshot(type="jpeg", quality=args.quality))).convert("RGB"))
        width = max(part.width for part in parts)
        gap = 12
        height = sum(part.height for part in parts) + gap * (len(parts) - 1)
        sheet = Image.new("RGB", (width, height), (24, 24, 24))
        y = 0
        for part in parts:
            sheet.paste(part, (0, y))
            y += part.height + gap
        sheet.save(out, quality=args.quality)
        print(f"{out} ({out.stat().st_size // 1024} KB, {len(parts)} sections)")
    elif args.selector:
        for index, selector in enumerate(args.selector):
            target = page.locator(selector).first
            target.scroll_into_view_if_needed()
            page.wait_for_timeout(150)
            name = out if len(args.selector) == 1 else out.with_name(f"{out.stem}-{index + 1}{out.suffix}")
            jpeg = name.suffix.lower() in (".jpg", ".jpeg")
            options = {"path": str(name), "type": "jpeg" if jpeg else "png"}
            if jpeg:
                options["quality"] = args.quality
            target.screenshot(**options)
            print(f"{name} ({name.stat().st_size // 1024} KB)")
    else:
        page.screenshot(
            path=str(out),
            full_page=args.full,
            type="jpeg" if out.suffix.lower() in (".jpg", ".jpeg") else "png",
            quality=args.quality,
        )
        print(f"{out} ({out.stat().st_size // 1024} KB)")
    browser.close()
