"""Prepare Test project build directories and print the prompt for a T3 Code thread.

Usage:
  python3 scripts/prepare-job.py all-skills --variants 2
  python3 scripts/prepare-job.py all-skills --project test-2
  python3 scripts/prepare-job.py frontend-design-1

Composes the prompt from the experiment's basePrompt with the project brief,
variant count and directories substituted, plus the preset's skills. Copies
the project's inputs into each variant's assets folder. Writes the prompt to
projects/<project>/runs/<label>.prompt.md and prints it.
"""
import json
import shutil
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent

flags = {'--project': None, '--variants': None, '--model': None}
args = []
tokens = sys.argv[1:]
index = 0
while index < len(tokens):
    token = tokens[index]
    if token in flags:
        if index + 1 >= len(tokens):
            raise SystemExit(f'{token} needs a value')
        flags[token] = tokens[index + 1]
        index += 2
        continue
    args.append(token)
    index += 1

if not args:
    raise SystemExit('usage: prepare-job.py <preset-id> [--variants N] [--project ID]')

def catalog_default():
    try:
        return json.loads((root / 'projects/catalog.json').read_text())[0]
    except (OSError, ValueError, IndexError):
        return 'example'


project_id = flags['--project'] or catalog_default()
project = root / 'projects' / project_id
data = json.loads((project / 'project.json').read_text())
experiment = data['experiment']
model_id = flags['--model'] or experiment.get('model')
if not model_id:
    raise SystemExit('project.json has no experiment.model; pass --model')
folder_slug = experiment.get('folder') or model_id.split('/')[-1]

job = args[0]
preset = next((item for item in experiment['presets'] if item['id'] == job), None)
if preset is not None:
    preset_id = job
    if flags['--variants']:
        count = int(flags['--variants'])
    else:
        count = int(preset.get('variants', 1))
    if count < 1 or count > 20:
        raise SystemExit('variants must be between 1 and 20')
    variants = list(range(1, count + 1))
    label = f'{preset_id}-{count}variants'
else:
    preset_id, variant = job.rsplit('-', 1)
    preset = next((item for item in experiment['presets'] if item['id'] == preset_id), None)
    if preset is None:
        raise SystemExit(f'unknown preset: {preset_id}')
    variants = [int(variant)]
    label = job

folders = []
inputs = project / 'inputs'
for variant in variants:
    folder = project / 'builds' / folder_slug / preset_id / str(variant)
    assets = folder / 'assets'
    assets.mkdir(parents=True, exist_ok=True)
    if inputs.is_dir():
        for asset in inputs.iterdir():
            shutil.copy2(asset, assets / asset.name)
    folders.append(folder)

has_assets = inputs.is_dir() and any(inputs.iterdir())
if has_assets:
    names = ', '.join(sorted(p.name for p in inputs.iterdir()))
    assets_instruction = f'Use the supplied assets at assets/: {names}.'
else:
    assets_instruction = 'Do not use any supplied image or photo assets.'

template = (root / experiment['basePrompt']).read_text()
base_prompt = (template
               .replace('{{image_input_instruction}}', '')
               .replace('{{project_brief}}', data['brief'])
               .replace('{{assets_instruction}}', assets_instruction)
               .replace('{{variants}}', str(len(folders)))
               .replace('{{variant_plural}}', '' if len(folders) == 1 else 's')
               .replace('{{variant_dirs}}', ', '.join(str(folder) for folder in folders)))

heading = ('Your assigned build directory is ' if len(folders) == 1
           else 'Your assigned build directories are ')
prompt = f'{heading}{", ".join(str(f) for f in folders)}. '
prompt += ('All project writes belong inside it.\n\n' if len(folders) == 1
           else 'All project writes belong inside them.\n\n')
prompt += base_prompt

for skill in preset['skills']:
    prompt += f"\nRead and apply {experiment['skills'][skill]}.\n"

urls = [f'http://localhost:4173/projects/{project_id}/builds/{folder_slug}/'
        f'{preset_id}/{v}/index.html' for v in variants]
if len(urls) == 1:
    prompt += f'\nThe gallery preview server is at http://localhost:4173. Your page is at {urls[0]}\n'
else:
    prompt += (f'\nThe gallery preview server is at http://localhost:4173. Your pages are at '
               + ' and '.join(urls) + '\n')

(project / 'runs').mkdir(exist_ok=True)
(project / 'runs' / f'{label}.prompt.md').write_text(prompt)
print(prompt)
