(() => {
  'use strict';

  const projects = window.LAB_PROJECTS;
  const layout = document.documentElement.dataset.layout;
  const main = document.querySelector('#main');
  const dialog = document.querySelector('#preview-dialog');
  const announcement = document.querySelector('#announcement');
  const models = [...new Set(projects.flatMap(project => project.models))];
  const totalBuilds = projects.reduce((total, project) => total + project.builds.length, 0);
  let state = readState();
  let previewOpener = null;
  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      const frame = entry.target.querySelector('iframe');
      if (!frame) return;
      const scale = entry.contentRect.width / 1280;
      frame.style.setProperty('--preview-scale', scale);
      frame.style.setProperty('--preview-height', `${Math.max(700, entry.contentRect.height / scale)}px`);
    });
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }

  function readState() {
    const params = new URLSearchParams(location.search);
    const project = projects.find(item => item.id === params.get('project'));
    const selected = project?.builds.find(build => build.id === params.get('build'))?.id || null;
    const pinned = project?.builds.find(build => build.id === params.get('pin'))?.id || null;
    return {
      project: project?.id || null,
      selected,
      pinned,
      query: params.get('q') || '',
      model: models.includes(params.get('model')) ? params.get('model') : '',
      skill: params.get('skill') || '',
      expanded: params.get('brief') === 'full',
      preview: params.get('preview') === '1' && Boolean(selected),
      fullscreen: params.get('full') === '1',
      limit: 12
    };
  }

  function syncUrl(replace = false) {
    const params = new URLSearchParams();
    if (state.project) params.set('project', state.project);
    if (state.selected) params.set('build', state.selected);
    if (state.pinned) params.set('pin', state.pinned);
    if (state.query) params.set('q', state.query);
    if (state.model) params.set('model', state.model);
    if (state.skill) params.set('skill', state.skill);
    if (state.expanded) params.set('brief', 'full');
    if (state.preview) params.set('preview', '1');
    if (state.preview && state.fullscreen) params.set('full', '1');
    const query = params.toString();
    history[replace ? 'replaceState' : 'pushState'](null, '', `${location.pathname}${query ? `?${query}` : ''}`);
  }

  function currentProject() {
    return projects.find(project => project.id === state.project);
  }

  function projectHref(project) {
    return `?project=${encodeURIComponent(project.id)}`;
  }

  function searchField(placeholder, id = 'search') {
    return `<label class="search-field"><span class="sr-only">${placeholder}</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="m13 13 4 4" stroke="currentColor" stroke-width="1.4"/></svg><input id="${id}" name="q" type="search" placeholder="${placeholder}" value="${escapeHtml(state.query)}" autocomplete="off" spellcheck="false"><kbd aria-hidden="true">/</kbd></label>`;
  }

  function modelSelect(projectModels = models) {
    return `<label><span class="sr-only">Filter by model</span><select class="filter-select" id="model-filter"><option value="">All models</option>${projectModels.map(model => `<option value="${escapeHtml(model)}" ${state.model === model ? 'selected' : ''}>${escapeHtml(model)}</option>`).join('')}</select></label>`;
  }

  function projectModels(project, mobile = false) {
    return `<span class="${mobile ? 'mobile-models' : 'project-models'}">${project.models.map(model => `<span class="model-row">${escapeHtml(model)}</span>`).join(mobile ? '<br>' : '')}</span>`;
  }

  function initial(project) {
    return project.id === 'test-1' ? 'T1' : project.name.charAt(0);
  }

  function libraryHeader() {
    return `<div class="page-header"><div><h1>Project library</h1><p class="page-description">One brief. Every build. A place to compare.</p></div><div class="header-stats"><div class="header-stat"><strong>${projects.length}</strong><span>projects</span></div><div class="header-stat"><strong>${totalBuilds}</strong><span>builds</span></div></div></div><div class="library-tools">${searchField('Search projects or models')}${modelSelect()}<p class="results-total" id="results-total" aria-live="polite"></p></div>`;
  }

  function matchingProjects() {
    const query = state.query.trim().toLowerCase();
    return projects.filter(project => (!query || `${project.name} ${project.models.join(' ')}`.toLowerCase().includes(query)) && (!state.model || project.models.includes(state.model)));
  }

  function emptyState(kind) {
    const query = state.query ? ` for "${escapeHtml(state.query)}"` : ' with these filters';
    return `<div class="empty-state"><h2>No ${kind}${query}</h2><p>Try a project name or model, or clear the filters to see everything.</p><button class="button" data-action="reset-filters">Clear filters <span aria-hidden="true">↗</span></button></div>`;
  }

  function libraryTable(filtered) {
    return `<table class="project-table"><thead><tr><th scope="col">Project / brief</th><th scope="col">Models</th><th scope="col">Builds</th><th scope="col"><span class="sr-only">Open project</span></th></tr></thead><tbody>${filtered.map(project => `<tr><td><a class="table-project-link" href="${projectHref(project)}" data-project="${project.id}"><span class="project-initial ${project.id}" aria-hidden="true">${initial(project)}</span><span><span class="project-name">${project.name}</span><span class="project-summary" style="display:block">${project.summary}</span>${projectModels(project, true)}</span></a></td><td>${projectModels(project)}</td><td class="build-count">${project.builds.length}</td><td class="row-open"><a class="open-arrow" href="${projectHref(project)}" data-project="${project.id}" aria-label="Open ${project.name}">↗</a></td></tr>`).join('')}</tbody></table>`;
  }

  function libraryGrid(filtered) {
    return `<div class="project-card-grid">${filtered.map(project => `<article class="project-card"><a class="project-card-link" href="${projectHref(project)}" data-project="${project.id}"><div class="project-cover ${project.id}"><span class="cover-name">${project.id}/</span><span class="cover-initial" aria-hidden="true">${initial(project)}</span><span class="cover-arrow" aria-hidden="true">↗</span></div><div class="project-card-title"><h2 class="project-name">${project.name}</h2><span class="count">${project.builds.length} builds</span></div><p class="project-summary">${project.summary}</p></a><div class="project-models">${project.models.map(model => `<span class="model-row"><span class="model-square" aria-hidden="true"></span>${model}</span>`).join('')}</div></article>`).join('')}</div>`;
  }

  function librarySplit(filtered) {
    const featured = filtered[0];
    const groups = new Set();
    const featuredBuilds = featured.builds.filter(build => {
      const group = `${build.model}/${build.skill}`;
      if (groups.has(group)) return false;
      groups.add(group);
      return true;
    }).slice(0, 4);
    const entries = filtered.map(project => `<a class="split-project ${project === featured ? 'is-featured' : ''}" href="${projectHref(project)}" data-project="${project.id}">
      <span class="project-initial ${project.id}" aria-hidden="true">${initial(project)}</span>
      <span class="split-entry-copy"><span class="project-name">${project.name}</span><span class="project-summary">${project.summary}</span>${projectModels(project)}</span>
      <span class="count">${project.builds.length}<span class="sr-only"> builds</span></span>
    </a>`).join('');
    return `<div class="library-split"><aside><div class="split-projects">${entries}</div><div class="split-brief"><span class="section-label">${featured.name} / brief</span><p>${escapeHtml(featured.brief.split('\n\n')[0])}</p><a class="text-button" href="${projectHref(featured)}" data-project="${featured.id}">Read the full brief <span aria-hidden="true">↗</span></a></div></aside><section class="split-detail" aria-label="${featured.name} overview"><div class="split-detail-header"><div><h2>${featured.name}</h2><p>${featured.builds.length} builds from the same brief.</p></div><a class="button" href="${projectHref(featured)}" data-project="${featured.id}">Open project <span aria-hidden="true">↗</span></a></div><div class="featured-builds">${featuredBuilds.map(build => buildCard(featured, build, true)).join('')}</div></section></div>`;
  }

  function renderLibraryResults() {
    const filtered = matchingProjects();
    document.querySelector('#results-total').textContent = `${filtered.length} of ${projects.length} projects`;
    const target = document.querySelector('#project-results');
    target.innerHTML = !filtered.length ? emptyState('projects') : layout === '1' ? libraryTable(filtered) : layout === '2' ? libraryGrid(filtered) : librarySplit(filtered);
  }

  function renderLibrary() {
    document.title = 'Project library · Frontend Lab';
    main.className = 'library-page';
    main.innerHTML = `${libraryHeader()}<div id="project-results"></div><div class="library-note"><span>Select a project to read its brief and browse the builds.</span><span class="mono">${totalBuilds} builds · ${models.length} models · stored locally</span></div>`;
    renderLibraryResults();
  }

  function briefMarkup(project) {
    return `<section class="project-brief" aria-label="Project brief"><h2 class="brief-label">Project brief</h2><div class="brief-body"><div class="brief-text ${state.expanded ? '' : 'collapsed'}" id="brief-text">${escapeHtml(project.brief)}</div><button class="text-button brief-toggle" data-action="toggle-brief" aria-controls="brief-text" aria-expanded="${state.expanded}">${state.expanded ? 'Collapse brief' : 'Read full brief'} <span aria-hidden="true">${state.expanded ? '−' : '+'}</span></button></div></section>`;
  }

  function contextMarkup(project) {
    return `<div class="project-context"><div class="context-row"><p class="section-label">Models</p>${projectModels(project)}</div><div class="context-row"><p class="section-label">Project directory</p><p class="mono">projects/${project.id}/</p></div><div class="context-row"><p class="section-label">Compare builds</p><p class="mono">Pin one build, then select another. The pinned build stays in place.</p></div></div>`;
  }

  function buildCard(project, build, featured = false) {
    const selected = state.selected === build.id && state.project === project.id;
    const pinned = state.pinned === build.id && state.project === project.id;
    return `<article class="build-card"><button class="build-image-link" data-action="select-build" data-build="${build.id}" data-build-project="${project.id}" aria-label="Select ${build.model}, ${build.skill}, variant ${build.variant}" aria-pressed="${selected}"><img src="previews/${project.id}-${build.id}.jpg" alt="${escapeHtml(build.skill)} variant ${build.variant} screenshot" loading="lazy" width="720" height="450">${selected || pinned ? `<span class="selected-label">${pinned ? 'Pinned' : 'Selected'}</span>` : ''}</button><div class="build-card-meta"><h3 class="build-skill">${escapeHtml(build.skill)}</h3><span class="build-variant">Variant ${String(build.variant).padStart(2, '0')}</span></div><div class="build-card-bottom"><span class="build-model">${build.model}</span><button class="pin-button" data-action="pin-build" data-build="${build.id}" data-build-project="${project.id}" aria-label="${pinned ? 'Unpin' : 'Pin'} ${build.skill} variant ${build.variant}" aria-pressed="${pinned}">${pinned ? 'Pinned ×' : 'Pin +'}</button></div>${featured ? '' : `<p class="build-path" title="${escapeHtml(build.entry)}">${build.entry}</p>`}</article>`;
  }

  function buildTable(project, builds) {
    return `<table class="build-table"><thead><tr><th scope="col">Model</th><th scope="col">Skill</th><th scope="col">Variant</th><th scope="col">Entry path</th><th scope="col"><span class="sr-only">Compare</span></th></tr></thead><tbody>${builds.map(build => `<tr class="${state.selected === build.id ? 'build-row-selected' : ''}"><td><span class="build-model">${build.model}</span><button class="pin-button mobile-pin" data-action="pin-build" data-build="${build.id}" aria-pressed="${state.pinned === build.id}" aria-label="${state.pinned === build.id ? 'Unpin' : 'Pin'} ${build.skill} variant ${build.variant}">${state.pinned === build.id ? 'Pinned ×' : 'Pin +'}</button></td><td><button class="build-select" data-action="select-build" data-build="${build.id}" aria-pressed="${state.selected === build.id}">${escapeHtml(build.skill)}</button></td><td><span class="build-variant">${String(build.variant).padStart(2, '0')}</span></td><td><p class="build-path" title="${escapeHtml(build.entry)}">${build.entry}</p></td><td><button class="pin-button" data-action="pin-build" data-build="${build.id}" aria-pressed="${state.pinned === build.id}" aria-label="${state.pinned === build.id ? 'Unpin' : 'Pin'} ${build.skill} variant ${build.variant}">${state.pinned === build.id ? 'Pinned ×' : 'Pin +'}</button></td></tr>`).join('')}</tbody></table>`;
  }

  function matchingBuilds(project) {
    const query = state.query.trim().toLowerCase();
    return project.builds.filter(build => (!state.model || build.model === state.model) && (!state.skill || build.skill === state.skill) && (!query || `${build.model} ${build.skill} ${build.variant} ${build.entry}`.toLowerCase().includes(query)));
  }

  function renderBuildResults() {
    const project = currentProject();
    if (!project) return;
    const filtered = matchingBuilds(project);
    const visible = layout === '1' ? filtered : filtered.slice(0, state.limit);
    document.querySelector('#build-total').textContent = filtered.length === project.builds.length ? String(project.builds.length) : `${filtered.length} / ${project.builds.length}`;
    document.querySelector('#build-results').innerHTML = !filtered.length ? emptyState('builds') : `${layout === '1' ? buildTable(project, visible) : `<div class="build-grid">${visible.map(build => buildCard(project, build)).join('')}</div>`}${layout !== '1' ? `<div class="load-more-wrap"><span>${visible.length} of ${filtered.length} builds</span>${visible.length < filtered.length ? '<button class="button" data-action="more-builds">Show more builds <span aria-hidden="true">↓</span></button>' : '<span>All builds shown</span>'}</div>` : ''}`;
  }

  function paneMarkup(project, build, pinned = false) {
    return `<section class="preview-pane" aria-label="${pinned ? 'Pinned' : 'Selected'} build"><header class="pane-heading"><div class="pane-name"><span class="pane-marker">${pinned ? 'B' : 'A'}</span><div><h3>${escapeHtml(build.skill)} <span class="muted">/ ${String(build.variant).padStart(2, '0')}</span></h3><p class="build-model">${build.model}</p></div></div>${pinned ? '<button class="text-button" data-action="unpin">Unpin ×</button>' : '<span class="count muted">Selected</span>'}</header><div class="frame-screen"><iframe class="live-frame" src="${escapeHtml(build.url)}" title="${escapeHtml(project.name)}: ${escapeHtml(build.model)}, ${escapeHtml(build.skill)}, variant ${build.variant}" sandbox="allow-scripts allow-same-origin allow-forms" loading="lazy"></iframe></div><p class="pane-path" title="${escapeHtml(build.entry)}">${build.entry}</p></section>`;
  }

  function viewerMarkup(project) {
    const selected = project.builds.find(build => build.id === state.selected);
    if (!selected) return '';
    const pinned = project.builds.find(build => build.id === state.pinned);
    return `<section class="selected-viewer" id="selected-viewer" aria-label="${pinned ? 'Build comparison' : 'Selected build'}"><header class="viewer-toolbar"><div class="viewer-state"><span class="status-dot"></span>${pinned ? 'Compare builds' : 'Build preview'}<span class="mono">${pinned ? 'Pinned build stays in place' : 'Select another build below'}</span></div><div class="viewer-actions">${pinned ? '<button class="text-button" data-action="unpin">Drop pinned build</button>' : `<button class="text-button" data-action="pin-build" data-build="${selected.id}">Pin for comparison +</button>`}<button class="button" data-action="open-preview">Open preview <span aria-hidden="true">↗</span></button></div></header><div class="viewer-panes ${pinned ? 'is-compare' : ''}">${paneMarkup(project, selected)}${pinned ? paneMarkup(project, pinned, true) : ''}</div></section>`;
  }

  function renderProject() {
    const project = currentProject();
    const skills = [...new Set(project.builds.map(build => build.skill))];
    document.title = `${project.name} · Frontend Lab`;
    main.className = 'project-page';
    const intro = `<div class="breadcrumbs"><a href="index.html" data-action="library">Library</a><span class="divider">/</span><span>${project.name}</span></div><div class="page-header project-page-header"><div><h1>${project.name}</h1><p class="page-description">${project.builds.length} builds <span aria-hidden="true">·</span> ${project.models.length} ${project.models.length === 1 ? 'model' : 'models'} <span aria-hidden="true">·</span> projects/${project.id}/</p></div><a class="button" href="index.html" data-action="library"><span aria-hidden="true">←</span> All projects</a></div>`;
    const toolbar = `<div class="build-toolbar"><div class="build-title"><h2>Builds</h2><span class="count" id="build-total"></span></div><div class="build-filters">${searchField('Search builds')}${modelSelect(project.models)}<label><span class="sr-only">Filter by skill</span><select class="filter-select" id="skill-filter"><option value="">All skills</option>${skills.map(skill => `<option value="${escapeHtml(skill)}" ${state.skill === skill ? 'selected' : ''}>${escapeHtml(skill)}</option>`).join('')}</select></label></div></div>`;
    const builds = `<div class="project-builds"><div id="viewer-container">${viewerMarkup(project)}</div>${toolbar}<div id="build-results"></div></div>`;
    main.innerHTML = `${intro}<div class="project-workspace">${layout === '3' ? `<aside class="project-sidebar">${briefMarkup(project)}${contextMarkup(project)}</aside>${builds}` : `<div>${briefMarkup(project)}${builds}</div>`}</div>`;
    renderBuildResults();
    activateFrames();
  }

  function activateFrames(root = main) {
    root.querySelectorAll('.frame-screen').forEach(screen => {
      resizeObserver.observe(screen);
      const frame = screen.querySelector('iframe');
      const connectKeyboard = () => {
        try {
          frame.contentWindow.addEventListener('keydown', onFrameKey, true);
        } catch (error) {
          announce('This build cannot share keyboard events. Use the Close button to return.');
        }
      };
      connectKeyboard();
      frame.addEventListener('load', connectKeyboard);
    });
  }

  function onFrameKey(event) {
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault();
      closePreview();
    }
  }

  function updateNavigation() {
    const compare = document.querySelector('#compare-nav');
    const library = document.querySelector('.menu-nav [data-action="library"]');
    compare.disabled = !state.pinned;
    document.querySelector('#compare-count').hidden = !state.pinned;
    compare.setAttribute('aria-label', state.pinned ? 'Compare two builds' : 'Pin a build to enable comparison');
    if (state.pinned) {
      compare.setAttribute('aria-current', 'page');
      library.removeAttribute('aria-current');
    } else {
      library.setAttribute('aria-current', 'page');
      compare.removeAttribute('aria-current');
    }
  }

  function render() {
    resizeObserver.disconnect();
    if (dialog.open) dialog.close();
    document.querySelector('#overlay-content').innerHTML = '';
    if (state.project) renderProject();
    else renderLibrary();
    updateNavigation();
    if (state.preview) openPreview(false);
  }

  function announce(message) {
    announcement.textContent = message;
  }

  function focusSearch() {
    const search = document.querySelector('#search');
    const target = search?.getClientRects().length ? search : document.querySelector('#model-filter');
    target?.focus();
  }

  function openProject(id) {
    state = { project: id, selected: null, pinned: null, query: '', model: '', skill: '', expanded: false, preview: false, fullscreen: false, limit: 12 };
    syncUrl();
    render();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  function refreshViewer() {
    resizeObserver.disconnect();
    document.querySelector('#viewer-container').innerHTML = viewerMarkup(currentProject());
    renderBuildResults();
    activateFrames();
    updateNavigation();
    syncUrl();
    const viewer = document.querySelector('#selected-viewer');
    if (viewer) {
      viewer.tabIndex = -1;
      viewer.focus({ preventScroll: true });
    }
  }

  function selectBuild(id, projectId) {
    if (projectId && projectId !== state.project) {
      openProject(projectId);
    }
    if (id === state.pinned) {
      announce('That build is pinned. Select another build to compare.');
      return;
    }
    state.selected = id;
    refreshViewer();
    document.querySelector('#selected-viewer')?.scrollIntoView({ block: 'nearest' });
    announce('Build selected. The pinned build has not changed.');
  }

  function pinBuild(id, projectId) {
    if (projectId && projectId !== state.project) openProject(projectId);
    const project = currentProject();
    if (!project) return;
    if (state.pinned === id) {
      state.pinned = null;
      announce('Pinned build removed.');
    } else {
      state.pinned = id;
      if (!state.selected || state.selected === id) state.selected = project.builds.find(build => build.id !== id)?.id || null;
      announce('Build pinned. Select another build to compare.');
    }
    refreshViewer();
    document.querySelector('#selected-viewer')?.scrollIntoView({ block: 'nearest' });
  }

  function openPreview(update = true) {
    const project = currentProject();
    if (!project || !state.selected) return;
    previewOpener = document.activeElement;
    state.preview = true;
    const selected = project.builds.find(build => build.id === state.selected);
    const pinned = project.builds.find(build => build.id === state.pinned);
    document.querySelector('#preview-title').textContent = `${project.name} / ${pinned ? 'Compare builds' : 'Build preview'}`;
    document.querySelector('#overlay-content').innerHTML = `<div class="viewer-panes ${pinned ? 'is-compare' : ''}">${paneMarkup(project, selected)}${pinned ? paneMarkup(project, pinned, true) : ''}</div>`;
    dialog.classList.toggle('is-fullscreen', state.fullscreen);
    document.querySelector('#fullscreen-button').innerHTML = state.fullscreen ? 'Restore window <span aria-hidden="true">↙</span>' : 'Full window <span aria-hidden="true">↗</span>';
    if (!dialog.open) dialog.showModal();
    activateFrames(dialog);
    if (update) syncUrl();
  }

  function closePreview() {
    state.preview = false;
    state.fullscreen = false;
    dialog.close();
    document.querySelector('#overlay-content').innerHTML = '';
    syncUrl(true);
    activateFrames();
    const returnTarget = previewOpener?.isConnected ? previewOpener : document.querySelector('[data-action="open-preview"]');
    returnTarget?.focus();
    announce('Preview closed.');
  }

  document.addEventListener('click', event => {
    const projectLink = event.target.closest('[data-project]');
    if (projectLink && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
      event.preventDefault();
      openProject(projectLink.dataset.project);
      return;
    }
    const control = event.target.closest('[data-action]');
    if (!control || control.disabled || event.metaKey || event.ctrlKey) return;
    const action = control.dataset.action;
    event.preventDefault();
    if (action === 'library') {
      state = { project: null, selected: null, pinned: null, query: '', model: '', skill: '', expanded: false, preview: false, fullscreen: false, limit: 12 };
      syncUrl();
      render();
      window.scrollTo(0, 0);
    }
    if (action === 'search') focusSearch();
    if (action === 'reset-filters') {
      state.query = '';
      state.model = '';
      state.skill = '';
      syncUrl(true);
      render();
      document.querySelector('#search')?.focus();
    }
    if (action === 'toggle-brief') {
      state.expanded = !state.expanded;
      const text = document.querySelector('#brief-text');
      text.classList.toggle('collapsed', !state.expanded);
      control.setAttribute('aria-expanded', String(state.expanded));
      control.innerHTML = state.expanded ? 'Collapse brief <span aria-hidden="true">−</span>' : 'Read full brief <span aria-hidden="true">+</span>';
      syncUrl(true);
    }
    if (action === 'select-build') selectBuild(control.dataset.build, control.dataset.buildProject);
    if (action === 'pin-build') pinBuild(control.dataset.build, control.dataset.buildProject);
    if (action === 'unpin') {
      state.pinned = null;
      if (dialog.open) {
        document.querySelector('#overlay-content .preview-pane:last-child')?.remove();
        document.querySelector('#overlay-content .viewer-panes')?.classList.remove('is-compare');
        document.querySelector('#preview-title').textContent = `${currentProject().name} / Build preview`;
      }
      refreshViewer();
      if (dialog.open) activateFrames(dialog);
      announce('Pinned build removed.');
    }
    if (action === 'compare') document.querySelector('#selected-viewer')?.scrollIntoView({ block: 'start' });
    if (action === 'more-builds') {
      state.limit += 12;
      renderBuildResults();
    }
    if (action === 'open-preview') openPreview();
    if (action === 'close-preview') closePreview();
    if (action === 'fullscreen') {
      state.fullscreen = !state.fullscreen;
      dialog.classList.toggle('is-fullscreen', state.fullscreen);
      control.innerHTML = state.fullscreen ? 'Restore window <span aria-hidden="true">↙</span>' : 'Full window <span aria-hidden="true">↗</span>';
      syncUrl(true);
    }
  });

  document.addEventListener('input', event => {
    if (event.target.id !== 'search') return;
    state.query = event.target.value;
    state.limit = 12;
    syncUrl(true);
    if (state.project) renderBuildResults();
    else renderLibraryResults();
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'model-filter') state.model = event.target.value;
    else if (event.target.id === 'skill-filter') state.skill = event.target.value;
    else return;
    state.limit = 12;
    syncUrl(true);
    if (state.project) renderBuildResults();
    else renderLibraryResults();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault();
      closePreview();
    }
    if (event.key === '/' && !dialog.open && !event.ctrlKey && !event.metaKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      focusSearch();
    }
  });

  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closePreview();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePreview();
  });
  window.addEventListener('popstate', () => {
    state = readState();
    render();
  });
  render();
})();
