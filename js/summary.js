// ── SUMMARY ──────────────────────────────────────────────────
function openSummary(){
  renderSummary();
  document.getElementById('summaryOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeSummary(){
  document.getElementById('summaryOverlay').classList.remove('open');
  document.body.style.overflow='';
}
function handleSummaryOverlay(e){
  if(e.target===document.getElementById('summaryOverlay')) closeSummary();
}

function computeStreak(){
  // Current streak: consecutive done days counting back from today
  const today = dateKey(new Date());
  let best = 0, cur = 0;
  for(let wi=0; wi<totalProgramDays; wi++){
    const dk = state.schedule[wi];
    if(!dk) continue;
    const done = !!state.dayDone[wi];
    if(done){ cur++; best = Math.max(best,cur); }
    else { cur = dk <= today ? 0 : cur; }
  }
  // Current streak = consecutive from the last done day backwards
  let currentStreak = 0;
  for(let wi=totalProgramDays-1; wi>=0; wi--){
    if(state.dayDone[wi]) currentStreak++;
    else { if(state.schedule[wi] && state.schedule[wi] <= today) break; }
  }
  return { current: currentStreak, best };
}

function computeFocusStats(){
  // Count how many done days featured each focus area (defined in program-data.json)
  const areas = {};
  Object.entries(focusAreas).forEach(([name, def])=>{
    areas[name] = {done:0, total:0, color:def.color};
  });
  workouts.forEach((w,wi)=>{
    const exKeys = w.exercises.map(e=>e.ex);
    const done = !!state.dayDone[wi];
    Object.entries(focusAreas).forEach(([name, def])=>{
      if(exKeys.some(k=>def.exerciseKeys.includes(k))){
        areas[name].total++;
        if(done) areas[name].done++;
      }
    });
  });
  return areas;
}

function computeTimeInvested(){
  let totalMins = 0, warmupMinsTotal = 0, cooldownMinsTotal = 0;
  workouts.forEach((w,wi)=>{
    if(!state.dayDone[wi]) return;
    const cd = cooldownMins[w.phase]||2;
    warmupMinsTotal += warmupMins;
    cooldownMinsTotal += cd;
    totalMins += getTotalMins(w);
  });
  return { total: totalMins, warmup: warmupMinsTotal, cooldown: cooldownMinsTotal,
           workout: totalMins - warmupMinsTotal - cooldownMinsTotal };
}

function getMotive(doneDays, streak){
  const T = totalProgramDays;
  if(doneDays===0) return {icon:'🌱', title:"Every journey starts with Day 1", sub:"Your first workout is the most important one. You've got this."};
  if(doneDays<Math.ceil(T*0.17)) return {icon:'✨', title:"You've started — that's everything", sub:`${doneDays} days in. Momentum is building.`};
  if(doneDays<Math.ceil(T*0.33)) return {icon:'🔥', title:"The habit is forming", sub:`${doneDays} days done. Your body is already adapting.`};
  if(doneDays<Math.ceil(T*0.53)) return {icon:'💪', title:"Halfway there!", sub:`${doneDays} days complete. Your core is noticeably stronger.`};
  if(doneDays<Math.ceil(T*0.73)) return {icon:'⚡', title:"You're in the strength phase now", sub:`${doneDays} days done. This is where real change happens.`};
  if(doneDays<Math.ceil(T*0.93)) return {icon:'🏆', title:"Peak phase — you're almost there", sub:`${doneDays} days complete. The finish line is visible.`};
  if(doneDays<T)   return {icon:'🌟', title:"Final push!", sub:`${doneDays} days done. Just ${T-doneDays} more to go.`};
  return {icon:'🎉', title:`${T} days complete — incredible!`, sub:"You built a habit, fixed your posture, and transformed your mornings."};
}

function renderSummary(){
  const body = document.getElementById('summaryBody');
  const done = workouts.filter((_,wi)=>!!state.dayDone[wi]).length;
  const postponed = workouts.filter((_,wi)=>!!state.postponed[wi]).length;
  const pct = Math.round((done/totalProgramDays)*100);
  const streak = computeStreak();
  const focus = computeFocusStats();
  const time = computeTimeInvested();
  const motive = getMotive(done, streak.current);
  const today = dateKey(new Date());

  // Phase breakdown — derived from program-data.json
  const phaseData = Object.entries(phases).map(([num, p])=>{
    const phaseNum = Number(num);
    return {
      name: `Phase ${num}`,
      color: p.barColor,
      total: workouts.filter(w=>w.phase===phaseNum).length,
      done:  workouts.filter((w,wi)=>w.phase===phaseNum && state.dayDone[wi]).length,
    };
  });

  // Tennis log
  const tennisPlayed = Object.values(state.tennisLog).filter(v=>v==='yes').length;
  const tennisSkipped = Object.values(state.tennisLog).filter(v=>v==='no').length;

  // 30-dot timeline
  const dots = workouts.map((w,wi)=>{
    const isDone = !!state.dayDone[wi];
    const isPostponed = !!state.postponed[wi];
    const dk = state.schedule[wi]||'';
    const isFuture = dk > today;
    let cls='tl-dot ';
    if(isDone) cls+='tl-done';
    else if(isPostponed) cls+='tl-postponed';
    else if(isFuture) cls+='tl-upcoming';
    else cls+=`tl-phase-${w.phase}`;
    const tooltip=`Day ${w.day}: ${isDone?'✓ Done':isPostponed?'↷ Postponed':isFuture?'Upcoming':'Pending'}`;
    return `<div class="${cls}" title="${tooltip}" style="opacity:${isDone?1:isPostponed?.6:.35}">
      ${isDone?'✓':w.day}
    </div>`;
  }).join('');

  // Phase bars
  const phaseBars = phaseData.map(p=>`
    <div class="phase-bar-row">
      <div class="phase-bar-name" style="color:${p.color}">${p.name}</div>
      <div class="phase-bar-track">
        <div class="phase-bar-fill" style="width:${Math.round((p.done/p.total)*100)}%;background:${p.color};"></div>
      </div>
      <div class="phase-bar-count" style="color:${p.color}">${p.done}/${p.total}</div>
    </div>`).join('');

  // Focus cells
  const focusCells = Object.entries(focus).map(([name,data])=>`
    <div class="focus-cell">
      <div class="focus-cell-name">${name}</div>
      <div class="focus-cell-bar">
        <div class="focus-cell-fill" style="width:${data.total?Math.round((data.done/data.total)*100):0}%;background:${data.color};"></div>
      </div>
      <div class="focus-cell-stats">${data.done} of ${data.total} sessions done</div>
    </div>`).join('');

  // ── DURATION BAR CHART ────────────────────────────────
  const maxMins = Math.max(...workouts.map(w=>getTotalMins(w)));
  const durationBars = workouts.map((w,wi)=>{
    const total = getTotalMins(w);
    const isDone = !!state.dayDone[wi];
    const heightPct = Math.round((total/maxMins)*100);
    const col = isDone ? 'var(--done-border)' : phaseBarColor(w.phase);
    const cls = isDone ? 'done-bar' : 'undone-bar';
    return `<div class="chart-bar-col">
      <div class="chart-bar ${cls}" style="height:${heightPct}%;background:${col};"
           data-tip="Day ${w.day}: ${total} min${isDone?' ✓':''}"></div>
    </div>`;
  }).join('');

  // ── CALENDAR HEATMAP ──────────────────────────────────
  // Build a Mon→Sun grid from program start to last day
  const dateToWI = {};
  state.schedule.forEach((dk,wi)=>{ if(dk) dateToWI[dk]=wi; });
  const allSchedDates = state.schedule.filter(Boolean).map(dk=>{
    const [y,m,d]=dk.split('-').map(Number); return new Date(y,m-1,d);
  });
  const hmLastDate = allSchedDates.length ? new Date(Math.max(...allSchedDates.map(d=>d.getTime()))) : new Date(PROGRAM_START);
  const hmFirst = getMonday(PROGRAM_START);
  // End grid at the Saturday of the last workout's week — no trailing empty week.
  const hmLast = new Date(hmLastDate);
  while(hmLast.getDay()!==6) hmLast.setDate(hmLast.getDate()+1);
  const hmToday = dateKey(new Date());
  let hmCells = [];
  let cur = new Date(hmFirst);
  while(cur <= hmLast) {
    const dk = dateKey(cur);
    const wi = dateToWI.hasOwnProperty(dk) ? dateToWI[dk] : null;
    const isRest = isDefaultRestDay(cur);
    const inRange = cur >= PROGRAM_START && cur <= hmLast;
    if(!inRange) { hmCells.push(`<div class="hm-cell hm-empty"></div>`); cur=addDays(cur,1); continue; }
    if(isRest && wi===null){
      const tl = state.tennisLog[dk];
      const cls = tl==='yes'?'hm-tennis':tl==='no'?'hm-rest':'hm-rest';
      const tip = `${formatDate(cur)}: ${tl==='yes'?'🎾 Tennis played':tl==='no'?'Tennis skipped':'Rest day'}`;
      hmCells.push(`<div class="hm-cell ${cls}" data-tip="${tip}">${tl==='yes'?'🎾':'–'}</div>`);
    } else if(wi!==null){
      const isDone = !!state.dayDone[wi];
      const isPost = !!state.postponed[wi];
      const isFut = dk > hmToday;
      const cls = isDone?'hm-done':isPost?'hm-postponed':isFut?'hm-rest':'hm-pending';
      const tip = `Day ${workouts[wi].day} (${formatDate(cur)}): ${isDone?'✓ Done':isPost?'↷ Moved':isFut?'Upcoming':'Pending'}`;
      const lbl = isDone?'✓':isPost?'↷':workouts[wi].day;
      hmCells.push(`<div class="hm-cell ${cls}" data-tip="${tip}">${lbl}</div>`);
    } else if(state.postponedFrom && state.postponedFrom[dk]!==undefined){
      const fromWi = state.postponedFrom[dk];
      const tip = `${formatDate(cur)}: Day ${workouts[fromWi].day} postponed from here`;
      hmCells.push(`<div class="hm-cell hm-postponed" data-tip="${tip}" style="opacity:.55">↷</div>`);
    } else {
      hmCells.push(`<div class="hm-cell hm-empty"></div>`);
    }
    cur = addDays(cur,1);
  }
  const heatmapCells = hmCells.join('');

  // ── EXERCISE COMPLETION BREAKDOWN ────────────────────
  // Count how many times each exercise appears across all 30 days, and how many are ticked
  const exTally = {}; // {exKey: {name, total, done}}
  workouts.forEach((w,wi)=>{
    const exDone = state.exDone[wi]||{};
    w.exercises.forEach(item=>{
      if(!exTally[item.ex]) exTally[item.ex]={name:exercises[item.ex].name,total:0,done:0};
      exTally[item.ex].total++;
      if(exDone[item.ex]) exTally[item.ex].done++;
    });
  });
  // Sort by most appeared (most important), then by done count desc
  const sortedEx = Object.entries(exTally)
    .sort((a,b)=> b[1].total-a[1].total || b[1].done-a[1].done)
    .slice(0,12); // top 12
  const exCompRows = sortedEx.map(([key,d])=>{
    const pct = d.total ? Math.round((d.done/d.total)*100) : 0;
    const col = pct===100?'var(--done-border)':pct>50?'var(--sage)':pct>0?'var(--terracotta)':'var(--light-grey)';
    return `<div class="ex-comp-row">
      <div class="ex-comp-name" title="${d.name}">${d.name}</div>
      <div class="ex-comp-track"><div class="ex-comp-fill" style="width:${pct}%;background:${col};"></div></div>
      <div class="ex-comp-count">${d.done}/${d.total}</div>
    </div>`;
  }).join('');

  body.innerHTML = `
    <!-- MOTIVATIONAL BADGE -->
    <div class="motive-badge">
      <div class="motive-icon">${motive.icon}</div>
      <div class="motive-text">
        <div class="motive-title">${motive.title}</div>
        <div class="motive-sub">${motive.sub}</div>
      </div>
    </div>

    <!-- TOP STATS -->
    <div class="sum-section" style="margin-top:20px;">At a glance</div>
    <div class="stat-row">
      <div class="stat-card">
        <div class="stat-num" style="color:var(--done-text)">${done}</div>
        <div class="stat-label">Days Done</div>
        <div class="stat-sub">of ${totalProgramDays}</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" style="color:var(--terracotta)">${pct}%</div>
        <div class="stat-label">Complete</div>
        <div class="stat-sub">${totalProgramDays-done} remaining</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" style="color:#9A7C28">${streak.current}</div>
        <div class="stat-label">Streak</div>
        <div class="stat-sub">best: ${streak.best}</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" style="color:#804060">${postponed}</div>
        <div class="stat-label">Postponed</div>
        <div class="stat-sub">days moved</div>
      </div>
    </div>

    <!-- STREAK -->
    ${streak.current>0?`
    <div class="streak-block">
      <div class="streak-fire">${streak.current>=7?'🔥':'⚡'}</div>
      <div class="streak-info">
        <div class="streak-num">${streak.current} day${streak.current!==1?'s':''}</div>
        <div class="streak-label">Current streak — keep it going!</div>
        <div class="streak-best">Personal best: ${streak.best} day${streak.best!==1?'s':''}</div>
      </div>
    </div>`:''}

    <!-- TIMELINE DOTS -->
    <div class="sum-section">${totalProgramDays}-day journey</div>
    <div class="timeline-grid">${dots}</div>
    <div class="tl-label-row">
      <span>Day 1</span><span>Day ${Math.round(totalProgramDays/3)}</span><span>Day ${Math.round(totalProgramDays*2/3)}</span><span>Day ${totalProgramDays}</span>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
      <span style="font-size:10px;display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--done-border);display:inline-block;"></span>Done</span>
      <span style="font-size:10px;display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--postponed-border);display:inline-block;"></span>Postponed</span>
      <span style="font-size:10px;display:flex;align-items:center;gap:5px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--light-grey);display:inline-block;"></span>Upcoming</span>
    </div>

    <!-- SESSION DURATION BAR CHART -->
    <div class="sum-section">Session durations</div>
    <div class="chart-wrap">
      <div class="chart-bars">${durationBars}</div>
      <div class="chart-axis">
        <span>Day 1</span><span>Day 8</span><span>Day 16</span><span>Day 24</span><span>Day 30</span>
      </div>
      <div class="chart-legend">
        <span class="chart-legend-item"><span class="chart-legend-dot" style="background:var(--done-border)"></span>Completed</span>
        <span class="chart-legend-item"><span class="chart-legend-dot" style="background:var(--light-grey);opacity:.5"></span>Upcoming</span>
        <span class="chart-legend-item" style="color:var(--mid-grey);font-size:10px;">Bar height = total session length</span>
      </div>
    </div>

    <!-- CALENDAR HEATMAP -->
    <div class="sum-section" style="margin-top:20px;">Weekly heatmap</div>
    <div class="heatmap-wrap">
      <div class="heatmap-grid">
        ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="hm-header">${d}</div>`).join('')}
        ${heatmapCells}
      </div>
      <div class="hmap-legend">
        <span class="hmap-li"><span class="hmap-sq" style="background:var(--done-border)"></span>Done</span>
        <span class="hmap-li"><span class="hmap-sq" style="background:var(--tennis-border)"></span>Tennis</span>
        <span class="hmap-li"><span class="hmap-sq" style="background:var(--postponed-border)"></span>Postponed</span>
        <span class="hmap-li"><span class="hmap-sq" style="background:var(--light-grey)"></span>Pending</span>
      </div>
    </div>

    <!-- PHASE PROGRESS -->
    <div class="sum-section" style="margin-top:20px;">Phase progress</div>
    <div class="phase-bars">${phaseBars}</div>

    <!-- FOCUS AREAS -->
    <div class="sum-section" style="margin-top:20px;">Focus areas</div>
    <div class="focus-grid">${focusCells}</div>

    <!-- TIME INVESTED -->
    <div class="sum-section" style="margin-top:20px;">Time invested</div>
    <div class="time-invested-block">
      <div>
        <div class="ti-num">${time.total}</div>
        <div class="ti-label">Total min</div>
      </div>
      <div>
        <div class="ti-num">${Math.floor(time.total/60)}<span style="font-size:14px;">h</span>${time.total%60}<span style="font-size:14px;">m</span></div>
        <div class="ti-label">Hours & min</div>
      </div>
      <div>
        <div class="ti-num">${done>0?Math.round(time.total/done):0}</div>
        <div class="ti-label">Avg min/day</div>
      </div>
    </div>

    <!-- EXERCISE COMPLETION BREAKDOWN -->
    <div class="sum-section" style="margin-top:20px;">Exercise completion</div>
    <div class="ex-comp-list">${exCompRows}</div>

    <!-- TENNIS -->
    ${tennisPlayed+tennisSkipped>0?`
    <div class="sum-section" style="margin-top:20px;">Tennis days</div>
    <div class="tennis-sum-row">
      <div class="tennis-sum-cell">
        <div class="tennis-sum-num" style="color:var(--tennis-border)">${tennisPlayed}</div>
        <div class="tennis-sum-label">🎾 Played</div>
      </div>
      <div class="tennis-sum-cell">
        <div class="tennis-sum-num" style="color:var(--terracotta)">${tennisSkipped}</div>
        <div class="tennis-sum-label">🏠 Skipped</div>
      </div>
      <div class="tennis-sum-cell">
        <div class="tennis-sum-num" style="color:var(--charcoal)">${tennisPlayed+tennisSkipped}</div>
        <div class="tennis-sum-label">Total logged</div>
      </div>
    </div>`:''}

    <!-- EXPORT PROGRESS -->
    <div class="sum-section" style="margin-top:24px;">Export progress</div>
    <div class="export-row">
      <button class="export-btn" onclick="exportProgressJSON()">
        <span class="export-icon">📄</span>JSON
      </button>
      <button class="export-btn" onclick="exportProgressCSV()">
        <span class="export-icon">📊</span>Excel (CSV)
      </button>
    </div>
    <div style="font-size:11px;color:var(--mid-grey);margin-top:6px;text-align:center;line-height:1.5;">
      Download your progress — workouts, exercise checks, postponements, and tennis log.
    </div>

    <!-- DANGER ZONE -->
    <div class="sum-section" style="margin-top:24px;color:#c0392b;">Danger zone</div>
    <button class="clear-progress-btn" onclick="openClearProgress()">
      🗑️ Clear All Progress
    </button>
    <div style="font-size:11px;color:var(--mid-grey);margin-top:6px;text-align:center;line-height:1.5;">
      Erases every completed day, exercise check, postponement, and tennis log.
    </div>
  `;
}
