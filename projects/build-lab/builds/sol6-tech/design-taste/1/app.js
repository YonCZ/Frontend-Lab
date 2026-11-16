(() => {
  'use strict';

  const layout = document.documentElement.dataset.layout;
  const main = document.querySelector('#main');
  const preview = document.querySelector('#preview');
  const utility = document.querySelector('#utility');
  const allModels = [...new Set(PROJECTS.flatMap(project => project.models))];
  const totalBuilds = PROJECTS.reduce((total, project) => total + project.count, 0);
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const searchIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>';
  const expandIcon = '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 8V3h5m4 0h5v5M3 12v5h5m4 0h5v-5"/></svg>';
  let state;
  let lastTrigger = null;

  function readState() {
    const parameters = new URLSearchParams(location.search);
    const project = PROJECTS.find(item => item.id === parameters.get('project'));
    const selected = project?.builds.find(build => build.id === parameters.get('build')) || project?.builds[0];
    const pinned = project?.builds.find(build => build.id === parameters.get('pin') && build.id !== selected?.id);
    return {
      project, selected, pinned,
      query: parameters.get('q') || '',
      model: allModels.includes(parameters.get('model')) ? parameters.get('model') : '',
      filter: parameters.get('filter') || '',
      skill: parameters.get('skill') || '',
      view: ['grid', 'list'].includes(parameters.get('view')) ? parameters.get('view') : layout === '1' ? 'list' : 'grid',
      expanded: parameters.get('brief') === 'full',
      overlay: Boolean(project && parameters.get('preview') === 'open'),
      full: parameters.get('window') === 'full'
    };
  }

  function update(parameters, push = false) {
    const url = new URL(location.href);
    Object.entries(parameters).forEach(([key, value]) => {
      if (value === null || value === '' || value === false || value === undefined) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    history[push ? 'pushState' : 'replaceState']({}, '', url);
    state = readState();
  }

  function projectUrl(project) {
    const parameters = new URLSearchParams({ project: project.id });
    return `?${parameters}`;
  }

  function buildImage(build, className = '') {
    const source = className === 'stage-image' ? build.thumbnail.replace('.jpg', '-large.jpg') : build.thumbnail;
    return `<img class="${className}" src="${escape(source)}" alt="${escape(build.model)} / ${escape(build.skill)} / variant ${build.variant} build screenshot" width="720" height="450">`;
  }

  function modelLines(project) {
    return project.models.length ? project.models.map(model => `<span class="model-name mono">${escape(model)}</span>`).join('') : '<span class="muted mono">Not recorded</span>';
  }

  function projectEntry(project) {
    return `<a class="project-entry" href="${projectUrl(project)}" data-project="${project.id}">
      <div class="project-cover" aria-hidden="true"><span class="cover-path mono">${project.id}/</span><span class="cover-initial">${project.initial}</span><span class="cover-count mono">${project.count} builds</span></div>
      <div class="project-name"><h2>Project ${escape(project.name)}</h2><p>${escape(project.summary)}</p><span class="project-path mono">projects/${project.id}/</span></div>
      <div class="project-models">${modelLines(project)}</div>
      <span class="project-count mono">${project.count}<span class="mobile-count-label"> builds</span></span>
      <span class="project-open" aria-hidden="true">↗</span>
    </a>`;
  }

  function library() {
    main.className = `workspace library layout-${layout}`;
    main.innerHTML = `<div class="library-layout">
      <div class="library-intro">
        <div class="breadcrumb"><span>Workspace</span><span aria-hidden="true">/</span><span>Library</span></div>
        <div class="page-heading"><div><h1>Projects<span class="heading-count mono">${PROJECTS.length}</span></h1><p>Browse frontend builds by project, model and skill.</p></div><div class="library-total mono"><span>${totalBuilds} builds</span><span>${allModels.length} models</span></div></div>
      </div>
      <div class="library-tools">
        <div class="search-field">${searchIcon}<label class="sr-only" for="project-search">Search projects or models</label><input id="project-search" type="search" placeholder="Search projects or models..." value="${escape(state.query)}" autocomplete="off"><kbd>/</kbd></div>
        <label class="model-filter"><span class="sr-only">Filter by model</span><select id="model-filter"><option value="">All models</option>${allModels.map(model => `<option value="${escape(model)}" ${model === state.model ? 'selected' : ''}>${escape(model)}</option>`).join('')}</select></label>
        <span id="result-count" class="result-count mono" role="status"></span>
      </div>
      <section class="library-results" aria-label="Projects">
        <div class="table-heading"><span>Project / Brief</span><span>Models</span><span>Builds</span><span></span></div>
        <div id="project-results" class="project-results"></div>
      </section>
      <div class="library-note"><span>Choose a project to read its brief and browse its builds.</span><span class="mono">index.html</span></div>
    </div>`;
    filterProjects();
    document.querySelector('#project-search').addEventListener('input', event => {
      update({ q: event.target.value });
      filterProjects();
    });
    document.querySelector('#model-filter').addEventListener('change', event => {
      update({ model: event.target.value });
      filterProjects();
    });
  }

  function filterProjects() {
    const words = state.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = PROJECTS.filter(project => {
      const text = `Project ${project.name} ${project.models.join(' ')}`.toLowerCase();
      return words.every(word => text.includes(word)) && (!state.model || project.models.includes(state.model));
    });
    document.querySelector('#project-results').innerHTML = matches.length ? matches.map(projectEntry).join('') : `<div class="empty-state"><span class="empty-symbol" aria-hidden="true">∅</span><h2>No matching projects</h2><p>Try another project name or model.</p><button class="button" data-action="clear-search" type="button">Clear filters</button></div>`;
    document.querySelector('#result-count').textContent = `${matches.length} ${matches.length === 1 ? 'project' : 'projects'}`;
  }

  function brief() {
    return `<aside class="project-brief ${state.expanded ? 'is-expanded' : ''}" aria-labelledby="brief-heading">
      <div class="section-heading"><h2 id="brief-heading">The brief</h2><span class="mono">brief.md</span></div>
      <div class="brief-text" id="brief-text">${state.project.brief.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</div>
      <button class="text-button" type="button" data-action="toggle-brief" aria-expanded="${state.expanded}" aria-controls="brief-text">${state.expanded ? 'Collapse brief' : 'Read full brief'}<span aria-hidden="true">${state.expanded ? '−' : '+'}</span></button>
      <dl class="brief-facts"><div><dt>Builds</dt><dd class="mono">${state.project.count}</dd></div><div><dt>Models</dt><dd>${modelLines(state.project)}</dd></div><div><dt>Location</dt><dd class="mono">projects/${state.project.id}/</dd></div></dl>
    </aside>`;
  }

  function buildCard(build) {
    const selected = build.id === state.selected?.id;
    const pinned = build.id === state.pinned?.id;
    return `<article class="build-card ${selected ? 'is-selected' : ''} ${pinned ? 'is-pinned' : ''}" data-build-id="${build.id}">
      <button type="button" class="build-select" data-action="select-build" data-id="${build.id}" aria-label="Open ${escape(build.model)}, ${escape(build.skill)}, variant ${build.variant}" aria-pressed="${selected}">
        <span class="build-thumbnail">${buildImage(build)}<span class="thumbnail-open">Open preview ${expandIcon}</span></span>
        <span class="build-information"><span class="build-model mono">${escape(build.model)}</span><span class="build-skill">${escape(build.skill)}</span><span class="build-variant mono">V${build.variant}</span><span class="build-entry mono" title="${escape(build.path)}">${escape(build.path)}</span></span>
      </button>
      <div class="build-state"><span class="state-label mono">${pinned ? 'Pinned' : selected ? 'Selected' : `Variant ${build.variant}`}</span><button class="pin-button" type="button" data-action="pin-build" data-id="${build.id}" aria-pressed="${pinned}" aria-label="${pinned ? 'Unpin' : 'Pin'} ${escape(build.skill)}, variant ${build.variant}">${pinned ? 'Unpin' : 'Pin to compare'}</button></div>
    </article>`;
  }

  function selectedStage() {
    const build = state.selected;
    return `<section class="selected-stage" aria-label="Selected build">
      <div class="stage-heading"><span class="mono">Selected build</span><span class="mono">V${build.variant}</span></div>
      <button class="stage-screen" type="button" data-action="open-preview" aria-label="Open selected build preview">${buildImage(build, 'stage-image')}<span class="stage-open">${expandIcon} Open preview</span></button>
      <div class="stage-details"><span class="mono">${escape(build.model)}</span><strong>${escape(build.skill)}</strong><code title="${escape(build.path)}">${escape(build.path)}</code></div>
      <div class="stage-actions"><button class="button primary" data-action="open-preview" type="button">Open preview ${expandIcon}</button><button class="button" data-action="pin-current" type="button">${state.pinned ? 'Drop pinned build' : 'Pin for comparison'}</button></div>
      <p class="stage-hint">${state.pinned ? 'The pinned build stays when you select another.' : 'Pin one build, then open another to compare.'}</p>
    </section>`;
  }

  function projectScreen() {
    const project = state.project;
    const skills = [...new Set(project.builds.map(build => build.skill))];
    main.className = `workspace project layout-${layout}`;
    main.innerHTML = `<div class="breadcrumb"><a href="index.html" data-action="library">Library</a><span aria-hidden="true">/</span><span>Project ${escape(project.name)}</span></div>
      <div class="page-heading project-heading"><div><h1>Project ${escape(project.name)}<span class="heading-count mono">${project.count}</span></h1><p>${escape(project.summary)}</p></div><a class="back-link" href="index.html" data-action="library">Back to library</a></div>
      <div class="project-layout">${brief()}<div class="build-workspace">
        <div class="build-toolbar"><h2>Builds <span class="mono">${project.count}</span></h2><div class="view-switch" role="group" aria-label="Build layout"><button type="button" data-action="view-grid" aria-pressed="${state.view === 'grid'}">Grid</button><button type="button" data-action="view-list" aria-pressed="${state.view === 'list'}">List</button></div></div>
        <div class="build-filters"><div class="search-field">${searchIcon}<label class="sr-only" for="build-search">Search models or skills</label><input id="build-search" type="search" placeholder="Filter models or skills..." value="${escape(state.filter)}" autocomplete="off"></div><label><span class="sr-only">Filter by skill</span><select id="skill-filter"><option value="">All skills</option>${skills.map(skill => `<option ${state.skill === skill ? 'selected' : ''}>${escape(skill)}</option>`).join('')}</select></label></div>
        <div class="selection-summary"><span><span class="selection-dot" aria-hidden="true"></span>Selected <strong class="mono">${escape(state.selected.skill)} / V${state.selected.variant}</strong></span><button class="text-button" type="button" data-action="open-preview">${state.pinned ? 'Compare builds' : 'Open preview'} ${expandIcon}</button></div>
        ${state.pinned ? `<div class="pin-notice"><span>Pinned <strong class="mono">${escape(state.pinned.model)} / ${escape(state.pinned.skill)} / V${state.pinned.variant}</strong></span><button type="button" class="text-button" data-action="drop-pin">Drop pinned build ×</button></div>` : ''}
        <div class="build-and-stage"><div><p id="build-count" class="build-result-count mono" role="status"></p><div id="build-results" class="build-collection ${state.view}"></div></div>${selectedStage()}</div>
      </div></div>`;
    filterBuilds();
    document.querySelector('#build-search').addEventListener('input', event => {
      update({ filter: event.target.value });
      filterBuilds();
    });
    document.querySelector('#skill-filter').addEventListener('change', event => {
      update({ skill: event.target.value });
      filterBuilds();
    });
  }

  function filterBuilds() {
    const words = state.filter.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const builds = state.project.builds.filter(build => words.every(word => `${build.model} ${build.skill} variant ${build.variant}`.toLowerCase().includes(word)) && (!state.skill || build.skill === state.skill));
    document.querySelector('#build-results').innerHTML = builds.length ? builds.map(buildCard).join('') : '<div class="empty-state"><h3>No matching builds</h3><p>Try another model or skill.</p><button class="button" type="button" data-action="clear-builds">Clear filters</button></div>';
    document.querySelector('#build-count').textContent = `${builds.length} of ${state.project.count} builds`;
  }

  function frame(build, pinned = false) {
    return `<section class="preview-pane ${pinned ? 'pinned-pane' : ''}" aria-label="${pinned ? 'Pinned' : 'Selected'} build"><div class="pane-heading"><div><span class="pane-label">${pinned ? 'Pinned' : 'Selected'}</span><strong class="mono">${escape(build.model)}</strong><span>${escape(build.skill)} <span class="mono">/ V${build.variant}</span></span></div>${pinned ? '<button type="button" class="text-button" data-action="drop-pin">Drop pin ×</button>' : '<div class="preview-step"><button class="icon-button" type="button" data-action="previous-build" aria-label="Previous build">←</button><button class="icon-button" type="button" data-action="next-build" aria-label="Next build">→</button></div>'}</div><iframe title="${pinned ? 'Pinned' : 'Selected'}: ${escape(build.model)}, ${escape(build.skill)}, variant ${build.variant}" src="${escape(build.entry)}" sandbox="allow-scripts allow-same-origin allow-forms" referrerpolicy="no-referrer"></iframe><div class="frame-path mono" title="${escape(build.path)}">${escape(build.path)}</div></section>`;
  }

  function showPreview() {
    const activeAction = preview.contains(document.activeElement) ? document.activeElement.dataset.action : null;
    preview.classList.toggle('full-window', state.full);
    const markup = `<header class="preview-heading"><div><span class="preview-project">Project ${escape(state.project.name)}</span><h2 id="preview-title">${state.pinned ? 'Compare builds' : 'Build preview'}</h2></div><div class="preview-actions"><button type="button" class="button" data-action="pin-current">${state.pinned ? 'Drop pinned build' : 'Pin for comparison'}</button><button class="button window-button" type="button" data-action="toggle-window">${expandIcon}<span>${state.full ? 'Return to window' : 'Full window'}</span></button><button class="button close-preview" type="button" data-action="close-preview">Close <kbd>Esc</kbd></button></div></header><div class="preview-panes ${state.pinned ? 'is-comparing' : ''}">${frame(state.selected)}${state.pinned ? frame(state.pinned, true) : ''}</div>`;
    const template = document.createElement('template');
    template.innerHTML = markup;
    if (preview.open) {
      preview.querySelector('.preview-heading').replaceWith(template.content.querySelector('.preview-heading'));
      const panes = preview.querySelector('.preview-panes');
      panes.classList.toggle('is-comparing', Boolean(state.pinned));
      ['.preview-pane:not(.pinned-pane)', '.pinned-pane'].forEach(selector => {
        const current = panes.querySelector(selector);
        const next = template.content.querySelector(selector);
        if (current && !next) current.remove();
        else if (!current && next) panes.append(next);
        else if (current && next && current.querySelector('iframe').getAttribute('src') !== next.querySelector('iframe').getAttribute('src')) current.replaceWith(next);
      });
    } else document.querySelector('#preview-content').replaceChildren(template.content);
    if (!preview.open) {
      lastTrigger = document.activeElement;
      preview.showModal();
      document.body.classList.add('has-preview');
      preview.querySelector('[data-action="close-preview"]').focus();
    }
    if (activeAction) (preview.querySelector('[data-action="' + activeAction + '"]') || preview.querySelector('[data-action="close-preview"]')).focus();
    preview.querySelectorAll('iframe').forEach(iframe => {
      if (iframe.dataset.escapeListener) return;
      iframe.dataset.escapeListener = 'true';
      iframe.addEventListener('load', () => {
        try {
          iframe.contentWindow.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
              event.preventDefault();
              closePreview();
            }
          });
        } catch {}
      }, { once: true });
    });
  }

  function closePreview() {
    update({ preview: null, window: null });
    if (preview.open) preview.close();
  }

  function pinBuild(id) {
    if (state.pinned?.id === id) update({ pin: null });
    else {
      const selected = state.selected.id === id ? state.project.builds.find(build => build.id !== id) : state.selected;
      update({ pin: id, build: selected.id });
    }
    render();
    document.querySelector('#announcer').textContent = state.pinned ? 'Build pinned. It stays while you select another build.' : 'Pinned build removed.';
  }

  function stepBuild(direction) {
    const builds = state.project.builds.filter(build => build.id !== state.pinned?.id);
    const selectedIndex = builds.findIndex(build => build.id === state.selected.id);
    const build = builds[(selectedIndex + direction + builds.length) % builds.length];
    update({ build: build.id });
    render();
  }

  function showUtility(kind) {
    document.querySelector('#utility-title').textContent = kind === 'workspace' ? 'Workspace' : 'Keyboard shortcuts';
    document.querySelector('#utility-content').innerHTML = kind === 'workspace' ? `<p>Builds open directly from this local workspace.</p><code class="workspace-path">/Users/yon/Desktop/Programming/Projects/Frontend Lab/projects/</code><dl class="utility-facts"><div><dt>Projects</dt><dd class="mono">${PROJECTS.length}</dd></div><div><dt>Builds</dt><dd class="mono">${totalBuilds}</dd></div><div><dt>Models</dt><dd class="mono">${allModels.length}</dd></div></dl>` : '<dl class="shortcuts"><div><dt>Focus search</dt><dd><kbd>/</kbd></dd></div><div><dt>Close preview or dialog</dt><dd><kbd>Esc</kbd></dd></div><div><dt>Move between controls</dt><dd><kbd>Tab</kbd></dd></div><div><dt>Open a focused project or build</dt><dd><kbd>Enter</kbd></dd></div></dl><p>Pin a build, then select another. The pinned build stays in place.</p>';
    utility.showModal();
  }

  function render() {
    const scroll = window.scrollY;
    if (state.project) projectScreen();
    else library();
    document.title = `${state.project ? `Project ${state.project.name}` : 'Library'} | Frontend Lab`;
    if (state.overlay) showPreview();
    else if (preview.open) preview.close();
    window.scrollTo(0, scroll);
  }

  document.addEventListener('click', event => {
    const projectLink = event.target.closest('[data-project]');
    if (projectLink && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
      event.preventDefault();
      history.pushState({}, '', projectLink.href);
      state = readState();
      render();
      window.scrollTo(0, 0);
      main.focus();
      return;
    }
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'library') {
      event.preventDefault();
      history.pushState({}, '', location.pathname);
      state = readState();
      render();
      window.scrollTo(0, 0);
      main.focus();
    } else if (action === 'clear-search') {
      update({ q: null, model: null });
      library();
      document.querySelector('#project-search').focus();
    } else if (action === 'clear-builds') {
      update({ filter: null, skill: null });
      projectScreen();
      document.querySelector('#build-search').focus();
    } else if (action === 'toggle-brief') {
      update({ brief: state.expanded ? null : 'full' });
      document.querySelector('.project-brief').classList.toggle('is-expanded', state.expanded);
      target.setAttribute('aria-expanded', state.expanded);
      target.innerHTML = `${state.expanded ? 'Collapse brief' : 'Read full brief'}<span aria-hidden="true">${state.expanded ? '−' : '+'}</span>`;
    } else if (action === 'view-grid' || action === 'view-list') {
      update({ view: action === 'view-grid' ? 'grid' : 'list' });
      render();
      document.querySelector(`[data-action="${action}"]`).focus();
    } else if (action === 'select-build') {
      update({ build: state.pinned?.id === target.dataset.id ? state.selected.id : target.dataset.id, preview: 'open' }, true);
      render();
    } else if (action === 'open-preview') {
      update({ preview: 'open' }, true);
      showPreview();
    } else if (action === 'close-preview') closePreview();
    else if (action === 'pin-build') pinBuild(target.dataset.id);
    else if (action === 'pin-current') {
      if (state.pinned) {
        update({ pin: null });
        render();
      } else pinBuild(state.selected.id);
    } else if (action === 'drop-pin') {
      update({ pin: null });
      render();
    } else if (action === 'next-build') stepBuild(1);
    else if (action === 'previous-build') stepBuild(-1);
    else if (action === 'toggle-window') {
      update({ window: state.full ? null : 'full' });
      preview.classList.toggle('full-window', state.full);
      target.querySelector('span').textContent = state.full ? 'Return to window' : 'Full window';
    } else if (action === 'workspace' || action === 'shortcuts') showUtility(action);
    else if (action === 'close-utility') utility.close();
  });

  preview.addEventListener('cancel', event => {
    event.preventDefault();
    closePreview();
  });
  preview.addEventListener('close', () => {
    document.body.classList.remove('has-preview');
    document.querySelector('#preview-content').replaceChildren();
    if (state.overlay) update({ preview: null, window: null });
    if (lastTrigger?.isConnected) lastTrigger.focus();
    else document.querySelector('[data-action="open-preview"]')?.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && preview.open) {
      event.preventDefault();
      closePreview();
    }
    if (event.key === '/' && !preview.open && !utility.open && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      document.querySelector('#project-search, #build-search')?.focus();
    }
  });
  window.addEventListener('popstate', () => {
    state = readState();
    render();
  });
  state = readState();
  render();
})();
