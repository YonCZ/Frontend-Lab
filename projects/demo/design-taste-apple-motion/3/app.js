/* Demos, variant 3: Atlas
   A board of notes with drawn threads, search that dims the map, and a pin-it flow. */

(function () {
  "use strict";

  var KEY = "demos.atlas.notes.v3";
  var KINDS = ["Idea", "Quote", "Link", "Call"];
  var CLUSTERS = ["reading", "work", "home"];

  var SEED = [
    { id: "s-attention", kind: "Quote", cluster: "reading", col: 0, text: "Attention is a budget, not a muscle. You cannot save it up, and you cannot buy more of it.", source: "R. Fielding, The Memory Thief, p. 62", date: "2026-11-09", tags: ["attention", "reading", "quote"], links: ["s-hierarchy", "s-dashboard", "s-city"] },
    { id: "s-priya", kind: "Call", cluster: "work", col: 1, text: "Priya can hold the Lisbon room until Friday. Deposit is 30%. Ask about the courtyard for dinner.", source: "Call with Priya", date: "2026-11-07", tags: ["work", "lisbon", "call"], links: ["s-city", "s-tram"] },
    { id: "s-sourdough", kind: "Idea", cluster: "home", col: 2, text: "Sourdough: 78% hydration, four folds, 24 hours cold. The crumb opened up when I stopped rushing the bulk.", source: "Kitchen notebook", date: "2026-11-03", tags: ["kitchen", "idea"], links: ["s-shelves", "s-sorbet"] },
    { id: "s-dashboard", kind: "Link", cluster: "reading", col: 1, text: "The case against the dashboard. A dashboard answers questions nobody asked; show the thing itself, with its context.", source: "craftandquery.example, issue 14", date: "2026-10-28", tags: ["design", "reading", "link"], links: ["s-files", "s-hierarchy"] },
    { id: "s-shelves", kind: "Idea", cluster: "home", col: 2, text: "Kitchen shelves 32cm apart, not 40. The top jar is still reachable without the stool.", source: "Flat 12 renovation", date: "2026-09-19", tags: ["home", "kitchen", "idea"], links: ["s-sorbet"] },
    { id: "s-hierarchy", kind: "Quote", cluster: "reading", col: 0, text: "Quiet interfaces need loud hierarchy. If everything whispers, nothing is heard.", source: "Studio talk, Interface, 2025", date: "2026-09-02", tags: ["design", "reading", "quote"], links: ["s-dashboard"] },
    { id: "s-iron", kind: "Call", cluster: "work", col: 3, text: "Iron levels low. Re-test in six weeks, then decide about the supplement.", source: "Dr Osei's office", date: "2026-08-21", tags: ["health", "call"], links: [] },
    { id: "s-tram", kind: "Link", cluster: "reading", col: 1, text: "The Lisbon tram has run on the same overhead wires since 1901. The repair crew still casts the brackets by hand.", source: "lisbon.tram.archive", date: "2026-02-11", tags: ["lisbon", "reading", "link"], links: ["s-priya"] },
    { id: "s-sorbet", kind: "Idea", cluster: "home", col: 2, text: "Sea buckthorn sorbet: 320g puree, 100g sugar, 12g glucose. Too sharp alone; serve with cream.", source: "Kitchen notebook", date: "2025-12-14", tags: ["kitchen", "idea"], links: [] },
    { id: "s-city", kind: "Quote", cluster: "reading", col: 0, text: "A city is a machine for remembering. You do not learn it; you are reminded of it.", source: "N. Voss, Atlas of Small Cities, p. 21", date: "2025-06-03", tags: ["reading", "lisbon", "quote"], links: ["s-tram"] },
    { id: "s-files", kind: "Idea", cluster: "work", col: 3, text: "The archive should be a folder of plain files. Tools come and go; the folder survives.", source: "Notes on tools", date: "2024-03-08", tags: ["tools", "design", "idea"], links: [] }
  ];

  var $ = function (sel) { return document.querySelector(sel); };
  var board = $("#board");
  var boardCanvas = $("#board-canvas");
  var boardQuery = $("#board-query");
  var boardClear = $("#board-clear");
  var boardStatus = $("#board-status");
  var boardEmpty = $("#board-empty");
  var threadsSvg = $("#threads");
  var capture = $("#capture");
  var textEl = $("#new-text");
  var sourceEl = $("#new-source");
  var captureError = $("#capture-error");
  var dialog = $("#note-dialog");
  var dialogIn = $("#dialog-in");
  var trail = $("#trail");
  var toastEl = $("#toast");
  var toastText = $("#toast-text");
  var toastAction = $("#toast-action");

  var added = readAdded();
  var query = "";
  var threadIds = [];
  var toastTimer = 0;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
  var fmtShort = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
  var THREAD = ["s-attention", "s-hierarchy", "s-dashboard"];

  /* ---------- storage ---------- */

  function readAdded() {
    try {
      var raw = localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (n) {
        return n && typeof n.id === "string" && typeof n.text === "string" && KINDS.indexOf(n.kind) > -1;
      }).map(function (n) {
        if (CLUSTERS.indexOf(n.cluster) === -1) n.cluster = clusterForKind(n.kind);
        if (typeof n.col !== "number") delete n.col;
        return n;
      });
    } catch (err) {
      return [];
    }
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(added)); } catch (err) { /* page-view only */ }
  }

  /* ---------- data helpers ---------- */

  function clusterForKind(kind) {
    if (kind === "Call") return "work";
    if (kind === "Idea") return "home";
    return "reading";
  }

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

  function displayDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return isNaN(d.getTime()) ? iso : fmt.format(d);
  }

  function shortDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return isNaN(d.getTime()) ? iso : fmtShort.format(d);
  }

  function matches(note, q) {
    var haystack = [note.text, note.source, note.kind, note.cluster, (note.tags || []).join(" ")].join(" ").toLowerCase();
    return q.split(/\s+/).filter(Boolean).every(function (word) { return haystack.indexOf(word) > -1; });
  }

  function relatedTo(note, notes) {
    var kindTag = note.kind.toLowerCase();
    var byId = {};
    notes.forEach(function (n) { byId[n.id] = n; });
    var explicit = Array.isArray(note.links)
      ? note.links.map(function (id) { return byId[id]; }).filter(Boolean).slice(0, 2)
      : [];
    var picked = explicit.length ? explicit : notes
      .filter(function (n) { return n.id !== note.id; })
      .map(function (n) {
        var score = (n.tags || []).filter(function (t) {
          return t !== kindTag && t !== note.cluster && (note.tags || []).indexOf(t) > -1;
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

  function relatedPairs() {
    var notes = allNotes();
    var byId = {};
    notes.forEach(function (n) { byId[n.id] = n; });
    var pairs = [];
    var seen = {};

    function add(a, b) {
      if (!a || !b || a === b || !byId[a] || !byId[b]) return;
      var key = a < b ? a + "|" + b : b + "|" + a;
      if (seen[key]) return;
      seen[key] = 1;
      pairs.push({ a: a, b: b });
    }

    notes.forEach(function (note) {
      if (Array.isArray(note.links)) {
        note.links.forEach(function (id) { add(note.id, id); });
      } else {
        var same = notes.filter(function (m) {
          return m.id !== note.id && m.cluster === note.cluster;
        })[0];
        if (same) add(note.id, same.id);
      }
    });

    return pairs.slice(0, 8);
  }

  function colOf(note) {
    if (typeof note.col === "number") return note.col;
    return { reading: 0, work: 1, home: 2 }[note.cluster] || 0;
  }

  /* ---------- board ---------- */

  function cardHtml(note, isNew) {
    var label = note.text.length > 70 ? note.text.slice(0, 70) + "..." : note.text;
    return '<button class="card' + (isNew ? " is-new" : "") + '" type="button" data-note="' + escapeHtml(note.id) + '" data-cluster="' + escapeHtml(note.cluster) + '" aria-label="Open note: ' + escapeHtml(label) + '">' +
      '<span class="card-top"><span class="card-dot"></span><span class="card-kind">' + escapeHtml(note.kind) + '</span>' +
      '<span class="card-date">' + shortDate(note.date) + '</span></span>' +
      '<span class="card-text">' + escapeHtml(note.text) + '</span>' +
      '<span class="card-source">' + escapeHtml(note.source || "Written in this browser") + '</span>' +
      '</button>';
  }

  function renderBoard(newId) {
    var cols = [[], [], [], []];
    allNotes().forEach(function (note) {
      var c = colOf(note);
      if (c < 0 || c > 3) c = 0;
      cols[c].push(note);
    });
    Array.prototype.forEach.call(boardCanvas.querySelectorAll(".board-col"), function (col, index) {
      col.innerHTML = cols[index].map(function (note) { return cardHtml(note, note.id === newId); }).join("");
    });
    attachCardHover();
  }

  function attachCardHover() {
    Array.prototype.forEach.call(board.querySelectorAll(".card"), function (card) {
      card.addEventListener("pointerenter", function () {
        drawThreads(baseLit(), card.getAttribute("data-note"));
      });
      card.addEventListener("pointerleave", function () {
        drawThreads(baseLit(), null);
      });
    });
  }

  function baseLit() {
    if (threadIds.length) return threadIds.slice();
    if (query.trim()) {
      return allNotes().filter(function (n) { return matches(n, query.trim().toLowerCase()); }).map(function (n) { return n.id; });
    }
    return null;
  }

  function drawThreads(litIds, hoverId) {
    var svgRect = threadsSvg.getBoundingClientRect();
    if (!svgRect.width) return;
    threadsSvg.setAttribute("viewBox", "0 0 " + Math.round(svgRect.width) + " " + Math.round(svgRect.height));
    var lit = new Set(litIds || []);
    if (hoverId) lit.add(hoverId);

    var paths = relatedPairs().map(function (pair) {
      var a = board.querySelector('.card[data-note="' + pair.a + '"]');
      var b = board.querySelector('.card[data-note="' + pair.b + '"]');
      if (!a || !b) return "";
      var ar = a.getBoundingClientRect();
      var br = b.getBoundingClientRect();
      var ax = ar.left - svgRect.left + ar.width / 2;
      var ay = ar.top - svgRect.top + ar.height / 2;
      var bx = br.left - svgRect.left + br.width / 2;
      var by = br.top - svgRect.top + br.height / 2;
      var d;

      if (Math.abs(bx - ax) > Math.abs(by - ay)) {
        var sx = bx > ax ? ar.right - svgRect.left : ar.left - svgRect.left;
        var ex = bx > ax ? br.left - svgRect.left : br.right - svgRect.left;
        var mx = (sx + ex) / 2;
        d = "M" + sx + " " + ay + " C" + mx + " " + ay + "," + mx + " " + by + "," + ex + " " + by;
      } else {
        var sy = by > ay ? ar.bottom - svgRect.top : ar.top - svgRect.top;
        var ey = by > ay ? br.top - svgRect.top : br.bottom - svgRect.top;
        var my = (sy + ey) / 2;
        d = "M" + ax + " " + sy + " C" + ax + " " + my + "," + bx + " " + my + "," + bx + " " + ey;
      }

      var on = lit.has(pair.a) || lit.has(pair.b);
      return '<path d="' + d + '"' + (on ? ' class="is-lit"' : "") + "/>";
    }).join("");

    threadsSvg.innerHTML = paths;
  }

  function applySearch() {
    var q = query.trim().toLowerCase();
    var notes = allNotes();
    var matched = q ? notes.filter(function (n) { return matches(n, q); }) : notes;
    var matchIds = new Set(matched.map(function (n) { return n.id; }));
    var threadSet = new Set(threadIds);
    var cards = board.querySelectorAll(".card");

    Array.prototype.forEach.call(cards, function (card) {
      var id = card.getAttribute("data-note");
      var dim = false;
      var hit = false;
      if (threadIds.length) {
        dim = !threadSet.has(id);
      } else if (q) {
        dim = !matchIds.has(id);
        hit = matchIds.has(id);
      }
      card.classList.toggle("is-dim", dim);
      card.classList.toggle("is-hit", hit);
      card.classList.toggle("is-thread", threadIds.length > 0 && threadSet.has(id));
    });

    if (threadIds.length) {
      boardStatus.textContent = threadIds.length + " notes in this thread";
    } else if (q) {
      boardStatus.textContent = matched.length + " of " + notes.length + " notes match \u201C" + query.trim() + "\u201D";
    } else {
      boardStatus.textContent = notes.length + " notes on the board";
    }

    boardEmpty.hidden = !(q && !matched.length);
    boardClear.hidden = !(q || threadIds.length);
    Array.prototype.forEach.call(document.querySelectorAll(".cluster[data-cluster]"), function (btn) {
      btn.setAttribute("aria-pressed", String(q === btn.getAttribute("data-cluster")));
    });
    drawThreads(baseLit(), null);
  }

  /* ---------- cluster section ---------- */

  function updateCounts() {
    var notes = allNotes();
    CLUSTERS.forEach(function (cluster) {
      var count = notes.filter(function (n) { return n.cluster === cluster; }).length;
      Array.prototype.forEach.call(document.querySelectorAll('[data-cluster-count="' + cluster + '"]'), function (el) {
        el.textContent = String(count);
      });
      var list = document.querySelector('[data-cluster-list="' + cluster + '"]');
      if (!list) return;
      var items = notes.filter(function (n) { return n.cluster === cluster; }).slice(0, 3);
      list.innerHTML = items.length
        ? items.map(function (n) {
            return '<li><button class="cluster-item" type="button" data-note="' + escapeHtml(n.id) + '">' +
              '<span class="cluster-item-kind">' + escapeHtml(n.kind) + "</span>" +
              '<span class="cluster-item-text">' + escapeHtml(n.text) + "</span></button></li>";
          }).join("")
        : '<li class="cluster-empty">Nothing here yet. Pin a note and it will land here.</li>';
    });
  }

  /* ---------- trail ---------- */

  function renderTrail() {
    var notes = allNotes();
    var nodes = THREAD.map(function (id) {
      return notes.filter(function (n) { return n.id === id; })[0];
    }).filter(Boolean);
    var html = "";
    nodes.forEach(function (n, i) {
      if (i) html += '<div class="trail-link" aria-hidden="true"></div>';
      html += '<button class="trail-node" type="button" data-note="' + escapeHtml(n.id) + '">' +
        '<span class="trail-kind">' + escapeHtml(n.kind) + "</span>" +
        '<span class="trail-text">' + escapeHtml(n.text) + "</span>" +
        '<span class="trail-source">' + escapeHtml(n.source || "This browser") + "</span></button>";
    });
    trail.innerHTML = html;
  }

  /* ---------- dialog ---------- */

  function openNote(id) {
    var note = allNotes().filter(function (n) { return n.id === id; })[0];
    if (!note) return;
    var related = relatedTo(note, allNotes());
    var tags = (note.tags || []).filter(function (t) { return t !== note.cluster && t !== note.kind.toLowerCase(); }).map(function (t) {
      return '<button type="button" data-tag="' + escapeHtml(t) + '">' + escapeHtml(t) + "</button>";
    }).join("");

    dialogIn.innerHTML =
      '<button class="dialog-close" type="button" data-close-dialog aria-label="Close the note">' +
        '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>' +
      '<div class="dialog-kicker"><span class="dot dot-' + escapeHtml(note.cluster) + '"></span>' +
        escapeHtml(note.kind) + " in " + escapeHtml(note.cluster.charAt(0).toUpperCase() + note.cluster.slice(1)) + "</div>" +
      '<h3 class="dialog-title" id="dialog-title">' + escapeHtml(note.text) + "</h3>" +
      '<div class="dialog-rows">' +
        '<div class="dialog-row"><div class="dialog-row-label">Source</div><div class="dialog-row-value">' + escapeHtml(note.source || "Written in this browser") + "</div></div>" +
        '<div class="dialog-row"><div class="dialog-row-label">Kept</div><div class="dialog-row-value">' + displayDate(note.date) + "</div></div>" +
      "</div>" +
      (tags ? '<div class="dialog-block"><div class="dialog-block-label">Tags</div><div class="dialog-tags">' + tags + "</div></div>" : "") +
      '<div class="dialog-block"><div class="dialog-block-label">Beside it</div><div class="dialog-links">' +
        (related.length
          ? related.map(function (n) {
              return '<button class="dialog-link" type="button" data-note="' + escapeHtml(n.id) + '">' +
                '<span class="dialog-link-kind">' + escapeHtml(n.kind) + "</span>" +
                '<span class="dialog-link-text">' + escapeHtml(n.text) + "</span></button>";
            }).join("")
          : '<p class="dialog-empty">Nothing yet. A note with a shared tag will sit here.</p>') +
      "</div></div>";

    if (!dialog.open) dialog.showModal();
    var close = dialogIn.querySelector("[data-close-dialog]");
    if (close) close.focus({ preventScroll: true });
  }

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
      return;
    }
    var closer = event.target.closest("[data-close-dialog]");
    if (closer) { dialog.close(); return; }
    var tag = event.target.closest("[data-tag]");
    if (tag) {
      dialog.close();
      setQuery(tag.getAttribute("data-tag"));
      document.getElementById("board").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      return;
    }
    var noteBtn = event.target.closest("[data-note]");
    if (noteBtn) openNote(noteBtn.getAttribute("data-note"));
  });

  /* ---------- search and clusters ---------- */

  function setQuery(value) {
    query = value || "";
    boardQuery.value = query;
    threadIds = [];
    applySearch();
  }

  boardQuery.addEventListener("input", function () {
    query = boardQuery.value;
    threadIds = [];
    applySearch();
  });

  textEl.addEventListener("input", function () {
    if (captureError.textContent) captureError.textContent = "";
  });

  boardClear.addEventListener("click", function () {
    setQuery("");
    boardQuery.focus();
  });

  document.addEventListener("click", function (event) {
    var noteBtn = event.target.closest("[data-note]");
    if (noteBtn && !dialog.contains(noteBtn)) {
      openNote(noteBtn.getAttribute("data-note"));
      return;
    }

    var clusterBtn = event.target.closest("[data-cluster]");
    if (clusterBtn) {
      var cluster = clusterBtn.getAttribute("data-cluster");
      if (query.trim().toLowerCase() === cluster) {
        setQuery("");
      } else {
        setQuery(cluster);
      }
      if (!clusterBtn.closest(".board-bar")) {
        board.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      }
      return;
    }

    var openCapture = event.target.closest("[data-focus-capture]");
    if (openCapture) {
      event.preventDefault();
      capture.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      textEl.focus({ preventScroll: true });
      return;
    }

    var openSearch = event.target.closest("[data-focus-search]");
    if (openSearch) {
      event.preventDefault();
      board.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      boardQuery.focus({ preventScroll: true });
      return;
    }

    var reset = event.target.closest("#reset-demo");
    if (reset) resetDemo();
  });

  $("#show-thread").addEventListener("click", function () {
    threadIds = THREAD.slice();
    query = "";
    boardQuery.value = "";
    applySearch();
    board.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  });

  /* ---------- capture ---------- */

  capture.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = textEl.value.trim();
    if (!text) {
      captureError.textContent = "Write a few words first. A fragment is enough.";
      textEl.focus();
      return;
    }
    captureError.textContent = "";

    var kindInput = capture.querySelector('input[name="atlas-kind"]:checked');
    var kind = kindInput ? kindInput.value : "Idea";
    var cluster = clusterForKind(kind);
    var notes = allNotes();
    var counts = [0, 0, 0, 0];
    notes.forEach(function (n) { counts[colOf(n)]++; });
    var col = counts.indexOf(Math.min.apply(null, counts));

    var now = new Date();
    var iso = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    var note = {
      id: "u-" + now.getTime().toString(36),
      kind: kind,
      cluster: cluster,
      col: col,
      text: text,
      source: sourceEl.value.trim(),
      date: iso,
      tags: [cluster, kind.toLowerCase()]
    };

    added = [note].concat(added);
    persist();
    textEl.value = "";
    sourceEl.value = "";
    capture.querySelector('input[name="atlas-kind"][value="Idea"]').checked = true;

    renderBoard(note.id);
    updateCounts();
    setQuery("");
    drawThreads(null, null);

    var card = board.querySelector('.card[data-note="' + note.id + '"]');
    if (card) {
      window.setTimeout(function () { card.classList.remove("is-new"); }, 700);
    }
    textEl.focus({ preventScroll: true });

    showToast("Pinned to the board", "Undo", function () {
      added = added.filter(function (n) { return n.id !== note.id; });
      persist();
      renderBoard();
      updateCounts();
      applySearch();
      showToast("Note removed from the board", null, null);
    });
  });

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  /* ---------- reset ---------- */

  function resetDemo() {
    added = [];
    try { localStorage.removeItem(KEY); } catch (err) { /* nothing to clear */ }
    threadIds = [];
    query = "";
    boardQuery.value = "";
    renderBoard();
    updateCounts();
    applySearch();
    showToast("Demo notes reset. The eleven examples are back.", null, null);
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

  /* ---------- keyboard ---------- */

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !dialog.open && (query || threadIds.length)) {
      setQuery("");
    }
    if (event.key === "/" && document.activeElement !== boardQuery && document.activeElement !== textEl && document.activeElement !== sourceEl) {
      event.preventDefault();
      boardQuery.focus();
      boardQuery.select();
    }
  });

  /* ---------- start ---------- */

  renderBoard();
  updateCounts();
  renderTrail();
  applySearch();

  window.addEventListener("resize", function () {
    window.clearTimeout(window.__atlasResize);
    window.__atlasResize = window.setTimeout(function () { drawThreads(baseLit(), null); }, 120);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { drawThreads(baseLit(), null); });
  }
})();
