/* Demos, variant 1: Ledger
   A local archive: capture a note, search it, select it, keep it in this browser. */

(function () {
  "use strict";

  var KEY = "demos.ledger.notes.v1";
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
  var listEl = $("#note-list");
  var readerEl = $("#reader");
  var searchEl = $("#search");
  var clearEl = $("#search-clear");
  var countEl = $("#result-count");
  var totalEl = $("#total-count");
  var statusEl = $("#status");
  var emptyEl = $("#index-empty");
  var composer = $("#composer");
  var textEl = $("#note-text");
  var sourceEl = $("#note-source");
  var errorEl = $("#composer-error");
  var toastEl = $("#toast");
  var toastText = $("#toast-text");
  var toastAction = $("#toast-action");
  var appEl = $("#app");

  var added = readAdded();
  var query = "";
  var selectedId = null;
  var lastOpener = null;
  var toastTimer = 0;
  var formatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    try {
      localStorage.setItem(KEY, JSON.stringify(added));
    } catch (err) {
      /* the demo still works for this page view */
    }
  }

  /* ---------- helpers ---------- */

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
    var words = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 1; });
    var safe = escapeHtml(text);
    if (!words.length) return safe;
    var unique = words.filter(function (w, i) { return words.indexOf(w) === i; });
    var re = new RegExp("(" + unique.map(escapeRegExp).join("|") + ")", "gi");
    return safe.replace(re, "<mark>$1</mark>");
  }

  function displayDate(iso) {
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d.getTime())) return iso;
    return formatter.format(d);
  }

  function matches(note, q) {
    var haystack = [note.text, note.source, note.kind, (note.tags || []).join(" ")].join(" ").toLowerCase();
    return q.split(/\s+/).filter(Boolean).every(function (word) {
      return haystack.indexOf(word) > -1;
    });
  }

  function shortDate(iso) {
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d);
  }

  function currentResults() {
    var q = query.trim().toLowerCase();
    var notes = allNotes();
    return q ? notes.filter(function (n) { return matches(n, q); }) : notes;
  }

  function relatedTo(note, notes) {
    var kindTag = note.kind.toLowerCase();
    var scored = notes
      .filter(function (n) { return n.id !== note.id; })
      .map(function (n) {
        var score = (n.tags || []).filter(function (t) {
          return t !== kindTag && (note.tags || []).indexOf(t) > -1;
        }).length;
        return { note: n, score: score };
      })
      .filter(function (item) { return item.score > 0; })
      .sort(function (a, b) {
        return b.score - a.score || (a.note.date < b.note.date ? 1 : -1);
      })
      .slice(0, 2)
      .map(function (item) { return item.note; });

    if (scored.length < 2) {
      notes.forEach(function (n) {
        if (scored.length >= 2) return;
        if (n.id === note.id || n.kind !== note.kind) return;
        if (scored.some(function (s) { return s.id === n.id; })) return;
        scored.push(n);
      });
    }
    return scored;
  }

  /* ---------- rendering ---------- */

  function renderCounts(results, total) {
    var q = query.trim();
    countEl.textContent = q ? results.length + " of " + total : total + (total === 1 ? " note" : " notes");
    totalEl.textContent = String(total);
    statusEl.textContent = total + (total === 1 ? " note" : " notes") + " kept in this browser" +
      (added.length ? ", " + added.length + " added here" : "");
    clearEl.hidden = !q;
  }

  function renderList(results) {
    if (!results.length) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    listEl.innerHTML = results.map(function (note) {
      var active = note.id === selectedId;
      return '<li><button class="note-row' + (active ? " is-active" : "") + '" type="button" data-id="' + escapeHtml(note.id) + '">' +
        '<span class="note-meta"><span class="note-kind">' + escapeHtml(note.kind) + '</span>' +
        '<span class="note-date">' + shortDate(note.date) + '</span></span>' +
        '<span class="note-snippet">' + markTerms(note.text, query) + '</span>' +
        '</button></li>';
    }).join("");
  }

  function renderReader(note, results) {
    if (!note) {
      var q = escapeHtml(query.trim());
      readerEl.innerHTML = '<div class="reader-empty"><strong>No match for &ldquo;' + q + '&rdquo;.</strong>' +
        'Try a word from the note, the person who told it to you, or the place it happened. ' +
        '<button class="link" type="button" data-clear>Clear the search</button></div>';
      return;
    }
    var related = relatedTo(note, allNotes());
    var source = note.source ? note.source : "Written in this browser";
    var beside = related.length
      ? related.map(function (n) {
          return '<button class="beside-item" type="button" data-id="' + escapeHtml(n.id) + '">' +
            '<span>' + escapeHtml(n.kind) + '</span><span>' + markTerms(n.text, query) + '</span></button>';
        }).join("")
      : '<p class="reader-empty" style="padding:2px 0 0;font-size:12.5px">Nothing yet. A note that shares a tag will sit here.</p>';

    var tags = (note.tags || []).map(function (tag) {
      return '<button class="tag-btn" type="button" data-search="' + escapeHtml(tag) + '">' + escapeHtml(tag) + '</button>';
    }).join("");

    readerEl.innerHTML =
      '<div class="reader-head"><span class="reader-kind">' + escapeHtml(note.kind) + '</span>' +
      '<span class="reader-date">' + displayDate(note.date) + '</span></div>' +
      '<p class="reader-text">' + markTerms(note.text, query) + '</p>' +
      '<div class="reader-bottom">' +
        '<div class="reader-source"><span class="reader-label">Source</span><p>' + markTerms(source, query) + '</p></div>' +
        '<div class="reader-beside"><span class="reader-label">Beside it</span><div class="beside-list">' + beside + '</div></div>' +
        (tags ? '<div class="reader-tags"><span class="reader-label">Tags</span>' + tags + '</div>' : '') +
      '</div>';
  }

  function renderAll() {
    var notes = allNotes();
    var results = currentResults();

    if (!results.some(function (n) { return n.id === selectedId; })) {
      selectedId = results.length ? results[0].id : null;
    }

    renderCounts(results, notes.length);
    renderList(results);

    var selected = results.filter(function (n) { return n.id === selectedId; })[0] || null;
    renderReader(selected, results);
  }

  function selectNote(id) {
    var note = allNotes().filter(function (n) { return n.id === id; })[0];
    if (!note) return;
    if (!currentResults().some(function (n) { return n.id === id; })) {
      query = "";
      searchEl.value = "";
      renderAll();
    }
    selectedId = id;
    Array.prototype.forEach.call(listEl.querySelectorAll(".note-row"), function (row) {
      row.classList.toggle("is-active", row.getAttribute("data-id") === id);
    });
    renderReader(note, currentResults());
  }

  /* ---------- search ---------- */

  function setQuery(value, options) {
    query = value || "";
    searchEl.value = query;
    var results = currentResults();
    if (!results.some(function (n) { return n.id === selectedId; })) {
      selectedId = results.length ? results[0].id : null;
    }
    renderCounts(results, allNotes().length);
    renderList(results);
    var selected = results.filter(function (n) { return n.id === selectedId; })[0] || null;
    renderReader(selected, results);
    if (options && options.scrollList) listEl.scrollTop = 0;
  }

  searchEl.addEventListener("input", function () {
    setQuery(searchEl.value, { scrollList: true });
  });

  textEl.addEventListener("input", function () {
    if (errorEl.textContent) errorEl.textContent = "";
  });

  clearEl.addEventListener("click", function () {
    setQuery("");
    searchEl.focus();
  });

  document.addEventListener("click", function (event) {
    var clearBtn = event.target.closest("[data-clear]");
    if (clearBtn) {
      setQuery("");
      searchEl.focus();
      return;
    }

    var row = event.target.closest(".note-row");
    if (row) {
      selectNote(row.getAttribute("data-id"));
      return;
    }

    var beside = event.target.closest(".beside-item");
    if (beside) {
      selectNote(beside.getAttribute("data-id"));
      return;
    }

    var searchBtn = event.target.closest("[data-search]");
    if (searchBtn) {
      event.preventDefault();
      runSearch(searchBtn.getAttribute("data-search"));
      return;
    }

    var opener = event.target.closest("[data-open-composer]");
    if (opener) {
      event.preventDefault();
      openComposer(opener);
      return;
    }

    var resetBtn = event.target.closest("#reset-demo, #reset-demo-2");
    if (resetBtn) {
      resetDemo();
    }
  });

  function runSearch(term) {
    setQuery(term);
    appEl.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    appEl.classList.add("is-flash");
    window.setTimeout(function () { appEl.classList.remove("is-flash"); }, 1200);
  }

  /* ---------- capture ---------- */

  function openComposer(opener) {
    lastOpener = opener || null;
    composer.hidden = false;
    errorEl.textContent = "";
    appEl.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    textEl.focus({ preventScroll: true });
  }

  function closeComposer(returnFocus) {
    composer.hidden = true;
    errorEl.textContent = "";
    if (returnFocus && lastOpener && document.contains(lastOpener)) {
      lastOpener.focus({ preventScroll: true });
    }
  }

  $("#composer-close").addEventListener("click", function () {
    closeComposer(true);
  });

  document.addEventListener("keydown", function (event) {
    var mod = event.metaKey || event.ctrlKey;

    if (mod && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (!searchEl.offsetParent) return;
      searchEl.focus();
      searchEl.select();
      return;
    }

    if (event.key === "Escape") {
      if (!composer.hidden) {
        closeComposer(true);
        return;
      }
      if (document.activeElement === searchEl && query) {
        setQuery("");
        return;
      }
    }

    if (event.key === "/" && document.activeElement !== textEl && document.activeElement !== sourceEl &&
        document.activeElement !== searchEl && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      searchEl.focus();
    }
  });

  composer.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = textEl.value.trim();
    if (!text) {
      errorEl.textContent = "Write a few words first. A fragment is enough.";
      textEl.focus();
      return;
    }
    errorEl.textContent = "";

    var kindInput = composer.querySelector('input[name="kind"]:checked');
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

    var fromRect = textEl.getBoundingClientRect();

    added = [note].concat(added);
    persist();
    selectedId = note.id;
    query = "";
    searchEl.value = "";

    textEl.value = "";
    sourceEl.value = "";
    composer.querySelector('input[name="kind"][value="Idea"]').checked = true;
    closeComposer(false);

    renderAll();
    var newRow = listEl.querySelector('[data-id="' + note.id + '"]');
    if (newRow) {
      newRow.classList.add("is-filed");
      window.setTimeout(function () { newRow.classList.remove("is-filed"); }, 1400);
    }
    fileToArchive(text, fromRect, newRow);
    showToast("Saved to your archive", "Undo", function () {
      added = added.filter(function (n) { return n.id !== note.id; });
      persist();
      selectedId = null;
      renderAll();
      showToast("Removed from the archive", null, null);
    });
  });

  composer.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      composer.requestSubmit();
    }
  });

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function fileToArchive(text, fromRect, targetRow) {
    if (reduced || !targetRow) return;
    var toRect = targetRow.getBoundingClientRect();
    if (!fromRect.width || !toRect.width) return;

    var ghost = document.createElement("div");
    ghost.className = "ghost";
    ghost.textContent = text.slice(0, 110);
    ghost.style.left = fromRect.left + "px";
    ghost.style.top = fromRect.top + "px";
    ghost.style.width = Math.min(fromRect.width, 300) + "px";
    document.body.appendChild(ghost);

    var dx = toRect.left + 14 - fromRect.left;
    var dy = toRect.top + 10 - fromRect.top;
    var scale = Math.max(0.32, Math.min(0.62, toRect.width / fromRect.width));

    var animation = ghost.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: "translate(" + dx + "px," + dy + "px) scale(" + scale + ")", opacity: 0 }
      ],
      { duration: 520, easing: "cubic-bezier(.32,.72,0,1)" }
    );
    animation.onfinish = function () { ghost.remove(); };
    animation.oncancel = function () { ghost.remove(); };
  }

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

  /* ---------- reset ---------- */

  function resetDemo() {
    added = [];
    try { localStorage.removeItem(KEY); } catch (err) { /* nothing to clear */ }
    selectedId = null;
    setQuery("");
    showToast("Demo notes reset. The eleven examples are back.", null, null);
  }

  /* ---------- start ---------- */

  searchEl.value = "";
  renderAll();
})();
