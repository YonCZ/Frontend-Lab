Build root: {{build_root}}
Brand: {{brand}}
Create {{variants}} desktop-only variant{{variant_plural}} of a runnable frontend prototype for the brief below. Each variant goes in its number folder ({{variant_dirs}}) under that root. {{assets_instruction}}

## Toolchain

React and Vite, already set up in each variant folder. Write the page in src/, run `npx vite build`, and the entry becomes dist/index.html. Never run npm install; packages such as `motion` resolve from the workspace root. Put images in public/assets/ and reference them as assets/<name>.

## Project brief
{{project_brief}}

{{skills_line}}
{{tools_line}}
Preview: {{base_url}}/<N>/dist/index.html
