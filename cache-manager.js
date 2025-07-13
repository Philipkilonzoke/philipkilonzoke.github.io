/**
 * Cache Manager for News Articles
 * Implements intelligent caching with TTL and storage management
 */
class CacheManager {
    constructor() {
        this.storageKey = 'brightlens_news_cache';
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes
        this.maxCacheSize = 10 * 1024 * 1024; // 10MB
        this.cleanupInterval = 60 * 1000; // 1 minute
        
        this.startCleanupTimer();
    }

    /**
     * Get cached data for a specific key
     * @param {string} key - Cache key
     * @returns {*} Cached data or null if not found/expired
     */
    get(key) {
        try {
            const cache = this.getCache();
            const item = cache[key];
            
            if (!item) return null;
            
            // Check if expired
            if (Date.now() > item.expiry) {
                this.delete(key);
                return null;
            }
            
            // Update access time for LRU
            item.lastAccessed = Date.now();
            this.saveCache(cache);
            
            return item.data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    /**
     * Set cached data with optional TTL
     * @param {string} key - Cache key
     * @param {*} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds
     */
    set(key, data, ttl = this.defaultTTL) {
        try {
            const cache = this.getCache();
            const now = Date.now();
            
            cache[key] = {
                data: data,
                expiry: now + ttl,
                created: now,
                lastAccessed: now,
                size: this.getDataSize(data)
            };
            
            this.saveCache(cache);
            this.cleanupIfNeeded();
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    /**
     * Delete a cache entry
     * @param {string} key - Cache key to delete
     */
    delete(key) {
        try {
            const cache = this.getCache();
            delete cache[key];
            this.saveCache(cache);
        } catch (error) {
            console.error('Cache delete error:', error);
        }
    }

    /**
     * Clear all cache entries
     */
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getStats() {
        try {
            const cache = this.getCache();
            const entries = Object.values(cache);
            const now = Date.now();
            
            return {
                totalEntries: entries.length,
                totalSize: entries.reduce((sum, item) => sum + item.size, 0),
                expiredEntries: entries.filter(item => now > item.expiry).length,
                oldestEntry: entries.reduce((oldest, item) => 
                    !oldest || item.created < oldest.created ? item : oldest, null),
                newestEntry: entries.reduce((newest, item) => 
                    !newest || item.created > newest.created ? item : newest, null)
            };
        } catch (error) {
            console.error('Cache stats error:', error);
            return {
                totalEntries: 0,
                totalSize: 0,
                expiredEntries: 0,
                oldestEntry: null,
                newestEntry: null
            };
        }
    }

    /**
     * Get the raw cache object from localStorage
     * @returns {Object} Cache object
     */
    getCache() {
        try {
            const cached = localStorage.getItem(this.storageKey);
            return cached ? JSON.parse(cached) : {};
        } catch (error) {
            console.error('Error reading cache:', error);
            return {};
        }
    }

    /**
     * Save cache object to localStorage
     * @param {Object} cache - Cache object to save
     */
    saveCache(cache) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(cache));
        } catch (error) {
            console.error('Error saving cache:', error);
            // If quota exceeded, clear cache and try again
            if (error.name === 'QuotaExceededError') {
                this.clear();
                try {
                    localStorage.setItem(this.storageKey, JSON.stringify(cache));
                } catch (retryError) {
                    console.error('Failed to save cache after clearing:', retryError);
                }
            }
        }
    }

    /**
     * Estimate the size of data in bytes
     * @param {*} data - Data to measure
     * @returns {number} Estimated size in bytes
     */
    getDataSize(data) {
        try {
            return new Blob([JSON.stringify(data)]).size;
        } catch (error) {
            return JSON.stringify(data).length * 2; // Rough estimate
        }
    }

    /**
     * Clean up expired entries and enforce size limits
     */
    cleanup() {
        try {
            const cache = this.getCache();
            const now = Date.now();
            let cleaned = false;
            
            // Remove expired entries
            Object.keys(cache).forEach(key => {
                if (now > cache[key].expiry) {
                    delete cache[key];
                    cleaned = true;
                }
            });
            
            // Enforce size limit using LRU
            const entries = Object.entries(cache);
            const totalSize = entries.reduce((sum, [, item]) => sum + item.size, 0);
            
            if (totalSize > this.maxCacheSize) {
                // Sort by last accessed (LRU)
                entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
                
                let currentSize = totalSize;
                const targetSize = this.maxCacheSize * 0.8; // Clean to 80% capacity
                
                while (currentSize > targetSize && entries.length > 0) {
                    const [key, item] = entries.shift();
                    currentSize -= item.size;
                    delete cache[key];
                    cleaned = true;
                }
            }
            
            if (cleaned) {
                this.saveCache(cache);
            }
        } catch (error) {
            console.error('Cache cleanup error:', error);
        }
    }

    /**
     * Check if cleanup is needed and perform it
     */
    cleanupIfNeeded() {
        const stats = this.getStats();
        if (stats.expiredEntries > 10 || stats.totalSize > this.maxCacheSize * 0.9) {
            this.cleanup();
        }
    }

    /**
     * Start automatic cleanup timer
     */
    startCleanupTimer() {
        setInterval(() => {
            this.cleanup();
        }, this.cleanupInterval);
    }

    /**
     * Generate cache key for news requests
     * @param {string} category - News category
     * @param {number} page - Page number
     * @param {Object} filters - Additional filters
     * @returns {string} Cache key
     */
    generateNewsKey(category, page = 1, filters = {}) {
        const keyData = { category, page, filters };
        return `news_${btoa(JSON.stringify(keyData))}`;
    }
}

// Create global cache manager instance
window.cacheManager = new CacheManager();
