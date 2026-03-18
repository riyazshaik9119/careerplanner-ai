const CACHE = 'careerplanner-v3';
const ICON_CACHE = 'pwa-icons-v1';
const ASSETS = ['./', './index.html', './manifest.json', './sw.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== ICON_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  // Always fetch AI API calls
  if (url.hostname.includes('anthropic.com') || url.pathname.includes('.netlify/functions')) {
    e.respondWith(fetch(e.request).catch(() => new Response(JSON.stringify({error:'offline'}), {headers:{'Content-Type':'application/json'}})));
    return;
  }
  
  // Serve icons from icon cache first
  if (url.pathname.includes('icon-192') || url.pathname.includes('icon-512')) {
    e.respondWith(
      caches.open(ICON_CACHE).then(cache => cache.match(e.request))
        .then(cached => cached || fetch(e.request))
        .catch(() => new Response(''))
    );
    return;
  }
  
  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

self.addEventListener('push', e => {
  let data = {title:'CareerPlanner AI', body:'Time to study! Keep your streak going!'};
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
      self.registration.showNotification(title, {body, tag: tag||'local', vibrate:[200,100,200]});
    }, delay);
  }
  if (e.data?.action === 'skipWaiting') self.skipWaiting();
});
