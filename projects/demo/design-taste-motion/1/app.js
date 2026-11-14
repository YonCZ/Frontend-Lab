(() => {
  "use strict";

  const KEY = "demos.notes.v1";

  const SEED = [
    {
      id: "n1",
      kind: "Quote",
      title: "Interfaces age faster than habits",
      body: "The half-life of a good interface is about three years. The habit it builds lasts a decade.",
      source: "The Shape of Screens, page 88",
      day: "12 Mar",
      related: ["n2", "n4"]
    },
    {
      id: "n2",
      kind: "Clip",
      title: "Memory palace piece",
      body: "A memory palace is just a route you already know, with new things left along it.",
      source: "theguardian.example, long read",
      day: "4 Feb",
      related: ["n1", "n4"]
    },
    {
      id: "n3",
      kind: "Call",
      title: "Onboarding call with Priya",
      body: "Cut the intro video to forty seconds. Nobody watches the second minute.",
      source: "Call, Priya Raman",
      day: "8 Mar",
      related: ["n1"]
    },
    {
      id: "n4",
      kind: "Half-thought",
      title: "Sort by intention",
      body: "What if the archive sorted by what you were trying to do, not by when you saved it?",
      source: "Typed on a walk",
      day: "21 Feb",
      related: ["n1", "n2"]
    },
    {
      id: "n5",
      kind: "Link",
      title: "The chair",
      body: "Low chair, oak, 1962. The proportions are right. The upholstery is not.",
      source: "furniturearchive.example",
      day: "17 Jan",
      related: ["n6"]
    },
    {
      id: "n6",
      kind: "Photo note",
      title: "Kitchen wall",
      body: "Warm white, matte, with a shelf at eye level. Copied from the third image.",
      source: "Screenshot",
      day: "11 Jan",
      related: ["n5"]
    }
  ];

  const $ = (sel) => document.querySelector(sel);
  const results = $("#results");
  const field = $("#q");
  const count = $("#count");
  const composer = $("#composer");
  const status = $("#status");
  const footNew = $(".recall-foot .btn-quiet");
  const panel = $(".recall");
  const fileDemo = $("#fileDemo");
  const fileToggle = $("#fileToggle");
  const fileTitle = $("#fileTitle");
  const fileStatus = $("#fileStatus");

  let notes = load();
  let savedId = null;
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
      /* Private mode: run in memory for this visit. */
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

  function termsOf(query) {
    return [...new Set(query.toLowerCase().split(/\s+/).filter((term) => term.length > 1))];
  }

  function highlight(text, query) {
    let out = escapeHTML(text);
    termsOf(query)
      .sort((a, b) => b.length - a.length)
      .forEach((term) => {
        const pattern = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        out = out.replace(new RegExp(`(${pattern})`, "gi"), "<mark>$1</mark>");
      });
    return out;
  }

  function search(query) {
    const terms = termsOf(query);
    if (!terms.length) return notes;
    return notes
      .map((note) => {
        const title = note.title.toLowerCase();
        const hay = `${note.title} ${note.body} ${note.kind} ${note.source}`.toLowerCase();
        let score = 0;
        terms.forEach((term) => {
          if (title.includes(term)) score += 5;
          else if (hay.includes(term)) score += 2;
        });
        return { note, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.note);
  }

  function shortBody(body) {
    return body.length > 86 ? `${body.slice(0, 86).trimEnd()}…` : body;
  }

  function render() {
    const query = field.value.trim();
    const list = search(query);
    count.textContent = query
      ? `${list.length} of ${notes.length} notes`
      : `${notes.length} notes in this browser`;

    if (!list.length) {
      results.innerHTML = `
        <li class="empty">
          <p>Nothing is filed under “${escapeHTML(query)}” yet. Try a word from the note itself, or one of the examples: chair, call, memory.</p>
          <button class="btn btn-quiet btn-sm" type="button" data-clear>Clear the search</button>
        </li>`;
      return;
    }

    results.innerHTML = list.map((note) => {
      const neighbours = (note.related || [])
        .map((id) => notes.find((item) => item.id === id))
        .filter(Boolean)
        .map((item) => escapeHTML(item.title));

      return `
        <li>
          <details class="note" ${note.id === savedId ? "open" : ""}>
            <summary>
              <span class="note-kind">${escapeHTML(note.kind)}</span>
              <span class="note-main">
                <span class="note-title">${highlight(note.title, query)}</span>
                <span class="note-body">${highlight(shortBody(note.body), query)}</span>
              </span>
              <span class="note-meta">
                <span>${highlight(note.source, query)}</span>
                <span>Kept ${escapeHTML(note.day)}</span>
              </span>
            </summary>
            <div class="note-full">
              <p>${highlight(note.body, query)}</p>
              <p class="note-source">Kept from ${escapeHTML(note.source)} on ${escapeHTML(note.day)}.</p>
              ${neighbours.length ? `<p class="note-source">Next to: ${neighbours.join(", ")}.</p>` : ""}
            </div>
          </details>
        </li>`;
    }).join("");

    savedId = null;
  }

  function announce(message) {
    status.textContent = message;
    status.classList.add("is-live");
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      status.classList.remove("is-live");
      status.textContent = "Saved notes live in this browser.";
    }, 4000);
  }

  function openComposer() {
    composer.hidden = false;
    results.hidden = true;
    footNew.hidden = true;
    status.textContent = "Esc closes the form.";
    const box = panel.getBoundingClientRect();
    if (box.top < 20 || box.bottom > window.innerHeight - 20) {
      panel.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    window.setTimeout(() => {
      const title = $("#note-title");
      if (title) title.focus({ preventScroll: true });
    }, 180);
  }

  function closeComposer() {
    composer.hidden = true;
    results.hidden = false;
    footNew.hidden = false;
    status.textContent = "Saved notes live in this browser.";
    $("#form-error").hidden = true;
  }

  function relatedFor(note) {
    const stop = new Set(["the", "and", "that", "with", "this", "from", "what", "when", "about", "into", "they", "your", "have"]);
    const words = `${note.title} ${note.body}`.toLowerCase().match(/[a-z]{4,}/g) || [];
    const own = new Set(words.filter((word) => !stop.has(word)));
    return notes
      .filter((item) => item.id !== note.id)
      .map((item) => {
        const others = new Set((`${item.title} ${item.body}`.toLowerCase().match(/[a-z]{4,}/g) || []).filter((word) => !stop.has(word)));
        let hits = 0;
        own.forEach((word) => { if (others.has(word)) hits += 1; });
        return { id: item.id, hits };
      })
      .filter((entry) => entry.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 2)
      .map((entry) => entry.id);
  }

  function today() {
    const date = new Date();
    const month = date.toLocaleString("en-GB", { month: "short" });
    return `${date.getDate()} ${month}`;
  }

  function submitComposer(event) {
    event.preventDefault();
    const titleField = $("#note-title");
    const bodyField = $("#note-body");
    const sourceField = $("#note-source");
    const error = $("#form-error");
    const body = bodyField.value.trim();
    let title = titleField.value.trim();

    if (!body) {
      error.textContent = "Add the note text. A title is optional.";
      error.hidden = false;
      bodyField.focus();
      return;
    }
    if (!title) {
      title = body.split(/\s+/).slice(0, 6).join(" ");
      if (body.split(/\s+/).length > 6) title += "…";
    }

    let id = "u" + Date.now();
    while (notes.some((note) => note.id === id)) id += "x";

    const note = {
      id,
      kind: "Note",
      title,
      body,
      source: sourceField.value.trim() || "Typed in this browser",
      day: today(),
      related: []
    };
    note.related = relatedFor(note);

    notes.unshift(note);
    save();
    savedId = id;
    field.value = "";
    error.hidden = true;
    composer.reset();
    closeComposer();
    render();
    announce("Saved. It is at the top of the list.");
    results.scrollTop = 0;
  }

  function clearSearch() {
    field.value = "";
    render();
    field.focus();
  }

  field.addEventListener("input", render);

  results.addEventListener("click", (event) => {
    if (event.target.closest("[data-clear]")) clearSearch();
  });

  composer.addEventListener("submit", submitComposer);
  composer.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeComposer();
      field.focus();
    }
  });

  document.querySelectorAll("[data-close-composer]").forEach((button) => {
    button.addEventListener("click", () => { closeComposer(); field.focus(); });
  });

  document.querySelectorAll("[data-open-composer]").forEach((button) => {
    button.addEventListener("click", openComposer);
  });

  document.querySelectorAll("[data-example-search]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!composer.hidden) closeComposer();
      field.value = button.dataset.exampleSearch;
      render();
      panel.scrollIntoView({ block: "center", behavior: "smooth" });
      window.setTimeout(() => field.focus({ preventScroll: true }), 320);
    });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (!composer.hidden) closeComposer();
      panel.scrollIntoView({ block: "center", behavior: "smooth" });
      field.focus({ preventScroll: true });
    }
  });

  /* The loose notes, then the same notes filed. */
  fileToggle.addEventListener("click", () => {
    const filed = fileDemo.dataset.state !== "filed";
    fileDemo.dataset.state = filed ? "filed" : "loose";
    fileToggle.setAttribute("aria-pressed", String(filed));
    fileToggle.textContent = filed ? "Scatter them again" : "File them";
    fileTitle.textContent = filed ? "Five notes, one archive" : "Five notes, five places";
    fileStatus.textContent = filed
      ? "Each one now carries a source and a day. Search finds all five."
      : "Nothing has a source yet. Press File them.";
    fileDemo.classList.remove("is-swapping");
    void fileDemo.offsetWidth;
    fileDemo.classList.add("is-swapping");
  });

  render();
})();
