// ── PROGRESS ────────────────────────────────────────────────
function updateProgress(){
  const done=Object.keys(state.dayDone).filter(k=>!k.startsWith('bonus')&&!k.startsWith('tennis')&&state.dayDone[k]).length;
  const pct=Math.round((done/totalProgramDays)*100);
  document.getElementById('progFill').style.width=pct+'%';
  document.getElementById('progPct').textContent=pct+'%';
  document.getElementById('progStats').textContent=`${done} / ${totalProgramDays} days done`;
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2600);
}

// ── SHARED EXERCISE BLOCK BUILDER ────────────────────────────
// Renders a single ex-block (warm-up, exercise, cool-down, tennis warmup/stretch).
// Used by both the workout modal and the tennis modal so the markup stays consistent.
function renderExBlock({id, done, checked, name, target, tip, link, reps, onChange}){
  const tipHtml  = tip  ? `<div class="ex-tip">💡 ${tip}</div>` : '';
  const linkHtml = link ? `<a class="ex-link" href="${link}" target="_blank" rel="noopener">▶ Watch tutorial</a>` : '';
  const repsHtml = reps ? `<div class="ex-reps">${reps}</div>` : '';
  return `
    <div class="ex-block ${done?'ex-done':''}" id="${id}">
      <div class="ex-row">
        <input type="checkbox" class="ex-check" ${checked?'checked':''} onchange="${onChange}">
        <div class="ex-info">
          <div class="ex-name">${name}</div>
          <div class="ex-target">${target}</div>
        </div>
        ${repsHtml}
      </div>
      ${tipHtml}
      ${linkHtml}
    </div>`;
}
