(() => {
  "use strict";

  const KEY = "demos.notes.v1";

  const SEED = [
    {
      id: "n1",
      kind: "Quote",
      label: "Interfaces age",
      title: "Interfaces age faster than habits",
      body: "The half-life of a good interface is about three years. The habit it builds lasts a decade.",
      source: "The Shape of Screens, page 88",
      day: "12 Mar",
      related: ["n2", "n4"]
    },
    {
      id: "n2",
      kind: "Clip",
      label: "Memory palace",
      title: "Memory palace piece",
      body: "A memory palace is just a route you already know, with new things left along it.",
      source: "theguardian.example, long read",
      day: "4 Feb",
      related: ["n1", "n4"]
    },
    {
      id: "n3",
      kind: "Call",
      label: "Call with Priya",
      title: "Onboarding call with Priya",
      body: "Cut the intro video to forty seconds. Nobody watches the second minute.",
      source: "Call, Priya Raman",
      day: "8 Mar",
      related: ["n1"]
    },
    {
      id: "n4",
      kind: "Half-thought",
      label: "Sort by intention",
      title: "Sort by intention",
      body: "What if the archive sorted by what you were trying to do, not by when you saved it?",
      source: "Typed on a walk",
      day: "21 Feb",
      related: ["n1", "n2"]
    },
    {
      id: "n5",
      kind: "Link",
      label: "The chair",
      title: "The chair",
      body: "Low chair, oak, 1962. The proportions are right. The upholstery is not.",
      source: "furniturearchive.example",
      day: "17 Jan",
      related: ["n6"]
    },
    {
      id: "n6",
      kind: "Photo note",
      label: "Kitchen wall",
      title: "Kitchen wall",
      body: "Warm white, matte, with a shelf at eye level. Copied from the third image.",
      source: "Screenshot",
      day: "11 Jan",
      related: ["n5"]
    }
  ];

  const POSITIONS = {
    n1: [42, 17],
    n2: [78, 31],
    n3: [15, 37],
    n4: [56, 52],
    n5: [23, 68],
    n6: [65, 81]
  };
  const SPARE = [[86, 66], [10, 57], [39, 87], [88, 14], [34, 32], [70, 72], [12, 15], [52, 40]];

  const $ = (sel) => document.querySelector(sel);
  const nodesBox = $("#nodes");
  const edges = $("#edges");
  const detail = $("#detail");
  const graphSearch = $("#graphSearch");
  const matchLine = $("#matchLine");
  const graphCount = $("#graphCount");
  const capture = $("#capture");
  const thought = $("#thought");
  const captureStatus = $("#capture-status");
  const captureError = $("#capture-error");

  let notes = load();
  let selectedId = "n1";
  let statusTimer = null;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
      localStorage.setItem(KEY, JSON.stringify(SEED));
    } catch (error) {
      /* Private mode: run in memory. */
    }
    return SEED.map((note) => ({ ...note }));
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(notes));
    } catch (error) {
      /* The demo still works for this visit. */
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function labelFor(note) {
    if (note.label) return note.label;
    const words = note.title.split(/\s+/);
    return words.slice(0, 3).join(" ") + (words.length > 3 ? "…" : "");
  }

  function posFor(note, index) {
    if (POSITIONS[note.id]) return POSITIONS[note.id];
    const spareIndex = notes.findIndex((item) => item.id === note.id) - 6;
    const pool = SPARE[Math.max(0, spareIndex) % SPARE.length];
    return [pool[0], pool[1]];
  }

  function links() {
    const pairs = new Set();
    notes.forEach((note) => {
      (note.related || []).forEach((id) => {
        if (!notes.some((item) => item.id === id)) return;
        pairs.add([note.id, id].sort().join("|"));
      });
    });
    return [...pairs].map((pair) => pair.split("|"));
  }

  function searchMatches(query) {
    const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 1);
    if (!terms.length) return [];
    return notes.filter((note) => {
      const hay = `${note.title} ${note.body} ${note.source} ${note.kind}`.toLowerCase();
      return terms.every((term) => hay.includes(term));
    });
  }

  function neighboursOf(id) {
    const note = notes.find((item) => item.id === id);
    if (!note) return [];
    return (note.related || []).filter((rid) => notes.some((item) => item.id === rid));
  }

  function renderGraph(animate) {
    const query = graphSearch.value.trim();
    const matches = searchMatches(query);
    const matchedIds = new Set(matches.map((note) => note.id));
    const neighbours = new Set(neighboursOf(selectedId));

    const coords = new Map();
    notes.forEach((note, index) => coords.set(note.id, posFor(note, index)));

    edges.innerHTML = links().map(([a, b]) => {
      const [x1, y1] = coords.get(a);
      const [x2, y2] = coords.get(b);
      const cx = (x1 + x2) / 2 - (y2 - y1) * 0.12;
      const cy = (y1 + y2) / 2 + (x2 - x1) * 0.12;
      const lit = a === selectedId || b === selectedId;
      const dim = query && !(matchedIds.has(a) && matchedIds.has(b));
      return `<path class="${lit ? "lit" : ""}${dim ? " dim" : ""}" d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" pathLength="1"/>`;
    }).join("");

    nodesBox.innerHTML = notes.map((note) => {
      const [x, y] = coords.get(note.id);
      const classes = ["node"];
      if (note.id === selectedId) classes.push("is-selected");
      else if (neighbours.has(note.id)) classes.push("is-neighbour");
      if (query && matchedIds.has(note.id)) classes.push("is-hit");
      if (query && !matchedIds.has(note.id)) classes.push("is-dim");
      return `<button class="${classes.join(" ")}" type="button" data-id="${escapeHTML(note.id)}"
        style="--x:${x}%;--y:${y}%" aria-pressed="${note.id === selectedId}">
        <span class="node-dot" aria-hidden="true"></span>
        <span class="node-label">${escapeHTML(labelFor(note))}</span>
      </button>`;
    }).join("");

    if (animate) {
      edges.classList.remove("is-new");
      void edges.offsetWidth;
      edges.classList.add("is-new");
      const added = nodesBox.querySelector(".is-selected");
      if (added) added.classList.add("is-new");
    }

    graphCount.textContent = `${notes.length} notes, ${links().length} links`;

    if (query) {
      matchLine.textContent = matches.length
        ? `${matches.length} ${matches.length === 1 ? "match" : "matches"}. Enter opens the first.`
        : `Nothing contains “${query}”. Try chair, call or memory.`;
    } else {
      matchLine.textContent = "Click a note to read it. Its neighbours stay lit.";
    }
  }

  function renderDetail() {
    const note = notes.find((item) => item.id === selectedId) || notes[0];
    if (!note) {
      detail.innerHTML = "<p class=\"detail-body\">Your field is empty. Keep a note to start it.</p>";
      return;
    }
    const related = neighboursOf(note.id)
      .map((id) => notes.find((item) => item.id === id))
      .filter(Boolean);

    detail.innerHTML = `
      <div class="detail-top">
        <span class="detail-kind">${escapeHTML(note.kind)}</span>
        <span>Kept ${escapeHTML(note.day)}</span>
      </div>
      <p class="detail-title">${escapeHTML(note.title)}</p>
      <p class="detail-body">${escapeHTML(note.body)}</p>
      <div class="detail-foot">
        <p class="detail-source">${escapeHTML(note.source)}${related.length ? `<br>Next to ${related.length} ${related.length === 1 ? "note" : "notes"}` : "<br>No neighbours yet"}</p>
        <div class="detail-links">
          ${related.map((item) => `<button class="chip" type="button" data-id="${escapeHTML(item.id)}">${escapeHTML(labelFor(item))}</button>`).join("")}
        </div>
      </div>`;
    detail.style.animation = "none";
    void detail.offsetWidth;
    detail.style.animation = "";
  }

  function select(id) {
    selectedId = id;
    graphSearch.value = "";
    renderGraph(false);
    renderDetail();
  }

  function announce(message) {
    captureStatus.textContent = message;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { captureStatus.textContent = ""; }, 5000);
  }

  function relatedFor(note) {
    const stop = new Set(["the", "and", "that", "with", "this", "from", "what", "when", "about", "into", "they", "your", "have", "will"]);
    const words = new Set((`${note.title} ${note.body}`.toLowerCase().match(/[a-z]{4,}/g) || []).filter((word) => !stop.has(word)));
    return notes
      .filter((item) => item.id !== note.id)
      .map((item) => {
        const others = new Set((`${item.title} ${item.body}`.toLowerCase().match(/[a-z]{4,}/g) || []).filter((word) => !stop.has(word)));
        let hits = 0;
        words.forEach((word) => { if (others.has(word)) hits += 1; });
        return { id: item.id, hits };
      })
      .filter((entry) => entry.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 2)
      .map((entry) => entry.id);
  }

  function today() {
    const date = new Date();
    return `${date.getDate()} ${date.toLocaleString("en-GB", { month: "short" })}`;
  }

  nodesBox.addEventListener("click", (event) => {
    const button = event.target.closest(".node");
    if (button) select(button.dataset.id);
  });

  detail.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip[data-id]");
    if (chip) select(chip.dataset.id);
  });

  graphSearch.addEventListener("input", () => renderGraph(false));

  graphSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const matches = searchMatches(graphSearch.value.trim());
      if (matches.length) {
        event.preventDefault();
        select(matches[0].id);
      }
    }
    if (event.key === "Escape") {
      graphSearch.value = "";
      renderGraph(false);
    }
  });

  capture.addEventListener("submit", (event) => {
    event.preventDefault();
    const body = thought.value.trim();
    if (!body) {
      captureError.textContent = "Write a line first. One is enough.";
      captureError.hidden = false;
      thought.focus();
      return;
    }
    captureError.hidden = true;

    const words = body.split(/\s+/);
    const title = words.slice(0, 7).join(" ") + (words.length > 7 ? "…" : "");
    let id = "u" + Date.now();
    while (notes.some((note) => note.id === id)) id += "x";

    const note = {
      id,
      kind: "Note",
      label: words.slice(0, 3).join(" ") + (words.length > 3 ? "…" : ""),
      title,
      body,
      source: "Typed in this browser",
      day: today(),
      related: []
    };
    note.related = relatedFor(note);

    notes.unshift(note);
    save();
    selectedId = id;
    graphSearch.value = "";
    thought.value = "";
    renderGraph(true);
    renderDetail();
    const count = note.related.length;
    announce(count
      ? `Saved. Linked to ${count} ${count === 1 ? "note" : "notes"} with a shared word.`
      : "Saved. No neighbours yet. Another note with a shared word will link it.");
    thought.focus();
  });

  document.querySelectorAll("[data-focus-composer]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#top").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => thought.focus({ preventScroll: true }), 320);
    });
  });

  renderGraph(false);
  renderDetail();
})();
