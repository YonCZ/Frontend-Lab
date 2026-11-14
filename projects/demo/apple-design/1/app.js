(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const { spring, project, rubberband, reduce } = window.NoemaMotion;

  /* ---------------- data ---------------- */

  const notes = [
    {
      id: "memory",
      title: "Why memory needs a place",
      kicker: "Essay · 4 min read",
      time: "2m",
      snippet: "The mind forgets what it has nowhere to put. A page is not storage, it is a landmark.",
      tags: ["memory", "place", "recall", "writing", "brain"],
      body: [
        "The mind forgets what it has nowhere to put. Not because the thought was weak, but because it never had a location to return to.",
        "A notebook works the same way a room does. You remember the window, the chair, the light at four in the afternoon. The note comes back with the context around it.",
        "Noema's whole bet is that a second brain should feel like a *place*, not a database. Somewhere you can walk back into.",
      ],
      links: [
        ["palace", "echoes"],
        ["studio", "same place"],
        ["loops", "builds on"],
      ],
    },
    {
      id: "palace",
      title: "Memory palace, without the palace",
      kicker: "Note · 2 min read",
      time: "1h",
      snippet: "You don't need a cathedral. A kitchen counter will do.",
      tags: ["memory", "place", "method", "recall"],
      body: [
        "You don't need a cathedral. A kitchen counter will do. The technique works because a room has edges, and edges are what memory holds on to.",
        "Pick five places you pass every day. Attach one thing to each. Walk the route once before bed. That's the whole method.",
        "The palace was never the point. Having somewhere to put the thought was.",
      ],
      links: [
        ["memory", "echoes"],
        ["sleep", "source"],
      ],
    },
    {
      id: "loops",
      title: "Loops, not lists",
      kicker: "Idea · 1 min read",
      time: "3h",
      snippet: "Lists end. Loops bring you back to the thing you were circling.",
      tags: ["process", "writing", "review", "memory"],
      body: [
        "Lists end. Loops bring you back to the thing you were circling.",
        "A list is a straight line from here to done. Most thinking isn't straight. You leave a note, come back a month later, and find the sentence you were actually trying to write.",
        "So I keep a short loop of five notes I reread on Fridays. No inbox, no backlog. Just the ideas still in motion.",
      ],
      links: [
        ["memory", "builds on"],
        ["studio", "same week"],
        ["reading", "source"],
        ["sleep", "source"],
      ],
    },
    {
      id: "studio",
      title: "The studio, finally quiet",
      kicker: "Journal · 6 min read",
      time: "Yest",
      snippet: "Moved the desk to face the window. The work got easier within a day.",
      tags: ["studio", "place", "focus", "writing"],
      body: [
        "Moved the desk to face the window. The work got easier within a day. Not because the view is inspiring, but because there is less to turn away from.",
        "The room now has one obvious place to sit and one obvious thing to do there. That is most of what a studio needs to be.",
        "Wrote the first paragraph of the memory essay at 9:40 in the morning, in the chair by the window.",
      ],
      links: [
        ["memory", "same place"],
        ["palace", "same week"],
        ["loops", "same week"],
      ],
    },
    {
      id: "sleep",
      title: "Sleep is a filing system",
      kicker: "Research · 3 min read",
      time: "Mon",
      snippet: "The hippocampus replays the day and hands the useful parts to the cortex.",
      tags: ["sleep", "memory", "research", "brain"],
      body: [
        "The hippocampus replays the day and hands the useful parts to the cortex. What gets replayed is not the whole day. It is the part that still has an open question attached.",
        "This is why a problem often resolves overnight, and why a note written before bed reads differently in the morning.",
        "Source: Walker, *Why We Sleep*, chapter 6. Cross-check the replay studies before quoting this anywhere public.",
      ],
      links: [
        ["memory", "source"],
        ["palace", "source"],
        ["loops", "source"],
        ["reading", "source"],
        ["studio", "source"],
      ],
    },
    {
      id: "reading",
      title: "Reading list: autumn",
      kicker: "List · 12 items",
      time: "Sun",
      archived: true,
      snippet: "The Overstory, An Immense World, The Memory Police, Four Thousand Weeks.",
      tags: ["reading", "books", "memory", "attention"],
      body: [
        "The Overstory, Richard Powers. For the way it makes trees feel like characters with a longer memory than ours.",
        "An Immense World, Ed Yong. For the reminder that most of what is happening is outside our senses.",
        "The Memory Police, Yoko Ogawa. For the question of what a person is without the things they remember.",
        "Four Thousand Weeks, Oliver Burkeman. For the permission to stop managing time and start spending it.",
      ],
      links: [["sleep", "source"]],
    },
  ];

  const noteById = (id) => notes.find((note) => note.id === id);
  let activeId = "memory";
  let currentView = "inbox";

  /* ---------------- editor + list ---------------- */

  const listEl = $("#noteList");
  const listTitle = $("#listTitle");
  const noteCountEl = $("#noteCount");
  const sidebarBadge = $(".badge");
  const searchEl = $("#noteSearch");
  const edTitle = $("#edTitle");
  const edBody = $("#edBody");
  const edKicker = $("#edKicker");
  const edCrumb = $("#edCrumb");
  const linkList = $("#linkList");
  const linkCount = $("#linkCount");
  const saveState = $("#saveState");
  const wordCount = $("#wordCount");
  let saveTimer = 0;

  const words = (text) => (text.match(/[A-Za-z0-9''-]+/g) || []).length;

  const viewTitles = {
    inbox: "Inbox",
    today: "Today",
    all: "All notes",
    connections: "Connections",
    archive: "Archive",
  };

  function notesForView() {
    switch (currentView) {
      case "today":
        return notes.filter((note) => !note.archived && ["2m", "1h", "3h", "Now"].includes(note.time));
      case "all":
        return notes.slice();
      case "connections":
        return notes
          .filter((note) => !note.archived)
          .slice()
          .sort((a, b) => b.links.length - a.links.length);
      case "archive":
        return notes.filter((note) => note.archived);
      default:
        return notes.filter((note) => !note.archived);
    }
  }

  function setView(view) {
    currentView = view;
    $$(".side-item").forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle("is-on", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }

  function renderBody(paragraphs) {
    edBody.textContent = "";
    paragraphs.forEach((source) => {
      const p = document.createElement("p");
      const parts = String(source).split(/\*([^*]+)\*/);
      parts.forEach((part, i) => {
        if (!part) return;
        if (i % 2 === 1) {
          const em = document.createElement("em");
          em.textContent = part;
          p.appendChild(em);
        } else {
          p.appendChild(document.createTextNode(part));
        }
      });
      edBody.appendChild(p);
    });
  }

  function updateCounts() {
    const text = `${edTitle.textContent} ${edBody.textContent}`;
    const count = words(text);
    wordCount.textContent = `${count} ${count === 1 ? "word" : "words"}`;
  }

  function renderLinks(note) {
    linkList.textContent = "";
    linkCount.textContent = String(note.links.length);
    note.links.forEach(([id, tag]) => {
      const target = noteById(id);
      if (!target) return;
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.note = id;
      button.appendChild(document.createTextNode(target.title));
      const span = document.createElement("span");
      span.textContent = tag;
      button.appendChild(span);
      li.appendChild(button);
      linkList.appendChild(li);
    });
  }

  function selectNote(id, options) {
    const note = noteById(id);
    if (!note) return;
    activeId = id;
    window.clearTimeout(saveTimer);
    edTitle.textContent = note.title;
    edKicker.textContent = note.kicker;
    edCrumb.textContent = note.title;
    renderBody(note.body);
    renderLinks(note);
    updateCounts();
    saveState.textContent = "Saved just now";
    $$("[data-note]", listEl).forEach((button) => {
      if (button.dataset.note === id) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    $("#editorScroll").scrollTop = 0;

    if (!reduce() && !(options && options.quiet)) {
      const scroll = $("#editorScroll");
      scroll.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 240, easing: "cubic-bezier(.22,1,.36,1)" }
      );
    }
  }

  function renderList(filter) {
    const query = (filter || "").trim().toLowerCase();
    const shown = notesForView().filter((note) => {
      if (!query) return true;
      return `${note.title} ${note.snippet} ${note.tags.join(" ")}`.toLowerCase().includes(query);
    });

    listTitle.textContent = viewTitles[currentView] || "Inbox";
    listEl.textContent = "";
    if (!shown.length) {
      const empty = document.createElement("li");
      empty.className = "note-empty";
      empty.textContent =
        currentView === "archive"
          ? "Nothing archived. Good."
          : query
            ? "No note matches that. Press ⌘N to write it down instead."
            : "Nothing here yet.";
      listEl.appendChild(empty);
    } else {
      shown.forEach((note) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "note";
        button.dataset.note = note.id;
        if (note.id === activeId) button.setAttribute("aria-current", "true");

        const row = document.createElement("span");
        row.className = "note__row";
        const title = document.createElement("span");
        title.className = "note__title";
        title.textContent = note.title;
        const time = document.createElement("span");
        time.className = "note__time";
        time.textContent = note.time;
        row.append(title, time);

        const snippet = document.createElement("span");
        snippet.className = "note__snip";
        snippet.textContent = note.snippet;

        const links = document.createElement("span");
        links.className = "note__links";
        links.textContent = `${note.links.length} ${note.links.length === 1 ? "link" : "links"}`;

        button.append(row, snippet, links);
        li.appendChild(button);
        listEl.appendChild(li);
      });
    }

    const count = shown.length;
    noteCountEl.textContent = `${count} ${count === 1 ? "note" : "notes"}`;
    if (sidebarBadge) sidebarBadge.textContent = String(notes.length + 2);
  }

  listEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-note]");
    if (button) selectNote(button.dataset.note);
  });

  $$(".side-item").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.view === currentView) return;
      setView(button.dataset.view);
      const visible = notesForView();
      let next = activeId;
      if (!visible.some((note) => note.id === next) && visible.length) next = visible[0].id;
      renderList(searchEl.value);
      if (next !== activeId) selectNote(next, { quiet: true });
    });
  });

  linkList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-note]");
    if (button && noteById(button.dataset.note)) selectNote(button.dataset.note);
  });

  searchEl.addEventListener("input", () => renderList(searchEl.value));

  function noteFromEditor() {
    const note = noteById(activeId);
    if (!note) return;
    note.title = edTitle.textContent.trim() || "Untitled note";
    let paragraphs = Array.from(edBody.children)
      .map((p) => p.textContent.trim())
      .filter(Boolean);
    if (!paragraphs.length && edBody.textContent.trim()) {
      paragraphs = edBody.textContent.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    }
    note.body = paragraphs;
    const first = note.body[0] || "A new thought, still taking shape.";
    note.snippet = first.length > 122 ? `${first.slice(0, 119)}…` : first;
  }

  [edTitle, edBody].forEach((field) => {
    field.addEventListener("input", () => {
      noteFromEditor();
      if (field === edTitle) {
        edCrumb.textContent = edTitle.textContent.trim() || "Untitled";
        const activeButton = $(`[data-note="${activeId}"] .note__title`, listEl);
        if (activeButton) activeButton.textContent = edTitle.textContent.trim() || "Untitled note";
      }
      updateCounts();
      saveState.textContent = "Saving…";
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => {
        saveState.textContent = "Saved just now";
      }, 700);
    });
  });

  edTitle.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      edBody.focus();
    }
  });

  /* ---------------- quick capture ---------------- */

  const capture = $("#quickCapture");
  const sheet = $(".capture__sheet", capture);
  const scrim = $(".capture__scrim", capture);
  const captureInput = $("#captureInput");
  const openCaptureBtn = $("#openCapture");
  const captureKeep = $("#captureKeep");
  const grip = $("#captureGrip");
  const captureHead = $(".capture__head", capture);
  let lastFocus = null;
  let sheetSpring = null;
  let sheetY = 0;
  let dragging = false;
  let startPointerY = 0;
  let startSheetY = 0;
  let pointerId = null;
  let velocity = 0;
  let history = [];

  function setSheetY(value) {
    sheetY = value;
    sheet.style.transform = `translate3d(0,${value}px,0)`;
    scrim.style.opacity = String(Math.max(0, 1 - value / 460));
  }

  function openCapture() {
    if (!capture.hidden) return;
    lastFocus = document.activeElement;
    capture.hidden = false;
    document.body.classList.add("is-locked");
    const height = sheet.getBoundingClientRect().height + 48;
    setSheetY(height);
    if (sheetSpring) sheetSpring.stop();
    requestAnimationFrame(() => {
      capture.classList.add("is-open");
      sheetSpring = spring({
        from: height,
        to: 0,
        response: 0.46,
        damping: 0.9,
        onUpdate: setSheetY,
      });
    });
    window.setTimeout(() => captureInput.focus(), 120);
  }

  function closeCapture(releaseVelocity) {
    if (capture.hidden) return;
    const height = sheet.getBoundingClientRect().height + 48;
    if (sheetSpring) sheetSpring.stop();
    capture.classList.remove("is-open");
    sheetSpring = spring({
      from: sheetY,
      to: height,
      velocity: typeof releaseVelocity === "number" ? releaseVelocity : 0,
      response: 0.38,
      damping: 0.92,
      onUpdate: setSheetY,
      onComplete: () => {
        capture.hidden = true;
        capture.classList.remove("is-open", "is-dragging");
        scrim.style.opacity = "";
        setSheetY(0);
        document.body.classList.remove("is-locked");
        captureInput.value = "";
        captureInput.placeholder = "What's on your mind?";
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      },
    });
  }

  function keepCapture() {
    const text = captureInput.value.trim();
    if (!text) {
      captureInput.placeholder = "Write something first, then keep it.";
      captureInput.focus();
      return;
    }

    const firstLine = text.split(/\n+/)[0].replace(/\s+/g, " ").trim();
    const title = firstLine.length > 64 ? `${firstLine.slice(0, 61).trim()}…` : firstLine || "Untitled note";
    const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

    const stop = new Set(["the", "and", "that", "this", "with", "from", "what", "your", "about", "have", "into", "just", "they", "them", "then", "there", "their", "when", "where", "which", "will", "would", "could", "should", "note", "notes"]);
    const tokens = new Set(
      text.toLowerCase().match(/[a-z0-9''-]+/g)?.filter((w) => w.length > 3 && !stop.has(w)) || []
    );

    const suggested = notes
      .map((note) => {
        const haystack = `${note.title} ${note.tags.join(" ")} ${note.snippet}`.toLowerCase();
        let score = 0;
        tokens.forEach((token) => {
          if (haystack.includes(token)) score += 1;
        });
        return { note, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((entry) => [entry.note.id, "suggested"]);

    const links = suggested.length ? suggested : [["memory", "suggested"]];
    const note = {
      id: `note-${Date.now()}`,
      title,
      kicker: "New note · just now",
      time: "Now",
      snippet: paragraphs[0]?.length > 122 ? `${paragraphs[0].slice(0, 119)}…` : paragraphs[0] || title,
      tags: Array.from(tokens).slice(0, 8),
      body: paragraphs.length ? paragraphs : [text],
      links,
    };

    notes.unshift(note);
    activeId = note.id;
    setView("inbox");
    searchEl.value = "";
    renderList("");
    selectNote(note.id, { quiet: true });
    saveState.textContent = `Saved · ${links.length} ${links.length === 1 ? "link" : "links"} suggested`;
    closeCapture();
  }

  openCaptureBtn.addEventListener("click", openCapture);
  captureKeep.addEventListener("click", keepCapture);
  $$("[data-close]", capture).forEach((el) => el.addEventListener("click", () => closeCapture()));

  captureInput.addEventListener("input", () => {
    if (captureInput.placeholder !== "What's on your mind?") {
      captureInput.placeholder = "What's on your mind?";
    }
  });

  captureInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      keepCapture();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !capture.hidden) {
      event.preventDefault();
      closeCapture();
      return;
    }
    if (!capture.hidden && event.key === "Tab") {
      const focusable = $$("button, textarea, a[href], input", sheet).filter(
        (el) => !el.disabled && el.offsetParent !== null
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
    }
  });

  function beginDrag(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("button")) return;
    dragging = true;
    pointerId = event.pointerId;
    startPointerY = event.clientY;
    startSheetY = sheetY;
    velocity = 0;
    history = [{ y: event.clientY, t: performance.now() }];
    if (sheetSpring) sheetSpring.stop();
    capture.classList.add("is-dragging");
    event.currentTarget.setPointerCapture(pointerId);
    event.preventDefault();
  }

  function moveDrag(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    const delta = event.clientY - startPointerY;
    let raw = startSheetY + delta;
    if (raw < 0) raw = -rubberband(-raw, 340);
    setSheetY(raw);

    const now = performance.now();
    history.push({ y: event.clientY, t: now });
    while (history.length > 2 && now - history[0].t > 110) history.shift();
    velocity = 0;
    if (history.length > 1) {
      const first = history[0];
      const last = history[history.length - 1];
      const dt = (last.t - first.t) / 1000;
      if (dt > 0.001) velocity = (last.y - first.y) / dt;
    }
  }

  function endDrag(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    dragging = false;
    capture.classList.remove("is-dragging");
    const projected = sheetY + project(velocity);
    if (sheetY > 110 || projected > 190 || velocity > 700) {
      closeCapture(velocity);
      return;
    }
    if (sheetSpring) sheetSpring.stop();
    sheetSpring = spring({
      from: sheetY,
      to: 0,
      velocity,
      response: 0.34,
      damping: 0.84,
      onUpdate: setSheetY,
    });
  }

  [grip, captureHead].forEach((el) => {
    el.addEventListener("pointerdown", beginDrag);
    el.addEventListener("pointermove", moveDrag);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
  });

  /* ---------------- focus mode + share ---------------- */

  const appShell = $("#appDemo");
  const focusBtn = $("#focusBtn");
  const shareBtn = $("#shareBtn");
  let shareTimer = 0;

  focusBtn.addEventListener("click", () => {
    const on = focusBtn.getAttribute("aria-pressed") !== "true";
    focusBtn.setAttribute("aria-pressed", String(on));
    focusBtn.setAttribute("aria-label", on ? "Exit focus mode" : "Focus mode");
    appShell.classList.toggle("is-focus", on);
    if (!reduce()) {
      $("#editorScroll").animate([{ opacity: 0.55 }, { opacity: 1 }], {
        duration: 260,
        easing: "ease-out",
      });
    }
  });

  shareBtn.addEventListener("click", () => {
    const done = (message) => {
      saveState.textContent = message;
      window.clearTimeout(shareTimer);
      shareTimer = window.setTimeout(() => {
        saveState.textContent = "Saved just now";
      }, 1900);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => done("Link copied"))
        .catch(() => done("Copy the URL from the address bar"));
    } else {
      done("Copy the URL from the address bar");
    }
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const tag = (target.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || target.isContentEditable;

    if (event.key === "Escape" && capture.hidden && appShell.classList.contains("is-focus")) {
      focusBtn.click();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && capture.hidden) {
      event.preventDefault();
      searchEl.focus();
      searchEl.select();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n" && capture.hidden) {
      event.preventDefault();
      openCapture();
      return;
    }
    if (!typing && !event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === "n") {
      event.preventDefault();
      openCapture();
    }
  });

  /* ---------------- connection map ---------------- */

  const map = $("#connectMap");
  const mapWhy = $("#mapWhy");
  const satellites = $$(".map__sat", map);
  const defaultWhy = mapWhy.textContent;
  const mapIds = ["palace", "sleep", "studio", "loops"];

  function activateMap(button) {
    map.dataset.active = button.dataset.link;
    mapWhy.textContent = button.dataset.why;
  }

  function resetMap() {
    delete map.dataset.active;
    mapWhy.textContent = defaultWhy;
  }

  satellites.forEach((button) => {
    button.addEventListener("pointerenter", () => activateMap(button));
    button.addEventListener("focus", () => activateMap(button));
    button.addEventListener("click", () => {
      const id = mapIds[Number(button.dataset.link)];
      if (id) {
        selectNote(id);
        const app = $("#appDemo");
        app.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "center" });
        app.classList.remove("is-flash");
        void app.offsetWidth;
        app.classList.add("is-flash");
        window.setTimeout(() => app.classList.remove("is-flash"), 1100);
      }
    });
  });

  map.addEventListener("pointerleave", resetMap);
  map.addEventListener("focusout", (event) => {
    if (!map.contains(event.relatedTarget)) resetMap();
  });

  /* ---------------- recall demo ---------------- */

  const askInput = $("#askInput");
  const askResults = $("#askResults");
  const askCount = $("#askCount");
  const stopWords = new Set(["the", "and", "what", "did", "about", "read", "for", "with", "that", "this", "you", "your", "from", "where", "when", "how", "was", "were", "are", "have", "has"]);

  function highlight(text, tokens) {
    const fragment = document.createDocumentFragment();
    if (!tokens.length) {
      fragment.appendChild(document.createTextNode(text));
      return fragment;
    }
    const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(text))) {
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      const mark = document.createElement("mark");
      mark.textContent = match[0];
      fragment.appendChild(mark);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    return fragment;
  }

  function renderAsk(query) {
    const tokens = Array.from(
      new Set(
        (query || "")
          .toLowerCase()
          .match(/[a-z0-9''-]+/g)
          ?.filter((word) => word.length > 2 && !stopWords.has(word)) || []
      )
    );

    const scored = notes
      .map((note) => {
        const haystack = `${note.title} ${note.snippet} ${note.tags.join(" ")}`.toLowerCase();
        const score = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
        return { note, score };
      })
      .filter((entry) => (tokens.length ? entry.score > 0 : true))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    askResults.textContent = "";
    askCount.textContent = `${scored.length} ${scored.length === 1 ? "note" : "notes"}`;

    if (!scored.length) {
      const li = document.createElement("li");
      const empty = document.createElement("p");
      empty.className = "askbox__empty";
      empty.textContent = "Nothing yet. Try fewer words, or capture the thought before it goes.";
      li.appendChild(empty);
      askResults.appendChild(li);
      return;
    }

    scored.forEach(({ note }) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "result";
      button.dataset.note = note.id;

      const top = document.createElement("span");
      top.className = "result__top";
      const title = document.createElement("span");
      title.className = "result__title";
      title.textContent = note.title;
      const go = document.createElement("span");
      go.className = "result__go";
      go.textContent = "Open in preview";
      top.append(title, go);

      const snippet = document.createElement("span");
      snippet.className = "result__snip";
      snippet.appendChild(highlight(note.snippet, tokens));

      const meta = document.createElement("span");
      meta.className = "result__meta";
      meta.textContent = `${tokens.length ? "Best match" : "Recent"} · ${note.links.length} ${note.links.length === 1 ? "link" : "links"}`;

      button.append(top, snippet, meta);
      li.appendChild(button);
      askResults.appendChild(li);
    });
  }

  askResults.addEventListener("click", (event) => {
    const button = event.target.closest("[data-note]");
    if (!button) return;
    selectNote(button.dataset.note);
    const app = $("#appDemo");
    app.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "center" });
    app.classList.remove("is-flash");
    void app.offsetWidth;
    app.classList.add("is-flash");
    window.setTimeout(() => app.classList.remove("is-flash"), 1100);
  });

  askInput.addEventListener("input", () => renderAsk(askInput.value));

  $$(".askbox__chips button").forEach((chip) => {
    chip.addEventListener("click", () => {
      askInput.value = chip.dataset.q;
      renderAsk(askInput.value);
      askInput.focus();
    });
  });

  /* ---------------- chrome ---------------- */

  const top = $(".top");
  let scrollTicking = false;
  function onScroll() {
    top.classList.toggle("is-scrolled", window.scrollY > 8);
    scrollTicking = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.delay || 0);
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-in");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    $$(".reveal").forEach((el) => observer.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  /* ---------------- boot ---------------- */

  renderList("");
  selectNote("memory", { quiet: true });
  renderAsk("");
})();
