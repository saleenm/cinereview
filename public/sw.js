// CineReview Service Worker — offline caching
const CACHE = 'cinereview-v1'
const STATIC = ['/en', '/en/movies', '/en/top-rated', '/en/blog']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  // Only cache same-origin GET requests
  if (e.request.method !== 'GET') return
  if (!e.request.url.startsWith(self.location.origin)) return
  // Skip API routes
  if (e.request.url.includes('/api/')) return

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
        }
        return res
      }).catch(() => cached)
    })
  )
})
