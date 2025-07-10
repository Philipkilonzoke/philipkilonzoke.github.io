/**
 * Service Worker for Brightlens News
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'brightlens-news-v1';
const urlsToCache = [
    '/',
    '/css/styles.css',
    '/css/themes.css',
    '/js/main.js',
    '/js/news-api.js',
    '/js/themes.js',
    '/js/extended-articles.js',
    '/assets/default.svg',
    '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
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
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});