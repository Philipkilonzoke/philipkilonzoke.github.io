/**
 * FAST NEWS LOADER - IMMEDIATE CONTENT DISPLAY
 * Shows cached content instantly while loading fresh news in background
 */

class FastNewsLoader {
    constructor() {
        this.cache = new Map();
        this.loadingTimeout = 3000; // 3 second timeout
        this.initialized = false;
        
        console.log('🚀 Fast News Loader initialized');
    }
    
    /**
     * Load news immediately - shows cached first, then fresh content
     */
    async loadNewsImmediately(category = 'latest') {
        console.log(`⚡ Loading ${category} news with instant display...`);
        
        // 1. Show cached content immediately if available
        const cachedNews = this.getCachedNews(category);
        if (cachedNews && cachedNews.length > 0) {
            console.log(`📋 Showing ${cachedNews.length} cached articles immediately`);
            this.displayNews(cachedNews, category, true);
        } else {
            // Show loading placeholder
            this.showLoadingPlaceholder(category);
        }
        
        // 2. Load fresh content in background
        try {
            const freshNews = await this.fetchFreshNews(category);
            if (freshNews && freshNews.length > 0) {
                console.log(`🆕 Loaded ${freshNews.length} fresh articles`);
                this.cacheNews(category, freshNews);
                this.displayNews(freshNews, category, false);
            }
        } catch (error) {
            console.error('Failed to load fresh news:', error);
            // If no cached content and fresh loading failed, show placeholder
            if (!cachedNews || cachedNews.length === 0) {
                this.showErrorPlaceholder(category);
            }
        }
    }
    
    /**
     * Get cached news from localStorage
     */
    getCachedNews(category) {
        try {
            const cached = localStorage.getItem(`brightlens_cache_${category}`);
            if (cached) {
                const data = JSON.parse(cached);
                const maxAge = 30 * 60 * 1000; // 30 minutes
                if (Date.now() - data.timestamp < maxAge) {
                    return data.articles;
                }
            }
        } catch (error) {
            console.error('Error reading cache:', error);
        }
        return null;
    }
    
    /**
     * Cache news to localStorage
     */
    cacheNews(category, articles) {
        try {
            const cacheData = {
                articles: articles.slice(0, 20), // Cache only first 20
                timestamp: Date.now()
            };
            localStorage.setItem(`brightlens_cache_${category}`, JSON.stringify(cacheData));
            console.log(`💾 Cached ${articles.length} articles for ${category}`);
        } catch (error) {
            console.error('Error caching news:', error);
        }
    }
    
    /**
     * Fetch fresh news with timeout
     */
    async fetchFreshNews(category) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.loadingTimeout);
        
        try {
            // Use the main NewsAPI but with timeout
            if (window.newsAPI) {
                const articles = await window.newsAPI.getNewsByCategory(category);
                clearTimeout(timeoutId);
                return articles;
            } else {
                // Fallback to simple fetch
                const response = await fetch(`/api/news/${category}`, {
                    signal: controller.signal
                });
                const data = await response.json();
                clearTimeout(timeoutId);
                return data.articles || [];
            }
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    /**
     * Display news in the page
     */
    displayNews(articles, category, isCache = false) {
        const container = document.getElementById('news-container') || 
                         document.querySelector('.news-grid') ||
                         document.querySelector('.articles-grid') ||
                         document.querySelector('#articles-container');
        
        if (!container) {
            console.warn('No news container found');
            return;
        }
        
        // Add cache indicator
        if (isCache) {
            container.innerHTML = `
                <div style="
                    background: rgba(0, 188, 212, 0.1); 
                    border: 1px solid rgba(0, 188, 212, 0.3);
                    border-radius: 8px; 
                    padding: 12px; 
                    margin-bottom: 20px;
                    text-align: center;
                    color: #00bcd4;
                    font-size: 0.9rem;
                ">
                    📋 Showing cached content • Loading fresh news...
                </div>
            ` + this.generateArticleHTML(articles);
        } else {
            // Remove cache indicator and show fresh content
            container.innerHTML = this.generateArticleHTML(articles);
        }
        
        console.log(`📰 Displayed ${articles.length} articles`);
    }
    
    /**
     * Generate HTML for articles
     */
    generateArticleHTML(articles) {
        if (!articles || articles.length === 0) {
            return '<div class="no-articles">No articles available</div>';
        }
        
        return articles.map(article => `
            <article class="article-card" style="
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
                margin-bottom: 20px;
            ">
                ${article.image || article.urlToImage ? `
                    <img src="${article.image || article.urlToImage}" 
                         alt="${article.title}" 
                         style="width: 100%; height: 200px; object-fit: cover;"
                         onerror="this.style.display='none'">
                ` : ''}
                <div style="padding: 20px;">
                    <h3 style="
                        font-size: 1.2rem;
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 10px;
                        line-height: 1.4;
                    ">${article.title}</h3>
                    <p style="
                        color: #64748b;
                        line-height: 1.6;
                        margin-bottom: 15px;
                    ">${(article.description || '').substring(0, 150)}...</p>
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 0.85rem;
                        color: #94a3b8;
                    ">
                        <span>${article.source?.name || 'BrightLens News'}</span>
                        <span>${this.formatDate(article.publishedAt)}</span>
                    </div>
                    ${article.url ? `
                        <a href="${article.url}" target="_blank" style="
                            display: inline-block;
                            margin-top: 15px;
                            padding: 8px 16px;
                            background: #2563eb;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                            font-size: 0.9rem;
                            transition: background 0.3s ease;
                        ">Read More</a>
                    ` : ''}
                </div>
            </article>
        `).join('');
    }
    
    /**
     * Show loading placeholder
     */
    showLoadingPlaceholder(category) {
        const container = document.getElementById('news-container') || 
                         document.querySelector('.news-grid') ||
                         document.querySelector('.articles-grid') ||
                         document.querySelector('#articles-container');
        
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="
                        width: 60px;
                        height: 60px;
                        border: 4px solid #e2e8f0;
                        border-top: 4px solid #2563eb;
                        border-radius: 50%;
                        margin: 0 auto 20px;
                        animation: spin 1s linear infinite;
                    "></div>
                    <h3 style="color: #1e293b; margin-bottom: 10px;">Loading ${category} news...</h3>
                    <p style="color: #64748b;">Fetching the latest articles for you</p>
                    
                    <style>
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    </style>
                </div>
            `;
        }
    }
    
    /**
     * Show error placeholder
     */
    showErrorPlaceholder(category) {
        const container = document.getElementById('news-container') || 
                         document.querySelector('.news-grid') ||
                         document.querySelector('.articles-grid') ||
                         document.querySelector('#articles-container');
        
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">📰</div>
                    <h3 style="color: #1e293b; margin-bottom: 10px;">News temporarily unavailable</h3>
                    <p style="color: #64748b; margin-bottom: 20px;">We're working to restore the news feed</p>
                    <button onclick="window.location.reload()" style="
                        padding: 12px 24px;
                        background: #2563eb;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Try Again</button>
                </div>
            `;
        }
    }
    
    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch {
            return '';
        }
    }
    
    /**
     * Preload news for multiple categories
     */
    async preloadNews() {
        const categories = ['latest', 'kenya', 'world', 'technology', 'business', 'sports'];
        
        console.log('🔄 Preloading news for all categories...');
        
        const preloadPromises = categories.map(async (category) => {
            try {
                const articles = await this.fetchFreshNews(category);
                if (articles && articles.length > 0) {
                    this.cacheNews(category, articles);
                }
            } catch (error) {
                console.error(`Failed to preload ${category}:`, error);
            }
        });
        
        await Promise.allSettled(preloadPromises);
        console.log('✅ News preloading completed');
    }
}

// Initialize fast news loader
window.fastNewsLoader = new FastNewsLoader();

// Auto-preload news when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the page to fully load, then preload
    setTimeout(() => {
        if (window.fastNewsLoader) {
            window.fastNewsLoader.preloadNews();
        }
    }, 2000);
});

console.log('⚡ Fast News Loader module loaded');