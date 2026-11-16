const projects = window.LAB_PROJECTS;
const variant = Number(document.body.dataset.variant);
const app = document.querySelector('#app');
const previewDialog = document.querySelector('#preview-dialog');
const shortcutsDialog = document.querySelector('#shortcuts-dialog');
const icons = {
  search: '<svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="m13 13 4 4" stroke="currentColor" stroke-width="1.3"/></svg>',
  arrow: '<svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.2"/></svg>',
  expand: '<svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4" stroke="currentColor" stroke-width="1.3"/></svg>',
  grid: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2h4v4H2zm8 0h4v4h-4zM2 10h4v4H2zm8 0h4v4h-4z" stroke="currentColor"/></svg>',
  list: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor"/></svg>'
};
const state = {
  project: null,
  selected: null,
  pinned: null,
  query: '',
  model: '',
  buildModel: '',
  skill: '',
  expanded: false,
  view: variant === 1 ? 'list' : 'grid',
  fullWindow: false
};
let returnFocus = null;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function currentProject() {
  return projects.find(project => project.id === state.project) || projects[0];
}

function buildById(id, project = currentProject()) {
  return project.builds.find(build => build.id === id);
}

function projectHref(project, build) {
  return `?project=${encodeURIComponent(project.id)}${build ? `&build=${encodeURIComponent(build.id)}` : ''}`;
}

function buildPath(build) {
  return new URL(build.entry, window.location.href).pathname + new URL(build.entry, window.location.href).search;
}

function announce(message) {
  document.querySelector('#announcement').textContent = message;
}

function syncUrl(replace = false) {
  const parameters = new URLSearchParams();
  if (state.project) parameters.set('project', state.project);
  if (state.selected) parameters.set('build', state.selected);
  if (state.pinned) parameters.set('pin', state.pinned);
  if (state.expanded) parameters.set('brief', 'expanded');
  if (state.query) parameters.set('q', state.query);
  if (state.model) parameters.set('model', state.model);
  const query = parameters.toString();
  history[replace ? 'replaceState' : 'pushState']({}, '', `${location.pathname}${query ? `?${query}` : ''}`);
}

function readUrl() {
  const parameters = new URLSearchParams(location.search);
  state.project = projects.some(project => project.id === parameters.get('project')) ? parameters.get('project') : null;
  state.selected = state.project && buildById(parameters.get('build')) ? parameters.get('build') : null;
  state.pinned = state.project && buildById(parameters.get('pin')) ? parameters.get('pin') : null;
  state.expanded = parameters.get('brief') === 'expanded';
  state.query = parameters.get('q') || '';
  state.model = parameters.get('model') || '';
  state.buildModel = '';
  state.skill = '';
}

function filteredProjects() {
  const query = state.query.toLowerCase().trim();
  return projects.filter(project => `${project.name} ${project.models.join(' ')}`.toLowerCase().includes(query) && (!state.model || project.models.includes(state.model)));
}

function searchField(compact = false) {
  return `<label class="search-field${compact ? ' compact' : ''}">${icons.search}<input id="project-search" type="search" placeholder="Search projects or models" aria-label="Search projects or models" value="${escapeHtml(state.query)}" autocomplete="off"><kbd>/</kbd></label>`;
}

function modelFilter() {
  const models = [...new Set(projects.flatMap(project => project.models))];
  return `<label class="select-wrap"><span class="sr-only">Filter projects by model</span><select id="project-model"><option value="">All models</option>${models.map(model => `<option${state.model === model ? ' selected' : ''}>${escapeHtml(model)}</option>`).join('')}</select></label>`;
}

function projectModels(project) {
  return project.models.length ? project.models.map(model => `<span>${escapeHtml(model)}</span>`).join('') : '<span class="unassigned">Not specified</span>';
}

function cover(project, className = '') {
  return `<div class="project-cover ${className}" aria-hidden="true"><span class="cover-index">PROJECT / ${pad(projects.indexOf(project) + 1)}</span><span class="project-initial">${project.initial}</span><span class="cover-bottom">${escapeHtml(project.name)}<span>${icons.arrow}</span></span></div>`;
}

function buildCover(project, build) {
  return `<div class="build-cover"><img src="previews/${build.id}.jpg" alt="" width="1280" height="800" loading="eager" decoding="async"><span class="cover-note" aria-hidden="true">${pad(build.variant)}</span></div>`;
}

function libraryHeading() {
  return `<div class="page-heading"><div><div class="eyebrow">Local workspace <span>/</span> Projects</div><h1>Library<span class="heading-dot">.</span></h1><p class="page-description">Browse project briefs and compare local builds.</p></div><dl class="library-stats"><div><dd>${pad(projects.length)}</dd><dt>Projects</dt></div><div><dd>${projects.reduce((sum, project) => sum + project.builds.length, 0)}</dd><dt>Builds</dt></div><div><dd>${pad(new Set(projects.flatMap(project => project.models)).size)}</dd><dt>Models</dt></div></dl></div>`;
}

function emptyProjects() {
  return `<div class="empty-state"><span class="empty-symbol">∅</span><h2>No matching projects</h2><p>Try another project name or model.</p><button type="button" class="button" data-action="clear-search">Clear search and filters</button></div>`;
}

function projectTable(matches) {
  return `<div class="table-scroll"><table class="project-table"><caption class="sr-only">Projects in the local library</caption><thead><tr><th>Project</th><th>Brief</th><th>Models</th><th class="number">Builds</th><th><span class="sr-only">Open</span></th></tr></thead><tbody>${matches.map(project => `<tr data-action="project" data-project="${project.id}"><td><a class="project-name-link" href="${projectHref(project)}" data-action="project" data-project="${project.id}"><span class="table-initial">${project.initial}</span><span><strong>${escapeHtml(project.name)}</strong><small class="mono">/projects/${project.id}</small></span></a></td><td><p class="table-brief">${escapeHtml(project.summary)}</p></td><td class="project-models mono">${projectModels(project)}</td><td class="number build-count">${pad(project.builds.length)}</td><td class="row-arrow" aria-hidden="true">${icons.arrow}</td></tr>`).join('')}</tbody></table></div>`;
}

function projectGrid(matches) {
  return `<div class="project-grid">${matches.map(project => `<a class="project-card" href="${projectHref(project)}" data-action="project" data-project="${project.id}">${cover(project)}<div class="project-card-title"><h2>${escapeHtml(project.name)}</h2><span class="mono">${project.builds.length} builds</span></div><p>${escapeHtml(project.summary)}</p><div class="project-card-meta mono">${projectModels(project)}</div></a>`).join('')}</div>`;
}

function librarySamples() {
  const project = projects[0];
  const builds = [project.builds[0], project.builds.find(build => build.model === 'GPT Sol 6.1 High'), project.builds.find(build => build.skill === 'Apple Design +')];
  return `<section class="sample-section" aria-labelledby="samples-title"><div class="section-heading"><h2 id="samples-title">A closer look at Trio</h2><a href="${projectHref(project)}" data-action="project" data-project="trio">View all ${project.builds.length} builds ${icons.arrow}</a></div><div class="sample-grid">${builds.map(build => `<a class="sample-build" href="${projectHref(project, build)}" data-action="select" data-project="trio" data-build="${build.id}">${buildCover(project, build)}<div class="sample-build-caption"><span>${escapeHtml(build.skill)}</span><span class="mono">${pad(build.variant)}</span></div><span class="sample-model mono">${escapeHtml(build.model)}</span></a>`).join('')}</div></section>`;
}

function renderLibrary() {
  document.title = 'Library · Frontend Lab';
  app.className = variant === 3 ? 'split-library' : `library library-${variant}`;
  if (variant === 3) {
    app.innerHTML = `<aside class="library-sidebar"><div class="sidebar-heading"><h1>Library</h1><span class="mono">${pad(projects.length)}</span></div>${searchField(true)}${modelFilter()}<div id="project-results">${sidebarProjects()}</div><div class="sidebar-foot mono">/projects<br><span>Local files only</span></div></aside><section class="library-detail">${workspaceContents(projects[0], true)}</section>`;
  } else {
    app.innerHTML = `${libraryHeading()}<div class="library-toolbar">${searchField()}${modelFilter()}<span class="result-count mono" id="result-count">${resultLabel()}</span><span class="view-label mono">${variant === 1 ? 'Index view' : 'Grid view'}</span></div><section id="project-results" aria-label="Projects">${libraryResults()}</section>${variant === 1 ? '<div id="library-samples">' + librarySamples() + '</div>' : ''}<div class="library-end mono"><span>${variant === 1 ? 'INDEX' : 'END OF LIBRARY'}</span><span>${projects.reduce((sum, project) => sum + project.builds.length, 0)} builds in ${projects.length} projects</span></div>`;
  }
}

function resultLabel() {
  const count = filteredProjects().length;
  return `${pad(count)} ${count === 1 ? 'project' : 'projects'}`;
}

function sidebarProjects() {
  const matches = filteredProjects();
  if (!matches.length) return emptyProjects();
  return `<div class="sidebar-projects">${matches.map(project => `<a class="sidebar-project${project.id === (state.project || 'trio') ? ' is-active' : ''}" href="${projectHref(project)}" data-action="project" data-project="${project.id}"><div><h2>${escapeHtml(project.name)}</h2><span class="mono">${pad(project.builds.length)}</span></div><p>${escapeHtml(project.summary)}</p><span class="sidebar-models mono">${projectModels(project)}</span></a>`).join('')}</div><p class="sidebar-results mono">${resultLabel()}</p>`;
}

function libraryResults() {
  const matches = filteredProjects();
  return matches.length ? (variant === 1 ? projectTable(matches) : projectGrid(matches)) : emptyProjects();
}

function updateLibraryResults() {
  document.querySelector('#project-results').innerHTML = variant === 3 ? sidebarProjects() : libraryResults();
  const resultCount = document.querySelector('#result-count');
  if (resultCount) resultCount.textContent = resultLabel();
  const samples = document.querySelector('#library-samples');
  if (samples) samples.hidden = Boolean(state.query || state.model);
  announce(`${filteredProjects().length} matching projects`);
  syncUrl(true);
}

function briefSection(project) {
  return `<section class="brief-section${state.expanded ? ' is-expanded' : ''}" aria-labelledby="brief-title"><div class="brief-label"><h2 id="brief-title">Project brief</h2><span class="mono">${project.id === 'test-1' ? 'SAMPLE' : 'SOURCE'}</span></div><div class="brief-copy"><div class="brief-text${state.expanded ? '' : ' is-clamped'}" id="project-brief">${project.brief.split('\n\n').map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>${project.brief.length > 130 ? `<button class="text-button" type="button" data-action="brief" aria-expanded="${state.expanded}" aria-controls="project-brief">${state.expanded ? 'Collapse brief' : 'Read full brief'} <span aria-hidden="true">${state.expanded ? '−' : '+'}</span></button>` : ''}</div></section>`;
}

function buildToolbar(project) {
  const models = [...new Set(project.builds.map(build => build.model).filter(Boolean))];
  const skills = [...new Set(project.builds.map(build => build.skill))];
  return `<div class="build-toolbar"><h2>Builds <span class="mono">${project.builds.length}</span></h2><div class="build-filters"><label class="select-wrap"><span class="sr-only">Filter builds by model</span><select id="build-model"><option value="">All models</option>${models.map(model => `<option${state.buildModel === model ? ' selected' : ''}>${escapeHtml(model)}</option>`).join('')}</select></label><label class="select-wrap"><span class="sr-only">Filter builds by skill</span><select id="build-skill"><option value="">All skills</option>${skills.map(skill => `<option${state.skill === skill ? ' selected' : ''}>${escapeHtml(skill)}</option>`).join('')}</select></label></div><div class="view-toggle" aria-label="Build layout"><button type="button" data-action="view" data-view="grid" aria-label="Grid view" aria-pressed="${state.view === 'grid'}">${icons.grid}</button><button type="button" data-action="view" data-view="list" aria-label="List view" aria-pressed="${state.view === 'list'}">${icons.list}</button></div></div>`;
}

function buildCard(project, build) {
  const selected = state.selected === build.id;
  const pinned = state.pinned === build.id;
  return `<article class="build-card${selected ? ' is-selected' : ''}${pinned ? ' is-pinned' : ''}"><a href="${projectHref(project, build)}" class="build-select" data-action="select" data-project="${project.id}" data-build="${build.id}"${selected ? ' aria-current="true"' : ''} aria-label="Select ${escapeHtml(build.model || 'unspecified model')}, ${escapeHtml(build.skill)}, variant ${build.variant}">${buildCover(project, build)}<div class="build-card-heading"><h3>${escapeHtml(build.skill)}</h3><span class="variant-number mono">${pad(build.variant)}</span></div><p class="build-model mono">${escapeHtml(build.model || 'Model not specified')}</p></a><div class="build-card-bottom"><span class="mono build-state" title="${escapeHtml(buildPath(build))}">${selected ? '<span class="selection-dot"></span>Selected' : pinned ? 'Pinned reference' : escapeHtml(build.entry.split('/').slice(-4).join('/'))}</span><button type="button" class="pin-button" data-action="pin" data-project="${project.id}" data-build="${build.id}" aria-pressed="${pinned}" aria-label="${pinned ? 'Unpin' : 'Pin'} ${escapeHtml(build.skill)} variant ${build.variant}">${pinned ? 'Unpin' : 'Pin'} <span aria-hidden="true">${pinned ? '−' : '+'}</span></button></div><span class="sr-only">Entry: ${escapeHtml(buildPath(build))}</span></article>`;
}

function buildList(project, builds) {
  return `<div class="build-table-wrap"><table class="build-table"><caption class="sr-only">${escapeHtml(project.name)} builds</caption><thead><tr><th>Model</th><th>Skill</th><th class="number">Variant</th><th>Entry</th><th><span class="sr-only">Compare</span></th></tr></thead><tbody>${builds.map(build => `<tr class="${state.selected === build.id ? 'is-selected' : ''}${state.pinned === build.id ? ' is-pinned' : ''}"><td><a href="${projectHref(project, build)}" data-action="select" data-project="${project.id}" data-build="${build.id}" class="mono">${escapeHtml(build.model || 'Not specified')}</a></td><td>${escapeHtml(build.skill)}</td><td class="mono number">${pad(build.variant)}</td><td class="mono entry-column" title="${escapeHtml(buildPath(build))}">${escapeHtml(build.entry.replace(/^.*\/projects\//, '/projects/'))}</td><td><button type="button" class="pin-button" data-action="pin" data-project="${project.id}" data-build="${build.id}" aria-pressed="${state.pinned === build.id}" aria-label="${state.pinned === build.id ? 'Unpin' : 'Pin'} ${escapeHtml(build.skill)} variant ${build.variant}">${state.pinned === build.id ? 'Unpin −' : 'Pin +'}</button></td></tr>`).join('')}</tbody></table></div>`;
}

function buildCollection(project) {
  const builds = project.builds.filter(build => (!state.buildModel || build.model === state.buildModel) && (!state.skill || build.skill === state.skill));
  if (!builds.length) return '<div class="empty-state build-empty"><h3>No matching builds</h3><p>Choose another model or skill.</p><button class="button" type="button" data-action="reset-build-filters">Clear build filters</button></div>';
  return `${state.view === 'list' ? buildList(project, builds) : `<div class="build-grid">${builds.map(build => buildCard(project, build)).join('')}</div>`}<div class="build-results mono">${pad(builds.length)} of ${project.builds.length} builds${state.pinned ? '<span>Reference stays pinned when you switch builds.</span>' : '<span>Select a build to inspect it. Pin another to compare.</span>'}</div>`;
}

function iframeMarkup(build, project, context) {
  return `<iframe src="${escapeHtml(build.entry)}" title="${escapeHtml(`${project.name}: ${build.model || 'unspecified model'}, ${build.skill}, variant ${build.variant}, ${context}`)}" class="live-frame" loading="eager" referrerpolicy="no-referrer"></iframe>`;
}

function viewerPane(build, project, pinned = false, overlay = false) {
  return `<section class="viewer-pane${pinned ? ' pinned-pane' : ''}"><div class="pane-heading"><div><span class="pane-label mono">${pinned ? 'PINNED REFERENCE' : 'SELECTED BUILD'}</span><h3>${escapeHtml(build.skill)}<span class="mono">${pad(build.variant)}</span></h3><span class="pane-model mono">${escapeHtml(build.model || 'Model not specified')}</span></div>${pinned ? '<button type="button" class="text-button" data-action="unpin">Unpin <span aria-hidden="true">×</span></button>' : `<button type="button" class="text-button" data-action="${overlay ? 'pin-current' : 'open-preview'}">${overlay ? 'Pin build +' : `Open preview ${icons.expand}`}</button>`}</div>${iframeMarkup(build, project, pinned ? 'pinned reference' : 'selected build')}<div class="pane-path mono" title="${escapeHtml(buildPath(build))}">${escapeHtml(buildPath(build))}</div></section>`;
}

function viewerMarkup(project, overlay = false) {
  const selected = buildById(state.selected, project);
  const pinned = buildById(state.pinned, project);
  if (!selected && !pinned) return '';
  const compare = selected && pinned && selected.id !== pinned.id;
  return `<div tabindex="-1" class="viewer${compare ? ' is-comparing' : ''}" id="${overlay ? 'overlay-viewer' : 'inline-viewer'}">${compare ? viewerPane(pinned, project, true, overlay) + viewerPane(selected, project, false, overlay) : viewerPane(selected || pinned, project, Boolean(pinned && !selected), overlay)}</div>`;
}

function workspaceContents(project, libraryPreview = false) {
  const models = project.models.length;
  return `<div class="workspace-heading"><div><div class="eyebrow">${libraryPreview ? 'Project preview' : `<a href="index.html" data-action="library">Library</a> <span>/</span> Project`}</div><h1>${escapeHtml(project.name)}<span class="heading-dot">.</span></h1><p class="project-summary">${escapeHtml(project.summary)}</p></div><div class="project-heading-meta"><span class="mono">${project.builds.length} builds <span class="metadata-divider">/</span> ${models ? `${models} ${models === 1 ? 'model' : 'models'}` : 'Model not specified'}</span>${libraryPreview ? `<a href="${projectHref(project)}" class="button" data-action="project" data-project="${project.id}">Open project ${icons.arrow}</a>` : '<a href="index.html" class="text-button" data-action="library">All projects ' + icons.arrow + '</a>'}</div></div><div class="workspace-body">${briefSection(project)}<section class="builds-section" aria-label="Project builds">${state.selected || state.pinned ? `<div class="viewer-toolbar"><span class="mono">${state.pinned && state.pinned !== state.selected ? 'COMPARISON' : 'INSPECTOR'}</span><div>${state.selected && !state.pinned ? '<button class="text-button" type="button" data-action="pin-current">Pin selected build +</button>' : ''}<button class="text-button" type="button" data-action="close-viewer">Close inspector ×</button></div></div>${viewerMarkup(project)}` : ''}${buildToolbar(project)}<div id="build-results">${buildCollection(project)}</div></section></div>`;
}

function renderProject() {
  const project = currentProject();
  document.title = `${project.name} · Frontend Lab`;
  app.className = `workspace workspace-${variant}`;
  if (variant === 3) {
    app.className += ' split-library';
    app.innerHTML = `<aside class="library-sidebar"><div class="sidebar-heading"><a href="index.html" data-action="library">Library</a><span class="mono">${pad(projects.length)}</span></div>${searchField(true)}${modelFilter()}<div id="project-results">${sidebarProjects()}</div><div class="sidebar-foot mono">/projects<br><span>Local files only</span></div></aside><section class="library-detail">${workspaceContents(project)}</section>`;
  } else app.innerHTML = workspaceContents(project);
  bindFrameKeys();
}

function render() {
  if (state.project) renderProject();
  else renderLibrary();
  document.querySelectorAll('[data-nav]').forEach(item => {
    const active = item.dataset.nav === (state.project ? 'workspace' : 'library');
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  const compareButton = document.querySelector('[data-nav="compare"]');
  compareButton.disabled = !state.pinned;
  compareButton.title = state.pinned ? 'Open comparison' : 'Pin a build in the workspace to compare';
  document.querySelector('#compare-count').textContent = state.pinned ? '1' : '0';
}

function openProject(id, build = null) {
  const changedProject = state.project !== id;
  state.project = id;
  state.selected = build;
  if (changedProject) {
    state.pinned = null;
    state.expanded = false;
    state.buildModel = '';
    state.skill = '';
  }
  syncUrl();
  render();
  if (build) {
    const viewer = document.querySelector('#inline-viewer');
    viewer?.scrollIntoView({ block: 'start' });
    viewer?.focus({ preventScroll: true });
  }
  else {
    window.scrollTo({ top: 0 });
    app.focus({ preventScroll: true });
  }
}

function pinBuild(projectId, buildId) {
  if (state.project !== projectId) {
    state.project = projectId;
    state.selected = null;
    state.expanded = false;
    state.buildModel = '';
    state.skill = '';
  }
  state.pinned = state.pinned === buildId ? null : buildId;
  if (!state.selected && state.pinned) state.selected = currentProject().builds.find(build => build.id !== state.pinned)?.id || state.pinned;
  syncUrl();
  render();
  if (previewDialog.open) renderOverlay();
  else document.querySelector(`[data-action="pin"][data-build="${buildId}"]`)?.focus({ preventScroll: true });
  announce(state.pinned ? 'Reference pinned. It stays when you select another build.' : 'Reference unpinned.');
}

function renderOverlay() {
  const project = currentProject();
  previewDialog.classList.toggle('is-full-window', state.fullWindow);
  previewDialog.innerHTML = `<div class="preview-header"><div><span class="eyebrow">${state.pinned && state.pinned !== state.selected ? 'Compare builds' : 'Build preview'}</span><h2 id="preview-title">${escapeHtml(project.name)}<span class="preview-title-separator">/</span><span class="mono">${state.selected ? escapeHtml(buildById(state.selected).skill) : 'Pinned reference'}</span></h2></div><div class="preview-actions"><button class="button" type="button" data-action="full-window" aria-pressed="${state.fullWindow}">${icons.expand}<span>${state.fullWindow ? 'Return to window' : 'Full window'}</span></button><button class="button close-preview" type="button" data-action="close-preview">Close <kbd>esc</kbd></button></div></div>${viewerMarkup(project, true)}<div class="preview-footer"><label>Selected build <select id="preview-build">${project.builds.map(build => `<option value="${build.id}"${state.selected === build.id ? ' selected' : ''}>${escapeHtml(`${build.model || 'Not specified'} / ${build.skill} / ${pad(build.variant)}`)}</option>`).join('')}</select></label><span class="mono">${state.pinned ? 'Reference stays pinned' : 'Pin a second build to compare'}</span></div>`;
  bindFrameKeys();
}

function openPreview() {
  if (!state.selected && !state.pinned) return;
  returnFocus = document.activeElement;
  state.fullWindow = false;
  renderOverlay();
  previewDialog.showModal();
  document.body.classList.add('dialog-open');
  previewDialog.querySelector('[data-action="close-preview"]').focus();
}

function closePreview() {
  if (!previewDialog.open) return;
  previewDialog.close();
  previewDialog.innerHTML = '';
  document.body.classList.remove('dialog-open');
  state.fullWindow = false;
  const target = returnFocus?.isConnected ? returnFocus : document.querySelector('[data-action="open-preview"]');
  target?.focus({ preventScroll: true });
}

function bindFrameKeys() {
  document.querySelectorAll('.live-frame').forEach(frame => {
    frame.addEventListener('load', () => {
      try {
        frame.contentWindow.addEventListener('keydown', event => {
          if (event.key === 'Escape' && previewDialog.open) {
            event.preventDefault();
            closePreview();
          }
        });
      } catch {}
    }, { once: true });
  });
}

function focusSearch() {
  if (previewDialog.open) closePreview();
  if (state.project && (variant !== 3 || window.matchMedia('(max-width:650px)').matches)) {
    state.project = null;
    state.selected = null;
    state.pinned = null;
    syncUrl();
    render();
  }
  const search = document.querySelector('#project-search');
  search?.focus();
  search?.select();
}

document.addEventListener('click', event => {
  const control = event.target.closest('[data-action]');
  if (!control || control.disabled) return;
  if (control.tagName === 'A' && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
  event.preventDefault();
  const action = control.dataset.action;
  if (action === 'library') {
    closePreview();
    state.project = null;
    state.selected = null;
    state.pinned = null;
    state.expanded = false;
    syncUrl();
    render();
    window.scrollTo({ top: 0 });
    app.focus({ preventScroll: true });
  }
  if (action === 'workspace') openProject(state.project || 'trio');
  if (action === 'project') openProject(control.dataset.project);
  if (action === 'select') openProject(control.dataset.project, control.dataset.build);
  if (action === 'pin') pinBuild(control.dataset.project, control.dataset.build);
  if (action === 'pin-current') pinBuild(state.project, state.selected);
  if (action === 'unpin') {
    state.pinned = null;
    syncUrl();
    render();
    if (previewDialog.open) renderOverlay();
    announce('Reference unpinned.');
  }
  if (action === 'clear-search') {
    state.query = '';
    state.model = '';
    document.querySelector('#project-search').value = '';
    document.querySelector('#project-model').value = '';
    updateLibraryResults();
    document.querySelector('#project-search').focus();
  }
  if (action === 'brief') {
    state.expanded = !state.expanded;
    syncUrl(true);
    const section = document.querySelector('.brief-section');
    section.classList.toggle('is-expanded', state.expanded);
    section.querySelector('.brief-text').classList.toggle('is-clamped', !state.expanded);
    control.setAttribute('aria-expanded', String(state.expanded));
    control.innerHTML = `${state.expanded ? 'Collapse brief' : 'Read full brief'} <span aria-hidden="true">${state.expanded ? '−' : '+'}</span>`;
  }
  if (action === 'view') {
    state.view = control.dataset.view;
    document.querySelectorAll('[data-action="view"]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === state.view)));
    document.querySelector('#build-results').innerHTML = buildCollection(currentProject());
  }
  if (action === 'reset-build-filters') {
    state.buildModel = '';
    state.skill = '';
    document.querySelector('#build-model').value = '';
    document.querySelector('#build-skill').value = '';
    document.querySelector('#build-results').innerHTML = buildCollection(currentProject());
  }
  if (action === 'close-viewer') {
    state.selected = null;
    state.pinned = null;
    syncUrl();
    render();
  }
  if (action === 'open-preview' || action === 'compare') openPreview();
  if (action === 'close-preview') closePreview();
  if (action === 'full-window') {
    state.fullWindow = !state.fullWindow;
    previewDialog.classList.toggle('is-full-window', state.fullWindow);
    control.setAttribute('aria-pressed', String(state.fullWindow));
    control.querySelector('span').textContent = state.fullWindow ? 'Return to window' : 'Full window';
  }
  if (action === 'search') focusSearch();
  if (action === 'shortcuts') shortcutsDialog.showModal();
  if (action === 'close-shortcuts') shortcutsDialog.close();
});

document.addEventListener('input', event => {
  if (event.target.id === 'project-search') {
    state.query = event.target.value;
    updateLibraryResults();
  }
});

document.addEventListener('change', event => {
  if (event.target.id === 'project-model') {
    state.model = event.target.value;
    updateLibraryResults();
  }
  if (event.target.id === 'build-model' || event.target.id === 'build-skill') {
    state[event.target.id === 'build-model' ? 'buildModel' : 'skill'] = event.target.value;
    document.querySelector('#build-results').innerHTML = buildCollection(currentProject());
    announce(`${document.querySelector('#build-results').innerText.split('\n').at(-1)}`);
  }
  if (event.target.id === 'preview-build') {
    state.selected = event.target.value;
    syncUrl();
    render();
    renderOverlay();
    document.querySelector('#preview-build').focus();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && previewDialog.open) {
    event.preventDefault();
    closePreview();
  }
  if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) && !event.target.isContentEditable && !shortcutsDialog.open) {
    event.preventDefault();
    focusSearch();
  }
});

previewDialog.addEventListener('cancel', event => {
  event.preventDefault();
  closePreview();
});
previewDialog.addEventListener('click', event => {
  if (event.target === previewDialog) {
    const bounds = previewDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePreview();
  }
});
window.addEventListener('popstate', () => {
  closePreview();
  readUrl();
  render();
});
readUrl();
render();
