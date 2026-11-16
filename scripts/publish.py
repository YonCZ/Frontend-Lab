"""Build, verify and publish one build into a project manifest.

Usage:
  python3 scripts/publish.py --project build-lab \
    --folder builds/deepseek-free/apple-design-plus/1 \
    --model "DeepSeek V4.1 Flash Free" --skill "Apple Design +" --variant 1 \
    --build vite --entry dist/index.html

  python3 scripts/publish.py --project demo --folder 1 \
    --model "DeepSeek V4.1 Flash" --skill "No skill" --variant 1 \
    --build static

The same command is the only registration path. It writes a job record to
projects/<id>/runs/<key>.json. A build is added or updated in the manifest only
after verification passes. Vite builds are rebuilt unless --no-build is passed.
"""
import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from verify import verify

root = Path(__file__).resolve().parent.parent


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", str(text).lower()).strip("-") or "build"


def atomic_json(path, data):
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    temporary.replace(path)


def load_manifest(project_id):
    path = root / "projects" / project_id / "project.json"
    if not path.is_file():
        raise SystemExit(f"no manifest for project '{project_id}'")
    return path, json.loads(path.read_text())


def publish_build(
    project_id,
    folder,
    model,
    skill,
    variant,
    build="static",
    entry=None,
    base_url="http://localhost:5173",
    run_build=True,
    preview=False,
    cover=None,
    wait=1000,
    mobile=False,
):
    if build not in ("static", "vite"):
        raise ValueError("build must be 'static' or 'vite'")
    skill = skill or "No skill"
    project_dir = root / "projects" / project_id
    project_root = project_dir.resolve()
    folder_path = (project_dir / folder).resolve()
    if project_root not in folder_path.parents:
        raise ValueError(f"folder is outside the project: {folder}")
    folder_relative = folder_path.relative_to(project_root).as_posix()
    entry = entry or ("dist/index.html" if build == "vite" else "index.html")
    entry_path = folder_path / entry
    key = f"{slug(model)}-{slug(skill)}-{variant}"
    runs = project_dir / "runs"
    runs.mkdir(parents=True, exist_ok=True)
    record_path = runs / f"{key}.json"

    record = {
        "project": project_id,
        "folder": folder_relative,
        "model": model,
        "skill": skill,
        "variant": variant,
        "build": build,
        "entry": entry,
        "status": "pending",
        "verifiedAt": None,
    }

    def fail(reason, problems=None):
        record["status"] = "failed"
        record["reason"] = reason
        if problems is not None:
            record["problems"] = problems
        record["verifiedAt"] = datetime.now(timezone.utc).isoformat()
        atomic_json(record_path, record)
        return record

    if not folder_path.is_dir():
        return fail(f"build folder does not exist: {folder}")
    entry_path = (folder_path / entry).resolve()
    if folder_path not in entry_path.parents:
        return fail(f"entry is outside the build folder: {entry}")
    if not entry_path.is_file():
        return fail(f"entry does not exist: {entry}")

    if build == "vite" and run_build:
        result = subprocess.run(
            ["npx", "vite", "build"],
            cwd=folder_path,
            capture_output=True,
            text=True,
        )
        tail = (result.stdout + result.stderr).strip().splitlines()[-20:]
        record["buildOutput"] = "\n".join(tail)
        if result.returncode != 0:
            return fail("vite build failed", [record["buildOutput"]])
        if not entry_path.is_file():
            return fail(f"entry is still missing after build: {entry}")

    relative_entry = (Path(folder_relative) / entry).as_posix()
    url = f"{base_url.rstrip('/')}/projects/{project_id}/{relative_entry}"
    shot = entry_path.parent / "preview.jpg" if preview else None
    result = verify(url, project=project_id, wait=wait, mobile=mobile, shot=shot)

    record.update({
        "publishedEntry": relative_entry,
        "url": url,
        "status": "ready" if result["ok"] else "failed",
        "verifiedAt": result["at"],
        "verification": {
            "ok": result["ok"],
            "problems": result["problems"],
            "checked": result.get("checked"),
        },
    })
    if shot and shot.is_file():
        record["preview"] = shot.relative_to(project_dir).as_posix()

    if not result["ok"]:
        atomic_json(record_path, record)
        return record

    manifest_path, data = load_manifest(project_id)
    builds = data.setdefault("builds", [])
    item = {
        "model": model,
        "skill": skill,
        "variant": variant,
        "entry": relative_entry,
        "build": build,
    }
    for index, existing in enumerate(builds):
        if (
            existing.get("model") == model
            and (existing.get("skill") or "No skill") == skill
            and int(existing.get("variant", 0)) == int(variant)
        ):
            builds[index] = {**existing, **item}
            break
    else:
        builds.append(item)

    if cover:
        data["cover"] = cover
    atomic_json(manifest_path, data)

    record["registered"] = True
    atomic_json(record_path, record)
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", required=True)
    parser.add_argument("--folder", required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--skill", default="No skill")
    parser.add_argument("--variant", type=int, required=True)
    parser.add_argument("--build", choices=("static", "vite"), default="static")
    parser.add_argument("--entry")
    parser.add_argument("--base-url", default="http://localhost:5173")
    parser.add_argument("--no-build", action="store_true")
    parser.add_argument("--preview", action="store_true")
    parser.add_argument("--cover")
    parser.add_argument("--wait", type=int, default=1000)
    parser.add_argument("--mobile", action="store_true")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    record = publish_build(
        args.project,
        args.folder,
        args.model,
        args.skill,
        args.variant,
        build=args.build,
        entry=args.entry,
        base_url=args.base_url,
        run_build=not args.no_build,
        preview=args.preview,
        cover=args.cover,
        wait=args.wait,
        mobile=args.mobile,
    )

    if args.json:
        print(json.dumps(record, indent=2))
    elif record["status"] == "ready":
        print(f"published {record['project']} / {record.get('publishedEntry', record['entry'])}")
    else:
        target = record.get("publishedEntry") or f"{record['folder']}/{record['entry']}"
        print(f"failed {record['project']} / {target}: {record.get('reason', 'verification')}")
        for problem in record.get("problems", record.get("verification", {}).get("problems", [])):
            print(f"- {problem}")

    return 0 if record["status"] == "ready" else 1


if __name__ == "__main__":
    sys.exit(main())
