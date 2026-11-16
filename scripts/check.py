"""Structural QA for a local build, without looking at a screenshot.

Usage:
  python3 scripts/check.py --url http://localhost:5173/projects/demo/1/index.html
  python3 scripts/check.py --url ... --width 1440

This is the fast, single-width wrapper around scripts/verify.py. Publishing uses
the same engine at desktop and phone widths. Checks: console errors, page
errors, failed local requests, images that did not decode, horizontal overflow,
empty body, and that the page settled at the requested width. Prints PASS/FAIL
lines and exits non-zero on failure.
"""
import argparse
import sys

from verify import verify

parser = argparse.ArgumentParser()
parser.add_argument("--url", required=True)
parser.add_argument("--width", type=int, default=1440)
parser.add_argument("--height", type=int, default=900)
parser.add_argument("--wait", type=int, default=800)
args = parser.parse_args()

result = verify(
    args.url,
    width=args.width,
    height=args.height,
    wait=args.wait,
    mobile=False,
)

print(f"url: {result['url']}")
print(f"title: {result.get('title', '')!r}")
print(f"text: {result.get('text', 0)} chars, images: {result.get('images', 0)}")

if not result["ok"]:
    print("FAIL")
    for problem in result["problems"]:
        print(f"- {problem}")
    sys.exit(1)

print("PASS: no console errors, failed requests, broken images or overflow")
