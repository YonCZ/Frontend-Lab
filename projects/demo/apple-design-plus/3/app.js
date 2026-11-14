// Noema, direction 03: Blueprint

(function () {
  'use strict';

  /* ---------- rail wayfinding ---------- */

  const railLinks = Array.from(document.querySelectorAll('.rail__nav a'));
  const railSections = railLinks
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);
  let railTick = false;

  function updateRail() {
    railTick = false;
    if (!railSections.length) return;
    let current = railSections[0].id;
    railSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 150) current = section.id;
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 40) {
      current = railSections[railSections.length - 1].id;
    }
    railLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }

  function queueRail() {
    if (railTick) return;
    railTick = true;
    window.requestAnimationFrame(updateRail);
  }
  window.addEventListener('scroll', queueRail, { passive: true });
  window.addEventListener('resize', queueRail);
  updateRail();

  /* ---------- capture receipt ---------- */

  const lineForm = document.getElementById('line-form');
  const fragment = document.getElementById('fragment');
  const receipt = document.getElementById('receipt');
  const lineStatus = document.getElementById('line-form-status');

  const receiptSets = [
    {
      match: /memory|remember|forget|read|book|learning/i,
      links: [['The spacing effect', '0.94'], ['Why we reread', '0.88'], ['Uppsala: the archive', '0.81']]
    },
    {
      match: /attention|focus|distract|quiet|screen/i,
      links: [['Attention is a design material', '0.97'], ['A quieter inbox', '0.89'], ['The Shallows', '0.84']]
    },
    {
      match: /file|markdown|own|backup|folder|export/i,
      links: [['A folder, not a format', '0.99'], ['Encrypted sync', '0.91'], ['Importing a vault', '0.86']]
    }
  ];

  if (lineForm && fragment && receipt) {
    lineForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = fragment.value.trim();
      if (!text) {
        fragment.focus();
        fragment.setAttribute('aria-invalid', 'true');
        fragment.placeholder = 'A fragment is enough.';
        return;
      }
      fragment.removeAttribute('aria-invalid');
      const found = receiptSets.find((set) => set.match.test(text)) || {
        links: [['The spacing effect', '0.72'], ['Attention is a design material', '0.69'], ['Uppsala: the archive', '0.64']]
      };
      const now = new Date();
      const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

      const note = document.createElement('div');
      note.className = 'receipt__note';
      const head = document.createElement('div');
      head.className = 'receipt__head';
      const stamp = document.createElement('b');
      stamp.textContent = 'Received / ' + time;
      const where = document.createElement('span');
      where.textContent = 'Inbox / 3 links found';
      head.append(stamp, where);
      const body = document.createElement('b');
      body.textContent = text;
      const links = document.createElement('div');
      links.className = 'receipt__links';
      found.links.forEach(([name, score], index) => {
        const row = document.createElement('div');
        row.className = 'receipt__link';
        const num = document.createElement('span');
        num.textContent = String(index + 1).padStart(2, '0');
        const label = document.createElement('span');
        label.textContent = name;
        const match = document.createElement('em');
        match.textContent = score;
        row.append(num, label, match);
        links.appendChild(row);
      });
      note.append(head, body, links);
      receipt.replaceChildren(note);
      receipt.classList.add('is-filled');
      lineStatus.textContent = 'Saved / 3 links found';
      fragment.value = '';
      fragment.placeholder = 'The best ideas arrive before the sentence is ready.';
    });

    fragment.addEventListener('input', () => {
      if (fragment.value.trim()) {
        fragment.removeAttribute('aria-invalid');
        fragment.placeholder = 'The best ideas arrive before the sentence is ready.';
      }
    });
  }

  /* ---------- diagram inspector ---------- */

  const linkNotes = {
    spacing: {
      type: 'Supports',
      title: 'The spacing effect',
      body: 'Retrieval gets easier when the gap between passes grows. The second read should feel a little harder than the first.',
      why: 'Both notes argue that the interval, not the volume, decides what stays.',
      match: '0.94',
      links: '6',
      back: '3'
    },
    reread: {
      type: 'Extends',
      title: 'Why we reread',
      body: 'A book returns something different on a second pass because you are a different reader by then. The page stays still; the context moves.',
      why: 'One note explains the interval. This one explains what the interval is for.',
      match: '0.88',
      links: '4',
      back: '5'
    },
    shallows: {
      type: 'Complicates',
      title: 'Reading notes: The Shallows',
      body: 'The medium trains a particular kind of attention, and attention is hard to notice while you are inside it.',
      why: 'It pushes back on the idea that a quiet surface is enough. The medium is part of the surface.',
      match: '0.81',
      links: '8',
      back: '2'
    },
    inbox: {
      type: 'Echoes',
      title: 'A quieter inbox',
      body: 'An inbox is a promise to return. The useful version is short, dated, and emptied by hand, not by a rule.',
      why: 'The same argument at the scale of a day: attention is made by what you leave open.',
      match: '0.80',
      links: '5',
      back: '4'
    }
  };

  const dnodes = Array.from(document.querySelectorAll('.dnode'));
  const dlines = Array.from(document.querySelectorAll('.diagram__lines path'));
  const inspectorType = document.getElementById('inspector-type');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorBody = document.getElementById('inspector-body');
  const inspectorWhy = document.getElementById('inspector-why');
  const inspectorMatch = document.getElementById('inspector-match');
  const inspectorLinks = document.getElementById('inspector-links');
  const inspectorBack = document.getElementById('inspector-back');
  const inspectorCount = document.getElementById('inspector-count');

  function selectLink(key) {
    const note = linkNotes[key];
    if (!note) return;
    const index = Object.keys(linkNotes).indexOf(key);
    dnodes.forEach((node) => node.classList.toggle('is-active', node.dataset.dnote === key));
    dlines.forEach((line) => {
      const active = line.dataset.dline === key;
      line.classList.toggle('is-active', active);
      line.classList.toggle('is-dim', !active);
    });
    inspectorType.textContent = note.type;
    inspectorTitle.textContent = note.title;
    inspectorBody.textContent = note.body;
    inspectorWhy.textContent = note.why;
    inspectorMatch.textContent = note.match;
    inspectorLinks.textContent = note.links;
    inspectorBack.textContent = note.back;
    inspectorCount.textContent = '0' + (index + 1) + ' / 04';
  }

  dnodes.forEach((node) => {
    node.addEventListener('click', () => selectLink(node.dataset.dnote));
  });
  dlines.forEach((line) => {
    if (line.dataset.dline === 'spacing') line.classList.add('is-active');
  });
  dnodes.find((node) => node.dataset.dnote === 'spacing')?.classList.add('is-active');

  /* ---------- readout / ask ---------- */

  const answers = [
    {
      match: /forget|memory|remember|read|learning|spacing/i,
      answer: 'Because saving is not remembering. The interval between passes matters more than the first read. Your notes keep returning to the same fix: make the second meeting a little harder, and space it further out.',
      sources: [
        ['The spacing effect', '0.94', '¶ 2'],
        ['Why we reread', '0.88', '¶ 1'],
        ['Uppsala: the archive', '0.81', '¶ 3']
      ]
    },
    {
      match: /attention|focus|distract|quiet|screen/i,
      answer: 'Attention is the material, not the metric. Three notes say the same thing in different registers: a quiet surface is a design choice, an inbox is a promise to return, and every medium trains the attention it asks for.',
      sources: [
        ['Attention is a design material', '0.97', '¶ 1'],
        ['A quieter inbox', '0.89', '¶ 2'],
        ['Reading notes: The Shallows', '0.84', '¶ 3']
      ]
    },
    {
      match: /file|markdown|own|backup|folder|privacy|sync|live/i,
      answer: 'Every note is a Markdown file in a folder you chose. Sync is end-to-end encrypted, and the search index is built on your machine. If you left tomorrow, the folder would still open in any editor.',
      sources: [
        ['A folder, not a format', '0.99', '¶ 1'],
        ['Encrypted sync, explained', '0.91', '¶ 2'],
        ['Importing a vault', '0.86', '¶ 4']
      ]
    },
    {
      match: /uppsala|archive|reread|rereading/i,
      answer: 'Uppsala is where the practice started: a room of index cards, each one a sentence someone chose to keep. Rereading is the same gesture at a smaller scale. The archive is the argument; the second pass is the method.',
      sources: [
        ['Uppsala: the archive', '0.96', '¶ 1'],
        ['Why we reread', '0.90', '¶ 2'],
        ['Memory is the residue of thought', '0.85', '¶ 3']
      ]
    }
  ];

  const readoutForm = document.getElementById('readout-form');
  const query = document.getElementById('query');
  const readoutAnswer = document.getElementById('readout-answer');
  const citations = document.querySelector('.citations');

  function renderReadout(question) {
    const found = answers.find((entry) => entry.match.test(question)) || {
      answer: 'Nothing in the archive answers this directly yet. The three nearest notes are a starting point, not an answer. Open one and write the missing sentence.',
      sources: [
        ['The spacing effect', '0.72', '¶ 2'],
        ['Attention is a design material', '0.69', '¶ 1'],
        ['Uppsala: the archive', '0.64', '¶ 3']
      ]
    };

    readoutAnswer.replaceChildren();
    const paragraph = document.createElement('p');
    paragraph.textContent = found.answer;
    readoutAnswer.appendChild(paragraph);

    citations.querySelectorAll('.citation').forEach((row) => row.remove());
    found.sources.forEach(([title, score, used], index) => {
      const row = document.createElement('div');
      row.className = 'citation';
      const num = document.createElement('span');
      num.className = 'mono';
      num.textContent = '0' + (index + 1);
      const name = document.createElement('b');
      name.textContent = title;
      const match = document.createElement('span');
      match.className = 'num';
      match.textContent = score;
      const place = document.createElement('span');
      place.className = 'mono';
      place.textContent = used;
      row.append(num, name, match, place);
      citations.appendChild(row);
    });
  }

  if (readoutForm && query) {
    readoutForm.addEventListener('submit', (event) => {
      event.preventDefault();
      renderReadout(query.value.trim() || 'why do I keep forgetting what I read?');
    });
  }

  document.querySelectorAll('.readout__suggest button').forEach((button) => {
    button.addEventListener('click', () => {
      query.value = button.dataset.q;
      renderReadout(button.dataset.q);
      query.focus();
    });
  });

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
