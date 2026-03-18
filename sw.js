const CACHE = 'careerplanner-v2';
const ASSETS = ['./', './index.html'];
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
  if (e.request.url.includes('/.netlify/') || e.request.url.includes('fonts.g')) {
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
self.addEventListener('push', e => {
  let data = { title: 'CareerPlanner AI', body: 'Time to study! Keep your streak going!' };
  try { if (e.data) Object.assign(data, e.data.json()); } catch {}
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, tag: 'study-reminder', vibrate: [200,100,200]
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
self.addEventListener('message', e => {
  if (e.data?.action === 'scheduleLocal') {
    const { delay, title, body, tag } = e.data.payload;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body, tag: tag || 'local', vibrate: [200,100,200]
      });
    }, delay);
  }
  if (e.data?.action === 'skipWaiting') self.skipWaiting();
});
