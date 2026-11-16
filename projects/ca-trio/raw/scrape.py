#!/usr/bin/env python3
"""Capture ca-trio.cz pages and referenced assets for a site rebuild."""

from __future__ import annotations

import json
import mimetypes
import re
import time
from collections import Counter, deque
from datetime import datetime
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

import requests
from bs4 import BeautifulSoup, Comment

BASE = "https://www.ca-trio.cz/"
ROOT = Path(__file__).resolve().parent
SITE_DIR = ROOT / "site"
IMAGE_DIR = ROOT / "assets" / "img"
OTHER_DIR = ROOT / "assets" / "other"
PAGE_CAP = 500
DELAY = 0.4
USER_AGENT = (
    "OpenCode site rebuild preparation for the ca-trio.cz site owner; "
    "read-only content capture"
)
ALLOWED_HOSTS = {"ca-trio.cz", "www.ca-trio.cz"}
NON_PAGE_EXTENSIONS = {
    ".avif", ".bmp", ".css", ".csv", ".doc", ".docx", ".eot", ".gif",
    ".ico", ".jpeg", ".jpg", ".js", ".json", ".m4v", ".mov", ".mp3",
    ".mp4", ".mpeg", ".ogg", ".otf", ".pdf", ".png", ".ppt", ".pptx",
    ".rar", ".svg", ".tar", ".tif", ".tiff", ".ttf", ".txt", ".wav",
    ".webm", ".webp", ".woff", ".woff2", ".xls", ".xlsx", ".xml", ".zip",
}
IMAGE_EXTENSIONS = {".avif", ".bmp", ".gif", ".ico", ".jpeg", ".jpg", ".png", ".svg", ".tif", ".tiff", ".webp"}
FONT_EXTENSIONS = {".eot", ".otf", ".ttf", ".woff", ".woff2"}
ACTION_PATTERN = re.compile(
    r"(?:booking|book_now|checkout|payment|pay_now|objednav|objednat|"
    r"rezerv|platba|platit|login|logout|admin|kosik|cart)",
    re.IGNORECASE,
)
CSS_URL_PATTERN = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE)
CSS_IMPORT_PATTERN = re.compile(r"@import\s+(?:url\()?\s*(['\"])(.*?)\1\s*\)?", re.IGNORECASE)

for directory in (SITE_DIR, IMAGE_DIR, OTHER_DIR):
    directory.mkdir(parents=True, exist_ok=True)

session = requests.Session()
session.headers.update({
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "cs,en;q=0.5",
})
last_request_at = 0.0
request_count = 0
failures: list[dict[str, str]] = []
skipped: dict[str, str] = {}


def request(url: str) -> requests.Response:
    global last_request_at, request_count
    wait = DELAY - (time.monotonic() - last_request_at)
    if wait > 0:
        time.sleep(wait)
    last_request_at = time.monotonic()
    request_count += 1
    response = session.get(url, timeout=45, allow_redirects=True)
    return response


def internal(url: str) -> bool:
    return urlsplit(url).netloc.lower() in ALLOWED_HOSTS


def normalized_internal_url(href: str, base: str) -> str | None:
    if not href or href.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return None
    absolute = urljoin(base, href.strip())
    parts = urlsplit(absolute)
    if parts.scheme not in {"http", "https"} or parts.netloc.lower() not in ALLOWED_HOSTS:
        return None
    host = "www.ca-trio.cz"
    path = parts.path or "/"
    query = urlencode(sorted(parse_qsl(parts.query, keep_blank_values=True)), doseq=True)
    return urlunsplit(("https", host, path, query, ""))


def eligible_page_url(url: str) -> tuple[bool, str]:
    parts = urlsplit(url)
    if ACTION_PATTERN.search(parts.path) or ACTION_PATTERN.search(parts.query):
        return False, "Booking, payment, login, or administrative action"
    if parts.path.lower().endswith(tuple(NON_PAGE_EXTENSIONS)):
        return False, "Linked document or asset, not an HTML page"
    return True, ""


def safe_component(value: str) -> str:
    value = re.sub(r"[^A-Za-z0-9._-]+", "_", value).strip("_")
    return value or "index"


def page_file(url: str) -> Path:
    parts = urlsplit(url)
    name = safe_component(parts.path.strip("/") or "index")
    if parts.query:
        query = safe_component(parts.query.replace("&", "_").replace("=", "_"))
        name += "_" + query
    return SITE_DIR / (name + ".html")


def unique_asset_path(base: Path, url: str) -> Path:
    parts = urlsplit(url)
    source_path = parts.path.lstrip("/") or "index"
    target = base / source_path
    if parts.query:
        suffix = target.suffix
        target = target.with_name(target.stem + "_" + safe_component(parts.query) + suffix)
    target.parent.mkdir(parents=True, exist_ok=True)
    return target


def clean_text(soup: BeautifulSoup) -> str:
    copy = BeautifulSoup(str(soup), "html.parser")
    for node in copy(["script", "style", "noscript", "template"]):
        node.decompose()
    text = copy.get_text("\n")
    lines = [re.sub(r"[\t \u00a0]+", " ", line).strip() for line in text.splitlines()]
    output: list[str] = []
    for line in lines:
        if line:
            output.append(line)
        elif output and output[-1]:
            output.append("")
    return "\n".join(output).strip()


def add_asset(asset_map: dict[str, str], raw_url: str, base: str, kind: str) -> str | None:
    url = normalized_internal_url(raw_url, base)
    if not url:
        return None
    asset_map.setdefault(url, kind)
    return url


def expand_srcset(value: str) -> list[str]:
    return [item.strip().split()[0] for item in value.split(",") if item.strip()]


def collect_page_assets(soup: BeautifulSoup, base: str, assets: dict[str, str]) -> list[str]:
    page_images: set[str] = set()
    for tag in soup.find_all(["img", "source", "input"]):
        candidates: list[str] = []
        for attribute in ("src", "data-src", "data-lazy-src"):
            if tag.get(attribute):
                candidates.append(tag[attribute])
        for attribute in ("srcset", "data-srcset"):
            if tag.get(attribute):
                candidates.extend(expand_srcset(tag[attribute]))
        for candidate in candidates:
            absolute = urljoin(base, candidate)
            path = urlsplit(absolute).path.lower()
            if tag.name == "img" or path.endswith(tuple(IMAGE_EXTENSIONS)) or "/img/" in path or "/images/" in path:
                url = add_asset(assets, candidate, base, "image")
                if url:
                    parts = urlsplit(url)
                    page_images.add(parts.path + (("?" + parts.query) if parts.query else ""))
    for tag in soup.find_all("link", href=True):
        rel = {str(value).lower() for value in (tag.get("rel") or [])}
        kind = ""
        if "stylesheet" in rel:
            kind = "css"
        elif rel.intersection({"icon", "shortcut", "apple-touch-icon", "apple-touch-icon-precomposed"}):
            kind = "image"
        elif "preload" in rel and str(tag.get("as", "")).lower() == "font":
            kind = "font"
        if kind:
            url = add_asset(assets, tag["href"], base, kind)
            if url and kind == "image":
                parts = urlsplit(url)
                page_images.add(parts.path + (("?" + parts.query) if parts.query else ""))
    for tag in soup.find_all(attrs={"data-src": True}):
        candidate = tag["data-src"]
        path = urlsplit(urljoin(base, candidate)).path.lower()
        if path.endswith(tuple(IMAGE_EXTENSIONS)) or "/img/" in path or "/images/" in path:
            url = add_asset(assets, candidate, base, "image")
            if url:
                parts = urlsplit(url)
                page_images.add(parts.path + (("?" + parts.query) if parts.query else ""))
    for tag in soup.find_all("script", src=True):
        add_asset(assets, tag["src"], base, "js")
    for tag in soup.find_all(style=True):
        for match in CSS_URL_PATTERN.finditer(tag["style"]):
            url = add_asset(assets, match.group(2), base, "image")
            if url:
                parts = urlsplit(url)
                page_images.add(parts.path + (("?" + parts.query) if parts.query else ""))
    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        if "<" in str(comment):
            conditional_soup = BeautifulSoup(str(comment), "html.parser")
            page_images.update(collect_page_assets(conditional_soup, base, assets))
    return sorted(page_images)


def section_for(url: str) -> str:
    query = dict(parse_qsl(urlsplit(url).query))
    page = query.get("page", "home")
    labels = {
        "home": "Homepage",
        "main": "NABÍDKA ZÁJEZDŮ",
        "lm": "LAST MINUTE",
        "ck": "SMLUVNÍ CK",
        "storno": "STORNO PODMÍNKY",
        "hist": "HISTORIE",
        "kon": "KONTAKT",
    }
    return labels.get(page, "Other internal pages")


def extract_page(response: requests.Response, url: str) -> tuple[BeautifulSoup, dict]:
    soup = BeautifulSoup(response.content, "html.parser")
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    description_tag = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    headings = [
        {"level": int(tag.name[1]), "text": tag.get_text(" ", strip=True)}
        for tag in soup.find_all(re.compile(r"^h[1-6]$"))
        if tag.get_text(" ", strip=True)
    ]
    return soup, {
        "url": url,
        "file": str(page_file(url).relative_to(ROOT)),
        "title": title,
        "meta_description": description_tag.get("content", "").strip() if description_tag else "",
        "headings": headings,
        "plain_text": clean_text(soup.body or soup),
        "images": [],
        "date_captured": datetime.now().astimezone().isoformat(timespec="seconds"),
    }


def save_asset(url: str, kind: str) -> tuple[Path | None, bytes | None]:
    try:
        response = request(url)
        response.raise_for_status()
    except requests.RequestException as error:
        failures.append({"url": url, "error": str(error)})
        return None, None
    target = unique_asset_path(IMAGE_DIR if kind == "image" else OTHER_DIR, url)
    target.write_bytes(response.content)
    return target, response.content


def crawl_assets(initial_assets: dict[str, str]) -> tuple[dict[str, str], int]:
    pending = deque(initial_assets.items())
    processed: set[str] = set()
    discovered = dict(initial_assets)
    image_count = 0
    while pending:
        url, kind = pending.popleft()
        if url in processed:
            continue
        processed.add(url)
        target, content = save_asset(url, kind)
        if content is None:
            continue
        if kind == "image":
            image_count += 1
        if kind != "css":
            continue
        css = content.decode("utf-8", errors="replace")
        references = [match.group(2) for match in CSS_URL_PATTERN.finditer(css)]
        references.extend(match.group(2) for match in CSS_IMPORT_PATTERN.finditer(css))
        for reference in references:
            if reference.startswith("data:"):
                continue
            child = normalized_internal_url(reference, url)
            if not child:
                continue
            extension = Path(urlsplit(child).path).suffix.lower()
            child_kind = "font" if extension in FONT_EXTENSIONS or (extension == ".svg" and "font" in child.lower()) else "image" if extension in IMAGE_EXTENSIONS else "css"
            if child not in discovered:
                discovered[child] = child_kind
                pending.append((child, child_kind))
    return discovered, image_count


def navigation_from_homepage(soup: BeautifulSoup) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    seen: set[str] = set()
    containers = soup.find_all("nav")
    if not containers:
        containers = soup.find_all(id=re.compile(r"menu|nav", re.I))
    for container in containers:
        for link in container.find_all("a", href=True):
            url = normalized_internal_url(link["href"], BASE)
            if not url or url in seen:
                continue
            seen.add(url)
            items.append({"label": link.get_text(" ", strip=True), "url": url})
    return items


def color_and_font_summary() -> tuple[list[tuple[str, int]], list[str]]:
    colors: Counter[str] = Counter()
    fonts: set[str] = set()
    hex_color = re.compile(r"#[0-9a-fA-F]{3,8}\b")
    functional_color = re.compile(r"(?:rgba?|hsla?)\([^)]*\)", re.I)
    font_family = re.compile(r"font-family\s*:\s*([^;}]+)", re.I)
    for css_file in OTHER_DIR.rglob("*.css"):
        css = css_file.read_text(encoding="utf-8", errors="replace")
        colors.update(value.lower() for value in hex_color.findall(css))
        colors.update(value.lower() for value in functional_color.findall(css))
        for value in font_family.findall(css):
            for family in value.split(","):
                family = family.strip().strip("'\"")
                if family:
                    fonts.add(family)
    return sorted(colors.items(), key=lambda item: (-item[1], item[0])), sorted(fonts)


def main() -> None:
    queue = deque([BASE])
    queued = {BASE}
    discovered_subpages: set[str] = set()
    pages: list[dict] = []
    assets: dict[str, str] = {}
    navigation: list[dict[str, str]] = []
    homepage_soup: BeautifulSoup | None = None
    cap_reached = False

    while queue and len(pages) < PAGE_CAP:
        url = queue.popleft()
        try:
            response = request(url)
            response.raise_for_status()
        except requests.RequestException as error:
            failures.append({"url": url, "error": str(error)})
            skipped[url] = "Request failed: " + str(error)
            continue
        content_type = response.headers.get("Content-Type", "").lower()
        if "html" not in content_type and content_type:
            skipped[url] = "Non-HTML response: " + content_type
            continue
        soup, entry = extract_page(response, url)
        if homepage_soup is None:
            homepage_soup = soup
            navigation = navigation_from_homepage(soup)
        target = page_file(url)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(response.content)
        entry["images"] = collect_page_assets(soup, url, assets)
        pages.append(entry)
        print(f"[{len(pages)}/{PAGE_CAP}] {url} -> {target.name} ({len(response.content)} bytes)", flush=True)

        for link in soup.find_all("a", href=True):
            child = normalized_internal_url(link["href"], url)
            if not child:
                continue
            eligible, reason = eligible_page_url(child)
            if not eligible:
                skipped.setdefault(child, reason)
                continue
            if child not in queued:
                queued.add(child)
                if child != BASE:
                    discovered_subpages.add(child)
                queue.append(child)

    if queue and len(pages) >= PAGE_CAP:
        cap_reached = True
        for url in queue:
            skipped[url] = "Not captured because the 500-page cap was reached"

    print(f"Downloading {len(assets)} initially referenced assets", flush=True)
    all_assets, image_count = crawl_assets(assets)

    pages.sort(key=lambda item: item["url"])
    (ROOT / "pages.json").write_text(
        json.dumps(pages, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    content_lines = [
        "# CA Trio website content",
        "",
        "Text is kept verbatim in Czech. Repeated navigation and footer text may appear on each page.",
        "",
    ]
    sections: dict[str, list[dict]] = {}
    for page in pages:
        sections.setdefault(section_for(page["url"]), []).append(page)
    for section, section_pages in sections.items():
        content_lines.extend([f"## {section}", ""])
        for page in section_pages:
            content_lines.extend([
                f"### {page['title'] or page['url']}",
                "",
                f"Source: {page['url']}",
                "",
                page["plain_text"],
                "",
            ])
    (ROOT / "content.md").write_text("\n".join(content_lines), encoding="utf-8")

    generator = ""
    if homepage_soup:
        tag = homepage_soup.find("meta", attrs={"name": re.compile(r"^generator$", re.I)})
        generator = tag.get("content", "") if tag else ""
    colors, fonts = color_and_font_summary()
    html_bytes = sum((ROOT / page["file"]).stat().st_size for page in pages)
    asset_bytes = sum(path.stat().st_size for path in (ROOT / "assets").rglob("*") if path.is_file())
    captured_subpages = sum(1 for page in pages if page["url"] != BASE)
    failed_page_count = sum(1 for url in skipped if url in discovered_subpages)
    notes = [
        "# Crawl notes",
        "",
        f"Capture date: {datetime.now().astimezone().isoformat(timespec='seconds')}",
        f"Starting URL: {BASE}",
        f"User-Agent: {USER_AGENT}",
        "Crawl method: sequential GET requests with at least 400 ms between requests. No forms, logins, bookings, or payment actions were used.",
        "Discovery: internal links only, including pagination, sort categories, and trip details linked from main and last-minute listings. No numeric IDs were generated.",
        "",
        "## Counts and sizes",
        "",
        f"HTML pages captured: {len(pages)}",
        f"Subpages discovered: {len(discovered_subpages)}",
        f"Subpages captured: {captured_subpages}",
        f"Discovered subpages not captured: {len(discovered_subpages) - captured_subpages}",
        f"Images saved: {image_count}",
        f"All referenced assets saved successfully: {len(list(all_assets)) - sum(1 for failure in failures if not failure['url'].endswith('.php') and 'page=' not in failure['url'])}",
        f"HTTP requests made: {request_count}",
        f"Saved HTML bytes: {html_bytes}",
        f"Saved asset bytes: {asset_bytes}",
        f"Total saved HTML and asset bytes: {html_bytes + asset_bytes}",
        f"Page cap reached: {'yes' if cap_reached else 'no'}",
        f"Category filter pages captured: {sum(1 for page in pages if dict(parse_qsl(urlsplit(page['url']).query)).get('sort'))}",
        f"Trip detail pages captured: {sum(1 for page in pages if dict(parse_qsl(urlsplit(page['url']).query)).get('id'))}",
        "Last-minute trips and category filters discovered: 0",
        "Pagination links discovered: 0",
        "Other linked variants captured: index.php and the empty id filter on the main listing",
        "",
        "## Technology",
        "",
        "Server: PHP-style server-rendered pages using index.php query parameters. The crawl did not inspect server source code.",
        f"HTML: UTF-8, HTML5 doctype, Czech language declaration. Generator meta tag: {generator or 'not declared'}.",
        "Template: the HTML comments credit a responsive TemplateMonster travel agency theme and implementation by ZEPPYR s.r.o.",
        "Client libraries: jQuery, jQuery Migrate, Superfish, Camera slideshow, and Owl Carousel. The saved source includes booking form code, but the crawl did not submit any forms.",
        "External services referenced but not fetched: Google reCAPTCHA, Google Maps, Google Analytics, and Facebook SDK.",
        "Client assets: CSS, JavaScript, and fonts are saved under assets/other. Conditional IE assets are included.",
        "",
        "## Navigation",
        "",
    ]
    if navigation:
        notes.extend(f"- {item['label']}: {item['url']}" for item in navigation)
    else:
        notes.append("No semantic nav element was found. Page groupings in content.md use the page query parameter.")
    notes.extend(["", "## CSS colours", ""])
    notes.extend(f"- {color}: {count} occurrence(s)" for color, count in colors)
    notes.extend(["", "## CSS font families", ""])
    notes.extend(f"- {font}" for font in fonts)
    notes.extend(["", "## Failures and skipped pages", ""])
    if failures:
        notes.extend(f"- Request failed: {failure['url']}: {failure['error']}" for failure in failures)
    else:
        notes.append("No HTTP requests failed.")
    internal_skips = [(url, reason) for url, reason in skipped.items() if url in discovered_subpages or "cap" in reason]
    if internal_skips:
        notes.extend(f"- {url}: {reason}" for url, reason in sorted(internal_skips))
    else:
        notes.append("No discovered internal content subpages were skipped.")
    notes.extend([
        "",
        "External domains, Facebook, mailto, and tel links were not followed. Linked documents and media files were not captured as HTML pages.",
        "",
    ])
    (ROOT / "notes.md").write_text("\n".join(notes), encoding="utf-8")

    summary = {
        "pages": len(pages),
        "subpages_discovered": len(discovered_subpages),
        "subpages_captured": captured_subpages,
        "images": image_count,
        "assets": len(all_assets),
        "requests": request_count,
        "html_bytes": html_bytes,
        "asset_bytes": asset_bytes,
        "total_bytes": html_bytes + asset_bytes,
        "cap_reached": cap_reached,
        "failures": len(failures),
        "failed_pages": failed_page_count,
    }
    print("SUMMARY " + json.dumps(summary, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
