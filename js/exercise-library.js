// ── EXERCISE LIBRARY ─────────────────────────────────────────
// Renders an in-page "Exercise Library" view that can be toggled with
// the calendar. Three browse modes: Focus, Type, Phase.
// YouTube videos are lazy-loaded (thumbnail → click → embed) so 50+
// iframes don't fight for bandwidth on first render.

let libraryMode = 'focus';
let libraryRendered = false;

// ── VIEW SWITCH (Calendar vs Library) ────────────────────────
function setView(view){
  const cal=document.getElementById('viewCalendar');
  const lib=document.getElementById('viewLibrary');
  const tabCal=document.getElementById('viewTabCalendar');
  const tabLib=document.getElementById('viewTabLibrary');
  if(view==='library'){
    cal.hidden=true; lib.hidden=false;
    tabCal.classList.remove('active'); tabLib.classList.add('active');
    if(!libraryRendered){ renderLibrary(); libraryRendered=true; }
  } else {
    cal.hidden=false; lib.hidden=true;
    tabLib.classList.remove('active'); tabCal.classList.add('active');
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

function setLibraryMode(mode){
  libraryMode=mode;
  document.querySelectorAll('.lib-tab').forEach(t=>{
    t.classList.toggle('active', t.dataset.mode===mode);
  });
  renderLibrary();
}

// ── YOUTUBE HELPERS ──────────────────────────────────────────
function getYouTubeId(url){
  if(!url) return null;
  const m=url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m?m[1]:null;
}

function ytThumbUrl(id){
  // hqdefault is the most reliably-available size for arbitrary videos
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// Called inline from card markup — swaps the thumbnail for an iframe.
function playLibraryVideo(mediaEl, vidId){
  if(!vidId) return;
  mediaEl.innerHTML=
    `<iframe src="https://www.youtube.com/embed/${vidId}?autoplay=1&rel=0" `+
    `title="Exercise tutorial" allow="accelerometer; autoplay; clipboard-write; `+
    `encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  mediaEl.style.cursor='default';
  mediaEl.onclick=null;
}

// ── CARD RENDERER ────────────────────────────────────────────
function renderLibraryCard({name, target, tip, link, reps, detail, chips}){
  const vidId=getYouTubeId(link);
  const mediaInner = vidId
    ? `<img src="${ytThumbUrl(vidId)}" alt="${escapeHtml(name)} preview" loading="lazy">`+
      `<div class="lib-media-play"></div>`
    : `<div class="lib-media-novideo">No video</div>`;
  const mediaAttrs = vidId
    ? `onclick="playLibraryVideo(this,'${vidId}')" role="button" tabindex="0" aria-label="Play ${escapeHtml(name)} tutorial"`
    : ``;
  const tipHtml = tip
    ? `<div class="lib-card-tip"><strong>Tip:</strong> ${escapeHtml(tip)}</div>`
    : '';
  const targetText = target ? escapeHtml(target) : '';
  const detailText = detail || reps;
  const chipParts = [];
  if(detailText) chipParts.push(`<span class="lib-card-chip chip-detail">${escapeHtml(detailText)}</span>`);
  if(chips) chips.forEach(c=>chipParts.push(`<span class="lib-card-chip chip-phase">${escapeHtml(c)}</span>`));
  const chipsHtml = chipParts.length
    ? `<div class="lib-card-meta">${chipParts.join('')}</div>`
    : '';
  return `
    <div class="lib-card">
      <div class="lib-media" ${mediaAttrs}>${mediaInner}</div>
      <div class="lib-card-body">
        <div class="lib-card-name">${escapeHtml(name)}</div>
        ${targetText ? `<div class="lib-card-target">${targetText}</div>` : ''}
        ${tipHtml}
        ${chipsHtml}
      </div>
    </div>`;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c=>(
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
  ));
}

// ── DERIVED DATA: which phases each main exercise appears in ─
function buildExercisePhaseMap(){
  const map={}; // key → Set of phase numbers
  workouts.forEach(w=>{
    w.exercises.forEach(item=>{
      if(!map[item.ex]) map[item.ex]=new Set();
      map[item.ex].add(w.phase);
    });
  });
  return map;
}

// ── RENDER: BY FOCUS ─────────────────────────────────────────
function renderLibraryFocus(){
  const phaseMap=buildExercisePhaseMap();
  const sections=[];
  Object.entries(focusAreas).forEach(([title, fa])=>{
    const cards=fa.exerciseKeys.map(k=>{
      const ex=exercises[k]; if(!ex) return '';
      const phases=[...(phaseMap[k]||[])].sort().map(p=>`Phase ${p}`);
      return renderLibraryCard({
        name: ex.name, target: ex.target, tip: ex.tip, link: ex.link,
        chips: phases
      });
    }).join('');
    sections.push(`
      <div class="lib-section">
        <div class="lib-section-head">
          <span class="lib-section-dot" style="background:${fa.color}"></span>
          <span class="lib-section-title">${escapeHtml(title)}</span>
          <span class="lib-section-count">${fa.exerciseKeys.length} moves</span>
        </div>
        <div class="lib-grid">${cards}</div>
      </div>`);
  });

  // Warm-Up section
  sections.push(renderSimpleSection({
    title:'Daily Warm-Up', dotColor:'var(--sage)',
    desc:'Done before every workout (≈2 min).',
    items: warmupExercises.map(w=>({name:w.name, target:w.detail, link:w.link}))
  }));

  // Cool-Down by phase
  Object.keys(cooldownSets).sort().forEach(p=>{
    const set=cooldownSets[p];
    sections.push(renderSimpleSection({
      title:`Cool-Down · Phase ${p}`, dotColor: phaseBarColor(p)||'var(--sage)',
      desc:`Closes out Phase ${p} sessions (${cooldownMins[p]||2} min).`,
      items: set.map(c=>({name:c.name, target:c.detail, link:c.link}))
    }));
  });

  // Tennis
  sections.push(renderSimpleSection({
    title:'Tennis · Pre-Match Warm-Up', dotColor:'var(--tennis-border)',
    desc:'Run through these on tennis days before stepping on court.',
    items: tennisWarmup.map(t=>({name:t.name, target:t.detail, link:t.link, tip:t.tip}))
  }));
  sections.push(renderSimpleSection({
    title:'Tennis · Post-Match Stretches', dotColor:'var(--tennis-border)',
    desc:'Cool down after clay-court play to prevent tightness.',
    items: tennisStretches.map(t=>({name:t.name, target:t.detail, link:t.link, tip:t.tip}))
  }));

  return sections.join('');
}

function renderSimpleSection({title, dotColor, desc, items}){
  const cards=items.map(it=>renderLibraryCard({
    name: it.name, target: it.target, tip: it.tip, link: it.link, detail: it.detail
  })).join('');
  return `
    <div class="lib-section">
      <div class="lib-section-head">
        <span class="lib-section-dot" style="background:${dotColor}"></span>
        <span class="lib-section-title">${escapeHtml(title)}</span>
        <span class="lib-section-count">${items.length} moves</span>
      </div>
      ${desc ? `<div class="lib-section-desc">${escapeHtml(desc)}</div>` : ''}
      <div class="lib-grid">${cards}</div>
    </div>`;
}

// ── RENDER: BY TYPE ──────────────────────────────────────────
function renderLibraryType(){
  const phaseMap=buildExercisePhaseMap();
  const out=[];

  // Warm-Up
  out.push(renderSimpleSection({
    title:'🌅 Daily Warm-Up', dotColor:'var(--sage)',
    desc:'Three quick moves that prime joints and core before the workout.',
    items: warmupExercises.map(w=>({name:w.name, target:w.detail, link:w.link}))
  }));

  // Main exercises — list every key in `exercises`
  const mainCards=Object.entries(exercises).map(([k, ex])=>{
    const phases=[...(phaseMap[k]||[])].sort().map(p=>`Phase ${p}`);
    return renderLibraryCard({
      name: ex.name, target: ex.target, tip: ex.tip, link: ex.link, chips: phases
    });
  }).join('');
  out.push(`
    <div class="lib-section">
      <div class="lib-section-head">
        <span class="lib-section-dot" style="background:var(--terracotta)"></span>
        <span class="lib-section-title">💪 Main Workout Exercises</span>
        <span class="lib-section-count">${Object.keys(exercises).length} moves</span>
      </div>
      <div class="lib-section-desc">The full strength &amp; core library that rotates across Phases 1–4. Chips show which phases each move appears in.</div>
      <div class="lib-grid">${mainCards}</div>
    </div>`);

  // Cool-Down — show all four phase variants
  Object.keys(cooldownSets).sort().forEach(p=>{
    out.push(renderSimpleSection({
      title:`🧘 Cool-Down · Phase ${p}`, dotColor: phaseBarColor(p)||'var(--sage)',
      desc:`${cooldownMins[p]||2}-minute closer for Phase ${p} sessions.`,
      items: cooldownSets[p].map(c=>({name:c.name, target:c.detail, link:c.link}))
    }));
  });

  // Tennis
  out.push(renderSimpleSection({
    title:'🎾 Tennis Pre-Match Warm-Up', dotColor:'var(--tennis-border)',
    desc:'Done on tennis days before hitting the court.',
    items: tennisWarmup.map(t=>({name:t.name, target:t.detail, link:t.link, tip:t.tip}))
  }));
  out.push(renderSimpleSection({
    title:'🎾 Tennis Post-Match Stretches', dotColor:'var(--tennis-border)',
    desc:'Cool down after play — clay courts are tough on quads & calves.',
    items: tennisStretches.map(t=>({name:t.name, target:t.detail, link:t.link, tip:t.tip}))
  }));

  return out.join('');
}

// ── RENDER: BY PHASE ─────────────────────────────────────────
function renderLibraryPhase(){
  const out=[];
  // Determine exercises per phase, preserving order of first appearance
  const phaseExKeys={1:[],2:[],3:[],4:[]};
  const seen={1:new Set(),2:new Set(),3:new Set(),4:new Set()};
  workouts.forEach(w=>{
    w.exercises.forEach(item=>{
      if(!seen[w.phase].has(item.ex)){
        seen[w.phase].add(item.ex);
        phaseExKeys[w.phase].push(item.ex);
      }
    });
  });

  Object.keys(phases).sort().forEach(p=>{
    const ph=phases[p];
    const mainCards=phaseExKeys[p].map(k=>{
      const ex=exercises[k]; if(!ex) return '';
      return renderLibraryCard({name:ex.name, target:ex.target, tip:ex.tip, link:ex.link});
    }).join('');
    const cdCards=(cooldownSets[p]||[]).map(c=>renderLibraryCard({
      name:c.name, target:c.detail, link:c.link
    })).join('');

    out.push(`
      <div class="lib-section">
        <div class="lib-section-head">
          <span class="lib-section-dot" style="background:${ph.dotColor}"></span>
          <span class="lib-section-title">Phase ${p} · ${escapeHtml(ph.name)}</span>
          <span class="lib-section-count">${ph.timeRange}</span>
        </div>
        <div class="lib-section-desc">${phaseExKeys[p].length} main exercises rotate across the ${ph.totalDays} days of this phase.</div>

        <div class="lib-subhead">💪 Main Exercises</div>
        <div class="lib-grid">${mainCards}</div>

        <div class="lib-subhead">🧘 Cool-Down (${cooldownMins[p]||2} min)</div>
        <div class="lib-grid">${cdCards}</div>
      </div>`);
  });

  return out.join('');
}

// ── MAIN RENDER ──────────────────────────────────────────────
function renderLibrary(){
  const root=document.getElementById('libraryRoot');
  if(!root) return;
  let html='';
  if(libraryMode==='focus')      html = renderLibraryFocus();
  else if(libraryMode==='type')  html = renderLibraryType();
  else if(libraryMode==='phase') html = renderLibraryPhase();
  root.innerHTML = html;
}
