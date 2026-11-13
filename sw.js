// Yujin Studio — cache hors ligne. Toujours la dernière version quand il y a du réseau.
const C = 'ys-v1';
const FILES = ['./', 'index.html', 'icon.png', 'manifest.webmanifest'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const isPage = e.request.mode === 'navigate' || u.pathname.endsWith('/index.html');
  if (!isPage) { e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request))); return; }
  e.respondWith((async () => {
    const c = await caches.open(C);
    try {
      const r = await fetch(e.request, { cache: 'no-cache' });
      if (r.ok) await c.put('index.html', r.clone());
      return r;
    } catch {
      return (await c.match('index.html')) || Response.error();
    }
  })());
});
