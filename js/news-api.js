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
     * Fetch news for a specific category from all APIs
     */
    async fetchNews(category, limit = 20) {
        const cacheKey = `${category}_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Enhanced sports coverage with specialized APIs
            if (category === 'sports') {
                return await this.fetchSportsNews(limit);
            }

            // Enhanced lifestyle coverage with specialized content
            if (category === 'lifestyle') {
                return await this.fetchLifestyleNews(limit);
            }



            // Fetch from all APIs simultaneously
            const promises = [
                this.fetchFromGNews(category, limit),
                this.fetchFromNewsData(category, limit),
                this.fetchFromNewsAPI(category, limit),
                this.fetchFromMediastack(category, limit),
                this.fetchFromCurrentsAPI(category, limit)
            ];

            const results = await Promise.allSettled(promises);
            
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
            // Use standard API approach like other categories
            const promises = [
                this.fetchFromGNews('sports', limit),
                this.fetchFromNewsData('sports', limit),
                this.fetchFromNewsAPI('sports', limit),
                this.fetchFromMediastack('sports', limit),
                this.fetchFromCurrentsAPI('sports', limit)
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
            return [];
        }
    }







    /**
     * Lifestyle news fetching - simplified to use standard approach
     */
    async fetchLifestyleNews(limit = 50) {
        const cacheKey = `lifestyle_${limit}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            // Use standard API approach like other categories
            const promises = [
                this.fetchFromGNews('lifestyle', limit),
                this.fetchFromNewsData('lifestyle', limit),
                this.fetchFromNewsAPI('lifestyle', limit),
                this.fetchFromMediastack('lifestyle', limit),
                this.fetchFromCurrentsAPI('lifestyle', limit)
            ];

            const results = await Promise.allSettled(promises);
            
            // Combine results from all APIs
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    allArticles = allArticles.concat(result.value);
                } else {
                    console.warn(`Lifestyle API ${index + 1} failed:`, result.reason);
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
            console.error('Error fetching lifestyle news:', error);
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
            let url = `https://newsdata.io/api/1/news?apikey=${this.apiKeys.newsdata}&language=en&size=${Math.min(limit, 10)}`;
            
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
            let url = `https://newsapi.org/v2/top-headlines?apiKey=${this.apiKeys.newsapi}&pageSize=${Math.min(limit, 20)}`;
            
            if (category === 'kenya') {
                url += '&country=ke';
            } else if (category === 'latest') {
                url += '&country=us'; // Use US for general latest news
            } else if (category === 'world') {
                url = `https://newsapi.org/v2/everything?apiKey=${this.apiKeys.newsapi}&q=international&sortBy=publishedAt&pageSize=${Math.min(limit, 20)}`;
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
            let url = `https://api.mediastack.com/v1/news?access_key=${this.apiKeys.mediastack}&languages=en&limit=${Math.min(limit, 25)}`;
            
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
            let url = `https://api.currentsapi.services/v1/latest-news?apiKey=${this.apiKeys.currentsapi}&language=en&page_size=${Math.min(limit, 20)}`;
            
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
            // TODO: Implement actual RSS feed or API integration for Nation Africa
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Nation Africa: Real-time news integration pending');
            return [];
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
            // TODO: Implement actual RSS feed or API integration for The Standard
            // For now, return empty array to ensure only real-time news is displayed
            console.log('The Standard: Real-time news integration pending');
            return [];
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
            // TODO: Implement actual RSS feed or API integration for Capital FM
            // For now, return empty array to ensure only real-time news is displayed
            console.log('Capital FM: Real-time news integration pending');
            return [];
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
            'lifestyle': 'Lifestyle',
            
            'travel': 'Travel'
        };
        return names[category] || 'News';
    }

    /**
     * Get sample articles for fallback when APIs fail
     */
    getSampleArticles(category, source = 'News API') {
        // Return empty arrays for Kenya, sports, health, and technology categories to ensure only real-time news
        if (category === 'kenya' || category === 'sports' || category === 'health' || category === 'technology') {
            return [];
        }

        // Use extended articles database for comprehensive fallback
        if (typeof ExtendedArticlesDB !== 'undefined') {
            const extendedDB = new ExtendedArticlesDB();
            switch(category) {
                case 'latest':
                    return extendedDB.getExtendedLatestNews(source);
                case 'world':
                    return extendedDB.getExtendedWorldNews(source);
                case 'entertainment':
                    return extendedDB.getExtendedEntertainmentNews(source);
                case 'technology':
                    return extendedDB.getExtendedTechnologyNews(source);
                case 'business':
                    return extendedDB.getExtendedBusinessNews(source);
                case 'lifestyle':
                    return extendedDB.getExtendedLifestyleNews(source);
                default:
                    return extendedDB.getExtendedLatestNews(source);
            }
        }
        
        // Fallback to basic articles if extended DB not available
        const baseArticles = {
            latest: [
                {
                    title: "Global Climate Summit Reaches Historic Agreement",
                    description: "World leaders from 195 countries have reached a groundbreaking climate agreement at the COP30 summit, committing to ambitious carbon reduction targets for 2030. The comprehensive deal includes unprecedented funding for renewable energy transition in developing nations, with $500 billion pledged over the next decade. Key provisions include mandatory carbon pricing, accelerated phase-out of fossil fuels, and innovative carbon capture technologies. Environmental scientists praise the agreement as the most significant climate action since the Paris Accord, with potential to limit global warming to 1.5°C above pre-industrial levels.",
                    url: "https://example.com/climate-summit",
                    urlToImage: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400",
                    publishedAt: new Date().toISOString(),
                    source: source,
                    category: "general"
                },
                {
                    title: "Tech Innovation Breakthrough in Quantum Computing",
                    description: "Researchers at MIT and Google have achieved a revolutionary breakthrough in quantum computing, successfully demonstrating quantum supremacy in practical applications. The new quantum processor can solve complex problems in minutes that would take classical computers thousands of years. This advancement has immediate implications for cryptography, drug discovery, financial modeling, and artificial intelligence. The team overcame previous limitations in quantum coherence and error correction, making quantum computers more stable and practical for real-world use. Industry experts predict this could accelerate the development of quantum internet and transform multiple sectors including healthcare, finance, and cybersecurity.",
                    url: "https://example.com/quantum-computing",
                    urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
                    publishedAt: new Date(Date.now() - 3600000).toISOString(),
                    source: source,
                    category: "technology"
                },
                {
                    title: "International Trade Relations Show Positive Trends",
                    description: "Global trade relationships are showing remarkable improvement as major economies report increased cooperation and reduced trade barriers. Recent data indicates a 15% increase in international trade volumes compared to last year, with emerging markets leading the growth. The World Trade Organization highlights successful resolution of several long-standing trade disputes, including breakthrough agreements between the US and China, EU and Asia-Pacific nations. New bilateral trade agreements have simplified customs procedures, reduced tariffs on essential goods, and established stronger supply chain partnerships. Economic analysts project continued growth momentum, with particular strength in technology exports, renewable energy equipment, and sustainable manufacturing goods.",
                    url: "https://example.com/trade-relations",
                    urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
                    publishedAt: new Date(Date.now() - 7200000).toISOString(),
                    source: source,
                    category: "business"
                },
                {
                    title: "Revolutionary Medical Discovery Changes Treatment Approach",
                    description: "Medical researchers have developed a groundbreaking therapeutic approach that shows unprecedented success in treating previously incurable neurological conditions. The innovative treatment combines gene therapy with advanced nanotechnology to repair damaged neural pathways, offering hope for millions of patients with Alzheimer's, Parkinson's, and spinal cord injuries. Clinical trials involving 500 patients showed remarkable recovery rates, with 78% experiencing significant improvement in cognitive function and motor skills. The therapy works by delivering targeted genetic instructions directly to affected brain cells, promoting regeneration and restoration of normal function. Leading neurologists describe this as the most significant medical breakthrough in decades, potentially transforming treatment for neurodegenerative diseases.",
                    url: "https://example.com/medical-discovery",
                    urlToImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
                    publishedAt: new Date(Date.now() - 10800000).toISOString(),
                    source: source,
                    category: "health"
                },
                {
                    title: "Space Exploration Mission Discovers Potential Water Sources",
                    description: "NASA's Perseverance rover has made a remarkable discovery on Mars, identifying substantial underground water reservoirs that could support future human missions and potentially harbor signs of ancient microbial life. Advanced ground-penetrating radar revealed vast aquifers located 30-50 meters below the Martian surface, containing an estimated 1 million cubic meters of water ice. The discovery was made in the Jezero Crater region, where the rover also found evidence of ancient river deltas and lake beds. Scientists believe these water sources could provide drinking water, oxygen production, and rocket fuel for future Mars colonies. The finding significantly advances plans for human Mars missions, potentially reducing the need to transport water from Earth and making long-term Mars settlements more feasible.",
                    url: "https://example.com/mars-water",
                    urlToImage: "https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?w=400",
                    publishedAt: new Date(Date.now() - 14400000).toISOString(),
                    source: source,
                    category: "technology"
                },
                {
                    title: "Global Economic Recovery Shows Momentum",
                    description: "International markets demonstrate resilience as employment rates improve across major economies.",
                    url: "https://example.com/economic-recovery",
                    urlToImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
                    publishedAt: new Date(Date.now() - 18000000).toISOString(),
                    source: source,
                    category: "business"
                },
                {
                    title: "Artificial Intelligence Ethics Framework Established",
                    description: "International consortium develops comprehensive guidelines for responsible AI development and deployment.",
                    url: "https://example.com/ai-ethics",
                    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
                    publishedAt: new Date(Date.now() - 21600000).toISOString(),
                    source: source,
                    category: "technology"
                },
                {
                    title: "Cultural Heritage Preservation Initiative Expands Globally",
                    description: "UNESCO launches ambitious program to digitally preserve world's most endangered cultural sites.",
                    url: "https://example.com/heritage-preservation",
                    urlToImage: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400",
                    publishedAt: new Date(Date.now() - 25200000).toISOString(),
                    source: source,
                    category: "general"
                },
                {
                    title: "Ocean Cleanup Technology Shows Remarkable Results",
                    description: "Advanced filtration systems successfully remove millions of tons of plastic from ocean waters.",
                    url: "https://example.com/ocean-cleanup",
                    urlToImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
                    publishedAt: new Date(Date.now() - 28800000).toISOString(),
                    source: source,
                    category: "general"
                },
                {
                    title: "Educational Technology Transforms Learning Outcomes",
                    description: "Digital learning platforms demonstrate significant improvement in student engagement and academic performance.",
                    url: "https://example.com/education-tech",
                    urlToImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
                    publishedAt: new Date(Date.now() - 32400000).toISOString(),
                    source: source,
                    category: "technology"
                }
            ],
            kenya: [],
            world: [
                {
                    title: "European Union Announces New Digital Policy Framework",
                    description: "Comprehensive digital regulations aim to balance innovation with user privacy and security.",
                    url: "https://example.com/eu-digital-policy",
                    urlToImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
                    publishedAt: new Date().toISOString(),
                    source: source,
                    category: "general"
                },
                {
                    title: "Asian Markets React to New Economic Policies",
                    description: "Stock markets across Asia show mixed reactions to latest government economic initiatives.",
                    url: "https://example.com/asian-markets",
                    urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
                    publishedAt: new Date(Date.now() - 2700000).toISOString(),
                    source: source,
                    category: "business"
                }
            ],
            entertainment: [
                {
                    title: "Hollywood Stars Unite for Environmental Awareness Campaign",
                    description: "A coalition of A-list celebrities including Leonardo DiCaprio, Emma Stone, and Ryan Reynolds have launched an unprecedented environmental awareness campaign that combines entertainment with climate action. The initiative features a series of original documentaries, music videos, and interactive digital content designed to educate audiences about climate change while providing practical solutions for sustainable living. Major studios have committed to carbon-neutral production practices, with Warner Bros, Disney, and Netflix pledging to achieve net-zero emissions by 2025. The campaign includes partnerships with environmental organizations, sustainable fashion brands, and clean energy companies. Celebrity participants are using their combined social media reach of over 500 million followers to promote environmental consciousness, making this one of the most impactful celebrity-driven environmental initiatives in entertainment history.",
                    url: "https://example.com/hollywood-environment",
                    urlToImage: "https://images.unsplash.com/photo-1489599162717-1cbee3d4df79?w=400",
                    publishedAt: new Date().toISOString(),
                    source: source,
                    category: "entertainment"
                },
                {
                    title: "Streaming Wars: New Platform Launches with Original Content",
                    description: "Apple TV+ has unveiled its most ambitious content strategy yet, announcing a $15 billion investment in original programming over the next three years to compete with Netflix, Disney+, and Amazon Prime Video. The platform will feature exclusive series from renowned directors including Christopher Nolan, Greta Gerwig, and Jordan Peele, along with star-studded productions featuring Tom Hanks, Margot Robbie, and Denzel Washington. The streaming service is also pioneering innovative viewing experiences with interactive content, virtual reality integration, and AI-powered personalization features. Industry analysts predict this massive investment could reshape the streaming landscape, with Apple's superior technology infrastructure and global reach potentially challenging established players. The move reflects the increasingly competitive nature of the streaming market, where original content has become the key differentiator for subscriber acquisition and retention.",
                    url: "https://example.com/streaming-wars",
                    urlToImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400",
                    publishedAt: new Date(Date.now() - 1800000).toISOString(),
                    source: source,
                    category: "entertainment"
                }
            ],
            technology: [],
            business: [
                {
                    title: "Global Supply Chain Resilience Improves",
                    description: "Companies report better preparedness for disruptions following strategic infrastructure investments.",
                    url: "https://example.com/supply-chain",
                    urlToImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
                    publishedAt: new Date().toISOString(),
                    source: source,
                    category: "business"
                },
                {
                    title: "Renewable Energy Investment Hits Record High",
                    description: "Corporate investment in renewable energy projects reaches unprecedented levels globally.",
                    url: "https://example.com/renewable-investment",
                    urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
                    publishedAt: new Date(Date.now() - 2700000).toISOString(),
                    source: source,
                    category: "business"
                }
            ],
            sports: [],
            health: []
        };

        // Return empty array - only real-time news should be displayed
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
