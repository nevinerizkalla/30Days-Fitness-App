// ── PROGRAM DATA (loaded from program-data.js) ─────────────
// All plan-specific config (workouts, videos, tennis days, warm-ups, cool-downs,
// phase definitions, program start date) lives in program-data.js as PROGRAM_DATA.
// Edit that file to swap in a new plan — the calendar reads from it on load.
let warmupExercises = [];
let cooldownSets = {};       // keyed by phase number (1-4)
let watchGuide = {};
let exercises = {};
let tennisWarmup = [];
let tennisStretches = [];
let workouts = [];
let cooldownMins = {};
let warmupMins = 2;
let restDayWeekdays = [];
let tennisWeekdays = [];
let totalProgramDays = 30;
let phases = {};
let focusAreas = {};
let PROGRAM_START = null;

const monthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const dayFullNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function getTotalMins(w){
  const cd = cooldownMins[w.phase]||2;
  return warmupMins + w.workoutMins + cd;
}

function isDefaultRestDay(d){ return restDayWeekdays.includes(d.getDay()); }
function isTennisDay(d){ return tennisWeekdays.includes(d.getDay()); }

function dateKey(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function addDays(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function getMonday(d){
  // Week starts Sunday
  const dt=new Date(d);
  dt.setDate(dt.getDate()-dt.getDay()); return dt;
}
function formatDate(d){ return `${d.getDate()} ${monthNames[d.getMonth()]}`; }

function phaseTagColor(p){ return (phases[p]&&phases[p].tagColor)||''; }
function phaseLabelText(p){ return phases[p] ? `Phase ${p} · ${phases[p].name}` : ''; }
function phaseBarColor(p){ return (phases[p]&&phases[p].barColor)||''; }

function loadProgramData(){
  if(typeof PROGRAM_DATA === 'undefined'){
    throw new Error('PROGRAM_DATA not found — make sure program-data.js loaded before this script');
  }
  const data = PROGRAM_DATA;

  warmupExercises = data.warmupExercises;
  cooldownSets    = data.cooldownSets;
  watchGuide      = data.watchGuide;
  exercises       = data.exercises;
  tennisWarmup    = data.tennisWarmup;
  tennisStretches = data.tennisStretches;
  workouts        = data.workouts;
  phases          = data.phases;
  focusAreas      = data.focusAreas || {};

  warmupMins        = data.program.warmupMins;
  cooldownMins      = {};
  Object.entries(data.program.cooldownMinsByPhase).forEach(([k,v])=>{ cooldownMins[Number(k)] = v; });
  restDayWeekdays   = data.program.restDayWeekdays;
  tennisWeekdays    = data.program.tennisWeekdays || [];
  totalProgramDays  = data.program.totalDays;

  const [y,m,d] = data.program.startDate.split('-').map(Number);
  PROGRAM_START = new Date(y, m-1, d);

  // Reset schedule if it doesn't match the current plan length
  if(!state.schedule || state.schedule.length !== totalProgramDays) state.schedule = null;
}
