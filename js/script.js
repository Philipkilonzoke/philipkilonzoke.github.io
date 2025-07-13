// News API configuration
const NEWS_APIS = {
    currentsapi: {
        url: 'https://api.currentsapi.services/v1/latest-news',
        key: 'YOUR_CURRENTS_API_KEY',
        params: {
            apiKey: 'YOUR_CURRENTS_API_KEY',
            language: 'en',
            country: 'US'
        }
    },
    newsdata: {
        url: 'https://newsdata.io/api/1/news',
        key: 'YOUR_NEWSDATA_API_KEY',
        params: {
            apikey: 'YOUR_NEWSDATA_API_KEY',
            language: 'en',
            country: 'us'
        }
    }
};

// Global variables
let allArticles = [];
let currentPage = 1;
let isLoading = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadNews();
});

// Load news from multiple sources
async function loadNews() {
    if (isLoading) return;
    
    isLoading = true;
    showLoadingState();
    
    try {
        // Get API keys from environment or use defaults
        const currentsApiKey = getApiKey('CURRENTS_API_KEY');
        const newsdataApiKey = getApiKey('NEWSDATA_API_KEY');
        
        // Fetch from multiple sources
        const promises = [];
        
        if (currentsApiKey) {
            promises.push(fetchFromCurrentsAPI(currentsApiKey));
        }
        
        if (newsdataApiKey) {
            promises.push(fetchFromNewsDataAPI(newsdataApiKey));
        }
        
        // If no API keys available, use sample data
        if (promises.length === 0) {
            displaySampleNews();
            return;
        }
        
        const results = await Promise.allSettled(promises);
        
        // Process results
        let combinedArticles = [];
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                combinedArticles = combinedArticles.concat(result.value);
            }
        });
        
        if (combinedArticles.length === 0) {
            showErrorState();
            return;
        }
        
        // Sort articles by publication date (newest first)
        combinedArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        allArticles = combinedArticles;
        displayNews(allArticles);
        updateArticleCount();
        
    } catch (error) {
        console.error('Error loading news:', error);
        showErrorState();
    } finally {
        isLoading = false;
    }
}

// Fetch from CurrentsAPI
async function fetchFromCurrentsAPI(apiKey) {
    try {
        const response = await fetch(`${NEWS_APIS.currentsapi.url}?apiKey=${apiKey}&language=en&country=US`);
        
        if (!response.ok) {
            throw new Error(`CurrentsAPI error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.news) {
            return data.news.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.image,
                publishedAt: article.published,
                category: article.category && article.category.length > 0 ? article.category[0] : 'general',
                timeAgo: getTimeAgo(article.published)
            }));
        }
        
        return [];
    } catch (error) {
        console.error('CurrentsAPI fetch error:', error);
        return [];
    }
}

// Fetch from NewsData API
async function fetchFromNewsDataAPI(apiKey) {
    try {
        const response = await fetch(`${NEWS_APIS.newsdata.url}?apikey=${apiKey}&language=en&country=us`);
        
        if (!response.ok) {
            throw new Error(`NewsData API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.results) {
            return data.results.map(article => ({
                title: article.title,
                description: article.description,
                url: article.link,
                urlToImage: article.image_url,
                publishedAt: article.pubDate,
                category: article.category && article.category.length > 0 ? article.category[0] : 'general',
                timeAgo: getTimeAgo(article.pubDate)
            }));
        }
        
        return [];
    } catch (error) {
        console.error('NewsData API fetch error:', error);
        return [];
    }
}

// Get API key from environment or return default
function getApiKey(keyName) {
    // In a real environment, this would get from process.env or similar
    // For now, return null to trigger sample data
    return null;
}

// Display sample news when no API keys are available
function displaySampleNews() {
    const sampleArticles = [
        {
            title: "Breaking News Story 1",
            description: "Latest developments in ongoing news story with comprehensive coverage and analysis.",
            url: "https://example.com/news-1",
            urlToImage: "https://via.placeholder.com/400x200/16a34a/ffffff?text=Brightlens+News",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            category: "latest",
            timeAgo: "1h ago"
        }
    ];
    
    allArticles = sampleArticles;
    displayNews(allArticles);
    updateArticleCount();
}

// Display news articles
function displayNews(articles) {
    const newsGrid = document.getElementById('news-grid');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    
    // Hide loading and error states
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    
    // Clear existing articles
    newsGrid.innerHTML = '';
    
    if (articles.length === 0) {
        showErrorState();
        return;
    }
    
    articles.forEach(article => {
        const articleCard = createArticleCard(article);
        newsGrid.appendChild(articleCard);
    });
    
    updateLastUpdated();
}

// Create article card HTML - REMOVED SOURCE OVERLAY
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x200/16a34a/ffffff?text=No+Image';
    const title = article.title || 'No Title Available';
    const description = article.description || 'No description available.';
    const category = article.category || 'general';
    const timeAgo = article.timeAgo || 'Unknown time';
    const url = article.url || '#';
    
    card.innerHTML = `
        <div class="article-image">
            <img src="${imageUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/400x200/16a34a/ffffff?text=Image+Not+Available'">
        </div>
        <div class="article-content">
            <span class="article-category">${category}</span>
            <h3 class="article-title">${title}</h3>
            <p class="article-description">${description}</p>
            <div class="article-meta">
                <span class="article-time">${timeAgo}</span>
            </div>
            <a href="${url}" class="read-more" target="_blank" rel="noopener noreferrer">Read More</a>
        </div>
    `;
    
    return card;
}

// Show loading state
function showLoadingState() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
}

// Show error state
function showErrorState() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
}

// Update article count
function updateArticleCount() {
    const countElement = document.getElementById('article-count');
    if (countElement && allArticles.length > 0) {
        countElement.textContent = `Showing ${allArticles.length} of ${allArticles.length} articles`;
    }
}

// Update last updated time
function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        lastUpdatedElement.textContent = `Last updated: ${timeString}`;
    }
}

// Get time ago string
function getTimeAgo(dateString) {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const timeDiff = now - publishedDate;
    
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return `${days}d ago`;
    }
}

// Utility functions
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Category mapping for better display
const categoryMap = {
    'general': 'General',
    'business': 'Business',
    'entertainment': 'Entertainment',
    'health': 'Health',
    'science': 'Science',
    'sports': 'Sports',
    'technology': 'Technology',
    'politics': 'Politics',
    'world': 'World',
    'music': 'Music',
    'latest': 'Latest'
};

function formatCategory(category) {
    return categoryMap[category.toLowerCase()] || category;
}
