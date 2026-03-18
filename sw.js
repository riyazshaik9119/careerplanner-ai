const CACHE = 'careerplanner-premium-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.url.includes('anthropic.com') || e.request.url.includes('fonts.googleapis') || e.request.url.includes('fonts.gstatic')) { e.respondWith(fetch(e.request).catch(() => new Response(''))); return; }
  e.respondWith(caches.match(e.request).then(cached => { if (cached) return cached; return fetch(e.request).then(res => { if (!res || res.status !== 200) return res; caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res; }).catch(() => caches.match('./index.html')); }));
});
