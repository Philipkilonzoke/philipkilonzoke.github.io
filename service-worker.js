const CACHE_NAME = 'brightlens-news-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/themes.css',
  '/css/style.css',
  '/css/live-tv.css',
  '/css/music.css',
  '/css/music-2025.css',
  '/css/weather.css',
  '/js/sidebar-navigation.js',
  '/js/push-notifications.js',
  '/script.js',
  '/news-data.js',
  '/news-sources.js',
  '/latest.html',
  '/kenya.html',
  '/world.html',
  '/entertainment.html',
  '/technology.html',
  '/business.html',
  '/sports.html',
  '/health.html',
  '/lifestyle.html',
  '/music.html',
  '/food.html',
  '/movies-series.html',
  '/crypto.html',
  '/astronomy.html',
  '/aviation.html',
  '/weather.html',
  '/live-tv.html',
  '/assets/default.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('Cache failed:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  console.log('Background sync triggered');
}

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New news update available!',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Read Now',
        icon: '/assets/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Brightlens News', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});