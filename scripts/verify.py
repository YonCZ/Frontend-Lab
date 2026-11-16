"""Verify a page with cheap structural checks, plus optional project checks.

Usage:
  python3 scripts/verify.py --url http://localhost:5173/projects/demo/1/index.html
  python3 scripts/verify.py --url ... --project build-lab --mobile --json
  python3 scripts/verify.py --url ... --shot preview.jpg

Generic checks: HTTP status, console errors, page errors, failed requests,
images that did not decode, horizontal overflow at 1440, empty body. A phone
pass at 390 runs with --mobile, or with "mobile": true in verify.json.

Project checks live in projects/<id>/verify.json:

  {
    "requiredText": ["Book a seat"],
    "selectors": [".booking-form"],
    "requiredAssets": ["hero.jpg"],
    "script": "verify/flow.py",
    "wait": 1200
  }

`script` is a Python file relative to the project. It exports
run(page, url) and returns a list of problem strings, or None.
"""
import argparse
import importlib.util
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parent.parent


def _config(project):
    if not project:
        return {}
    path = root / "projects" / project / "verify.json"
    if not path.is_file():
        return {}
    try:
        return json.loads(path.read_text())
    except ValueError as error:
        return {"_config_error": f"invalid verify.json: {error}"}


def _page_problems(browser, url, width, height, wait, origin):
    context = browser.new_context(viewport={"width": width, "height": height})
    page = context.new_page()
    problems = []
    console = []
    requests = []

    def on_console(message):
        if message.type == "error":
            console.append(message.text)

    def on_failed(request):
        if not request.url.startswith(origin):
            return
        failure = request.failure or ""
        if "ERR_ABORTED" in failure:
            return
        problems.append(f"request failed: {request.url} ({failure})")

    def on_response(response):
        requests.append(response.url)
        if response.status >= 400 and response.url.startswith(origin):
            problems.append(f"HTTP {response.status}: {response.url}")

    page.on("console", on_console)
    page.on("pageerror", lambda error: problems.append(f"page error: {error}"))
    page.on("requestfailed", on_failed)
    page.on("response", on_response)

    response = page.goto(url, wait_until="load", timeout=30000)
    page.wait_for_timeout(wait)

    if response is None or not response.ok:
        problems.append(f"page did not load: {response.status if response else 'no response'}")
    problems.extend(f"console error: {line}" for line in console)

    text = page.locator("body").inner_text().strip()
    if len(text) < 20 and page.locator("iframe").count() == 0:
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
        problems.append(
            f"horizontal overflow at {width}: {overflow['scroll']} > {overflow['client']}")

    return {
        "page": page,
        "context": context,
        "problems": problems,
        "requests": requests,
        "title": page.title(),
        "text": len(text),
        "images": page.locator("img").count(),
    }


def _project_problems(page, url, project, config):
    if not project or not config:
        return []
    problems = []
    note = config.get("_config_error")
    if note:
        return [note]

    if "requiredText" in config and not isinstance(config["requiredText"], list):
        problems.append("verify.json requiredText must be a list")
    else:
        body = page.locator("body").inner_text()
        for needle in config.get("requiredText", []):
            if needle not in body:
                problems.append(f"missing required text: {needle!r}")

    for selector in config.get("selectors", []):
        try:
            if page.locator(selector).count() == 0:
                problems.append(f"missing selector: {selector}")
        except Exception as error:
            problems.append(f"invalid selector {selector!r}: {error}")

    content = page.content()
    seen = " ".join(page.evaluate(
        "() => performance.getEntriesByType('resource').map(e => e.name)"))
    for asset in config.get("requiredAssets", []):
        if asset not in content and asset not in seen:
            problems.append(f"missing required asset: {asset}")

    script = config.get("script")
    if script:
        path = (root / "projects" / project / script).resolve()
        project_dir = (root / "projects" / project).resolve()
        if project_dir not in path.parents or not path.is_file():
            problems.append(f"verify script not found: {script}")
        else:
            try:
                spec = importlib.util.spec_from_file_location("project_verify", path)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                result = module.run(page, url)
                if result is True or result is None:
                    pass
                elif isinstance(result, str):
                    problems.append(result)
                elif isinstance(result, list):
                    problems.extend(str(item) for item in result)
                else:
                    problems.append(f"verify script returned {type(result).__name__}")
            except Exception as error:
                problems.append(f"verify script failed: {error}")

    return problems


def verify(url, project=None, width=1440, height=900, wait=800, mobile=False, shot=None):
    """Run structural checks and return a JSON-ready result."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return {
            "url": url,
            "project": project,
            "ok": False,
            "problems": ["Playwright is not installed. Do not npm install a browser."],
            "at": datetime.now(timezone.utc).isoformat(),
        }

    origin = "/".join(url.split("/")[:3])
    config = _config(project)
    if config.get("wait"):
        wait = max(wait, int(config["wait"]))
    if config.get("mobile"):
        mobile = True
    problems = []
    details = {}

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        desktop = _page_problems(browser, url, width, height, wait, origin)
        problems.extend(desktop["problems"])
        details = {
            "title": desktop["title"],
            "text": desktop["text"],
            "images": desktop["images"],
        }
        problems.extend(_project_problems(
            desktop["page"], url, project, config))
        if shot:
            desktop["page"].screenshot(path=shot, type="jpeg", quality=80)
        desktop["context"].close()

        if mobile:
            small = _page_problems(browser, url, 390, 844, wait, origin)
            problems.extend(
                f"mobile: {problem}" for problem in small["problems"]
                if problem not in desktop["problems"])
            small["context"].close()

        browser.close()

    unique = list(dict.fromkeys(problems))
    return {
        "url": url,
        "project": project,
        "ok": not unique,
        "problems": unique,
        "title": details.get("title", ""),
        "text": details.get("text", 0),
        "images": details.get("images", 0),
        "checked": {"desktop": f"{width}x{height}", "mobile": "390x844" if mobile else None},
        "at": datetime.now(timezone.utc).isoformat(),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--project")
    parser.add_argument("--width", type=int, default=1440)
    parser.add_argument("--height", type=int, default=900)
    parser.add_argument("--wait", type=int, default=800)
    parser.add_argument("--shot")
    parser.add_argument("--mobile", action="store_true")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    result = verify(
        args.url,
        project=args.project,
        width=args.width,
        height=args.height,
        wait=args.wait,
        mobile=args.mobile,
        shot=args.shot,
    )

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"url: {result['url']}")
        print(f"title: {result.get('title', '')!r}")
        print(f"text: {result.get('text', 0)} chars, images: {result.get('images', 0)}")
        if result["ok"]:
            print("PASS: no console errors, failed requests, broken images or overflow")
        else:
            print("FAIL")
            for problem in result["problems"]:
                print(f"- {problem}")

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
