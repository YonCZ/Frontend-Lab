const icons = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-7h6v7"/>',
  folder:
    '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  palette:
    '<path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 1.6-3.2 1.5 1.5 0 0 1 1.2-2.4h1.2c2.1 0 3.5-1.6 3.5-3.7C21 6.9 17 3 12 3Z"/><path d="M7.5 12h.01M9.5 8h.01M14 7.5h.01M17 10.5h.01" stroke-width="2.7"/>',
  off: '<path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 1.6-3.2 1.5 1.5 0 0 1 1.2-2.4h1.2c2.1 0 3.5-1.6 3.5-3.7C21 6.9 17 3 12 3ZM3 21 21 3"/><path d="M7.5 12h.01M9.5 8h.01M14 7.5h.01M17 10.5h.01" stroke-width="2.5"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  external:
    '<path d="M13 5h6v6m0-6-9 9m0-8H6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
};

const $ = (selector, root = document) => root.querySelector(selector);
const app = $("#app");
const noSkill = "No skill";
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const segment = /^[a-zA-Z0-9_][a-zA-Z0-9_.-]*$/;
const unique = (values) => [...new Set(values)];
const text = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );

function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
}

function modelMark(model) {
  if (/claude|opus|sonnet|haiku|fable/i.test(model)) {
    return '<svg class="model-mark claude" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5M8 3l8 18M3 8l18 8M3 16l18-8M8 21l8-18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  }
  if (/sol|gemini/i.test(model))
    return '<span class="model-mark spark" aria-hidden="true"></span>';
  return `<span class="model-mark model-letter" aria-hidden="true">${text([...model][0]?.toUpperCase() || "?")}</span>`;
}

function filePath(projectId, relative) {
  if (
    typeof relative !== "string" ||
    !relative.split("/").every((part) => segment.test(part))
  )
    return null;
  return `projects/${projectId}/${relative}`;
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Could not read ${path}`);
  return response.json();
}

async function loadProject(id) {
  const config = await loadJson(`projects/${id}/project.json`);
  if (
    typeof config.name !== "string" ||
    !config.name.trim() ||
    !Array.isArray(config.builds)
  ) {
    throw new Error(`Invalid project manifest for ${id}`);
  }
  const toBuild = (build) => ({
    model: typeof build.model === "string" ? build.model.trim() : "",
    skill:
      typeof build.skill === "string" && build.skill.trim()
        ? build.skill.trim()
        : noSkill,
    variant: build.variant,
    entry: filePath(id, build.entry),
  });
  const builds = config.builds.map(toBuild);
  const specials = (Array.isArray(config.special) ? config.special : []).map(
    toBuild,
  );
  if (
    builds.some(
      (build) =>
        !build.model ||
        !build.entry ||
        !Number.isSafeInteger(build.variant) ||
        build.variant < 1,
    ) ||
    unique(
      builds.map((build) =>
        JSON.stringify([build.model, build.skill, build.variant]),
      ),
    ).length !== builds.length ||
    unique(builds.map((build) => build.entry)).length !== builds.length
  ) {
    throw new Error(`Invalid or duplicate build in ${id}`);
  }
  return {
    id,
    name: config.name.trim(),
    brief: typeof config.brief === "string" ? config.brief : "",
    demo: config.demo === true,
    cover: filePath(id, config.cover),
    builds: [...builds, ...specials],
    experiment: config.experiment ?? null,
  };
}

let projects = [];
let failedProjects = [];
let project;
let current;
let against;
let activeMenu = null;
let gallerySearch = "";
let promptPath = "prompts/frontend-base.md";
let sharedPrompt = "";

function plural(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function renderGallery() {
  document.title = "Frontend Lab";
  document.body.classList.remove("viewing");
  app.innerHTML = `
    <main class="gallery">
      <a class="skip" href="#projects-title">Skip to projects</a>
      <nav class="gallery-nav" aria-label="Workspace">
        <a class="nav-home" href="./" aria-label="Frontend Lab home" aria-current="page">${icon("home")}</a>
        <button type="button" data-action="workspace">${icon("folder")} Project files</button>
      </nav>
      <header class="intro">
        <h1>Frontend Lab</h1>
        <p>Browse your frontend projects and see how different models and skills approach the same brief.</p>
        <div class="intro-note intro-prompt">
          <div class="intro-prompt-head"><span>Shared prompt</span><a href="${text(promptPath)}" target="_blank" rel="noopener">${text(promptPath)} ${icon("external")}</a></div>
          <pre class="intro-prompt-body" tabindex="0" aria-label="Shared base prompt">${text(sharedPrompt.trim())}</pre>
        </div>
        <div class="intro-meta">
          <span>${icon("folder")} ${plural(projects.length, "project")}</span>
          <span>${icon("panel")} ${plural(
            projects.reduce((count, item) => count + item.builds.length, 0),
            "build",
          )}</span>
        </div>
      </header>
      <div class="toolbar">
        <label class="search">${icon("search")}<input type="search" id="project-search" aria-label="Search projects" placeholder="Search projects" value="${text(gallerySearch)}"><kbd aria-hidden="true">/</kbd></label>
        <button type="button" class="new-project" data-action="new-project">${icon("plus")} New project</button>
      </div>
      <section class="project-section" aria-labelledby="projects-title">
        <h2 id="projects-title" tabindex="-1">Projects</h2>
        <div class="project-grid" id="project-grid"></div>
        <p class="sr-only" id="gallery-status" role="status"></p>
        ${failedProjects.length ? `<p class="notice">Could not read ${text(failedProjects.join(", "))}. Check the project manifests.</p>` : ""}
      </section>
    </main>
    <dialog id="workspace-dialog" aria-labelledby="workspace-title">
      <div class="dialog-header"><h2 id="workspace-title">Add a project</h2><button type="button" class="icon-button" data-action="close-dialog" aria-label="Close">${icon("close")}</button></div>
      <p>Put each runnable build in its own folder under <code>projects/</code>. Add its entry file, model, skill, and variant to that project’s <code>project.json</code>.</p>
      <p>For a new project, add its folder name to <code>projects/catalog.json</code> and reload the gallery. The shared prompt at <code>${text(promptPath)}</code> is composed with each project’s brief before a build runs.</p>
      <a class="dialog-link" href="README.md" target="_blank" rel="noopener">Open workspace instructions ${icon("external")}</a>
    </dialog>`;
  renderCards();
}

function renderCards() {
  const search = gallerySearch.trim().toLowerCase();
  const visible = projects.filter((item) =>
    `${item.name} ${item.brief}`.toLowerCase().includes(search),
  );
  $("#project-grid").innerHTML =
    visible
      .map((item) => {
        const models = unique(item.builds.map((build) => build.model));
        return `<article class="project-card">
      <a href="?project=${encodeURIComponent(item.id)}" aria-label="Open ${text(item.name)}">
        <div class="project-cover">
          <span class="cover-fallback" ${item.cover ? "hidden" : ""}>${icon("folder")}</span>
          ${item.cover ? `<img src="${text(item.cover)}" alt="">` : ""}
          ${item.demo ? '<span class="sample"><span></span>Demo</span>' : ""}
        </div>
        <div class="card-body">
          <h3>${text(item.name)}</h3>
          <p>${item.experiment && !item.builds.length ? `${item.experiment.status === "draft" ? "Draft" : item.experiment.status === "running" ? "Generating" : "No builds ready"} <span aria-hidden="true">·</span> ${plural(item.experiment.presets.length, "preset")}` : `${plural(item.builds.length, "build")} <span aria-hidden="true">·</span> ${plural(models.length, "model")}`}</p>
          <span class="card-open">${icon("arrow")}</span>
        </div>
      </a>
    </article>`;
      })
      .join("") ||
    `<div class="empty-gallery"><h3>${search ? "No matching projects" : "No projects here yet"}</h3>
    <p>${search ? "Try a different project name or brief." : "Add a project folder to your workspace to see it here."}</p>
    <button type="button" data-action="${search ? "clear-search" : "workspace"}">${search ? "Clear search" : "Project files"}</button></div>`;
  $("#gallery-status").textContent = plural(visible.length, "matching project");
}

function stateFromLocation() {
  const query = new URLSearchParams(location.search);
  project = projects.find((item) => item.id === query.get("project"));
  current =
    project?.builds.find((build) => build.entry === query.get("build")) ??
    project?.builds[0];
  against = project?.builds.find(
    (build) => build !== current && build.entry === query.get("against"),
  );
  activeMenu = null;
  if (project) renderPreview();
  else renderGallery();
}

function buildLabel(build) {
  return `${build.model} / ${build.skill} / Variant ${build.variant}`;
}

function activeVariants() {
  return project.builds
    .filter(
      (build) => build.model === current.model && build.skill === current.skill,
    )
    .sort((first, second) => first.variant - second.variant);
}

function renderPreview() {
  document.title = `${project.name} · Frontend Lab`;
  document.body.classList.add("viewing");
  app.innerHTML = `
    <aside class="preview-tools" aria-label="Project controls">
      <nav class="rail" id="rail" aria-label="Preview tools"></nav>
      <section class="popover" id="popover" aria-label="Preview options" hidden></section>
    </aside>
    <main class="stage" id="stage" aria-label="${text(project.name)} preview">
      ${current ? `<h1 class="sr-only">${text(project.name)}</h1>` : ""}
    </main>`;
  renderRail();
  renderStage();
}

function railButton(action, label, contents, extra = "") {
  return `<button type="button" class="rail-control" data-action="${action}" title="${text(label)}" aria-label="${text(label)}" ${extra}>${contents}</button>`;
}

function renderRail() {
  const rail = $("#rail");
  rail.innerHTML = `
    <a class="rail-control" href="./" aria-label="Back to projects" title="Back to projects">${icon("home")}</a>
    <div class="rail-rule"></div>
    ${railButton("compare", "Compare builds", '<span class="versus">VS</span>', `aria-expanded="false" aria-controls="popover" ${against ? 'data-current="true"' : ""} ${project.builds.length < 2 ? "disabled" : ""}`)}
    <div class="rail-rule"></div>
    ${
      current
        ? `
      ${railButton("models", `Switch model (current: ${current.model})`, modelMark(current.model), 'aria-expanded="false" aria-controls="popover"')}
      ${railButton("skills", `Switch skill (current: ${current.skill})`, icon(current.skill === noSkill ? "off" : "palette"), 'aria-expanded="false" aria-controls="popover"')}
      <div class="rail-rule"></div>
      ${activeVariants()
        .map((build) =>
          railButton(
            "variant",
            `Variant ${build.variant}`,
            build.variant,
            `data-build="${project.builds.indexOf(build)}" ${build === current ? 'aria-current="true"' : ""}`,
          ),
        )
        .join("")}
      <div class="rail-rule"></div>`
        : ""
    }
    ${railButton("files", "Build files", icon("panel"), 'aria-expanded="false" aria-controls="popover"')}`;
}

function renderStage() {
  const stage = $("#stage");
  stage.toggleAttribute("data-comparing", Boolean(against));
  if (!current) {
    if (project.experiment) {
      const { model, runner, maxConcurrent, presets, basePrompt, status } = project.experiment;
      const total = presets.reduce((count, preset) => count + preset.variants, 0);
      const message = status === "running"
        ? `Running up to ${maxConcurrent} builds at a time. Reload to see ready builds.`
        : status === "draft"
          ? `This draft needs ${basePrompt ? "a shared project brief" : "the base prompt and a shared project brief"}.`
          : "Check the run results in the project folder.";
      stage.innerHTML = `<section class="empty-preview experiment-preview" aria-labelledby="experiment-title">
        <h1 id="experiment-title">${text(project.name)}</h1>
        <p>${status === "draft" ? "Draft" : status === "running" ? "Generating" : "No builds ready"} · ${plural(total, "planned build")} · ${text(model)} via ${text(runner === "opencode" ? "OpenCode" : runner)}</p>
        <p>${text(message)}</p>
        <ul class="experiment-presets">
          ${presets.map((preset) => `<li><strong>${text(preset.name)}</strong><span>${plural(preset.variants, "build")}</span>
            ${preset.focus ? `<p>${text(preset.focus)}</p>` : ""}</li>`).join("")}
        </ul>
        <button type="button" data-action="files">Project files</button>
      </section>`;
      return;
    }
    stage.innerHTML = `<div class="empty-preview"><h1>${text(project.name)}</h1><p>This project has no builds yet.</p><button type="button" data-action="files">Project files</button></div>`;
    return;
  }
  const builds = [current, against].filter(Boolean);
  const panes = [...stage.querySelectorAll(".preview-pane")];
  builds.forEach((build, index) => {
    let pane = panes[index];
    if (pane?.dataset.entry !== build.entry) {
      const next = document.createElement("div");
      next.className = "preview-pane";
      next.dataset.entry = build.entry;
      next.innerHTML = `<iframe src="${text(build.entry)}" title="${text(buildLabel(build))}"></iframe>`;
      const frame = $("iframe", next);
      frame.addEventListener("load", () => {
        frame.contentDocument?.addEventListener("keydown", keyboard);
        frame.contentDocument?.addEventListener("pointerdown", () =>
          closeMenu(),
        );
      });
      if (pane) pane.replaceWith(next);
      else stage.append(next);
      pane = next;
    }
    const label = $(".pane-label", pane);
    if (against && !label) {
      pane.insertAdjacentHTML(
        "beforeend",
        `<span class="pane-label">${text(buildLabel(build))}</span>`,
      );
    }
    if (!against) label?.remove();
  });
  panes.slice(builds.length).forEach((pane) => pane.remove());
}

function changeBuild(next, reference = against, focusAction) {
  if (next === reference) reference = undefined;
  if (next === current && reference === against) {
    closeMenu(true);
    return;
  }
  closeMenu();
  const oldCurrent = current;
  const oldReference = against;
  current = next;
  against = reference;
  const query = new URLSearchParams({ project: project.id });
  if (current !== project.builds[0]) query.set("build", current.entry);
  if (against) query.set("against", against.entry);
  history.replaceState(null, "", `?${query}`);
  renderRail();
  if (current !== oldCurrent || against !== oldReference) renderStage();
  if (focusAction === "variant")
    $(".rail-control[aria-current='true']")?.focus();
  else if (focusAction) $(`.rail [data-action="${focusAction}"]`)?.focus();
}

const menuNames = {
  models: "Switch model",
  skills: "Switch skill",
  compare: "Compare builds",
  files: "Build files",
};

function openMenu(menu) {
  if (activeMenu === menu) {
    closeMenu(true);
    return;
  }
  closeMenu();
  const popover = $("#popover");
  if (!popover) return;
  activeMenu = menu;
  popover.dataset.menu = menu;
  popover.setAttribute("aria-label", menuNames[menu]);
  const trigger = $(`.rail [data-action="${menu}"]`);
  trigger?.setAttribute("aria-expanded", "true");
  popover.hidden = false;
  if (menu === "models") {
    popover.innerHTML = `<label class="search model-search">${icon("search")}<input type="search" id="model-search" aria-label="Search models" placeholder="Search models"><kbd aria-hidden="true">${/Mac|iPhone/.test(navigator.platform) ? "⌘" : "Ctrl"} + K</kbd></label><div class="option-list" id="model-options"></div>`;
    renderModelOptions();
    $("#model-search").focus();
    return;
  }

  if (menu === "skills") {
    const allSkills = unique(project.builds.map((build) => build.skill));
    const skills = allSkills.includes(noSkill)
      ? [noSkill, ...allSkills.filter((skill) => skill !== noSkill)]
      : allSkills;
    popover.innerHTML = `<div class="option-list">${skills
      .map((skill) => {
        const target = chooseBuild(current.model, skill);
        const selected = skill === current.skill;
        return `<button class="option" type="button" data-pick="skills" ${target ? `data-build="${project.builds.indexOf(target)}"` : "disabled"} ${selected ? 'aria-current="true"' : ""}>
        <span class="option-icon">${icon(skill === noSkill ? "off" : "palette")}</span>
        <span>${text(skill === noSkill ? "Without skill" : `With ${skill}`)}${target ? "" : `<small>No ${text(current.model)} build</small>`}</span>
        ${selected ? `<span class="option-end">${icon("check")}</span>` : ""}
      </button>`;
      })
      .join("")}</div>`;
  } else if (menu === "compare") {
    popover.innerHTML = `<h2>Compare with</h2>
      ${against ? '<button type="button" class="option stop-compare" data-action="stop-compare">Return to single preview</button>' : ""}
      <div class="option-list">${project.builds
        .filter((build) => build !== current)
        .map(
          (build) => `
        <button class="option" type="button" data-pick="compare" data-build="${project.builds.indexOf(build)}" ${build === against ? 'aria-current="true"' : ""}>
          ${modelMark(build.model)}<span>${text(build.model)}<small>${text(build.skill)} · Variant ${build.variant}</small></span>
          ${build === against ? `<span class="option-end">${icon("check")}</span>` : ""}
        </button>`,
        )
        .join("")}</div>`;
  } else {
    const manifest = `projects/${project.id}/project.json`;
    popover.innerHTML = `<div class="file-details">
      <h2>${text(project.name)}</h2>
      ${project.brief ? `<p>${text(project.brief)}</p>` : ""}
      <span class="file-caption">${current ? "Build entry" : "Project manifest"}</span>
      <code>${text(current?.entry ?? manifest)}</code>
      <div class="file-actions">
        <button type="button" class="soft-button" data-action="copy-path">${icon("copy")} Copy path</button>
        ${current ? `<a class="soft-button" href="${text(current.entry)}" target="_blank" rel="noopener">${icon("external")} Open build</a>` : ""}
      </div>
      <p class="sr-only" id="copy-status" role="status"></p>
    </div>`;
  }
  (
    $("button[aria-current='true']", popover) ??
    $("button:not([disabled]), a[href]", popover)
  )?.focus({ preventScroll: true });
}

function closeMenu(restoreFocus = false) {
  if (!activeMenu) return;
  const trigger = $(`.rail [data-action="${activeMenu}"]`);
  trigger?.setAttribute("aria-expanded", "false");
  const popover = $("#popover");
  if (popover) popover.hidden = true;
  activeMenu = null;
  if (restoreFocus) trigger?.focus();
}

function chooseBuild(model, skill) {
  const choices = project.builds
    .filter((build) => build.model === model && build.skill === skill)
    .sort((first, second) => first.variant - second.variant);
  return (
    choices.find((build) => build.variant === current.variant) ?? choices[0]
  );
}

function renderModelOptions() {
  const query = $("#model-search").value.trim().toLowerCase();
  const models = unique(project.builds.map((build) => build.model)).filter(
    (model) => model.toLowerCase().includes(query),
  );
  $("#model-options").innerHTML =
    models
      .map((model, index) => {
        const selected = model === current.model;
        const firstSkill = project.builds.find(
          (build) => build.model === model,
        ).skill;
        const target =
          chooseBuild(model, current.skill) ?? chooseBuild(model, firstSkill);
        return `<button type="button" class="option" data-pick="models" data-build="${project.builds.indexOf(target)}" ${selected ? 'aria-current="true"' : ""}>
      ${modelMark(model)}<span>${text(model)}</span>
      ${index === 0 ? '<kbd class="option-end" aria-hidden="true">Enter</kbd>' : selected ? `<span class="option-end">${icon("check")}</span>` : ""}
    </button>`;
      })
      .join("") || '<p class="no-options">No models match that search.</p>';
}

function keyboard(event) {
  if (event.defaultPrevented) return;
  if (event.key === "Escape" && activeMenu) {
    event.preventDefault();
    closeMenu(true);
    return;
  }
  if (
    project &&
    current &&
    event.key.toLowerCase() === "k" &&
    (event.metaKey || event.ctrlKey) &&
    !event.altKey
  ) {
    event.preventDefault();
    if (activeMenu === "models") $("#model-search").focus();
    else openMenu("models");
    return;
  }
  if (
    event.target.id === "model-search" &&
    ["Enter", "ArrowDown", "ArrowUp"].includes(event.key)
  ) {
    event.preventDefault();
    const options = [...document.querySelectorAll("#model-options .option")];
    if (event.key === "Enter") options[0]?.click();
    else options[event.key === "ArrowDown" ? 0 : options.length - 1]?.focus();
    return;
  }
  if (
    activeMenu &&
    event.target.matches?.(".option") &&
    ["ArrowDown", "ArrowUp"].includes(event.key)
  ) {
    event.preventDefault();
    const options = [
      ...document.querySelectorAll("#popover .option:not([disabled])"),
    ];
    const index =
      options.indexOf(event.target) + (event.key === "ArrowDown" ? 1 : -1);
    const next =
      options[index] ??
      (activeMenu === "models"
        ? $("#model-search")
        : options.at(index === -1 ? -1 : 0));
    next?.focus();
    return;
  }
  if (
    !project &&
    event.key === "/" &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.target.closest?.("input, textarea, select, [contenteditable]") &&
    !$("dialog[open]")
  ) {
    event.preventDefault();
    $("#project-search")?.focus();
  }
}

app.addEventListener("input", (event) => {
  if (event.target.id === "project-search") {
    gallerySearch = event.target.value;
    renderCards();
  }
  if (event.target.id === "model-search") renderModelOptions();
});

app.addEventListener(
  "error",
  (event) => {
    if (!event.target.matches?.(".project-cover img")) return;
    event.target.hidden = true;
    $(".cover-fallback", event.target.parentElement).hidden = false;
  },
  true,
);

app.addEventListener("click", async (event) => {
  const pick = event.target.closest("[data-pick]");
  if (pick) {
    const next = project.builds[Number(pick.dataset.build)];
    if (pick.dataset.pick === "compare") changeBuild(current, next, "compare");
    else changeBuild(next, against, pick.dataset.pick);
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action } = button.dataset;
  if (Object.hasOwn(menuNames, action)) openMenu(action);
  if (action === "variant")
    changeBuild(
      project.builds[Number(button.dataset.build)],
      against,
      "variant",
    );
  if (action === "stop-compare") changeBuild(current, null, "compare");
  if (action === "workspace" || action === "new-project") $("#workspace-dialog").showModal();
  if (action === "close-dialog") button.closest("dialog").close();
  if (action === "clear-search") {
    gallerySearch = "";
    $("#project-search").value = "";
    renderCards();
    $("#project-search").focus();
  }
  if (action === "copy-path") {
    const path = current?.entry ?? `projects/${project.id}/project.json`;
    const status = $("#copy-status");
    const pathLabel = $("#popover code");
    try {
      await navigator.clipboard.writeText(path);
      button.innerHTML = `${icon("check")} Copied`;
      status.textContent = "Path copied.";
    } catch {
      status.textContent =
        "Copy unavailable. Select the path above to copy it.";
      if (!pathLabel.isConnected || $("#popover").hidden) return;
      const range = document.createRange();
      range.selectNodeContents(pathLabel);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  }
});

document.addEventListener("pointerdown", (event) => {
  if (activeMenu && !event.target.closest(".preview-tools")) closeMenu();
});
document.addEventListener("keydown", keyboard);
window.addEventListener("popstate", stateFromLocation);

try {
  const ids = await loadJson("projects/catalog.json");
  if (
    !Array.isArray(ids) ||
    ids.some((id) => typeof id !== "string" || !slug.test(id)) ||
    unique(ids).length !== ids.length
  ) {
    throw new Error("Invalid project catalog");
  }
  const results = await Promise.allSettled(ids.map(loadProject));
  results.forEach((result, index) => {
    if (result.status === "fulfilled") projects.push(result.value);
    else failedProjects.push(ids[index]);
  });
  const configured = projects.find(
    (item) => item.experiment?.basePrompt,
  )?.experiment.basePrompt;
  if (typeof configured === "string") promptPath = configured;
  try {
    const response = await fetch(promptPath, { cache: "no-store" });
    if (response.ok) sharedPrompt = await response.text();
  } catch {
    sharedPrompt = "";
  }
  stateFromLocation();
} catch {
  app.innerHTML =
    '<main class="gallery"><h1>Frontend Lab</h1><p>Could not load the project catalog. Serve the workspace locally and check <code>projects/catalog.json</code>.</p></main>';
}
