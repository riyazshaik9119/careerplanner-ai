const CACHE = 'careerplanner-v2';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/.netlify/') ||
      e.request.url.includes('api.anthropic') ||
      e.request.url.includes('fonts.g')) {
    e.respondWith(fetch(e.request).catch(() => new Response('')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});

// ── PUSH NOTIFICATION HANDLER ──
self.addEventListener('push', e => {
  let data = { title: 'CareerPlanner AI', body: 'Time to study! 📚', type: 'reminder', icon: './icons/icon-192.png', badge: './icons/icon-192.png', tag: 'study', actions: [] };

  if (e.data) {
    try { Object.assign(data, e.data.json()); } catch {}
  }

  // Different notification styles per type
  const configs = {
    daily_reminder: {
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'daily-study',
      renotify: true,
      requireInteraction: false,
      actions: [
        { action: 'open_tracker', title: '✅ Open Tracker' },
        { action: 'snooze', title: '⏰ Remind in 1hr' }
      ]
    },
    exam_countdown: {
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [300, 100, 300, 100, 300],
      tag: 'exam-alert',
      renotify: true,
      requireInteraction: true,
      actions: [
        { action: 'open_tracker', title: '📋 View Tracker' },
        { action: 'open_roadmap', title: '🗺️ View Roadmap' }
      ]
    },
    milestone: {
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [100, 50, 100, 50, 200, 50, 200],
      tag: 'milestone',
      renotify: true,
      requireInteraction: false,
      actions: [
        { action: 'open_tracker', title: '🎉 See Progress' }
      ]
    },
    weekly_report: {
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'weekly',
      renotify: false,
      requireInteraction: false,
      actions: [
        { action: 'open_home', title: '📊 See Report' }
      ]
    },
    streak_reminder: {
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'streak',
      renotify: true,
      requireInteraction: false,
      actions: [
        { action: 'open_home', title: '🔥 Keep Streak' }
      ]
    }
  };

  const cfg = configs[data.type] || configs.daily_reminder;

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      ...cfg,
      data: { url: data.url || './', type: data.type }
    })
  );
});

// ── NOTIFICATION CLICK HANDLER ──
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const action = e.action;
  const type = e.notification.data?.type;

  let url = './';
  if (action === 'open_tracker' || type === 'exam_countdown' || type === 'milestone') url = './#tracker';
  else if (action === 'open_roadmap') url = './#roadmap';
  else if (action === 'snooze') {
    // Schedule a new notification in 1 hour
    e.waitUntil(
      new Promise(resolve => {
        setTimeout(() => {
          self.registration.showNotification('CareerPlanner AI — Reminder', {
            body: "Don't forget — your study session is waiting! 📚",
            icon: './icons/icon-192.png',
            tag: 'snoozed',
            actions: [{ action: 'open_tracker', title: '✅ Open Tracker' }]
          });
          resolve();
        }, 3600000); // 1 hour
      })
    );
    return;
  }

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cls => {
      const existing = cls.find(c => c.url.includes(self.location.origin));
      if (existing) { existing.focus(); existing.postMessage({ action: 'navigate', url }); }
      else clients.openWindow(url);
    })
  );
});

// ── MESSAGE HANDLER (from app → SW) ──
self.addEventListener('message', e => {
  if (e.data?.action === 'scheduleLocal') {
    scheduleLocalNotification(e.data.payload);
  }
  if (e.data?.action === 'skipWaiting') self.skipWaiting();
});

// ── LOCAL NOTIFICATION SCHEDULER ──
// Schedules notifications using setTimeout (survives page close on Android)
function scheduleLocalNotification(payload) {
  const { delay, title, body, type, tag } = payload;
  setTimeout(() => {
    self.registration.showNotification(title, {
      body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      tag: tag || 'local',
      vibrate: [200, 100, 200],
      data: { type }
    });
  }, delay);
}
