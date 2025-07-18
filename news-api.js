/**
 * Enhanced News API Integration for Brightlens News
 * Category-specific real-time news fetching with no sample content
 */

class NewsAPI {
    constructor() {
        // Real API Keys - Updated with provided keys
        this.apiKeys = {
            gnews: '9db0da87512446db08b82d4f63a4ba8d',
            newsdata: 'pub_d74b96fd4a9041d59212493d969368cd',
            newsapi: '9fcf10b2fd0c48c7a1886330ebb04385',
            mediastack: '4e53cf0fa35eefaac21cd9f77925b8f5',
            currentsapi: '9tI-4kOmMlJdgcosDUBsYYZDAnkLnuuL4Hrgc5TKlHmN_AMH'
        };

        // Category-specific API mappings for optimal relevance
        this.categoryMappings = {
            'latest': ['general', 'breaking-news'],
            'world': ['world', 'international'],
            'technology': ['technology', 'tech', 'science'],
            'business': ['business', 'finance', 'economy'],
            'sports': ['sports'],
            'entertainment': ['entertainment', 'celebrities'],
            'health': ['health', 'medical'],
            'lifestyle': ['lifestyle', 'food', 'travel'],
            'kenya': ['kenya', 'nairobi', 'east-africa']
        };

        this.cache = new Map();
        this.cacheTimeout = 3 * 60 * 1000; // 3 minutes for fresh content
    }

    /**
     * Fetch news for a specific category from all APIs with performance monitoring
     */
    async fetchNews(category, limit = 30) {
        const startTime = performance.now();
        const cacheKey = `${category}_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log(`Cache hit for ${category}: ${(performance.now() - startTime).toFixed(2)}ms`);
                return cached.data;
            }
        }

        try {
            console.log(`Fetching real-time ${category} news from all APIs...`);
            
            // Get category-specific keywords
            const categoryKeywords = this.categoryMappings[category] || [category];
            
            // Fetch from all APIs in parallel with category-specific queries
            const promises = [
                this.fetchFromGNews(category, categoryKeywords, limit),
                this.fetchFromNewsData(category, categoryKeywords, limit),
                this.fetchFromNewsAPI(category, categoryKeywords, limit),
                this.fetchFromMediastack(category, categoryKeywords, limit),
                this.fetchFromCurrentsAPI(category, categoryKeywords, limit)
            ];

            const results = await Promise.allSettled(promises);
            
            // Combine results from all APIs
            let allArticles = [];
            let successfulAPIs = 0;
            
            results.forEach((result, index) => {
                const apiNames = ['GNews', 'NewsData', 'NewsAPI', 'Mediastack', 'CurrentsAPI'];
                if (result.status === 'fulfilled' && result.value && Array.isArray(result.value)) {
                    allArticles = allArticles.concat(result.value);
                    successfulAPIs++;
                    console.log(`✓ ${apiNames[index]}: ${result.value.length} articles`);
                } else {
                    console.warn(`✗ ${apiNames[index]} failed:`, result.reason?.message || 'Unknown error');
                }
            });

            console.log(`Fetched from ${successfulAPIs}/5 APIs for ${category}`);

            // Enhanced duplicate removal and sorting
            const uniqueArticles = this.removeDuplicates(allArticles);
            const categoryFilteredArticles = this.filterByCategory(uniqueArticles, category, categoryKeywords);
            const sortedArticles = categoryFilteredArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            const totalTime = (performance.now() - startTime).toFixed(2);
            console.log(`${category} fetch completed: ${totalTime}ms - ${sortedArticles.length} unique articles`);

            return sortedArticles;
        } catch (error) {
            console.error(`Error fetching ${category} news:`, error);
            const totalTime = (performance.now() - startTime).toFixed(2);
            console.log(`${category} fetch failed after: ${totalTime}ms`);
            return []; // Return empty array instead of sample articles
        }
    }

    /**
     * Fetch from GNews API with category-specific queries
     */
    async fetchFromGNews(category, keywords, limit) {
        try {
            const query = this.buildCategoryQuery(keywords);
            const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=any&max=${Math.min(limit, 10)}&apikey=${this.apiKeys.gnews}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`GNews API error: ${response.status}`);
            }
            
            const data = await response.json();
            return this.formatGNewsArticles(data.articles || [], category);
        } catch (error) {
            console.error('GNews fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from NewsData.io API with category-specific queries
     */
    async fetchFromNewsData(category, keywords, limit) {
        try {
            const query = this.buildCategoryQuery(keywords);
            let url = `https://newsdata.io/api/1/news?apikey=${this.apiKeys.newsdata}&q=${encodeURIComponent(query)}&language=en&size=${Math.min(limit, 10)}`;
            
            // Add category filter if supported
            if (['business', 'entertainment', 'health', 'science', 'sports', 'technology', 'world'].includes(category)) {
                url += `&category=${category}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`NewsData API error: ${response.status}`);
            }
            
            const data = await response.json();
            return this.formatNewsDataArticles(data.results || [], category);
        } catch (error) {
            console.error('NewsData fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from NewsAPI.org with category-specific queries
     */
    async fetchFromNewsAPI(category, keywords, limit) {
        try {
            let url;
            
            if (['business', 'entertainment', 'health', 'science', 'sports', 'technology'].includes(category)) {
                // Use category endpoint for supported categories
                url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=${Math.min(limit, 20)}&apiKey=${this.apiKeys.newsapi}`;
            } else {
                // Use everything endpoint with query for other categories
                const query = this.buildCategoryQuery(keywords);
                url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${Math.min(limit, 20)}&apiKey=${this.apiKeys.newsapi}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`NewsAPI error: ${response.status}`);
            }
            
            const data = await response.json();
            return this.formatNewsAPIArticles(data.articles || [], category);
        } catch (error) {
            console.error('NewsAPI fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Mediastack API with category-specific queries
     */
    async fetchFromMediastack(category, keywords, limit) {
        try {
            const query = this.buildCategoryQuery(keywords);
            let url = `https://api.mediastack.com/v1/news?access_key=${this.apiKeys.mediastack}&keywords=${encodeURIComponent(query)}&languages=en&limit=${Math.min(limit, 25)}`;
            
            // Add category filter if supported
            const validCategories = ['business', 'entertainment', 'health', 'science', 'sports', 'technology'];
            if (validCategories.includes(category)) {
                url += `&categories=${category}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Mediastack API error: ${response.status}`);
            }
            
            const data = await response.json();
            return this.formatMediastackArticles(data.data || [], category);
        } catch (error) {
            console.error('Mediastack fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from CurrentsAPI with category-specific queries
     */
    async fetchFromCurrentsAPI(category, keywords, limit) {
        try {
            const query = this.buildCategoryQuery(keywords);
            let url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=en&apiKey=${this.apiKeys.currentsapi}`;
            
            // Add category filter if supported
            const validCategories = ['business', 'entertainment', 'health', 'science', 'sports', 'technology', 'world'];
            if (validCategories.includes(category)) {
                url += `&category=${category}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`CurrentsAPI error: ${response.status}`);
            }
            
            const data = await response.json();
            return this.formatCurrentsAPIArticles(data.news || [], category);
        } catch (error) {
            console.error('CurrentsAPI fetch error:', error);
            return [];
        }
    }

    /**
     * Build category-specific search query
     */
    buildCategoryQuery(keywords) {
        if (keywords.length === 1) {
            return keywords[0];
        }
        return keywords.join(' OR ');
    }

    /**
     * Filter articles by category relevance
     */
    filterByCategory(articles, category, keywords) {
        if (category === 'latest') {
            return articles; // Latest shows all categories
        }
        
        return articles.filter(article => {
            const text = `${article.title} ${article.description}`.toLowerCase();
            return keywords.some(keyword => text.includes(keyword.toLowerCase()));
        });
    }

    /**
     * Enhanced duplicate removal with fuzzy matching and content analysis
     */
    removeDuplicates(articles) {
        if (!articles || articles.length === 0) return [];
        
        const filtered = [];
        const seenUrls = new Set();
        const seenTitles = new Set();
        
        // First pass: remove exact URL duplicates
        articles.forEach(article => {
            if (!article.title || !article.url) return;
            
            const normalizedUrl = article.url.toLowerCase().trim().replace(/[?&]utm_[^&]*&?/g, '').replace(/[?&]$/, '');
            if (seenUrls.has(normalizedUrl)) return;
            
            seenUrls.add(normalizedUrl);
            filtered.push(article);
        });
        
        // Second pass: remove title duplicates and similar articles
        const uniqueFiltered = [];
        
        filtered.forEach(article => {
            const normalizedTitle = article.title.toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            
            // Check for exact title match
            if (seenTitles.has(normalizedTitle)) return;
            
            // Check for similar titles (>85% similarity)
            let isSimilar = false;
            for (const existingTitle of seenTitles) {
                if (this.calculateTitleSimilarity(normalizedTitle, existingTitle) > 0.85) {
                    isSimilar = true;
                    break;
                }
            }
            
            if (!isSimilar) {
                seenTitles.add(normalizedTitle);
                uniqueFiltered.push(article);
            }
        });
        
        console.log(`Duplicate removal: ${articles.length} → ${uniqueFiltered.length} articles`);
        return uniqueFiltered;
    }
    
    /**
     * Calculate similarity between two titles
     */
    calculateTitleSimilarity(title1, title2) {
        const words1 = new Set(title1.split(' ').filter(word => word.length > 2));
        const words2 = new Set(title2.split(' ').filter(word => word.length > 2));
        
        const intersection = new Set([...words1].filter(word => words2.has(word)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    // Article formatting methods for each API
    formatGNewsArticles(articles, category) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.image,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'GNews',
            category: category
        })).filter(article => article.title && article.url);
    }

    formatNewsDataArticles(articles, category) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.link,
            urlToImage: article.image_url,
            publishedAt: article.pubDate,
            source: article.source_id || 'NewsData',
            category: category
        })).filter(article => article.title && article.url);
    }

    formatNewsAPIArticles(articles, category) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'NewsAPI',
            category: category
        })).filter(article => article.title && article.url);
    }

    formatMediastackArticles(articles, category) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.image,
            publishedAt: article.published_at,
            source: article.source || 'Mediastack',
            category: category
        })).filter(article => article.title && article.url);
    }

    formatCurrentsAPIArticles(articles, category) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.image,
            publishedAt: article.published,
            source: article.author || 'CurrentsAPI',
            category: category
        })).filter(article => article.title && article.url);
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return 'Unknown date';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return date.toLocaleDateString();
        } catch (e) {
            return 'Unknown date';
        }
    }

    /**
     * Get category display name
     */
    getCategoryDisplayName(category) {
        const names = {
            'latest': 'Latest News',
            'kenya': 'Kenyan News',
            'world': 'World News',
            'entertainment': 'Entertainment',
            'technology': 'Technology',
            'business': 'Business',
            'sports': 'Sports',
            'health': 'Health',
            'lifestyle': 'Lifestyle'
        };
        return names[category] || 'News';
    }

    /**
     * Sample articles completely disabled - only real-time news
     */
    getSampleArticles(category, source = 'News API') {
        console.log(`Sample articles disabled for ${category} - only real-time news will be displayed`);
        return [];
    }
}

// Export for use in other scripts
window.NewsAPI = NewsAPI;
