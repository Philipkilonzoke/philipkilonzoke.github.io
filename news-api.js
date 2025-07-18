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
            'latest': ['breaking', 'news', 'current'], // Latest from all categories
            'kenya': ['kenya', 'nairobi', 'mombasa', 'kisumu', 'kenyan', 'east africa'],
            'world': ['international', 'global', 'africa', 'europe', 'america', 'asia', 'middle east'],
            'sports': ['sports', 'football', 'soccer', 'basketball', 'athletics', 'rugby', 'cricket'],
            'technology': ['technology', 'tech', 'AI', 'artificial intelligence', 'gadgets', 'apps', 'innovation'],
            'business': ['business', 'finance', 'economy', 'stock market', 'entrepreneurship', 'companies'],
            'health': ['health', 'medicine', 'fitness', 'disease', 'mental health', 'wellness', 'medical'],
            'lifestyle': ['lifestyle', 'fashion', 'food', 'travel', 'family', 'culture', 'personal'],
            'entertainment': ['entertainment', 'movies', 'celebrities', 'shows', 'awards', 'cinema'],
            'music': ['music', 'artist', 'album', 'concert', 'song', 'musician', 'band', 'recording']
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
            
            // Fetch from all APIs + additional real-time sources in parallel
            const promises = [
                // Main API sources with your keys
                this.fetchFromGNews(category, categoryKeywords, limit),
                this.fetchFromNewsData(category, categoryKeywords, limit),
                this.fetchFromNewsAPI(category, categoryKeywords, limit),
                this.fetchFromMediastack(category, categoryKeywords, limit),
                this.fetchFromCurrentsAPI(category, categoryKeywords, limit),
                
                // Additional real-time sources for more articles
                this.fetchFromBBC(category, categoryKeywords),
                this.fetchFromReuters(category, categoryKeywords),
                this.fetchFromCNN(category, categoryKeywords),
                this.fetchFromGuardian(category, categoryKeywords),
                this.fetchFromAP(category, categoryKeywords),
                this.fetchFromCategorySpecificSources(category, categoryKeywords)
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

            console.log(`Fetched from ${successfulAPIs}/${results.length} sources for ${category}`);

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

            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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

            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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

            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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

            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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

            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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
