// ── STORAGE ────────────────────────────────────────────────
const STORE_KEY = 'fitness30_v3';
function loadState(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY))||{}; }catch(e){ return {}; } }
function saveState(s){ try{ localStorage.setItem(STORE_KEY,JSON.stringify(s)); }catch(e){} }

let state = loadState();
['dayDone','exDone','warmupDone','cooldownDone','postponed','bonusActivated','tennisLog'].forEach(k=>{
  if(!state[k]) state[k]={};
});

// One-time migration: dateKey() used to return UTC dates. For users in positive
// UTC offsets (e.g. Cairo +2/+3) every stored dk was one day behind local. Shift
// the affected stored keys forward by 1 day so they line up with the corrected
// local dateKey. state.schedule and state.postponedFrom are rebuilt each load
// by rebuildSchedule(), so they don't need explicit migration.
function migrateDateKeysOnce(){
  if(state.dateKeysFixed) return;
  if(new Date().getTimezoneOffset() >= 0){ state.dateKeysFixed = true; saveState(state); return; }
  const shift = (dk)=>{
    const [y,m,d] = dk.split('-').map(Number);
    const dt = new Date(y, m-1, d);
    dt.setDate(dt.getDate() + 1);
    return dateKey(dt);
  };
  const remap = (obj)=>{
    const out = {};
    Object.entries(obj||{}).forEach(([k,v])=>{ out[shift(k)] = v; });
    return out;
  };
  const remapPrefixed = (obj, prefix)=>{
    const out = {};
    Object.entries(obj||{}).forEach(([k,v])=>{
      if(k.startsWith(prefix)) out[prefix + shift(k.slice(prefix.length))] = v;
      else out[k] = v;
    });
    return out;
  };
  state.tennisLog = remap(state.tennisLog);
  state.bonusActivated = remap(state.bonusActivated);
  state.dayDone = remapPrefixed(state.dayDone, 'bonus_');
  state.warmupDone = remapPrefixed(state.warmupDone, 'tennis_');
  state.cooldownDone = remapPrefixed(state.cooldownDone, 'tennis_');
  state.dateKeysFixed = true;
  saveState(state);
}
