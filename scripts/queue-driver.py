"""Queue driver for the Test #1 build board.

Threads created with create_threads are top-level and never wake the thread
that launched them, so something has to advance the queue on a timer. This
script owns the bookkeeping half; a scheduled T3 Code turn owns the thread
creation half, because only the MCP layer can create threads.

  sync      read {"threads": {"<threadId>": "<status>"}} on stdin, apply to
            status.json, and print the jobs that changed.
  plan      print how many slots are free and which jobs to launch next.
  mark      record a job's status, and optionally its thread id.
  register  verify a finished build with Playwright, add it to the project
            manifest, and mark it ready or failed.
"""
import json
import os
import sys
from pathlib import Path

from publish import publish_build

root = Path(__file__).resolve().parent.parent
def catalog_default():
    try:
        return json.loads((root / 'projects/catalog.json').read_text())[0]
    except (OSError, ValueError, IndexError):
        return 'example'


project = root / 'projects' / (os.environ.get('QUEUE_PROJECT') or catalog_default())
manifest = project / 'project.json'
runs = project / 'runs'
status_path = runs / 'status.json'
threads_path = runs / 'threads.json'
server = 'http://localhost:5173'

data = json.loads(manifest.read_text())
experiment = data.get('experiment')
if experiment is None:
    raise SystemExit(f"project '{project.name}' has no experiment block; add one to use the queue scripts")
max_concurrent = experiment.get('maxConcurrent', 2)


def atomic_json(path, value):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
    os.replace(temporary, path)


def read_json(path, default):
    return json.loads(path.read_text()) if path.exists() else default


def save_status(status):
    atomic_json(status_path, status)


def save_threads(threads):
    atomic_json(threads_path, threads)


def split_key(key):
    preset_id, variant = key.rsplit('-', 1)
    preset = next((p for p in experiment['presets'] if p['id'] == preset_id), None)
    if preset is None:
        raise SystemExit(f'unknown preset in job key: {key}')
    return preset, int(variant)


def ordered_keys():
    """Job keys in the preset order the Python queue used."""
    return [f"{preset['id']}-{variant}"
            for preset in experiment['presets']
            for variant in range(1, preset['variants'] + 1)]


def title_for(key):
    preset, variant = split_key(key)
    return f"Test #1 / {preset['name']} / {variant}"


def folder_for(key):
    preset, variant = split_key(key)
    folder = experiment.get('folder') or str(experiment.get('model', 'model')).split('/')[-1]
    return project / 'builds' / folder / preset['id'] / str(variant)


def cmd_sync():
    payload = json.loads(sys.stdin.read() or '{}')
    seen = payload.get('threads', {})
    status = read_json(status_path, {})
    threads = read_json(threads_path, {})
    changed = []
    for key, info in threads.items():
        thread_id = info.get('threadId')
        if not thread_id or thread_id not in seen:
            continue
        remote = seen[thread_id]
        previous = status.get(key, {}).get('status')
        # A finished turn is 'completed'; a thread that ran and stopped is
        # 'interrupted' or 'failed'. Anything else is still in flight.
        if remote == 'completed':
            new = 'completed'
        elif remote in ('failed', 'cancelled', 'interrupted', 'rolled_back'):
            new = remote
        elif remote in ('idle', 'waiting'):
            new = previous if previous else 'queued'
            if remote == 'idle' and previous == 'running':
                new = 'completed'
        else:
            new = 'running'
        if new != previous:
            entry = dict(status.get(key, {}))
            entry['status'] = new
            status[key] = entry
            changed.append({'key': key, 'status': new, 'previous': previous})
    save_status(status)
    print(json.dumps({'changed': changed}))


def cmd_plan():
    status = read_json(status_path, {})
    active = [k for k in ordered_keys()
              if status.get(k, {}).get('status') == 'running']
    free = max(0, max_concurrent - len(active))
    pending = [k for k in ordered_keys()
               if status.get(k, {}).get('status') in ('queued', None)]
    launch = [{'key': k, 'title': title_for(k)} for k in pending[:free]]
    print(json.dumps({
        'active': active,
        'free': free,
        'launch': launch,
        'remaining': len(pending),
        'ready': len(data['builds']),
        'total': len(ordered_keys()),
    }, indent=2))


def cmd_mark():
    key, state = sys.argv[2], sys.argv[3]
    status = read_json(status_path, {})
    entry = dict(status.get(key, {}))
    entry['status'] = state
    status[key] = entry
    save_status(status)
    if len(sys.argv) > 4:
        threads = read_json(threads_path, {})
        threads[key] = {'threadId': sys.argv[4]}
        save_threads(threads)
    print(json.dumps({key: entry}))


def cmd_register():
    key = sys.argv[2]
    preset, variant = split_key(key)
    folder = folder_for(key)
    status = read_json(status_path, {})
    entry = dict(status.get(key, {}))
    model = (preset.get('model') or experiment.get('modelLabel')
             or experiment.get('model') or 'Unknown')
    if (folder / 'dist' / 'index.html').is_file():
        build, entry_file = 'vite', 'dist/index.html'
    else:
        build, entry_file = 'static', 'index.html'
    try:
        result = publish_build(
            project_id=project.name,
            folder=folder.relative_to(project).as_posix(),
            model=model,
            skill=preset['name'],
            variant=variant,
            build=build,
            entry=entry_file,
            base_url=server,
            preview=True,
        )
    except Exception as error:
        result = {'status': 'failed', 'reason': str(error).splitlines()[0]}
    if result['status'] != 'ready':
        entry['status'] = 'failed'
        entry['reason'] = result.get('reason') or 'verification failed'
        status[key] = entry
        save_status(status)
        print(json.dumps({key: 'failed', 'reason': entry['reason']}))
        return
    fresh = json.loads(manifest.read_text())
    fresh_experiment = fresh['experiment']
    fresh_experiment['status'] = ('complete' if len(fresh['builds']) >= len(ordered_keys())
                                  else 'running')
    atomic_json(manifest, fresh)
    entry['status'] = 'ready'
    entry.pop('reason', None)
    status[key] = entry
    save_status(status)
    print(json.dumps({key: 'ready', 'entry': result.get('publishedEntry', entry_file)}))


commands = {'sync': cmd_sync, 'plan': cmd_plan, 'mark': cmd_mark,
            'register': cmd_register}
if len(sys.argv) < 2 or sys.argv[1] not in commands:
    raise SystemExit(__doc__)
commands[sys.argv[1]]()
