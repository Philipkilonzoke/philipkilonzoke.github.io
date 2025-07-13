/**
 * Main JavaScript for Brightlens News
 * Handles navigation, news loading, and UI interactions
 */

class BrightlensNews {
    constructor() {
        this.newsAPI = new NewsAPI();
        this.currentCategory = 'latest';
        this.currentPage = 1;
        this.articlesPerPage = 50;
        this.allArticles = [];
        this.displayedArticles = [];
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoadingScreen();
        
        // Load initial news after a short delay for better UX
        setTimeout(() => {
            this.loadNews('latest');
            this.hideLoadingScreen();
        }, 1500);
    }

    setupEventListeners() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link, .sidebar-link[data-category]');
        const sidebarElement = document.querySelector('.sidebar');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                if (category) {
                    this.switchCategory(category);
                    
                    // Auto-collapse sidebar on mobile/tablet when category is clicked
                    if (sidebarElement && sidebarElement.classList.contains('open')) {
                        sidebarElement.classList.remove('open');
                    }
                }
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const sidebarClose = document.querySelector('.sidebar-close');

        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                sidebarElement?.classList.add('open');
            });
        }

        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                sidebarElement?.classList.remove('open');
            });
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebarElement?.classList.contains('open') && 
                !sidebarElement.contains(e.target) && 
                !mobileToggle?.contains(e.target)) {
                sidebarElement.classList.remove('open');
            }
        });

        // Retry button
        const retryButton = document.getElementById('retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                this.loadNews(this.currentCategory);
            });
        }

        // Load more button
        const loadMoreButton = document.getElementById('load-more');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        // Infinite scroll
        window.addEventListener('scroll', () => {
            if (this.isNearBottom() && !this.isLoading && this.canLoadMore()) {
                this.loadMoreArticles();
            }
        });

        // Footer category links
        const footerLinks = document.querySelectorAll('.footer-links a[data-category]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                if (category) {
                    this.switchCategory(category);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showNewsLoading() {
        const newsLoading = document.getElementById('news-loading');
        const newsGrid = document.getElementById('news-grid');
        const newsError = document.getElementById('news-error');
        
        if (newsLoading) newsLoading.style.display = 'block';
        if (newsGrid) newsGrid.style.display = 'none';
        if (newsError) newsError.style.display = 'none';
    }

    hideNewsLoading() {
        const newsLoading = document.getElementById('news-loading');
        if (newsLoading) {
            newsLoading.style.display = 'none';
        }
    }

    showNewsError(message) {
        const newsError = document.getElementById('news-error');
        const errorMessage = document.getElementById('error-message');
        const newsLoading = document.getElementById('news-loading');
        const newsGrid = document.getElementById('news-grid');
        
        if (newsError) newsError.style.display = 'block';
        if (errorMessage) errorMessage.textContent = message;
        if (newsLoading) newsLoading.style.display = 'none';
        if (newsGrid) newsGrid.style.display = 'none';
    }

    showNewsGrid() {
        const newsGrid = document.getElementById('news-grid');
        const newsLoading = document.getElementById('news-loading');
        const newsError = document.getElementById('news-error');
        
        if (newsGrid) newsGrid.style.display = 'grid';
        if (newsLoading) newsLoading.style.display = 'none';
        if (newsError) newsError.style.display = 'none';
    }

    async switchCategory(category) {
        if (this.currentCategory === category || this.isLoading) return;
        
        this.currentCategory = category;
        this.currentPage = 1;
        this.allArticles = [];
        this.displayedArticles = [];
        
        // Update active navigation
        this.updateActiveNav(category);
        
        // Update category title
        this.updateCategoryTitle(category);
        
        // Load news
        await this.loadNews(category);
    }

    updateActiveNav(category) {
        // Update main navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === category) {
                link.classList.add('active');
            }
        });

        // Update sidebar navigation
        const sidebarLinks = document.querySelectorAll('.sidebar-link[data-category]');
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === category) {
                link.classList.add('active');
            }
        });
    }

    updateCategoryTitle(category) {
        const categoryTitle = document.getElementById('category-title');
        if (categoryTitle) {
            categoryTitle.textContent = this.newsAPI.getCategoryDisplayName(category);
        }
    }

    async loadNews(category, append = false) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        if (!append) {
            this.showNewsLoading();
        }

        try {
            const articles = await this.newsAPI.fetchNews(category, this.articlesPerPage);
            
            if (!append) {
                this.allArticles = articles;
                this.displayedArticles = [];
            } else {
                // For pagination, we would need to implement offset in the API
                // For now, we'll just show more from the existing articles
            }

            if (this.allArticles.length === 0) {
                this.showNewsError('No articles found for this category. Please try another category or check back later.');
                return;
            }

            this.renderNews();
            this.updateArticleCount();
            this.updateLastUpdated();
            this.showNewsGrid();

        } catch (error) {
            console.error('Error loading news:', error);
            this.showNewsError('Unable to load news at this time. Please check your internet connection and try again.');
        } finally {
            this.isLoading = false;
        }
    }

    renderNews() {
        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) return;

        // Show all available articles for better user experience
        this.displayedArticles = this.allArticles;

        newsGrid.innerHTML = this.displayedArticles.map(article => 
            this.createArticleHTML(article)
        ).join('');

        // Update load more button visibility
        this.updateLoadMoreButton();
    }

    createArticleHTML(article) {
        const imageUrl = article.urlToImage || 'assets/default.svg';
        const formattedDate = this.newsAPI.formatDate(article.publishedAt);
        const description = article.description || 'No description available.';
        
        return `
            <article class="news-card">
                <div class="news-image">
                    <img src="${imageUrl}" 
                         alt="${article.title}" 
                         loading="lazy"
                         onerror="this.src='assets/default.svg'">
                    <div class="news-source">${article.source}</div>
                </div>
                <div class="news-content">
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-description">${description}</p>
                    <div class="news-meta">
                        <span class="news-date">${formattedDate}</span>
                        <span class="news-category">${article.category}</span>
                    </div>
                    <a href="${article.url}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="news-link">
                        Read More <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </article>
        `;
    }

    updateArticleCount() {
        const articleCount = document.getElementById('article-count');
        if (articleCount) {
            const total = this.allArticles.length;
            const displayed = this.displayedArticles.length;
            articleCount.textContent = `Showing ${displayed} of ${total} articles`;
        }
    }

    updateLastUpdated() {
        const lastUpdated = document.getElementById('last-updated');
        if (lastUpdated) {
            const now = new Date();
            lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
        }
    }

    loadMoreArticles() {
        if (this.canLoadMore() && !this.isLoading) {
            this.renderNews();
        }
    }

    canLoadMore() {
        return this.displayedArticles.length < this.allArticles.length;
    }

    updateLoadMoreButton() {
        const loadMoreContainer = document.querySelector('.load-more-container');
        const loadMoreButton = document.getElementById('load-more');
        
        if (loadMoreContainer && loadMoreButton) {
            if (this.canLoadMore()) {
                loadMoreContainer.style.display = 'block';
                loadMoreButton.disabled = false;
                loadMoreButton.innerHTML = '<i class="fas fa-plus-circle"></i> Load More Articles';
            } else {
                loadMoreContainer.style.display = 'none';
            }
        }
    }

    isNearBottom() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        return scrollTop + windowHeight >= documentHeight - 1000; // 1000px from bottom
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.brightlensNews = new BrightlensNews();
});

// Handle page visibility changes to refresh news when tab becomes active
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.brightlensNews) {
        // Refresh news if it's been more than 10 minutes since last update
        const lastUpdate = localStorage.getItem('lastNewsUpdate');
        const now = Date.now();
        
        if (!lastUpdate || now - parseInt(lastUpdate) > 10 * 60 * 1000) {
            window.brightlensNews.loadNews(window.brightlensNews.currentCategory);
            localStorage.setItem('lastNewsUpdate', now.toString());
        }
    }
});
