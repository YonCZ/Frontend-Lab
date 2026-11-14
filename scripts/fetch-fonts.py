"""Download latin subsets of Google Fonts into the local kit.

Usage:
  python3 scripts/fetch-fonts.py "Public Sans" "DM Serif Display"

Writes fonts/<family-slug>/{400,700}.woff2 plus a ready font.css with relative
URLs, then rebuilds fonts/README.md. Uses curl, so no Python TLS setup needed.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
root = Path(__file__).resolve().parent.parent
fonts = root / "fonts"
fonts.mkdir(exist_ok=True)
meta_path = fonts / "families.json"


def load_meta():
    try:
        return json.loads(meta_path.read_text())
    except (OSError, ValueError):
        return {}


def css_for(family: str, weights: str) -> str:
    url = ("https://fonts.googleapis.com/css2?family="
           + family.replace(" ", "+") + f":wght@{weights}&display=swap")
    return subprocess.run(["curl", "-sSL", "-A", UA, "--max-time", "20", url],
                          capture_output=True, text=True).stdout


def fetch(family: str) -> int:
    slug = re.sub(r"[^a-z0-9]+", "-", family.lower()).strip("-")
    css = css_for(family, "400;700")
    if "@font-face" not in css:
        css = css_for(family, "400")
    blocks = re.findall(r"/\*\s*([a-z\-]+)\s*\*/\s*@font-face\s*\{(.*?)\}", css, re.S)
    folder = fonts / slug
    folder.mkdir(parents=True, exist_ok=True)
    lines = [f"/* {family} — latin subset, OFL */"]
    saved = 0
    for subset, body in blocks:
        if subset != "latin":
            continue
        weight = re.search(r"font-weight:\s*(\d+)", body).group(1)
        src = re.search(r"url\((https://[^)]+\.woff2)\)", body).group(1)
        name = f"{weight}.woff2"
        subprocess.run(["curl", "-sSL", "-A", UA, "--max-time", "20",
                        "-o", str(folder / name), src], capture_output=True)
        if not (folder / name).is_file() or (folder / name).stat().st_size < 1000:
            continue
        body = re.sub(r"src:[^;]+;", f"src: url('{name}') format('woff2');", body)
        lines.append("@font-face {" + body + "}")
        saved += 1
    if saved:
        (folder / "font.css").write_text("\n".join(lines) + "\n")
        meta = load_meta()
        meta[slug] = family
        meta_path.write_text(json.dumps(dict(sorted(meta.items())), indent=2) + "\n")
    return saved


def rebuild_readme():
    meta = load_meta()
    rows = []
    for folder in sorted(p for p in fonts.iterdir() if p.is_dir()):
        if (folder / "font.css").is_file():
            rows.append(f"- {meta.get(folder.name, folder.name)} — `{folder.name}/font.css`")
    (fonts / "README.md").write_text(
        "# Font kit\n\nAll families are SIL Open Font License, latin subset, ready `font.css` with relative `url()` paths.\n\n"
        + "\n".join(rows)
        + "\n\nCopy the folders you use into `assets/fonts/` and include `font.css` or copy its `@font-face` rules. "
          "Add another family with `python3 scripts/fetch-fonts.py \"Family Name\"`.\n"
    )


if __name__ == "__main__":
    wanted = sys.argv[1:]
    if not wanted:
        sys.exit('usage: fetch-fonts.py "Family Name" ["Another Family"]')
    for family in wanted:
        count = fetch(family)
        print(f"{family}: {count} file(s)")
    rebuild_readme()
