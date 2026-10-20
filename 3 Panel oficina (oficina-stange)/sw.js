// Panel de oficina: siempre busca la versión más nueva; solo si no hay internet muestra la última guardada.
// Los datos de la planilla nunca se guardan aquí (pasan directo a Google).
const VERSION = "viajes-oficina-v2";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(["./", "./manifest.webmanifest", "./icono-192.png", "./icono-512.png"])));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(n => Promise.all(n.filter(k => k.startsWith("viajes-oficina") && k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { if (r.ok) { const copia = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./")))
  );
});
