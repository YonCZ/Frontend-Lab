"""Rebuild the Vite builds declared in project manifests.

Usage:
  python3 scripts/rebuild.py
  python3 scripts/rebuild.py --project build-lab
  python3 scripts/rebuild.py --project trio --dry-run

`dist/` is disposable. This command regenerates every entry that declares
"build": "vite" so a fresh checkout can publish the same files.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent


def folders(project_id, dry_run=False):
    manifest = root / "projects" / project_id / "project.json"
    if not manifest.is_file():
        return []
    data = json.loads(manifest.read_text())
    seen = []
    for build in data.get("builds", []) + data.get("special", []):
        if build.get("build") != "vite":
            continue
        entry = build.get("entry", "")
        folder = Path(entry).parent
        if folder.name == "dist":
            folder = folder.parent
        folder = (manifest.parent / folder).resolve()
        if folder not in seen:
            seen.append(folder)
    return seen


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--project")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    ids = [args.project] if args.project else [
        path.parent.name for path in sorted((root / "projects").glob("*/project.json"))
    ]
    failures = 0
    for project_id in ids:
        for folder in folders(project_id):
            print(f"{project_id}: {folder.relative_to(root)}")
            if args.dry_run:
                continue
            result = subprocess.run(
                ["npx", "vite", "build"],
                cwd=folder,
                capture_output=True,
                text=True,
            )
            if result.returncode != 0:
                failures += 1
                tail = (result.stdout + result.stderr).strip().splitlines()[-8:]
                print("  FAILED")
                for line in tail:
                    print(f"  {line}")
            else:
                print("  ok")

    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
