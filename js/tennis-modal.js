// ── TENNIS MODAL ─────────────────────────────────────────────
let currentTennisDk=null;

function openTennisModal(dk, date){
  currentTennisDk=dk;
  const logged=state.tennisLog[dk];
  const dayUpper=dayFullNames[date.getDay()].toUpperCase();
  const content=document.getElementById('tennisContent');

  const warmupRows=tennisWarmup.map(e=>renderExBlock({
    id:      `tw_${dk}_${e.key}`,
    done:    !!(state.warmupDone['tennis_'+dk]||{})[e.key],
    checked: !!(state.warmupDone['tennis_'+dk]||{})[e.key],
    name:    e.name,
    target:  e.detail,
    tip:     e.tip,
    link:    e.link,
    onChange:`toggleTennisWarmup('${dk}','${e.key}',this.checked)`,
  })).join('');

  const stretchRows=tennisStretches.map(e=>renderExBlock({
    id:      `ts_${dk}_${e.key}`,
    done:    !!(state.cooldownDone['tennis_'+dk]||{})[e.key],
    checked: !!(state.cooldownDone['tennis_'+dk]||{})[e.key],
    name:    e.name,
    target:  e.detail,
    tip:     e.tip,
    link:    e.link,
    onChange:`toggleTennisStretch('${dk}','${e.key}',this.checked)`,
  })).join('');

  let playedBlock='';
  if(logged==='yes') playedBlock=`<div style="background:var(--tennis-bg);border:1px solid rgba(92,158,85,.3);border-radius:10px;padding:10px 14px;font-size:12px;font-weight:600;color:var(--tennis-border);margin-top:10px;">🎾 You played tennis today!</div>`;
  else if(logged==='no') playedBlock=`<div style="background:rgba(196,113,74,.08);border:1px solid rgba(196,113,74,.2);border-radius:10px;padding:10px 14px;font-size:12px;font-weight:600;color:var(--terracotta);margin-top:10px;">Tennis skipped today — enjoy the rest!</div>`;
  else playedBlock=`
    <div style="margin-top:10px;">
      <div style="font-size:11px;font-weight:700;color:var(--mid-grey);margin-bottom:8px;letter-spacing:.5px;text-transform:uppercase;">Did you play today?</div>
      <div class="tennis-played-question">
        <button class="tpq-btn ${logged==='yes'?'selected-yes':''}" onclick="logTennisModal('${dk}','yes')">
          <div class="tpq-icon">🎾</div>
          <div class="tpq-label">Yes, played!</div>
          <div class="tpq-sub">Log the session</div>
        </button>
        <button class="tpq-btn ${logged==='no'?'selected-no':''}" onclick="logTennisModal('${dk}','no')">
          <div class="tpq-icon">🏠</div>
          <div class="tpq-label">No, skipped</div>
          <div class="tpq-sub">Rest day instead</div>
        </button>
      </div>
    </div>`;

  content.innerHTML=`
    <div class="tennis-header">
      <button class="modal-close" onclick="closeTennisModal()">✕</button>
      <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--tennis-border);margin-bottom:4px;">🎾 CLAY COURT · ${dayUpper}</div>
      <div class="tennis-header-title">${formatDate(date)} Tennis Day</div>
      <div class="tennis-header-sub">5-min pre-court warm-up · Post-play stretches</div>
      ${playedBlock}
    </div>
    <div class="modal-body">
      <div class="section-title">Pre-Court Warm-Up (5 min) — Do BEFORE stepping on court</div>
      ${warmupRows}
      <div class="section-title" style="margin-top:20px;">Post-Play Stretches — Do AFTER your session</div>
      <div style="background:rgba(92,158,85,.07);border:1px solid rgba(92,158,85,.2);border-radius:8px;padding:8px 12px;font-size:11px;color:var(--sage-dark);margin-bottom:12px;">
        🌿 Clay court tip: Your muscles are warm after play — this is the best time to stretch. Hold each stretch longer than you think you need to.
      </div>
      ${stretchRows}
    </div>
  `;
  document.getElementById('tennisOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function logTennis(dk, val, e){
  e.stopPropagation();
  state.tennisLog[dk]=val;
  saveState(state);
  buildCalendar();
  showToast(val==='yes'?'🎾 Tennis logged!':'Rest day noted ✓');
}

function logTennisModal(dk, val){
  state.tennisLog[dk]=val;
  saveState(state);
  buildCalendar();
  // Re-render modal by reopening with refetched date
  const d=new Date(dk+'T00:00:00');
  openTennisModal(dk,d);
  showToast(val==='yes'?'🎾 Tennis logged!':'Rest day noted ✓');
}

function toggleTennisWarmup(dk,key,checked){
  if(!state.warmupDone['tennis_'+dk]) state.warmupDone['tennis_'+dk]={};
  state.warmupDone['tennis_'+dk][key]=checked;
  saveState(state);
  const el=document.getElementById(`tw_${dk}_${key}`);
  if(el) el.classList.toggle('ex-done',checked);
}

function toggleTennisStretch(dk,key,checked){
  if(!state.cooldownDone['tennis_'+dk]) state.cooldownDone['tennis_'+dk]={};
  state.cooldownDone['tennis_'+dk][key]=checked;
  saveState(state);
  const el=document.getElementById(`ts_${dk}_${key}`);
  if(el) el.classList.toggle('ex-done',checked);
}

function closeTennisModal(){
  document.getElementById('tennisOverlay').classList.remove('open');
  document.body.style.overflow='';
  currentTennisDk=null;
}
function handleTennisOverlay(e){
  if(e.target===document.getElementById('tennisOverlay')) closeTennisModal();
}
