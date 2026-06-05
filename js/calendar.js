// ── CALENDAR BUILD ───────────────────────────────────────────
function buildCalendar(){
  rebuildSchedule();
  const root=document.getElementById('calendarRoot');
  root.innerHTML='';
  const dateToWorkout={};
  state.schedule.forEach((dk,wi)=>{ if(dk) dateToWorkout[dk]=wi; });
  const allDates=state.schedule.filter(Boolean).map(dk=>{
    const [y,m,d]=dk.split('-').map(Number); return new Date(y,m-1,d);
  });
  // Also factor postponed-from dates in case they fall before the last workout (they always do, but keep robust)
  const fromDates=Object.keys(state.postponedFrom||{}).map(dk=>{
    const [y,m,d]=dk.split('-').map(Number); return new Date(y,m-1,d);
  });
  const lastDate=new Date(Math.max(...allDates.concat(fromDates).map(d=>d.getTime())));
  // Calendar grid runs from the Sunday of PROGRAM_START's week through the Saturday
  // of the week containing the last scheduled workout (no trailing empty week).
  const firstSun=getMonday(PROGRAM_START);
  const lastSat=new Date(lastDate);
  while(lastSat.getDay()!==6) lastSat.setDate(lastSat.getDate()+1);

  const weeks=[];
  let ws=new Date(firstSun);
  while(ws<=lastSat){
    const week=[];
    for(let i=0;i<7;i++){
      const d=addDays(ws,i); const dk=dateKey(d);
      const wi=dateToWorkout.hasOwnProperty(dk)?dateToWorkout[dk]:null;
      const isRest=isDefaultRestDay(d);
      const inRange=d>=PROGRAM_START&&d<=lastSat;
      week.push({date:d,dk,wi,isRest,inRange});
    }
    weeks.push(week); ws=addDays(ws,7);
  }

  const hdr=document.createElement('div'); hdr.className='week-grid';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach((dn,idx)=>{
    const h=document.createElement('div');
    h.className='day-header'+(restDayWeekdays.includes(idx)?' rest-day':'');
    h.textContent=dn; hdr.appendChild(h);
  }); root.appendChild(hdr);

  if(!state.weekToggle) state.weekToggle = {};
  const todayDk = dateKey(new Date());
  let todayCard = null;

  weeks.forEach((week,wi)=>{
    const containsToday = week.some(d=>d.dk===todayDk && d.inRange);
    const lastDk = week[week.length-1].dk;
    const isPast = lastDk < todayDk && !containsToday;
    const override = state.weekToggle[wi]; // 'open' | 'closed' | undefined
    const collapsed = override ? override==='closed' : isPast;

    const section=document.createElement('section');
    section.className='week-section'+(collapsed?' collapsed':'')+(containsToday?' is-current':'');
    section.dataset.weekIndex=wi;

    const lbl=document.createElement('div'); lbl.className='week-label';
    const firstDate=week[0].date, lastDate=week[6].date;
    const rangeStr=`${formatDate(firstDate)} – ${formatDate(lastDate)}`;
    lbl.innerHTML=`<span class="week-chevron">▼</span>Week ${wi+1}<span class="week-meta">${rangeStr}${containsToday?' · this week':''}</span>`;
    lbl.addEventListener('click',()=>toggleWeek(wi));
    section.appendChild(lbl);

    const grid=document.createElement('div'); grid.className='week-grid';
    week.forEach(day=>{
      const card=document.createElement('div');
      if(!day.inRange){
        card.className='day-card rest empty-card';
        card.innerHTML=`<div class="day-num">${dayNames[day.date.getDay()]}</div>`;
      } else if(day.isRest && day.wi===null){
        const bonusWi=state.bonusActivated[day.dk];
        if(bonusWi!==undefined) renderBonusCard(card,day,bonusWi);
        else if(isTennisDay(day.date)) renderTennisCard(card,day);
        else renderRestCard(card,day);
      } else if(day.wi!==null){
        renderWorkoutCard(card,day);
      } else if(state.postponedFrom && state.postponedFrom[day.dk]!==undefined){
        renderPostponedMarkerCard(card,day,state.postponedFrom[day.dk]);
      } else {
        card.className='day-card rest empty-card';
        card.innerHTML=`<div class="day-num">${formatDate(day.date)}</div>`;
      }
      if(day.dk===todayDk && day.inRange && !card.classList.contains('empty-card')){
        card.classList.add('is-today');
        todayCard=card;
      }
      grid.appendChild(card);
    });
    section.appendChild(grid);
    root.appendChild(section);
  });
  updateProgress();

  if(todayCard && !window._scrolledToToday){
    window._scrolledToToday=true;
    requestAnimationFrame(()=>{
      todayCard.scrollIntoView({block:'center',behavior:'smooth'});
    });
  }
}

function toggleWeek(wi){
  const section=document.querySelector(`.week-section[data-week-index="${wi}"]`);
  if(!section) return;
  const willCollapse=!section.classList.contains('collapsed');
  section.classList.toggle('collapsed',willCollapse);
  if(!state.weekToggle) state.weekToggle={};
  state.weekToggle[wi] = willCollapse ? 'closed' : 'open';
  saveState(state);
}

// ── CARD RENDERERS ───────────────────────────────────────────
function renderRestCard(card,day){
  const dk=day.dk;
  card.className='day-card rest rest-only';
  card.innerHTML=`
    <div class="day-num">${formatDate(day.date)} · ${dayNames[day.date.getDay()]}</div>
    <div class="rest-icon">🛌</div>
    <div class="rest-label">Rest Day</div>
    <div class="rest-sub">Recovery &amp; sleep</div>
    <button class="bonus-add-btn" onclick="activateBonus('${dk}',event)">+ Optional Workout</button>
  `;
}

function renderTennisCard(card,day){
  const dk=day.dk;
  const logged=state.tennisLog[dk]; // 'yes','no', or undefined
  card.className='day-card rest';

  let loggedBlock='';
  if(logged==='yes') loggedBlock=`<div class="tennis-logged tennis-played">🎾 Tennis played ✓</div>`;
  else if(logged==='no') loggedBlock=`<div class="tennis-logged tennis-skipped">🏠 Tennis skipped</div>`;

  let questionBlock='';
  if(!logged){
    questionBlock=`
      <div class="tennis-question">
        <div class="tennis-q-label">Did you play today?</div>
        <div class="tennis-btns">
          <button class="tennis-btn tennis-yes" onclick="logTennis('${dk}','yes',event)">🎾 Yes</button>
          <button class="tennis-btn tennis-no" onclick="logTennis('${dk}','no',event)">✗ No</button>
        </div>
      </div>`;
  }

  card.innerHTML=`
    <div class="day-num">${formatDate(day.date)} · ${dayNames[day.date.getDay()]}</div>
    <div class="rest-icon">🎾</div>
    <div class="rest-label">${dayFullNames[day.date.getDay()]}</div>
    <div class="rest-sub" style="font-size:10px;color:var(--rest-text);">Tap for warm-up & stretches</div>
    ${loggedBlock}
    ${questionBlock}
    <button class="bonus-add-btn" onclick="activateBonus('${dk}',event)">+ Optional Workout</button>
  `;
  // Clicking card body (not buttons) opens tennis modal
  card.addEventListener('click', e=>{
    if(e.target.closest('button')) return;
    openTennisModal(dk, day.date);
  });
}

function renderWorkoutCard(card,day){
  const wi=day.wi; const w=workouts[wi];
  const isDone=!!state.dayDone[wi];
  const isPostponed=!!state.postponed[wi];
  const exDone=state.exDone[wi]||{};
  const doneCount=w.exercises.filter(e=>exDone[e.ex]).length;
  const total=getTotalMins(w);
  const cd=cooldownMins[w.phase]||2;

  card.className=`day-card phase-${w.phase}${isDone?' done-card':''}${isPostponed?' postponed-card':''}`;

  let statusBadge='';
  if(isDone) statusBadge='<span class="card-status status-done">✓ Done</span>';
  else if(isPostponed) statusBadge='<span class="card-status status-postponed">↷ Moved</span>';

  const exList=w.exercises.slice(0,3).map(e=>{
    const done=!!exDone[e.ex];
    return `<li class="${done?'done-ex':''}">${exercises[e.ex].name}</li>`;
  }).join('');
  const more=w.exercises.length>3?`<li>+${w.exercises.length-3} more</li>`:'';
  const progressText=doneCount>0?`<span style="font-size:9px;color:var(--done-text);font-weight:600;margin-left:2px;">${doneCount}/${w.exercises.length} ✓</span>`:'';

  card.innerHTML=`
    ${statusBadge}
    <div class="day-num">${formatDate(day.date)} · ${dayNames[day.date.getDay()]}</div>
    <div class="workout-day-num">Day ${w.day} ${progressText}</div>
    <div class="card-total-time">${total} min</div>
    <div class="time-breakdown">
      <span class="tb-seg tb-warmup">🌅 ${warmupMins}m</span>
      <span class="tb-seg tb-workout">💪 ${w.workoutMins}m</span>
      <span class="tb-seg tb-cooldown">🧘 ${cd}m</span>
    </div>
    <ul class="exercise-list">${exList}${more}</ul>
    <div class="card-actions">
      <button class="card-btn btn-complete ${isDone?'active':''}" onclick="toggleDayDone(${wi},event)">${isDone?'✓ Done':'Mark done'}</button>
      ${!isDone?`<button class="card-btn btn-postpone ${isPostponed?'postponed':''}" onclick="openPostpone(${wi},'${day.dk}',event)">${isPostponed?'↷ Moved':'Postpone'}</button>`:''}
    </div>
  `;
  card.addEventListener('click', e=>{ if(e.target.closest('button')) return; openModal(wi); });
}

function renderBonusCard(card,day,wi){
  const w=workouts[wi];
  const isDone=!!state.dayDone['bonus_'+day.dk];
  const total=getTotalMins(w);
  const cd=cooldownMins[w.phase]||2;
  card.className=`day-card bonus${isDone?' done-card':''}`;
  card.innerHTML=`
    <span class="card-status status-bonus">Bonus</span>
    <div class="day-num">${formatDate(day.date)} · ${dayNames[day.date.getDay()]}</div>
    <div style="font-size:11px;font-weight:700;color:#3A5AA0;margin-bottom:3px;">🎾 Tennis cancelled</div>
    <div class="card-total-time">${total} min</div>
    <div class="time-breakdown">
      <span class="tb-seg tb-warmup">🌅 ${warmupMins}m</span>
      <span class="tb-seg tb-workout">💪 ${w.workoutMins}m</span>
      <span class="tb-seg tb-cooldown">🧘 ${cd}m</span>
    </div>
    <div style="font-size:10px;font-weight:700;color:#3A5AA0;">Day ${w.day} · ${w.focus[0]}</div>
    <div class="card-actions" style="margin-top:6px;">
      <button class="card-btn btn-complete ${isDone?'active':''}" onclick="toggleBonusDone('${day.dk}',event)">${isDone?'✓ Done':'Mark done'}</button>
      <button class="card-btn" style="background:rgba(255,100,100,.1);color:#c0392b;border:1px solid rgba(255,100,100,.25);font-size:10px;font-weight:600;padding:3px 7px;border-radius:7px;" onclick="removeBonus('${day.dk}',event)">✕</button>
    </div>
  `;
  card.addEventListener('click', e=>{ if(e.target.closest('button')) return; openModal(wi); });
}

function renderPostponedMarkerCard(card,day,wi){
  const w=workouts[wi];
  const newDk=state.schedule[wi];
  let newStr='';
  if(newDk){
    const [y,m,d]=newDk.split('-').map(Number);
    const newDate=new Date(y,m-1,d);
    newStr=`${newDate.getDate()} ${monthNames[newDate.getMonth()]}`;
  }
  card.className=`day-card postponed-marker phase-${w.phase}`;
  card.innerHTML=`
    <div class="day-num">${formatDate(day.date)} · ${dayNames[day.date.getDay()]}</div>
    <div class="postponed-marker-icon">↷</div>
    <div class="postponed-marker-label">Postponed</div>
    <div class="postponed-marker-sub">Day ${w.day} moved${newStr?` to ${newStr}`:' to end'}</div>
  `;
}
