// ── NOTIFICATIONS ─────────────────────────────────────────────
const NOTIF_TIME_HOUR = 20; // 8 PM
const NOTIF_TIME_MIN  = 0;

// Detect platform
const _isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const _isAndroid = /android/i.test(navigator.userAgent);
const _isMobile = _isIos || _isAndroid;

function initNotifPanel() {
  const btnA = document.getElementById('notifBtnAndroid');
  const btnI = document.getElementById('notifBtnIos');
  const status = document.getElementById('notifStatus');
  const sub = document.getElementById('notifPanelSub');

  if (_isIos) {
    // iOS: show ICS calendar button always
    btnI.style.display = 'inline-block';
    sub.textContent = 'Tap to add daily 8 PM reminders to your iPhone Calendar';
    // Check if already downloaded
    if (localStorage.getItem('icsDownloaded')) {
      status.textContent = '📅 Calendar set';
      status.className = 'notif-status notif-on';
    }
  } else {
    // Android / Desktop: show push notification button
    btnA.style.display = 'inline-block';
    if (!('Notification' in window)) {
      sub.textContent = 'Notifications not supported in this browser';
      btnA.disabled = true;
      return;
    }
    if (Notification.permission === 'granted' && localStorage.getItem('notifEnabled')) {
      status.textContent = '🔔 On';
      status.className = 'notif-status notif-on';
      btnA.textContent = 'Turn Off';
      btnA.classList.add('active');
      scheduleAndroidNotif(); // resume on page load
    } else if (Notification.permission === 'denied') {
      sub.textContent = 'Notifications blocked — enable in browser settings';
      btnA.disabled = true;
    }
  }
}

async function requestAndroidNotif() {
  const btnA = document.getElementById('notifBtnAndroid');
  const status = document.getElementById('notifStatus');

  // Toggle off
  if (localStorage.getItem('notifEnabled')) {
    localStorage.removeItem('notifEnabled');
    status.textContent = 'Off';
    status.className = 'notif-status notif-off';
    btnA.textContent = 'Enable Notifications';
    btnA.classList.remove('active');
    // Tell SW to cancel
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CANCEL_NOTIF' });
    }
    showToast('Reminders turned off');
    return;
  }

  const perm = await Notification.requestPermission();
  if (perm !== 'granted') {
    showToast('Permission denied — check browser settings');
    return;
  }
  localStorage.setItem('notifEnabled', '1');
  status.textContent = '🔔 On';
  status.className = 'notif-status notif-on';
  btnA.textContent = 'Turn Off';
  btnA.classList.add('active');
  scheduleAndroidNotif();
  showToast('🔔 Reminders enabled for 8:00 PM!');
}

function scheduleAndroidNotif() {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    // SW not ready yet — retry in 1s
    setTimeout(scheduleAndroidNotif, 1000);
    return;
  }
  const payload = buildTomorrowPayload();
  navigator.serviceWorker.controller.postMessage({
    type: 'SCHEDULE_NOTIF',
    payload
  });
}

function buildTomorrowPayload() {
  // Find tomorrow's date
  const tomorrow = addDays(new Date(), 1);
  const tmrKey = dateKey(tomorrow);
  const tmrIsRest = isDefaultRestDay(tomorrow);

  // Find workout index scheduled for tomorrow
  rebuildSchedule();
  const wi = state.schedule.findIndex(dk => dk === tmrKey);

  let title, body;

  if (tmrIsRest && wi === -1) {
    // Tennis day tomorrow
    const dayName = dayFullNames[tomorrow.getDay()];
    title = `🎾 Tennis tomorrow — ${formatDate(tomorrow)}`;
    body = `${dayName} tennis day! Don't forget your 5-min clay court warm-up before stepping on court.`;
  } else if (wi !== -1) {
    const w = workouts[wi];
    const total = getTotalMins(w);
    const exNames = w.exercises.slice(0, 4).map(e => exercises[e.ex].name).join(', ');
    const more = w.exercises.length > 4 ? ` +${w.exercises.length - 4} more` : '';
    title = `💪 Tomorrow: Day ${w.day} · ${total} min`;
    body = `${w.focus.join(' · ')}\n${exNames}${more}`;
  } else {
    title = '🏋️ FitPlan — Rest day tomorrow';
    body = 'Tomorrow is a rest day. Recovery is part of the program!';
  }

  // Calculate next 8 PM fire time
  const now = new Date();
  const fireAt = new Date();
  fireAt.setHours(NOTIF_TIME_HOUR, NOTIF_TIME_MIN, 0, 0);
  if (fireAt <= now) fireAt.setDate(fireAt.getDate() + 1); // already past 8 PM today

  return { title, body, fireAt: fireAt.getTime() };
}

// In-app reminder banner (fires at 8 PM if app is open — works on all platforms)
function startInAppReminderCheck() {
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === NOTIF_TIME_HOUR && now.getMinutes() === NOTIF_TIME_MIN) {
      const p = buildTomorrowPayload();
      showToast(p.title);
      // Also show a persistent banner for 30 seconds
      showInAppReminder(p.title, p.body);
    }
  }, 30000); // check every 30s
}

function showInAppReminder(title, body) {
  // Remove existing if any
  document.getElementById('inAppReminder')?.remove();
  const el = document.createElement('div');
  el.id = 'inAppReminder';
  el.className = 'in-app-reminder';
  el.innerHTML = `
    <div class="in-app-reminder-row">
      <div class="in-app-reminder-body">
        <div class="in-app-reminder-title">${title}</div>
        <div class="in-app-reminder-msg">${body}</div>
      </div>
      <button class="in-app-reminder-close" onclick="this.closest('#inAppReminder').remove()">×</button>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => el?.remove(), 30000);
}

// ── ICS CALENDAR FILE GENERATOR (iOS) ────────────────────────
function downloadIcs() {
  rebuildSchedule();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FitPlan//Morning Fitness//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const icsDate = d => {
    const y = d.getFullYear();
    const mo = String(d.getMonth()+1).padStart(2,'0');
    const dy = String(d.getDate()).padStart(2,'0');
    return `${y}${mo}${dy}`;
  };
  const icsDateTime = d => {
    const dt = icsDate(d);
    const h = String(d.getHours()).padStart(2,'0');
    const m = String(d.getMinutes()).padStart(2,'0');
    return `${dt}T${h}${m}00`;
  };

  // For each scheduled workout day, create an event the EVENING BEFORE at 8 PM
  state.schedule.forEach((dk, wi) => {
    if (!dk) return;
    const workoutDate = new Date(dk + 'T00:00:00');
    const notifDate = new Date(workoutDate);
    notifDate.setDate(notifDate.getDate() - 1); // day before
    notifDate.setHours(NOTIF_TIME_HOUR, NOTIF_TIME_MIN, 0, 0);

    const w = workouts[wi];
    const total = getTotalMins(w);
    const exNames = w.exercises.slice(0, 4).map(e => exercises[e.ex].name).join(', ');
    const more = w.exercises.length > 4 ? ` +${w.exercises.length - 4} more` : '';

    const uid = `fitplan-day${w.day}-${dk}@fitplan`;
    const dtstart = icsDateTime(notifDate);
    const dtend = icsDateTime(new Date(notifDate.getTime() + 15 * 60000)); // 15-min event
    const created = icsDateTime(new Date());

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${created}Z`);
    lines.push(`DTSTART:${dtstart}`);
    lines.push(`DTEND:${dtend}`);
    lines.push(`SUMMARY:💪 Tomorrow: Day ${w.day} · ${total} min`);
    lines.push(`DESCRIPTION:${w.focus.join(' · ')}\\n\\nExercises: ${exNames}${more}\\n\\nOpen FitPlan app to view full workout.`);
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:PT0S');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Tomorrow's workout: Day ${w.day} · ${w.focus[0]} · ${total} min`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  });

  // Also add tennis day reminders (for the days before each tennis day in range)
  const allDays = [];
  for (let d = 0; d < 100; d++) {
    const dt = addDays(PROGRAM_START, d);
    if (dt > addDays(new Date(), 70)) break;
    if (isDefaultRestDay(dt)) allDays.push(dt);
  }
  allDays.forEach(dt => {
    const notifDate = new Date(dt);
    notifDate.setDate(notifDate.getDate() - 1);
    notifDate.setHours(NOTIF_TIME_HOUR, NOTIF_TIME_MIN, 0, 0);
    const dayName = dayFullNames[dt.getDay()];
    const uid = `fitplan-tennis-${dateKey(dt)}@fitplan`;
    const dtstart = icsDateTime(notifDate);
    const dtend = icsDateTime(new Date(notifDate.getTime() + 15 * 60000));
    const created = icsDateTime(new Date());
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${created}Z`);
    lines.push(`DTSTART:${dtstart}`);
    lines.push(`DTEND:${dtend}`);
    lines.push(`SUMMARY:🎾 Tomorrow: ${dayName} Tennis Day`);
    lines.push(`DESCRIPTION:Tennis day tomorrow! Remember your 5-min clay court warm-up:\\n- Leg Swings\\n- Hip Circles\\n- Ankle Stability\\n- Lateral Side Steps`);
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:PT0S');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:🎾 Tennis tomorrow — don't forget your clay court warm-up!`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FitPlan-Reminders.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Mark as set
  localStorage.setItem('icsDownloaded', '1');
  const status = document.getElementById('notifStatus');
  status.textContent = '📅 Calendar set';
  status.className = 'notif-status notif-on';
  document.getElementById('notifPanelSub').textContent = 'Reminders added to your Calendar app';
  showToast('📅 Open the .ics file to add to Calendar!');
}
