/**
 * Extended Articles Database for Brightlens News
 * Provides fallback articles when APIs are unavailable
 */

class ExtendedArticlesDB {
    constructor() {
        this.baseDate = new Date();
    }

    generateTimeOffsets() {
        const offsets = [];
        for (let i = 0; i < 50; i++) {
            offsets.push(i * 2 + Math.random() * 3); // Hours ago
        }
        return offsets.sort((a, b) => a - b);
    }

    getTimeFromOffset(hoursAgo) {
        const date = new Date(this.baseDate.getTime() - (hoursAgo * 60 * 60 * 1000));
        return date.toISOString();
    }

    getExtendedLatestNews(source = 'News Source') {
        const timeOffsets = this.generateTimeOffsets();
        const articles = [];
        
        for (let i = 0; i < 50; i++) {
            articles.push({
                title: `Breaking News Story ${i + 1}`,
                description: `Latest developments in ongoing news story with comprehensive coverage and analysis.`,
                url: `https://example.com/news-${i + 1}`,
                urlToImage: `https://via.placeholder.com/400x200/16a34a/ffffff?text=Brightlens+News`,
                publishedAt: this.getTimeFromOffset(timeOffsets[i]),
                source: source,
                category: "latest"
            });
        }
        
        return articles;
    }

    getExtendedKenyaNews(source = 'Kenya News Source') {
        const timeOffsets = this.generateTimeOffsets();
        const articles = [];
        
        const kenyanSources = [
            'The Nation', 'The Standard', 'The Star', 'Kenyans.co.ke', 'Citizen Digital',
            'Capital FM', 'KBC', 'Business Daily', 'People Daily', 'Taifa Leo',
            'Kahawa Tungu', 'Kiss FM', 'KTN News', 'Nairobi News'
        ];
        
        const kenyanTopics = [
            {
                title: "Kenya's Economy Shows Strong Recovery Signs",
                description: "Latest economic indicators show promising growth in key sectors including agriculture and manufacturing, boosting investor confidence.",
                category: "kenya"
            },
            {
                title: "Education Reforms Launch Across Kenyan Schools",
                description: "The government rolls out comprehensive education reforms aimed at improving learning outcomes and reducing inequalities.",
                category: "kenya"
            },
            {
                title: "Infrastructure Development Boosts Rural Connectivity",
                description: "New road and digital infrastructure projects connecting remote areas to major economic centers show significant progress.",
                category: "kenya"
            },
            {
                title: "Healthcare Access Improves with Universal Coverage",
                description: "Expansion of healthcare facilities and services brings medical care closer to underserved communities across the country.",
                category: "kenya"
            },
            {
                title: "Agricultural Innovation Transforms Farming Practices",
                description: "Kenyan farmers adopt modern techniques and technology to increase crop yields and adapt to climate change challenges.",
                category: "kenya"
            },
            {
                title: "Tourism Sector Recovery Exceeds Expectations",
                description: "International visitor numbers rebound strongly as Kenya's tourism industry benefits from improved marketing and infrastructure.",
                category: "kenya"
            },
            {
                title: "Technology Hub Growth Attracts Global Investment",
                description: "Kenya's Silicon Savannah continues to attract international tech companies and startups, cementing its regional leadership.",
                category: "kenya"
            },
            {
                title: "Environmental Conservation Efforts Show Positive Results",
                description: "Reforestation programs and wildlife conservation initiatives demonstrate measurable improvements in biodiversity protection.",
                category: "kenya"
            },
            {
                title: "Youth Employment Programs Create New Opportunities",
                description: "Government and private sector initiatives provide skills training and job creation for Kenya's growing youth population.",
                category: "kenya"
            },
            {
                title: "Regional Trade Partnerships Strengthen Economic Ties",
                description: "Enhanced cooperation with East African neighbors opens new markets for Kenyan businesses and entrepreneurs.",
                category: "kenya"
            }
        ];
        
        for (let i = 0; i < 50; i++) {
            const topic = kenyanTopics[i % kenyanTopics.length];
            const randomSource = kenyanSources[Math.floor(Math.random() * kenyanSources.length)];
            
            articles.push({
                title: `${topic.title} - Update ${Math.floor(i/10) + 1}`,
                description: topic.description,
                url: `https://example.com/kenya-${i + 1}`,
                urlToImage: `https://via.placeholder.com/400x200/f97316/ffffff?text=Brightlens+News`,
                publishedAt: this.getTimeFromOffset(timeOffsets[i]),
                source: randomSource,
                category: "kenya"
            });
        }
        
        return articles;
    }

    getExtendedWorldNews(source = 'World News Source') {
        const timeOffsets = this.generateTimeOffsets();
        const articles = [];
        
        for (let i = 0; i < 50; i++) {
            articles.push({
                title: `World News Report ${i + 1}`,
                description: `Global developments affecting international relations and world affairs.`,
                url: `https://example.com/world-${i + 1}`,
                urlToImage: `https://via.placeholder.com/400x200/3182ce/ffffff?text=Brightlens+News`,
                publishedAt: this.getTimeFromOffset(timeOffsets[i]),
                source: source,
                category: "world"
            });
        }
        
        return articles;
    }

    getExtendedTechnologyNews(source = 'Tech News Source') {
        const timeOffsets = this.generateTimeOffsets();
        const articles = [];
        
        for (let i = 0; i < 50; i++) {
            articles.push({
                title: `Technology Innovation ${i + 1}`,
                description: `Latest technological advances and digital innovations shaping the future.`,
                url: `https://example.com/tech-${i + 1}`,
                urlToImage: `https://via.placeholder.com/400x200/667eea/ffffff?text=Brightlens+News`,
                publishedAt: this.getTimeFromOffset(timeOffsets[i]),
                source: source,
                category: "technology"
            });
        }
        
        return articles;
    }

    getExtendedEntertainmentNews(source = 'Entertainment News Source') {
        const timeOffsets = this.generateTimeOffsets();
        const articles = [];
        
        for (let i = 0; i < 50; i++) {
            articles.push({
                title: `Entertainment Update ${i + 1}`,
                description: `Latest entertainment news covering movies, music, and celebrity updates.`,
                url: `https://example.com/entertainment-${i + 1}`,
                urlToImage: `https://via.placeholder.com/400x200/7c3aed/ffffff?text=Brightlens+News`,
                publishedAt: this.getTimeFromOffset(timeOffsets[i]),
                source: source,
                category: "entertainment"
            });
        }
        
        return articles;
    }

    getExtendedBusinessNews(source = 'Business News Source') {
        const timeOffsets = this.generateTimeOffsets();
        const articles = [];
        
        for (let i = 0; i < 50; i++) {
            articles.push({
                title: `Business Development ${i + 1}`,
                description: `Financial markets and business developments affecting the economy.`,
                url: `https://example.com/business-${i + 1}`,
                urlToImage: `https://via.placeholder.com/400x200/059669/ffffff?text=Brightlens+News`,
                publishedAt: this.getTimeFromOffset(timeOffsets[i]),
                source: source,
                category: "business"
            });
        }
        
        return articles;
    }

    getExtendedSportsNews(source = 'Sports News Source') {
        const timeOffsets = this.generateTimeOffsets();
        const articles = [];
        
        for (let i = 0; i < 50; i++) {
            articles.push({
                title: `Sports Update ${i + 1}`,
                description: `Latest sports news and updates from various competitions and leagues.`,
                url: `https://example.com/sports-${i + 1}`,
                urlToImage: `https://via.placeholder.com/400x200/ea580c/ffffff?text=Brightlens+News`,
                publishedAt: this.getTimeFromOffset(timeOffsets[i]),
                source: source,
                category: "sports"
            });
        }
        
        return articles;
    }

    getExtendedHealthNews(source = 'Health News Source') {
        const timeOffsets = this.generateTimeOffsets();
        const articles = [];
        
        for (let i = 0; i < 50; i++) {
            articles.push({
                title: `Health Report ${i + 1}`,
                description: `Health and wellness news with medical updates and research findings.`,
                url: `https://example.com/health-${i + 1}`,
                urlToImage: `https://via.placeholder.com/400x200/10b981/ffffff?text=Brightlens+News`,
                publishedAt: this.getTimeFromOffset(timeOffsets[i]),
                source: source,
                category: "health"
            });
        }
        
        return articles;
    }
}

// Make available globally
window.ExtendedArticlesDB = ExtendedArticlesDB;