/* Cairn / iteration 02 interactions: command palette, graph tracing, copy */

const commands = [
  { group: "Navigate", name: "Go to today", hint: "G T", ico: "TD", toast: "Opened today's note", current: true },
  { group: "Navigate", name: "Search all 4,182 notes", hint: "⌘F", ico: "SR", toast: "Search focused" },
  { group: "Navigate", name: "Open the graph", hint: "G G", ico: "GR", toast: "Opened the graph" },
  { group: "Create", name: "New note in inbox", hint: "⌘N", ico: "NW", toast: "New note created in Inbox" },
  { group: "Create", name: "Import a folder", hint: "⇧⌘I", ico: "IM", toast: "Import panel opened" },
  { group: "Create", name: "Export archive as Markdown", hint: "⇧⌘E", ico: "EX", toast: "Export started" },
  { group: "Settings", name: "Pause sync", hint: "S", ico: "SY", toast: "Sync paused. Notes stay local." },
  { group: "Settings", name: "Open preferences", hint: "⌘,", ico: "PR", toast: "Opened preferences" },
];

const palette = document.getElementById("palette");
const paletteInput = document.getElementById("palette-query");
const paletteList = document.getElementById("palette-list");
const toast = document.getElementById("toast");

let filtered = commands;
let selected = 0;
let lastFocus = null;
let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function renderPalette() {
  const query = paletteInput.value.trim().toLowerCase();
  filtered = commands.filter((command) => command.name.toLowerCase().includes(query));
  selected = Math.min(selected, Math.max(filtered.length - 1, 0));

  if (!filtered.length) {
    paletteList.innerHTML = `<li class="palette-empty">Nothing matches "${query.replace(/[<>&]/g, "")}". Try “note”, “graph” or “import”.</li>`;
    return;
  }

  let html = "";
  let group = "";
  filtered.forEach((command, index) => {
    if (command.group !== group) {
      group = command.group;
      html += `<li class="palette-group" role="presentation">${group}</li>`;
    }
    html += `
      <li class="palette-item${index === selected ? " sel" : ""}" role="option" aria-selected="${index === selected}" data-index="${index}">
        <span class="ico" aria-hidden="true">${command.ico}</span>
        <span>${command.name}</span>
        <span class="hint">${command.hint}</span>
      </li>`;
  });
  paletteList.innerHTML = html;
}

function highlightSelection() {
  [...paletteList.querySelectorAll(".palette-item")].forEach((item) => {
    const active = Number(item.dataset.index) === selected;
    item.classList.toggle("sel", active);
    item.setAttribute("aria-selected", String(active));
    if (active) item.scrollIntoView({ block: "nearest" });
  });
}

function openPalette() {
  lastFocus = document.activeElement;
  palette.hidden = false;
  document.body.style.overflow = "hidden";
  paletteInput.value = "";
  selected = 0;
  renderPalette();
  paletteInput.focus();
}

function closePalette() {
  if (palette.hidden) return;
  palette.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

function choose(index) {
  const command = filtered[index];
  if (!command) return;
  closePalette();
  showToast(command.toast);
}

document.querySelectorAll("[data-open-palette]").forEach((trigger) => {
  trigger.addEventListener("click", openPalette);
});

document.querySelectorAll("[data-close-palette]").forEach((trigger) => {
  trigger.addEventListener("click", closePalette);
});

paletteInput.addEventListener("input", () => {
  selected = 0;
  renderPalette();
});

paletteList.addEventListener("click", (event) => {
  const item = event.target.closest(".palette-item");
  if (item) choose(Number(item.dataset.index));
});

document.addEventListener("keydown", (event) => {
  const modifier = event.metaKey || event.ctrlKey;

  if (modifier && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (palette.hidden) openPalette();
    else closePalette();
    return;
  }

  if (palette.hidden) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closePalette();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    selected = filtered.length ? (selected + 1) % filtered.length : 0;
    highlightSelection();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    selected = filtered.length ? (selected - 1 + filtered.length) % filtered.length : 0;
    highlightSelection();
  } else if (event.key === "Enter") {
    event.preventDefault();
    choose(selected);
  } else if (event.key === "Tab") {
    event.preventDefault();
  }
});

/* graph tracing */

const canvas = document.querySelector(".graph-canvas");
const nodes = [...document.querySelectorAll(".node")];
const edges = [...document.querySelectorAll(".edges line")];

function trace(id) {
  canvas.classList.add("tracing");
  nodes.forEach((node) => node.classList.toggle("hot", node.dataset.id === id));
  edges.forEach((edge) => edge.classList.toggle("hot", edge.dataset.a === id || edge.dataset.b === id));
}

function clearTrace() {
  canvas.classList.remove("tracing");
  nodes.forEach((node) => node.classList.remove("hot"));
  edges.forEach((edge) => edge.classList.remove("hot"));
}

nodes.forEach((node) => {
  node.addEventListener("pointerenter", () => trace(node.dataset.id));
  node.addEventListener("pointerleave", clearTrace);
  node.addEventListener("pointerdown", () => trace(node.dataset.id));
});

/* copy install command */

const copyButton = document.getElementById("copy-brew");
copyButton.addEventListener("click", async () => {
  const command = document.getElementById("brew-cmd").textContent;
  try {
    await navigator.clipboard.writeText(command);
  } catch {
    const field = document.createElement("textarea");
    field.value = command;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  copyButton.textContent = "Copied";
  showToast(`${command} copied`);
  setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1800);
});
