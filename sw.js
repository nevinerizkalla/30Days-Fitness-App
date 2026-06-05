const CACHE_NAME = 'fitness30-v5';
const ASSETS = [
  './index.html',
  './manifest.json',
  './program-data.js',
  './css/base.css',
  './css/header.css',
  './css/calendar.css',
  './css/modals.css',
  './css/summary.css',
  './css/components.css',
  './js/storage.js',
  './js/program.js',
  './js/schedule.js',
  './js/ui.js',
  './js/calendar.js',
  './js/workout-modal.js',
  './js/tennis-modal.js',
  './js/postpone-modal.js',
  './js/summary.js',
  './js/export.js',
  './js/notifications.js',
  './js/pwa.js',
  './js/app.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('fonts.googleapis') || e.request.url.includes('youtube')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // Network-first for the program data file so plan edits take effect on next load.
  if (e.request.url.includes('program-data.js')) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return resp;
    }))
  );
});

// ── SCHEDULED NOTIFICATION (Android / Chrome) ─────────────
// The page posts a message with the notification payload and target timestamp.
// We store it and fire when the time arrives via a periodic check.
const NOTIF_STORE_KEY = 'pendingNotif';

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIF') {
    // Store payload in cache storage as a simple JSON file
    const payload = JSON.stringify(e.data.payload);
    caches.open(CACHE_NAME).then(c => {
      c.put('/_notif_payload', new Response(payload, {
        headers: { 'Content-Type': 'application/json' }
      }));
    });
    // Start the alarm loop
    scheduleTick();
  }
  if (e.data && e.data.type === 'CANCEL_NOTIF') {
    caches.open(CACHE_NAME).then(c => c.delete('/_notif_payload'));
  }
});

function scheduleTick() {
  // Check every minute if it's time to fire
  setTimeout(async () => {
    const cache = await caches.open(CACHE_NAME);
    const resp = await cache.match('/_notif_payload');
    if (!resp) return;
    const payload = await resp.json();
    const now = Date.now();
    if (now >= payload.fireAt) {
      // Fire it
      await self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        tag: 'fitness-reminder',
        renotify: true,
        data: { url: './' }
      });
      // Reschedule for same time tomorrow
      payload.fireAt += 24 * 60 * 60 * 1000;
      await cache.put('/_notif_payload', new Response(JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' }
      }));
      scheduleTick();
    } else {
      // Not yet — check again in 45 seconds
      setTimeout(scheduleTick, 45000);
    }
  }, 45000);
}

// On SW startup, resume tick if a payload exists
self.addEventListener('activate', () => {
  caches.open(CACHE_NAME).then(async c => {
    const resp = await c.match('/_notif_payload');
    if (resp) scheduleTick();
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      if (list.length) return list[0].focus();
      return clients.openWindow('./');
    })
  );
});
