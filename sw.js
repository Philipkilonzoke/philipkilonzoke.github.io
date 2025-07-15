/**
 * BrightLens News Service Worker
 * Provides offline support and performance optimizations
 */

const CACHE_NAME = 'brightlens-news-v1.2';
const STATIC_CACHE = 'brightlens-static-v1.2';
const DYNAMIC_CACHE = 'brightlens-dynamic-v1.2';

// Critical files to cache immediately
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/splash-screen.css',
    '/css/themes.css',
    '/js/splash-screen.js',
    '/js/main.js',
    '/js/themes.js',
    '/assets/brightlens-3d-logo.svg',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
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
    '/weather.html'
];

// Install event - cache critical assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache critical assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Caching critical assets');
                return cache.addAll(CRITICAL_ASSETS.map(url => {
                    return new Request(url, { cache: 'reload' });
                }));
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
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE &&
                            cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('Service Worker: Activation complete');
        })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip external APIs (let them go directly to network)
    if (url.origin !== location.origin && 
        !url.href.includes('fonts.googleapis.com') &&
        !url.href.includes('fonts.gstatic.com') &&
        !url.href.includes('cdnjs.cloudflare.com')) {
        return;
    }
    
    event.respondWith(
        handleFetchRequest(request)
    );
});

async function handleFetchRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy: Cache First for static assets
        if (isStaticAsset(request)) {
            return await cacheFirst(request);
        }
        
        // Strategy: Network First for HTML pages
        if (isHTMLPage(request)) {
            return await networkFirst(request);
        }
        
        // Strategy: Stale While Revalidate for other resources
        return await staleWhileRevalidate(request);
        
    } catch (error) {
        console.error('Service Worker: Fetch failed', error);
        
        // Return cached version or offline page
        const cachedResponse = await getCachedResponse(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline fallback for HTML pages
        if (request.destination === 'document') {
            return new Response(
                getOfflinePage(),
                { 
                    headers: { 'Content-Type': 'text/html' },
                    status: 200
                }
            );
        }
        
        // Return network error for other resources
        return new Response('Network Error', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    await cacheResponse(request, networkResponse.clone());
    return networkResponse;
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request, {
            cache: 'no-cache'
        });
        
        if (networkResponse.ok) {
            await cacheResponse(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const networkResponsePromise = fetch(request).then(response => {
        if (response.ok) {
            cacheResponse(request, response.clone());
        }
        return response;
    }).catch(err => {
        console.log('Network request failed:', err);
        return null;
    });
    
    return cachedResponse || await networkResponsePromise;
}

async function cacheResponse(request, response) {
    if (!response || response.status !== 200) return;
    
    const cache = await caches.open(
        isStaticAsset(request) ? STATIC_CACHE : DYNAMIC_CACHE
    );
    
    await cache.put(request, response);
}

async function getCachedResponse(request) {
    return await caches.match(request) || 
           await caches.match(request, { ignoreSearch: true });
}

function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(css|js|svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|ico)$/);
}

function isHTMLPage(request) {
    return request.destination === 'document' || 
           request.headers.get('Accept')?.includes('text/html');
}

function getOfflinePage() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BrightLens News - Offline</title>
            <style>
                body { 
                    font-family: Inter, sans-serif; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    min-height: 100vh; 
                    margin: 0; 
                    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
                    color: white;
                    text-align: center;
                }
                .offline-container { max-width: 400px; padding: 2rem; }
                .offline-logo { width: 120px; height: auto; margin-bottom: 1rem; }
                h1 { font-size: 2rem; margin-bottom: 1rem; }
                p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; }
                button { 
                    background: #f59e0b; 
                    color: white; 
                    border: none; 
                    padding: 0.75rem 2rem; 
                    border-radius: 0.5rem; 
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                button:hover { background: #d97706; }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <h1>You're Offline</h1>
                <p>BrightLens News is currently unavailable. Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()">Retry</button>
            </div>
        </body>
        </html>
    `;
}

// Listen for messages from the main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Implement background sync logic here
            console.log('Background sync triggered')
        );
    }
});

console.log('Service Worker: Script loaded successfully');