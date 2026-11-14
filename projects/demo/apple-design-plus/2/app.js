// Noema, direction 02: Nightfall

(function () {
  'use strict';

  /* ---------- constellation ---------- */

  const skyNotes = {
    attention: {
      kind: 'Essay',
      links: '6 links',
      title: 'Attention is a design material',
      body: 'A quiet surface is not a neutral choice. Removing a control is a decision about where a person can put their mind.',
      meta: 'Edited 2 min ago',
      match: '97% near'
    },
    spacing: {
      kind: 'Research',
      links: '6 links',
      title: 'The spacing effect',
      body: 'Retrieval gets easier when the gap between passes grows. The second read should feel a little harder than the first.',
      meta: 'Edited 2h ago',
      match: '94% near'
    },
    reread: {
      kind: 'Essay',
      links: '4 links',
      title: 'Why we reread',
      body: 'A book returns something different on a second pass because you are a different reader by then. The page stays still; the context moves.',
      meta: 'Edited 3d ago',
      match: '88% near'
    },
    shallows: {
      kind: 'Book',
      links: '8 links',
      title: 'Reading notes: The Shallows',
      body: 'The medium trains a particular kind of attention, and attention is hard to notice while you are inside it.',
      meta: 'Edited yesterday',
      match: '84% near'
    },
    uppsala: {
      kind: 'Field note',
      links: '3 links',
      title: 'Uppsala: the archive',
      body: 'A room of index cards, each one a sentence someone chose to keep. The first place this practice felt like thinking.',
      meta: 'Edited 1w ago',
      match: '81% near'
    },
    memory: {
      kind: 'Note',
      links: '5 links',
      title: 'Memory is the residue of thought',
      body: 'The line is on an index card in the archive. It is the shortest argument for writing things down that you have found.',
      meta: 'Edited 2w ago',
      match: '86% near'
    },
    inbox: {
      kind: 'Essay',
      links: '5 links',
      title: 'A quieter inbox',
      body: 'An inbox is a promise to return. The useful version is short, dated, and emptied by hand, not by a rule.',
      meta: 'Edited 2w ago',
      match: '80% near'
    }
  };

  const sky = document.getElementById('sky');
  if (sky) {
    const nodes = Array.from(sky.querySelectorAll('.star-node'));
    const lines = Array.from(sky.querySelectorAll('.sky__lines path'));
    const title = document.getElementById('sky-title');
    const body = document.getElementById('sky-body');
    const meta = document.getElementById('sky-meta');
    const match = document.getElementById('sky-match');
    const top = sky.querySelector('.sky__card-top');

    function selectSky(key) {
      const note = skyNotes[key];
      if (!note) return;
      nodes.forEach((node) => node.classList.toggle('is-active', node.dataset.note === key));
      lines.forEach((line) => {
        const active = line.dataset.line === key;
        line.classList.toggle('is-active', active);
        line.classList.toggle('is-dim', !active && !line.classList.contains('is-faint'));
      });
      title.textContent = note.title;
      body.textContent = note.body;
      meta.textContent = note.meta;
      match.textContent = note.match;
      top.firstElementChild.textContent = note.kind;
      top.lastElementChild.textContent = note.links;
      const card = document.getElementById('sky-card');
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = 'swapIn .3s cubic-bezier(.2,.72,.22,1) both';
    }

    nodes.forEach((node) => {
      node.addEventListener('click', () => selectSky(node.dataset.note));
      node.addEventListener('mouseenter', () => {
        if (window.matchMedia('(hover: hover)').matches) selectSky(node.dataset.note);
      });
    });

    nodes.find((node) => node.dataset.note === 'spacing')?.classList.add('is-active');
    lines.forEach((line) => {
      if (line.dataset.line === 'spacing') line.classList.add('is-active');
    });
  }

  /* ---------- connect: note window ---------- */

  const connectNotes = {
    spacing: {
      title: 'The spacing effect',
      meta: 'Research · 6 links · edited 2h ago',
      text: 'Retrieval gets easier when the gap between passes grows. The second read should feel a little harder than the first.'
    },
    reread: {
      title: 'Why we reread',
      meta: 'Essay · 4 links · edited 3d ago',
      text: 'A book returns something different on a second pass because you are a different reader by then. The page stays still; the context moves.'
    },
    shallows: {
      title: 'Reading notes: The Shallows',
      meta: 'Book · 8 links · edited yesterday',
      text: 'The medium trains a particular kind of attention, and attention is hard to notice while you are inside it. The argument is not that screens are bad.'
    }
  };

  const relations = Array.from(document.querySelectorAll('#relations .relation'));
  const noteWindowBody = document.querySelector('.note-window__body');
  const noteTitle = document.getElementById('note-title');
  const noteMeta = document.getElementById('note-meta');
  const noteText = document.getElementById('note-text');

  function selectConnect(key) {
    const note = connectNotes[key];
    if (!note) return;
    relations.forEach((relation) => relation.classList.toggle('is-active', relation.dataset.note === key));
    noteTitle.textContent = note.title;
    noteMeta.textContent = note.meta;
    noteText.textContent = note.text;
    if (noteWindowBody) {
      noteWindowBody.classList.remove('swap');
      void noteWindowBody.offsetWidth;
      noteWindowBody.classList.add('swap');
    }
  }

  relations.forEach((relation) => {
    relation.addEventListener('click', () => selectConnect(relation.dataset.note));
  });
  document.querySelectorAll('.inline-link').forEach((link) => {
    link.addEventListener('click', () => selectConnect(link.dataset.note));
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    link.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectConnect(link.dataset.note);
      }
    });
  });

  /* ---------- capture ---------- */

  const composer = document.getElementById('composer');
  const thought = document.getElementById('thought');
  const rail = document.getElementById('today-rail');
  const count = document.getElementById('today-count');

  if (composer && thought && rail) {
    let added = 0;
    composer.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = thought.value.trim();
      if (!text) {
        thought.focus();
        thought.setAttribute('aria-invalid', 'true');
        thought.placeholder = 'A fragment is enough.';
        return;
      }
      thought.removeAttribute('aria-invalid');

      const now = new Date();
      const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      const card = document.createElement('article');
      card.className = 'thought-card thought-card--new';

      const stamp = document.createElement('span');
      stamp.className = 'thought-card__time';
      stamp.textContent = time;

      const title = document.createElement('b');
      title.textContent = text.length > 58 ? text.slice(0, 57).trim() + '…' : text;

      const body = document.createElement('p');
      body.textContent = 'Saved just now. Noema found three notes that belong beside it.';

      const links = document.createElement('span');
      links.className = 'thought-card__links';
      links.textContent = '3 connections';

      card.append(stamp, title, body, links);
      rail.prepend(card);
      while (rail.children.length > 3) rail.lastElementChild.remove();

      added += 1;
      count.textContent = (3 + added) + ' thoughts';
      thought.value = '';
      thought.placeholder = 'What are you thinking about?';
      thought.focus();
    });

    thought.addEventListener('input', () => {
      if (thought.value.trim()) {
        thought.removeAttribute('aria-invalid');
        thought.placeholder = 'What are you thinking about?';
      }
    });
  }

  /* ---------- ask thread ---------- */

  const threadAnswers = [
    {
      match: /attention|focus|distract|quiet|screen/i,
      answer: 'That attention is built by the room, not summoned by will. Three notes keep circling the same point: a quiet surface is a design decision, the medium trains the attention it asks for, and the inbox is a promise you have to keep by hand.',
      sources: [
        ['Attention is a design material', '97%'],
        ['Reading notes: The Shallows', '84%'],
        ['A quieter inbox', '80%']
      ]
    },
    {
      match: /file|markdown|own|backup|folder|privacy|sync/i,
      answer: 'Your notes are Markdown files inside a folder you chose. The search index is built on your machine, sync is end-to-end encrypted, and deleting the app leaves every file exactly where it was.',
      sources: [
        ['A folder, not a format', '99%'],
        ['Encrypted sync, explained', '91%'],
        ['Importing a vault', '86%']
      ]
    },
    {
      match: /forget|memory|remember|read|learning|spacing/i,
      answer: 'Because saving is not remembering. The interval between passes matters more than the first read. Make the second meeting a little harder, and put more space before the third.',
      sources: [
        ['The spacing effect', '94%'],
        ['Why we reread', '88%'],
        ['Uppsala: the archive', '81%']
      ]
    },
    {
      match: /uppsala|archive|reread|rereading/i,
      answer: 'Uppsala is where the practice started: a room of index cards, each one a sentence someone chose to keep. Rereading is the same gesture at a smaller scale. The archive is the argument; the second pass is the method.',
      sources: [
        ['Uppsala: the archive', '96%'],
        ['Why we reread', '90%'],
        ['Memory is the residue of thought', '85%']
      ]
    }
  ];

  const threadForm = document.getElementById('thread-form');
  const followUp = document.getElementById('follow-up');
  const threadQuestion = document.getElementById('thread-question');
  const threadAnswer = document.getElementById('thread-answer');
  const threadSources = document.getElementById('thread-sources');
  const threadScroll = document.getElementById('thread-scroll');

  function renderThread(question) {
    const found = threadAnswers.find((entry) => entry.match.test(question)) || {
      answer: 'Nothing in the archive answers this directly yet. The three nearest notes are a starting point, not an answer. Open one and write the missing sentence.',
      sources: [
        ['The spacing effect', '72%'],
        ['Attention is a design material', '69%'],
        ['Uppsala: the archive', '64%']
      ]
    };

    threadQuestion.textContent = question;
    threadAnswer.classList.remove('swap');
    void threadAnswer.offsetWidth;
    threadAnswer.classList.add('swap');

    const paragraph = threadAnswer.querySelector('p');
    paragraph.textContent = found.answer;
    threadSources.replaceChildren();
    found.sources.forEach(([name, score]) => {
      const chip = document.createElement('span');
      chip.className = 'source-pill';
      const label = document.createElement('span');
      label.textContent = name;
      const value = document.createElement('em');
      value.textContent = score;
      chip.append(label, value);
      threadSources.appendChild(chip);
    });

    if (threadScroll) threadScroll.scrollTop = 0;
  }

  if (threadForm && followUp) {
    threadForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const question = followUp.value.trim();
      if (!question) {
        followUp.focus();
        return;
      }
      renderThread(question);
      followUp.value = '';
    });
  }

  document.querySelectorAll('#thread-suggest button').forEach((button) => {
    button.addEventListener('click', () => {
      renderThread(button.dataset.q);
      if (followUp) followUp.focus();
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

  /* ---------- nav contrast over the paper section ---------- */

  const nav = document.querySelector('.nav');
  const lightSections = Array.from(document.querySelectorAll('[data-nav-light]'));
  let navTick = false;

  function updateNav() {
    navTick = false;
    if (!nav || !lightSections.length) return;
    const line = nav.offsetHeight * 0.6;
    const onLight = lightSections.some((section) => {
      const box = section.getBoundingClientRect();
      return box.top <= line && box.bottom > line;
    });
    nav.classList.toggle('nav--light', onLight);
  }

  function queueNav() {
    if (navTick) return;
    navTick = true;
    window.requestAnimationFrame(updateNav);
  }
  window.addEventListener('scroll', queueNav, { passive: true });
  window.addEventListener('resize', queueNav);
  updateNav();

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
