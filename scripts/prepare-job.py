"""Prepare Test project build directories and print the prompt for a T3 Code thread.

Usage:
  python3 scripts/prepare-job.py all-skills --variants 2
  python3 scripts/prepare-job.py all-skills --project test-2
  python3 scripts/prepare-job.py frontend-design-1

Composes the prompt from the experiment's basePrompt with the build root,
variant count, skills, tooling and preview base substituted. Copies the
project's inputs into each variant's assets folder. Writes the prompt to
projects/<project>/runs/<label>.prompt.md and prints it.
"""
import json
import shutil
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent

flags = {'--project': None, '--variants': None, '--model': None, '--brand': None}
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
experiment = data.get('experiment')
if not experiment:
    raise SystemExit(f"project '{project_id}' has no experiment block; the queue scripts need one")
model_id = flags['--model'] or experiment.get('model')
if not model_id:
    raise SystemExit('project.json has no experiment.model; pass --model')
folder_slug = experiment.get('folder') or model_id.split('/')[-1]
brand = flags['--brand'] or data.get('brand') or 'Demos'

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

build_root = project / 'builds' / folder_slug / preset_id
inputs = project / 'inputs'
for variant in variants:
    folder = build_root / str(variant)
    assets = folder / 'assets'
    assets.mkdir(parents=True, exist_ok=True)
    if inputs.is_dir():
        for asset in inputs.iterdir():
            shutil.copy2(asset, assets / asset.name)

has_assets = inputs.is_dir() and any(inputs.iterdir())
if has_assets:
    names = ', '.join(sorted(p.name for p in inputs.iterdir()))
    assets_instruction = f'Use the supplied assets at assets/: {names}.'
else:
    assets_instruction = 'Do not use any supplied image or photo assets.'

skill_paths = [experiment['skills'][skill] for skill in preset['skills']]
if len(skill_paths) == 1:
    skills_line = f'Skill: {skill_paths[0]}'
elif skill_paths:
    skills_line = 'Skills: ' + ', '.join(skill_paths)
else:
    skills_line = ''

tools_line = (
    f"Tools (in {root}): fonts/ — copy the families you use into each variant's assets/fonts; "
    'scripts/check.py --url <page> for console/404/overflow; scripts/shot.py --url <page> --full or '
    '--contact "css,selectors". Review at most 2 images (full page + contact sheet of changed sections); '
    "don't re-read unchanged shots. Playwright installed."
)
base_url = (f'http://localhost:5173/projects/{project_id}/builds/'
            f'{folder_slug}/{preset_id}')

template = (root / experiment['basePrompt']).read_text()
prompt = (template
          .replace('{{image_input_instruction}}', '')
          .replace('{{build_root}}', str(build_root))
          .replace('{{brand}}', brand)
          .replace('{{variants}}', str(len(variants)))
          .replace('{{variant_plural}}', '' if len(variants) == 1 else 's')
          .replace('{{variant_dirs}}', ', '.join(f'{v}/' for v in variants))
          .replace('{{assets_instruction}}', assets_instruction)
          .replace('{{project_brief}}', data['brief'])
          .replace('{{skills_line}}', skills_line)
          .replace('{{tools_line}}', tools_line)
          .replace('{{base_url}}', base_url))

(project / 'runs').mkdir(exist_ok=True)
(project / 'runs' / f'{label}.prompt.md').write_text(prompt)
print(prompt)
