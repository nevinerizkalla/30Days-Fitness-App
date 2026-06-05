// ── SCHEDULE ────────────────────────────────────────────────

// Returns the postponement for a workout index:
//   number > 0  → push forward that many non-tennis days (cascading)
//   'end'       → move to after the rest of the program
//   0/false     → not postponed
// Legacy values of `true` are treated as a 1-day push.
function getPostponeAmount(wi){
  const v = state.postponed[wi];
  if(v === 'end') return 'end';
  if(v === true) return 1;
  const n = Number(v);
  return (n > 0) ? n : 0;
}

function rebuildSchedule(){
  const avail=[];
  for(let d=0;d<250;d++){
    const dt=addDays(PROGRAM_START,d);
    if(!isDefaultRestDay(dt)) avail.push(dateKey(dt));
  }
  const newSched = new Array(totalProgramDays).fill(null);
  const postponedFrom = {}; // dk -> wi of the workout originally scheduled there
  const endQueue = [];
  let si = 0;

  for(let wi=0; wi<totalProgramDays; wi++){
    const amt = getPostponeAmount(wi);
    if(amt === 'end'){
      // Mark the workout's would-be date, then defer placement to after the program.
      if(avail[si]) postponedFrom[avail[si]] = wi;
      endQueue.push(wi);
      si++;
      continue;
    }
    if(amt > 0){
      // Skip `amt` non-tennis dates, marking each as the original slot.
      for(let k=0; k<amt && avail[si]; k++){
        postponedFrom[avail[si]] = wi;
        si++;
      }
    }
    newSched[wi] = avail[si] || null;
    si++;
  }

  for(const wi of endQueue){
    newSched[wi] = avail[si] || null;
    si++;
  }

  state.schedule = newSched;
  state.postponedFrom = postponedFrom;
  saveState(state);
}
