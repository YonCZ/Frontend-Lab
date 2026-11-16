/* Frontend Lab — local build browser.
   Shared behaviour for all three design variants. */

const ROOT = "../../../../../";

const trioBuilds = [
  { model: "DeepSeek V4.1 Flash", skill: "Design", variant: 1, entry: "builds/deepseek/design-taste/1/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design", variant: 2, entry: "builds/deepseek/design-taste/2/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design", variant: 3, entry: "builds/deepseek/design-taste/3/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design", variant: 4, entry: "builds/deepseek/design-taste/4/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design", variant: 5, entry: "builds/deepseek/design-taste/5/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design", variant: 1, entry: "builds/sol6/apple-sol/1/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design", variant: 2, entry: "builds/sol6/apple-sol/2/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design", variant: 3, entry: "builds/sol6/apple-sol/3/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 1, entry: "builds/deepseek/apple-design/1/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 2, entry: "builds/deepseek/apple-design/2/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 3, entry: "builds/deepseek/apple-design/3/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 4, entry: "builds/deepseek/apple-design/4/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 5, entry: "builds/deepseek/apple-design/5/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 1, entry: "builds/deepseek/apple-design-plus/1/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 2, entry: "builds/deepseek/apple-design-plus/2/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 3, entry: "builds/deepseek/apple-design-plus/3/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 4, entry: "builds/deepseek/apple-design-plus/4/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 5, entry: "builds/deepseek/apple-design-plus/5/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design +", variant: 1, entry: "builds/sol6/apple-plus-sol/1/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design +", variant: 2, entry: "builds/sol6/apple-plus-sol/2/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design +", variant: 3, entry: "builds/sol6/apple-plus-sol/3/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design +", variant: 6, entry: "builds/sol6/apple-plus-special/6/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design +", variant: 7, entry: "builds/sol6/apple-plus-special/7/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design +", variant: 8, entry: "builds/sol6/apple-plus-liked/8/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design +", variant: 9, entry: "builds/sol6/apple-plus-liked/9/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 6, entry: "builds/deepseek/ds-apple-special/6/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 7, entry: "builds/deepseek/ds-apple-special/7/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 8, entry: "builds/deepseek/ds-apple-liked/8/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 9, entry: "builds/deepseek/ds-apple-liked/9/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design +", variant: 4, entry: "builds/sol6/apple-plus-cairn/4/dist/index.html" },
  { model: "GPT Sol 6.1 High", skill: "Apple Design +", variant: 5, entry: "builds/sol6/apple-plus-cairn/5/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 6, entry: "builds/deepseek/apple-design/6/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 7, entry: "builds/deepseek/apple-design/7/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 8, entry: "builds/deepseek/apple-design/8/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 9, entry: "builds/deepseek/apple-design/9/dist/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 10, entry: "builds/deepseek/apple-design/10/dist/index.html" }
];

const demoBuilds = [
  { model: "DeepSeek V4.1 Flash", skill: "No skill", variant: 1, entry: "1/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "No skill", variant: 2, entry: "2/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "No skill", variant: 3, entry: "3/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design", variant: 1, entry: "design/1/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design", variant: 2, entry: "design/2/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 1, entry: "apple-design/1/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design", variant: 3, entry: "apple-design/3/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 1, entry: "apple-design-plus/1/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 2, entry: "apple-design-plus/2/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Apple Design +", variant: 3, entry: "apple-design-plus/3/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design + Taste + Motion", variant: 1, entry: "design-taste-motion/1/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design + Taste + Motion", variant: 2, entry: "design-taste-motion/2/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design + Taste + Motion", variant: 3, entry: "design-taste-motion/3/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design + Taste + Apple + Motion", variant: 1, entry: "design-taste-apple-motion/1/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design + Taste + Apple + Motion", variant: 2, entry: "design-taste-apple-motion/2/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "Design + Taste + Apple + Motion", variant: 3, entry: "design-taste-apple-motion/3/index.html" }
];

const testBuilds = [
  { model: "DeepSeek V4.1 Flash", skill: "No skill", variant: 1, entry: "builds/deepseek/no-skill/1/index.html" },
  { model: "DeepSeek V4.1 Flash", skill: "No skill", variant: 2, entry: "builds/deepseek/no-skill/2/index.html" },
  { model: "Kimi K3", skill: "No skill", variant: 1, entry: "builds/kimi-k3/no-skill/1/index.html" },
  { model: "Kimi K3", skill: "Apple Design", variant: 1, entry: "builds/kimi-k3/apple-design/1/index.html" }
];

const projectMeta = [
  {
    id: "trio",
    name: "Project Trio",
    initial: "T",
    line: "A Czech travel agency site with a trip listing, detail pages, seat booking and a hidden admin area.",
    brief: `CA Trio is a Czech travel agency in Moravské Budějovice. It sells day trips (Advent trips, musicals and theatre, thermal spas), one Greece package stay, and stays through partner agencies.

Build a multi-page site that turns a visitor into a booking. Pages: landing, trip listing with filters, trip detail, booking with seat selection, contact and cancellation terms, and a hidden admin area.

Listing: filter by category, month, availability and price. Each trip page answers what happens, what is included, what it costs, and where it leaves from.

Booking: choose a departure point, then pick seats on a bus plan. Seats already taken show as unavailable.

Seat map: a bus with 2+2 seating and an aisle, plus a back row of 5 seats. Admin sets the seat count per trip.

Admin: a route behind a passphrase. Create a trip and edit its name, price, dates, departure points, seat count, description, included and excluded items, and images. See bookings per trip, mark a trip sold out, unpublish it.

Czech and English both ship. Czech is primary, the switch keeps the visitor on the same page.

Architecture is yours, Design is open. Do not copy the old site.`,
    builds: trioBuilds,
    prefix: "trio/"
  },
  {
    id: "demo",
    name: "Project Demo",
    initial: "D",
    line: "A landing page for a note-taking app, iterated three times with a switcher.",
    brief: `Design the landing page for a note-taking application as essentially a second brain, in three iterations with a switcher.

The switcher changes the version in place. No backend, no stock photography, no external network calls.`,
    builds: demoBuilds,
    prefix: "demo/"
  },
  {
    id: "test-1",
    name: "Project Test 1",
    initial: "1",
    line: "Layout experiments on the same content.",
    brief: `Layout experiments. Four builds testing grid, density and hierarchy on the same content.

Same inputs, different structure. The builds share no design system: the comparison is the point. Scan the list to see how each one handles the first screen and the page rhythm.`,
    builds: testBuilds,
    prefix: "test-1/"
  }
];

const projects = projectMeta.map((project) => {
  const builds = project.builds.map((build) => ({
    ...build,
    src: ROOT + project.prefix + build.entry,
    path: "projects/" + project.prefix + build.entry
  }));
  return {
    ...project,
    builds,
    models: [...new Set(builds.map((build) => build.model))],
    skills: [...new Set(builds.map((build) => build.skill))]
  };
});

const totalBuilds = projects.reduce((sum, project) => sum + project.builds.length, 0);

const state = {
  projectId: null,
  build: 0,
  against: null,
  query: "",
  expanded: false,
  inspectorId: projects[0].id,
  overlayOpen: false
};

const app = document.getElementById("app");
const live = document.getElementById("live");
const overlay = document.getElementById("overlay");
const overlayStage = document.getElementById("overlay-stage");
const overlayTitle = document.getElementById("overlay-title");
const overlayFull = document.getElementById("full-toggle");
const overlayClose = document.getElementById("close-overlay");
let lastFocus = null;

const pad = (value) => String(value).padStart(2, "0");

function esc(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

function plural(count, noun) {
  return `${pad(count)} ${noun}${count === 1 ? "" : "s"}`;
}

function mark(model) {
  if (model.startsWith("DeepSeek")) return "DS";
  if (model.startsWith("GPT Sol")) return "GS";
  if (model.startsWith("Kimi")) return "KK";
  return model.slice(0, 2).toUpperCase();
}

function currentProject() {
  return projects.find((project) => project.id === state.projectId) || null;
}

function currentBuild() {
  const project = currentProject();
  return project ? project.builds[state.build] || null : null;
}

function againstBuild() {
  const project = currentProject();
  return project && state.against !== null ? project.builds[state.against] || null : null;
}

function modelList(models) {
  return models
    .map((model) => `<span class="model"><span class="mark mono" aria-hidden="true">${mark(model)}</span><span class="model-name">${esc(model)}</span></span>`)
    .join("");
}

function buildLabel(build) {
  return `${build.model}, ${build.skill}, variant ${build.variant}`;
}

function readUrl() {
  const params = new URLSearchParams(location.search);
  const requested = params.get("project");
  const project = projects.find((item) => item.id === requested) || null;
  state.projectId = project ? project.id : null;
  state.build = 0;
  state.against = null;
  state.expanded = false;
  state.query = "";

  if (project) {
    const build = Number(params.get("build"));
    if (Number.isInteger(build) && build >= 0 && build < project.builds.length) state.build = build;
    const against = Number(params.get("against"));
    if (Number.isInteger(against) && against >= 0 && against < project.builds.length && against !== state.build) {
      state.against = against;
    }
  } else {
    const inspector = params.get("inspect");
    state.inspectorId = projects.some((item) => item.id === inspector) ? inspector : projects[0].id;
  }
}

function writeUrl(mode) {
  if (!state.projectId) {
    history.replaceState(null, "", location.pathname);
    return;
  }
  const params = new URLSearchParams();
  params.set("project", state.projectId);
  params.set("build", String(state.build));
  if (state.against !== null) params.set("against", String(state.against));
  const url = `${location.pathname}?${params.toString()}`;
  if (mode === "push") history.pushState(null, "", url);
  else history.replaceState(null, "", url);
}

function syncMenu() {
  const active = state.overlayOpen ? "preview" : state.projectId ? "project" : "library";
  document.querySelectorAll("[data-nav]").forEach((item) => {
    const isActive = item.dataset.nav === active;
    item.classList.toggle("is-active", isActive);
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  const previewButton = document.getElementById("menu-preview");
  const hasBuild = Boolean(currentBuild());
  previewButton.disabled = !hasBuild;
  previewButton.title = hasBuild ? "Open the selected build in a preview" : "Open a project first";

  const variant = (location.pathname.match(/apple-design\/([123])\//) || [])[1] || "1";
  document.querySelectorAll("[data-variant]").forEach((item) => {
    const isCurrent = item.dataset.variant === variant;
    item.classList.toggle("is-current", isCurrent);
    if (isCurrent) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
}

function renderLibrary() {
  const countText = `${pad(projects.length)} / ${pad(projects.length)} projects · ${pad(totalBuilds)} / ${pad(totalBuilds)} builds`;
  app.innerHTML = `
    <section class="library" aria-labelledby="library-title">
      <header class="library-head">
        <div class="head-top">
          <p class="eyebrow">Library</p>
          <p class="head-count mono" id="lib-count">${countText}</p>
        </div>
        <div class="head-main">
          <div class="head-copy">
            <h1 id="library-title">Projects</h1>
            <p class="lede">One brief, many builds. Scan the folder, open a project, put two builds side by side.</p>
          </div>
          <label class="search-field">
            <span class="search-label mono">Search</span>
            <span class="search-box">
              <input id="search" type="search" placeholder="Project or model" aria-label="Search projects by name or model" autocomplete="off" spellcheck="false" value="${esc(state.query)}">
              <kbd class="mono" aria-hidden="true">/</kbd>
            </span>
          </label>
        </div>
      </header>
      <div class="library-body">
        <div class="project-table">
          <div class="table-head" aria-hidden="true">
            <span class="col-index">No.</span>
            <span class="col-cover"></span>
            <span>Project</span>
            <span>Brief</span>
            <span>Models</span>
            <span class="col-builds">Builds</span>
          </div>
          <ol class="project-list" id="project-list">
            ${projects.map((project, index) => `
              <li class="project-item" data-project-row="${project.id}">
                <a class="project-entry" href="?project=${project.id}" data-project="${project.id}" aria-label="${esc(project.name)}, ${project.builds.length} builds">
                  <span class="project-index mono">${pad(index + 1)}</span>
                  <span class="project-cover" data-index="${pad(index + 1)}" data-builds="${project.builds.length}" aria-hidden="true"><span class="cover-letter">${project.initial}</span></span>
                  <span class="project-name">${esc(project.name)}</span>
                  <span class="project-brief">${esc(project.line)}</span>
                  <span class="project-models">${modelList(project.models)}</span>
                  <span class="project-builds mono">${project.builds.length}</span>
                </a>
              </li>
            `).join("")}
          </ol>
          <div class="empty" id="empty" hidden>
            <p class="eyebrow">No match</p>
            <p class="empty-line" id="empty-line">No project matches that search.</p>
            <button type="button" class="text-button" id="clear-search">Clear search</button>
          </div>
          <p class="table-foot mono" id="table-foot">${pad(projects.length)} projects / ${pad(totalBuilds)} builds / local folder</p>
        </div>
        <aside class="library-inspector" id="library-inspector" aria-label="Project details"></aside>
      </div>
    </section>
  `;

  const search = document.getElementById("search");
  search.addEventListener("input", () => {
    state.query = search.value;
    applyFilter();
  });
  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && search.value) {
      event.preventDefault();
      search.value = "";
      state.query = "";
      applyFilter();
    }
  });
  document.getElementById("clear-search").addEventListener("click", () => {
    state.query = "";
    search.value = "";
    applyFilter();
    search.focus();
  });

  app.querySelectorAll("[data-project-row]").forEach((row) => {
    const entry = row.querySelector(".project-entry");
    const show = () => setInspector(row.dataset.projectRow);
    row.addEventListener("mouseenter", show);
    entry.addEventListener("focus", show);
  });

  setInspector(state.inspectorId);
  applyFilter(false);
}

function applyFilter(announce = true) {
  const query = state.query.trim().toLowerCase();
  const visible = projects.filter((project) => `${project.name} ${project.models.join(" ")}`.toLowerCase().includes(query));
  const visibleIds = new Set(visible.map((project) => project.id));
  const visibleBuilds = visible.reduce((sum, project) => sum + project.builds.length, 0);

  app.querySelectorAll("[data-project-row]").forEach((row) => {
    row.hidden = !visibleIds.has(row.dataset.projectRow);
  });

  const empty = document.getElementById("empty");
  empty.hidden = visible.length !== 0;
  document.getElementById("empty-line").textContent = query
    ? `No project matches “${state.query.trim()}”.`
    : "No projects found.";

  document.getElementById("lib-count").textContent =
    `${pad(visible.length)} / ${pad(projects.length)} projects · ${pad(visibleBuilds)} / ${pad(totalBuilds)} builds`;
  document.getElementById("table-foot").textContent =
    `${pad(visible.length)} of ${pad(projects.length)} projects / ${pad(visibleBuilds)} builds`;

  if (visible.length) {
    if (!visibleIds.has(state.inspectorId)) setInspector(visible[0].id);
    else setInspector(state.inspectorId);
  }

  const inspector = document.getElementById("library-inspector");
  if (inspector) inspector.hidden = visible.length === 0;

  if (announce) {
    live.textContent = query
      ? `${visible.length} of ${projects.length} projects match ${state.query.trim()}.`
      : `All ${projects.length} projects shown.`;
  }
}

function setInspector(id) {
  const project = projects.find((item) => item.id === id);
  const inspector = document.getElementById("library-inspector");
  if (!project || !inspector) return;
  state.inspectorId = id;
  inspector.innerHTML = `
    <div class="inspector-inner">
      <div class="inspector-cover" aria-hidden="true"><span>${project.initial}</span></div>
      <p class="eyebrow">Project / ${pad(projects.indexOf(project) + 1)}</p>
      <h2>${esc(project.name)}</h2>
      <p class="inspector-line">${esc(project.line)}</p>
      <dl class="inspector-stats">
        <div><dt class="mono">Builds</dt><dd class="mono">${project.builds.length}</dd></div>
        <div><dt class="mono">Models</dt><dd class="mono">${project.models.length}</dd></div>
        <div><dt class="mono">Skills</dt><dd class="mono">${project.skills.length}</dd></div>
      </dl>
      <div class="inspector-models">${modelList(project.models)}</div>
      <a class="text-button inspector-open" href="?project=${project.id}" data-project="${project.id}">Open project</a>
    </div>
  `;
}

function briefMarkup(project) {
  return `
    <div class="brief-block">
      <div class="brief-head">
        <p class="eyebrow">Brief</p>
        <button type="button" class="text-button brief-toggle" id="brief-toggle" aria-expanded="${state.expanded}" aria-controls="brief">${state.expanded ? "Collapse" : "Expand brief"}</button>
      </div>
      <div class="brief-text${state.expanded ? " is-open" : ""}" id="brief">${project.brief.split(/\n\n+/).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</div>
    </div>
  `;
}

function buildRow(build, index) {
  const isSelected = index === state.build;
  const isPinned = index === state.against;
  return `
    <li class="build-item${isSelected ? " is-selected" : ""}${isPinned ? " is-pinned" : ""}" data-build-row="${index}">
      <button type="button" class="build-select" data-select="${index}" aria-current="${isSelected}" aria-label="Select ${esc(buildLabel(build))}"></button>
      <span class="build-index mono">${pad(index + 1)}</span>
      <span class="build-thumb" aria-hidden="true"><span class="thumb-var mono">V${build.variant}</span><span class="thumb-mark mono">${mark(build.model)}</span></span>
      <span class="build-model"><span class="mark mono" aria-hidden="true">${mark(build.model)}</span><span>${esc(build.model)}</span></span>
      <span class="build-skill">${esc(build.skill)}</span>
      <span class="build-var mono">V${build.variant}</span>
      <span class="build-entry mono">${esc(build.path)}</span>
      <button type="button" class="build-pin" data-pin="${index}" aria-pressed="${isPinned}" ${isSelected ? "disabled" : ""} aria-label="Pin build ${pad(index + 1)} for comparison">${isPinned ? "Pinned" : "Pin"}</button>
    </li>
  `;
}

function renderProject() {
  const project = currentProject();
  if (!project) {
    renderLibrary();
    return;
  }
  const selectedBuild = project.builds[state.build];
  app.innerHTML = `
    <section class="project-page" aria-labelledby="project-title">
      <header class="project-head">
        <nav class="crumbs mono" aria-label="Breadcrumb">
          <a href="./">Library</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${esc(project.name)}</span>
        </nav>
        <div class="project-title">
          <span class="project-cover project-cover-lg" aria-hidden="true"><span class="cover-letter">${project.initial}</span></span>
          <div class="project-title-text">
            <h1 id="project-title">${esc(project.name)}</h1>
            <p class="project-meta mono">${plural(project.builds.length, "build")} / ${plural(project.models.length, "model")} / ${plural(project.skills.length, "skill")}</p>
          </div>
        </div>
        ${briefMarkup(project)}
        <div class="selected-file">
          <p class="eyebrow">Selected file</p>
          <p class="selected-path mono" id="selected-file">${esc(selectedBuild.path)}</p>
          <p class="selected-meta mono" id="selected-file-meta">${esc(selectedBuild.model)} / ${esc(selectedBuild.skill)} / V${selectedBuild.variant}</p>
        </div>
      </header>
      <div class="project-body">
        <section class="stage-wrap" aria-label="Build viewer">
          <div class="stage-bar" id="stage-bar"></div>
          <div class="stage" id="stage"></div>
        </section>
        <section class="builds" aria-labelledby="builds-title">
          <div class="builds-head">
            <h2 id="builds-title">Builds</h2>
            <p class="mono" id="builds-count">${pad(project.builds.length)} / ${pad(project.builds.length)}</p>
          </div>
          <div class="build-columns" aria-hidden="true">
            <span>No.</span>
            <span>Model</span>
            <span>Skill</span>
            <span>Var.</span>
            <span>Entry</span>
            <span>Pin</span>
          </div>
          <ol class="build-list" id="build-list">
            ${project.builds.map(buildRow).join("")}
          </ol>
        </section>
        <aside class="project-rail" id="project-rail" aria-label="Selection details"></aside>
      </div>
    </section>
  `;

  document.getElementById("brief-toggle").addEventListener("click", () => {
    state.expanded = !state.expanded;
    const brief = document.getElementById("brief");
    const toggle = document.getElementById("brief-toggle");
    brief.classList.toggle("is-open", state.expanded);
    toggle.setAttribute("aria-expanded", String(state.expanded));
    toggle.textContent = state.expanded ? "Collapse" : "Expand brief";
  });

  updateSelection(false);
}

function stageBarMarkup(project) {
  const selected = project.builds[state.build];
  const pinned = againstBuild();
  if (!selected) return "";
  return `
    <div class="stage-meta">
      <span class="mark mono" aria-hidden="true">${mark(selected.model)}</span>
      <span class="stage-model">${esc(selected.model)}</span>
      <span class="stage-skill">${esc(selected.skill)}</span>
      <span class="mono">V${selected.variant}</span>
      ${pinned ? `<span class="compare-flag mono">comparing</span>` : ""}
    </div>
    <div class="stage-tools">
      ${pinned ? `<button type="button" class="text-button" data-unpin>Unpin build ${pad(state.against + 1)}</button>` : ""}
      <button type="button" class="text-button stage-open" id="open-overlay">Open preview</button>
    </div>
  `;
}

function stageMarkup(project) {
  const selected = project.builds[state.build];
  const pinned = againstBuild();
  if (!selected) return `<div class="stage-empty"><p>This project has no builds.</p></div>`;
  if (!pinned) {
    return `
      <div class="pane pane-single">
        <iframe src="${esc(selected.src)}" title="${esc(buildLabel(selected))}" tabindex="-1" loading="eager"></iframe>
      </div>
    `;
  }
  return `
    <div class="pane">
      <div class="pane-head">
        <span class="pane-flag mono">A · Selected</span>
        <span class="pane-name">${esc(selected.model)}</span>
        <span class="pane-sub">${esc(selected.skill)} / V${selected.variant}</span>
      </div>
      <iframe src="${esc(selected.src)}" title="${esc(buildLabel(selected))}" tabindex="-1" loading="eager"></iframe>
    </div>
    <div class="pane">
      <div class="pane-head">
        <span class="pane-flag mono">B · Pinned</span>
        <span class="pane-name">${esc(pinned.model)}</span>
        <span class="pane-sub">${esc(pinned.skill)} / V${pinned.variant}</span>
      </div>
      <iframe src="${esc(pinned.src)}" title="${esc(buildLabel(pinned))}" tabindex="-1" loading="eager"></iframe>
    </div>
  `;
}

function railMarkup(project) {
  const selected = project.builds[state.build];
  const pinned = againstBuild();
  if (!selected) return "";
  return `
    <div class="rail-block">
      <p class="eyebrow">Selected</p>
      <h2>${esc(selected.model)}</h2>
      <p class="rail-sub">${esc(selected.skill)} / Variant ${selected.variant}</p>
      <dl class="rail-stats">
        <div><dt class="mono">Build</dt><dd class="mono">${pad(state.build + 1)} / ${pad(project.builds.length)}</dd></div>
        <div><dt class="mono">Model</dt><dd class="mono">${mark(selected.model)}</dd></div>
        <div><dt class="mono">Entry</dt><dd class="mono rail-path">${esc(selected.path)}</dd></div>
      </dl>
      <button type="button" class="button-primary" id="rail-open">Open preview</button>
    </div>
    <div class="rail-block">
      <p class="eyebrow">Compare</p>
      ${pinned ? `
        <p class="rail-pinned">${esc(pinned.model)}</p>
        <p class="rail-sub">${esc(pinned.skill)} / Variant ${pinned.variant}</p>
        <button type="button" class="text-button" data-unpin>Drop pinned build</button>
      ` : `
        <p class="rail-copy">Pin a second build to place it beside the selected one. The pinned build stays when you change selection.</p>
      `}
    </div>
    <div class="rail-block rail-keys">
      <p class="eyebrow">Keys</p>
      <dl>
        <div><dt class="mono">/</dt><dd>Search library</dd></div>
        <div><dt class="mono">Esc</dt><dd>Close preview</dd></div>
        <div><dt class="mono">Tab</dt><dd>Move through controls</dd></div>
      </dl>
    </div>
  `;
}

function updateSelection(announce = true) {
  const project = currentProject();
  if (!project) return;
  const selected = project.builds[state.build];
  const pinned = againstBuild();

  app.querySelectorAll("[data-build-row]").forEach((row) => {
    const index = Number(row.dataset.buildRow);
    row.classList.toggle("is-selected", index === state.build);
    row.classList.toggle("is-pinned", index === state.against);
    const button = row.querySelector(".build-select");
    button.setAttribute("aria-current", String(index === state.build));
    const pin = row.querySelector(".build-pin");
    pin.disabled = index === state.build;
    pin.setAttribute("aria-pressed", String(index === state.against));
    pin.textContent = index === state.against ? "Pinned" : "Pin";
  });

  const stage = document.getElementById("stage");
  if (stage) {
    stage.dataset.compare = pinned ? "true" : "false";
    stage.innerHTML = stageMarkup(project);
    bindFrameKeys(stage);
  }
  const bar = document.getElementById("stage-bar");
  if (bar) bar.innerHTML = stageBarMarkup(project);
  const rail = document.getElementById("project-rail");
  if (rail) rail.innerHTML = railMarkup(project);

  const selectedFile = document.getElementById("selected-file");
  const selectedMeta = document.getElementById("selected-file-meta");
  if (selected && selectedFile) selectedFile.textContent = selected.path;
  if (selected && selectedMeta) selectedMeta.textContent = `${selected.model} / ${selected.skill} / V${selected.variant}`;

  syncMenu();
  if (announce && selected) live.textContent = `Selected ${buildLabel(selected)}.`;
}

function selectBuild(index) {
  const project = currentProject();
  if (!project || !project.builds[index]) return;
  state.build = index;
  if (state.against === index) state.against = null;
  writeUrl("replace");
  updateSelection();
  revealStage();
}

function togglePin(index) {
  const project = currentProject();
  if (!project || !project.builds[index] || index === state.build) return;
  state.against = state.against === index ? null : index;
  writeUrl("replace");
  updateSelection();
  revealStage();
  live.textContent = state.against === null ? "Comparison build dropped." : `Pinned ${buildLabel(project.builds[index])}.`;
}

function revealStage() {
  const stage = document.querySelector(".stage-wrap");
  const bar = document.querySelector(".menubar");
  if (!stage) return;
  const barHeight = bar ? bar.getBoundingClientRect().height : 0;
  const rect = stage.getBoundingClientRect();
  if (rect.top >= barHeight && rect.bottom <= window.innerHeight) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: Math.max(0, window.scrollY + rect.top - barHeight - 10),
    behavior: reduced ? "auto" : "smooth"
  });
}

function bindFrameKeys(root) {
  if (!root) return;
  root.querySelectorAll("iframe").forEach((frame) => {
    const bind = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc || doc.__labEscape) return;
        doc.__labEscape = true;
        doc.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && overlay.open) {
            event.preventDefault();
            closeOverlay();
          }
        }, true);
      } catch (error) {
        /* A cross-origin build keeps its own key handling. */
      }
    };
    frame.addEventListener("load", bind);
    bind();
  });
}

function goProject(id, push = true) {
  if (!projects.some((project) => project.id === id)) return;
  state.projectId = id;
  state.build = 0;
  state.against = null;
  state.expanded = false;
  writeUrl(push ? "push" : "replace");
  render();
  app.focus({ preventScroll: true });
}

function goLibrary(focusSearch = false) {
  state.projectId = null;
  state.build = 0;
  state.against = null;
  state.expanded = false;
  state.query = "";
  writeUrl("replace");
  render();
  if (focusSearch) {
    const search = document.getElementById("search");
    if (search) search.focus();
  }
}

function openOverlay() {
  const project = currentProject();
  const selected = currentBuild();
  if (!project || !selected) return;
  const pinned = againstBuild();
  if (!overlay.open) lastFocus = document.activeElement;

  overlayTitle.textContent = `${project.name} / ${selected.model} / ${selected.skill} / V${selected.variant}${pinned ? ` vs ${pinned.model} / V${pinned.variant}` : ""}`;
  overlayStage.classList.toggle("is-compare", Boolean(pinned));
  overlayStage.innerHTML = `
    <div class="overlay-pane">
      ${pinned ? `<div class="overlay-pane-head"><span class="mono">A · Selected</span><span>${esc(selected.model)} / ${esc(selected.skill)} / V${selected.variant}</span></div>` : ""}
      <iframe src="${esc(selected.src)}" title="${esc(buildLabel(selected))}" tabindex="-1" loading="eager"></iframe>
    </div>
    ${pinned ? `
      <div class="overlay-pane">
        <div class="overlay-pane-head"><span class="mono">B · Pinned</span><span>${esc(pinned.model)} / ${esc(pinned.skill)} / V${pinned.variant}</span><button type="button" class="text-button" data-unpin>Unpin</button></div>
        <iframe src="${esc(pinned.src)}" title="${esc(buildLabel(pinned))}" tabindex="-1" loading="eager"></iframe>
      </div>
    ` : ""}
  `;

  if (!overlay.open) overlay.showModal();
  state.overlayOpen = true;
  bindFrameKeys(overlayStage);
  syncMenu();
  overlayClose.focus();
}

function closeOverlay() {
  if (overlay.open) overlay.close();
  state.overlayOpen = false;
  overlayStage.innerHTML = "";
  overlayFull.setAttribute("aria-pressed", "false");
  overlayFull.textContent = "Full window";
  overlay.removeAttribute("data-full");
  syncMenu();
  if (lastFocus instanceof HTMLElement && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

function render() {
  const project = currentProject();
  document.title = project ? `${project.name} / Frontend Lab` : "Frontend Lab";
  if (project) renderProject();
  else renderLibrary();
  syncMenu();
  window.scrollTo(0, 0);
}

app.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const projectLink = target.closest("[data-project]");
  if (projectLink) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    goProject(projectLink.dataset.project);
    return;
  }

  const select = target.closest("[data-select]");
  if (select) {
    selectBuild(Number(select.dataset.select));
    return;
  }

  const pin = target.closest("[data-pin]");
  if (pin && !pin.disabled) {
    togglePin(Number(pin.dataset.pin));
    return;
  }

  const unpin = target.closest("[data-unpin]");
  if (unpin) {
    state.against = null;
    writeUrl("replace");
    updateSelection();
    live.textContent = "Comparison build dropped.";
    return;
  }

  if (target.closest("#open-overlay") || target.closest("#rail-open")) {
    openOverlay();
  }
});

document.querySelectorAll("[data-nav]").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const screen = item.dataset.nav;
    if (screen === "library") {
      if (state.projectId) goLibrary();
    } else if (screen === "project") {
      if (!state.projectId) goProject(projects[0].id);
    } else if (screen === "preview" && !item.disabled) {
      openOverlay();
    }
  });
});

overlayClose.addEventListener("click", closeOverlay);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeOverlay();
});

overlay.addEventListener("close", closeOverlay);

overlay.addEventListener("cancel", () => {
  state.overlayOpen = false;
  overlayStage.innerHTML = "";
  syncMenu();
});

overlay.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof Element && target.closest("[data-unpin]")) {
    state.against = null;
    writeUrl("replace");
    updateSelection();
    live.textContent = "Comparison build dropped.";
    openOverlay();
  }
});

overlayFull.addEventListener("click", () => {
  const isFull = overlay.getAttribute("data-full") === "true";
  if (isFull) overlay.removeAttribute("data-full");
  else overlay.setAttribute("data-full", "true");
  overlayFull.setAttribute("aria-pressed", String(!isFull));
  overlayFull.textContent = isFull ? "Full window" : "Exit full window";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !state.overlayOpen) {
    const target = event.target;
    const typing = target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
    if (typing) return;
    event.preventDefault();
    if (!state.projectId) {
      const search = document.getElementById("search");
      if (search) search.focus();
    } else {
      goLibrary(true);
    }
  }
});

window.addEventListener("popstate", () => {
  if (overlay.open) {
    state.overlayOpen = false;
    overlay.close();
  }
  readUrl();
  render();
});

readUrl();
render();
