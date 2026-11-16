const PROJECTS = [{"id":"trio","name":"Project Trio","initial":"T","line":"Czech travel agency site with a trip listing, detail pages, seat booking and a hidden admin area.","brief":"CA Trio is a Czech travel agency in Moravské Budějovice. It sells day trips (Advent trips, musicals and theatre, thermal spas), one Greece package stay, and stays through partner agencies.\n\nBuild a multi-page site that turns a visitor into a booking. Pages: landing, trip listing with filters, trip detail, booking with seat selection, contact and cancellation terms, and a hidden admin area.\n\nListing: filter by category, month, availability and price. Each trip page answers what happens, what is included, what it costs, and where it leaves from.\n\nBooking: choose a departure point, then pick seats on a bus plan. Seats already taken show as unavailable.\n\nSeat map: a bus with 2+2 seating and an aisle, plus a back row of 5 seats. Admin sets the seat count per trip.\n\nAdmin: a route behind a passphrase. Create a trip and edit its name, price, dates, departure points, seat count, description, included and excluded items, and images. See bookings per trip, mark a trip sold out, unpublish it.\n\nCzech and English both ship. Czech is primary, the switch keeps the visitor on the same page.\n\nTake every fact from content/en.md and content/cs.md. Images in public/assets are placeholders.\n\nArchitecture is yours, Design is open. Do not copy the old site.\n\n## Sources\n\n- Content: `/Users/yon/Desktop/Programming/Projects/Frontend Lab/projects/ca-trio/content/en.md` (English) and `/Users/yon/Desktop/Programming/Projects/Frontend Lab/projects/ca-trio/content/cs.md` (Czech). Both use the same sections.\n- Images: flat files in public/assets, taken from the old site. Each trip in the content lists its image.\n\n## Landing hero\n\nThe landing hero comes from the wide images only: hero.jpg, hero-2.jpg, hero-3.jpg, hero-4.jpg, vienna-christmas-market.jpg, hotel-sissy.jpg and vienna-christmas-market-portrait.jpg. Each variant opens with a different one, so no two variants share the same first picture. Keep these out of trip pages; a trip page uses its own thumbnail.\n\nMatch the hero to the palette. Decide the design direction first, then pick a photo that fits it. A dark interface takes a dark scene; a light interface takes a bright one. hero.jpg, hero-2.jpg, hero-3.jpg, hero-4.jpg and both vienna-christmas-market files are night or overcast scenes. hotel-sissy.jpg is the only bright daylight photo, so it belongs with a light theme and must not sit behind a dark one.","models":["DeepSeek V4.1 Flash","GPT Sol 6.1 High"],"skills":["Design","Apple Design","Apple Design +"],"builds":[[0,0,1,"builds/deepseek/design-taste/1/dist/index.html"],[0,0,2,"builds/deepseek/design-taste/2/dist/index.html"],[0,0,3,"builds/deepseek/design-taste/3/dist/index.html"],[0,0,4,"builds/deepseek/design-taste/4/dist/index.html"],[0,0,5,"builds/deepseek/design-taste/5/dist/index.html"],[1,1,1,"builds/sol6/apple-sol/1/dist/index.html"],[1,1,2,"builds/sol6/apple-sol/2/dist/index.html"],[1,1,3,"builds/sol6/apple-sol/3/dist/index.html"],[0,1,1,"builds/deepseek/apple-design/1/dist/index.html"],[0,1,2,"builds/deepseek/apple-design/2/dist/index.html"],[0,1,3,"builds/deepseek/apple-design/3/dist/index.html"],[0,1,4,"builds/deepseek/apple-design/4/dist/index.html"],[0,1,5,"builds/deepseek/apple-design/5/dist/index.html"],[0,2,1,"builds/deepseek/apple-design-plus/1/dist/index.html"],[0,2,2,"builds/deepseek/apple-design-plus/2/dist/index.html"],[0,2,3,"builds/deepseek/apple-design-plus/3/dist/index.html"],[0,2,4,"builds/deepseek/apple-design-plus/4/dist/index.html"],[0,2,5,"builds/deepseek/apple-design-plus/5/dist/index.html"],[1,2,1,"builds/sol6/apple-plus-sol/1/dist/index.html"],[1,2,2,"builds/sol6/apple-plus-sol/2/dist/index.html"],[1,2,3,"builds/sol6/apple-plus-sol/3/dist/index.html"],[1,2,6,"builds/sol6/apple-plus-special/6/dist/index.html"],[1,2,7,"builds/sol6/apple-plus-special/7/dist/index.html"],[1,2,8,"builds/sol6/apple-plus-liked/8/dist/index.html"],[1,2,9,"builds/sol6/apple-plus-liked/9/dist/index.html"],[0,2,6,"builds/deepseek/ds-apple-special/6/dist/index.html"],[0,2,7,"builds/deepseek/ds-apple-special/7/dist/index.html"],[0,2,8,"builds/deepseek/ds-apple-liked/8/dist/index.html"],[0,2,9,"builds/deepseek/ds-apple-liked/9/dist/index.html"],[1,2,4,"builds/sol6/apple-plus-cairn/4/dist/index.html"],[1,2,5,"builds/sol6/apple-plus-cairn/5/dist/index.html"],[0,1,6,"builds/deepseek/apple-design/6/dist/index.html"],[0,1,7,"builds/deepseek/apple-design/7/dist/index.html"],[0,1,8,"builds/deepseek/apple-design/8/dist/index.html"],[0,1,9,"builds/deepseek/apple-design/9/dist/index.html"],[0,1,10,"builds/deepseek/apple-design/10/dist/index.html"]]},{"id":"demo","name":"Project Demo","initial":"D","line":"Landing page for a note-taking app, iterated three times with a switcher.","brief":"Design the landing page for a note-taking application as essentially a second brain, in three iterations with a switcher.","models":["DeepSeek V4.1 Flash"],"skills":["No skill","Design","Apple Design","Apple Design +","Design + Taste + Motion","Design + Taste + Apple + Motion"],"builds":[[0,0,1,"1/index.html"],[0,0,2,"2/index.html"],[0,0,3,"3/index.html"],[0,1,1,"design/1/index.html"],[0,1,2,"design/2/index.html"],[0,2,1,"apple-design/1/index.html"],[0,2,3,"apple-design/3/index.html"],[0,3,1,"apple-design-plus/1/index.html"],[0,3,2,"apple-design-plus/2/index.html"],[0,3,3,"apple-design-plus/3/index.html"],[0,4,1,"design-taste-motion/1/index.html"],[0,4,2,"design-taste-motion/2/index.html"],[0,4,3,"design-taste-motion/3/index.html"],[0,5,1,"design-taste-apple-motion/1/index.html"],[0,5,2,"design-taste-apple-motion/2/index.html"],[0,5,3,"design-taste-apple-motion/3/index.html"]]},{"id":"test1","name":"Project Test 1","initial":"1","line":"Layout experiments.","brief":"Layout experiments.","models":["DeepSeek V4.1 Flash"],"skills":["No skill","Frontend Design"],"builds":[[0,0,1,"builds/deepseek/no-skill/1/index.html"],[0,0,2,"builds/deepseek/no-skill/2/index.html"],[0,1,1,"builds/deepseek/frontend-design/1/index.html"],[0,1,2,"builds/deepseek/frontend-design/2/index.html"]]}];

/* ---------- data helpers ---------- */

const DIRS = { trio: "trio", demo: "demo", test1: "test-1" };
const ROOT = "../../../../../";
const MODEL_KEYS = {
  "DeepSeek V4.1 Flash": "DS",
  "GPT Sol 6.1 High": "GS",
  "Kimi K3": "K3",
};

for (const project of PROJECTS) {
  project.dir = DIRS[project.id] || project.id;
  project.builds = project.builds.map(([m, s, v, path], index) => ({
    id: `${project.id}-${index}`,
    index,
    model: project.models[m],
    skill: project.skills[s],
    variant: v,
    path,
  }));
}

const TOTAL_BUILDS = PROJECTS.reduce((sum, project) => sum + project.builds.length, 0);

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const modelKey = (model) =>
  MODEL_KEYS[model] ||
  model
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const srcFor = (project, build) => `${ROOT}${project.dir}/${build.path}`;
const buildLabel = (build) => `${build.model} / ${build.skill} / v${pad(build.variant)}`;

function projectHref(project, index, against, preview) {
  const query = new URLSearchParams();
  query.set("project", project.id);
  query.set("build", project.builds[index].id);
  if (against != null) query.set("against", project.builds[against].id);
  if (preview) query.set("preview", "1");
  return `?${query}`;
}

function readUrl() {
  const query = new URLSearchParams(location.search);
  const project = PROJECTS.find((item) => item.id === query.get("project")) || null;
  if (!project) return { project: null, index: 0, against: null, preview: false };
  const buildIndex = project.builds.findIndex((build) => build.id === query.get("build"));
  const againstIndex = project.builds.findIndex((build) => build.id === query.get("against"));
  const index = buildIndex >= 0 ? buildIndex : 0;
  return {
    project,
    index,
    against: againstIndex >= 0 && againstIndex !== index ? againstIndex : null,
    preview: query.get("preview") === "1",
  };
}

/* ---------- state ---------- */

const state = { project: null, index: 0, against: null };
const overlay = { open: false, full: false, opener: null };
let ui = {};

const main = $("#main");
const live = $("#live");
const compareDialog = $("#cmp");

function syncUrl() {
  if (!state.project) return;
  history.replaceState(null, "", projectHref(state.project, state.index, state.against, overlay.open));
  applyChrome();
}

function applyChrome() {
  const library = $('[data-screen="library"]');
  const projectLink = $('[data-screen="project"]');
  if (state.project) {
    projectLink.setAttribute("aria-current", "page");
    library.removeAttribute("aria-current");
    projectLink.href = projectHref(state.project, state.index, state.against, false);
    document.title = `${state.project.name} — Frontend Lab`;
  } else {
    library.setAttribute("aria-current", "page");
    projectLink.removeAttribute("aria-current");
    projectLink.href = "?project=trio";
    document.title = "Library — Frontend Lab";
  }
  const variant = document.documentElement.dataset.variant;
  for (const link of $$("[data-design]")) {
    link.href = `../${link.dataset.design}/${location.search}`;
    if (link.dataset.design === variant) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

/* ---------- library ---------- */

function renderLibrary() {
  state.project = null;
  state.against = null;
  main.innerHTML = `
    <div class="page lib">
      <header class="lib-head">
        <div>
          <h1>Library</h1>
          <p class="lib-count" id="lib-count">${PROJECTS.length} projects / ${TOTAL_BUILDS} builds</p>
        </div>
        <label class="search">
          <span class="sr-only">Search projects by name or model</span>
          <input id="q" type="search" placeholder="Search name or model" autocomplete="off" spellcheck="false" />
          <kbd aria-hidden="true">/</kbd>
        </label>
      </header>
      <section aria-labelledby="projects-h">
        <h2 class="sr-only" id="projects-h">Projects</h2>
        <div class="thead" aria-hidden="true">
          <span></span><span>project</span><span>models</span><span class="tas">builds</span>
        </div>
        <ul class="rows" id="rows">
          ${PROJECTS.map((project) => {
            const models = project.models
              .map(
                (model) =>
                  `<span class="mrow"><span class="mk">${modelKey(model)}</span><span class="mname">${esc(model)}</span></span>`,
              )
              .join("");
            const search = `${project.name} ${project.models.join(" ")}`.toLowerCase();
            return `<li>
              <a class="row" href="?project=${encodeURIComponent(project.id)}" data-search="${esc(search)}" data-builds="${project.builds.length}">
                <span class="cov" aria-hidden="true">${esc(project.initial)}</span>
                <span class="rproj">
                  <span class="rname">${esc(project.name)}</span>
                  <span class="rline">${esc(project.line)}</span>
                </span>
                <span class="rmodels">${models}</span>
                <span class="rbuilds"><b>${project.builds.length}</b><span class="runit"> builds</span></span>
              </a>
            </li>`;
          }).join("")}
        </ul>
        <div class="empty" id="empty" hidden>
          <p id="empty-msg"></p>
          <button type="button" class="tbtn" id="clear">Clear search</button>
        </div>
      </section>
    </div>`;

  applyChrome();

  const input = $("#q");
  const rows = $$(".row");
  const count = $("#lib-count");
  const empty = $("#empty");
  const emptyMsg = $("#empty-msg");

  const filter = () => {
    const raw = input.value.trim();
    const query = raw.toLowerCase();
    let visible = 0;
    let builds = 0;
    for (const row of rows) {
      const hit = !query || row.dataset.search.includes(query);
      row.parentElement.hidden = !hit;
      if (hit) {
        visible += 1;
        builds += Number(row.dataset.builds);
      }
    }
    count.textContent = query
      ? `${visible} of ${PROJECTS.length} projects / ${builds} builds`
      : `${PROJECTS.length} projects / ${TOTAL_BUILDS} builds`;
    empty.hidden = visible > 0;
    if (!visible) emptyMsg.textContent = `No project matches “${raw}”. Names and models only.`;
    live.textContent = query ? `${visible} projects match ${raw}` : `${PROJECTS.length} projects`;
  };

  input.addEventListener("input", filter);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && input.value) {
      input.value = "";
      filter();
    }
  });
  $("#clear").addEventListener("click", () => {
    input.value = "";
    filter();
    input.focus();
  });
  filter();
}

/* ---------- project ---------- */

function briefHTML(text) {
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const value = block.trim();
      if (!value) return "";
      if (value.startsWith("## ")) {
        const [head, ...rest] = value.split("\n");
        return `<h3>${esc(head.slice(3))}</h3>${rest.length ? `<p>${esc(rest.join(" "))}</p>` : ""}`;
      }
      if (value.startsWith("- ")) {
        return `<ul>${value
          .split("\n")
          .map((line) => `<li>${esc(line.replace(/^-\s*/, ""))}</li>`)
          .join("")}</ul>`;
      }
      return `<p>${esc(value).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

function buildRow(project, build, groupStart) {
  return `<li${groupStart ? ' class="gstart"' : ""}>
    <button type="button" class="brow" data-i="${build.index}" aria-label="View ${esc(build.model)}, ${esc(build.skill)}, variant ${build.variant}">
      <span class="bv">${pad(build.variant)}</span>
      <span class="bm"><span class="mk">${modelKey(build.model)}</span><span class="mname">${esc(build.model)}</span></span>
      <span class="bs" title="${esc(build.skill)}">${esc(build.skill)}</span>
      <span class="bp">${esc(project.dir)}/${esc(build.path)}</span>
    </button>
  </li>`;
}

function renderProject() {
  const project = state.project;
  const longBrief = project.brief.length > 340;

  main.innerHTML = `
    <div class="page proj">
      <nav class="crumb" aria-label="Breadcrumb">
        <a href="./">Library</a><span class="csep" aria-hidden="true">/</span><span aria-current="page">${esc(project.name)}</span>
      </nav>
      <header class="phead">
        <div>
          <h1>${esc(project.name)}</h1>
          <p class="vitals">
            <span>${project.builds.length} builds</span>
            <span>${project.models.length} models</span>
            <span>${project.skills.length} skills</span>
          </p>
        </div>
        <div class="plist-models">
          ${project.models
            .map(
              (model) =>
                `<span class="mrow"><span class="mk">${modelKey(model)}</span><span class="mname">${esc(model)}</span></span>`,
            )
            .join("")}
        </div>
      </header>

      <section class="brief" id="brief" data-open="false" aria-labelledby="brief-h">
        <div class="bhead">
          <h2 class="label" id="brief-h">brief</h2>
          ${longBrief ? `<button type="button" class="tbtn" id="btoggle" aria-expanded="false" aria-controls="bcopy">Read full brief</button>` : ""}
        </div>
        <div class="bcopy" id="bcopy">${briefHTML(project.brief)}</div>
      </section>

      <div class="work" id="work" data-compare="false">
        <aside class="viewer" id="viewer" aria-label="Build viewer">
          <div class="vbar">
            <span class="label" id="vmode">viewer</span>
            <span class="vtitle" id="vtitle"></span>
            <div class="vacts">
              <button type="button" class="tbtn" id="cmp-open">Compare with…</button>
              <button type="button" class="tbtn" id="open-ov">Preview</button>
            </div>
          </div>
          <div class="panes" id="panes" data-panes="1">
            <div class="pane">
              <div class="pcap"><span class="prole">selected</span><span class="pname" id="pname-cur"></span></div>
              <div class="pframe"><iframe id="frame-cur" title="Selected build"></iframe></div>
            </div>
            <div class="pane" id="pane-pin" hidden>
              <div class="pcap"><span class="prole">pinned</span><span class="pname" id="pname-pin"></span><button type="button" class="tbtn" id="drop">Drop</button></div>
              <div class="pframe"><iframe id="frame-pin" title="Pinned build"></iframe></div>
            </div>
          </div>
          <div class="vfoot"><code id="vpath"></code><span class="vvar" id="vvar"></span></div>
        </aside>
      <section class="builds" aria-labelledby="builds-h">
          <h2 class="label" id="builds-h">builds <span class="cnt">${project.builds.length}</span></h2>
          <div class="bt-head" aria-hidden="true">
            <span>v</span><span>model</span><span>skill</span><span class="hp">path</span>
          </div>
          <ol class="brows" id="brows">${project.builds
            .map((build, index) => {
              const previous = project.builds[index - 1];
              const groupStart = !previous || previous.model !== build.model || previous.skill !== build.skill;
              return buildRow(project, build, groupStart);
            })
            .join("")}</ol>
        </section>

        </div>
    </div>`;

  ui = {
    rows: $$(".brow"),
    work: $("#work"),
    viewer: $("#viewer"),
    panes: $("#panes"),
    panePin: $("#pane-pin"),
    frameCur: $("#frame-cur"),
    framePin: $("#frame-pin"),
    vtitle: $("#vtitle"),
    pnameCur: $("#pname-cur"),
    pnamePin: $("#pname-pin"),
    vpath: $("#vpath"),
    vvar: $("#vvar"),
    vmode: $("#vmode"),
    cmpOpen: $("#cmp-open"),
    drop: $("#drop"),
  };

  ui.rows.forEach((row) => row.addEventListener("click", () => select(Number(row.dataset.i))));
  ui.cmpOpen.addEventListener("click", openCompare);
  $("#open-ov").addEventListener("click", () => openOverlay());
  ui.drop.addEventListener("click", () => setAgainst(null));

  const toggle = $("#btoggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const brief = $("#brief");
      const open = brief.dataset.open !== "true";
      brief.dataset.open = String(open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Collapse brief" : "Read full brief";
    });
  }

  updateSelection();
  updateCompare();
  applyChrome();
}

function select(index) {
  if (index === state.index) return;
  state.index = index;
  if (state.against === index) state.against = null;
  updateSelection();
  updateCompare();
  syncUrl();
  applyChrome();
}

function updateSelection() {
  const project = state.project;
  const build = project.builds[state.index];

  for (const row of ui.rows) {
    const rowIndex = Number(row.dataset.i);
    if (rowIndex === state.index) row.setAttribute("aria-current", "true");
    else row.removeAttribute("aria-current");
    row.dataset.pinned = String(rowIndex === state.against);
  }

  ui.vtitle.textContent = buildLabel(build);
  ui.pnameCur.textContent = buildLabel(build);
  ui.vpath.textContent = `${project.dir}/${build.path}`;
  ui.vvar.textContent = `v${pad(build.variant)}`;

  if (ui.frameCur.getAttribute("src") !== srcFor(project, build)) {
    ui.frameCur.src = srcFor(project, build);
  }
  ui.frameCur.title = `${project.name}: ${build.model}, ${build.skill}, variant ${build.variant}`;

  if (state.against != null) {
    const pinned = project.builds[state.against];
    ui.pnamePin.textContent = buildLabel(pinned);
    if (ui.framePin.getAttribute("src") !== srcFor(project, pinned)) {
      ui.framePin.src = srcFor(project, pinned);
    }
    ui.framePin.title = `Pinned: ${project.name}, ${pinned.model}, ${pinned.skill}, variant ${pinned.variant}`;
  }
}

function updateCompare() {
  const comparing = state.against != null;
  ui.work.dataset.compare = String(comparing);
  ui.panes.dataset.panes = comparing ? "2" : "1";
  ui.panePin.hidden = !comparing;
  ui.vmode.textContent = comparing ? "compare" : "viewer";
  ui.cmpOpen.textContent = comparing ? "Change pinned…" : "Compare with…";
  if (comparing) {
    updateSelection();
  }
}

function setAgainst(index) {
  state.against = index;
  updateCompare();
  updateSelection();
  syncUrl();
}

/* ---------- compare picker ---------- */

function renderCompareList(query) {
  const project = state.project;
  const value = query.trim().toLowerCase();
  const items = project.builds.filter((build) => {
    if (build.index === state.index) return false;
    if (!value) return true;
    return `${build.model} ${build.skill} ${build.variant}`.toLowerCase().includes(value);
  });

  $("#cmp-list").innerHTML = items.length
    ? items
        .map(
          (build) => `<button type="button" class="cmp-row" data-i="${build.index}" aria-current="${state.against === build.index}">
            <span class="bv">${pad(build.variant)}</span>
            <span class="bm"><span class="mk">${modelKey(build.model)}</span><span class="mname">${esc(build.model)}</span></span>
            <span class="bs">${esc(build.skill)}</span>
            <span class="cpin">${state.against === build.index ? "pinned" : ""}</span>
          </button>`,
        )
        .join("")
    : `<p class="cmp-empty">No other build matches that search.</p>`;
}

function openCompare() {
  const input = $("#cmp-q");
  input.value = "";
  renderCompareList("");
  compareDialog.showModal();
  input.focus();
}

function pickCompare(index) {
  setAgainst(index);
  live.textContent = `Pinned ${buildLabel(state.project.builds[index])}`;
  compareDialog.close();
}

/* ---------- preview overlay ---------- */

function openOverlay() {
  if (!state.project) return;
  const project = state.project;
  const build = project.builds[state.index];
  overlay.opener = document.activeElement;
  overlay.open = true;
  document.body.classList.add("locked");
  const ov = $("#ov");
  ov.hidden = false;
  $("#ov-project").textContent = project.name;
  $("#ov-build").textContent = buildLabel(build);
  const frame = $("#ov-frame");
  frame.src = srcFor(project, build);
  frame.title = `Preview: ${project.name}, ${build.model}, ${build.skill}, variant ${build.variant}`;
  setFull(false, false);
  $("#ov-close").focus();
  syncUrl();
}

function closeOverlay() {
  if (!overlay.open) return;
  overlay.open = false;
  document.body.classList.remove("locked");
  $("#ov").hidden = true;
  $("#ov-frame").src = "about:blank";
  setFull(false, false);
  if (overlay.opener && overlay.opener !== document.body && document.contains(overlay.opener)) overlay.opener.focus();
  else $("#open-ov")?.focus();
  syncUrl();
}

function setFull(on, moveFocus = true) {
  overlay.full = on;
  const ov = $("#ov");
  ov.classList.toggle("full", on);
  $("#ov-full").setAttribute("aria-pressed", String(on));
  $("#ov-return").hidden = !on;
  if (moveFocus) (on ? $("#ov-return") : $("#ov-full")).focus();
}

/* ---------- global wiring ---------- */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && overlay.open) {
    if (compareDialog.open) return;
    event.preventDefault();
    closeOverlay();
    return;
  }
  if (event.key !== "Tab" || !overlay.open) return;
  const focusable = $$('button, [href], input, [tabindex]:not([tabindex="-1"])', $("#ov")).filter(
    (element) => !element.hidden && element.offsetParent !== null,
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "/" || overlay.open || compareDialog.open) return;
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  const search = $("#q");
  if (!search) return;
  event.preventDefault();
  search.focus();
});

$("#ov-close").addEventListener("click", closeOverlay);
$("#ov-full").addEventListener("click", () => setFull(true));
$("#ov-return").addEventListener("click", () => setFull(false));

$("#ov-frame").addEventListener("load", () => {
  try {
    $("#ov-frame").contentWindow.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && overlay.open) closeOverlay();
      },
      true,
    );
  } catch (error) {
    /* local builds are same-origin; keep silence if a frame refuses access */
  }
});

$("#cmp-close").addEventListener("click", () => compareDialog.close());
$("#cmp-q").addEventListener("input", (event) => renderCompareList(event.target.value));
$("#cmp-list").addEventListener("click", (event) => {
  const row = event.target.closest(".cmp-row");
  if (row) pickCompare(Number(row.dataset.i));
});

/* ---------- boot ---------- */

const start = readUrl();
state.project = start.project;
state.index = start.index;
state.against = start.against;

if (state.project) renderProject();
else renderLibrary();

if (start.preview && state.project) openOverlay();
