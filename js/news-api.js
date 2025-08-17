/**
 * News API Integration for Brightlens News
 * Handles fetching news from multiple APIs simultaneously
 */

class NewsAPI {
    constructor() {
        // API Keys from environment or fallback defaults
        this.apiKeys = {
            gnews: (window.NEWS_CONFIG && window.NEWS_CONFIG.gnews) || '9db0da87512446db08b82d4f63a4ba8d',
            newsdata: (window.NEWS_CONFIG && window.NEWS_CONFIG.newsdata) || 'pub_d74b96fd4a9041d59212493d969368cd',
            newsapi: (window.NEWS_CONFIG && window.NEWS_CONFIG.newsapi) || '9fcf10b2fd0c48c7a1886330ebb04385',
            mediastack: (window.NEWS_CONFIG && window.NEWS_CONFIG.mediastack) || '4e53cf0fa35eefaac21cd9f77925b8f5',
            currentsapi: (window.NEWS_CONFIG && window.NEWS_CONFIG.currentsapi) || '9tI-4kOmMlJdgcosDUBsYYZDAnkLnuuL4Hrgc5TKlHmN_AMH'
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
        this.cacheTimeout = 2 * 60 * 1000; // 2 minutes for fresher real-time updates
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
        // Preload next category burst to smooth subsequent navigation
        this.preloadCategory(category, Math.min(limit, 60));

        try {
            // Enhanced category-specific news fetching with optimized loading
            if (category === 'sports') {
                return await this.fetchEnhancedSportsNews(limit);
            }

            if (category === 'lifestyle') {
                return await this.fetchEnhancedLifestyleNews(limit);
            }

            if (category === 'kenya') {
                return await this.fetchEnhancedKenyaNews(limit);
            }

            if (category === 'technology') {
                return await this.fetchEnhancedTechnologyNews(limit);
            }

            if (category === 'health') {
                return await this.fetchEnhancedHealthNews(limit);
            }

            if (category === 'entertainment') {
                return await this.fetchEnhancedEntertainmentNews(limit);
            }

            if (category === 'world') {
                return await this.fetchEnhancedWorldNews(limit);
            }

            // Fetch from all APIs simultaneously with optimized timeout
            const promises = [
                this.fetchFromGNews(category, Math.ceil(limit * 0.25)),
                this.fetchFromNewsData(category, Math.ceil(limit * 0.25)),
                this.fetchFromNewsAPI(category, Math.ceil(limit * 0.25)),
                this.fetchFromMediastack(category, Math.ceil(limit * 0.25)),
                this.fetchFromCurrentsAPI(category, Math.ceil(limit * 0.25))
            ];

            // Add REAL RSS feeds for ALL categories - ACTUAL REAL-TIME CONTENT
            if (category === 'breaking') {
                // Breaking news RSS feeds
                promises.push(
                    this.fetchRSSFeed('https://feeds.bbci.co.uk/news/rss.xml', 'BBC News'),
                    this.fetchRSSFeed('https://rss.cnn.com/rss/edition.rss', 'CNN'),
                    this.fetchRSSFeed('https://feeds.reuters.com/reuters/topNews', 'Reuters'),
                    this.fetchRSSFeed('https://feeds.npr.org/1001/rss.xml', 'NPR'),
                    this.fetchRSSFeed('https://feeds.apnews.com/rss/apf-topnews', 'Associated Press'),
                    this.fetchRSSFeed('https://www.theguardian.com/world/rss', 'The Guardian'),
                    this.fetchRSSFeed('https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml', 'New York Times'),
                    this.fetchRSSFeed('https://www.washingtonpost.com/world/?outputType=rss', 'Washington Post'),
                    this.fetchRSSFeed('https://www.latimes.com/world/rss2.0.xml', 'Los Angeles Times'),
                    this.fetchRSSFeed('https://www.abc.net.au/news/rss.xml', 'ABC News'),
                    this.fetchRSSFeed('https://www.cbc.ca/cmlink/rss-topstories', 'CBC News'),
                    this.fetchRSSFeed('https://www.aljazeera.com/xml/rss/all.xml', 'Al Jazeera'),
                    this.fetchRSSFeed('https://www.france24.com/en/rss', 'France 24'),
                    this.fetchRSSFeed('https://rss.dw.com/xml/rss-en-all', 'Deutsche Welle')
                );
            } else if (category === 'health') {
                // Health news RSS feeds - using known working feeds
                promises.push(
                    this.fetchRSSFeed('https://feeds.bbci.co.uk/news/health/rss.xml', 'BBC Health'),
                    this.fetchRSSFeed('https://www.reuters.com/health/rss', 'Reuters Health'),
                    this.fetchRSSFeed('https://www.medicalnewstoday.com/rss.xml', 'Medical News Today'),
                    this.fetchRSSFeed('https://www.healthline.com/rss/all', 'Healthline'),
                    this.fetchRSSFeed('https://www.webmd.com/news/rss/default.xml', 'WebMD'),
                    this.fetchRSSFeed('https://www.sciencedaily.com/rss/health_medicine.xml', 'Science Daily Health'),
                    this.fetchRSSFeed('https://www.who.int/rss-feeds/news-english.xml', 'WHO News'),
                    this.fetchRSSFeed('https://www.cdc.gov/rss/news.xml', 'CDC Newsroom'),
                    this.fetchRSSFeed('https://www.nature.com/subjects/health-sciences.rss', 'Nature Health'),
                    this.fetchRSSFeed('https://www.mayoclinic.org/rss/news.xml', 'Mayo Clinic News'),
                    this.fetchRSSFeed('https://www.hopkinsmedicine.org/news/rss.xml', 'Johns Hopkins Health'),
                    this.fetchRSSFeed('https://www.nih.gov/news-events/rss-feeds', 'NIH News'),
                    this.fetchRSSFeed('https://www.harvardhealthblog.org/feed/', 'Harvard Health Blog'),
                    this.fetchRSSFeed('https://www.thelancet.com/rssfeed/lancet_current.xml', 'The Lancet'),
                    this.fetchRSSFeed('https://www.medscape.com/rss/public/0_public.xml', 'Medscape'),
                    this.fetchRSSFeed('https://www.pubmed.gov/rss/news.xml', 'PubMed News')
                );
            } else if (category === 'lifestyle') {
                // Lifestyle news RSS feeds
                promises.push(
                    this.fetchRSSFeed('https://www.vogue.com/feed', 'Vogue'),
                    this.fetchRSSFeed('https://www.elle.com/rss/all.xml', 'Elle'),
                    this.fetchRSSFeed('https://www.buzzfeed.com/lifestyle.xml', 'BuzzFeed Lifestyle'),
                    this.fetchRSSFeed('https://www.refinery29.com/rss.xml', 'Refinery29'),
                    this.fetchRSSFeed('https://www.wellandgood.com/feed/', 'Well+Good'),
                    this.fetchRSSFeed('https://www.travelandleisure.com/rss', 'Travel + Leisure'),
                    this.fetchRSSFeed('https://www.foodnetwork.com/rss.xml', 'Food Network'),
                    this.fetchRSSFeed('https://www.architecturaldigest.com/rss', 'Architectural Digest'),
                    this.fetchRSSFeed('https://www.mindbodygreen.com/rss.xml', 'MindBodyGreen'),
                    this.fetchRSSFeed('https://www.self.com/rss.xml', 'SELF'),
                    this.fetchRSSFeed('https://www.cosmopolitan.com/rss/', 'Cosmopolitan'),
                    this.fetchRSSFeed('https://www.glamour.com/rss', 'Glamour'),
                    this.fetchRSSFeed('https://www.health.com/rss/all.xml', 'Health.com'),
                    this.fetchRSSFeed('https://www.shape.com/rss.xml', 'Shape'),
                    this.fetchRSSFeed('https://www.fitness.com/rss', 'Fitness'),
                    this.fetchRSSFeed('https://www.marthastewart.com/rss', 'Martha Stewart'),
                    this.fetchRSSFeed('https://www.realsimple.com/rss', 'Real Simple'),
                    this.fetchRSSFeed('https://www.bhg.com/rss', 'Better Homes & Gardens'),
                    this.fetchRSSFeed('https://www.southernliving.com/rss', 'Southern Living'),
                    this.fetchRSSFeed('https://www.countryliving.com/rss', 'Country Living'),
                    this.fetchRSSFeed('https://www.goodhousekeeping.com/rss', 'Good Housekeeping')
                );
            } else if (category === 'technology') {
                // Technology news RSS feeds
                promises.push(
                    this.fetchRSSFeed('https://techcrunch.com/feed/', 'TechCrunch'),
                    this.fetchRSSFeed('https://www.theverge.com/rss/index.xml', 'The Verge'),
                    this.fetchRSSFeed('https://www.wired.com/feed/rss', 'Wired'),
                    this.fetchRSSFeed('https://feeds.arstechnica.com/arstechnica/index', 'Ars Technica'),
                    this.fetchRSSFeed('https://www.cnet.com/rss/all/', 'CNET'),
                    this.fetchRSSFeed('https://gadgets360.com/rss.xml', 'Gadgets 360'),
                    this.fetchRSSFeed('https://mashable.com/feed.xml', 'Mashable'),
                    this.fetchRSSFeed('https://www.engadget.com/rss.xml', 'Engadget'),
                    this.fetchRSSFeed('https://www.zdnet.com/news/rss.xml', 'ZDNet'),
                    this.fetchRSSFeed('https://feeds.bbci.co.uk/news/technology/rss.xml', 'BBC Technology'),
                    this.fetchRSSFeed('https://www.ign.com/feed.xml', 'IGN'),
                    this.fetchRSSFeed('https://www.gamespot.com/feeds/game-news/', 'GameSpot'),
                    this.fetchRSSFeed('https://www.polygon.com/rss/index.xml', 'Polygon'),
                    this.fetchRSSFeed('https://www.theverge.com/rss/entertainment/index.xml', 'The Verge Entertainment'),
                    this.fetchRSSFeed('https://www.techcrunch.com/feed/', 'TechCrunch Entertainment'),
                    this.fetchRSSFeed('https://www.wired.com/feed/entertainment/rss', 'Wired Entertainment')
                );
            } else if (category === 'entertainment') {
                // Entertainment news RSS feeds
                promises.push(
                    this.fetchRSSFeed('https://variety.com/feed', 'Variety'),
                    this.fetchRSSFeed('https://www.hollywoodreporter.com/feed', 'Hollywood Reporter'),
                    this.fetchRSSFeed('https://deadline.com/feed', 'Deadline'),
                    this.fetchRSSFeed('https://ew.com/feed', 'Entertainment Weekly'),
                    this.fetchRSSFeed('https://www.rollingstone.com/feed', 'Rolling Stone'),
                    this.fetchRSSFeed('https://www.billboard.com/feed', 'Billboard'),
                    this.fetchRSSFeed('https://pitchfork.com/feed', 'Pitchfork'),
                    this.fetchRSSFeed('https://www.nme.com/feed', 'NME'),
                    this.fetchRSSFeed('https://www.mtv.com/rss.xml', 'MTV'),
                    this.fetchRSSFeed('https://www.eonline.com/rss.xml', 'E! Online'),
                    this.fetchRSSFeed('https://www.usmagazine.com/rss.xml', 'US Weekly'),
                    this.fetchRSSFeed('https://www.people.com/rss.xml', 'People'),
                    this.fetchRSSFeed('https://www.tmz.com/rss.xml', 'TMZ'),
                    this.fetchRSSFeed('https://www.etonline.com/rss.xml', 'Entertainment Tonight'),
                    this.fetchRSSFeed('https://www.accesshollywood.com/rss.xml', 'Access Hollywood'),
                    this.fetchRSSFeed('https://www.ign.com/feed.xml', 'IGN'),
                    this.fetchRSSFeed('https://www.gamespot.com/feeds/game-news/', 'GameSpot'),
                    this.fetchRSSFeed('https://www.polygon.com/rss/index.xml', 'Polygon'),
                    this.fetchRSSFeed('https://www.theverge.com/rss/entertainment/index.xml', 'The Verge Entertainment'),
                    this.fetchRSSFeed('https://www.techcrunch.com/feed/', 'TechCrunch Entertainment'),
                    this.fetchRSSFeed('https://www.wired.com/feed/entertainment/rss', 'Wired Entertainment')
                );
            } else if (category === 'world') {
                // World news RSS feeds
                promises.push(
                    this.fetchRSSFeed('https://feeds.bbci.co.uk/news/world/rss.xml', 'BBC World'),
                    this.fetchRSSFeed('https://feeds.reuters.com/reuters/worldNews', 'Reuters World'),
                    this.fetchRSSFeed('https://feeds.apnews.com/rss/apf-worldnews', 'Associated Press World'),
                    this.fetchRSSFeed('https://www.aljazeera.com/xml/rss/all.xml', 'Al Jazeera'),
                    this.fetchRSSFeed('https://www.france24.com/en/rss', 'France 24'),
                    this.fetchRSSFeed('https://rss.dw.com/xml/rss-en-all', 'Deutsche Welle'),
                    this.fetchRSSFeed('https://www.euronews.com/rss', 'Euronews'),
                    this.fetchRSSFeed('https://rss.cnn.com/rss/edition_world.rss', 'CNN World'),
                    this.fetchRSSFeed('https://feeds.npr.org/1004/rss.xml', 'NPR World'),
                    this.fetchRSSFeed('https://www.theguardian.com/world/rss', 'Guardian World'),
                    this.fetchRSSFeed('https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml', 'New York Times World'),
                    this.fetchRSSFeed('https://www.washingtonpost.com/world/?outputType=rss', 'Washington Post World'),
                    this.fetchRSSFeed('https://www.latimes.com/world/rss2.0.xml', 'Los Angeles Times World'),
                    this.fetchRSSFeed('https://www.abc.net.au/news/world/rss.xml', 'ABC World'),
                    this.fetchRSSFeed('https://www.cbc.ca/cmlink/rss-world', 'CBC World'),
                    
                    // Additional world news RSS feeds for comprehensive coverage
                    this.fetchRSSFeed('https://www.lemonde.fr/rss/en_continu.xml', 'Le Monde'),
                    this.fetchRSSFeed('https://www.elpais.com/rss/internacional.xml', 'El País'),
                    this.fetchRSSFeed('https://www.corriere.it/rss/esteri.xml', 'Corriere della Sera'),
                    this.fetchRSSFeed('https://www.spiegel.de/international/index.rss', 'Der Spiegel'),
                    this.fetchRSSFeed('https://www.lefigaro.fr/rss/figaro_international.xml', 'Le Figaro'),
                    this.fetchRSSFeed('https://www.elmundo.es/rss/internacional.xml', 'El Mundo')
                );
            } else if (category === 'kenya') {
                // Kenya news RSS feeds
                promises.push(
                    this.fetchRSSFeed('https://www.nation.co.ke/rss', 'Nation Africa'),
                    this.fetchRSSFeed('https://www.standardmedia.co.ke/rss', 'The Standard'),
                    this.fetchRSSFeed('https://www.capitalfm.co.ke/rss', 'Capital FM'),
                    this.fetchRSSFeed('https://citizentv.co.ke/rss', 'Citizen TV'),
                    this.fetchRSSFeed('https://www.tuko.co.ke/rss', 'Tuko News'),
                    this.fetchRSSFeed('https://www.the-star.co.ke/rss', 'The Star Kenya'),
                    this.fetchRSSFeed('https://www.kbc.co.ke/rss', 'KBC News'),
                    this.fetchRSSFeed('https://www.people.co.ke/rss', 'People Daily'),
                    this.fetchRSSFeed('https://allafrica.com/kenya/rss.xml', 'AllAfrica Kenya'),
                    this.fetchRSSFeed('https://www.bbc.com/news/world/africa/rss.xml', 'BBC Africa'),
                    this.fetchRSSFeed('https://www.businessdailyafrica.com/rss', 'Business Daily'),
                    this.fetchRSSFeed('https://www.ntv.co.ke/rss', 'NTV Kenya'),
                    this.fetchRSSFeed('https://www.ktnnews.co.ke/rss', 'KTN News'),
                    this.fetchRSSFeed('https://www.kenyans.co.ke/rss', 'Kenyans.co.ke'),
                    this.fetchRSSFeed('https://www.nairobinews.co.ke/rss', 'Nairobi News'),
                    this.fetchRSSFeed('https://www.taifa.co.ke/rss', 'Taifa Leo'),
                    this.fetchRSSFeed('https://www.kahawa.co.ke/rss', 'Kahawa Tungu')
                );
            }

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

            // Only return articles if we have real content
            if (sortedArticles.length === 0) {
                console.warn(`No real articles found for ${category}, trying fallback APIs`);
                // Try fallback APIs that are more reliable
                const fallbackArticles = await this.fetchFallbackNews(category, limit);
                if (fallbackArticles.length > 0) {
                    return fallbackArticles;
                }
                return [];
            }

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedArticles,
                timestamp: Date.now()
            });

            return sortedArticles;
        } catch (error) {
            console.error('Error fetching news:', error);
            return [];
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
            // Fetch from multiple sources including working APIs and RSS feeds
            const promises = [
                // Regular news APIs with sports category - INCREASED LIMITS
                this.fetchFromGNews('sports', Math.floor(limit * 0.3)),
                this.fetchFromNewsData('sports', Math.floor(limit * 0.3)),
                this.fetchFromNewsAPI('sports', Math.floor(limit * 0.3)),
                this.fetchFromMediastack('sports', Math.floor(limit * 0.3)),
                this.fetchFromCurrentsAPI('sports', Math.floor(limit * 0.3)),
                
                // REAL RSS feeds for sports - ACTUAL REAL-TIME CONTENT
                this.fetchRSSFeed('https://feeds.bbci.co.uk/sport/rss.xml', 'BBC Sport'),
                this.fetchRSSFeed('https://www.espn.com/espn/rss/news', 'ESPN'),
                this.fetchRSSFeed('https://www.skysports.com/rss/0,20514,11661,00.xml', 'Sky Sports'),
                this.fetchRSSFeed('https://www.goal.com/en/feeds/news', 'Goal.com'),
                this.fetchRSSFeed('https://www.bleacherreport.com/rss', 'Bleacher Report'),
                this.fetchRSSFeed('https://www.sportingnews.com/rss', 'Sporting News'),
                this.fetchRSSFeed('https://www.theguardian.com/sport/rss', 'Guardian Sport'),
                this.fetchRSSFeed('https://www.foxsports.com/rss', 'Fox Sports'),
                this.fetchRSSFeed('https://www.cbssports.com/rss', 'CBS Sports'),
                this.fetchRSSFeed('https://sports.yahoo.com/rss', 'Yahoo Sports'),
                
                // Working ESPN API function
                this.fetchFromESPN()
            ];

            // Add timeout to prevent long loading times
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Sports news fetch timeout')), 8000)
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
                    console.warn(`Sports API ${index + 1} failed:`, result.reason);
                }
            });

            // Only return articles if we have real content
            if (allArticles.length === 0) {
                console.warn('No real sports articles found');
                return [];
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
            console.error('Error fetching sports news:', error);
            return [];
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
                // Original API sources with Kenya focus - INCREASED LIMITS
                this.fetchFromGNews('kenya', Math.floor(limit * 0.3)),
                this.fetchFromNewsData('kenya', Math.floor(limit * 0.3)),
                this.fetchFromNewsAPI('kenya', Math.floor(limit * 0.3)),
                this.fetchFromMediastack('kenya', Math.floor(limit * 0.3)),
                this.fetchFromCurrentsAPI('kenya', Math.floor(limit * 0.3)),
                
                // REAL RSS feeds for Kenya news - ACTUAL REAL-TIME CONTENT
                this.fetchRSSFeed('https://www.nation.co.ke/rss', 'Nation Africa'),
                this.fetchRSSFeed('https://www.standardmedia.co.ke/rss', 'The Standard'),
                this.fetchRSSFeed('https://www.capitalfm.co.ke/rss', 'Capital FM'),
                this.fetchRSSFeed('https://citizentv.co.ke/rss', 'Citizen TV'),
                this.fetchRSSFeed('https://www.tuko.co.ke/rss', 'Tuko News'),
                this.fetchRSSFeed('https://www.the-star.co.ke/rss', 'The Star Kenya'),
                this.fetchRSSFeed('https://www.kbc.co.ke/rss', 'KBC News'),
                this.fetchRSSFeed('https://www.people.co.ke/rss', 'People Daily'),
                this.fetchRSSFeed('https://allafrica.com/kenya/rss.xml', 'AllAfrica Kenya'),
                this.fetchRSSFeed('https://www.bbc.com/news/world/africa/rss.xml', 'BBC Africa'),
                this.fetchRSSFeed('https://www.businessdailyafrica.com/rss', 'Business Daily'),
                this.fetchRSSFeed('https://www.ntv.co.ke/rss', 'NTV Kenya'),
                this.fetchRSSFeed('https://www.ktnnews.co.ke/rss', 'KTN News'),
                this.fetchRSSFeed('https://www.kenyans.co.ke/rss', 'Kenyans.co.ke'),
                this.fetchRSSFeed('https://www.nairobinews.co.ke/rss', 'Nairobi News'),
                this.fetchRSSFeed('https://www.taifa.co.ke/rss', 'Taifa Leo'),
                this.fetchRSSFeed('https://www.kahawa.co.ke/rss', 'Kahawa Tungu'),
                
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
            try {
                return await this.fetchOriginalKenyaNews(limit);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                return [];
            }
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
            // Fetch from multiple sources including working APIs and RSS feeds
            const promises = [
                // Original API sources with technology focus
                this.fetchFromGNews('technology', Math.floor(limit * 0.2)),
                this.fetchFromNewsData('technology', Math.floor(limit * 0.2)),
                this.fetchFromNewsAPI('technology', Math.floor(limit * 0.2)),
                this.fetchFromMediastack('technology', Math.floor(limit * 0.2)),
                this.fetchFromCurrentsAPI('technology', Math.floor(limit * 0.2)),
                
                // REAL RSS feeds for technology - ACTUAL REAL-TIME CONTENT
                this.fetchRSSFeed('https://techcrunch.com/feed/', 'TechCrunch'),
                this.fetchRSSFeed('https://www.theverge.com/rss/index.xml', 'The Verge'),
                this.fetchRSSFeed('https://www.wired.com/feed/rss', 'Wired'),
                this.fetchRSSFeed('https://feeds.arstechnica.com/arstechnica/index', 'Ars Technica'),
                this.fetchRSSFeed('https://www.cnet.com/rss/all/', 'CNET'),
                this.fetchRSSFeed('https://gadgets360.com/rss.xml', 'Gadgets 360'),
                this.fetchRSSFeed('https://mashable.com/feed.xml', 'Mashable'),
                this.fetchRSSFeed('https://www.engadget.com/rss.xml', 'Engadget'),
                this.fetchRSSFeed('https://www.zdnet.com/news/rss.xml', 'ZDNet'),
                this.fetchRSSFeed('https://feeds.bbci.co.uk/news/technology/rss.xml', 'BBC Technology')
            ];

            // Add timeout to prevent long loading times
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Technology news fetch timeout')), 8000)
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
                    console.warn(`Technology news source ${index + 1} failed:`, result.reason);
                }
            });

            // Only return articles if we have real content
            if (allArticles.length === 0) {
                console.warn('No real technology articles found');
                return [];
            }

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
            return [];
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
                // Original API sources with health focus - INCREASED LIMITS
                this.fetchFromGNews('health', Math.floor(limit * 0.2)),
                this.fetchFromNewsData('health', Math.floor(limit * 0.2)),
                this.fetchFromNewsAPI('health', Math.floor(limit * 0.2)),
                this.fetchFromMediastack('health', Math.floor(limit * 0.2)),
                this.fetchFromCurrentsAPI('health', Math.floor(limit * 0.2)),
                
                // REAL RSS feeds for health - ACTUAL REAL-TIME CONTENT
                this.fetchRSSFeed('https://www.medicalnewstoday.com/rss.xml', 'Medical News Today'),
                this.fetchRSSFeed('https://www.healthline.com/rss/all', 'Healthline'),
                this.fetchRSSFeed('https://www.webmd.com/news/rss/default.xml', 'WebMD'),
                this.fetchRSSFeed('https://www.sciencedaily.com/rss/health_medicine.xml', 'Science Daily Health'),
                this.fetchRSSFeed('https://www.who.int/rss-feeds/news-english.xml', 'WHO News'),
                this.fetchRSSFeed('https://www.cdc.gov/rss/news.xml', 'CDC Newsroom'),
                this.fetchRSSFeed('https://www.nature.com/subjects/health-sciences.rss', 'Nature Health'),
                this.fetchRSSFeed('https://www.mayoclinic.org/rss/news.xml', 'Mayo Clinic News'),
                this.fetchRSSFeed('https://www.hopkinsmedicine.org/news/rss.xml', 'Johns Hopkins Health'),
                this.fetchRSSFeed('https://www.nih.gov/news-events/rss-feeds', 'NIH News'),
                
                // Additional health RSS feeds for comprehensive coverage
                this.fetchRSSFeed('https://www.reuters.com/health/rss', 'Reuters Health'),
                this.fetchRSSFeed('https://www.bbc.com/news/health/rss.xml', 'BBC Health'),
                this.fetchRSSFeed('https://www.harvardhealthblog.org/feed/', 'Harvard Health Blog'),
                this.fetchRSSFeed('https://www.thelancet.com/rssfeed/lancet_current.xml', 'The Lancet'),
                this.fetchRSSFeed('https://www.medscape.com/rss/public/0_public.xml', 'Medscape'),
                this.fetchRSSFeed('https://www.pubmed.gov/rss/news.xml', 'PubMed News')
            ];

            // Add timeout to prevent long loading times
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Health news fetch timeout')), 8000)
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
                    console.warn(`Health news source ${index + 1} failed:`, result.reason);
                }
            });

            // Only return articles if we have real content
            if (allArticles.length === 0) {
                console.warn('No real health articles found');
                return [];
            }

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
            return [];
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
                // Regular news APIs with lifestyle/health category mapping - INCREASED LIMITS
                this.fetchFromGNews('lifestyle', Math.floor(limit * 0.2)),
                this.fetchFromNewsData('lifestyle', Math.floor(limit * 0.2)),
                this.fetchFromNewsAPI('lifestyle', Math.floor(limit * 0.2)),
                this.fetchFromMediastack('lifestyle', Math.floor(limit * 0.2)),
                this.fetchFromCurrentsAPI('lifestyle', Math.floor(limit * 0.2)),
                
                // REAL RSS feeds for lifestyle - ACTUAL REAL-TIME CONTENT
                this.fetchRSSFeed('https://www.vogue.com/feed', 'Vogue'),
                this.fetchRSSFeed('https://www.elle.com/rss/all.xml', 'Elle'),
                this.fetchRSSFeed('https://www.buzzfeed.com/lifestyle.xml', 'BuzzFeed Lifestyle'),
                this.fetchRSSFeed('https://www.refinery29.com/rss.xml', 'Refinery29'),
                this.fetchRSSFeed('https://www.wellandgood.com/feed/', 'Well+Good'),
                this.fetchRSSFeed('https://www.travelandleisure.com/rss', 'Travel + Leisure'),
                this.fetchRSSFeed('https://www.foodnetwork.com/rss.xml', 'Food Network'),
                this.fetchRSSFeed('https://www.architecturaldigest.com/rss', 'Architectural Digest'),
                this.fetchRSSFeed('https://www.mindbodygreen.com/rss.xml', 'MindBodyGreen'),
                this.fetchRSSFeed('https://www.self.com/rss.xml', 'SELF'),
                this.fetchRSSFeed('https://www.cosmopolitan.com/rss/', 'Cosmopolitan'),
                this.fetchRSSFeed('https://www.glamour.com/rss', 'Glamour'),
                this.fetchRSSFeed('https://www.health.com/rss/all.xml', 'Health.com'),
                this.fetchRSSFeed('https://www.shape.com/rss.xml', 'Shape'),
                this.fetchRSSFeed('https://www.fitness.com/rss', 'Fitness'),
                
                // Additional lifestyle RSS feeds for comprehensive coverage
                this.fetchRSSFeed('https://www.marthastewart.com/rss', 'Martha Stewart'),
                this.fetchRSSFeed('https://www.realsimple.com/rss', 'Real Simple'),
                this.fetchRSSFeed('https://www.bhg.com/rss', 'Better Homes & Gardens'),
                this.fetchRSSFeed('https://www.southernliving.com/rss', 'Southern Living'),
                this.fetchRSSFeed('https://www.countryliving.com/rss', 'Country Living'),
                this.fetchRSSFeed('https://www.goodhousekeeping.com/rss', 'Good Housekeeping')
            ];

            // Add timeout to prevent long loading times
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Lifestyle news fetch timeout')), 8000)
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
                    console.warn(`Lifestyle source ${index + 1} failed:`, result.reason);
                }
            });

            // Only return articles if we have real content
            if (allArticles.length === 0) {
                console.warn('No real lifestyle articles found');
                return [];
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
            return [];
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
                // Regular news APIs with entertainment category - INCREASED LIMITS
                this.fetchFromGNews('entertainment', Math.floor(limit * 0.2)),
                this.fetchFromNewsData('entertainment', Math.floor(limit * 0.2)),
                this.fetchFromNewsAPI('entertainment', Math.floor(limit * 0.2)),
                this.fetchFromMediastack('entertainment', Math.floor(limit * 0.2)),
                this.fetchFromCurrentsAPI('entertainment', Math.floor(limit * 0.2)),
                
                // REAL RSS feeds for entertainment - ACTUAL REAL-TIME CONTENT
                this.fetchRSSFeed('https://variety.com/feed', 'Variety'),
                this.fetchRSSFeed('https://www.hollywoodreporter.com/feed', 'Hollywood Reporter'),
                this.fetchRSSFeed('https://deadline.com/feed', 'Deadline'),
                this.fetchRSSFeed('https://ew.com/feed', 'Entertainment Weekly'),
                this.fetchRSSFeed('https://www.rollingstone.com/feed', 'Rolling Stone'),
                this.fetchRSSFeed('https://www.billboard.com/feed', 'Billboard'),
                this.fetchRSSFeed('https://pitchfork.com/feed', 'Pitchfork'),
                this.fetchRSSFeed('https://www.nme.com/feed', 'NME'),
                this.fetchRSSFeed('https://www.mtv.com/rss.xml', 'MTV'),
                this.fetchRSSFeed('https://www.eonline.com/rss.xml', 'E! Online'),
                this.fetchRSSFeed('https://www.usmagazine.com/rss.xml', 'US Weekly'),
                this.fetchRSSFeed('https://www.people.com/rss.xml', 'People'),
                this.fetchRSSFeed('https://www.tmz.com/rss.xml', 'TMZ'),
                this.fetchRSSFeed('https://www.etonline.com/rss.xml', 'Entertainment Tonight'),
                this.fetchRSSFeed('https://www.accesshollywood.com/rss.xml', 'Access Hollywood'),
                
                // Additional entertainment RSS feeds for comprehensive coverage
                this.fetchRSSFeed('https://www.ign.com/feed.xml', 'IGN'),
                this.fetchRSSFeed('https://www.gamespot.com/feeds/game-news/', 'GameSpot'),
                this.fetchRSSFeed('https://www.polygon.com/rss/index.xml', 'Polygon'),
                this.fetchRSSFeed('https://www.theverge.com/rss/entertainment/index.xml', 'The Verge Entertainment'),
                this.fetchRSSFeed('https://www.techcrunch.com/feed/', 'TechCrunch Entertainment'),
                this.fetchRSSFeed('https://www.wired.com/feed/entertainment/rss', 'Wired Entertainment')
            ];

            // Add timeout to prevent long loading times
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Entertainment news fetch timeout')), 8000)
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
                    console.warn(`Entertainment source ${index + 1} failed:`, result.reason);
                }
            });

            // Only return articles if we have real content
            if (allArticles.length === 0) {
                console.warn('No real entertainment articles found');
                return [];
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
            return [];
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
                // Regular news APIs with world/international focus - INCREASED LIMITS
                this.fetchFromGNews('world', Math.floor(limit * 0.2)),
                this.fetchFromNewsData('world', Math.floor(limit * 0.2)),
                this.fetchFromNewsAPI('world', limit),
                this.fetchFromMediastack('world', Math.floor(limit * 0.2)),
                this.fetchFromCurrentsAPI('world', Math.floor(limit * 0.2)),
                
                // REAL RSS feeds for world news - ACTUAL REAL-TIME CONTENT
                this.fetchRSSFeed('https://feeds.bbci.co.uk/news/world/rss.xml', 'BBC World'),
                this.fetchRSSFeed('https://feeds.reuters.com/reuters/worldNews', 'Reuters World'),
                this.fetchRSSFeed('https://feeds.apnews.com/rss/apf-worldnews', 'Associated Press World'),
                this.fetchRSSFeed('https://www.aljazeera.com/xml/rss/all.xml', 'Al Jazeera'),
                this.fetchRSSFeed('https://www.france24.com/en/rss', 'France 24'),
                this.fetchRSSFeed('https://rss.dw.com/xml/rss-en-all', 'Deutsche Welle'),
                this.fetchRSSFeed('https://www.euronews.com/rss', 'Euronews'),
                this.fetchRSSFeed('https://rss.cnn.com/rss/edition_world.rss', 'CNN World'),
                this.fetchRSSFeed('https://feeds.npr.org/1004/rss.xml', 'NPR World'),
                this.fetchRSSFeed('https://www.theguardian.com/world/rss', 'Guardian World'),
                this.fetchRSSFeed('https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml', 'New York Times World'),
                this.fetchRSSFeed('https://www.washingtonpost.com/world/?outputType=rss', 'Washington Post World'),
                this.fetchRSSFeed('https://www.latimes.com/world/rss2.0.xml', 'Los Angeles Times World'),
                this.fetchRSSFeed('https://www.abc.net.au/news/world/rss.xml', 'ABC World'),
                this.fetchRSSFeed('https://www.cbc.ca/cmlink/rss-world', 'CBC World'),
                
                // Additional world news RSS feeds for comprehensive coverage
                this.fetchRSSFeed('https://www.lemonde.fr/rss/en_continu.xml', 'Le Monde'),
                this.fetchRSSFeed('https://www.elpais.com/rss/internacional.xml', 'El País'),
                this.fetchRSSFeed('https://www.corriere.it/rss/esteri.xml', 'Corriere della Sera'),
                this.fetchRSSFeed('https://www.spiegel.de/international/index.rss', 'Der Spiegel'),
                this.fetchRSSFeed('https://www.lefigaro.fr/rss/figaro_international.xml', 'Le Figaro'),
                this.fetchRSSFeed('https://www.elmundo.es/rss/internacional.xml', 'El Mundo')
            ];

            // Add timeout to prevent long loading times
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('World news fetch timeout')), 8000)
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
                    console.warn(`World news source ${index + 1} failed:`, result.reason);
                }
            });

            // Only return articles if we have real content
            if (allArticles.length === 0) {
                console.warn('No real world articles found');
                return [];
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
            return [];
        }
    }

    /**
     * Fetch RSS feed with optimized performance
     */
    async fetchRSSFeed(rssUrl, sourceName) {
        try {
            // Try multiple CORS proxies as fallbacks
            const proxies = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
                `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rssUrl)}`,
                `https://cors-anywhere.herokuapp.com/${rssUrl}`,
                `https://thingproxy.freeboard.io/fetch/${rssUrl}`,
                `https://r.jina.ai/http://${rssUrl.replace(/^https?:\/\//, '')}`
            ];
            
            let response = null;
            let data = null;
            
            // Try each proxy until one works
            for (const proxyUrl of proxies) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout
                    
                    response = await fetch(proxyUrl, {
                        signal: controller.signal,
                        headers: {
                            'Accept': 'application/rss+xml, application/xml, text/xml, */*',
                        }
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (response.ok) {
                        if (proxyUrl.includes('allorigins.win')) {
                            data = await response.json();
                            data = data.contents;
                        } else {
                            data = await response.text();
                        }
                        break;
                    }
                } catch (proxyError) {
                    console.warn(`Proxy failed for ${sourceName}:`, proxyUrl, proxyError);
                    continue;
                }
            }
            
            if (!data) {
                throw new Error('All proxies failed');
            }
            
            let xmlDoc;
            try {
                xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
            } catch (_) {
                // Fallback: try to coerce JSON.contents style
                try {
                    const json = JSON.parse(data);
                    xmlDoc = new DOMParser().parseFromString(json.contents || '', 'text/xml');
                } catch (_) {
                    xmlDoc = null;
                }
            }
            if (!xmlDoc) return [];
            
            const items = xmlDoc.querySelectorAll('item');
            const articles = [];
            
            for (let i = 0; i < Math.min(items.length, 40); i++) {
                const item = items[i];
                const title = item.querySelector('title')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';
                const link = item.querySelector('link')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                const enclosure = item.querySelector('enclosure');
                const imageUrl = enclosure?.getAttribute('url') || '';
                
                // Convert pubDate to proper ISO format
                let publishedAt = new Date().toISOString(); // fallback to current time
                if (pubDate) {
                    try {
                        const date = new Date(pubDate);
                        if (!isNaN(date.getTime())) {
                            publishedAt = date.toISOString();
                        }
                    } catch (e) {
                        console.warn('Invalid date format:', pubDate);
                    }
                }
                
                articles.push({
                    title: title.trim(),
                    description: description.trim(),
                    url: link.trim(),
                    urlToImage: imageUrl,
                    publishedAt: publishedAt,
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
     * Fetch fallback news from reliable APIs
     */
    async fetchFallbackNews(category, limit) {
        try {
            console.log(`Fetching fallback news for ${category}`);
            
            // Use only the most reliable APIs with higher limits
            const promises = [
                this.fetchFromGNews(category, Math.min(limit * 2, 40)),
                this.fetchFromNewsData(category, Math.min(limit * 2, 100)),
                this.fetchFromNewsAPI(category, Math.min(limit * 2, 100)),
                this.fetchFromMediastack(category, Math.min(limit * 2, 100)),
                this.fetchFromCurrentsAPI(category, Math.min(limit * 2, 100))
            ];
            
            const results = await Promise.allSettled(promises);
            
            let allArticles = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value && Array.isArray(result.value)) {
                    allArticles = allArticles.concat(result.value);
                }
            });
            
            if (allArticles.length > 0) {
                const uniqueArticles = this.removeDuplicates(allArticles);
                const sortedArticles = uniqueArticles.sort((a, b) => 
                    new Date(b.publishedAt) - new Date(a.publishedAt)
                );
                console.log(`Fallback found ${sortedArticles.length} articles for ${category}`);
                return sortedArticles;
            }
            
            return [];
        } catch (error) {
            console.error('Fallback news fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from GNews API
     */
    async fetchFromGNews(category, limit) {
        // Respect per-call max to manage rate limits
        limit = Math.min(limit || 20, 40);

        try {
            let url = `https://gnews.io/api/v4/top-headlines?token=${this.apiKeys.gnews}&lang=en&max=${Math.min(limit, 20)}`;
            
            if (category === 'kenya') {
                url += '&country=ke&q=(Kenya OR Nairobi OR Mombasa OR Kisumu OR "East Africa" OR "Kenyan government" OR "President Ruto")';
            } else if (category === 'breaking') {
                // No category filter for breaking news
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
            // Return empty array instead of fake articles
            return [];
        }
    }

    /**
     * Fetch from NewsData.io API
     */
    async fetchFromNewsData(category, limit) {
        limit = Math.min(limit || 20, 100);

        try {
            let url = `https://newsdata.io/api/1/news?apikey=${this.apiKeys.newsdata}&language=en&size=${Math.min(limit, 100)}`;
            
            if (category === 'kenya') {
                url += '&country=ke&q=Kenya OR Nairobi OR Mombasa OR Kisumu OR "East Africa"';
            } else if (category === 'breaking') {
                // No category filter for breaking news
            } else if (category !== 'world') {
                url += `&category=${this.mapCategoryForNewsData(category)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`NewsData API error: ${response.status}`);
            
            const data = await response.json();
            return this.formatNewsDataArticles(data.results || []);
        } catch (error) {
            console.error('NewsData fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from NewsAPI.org
     */
    async fetchFromNewsAPI(category, limit) {
        limit = Math.min(limit || 20, 100);

        try {
            let url = `https://newsapi.org/v2/top-headlines?apiKey=${this.apiKeys.newsapi}&pageSize=${Math.min(limit, 100)}`;
            
            if (category === 'kenya') {
                url += '&country=ke';
            } else if (category === 'breaking') {
                url += '&country=us'; // Use US for general breaking news
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
            return [];
        }
    }

    /**
     * Fetch from Mediastack API
     */
    async fetchFromMediastack(category, limit) {
        limit = Math.min(limit || 20, 100);

        try {
            let url = `https://api.mediastack.com/v1/news?access_key=${this.apiKeys.mediastack}&languages=en&limit=${Math.min(limit, 100)}`;
            
            if (category === 'kenya') {
                url += '&countries=ke';
            } else if (category === 'breaking') {
                // No category filter for breaking news
            } else if (category !== 'world') {
                url += `&categories=${this.mapCategoryForMediastack(category)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Mediastack API error: ${response.status}`);
            
            const data = await response.json();
            return this.formatMediastackArticles(data.data || []);
        } catch (error) {
            console.error('Mediastack fetch error:', error);
            return [];
        }
    }

    /**
     * Fetch from CurrentsAPI
     */
    async fetchFromCurrentsAPI(category, limit) {
        limit = Math.min(limit || 20, 100);

        try {
            let url = `https://api.currentsapi.services/v1/latest-news?apiKey=${this.apiKeys.currentsapi}&language=en&page_size=${Math.min(limit, 100)}`;
            
            if (category === 'kenya') {
                url += '&country=ke';
            } else if (category === 'breaking') {
                // No category filter for breaking news
            } else if (category !== 'world') {
                url += `&category=${this.mapCategoryForCurrentsAPI(category)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`CurrentsAPI error: ${response.status}`);
            
            const data = await response.json();
            return this.formatCurrentsAPIArticles(data.news || []);
        } catch (error) {
            console.error('CurrentsAPI fetch error:', error);
            return [];
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
            'breaking': 'Breaking News',
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
        // MINIMAL fallback articles - only used when ALL real sources fail
        // These are NOT real-time and should rarely be used
        const fallbackArticles = {
            sports: [
                {
                    title: "Premier League: Manchester City Secures Dramatic Victory",
                    description: "Late goal in stoppage time gives City crucial three points in title race.",
                    url: "https://www.bbc.com/sport/football",
                    urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    source: { name: "BBC Sport" },
                    category: "sports"
                },
                {
                    title: "NBA Playoffs: Lakers Advance to Conference Finals",
                    description: "LeBron James leads team to decisive victory in game 7 thriller.",
                    url: "https://www.espn.com/nba",
                    urlToImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
                    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    source: { name: "ESPN" },
                    category: "sports"
                },
                {
                    title: "Champions League: Real Madrid vs Bayern Munich Quarter-Final",
                    description: "Epic showdown between European giants ends in dramatic penalty shootout.",
                    url: "https://www.uefa.com/uefachampionsleague",
                    urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    source: { name: "UEFA" },
                    category: "sports"
                },
                {
                    title: "Formula 1: Red Bull Dominates Practice Sessions",
                    description: "Max Verstappen sets fastest lap times ahead of qualifying.",
                    url: "https://www.formula1.com",
                    urlToImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
                    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Formula 1" },
                    category: "sports"
                },
                {
                    title: "Tennis: Wimbledon Championships Announcement",
                    description: "Tournament organizers reveal new innovations for 2024 season.",
                    url: "https://www.wimbledon.com",
                    urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Wimbledon" },
                    category: "sports"
                },
                {
                    title: "Olympics 2024: Paris Preparations Complete",
                    description: "Host city finalizes all venues and infrastructure for summer games.",
                    url: "https://www.olympics.com/paris-2024",
                    urlToImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
                    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Olympics" },
                    category: "sports"
                },
                {
                    title: "Cricket: T20 World Cup Qualifiers Begin",
                    description: "Teams compete for remaining spots in prestigious tournament.",
                    url: "https://www.icc-cricket.com",
                    urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
                    source: { name: "ICC Cricket" },
                    category: "sports"
                },
                {
                    title: "Golf: Masters Tournament Preview",
                    description: "Top players prepare for prestigious Augusta National championship.",
                    url: "https://www.masters.com",
                    urlToImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
                    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
                    source: { name: "The Masters" },
                    category: "sports"
                },
                {
                    title: "Boxing: Heavyweight Championship Bout Announced",
                    description: "Tyson Fury vs Anthony Joshua confirmed for summer showdown.",
                    url: "https://www.boxingscene.com",
                    urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Boxing Scene" },
                    category: "sports"
                },
                {
                    title: "Rugby: Six Nations Championship Finale",
                    description: "Ireland secures Grand Slam with victory over England.",
                    url: "https://www.sixnationsrugby.com",
                    urlToImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
                    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Six Nations Rugby" },
                    category: "sports"
                }
            ],
            health: [
                {
                    title: "Breakthrough in Cancer Treatment Research",
                    description: "New immunotherapy approach shows promising results in clinical trials.",
                    url: "https://www.medicalnewstoday.com",
                    urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
                    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Medical News Today" },
                    category: "health"
                },
                {
                    title: "WHO Updates Global Health Guidelines",
                    description: "New recommendations for preventive healthcare and disease management.",
                    url: "https://www.who.int",
                    urlToImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
                    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    source: { name: "World Health Organization" },
                    category: "health"
                },
                {
                    title: "New Alzheimer's Treatment Shows Promise",
                    description: "Clinical trial results indicate significant improvement in cognitive function.",
                    url: "https://www.alz.org",
                    urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
                    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Alzheimer's Association" },
                    category: "health"
                },
                {
                    title: "Mental Health Awareness Month Campaign",
                    description: "Global initiative focuses on reducing stigma and improving access to care.",
                    url: "https://www.nami.org",
                    urlToImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
                    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
                    source: { name: "NAMI" },
                    category: "health"
                },
                {
                    title: "Vaccine Development for Emerging Diseases",
                    description: "Scientists accelerate research on new vaccine technologies.",
                    url: "https://www.cdc.gov",
                    urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
                    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
                    source: { name: "CDC" },
                    category: "health"
                },
                {
                    title: "Telemedicine Revolution in Rural Healthcare",
                    description: "Digital health platforms bridge gaps in underserved communities.",
                    url: "https://www.healthline.com",
                    urlToImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
                    publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Healthline" },
                    category: "health"
                },
                {
                    title: "Nutrition Guidelines Updated for 2024",
                    description: "New dietary recommendations emphasize plant-based eating patterns.",
                    url: "https://www.nutrition.gov",
                    urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
                    publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Nutrition.gov" },
                    category: "health"
                },
                {
                    title: "Exercise Science Breakthrough Study",
                    description: "Research reveals optimal workout timing for maximum benefits.",
                    url: "https://www.acefitness.org",
                    urlToImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
                    publishedAt: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
                    source: { name: "ACE Fitness" },
                    category: "health"
                },
                {
                    title: "Sleep Medicine Advances",
                    description: "New treatments for sleep disorders show improved outcomes.",
                    url: "https://www.sleepfoundation.org",
                    urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
                    publishedAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Sleep Foundation" },
                    category: "health"
                },
                {
                    title: "Pediatric Healthcare Innovation",
                    description: "Child-friendly medical devices improve treatment compliance.",
                    url: "https://www.aap.org",
                    urlToImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
                    publishedAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
                    source: { name: "American Academy of Pediatrics" },
                    category: "health"
                }
            ],
            lifestyle: [
                {
                    title: "Sustainable Living: Zero-Waste Home Tips",
                    description: "Expert advice on reducing household waste and living more sustainably.",
                    url: "https://www.mindbodygreen.com",
                    urlToImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
                    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    source: { name: "MindBodyGreen" },
                    category: "lifestyle"
                },
                {
                    title: "Wellness Trends: Mental Health in the Digital Age",
                    description: "How technology is shaping modern approaches to mental wellness.",
                    url: "https://www.wellandgood.com",
                    urlToImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Well+Good" },
                    category: "lifestyle"
                }
            ],
            technology: [
                {
                    title: "AI Breakthrough: New Language Model Shows Human-Level Understanding",
                    description: "Revolutionary AI system demonstrates unprecedented natural language processing capabilities.",
                    url: "https://www.techcrunch.com",
                    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
                    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    source: { name: "TechCrunch" },
                    category: "technology"
                },
                {
                    title: "Quantum Computing: Major Milestone Achieved",
                    description: "Scientists reach quantum supremacy in solving complex computational problems.",
                    url: "https://www.wired.com",
                    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
                    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Wired" },
                    category: "technology"
                },
                {
                    title: "5G Network Expansion Accelerates Globally",
                    description: "Telecom companies deploy next-generation wireless infrastructure worldwide.",
                    url: "https://www.verge.com",
                    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
                    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    source: { name: "The Verge" },
                    category: "technology"
                },
                {
                    title: "Cybersecurity: New Threat Detection System",
                    description: "AI-powered security platform prevents advanced cyber attacks in real-time.",
                    url: "https://www.ars-technica.com",
                    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
                    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Ars Technica" },
                    category: "technology"
                },
                {
                    title: "Electric Vehicle Market Surge",
                    description: "Major automakers announce ambitious EV production targets for 2024.",
                    url: "https://www.electrek.co",
                    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
                    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Electrek" },
                    category: "technology"
                },
                {
                    title: "SpaceX Starship Mission Success",
                    description: "Revolutionary spacecraft completes milestone test flight.",
                    url: "https://www.space.com",
                    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
                    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Space.com" },
                    category: "technology"
                },
                {
                    title: "Blockchain Technology in Finance",
                    description: "Central banks explore digital currency implementation strategies.",
                    url: "https://www.coindesk.com",
                    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
                    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                    source: { name: "CoinDesk" },
                    category: "technology"
                },
                {
                    title: "Virtual Reality Gaming Revolution",
                    description: "Next-generation VR headsets redefine immersive gaming experience.",
                    url: "https://www.uploadvr.com",
                    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
                    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
                    source: { name: "UploadVR" },
                    category: "technology"
                },
                {
                    title: "Cloud Computing Market Growth",
                    description: "Enterprise adoption of cloud services reaches new heights.",
                    url: "https://www.techrepublic.com",
                    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
                    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                    source: { name: "TechRepublic" },
                    category: "technology"
                },
                {
                    title: "Internet of Things Security Standards",
                    description: "New protocols ensure secure connectivity for smart devices.",
                    url: "https://www.iotworldtoday.com",
                    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
                    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
                    source: { name: "IoT World Today" },
                    category: "technology"
                }
            ],
            entertainment: [
                {
                    title: "Oscars 2024: Complete Winners List and Highlights",
                    description: "Celebrating the best in film at the 96th Academy Awards ceremony.",
                    url: "https://www.variety.com",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Variety" },
                    category: "entertainment"
                },
                {
                    title: "Music Industry: Streaming Revolution Continues",
                    description: "New platforms and technologies reshaping how we consume music.",
                    url: "https://www.billboard.com",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Billboard" },
                    category: "entertainment"
                },
                {
                    title: "Netflix Announces Blockbuster Movie Lineup",
                    description: "Streaming giant reveals ambitious slate of original films for 2024.",
                    url: "https://www.hollywoodreporter.com",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Hollywood Reporter" },
                    category: "entertainment"
                },
                {
                    title: "Taylor Swift World Tour Breaks Records",
                    description: "Pop superstar's Eras Tour becomes highest-grossing concert series ever.",
                    url: "https://www.billboard.com",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Billboard" },
                    category: "entertainment"
                },
                {
                    title: "Marvel Studios Phase 5 Announcement",
                    description: "Comic book giant reveals upcoming superhero film and TV series slate.",
                    url: "https://www.deadline.com",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Deadline" },
                    category: "entertainment"
                },
                {
                    title: "Video Game Industry Sales Surge",
                    description: "Gaming market reaches new heights with record-breaking releases.",
                    url: "https://www.gamespot.com",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    source: { name: "GameSpot" },
                    category: "entertainment"
                },
                {
                    title: "Broadway Shows Return to Full Capacity",
                    description: "Theater district celebrates revival of live performances.",
                    url: "https://www.playbill.com",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Playbill" },
                    category: "entertainment"
                },
                {
                    title: "Podcast Industry Growth Continues",
                    description: "Audio content creators see unprecedented audience engagement.",
                    url: "https://www.podcastinsights.com",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Podcast Insights" },
                    category: "entertainment"
                },
                {
                    title: "Social Media Influencer Economy",
                    description: "Digital creators reshape traditional entertainment industry.",
                    url: "https://www.tubefilter.com",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Tubefilter" },
                    category: "entertainment"
                },
                {
                    title: "Animation Industry Innovation",
                    description: "New technologies revolutionize animated content creation.",
                    url: "https://www.animationmagazine.net",
                    urlToImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Animation Magazine" },
                    category: "entertainment"
                }
            ],
            world: [
                {
                    title: "Global Climate Summit: Nations Commit to Ambitious Targets",
                    description: "World leaders agree on comprehensive plan to address climate change.",
                    url: "https://www.bbc.com/news/world",
                    urlToImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
                    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    source: { name: "BBC World" },
                    category: "world"
                },
                {
                    title: "International Trade Agreement Reached",
                    description: "Major economies sign historic trade deal to boost global commerce.",
                    url: "https://www.reuters.com/world",
                    urlToImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
                    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Reuters" },
                    category: "world"
                }
            ],
            kenya: [
                {
                    title: "Kenya's Economic Growth Exceeds Expectations",
                    description: "Latest GDP figures show robust economic performance across key sectors.",
                    url: "https://www.nation.co.ke",
                    urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
                    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Nation Africa" },
                    category: "kenya"
                },
                {
                    title: "Nairobi Named Top African City for Business",
                    description: "International survey recognizes Kenya's capital as premier business destination.",
                    url: "https://www.standardmedia.co.ke",
                    urlToImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
                    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    source: { name: "The Standard" },
                    category: "kenya"
                }
            ],
            business: [
                {
                    title: "Stock Market Reaches New Heights",
                    description: "Major indices hit record levels as investor confidence grows.",
                    url: "https://www.ft.com",
                    urlToImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
                    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    source: { name: "Financial Times" },
                    category: "business"
                }
            ],
            latest: [
                {
                    title: "Breaking: Major Technology Conference Announced",
                    description: "Global tech leaders to gather for innovation summit next month.",
                    url: "https://www.techcrunch.com",
                    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
                    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                    source: { name: "TechCrunch" },
                    category: "technology"
                },
                {
                    title: "Sports: Championship Finals Set for This Weekend",
                    description: "Top teams prepare for highly anticipated championship showdown.",
                    url: "https://www.espn.com",
                    urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
                    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    source: { name: "ESPN" },
                    category: "sports"
                }
            ]
        };

        // Return category-specific fallback articles or general ones
        return fallbackArticles[category] || fallbackArticles.latest || [];
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

    /**
     * Test function to verify APIs are working
     */
    async testAPIs() {
        console.log('Testing APIs...');
        
        const testResults = {
            gnews: false,
            newsdata: false,
            newsapi: false,
            mediastack: false,
            currentsapi: false
        };
        
        try {
            // Test GNews
            const gnewsTest = await this.fetchFromGNews('technology', 5);
            testResults.gnews = gnewsTest.length > 0;
            console.log('GNews test:', testResults.gnews, gnewsTest.length, 'articles');
        } catch (e) {
            console.log('GNews test failed:', e);
        }
        
        try {
            // Test NewsData
            const newsdataTest = await this.fetchFromNewsData('technology', 5);
            testResults.newsdata = newsdataTest.length > 0;
            console.log('NewsData test:', testResults.newsdata, newsdataTest.length, 'articles');
        } catch (e) {
            console.log('NewsData test failed:', e);
        }
        
        try {
            // Test NewsAPI
            const newsapiTest = await this.fetchFromNewsAPI('technology', 5);
            testResults.newsapi = newsapiTest.length > 0;
            console.log('NewsAPI test:', testResults.newsapi, newsapiTest.length, 'articles');
        } catch (e) {
            console.log('NewsAPI test failed:', e);
        }
        
        try {
            // Test Mediastack
            const mediastackTest = await this.fetchFromMediastack('technology', 5);
            testResults.mediastack = mediastackTest.length > 0;
            console.log('Mediastack test:', testResults.mediastack, mediastackTest.length, 'articles');
        } catch (e) {
            console.log('Mediastack test failed:', e);
        }
        
        try {
            // Test CurrentsAPI
            const currentsapiTest = await this.fetchFromCurrentsAPI('technology', 5);
            testResults.currentsapi = currentsapiTest.length > 0;
            console.log('CurrentsAPI test:', testResults.currentsapi, currentsapiTest.length, 'articles');
        } catch (e) {
            console.log('CurrentsAPI test failed:', e);
        }
        
        console.log('API Test Results:', testResults);
        return testResults;
    }
}

// Create global instance
window.newsAPI = new NewsAPI();
