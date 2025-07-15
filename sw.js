/**
 * BrightLens News Service Worker
 * Enhanced offline support and performance optimizations
 */

const CACHE_NAME = 'brightlens-news-v2.0';
const STATIC_CACHE = 'brightlens-static-v2.0';
const DYNAMIC_CACHE = 'brightlens-dynamic-v2.0';
const IMAGE_CACHE = 'brightlens-images-v2.0';

// Critical files to cache immediately
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/splash-screen.css',
    '/css/themes.css',
    '/js/splash-screen.js',
    '/js/main.js',
    '/js/news-api.js',
    '/js/category-news.js',
    '/js/themes.js',
    '/assets/brightlens-3d-logo.svg',
    '/assets/default.svg',
    '/manifest.json'
];

// Dynamic resources that can be cached after first load
const DYNAMIC_ASSETS = [
    '/latest.html',
    '/kenya.html',
    '/world.html',
    '/entertainment.html',
    '/technology.html',
    '/business.html',
    '/sports.html',
    '/health.html',
    '/weather.html',
    '/music.html',
    '/lifestyle.html'
];

// External resources to cache
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Cache expiration times (in milliseconds)
const CACHE_EXPIRATION = {
    static: 24 * 60 * 60 * 1000, // 24 hours
    dynamic: 2 * 60 * 60 * 1000, // 2 hours
    images: 7 * 24 * 60 * 60 * 1000, // 7 days
    api: 5 * 60 * 1000 // 5 minutes
};

// Install event - cache critical assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing v2.0...');
    
    event.waitUntil(
        Promise.all([
            // Cache critical assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Caching critical assets');
                return cache.addAll(CRITICAL_ASSETS.map(url => {
                    return new Request(url, { cache: 'reload' });
                }));
            }),
            
            // Cache external assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Caching external assets');
                return Promise.allSettled(
                    EXTERNAL_ASSETS.map(url => 
                        cache.add(new Request(url, { 
                            cache: 'reload',
                            mode: 'cors'
                        })).catch(err => console.log(`Failed to cache ${url}:`, err))
                    )
                );
            }),
            
            // Preload dynamic assets in background
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('Service Worker: Preloading dynamic assets');
                return Promise.allSettled(
                    DYNAMIC_ASSETS.map(url => 
                        cache.add(new Request(url, { cache: 'reload' }))
                            .catch(err => console.log(`Failed to cache ${url}:`, err))
                    )
                );
            })
        ]).then(() => {
            console.log('Service Worker: Installation complete');
            // Force activation of new service worker
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating v2.0...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE &&
                            cacheName !== IMAGE_CACHE &&
                            cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Clean up expired cache entries
            cleanupExpiredCaches(),
            
            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('Service Worker: Activation complete');
        })
    );
});

// Enhanced fetch event with intelligent caching strategies
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Skip non-HTTP requests
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (isImageRequest(event.request)) {
        event.respondWith(handleImageRequest(event.request));
    } else if (isAPIRequest(event.request)) {
        event.respondWith(handleAPIRequest(event.request));
    } else if (isStaticAsset(event.request)) {
        event.respondWith(handleStaticAsset(event.request));
    } else if (isDynamicPage(event.request)) {
        event.respondWith(handleDynamicPage(event.request));
    } else {
        event.respondWith(handleGenericRequest(event.request));
    }
});

// Helper functions for request handling
function isImageRequest(request) {
    return request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i);
}

function isAPIRequest(request) {
    return request.url.includes('/api/') || 
           request.url.includes('newsapi.org') ||
           request.url.includes('gnews.io') ||
           request.url.includes('newsdata.io');
}

function isStaticAsset(request) {
    return request.url.match(/\.(css|js|woff|woff2|ttf|ico)(\?.*)?$/i) ||
           CRITICAL_ASSETS.includes(new URL(request.url).pathname) ||
           EXTERNAL_ASSETS.includes(request.url);
}

function isDynamicPage(request) {
    return request.url.match(/\.(html?)(\?.*)?$/i) ||
           DYNAMIC_ASSETS.includes(new URL(request.url).pathname);
}

// Image request handler with long-term caching
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse && !isExpired(cachedResponse, CACHE_EXPIRATION.images)) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Only cache successful responses
            const responseClone = networkResponse.clone();
            await cache.put(request, responseClone);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Image request failed:', error);
        
        // Return cached version if available
        const cache = await caches.open(IMAGE_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return fallback image
        return new Response(
            '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" fill="#9ca3af" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="14px">Image not available</text></svg>',
            {
                headers: { 'Content-Type': 'image/svg+xml' }
            }
        );
    }
}

// API request handler with short-term caching
async function handleAPIRequest(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse && !isExpired(cachedResponse, CACHE_EXPIRATION.api)) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            await cache.put(request, responseClone);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('API request failed:', error);
        
        // Return cached version if available
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return error response
        return new Response(
            JSON.stringify({ error: 'Network unavailable', cached: false }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 503
            }
        );
    }
}

// Static asset handler with cache-first strategy
async function handleStaticAsset(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse && !isExpired(cachedResponse, CACHE_EXPIRATION.static)) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            await cache.put(request, responseClone);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Static asset request failed:', error);
        
        // Return cached version if available
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Dynamic page handler with network-first strategy
async function handleDynamicPage(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            const responseClone = networkResponse.clone();
            await cache.put(request, responseClone);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Dynamic page request failed:', error);
        
        // Return cached version if available
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page
        return new Response(
            `<!DOCTYPE html>
            <html>
            <head>
                <title>BrightLens News - Offline</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 2rem; }
                    .offline-msg { color: #666; }
                </style>
            </head>
            <body>
                <h1>BrightLens News</h1>
                <p class="offline-msg">You're currently offline. Please check your internet connection.</p>
                <button onclick="location.reload()">Try Again</button>
            </body>
            </html>`,
            {
                headers: { 'Content-Type': 'text/html' }
            }
        );
    }
}

// Generic request handler
async function handleGenericRequest(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.log('Generic request failed:', error);
        throw error;
    }
}

// Utility functions
function isExpired(response, maxAge) {
    const cacheDate = response.headers.get('sw-cache-date');
    if (!cacheDate) return true;
    
    const age = Date.now() - new Date(cacheDate).getTime();
    return age > maxAge;
}

async function cleanupExpiredCaches() {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        if (cacheName.startsWith('brightlens-')) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    let maxAge = CACHE_EXPIRATION.static;
                    
                    if (cacheName.includes('images')) {
                        maxAge = CACHE_EXPIRATION.images;
                    } else if (cacheName.includes('dynamic')) {
                        maxAge = CACHE_EXPIRATION.dynamic;
                    }
                    
                    if (isExpired(response, maxAge)) {
                        await cache.delete(request);
                    }
                }
            }
        }
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Implement background sync logic here
        console.log('Performing background sync...');
        
        // Example: Sync offline reading history, preferences, etc.
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'BACKGROUND_SYNC',
                data: { status: 'completed' }
            });
        });
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Message handling for cache updates
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_UPDATE') {
        event.waitUntil(updateCache(event.data.url));
    }
});

async function updateCache(url) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await fetch(url);
        
        if (response.ok) {
            await cache.put(url, response);
            console.log('Cache updated for:', url);
        }
    } catch (error) {
        console.error('Cache update failed:', error);
    }
}

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'GET_CACHE_STATS') {
        getCacheStats().then(stats => {
            event.source.postMessage({
                type: 'CACHE_STATS',
                data: stats
            });
        });
    }
});

async function getCacheStats() {
    const cacheNames = await caches.keys();
    const stats = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        stats[cacheName] = {
            count: requests.length,
            size: await getCacheSize(cache)
        };
    }
    
    return stats;
}

async function getCacheSize(cache) {
    const requests = await cache.keys();
    let totalSize = 0;
    
    for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
        }
    }
    
    return totalSize;
}