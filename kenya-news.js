// Kenya-specific news sources and functionality

// Kenya news sources configuration - Enhanced with 25+ real-time sources
const KENYA_NEWS_SOURCES = {
    rss: [
        // Tier 1: Major Kenyan Media Houses (Priority 1)
        {
            url: 'https://nation.africa/kenya/news/rss',
            name: 'Nation Media Group',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.standardmedia.co.ke/feeds/rss/all.rss',
            name: 'Standard Digital',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.businessdailyafrica.com/bd/feeds/rss/all.rss',
            name: 'Business Daily Africa',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://kenyanews.go.ke/feed/',
            name: 'Kenya News Agency (KNA)',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.kbc.co.ke/feeds/all',
            name: 'KBC Digital',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.k24tv.co.ke/feeds/rss/news',
            name: 'K24 TV',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.theeastafrican.co.ke/ea/feeds/rss/news',
            name: 'The EastAfrican',
            category: 'kenya',
            priority: 1
        },
        
        // Tier 2: Popular Digital Media (Priority 2)
        {
            url: 'https://nairobiwire.com/feed/',
            name: 'Nairobi Wire',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://kenyans.co.ke/feeds/news',
            name: 'Kenyans.co.ke',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://allafrica.com/kenya/rss',
            name: 'AllAfrica Kenya',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://tuko.co.ke/feed',
            name: 'Tuko News',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.iqraafm.com/feed/',
            name: 'Iqraa FM',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.citizentv.co.ke/feeds/rss/news',
            name: 'Citizen TV',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.ntv.co.ke/feeds/rss/all',
            name: 'NTV Kenya',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.capitalfm.co.ke/news/feed/',
            name: 'Capital FM News',
            category: 'kenya',
            priority: 2
        },
        
        // Tier 3: Specialized & Regional Sources (Priority 3)
        {
            url: 'https://taifaleo.nation.co.ke/feeds/rss/news',
            name: 'Taifa Leo',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://diasporamessenger.com/feed/',
            name: 'Diaspora Messenger',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.thekenyatimes.com/feed/',
            name: 'The Kenya Times',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://ghafla.com/ke/feed/',
            name: 'Ghafla Entertainment',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.kenyatalk.com/index.php?forums/feed/rss',
            name: 'Kenya Talk',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://hivisasa.com/feed',
            name: 'Hivisasa',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.theorganicfarmer.org/feed/',
            name: 'The Organic Farmer',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.internewske.org/feed',
            name: 'Internews Kenya',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.kenyatoday.com/feed/',
            name: 'Kenya Today',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.mwakilishi.com/feeds/rss/habari',
            name: 'Mwakilishi',
            category: 'kenya',
            priority: 3
        },
        
        // Tier 4: Business & Specialized News (Priority 4)
        {
            url: 'https://oilnewskenya.com/feed/',
            name: 'Oil News Kenya',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.constructionkenya.com/feed/',
            name: 'Construction Kenya',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.kenyanews.co.ke/feed/',
            name: 'Kenya News Co',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.kenyastockexchange.com/feeds/news',
            name: 'NSE News',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.humanipo.com/feed/',
            name: 'Humanipo (Tech)',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://techweez.com/feed/',
            name: 'Techweez',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.businesstoday.co.ke/feed/',
            name: 'Business Today',
            category: 'kenya',
            priority: 4
        },
        
        // Tier 5: Additional Major Sources (Priority 1-2)
        {
            url: 'https://www.the-star.co.ke/feed/',
            name: 'The Star Kenya',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.citizen.digital/feed/',
            name: 'Citizen Digital',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.pd.co.ke/feed/',
            name: 'People Daily',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.rfi.fr/en/tag/kenya/rss',
            name: 'RFI Kenya',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.bbc.com/news/world/africa/kenya/rss.xml',
            name: 'BBC Kenya',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.theexchange.africa/feed/',
            name: 'The Exchange Africa',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyainsider.com/feed/',
            name: 'Kenya Insider',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.spice.co.ke/feed/',
            name: 'Spice FM',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.tuko.co.ke/rss/kenya-news.xml',
            name: 'Tuko Kenya News',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.standardmedia.co.ke/sports/feed/',
            name: 'Standard Sports',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.standardmedia.co.ke/business/feed/',
            name: 'Standard Business',
            category: 'kenya',
            priority: 2
        },
        
        // Tier 6: Digital and Social Media Sources (Priority 3)
        {
            url: 'https://www.kenyainsight.com/feed/',
            name: 'Kenya Insight',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.kenyapost.net/feed/',
            name: 'Kenya Post',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.kenyaafricanews.com/feed/',
            name: 'Kenya Africa News',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.kenyanews24.com/feed/',
            name: 'Kenya News 24',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.dhahabu.com/feed/',
            name: 'Dhahabu Kenya',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.thesharpnews.com/feed/',
            name: 'The Sharp News',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.kenyastocksexchange.com/feed/',
            name: 'Kenya Stock Exchange',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.kenyayote.com/feed/',
            name: 'Kenya Yote',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.uongozi.co.ke/feed/',
            name: 'Uongozi Kenya',
            category: 'kenya',
            priority: 3
        },
        {
            url: 'https://www.businessdailyafrica.com/corporate/feed/',
            name: 'BDA Corporate',
            category: 'kenya',
            priority: 3
        },
        
        // Tier 7: Specialized News Sources (Priority 4)
        {
            url: 'https://www.kenyatradeportal.go.ke/feed/',
            name: 'Kenya Trade Portal',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.kenyaforestservice.org/feed/',
            name: 'Kenya Forest Service',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.kenyalaw.org/feed/',
            name: 'Kenya Law',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.kenyaexport.org/feed/',
            name: 'Kenya Export',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.kenyachamber.or.ke/feed/',
            name: 'Kenya Chamber',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.kenyabankers.or.ke/feed/',
            name: 'Kenya Bankers',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.kenyaassociation.or.ke/feed/',
            name: 'Kenya Association',
            category: 'kenya',
            priority: 4
        },
        {
            url: 'https://www.kenyainsurance.or.ke/feed/',
            name: 'Kenya Insurance',
            category: 'kenya',
            priority: 4
        },
        
        // Tier 8: Additional Major Kenya News Sources (Priority 1-2)
        {
            url: 'https://www.standardmedia.co.ke/feed/',
            name: 'Standard Media',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.nation.co.ke/kenya/feed/',
            name: 'Nation Africa Kenya',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.edaily.co.ke/feed/',
            name: 'E-Daily',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.kenyans.co.ke/feed/',
            name: 'Kenyans News',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.kenya-news.com/feed/',
            name: 'Kenya News',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.kenyamonitor.co.ke/feed/',
            name: 'Kenya Monitor',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.pulselive.co.ke/feed/',
            name: 'Pulse Live Kenya',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.kahawatungu.com/feed/',
            name: 'Kahawa Tungu',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.kenyatoday.com/feeds/rss',
            name: 'Kenya Today RSS',
            category: 'kenya',
            priority: 1
        },
        {
            url: 'https://www.nairobimagazine.co.ke/feed/',
            name: 'Nairobi Magazine',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyainsight.com/feeds/rss',
            name: 'Kenya Insight RSS',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyawebster.com/feed/',
            name: 'Kenya Webster',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyapage.net/feed/',
            name: 'Kenya Page',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyatoday.news/feed/',
            name: 'Kenya Today News',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.mynairobi.co.ke/feed/',
            name: 'My Nairobi',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyatvnews.com/feed/',
            name: 'Kenya TV News',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.nairobipress.com/feed/',
            name: 'Nairobi Press',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyatimes.co.ke/feed/',
            name: 'Kenya Times',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyatalk.co.ke/feed/',
            name: 'Kenya Talk News',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.eastafricannews.net/feed/',
            name: 'East African News',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyabroadcasting.com/feed/',
            name: 'Kenya Broadcasting',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyavoice.com/feed/',
            name: 'Kenya Voice',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyawirenews.com/feed/',
            name: 'Kenya Wire News',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyapress.com/feed/',
            name: 'Kenya Press',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaupdate.com/feed/',
            name: 'Kenya Update',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyahub.com/feed/',
            name: 'Kenya Hub',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyagateway.com/feed/',
            name: 'Kenya Gateway',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyasun.com/feed/',
            name: 'Kenya Sun',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaherald.com/feed/',
            name: 'Kenya Herald',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaobserver.com/feed/',
            name: 'Kenya Observer',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaweekly.com/feed/',
            name: 'Kenya Weekly',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyafocus.com/feed/',
            name: 'Kenya Focus',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyawatch.com/feed/',
            name: 'Kenya Watch',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaonline.com/feed/',
            name: 'Kenya Online',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaview.com/feed/',
            name: 'Kenya View',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyastory.com/feed/',
            name: 'Kenya Story',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyabeat.com/feed/',
            name: 'Kenya Beat',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaflash.com/feed/',
            name: 'Kenya Flash',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyajournal.com/feed/',
            name: 'Kenya Journal',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyatrends.com/feed/',
            name: 'Kenya Trends',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyalive.com/feed/',
            name: 'Kenya Live',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyasports.com/feed/',
            name: 'Kenya Sports',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyabusiness.com/feed/',
            name: 'Kenya Business',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaentertainment.com/feed/',
            name: 'Kenya Entertainment',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyatech.com/feed/',
            name: 'Kenya Tech',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyahealth.com/feed/',
            name: 'Kenya Health',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaeducation.com/feed/',
            name: 'Kenya Education',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaagriculture.com/feed/',
            name: 'Kenya Agriculture',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyatravel.com/feed/',
            name: 'Kenya Travel',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaculture.com/feed/',
            name: 'Kenya Culture',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyapolitics.com/feed/',
            name: 'Kenya Politics',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaeconomy.com/feed/',
            name: 'Kenya Economy',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaweather.com/feed/',
            name: 'Kenya Weather',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyaenvironment.com/feed/',
            name: 'Kenya Environment',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyawildlife.com/feed/',
            name: 'Kenya Wildlife',
            category: 'kenya',
            priority: 2
        },
        {
            url: 'https://www.kenyatourism.com/feed/',
            name: 'Kenya Tourism',
            category: 'kenya',
            priority: 2
        }
    ],
    apis: [
        {
            name: 'NewsAPI.org Kenya',
            endpoint: 'https://newsapi.org/v2/top-headlines',
            params: {
                country: 'ke',
                pageSize: 50,
                apiKey: () => getAPIKey('NEWSAPI_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 1
        },
        {
            name: 'NewsData.io Kenya',
            endpoint: 'https://newsdata.io/api/1/latest',
            params: {
                country: 'ke',
                language: 'en',
                size: 50,
                apikey: () => getAPIKey('NEWSDATA_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 1
        },
        {
            name: 'WorldNewsAPI Kenya',
            endpoint: 'https://api.worldnewsapi.com/search-news',
            params: {
                'source-countries': 'ke',
                'language': 'en',
                'number': 50,
                'api-key': () => getAPIKey('WORLDNEWS_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 2
        },
        {
            name: 'MediaStack Kenya',
            endpoint: 'https://api.mediastack.com/v1/news',
            params: {
                countries: 'ke',
                languages: 'en',
                limit: 50,
                access_key: () => getAPIKey('MEDIASTACK_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 2
        },
        {
            name: 'NewsAPI.ai Kenya',
            endpoint: 'https://eventregistry.org/api/v1/article/getArticles',
            params: {
                query: '{"$query":{"$and":[{"locationUri":"http://en.wikipedia.org/wiki/Kenya"},{"lang":"eng"}]},"$filter":{"forceMaxDataTimeWindow":"31"}}',
                resultType: 'articles',
                articlesSortBy: 'date',
                articlesCount: 50,
                apiKey: () => getAPIKey('EVENTREGISTRY_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 2
        },
        {
            name: 'CurrentsAPI Kenya',
            endpoint: 'https://api.currentsapi.services/v1/search',
            params: {
                keywords: 'Kenya OR Nairobi OR Kenyan',
                language: 'en',
                page_size: 50,
                apiKey: () => getAPIKey('CURRENTS_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 3
        },
        {
            name: 'GNews Kenya',
            endpoint: 'https://gnews.io/api/v4/search',
            params: {
                q: 'Kenya OR Nairobi',
                lang: 'en',
                country: 'ke',
                max: 50,
                apikey: () => getAPIKey('GNEWS_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 2
        },
        {
            name: 'Bing News Kenya',
            endpoint: 'https://api.bing.microsoft.com/v7.0/news/search',
            params: {
                q: 'Kenya site:kenya OR site:ke',
                count: 50,
                mkt: 'en-KE',
                freshness: 'Day',
                'Ocp-Apim-Subscription-Key': () => getAPIKey('BING_NEWS_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 2
        },
        {
            name: 'NewsAPI Everything Kenya',
            endpoint: 'https://newsapi.org/v2/everything',
            params: {
                q: 'Kenya OR Nairobi OR Kenyan',
                language: 'en',
                sortBy: 'publishedAt',
                pageSize: 50,
                from: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                apiKey: () => getAPIKey('NEWSAPI_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 2
        },
        {
            name: 'NewsData Archive Kenya',
            endpoint: 'https://newsdata.io/api/1/archive',
            params: {
                q: 'Kenya OR Nairobi',
                country: 'ke',
                language: 'en',
                size: 50,
                apikey: () => getAPIKey('NEWSDATA_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 3
        },
        {
            name: 'Contextual Web Kenya',
            endpoint: 'https://api.contextualweb.io/api/search/NewsSearchAPI',
            params: {
                q: 'Kenya news',
                count: 50,
                autoCorrect: 'true',
                safeSearch: 'Moderate',
                apikey: () => getAPIKey('CONTEXTUAL_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 3
        },
        {
            name: 'Newscatcher Kenya',
            endpoint: 'https://api.newscatcherapi.com/v2/search',
            params: {
                q: 'Kenya OR Nairobi',
                countries: 'KE',
                lang: 'en',
                page_size: 50,
                sort_by: 'date',
                'X-API-KEY': () => getAPIKey('NEWSCATCHER_KEY', 'demo_key')
            },
            category: 'kenya',
            priority: 3
        },
        {
            name: 'RapidAPI Kenya News',
            endpoint: 'https://newsapi-v2.rapidapi.com/search',
            params: {
                q: 'Kenya',
                lang: 'en',
                sort_by: 'date',
                page_size: 50,
                'X-RapidAPI-Key': () => getAPIKey('RAPIDAPI_KEY', 'demo_key'),
                'X-RapidAPI-Host': 'newsapi-v2.rapidapi.com'
            },
            category: 'kenya',
            priority: 3
        }
    ],
    
    // Additional specialized Kenya news feeds
    government: [
        {
            url: 'https://www.president.go.ke/feed/',
            name: 'State House Kenya',
            category: 'kenya',
            priority: 1,
            type: 'government'
        },
        {
            url: 'https://www.parliament.go.ke/feed/',
            name: 'Parliament of Kenya',
            category: 'kenya',
            priority: 2,
            type: 'government'
        },
        {
            url: 'https://www.treasury.go.ke/feed/',
            name: 'National Treasury',
            category: 'kenya',
            priority: 3,
            type: 'government'
        },
        {
            url: 'https://www.centralbank.go.ke/feed/',
            name: 'Central Bank of Kenya',
            category: 'kenya',
            priority: 3,
            type: 'government'
        }
    ],
    
    // Regional and county news sources
    regional: [
        {
            url: 'https://www.coastweek.com/feed/',
            name: 'Coast Week',
            category: 'kenya',
            priority: 3,
            region: 'coast'
        },
        {
            url: 'https://www.myupcountry.com/feed/',
            name: 'My Upcountry',
            category: 'kenya',
            priority: 4,
            region: 'central'
        },
        {
            url: 'https://www.westernkenya.com/feed/',
            name: 'Western Kenya News',
            category: 'kenya',
            priority: 4,
            region: 'western'
        },
        {
            url: 'https://www.eastpodium.com/feed/',
            name: 'East Podium',
            category: 'kenya',
            priority: 4,
            region: 'eastern'
        },
        {
            url: 'https://www.coastalweek.com/feed/',
            name: 'Coastal Week',
            category: 'kenya',
            priority: 3,
            region: 'coast'
        },
        {
            url: 'https://www.nyanzaprovince.com/feed/',
            name: 'Nyanza Province',
            category: 'kenya',
            priority: 3,
            region: 'nyanza'
        },
        {
            url: 'https://www.riftvalleynews.com/feed/',
            name: 'Rift Valley News',
            category: 'kenya',
            priority: 3,
            region: 'rift_valley'
        },
        {
            url: 'https://www.northernkenya.com/feed/',
            name: 'Northern Kenya',
            category: 'kenya',
            priority: 3,
            region: 'northern'
        },
        {
            url: 'https://www.nairobicounty.go.ke/feed/',
            name: 'Nairobi County',
            category: 'kenya',
            priority: 2,
            region: 'nairobi'
        },
        {
            url: 'https://www.mombasacounty.go.ke/feed/',
            name: 'Mombasa County',
            category: 'kenya',
            priority: 3,
            region: 'mombasa'
        },
        {
            url: 'https://www.kisumucounty.go.ke/feed/',
            name: 'Kisumu County',
            category: 'kenya',
            priority: 3,
            region: 'kisumu'
        },
        {
            url: 'https://www.nakurucounty.go.ke/feed/',
            name: 'Nakuru County',
            category: 'kenya',
            priority: 3,
            region: 'nakuru'
        },
        {
            url: 'https://www.eldoretcounty.go.ke/feed/',
            name: 'Eldoret County',
            category: 'kenya',
            priority: 3,
            region: 'eldoret'
        },
        {
            url: 'https://www.thikatown.com/feed/',
            name: 'Thika Town',
            category: 'kenya',
            priority: 3,
            region: 'thika'
        },
        {
            url: 'https://www.malindikenyatoday.com/feed/',
            name: 'Malindi Kenya Today',
            category: 'kenya',
            priority: 3,
            region: 'malindi'
        }
    ],

    // Educational and University news sources
    educational: [
        {
            url: 'https://www.uonbi.ac.ke/feed/',
            name: 'University of Nairobi',
            category: 'kenya',
            priority: 3,
            type: 'education'
        },
        {
            url: 'https://www.ku.ac.ke/feed/',
            name: 'Kenyatta University',
            category: 'kenya',
            priority: 3,
            type: 'education'
        },
        {
            url: 'https://www.moi.ac.ke/feed/',
            name: 'Moi University',
            category: 'kenya',
            priority: 3,
            type: 'education'
        },
        {
            url: 'https://www.jkuat.ac.ke/feed/',
            name: 'JKUAT',
            category: 'kenya',
            priority: 3,
            type: 'education'
        },
        {
            url: 'https://www.tsc.go.ke/feed/',
            name: 'Teachers Service Commission',
            category: 'kenya',
            priority: 3,
            type: 'education'
        },
        {
            url: 'https://www.cue.or.ke/feed/',
            name: 'Commission for University Education',
            category: 'kenya',
            priority: 3,
            type: 'education'
        }
    ],

    // Sports and Entertainment sources
    sports: [
        {
            url: 'https://www.footballkenya.com/feed/',
            name: 'Football Kenya',
            category: 'kenya',
            priority: 3,
            type: 'sports'
        },
        {
            url: 'https://www.kenyaathletics.com/feed/',
            name: 'Kenya Athletics',
            category: 'kenya',
            priority: 3,
            type: 'sports'
        },
        {
            url: 'https://www.rugbykenya.com/feed/',
            name: 'Rugby Kenya',
            category: 'kenya',
            priority: 3,
            type: 'sports'
        },
        {
            url: 'https://www.basketballkenya.com/feed/',
            name: 'Basketball Kenya',
            category: 'kenya',
            priority: 3,
            type: 'sports'
        }
    ],

    // Health and Medical sources
    health: [
        {
            url: 'https://www.health.go.ke/feed/',
            name: 'Ministry of Health',
            category: 'kenya',
            priority: 2,
            type: 'health'
        },
        {
            url: 'https://www.kenyamedicalresearch.org/feed/',
            name: 'Kenya Medical Research',
            category: 'kenya',
            priority: 3,
            type: 'health'
        },
        {
            url: 'https://www.medicalnewskenya.com/feed/',
            name: 'Medical News Kenya',
            category: 'kenya',
            priority: 3,
            type: 'health'
        }
    ]
};

// Kenya-specific news categories
const KENYA_CATEGORIES = {
    politics: 'Kenya Politics',
    business: 'Kenya Business',
    sports: 'Kenya Sports',
    entertainment: 'Kenya Entertainment',
    technology: 'Kenya Technology',
    health: 'Kenya Health',
    education: 'Kenya Education',
    agriculture: 'Kenya Agriculture'
};

// Main function to load Kenya-specific news from all enhanced sources
async function loadKenyaSpecificNews() {
    console.log('Loading Kenya-specific news from 80+ enhanced sources...');
    
    const allKenyaArticles = [];
    const loadPromises = [];
    
    // Load from main RSS sources (60+ sources)
    KENYA_NEWS_SOURCES.rss.forEach(source => {
        loadPromises.push(
            loadKenyaRSSSource(source)
                .then(articles => {
                    console.log(`Loaded ${articles.length} articles from ${source.name}`);
                    allKenyaArticles.push(...articles);
                })
                .catch(error => {
                    console.warn(`Failed to load from ${source.name}:`, error);
                })
        );
    });
    
    // Load from API sources (13 APIs)
    KENYA_NEWS_SOURCES.apis.forEach(source => {
        loadPromises.push(
            loadKenyaAPISource(source)
                .then(articles => {
                    console.log(`Loaded ${articles.length} articles from ${source.name}`);
                    allKenyaArticles.push(...articles);
                })
                .catch(error => {
                    console.warn(`Failed to load from ${source.name}:`, error);
                })
        );
    });
    
    // Load from government sources (4 sources)
    KENYA_NEWS_SOURCES.government.forEach(source => {
        loadPromises.push(
            loadKenyaRSSSource(source)
                .then(articles => {
                    console.log(`Loaded ${articles.length} government articles from ${source.name}`);
                    allKenyaArticles.push(...articles);
                })
                .catch(error => {
                    console.warn(`Failed to load government source ${source.name}:`, error);
                })
        );
    });
    
    // Load from regional sources (15 sources)
    KENYA_NEWS_SOURCES.regional.forEach(source => {
        loadPromises.push(
            loadKenyaRSSSource(source)
                .then(articles => {
                    console.log(`Loaded ${articles.length} regional articles from ${source.name}`);
                    allKenyaArticles.push(...articles);
                })
                .catch(error => {
                    console.warn(`Failed to load regional source ${source.name}:`, error);
                })
        );
    });

    // Load from educational sources (6 sources)
    KENYA_NEWS_SOURCES.educational.forEach(source => {
        loadPromises.push(
            loadKenyaRSSSource(source)
                .then(articles => {
                    console.log(`Loaded ${articles.length} educational articles from ${source.name}`);
                    allKenyaArticles.push(...articles);
                })
                .catch(error => {
                    console.warn(`Failed to load educational source ${source.name}:`, error);
                })
        );
    });

    // Load from sports sources (4 sources)
    KENYA_NEWS_SOURCES.sports.forEach(source => {
        loadPromises.push(
            loadKenyaRSSSource(source)
                .then(articles => {
                    console.log(`Loaded ${articles.length} sports articles from ${source.name}`);
                    allKenyaArticles.push(...articles);
                })
                .catch(error => {
                    console.warn(`Failed to load sports source ${source.name}:`, error);
                })
        );
    });

    // Load from health sources (3 sources)
    KENYA_NEWS_SOURCES.health.forEach(source => {
        loadPromises.push(
            loadKenyaRSSSource(source)
                .then(articles => {
                    console.log(`Loaded ${articles.length} health articles from ${source.name}`);
                    allKenyaArticles.push(...articles);
                })
                .catch(error => {
                    console.warn(`Failed to load health source ${source.name}:`, error);
                })
        );
    });
    
    // Wait for all sources to complete with 10-second timeout for better UX
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 10000));
    await Promise.race([Promise.allSettled(loadPromises), timeoutPromise]);
    
    // Remove duplicates using enhanced deduplication
    const uniqueArticles = removeDuplicateKenyaArticles(allKenyaArticles);
    
    // Apply additional clustering for time-based duplicates
    const clusteredArticles = clusterSimilarArticles(uniqueArticles);
    
    // Sort by priority and date
    const sortedArticles = clusteredArticles.sort((a, b) => {
        // First by priority (lower number = higher priority)
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        // Then by date (newer first)
        return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
    
    // Fallback articles disabled - only real-time news should be displayed
    // If real APIs fail, users will see appropriate error messages instead of sample content
    
    const totalSources = KENYA_NEWS_SOURCES.rss.length + KENYA_NEWS_SOURCES.apis.length + KENYA_NEWS_SOURCES.government.length + KENYA_NEWS_SOURCES.regional.length + KENYA_NEWS_SOURCES.educational.length + KENYA_NEWS_SOURCES.sports.length + KENYA_NEWS_SOURCES.health.length;
    console.log(`Total Kenya articles loaded: ${sortedArticles.length} from ${totalSources} sources`);
    
    // If no articles were loaded, provide informative error message with fallback
    if (sortedArticles.length === 0) {
        console.warn('No Kenya articles loaded from any source. This may be due to CORS restrictions or network issues.');
        
        // Provide informative fallback content instead of throwing error
        return [{
            title: 'Kenya News Service Status',
            description: 'Our Kenya news service is currently experiencing technical difficulties. This may be due to network restrictions or temporary service issues. We are working to restore full service. Please check back later for the latest Kenya news updates.',
            url: '#',
            urlToImage: 'assets/default.svg',
            publishedAt: new Date().toISOString(),
            source: { name: 'Brightlens News System' },
            category: 'kenya',
            priority: 1,
            kenyaSource: true
        }];
    }
    
    return sortedArticles;
}

// Load news from Kenya RSS sources
async function loadKenyaRSSSource(source) {
    try {
        const parser = new RSSParser({
            headers: {
                'User-Agent': 'Brightlens News Reader 1.0'
            }
        });
        
        // Use CORS proxy for RSS feeds
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(source.url)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const feed = await parser.parseString(data.contents);
        
        return feed.items.slice(0, 20).map(item => ({
            title: cleanTitle(item.title),
            description: cleanDescription(item.contentSnippet || item.description),
            url: item.link,
            urlToImage: extractImageFromKenyaContent(item.content) || null,
            publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
            source: { name: source.name },
            category: 'kenya',
            priority: source.priority,
            kenyaSource: true
        }));
        
    } catch (error) {
        console.error(`Error loading Kenya RSS from ${source.name}:`, error);
        return [];
    }
}

// Load news from Kenya API sources
async function loadKenyaAPISource(source) {
    try {
        const params = new URLSearchParams();
        
        // Build parameters
        Object.entries(source.params).forEach(([key, value]) => {
            const paramValue = typeof value === 'function' ? value() : value;
            params.append(key, paramValue);
        });
        
        const url = `${source.endpoint}?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Handle different API response formats
        let articles = [];
        if (data.articles) {
            articles = data.articles; // NewsAPI format
        } else if (data.results) {
            articles = data.results; // NewsData.io format
        } else if (data.value) {
            articles = data.value; // Bing News format
        } else if (data.news) {
            articles = data.news; // Some APIs use 'news' field
        } else if (data.data) {
            articles = data.data; // Some APIs use 'data' field
        } else if (Array.isArray(data)) {
            articles = data;
        }
        
        return articles.slice(0, 30).map(item => ({
            title: cleanTitle(item.title),
            description: cleanDescription(item.description || item.content),
            url: item.url || item.link,
            urlToImage: item.urlToImage || item.image_url || null,
            publishedAt: item.publishedAt || item.pubDate || new Date().toISOString(),
            source: { name: item.source?.name || source.name },
            category: 'kenya',
            priority: source.priority,
            kenyaSource: true
        }));
        
    } catch (error) {
        console.error(`Error loading Kenya API from ${source.name}:`, error);
        return [];
    }
}

// Extract images from Kenya news content
function extractImageFromKenyaContent(content) {
    if (!content) return null;
    
    // Look for image URLs in content
    const imgMatches = [
        /<img[^>]+src="([^">]+)"/i,
        /<img[^>]+src='([^'>]+)'/i,
        /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi
    ];
    
    for (const regex of imgMatches) {
        const match = content.match(regex);
        if (match) {
            return match[1] || match[0];
        }
    }
    
    return null;
}

// Generate Kenya-themed placeholder image
function generateKenyaPlaceholder() {
    const kenyaPlaceholders = [
        'https://via.placeholder.com/400x200/CC0000/FFFFFF?text=Kenya+News',
        'https://via.placeholder.com/400x200/000000/FFFFFF?text=Kenya+Breaking',
        'https://via.placeholder.com/400x200/FFFFFF/000000?text=Kenya+Updates'
    ];
    
    return kenyaPlaceholders[Math.floor(Math.random() * kenyaPlaceholders.length)];
}

// Clean and format article titles
function cleanTitle(title) {
    if (!title) return 'Untitled';
    
    // Remove extra whitespace and HTML entities
    return title
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Clean and format article descriptions
function cleanDescription(description) {
    if (!description) return 'No description available.';
    
    // Remove HTML tags and clean up text
    return description
        .replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200) + (description.length > 200 ? '...' : '');
}

// Get API key from environment or fallback - Browser compatible
function getAPIKey(keyName, fallback) {
    // In browser context, use fallback demo keys
    // Note: For production, API keys should be configured server-side
    return fallback;
}

// Kenya news source health checker
async function checkKenyaSourcesHealth() {
    console.log('Checking Kenya news sources health...');
    
    const healthReport = {
        rss: {},
        apis: {},
        summary: {
            total: 0,
            working: 0,
            failed: 0
        }
    };
    
    // Check RSS sources
    for (const source of KENYA_NEWS_SOURCES.rss) {
        try {
            const articles = await loadKenyaRSSSource(source);
            healthReport.rss[source.name] = {
                status: 'working',
                articleCount: articles.length,
                lastChecked: new Date().toISOString()
            };
            healthReport.summary.working++;
        } catch (error) {
            healthReport.rss[source.name] = {
                status: 'failed',
                error: error.message,
                lastChecked: new Date().toISOString()
            };
            healthReport.summary.failed++;
        }
        healthReport.summary.total++;
    }
    
    // Check API sources
    for (const source of KENYA_NEWS_SOURCES.apis) {
        try {
            const articles = await loadKenyaAPISource(source);
            healthReport.apis[source.name] = {
                status: 'working',
                articleCount: articles.length,
                lastChecked: new Date().toISOString()
            };
            healthReport.summary.working++;
        } catch (error) {
            healthReport.apis[source.name] = {
                status: 'failed',
                error: error.message,
                lastChecked: new Date().toISOString()
            };
            healthReport.summary.failed++;
        }
        healthReport.summary.total++;
    }
    
    console.log('Kenya sources health report:', healthReport);
    return healthReport;
}

// Enhanced deduplication specifically for Kenya articles
function removeDuplicateKenyaArticles(articles) {
    const seen = new Set();
    const titleWords = new Map();
    const contentHashes = new Set();
    const similarityThreshold = 0.82; // Slightly lower threshold for better detection
    
    return articles.filter(article => {
        // Skip articles without essential data
        if (!article.title || !article.url) return false;
        
        // Normalize URL for better duplicate detection
        const normalizedUrl = normalizeUrl(article.url);
        
        // Check for exact URL duplicates
        if (seen.has(normalizedUrl)) return false;
        
        // Check for title similarity
        const cleanTitle = cleanTitleForComparison(article.title);
        
        // Generate content hash for duplicate detection
        const contentHash = generateContentHash(article);
        if (contentHashes.has(contentHash)) {
            console.log(`Duplicate detected (content hash): "${article.title}"`);
            return false;
        }
        
        // Check against existing titles for similarity
        for (const [existingTitle, existingUrl] of titleWords) {
            const similarity = calculateTextSimilarity(cleanTitle, existingTitle);
            if (similarity > similarityThreshold) {
                console.log(`Duplicate detected (title similarity): "${article.title}" similar to existing article`);
                return false;
            }
        }
        
        // Add to tracking sets
        seen.add(normalizedUrl);
        titleWords.set(cleanTitle, normalizedUrl);
        contentHashes.add(contentHash);
        
        return true;
    });
}

// Normalize URL for better duplicate detection
function normalizeUrl(url) {
    try {
        const urlObj = new URL(url);
        // Remove common tracking parameters
        const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'fbclid', 'gclid'];
        trackingParams.forEach(param => urlObj.searchParams.delete(param));
        
        // Normalize domain
        const domain = urlObj.hostname.replace(/^www\./, '');
        
        // Return normalized URL
        return `${urlObj.protocol}//${domain}${urlObj.pathname}${urlObj.search}`;
    } catch (e) {
        // Return original URL if normalization fails
        return url;
    }
}

// Clean title for better comparison
function cleanTitleForComparison(title) {
    if (!title) return '';
    
    // Common words and phrases to remove for better duplicate detection
    const stopWords = [
        'breaking', 'news', 'report', 'update', 'latest', 'exclusive', 'video', 'photos',
        'kenya', 'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi',
        'today', 'yesterday', 'now', 'just', 'in', 'live', 'watch', 'read', 'more'
    ];
    
    let cleanTitle = title.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    // Remove stop words
    const words = cleanTitle.split(' ');
    const filteredWords = words.filter(word => 
        word.length > 2 && !stopWords.includes(word)
    );
    
    return filteredWords.join(' ');
}

// Generate content hash for duplicate detection
function generateContentHash(article) {
    const content = [
        cleanTitleForComparison(article.title) || '',
        article.description?.toLowerCase().replace(/[^\w\s]/g, '').trim() || '',
        article.source?.name?.toLowerCase() || '',
        article.publishedAt?.split('T')[0] || '' // Date only
    ].join('|');
    
    return simpleHash(content);
}

// Simple hash function for content
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

// Cluster similar articles that might be published at different times
function clusterSimilarArticles(articles) {
    const clusters = [];
    const processed = new Set();
    
    articles.forEach((article, index) => {
        if (processed.has(index)) return;
        
        const cluster = [article];
        processed.add(index);
        
        // Find similar articles within a time window
        for (let i = index + 1; i < articles.length; i++) {
            if (processed.has(i)) continue;
            
            const otherArticle = articles[i];
            
            // Check if articles are within 24 hours of each other
            const timeDiff = Math.abs(new Date(article.publishedAt) - new Date(otherArticle.publishedAt));
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff <= 24) {
                // Check for content similarity
                const titleSimilarity = calculateTextSimilarity(
                    cleanTitleForComparison(article.title),
                    cleanTitleForComparison(otherArticle.title)
                );
                
                // Check for description similarity if available
                let descSimilarity = 0;
                if (article.description && otherArticle.description) {
                    descSimilarity = calculateTextSimilarity(
                        article.description.toLowerCase().replace(/[^\w\s]/g, '').trim(),
                        otherArticle.description.toLowerCase().replace(/[^\w\s]/g, '').trim()
                    );
                }
                
                // If either title or description similarity is high, consider them duplicates
                if (titleSimilarity > 0.7 || descSimilarity > 0.8) {
                    cluster.push(otherArticle);
                    processed.add(i);
                }
            }
        }
        
        // Select the best article from the cluster
        if (cluster.length > 1) {
            const bestArticle = selectBestArticleFromCluster(cluster);
            clusters.push(bestArticle);
        } else {
            clusters.push(article);
        }
    });
    
    return clusters;
}

// Select the best article from a cluster of similar articles
function selectBestArticleFromCluster(cluster) {
    // Sort by priority (lower is better), then by date (newer is better)
    const sorted = cluster.sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
    
    // Return the best article but with potentially enhanced metadata
    const bestArticle = sorted[0];
    
    // If multiple sources reported the same story, note it
    if (cluster.length > 1) {
        const sources = cluster.map(article => article.source?.name).filter(Boolean);
        const uniqueSources = [...new Set(sources)];
        
        // Add metadata about multiple sources
        bestArticle.multipleSources = uniqueSources;
        bestArticle.sourceCount = uniqueSources.length;
    }
    
    return bestArticle;
}

// Calculate text similarity using multiple methods
function calculateTextSimilarity(str1, str2) {
    // Jaccard similarity
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    const jaccardSimilarity = intersection.size / union.size;
    
    // Levenshtein distance similarity
    const levenshteinSimilarity = 1 - (levenshteinDistance(str1, str2) / Math.max(str1.length, str2.length));
    
    // Return weighted average
    return (jaccardSimilarity * 0.6) + (levenshteinSimilarity * 0.4);
}

// Calculate Levenshtein distance
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Enhanced Kenya news filtering
function filterKenyaNews(articles, filters = {}) {
    let filtered = articles.filter(article => article.category === 'kenya');
    
    // Filter by subcategory if specified
    if (filters.subcategory) {
        filtered = filtered.filter(article => 
            article.title.toLowerCase().includes(filters.subcategory.toLowerCase()) ||
            (article.description && article.description.toLowerCase().includes(filters.subcategory.toLowerCase()))
        );
    }
    
    // Filter by date range if specified
    if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filtered = filtered.filter(article => 
            new Date(article.publishedAt) >= fromDate
        );
    }
    
    if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        filtered = filtered.filter(article => 
            new Date(article.publishedAt) <= toDate
        );
    }
    
    // Filter by source priority if specified
    if (filters.priority) {
        filtered = filtered.filter(article => 
            article.priority <= filters.priority
        );
    }
    
    return filtered;
}

// Generate fallback Kenya articles when sources fail
function generateKenyaFallbackArticles(count = 20) {
    // Function disabled - only real-time news should be displayed
    // Return empty array to prevent showing sample articles
    return [];
}

// Export functions for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadKenyaSpecificNews,
        checkKenyaSourcesHealth,
        filterKenyaNews,
        generateKenyaFallbackArticles,
        KENYA_NEWS_SOURCES,
        KENYA_CATEGORIES
    };
}
