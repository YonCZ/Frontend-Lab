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
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

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


def verify(entry):
    if not entry.is_file() or not entry.stat().st_size:
        return 'missing index.html'
    relative = entry.relative_to(root).as_posix()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        local_errors = []
        page.on('response', lambda response: local_errors.append(response.url)
                if response.status >= 400 and response.url.startswith(server + '/')
                and not response.url.endswith('/favicon.ico') else None)
        page.on('pageerror', lambda error: local_errors.append(str(error)))
        response = page.goto(f'{server}/{relative}', wait_until='load', timeout=25000)
        if response is None or not response.ok:
            return 'preview HTTP error'
        page.locator('body').wait_for(state='visible', timeout=8000)
        if not page.locator('body').inner_text().strip():
            return 'preview has no visible text'
        image = page.locator('img[src*="acrylic-lecterns"]')
        if experiment.get('requirePhoto', True):
            if image.count():
                image.first.evaluate('img => img.decode()')
            elif 'acrylic-lecterns.png' not in ' '.join(
                    page.locator('body, body *').evaluate_all(
                        "nodes => nodes.map(n => getComputedStyle(n).backgroundImage)"
                        ".filter(s => s !== 'none')")):
                return 'preview does not use the supplied product photo'
        if local_errors:
            return 'missing local asset or script error: ' + local_errors[0]
        page.screenshot(path=entry.parent / 'preview.jpg', type='jpeg',
                        quality=78, timeout=12000)
    return None


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
    if any(item['skill'] == preset['name'] and item['variant'] == variant
           for item in data['builds']):
        entry['status'] = 'ready'
        status[key] = entry
        save_status(status)
        print(json.dumps({key: 'already registered'}))
        return
    target = folder / 'index.html'
    try:
        failure = verify(target)
    except Exception as error:
        failure = f'preview check failed: {str(error).splitlines()[0]}'
    if failure:
        entry['status'] = 'failed'
        entry['reason'] = failure
        status[key] = entry
        save_status(status)
        print(json.dumps({key: 'failed', 'reason': failure}))
        return
    data['builds'].append({
        'model': 'Kimi K3',
        'skill': preset['name'],
        'variant': variant,
        'entry': target.relative_to(project).as_posix(),
    })
    order = {item['name']: index for index, item in enumerate(experiment['presets'])}
    data['builds'].sort(key=lambda item: (order[item['skill']], item['variant']))
    data['cover'] = str(Path(data['builds'][0]['entry']).with_name('preview.jpg'))
    experiment['status'] = ('complete' if len(data['builds']) == len(ordered_keys())
                            else 'running')
    atomic_json(manifest, data)
    entry['status'] = 'ready'
    entry.pop('reason', None)
    status[key] = entry
    save_status(status)
    print(json.dumps({key: 'ready', 'entry': target.relative_to(project).as_posix()}))


commands = {'sync': cmd_sync, 'plan': cmd_plan, 'mark': cmd_mark,
            'register': cmd_register}
if len(sys.argv) < 2 or sys.argv[1] not in commands:
    raise SystemExit(__doc__)
commands[sys.argv[1]]()
