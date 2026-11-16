(() => {
  'use strict';
  const projects = window.LAB_PROJECTS;
  const variant = Number(document.body.dataset.variant);
  const app = document.getElementById('app');
  const dialog = document.getElementById('preview');
  const state = { project: null, query: '', model: '', skill: '', expanded: false, selected: null, pinned: null, full: false };
  let returnFocus = null;
  const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => ({search:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',arrow:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',expand:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m6 0h5v-5"/></svg>'}[name]);
  function header() {
    const active = state.project;
    if (variant === 3) return `<aside class="rail"><a class="brand" href="#library">Frontend Lab<span class="brand-dot" aria-hidden="true"></span></a><p class="rail-label">Workspace</p><a class="rail-library ${active?'':'active'}" href="#library">Library <span>3</span></a><nav class="rail-projects" aria-label="Projects">${projects.map(p => `<a href="#${p.id}" ${active?.id===p.id?'aria-current="page"':''}>${p.name}<span>${p.builds.length}</span></a>`).join('')}</nav><div class="rail-foot">Local workspace<br><span>Frontend builds, side by side.</span></div></aside>`;
    return `<header class="topbar"><a class="brand" href="#library"><span class="brand-dot" aria-hidden="true"></span>Frontend Lab</a><nav aria-label="Main navigation"><a class="nav-library" href="#library" ${!active?'aria-current="page"':''}>Library</a>${active?`<span class="nav-divider">/</span><span>${active.name}</span>`:''}</nav><span class="local-note">Local workspace</span></header>`;
  }
  function searchBox() {
    return `<div class="search-wrap"><label class="search-label" for="project-search">Search projects</label><div class="search-field">${icon('search')}<input type="search" id="project-search" placeholder="Search by project or model" autocomplete="off" value="${esc(state.query)}"><kbd aria-hidden="true">/</kbd></div></div>`;
  }
  function cover(p) { return `<div class="project-cover cover-${p.id}" aria-hidden="true"><span>${p.name[0]}</span></div>`; }
  function projectCard(p) {
    return `<a class="project-entry" href="#${p.id}" aria-label="Open ${p.name}, ${p.builds.length} builds">${cover(p)}<div class="project-info"><h2>${p.name}</h2><p class="project-summary">${esc(p.summary)}</p><div class="project-models">${p.models.map(m=>`<span>${esc(m)}</span>`).join('')}</div></div><div class="project-count"><strong>${p.builds.length}</strong><span>builds</span></div><span class="entry-arrow">${icon('arrow')}</span></a>`;
  }
  function renderLibrary() {
    app.innerHTML = `${header()}<main id="main" tabindex="-1" class="library page"><div class="library-heading"><div><div class="page-context">Library</div><h1>${variant===1?'Project index':variant===2?'Projects':'Project library'}<span class="heading-count">3</span></h1><p class="page-lead">Browse projects and compare their frontend builds.</p></div>${searchBox()}</div><div class="library-toolbar"><span id="results-count" role="status"></span><span class="library-sort">${variant===1?'Project':'All projects'}</span><span class="model-column-label">Models</span><span class="build-column-label">Builds</span></div><div id="project-list" class="project-list"></div><footer class="library-footer"><span>56 builds across 3 projects</span><span>Choose a project to view its builds.</span></footer></main>`;
    renderResults();
    document.getElementById('project-search').addEventListener('input', e => {state.query=e.target.value;renderResults();});
  }
  function renderResults() {
    const q = state.query.trim().toLowerCase();
    const filtered = projects.filter(p => `${p.name} ${p.models.join(' ')}`.toLowerCase().includes(q));
    document.getElementById('results-count').textContent = `${filtered.length} ${filtered.length===1?'project':'projects'}${q?' found':''}`;
    document.getElementById('project-list').innerHTML = filtered.length ? filtered.map(projectCard).join('') : `<div class="empty-state"><h2>No projects found</h2><p>No project or model matches "${esc(state.query)}".</p><button class="button secondary" id="clear-search">Clear search</button></div>`;
    document.getElementById('clear-search')?.addEventListener('click',()=>{state.query='';const field=document.getElementById('project-search');field.value='';renderResults();field.focus();});
  }
  function briefPanel() {
    const p=state.project;
    return `<section class="brief-panel" aria-labelledby="brief-title"><div class="section-heading"><h2 id="brief-title">The brief</h2><span>Project source</span></div><div id="brief-copy" class="brief-copy ${state.expanded?'expanded':''}">${p.brief.split('\n\n').map(t=>`<p>${esc(t)}</p>`).join(' ')}</div>${p.brief.length>180?`<button id="toggle-brief" class="text-button" aria-expanded="${state.expanded}" aria-controls="brief-copy">${state.expanded?'Collapse brief':'Read full brief'} <span aria-hidden="true">${state.expanded?'−':'+'}</span></button>`:''}</section>`;
  }
  function filters() {
    const models = state.project.models;
    const skills = [...new Set(state.project.builds.map(b=>b.skill))];
    return `<div class="build-toolbar"><div class="build-heading"><h2>Builds</h2><span id="build-count" role="status">${state.project.builds.length}</span></div><div class="filters"><label><span class="sr-only">Filter by model</span><select id="model-filter"><option value="">All models</option>${models.map(m=>`<option ${state.model===m?'selected':''}>${esc(m)}</option>`).join('')}</select></label><label><span class="sr-only">Filter by skill</span><select id="skill-filter"><option value="">All skills</option>${skills.map(s=>`<option ${state.skill===s?'selected':''}>${esc(s)}</option>`).join('')}</select></label></div></div>`;
  }
  function renderProject() {
    const p=state.project;
    app.innerHTML=`${header()}<main id="main" tabindex="-1" class="project page"><a class="back-link" href="#library"><span aria-hidden="true">‹</span> All projects</a><div class="project-heading"><div><div class="page-context">Project</div><h1>${p.name}<span class="heading-count">${p.builds.length} builds</span></h1><p class="page-lead">${esc(p.summary)}</p></div><div class="project-facts"><span>Models</span>${p.models.map(m=>`<strong>${esc(m)}</strong>`).join('')}</div></div><div class="project-workspace">${briefPanel()}<section class="build-section" aria-label="Project builds">${filters()}<div class="build-help"><span>Open a build to inspect it. Pin another to compare.</span><span id="pin-status">${state.pinned?'One build pinned':'No build pinned'}</span></div><div class="build-grid" id="build-grid"></div></section></div></main>`;
    document.getElementById('toggle-brief')?.addEventListener('click', e=>{
      state.expanded=!state.expanded;
      document.getElementById('brief-copy').classList.toggle('expanded',state.expanded);
      e.currentTarget.setAttribute('aria-expanded',state.expanded);
      e.currentTarget.innerHTML=`${state.expanded?'Collapse brief':'Read full brief'} <span aria-hidden="true">${state.expanded?'−':'+'}</span>`;
    });
    for(const id of ['model','skill']) document.getElementById(`${id}-filter`).addEventListener('change',e=>{state[id]=e.target.value;renderBuilds();});
    renderBuilds();
  }
  function renderBuilds() {
    const builds=state.project.builds.filter(b=>(!state.model||b.model===state.model)&&(!state.skill||b.skill===state.skill));
    document.getElementById('build-count').textContent=`${builds.length}${builds.length!==state.project.builds.length?` of ${state.project.builds.length}`:''}`;
    document.getElementById('build-grid').innerHTML=builds.length?builds.map(b=>`<article class="build-tile ${state.selected?.id===b.id?'is-selected':''} ${state.pinned?.id===b.id?'is-pinned':''}"><button class="build-open" data-build="${b.id}" aria-label="Open ${esc(b.model)}, ${esc(b.skill)}, variant ${b.variant}"><div class="build-image"><img src="${b.thumb}" alt="${state.project.name} build, ${esc(b.skill)}, variant ${b.variant}" loading="eager" width="720" height="480">${state.selected?.id===b.id?'<span class="selection-label">Selected</span>':''}</div><div class="build-model">${esc(b.model)}</div><div class="build-detail"><span>${esc(b.skill)}</span><span>Variant ${b.variant}</span></div></button><div class="build-bottom"><span class="build-path" title="${esc(b.entry)}">${esc(b.entry.replace('/projects/'+state.project.id+'/',''))}</span><button class="pin-button" data-pin="${b.id}" aria-label="${state.pinned?.id===b.id?'Unpin':'Pin'} ${esc(b.skill)}, variant ${b.variant} for comparison" aria-pressed="${state.pinned?.id===b.id}">${state.pinned?.id===b.id?'Pinned':'Compare'}</button></div></article>`).join(''):`<div class="empty-state"><h3>No builds match these filters</h3><button class="button secondary" id="reset-filters">Clear filters</button></div>`;
    document.querySelectorAll('[data-build]').forEach(button=>button.addEventListener('click',()=>openBuild(button.dataset.build,button)));
    document.querySelectorAll('[data-pin]').forEach(button=>button.addEventListener('click',()=>{
      const build=state.project.builds.find(b=>b.id===button.dataset.pin);
      if(state.pinned?.id===build.id){state.pinned=null;renderBuilds();return;}
      state.pinned=build;
      if(!state.selected||state.selected.id===build.id) state.selected=state.project.builds.find(b=>b.id!==build.id);
      openPreview(button);
      renderBuilds();
    }));
    document.getElementById('reset-filters')?.addEventListener('click',()=>{state.model='';state.skill='';renderProject();});
    const status=document.getElementById('pin-status');
    if(status)status.textContent=state.pinned?'One build pinned':'No build pinned';
  }
  function openBuild(id,source) {
    state.selected=state.project.builds.find(b=>b.id===id);
    if(state.selected.id===state.pinned?.id) state.selected=state.project.builds.find(b=>b.id!==state.pinned.id);
    openPreview(source);renderBuilds();
  }
  function frameMarkup(build,pinned=false) {
    return `<section data-frame-build="${build.id}" class="preview-pane ${pinned?'pinned-pane':''}" aria-label="${pinned?'Pinned':'Selected'} build"><div class="pane-heading"><div><span class="pane-type">${pinned?'Pinned reference':'Selected build'}</span><strong>${esc(build.model)}</strong><span>${esc(build.skill)} <span class="metadata-separator">/</span> Variant ${build.variant}</span></div>${pinned?'<button class="button secondary" id="unpin-build">Remove pinned</button>':`<a class="frame-link" href="${build.entry}" target="_blank" rel="noopener" aria-label="Open selected build in a new tab">Open file <span aria-hidden="true">↗</span></a>`}</div><iframe title="${pinned?'Pinned':'Selected'} ${esc(state.project.name)}: ${esc(build.model)}, ${esc(build.skill)}, variant ${build.variant}" src="${build.entry}" sandbox="allow-scripts allow-same-origin allow-forms" loading="eager"></iframe></section>`;
  }
  function updatePreview() {
    const focusId=document.activeElement?.id;
    const existingPanes=[...dialog.querySelectorAll('[data-frame-build]')];
    const template=document.createElement('template');
    const builds=state.project.builds;
    dialog.classList.toggle('full-window',state.full);
    dialog.classList.toggle('comparing',Boolean(state.pinned));
    template.innerHTML=`<div class="preview-toolbar"><div class="preview-breadcrumb">${esc(state.project.name)}<span>/</span><strong id="preview-title">${state.pinned?'Compare builds':'Build preview'}</strong></div><div class="preview-actions"><button class="button secondary" id="full-window" aria-label="${state.full?'Return to overlay':'Full window'}" aria-pressed="${state.full}">${icon('expand')}<span>${state.full?'Return to overlay':'Full window'}</span></button><button class="icon-button" id="close-preview" aria-label="Close preview">${icon('close')}</button></div></div><div class="build-switcher"><label for="selected-build">Selected build</label><select id="selected-build">${builds.map(b=>`<option value="${b.id}" ${state.selected.id===b.id?'selected':''} ${state.pinned?.id===b.id?'disabled':''}>${esc(b.model)} / ${esc(b.skill)} / Variant ${b.variant}</option>`).join('')}</select><div class="switch-actions"><button class="button secondary" id="previous-build" aria-label="Select previous build">‹</button><button class="button secondary" id="next-build" aria-label="Select next build">›</button></div>${!state.pinned?`<label class="pin-select"><span class="sr-only">Choose a build to pin for comparison</span><select id="pin-build"><option value="">Pin a build to compare</option>${builds.filter(b=>b.id!==state.selected.id).map(b=>`<option value="${b.id}">${esc(b.model)} / ${esc(b.skill)} / Variant ${b.variant}</option>`).join('')}</select></label>`:'<span class="compare-note">Pinned reference stays as you switch.</span>'}</div><div class="preview-panes">${frameMarkup(state.selected)}${state.pinned?frameMarkup(state.pinned,true):''}</div><div class="preview-footer"><span>${esc(state.selected.entry)}</span><span>Esc to close</span></div>`;
    if(!dialog.querySelector('.preview-panes')) dialog.append(template.content);
    else {
      for(const selector of ['.preview-toolbar','.build-switcher','.preview-footer']) dialog.querySelector(selector).replaceWith(template.content.querySelector(selector));
      const host=dialog.querySelector('.preview-panes');
      const desired=[...template.content.querySelectorAll('[data-frame-build]')];
      const keep=new Set();
      for(const fresh of desired){
        const old=existingPanes.find(p=>p.dataset.frameBuild===fresh.dataset.frameBuild&&p.className===fresh.className);
        if(old) keep.add(old);
        else {host.append(fresh);keep.add(fresh);}
      }
      for(const old of existingPanes) if(!keep.has(old))old.remove();
      const selected=host.querySelector('.preview-pane:not(.pinned-pane)');
      if(selected&&selected!==host.firstElementChild){
        if(host.moveBefore)host.moveBefore(selected,host.firstElementChild);
        else host.insertBefore(selected,host.firstElementChild);
      }
    }
    document.getElementById('close-preview').addEventListener('click',closePreview);
    document.getElementById('full-window').addEventListener('click',()=>{state.full=!state.full;dialog.classList.toggle('full-window',state.full);const b=document.getElementById('full-window');b.setAttribute('aria-pressed',state.full);b.setAttribute('aria-label',state.full?'Return to overlay':'Full window');b.querySelector('span').textContent=state.full?'Return to overlay':'Full window';});
    document.getElementById('selected-build').addEventListener('change',e=>switchBuild(e.target.value));
    document.getElementById('previous-build').addEventListener('click',()=>stepBuild(-1));
    document.getElementById('next-build').addEventListener('click',()=>stepBuild(1));
    document.getElementById('pin-build')?.addEventListener('change',e=>{if(e.target.value){state.pinned=builds.find(b=>b.id===e.target.value);updatePreview();document.getElementById('unpin-build').focus();}});
    const unpinButton=document.getElementById('unpin-build');
    if(unpinButton)unpinButton.onclick=()=>{state.pinned=null;updatePreview();document.getElementById('pin-build').focus();};
    dialog.querySelectorAll('iframe').forEach(frame=>frame.addEventListener('load',()=>{try{frame.contentDocument.addEventListener('keydown',onKey,true);}catch{ /* A build may isolate its own document. */ }}));
    if(focusId&&document.getElementById(focusId))document.getElementById(focusId).focus();
  }
  function stepBuild(delta) {
    const builds=state.project.builds.filter(b=>b.id!==state.pinned?.id);
    const index=builds.findIndex(b=>b.id===state.selected.id);
    switchBuild(builds[(index+delta+builds.length)%builds.length].id);
  }
  function switchBuild(id) {
    if(id===state.pinned?.id){document.getElementById('selected-build').value=state.selected.id;return;}
    state.selected=state.project.builds.find(b=>b.id===id);updatePreview();
  }
  function openPreview(source) {
    returnFocus=source;
    state.full=false;updatePreview();
    if(!dialog.open)dialog.showModal();
    document.body.classList.add('preview-open');
    document.getElementById('close-preview').focus();
  }
  function closePreview() {
    dialog.close();dialog.innerHTML='';state.full=false;document.body.classList.remove('preview-open');
    renderBuilds();
    const selector=returnFocus?.dataset.pin?`[data-pin="${returnFocus.dataset.pin}"]`:`[data-build="${state.selected.id}"]`;
    document.querySelector(selector)?.focus();
  }
  function onKey(e) {
    if(e.key==='Escape'&&dialog.open){e.preventDefault();closePreview();}
    if(e.key==='/'&&!dialog.open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){
      const field=document.getElementById('project-search');if(field){e.preventDefault();field.focus();}
    }
  }
  function route() {
    const id=location.hash.slice(1);
    const next=projects.find(p=>p.id===id)||null;
    if(dialog.open)closePreview();
    if(next?.id!==state.project?.id){state.selected=null;state.pinned=null;state.expanded=false;state.model='';state.skill='';}
    state.project=next;
    document.title=next?`${next.name} | Frontend Lab`:'Library | Frontend Lab';
    state.project?renderProject():renderLibrary();
    window.scrollTo(0,0);
  }
  dialog.addEventListener('cancel',e=>{e.preventDefault();closePreview();});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePreview();}});
  document.querySelector('.skip-link').addEventListener('click',e=>{e.preventDefault();document.getElementById('main').focus();});
  document.addEventListener('keydown',onKey,true);
  window.addEventListener('hashchange',route);
  route();
})();
