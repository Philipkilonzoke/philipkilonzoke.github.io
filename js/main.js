/**
 * Main JavaScript for Brightlens News
 * Handles navigation, news loading, and UI interactions
 */

class BrightlensNews {
    constructor() {
        this.newsAPI = new NewsAPI();
        this.currentCategory = 'latest';
        this.currentPage = 1;
        this.articlesPerPage = 30; // Optimized for faster loading
        this.allArticles = [];
        this.displayedArticles = [];
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoadingScreen();
        
        // Start loading news immediately after DOM with robust error handling
        this.loadNews('breaking').then(() => {
            this.hideLoadingScreen();
        }).catch((error) => {
            console.error('Initial load failed:', error);
            this.hideLoadingScreen();
            // Show error message but keep site functional
            this.showNewsError('Initial load taking longer than expected. The site is still working - try selecting a different category.');
        });
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
            // Robust news fetching with multiple fallbacks
            let articles = [];
            
            try {
                articles = await this.newsAPI.fetchNews(category, this.articlesPerPage);
            } catch (apiError) {
                console.warn('Primary API failed, trying fallback:', apiError);
                // Try to get cached articles or sample articles
                articles = await this.newsAPI.getSampleArticles(category, 'Fallback Source');
            }
            
            // Ensure we have valid articles array
            if (!Array.isArray(articles)) {
                articles = [];
            }
            
            // Filter out any invalid articles
            articles = articles.filter(article => 
                article && 
                article.title && 
                article.url && 
                article.title.trim().length > 5 &&
                !article.title.toLowerCase().includes('removed')
            );
            
            if (!append) {
                this.allArticles = articles;
                this.displayedArticles = [];
            }

            // Always ensure we have some content
            if (this.allArticles.length === 0) {
                // Get sample articles as absolute fallback
                this.allArticles = await this.newsAPI.getSampleArticles(category, 'Brightlens News');
            }

            // Sort articles by date (newest first)
            this.sortArticlesByDate();
            
            // Final deduplication at the display level
            this.allArticles = this.removeFinalDuplicates(this.allArticles);
            
            this.renderNews();
            this.updateArticleCount();
            this.updateLastUpdated();
            this.showNewsGrid();

        } catch (error) {
            console.error('Critical error loading news:', error);
            // Emergency fallback - load sample articles
            try {
                this.allArticles = await this.newsAPI.getSampleArticles(category, 'Emergency Fallback');
                this.sortArticlesByDate();
                this.renderNews();
                this.updateArticleCount();
                this.updateLastUpdated();
                this.showNewsGrid();
            } catch (fallbackError) {
                this.showNewsError('Unable to load news at this time. Please refresh the page or try again later.');
            }
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Final deduplication pass at display level
     */
    removeFinalDuplicates(articles) {
        if (!articles || articles.length === 0) return [];
        
        const seenTitles = new Set();
        const seenUrls = new Set();
        const seenContent = new Set();
        
        return articles.filter(article => {
            if (!article || !article.title || !article.url) return false;
            
            const title = article.title.toLowerCase().trim();
            const url = article.url.toLowerCase().trim();
            const content = (title + (article.description || '').substring(0, 100)).toLowerCase();
            
            if (seenTitles.has(title) || seenUrls.has(url) || seenContent.has(content)) {
                return false;
            }
            
            seenTitles.add(title);
            seenUrls.add(url);
            seenContent.add(content);
            return true;
        });
    }

    /**
     * Sort articles by publication date in descending order (newest first)
     */
    sortArticlesByDate() {
        this.allArticles.sort((a, b) => {
            const dateA = new Date(a.publishedAt || 0);
            const dateB = new Date(b.publishedAt || 0);
            // Ensure newest articles always appear first
            return dateB.getTime() - dateA.getTime();
        });
        
        // Log sorting confirmation for verification
        if (this.allArticles.length > 0) {
            console.log(`✓ Articles sorted by date: ${this.allArticles.length} articles arranged newest first`);
            console.log(`✓ Newest article: ${this.allArticles[0]?.title} (${this.allArticles[0]?.publishedAt})`);
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

        // Implement lazy loading for images
        this.setupLazyLoading();

        // Update load more button visibility
        this.updateLoadMoreButton();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('.lazy-image');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-image');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy-image');
            });
        }
    }

    createArticleHTML(article) {
        const imageUrl = article.urlToImage;
        const formattedDate = this.newsAPI.formatDate(article.publishedAt);
        const description = article.description || 'No description available.';
        
        // Validate image URL - check if it's valid and not null/None/undefined
        const hasValidImage = imageUrl && 
                             imageUrl !== 'null' && 
                             imageUrl !== 'None' && 
                             imageUrl !== 'undefined' &&
                             imageUrl.startsWith('http');
        
        // Only show image if article has a valid image URL, otherwise show text placeholder
        const imageSection = hasValidImage ? `
            <div class="news-image">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                     data-src="${imageUrl}" 
                     alt="${article.title}" 
                     loading="lazy"
                     class="lazy-image"
                     onerror="this.parentElement.innerHTML='<div class=\\"text-placeholder\\">Brightlens News</div>'">
            </div>` : `
            <div class="text-placeholder">Brightlens News</div>`;
        
        return `
            <article class="news-card">
                ${imageSection}
                <div class="news-content">
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-description">${description}</p>
                    <div class="news-meta">
                        <span class="news-date">${formattedDate}</span>
                        <span class="news-category">${article.category}</span>
                    </div>
                    <div class="news-actions">
                        <a href="${article.url}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="news-link">
                            Read More <i class="fas fa-external-link-alt"></i>
                        </a>
                        <div class="share-buttons">
                            <button class="share-btn" onclick="shareArticle('${encodeURIComponent(article.title)}', '${encodeURIComponent(article.url)}', 'facebook')" title="Share on Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </button>
                            <button class="share-btn" onclick="shareArticle('${encodeURIComponent(article.title)}', '${encodeURIComponent(article.url)}', 'twitter')" title="Share on Twitter">
                                <i class="fab fa-twitter"></i>
                            </button>
                            <button class="share-btn" onclick="shareArticle('${encodeURIComponent(article.title)}', '${encodeURIComponent(article.url)}', 'whatsapp')" title="Share on WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                            <button class="share-btn" onclick="shareArticle('${encodeURIComponent(article.title)}', '${encodeURIComponent(article.url)}', 'copy')" title="Copy Link">
                                <i class="fas fa-link"></i>
                            </button>
                        </div>
                    </div>
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

// Share article functionality
window.shareArticle = function(title, url, platform) {
    const decodedTitle = decodeURIComponent(title);
    const decodedUrl = decodeURIComponent(url);
    
    switch(platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(decodedUrl)}`, '_blank', 'width=600,height=400');
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(decodedTitle)}&url=${encodeURIComponent(decodedUrl)}`, '_blank', 'width=600,height=400');
            break;
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(decodedTitle + ' ' + decodedUrl)}`, '_blank');
            break;
        case 'copy':
            navigator.clipboard.writeText(decodedUrl).then(() => {
                // Show temporary success message
                const button = event.target.closest('.share-btn');
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.color = '#10b981';
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                    button.style.color = '';
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = decodedUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const button = event.target.closest('.share-btn');
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.color = '#10b981';
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                    button.style.color = '';
                }, 2000);
            });
            break;
    }
};

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
