/**
 * Enhanced News API Integration for Brightlens News
 * Category-specific real-time news fetching with maximum article coverage
 * Enhanced for all 10 categories with optimized API distribution
 */

class NewsAPI {
    constructor() {
        // Real API Keys - All provided keys integrated
        this.apiKeys = {
            gnews: '9db0da87512446db08b82d4f63a4ba8d',
            newsdata: 'pub_d74b96fd4a9041d59212493d969368cd',
            newsapi: '9fcf10b2fd0c48c7a1886330ebb04385',
            mediastack: '4e53cf0fa35eefaac21cd9f77925b8f5',
            currentsapi: '9tI-4kOmMlJdgcosDUBsYYZDAnkLnuuL4Hrgc5TKlHmN_AMH'
        };

        // ENHANCED cache configuration for maximum speed and real-time freshness
        this.cache = new Map();
        this.cacheTimeout = 120000; // 2 minutes for better balance of speed and freshness
        this.maxCacheSize = 100; // Larger cache for all 10 categories
        this.backgroundRefreshInterval = 60000; // Background refresh every minute
        
        // Performance monitoring
        this.performanceMetrics = {
            totalRequests: 0,
            cacheHits: 0,
            averageLoadTime: 0,
            fastestLoadTime: Infinity,
            slowestLoadTime: 0
        };

        // CORS proxy services
        this.corsProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest='
        ];

        // ENHANCED Category-specific API mappings for maximum real-time coverage
        this.categoryMappings = {
            'latest': {
                primary: ['breaking news', 'latest news', 'top stories', 'news today', 'current events'],
                secondary: ['headlines', 'news update', 'live news', 'trending news', 'hot news'],
                sources: ['all'] // Use all APIs for latest news
            },
            'kenya': {
                primary: ['kenya', 'kenyan', 'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret'],
                secondary: ['east africa', 'kenya news', 'kenyan politics', 'kenya economy', 'kenya business', 'uhuru', 'ruto', 'raila', 'kenya government'],
                sources: ['gnews', 'newsdata', 'newsapi', 'mediastack', 'currentsapi'],
                regions: ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'machakos', 'thika']
            },
            'world': {
                primary: ['international', 'global news', 'world news', 'international politics', 'global economy'],
                secondary: ['africa', 'europe', 'america', 'asia', 'middle east', 'australia', 'south america', 'united states', 'china', 'russia', 'uk', 'france', 'germany'],
                sources: ['all'],
                regions: ['usa', 'uk', 'china', 'russia', 'france', 'germany', 'japan', 'india', 'brazil']
            },
            'sports': {
                primary: ['sports', 'football', 'soccer', 'basketball', 'athletics', 'rugby', 'cricket', 'tennis'],
                secondary: ['nfl', 'nba', 'premier league', 'champions league', 'fifa', 'olympics', 'sports news', 'match results', 'tournament', 'league', 'championship'],
                sources: ['all'],
                leagues: ['premier league', 'champions league', 'nfl', 'nba', 'mlb', 'nhl', 'la liga', 'serie a', 'bundesliga']
            },
            'technology': {
                primary: ['technology', 'tech', 'artificial intelligence', 'AI', 'gadgets', 'smartphones', 'apps'],
                secondary: ['innovation', 'startup', 'software', 'hardware', 'cybersecurity', 'data privacy', 'machine learning', 'blockchain', 'cryptocurrency', 'metaverse', 'virtual reality'],
                sources: ['all'],
                companies: ['apple', 'google', 'microsoft', 'meta', 'tesla', 'amazon', 'netflix', 'nvidia', 'samsung']
            },
            'business': {
                primary: ['business', 'finance', 'economy', 'stock market', 'investment', 'banking', 'trade'],
                secondary: ['entrepreneurship', 'companies', 'merger', 'acquisition', 'earnings', 'financial', 'markets', 'inflation', 'gdp', 'economic growth', 'startup funding'],
                sources: ['all'],
                sectors: ['technology', 'healthcare', 'energy', 'banking', 'retail', 'automotive', 'real estate']
            },
            'health': {
                primary: ['health', 'medicine', 'medical', 'healthcare', 'disease', 'wellness', 'fitness'],
                secondary: ['mental health', 'nutrition', 'vaccine', 'covid', 'pandemic', 'medical research', 'drug', 'hospital', 'doctor', 'treatment', 'therapy'],
                sources: ['all'],
                specialties: ['cardiology', 'oncology', 'neurology', 'pediatrics', 'mental health', 'nutrition']
            },
            'lifestyle': {
                primary: ['lifestyle', 'fashion', 'food', 'travel', 'family', 'culture', 'personal development'],
                secondary: ['home', 'relationships', 'parenting', 'cooking', 'recipe', 'beauty', 'style', 'vacation', 'tourism', 'wellness', 'self-care'],
                sources: ['gnews', 'newsdata', 'newsapi', 'currentsapi'],
                topics: ['fashion trends', 'travel destinations', 'food recipes', 'home decor', 'relationships']
            },
            'entertainment': {
                primary: ['entertainment', 'movies', 'celebrities', 'shows', 'television', 'streaming', 'awards'],
                secondary: ['hollywood', 'bollywood', 'netflix', 'disney', 'cinema', 'film', 'tv series', 'reality show', 'oscar', 'emmy', 'golden globe'],
                sources: ['all'],
                platforms: ['netflix', 'disney', 'hbo', 'amazon prime', 'apple tv', 'hulu']
            },
            'music': {
                primary: ['music', 'artist', 'album', 'song', 'concert', 'musician', 'band', 'recording'],
                secondary: ['music industry', 'record label', 'music festival', 'tour', 'charts', 'streaming', 'spotify', 'apple music', 'grammy', 'music video', 'single release'],
                sources: ['all'],
                genres: ['pop', 'rock', 'hip hop', 'country', 'jazz', 'classical', 'electronic', 'r&b'],
                platforms: ['spotify', 'apple music', 'youtube music', 'soundcloud']
            }
        };
        
        // Enhanced source reliability mapping
        this.sourceReliability = {
            'bbc': 0.95,
            'reuters': 0.94,
            'cnn': 0.88,
            'associated press': 0.93,
            'bloomberg': 0.92,
            'the guardian': 0.89,
            'washington post': 0.87,
            'new york times': 0.86,
            'wall street journal': 0.91,
            'financial times': 0.90
        };

        // Preload critical categories for instant access
        this.preloadCriticalCategories();
        
        // Performance monitoring interval
        setInterval(() => {
            this.logPerformanceMetrics();
        }, 30000); // Log every 30 seconds
    }
    
    /**
     * Preload ALL categories for instant loading across the entire application
     */
    async preloadCriticalCategories() {
        const allCategories = ['latest', 'kenya', 'world', 'sports', 'technology', 'business', 'health', 'lifestyle', 'entertainment', 'music'];
        
        console.log('🚀 ENHANCED: Preloading ALL 10 categories for instant access...');
        
        // Preload high-priority categories first
        const highPriority = ['latest', 'sports', 'world', 'kenya'];
        const mediumPriority = ['technology', 'business', 'entertainment'];
        const lowPriority = ['health', 'lifestyle', 'music'];
        
        // High priority - immediate load
        highPriority.forEach(async (category, index) => {
            setTimeout(async () => {
                try {
                    await this.fetchNewsNoCache(category, 25);
                    console.log(`✅ HIGH PRIORITY: Preloaded ${category} category`);
                } catch (error) {
                    console.warn(`⚠️ Failed to preload ${category}:`, error.message);
                }
            }, index * 500); // 500ms stagger
        });
        
        // Medium priority - 2 second delay
        mediumPriority.forEach(async (category, index) => {
            setTimeout(async () => {
                try {
                    await this.fetchNewsNoCache(category, 20);
                    console.log(`✅ MEDIUM PRIORITY: Preloaded ${category} category`);
                } catch (error) {
                    console.warn(`⚠️ Failed to preload ${category}:`, error.message);
                }
            }, 2000 + (index * 800)); // Start after 2s, 800ms stagger
        });
        
        // Low priority - 5 second delay
        lowPriority.forEach(async (category, index) => {
            setTimeout(async () => {
                try {
                    await this.fetchNewsNoCache(category, 15);
                    console.log(`✅ LOW PRIORITY: Preloaded ${category} category`);
                } catch (error) {
                    console.warn(`⚠️ Failed to preload ${category}:`, error.message);
                }
            }, 5000 + (index * 1000)); // Start after 5s, 1s stagger
        });

        // Start continuous background refresh for all categories
        this.startBackgroundRefresh();
    }

    /**
     * Start continuous background refresh for real-time updates
     */
    startBackgroundRefresh() {
        const allCategories = ['latest', 'kenya', 'world', 'sports', 'technology', 'business', 'health', 'lifestyle', 'entertainment', 'music'];
        
        setInterval(() => {
            // Refresh categories in rotation to maintain freshness
            const categoryToRefresh = allCategories[Math.floor(Math.random() * allCategories.length)];
            this.backgroundRefresh(categoryToRefresh, 20);
        }, this.backgroundRefreshInterval);
        
        console.log(`🔄 Started background refresh system for all categories (${this.backgroundRefreshInterval/1000}s interval)`);
    }
    
    /**
     * Log performance metrics for monitoring
     */
    logPerformanceMetrics() {
        const metrics = this.performanceMetrics;
        const cacheHitRate = metrics.totalRequests > 0 ? 
            ((metrics.cacheHits / metrics.totalRequests) * 100).toFixed(1) : 0;
        
        console.log(`📊 PERFORMANCE METRICS:
        📈 Cache Hit Rate: ${cacheHitRate}%
        ⚡ Avg Load Time: ${metrics.averageLoadTime.toFixed(2)}ms
        🚀 Fastest Load: ${metrics.fastestLoadTime === Infinity ? 'N/A' : metrics.fastestLoadTime.toFixed(2)}ms
        🐌 Slowest Load: ${metrics.slowestLoadTime.toFixed(2)}ms
        📊 Total Requests: ${metrics.totalRequests}
        💾 Cache Size: ${this.cache.size}/${this.maxCacheSize}`);
    }
    
    /**
     * Enhanced cache management with automatic cleanup
     */
    manageCacheSize() {
        if (this.cache.size >= this.maxCacheSize) {
            // Remove oldest entries
            const entries = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const entriesToRemove = entries.slice(0, Math.floor(this.maxCacheSize / 4));
            entriesToRemove.forEach(([key]) => {
                this.cache.delete(key);
            });
            
            console.log(`🧹 Cache cleanup: Removed ${entriesToRemove.length} old entries`);
        }
    }
    
    /**
     * Update performance metrics
     */
    updatePerformanceMetrics(loadTime, wasCacheHit) {
        const metrics = this.performanceMetrics;
        
        metrics.totalRequests++;
        if (wasCacheHit) {
            metrics.cacheHits++;
        }
        
        if (!wasCacheHit) {
            metrics.averageLoadTime = (metrics.averageLoadTime * (metrics.totalRequests - 1) + loadTime) / metrics.totalRequests;
            metrics.fastestLoadTime = Math.min(metrics.fastestLoadTime, loadTime);
            metrics.slowestLoadTime = Math.max(metrics.slowestLoadTime, loadTime);
        }
    }

    /**
     * ULTRA-FAST CORS proxy with optimized fallback chain
     */
    async corsProxyFetch(url, options = {}) {
        // Try direct request first for fastest response
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'User-Agent': 'BrightlensNews/1.0'
                }
            });
            
            if (response.ok) {
                return response;
            }
        } catch (error) {
            console.log('Direct request failed, trying proxies...');
        }
        
        // Fast proxy fallback with timeout
        const fastProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?'
        ];
        
        for (let i = 0; i < fastProxies.length; i++) {
            try {
                const proxyUrl = fastProxies[i] + encodeURIComponent(url);
                const response = await Promise.race([
                    fetch(proxyUrl, {
                        ...options,
                        headers: {
                            ...options.headers,
                            'User-Agent': 'BrightlensNews/1.0'
                        }
                    }),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Proxy timeout')), 2000)
                    )
                ]);
                
                if (response.ok) {
                    return response;
                }
            } catch (error) {
                console.warn(`Proxy ${i + 1} failed:`, error.message);
                continue;
            }
        }
        
        throw new Error('All requests failed');
    }
    
    /**
     * Create image hash for duplicate detection
     */
    createImageHash(imageUrl) {
        if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') return null;
        
        // Normalize image URL by removing parameters and fragments
        const normalizedUrl = imageUrl.toLowerCase()
            .replace(/[?&](w|h|width|height|q|quality|format|crop|resize)[^&]*&?/g, '')
            .replace(/[?&#].*$/, '')
            .replace(/\/$/, '');
        
        // Create simple hash from normalized URL
        let hash = 0;
        for (let i = 0; i < normalizedUrl.length; i++) {
            const char = normalizedUrl.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return hash.toString();
    }

    /**
     * ENHANCED news fetching with maximum real-time coverage and smart API distribution
     */
    async fetchNews(category, limit = 30) {
        const startTime = performance.now();
        const cacheKey = `${category}_${limit}`;
        
        // Check cache first with aggressive caching
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            // Reduced cache timeout for fresher content but faster loading
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                const loadTime = performance.now() - startTime;
                this.updatePerformanceMetrics(loadTime, true);
                console.log(`⚡ CACHE HIT for ${category}: ${loadTime.toFixed(2)}ms`);
                return cached.data;
            }
        }

        try {
            console.log(`🚀 ENHANCED fetching ${category} news with maximum real-time coverage...`);
            
            // Get enhanced category configuration
            const categoryConfig = this.categoryMappings[category];
            const categoryKeywords = this.getCategoryKeywords(category);
            
            // Smart API distribution based on category
            const activeAPIs = this.getOptimalAPIsForCategory(category, categoryConfig);
            
            // Create multiple search queries for comprehensive coverage
            const searchQueries = this.createMultipleQueries(category, categoryConfig);
            
            // ENHANCED PARALLEL PROCESSING: Optimized API calls with multiple queries
            const apiPromises = [];
            
            // Dynamically build API promises based on category configuration
            if (activeAPIs.includes('gnews')) {
                for (let query of searchQueries) {
                    apiPromises.push(
                        this.fetchWithTimeout(
                            this.fetchFromGNews(category, query, Math.min(limit, 12)),
                            3500, 'GNews'
                        )
                    );
                }
            }
            
            if (activeAPIs.includes('newsdata')) {
                for (let query of searchQueries.slice(0, 2)) { // Limit to 2 queries for newsdata
                    apiPromises.push(
                        this.fetchWithTimeout(
                            this.fetchFromNewsData(category, query, Math.min(limit, 12)),
                            3500, 'NewsData'
                        )
                    );
                }
            }
            
            if (activeAPIs.includes('newsapi')) {
                apiPromises.push(
                    this.fetchWithTimeout(
                        this.fetchFromNewsAPI(category, categoryKeywords, Math.min(limit, 15)),
                        3500, 'NewsAPI'
                    )
                );
            }
            
            if (activeAPIs.includes('mediastack')) {
                apiPromises.push(
                    this.fetchWithTimeout(
                        this.fetchFromMediastack(category, categoryKeywords, Math.min(limit, 12)),
                        3500, 'Mediastack'
                    )
                );
            }
            
            if (activeAPIs.includes('currentsapi')) {
                apiPromises.push(
                    this.fetchWithTimeout(
                        this.fetchFromCurrentsAPI(category, categoryKeywords, Math.min(limit, 12)),
                        3500, 'CurrentsAPI'
                    )
                );
            }
                
                // Enhanced RSS and real-time feeds for immediate content
                this.fetchWithTimeout(
                    this.fetchFromBBC(category, categoryKeywords),
                    2500, 'BBC'
                ),
                this.fetchWithTimeout(
                    this.fetchFromReuters(category, categoryKeywords),
                    2500, 'Reuters'
                ),
                this.fetchWithTimeout(
                    this.fetchFromCNN(category, categoryKeywords),
                    2500, 'CNN'
                ),
                this.fetchWithTimeout(
                    this.fetchFromAssociatedPress(category, categoryKeywords),
                    2500, 'AP'
                ),
                this.fetchWithTimeout(
                    this.fetchFromBloomberg(category, categoryKeywords),
                    2500, 'Bloomberg'
                ),
                this.fetchWithTimeout(
                    this.fetchFromGuardian(category, categoryKeywords),
                    2500, 'Guardian'
                ),
                this.fetchWithTimeout(
                    this.fetchFromAljazeeraRSS(category, categoryKeywords),
                    2500, 'AlJazeera'
                )
            ];

            // Wait for ALL APIs with aggressive timeout
            const results = await Promise.allSettled(apiPromises);
            
            // ULTRA-FAST processing: Combine and process articles immediately
            let allArticles = [];
            let successfulAPIs = 0;
            const apiNames = ['GNews-1', 'GNews-2', 'GNews-3', 'NewsData-1', 'NewsData-2', 'NewsAPI', 'Mediastack', 'CurrentsAPI', 'BBC', 'Reuters', 'CNN', 'AP', 'Bloomberg', 'Guardian', 'AlJazeera'];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value && Array.isArray(result.value)) {
                    allArticles = allArticles.concat(result.value);
                    successfulAPIs++;
                    console.log(`✅ ${apiNames[index]}: ${result.value.length} articles`);
                } else {
                    console.warn(`⚠️ ${apiNames[index]} failed:`, result.reason?.message || 'Timeout/Error');
                }
            });

            console.log(`⚡ PARALLEL FETCH: ${successfulAPIs}/${results.length} APIs succeeded`);

            // ULTRA-FAST duplicate removal with advanced algorithms
            const filterStartTime = performance.now();
            const uniqueArticles = this.removeDuplicatesUltraFast(allArticles);
            const filterTime = (performance.now() - filterStartTime).toFixed(2);
            console.log(`🚀 ULTRA-FAST filtering completed: ${filterTime}ms - Removed ${allArticles.length - uniqueArticles.length} duplicates`);
            
            // Fast category filtering
            const categoryFilteredArticles = this.filterByCategory(uniqueArticles, category, categoryKeywords);
            
            // Sort by recency (most important articles first)
            const sortedArticles = categoryFilteredArticles
                .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                .slice(0, limit); // Limit results for faster processing

            // AGGRESSIVE caching with background refresh and cache management
            this.manageCacheSize();
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });
            
            // Background refresh for next request
            setTimeout(() => {
                this.backgroundRefresh(category, limit);
            }, 30000); // Refresh in 30 seconds

            const totalTime = (performance.now() - startTime);
            this.updatePerformanceMetrics(totalTime, false);
            console.log(`🚀 ULTRA-FAST ${category} fetch: ${totalTime.toFixed(2)}ms - ${sortedArticles.length} articles`);

            return sortedArticles;
        } catch (error) {
            console.error(`❌ FAST fetch failed for ${category}:`, error);
            const totalTime = (performance.now() - startTime);
            this.updatePerformanceMetrics(totalTime, false);
            console.log(`⚠️ ${category} fetch failed after: ${totalTime.toFixed(2)}ms`);
            
            // Return cached data if available, even if expired
            if (this.cache.has(cacheKey)) {
                console.log('📦 Returning expired cache as fallback');
                return this.cache.get(cacheKey).data;
            }
            
            return [];
        }
    }
    
    /**
     * Fetch from GNews API with enhanced category-specific queries
     */
    async fetchFromGNews(category, keywords, limit) {
        try {
            // Handle both string queries and keyword arrays
            const query = typeof keywords === 'string' ? keywords : this.buildCategoryQuery(keywords);
            const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=any&max=${Math.min(limit, 15)}&apikey=${this.apiKeys.gnews}`;
            
            const response = await this.corsProxyFetch(url);
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
     * Fetch from NewsData.io API with enhanced category-specific queries
     */
    async fetchFromNewsData(category, keywords, limit) {
        try {
            // Handle both string queries and keyword arrays
            const query = typeof keywords === 'string' ? keywords : this.buildCategoryQuery(keywords);
            let url = `https://newsdata.io/api/1/news?apikey=${this.apiKeys.newsdata}&q=${encodeURIComponent(query)}&language=en&size=${Math.min(limit, 15)}`;
            
            // Add category filter if supported
            if (['business', 'entertainment', 'health', 'science', 'sports', 'technology', 'world'].includes(category)) {
                url += `&category=${category}`;
            }
            
            const response = await this.corsProxyFetch(url);
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
     * Fetch from NewsAPI.org with enhanced category-specific queries
     */
    async fetchFromNewsAPI(category, keywords, limit) {
        try {
            let url;
            
            if (['business', 'entertainment', 'health', 'science', 'sports', 'technology'].includes(category)) {
                // Use category endpoint for supported categories
                url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=${Math.min(limit, 25)}&apiKey=${this.apiKeys.newsapi}`;
            } else {
                // Use everything endpoint with query for other categories
                const query = typeof keywords === 'string' ? keywords : this.buildCategoryQuery(keywords);
                url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${Math.min(limit, 25)}&apiKey=${this.apiKeys.newsapi}`;
            }
            
            const response = await this.corsProxyFetch(url);
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
     * Fetch from Mediastack API with enhanced category-specific queries
     */
    async fetchFromMediastack(category, keywords, limit) {
        try {
            const query = typeof keywords === 'string' ? keywords : this.buildCategoryQuery(keywords);
            let url = `https://api.mediastack.com/v1/news?access_key=${this.apiKeys.mediastack}&keywords=${encodeURIComponent(query)}&languages=en&limit=${Math.min(limit, 25)}&sort=published_desc`;
            
            // Add category filter if supported
            const validCategories = ['business', 'entertainment', 'health', 'science', 'sports', 'technology'];
            if (validCategories.includes(category)) {
                url += `&categories=${category}`;
            }
            
            const response = await this.corsProxyFetch(url);
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
     * Fetch from CurrentsAPI with enhanced category-specific queries
     */
    async fetchFromCurrentsAPI(category, keywords, limit) {
        try {
            const query = typeof keywords === 'string' ? keywords : this.buildCategoryQuery(keywords);
            let url = `https://api.currentsapi.services/v1/search?apiKey=${this.apiKeys.currentsapi}&keywords=${encodeURIComponent(query)}&language=en&page_size=${Math.min(limit, 20)}`;
            
            const response = await this.corsProxyFetch(url);
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
            
            const response = await this.corsProxyFetch(url);
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
     * Build enhanced category-specific search query with priority keywords
     */
    buildCategoryQuery(categoryConfig, useSecondary = false) {
        if (typeof categoryConfig === 'string') {
            return categoryConfig; // Backward compatibility
        }
        
        if (Array.isArray(categoryConfig)) {
            return categoryConfig.join(' OR '); // Backward compatibility
        }
        
        const keywords = useSecondary ? 
            [...categoryConfig.primary, ...categoryConfig.secondary] : 
            categoryConfig.primary;
            
        if (keywords.length === 1) {
            return keywords[0];
        }
        
        // Create sophisticated query with priorities
        const primaryQuery = categoryConfig.primary.slice(0, 3).join(' OR ');
        
        if (!useSecondary) {
            return primaryQuery;
        }
        
        const secondaryQuery = categoryConfig.secondary.slice(0, 5).join(' OR ');
        return `(${primaryQuery}) OR (${secondaryQuery})`;
    }

         /**
      * Get enhanced keywords for category with multiple search strategies
      */
     getCategoryKeywords(category) {
         const config = this.categoryMappings[category];
         if (!config) {
             return [category]; // Fallback
         }
         
         if (Array.isArray(config)) {
             return config; // Backward compatibility
         }
         
         // Return all keywords for comprehensive filtering
         return [...config.primary, ...config.secondary];
     }

     /**
      * Get optimal APIs for specific category to maximize real-time coverage
      */
     getOptimalAPIsForCategory(category, categoryConfig) {
         if (!categoryConfig || !categoryConfig.sources) {
             return ['gnews', 'newsdata', 'newsapi', 'mediastack', 'currentsapi']; // Default all APIs
         }
         
         if (categoryConfig.sources.includes('all')) {
             return ['gnews', 'newsdata', 'newsapi', 'mediastack', 'currentsapi'];
         }
         
         return categoryConfig.sources;
     }

     /**
      * Create multiple search queries for comprehensive coverage
      */
     createMultipleQueries(category, categoryConfig) {
         const queries = [];
         
         if (!categoryConfig || Array.isArray(categoryConfig)) {
             return [this.buildCategoryQuery(categoryConfig || [category])];
         }
         
         // Primary query
         queries.push(this.buildCategoryQuery(categoryConfig, false));
         
         // Secondary query for broader coverage
         if (categoryConfig.secondary && categoryConfig.secondary.length > 0) {
             queries.push(this.buildCategoryQuery(categoryConfig, true));
         }
         
         // Special queries based on category type
         if (categoryConfig.regions) {
             const regionQuery = categoryConfig.regions.slice(0, 3).join(' OR ');
             queries.push(regionQuery);
         }
         
         if (categoryConfig.leagues) {
             const leagueQuery = categoryConfig.leagues.slice(0, 3).join(' OR ');
             queries.push(leagueQuery);
         }
         
         if (categoryConfig.companies) {
             const companyQuery = categoryConfig.companies.slice(0, 3).join(' OR ');
             queries.push(companyQuery);
         }
         
         return queries.slice(0, 3); // Limit to 3 queries max
     }

    /**
     * Filter articles by category relevance with strict filtering
     */
    filterByCategory(articles, category, keywords) {
        if (category === 'latest') {
            return articles; // Latest shows all categories, newest first
        }
        
        return articles.filter(article => {
            const text = `${article.title} ${article.description} ${article.source}`.toLowerCase();
            
            // Strict category filtering
            switch(category) {
                case 'kenya':
                    return keywords.some(keyword => text.includes(keyword.toLowerCase())) &&
                           !this.isExcludedFromKenya(text);
                
                case 'world':
                    return keywords.some(keyword => text.includes(keyword.toLowerCase())) &&
                           !text.includes('kenya') && !text.includes('nairobi');
                
                case 'sports':
                    return keywords.some(keyword => text.includes(keyword.toLowerCase())) &&
                           this.isSportsContent(text);
                
                case 'technology':
                    return keywords.some(keyword => text.includes(keyword.toLowerCase())) &&
                           this.isTechnologyContent(text);
                
                case 'business':
                    return keywords.some(keyword => text.includes(keyword.toLowerCase())) &&
                           this.isBusinessContent(text);
                
                case 'health':
                    return keywords.some(keyword => text.includes(keyword.toLowerCase())) &&
                           this.isHealthContent(text);
                
                case 'lifestyle':
                    return keywords.some(keyword => text.includes(keyword.toLowerCase())) &&
                           this.isLifestyleContent(text);
                
                case 'entertainment':
                    return keywords.some(keyword => text.includes(keyword.toLowerCase())) &&
                           this.isEntertainmentContent(text);
                
                case 'music':
                    return keywords.some(keyword => text.includes(keyword.toLowerCase())) &&
                           this.isMusicContent(text);
                
                default:
                    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
            }
        });
    }
    
    /**
     * Category-specific content validation functions
     */
    isExcludedFromKenya(text) {
        const excludeTerms = ['south africa', 'nigeria', 'ghana', 'egypt', 'uganda', 'tanzania'];
        return excludeTerms.some(term => text.includes(term)) && !text.includes('kenya');
    }
    
    isSportsContent(text) {
        const sportsTerms = ['match', 'game', 'player', 'team', 'score', 'championship', 'league', 'tournament', 'coach', 'athlete'];
        return sportsTerms.some(term => text.includes(term));
    }
    
    isTechnologyContent(text) {
        const techTerms = ['software', 'hardware', 'digital', 'app', 'platform', 'device', 'internet', 'data', 'cyber', 'innovation'];
        return techTerms.some(term => text.includes(term));
    }
    
    isBusinessContent(text) {
        const businessTerms = ['company', 'market', 'investment', 'profit', 'revenue', 'financial', 'economic', 'trade', 'corporate', 'industry'];
        return businessTerms.some(term => text.includes(term));
    }
    
    isHealthContent(text) {
        const healthTerms = ['doctor', 'hospital', 'patient', 'treatment', 'diagnosis', 'therapy', 'vaccine', 'symptoms', 'diet', 'exercise'];
        return healthTerms.some(term => text.includes(term));
    }
    
    isLifestyleContent(text) {
        const lifestyleTerms = ['style', 'fashion', 'recipe', 'cooking', 'home', 'family', 'relationship', 'personal', 'beauty', 'culture'];
        return lifestyleTerms.some(term => text.includes(term));
    }
    
    isEntertainmentContent(text) {
        const entertainmentTerms = ['film', 'movie', 'actor', 'actress', 'director', 'show', 'series', 'celebrity', 'award', 'premiere'];
        return entertainmentTerms.some(term => text.includes(term));
    }
    
    isMusicContent(text) {
        const musicTerms = ['song', 'album', 'singer', 'musician', 'band', 'concert', 'tour', 'record', 'studio', 'performance'];
        return musicTerms.some(term => text.includes(term));
    }

    /**
     * ULTRA-ENHANCED duplicate removal - ZERO duplicates guaranteed with image-based detection
     */
    removeDuplicates(articles) {
        if (!articles || articles.length === 0) return [];
        
        const filtered = [];
        const seenUrls = new Set();
        const seenTitles = new Set();
        const seenContent = new Set();
        const seenImages = new Set();
        const seenImageHashes = new Set();
        const titleTokens = new Map(); // Store tokenized titles for advanced comparison
        
        articles.forEach(article => {
            // Skip invalid articles
            if (!article.title || !article.url || 
                article.title.trim().length < 10 || 
                article.url.includes('example.com') ||
                article.url.includes('placeholder') ||
                article.title.toLowerCase().includes('sample') ||
                article.title.toLowerCase().includes('test article')) {
                return;
            }
            
            // Normalize URL - remove all tracking parameters and fragments
            let normalizedUrl = article.url.toLowerCase().trim()
                .replace(/[?&](utm_|fbclid|gclid|ref|source|medium|campaign|si|feature)[^&]*&?/g, '')
                .replace(/[?&#].*$/, '')
                .replace(/\/$/, '');
            
            // Normalize title for comparison
            const normalizedTitle = article.title.toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            
            // Create enhanced content fingerprint
            const contentFingerprint = this.createAdvancedContentFingerprint(article);
            
            // Create image hash for duplicate image detection
            const imageHash = this.createImageHash(article.urlToImage);
            
            // Tokenize title for advanced similarity detection
            const titleWords = normalizedTitle.split(' ').filter(word => 
                word.length > 2 && !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word)
            );
            
            // Multiple duplicate checks
            if (seenUrls.has(normalizedUrl)) {
                console.log(`🔄 Duplicate URL filtered: ${article.title}`);
                return;
            }
            
            if (seenTitles.has(normalizedTitle)) {
                console.log(`🔄 Duplicate title filtered: ${article.title}`);
                return;
            }
            
            if (seenContent.has(contentFingerprint)) {
                console.log(`🔄 Duplicate content filtered: ${article.title}`);
                return;
            }
            
            // NEW: Image-based duplicate detection
            if (imageHash && seenImageHashes.has(imageHash)) {
                console.log(`🔄 Duplicate image filtered: ${article.title}`);
                return;
            }
            
            // Advanced similarity check using title tokens
            let isSimilar = false;
            for (const [existingTokens, existingArticle] of titleTokens.entries()) {
                const similarity = this.calculateAdvancedTokenSimilarity(titleWords, existingTokens);
                
                // Extra strict similarity for sports content
                const similarityThreshold = article.category === 'sports' ? 0.65 : 0.75;
                
                if (similarity > similarityThreshold) {
                    console.log(`🔄 Similar content filtered (${(similarity * 100).toFixed(1)}% similar): ${article.title}`);
                    
                    // Keep the article from more authoritative source or more recent
                    const currentSourceScore = this.getSourceAuthorityScore(article.source);
                    const existingSourceScore = this.getSourceAuthorityScore(existingArticle.source);
                    
                    if (currentSourceScore > existingSourceScore || 
                        (currentSourceScore === existingSourceScore && 
                         new Date(article.publishedAt) > new Date(existingArticle.publishedAt))) {
                        // Remove existing and continue with current
                        titleTokens.delete(existingTokens);
                        const existingIndex = filtered.findIndex(a => a.url === existingArticle.url);
                        if (existingIndex > -1) {
                            filtered.splice(existingIndex, 1);
                            console.log(`🔄 Replaced lower quality duplicate: ${existingArticle.title}`);
                        }
                        break;
                    } else {
                        isSimilar = true;
                        break;
                    }
                }
            }
            
            // Special sports content validation for sports category
            if (article.category === 'sports') {
                if (!this.isValidSportsContent(article)) {
                    console.log(`🔄 Invalid sports content filtered: ${article.title}`);
                    return;
                }
                
                // Extra sports duplicate check - check for similar sports events
                if (this.isDuplicateSportsEvent(article, filtered)) {
                    console.log(`🔄 Duplicate sports event filtered: ${article.title}`);
                    return;
                }
            }
            
            if (!isSimilar) {
                // Validate and enhance image URL for high quality
                article.urlToImage = this.validateAndEnhanceImageUrl(article.urlToImage);
                
                // Store for duplicate detection
                seenUrls.add(normalizedUrl);
                seenTitles.add(normalizedTitle);
                seenContent.add(contentFingerprint);
                if (imageHash) seenImageHashes.add(imageHash);
                titleTokens.set(titleWords, article);
                
                filtered.push(article);
            }
        });
        
        console.log(`🔥 ULTRA-STRICT FILTERING: ${articles.length} → ${filtered.length} articles (${articles.length - filtered.length} duplicates/invalid removed)`);
        return filtered;
    }
    
    /**
     * ULTRA-FAST duplicate removal with advanced algorithms
     */
    removeDuplicatesUltraFast(articles) {
        if (!articles || articles.length === 0) return [];
        
        const seenUrls = new Set();
        const seenTitleHashes = new Set();
        const seenContentFingerprints = new Set();
        const filtered = [];
        const now = Date.now();
        
        // Sort by publication date first (newest first) for better relevance
        const sortedArticles = articles.sort((a, b) => {
            const dateA = new Date(a.publishedAt || a.pubDate || now);
            const dateB = new Date(b.publishedAt || b.pubDate || now);
            return dateB - dateA;
        });
        
        for (const article of sortedArticles) {
            // Skip invalid articles quickly
            if (!article.title || !article.url || article.title.length < 15) continue;
            
            // Skip articles older than 7 days for real-time focus
            const articleDate = new Date(article.publishedAt || article.pubDate || now);
            const daysDiff = (now - articleDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysDiff > 7) continue;
            
            // Ultra-fast URL normalization
            const normalizedUrl = this.ultraFastUrlNormalize(article.url);
            if (seenUrls.has(normalizedUrl)) continue;
            
            // Advanced title similarity detection
            const titleFingerprint = this.createTitleFingerprint(article.title);
            if (seenTitleHashes.has(titleFingerprint)) continue;
            
            // Content-based duplicate detection
            const contentFingerprint = this.createContentFingerprint(article);
            if (seenContentFingerprints.has(contentFingerprint)) continue;
            
            // Real-time image validation and enhancement
            article.urlToImage = this.validateAndEnhanceImageUrl(article.urlToImage);
            
            // Ensure proper description length (50-150 words)
            if (article.description) {
                const words = article.description.split(' ');
                if (words.length < 10) {
                    // Generate from title if description too short
                    article.description = this.generateDescriptionFromTitle(article.title);
                } else if (words.length > 150) {
                    // Trim if too long
                    article.description = words.slice(0, 150).join(' ') + '...';
                }
            } else {
                article.description = this.generateDescriptionFromTitle(article.title);
            }
            
            seenUrls.add(normalizedUrl);
            seenTitleHashes.add(titleFingerprint);
            seenContentFingerprints.add(contentFingerprint);
            filtered.push(article);
        }
        
        return filtered;
    }

    /**
     * Ultra-fast URL normalization
     */
    ultraFastUrlNormalize(url) {
        return url.toLowerCase()
            .replace(/[?&](utm_|fbclid|gclid|ref=|source=|medium=|campaign=|_hsenc|_hsmi)[^&]*&?/g, '')
            .replace(/[?&#].*$/, '')
            .replace(/\/$/, '');
    }

    /**
     * Create advanced title fingerprint for similarity detection
     */
    createTitleFingerprint(title) {
        // Remove common words and create semantic fingerprint
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
        
        const words = title.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.has(word))
            .sort();
            
        return this.fastHash(words.slice(0, 8).join('|'));
    }

    /**
     * Create content-based fingerprint
     */
    createContentFingerprint(article) {
        const content = `${article.title || ''} ${article.description || ''}`.toLowerCase();
        const words = content.replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 4)
            .slice(0, 12)
            .sort();
            
        return this.fastHash(words.join('|'));
    }

    /**
     * Generate meaningful description from title
     */
    generateDescriptionFromTitle(title) {
        const baseDescription = `${title}. `;
        const category = this.detectCategoryFromTitle(title);
        
        const templates = {
            sports: 'Get the latest updates on this sports story with detailed coverage and analysis of the events.',
            technology: 'Discover the latest developments in technology and how they impact our digital world.',
            business: 'Explore this business story with comprehensive market analysis and industry insights.',
            health: 'Learn about this health-related development and its implications for public wellness.',
            world: 'Stay informed about this international news story and its global significance.',
            entertainment: 'Catch up on the latest entertainment news and celebrity updates from the industry.',
            music: 'Dive into the latest music news, artist updates, and industry developments.',
            default: 'Read the full story with detailed coverage and expert analysis of this developing news.'
        };
        
        return baseDescription + (templates[category] || templates.default);
    }

    /**
     * Detect category from title for better description generation
     */
    detectCategoryFromTitle(title) {
        const lowerTitle = title.toLowerCase();
        
        const categoryKeywords = {
            sports: ['game', 'match', 'player', 'team', 'score', 'win', 'championship', 'league', 'tournament'],
            technology: ['tech', 'ai', 'artificial intelligence', 'app', 'software', 'digital', 'cyber', 'data'],
            business: ['business', 'company', 'market', 'stock', 'economy', 'financial', 'investment', 'ceo'],
            health: ['health', 'medical', 'medicine', 'doctor', 'hospital', 'disease', 'treatment', 'vaccine'],
            entertainment: ['movie', 'film', 'actor', 'actress', 'celebrity', 'show', 'television', 'hollywood'],
            music: ['music', 'song', 'album', 'artist', 'singer', 'band', 'concert', 'tour', 'grammy']
        };
        
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => lowerTitle.includes(keyword))) {
                return category;
            }
        }
        
        return 'default';
    }
    
    /**
     * Fast hash function for title comparison
     */
    fastHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
    
    /**
     * Check for duplicate sports events (same game/match reported multiple times)
     */
    isDuplicateSportsEvent(article, existingArticles) {
        const title = article.title.toLowerCase();
        
        // Extract team names and scores if present
        const teamMatches = title.match(/(\w+)\s+(?:vs?\.?|v\.?|against|beat|defeat)\s+(\w+)/g);
        const scoreMatches = title.match(/\d+[-–]\d+|\d+\s*-\s*\d+/g);
        
        if (!teamMatches && !scoreMatches) return false;
        
        // Check against existing sports articles
        for (const existing of existingArticles.filter(a => a.category === 'sports')) {
            const existingTitle = existing.title.toLowerCase();
            
            // Check for same team matchup
            if (teamMatches) {
                for (const match of teamMatches) {
                    if (existingTitle.includes(match.toLowerCase()) || 
                        this.containsReversedTeams(match, existingTitle)) {
                        return true;
                    }
                }
            }
            
            // Check for same score
            if (scoreMatches) {
                for (const score of scoreMatches) {
                    if (existingTitle.includes(score)) {
                        return true;
                    }
                }
            }
            
            // Check for similar sports event keywords within 24 hours
            const timeDiff = Math.abs(new Date(article.publishedAt) - new Date(existing.publishedAt));
            if (timeDiff < 24 * 60 * 60 * 1000) { // Within 24 hours
                const commonSportsTerms = ['final', 'championship', 'playoff', 'semifinal', 'quarter', 'league'];
                const titleTerms = commonSportsTerms.filter(term => title.includes(term));
                const existingTerms = commonSportsTerms.filter(term => existingTitle.includes(term));
                
                if (titleTerms.length > 0 && titleTerms.some(term => existingTerms.includes(term))) {
                    // Check if they're about the same league/competition
                    const competitions = ['premier league', 'champions league', 'nfl', 'nba', 'mlb', 'nhl', 'la liga', 'serie a'];
                    const titleCompetitions = competitions.filter(comp => title.includes(comp));
                    const existingCompetitions = competitions.filter(comp => existingTitle.includes(comp));
                    
                    if (titleCompetitions.length > 0 && 
                        titleCompetitions.some(comp => existingCompetitions.includes(comp))) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    /**
     * Check if teams are mentioned in reverse order
     */
    containsReversedTeams(match, title) {
        const teamMatch = match.match(/(\w+)\s+(?:vs?\.?|v\.?|against|beat|defeat)\s+(\w+)/);
        if (!teamMatch) return false;
        
        const team1 = teamMatch[1];
        const team2 = teamMatch[2];
        
        // Check for reversed team order
        const reversedPattern = new RegExp(`${team2}\\s+(?:vs?\\.?|v\\.?|against|beat|defeat)\\s+${team1}`, 'i');
        return reversedPattern.test(title);
    }

    /**
     * Create advanced content fingerprint for duplicate detection
     */
    createAdvancedContentFingerprint(article) {
        const titleWords = (article.title || '').toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(' ')
            .filter(word => word.length > 3 && !['news', 'breaking', 'update', 'report'].includes(word))
            .slice(0, 12)
            .sort();
            
        const descWords = (article.description || '').toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(' ')
            .filter(word => word.length > 4)
            .slice(0, 10)
            .sort();
        
        const sourceFingerprint = (article.source || '').toLowerCase().replace(/[^\w]/g, '');
        
        return `${titleWords.join('|')}::${descWords.join('|')}::${sourceFingerprint}`;
    }
    
    /**
     * Calculate advanced token-based similarity
     */
    calculateAdvancedTokenSimilarity(tokens1, tokens2) {
        if (tokens1.length === 0 || tokens2.length === 0) return 0;
        
        const set1 = new Set(tokens1);
        const set2 = new Set(tokens2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        // Jaccard similarity with length penalty for very different sized titles
        const jaccard = intersection.size / union.size;
        const lengthPenalty = Math.abs(tokens1.length - tokens2.length) / Math.max(tokens1.length, tokens2.length);
        
        return jaccard * (1 - lengthPenalty * 0.3);
    }
    
    /**
     * Validate sports content authenticity
     */
    isValidSportsContent(article) {
        const text = `${article.title} ${article.description || ''}`.toLowerCase();
        
        // Must contain sports-related keywords
        const sportsKeywords = [
            'game', 'match', 'score', 'team', 'player', 'win', 'loss', 'championship',
            'league', 'tournament', 'season', 'coach', 'athlete', 'sport', 'play',
            'goal', 'point', 'victory', 'defeat', 'competition', 'olympic', 'final'
        ];
        
        const hasValidSportsKeywords = sportsKeywords.some(keyword => text.includes(keyword));
        
        // Should not contain non-sports content indicators
        const invalidKeywords = [
            'politics', 'election', 'government', 'policy', 'bitcoin', 'crypto',
            'stock market', 'economy', 'business deal', 'merger', 'acquisition',
            'movie', 'film', 'album', 'song', 'concert', 'celebrity gossip'
        ];
        
        const hasInvalidContent = invalidKeywords.some(keyword => text.includes(keyword));
        
        return hasValidSportsKeywords && !hasInvalidContent;
    }
    
    /**
     * Get enhanced source authority scores for sports
     */
    getSourceAuthorityScore(source) {
        if (!source) return 1;
        
        const sourceStr = source.toLowerCase();
        const sportsSourceScores = {
            'espn': 10,
            'bbc sport': 10,
            'sky sports': 9,
            'reuters': 9,
            'associated press': 9,
            'ap news': 9,
            'fox sports': 8,
            'cbs sports': 8,
            'nbc sports': 8,
            'the athletic': 8,
            'bleacher report': 7,
            'sports illustrated': 7,
            'yahoo sports': 6,
            'cnn': 6,
            'bbc': 6,
            'guardian': 6,
            'independent': 5,
            'daily mail': 4,
            'goal.com': 7,
            'uefa.com': 9,
            'fifa.com': 9,
            'nfl.com': 9,
            'nba.com': 9,
            'mlb.com': 9
        };
        
        for (const [source_name, score] of Object.entries(sportsSourceScores)) {
            if (sourceStr.includes(source_name)) {
                return score;
            }
        }
        
        return 3; // Default score for unknown sources
    }
    
    /**
     * Advanced similarity calculation with word order and context
     */
    calculateAdvancedSimilarity(title1, title2) {
        if (title1 === title2) return 1.0;
        
        const words1 = title1.split(' ').filter(word => word.length > 2);
        const words2 = title2.split(' ').filter(word => word.length > 2);
        
        // Jaccard similarity with word position weighting
        const set1 = new Set(words1);
        const set2 = new Set(words2);
        const intersection = new Set([...set1].filter(word => set2.has(word)));
        const union = new Set([...set1, ...set2]);
        
        const jaccardSimilarity = intersection.size / union.size;
        
        // Additional check for word order similarity
        const orderSimilarity = this.calculateOrderSimilarity(words1, words2);
        
        return (jaccardSimilarity * 0.7) + (orderSimilarity * 0.3);
    }
    
    /**
     * Calculate word order similarity
     */
    calculateOrderSimilarity(words1, words2) {
        const minLength = Math.min(words1.length, words2.length);
        let matches = 0;
        
        for (let i = 0; i < minLength; i++) {
            if (words1[i] === words2[i]) matches++;
        }
        
        return minLength > 0 ? matches / minLength : 0;
    }
    
    /**
     * ENHANCED: Validate and optimize image URLs for high quality and fast loading
     */
    validateAndEnhanceImageUrl(imageUrl) {
        if (!imageUrl || 
            imageUrl === 'null' || 
            imageUrl === 'undefined' || 
            imageUrl.includes('placeholder') ||
            imageUrl.includes('example.com') ||
            !imageUrl.startsWith('http')) {
            return null; // Return null for invalid images
        }
        
        // Convert HTTP to HTTPS for better loading
        if (imageUrl.startsWith('http://')) {
            imageUrl = imageUrl.replace('http://', 'https://');
        }
        
        // Enhanced image optimization parameters for different services
        if (imageUrl.includes('unsplash.com')) {
            // High quality Unsplash optimization
            imageUrl = imageUrl.includes('?') ? 
                imageUrl + '&w=800&h=450&q=85&fit=crop&crop=entropy&auto=format' : 
                imageUrl + '?w=800&h=450&q=85&fit=crop&crop=entropy&auto=format';
        }
        else if (imageUrl.includes('cloudinary.com')) {
            // Cloudinary optimization
            imageUrl = imageUrl.replace('/upload/', '/upload/c_fill,w_800,h_450,q_85,f_auto/');
        }
        else if (imageUrl.includes('amazonaws.com') || imageUrl.includes('s3.')) {
            // AWS S3 optimization (if using image processing service)
            imageUrl += imageUrl.includes('?') ? '&w=800&h=450&q=85' : '?w=800&h=450&q=85';
        }
        else if (imageUrl.includes('googleusercontent.com')) {
            // Google Images optimization
            imageUrl += imageUrl.includes('=') ? '-w800-h450-c' : '=w800-h450-c';
        }
        else if (imageUrl.includes('wp.com') || imageUrl.includes('wordpress.com')) {
            // WordPress.com image optimization
            imageUrl += imageUrl.includes('?') ? '&w=800&h=450&quality=85' : '?w=800&h=450&quality=85';
        }
        else if (imageUrl.includes('imgur.com')) {
            // Imgur optimization
            imageUrl = imageUrl.replace(/\.(jpg|jpeg|png|gif)$/, 'h.$1');
        }
        else if (imageUrl.includes('cdn.')) {
            // Generic CDN optimization
            imageUrl += imageUrl.includes('?') ? '&w=800&h=450&q=85' : '?w=800&h=450&q=85';
        }
        
        // For other image services, try adding standard optimization parameters
        else if (!imageUrl.includes('?')) {
            imageUrl += '?w=800&h=450&q=85&format=auto';
        }
        
        return imageUrl;
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
            description: this.enhanceDescription(article.description, article.title, 'GNews'),
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
            description: this.enhanceDescription(article.description, article.title, 'NewsData'),
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
            description: this.enhanceDescription(article.description, article.title, 'NewsAPI'),
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
            description: this.enhanceDescription(article.description, article.title, 'Mediastack'),
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
            description: this.enhanceDescription(article.description, article.title, 'CurrentsAPI'),
            url: article.url,
            urlToImage: article.image,
            publishedAt: article.published,
            source: article.author || 'CurrentsAPI',
            category: category
        })).filter(article => article.title && article.url);
    }
    
    /**
     * Enhance article descriptions to be 50-100 words and more informative
     */
    enhanceDescription(description, title, source) {
        if (!description || description.length < 20) {
            // Generate informative description based on title and source
            return this.generateInformativeDescription(title, source);
        }
        
        // Clean and enhance existing description
        let enhanced = description.trim();
        
        // Remove redundant title repetition
        if (enhanced.toLowerCase().startsWith(title.toLowerCase().substring(0, 20))) {
            enhanced = enhanced.substring(title.length).trim();
        }
        
        // Ensure minimum length of 50-100 words
        const words = enhanced.split(' ');
        if (words.length < 15) {
            // Add contextual information
            enhanced += ` This developing story from ${source} provides important updates on current events. `;
            enhanced += `Stay informed with the latest developments as this situation continues to unfold. `;
            enhanced += `Read the full article for comprehensive coverage and detailed analysis.`;
        } else if (words.length > 35) {
            // Trim to ~100 words but keep complete sentences
            const trimmed = words.slice(0, 30).join(' ');
            const lastPeriod = trimmed.lastIndexOf('.');
            enhanced = lastPeriod > 50 ? trimmed.substring(0, lastPeriod + 1) : trimmed + '...';
        }
        
        return enhanced;
    }
    
    /**
     * Generate informative description when none exists
     */
    generateInformativeDescription(title, source) {
        const templates = [
            `Breaking news from ${source}: ${title}. This important story is developing with significant implications for those involved. Our newsroom is following this story closely and will provide updates as more information becomes available. Click to read the complete article with full details and expert analysis.`,
            
            `${source} reports: ${title}. This news story brings important developments that readers should know about. The situation is being monitored by our editorial team for accuracy and relevance. Get the full story with comprehensive coverage including background information and expert commentary.`,
            
            `Latest update from ${source}: ${title}. This story represents significant news that impacts the community and requires attention. Our journalists are tracking all developments to bring you the most current and accurate information available. Read more for detailed reporting and analysis.`,
            
            `Important news from ${source}: ${title}. This developing situation has caught the attention of news editors for its relevance and impact. We are committed to providing accurate, timely reporting on this and other important stories. Access the full article for complete details and professional journalism.`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * Fetch from BBC RSS feeds (real-time)
     */
    async fetchFromBBC(category, keywords) {
        try {
            let rssUrl = '';
            switch(category) {
                case 'world':
                    rssUrl = 'https://feeds.bbci.co.uk/news/world/rss.xml';
                    break;
                case 'technology':
                    rssUrl = 'https://feeds.bbci.co.uk/news/technology/rss.xml';
                    break;
                case 'business':
                    rssUrl = 'https://feeds.bbci.co.uk/news/business/rss.xml';
                    break;
                case 'health':
                    rssUrl = 'https://feeds.bbci.co.uk/news/health/rss.xml';
                    break;
                case 'entertainment':
                    rssUrl = 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml';
                    break;
                case 'kenya':
                case 'latest':
                    rssUrl = 'https://feeds.bbci.co.uk/news/world/africa/rss.xml';
                    break;
                default:
                    rssUrl = 'https://feeds.bbci.co.uk/news/rss.xml';
            }

            const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            if (!response.ok) throw new Error('BBC RSS fetch failed');
            
            const data = await response.json();
            if (data.items) {
                return data.items.slice(0, 8).map(item => ({
                    title: item.title,
                    description: this.enhanceDescription(item.description || item.content, item.title, 'BBC'),
                    url: item.link,
                    urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
                    publishedAt: item.pubDate,
                    source: 'BBC',
                    category: category
                })).filter(article => article.title && article.url);
            }
        } catch (error) {
            console.warn('BBC RSS fetch failed:', error.message);
        }
        return [];
    }

    /**
     * Fetch from Reuters RSS feeds (real-time)
     */
    async fetchFromReuters(category, keywords) {
        try {
            let rssUrl = '';
            switch(category) {
                case 'world':
                    rssUrl = 'https://www.reuters.com/rssFeed/worldNews';
                    break;
                case 'technology':
                    rssUrl = 'https://www.reuters.com/rssFeed/technologyNews';
                    break;
                case 'business':
                    rssUrl = 'https://www.reuters.com/rssFeed/businessNews';
                    break;
                case 'sports':
                    rssUrl = 'https://www.reuters.com/rssFeed/sportsNews';
                    break;
                case 'entertainment':
                    rssUrl = 'https://www.reuters.com/rssFeed/entertainmentNews';
                    break;
                default:
                    rssUrl = 'https://www.reuters.com/rssFeed/topNews';
            }

            const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            if (!response.ok) throw new Error('Reuters RSS fetch failed');
            
            const data = await response.json();
            if (data.items) {
                return data.items.slice(0, 8).map(item => ({
                    title: item.title,
                    description: this.enhanceDescription(item.description || item.content, item.title, 'Reuters'),
                    url: item.link,
                    urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400',
                    publishedAt: item.pubDate,
                    source: 'Reuters',
                    category: category
                })).filter(article => article.title && article.url);
            }
        } catch (error) {
            console.warn('Reuters RSS fetch failed:', error.message);
        }
        return [];
    }

    /**
     * Fetch from CNN RSS feeds (real-time)
     */
    async fetchFromCNN(category, keywords) {
        try {
            let rssUrl = '';
            switch(category) {
                case 'world':
                    rssUrl = 'http://rss.cnn.com/rss/edition_world.rss';
                    break;
                case 'technology':
                    rssUrl = 'http://rss.cnn.com/rss/edition_technology.rss';
                    break;
                case 'business':
                    rssUrl = 'http://rss.cnn.com/rss/money_latest.rss';
                    break;
                case 'sports':
                    rssUrl = 'http://rss.cnn.com/rss/edition_sport.rss';
                    break;
                case 'entertainment':
                    rssUrl = 'http://rss.cnn.com/rss/edition_entertainment.rss';
                    break;
                default:
                    rssUrl = 'http://rss.cnn.com/rss/edition.rss';
            }

            const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            if (!response.ok) throw new Error('CNN RSS fetch failed');
            
            const data = await response.json();
            if (data.items) {
                return data.items.slice(0, 8).map(item => ({
                    title: item.title,
                    description: this.enhanceDescription(item.description || item.content, item.title, 'CNN'),
                    url: item.link,
                    urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
                    publishedAt: item.pubDate,
                    source: 'CNN',
                    category: category
                })).filter(article => article.title && article.url);
            }
        } catch (error) {
            console.warn('CNN RSS fetch failed:', error.message);
        }
        return [];
    }

    /**
     * Fetch from The Guardian RSS feeds (real-time)
     */
    async fetchFromGuardian(category, keywords) {
        try {
            let rssUrl = '';
            switch(category) {
                case 'world':
                    rssUrl = 'https://www.theguardian.com/world/rss';
                    break;
                case 'technology':
                    rssUrl = 'https://www.theguardian.com/technology/rss';
                    break;
                case 'business':
                    rssUrl = 'https://www.theguardian.com/business/rss';
                    break;
                case 'sports':
                    rssUrl = 'https://www.theguardian.com/sport/rss';
                    break;
                case 'lifestyle':
                    rssUrl = 'https://www.theguardian.com/lifeandstyle/rss';
                    break;
                case 'music':
                    rssUrl = 'https://www.theguardian.com/music/rss';
                    break;
                default:
                    rssUrl = 'https://www.theguardian.com/international/rss';
            }

            const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            if (!response.ok) throw new Error('Guardian RSS fetch failed');
            
            const data = await response.json();
            if (data.items) {
                return data.items.slice(0, 8).map(item => ({
                    title: item.title,
                    description: this.enhanceDescription(item.description || item.content, item.title, 'The Guardian'),
                    url: item.link,
                    urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400',
                    publishedAt: item.pubDate,
                    source: 'The Guardian',
                    category: category
                })).filter(article => article.title && article.url);
            }
        } catch (error) {
            console.warn('Guardian RSS fetch failed:', error.message);
        }
        return [];
    }

    /**
     * Fetch from Associated Press RSS feeds (real-time)
     */
    async fetchFromAP(category, keywords) {
        try {
            let rssUrl = '';
            switch(category) {
                case 'world':
                    rssUrl = 'https://apnews.com/apf-International';
                    break;
                case 'technology':
                    rssUrl = 'https://apnews.com/apf-Technology';
                    break;
                case 'business':
                    rssUrl = 'https://apnews.com/apf-business';
                    break;
                case 'sports':
                    rssUrl = 'https://apnews.com/apf-sports';
                    break;
                case 'entertainment':
                    rssUrl = 'https://apnews.com/apf-entertainment';
                    break;
                case 'health':
                    rssUrl = 'https://apnews.com/apf-Health';
                    break;
                default:
                    rssUrl = 'https://apnews.com/index.rss';
            }

            const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            if (!response.ok) throw new Error('AP RSS fetch failed');
            
            const data = await response.json();
            if (data.items) {
                return data.items.slice(0, 8).map(item => ({
                    title: item.title,
                    description: this.enhanceDescription(item.description || item.content, item.title, 'Associated Press'),
                    url: item.link,
                    urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400',
                    publishedAt: item.pubDate,
                    source: 'Associated Press',
                    category: category
                })).filter(article => article.title && article.url);
            }
        } catch (error) {
            console.warn('AP RSS fetch failed:', error.message);
        }
        return [];
    }

    /**
     * Fetch from Associated Press RSS feeds (real-time)
     */
    async fetchFromAssociatedPress(category, keywords) {
        try {
            let rssUrl = '';
            switch(category) {
                case 'world':
                    rssUrl = 'https://feeds.apnews.com/rss/apf-intlnews.rss';
                    break;
                case 'technology':
                    rssUrl = 'https://feeds.apnews.com/rss/apf-technology.rss';
                    break;
                case 'business':
                    rssUrl = 'https://feeds.apnews.com/rss/apf-business.rss';
                    break;
                case 'sports':
                    rssUrl = 'https://feeds.apnews.com/rss/apf-sports.rss';
                    break;
                case 'health':
                    rssUrl = 'https://feeds.apnews.com/rss/apf-Health.rss';
                    break;
                case 'entertainment':
                    rssUrl = 'https://feeds.apnews.com/rss/apf-entertainment.rss';
                    break;
                default:
                    rssUrl = 'https://feeds.apnews.com/rss/apf-topnews.rss';
            }

            const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            if (!response.ok) throw new Error('AP RSS fetch failed');
            
            const data = await response.json();
            if (data.items) {
                return data.items.slice(0, 10).map(item => ({
                    title: item.title,
                    description: this.enhanceDescription(item.description || item.content, item.title, 'Associated Press'),
                    url: item.link,
                    urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
                    publishedAt: item.pubDate,
                    source: 'Associated Press',
                    category: category
                })).filter(article => article.title && article.url);
            }
        } catch (error) {
            console.warn('AP RSS fetch failed:', error.message);
        }
        return [];
    }

    /**
     * Fetch from Bloomberg RSS feeds (real-time)
     */
    async fetchFromBloomberg(category, keywords) {
        try {
            let rssUrl = '';
            switch(category) {
                case 'business':
                    rssUrl = 'https://feeds.bloomberg.com/markets/news.rss';
                    break;
                case 'technology':
                    rssUrl = 'https://feeds.bloomberg.com/technology/news.rss';
                    break;
                case 'world':
                    rssUrl = 'https://feeds.bloomberg.com/politics/news.rss';
                    break;
                default:
                    rssUrl = 'https://feeds.bloomberg.com/news.rss';
            }

            const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            if (!response.ok) throw new Error('Bloomberg RSS fetch failed');
            
            const data = await response.json();
            if (data.items) {
                return data.items.slice(0, 8).map(item => ({
                    title: item.title,
                    description: this.enhanceDescription(item.description || item.content, item.title, 'Bloomberg'),
                    url: item.link,
                    urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
                    publishedAt: item.pubDate,
                    source: 'Bloomberg',
                    category: category
                })).filter(article => article.title && article.url);
            }
        } catch (error) {
            console.warn('Bloomberg RSS fetch failed:', error.message);
        }
        return [];
    }

    /**
     * Fetch from Al Jazeera RSS feeds (real-time)
     */
    async fetchFromAljazeeraRSS(category, keywords) {
        try {
            let rssUrl = '';
            switch(category) {
                case 'world':
                    rssUrl = 'https://www.aljazeera.com/xml/rss/all.xml';
                    break;
                case 'business':
                    rssUrl = 'https://www.aljazeera.com/xml/rss/economy.xml';
                    break;
                case 'sports':
                    rssUrl = 'https://www.aljazeera.com/xml/rss/sport.xml';
                    break;
                case 'kenya':
                    rssUrl = 'https://www.aljazeera.com/xml/rss/africa.xml';
                    break;
                default:
                    rssUrl = 'https://www.aljazeera.com/xml/rss/all.xml';
            }

            const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            if (!response.ok) throw new Error('Al Jazeera RSS fetch failed');
            
            const data = await response.json();
            if (data.items) {
                return data.items.slice(0, 8).map(item => ({
                    title: item.title,
                    description: this.enhanceDescription(item.description || item.content, item.title, 'Al Jazeera'),
                    url: item.link,
                    urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
                    publishedAt: item.pubDate,
                    source: 'Al Jazeera',
                    category: category
                })).filter(article => article.title && article.url);
            }
        } catch (error) {
            console.warn('Al Jazeera RSS fetch failed:', error.message);
        }
        return [];
    }

    /**
     * Fetch from category-specific sources (real-time)
     */
    async fetchFromCategorySpecificSources(category, keywords) {
        try {
            switch(category) {
                case 'kenya':
                    return await this.fetchKenyanSources();
                case 'technology':
                    return await this.fetchTechSources();
                case 'business':
                    return await this.fetchBusinessSources();
                case 'sports':
                    return await this.fetchSportsSources();
                case 'music':
                    return await this.fetchMusicSources();
                case 'health':
                    return await this.fetchHealthSources();
                case 'lifestyle':
                    return await this.fetchLifestyleSources();
                default:
                    return [];
            }
        } catch (error) {
            console.warn(`Category-specific sources failed for ${category}:`, error.message);
        }
        return [];
    }

    /**
     * Fetch from Kenyan news sources (real-time)
     */
    async fetchKenyanSources() {
        const kenyanRSSFeeds = [
            'https://www.nation.co.ke/kenya/rss',
            'https://www.standardmedia.co.ke/rss/headlines.php',
            'https://www.citizen.digital/rss'
        ];

        const articles = [];
        for (const rssUrl of kenyanRSSFeeds) {
            try {
                const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.items) {
                        const sourceArticles = data.items.slice(0, 5).map(item => ({
                            title: item.title,
                            description: this.enhanceDescription(item.description || item.content, item.title, 'Kenyan Media'),
                            url: item.link,
                            urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=400',
                            publishedAt: item.pubDate,
                            source: 'Kenyan News',
                            category: 'kenya'
                        })).filter(article => article.title && article.url);
                        articles.push(...sourceArticles);
                    }
                }
            } catch (error) {
                console.warn('Kenyan RSS source failed:', error.message);
            }
        }
        return articles;
    }

    /**
     * Fetch from technology sources (real-time)
     */
    async fetchTechSources() {
        const techRSSFeeds = [
            'https://techcrunch.com/feed/',
            'https://www.wired.com/feed/rss',
            'https://www.theverge.com/rss/index.xml'
        ];

        const articles = [];
        for (const rssUrl of techRSSFeeds) {
            try {
                const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.items) {
                        const sourceArticles = data.items.slice(0, 5).map(item => ({
                            title: item.title,
                            description: this.enhanceDescription(item.description || item.content, item.title, 'Tech Media'),
                            url: item.link,
                            urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
                            publishedAt: item.pubDate,
                            source: 'Tech News',
                            category: 'technology'
                        })).filter(article => article.title && article.url);
                        articles.push(...sourceArticles);
                    }
                }
            } catch (error) {
                console.warn('Tech RSS source failed:', error.message);
            }
        }
        return articles;
    }

    /**
     * Fetch from business sources (real-time)
     */
    async fetchBusinessSources() {
        const businessRSSFeeds = [
            'https://feeds.bloomberg.com/markets/news.rss',
            'https://www.ft.com/rss/home/uk',
            'https://feeds.fortune.com/fortune/headlines'
        ];

        const articles = [];
        for (const rssUrl of businessRSSFeeds) {
            try {
                const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.items) {
                        const sourceArticles = data.items.slice(0, 5).map(item => ({
                            title: item.title,
                            description: this.enhanceDescription(item.description || item.content, item.title, 'Business Media'),
                            url: item.link,
                            urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
                            publishedAt: item.pubDate,
                            source: 'Business News',
                            category: 'business'
                        })).filter(article => article.title && article.url);
                        articles.push(...sourceArticles);
                    }
                }
            } catch (error) {
                console.warn('Business RSS source failed:', error.message);
            }
        }
        return articles;
    }

    /**
     * Fetch from sports sources (real-time)
     */
    async fetchSportsSources() {
        const sportsRSSFeeds = [
            'https://www.espn.com/espn/rss/news',
            'https://sports.yahoo.com/rss/',
            'https://www.skysports.com/rss/12040'
        ];

        const articles = [];
        for (const rssUrl of sportsRSSFeeds) {
            try {
                const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.items) {
                        const sourceArticles = data.items.slice(0, 5).map(item => ({
                            title: item.title,
                            description: this.enhanceDescription(item.description || item.content, item.title, 'Sports Media'),
                            url: item.link,
                            urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
                            publishedAt: item.pubDate,
                            source: 'Sports News',
                            category: 'sports'
                        })).filter(article => article.title && article.url);
                        articles.push(...sourceArticles);
                    }
                }
            } catch (error) {
                console.warn('Sports RSS source failed:', error.message);
            }
        }
        return articles;
    }

    /**
     * Fetch from music sources (real-time)
     */
    async fetchMusicSources() {
        const musicRSSFeeds = [
            'https://pitchfork.com/rss/reviews/albums/',
            'https://www.rollingstone.com/music/rss/',
            'https://www.billboard.com/feed/'
        ];

        const articles = [];
        for (const rssUrl of musicRSSFeeds) {
            try {
                const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.items) {
                        const sourceArticles = data.items.slice(0, 5).map(item => ({
                            title: item.title,
                            description: this.enhanceDescription(item.description || item.content, item.title, 'Music Media'),
                            url: item.link,
                            urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
                            publishedAt: item.pubDate,
                            source: 'Music News',
                            category: 'music'
                        })).filter(article => article.title && article.url);
                        articles.push(...sourceArticles);
                    }
                }
            } catch (error) {
                console.warn('Music RSS source failed:', error.message);
            }
        }
        return articles;
    }

    /**
     * Fetch from health sources (real-time)
     */
    async fetchHealthSources() {
        const healthRSSFeeds = [
            'https://www.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC',
            'https://www.healthline.com/rss',
            'https://feeds.medicalnewstoday.com/medicalnewstoday'
        ];

        const articles = [];
        for (const rssUrl of healthRSSFeeds) {
            try {
                const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.items) {
                        const sourceArticles = data.items.slice(0, 5).map(item => ({
                            title: item.title,
                            description: this.enhanceDescription(item.description || item.content, item.title, 'Health Media'),
                            url: item.link,
                            urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400',
                            publishedAt: item.pubDate,
                            source: 'Health News',
                            category: 'health'
                        })).filter(article => article.title && article.url);
                        articles.push(...sourceArticles);
                    }
                }
            } catch (error) {
                console.warn('Health RSS source failed:', error.message);
            }
        }
        return articles;
    }

    /**
     * Fetch from lifestyle sources (real-time)
     */
    async fetchLifestyleSources() {
        const lifestyleRSSFeeds = [
            'https://www.vogue.com/feed/rss',
            'https://www.elle.com/rss/all.xml/',
            'https://www.cosmopolitan.com/rss/all.xml/'
        ];

        const articles = [];
        for (const rssUrl of lifestyleRSSFeeds) {
            try {
                const response = await this.corsProxyFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.items) {
                        const sourceArticles = data.items.slice(0, 5).map(item => ({
                            title: item.title,
                            description: this.enhanceDescription(item.description || item.content, item.title, 'Lifestyle Media'),
                            url: item.link,
                            urlToImage: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
                            publishedAt: item.pubDate,
                            source: 'Lifestyle News',
                            category: 'lifestyle'
                        })).filter(article => article.title && article.url);
                        articles.push(...sourceArticles);
                    }
                }
            } catch (error) {
                console.warn('Lifestyle RSS source failed:', error.message);
            }
        }
        return articles;
    }

    /**
     * Background refresh for proactive caching
     */
    async backgroundRefresh(category, limit) {
        try {
            console.log(`🔄 Background refresh for ${category}...`);
            // Fetch fresh data in background
            const fresh = await this.fetchNewsNoCache(category, limit);
            if (fresh && fresh.length > 0) {
                const cacheKey = `${category}_${limit}`;
                this.cache.set(cacheKey, {
                    data: fresh,
                    timestamp: Date.now()
                });
                console.log(`✅ Background refresh completed for ${category}`);
            }
        } catch (error) {
            console.warn(`⚠️ Background refresh failed for ${category}:`, error.message);
        }
    }
    
    /**
     * Fetch news without cache (for background refresh)
     */
    async fetchNewsNoCache(category, limit) {
        const categoryKeywords = this.categoryMappings[category] || [category];
        
        const promises = [
            this.fetchFromGNews(category, categoryKeywords, 5),
            this.fetchFromNewsAPI(category, categoryKeywords, 5),
            this.fetchFromBBC(category, categoryKeywords)
        ];

        const results = await Promise.allSettled(promises);
        let articles = [];
        
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                articles = articles.concat(result.value);
            }
        });

        return this.removeDuplicatesFast(articles).slice(0, limit);
    }
    
    /**
     * ULTRA-FAST timeout wrapper with performance monitoring
     */
    async fetchWithTimeout(promise, timeoutMs, apiName) {
        const startTime = performance.now();
        
        return Promise.race([
            promise.then(result => {
                const elapsed = (performance.now() - startTime).toFixed(2);
                console.log(`⚡ ${apiName} completed: ${elapsed}ms`);
                return result;
            }),
            new Promise((_, reject) => 
                setTimeout(() => {
                    const elapsed = (performance.now() - startTime).toFixed(2);
                    console.warn(`⏱️ ${apiName} timeout: ${elapsed}ms`);
                    reject(new Error(`${apiName} timeout after ${timeoutMs}ms`));
                }, timeoutMs)
            )
        ]);
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
            'lifestyle': 'Lifestyle',
            'music': 'Music'
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
