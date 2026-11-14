// Noema, direction 01: Daylight

(function () {
  'use strict';

  /* ---------- product preview tabs ---------- */

  const tabs = Array.from(document.querySelectorAll('.app__tabs [role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls'))).filter(Boolean);

  function selectTab(tab, focus) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      const selected = panel.id === tab.getAttribute('aria-controls');
      panel.hidden = !selected;
      panel.classList.toggle('app__panel--hidden', !selected);
    });
    if (focus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab, false));
    tab.addEventListener('keydown', (event) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      selectTab(tabs[next], true);
    });
  });

  /* ---------- graph note selection ---------- */

  const graphNote = document.querySelector('.graph-note');
  if (graphNote) {
    const graphTitle = graphNote.querySelector('b');
    const graphMeta = graphNote.querySelector('span:last-child');
    const graphNodes = Array.from(document.querySelectorAll('.gnode'));
    graphNodes.forEach((node) => {
      node.addEventListener('click', () => {
        const label = node.firstChild ? node.firstChild.textContent.trim() : node.textContent.trim();
        graphTitle.textContent = label;
        graphMeta.textContent = node.classList.contains('gnode--main')
          ? '6 links · 3 backlinks · 412 words'
          : '4 links · 2 backlinks';
        graphNodes.forEach((item) => item.classList.toggle('is-selected', item === node));
      });
    });
  }

  /* ---------- quick capture demo ---------- */

  const captureForm = document.getElementById('capture-form');
  const quickNote = document.getElementById('quick-note');
  const captureResult = document.getElementById('capture-result');

  const relatedSets = [
    {
      match: /memory|remember|forget|read|book|learning/i,
      notes: ['The spacing effect', 'Why we reread', 'Uppsala: the archive']
    },
    {
      match: /attention|focus|distract|quiet|noise/i,
      notes: ['Attention is a design material', 'A quieter inbox', 'Deep work, annotated']
    },
    {
      match: /file|markdown|own|backup|folder|export/i,
      notes: ['A folder, not a format', 'Encrypted sync, explained', 'Importing a vault']
    }
  ];

  if (captureForm && quickNote && captureResult) {
    captureForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = quickNote.value.trim();
      if (!text) {
        quickNote.focus();
        quickNote.classList.add('is-empty');
        quickNote.setAttribute('aria-invalid', 'true');
        quickNote.placeholder = 'Write a line first. A fragment is enough.';
        return;
      }
      quickNote.classList.remove('is-empty');
      quickNote.removeAttribute('aria-invalid');

      const set = relatedSets.find((entry) => entry.match.test(text)) || {
        notes: ['The spacing effect', 'A quieter inbox', 'Why we reread']
      };

      const note = document.createElement('div');
      note.className = 'capture-result__note';
      const title = document.createElement('b');
      title.textContent = text;
      const meta = document.createElement('span');
      meta.textContent = 'Saved to Inbox · just now · 3 related notes found';
      const rel = document.createElement('div');
      rel.className = 'capture-result__rel';
      set.notes.forEach((name) => {
        const chip = document.createElement('span');
        chip.textContent = name;
        rel.appendChild(chip);
      });
      note.append(title, meta, rel);
      captureResult.replaceChildren(note);

      quickNote.value = '';
      quickNote.placeholder = 'The best ideas arrive before the sentence is ready.';
    });

    quickNote.addEventListener('input', () => {
      if (quickNote.value.trim()) {
        quickNote.classList.remove('is-empty');
        quickNote.removeAttribute('aria-invalid');
      }
    });
  }

  /* ---------- connection map ---------- */

  const mapNotes = {
    spacing: {
      title: 'The spacing effect',
      body: 'Retrieval gets easier when the gap between passes grows. The second read should feel a little harder than the first.',
      meta: 'Research · 6 links · edited 2h ago'
    },
    reread: {
      title: 'Why we reread',
      body: 'A book returns something different on a second pass because you are a different reader by then. The page stays still; the context moves.',
      meta: 'Essay · 4 links · edited 3d ago'
    },
    shallows: {
      title: 'Reading notes: The Shallows',
      body: 'The argument is not that screens are bad. It is that a medium trains a particular kind of attention, and attention is hard to notice while you are inside it.',
      meta: 'Book · 8 links · edited yesterday'
    },
    uppsala: {
      title: 'Uppsala: the archive',
      body: 'A room of index cards, each one a sentence someone chose to keep. The first place this practice felt like a way of thinking rather than a chore.',
      meta: 'Field note · 3 links · edited 1w ago'
    },
    inbox: {
      title: 'A quieter inbox',
      body: 'An inbox is a promise to return. The useful version is short, dated, and emptied by hand, not by a rule.',
      meta: 'Essay · 5 links · edited 2w ago'
    },
    deep: {
      title: 'Deep work, annotated',
      body: 'The book treats focus as a skill to schedule. These notes push back: attention is also a material shaped by the room, the tool, and the people around it.',
      meta: 'Book · 7 links · edited 3w ago'
    }
  };

  const map = document.getElementById('connect-map');
  if (map) {
    const nodes = Array.from(map.querySelectorAll('.mnode'));
    const lines = Array.from(map.querySelectorAll('.map__lines path'));
    const title = document.getElementById('map-title');
    const body = document.getElementById('map-body');
    const meta = document.getElementById('map-meta');

    nodes.forEach((node) => {
      node.addEventListener('click', () => {
        const key = node.dataset.note;
        const note = mapNotes[key];
        if (!note) return;
        nodes.forEach((item) => item.classList.toggle('is-active', item === node));
        lines.forEach((line) => {
          const active = line.dataset.line === key;
          line.classList.toggle('is-active', active);
          line.classList.toggle('is-dim', !active);
        });
        title.textContent = note.title;
        body.textContent = note.body;
        meta.textContent = note.meta;
      });
    });

    lines.forEach((line) => {
      const active = line.dataset.line === 'spacing';
      line.classList.toggle('is-active', active);
      line.classList.toggle('is-dim', !active);
    });
  }

  /* ---------- archive question demo ---------- */

  const askForm = document.getElementById('ask-form');
  const askInput = document.getElementById('ask-input');
  const recallAnswer = document.getElementById('recall-answer');
  const recallSources = document.getElementById('recall-sources');

  const answers = [
    {
      match: /forget|memory|remember|read|learning|spacing/i,
      html: 'Because saving is not remembering. The interval between passes matters more than the first read. Your notes keep returning to the same fix: make the second meeting a little harder, and space it further out.',
      sources: [
        ['The spacing effect', 'Research · 2h', '94%'],
        ['Why we reread', 'Essay · 3d', '88%'],
        ['Uppsala: the archive', 'Field note · 1w', '81%']
      ]
    },
    {
      match: /attention|focus|distract|quiet|screen/i,
      html: 'Attention is the material, not the metric. Three notes say the same thing in different registers: quiet surfaces are a design choice, an inbox is a promise to return, and every medium trains the attention it asks for.',
      sources: [
        ['Attention is a design material', 'Essay · 2m', '97%'],
        ['A quieter inbox', 'Essay · 2w', '89%'],
        ['Reading notes: The Shallows', 'Book · yesterday', '84%']
      ]
    },
    {
      match: /file|markdown|own|backup|folder|privacy|sync/i,
      html: 'Every note is a Markdown file in a folder you chose. Sync is end to end encrypted, and the search index is built on your machine. If you left tomorrow, the folder would still open in any editor.',
      sources: [
        ['A folder, not a format', 'Note · 4d', '99%'],
        ['Encrypted sync, explained', 'Note · 2w', '91%'],
        ['Importing a vault', 'Guide · 1m', '86%']
      ]
    }
  ];

  function renderAnswer(question) {
    const found = answers.find((entry) => entry.match.test(question)) || {
      html: 'Nothing in the archive says this directly yet. The three nearest notes below are a starting point, not an answer. Open one and write the missing sentence.',
      sources: [
        ['The spacing effect', 'Research · 2h', '72%'],
        ['Attention is a design material', 'Essay · 2m', '69%'],
        ['Uppsala: the archive', 'Field note · 1w', '64%']
      ]
    };

    recallAnswer.innerHTML = '<p></p>';
    recallAnswer.querySelector('p').textContent = found.html;

    recallSources.innerHTML = '<span class="recall-out__label">3 notes used</span>';
    found.sources.forEach(([name, detail, score], index) => {
      const row = document.createElement('div');
      row.className = 'recall-source';
      row.style.animationDelay = (index * 55) + 'ms';
      const strong = document.createElement('b');
      strong.textContent = name;
      const span = document.createElement('span');
      span.textContent = detail;
      const em = document.createElement('em');
      em.textContent = score;
      row.append(strong, span, em);
      recallSources.appendChild(row);
    });
  }

  if (askForm && askInput) {
    askForm.addEventListener('submit', (event) => {
      event.preventDefault();
      renderAnswer(askInput.value.trim() || 'why do I keep forgetting what I read?');
    });

    document.querySelectorAll('.recall-suggest button').forEach((button) => {
      button.addEventListener('click', () => {
        askInput.value = button.dataset.q;
        askForm.requestSubmit();
      });
    });
  }

  /* ---------- signup dialog ---------- */

  const dialog = document.getElementById('signup');
  const formWrap = document.getElementById('signup-form-wrap');
  const doneWrap = document.getElementById('signup-done');
  const signupForm = document.getElementById('signup-form');
  const emailInput = document.getElementById('signup-email');
  const error = document.getElementById('signup-error');
  let lastTrigger = null;

  function resetDialog() {
    if (!dialog) return;
    formWrap.hidden = false;
    doneWrap.hidden = true;
    error.hidden = true;
    signupForm.reset();
    emailInput.removeAttribute('aria-invalid');
  }

  function openDialog(trigger) {
    if (!dialog) return;
    lastTrigger = trigger;
    resetDialog();
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      window.setTimeout(() => emailInput.focus(), 30);
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog() {
    if (!dialog) return;
    dialog.close();
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll('[data-open-signup]').forEach((button) => {
    button.addEventListener('click', () => openDialog(button));
  });

  if (dialog) {
    dialog.querySelectorAll('[data-close-signup]').forEach((button) => {
      button.addEventListener('click', closeDialog);
    });

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });

    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const valid = emailInput.value.trim() !== '' && emailInput.checkValidity();
      error.hidden = valid;
      if (!valid) {
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
        return;
      }
      emailInput.removeAttribute('aria-invalid');
      formWrap.hidden = true;
      doneWrap.hidden = false;
      doneWrap.querySelector('button').focus();
    });
  }

  /* ---------- nav contrast over dark sections ---------- */

  const nav = document.querySelector('.nav');
  const darkSections = Array.from(document.querySelectorAll('[data-nav-dark]'));
  let navTick = false;

  function updateNavContrast() {
    navTick = false;
    if (!nav || !darkSections.length) return;
    const line = nav.offsetHeight * 0.6;
    const onDark = darkSections.some((section) => {
      const box = section.getBoundingClientRect();
      return box.top <= line && box.bottom > line;
    });
    nav.classList.toggle('nav--dark', onDark);
  }

  function queueNav() {
    if (navTick) return;
    navTick = true;
    window.requestAnimationFrame(updateNavContrast);
  }

  window.addEventListener('scroll', queueNav, { passive: true });
  window.addEventListener('resize', queueNav);
  updateNavContrast();

  /* ---------- direction keyboard shortcuts ---------- */

  const directions = ['../1/index.html', '../2/index.html', '../3/index.html'];
  document.querySelectorAll('.switcher a').forEach((link, index) => {
    link.setAttribute('aria-keyshortcuts', 'Alt+' + (index + 1));
  });

  window.addEventListener('keydown', (event) => {
    if (!event.altKey || event.metaKey || event.ctrlKey) return;
    const index = ['Digit1', 'Digit2', 'Digit3'].indexOf(event.code);
    if (index === -1) return;
    event.preventDefault();
    window.location.href = directions[index];
  });
})();
