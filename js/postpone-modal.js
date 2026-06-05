// ── BONUS WORKOUT ────────────────────────────────────────────
function activateBonus(dk,e){
  e.stopPropagation();
  const done=Object.keys(state.dayDone).filter(k=>!k.startsWith('bonus')&&!k.startsWith('tennis')&&state.dayDone[k]).map(Number);
  const lastDone=done.length?Math.max(...done):-1;
  const suggest=Math.min(lastDone+1,29);
  const w=workouts[suggest];
  const total=getTotalMins(w);
  const content=document.getElementById('postponeContent');
  content.innerHTML=`
    <div class="postpone-title">🎾 Tennis cancelled?</div>
    <div class="postpone-sub">Add an optional workout for ${dk}.</div>
    <div class="postpone-btns">
      <button class="postpone-opt" onclick="confirmBonus('${dk}',${suggest})">
        <strong>Day ${w.day} — ${w.focus[0]}</strong>
        <span>${total} min total · Suggested next workout</span>
      </button>
      ${suggest>0?`<button class="postpone-opt" onclick="confirmBonus('${dk}',${suggest-1})">
        <strong>Day ${workouts[suggest-1].day} — ${workouts[suggest-1].focus[0]}</strong>
        <span>${getTotalMins(workouts[suggest-1])} min total</span>
      </button>`:''}
    </div>
    <button class="postpone-cancel" onclick="closePostponeModal()">Cancel</button>`;
  document.getElementById('postponeOverlay').classList.add('open');
}
function confirmBonus(dk,wi){
  state.bonusActivated[dk]=wi; saveState(state);
  closePostponeModal(); buildCalendar(); showToast('Bonus workout added! 💪');
}
function removeBonus(dk,e){
  e.stopPropagation();
  delete state.bonusActivated[dk]; delete state.dayDone['bonus_'+dk];
  saveState(state); buildCalendar(); showToast('Bonus workout removed');
}
function toggleBonusDone(dk,e){
  e.stopPropagation();
  const key='bonus_'+dk; state.dayDone[key]=!state.dayDone[key];
  saveState(state); buildCalendar();
  if(state.dayDone[key]) showToast('🎉 Bonus workout complete!');
}

// ── POSTPONE ────────────────────────────────────────────────
function openPostpone(wi,dk,e){
  e.stopPropagation();
  const w=workouts[wi];
  const curDk=state.schedule[wi];
  let curDate;
  if(curDk){ const [y,m,d]=curDk.split('-').map(Number); curDate=new Date(y,m-1,d); }
  else curDate=new Date(PROGRAM_START);
  let nextDate=addDays(curDate,1);
  while(isDefaultRestDay(nextDate)) nextDate=addDays(nextDate,1);
  const nextStr=`${nextDate.getDate()} ${monthNames[nextDate.getMonth()]}`;
  const amt=getPostponeAmount(wi);
  const isPostponed=amt!==0;
  const isLast=wi===totalProgramDays-1;
  const pushSub=isLast
    ? `Day ${w.day} moves to ${nextStr}`
    : `Day ${w.day} moves to ${nextStr} — all later workouts shift one day forward`;
  document.getElementById('postponeContent').innerHTML=`
    <div class="postpone-title">Postpone Day ${w.day}</div>
    <div class="postpone-sub">Schedule shifts forward, keeping Sundays & Tuesdays as tennis days.</div>
    <div class="postpone-btns">
      <button class="postpone-opt" onclick="confirmPostpone(${wi},'push')">
        <strong>Push to next day</strong>
        <span>${pushSub}</span>
      </button>
      ${!isLast?`<button class="postpone-opt" onclick="confirmPostpone(${wi},'end')">
        <strong>Skip to end of program</strong>
        <span>Day ${w.day} moves to after Day ${totalProgramDays}</span>
      </button>`:''}
      ${isPostponed?`<button class="postpone-opt" onclick="confirmPostpone(${wi},'undo')" style="border-color:rgba(196,113,74,.35);background:rgba(196,113,74,.04);">
        <strong>Undo postponement</strong>
        <span>Restore Day ${w.day} to its original date</span>
      </button>`:''}
    </div>
    <button class="postpone-cancel" onclick="closePostponeModal()">Cancel</button>`;
  document.getElementById('postponeOverlay').classList.add('open');
}
function confirmPostpone(wi,mode){
  if(mode==='undo'){
    delete state.postponed[wi];
  } else if(mode==='end'){
    state.postponed[wi]='end';
  } else {
    // 'push' (default): cascade forward one more day. Re-postponing increments.
    const cur=getPostponeAmount(wi);
    state.postponed[wi]=(typeof cur==='number'&&cur>0)?cur+1:1;
  }
  saveState(state);
  closePostponeModal(); buildCalendar();
  showToast(mode==='undo'
    ? `Day ${workouts[wi].day} restored`
    : `Day ${workouts[wi].day} postponed ↷`);
}
function closePostponeModal(){
  document.getElementById('postponeOverlay').classList.remove('open');
}
function handlePostponeOverlay(e){ if(e.target===document.getElementById('postponeOverlay')) closePostponeModal(); }

// ── CLEAR PROGRESS ──────────────────────────────────────────
function openClearProgress(){
  document.getElementById('clearProgressOverlay').classList.add('open');
}
function closeClearProgress(){
  document.getElementById('clearProgressOverlay').classList.remove('open');
}
function handleClearProgressOverlay(e){
  if(e.target===document.getElementById('clearProgressOverlay')) closeClearProgress();
}
function confirmClearProgress(){
  state.dayDone={};
  state.exDone={};
  state.warmupDone={};
  state.cooldownDone={};
  state.postponed={};
  state.bonusActivated={};
  state.tennisLog={};
  state.postponedFrom={};
  state.schedule=null;
  saveState(state);
  closeClearProgress();
  closeSummary();
  buildCalendar();
  showToast('All progress cleared ✓');
}
