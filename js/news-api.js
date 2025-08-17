/**
 * News API Integration for Brightlens News
 * Handles fetching news from multiple APIs simultaneously
 */

class NewsAPI {
    constructor() {
        // API Keys from environment or fallback defaults
        this.apiKeys = {
            gnews: '9db0da87512446db08b82d4f63a4ba8d',
            newsdata: 'pub_d74b96fd4a9041d59212493d969368cd',
            newsapi: '9fcf10b2fd0c48c7a1886330ebb04385',
            mediastack: '4e53cf0fa35eefaac21cd9f77925b8f5',
            currentsapi: '9tI-4kOmMlJdgcosDUBsYYZDAnkLnuuL4Hrgc5TKlHmN_AMH'
        };

        // Enhanced Kenyan news sources for comprehensive coverage
        this.kenyanSources = [
            'nation.co.ke',
            'standardmedia.co.ke',
            'citizen.digital',
            'capitalfm.co.ke',
            'tuko.co.ke',
            'the-star.co.ke',
            'kenyans.co.ke',
            'nairobinews.co.ke',
            'kbc.co.ke',
            'businessdailyafrica.com',
            'people.co.ke',
            'taifa.co.ke',
            'kahawa.co.ke',
            'kissfm.co.ke',
            'ktn.co.ke',
            'hivisasa.com',
            'pd.co.ke',
            'ktnnews.com',
            'citizentv.co.ke',
            'ntv.co.ke',
            'ke.opera.news',
            'mauvida.org',
            'ghafla.com',
            'mashariki.net',
            'kenyatoday.com',
            'kenya-news.org',
            'edaily.co.ke',
            'pulselive.co.ke',
            'kenya.news24.com',
            'kenyanvibe.com',
            'africanquarters.com',
            'kenyayetu.com',
            'kenyanews.com',
            'quicknews.co.ke',
            'kenyainsider.com'
        ];

        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Fetch news for a specific category from all APIs with optimized performance
     */
    async fetchNews(category, limit = 20) {
        const cacheKey = `${category}_${limit}`;
        
        // Check cache first with longer timeout for better performance
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log(`Using cached data for ${category}`);
                return cached.data;
            }
        }

        // Pre-warm cache for next load
        this.preloadCategory(category, limit);

        try {
            // Enhanced sports coverage with specialized APIs
            if (category === 'sports') {
                return await this.fetchSportsNews(limit);
            }

            // Enhanced lifestyle coverage with specialized content
            if (category === 'lifestyle') {
                return await this.fetchLifestyleNews(limit);
            }

            // Enhanced Kenya news fetching with additional sources
            if (category === 'kenya') {
                return await this.fetchEnhancedKenyaNews(limit);
            }

            // Enhanced Technology news fetching with additional sources
            if (category === 'technology') {
                return await this.fetchEnhancedTechnologyNews(limit);
            }

            // Enhanced Health news fetching with specialized health sources
            if (category === 'health') {
                return await this.fetchEnhancedHealthNews(limit);
            }

            // Enhanced Sports news fetching with specialized sports sources
            if (category === 'sports') {
                return await this.fetchEnhancedSportsNews(limit);
            }

            // Enhanced Lifestyle news fetching with specialized lifestyle sources
            if (category === 'lifestyle') {
                return await this.fetchEnhancedLifestyleNews(limit);
            }

            // Enhanced Entertainment news fetching with specialized entertainment sources
            if (category === 'entertainment') {
                return await this.fetchEnhancedEntertainmentNews(limit);
            }

            // Enhanced World news fetching with comprehensive international sources
            if (category === 'world') {
                return await this.fetchEnhancedWorldNews(limit);
            }

            // Fetch from all APIs simultaneously with optimized timeout
            const promises = [
                this.fetchFromGNews(category, limit),
                this.fetchFromNewsData(category, limit),
                this.fetchFromNewsAPI(category, limit),
                this.fetchFromMediastack(category, limit),
                this.fetchFromCurrentsAPI(category, limit)
            ];

            // Add timeout to prevent long loading times
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('API fetch timeout')), 5000)
            );
            
            const results = await Promise.race([
                Promise.allSettled(promises),
                timeoutPromise
            ]);
            
            // Combine results from all APIs
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    allArticles = allArticles.concat(result.value);
                } else {
                    console.warn(`API ${index + 1} failed:`, result.reason);
                }
            });

            // Remove duplicates and sort by date
            const uniqueArticles = this.removeDuplicates(allArticles);
            const sortedArticles = uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            return sortedArticles;
        } catch (error) {
            console.error('Error fetching news:', error);
            throw new Error('Failed to fetch news from all sources');
        }
    }

    /**
     * Enhanced sports news fetching with multiple specialized sources
     */
    async fetchEnhancedSportsNews(limit = 50) {
        const cacheKey = `sports_enhanced_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch from multiple sources including ESPN API and sports-specific endpoints
            const promises = [
                // Regular news APIs with sports category
                this.fetchFromGNews('sports', limit),
                this.fetchFromNewsData('sports', limit),
                this.fetchFromNewsAPI('sports', limit),
                this.fetchFromMediastack('sports', limit),
                this.fetchFromCurrentsAPI('sports', limit),
                
                // ESPN API integration
                this.fetchFromESPN(),
                
                // Sports-specific news sources
                this.fetchFromSportsAPIs(),
                
                // Additional sports coverage
                this.fetchFromSportsNewsAPI(),
                
                // Real-time sports updates
                this.fetchFromRapidSports(),
                
                // Enhanced sports sources - new additions
                this.fetchFromSkySports(),
                this.fetchFromBBCSport(),
                this.fetchFromCBSSports(),
                this.fetchFromYahooSports(),
                this.fetchFromGoalDotCom(),
                this.fetchFromBleacherReport(),
                this.fetchFromSportingNews(),
                this.fetchFromGuardianSport(),
                this.fetchFromFoxSports()
            ];

            const results = await Promise.allSettled(promises);
            
            // Combine results from all APIs
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    allArticles = allArticles.concat(result.value);
                } else {
                    console.warn(`Sports API ${index + 1} failed:`, result.reason);
                }
            });

            // Remove duplicates and sort by date
            const uniqueArticles = this.removeDuplicates(allArticles);
            const sortedArticles = uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            return sortedArticles;
        } catch (error) {
            console.error('Error fetching sports news:', error);
            throw new Error('Failed to fetch sports news from all sources');
        }
    }

    /**
     * Enhanced Kenya news fetching with multiple local sources
     */
    async fetchEnhancedKenyaNews(limit = 100) {
        const cacheKey = `kenya_enhanced_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch from multiple sources including Kenya-specific APIs and RSS feeds
            const promises = [
                // Original API sources with Kenya focus (increase overall volume)
                this.fetchFromGNews('kenya', Math.floor(limit * 0.4)),
                this.fetchFromNewsData('kenya', Math.floor(limit * 0.4)),
                this.fetchFromNewsAPI('kenya', Math.floor(limit * 0.4)),
                this.fetchFromMediastack('kenya', Math.floor(limit * 0.4)),
                this.fetchFromCurrentsAPI('kenya', Math.floor(limit * 0.4)),
                
                // Kenya-specific RSS feeds and APIs
                this.fetchFromNationAfrica(),
                this.fetchFromStandardMedia(),
                this.fetchFromCapitalFM(),
                this.fetchFromCitizenDigital(),
                this.fetchFromTukoNews(),
                this.fetchFromTheStarKenya(),
                this.fetchFromKBCNews(),
                this.fetchFromPeopleDaily(),
                this.fetchFromAllAfricaKenya(),
                this.fetchFromBBCAfricaKenya(),
                
                // Additional Kenya news sources
                this.fetchFromKenyaToday(),
                this.fetchFromBusinessDaily(),
                this.fetchFromNTV(),
                this.fetchFromKTN()
            ];

            // Add timeout to prevent long loading times
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Kenya news fetch timeout')), 8000)
            );
            
            const results = await Promise.race([
                Promise.allSettled(promises),
                timeoutPromise
            ]);
            
            // Combine results from all sources
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value && Array.isArray(result.value)) {
                    allArticles = allArticles.concat(result.value);
                } else if (result.status === 'rejected') {
                    console.warn(`Kenya news source ${index + 1} failed:`, result.reason);
                }
            });

            // Remove duplicates, filter Kenya-relevant content, and sort by date
            const kenyaRelevantArticles = this.filterKenyaRelevantNews(allArticles);
            const uniqueArticles = this.removeDuplicates(kenyaRelevantArticles);
            const sortedArticles = uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            return sortedArticles;
        } catch (error) {
            console.error('Error fetching enhanced Kenya news:', error);
            // Fallback to original Kenya news method
            return await this.fetchOriginalKenyaNews(limit);
        }
    }

    /**
     * Enhanced Technology news fetching with multiple global tech sources
     */
    async fetchEnhancedTechnologyNews(limit = 50) {
        const cacheKey = `technology_enhanced_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch from multiple sources including major tech news outlets
            const promises = [
                // Original API sources with technology focus
                this.fetchFromGNews('technology', Math.floor(limit * 0.2)),
                this.fetchFromNewsData('technology', Math.floor(limit * 0.2)),
                this.fetchFromNewsAPI('technology', Math.floor(limit * 0.2)),
                this.fetchFromMediastack('technology', Math.floor(limit * 0.2)),
                this.fetchFromCurrentsAPI('technology', Math.floor(limit * 0.2)),
                
                // Major technology news sources
                this.fetchFromTechCrunch(),
                this.fetchFromTheVerge(),
                this.fetchFromWired(),
                this.fetchFromArsTechnica(),
                this.fetchFromCNETTech(),
                this.fetchFromGadgets360(),
                this.fetchFromMashableTech(),
                this.fetchFromEngadget(),
                this.fetchFromZDNet(),
                this.fetchFromBBCTech(),
                
                // Additional tech sources for comprehensive coverage
                this.fetchFromTechRadar(),
                this.fetchFromAnandTech(),
                this.fetchFromGizmodo(),
                this.fetchFromDigitalTrends(),
                this.fetchFromVentureBeat()
            ];

            const results = await Promise.allSettled(promises);
            
            // Combine results from all sources
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value && Array.isArray(result.value)) {
                    allArticles = allArticles.concat(result.value);
                } else if (result.status === 'rejected') {
                    console.warn(`Technology news source ${index + 1} failed:`, result.reason);
                }
            });

            // Remove duplicates, filter tech-relevant content, and sort by date
            const techRelevantArticles = this.filterTechnologyRelevantNews(allArticles);
            const uniqueArticles = this.removeDuplicates(techRelevantArticles);
            const sortedArticles = uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            return sortedArticles;
        } catch (error) {
            console.error('Error fetching enhanced technology news:', error);
            // Fallback to original technology news method
            return await this.fetchOriginalTechnologyNews(limit);
        }
    }

    /**
     * Enhanced Health news fetching with multiple specialized health sources
     */
    async fetchEnhancedHealthNews(limit = 50) {
        const cacheKey = `health_enhanced_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch from multiple sources including major health news outlets
            const promises = [
                // Original API sources with health focus
                this.fetchFromGNews('health', Math.floor(limit * 0.15)),
                this.fetchFromNewsData('health', Math.floor(limit * 0.15)),
                this.fetchFromNewsAPI('health', Math.floor(limit * 0.15)),
                this.fetchFromMediastack('health', Math.floor(limit * 0.15)),
                this.fetchFromCurrentsAPI('health', Math.floor(limit * 0.15)),
                
                // Major health news sources
                this.fetchFromMedicalNewsToday(),
                this.fetchFromHealthline(),
                this.fetchFromWebMDNews(),
                this.fetchFromScienceDailyHealth(),
                this.fetchFromWHONews(),
                this.fetchFromCDCNewsroom(),
                this.fetchFromTheLancetNews(),
                this.fetchFromBBCHealth(),
                this.fetchFromHarvardHealthBlog(),
                this.fetchFromReutersHealth(),
                
                // Additional health sources for comprehensive coverage
                this.fetchFromMayoClinicNews(),
                this.fetchFromJohnsHopkinsHealth(),
                this.fetchFromNIHNews(),
                this.fetchFromNatureHealth(),
                this.fetchFromPubMedNews(),
                this.fetchFromMedscapeNews()
            ];

            const results = await Promise.allSettled(promises);
            
            // Combine results from all sources
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value && Array.isArray(result.value)) {
                    allArticles = allArticles.concat(result.value);
                } else if (result.status === 'rejected') {
                    console.warn(`Health news source ${index + 1} failed:`, result.reason);
                }
            });

            // Remove duplicates, filter health-relevant content, and sort by date
            const healthRelevantArticles = this.filterHealthRelevantNews(allArticles);
            const uniqueArticles = this.removeDuplicates(healthRelevantArticles);
            const sortedArticles = uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            return sortedArticles;
        } catch (error) {
            console.error('Error fetching enhanced health news:', error);
            // Fallback to original health news method
            return await this.fetchOriginalHealthNews(limit);
        }
    }

    /**
     * Enhanced lifestyle news fetching with specialized content
     */
    async fetchEnhancedLifestyleNews(limit = 50) {
        const cacheKey = `lifestyle_enhanced_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch from multiple sources including lifestyle-specific endpoints
            const promises = [
                // Regular news APIs with lifestyle/health category mapping
                this.fetchFromGNews('lifestyle', limit),
                this.fetchFromNewsData('lifestyle', limit),
                this.fetchFromNewsAPI('lifestyle', limit),
                this.fetchFromMediastack('lifestyle', limit),
                this.fetchFromCurrentsAPI('lifestyle', limit),
                
                // Lifestyle-specific news sources
                this.fetchLifestyleFromVogue(),
                this.fetchLifestyleFromElle(),
                this.fetchLifestyleFromBuzzFeed(),
                this.fetchLifestyleFromRefinery29(),
                this.fetchLifestyleFromWellAndGood(),
                this.fetchLifestyleFromTravelLeisure(),
                this.fetchLifestyleFromFoodNetwork(),
                this.fetchLifestyleFromArchDigest()
            ];

            const results = await Promise.allSettled(promises);
            
            // Combine results from all APIs
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    allArticles = allArticles.concat(result.value);
                } else {
                    console.warn(`Lifestyle source ${index + 1} failed:`, result.reason);
                }
            });

            // Only use extended articles as absolute fallback if no real articles found
            if (allArticles.length === 0) {
                console.warn('No real lifestyle articles found, using extended database fallback');
                if (typeof ExtendedArticlesDB !== 'undefined') {
                    const extendedDB = new ExtendedArticlesDB();
                    allArticles = extendedDB.getExtendedLifestyleNews('Lifestyle News');
                }
            }

            // Remove duplicates and sort by date
            const uniqueArticles = this.removeDuplicates(allArticles);
            const sortedArticles = uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            return sortedArticles;
        } catch (error) {
            console.error('Error fetching lifestyle news:', error);
            // Return lifestyle sample articles as fallback
            return this.getLifestyleSampleArticles(limit);
        }
    }

    /**
     * Enhanced entertainment news fetching with specialized content
     */
    async fetchEnhancedEntertainmentNews(limit = 50) {
        const cacheKey = `entertainment_enhanced_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch from multiple sources including entertainment-specific endpoints
            const promises = [
                // Regular news APIs with entertainment category
                this.fetchFromGNews('entertainment', limit),
                this.fetchFromNewsData('entertainment', limit),
                this.fetchFromNewsAPI('entertainment', limit),
                this.fetchFromMediastack('entertainment', limit),
                this.fetchFromCurrentsAPI('entertainment', limit),
                
                // Entertainment-specific news sources
                this.fetchEntertainmentFromVariety(),
                this.fetchEntertainmentFromHollywoodReporter(),
                this.fetchEntertainmentFromDeadline(),
                this.fetchEntertainmentFromEntertainmentWeekly(),
                this.fetchEntertainmentFromRollingStone(),
                this.fetchEntertainmentFromBillboard(),
                this.fetchEntertainmentFromPitchfork(),
                this.fetchEntertainmentFromNME()
            ];

            const results = await Promise.allSettled(promises);
            
            // Combine results from all APIs
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    allArticles = allArticles.concat(result.value);
                } else {
                    console.warn(`Entertainment source ${index + 1} failed:`, result.reason);
                }
            });

            // Only use extended articles as absolute fallback if no real articles found
            if (allArticles.length === 0) {
                console.warn('No real entertainment articles found, using extended database fallback');
                if (typeof ExtendedArticlesDB !== 'undefined') {
                    const extendedDB = new ExtendedArticlesDB();
                    allArticles = extendedDB.getExtendedEntertainmentNews('Entertainment News');
                }
            }

            // Remove duplicates and sort by date
            const uniqueArticles = this.removeDuplicates(allArticles);
            const sortedArticles = uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            return sortedArticles;
        } catch (error) {
            console.error('Error fetching entertainment news:', error);
            // Return entertainment sample articles as fallback
            return this.getEntertainmentSampleArticles(limit);
        }
    }

    /**
     * Enhanced world news fetching with comprehensive international sources
     */
    async fetchEnhancedWorldNews(limit = 50) {
        const cacheKey = `world_enhanced_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Fetch from multiple sources including international news outlets
            const promises = [
                // Regular news APIs with world/international focus
                this.fetchFromGNews('world', limit),
                this.fetchFromNewsData('world', limit),
                this.fetchFromNewsAPI('world', limit),
                this.fetchFromMediastack('world', limit),
                this.fetchFromCurrentsAPI('world', limit),
                
                // International news sources
                this.fetchWorldFromBBC(),
                this.fetchWorldFromReuters(),
                this.fetchWorldFromAP(),
                this.fetchWorldFromAlJazeera(),
                this.fetchWorldFromFrance24(),
                this.fetchWorldFromDW(),
                this.fetchWorldFromEuronews(),
                this.fetchWorldFromCNN(),
                this.fetchWorldFromNPR()
            ];

            const results = await Promise.allSettled(promises);
            
            // Combine results from all APIs
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    allArticles = allArticles.concat(result.value);
                } else {
                    console.warn(`World news source ${index + 1} failed:`, result.reason);
                }
            });

            // Only use extended articles as absolute fallback if no real articles found
            if (allArticles.length === 0) {
                console.warn('No real world articles found, using extended database fallback');
                if (typeof ExtendedArticlesDB !== 'undefined') {
                    const extendedDB = new ExtendedArticlesDB();
                    allArticles = extendedDB.getExtendedWorldNews('World News');
                }
            }

            // Remove duplicates and sort by date
            const uniqueArticles = this.removeDuplicates(allArticles);
            const sortedArticles = uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            return sortedArticles;
        } catch (error) {
            console.error('Error fetching world news:', error);
            // Return world sample articles as fallback
            return this.getWorldSampleArticles(limit);
        }
    }

    /**
     * Fetch RSS feed with optimized performance
     */
    async fetchRSSFeed(rssUrl, sourceName) {
        try {
            // Use a fast CORS proxy with timeout
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
            
            const response = await fetch(proxyUrl, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`RSS fetch failed: ${response.status}`);
            
            const data = await response.json();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
            
            const items = xmlDoc.querySelectorAll('item');
            const articles = [];
            
            for (let i = 0; i < Math.min(items.length, 20); i++) {
                const item = items[i];
                const title = item.querySelector('title')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';
                const link = item.querySelector('link')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                const enclosure = item.querySelector('enclosure');
                const imageUrl = enclosure?.getAttribute('url') || '';
                
                articles.push({
                    title: title.trim(),
                    description: description.trim(),
                    url: link.trim(),
                    urlToImage: imageUrl,
                    publishedAt: pubDate,
                    source: { name: sourceName }
                });
            }
            
            return articles;
        } catch (error) {
            console.warn(`RSS fetch error for ${sourceName}:`, error);
            return [];
        }
    }

    /**
     * Fetch from GNews API
     */
    async fetchFromGNews(category, limit) {
        try {
            let url = `https://gnews.io/api/v4/top-headlines?token=${this.apiKeys.gnews}&lang=en&max=${Math.min(limit, 10)}`;
            
            if (category === 'kenya') {
                url += '&country=ke&q=(Kenya OR Nairobi OR Mombasa OR Kisumu OR "East Africa" OR "Kenyan government" OR "President Ruto")';
            } else if (category === 'latest') {
                // No category filter for latest news
            } else if (category !== 'world') {
                url += `&category=${this.mapCategoryForGNews(category)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            if (!response.ok) throw new Error(`GNews API error: ${response.status}`);
            
            const data = await response.json();
            return this.formatGNewsArticles(data.articles || []);
        } catch (error) {
            console.error('GNews fetch error:', error);
            // Return sample data for demonstration
            return this.getSampleArticles(category, 'GNews');
        }
    }

    /**
     * Fetch from NewsData.io API
     */
    async fetchFromNewsData(category, limit) {
        try {
            let url = `https://newsdata.io/api/1/news?apikey=${this.apiKeys.newsdata}&language=en&size=${Math.min(limit, 50)}`;
            
            if (category === 'kenya') {
                url += '&country=ke&q=Kenya OR Nairobi OR Mombasa OR Kisumu OR "East Africa"';
            } else if (category === 'latest') {
                // No category filter for latest news
            } else if (category !== 'world') {
                url += `&category=${this.mapCategoryForNewsData(category)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`NewsData API error: ${response.status}`);
            
            const data = await response.json();
            return this.formatNewsDataArticles(data.results || []);
        } catch (error) {
            console.error('NewsData fetch error:', error);
            return this.getSampleArticles(category, 'NewsData');
        }
    }

    /**
     * Fetch from NewsAPI.org
     */
    async fetchFromNewsAPI(category, limit) {
        try {
            let url = `https://newsapi.org/v2/top-headlines?apiKey=${this.apiKeys.newsapi}&pageSize=${Math.min(limit, 100)}`;
            
            if (category === 'kenya') {
                url += '&country=ke';
            } else if (category === 'latest') {
                url += '&country=us'; // Use US for general latest news
            } else if (category === 'world') {
                url = `https://newsapi.org/v2/everything?apiKey=${this.apiKeys.newsapi}&q=international&sortBy=publishedAt&pageSize=${Math.min(limit, 100)}`;
            } else {
                url += `&category=${this.mapCategoryForNewsAPI(category)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`NewsAPI error: ${response.status}`);
            
            const data = await response.json();
            return this.formatNewsAPIArticles(data.articles || []);
        } catch (error) {
            console.error('NewsAPI fetch error:', error);
            return this.getSampleArticles(category, 'NewsAPI');
        }
    }

    /**
     * Fetch from Mediastack API
     */
    async fetchFromMediastack(category, limit) {
        try {
            let url = `https://api.mediastack.com/v1/news?access_key=${this.apiKeys.mediastack}&languages=en&limit=${Math.min(limit, 100)}`;
            
            if (category === 'kenya') {
                url += '&countries=ke';
            } else if (category === 'latest') {
                // No category filter for latest news
            } else if (category !== 'world') {
                url += `&categories=${this.mapCategoryForMediastack(category)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Mediastack API error: ${response.status}`);
            
            const data = await response.json();
            return this.formatMediastackArticles(data.data || []);
        } catch (error) {
            console.error('Mediastack fetch error:', error);
            return this.getSampleArticles(category, 'Mediastack');
        }
    }

    /**
     * Fetch from CurrentsAPI
     */
    async fetchFromCurrentsAPI(category, limit) {
        try {
            let url = `https://api.currentsapi.services/v1/latest-news?apiKey=${this.apiKeys.currentsapi}&language=en&page_size=${Math.min(limit, 100)}`;
            
            if (category === 'kenya') {
                url += '&country=ke';
            } else if (category === 'latest') {
                // No category filter for latest news
            } else if (category !== 'world') {
                url += `&category=${this.mapCategoryForCurrentsAPI(category)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`CurrentsAPI error: ${response.status}`);
            
            const data = await response.json();
            return this.formatCurrentsAPIArticles(data.news || []);
        } catch (error) {
            console.error('CurrentsAPI fetch error:', error);
            return this.getSampleArticles(category, 'CurrentsAPI');
        }
    }

    /**
     * Category mapping functions for different APIs
     */
    mapCategoryForGNews(category) {
        const mapping = {
            'entertainment': 'entertainment',
            'technology': 'technology',
            'business': 'business',
            'sports': 'sports',
            'health': 'health',
            'lifestyle': 'health' // Map lifestyle to health category for broader coverage
        };
        return mapping[category] || 'general';
    }

    mapCategoryForNewsData(category) {
        const mapping = {
            'entertainment': 'entertainment',
            'technology': 'technology',
            'business': 'business',
            'sports': 'sports',
            'health': 'health',
            'lifestyle': 'lifestyle'
        };
        return mapping[category] || 'top';
    }

    mapCategoryForNewsAPI(category) {
        const mapping = {
            'entertainment': 'entertainment',
            'technology': 'technology',
            'business': 'business',
            'sports': 'sports',
            'health': 'health',
            'lifestyle': 'health' // Map lifestyle to health for broader lifestyle content
        };
        return mapping[category] || 'general';
    }

    mapCategoryForMediastack(category) {
        const mapping = {
            'entertainment': 'entertainment',
            'technology': 'technology',
            'business': 'business',
            'sports': 'sports',
            'health': 'health',
            'lifestyle': 'health'
        };
        return mapping[category] || 'general';
    }

    mapCategoryForCurrentsAPI(category) {
        const mapping = {
            'entertainment': 'entertainment',
            'technology': 'technology',
            'business': 'business',
            'sports': 'sports',
            'health': 'health',
            'lifestyle': 'health'
        };
        return mapping[category] || 'news';
    }

    /**
     * Format articles from different APIs to a common structure
     */
    formatGNewsArticles(articles) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.image,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'GNews',
            category: 'general'
        }));
    }

    formatNewsDataArticles(articles) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.link,
            urlToImage: article.image_url,
            publishedAt: article.pubDate,
            source: article.source_id || 'NewsData',
            category: article.category?.[0] || 'general'
        }));
    }

    formatNewsAPIArticles(articles) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'NewsAPI',
            category: 'general'
        }));
    }

    formatMediastackArticles(articles) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.image,
            publishedAt: article.published_at,
            source: article.source || 'Mediastack',
            category: article.category || 'general'
        }));
    }

    formatCurrentsAPIArticles(articles) {
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.image,
            publishedAt: article.published,
            source: 'CurrentsAPI',
            category: article.category?.[0] || 'general'
        }));
    }

    /**
     * Remove duplicate articles based on title and URL
     */
    removeDuplicates(articles) {
        const seen = new Set();
        return articles.filter(article => {
            if (!article.title || !article.url) return false;
            
            const key = `${article.title.toLowerCase().trim()}-${article.url}`;
            if (seen.has(key)) return false;
            
            seen.add(key);
            return true;
        });
    }

    // Technology News Source Methods

    /**
     * Fetch from TechCrunch
     */
    async fetchFromTechCrunch() {
        try {
            // TODO: Implement actual TechCrunch RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('TechCrunch: Real-time tech integration pending');
            return [];
        } catch (error) {
            console.error('TechCrunch fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from The Verge
     */
    async fetchFromTheVerge() {
        try {
            // TODO: Implement actual The Verge RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('The Verge: Real-time tech integration pending');
            return [];
        } catch (error) {
            console.error('The Verge fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Wired
     */
    async fetchFromWired() {
        // Only real-time API integration should be here. Return empty array if not available.
        return [];
    }

    /**
     * Fetch from Ars Technica
     */
    async fetchFromArsTechnica() {
        return [];
    }

    /**
     * Fetch from CNET Tech
     */
    async fetchFromCNETTech() {
        return [];
    }

    /**
     * Fetch from Gadgets 360
     */
    async fetchFromGadgets360() {
        return [];
    }

    /**
     * Fetch from Mashable Tech
     */
    async fetchFromMashableTech() {
        return [];
    }

    /**
     * Fetch from Engadget
     */
    async fetchFromEngadget() {
        return [];
    }

    /**
     * Fetch from ZDNet
     */
    async fetchFromZDNet() {
        return [];
    }

    /**
     * Fetch from BBC Tech
     */
    async fetchFromBBCTech() {
        return [];
    }

    /**
     * Additional tech sources for comprehensive coverage
     */
    async fetchFromTechRadar() {
        return [];
    }

    async fetchFromAnandTech() {
        return [];
    }

    async fetchFromGizmodo() {
        return [];
    }

    async fetchFromDigitalTrends() {
        return [];
    }

    async fetchFromVentureBeat() {
        return [];
    }

    // Kenya News Source Methods

    /**
     * Fetch from Nation Africa
     */
    async fetchFromNationAfrica() {
        try {
            const rssUrl = 'https://www.nation.co.ke/rss';
            const articles = await this.fetchRSSFeed(rssUrl, 'Nation Africa');
            return articles.filter(article => 
                article.title.toLowerCase().includes('kenya') ||
                article.description.toLowerCase().includes('kenya')
            );
        } catch (error) {
            console.error('Nation Africa fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from The Standard
     */
    async fetchFromStandardMedia() {
        try {
            const rssUrl = 'https://www.standardmedia.co.ke/rss';
            const articles = await this.fetchRSSFeed(rssUrl, 'The Standard');
            return articles.filter(article => 
                article.title.toLowerCase().includes('kenya') ||
                article.description.toLowerCase().includes('kenya')
            );
        } catch (error) {
            console.error('Standard Media fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Capital FM
     */
    async fetchFromCapitalFM() {
        try {
            const rssUrl = 'https://www.capitalfm.co.ke/rss';
            const articles = await this.fetchRSSFeed(rssUrl, 'Capital FM');
            return articles.filter(article => 
                article.title.toLowerCase().includes('kenya') ||
                article.description.toLowerCase().includes('kenya')
            );
        } catch (error) {
            console.error('Capital FM fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Citizen Digital
     */
    async fetchFromCitizenDigital() {
        try {
            // TODO: Implement actual RSS feed or API integration for Citizen Digital
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Citizen Digital: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('Citizen Digital fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Tuko News
     */
    async fetchFromTukoNews() {
        try {
            // TODO: Implement actual RSS feed or API integration for Tuko News
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Tuko News: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('Tuko News fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from The Star Kenya
     */
    async fetchFromTheStarKenya() {
        try {
            // TODO: Implement actual RSS feed or API integration for The Star Kenya
            // For now, return empty array to ensure only real-time news is displayed
            console.log('The Star Kenya: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('The Star Kenya fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from KBC News
     */
    async fetchFromKBCNews() {
        try {
            // TODO: Implement actual RSS feed or API integration for KBC News
            // For now, return empty array to ensure only real-time news is displayed
            console.log('KBC News: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('KBC News fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch additional Kenya news sources
     */
    async fetchFromPeopleDaily() {
        try {
            // TODO: Implement actual RSS feed or API integration for People Daily
            // For now, return empty array to ensure only real-time news is displayed
            console.log('People Daily: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('People Daily fetch error:', error);
            return [];
        }
    }

    async fetchFromAllAfricaKenya() {
        try {
            // TODO: Implement actual RSS feed or API integration for AllAfrica Kenya
            // For now, return empty array to ensure only real-time news is displayed
            console.log('AllAfrica Kenya: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('AllAfrica Kenya fetch error:', error);
            return [];
        }
    }

    async fetchFromBBCAfricaKenya() {
        try {
            // TODO: Implement actual RSS feed or API integration for BBC Africa Kenya
            // For now, return empty array to ensure only real-time news is displayed
            console.log('BBC Africa Kenya: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('BBC Africa Kenya fetch error:', error);
            return [];
        }
    }

    async fetchFromKenyaToday() {
        try {
            // TODO: Implement actual RSS feed or API integration for Kenya Today
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Kenya Today: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('Kenya Today fetch error:', error);
            return [];
        }
    }

    async fetchFromBusinessDaily() {
        try {
            // TODO: Implement actual RSS feed or API integration for Business Daily
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Business Daily: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('Business Daily fetch error:', error);
            return [];
        }
    }

    async fetchFromNTV() {
        try {
            // TODO: Implement actual RSS feed or API integration for NTV Kenya
            // For now, return empty array to ensure only real-time news is displayed
            console.log('NTV Kenya: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('NTV Kenya fetch error:', error);
            return [];
        }
    }

    async fetchFromKTN() {
        try {
            // TODO: Implement actual RSS feed or API integration for KTN News
            // For now, return empty array to ensure only real-time news is displayed
            console.log('KTN News: Real-time news integration pending');
            return [];
        } catch (error) {
            console.error('KTN News fetch error:', error);
            return [];
        }
    }

    /**
     * Filter articles to ensure Kenya relevance
     */
    filterKenyaRelevantNews(articles) {
        const kenyaKeywords = [
            'kenya', 'kenyan', 'nairobi', 'mombasa', 'kisumu', 'eldoret', 'nakuru', 'thika',
            'ruto', 'uhuru', 'raila', 'east africa', 'safaricom', 'equity bank', 'ktda',
            'kcb', 'kenyatta', 'maasai mara', 'tsavo', 'mount kenya', 'lamu', 'malindi',
            'kibera', 'mathare', 'eastleigh', 'westlands', 'karen', 'runda', 'kilifi'
        ];

        const isKenyanDomain = (url) => {
            try {
                const u = new URL(url);
                const host = u.hostname.replace(/^www\./, '').toLowerCase();
                if (host.endsWith('.co.ke') || host.endsWith('.ke')) return true;
                // Match against known Kenyan sources list
                return this.kenyanSources.some(src => host.includes(src));
            } catch { return false; }
        };

        return articles.filter(article => {
            const title = (article.title || '').toLowerCase();
            const desc = (article.description || '').toLowerCase();
            const src = (article.source || '').toLowerCase();
            const textToCheck = `${title} ${desc}`;
            return kenyaKeywords.some(keyword => textToCheck.includes(keyword)) ||
                   src.includes('kenya') ||
                   article.category === 'kenya' ||
                   isKenyanDomain(article.url);
        });
    }

    /**
     * Filter articles to ensure Technology relevance
     */
    filterTechnologyRelevantNews(articles) {
        const techKeywords = [
            'technology', 'tech', 'ai', 'artificial intelligence', 'machine learning', 'blockchain',
            'cryptocurrency', 'bitcoin', 'ethereum', 'smartphone', 'iphone', 'android', 'apple',
            'google', 'microsoft', 'amazon', 'facebook', 'meta', 'tesla', 'spacex', 'startup',
            'software', 'hardware', 'computer', 'laptop', 'processor', 'chip', 'semiconductor',
            'quantum', 'cloud computing', 'cybersecurity', 'data', 'internet', 'wifi', '5g',
            'virtual reality', 'vr', 'augmented reality', 'ar', 'gaming', 'app', 'digital',
            'innovation', 'robotics', 'automation', 'iot', 'internet of things', 'programming',
            'coding', 'developer', 'techcrunch', 'silicon valley', 'fintech', 'saas', 'api',
            'algorithm', 'neural network', 'deep learning', 'autonomous', 'electric vehicle',
            'battery', 'renewable energy', 'solar', 'biotech', 'medtech', 'drone', 'satellite'
        ];

        return articles.filter(article => {
            // Exclude known sample/static/demo articles by URL
            const staticDomains = [
                'digitaltrends.com',
                'arstechnica.com/cpu-dynamic-core-reconfiguration-technology',
                'arstechnica.com/cybersecurity-machine-learning-attack-prediction',
                'wired.com/self-healing-electronics-space-applications',
                'wired.com/fusion-energy-breakthrough-net-gain',
                'cnet.com/smart-contact-lenses-display-clinical-testing',
                'cnet.com/autonomous-drone-network-emergency-response',
                'gadgets360.com/foldable-smartphone-ultra-thin-durability',
                'gadgets360.com/next-generation-wifi-gigabit-speeds-mobile',
                'mashable.com/ai-personalized-vr-education-experiences',
                'mashable.com/robotic-surgery-systems-precision-beyond-human',
                'engadget.com/revolutionary-battery-1000-mile-electric-vehicle',
                'engadget.com/3d-printing-living-tissue-medical-transplants',
                'zdnet.com/enterprise-cloud-ai-automation-platforms',
                'zdnet.com/blockchain-infrastructure-millions-transactions-per-second',
                'bbc.com/news/technology/satellite-internet-global-connectivity',
                'techradar.com/gaming-photorealistic-graphics-real-time',
                'anandtech.com/advanced-memory-10x-faster-data-access',
                'gizmodo.com/smart-glass-windows-interactive-displays',
                'venturebeat.com',
            ];
            const url = (article.url || '').toLowerCase();
            if (staticDomains.some(domain => url.includes(domain))) {
                return false;
            }
            const textToCheck = `${article.title} ${article.description}`.toLowerCase();
            return techKeywords.some(keyword => textToCheck.includes(keyword)) ||
                   article.source.toLowerCase().includes('tech') ||
                   article.category === 'technology';
        });
    }

    /**
     * Filter articles to ensure Health relevance
     */
    filterHealthRelevantNews(articles) {
        const healthKeywords = [
            'health', 'medical', 'medicine', 'healthcare', 'doctor', 'hospital', 'patient', 'disease',
            'vaccine', 'vaccination', 'immunization', 'pandemic', 'epidemic', 'virus', 'bacteria',
            'infection', 'symptom', 'diagnosis', 'treatment', 'therapy', 'surgery', 'medication',
            'drug', 'pharmaceutical', 'clinical trial', 'research study', 'medical research',
            'cancer', 'diabetes', 'heart disease', 'alzheimer', 'parkinson', 'mental health',
            'depression', 'anxiety', 'stroke', 'hypertension', 'obesity', 'fitness', 'nutrition',
            'diet', 'exercise', 'wellness', 'prevention', 'public health', 'epidemiology',
            'fda', 'who', 'cdc', 'nih', 'medical news', 'healthline', 'webmd', 'mayo clinic',
            'johns hopkins', 'harvard health', 'lancet', 'nejm', 'pubmed', 'medscape',
            'biomedical', 'biotechnology', 'gene therapy', 'stem cell', 'clinical', 'pathology',
            'cardiology', 'neurology', 'oncology', 'pediatrics', 'geriatrics', 'psychiatry',
            'radiology', 'surgery', 'emergency medicine', 'family medicine', 'internal medicine',
            'health policy', 'healthcare system', 'telemedicine', 'digital health', 'health tech',
            'medical device', 'diagnostic', 'therapeutic', 'pharmaceutical company', 'biotech company'
        ];

        return articles.filter(article => {
            const textToCheck = `${article.title} ${article.description}`.toLowerCase();
            return healthKeywords.some(keyword => textToCheck.includes(keyword)) ||
                   article.source.toLowerCase().includes('health') ||
                   article.source.toLowerCase().includes('medical') ||
                   article.category === 'health';
        });
    }

    /**
     * Fallback method for original Technology news fetching
     */
    async fetchOriginalTechnologyNews(limit) {
        try {
            const promises = [
                this.fetchFromGNews('technology', limit),
                this.fetchFromNewsData('technology', limit),
                this.fetchFromNewsAPI('technology', limit),
                this.fetchFromMediastack('technology', limit),
                this.fetchFromCurrentsAPI('technology', limit)
            ];

            const results = await Promise.allSettled(promises);
            
            let allArticles = [];
            results.forEach((result) => {
                if (result.status === 'fulfilled' && result.value) {
                    allArticles = allArticles.concat(result.value);
                }
            });

            const uniqueArticles = this.removeDuplicates(allArticles);
            return uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );
        } catch (error) {
            console.error('Original Technology news fetch error:', error);
            // Return empty array - only real-time news should be displayed
            return [];
        }
    }

    /**
     * Fallback method for original Health news fetching
     */
    async fetchOriginalHealthNews(limit) {
        try {
            const promises = [
                this.fetchFromGNews('health', limit),
                this.fetchFromNewsData('health', limit),
                this.fetchFromNewsAPI('health', limit),
                this.fetchFromMediastack('health', limit),
                this.fetchFromCurrentsAPI('health', limit)
            ];

            const results = await Promise.allSettled(promises);
            
            let allArticles = [];
            results.forEach((result) => {
                if (result.status === 'fulfilled' && result.value) {
                    allArticles = allArticles.concat(result.value);
                }
            });

            const uniqueArticles = this.removeDuplicates(allArticles);
            return uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );
        } catch (error) {
            console.error('Original Health news fetch error:', error);
            return [];
        }
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
     * Get sample articles for fallback when APIs fail
     */
    getSampleArticles(category, source = 'News API') {
        // Strictly disable all static/extended fallbacks to ensure only real-time news
        return [];
    }

    /**
     * Generate comprehensive article collections (up to 50 per category)
     */
    generateAdditionalArticles(category, source) {
        const timeOffsets = this.generateTimeRange(50); // Generate 50 time intervals
        const imagePool = [
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400",
            "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400",
            "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400",
            "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400",
            "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
            "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
            "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
            "https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?w=400",
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
            "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400",
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
            "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400",
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400"
        ];
        
        const getRandomImage = () => imagePool[Math.floor(Math.random() * imagePool.length)];
        const additionalData = {
            latest: [
                {
                    title: "Scientific Breakthrough in Renewable Energy Storage",
                    description: "Revolutionary battery technology promises to store renewable energy for weeks, addressing grid stability concerns.",
                    url: "https://example.com/battery-breakthrough",
                    urlToImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400",
                    publishedAt: new Date(Date.now() - timeOffsets[0]).toISOString(),
                    source: source,
                    category: "technology"
                },
                {
                    title: "Global Food Security Initiative Shows Promise",
                    description: "International collaboration develops drought-resistant crops to address climate change impacts on agriculture.",
                    url: "https://example.com/food-security",
                    urlToImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
                    publishedAt: new Date(Date.now() - timeOffsets[1]).toISOString(),
                    source: source,
                    category: "general"
                }
            ],
            kenya: [
                {
                    title: "Kenya Launches Ambitious Green Energy Program",
                    description: "Government announces plan to achieve 100% renewable energy by 2030 through wind and solar expansion.",
                    url: "https://example.com/kenya-green-energy",
                    urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
                    publishedAt: new Date(Date.now() - timeOffsets[0]).toISOString(),
                    source: "Capital FM",
                    category: "general"
                },
                {
                    title: "Mombasa Port Expansion Project Nears Completion",
                    description: "Major infrastructure development set to boost East African trade and economic growth.",
                    url: "https://example.com/mombasa-port",
                    urlToImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
                    publishedAt: new Date(Date.now() - timeOffsets[2]).toISOString(),
                    source: "Standard Digital",
                    category: "business"
                }
            ],
            world: [
                {
                    title: "International Space Station Welcomes New Research Mission",
                    description: "Multinational crew begins groundbreaking experiments in microgravity environment.",
                    url: "https://example.com/iss-mission",
                    urlToImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400",
                    publishedAt: new Date(Date.now() - timeOffsets[1]).toISOString(),
                    source: source,
                    category: "technology"
                }
            ],
            entertainment: [
                {
                    title: "Virtual Reality Concert Experience Breaks Attendance Records",
                    description: "Innovative VR platform hosts largest virtual music event with millions of participants worldwide.",
                    url: "https://example.com/vr-concert",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - timeOffsets[0]).toISOString(),
                    source: source,
                    category: "entertainment"
                }
            ],
            technology: [],
            business: [
                {
                    title: "Green Finance Initiatives Gain Momentum Among Banks",
                    description: "Major financial institutions commit to sustainable lending practices and carbon-neutral operations.",
                    url: "https://example.com/green-finance",
                    urlToImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
                    publishedAt: new Date(Date.now() - timeOffsets[1]).toISOString(),
                    source: source,
                    category: "business"
                }
            ],
            sports: [],
            health: [
                {
                    title: "Breakthrough in Alzheimer's Research Shows Promise",
                    description: "New therapeutic approach demonstrates significant improvement in early-stage clinical trials.",
                    url: "https://example.com/alzheimers-research",
                    urlToImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
                    publishedAt: new Date(Date.now() - timeOffsets[3]).toISOString(),
                    source: source,
                    category: "health"
                }
            ]
        };

        return additionalData[category] || additionalData.latest;
    }

    /**
     * Generate time range for articles
     */
    generateTimeRange(count) {
        const offsets = [];
        for (let i = 0; i < count; i++) {
            offsets.push((i + 1) * 3600000 + Math.random() * 1800000); // 1-count hours with random minutes
        }
        return offsets;
    }

    /**
     * Fetch from ESPN API (unofficial/hidden API)
     */
    async fetchFromESPN() {
        try {
            const endpoints = [
                'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news',
                'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news',
                'https://site.api.espn.com/apis/site/v2/sports/football/college-football/news',
                'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/news',
                'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/news',
                'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news',
                'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/news'
            ];

            const articles = [];
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.articles) {
                            data.articles.forEach(article => {
                                articles.push({
                                    title: article.headline || article.title,
                                    description: article.description || article.summary,
                                    url: article.links?.web?.href || `https://espn.com${article.id}`,
                                    urlToImage: article.images?.[0]?.url || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
                                    publishedAt: article.published || new Date().toISOString(),
                                    source: 'ESPN',
                                    category: 'sports'
                                });
                            });
                        }
                    }
                } catch (error) {
                    console.warn('ESPN endpoint failed:', endpoint, error);
                }
            }
            return articles;
        } catch (error) {
            console.error('ESPN API error:', error);
            return [];
        }
    }

    /**
     * Fetch from Sports APIs (TheSportsDB, etc.)
     */
    async fetchFromSportsAPIs() {
        try {
            // TODO: Implement actual sports API integration (TheSportsDB, etc.)
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Sports APIs: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('Sports APIs error:', error);
            return [];
        }
    }

    /**
     * Fetch from Sports News API
     */
    async fetchFromSportsNewsAPI() {
        try {
            // TODO: Implement actual Sports News API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Sports News API: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('Sports News API error:', error);
            return [];
        }
    }

    /**
     * Fetch from RapidAPI Sports endpoints
     */
    async fetchFromRapidSports() {
        try {
            // TODO: Implement actual RapidAPI Sports integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('RapidSports: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('RapidSports API error:', error);
            return [];
        }
    }

    /**
     * Generate sports titles
     */
    generateSportsTitle(sport) {
        const templates = [
            `${sport} Championship Finals Set for Epic Showdown`,
            `Breaking: ${sport} Star Player Signs Record Contract`,
            `${sport} Season Highlights: Best Moments So Far`,
            `${sport} Trade Deadline: Major Moves Shake Up League`,
            `${sport} Rookie of the Year Contenders Emerge`,
            `${sport} Coach of the Year Race Intensifies`,
            `${sport} Playoff Picture Takes Shape After Latest Results`,
            `${sport} Hall of Fame Announces New Inductees`,
            `${sport} Technology Advances Change Game Strategy`,
            `${sport} Youth Programs Receive Major Investment`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * Generate sports descriptions
     */
    generateSportsDescription(sport) {
        const templates = [
            `The ${sport} world is experiencing unprecedented excitement as major developments continue to reshape the competitive landscape, with breakthrough performances and strategic innovations that are revolutionizing how the game is played. Leading analysts and former champions are closely monitoring these transformative changes, which include advanced training methodologies, cutting-edge sports science applications, and innovative tactical approaches that are setting new standards for athletic excellence. Fans worldwide are witnessing historic moments as records are broken and new rivalries emerge, creating compelling storylines that capture the imagination of both dedicated followers and casual observers. The integration of technology and data analytics is providing deeper insights into player performance and team strategies, while social media engagement has reached new heights as athletes connect directly with their global fanbase.`,
            `Latest ${sport} developments reveal significant changes that will fundamentally impact teams, players, and the entire sporting ecosystem throughout the season and beyond. Revolutionary training techniques, advanced nutrition protocols, and innovative recovery methods are enabling athletes to achieve previously impossible performance levels. Team management strategies are evolving rapidly, incorporating artificial intelligence and machine learning to optimize player selection, game tactics, and injury prevention. The financial landscape of ${sport} is also transforming, with new sponsorship models, streaming partnerships, and fan engagement platforms creating unprecedented revenue opportunities. These comprehensive changes are establishing new benchmarks for professional sports excellence and fan experience.`,
            `${sport} enthusiasts are following closely as dramatic and compelling storylines unfold across professional and amateur levels, creating a rich tapestry of athletic achievement and human drama. Emerging talents are challenging established champions, while veteran players are redefining what's possible in their respective sports through dedication, innovation, and sheer determination. The competitive balance has never been more intriguing, with multiple teams and athletes possessing realistic championship aspirations. International competitions are showcasing diverse playing styles and cultural approaches to the sport, enriching the global sporting community. Youth development programs are producing exceptional young athletes who are already making significant impacts at the highest levels.`,
            `Industry experts and former champions are analyzing how recent ${sport} trends are revolutionizing the way the game is played, watched, and experienced by fans around the world. Advanced sports science research is providing unprecedented insights into athletic performance, injury prevention, and recovery optimization. Broadcasting technology innovations, including virtual reality experiences and interactive viewing options, are transforming how audiences engage with live sports. The globalization of ${sport} is creating new markets and opportunities, while also raising the competitive standards as talent pools expand internationally. These technological and cultural shifts are establishing new paradigms for athletic achievement and sports entertainment.`,
            `${sport} continues to captivate audiences worldwide with outstanding performances, unexpected developments, and inspiring stories of athletic achievement that transcend traditional sports boundaries. Record-breaking performances are becoming increasingly common as athletes push the limits of human capability through scientific training methods and unwavering dedication. The sport's growing international appeal is evidenced by expanding global participation, increased media coverage, and rising commercial investment from major brands seeking to connect with passionate fan communities. Social impact initiatives led by prominent athletes are using the platform of ${sport} to address important societal issues, demonstrating the power of athletics to inspire positive change beyond the competitive arena.`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * Generate dynamic sports titles
     */
    generateDynamicSportsTitle() {
        const titles = [
            "International Sports Cooperation Strengthens Global Community",
            "Youth Sports Development Programs Expand Nationwide",
            "Sports Medicine Innovations Improve Athlete Performance",
            "Stadium Technology Upgrades Enhance Fan Experience",
            "Women's Sports Participation Reaches All-Time High",
            "Paralympic Athletes Prepare for Upcoming Competition",
            "Sports Journalism Evolves with Digital Media Trends",
            "Athletic Scholarship Programs Support Student Athletes",
            "Sports Psychology Research Reveals Performance Insights",
            "Environmental Sustainability in Sports Facilities"
        ];
        
        return titles[Math.floor(Math.random() * titles.length)];
    }

    /**
     * Generate dynamic sports descriptions
     */
    generateDynamicSportsDescription() {
        const descriptions = [
            "Comprehensive coverage of the latest sports developments reveals how athletic competition continues to evolve through groundbreaking innovations in training methodologies, equipment technology, and strategic approaches that are redefining the boundaries of human performance. Leading sports scientists and performance analysts are documenting unprecedented advances in athlete development, recovery protocols, and competitive preparation techniques. The integration of artificial intelligence and data analytics is revolutionizing how teams scout talent, develop game strategies, and optimize player performance throughout entire seasons. These technological and methodological advances are creating new opportunities for athletes to achieve excellence while establishing higher standards for competitive integrity and fan engagement across all levels of organized sports.",
            "Breaking analysis of current sports trends highlights the extraordinary dedication, skill, and mental fortitude of today's athletes who are pushing the boundaries of what was previously considered possible in their respective disciplines. Modern training regimens incorporate cutting-edge sports science, advanced nutrition protocols, and innovative recovery methods that enable athletes to maintain peak performance levels for extended periods. The psychological aspects of athletic competition are receiving increased attention, with sports psychology experts developing new techniques to help athletes manage pressure, maintain focus, and achieve consistent excellence. These comprehensive approaches to athlete development are producing remarkable results and inspiring the next generation of sports enthusiasts to pursue their own athletic ambitions.",
            "Expert commentary on sports industry changes provides valuable insight into the future of competitive athletics, revealing how technological innovations, changing fan expectations, and evolving business models are reshaping the entire sports ecosystem. Broadcasting and media consumption patterns are transforming rapidly, with streaming services, interactive viewing experiences, and social media engagement creating new ways for fans to connect with their favorite sports and athletes. The globalization of sports is creating unprecedented opportunities for cross-cultural exchange and international competition, while also raising the bar for athletic achievement as talent pools expand worldwide. These industry transformations are establishing new paradigms for sports entertainment and competitive excellence.",
            "In-depth reporting on sports business developments showcases remarkable innovation in athletic entertainment, revealing how creative partnerships, technological integration, and fan-focused initiatives are driving unprecedented growth in the sports industry. Major brands are investing heavily in sports marketing and athlete partnerships, recognizing the powerful emotional connection that exists between fans and their favorite teams and players. The emergence of new sports leagues, alternative competitive formats, and innovative viewing experiences is expanding the definition of what constitutes professional athletics. These business innovations are creating new revenue streams for athletes and organizations while providing fans with more diverse and engaging ways to experience competitive sports.",
            "Exclusive coverage of sports community initiatives demonstrates the profound positive impact that athletic programs have on local communities, youth development, and social change movements around the world. Professional athletes are increasingly using their platforms to address important social issues, support charitable causes, and inspire positive change in their communities. Youth sports programs are receiving significant investment and support, with emphasis on accessibility, inclusivity, and character development alongside athletic skill building. These community-focused initiatives are proving that sports can serve as a powerful catalyst for personal growth, social unity, and positive societal transformation beyond the competitive arena."
        ];
        
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    /**
     * Get sports-related images
     */
    getSportsImage(sport) {
        const sportImages = {
            'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
            'football': 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400',
            'baseball': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
            'hockey': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            'soccer': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
            'tennis': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
            'golf': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400',
            'olympics': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400'
        };
        
        return sportImages[sport] || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400';
    }

    /**
     * Get random sports image
     */
    getRandomSportsImage() {
        const images = [
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
            'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
            'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400',
            'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
            'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
        ];
        
        return images[Math.floor(Math.random() * images.length)];
    }

    /**
     * Fetch lifestyle news from Vogue RSS/API
     */
    async fetchLifestyleFromVogue() {
        try {
            // Use NewsAPI with specific queries for lifestyle content
            if (this.apiKeys.newsapi) {
                const response = await fetch(`https://newsapi.org/v2/everything?q=fashion AND style&sources=vogue&language=en&sortBy=publishedAt&apiKey=${this.apiKeys.newsapi}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.articles?.slice(0, 5).map(article => ({
                        title: article.title,
                        description: article.description || 'Fashion and style insights from Vogue.',
                        url: article.url,
                        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
                        publishedAt: article.publishedAt,
                        source: 'Vogue',
                        category: 'lifestyle'
                    })) || [];
                }
            }
        } catch (error) {
            console.warn('Vogue fetch failed:', error);
        }
        return [];
    }

    /**
     * Fetch lifestyle news from wellness and lifestyle sources
     */
    async fetchLifestyleFromElle() {
        try {
            // Use NewsAPI with wellness and lifestyle queries
            if (this.apiKeys.newsapi) {
                const response = await fetch(`https://newsapi.org/v2/everything?q=wellness OR "personal development" OR "lifestyle trends"&language=en&sortBy=publishedAt&apiKey=${this.apiKeys.newsapi}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.articles?.slice(0, 6).map(article => ({
                        title: article.title,
                        description: article.description || 'Wellness and lifestyle insights for better living.',
                        url: article.url,
                        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
                        publishedAt: article.publishedAt,
                        source: article.source?.name || 'Lifestyle News',
                        category: 'lifestyle'
                    })) || [];
                }
            }
        } catch (error) {
            console.warn('Wellness fetch failed:', error);
        }
        return [];
    }

    /**
     * Fetch travel lifestyle news
     */
    async fetchLifestyleFromBuzzFeed() {
        try {
            // Use NewsAPI with travel and adventure queries
            if (this.apiKeys.newsapi) {
                const response = await fetch(`https://newsapi.org/v2/everything?q=travel OR adventure OR "digital nomad" OR vacation&language=en&sortBy=publishedAt&apiKey=${this.apiKeys.newsapi}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.articles?.slice(0, 8).map(article => ({
                        title: article.title,
                        description: article.description || 'Travel and adventure insights for modern explorers.',
                        url: article.url,
                        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
                        publishedAt: article.publishedAt,
                        source: article.source?.name || 'Travel News',
                        category: 'lifestyle'
                    })) || [];
                }
            }
        } catch (error) {
            console.warn('Travel fetch failed:', error);
        }
        return [];
    }

    /**
     * Fetch food and culinary lifestyle news
     */
    async fetchLifestyleFromRefinery29() {
        try {
            // Use NewsAPI with food and cooking queries
            if (this.apiKeys.newsapi) {
                const response = await fetch(`https://newsapi.org/v2/everything?q=food OR cooking OR recipe OR culinary OR "plant-based"&language=en&sortBy=publishedAt&apiKey=${this.apiKeys.newsapi}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.articles?.slice(0, 5).map(article => ({
                        title: article.title,
                        description: article.description || 'Food and culinary trends for modern living.',
                        url: article.url,
                        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
                        publishedAt: article.publishedAt,
                        source: article.source?.name || 'Food News',
                        category: 'lifestyle'
                    })) || [];
                }
            }
        } catch (error) {
            console.warn('Food fetch failed:', error);
        }
        return [];
    }

    /**
     * Fetch relationship and social lifestyle news
     */
    async fetchLifestyleFromWellAndGood() {
        try {
            // Use NewsAPI with relationship and social queries
            if (this.apiKeys.newsapi) {
                const response = await fetch(`https://newsapi.org/v2/everything?q=relationships OR dating OR "social media" OR "mental health"&language=en&sortBy=publishedAt&apiKey=${this.apiKeys.newsapi}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.articles?.slice(0, 6).map(article => ({
                        title: article.title,
                        description: article.description || 'Relationship and social insights for modern life.',
                        url: article.url,
                        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
                        publishedAt: article.publishedAt,
                        source: article.source?.name || 'Lifestyle News',
                        category: 'lifestyle'
                    })) || [];
                }
            }
        } catch (error) {
            console.warn('Relationship fetch failed:', error);
        }
        return [];
    }

    /**
     * Fetch home and culture lifestyle news
     */
    async fetchLifestyleFromTravelLeisure() {
        try {
            // Use NewsAPI with home design and culture queries
            if (this.apiKeys.newsapi) {
                const response = await fetch(`https://newsapi.org/v2/everything?q="home design" OR "interior design" OR culture OR art&language=en&sortBy=publishedAt&apiKey=${this.apiKeys.newsapi}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.articles?.slice(0, 5).map(article => ({
                        title: article.title,
                        description: article.description || 'Home design and cultural lifestyle insights.',
                        url: article.url,
                        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
                        publishedAt: article.publishedAt,
                        source: article.source?.name || 'Design News',
                        category: 'lifestyle'
                    })) || [];
                }
            }
        } catch (error) {
            console.warn('Home design fetch failed:', error);
        }
        return [];
    }

    /**
     * Fetch beauty and fashion lifestyle news
     */
    async fetchLifestyleFromFoodNetwork() {
        try {
            // Use NewsAPI with beauty and fashion queries
            if (this.apiKeys.newsapi) {
                const response = await fetch(`https://newsapi.org/v2/everything?q=beauty OR skincare OR makeup OR "sustainable fashion"&language=en&sortBy=publishedAt&apiKey=${this.apiKeys.newsapi}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.articles?.slice(0, 5).map(article => ({
                        title: article.title,
                        description: article.description || 'Beauty and fashion trends for modern lifestyle.',
                        url: article.url,
                        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
                        publishedAt: article.publishedAt,
                        source: article.source?.name || 'Beauty News',
                        category: 'lifestyle'
                    })) || [];
                }
            }
        } catch (error) {
            console.warn('Beauty fetch failed:', error);
        }
        return [];
    }

    /**
     * Fetch fitness and health lifestyle news
     */
    async fetchLifestyleFromArchDigest() {
        try {
            // Use NewsAPI with fitness and health queries
            if (this.apiKeys.newsapi) {
                const response = await fetch(`https://newsapi.org/v2/everything?q=fitness OR exercise OR "healthy living" OR nutrition&language=en&sortBy=publishedAt&apiKey=${this.apiKeys.newsapi}`);
                if (response.ok) {
                    const data = await response.json();
                    return data.articles?.slice(0, 4).map(article => ({
                        title: article.title,
                        description: article.description || 'Fitness and health insights for active lifestyle.',
                        url: article.url,
                        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
                        publishedAt: article.publishedAt,
                        source: article.source?.name || 'Health News',
                        category: 'lifestyle'
                    })) || [];
                }
            }
        } catch (error) {
            console.warn('Fitness fetch failed:', error);
        }
        return [];
    }

    /**
     * Get comprehensive lifestyle sample articles - DISABLED
     */
    getLifestyleSampleArticles(limit = 20, source = 'Lifestyle News') {
        // Return empty array - only real-time news should be displayed
        return [];
    }

    /**
     * Get lifestyle-related images
     */
    getLifestyleImage(category) {
        const lifestyleImages = {
            'health': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
            'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
            'travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
            'food': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
            'relationships': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
            'development': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            'culture': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
            'home': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
            'wellness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
            'community': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400'
        };
        
        return lifestyleImages[category] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400';
    }

    /**
     * Generate time range for articles
     */
    generateTimeRange(count) {
        const timeOffsets = [];
        for (let i = 0; i < count; i++) {
            timeOffsets.push(i * 1.5); // 1.5 hours apart
        }
        return timeOffsets;
    }

    /**
     * Get time from offset
     */
    getTimeFromOffset(hoursAgo) {
        return new Date(Date.now() - (hoursAgo * 60 * 60 * 1000)).toISOString();
    }

    /**
     * Fallback method for original Kenya news fetching
     */
    async fetchOriginalKenyaNews(limit) {
        try {
            const promises = [
                this.fetchFromGNews('kenya', limit),
                this.fetchFromNewsData('kenya', limit),
                this.fetchFromNewsAPI('kenya', limit),
                this.fetchFromMediastack('kenya', limit),
                this.fetchFromCurrentsAPI('kenya', limit)
            ];

            const results = await Promise.allSettled(promises);
            
            let allArticles = [];
            results.forEach((result) => {
                if (result.status === 'fulfilled' && result.value) {
                    allArticles = allArticles.concat(result.value);
                }
            });

            const uniqueArticles = this.removeDuplicates(allArticles);
            return uniqueArticles.sort((a, b) => 
                new Date(b.publishedAt) - new Date(a.publishedAt)
            );
        } catch (error) {
            console.error('Original Kenya news fetch error:', error);
            return this.getSampleArticles('kenya', 'Enhanced Kenya News');
        }
    }

    // Health News Source Methods

    /**
     * Fetch from Medical News Today
     */
    async fetchFromMedicalNewsToday() {
        try {
            // TODO: Implement actual Medical News Today RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Medical News Today: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('Medical News Today fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Healthline
     */
    async fetchFromHealthline() {
        try {
            // TODO: Implement actual Healthline RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Healthline: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('Healthline fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from WebMD News
     */
    async fetchFromWebMDNews() {
        try {
            // TODO: Implement actual WebMD News RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('WebMD News: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('WebMD fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from ScienceDaily Health Section
     */
    async fetchFromScienceDailyHealth() {
        try {
            // TODO: Implement actual ScienceDaily Health RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('ScienceDaily Health: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('ScienceDaily Health fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from WHO News
     */
    async fetchFromWHONews() {
        try {
            // TODO: Implement actual WHO News RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('WHO News: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('WHO News fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from CDC Newsroom
     */
    async fetchFromCDCNewsroom() {
        try {
            // TODO: Implement actual CDC Newsroom RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('CDC Newsroom: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('CDC Newsroom fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from The Lancet News
     */
    async fetchFromTheLancetNews() {
        try {
            // TODO: Implement actual The Lancet News RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('The Lancet News: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('The Lancet fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from BBC Health
     */
    async fetchFromBBCHealth() {
        try {
            // TODO: Implement actual BBC Health RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('BBC Health: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('BBC Health fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Harvard Health Blog
     */
    async fetchFromHarvardHealthBlog() {
        try {
            // TODO: Implement actual Harvard Health Blog RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Harvard Health Blog: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('Harvard Health fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Reuters Health
     */
    async fetchFromReutersHealth() {
        try {
            // TODO: Implement actual Reuters Health RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Reuters Health: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('Reuters Health fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Mayo Clinic News
     */
    async fetchFromMayoClinicNews() {
        try {
            // TODO: Implement actual Mayo Clinic News RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Mayo Clinic News: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('Mayo Clinic fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Johns Hopkins Health News
     */
    async fetchFromJohnsHopkinsHealth() {
        try {
            // TODO: Implement actual Johns Hopkins Health News RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Johns Hopkins Health News: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('Johns Hopkins fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from NIH News
     */
    async fetchFromNIHNews() {
        try {
            // TODO: Implement actual NIH News RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('NIH News: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('NIH fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Nature Health
     */
    async fetchFromNatureHealth() {
        try {
            // TODO: Implement actual Nature Health RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Nature Health: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('Nature Health fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from PubMed News
     */
    async fetchFromPubMedNews() {
        try {
            // TODO: Implement actual PubMed News RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('PubMed News: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('PubMed fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Medscape News
     */
    async fetchFromMedscapeNews() {
        try {
            // TODO: Implement actual Medscape News RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Medscape News: Real-time health news integration pending');
            return [];
        } catch (error) {
            console.error('Medscape fetch error:', error);
            return [];
        }
    }

    // Enhanced Entertainment News Source Methods

    /**
     * Fetch from Variety
     */
    async fetchEntertainmentFromVariety() {
        try {
            const rssUrl = 'https://variety.com/feed';
            const articles = await this.fetchRSSFeed(rssUrl, 'Variety');
            return articles.filter(article => 
                article.title.toLowerCase().includes('entertainment') ||
                article.title.toLowerCase().includes('film') ||
                article.title.toLowerCase().includes('tv') ||
                article.title.toLowerCase().includes('music') ||
                article.title.toLowerCase().includes('celebrity')
            );
        } catch (error) {
            console.error('Variety fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Hollywood Reporter
     */
    async fetchEntertainmentFromHollywoodReporter() {
        try {
            const rssUrl = 'https://www.hollywoodreporter.com/feed';
            const articles = await this.fetchRSSFeed(rssUrl, 'Hollywood Reporter');
            return articles.filter(article => 
                article.title.toLowerCase().includes('entertainment') ||
                article.title.toLowerCase().includes('film') ||
                article.title.toLowerCase().includes('tv') ||
                article.title.toLowerCase().includes('music') ||
                article.title.toLowerCase().includes('celebrity')
            );
        } catch (error) {
            console.error('Hollywood Reporter fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Deadline
     */
    async fetchEntertainmentFromDeadline() {
        try {
            const rssUrl = 'https://deadline.com/feed';
            const articles = await this.fetchRSSFeed(rssUrl, 'Deadline');
            return articles.filter(article => 
                article.title.toLowerCase().includes('entertainment') ||
                article.title.toLowerCase().includes('film') ||
                article.title.toLowerCase().includes('tv') ||
                article.title.toLowerCase().includes('music') ||
                article.title.toLowerCase().includes('celebrity')
            );
        } catch (error) {
            console.error('Deadline fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Entertainment Weekly
     */
    async fetchEntertainmentFromEntertainmentWeekly() {
        try {
            const rssUrl = 'https://ew.com/feed';
            const articles = await this.fetchRSSFeed(rssUrl, 'Entertainment Weekly');
            return articles.filter(article => 
                article.title.toLowerCase().includes('entertainment') ||
                article.title.toLowerCase().includes('film') ||
                article.title.toLowerCase().includes('tv') ||
                article.title.toLowerCase().includes('music') ||
                article.title.toLowerCase().includes('celebrity')
            );
        } catch (error) {
            console.error('Entertainment Weekly fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Rolling Stone
     */
    async fetchEntertainmentFromRollingStone() {
        try {
            const rssUrl = 'https://www.rollingstone.com/feed';
            const articles = await this.fetchRSSFeed(rssUrl, 'Rolling Stone');
            return articles.filter(article => 
                article.title.toLowerCase().includes('entertainment') ||
                article.title.toLowerCase().includes('film') ||
                article.title.toLowerCase().includes('tv') ||
                article.title.toLowerCase().includes('music') ||
                article.title.toLowerCase().includes('celebrity')
            );
        } catch (error) {
            console.error('Rolling Stone fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Billboard
     */
    async fetchEntertainmentFromBillboard() {
        try {
            const rssUrl = 'https://www.billboard.com/feed';
            const articles = await this.fetchRSSFeed(rssUrl, 'Billboard');
            return articles.filter(article => 
                article.title.toLowerCase().includes('entertainment') ||
                article.title.toLowerCase().includes('film') ||
                article.title.toLowerCase().includes('tv') ||
                article.title.toLowerCase().includes('music') ||
                article.title.toLowerCase().includes('celebrity')
            );
        } catch (error) {
            console.error('Billboard fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Pitchfork
     */
    async fetchEntertainmentFromPitchfork() {
        try {
            const rssUrl = 'https://pitchfork.com/feed';
            const articles = await this.fetchRSSFeed(rssUrl, 'Pitchfork');
            return articles.filter(article => 
                article.title.toLowerCase().includes('entertainment') ||
                article.title.toLowerCase().includes('film') ||
                article.title.toLowerCase().includes('tv') ||
                article.title.toLowerCase().includes('music') ||
                article.title.toLowerCase().includes('celebrity')
            );
        } catch (error) {
            console.error('Pitchfork fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from NME
     */
    async fetchEntertainmentFromNME() {
        try {
            const rssUrl = 'https://www.nme.com/feed';
            const articles = await this.fetchRSSFeed(rssUrl, 'NME');
            return articles.filter(article => 
                article.title.toLowerCase().includes('entertainment') ||
                article.title.toLowerCase().includes('film') ||
                article.title.toLowerCase().includes('tv') ||
                article.title.toLowerCase().includes('music') ||
                article.title.toLowerCase().includes('celebrity')
            );
        } catch (error) {
            console.error('NME fetch error:', error);
            return [];
        }
    }

    // Enhanced World News Source Methods

    /**
     * Fetch from BBC World
     */
    async fetchWorldFromBBC() {
        try {
            const rssUrl = 'https://feeds.bbci.co.uk/news/world/rss.xml';
            const articles = await this.fetchRSSFeed(rssUrl, 'BBC World');
            return articles.filter(article => 
                article.title.toLowerCase().includes('world') ||
                article.title.toLowerCase().includes('international') ||
                article.title.toLowerCase().includes('global')
            );
        } catch (error) {
            console.error('BBC World fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Reuters World
     */
    async fetchWorldFromReuters() {
        try {
            const rssUrl = 'https://feeds.reuters.com/reuters/worldNews';
            const articles = await this.fetchRSSFeed(rssUrl, 'Reuters World');
            return articles.filter(article => 
                article.title.toLowerCase().includes('world') ||
                article.title.toLowerCase().includes('international') ||
                article.title.toLowerCase().includes('global')
            );
        } catch (error) {
            console.error('Reuters World fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Associated Press World
     */
    async fetchWorldFromAP() {
        try {
            const rssUrl = 'https://feeds.apnews.com/rss/apf-worldnews';
            const articles = await this.fetchRSSFeed(rssUrl, 'Associated Press World');
            return articles.filter(article => 
                article.title.toLowerCase().includes('world') ||
                article.title.toLowerCase().includes('international') ||
                article.title.toLowerCase().includes('global')
            );
        } catch (error) {
            console.error('Associated Press World fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Al Jazeera
     */
    async fetchWorldFromAlJazeera() {
        try {
            const rssUrl = 'https://www.aljazeera.com/xml/rss/all.xml';
            const articles = await this.fetchRSSFeed(rssUrl, 'Al Jazeera');
            return articles.filter(article => 
                article.title.toLowerCase().includes('world') ||
                article.title.toLowerCase().includes('international') ||
                article.title.toLowerCase().includes('global')
            );
        } catch (error) {
            console.error('Al Jazeera fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from France 24
     */
    async fetchWorldFromFrance24() {
        try {
            const rssUrl = 'https://www.france24.com/en/rss';
            const articles = await this.fetchRSSFeed(rssUrl, 'France 24');
            return articles.filter(article => 
                article.title.toLowerCase().includes('world') ||
                article.title.toLowerCase().includes('international') ||
                article.title.toLowerCase().includes('global')
            );
        } catch (error) {
            console.error('France 24 fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Deutsche Welle
     */
    async fetchWorldFromDW() {
        try {
            const rssUrl = 'https://rss.dw.com/xml/rss-en-all';
            const articles = await this.fetchRSSFeed(rssUrl, 'Deutsche Welle');
            return articles.filter(article => 
                article.title.toLowerCase().includes('world') ||
                article.title.toLowerCase().includes('international') ||
                article.title.toLowerCase().includes('global')
            );
        } catch (error) {
            console.error('Deutsche Welle fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Euronews
     */
    async fetchWorldFromEuronews() {
        try {
            const rssUrl = 'https://www.euronews.com/rss';
            const articles = await this.fetchRSSFeed(rssUrl, 'Euronews');
            return articles.filter(article => 
                article.title.toLowerCase().includes('world') ||
                article.title.toLowerCase().includes('international') ||
                article.title.toLowerCase().includes('global')
            );
        } catch (error) {
            console.error('Euronews fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from CNN World
     */
    async fetchWorldFromCNN() {
        try {
            const rssUrl = 'https://rss.cnn.com/rss/edition_world.rss';
            const articles = await this.fetchRSSFeed(rssUrl, 'CNN World');
            return articles.filter(article => 
                article.title.toLowerCase().includes('world') ||
                article.title.toLowerCase().includes('international') ||
                article.title.toLowerCase().includes('global')
            );
        } catch (error) {
            console.error('CNN World fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from NPR World
     */
    async fetchWorldFromNPR() {
        try {
            const rssUrl = 'https://feeds.npr.org/1004/rss.xml';
            const articles = await this.fetchRSSFeed(rssUrl, 'NPR World');
            return articles.filter(article => 
                article.title.toLowerCase().includes('world') ||
                article.title.toLowerCase().includes('international') ||
                article.title.toLowerCase().includes('global')
            );
        } catch (error) {
            console.error('NPR World fetch error:', error);
            return [];
        }
    }

    /**
     * Preload category data for faster subsequent loads
     */
    preloadCategory(category, limit = 20) {
        // Preload in background without blocking UI
        setTimeout(async () => {
            try {
                const cacheKey = `${category}_${limit}`;
                if (!this.cache.has(cacheKey)) {
                    console.log(`Preloading ${category} for faster future loads`);
                    const data = await this.fetchNewsInternal(category, limit);
                    this.cache.set(cacheKey, {
                        data: data,
                        timestamp: Date.now()
                    });
                }
            } catch (error) {
                console.warn(`Preload failed for ${category}:`, error);
            }
        }, 100);
    }

    /**
     * Internal fetch method for preloading
     */
    async fetchNewsInternal(category, limit = 20) {
        // Simplified fetch without cache check for preloading
        try {
            if (category === 'kenya') {
                return await this.fetchEnhancedKenyaNews(limit);
            } else if (category === 'technology') {
                return await this.fetchEnhancedTechnologyNews(limit);
            } else if (category === 'health') {
                return await this.fetchEnhancedHealthNews(limit);
            } else if (category === 'sports') {
                return await this.fetchEnhancedSportsNews(limit);
            } else if (category === 'lifestyle') {
                return await this.fetchEnhancedLifestyleNews(limit);
            } else if (category === 'entertainment') {
                return await this.fetchEnhancedEntertainmentNews(limit);
            } else if (category === 'world') {
                return await this.fetchEnhancedWorldNews(limit);
            } else {
                // Default API calls
                const promises = [
                    this.fetchFromGNews(category, limit),
                    this.fetchFromNewsData(category, limit),
                    this.fetchFromNewsAPI(category, limit),
                    this.fetchFromMediastack(category, limit),
                    this.fetchFromCurrentsAPI(category, limit)
                ];

                const results = await Promise.allSettled(promises);
                
                let allArticles = [];
                results.forEach((result) => {
                    if (result.status === 'fulfilled' && result.value) {
                        allArticles = allArticles.concat(result.value);
                    }
                });

                const uniqueArticles = this.removeDuplicates(allArticles);
                return uniqueArticles.sort((a, b) => 
                    new Date(b.publishedAt) - new Date(a.publishedAt)
                );
            }
        } catch (error) {
            console.error('Internal fetch error:', error);
            return [];
        }
    }

    // Enhanced Sports News Source Methods

    /**
     * Fetch from Sky Sports
     */
    async fetchFromSkySports() {
        try {
            // TODO: Implement actual Sky Sports RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Sky Sports: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('Sky Sports fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from BBC Sport
     */
    async fetchFromBBCSport() {
        try {
            // TODO: Implement actual BBC Sport RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('BBC Sport: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('BBC Sport fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from CBS Sports
     */
    async fetchFromCBSSports() {
        try {
            // TODO: Implement actual CBS Sports RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('CBS Sports: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('CBS Sports fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Yahoo Sports
     */
    async fetchFromYahooSports() {
        try {
            // TODO: Implement actual Yahoo Sports RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Yahoo Sports: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('Yahoo Sports fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Goal.com
     */
    async fetchFromGoalDotCom() {
        try {
            // TODO: Implement actual Goal.com RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Goal.com: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('Goal.com fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Bleacher Report
     */
    async fetchFromBleacherReport() {
        try {
            // TODO: Implement actual Bleacher Report RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Bleacher Report: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('Bleacher Report fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Sporting News
     */
    async fetchFromSportingNews() {
        try {
            // TODO: Implement actual Sporting News RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Sporting News: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('Sporting News fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from The Guardian Sport
     */
    async fetchFromGuardianSport() {
        try {
            // TODO: Implement actual The Guardian Sport RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('The Guardian Sport: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('The Guardian Sport fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from Fox Sports
     */
    async fetchFromFoxSports() {
        try {
            // TODO: Implement actual Fox Sports RSS/API integration
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Fox Sports: Real-time sports integration pending');
            return [];
        } catch (error) {
            console.error('Fox Sports fetch error:', error);
            return [];
        }
    }
}

// Export for use in other scripts
window.NewsAPI = NewsAPI;
