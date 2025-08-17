// Comprehensive news sources configuration and management

// Global news sources configuration
const NEWS_SOURCES = {
    general: [
        {
            name: 'BBC News',
            rss: 'https://feeds.bbci.co.uk/news/rss.xml',
            category: 'general',
            priority: 1,
            region: 'international'
        },
        {
            name: 'CNN',
            rss: 'https://rss.cnn.com/rss/edition.rss',
            category: 'general',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Reuters',
            rss: 'https://feeds.reuters.com/reuters/topNews',
            category: 'general',
            priority: 1,
            region: 'international'
        },
        {
            name: 'NPR',
            rss: 'https://feeds.npr.org/1001/rss.xml',
            category: 'general',
            priority: 2,
            region: 'us'
        },
        {
            name: 'Associated Press',
            rss: 'https://feeds.apnews.com/rss/apf-topnews',
            category: 'general',
            priority: 1,
            region: 'international'
        }
    ],
    business: [
        {
            name: 'Financial Times',
            rss: 'https://www.ft.com/rss',
            category: 'business',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Wall Street Journal',
            rss: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
            category: 'business',
            priority: 1,
            region: 'us'
        },
        {
            name: 'Bloomberg',
            rss: 'https://feeds.bloomberg.com/politics/news.rss',
            category: 'business',
            priority: 1,
            region: 'international'
        }
    ],
    technology: [
        {
            name: 'TechCrunch',
            rss: 'https://techcrunch.com/feed/',
            category: 'technology',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Ars Technica',
            rss: 'https://feeds.arstechnica.com/arstechnica/index',
            category: 'technology',
            priority: 2,
            region: 'international'
        },
        {
            name: 'The Verge',
            rss: 'https://www.theverge.com/rss/index.xml',
            category: 'technology',
            priority: 1,
            region: 'international'
        }
    ],
    sports: [
        {
            name: 'ESPN',
            rss: 'https://www.espn.com/espn/rss/news',
            category: 'sports',
            priority: 1,
            region: 'international'
        },
        {
            name: 'BBC Sport',
            rss: 'https://feeds.bbci.co.uk/sport/rss.xml',
            category: 'sports',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Sky Sports',
            rss: 'https://www.skysports.com/rss/12040',
            category: 'sports',
            priority: 1,
            region: 'international'
        },
        {
            name: 'CBS Sports',
            rss: 'https://www.cbssports.com/rss/headlines/',
            category: 'sports',
            priority: 1,
            region: 'us'
        },
        {
            name: 'Yahoo Sports',
            rss: 'https://sports.yahoo.com/rss/',
            category: 'sports',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Goal.com',
            rss: 'https://www.goal.com/feeds/news?format=rss&language=en-us',
            category: 'sports',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Bleacher Report',
            rss: 'https://bleacherreport.com/articles.rss',
            category: 'sports',
            priority: 1,
            region: 'us'
        },
        {
            name: 'Sporting News',
            rss: 'https://www.sportingnews.com/us/rss',
            category: 'sports',
            priority: 1,
            region: 'us'
        },
        {
            name: 'The Guardian Sport',
            rss: 'https://www.theguardian.com/sport/rss',
            category: 'sports',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Fox Sports',
            rss: 'https://www.foxsports.com/rss',
            category: 'sports',
            priority: 1,
            region: 'us'
        }
    ],
    entertainment: [
        {
            name: 'Entertainment Weekly',
            rss: 'https://ew.com/feed/',
            category: 'entertainment',
            priority: 1,
            region: 'us'
        },
        {
            name: 'Variety',
            rss: 'https://variety.com/feed/',
            category: 'entertainment',
            priority: 1,
            region: 'international'
        }
    ],
    health: [
        {
            name: 'WebMD',
            rss: 'https://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC',
            category: 'health',
            priority: 2,
            region: 'international'
        },
        {
            name: 'Healthline',
            rss: 'https://www.healthline.com/feeds/news',
            category: 'health',
            priority: 2,
            region: 'international'
        },
        {
            name: 'Medical News Today',
            rss: 'https://www.medicalnewstoday.com/rss',
            category: 'health',
            priority: 1,
            region: 'international'
        },
        {
            name: 'ScienceDaily Health',
            rss: 'https://www.sciencedaily.com/rss/health_medicine.xml',
            category: 'health',
            priority: 1,
            region: 'international'
        },
        {
            name: 'WHO News',
            rss: 'https://www.who.int/rss-feeds/news-releases',
            category: 'health',
            priority: 1,
            region: 'international'
        },
        {
            name: 'CDC Newsroom',
            rss: 'https://tools.cdc.gov/api/v2/resources/media/rss.rss',
            category: 'health',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Harvard Health',
            rss: 'https://www.health.harvard.edu/blog/feed',
            category: 'health',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Mayo Clinic News',
            rss: 'https://newsnetwork.mayoclinic.org/feed/',
            category: 'health',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Reuters Health',
            rss: 'https://feeds.reuters.com/reuters/health',
            category: 'health',
            priority: 1,
            region: 'international'
        },
        {
            name: 'BBC Health',
            rss: 'https://feeds.bbci.co.uk/news/health/rss.xml',
            category: 'health',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Johns Hopkins Medicine',
            rss: 'https://www.hopkinsmedicine.org/news/rss',
            category: 'health',
            priority: 1,
            region: 'international'
        },
        {
            name: 'NIH News',
            rss: 'https://www.nih.gov/news-events/news-releases/rss.xml',
            category: 'health',
            priority: 1,
            region: 'international'
        }
    ],
    lifestyle: [
        {
            name: 'The Guardian Life & Style',
            rss: 'https://www.theguardian.com/lifeandstyle/rss',
            category: 'lifestyle',
            priority: 1,
            region: 'international'
        },
        {
            name: 'NYTimes Fashion & Style',
            rss: 'https://rss.nytimes.com/services/xml/rss/nyt/FashionandStyle.xml',
            category: 'lifestyle',
            priority: 2,
            region: 'international'
        }
    ],
    world: [
        {
            name: 'BBC World',
            rss: 'https://feeds.bbci.co.uk/news/world/rss.xml',
            category: 'world',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Reuters World',
            rss: 'https://feeds.reuters.com/Reuters/worldNews',
            category: 'world',
            priority: 1,
            region: 'international'
        },
        {
            name: 'Al Jazeera English',
            rss: 'https://www.aljazeera.com/xml/rss/all.xml',
            category: 'world',
            priority: 2,
            region: 'international'
        },
        {
            name: 'AP International',
            rss: 'https://feeds.apnews.com/apf-intlnews',
            category: 'world',
            priority: 2,
            region: 'international'
        }
    ],
    kenya: [
        {
            name: 'Kenya News Agency',
            rss: 'https://www.kenyanews.go.ke/feed/',
            category: 'kenya',
            priority: 1,
            region: 'kenya'
        },
        {
            name: 'The Star Kenya',
            rss: 'https://www.the-star.co.ke/feed/',
            category: 'kenya',
            priority: 1,
            region: 'kenya'
        },
        {
            name: 'Capital FM News',
            rss: 'https://www.capitalfm.co.ke/news/feed/',
            category: 'kenya',
            priority: 2,
            region: 'kenya'
        },
        {
            name: 'KBC Kenya',
            rss: 'https://www.kbc.co.ke/feed/',
            category: 'kenya',
            priority: 2,
            region: 'kenya'
        },
        {
            name: 'Citizen Digital (News)',
            rss: 'https://citizen.digital/category/news/feed/',
            category: 'kenya',
            priority: 2,
            region: 'kenya'
        }
    ]
};

// API configurations
const API_SOURCES = {
    newsapi: {
        name: 'NewsAPI.org',
        baseUrl: 'https://newsapi.org/v2/top-headlines',
        key: () => getAPIKey('NEWSAPI_KEY', 'demo_key'),
        rateLimits: {
            free: 1000, // requests per month
            developer: 50000 // requests per month
        }
    },
    newsdata: {
        name: 'NewsData.io',
        baseUrl: 'https://newsdata.io/api/1/latest',
        key: () => getAPIKey('NEWSDATA_KEY', 'demo_key'),
        rateLimits: {
            free: 200, // requests per day
            paid: 10000 // requests per day
        }
    }
};

// CORS proxy services for RSS feeds (mixed styles)
const CORS_PROXIES = [
    'https://api.allorigins.win/get?url=',      // expects encoded param
    'https://api.codetabs.com/v1/proxy?quest=', // expects encoded param
    'https://cors-anywhere.herokuapp.com/',     // expects raw URL appended
    'https://thingproxy.freeboard.io/fetch/',   // expects raw URL appended
    'https://r.jina.ai/'                 // expects raw URL appended to hostless path
];

// Main function to load news from all sources
async function loadNewsFromAllSources(category = 'all') {
    console.log(`Loading news for category: ${category}`);
    
    const allArticles = [];
    const loadPromises = [];
    
    // Determine which sources to load
    const resolvedCategory = (category === 'latest' || category === 'breaking') ? 'general' : category;
    const sourcesToLoad = resolvedCategory === 'all'
        ? Object.values(NEWS_SOURCES).flat()
        : (NEWS_SOURCES[resolvedCategory] || NEWS_SOURCES.general);
    
    // Load from RSS sources
    sourcesToLoad.forEach(source => {
        loadPromises.push(
            loadRSSSource(source)
                .then(articles => {
                    console.log(`Loaded ${articles.length} articles from ${source.name}`);
                    allArticles.push(...articles);
                })
                .catch(error => {
                    console.warn(`Failed to load from ${source.name}:`, error);
                })
        );
    });
    
    // Load from APIs if needed
    if (resolvedCategory !== 'kenya') { // Kenya has its own API handling
        loadPromises.push(
            loadFromNewsAPI(resolvedCategory)
                .then(articles => {
                    console.log(`Loaded ${articles.length} articles from NewsAPI`);
                    allArticles.push(...articles);
                })
                .catch(error => {
                    console.warn('Failed to load from NewsAPI:', error);
                })
        );
    }
    
    // Wait for all sources
    await Promise.allSettled(loadPromises);
    
    // Remove duplicates and sort
    const uniqueArticles = removeDuplicateArticles(allArticles);
    return uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

// Load from RSS source with error handling and retries
async function loadRSSSource(source, retryCount = 0) {
    const maxRetries = 2;
    
    try {
        const parser = new RSSParser();
        
        // Try different CORS proxies
        const localProxy = `/api/rss?url=${encodeURIComponent(source.rss)}`;
        const proxyBase = retryCount === 0 ? localProxy : CORS_PROXIES[(retryCount - 1) % CORS_PROXIES.length];
        const needsEncoding = proxyBase.includes('allorigins') || proxyBase.includes('codetabs');
        const isJina = proxyBase.includes('r.jina.ai');
        let proxyUrl;
        if (needsEncoding) {
            proxyUrl = `${proxyBase}${encodeURIComponent(source.rss)}`;
        } else if (isJina) {
            // r.jina.ai expects the full URL appended after the domain
            proxyUrl = `${proxyBase}${source.rss}`;
        } else {
            const appendRaw = proxyBase.endsWith('/');
            proxyUrl = `${proxyBase}${appendRaw ? '' : '/'}${source.rss}`;
        }
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Some proxies (allorigins) return JSON with a `contents` field; others return raw text
        let rssText;
        const isAllOrigins = proxyUrl.includes('allorigins.win');
        if (isAllOrigins) {
            const json = await response.json();
            rssText = json && (json.contents || json.contents === '' ? json.contents : null);
        } else {
            rssText = await response.text();
        }
        if (!rssText) {
            throw new Error('Empty RSS payload from proxy');
        }
        let feed;
        try {
            feed = await parser.parseString(rssText);
        } catch (parseErr) {
            // Fallback parse using DOMParser
            const xmlDoc = new DOMParser().parseFromString(rssText, 'text/xml');
            const items = Array.from(xmlDoc.querySelectorAll('item'));
            feed = { items: items.map(it => ({
                title: it.querySelector('title')?.textContent || '',
                contentSnippet: it.querySelector('description')?.textContent || '',
                description: it.querySelector('description')?.textContent || '',
                link: it.querySelector('link')?.textContent || '',
                content: it.querySelector('content\:encoded')?.textContent || ''
            })) };
        }
        
        return feed.items.map(item => ({
            title: sanitizeText(item.title),
            description: sanitizeText(item.contentSnippet || item.description),
            url: item.link,
            urlToImage: extractImageFromContent(item.content) || generatePlaceholderImage(source.category),
            publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
            source: { name: source.name },
            category: source.category,
            priority: source.priority,
            region: source.region
        }));
        
    } catch (error) {
        console.error(`Error loading RSS from ${source.name}:`, error);
        
        // Retry with different proxy
        if (retryCount < maxRetries) {
            console.log(`Retrying ${source.name} with different proxy...`);
            return loadRSSSource(source, retryCount + 1);
        }
        
        return [];
    }
}

// Load from NewsAPI
async function loadFromNewsAPI(category) {
    try {
        const apiKey = API_SOURCES.newsapi.key();
        if (apiKey === 'demo_key') {
            console.warn('Using demo API key for NewsAPI - limited functionality');
        }
        
        const params = new URLSearchParams({
            apiKey: apiKey,
            pageSize: 20,
            sortBy: 'publishedAt'
        });
        
        // Add category-specific parameters
        if (category && category !== 'all') {
            params.append('category', category);
        } else {
            params.append('category', 'general');
        }
        
        const url = `${API_SOURCES.newsapi.baseUrl}?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`NewsAPI HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(`NewsAPI Error: ${data.message}`);
        }
        
        return data.articles.map(article => ({
            title: sanitizeText(article.title),
            description: sanitizeText(article.description),
            url: article.url,
            urlToImage: article.urlToImage || generatePlaceholderImage(category),
            publishedAt: article.publishedAt,
            source: { name: article.source.name },
            category: category || 'general',
            priority: 1,
            region: 'international'
        }));
        
    } catch (error) {
        console.error('Error loading from NewsAPI:', error);
        return [];
    }
}

// Extract images from content
function extractImageFromContent(content) {
    if (!content) return null;
    
    const imageRegexes = [
        /<img[^>]+src="([^">]+)"/i,
        /<img[^>]+src='([^'>]+)'/i,
        /https?:\/\/[^\s<>"]+\.(jpg|jpeg|png|gif|webp)/gi
    ];
    
    for (const regex of imageRegexes) {
        const match = content.match(regex);
        if (match) {
            return match[1] || match[0];
        }
    }
    
    return null;
}

// Generate category-specific placeholder images
function generatePlaceholderImage(category) {
    const placeholders = {
        general: 'https://via.placeholder.com/400x200/16a34a/ffffff?text=Breaking+News',
        business: 'https://via.placeholder.com/400x200/2563eb/ffffff?text=Business+News',
        technology: 'https://via.placeholder.com/400x200/7c3aed/ffffff?text=Tech+News',
        sports: 'https://via.placeholder.com/400x200/ea580c/ffffff?text=Sports+News',
        entertainment: 'https://via.placeholder.com/400x200/e11d48/ffffff?text=Entertainment',
        health: 'https://via.placeholder.com/400x200/10b981/ffffff?text=Health+News',
        lifestyle: 'https://via.placeholder.com/400x200/8b5cf6/ffffff?text=Lifestyle',
        world: 'https://via.placeholder.com/400x200/0ea5e9/ffffff?text=World+News',
        kenya: 'https://via.placeholder.com/400x200/cc0000/ffffff?text=Kenya+News'
    };
    
    return placeholders[category] || placeholders.general;
}

// Sanitize text content
function sanitizeText(text) {
    if (!text) return '';
    
    return text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/\s+/g, ' ')
        .trim();
}

// Remove duplicate articles
function removeDuplicateArticles(articles) {
    const seen = new Set();
    const titleSimilarityThreshold = 0.8;
    
    return articles.filter(article => {
        // Use URL as primary deduplication key
        if (article.url && seen.has(article.url)) {
            return false;
        }
        
        // Check for similar titles
        const title = article.title.toLowerCase();
        for (const seenTitle of seen) {
            if (seenTitle.startsWith('title:') && 
                calculateSimilarity(title, seenTitle.slice(6)) > titleSimilarityThreshold) {
                return false;
            }
        }
        
        if (article.url) seen.add(article.url);
        seen.add(`title:${title}`);
        return true;
    });
}

// Calculate text similarity (simple implementation)
function calculateSimilarity(str1, str2) {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const intersection = words1.filter(word => words2.includes(word));
    
    return (2 * intersection.length) / (words1.length + words2.length);
}

// Get API key with fallback
function getAPIKey(keyName, fallback) {
    // Environment variables (Node.js)
    if (typeof process !== 'undefined' && process.env) {
        return process.env[keyName] || fallback;
    }
    
    // Global config (browser)
    if (typeof window !== 'undefined' && window.NEWS_CONFIG) {
        return window.NEWS_CONFIG[keyName] || fallback;
    }
    
    // Local storage (browser fallback)
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(keyName) || fallback;
    }
    
    return fallback;
}

// Health check for all news sources
async function checkAllSourcesHealth() {
    console.log('Performing health check on all news sources...');
    
    const healthReport = {
        rss: {},
        apis: {},
        summary: {
            total: 0,
            working: 0,
            failed: 0,
            lastChecked: new Date().toISOString()
        }
    };
    
    // Check RSS sources
    const allRSSSources = Object.values(NEWS_SOURCES).flat();
    for (const source of allRSSSources) {
        try {
            const articles = await loadRSSSource(source);
            healthReport.rss[source.name] = {
                status: 'working',
                articleCount: articles.length,
                category: source.category,
                priority: source.priority
            };
            healthReport.summary.working++;
        } catch (error) {
            healthReport.rss[source.name] = {
                status: 'failed',
                error: error.message,
                category: source.category,
                priority: source.priority
            };
            healthReport.summary.failed++;
        }
        healthReport.summary.total++;
    }
    
    // Check API sources
    try {
        const newsApiArticles = await loadFromNewsAPI('general');
        healthReport.apis['NewsAPI.org'] = {
            status: 'working',
            articleCount: newsApiArticles.length
        };
        healthReport.summary.working++;
    } catch (error) {
        healthReport.apis['NewsAPI.org'] = {
            status: 'failed',
            error: error.message
        };
        healthReport.summary.failed++;
    }
    healthReport.summary.total++;
    
    console.log('News sources health report:', healthReport);
    return healthReport;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadNewsFromAllSources,
        loadRSSSource,
        loadFromNewsAPI,
        checkAllSourcesHealth,
        NEWS_SOURCES,
        API_SOURCES
    };
}
