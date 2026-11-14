/* Demos, variant 2: Summon
   One field, a live preview, and a keyboard-first capture flow. State stays in this browser. */

(function () {
  "use strict";

  var KEY = "demos.summon.notes.v2";
  var KINDS = ["Idea", "Quote", "Link", "Call"];

  var SEED = [
    { id: "s-attention", kind: "Quote", text: "Attention is a budget, not a muscle. You cannot save it up, and you cannot buy more of it.", source: "R. Fielding, The Memory Thief, p. 62", date: "2026-11-09", tags: ["attention", "reading", "quote"] },
    { id: "s-priya", kind: "Call", text: "Priya can hold the Lisbon room until Friday. Deposit is 30%. Ask about the courtyard for dinner.", source: "Call with Priya", date: "2026-11-07", tags: ["work", "lisbon", "call"] },
    { id: "s-sourdough", kind: "Idea", text: "Sourdough: 78% hydration, four folds, 24 hours cold. The crumb opened up when I stopped rushing the bulk.", source: "Kitchen notebook", date: "2026-11-03", tags: ["kitchen", "idea"] },
    { id: "s-dashboard", kind: "Link", text: "The case against the dashboard. A dashboard answers questions nobody asked; show the thing itself, with its context.", source: "craftandquery.example, issue 14", date: "2026-10-28", tags: ["design", "reading", "link"] },
    { id: "s-shelves", kind: "Idea", text: "Kitchen shelves 32cm apart, not 40. The top jar is still reachable without the stool.", source: "Flat 12 renovation", date: "2026-09-19", tags: ["home", "kitchen", "idea"] },
    { id: "s-hierarchy", kind: "Quote", text: "Quiet interfaces need loud hierarchy. If everything whispers, nothing is heard.", source: "Studio talk, Interface, 2025", date: "2026-09-02", tags: ["design", "reading", "quote"] },
    { id: "s-iron", kind: "Call", text: "Iron levels low. Re-test in six weeks, then decide about the supplement.", source: "Dr Osei's office", date: "2026-08-21", tags: ["health", "call"] },
    { id: "s-tram", kind: "Link", text: "The Lisbon tram has run on the same overhead wires since 1901. The repair crew still casts the brackets by hand.", source: "lisbon.tram.archive", date: "2026-02-11", tags: ["lisbon", "reading", "link"] },
    { id: "s-sorbet", kind: "Idea", text: "Sea buckthorn sorbet: 320g puree, 100g sugar, 12g glucose. Too sharp alone; serve with cream.", source: "Kitchen notebook", date: "2025-12-14", tags: ["kitchen", "idea"] },
    { id: "s-city", kind: "Quote", text: "A city is a machine for remembering. You do not learn it; you are reminded of it.", source: "N. Voss, Atlas of Small Cities, p. 21", date: "2025-06-03", tags: ["reading", "lisbon", "quote"] },
    { id: "s-files", kind: "Idea", text: "The archive should be a folder of plain files. Tools come and go; the folder survives.", source: "Notes on tools", date: "2024-03-08", tags: ["tools", "design", "idea"] }
  ];

  var $ = function (sel) { return document.querySelector(sel); };
  var palette = $("#palette");
  var ask = $("#ask");
  var clearBtn = $("#ask-clear");
  var resultList = $("#result-list");
  var preview = $("#preview");
  var emptyEl = $("#pal-empty");
  var countEl = $("#pal-count");
  var heroFoot = $("#hero-foot");
  var palBody = $("#pal-body");
  var noteView = $("#note-view");
  var compose = $("#compose");
  var headResults = document.querySelector(".pal-head:not(.pal-head-note):not(.pal-head-compose)");
  var headNote = $(".pal-head-note");
  var headCompose = $(".pal-head-compose");
  var hints = $("#pal-hints");
  var textEl = $("#v2-text");
  var sourceEl = $("#v2-source");
  var errorEl = $("#compose-error");
  var toastEl = $("#toast");
  var toastText = $("#toast-text");
  var toastAction = $("#toast-action");

  var added = readAdded();
  var mode = "results";
  var query = "";
  var selectedId = null;
  var results = [];
  var toastTimer = 0;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
  var fmtShort = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

  /* ---------- storage ---------- */

  function readAdded() {
    try {
      var raw = localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (n) {
        return n && typeof n.id === "string" && typeof n.text === "string" && KINDS.indexOf(n.kind) > -1;
      });
    } catch (err) {
      return [];
    }
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(added)); } catch (err) { /* page-view only */ }
  }

  /* ---------- data helpers ---------- */

  function allNotes() {
    return added.concat(SEED).sort(function (a, b) {
      if (a.date === b.date) return 0;
      return a.date < b.date ? 1 : -1;
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function markTerms(text, q) {
    var safe = escapeHtml(text);
    var words = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!words.length) return safe;
    var unique = words.filter(function (w, i) { return words.indexOf(w) === i; });
    return safe.replace(new RegExp("(" + unique.map(escapeRegExp).join("|") + ")", "gi"), "<mark>$1</mark>");
  }

  function displayDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return isNaN(d.getTime()) ? iso : fmt.format(d);
  }

  function shortDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return isNaN(d.getTime()) ? iso : fmtShort.format(d);
  }

  function matches(note, q) {
    var haystack = [note.text, note.source, note.kind, (note.tags || []).join(" ")].join(" ").toLowerCase();
    return q.split(/\s+/).filter(Boolean).every(function (word) { return haystack.indexOf(word) > -1; });
  }

  function relatedTo(note, notes) {
    var kindTag = note.kind.toLowerCase();
    var picked = notes
      .filter(function (n) { return n.id !== note.id; })
      .map(function (n) {
        var score = (n.tags || []).filter(function (t) {
          return t !== kindTag && (note.tags || []).indexOf(t) > -1;
        }).length;
        return { note: n, score: score };
      })
      .filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score || (a.note.date < b.note.date ? 1 : -1); })
      .slice(0, 2)
      .map(function (x) { return x.note; });

    if (picked.length < 2) {
      notes.forEach(function (n) {
        if (picked.length >= 2 || n.id === note.id || n.kind !== note.kind) return;
        if (picked.some(function (p) { return p.id === n.id; })) return;
        picked.push(n);
      });
    }
    return picked;
  }

  /* ---------- rendering ---------- */

  function renderPreview(note) {
    if (!note) {
      preview.innerHTML = '<p class="prev-empty">Every note in the archive is one row away. Type a word, or press the down arrow.</p>';
      return;
    }
    var related = relatedTo(note, allNotes());
    preview.innerHTML =
      '<div class="prev-head"><span class="prev-kind">' + escapeHtml(note.kind) + "</span>" +
      '<span class="prev-date">' + shortDate(note.date) + "</span></div>" +
      '<p class="prev-text">' + markTerms(note.text, query) + "</p>" +
      '<div class="prev-block"><span class="prev-label">Source</span><p>' + markTerms(note.source || "Written in this browser", query) + "</p></div>" +
      '<div class="prev-block"><span class="prev-label">Beside it</span><div class="prev-beside">' +
      (related.length
        ? related.map(function (n) {
            return '<button type="button" data-id="' + escapeHtml(n.id) + '">' + markTerms(n.text, query) + "</button>";
          }).join("")
        : '<p class="prev-empty">Nothing yet. A note with a shared tag will sit here.</p>') +
      "</div></div>";
  }

  function renderResults() {
    var notes = allNotes();
    var q = query.trim().toLowerCase();
    results = q ? notes.filter(function (n) { return matches(n, q); }) : notes.slice();

    if (!results.some(function (n) { return n.id === selectedId; })) {
      selectedId = results.length ? results[0].id : null;
    }

    resultList.innerHTML = results.map(function (note) {
      var active = note.id === selectedId;
      return '<li><button class="res' + (active ? " is-active" : "") + '" type="button" data-id="' + escapeHtml(note.id) + '">' +
        '<span class="res-text">' + markTerms(note.text, query) + "</span>" +
        '<span class="res-date">' + shortDate(note.date) + "</span>" +
        '<span class="res-meta"><span class="res-kind">' + escapeHtml(note.kind) + "</span>" +
        '<span class="res-source">' + markTerms(note.source || "This browser", query) + "</span></span>" +
        "</button></li>";
    }).join("");

    emptyEl.hidden = results.length > 0;
    countEl.textContent = q ? results.length + " of " + notes.length + " notes" : notes.length + " notes";
    clearBtn.hidden = !q;
    renderPreview(results.filter(function (n) { return n.id === selectedId; })[0] || null);
    updateLive(notes.length);
  }

  function updateLive(total) {
    heroFoot.textContent = total + " notes in this demo. Search runs on this page, and everything you add stays in this browser.";
    Array.prototype.forEach.call(document.querySelectorAll("[data-count]"), function (el) {
      var kind = el.getAttribute("data-count");
      var list = allNotes().filter(function (n) { return n.kind === kind; });
      el.textContent = list.length + (list.length === 1 ? " note" : " notes");
      var last = document.querySelector('[data-last="' + kind + '"]');
      if (last && list.length) last.textContent = displayDate(list[0].date);
    });
  }

  function renderNote(note) {
    var related = relatedTo(note, allNotes());
    var tags = (note.tags || []).map(function (t) { return escapeHtml(t); }).join(", ");
    noteView.innerHTML =
      '<div class="note-kind">' + escapeHtml(note.kind) + "</div>" +
      '<h3 class="note-title">' + escapeHtml(note.text) + "</h3>" +
      '<div class="note-meta"><span>Kept <b>' + displayDate(note.date) + "</b></span>" +
      "<span>Source <b>" + escapeHtml(note.source || "this browser") + "</b></span></div>" +
      '<div class="note-below">' +
        '<div class="note-col"><span class="note-col-label">Tags</span><p>' + (tags || "none yet") + "</p></div>" +
        '<div class="note-col"><span class="note-col-label">Beside it</span><div class="note-links">' +
          (related.length
            ? related.map(function (n) {
                return '<button type="button" data-id="' + escapeHtml(n.id) + '"><span>' + escapeHtml(n.kind) + "</span>" + escapeHtml(n.text) + "</button>";
              }).join("")
            : '<p>Nothing yet.</p>') +
        "</div></div>" +
      "</div>";
  }

  /* ---------- modes ---------- */

  function setMode(next, id) {
    mode = next;
    headResults.hidden = next !== "results";
    headNote.hidden = next !== "note";
    headCompose.hidden = next !== "compose";
    palBody.hidden = next !== "results";
    noteView.hidden = next !== "note";
    compose.hidden = next !== "compose";

    if (next === "results") {
      hints.innerHTML = "<kbd>&uarr;</kbd><kbd>&darr;</kbd> to move <span class=\"hint-sep\">/</span> <kbd>&crarr;</kbd> to open <span class=\"hint-sep\">/</span> <kbd>Esc</kbd> to clear";
    } else if (next === "note") {
      hints.innerHTML = "<kbd>Esc</kbd> back to the archive <span class=\"hint-sep\">/</span> <kbd>&crarr;</kbd> on a neighbour opens it";
    } else {
      hints.innerHTML = "<kbd>&#8984;</kbd><kbd>&crarr;</kbd> to save <span class=\"hint-sep\">/</span> <kbd>Esc</kbd> to cancel";
    }

    if (next === "note" && id) {
      renderNote(allNotes().filter(function (n) { return n.id === id; })[0]);
    }
  }

  function openNote(id) {
    selectedId = id;
    setMode("note", id);
    $("#back-to-results").focus({ preventScroll: true });
  }

  function backToResults(focusSearch) {
    setMode("results");
    renderResults();
    if (focusSearch !== false) {
      ask.focus({ preventScroll: true });
    }
  }

  function openCompose() {
    setMode("compose");
    errorEl.textContent = "";
    textEl.focus({ preventScroll: true });
  }

  function openPalette() {
    var behavior = reduced ? "auto" : "smooth";
    palette.scrollIntoView({ behavior: behavior, block: "center" });
    if (mode !== "results") {
      setMode("results");
      renderResults();
    }
    window.setTimeout(function () {
      ask.focus({ preventScroll: true });
      ask.select();
    }, reduced ? 0 : 220);
  }

  function runSearch(term) {
    if (mode !== "results") {
      setMode("results");
    }
    query = term;
    ask.value = term;
    selectedId = null;
    renderResults();
    palette.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    if (!reduced) {
      palette.animate(
        [{ boxShadow: "0 0 0 3px rgba(169,196,255,.35)" }, { boxShadow: "0 0 0 3px rgba(169,196,255,0)" }],
        { duration: 1100, easing: "ease-out" }
      );
    }
    window.setTimeout(function () { ask.focus({ preventScroll: true }); }, reduced ? 0 : 260);
  }

  /* ---------- events ---------- */

  ask.addEventListener("input", function () {
    query = ask.value;
    selectedId = null;
    renderResults();
  });

  textEl.addEventListener("input", function () {
    if (errorEl.textContent) errorEl.textContent = "";
  });

  clearBtn.addEventListener("click", function () {
    query = "";
    ask.value = "";
    selectedId = null;
    renderResults();
    ask.focus();
  });

  resultList.addEventListener("click", function (event) {
    var row = event.target.closest(".res");
    if (!row) return;
    openNote(row.getAttribute("data-id"));
  });

  resultList.addEventListener("mouseover", function (event) {
    var row = event.target.closest(".res");
    if (!row) return;
    var id = row.getAttribute("data-id");
    if (id === selectedId) return;
    selectedId = id;
    Array.prototype.forEach.call(resultList.querySelectorAll(".res"), function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-id") === id);
    });
    renderPreview(allNotes().filter(function (n) { return n.id === id; })[0]);
  });

  resultList.addEventListener("focusin", function (event) {
    var row = event.target.closest(".res");
    if (!row) return;
    selectedId = row.getAttribute("data-id");
    Array.prototype.forEach.call(resultList.querySelectorAll(".res"), function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-id") === selectedId);
    });
    renderPreview(allNotes().filter(function (n) { return n.id === selectedId; })[0]);
  });

  preview.addEventListener("click", function (event) {
    var item = event.target.closest("[data-id]");
    if (item) openNote(item.getAttribute("data-id"));
  });

  noteView.addEventListener("click", function (event) {
    var item = event.target.closest("[data-id]");
    if (item) openNote(item.getAttribute("data-id"));
  });

  $("#back-to-results").addEventListener("click", function () { backToResults(); });
  $("#new-note").addEventListener("click", openCompose);

  document.addEventListener("click", function (event) {
    var openPal = event.target.closest("[data-open-palette]");
    if (openPal) { openPalette(); return; }

    var openComp = event.target.closest("[data-open-compose]");
    if (openComp) {
      palette.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      openCompose();
      return;
    }

    var searchBtn = event.target.closest("[data-search]");
    if (searchBtn) {
      event.preventDefault();
      runSearch(searchBtn.getAttribute("data-search"));
    }
  });

  document.addEventListener("keydown", function (event) {
    var mod = event.metaKey || event.ctrlKey;

    if (mod && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openPalette();
      return;
    }

    if (event.key === "/" && document.activeElement !== ask && document.activeElement !== textEl && document.activeElement !== sourceEl) {
      event.preventDefault();
      openPalette();
      return;
    }

    if (event.key === "Escape") {
      if (mode === "compose" || mode === "note") {
        event.preventDefault();
        backToResults();
        return;
      }
      if (document.activeElement === ask && query) {
        event.preventDefault();
        query = "";
        ask.value = "";
        selectedId = null;
        renderResults();
        return;
      }
    }

    if (mode === "results" && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      if (!palette.contains(document.activeElement)) return;
      if (!results.length) return;
      event.preventDefault();
      var index = results.findIndex(function (n) { return n.id === selectedId; });
      var next = event.key === "ArrowDown" ? index + 1 : index - 1;
      if (next < 0) next = results.length - 1;
      if (next >= results.length) next = 0;
      selectedId = results[next].id;
      Array.prototype.forEach.call(resultList.querySelectorAll(".res"), function (el) {
        var on = el.getAttribute("data-id") === selectedId;
        el.classList.toggle("is-active", on);
        if (on) el.scrollIntoView({ block: "nearest" });
      });
      renderPreview(results[next]);
      return;
    }

    if (mode === "results" && event.key === "Enter" && document.activeElement === ask) {
      if (selectedId) {
        event.preventDefault();
        openNote(selectedId);
      }
    }
  });

  compose.addEventListener("submit", function (event) {
    event.preventDefault();
    saveNote();
  });

  compose.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      saveNote();
    }
  });

  function saveNote() {
    var text = textEl.value.trim();
    if (!text) {
      errorEl.textContent = "Write a few words first.";
      textEl.focus();
      return;
    }
    var kindInput = compose.querySelector('input[name="v2kind"]:checked');
    var kind = kindInput ? kindInput.value : "Idea";
    var now = new Date();
    var iso = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    var note = {
      id: "u-" + now.getTime().toString(36),
      kind: kind,
      text: text,
      source: sourceEl.value.trim(),
      date: iso,
      tags: [kind.toLowerCase()]
    };

    added = [note].concat(added);
    persist();
    textEl.value = "";
    sourceEl.value = "";
    errorEl.textContent = "";
    compose.querySelector('input[name="v2kind"][value="Idea"]').checked = true;
    query = "";
    ask.value = "";
    selectedId = note.id;
    setMode("results");
    renderResults();
    updateLive(allNotes().length);

    showToast("Saved. It is already in the archive.", "Undo", function () {
      added = added.filter(function (n) { return n.id !== note.id; });
      persist();
      selectedId = null;
      renderResults();
      updateLive(allNotes().length);
      showToast("Removed from the archive.", null, null);
    });

    var row = resultList.querySelector('[data-id="' + note.id + '"]');
    if (row && !reduced) {
      row.animate(
        [{ backgroundColor: "rgba(169,196,255,.28)" }, { backgroundColor: "rgba(169,196,255,.1)" }],
        { duration: 900, easing: "ease-out" }
      );
    }
    ask.focus({ preventScroll: true });
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  $("#reset-demo").addEventListener("click", function () {
    added = [];
    try { localStorage.removeItem(KEY); } catch (err) { /* nothing to clear */ }
    query = "";
    ask.value = "";
    selectedId = null;
    setMode("results");
    renderResults();
    updateLive(allNotes().length);
    showToast("Demo notes reset. The eleven examples are back.", null, null);
  });

  /* ---------- toast ---------- */

  function showToast(text, actionLabel, handler) {
    window.clearTimeout(toastTimer);
    toastText.textContent = text;
    if (actionLabel && handler) {
      toastAction.hidden = false;
      toastAction.textContent = actionLabel;
      toastAction.onclick = function () {
        handler();
        toastEl.hidden = true;
      };
    } else {
      toastAction.hidden = true;
      toastAction.onclick = null;
    }
    toastEl.hidden = false;
    toastTimer = window.setTimeout(function () { toastEl.hidden = true; }, 6000);
  }

  /* ---------- start ---------- */

  Array.prototype.forEach.call(document.querySelectorAll(".wall-col"), function (col) {
    col.innerHTML = col.innerHTML + col.innerHTML;
  });

  var initial = allNotes();
  selectedId = initial[0].id;
  renderResults();
  updateLive(initial.length);
})();
