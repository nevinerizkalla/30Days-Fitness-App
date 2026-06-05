// ── EXPORT PROGRESS ──────────────────────────────────────────
function buildExportPayload(){
  const today = dateKey(new Date());
  const doneCount = workouts.filter((_,wi)=>!!state.dayDone[wi]).length;
  const postponedCount = workouts.filter((_,wi)=>!!state.postponed[wi]).length;
  const pct = Math.round((doneCount/totalProgramDays)*100);
  const streak = computeStreak();
  const time = computeTimeInvested();
  const tennisPlayed = Object.values(state.tennisLog).filter(v=>v==='yes').length;
  const tennisSkipped = Object.values(state.tennisLog).filter(v=>v==='no').length;

  const days = workouts.map((w,wi)=>{
    const dk = state.schedule[wi] || '';
    const isDone = !!state.dayDone[wi];
    const isPost = !!state.postponed[wi];
    const exDone = state.exDone[wi] || {};
    const exList = w.exercises.map(item=>({
      key:  item.ex,
      name: (exercises[item.ex] && exercises[item.ex].name) || item.ex,
      reps: item.reps,
      done: !!exDone[item.ex],
    }));
    const exDoneCount = exList.filter(e=>e.done).length;
    let status;
    if(isDone) status = 'Done';
    else if(isPost) status = 'Postponed';
    else if(dk && dk > today) status = 'Upcoming';
    else status = 'Pending';
    return {
      day: w.day,
      scheduledDate: dk,
      phase: w.phase,
      phaseName: (phases[w.phase] && phases[w.phase].name) || '',
      focus: (w.focus||[]).join(' / '),
      workoutMins: w.workoutMins,
      warmupMins: warmupMins,
      cooldownMins: cooldownMins[w.phase] || 0,
      totalMins: getTotalMins(w),
      status,
      done: isDone,
      postponed: isPost ? (state.postponed[wi] === 'end' ? 'end' : Number(state.postponed[wi]) || 1) : false,
      warmupDone: !!state.warmupDone[wi],
      cooldownDone: !!state.cooldownDone[wi],
      exercisesDone: exDoneCount,
      exercisesTotal: exList.length,
      exercises: exList,
    };
  });

  const tennisLog = Object.entries(state.tennisLog).map(([date,result])=>({date, result}));

  return {
    exportedAt: new Date().toISOString(),
    program: {
      startDate: PROGRAM_START ? dateKey(PROGRAM_START) : null,
      totalDays: totalProgramDays,
    },
    summary: {
      daysDone: doneCount,
      daysRemaining: totalProgramDays - doneCount,
      percentComplete: pct,
      daysPostponed: postponedCount,
      currentStreak: streak.current,
      bestStreak: streak.best,
      totalMinutesInvested: time.total,
      tennisPlayed,
      tennisSkipped,
    },
    days,
    tennisLog,
    bonusActivated: state.bonusActivated || {},
  };
}

function downloadFile(content, filename, mime){
  const blob = new Blob([content], {type: mime});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

function exportProgressJSON(){
  const payload = buildExportPayload();
  const json = JSON.stringify(payload, null, 2);
  const stamp = dateKey(new Date());
  downloadFile(json, `fitness-progress-${stamp}.json`, 'application/json');
  showToast('✅ JSON exported');
}

function csvEscape(v){
  if(v === null || v === undefined) return '';
  const s = String(v);
  if(/[",\n\r]/.test(s)) return '"' + s.replace(/"/g,'""') + '"';
  return s;
}
function csvRow(cells){ return cells.map(csvEscape).join(',') + '\r\n'; }

function exportProgressCSV(){
  const p = buildExportPayload();
  let csv = '';
  csv += csvRow(['30-Day Fitness — Progress Export']);
  csv += csvRow(['Exported at', p.exportedAt]);
  csv += csvRow(['Program start', p.program.startDate]);
  csv += csvRow(['Total days', p.program.totalDays]);
  csv += '\r\n';

  csv += csvRow(['Summary']);
  csv += csvRow(['Metric','Value']);
  csv += csvRow(['Days done', p.summary.daysDone]);
  csv += csvRow(['Days remaining', p.summary.daysRemaining]);
  csv += csvRow(['Percent complete', p.summary.percentComplete + '%']);
  csv += csvRow(['Days postponed', p.summary.daysPostponed]);
  csv += csvRow(['Current streak', p.summary.currentStreak]);
  csv += csvRow(['Best streak', p.summary.bestStreak]);
  csv += csvRow(['Total minutes invested', p.summary.totalMinutesInvested]);
  csv += csvRow(['Tennis played', p.summary.tennisPlayed]);
  csv += csvRow(['Tennis skipped', p.summary.tennisSkipped]);
  csv += '\r\n';

  csv += csvRow(['Workout days']);
  csv += csvRow(['Day','Scheduled date','Phase','Phase name','Focus',
                 'Workout min','Warm-up min','Cool-down min','Total min',
                 'Status','Done','Postponed','Warm-up done','Cool-down done',
                 'Exercises done','Exercises total']);
  p.days.forEach(d=>{
    csv += csvRow([d.day, d.scheduledDate, d.phase, d.phaseName, d.focus,
                   d.workoutMins, d.warmupMins, d.cooldownMins, d.totalMins,
                   d.status, d.done?'Yes':'No', d.postponed?String(d.postponed):'No',
                   d.warmupDone?'Yes':'No', d.cooldownDone?'Yes':'No',
                   d.exercisesDone, d.exercisesTotal]);
  });
  csv += '\r\n';

  csv += csvRow(['Per-exercise checks']);
  csv += csvRow(['Day','Scheduled date','Exercise','Reps','Done']);
  p.days.forEach(d=>{
    d.exercises.forEach(ex=>{
      csv += csvRow([d.day, d.scheduledDate, ex.name, ex.reps, ex.done?'Yes':'No']);
    });
  });
  csv += '\r\n';

  if(p.tennisLog.length){
    csv += csvRow(['Tennis log']);
    csv += csvRow(['Date','Result']);
    p.tennisLog.forEach(t=>{
      csv += csvRow([t.date, t.result==='yes'?'Played':t.result==='no'?'Skipped':t.result]);
    });
  }

  const stamp = dateKey(new Date());
  // BOM helps Excel detect UTF-8 properly
  downloadFile('﻿' + csv, `fitness-progress-${stamp}.csv`, 'text/csv;charset=utf-8');
  showToast('✅ CSV exported');
}
