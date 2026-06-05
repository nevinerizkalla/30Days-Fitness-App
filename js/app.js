// ── APP INIT ─────────────────────────────────────────────────
migrateDateKeysOnce();

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeModalBtn();
    closeTennisModal();
    closePostponeModal();
    closeClearProgress();
    closeSummary();
  }
});

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        // Once SW is active, schedule if enabled
        if (localStorage.getItem('notifEnabled') && Notification.permission === 'granted') {
          navigator.serviceWorker.ready.then(() => scheduleAndroidNotif());
        }
      })
      .catch(()=>{});
  });
}

try {
  loadProgramData();
  startInAppReminderCheck();
  initNotifPanel();
  buildCalendar();
} catch (err) {
  console.error(err);
  document.getElementById('calendarRoot').innerHTML =
    `<div style="padding:32px;text-align:center;color:var(--terracotta);font-size:14px;">
       <strong>Could not load program-data.js</strong><br>
       <span style="font-size:12px;color:var(--mid-grey);">${err.message}</span>
     </div>`;
}
