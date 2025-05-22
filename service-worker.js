const CACHE_NAME = "ecotracker-cache-v2"; // zmień wersję przy każdej aktualizacji
const OFFLINE_URL = "fallback.html";

const FILES_TO_CACHE = [
  "index.html",
  "activity.html",
  "history.html",
  "fallback.html",
  "styles/styles.css",
  "js/app.js",
  "js/activity.js",
  "js/history.js",
  "js/db.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
];

// Install – cache only static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch((err) => {
        console.error("Błąd cache.addAll:", err);
      })
  );
  self.skipWaiting();
});

// Activate – cleanup old cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch – smarter strategy
self.addEventListener("fetch", (event) => {
  const requestURL = new URL(event.request.url);

  // Ignore chrome-extension and non-HTTP protocols
  if (!requestURL.protocol.startsWith("http")) {
    return;
  }

  // Navigate: show offline page if fetch fails
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Never cache HTML or JS dynamically – always fetch latest
  if (
    event.request.url.endsWith(".html") ||
    event.request.url.endsWith(".js")
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets (CSS, icons, etc.)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            try {
              if (event.request.url.startsWith(self.location.origin)) {
                cache.put(event.request, res.clone());
              }
            } catch (err) {
              console.warn("Nie można cache’ować:", event.request.url, err);
            }
            return res;
          });
        })
      );
    })
  );
});
