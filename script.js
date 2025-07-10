// News API Configuration
const NEWS_API_KEY = 'demo'; // Will be replaced with actual API key from environment
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
const FALLBACK_NEWS_APIS = [
    'https://newsapi.org/v2/top-headlines',
    'https://newsapi.org/v2/everything'
];

// Application State
let currentArticles = [];
let currentPage = 1;
let isLoading = false;
let totalResults = 0;
let currentTheme = 'default';

// DOM Elements
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const newsContent = document.getElementById('newsContent');
const newsGrid = document.getElementById('newsGrid');
const articleCount = document.getElementById('articleCount');
const lastUpdated = document.getElementById('lastUpdated');
const retryBtn = document.getElementById('retryBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const refreshBtn = document.getElementById('refreshBtn');
const themeToggle = document.getElementById('themeToggle');
const themeModal = document.getElementById('themeModal');
const themeModalClose = document.getElementById('themeModalClose');
const errorMessage = document.getElementById('errorMessage');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeFeatherIcons();
    initializeTheme();
    initializeEventListeners();
    loadNews();
});

// Initialize Feather Icons
function initializeFeatherIcons() {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('brightlens-theme') || 'default';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('brightlens-theme', theme);
    
    // Update active theme option
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === theme);
    });
}

// Event Listeners
function initializeEventListeners() {
    // Retry button
    retryBtn.addEventListener('click', handleRetry);
    
    // Load more button
    loadMoreBtn.addEventListener('click', handleLoadMore);
    
    // Refresh button
    refreshBtn.addEventListener('click', handleRefresh);
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        themeModal.classList.add('active');
    });
    
    // Theme modal close
    themeModalClose.addEventListener('click', () => {
        themeModal.classList.remove('active');
    });
    
    // Theme modal overlay close
    themeModal.addEventListener('click', (e) => {
        if (e.target === themeModal) {
            themeModal.classList.remove('active');
        }
    });
    
    // Theme selection
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            applyTheme(option.dataset.theme);
            themeModal.classList.remove('active');
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && themeModal.classList.contains('active')) {
            themeModal.classList.remove('active');
        }
    });
}

// News Loading Functions
async function loadNews(reset = true) {
    if (isLoading) return;
    
    isLoading = true;
    
    if (reset) {
        currentPage = 1;
        currentArticles = [];
        showLoadingState();
    } else {
        setLoadMoreButtonState(true);
    }
    
    try {
        const articles = await fetchNews(currentPage);
        
        if (articles && articles.length > 0) {
            currentArticles = reset ? articles : [...currentArticles, ...articles];
            displayNews(currentArticles);
            updateLastUpdated();
            
            if (!reset) {
                currentPage++;
            }
        } else if (reset) {
            showErrorState('No news articles found. Please try again later.');
        }
        
    } catch (error) {
        console.error('Error loading news:', error);
        
        if (reset) {
            showErrorState(getErrorMessage(error));
        } else {
            showNotification('Failed to load more articles. Please try again.', 'error');
        }
    } finally {
        isLoading = false;
        setLoadMoreButtonState(false);
    }
}

async function fetchNews(page = 1) {
    const pageSize = 20;
    
    // Try multiple news sources
    const newsSources = [
        {
            url: `${NEWS_API_BASE_URL}/top-headlines`,
            params: {
                apiKey: NEWS_API_KEY,
                country: 'us',
                pageSize: pageSize,
                page: page
            }
        },
        {
            url: `${NEWS_API_BASE_URL}/everything`,
            params: {
                apiKey: NEWS_API_KEY,
                q: 'breaking news',
                sortBy: 'publishedAt',
                pageSize: pageSize,
                page: page
            }
        }
    ];
    
    // If no API key is available, use fallback method
    if (NEWS_API_KEY === 'demo') {
        return await fetchFallbackNews();
    }
    
    for (const source of newsSources) {
        try {
            const response = await fetchWithTimeout(source.url, {
                method: 'GET',
                headers: {
                    'X-API-Key': NEWS_API_KEY
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'ok' && data.articles) {
                totalResults = data.totalResults || data.articles.length;
                return data.articles.filter(article => 
                    article.title && 
                    article.title !== '[Removed]' && 
                    article.url
                );
            }
        } catch (error) {
            console.warn(`Failed to fetch from ${source.url}:`, error);
            continue;
        }
    }
    
    throw new Error('All news sources failed to respond');
}

async function fetchFallbackNews() {
    // Fallback news data when API is not available
    const fallbackArticles = [
        {
            title: "Breaking: Major Technology Breakthrough Announced",
            description: "Scientists have announced a significant breakthrough in quantum computing technology that could revolutionize the industry.",
            url: "https://example.com/tech-breakthrough",
            urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
            publishedAt: new Date().toISOString(),
            source: { name: "Tech News" },
            author: "Dr. Sarah Johnson"
        },
        {
            title: "Global Climate Summit Reaches Historic Agreement",
            description: "World leaders have reached a unprecedented agreement on climate action during the international summit.",
            url: "https://example.com/climate-summit",
            urlToImage: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=200&fit=crop",
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { name: "Environmental News" },
            author: "Maria Rodriguez"
        },
        {
            title: "Space Exploration Milestone Achieved",
            description: "A new milestone in space exploration has been achieved with the successful launch of the next-generation spacecraft.",
            url: "https://example.com/space-milestone",
            urlToImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop",
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: { name: "Space News" },
            author: "Dr. Michael Chen"
        },
        {
            title: "Economic Markets Show Strong Recovery",
            description: "Global markets are showing signs of strong recovery following recent economic indicators and policy changes.",
            url: "https://example.com/market-recovery",
            urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            source: { name: "Financial Times" },
            author: "Robert Thompson"
        }
    ];
    
    return fallbackArticles;
}

async function fetchWithTimeout(url, options, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Display Functions
function showLoadingState() {
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    newsContent.style.display = 'none';
}

function showErrorState(message) {
    errorMessage.textContent = message;
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    newsContent.style.display = 'none';
}

function displayNews(articles) {
    if (!articles || articles.length === 0) {
        showErrorState('No news articles available at the moment.');
        return;
    }
    
    newsGrid.innerHTML = '';
    
    articles.forEach(article => {
        const card = createNewsCard(article);
        newsGrid.appendChild(card);
    });
    
    articleCount.textContent = articles.length;
    
    // Show news content
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    newsContent.style.display = 'block';
    
    // Update load more button visibility
    loadMoreBtn.style.display = articles.length >= 20 ? 'block' : 'none';
}

function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    const publishedDate = new Date(article.publishedAt);
    const timeAgo = getTimeAgo(publishedDate);
    
    card.innerHTML = `
        <div class="news-card-image">
            ${article.urlToImage ? 
                `<img src="${article.urlToImage}" alt="${article.title}" loading="lazy" onerror="this.parentElement.innerHTML='<span>Image not available</span>'">` : 
                '<span>No image available</span>'
            }
        </div>
        <div class="news-card-content">
            <div class="news-card-meta">
                <span class="news-source">${article.source?.name || 'Unknown Source'}</span>
                <span class="news-time">${timeAgo}</span>
            </div>
            <h3 class="news-card-title">${sanitizeHTML(article.title)}</h3>
            ${article.description ? `<p class="news-card-description">${sanitizeHTML(article.description)}</p>` : ''}
            <div class="news-card-footer">
                ${article.author ? `<span class="news-card-author">By ${sanitizeHTML(article.author)}</span>` : '<span></span>'}
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="news-card-link">
                    Read More
                    <i data-feather="external-link"></i>
                </a>
            </div>
        </div>
    `;
    
    // Initialize feather icons for this card
    setTimeout(() => {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, 0);
    
    return card;
}

// Utility Functions
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    }
}

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
    lastUpdated.textContent = timeString;
}

function getErrorMessage(error) {
    if (error.name === 'AbortError') {
        return 'Request timed out. Please check your internet connection and try again.';
    } else if (error.message.includes('429')) {
        return 'Too many requests. Please wait a moment and try again.';
    } else if (error.message.includes('401')) {
        return 'API authentication failed. Please check the API configuration.';
    } else if (error.message.includes('403')) {
        return 'Access forbidden. Please check your API permissions.';
    } else if (!navigator.onLine) {
        return 'You appear to be offline. Please check your internet connection.';
    } else {
        return 'Failed to load news. Please try again later.';
    }
}

function setLoadMoreButtonState(loading) {
    if (loading) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i data-feather="loader"></i> Loading...';
    } else {
        loadMoreBtn.disabled = false;
        loadMoreBtn.innerHTML = '<i data-feather="plus"></i> Load More Articles';
    }
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        background: type === 'error' ? '#ef4444' : '#16a34a',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '1001',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Event Handlers
function handleRetry() {
    loadNews(true);
}

function handleLoadMore() {
    if (!isLoading && currentArticles.length > 0) {
        currentPage++;
        loadNews(false);
    }
}

function handleRefresh() {
    // Add spinning animation to refresh button
    refreshBtn.classList.add('spinning');
    setTimeout(() => {
        refreshBtn.classList.remove('spinning');
    }, 1000);
    
    loadNews(true);
}

// Add CSS for spinning animation
const style = document.createElement('style');
style.textContent = `
    .spinning {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .notification {
        transition: all 0.3s ease;
    }
    
    .notification:hover {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Network status monitoring
window.addEventListener('online', () => {
    showNotification('Connection restored. Refreshing news...', 'info');
    loadNews(true);
});

window.addEventListener('offline', () => {
    showNotification('You are offline. Some features may not work.', 'error');
});
