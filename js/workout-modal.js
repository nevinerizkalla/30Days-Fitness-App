// ── WORKOUT MODAL ────────────────────────────────────────────
let currentModalWi=null;

function openModal(wi){
  currentModalWi=wi;
  renderModal(wi);
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function renderModal(wi){
  const w=workouts[wi];
  const phase=w.phase;
  const isDone=!!state.dayDone[wi];
  const exDone=state.exDone[wi]||{};
  const warmupDone=state.warmupDone[wi]||{};
  const cdDone=state.cooldownDone[wi]||{};
  const cdSet=cooldownSets[phase];
  const cd=cooldownMins[phase]||2;
  const total=getTotalMins(w);
  const wg=watchGuide[phase];

  const warmupRows=warmupExercises.map(wu=>renderExBlock({
    id:      `wr_${wi}_${wu.key}`,
    done:    !!warmupDone[wu.key],
    checked: !!warmupDone[wu.key],
    name:    wu.name,
    target:  wu.detail,
    link:    wu.link,
    onChange:`toggleWarmup(${wi},'${wu.key}',this.checked)`,
  })).join('');

  const exCards=w.exercises.map(item=>{
    const ex=exercises[item.ex]; const done=!!exDone[item.ex];
    return renderExBlock({
      id:      `ec_${wi}_${item.ex}`,
      done,
      checked: done,
      name:    ex.name,
      target:  ex.target,
      tip:     ex.tip,
      link:    ex.link,
      reps:    item.reps,
      onChange:`toggleEx(${wi},'${item.ex}',this.checked)`,
    });
  }).join('');

  const cdCards=cdSet.map(cd=>{
    const done=!!cdDone[cd.key];
    return renderExBlock({
      id:      `cd_${wi}_${cd.key}`,
      done,
      checked: done,
      name:    cd.name,
      target:  cd.detail,
      link:    cd.link,
      onChange:`toggleCooldown(${wi},'${cd.key}',this.checked)`,
    });
  }).join('');

  document.getElementById('modalContent').innerHTML=`
    <div class="modal-header">
      <button class="modal-close" onclick="closeModalBtn()">✕</button>
      <div class="modal-phase-tag" style="color:${phaseTagColor(phase)}">${phaseLabelText(phase)}</div>
      <div class="modal-title">Day ${w.day}</div>
      <div class="modal-meta">${w.focus.map(f=>`<span>🎯 ${f}</span>`).join('')}</div>
      <div class="modal-time-breakdown">
        <span class="mtb-seg mtb-warmup">🌅 Warm-up ${warmupMins}m</span>
        <span class="mtb-arrow">→</span>
        <span class="mtb-seg mtb-workout">💪 Workout ${w.workoutMins}m</span>
        <span class="mtb-arrow">→</span>
        <span class="mtb-seg mtb-cooldown">🧘 Cool-down ${cd}m</span>
        <span class="mtb-total" style="font-size:14px;font-weight:800;background:var(--charcoal);color:white;padding:4px 12px;border-radius:8px;">⏱ ${total} min total</span>
      </div>
      <label class="modal-day-complete ${isDone?'active':''}">
        <input type="checkbox" ${isDone?'checked':''} onchange="toggleDayDoneModal(${wi},this.checked)">
        <span class="modal-day-complete-label">${isDone?'✓ Day complete! Well done 💪':'Mark entire day as complete'}</span>
      </label>
    </div>
    <div class="modal-body">
      <div class="focus-tags">${w.focus.map(f=>`<span class="focus-tag">${f}</span>`).join('')}</div>

      <div class="section-title">🍎 Apple Watch — How to Log This</div>
      <div class="watch-block">
        <div class="watch-icon">⌚</div>
        <div class="watch-info">
          <div class="watch-type">${wg.type}</div>
          <div class="watch-steps">${wg.steps.replace('Apple Watch','<strong>Apple Watch</strong>').replace(/(".*?")/g,'<strong>$1</strong>')}</div>
          <div class="watch-tip">💡 ${wg.tip}</div>
        </div>
      </div>

      <div class="section-title">🌅 Warm-Up (${warmupMins} min)</div>
      ${warmupRows}

      <div class="section-title">💪 Workout (${w.workoutMins} min)</div>
      ${exCards}

      <div class="section-title">🧘 Cool-Down (${cd} min)</div>
      ${cdCards}
    </div>
  `;
}

function toggleWarmup(wi,key,checked){
  if(!state.warmupDone[wi]) state.warmupDone[wi]={};
  state.warmupDone[wi][key]=checked; saveState(state);
  document.getElementById(`wr_${wi}_${key}`)?.classList.toggle('ex-done',checked);
  checkAutoComplete(wi);
}
function toggleEx(wi,exKey,checked){
  if(!state.exDone[wi]) state.exDone[wi]={};
  state.exDone[wi][exKey]=checked; saveState(state);
  document.getElementById(`ec_${wi}_${exKey}`)?.classList.toggle('ex-done',checked);
  checkAutoComplete(wi);
  buildCalendar(); renderModal(wi);
}
function toggleCooldown(wi,key,checked){
  if(!state.cooldownDone[wi]) state.cooldownDone[wi]={};
  state.cooldownDone[wi][key]=checked; saveState(state);
  document.getElementById(`cd_${wi}_${key}`)?.classList.toggle('ex-done',checked);
  checkAutoComplete(wi);
}
function checkAutoComplete(wi){
  const w=workouts[wi];
  const allEx=w.exercises.every(e=>(state.exDone[wi]||{})[e.ex]);
  const allWu=warmupExercises.every(wu=>(state.warmupDone[wi]||{})[wu.key]);
  const cdSet=cooldownSets[w.phase];
  const allCd=cdSet.every(cd=>(state.cooldownDone[wi]||{})[cd.key]);
  if(allEx&&allWu&&allCd&&!state.dayDone[wi]){
    state.dayDone[wi]=true; saveState(state);
    buildCalendar(); renderModal(wi);
    showToast(`🎉 Day ${w.day} auto-completed!`);
  }
}
function toggleDayDoneModal(wi,checked){
  state.dayDone[wi]=checked;
  if(checked){
    if(!state.exDone[wi]) state.exDone[wi]={};
    workouts[wi].exercises.forEach(e=>{ state.exDone[wi][e.ex]=true; });
    if(!state.warmupDone[wi]) state.warmupDone[wi]={};
    warmupExercises.forEach(wu=>{ state.warmupDone[wi][wu.key]=true; });
    const cdSet=cooldownSets[workouts[wi].phase];
    if(!state.cooldownDone[wi]) state.cooldownDone[wi]={};
    cdSet.forEach(cd=>{ state.cooldownDone[wi][cd.key]=true; });
    showToast(`🎉 Day ${workouts[wi].day} complete!`);
  } else {
    state.exDone[wi]={}; state.warmupDone[wi]={}; state.cooldownDone[wi]={};
  }
  saveState(state); buildCalendar(); renderModal(wi);
}
function toggleDayDone(wi,e){
  e.stopPropagation();
  const checked=!state.dayDone[wi];
  toggleDayDoneModal(wi,checked);
}
function closeModalBtn(){
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow=''; currentModalWi=null;
}
function handleOverlayClick(e){ if(e.target===document.getElementById('modalOverlay')) closeModalBtn(); }
