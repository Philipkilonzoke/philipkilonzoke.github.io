/**
 * Shared Category News Functionality
 * Common JavaScript for all category pages
 */

// Category-specific news loading
class CategoryNews {
    constructor(category) {
        this.newsAPI = new NewsAPI();
        this.category = category;
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
        
        this.loadNews().then(() => {
            this.hideLoadingScreen();
        }).catch((error) => {
            console.error('Initial load failed:', error);
            this.hideLoadingScreen();
            this.showNewsError('Initial load taking longer than expected. Please try again.');
        });
    }

    setupEventListeners() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const sidebarElement = document.querySelector('.sidebar');
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

        document.addEventListener('click', (e) => {
            if (sidebarElement?.classList.contains('open') && 
                !sidebarElement.contains(e.target) && 
                !mobileToggle?.contains(e.target)) {
                sidebarElement.classList.remove('open');
            }
        });

        const retryButton = document.getElementById('retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                this.loadNews();
            });
        }

        const loadMoreButton = document.getElementById('load-more');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        window.addEventListener('scroll', () => {
            if (this.isNearBottom() && !this.isLoading && this.canLoadMore()) {
                this.loadMoreArticles();
            }
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
            }, 300);
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
        if (newsLoading) newsLoading.style.display = 'none';
    }

    showNewsError(message) {
        const newsError = document.getElementById('news-error');
        const errorMessage = document.getElementById('error-message');
        const newsLoading = document.getElementById('news-loading');
        const newsGrid = document.getElementById('news-grid');
        
        if (errorMessage) errorMessage.textContent = message;
        if (newsError) newsError.style.display = 'block';
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

    async loadNews() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showNewsLoading();
        
        try {
            console.log(`Loading ${this.category} news...`);
            
            // Load news for all categories using the standard API
            const articles = await this.newsAPI.fetchNews(this.category, 100);
            
            // Supplement with Mediastack API for Kenya and Sports categories
            let supplementalArticles = [];
            if ((this.category === 'kenya' || this.category === 'sports') && window.MediastackSupplement) {
                try {
                    const mediastackSupplement = new window.MediastackSupplement();
                    supplementalArticles = await mediastackSupplement.getSupplementalArticles(this.category, 20);
                    console.log(`Mediastack supplement: Added ${supplementalArticles.length} additional ${this.category} articles`);
                } catch (error) {
                    console.warn('Mediastack supplement failed:', error);
                }
            }
            
            // Combine articles and remove duplicates
            const allArticles = [...(articles || []), ...supplementalArticles];
            const uniqueArticles = this.removeDuplicates(allArticles);
            
            if (uniqueArticles && uniqueArticles.length > 0) {
                this.allArticles = uniqueArticles;
                this.renderNews();
                this.updateArticleCount();
                this.updateLastUpdated();
                this.showNewsGrid();
            } else {
                this.showNewsError('No articles found for this category. Please try again later.');
            }
        } catch (error) {
            console.error('Error loading news:', error);
            this.showNewsError('Failed to load news. Please check your internet connection and try again.');
        } finally {
            this.isLoading = false;
        }
    }

    renderNews() {
        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) return;

        this.displayedArticles = this.allArticles;

        newsGrid.innerHTML = this.displayedArticles.map(article => 
            this.createArticleHTML(article)
        ).join('');

        this.setupLazyLoading();
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
        
        const hasValidImage = imageUrl && 
                             imageUrl !== 'null' && 
                             imageUrl !== 'None' && 
                             imageUrl !== 'undefined' &&
                             imageUrl.startsWith('http');
        
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
                        <span class="news-category">${this.newsAPI.getCategoryDisplayName(this.category)}</span>
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
        
        return scrollTop + windowHeight >= documentHeight - 1000;
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
                const button = event.target.closest('.share-btn');
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.color = '#10b981';
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                    button.style.color = '';
                }, 2000);
            }).catch(() => {
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