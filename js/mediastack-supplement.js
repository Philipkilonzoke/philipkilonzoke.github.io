/**
 * Mediastack API Supplement for Kenya and Sports Categories
 * This module provides additional real-time articles to supplement existing sources
 * without interfering with the main news loading functionality
 */

class MediastackSupplement {
    constructor() {
        this.apiKey = 'ea4397f277b123655ad1929cd58d41a5';
        this.baseUrl = 'https://api.mediastack.com/v1/news';
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache
    }

    /**
     * Fetch Kenya-specific news from Mediastack
     */
    async fetchKenyaNews(limit = 50) {
        const cacheKey = `kenya_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch maximum articles allowed by Mediastack (100 per request)
            const maxLimit = Math.min(limit, 100);
            const url = `${this.baseUrl}?access_key=${this.apiKey}&countries=ke&languages=en&limit=${maxLimit}&sort=published_desc`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Mediastack API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(`Mediastack API error: ${data.error.message}`);
            }

            const articles = this.formatMediastackArticles(data.data || [], 'kenya');
            
            // Cache the results
            this.cache.set(cacheKey, {
                data: articles,
                timestamp: Date.now()
            });

            console.log(`Mediastack: Fetched ${articles.length} Kenya articles`);
            return articles;
            
        } catch (error) {
            console.error('Mediastack Kenya fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch Sports-specific news from Mediastack
     */
    async fetchSportsNews(limit = 50) {
        const cacheKey = `sports_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch maximum articles allowed by Mediastack (100 per request)
            const maxLimit = Math.min(limit, 100);
            const url = `${this.baseUrl}?access_key=${this.apiKey}&categories=sports&languages=en&limit=${maxLimit}&sort=published_desc`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Mediastack API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(`Mediastack API error: ${data.error.message}`);
            }

            const articles = this.formatMediastackArticles(data.data || [], 'sports');
            
            // Cache the results
            this.cache.set(cacheKey, {
                data: articles,
                timestamp: Date.now()
            });

            console.log(`Mediastack: Fetched ${articles.length} Sports articles`);
            return articles;
            
        } catch (error) {
            console.error('Mediastack Sports fetch error:', error);
            return [];
        }
    }

    /**
     * Format Mediastack articles to match the expected structure
     */
    formatMediastackArticles(articles, category) {
        return articles.map(article => ({
            title: article.title || 'No title available',
            description: article.description || article.snippet || 'No description available',
            url: article.url,
            urlToImage: article.image || null,
            publishedAt: article.published_at || new Date().toISOString(),
            source: article.source || 'Mediastack',
            category: category
        })).filter(article => 
            article.title && 
            article.url && 
            article.title !== 'No title available'
        );
    }

    /**
     * Get supplemental articles for a specific category
     */
    async getSupplementalArticles(category, limit = 50) {
        switch(category.toLowerCase()) {
            case 'kenya':
                return await this.fetchKenyaNews(limit);
            case 'sports':
                return await this.fetchSportsNews(limit);
            default:
                return [];
        }
    }

    /**
     * Clear cache for a specific category or all cache
     */
    clearCache(category = null) {
        if (category) {
            const keys = Array.from(this.cache.keys()).filter(key => key.startsWith(category));
            keys.forEach(key => this.cache.delete(key));
        } else {
            this.cache.clear();
        }
    }
}

// Create global instance
window.MediastackSupplement = MediastackSupplement;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediastackSupplement;
}