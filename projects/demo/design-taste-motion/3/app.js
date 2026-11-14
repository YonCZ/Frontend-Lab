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

  const $ = (selector) => document.querySelector(selector);
  const cards = $("#cards");
  const find = $("#find");
  const searchCount = $("#searchCount");
  const deskCount = $("#deskCount");
  const deskStatus = $("#deskStatus");
  const composer = $("#composer");
  const noteField = $("#note");
  const formError = $("#formError");

  let notes = load();
  let openId = "n1";
  let newestId = null;
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
    return notes.filter((note) => {
      const hay = `${note.title} ${note.body} ${note.source} ${note.kind}`.toLowerCase();
      return terms.every((term) => hay.includes(term));
    });
  }

  function render() {
    const query = find.value.trim();
    const list = search(query);

    searchCount.textContent = query ? `${list.length} of ${notes.length}` : `${notes.length} notes`;
    deskCount.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"} in this browser`;

    if (!list.length) {
      cards.innerHTML = `
        <li class="empty">
          Nothing on the desk contains “${escapeHTML(query)}”. Try the word you wrote down, not the one you would search for.
          <div><button class="btn btn-sm" type="button" data-clear>Clear the search</button></div>
        </li>`;
      return;
    }

    cards.innerHTML = list.map((note) => {
      const isOpen = note.id === openId;
      const related = (note.related || [])
        .map((id) => notes.find((item) => item.id === id))
        .filter(Boolean)
        .map((item) => escapeHTML(item.title));
      return `
        <li class="card ${isOpen ? "is-open" : ""} ${note.id === newestId ? "is-new" : ""}"
            role="button" tabindex="0" data-id="${escapeHTML(note.id)}"
            data-kind="${escapeHTML(note.kind)}" aria-expanded="${isOpen}">
          <div class="card-head">
            <span class="card-kind">${escapeHTML(note.kind)}</span>
            <span class="card-title">${highlight(note.title, query)}</span>
            <span class="card-day">${escapeHTML(note.day)}</span>
          </div>
          <div class="card-open">
            <p class="card-body">${highlight(note.body, query)}</p>
            <p class="card-source">Kept from ${escapeHTML(note.source)} on ${escapeHTML(note.day)}.${related.length ? ` Next to ${related.join(", ")}.` : ""}</p>
          </div>
        </li>`;
    }).join("");

    newestId = null;
  }

  function announce(message) {
    deskStatus.textContent = message;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      deskStatus.textContent = "Six example notes. Add one and search for it.";
    }, 5000);
  }

  function toggleCard(id) {
    openId = openId === id ? null : id;
    render();
    const card = cards.querySelector(`.card[data-id="${CSS.escape(String(id))}"]`);
    if (card) card.focus({ preventScroll: true });
  }

  cards.addEventListener("click", (event) => {
    if (event.target.closest("[data-clear]")) {
      find.value = "";
      render();
      find.focus();
      return;
    }
    const card = event.target.closest(".card[data-id]");
    if (card) toggleCard(card.dataset.id);
  });

  cards.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".card[data-id]");
    if (!card) return;
    event.preventDefault();
    toggleCard(card.dataset.id);
  });

  find.addEventListener("input", render);

  find.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      find.value = "";
      render();
    }
    if (event.key === "Enter") {
      const first = cards.querySelector(".card[data-id]");
      if (first) {
        event.preventDefault();
        openId = first.dataset.id;
        render();
        const card = cards.querySelector(".card[data-id]");
        if (card) card.focus({ preventScroll: true });
      }
    }
  });

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

  composer.addEventListener("submit", (event) => {
    event.preventDefault();
    const body = noteField.value.trim();
    if (!body) {
      formError.textContent = "Write the note first. One line is enough.";
      formError.hidden = false;
      noteField.focus();
      return;
    }
    formError.hidden = true;

    const words = body.split(/\s+/);
    let title = words.slice(0, 7).join(" ");
    if (words.length > 7) title += "…";
    let id = "u" + Date.now();
    while (notes.some((note) => note.id === id)) id += "x";

    const note = {
      id,
      kind: "Note",
      title,
      body,
      source: "Typed in this browser",
      day: today(),
      related: []
    };
    note.related = relatedFor(note);

    notes.unshift(note);
    save();
    openId = id;
    newestId = id;
    find.value = "";
    noteField.value = "";
    render();
    cards.scrollTop = 0;
    const card = cards.querySelector(`.card[data-id="${CSS.escape(id)}"]`);
    if (card) card.focus({ preventScroll: true });
    announce(note.related.length
      ? `Saved. Linked to ${note.related.length} nearby ${note.related.length === 1 ? "note" : "notes"}.`
      : "Saved to the desk. Another note with a shared word will link it.");
  });

  document.querySelectorAll("[data-focus-composer]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#top").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => noteField.focus({ preventScroll: true }), 320);
    });
  });

  render();
})();
