// Global variables
let allArticles = [];
let displayedArticles = [];
let currentCategory = 'all';
let searchQuery = '';
let isLoading = false;
let currentPage = 1;
const articlesPerPage = 12;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadSavedTheme();
    loadNews();
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function setupEventListeners() {
    // Theme selector
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.addEventListener('change', changeTheme);

    // Category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            selectCategory(category);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', () => {
        loadNews(true);
    });

    // Retry button
    const retryBtn = document.getElementById('retryBtn');
    retryBtn.addEventListener('click', () => {
        loadNews(true);
    });

    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.addEventListener('click', loadMoreArticles);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
    const themeSelect = document.getElementById('themeSelect');
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);
}

function changeTheme() {
    const themeSelect = document.getElementById('themeSelect');
    const selectedTheme = themeSelect.value;
    applyTheme(selectedTheme);
    localStorage.setItem('selectedTheme', selectedTheme);
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
}

function selectCategory(category) {
    currentCategory = category;
    currentPage = 1;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Update title
    const title = category === 'all' ? 'Latest News' : 
                  category === 'kenya' ? 'Kenya News' :
                  `${category.charAt(0).toUpperCase() + category.slice(1)} News`;
    document.getElementById('newsTitle').textContent = title;
    
    // Show Kenya-specific loading if needed
    if (category === 'kenya') {
        showKenyaLoading();
        loadKenyaNews();
    } else {
        hideKenyaLoading();
        filterAndDisplayArticles();
    }
}

function showKenyaLoading() {
    const kenyaSpinner = document.getElementById('kenyaLoadingSpinner');
    kenyaSpinner.style.display = 'flex';
    document.getElementById('newsContainer').style.display = 'none';
}

function hideKenyaLoading() {
    const kenyaSpinner = document.getElementById('kenyaLoadingSpinner');
    kenyaSpinner.style.display = 'none';
    document.getElementById('newsContainer').style.display = 'grid';
}

async function loadNews(forceRefresh = false) {
    if (isLoading && !forceRefresh) return;
    
    isLoading = true;
    showLoading();
    hideError();
    
    try {
        // Clear existing articles if forcing refresh
        if (forceRefresh) {
            allArticles = [];
            displayedArticles = [];
            currentPage = 1;
        }
        
        // Load articles from multiple sources
        const articles = [];
        
        // Regular news sources
        articles.push(...await loadNewsFromSources());
        
        // If Kenya category is selected or loading all, include Kenya-specific sources
        if (currentCategory === 'kenya' || currentCategory === 'all') {
            articles.push(...await loadKenyaSpecificNews());
        }
        
        // Remove duplicates and sort by date
        allArticles = removeDuplicates(articles).sort((a, b) => 
            new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        
        filterAndDisplayArticles();
        updateArticleCount();
        updateLastUpdated();
        
    } catch (error) {
        console.error('Error loading news:', error);
        showError();
    } finally {
        isLoading = false;
        hideLoading();
        hideKenyaLoading();
    }
}

async function loadKenyaNews() {
    try {
        const kenyaArticles = await loadKenyaSpecificNews();
        
        // Add Kenya articles to allArticles if not already present
        kenyaArticles.forEach(article => {
            if (!allArticles.find(a => a.url === article.url)) {
                allArticles.push(article);
            }
        });
        
        // Sort by date
        allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        filterAndDisplayArticles();
        updateArticleCount();
        updateLastUpdated();
        
    } catch (error) {
        console.error('Error loading Kenya news:', error);
        showError();
    } finally {
        hideKenyaLoading();
    }
}

async function loadNewsFromSources() {
    const articles = [];
    
    // General news sources
    const generalSources = [
        'https://feeds.bbci.co.uk/news/rss.xml',
        'https://rss.cnn.com/rss/edition.rss',
        'https://feeds.reuters.com/reuters/topNews',
        'https://feeds.npr.org/1001/rss.xml'
    ];
    
    for (const source of generalSources) {
        try {
            const sourceArticles = await fetchRSSFeed(source);
            articles.push(...sourceArticles.map(article => ({
                ...article,
                category: 'general'
            })));
        } catch (error) {
            console.warn(`Failed to load from ${source}:`, error);
        }
    }
    
    return articles;
}

async function fetchRSSFeed(url) {
    try {
        const parser = new RSSParser({
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        });
        
        // Use a CORS proxy for RSS feeds
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        const feed = await parser.parseString(data.contents);
        
        return feed.items.map(item => ({
            title: item.title,
            description: item.contentSnippet || item.description,
            url: item.link,
            urlToImage: item.enclosure?.url || extractImageFromContent(item.content),
            publishedAt: item.pubDate || item.isoDate,
            source: { name: feed.title || 'RSS Feed' },
            category: 'general'
        }));
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
}

function extractImageFromContent(content) {
    if (!content) return null;
    
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
}

function removeDuplicates(articles) {
    const seen = new Set();
    return articles.filter(article => {
        const key = article.url || article.title;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function filterAndDisplayArticles() {
    let filtered = allArticles;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(article => article.category === currentCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(article => 
            article.title.toLowerCase().includes(query) ||
            (article.description && article.description.toLowerCase().includes(query))
        );
    }
    
    displayedArticles = filtered;
    displayArticles();
}

function displayArticles() {
    const container = document.getElementById('newsContainer');
    const articlesToShow = displayedArticles.slice(0, currentPage * articlesPerPage);
    
    container.innerHTML = '';
    
    if (articlesToShow.length === 0) {
        container.innerHTML = `
            <div class="error-content" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No Articles Found</h3>
                <p>No articles match your current filters. Try adjusting your search or category selection.</p>
            </div>
        `;
        document.getElementById('loadMoreContainer').style.display = 'none';
        return;
    }
    
    articlesToShow.forEach(article => {
        const articleElement = createArticleElement(article);
        container.appendChild(articleElement);
    });
    
    // Show/hide load more button
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (articlesToShow.length < displayedArticles.length) {
        loadMoreContainer.style.display = 'flex';
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

function createArticleElement(article) {
    const articleDiv = document.createElement('div');
    articleDiv.className = `news-article ${article.category === 'kenya' ? 'kenya-article' : ''}`;
    articleDiv.setAttribute('tabindex', '0');
    
    const timeAgo = getTimeAgo(article.publishedAt);
    const defaultImage = 'https://via.placeholder.com/400x200/16a34a/ffffff?text=Brightlens+News';
    
    articleDiv.innerHTML = `
        <img src="${article.urlToImage || defaultImage}" 
             alt="${article.title}" 
             class="article-image"
             onerror="this.src='${defaultImage}'">
        <div class="article-content">
            <div class="article-header">
                <span class="article-source">${article.source.name}</span>
                <span class="article-category">${article.category}</span>
            </div>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-description">${article.description || 'No description available.'}</p>
            <div class="article-footer">
                <span class="article-time">
                    <i class="fas fa-clock"></i>
                    ${timeAgo}
                </span>
                <a href="${article.url}" target="_blank" class="article-link">
                    Read More
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
    
    // Add click handler
    articleDiv.addEventListener('click', () => {
        window.open(article.url, '_blank');
    });
    
    // Add keyboard support
    articleDiv.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.open(article.url, '_blank');
        }
    });
    
    return articleDiv;
}

function loadMoreArticles() {
    currentPage++;
    displayArticles();
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    filterAndDisplayArticles();
}

function getTimeAgo(dateString) {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

function updateArticleCount() {
    const count = displayedArticles.length;
    const total = allArticles.length;
    const countElement = document.getElementById('articleCount');
    
    if (currentCategory !== 'all') {
        countElement.textContent = `Showing ${count} of ${count} articles`;
    } else {
        countElement.textContent = `Showing ${Math.min(currentPage * articlesPerPage, count)} of ${count} articles`;
    }
}

function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('updateTime').textContent = timeString;
}

function updateDateTime() {
    // This could be used for real-time clock updates if needed
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    document.getElementById('newsContainer').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('newsContainer').style.display = 'grid';
}

function showError() {
    document.getElementById('errorMessage').style.display = 'flex';
    document.getElementById('newsContainer').style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'none';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Auto-refresh news every 5 minutes
setInterval(() => {
    if (!isLoading) {
        loadNews();
    }
}, 5 * 60 * 1000);
