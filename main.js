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
        this.loadNews('latest').then(() => {
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
        
        // Enhanced loading message with source status
        if (newsLoading) {
            newsLoading.style.display = 'block';
            newsLoading.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">
                        <h3>Loading ${this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1)} News...</h3>
                        <p>Fetching from multiple trusted sources worldwide</p>
                        <div class="loading-sources">
                            <small>
                                <i class="fas fa-globe"></i> GNews &bull; 
                                <i class="fas fa-newspaper"></i> NewsAPI &bull; 
                                <i class="fas fa-rss"></i> BBC &bull; 
                                <i class="fas fa-broadcast-tower"></i> Reuters &bull; 
                                <i class="fas fa-satellite"></i> CNN
                            </small>
                        </div>
                    </div>
                </div>
            `;
        }
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
        
        // Enhanced error message with CORS context
        const enhancedMessage = message.includes('CORS') 
            ? `${message} We're working to bypass restrictions and fetch news from multiple sources.`
            : `${message} Attempting to load from alternative news sources...`;
        
        if (newsError) newsError.style.display = 'block';
        if (errorMessage) errorMessage.innerHTML = `
            <div class="error-details">
                <i class="fas fa-exclamation-circle"></i>
                <strong>News Loading Issue</strong><br>
                ${enhancedMessage}
                <div class="error-actions" style="margin-top: 15px;">
                    <button onclick="location.reload()" class="btn btn-sm btn-primary">
                        <i class="fas fa-refresh"></i> Refresh Page
                    </button>
                    <button onclick="window.brightlensNews.switchCategory('latest')" class="btn btn-sm btn-secondary">
                        <i class="fas fa-newspaper"></i> Try Latest News
                    </button>
                </div>
            </div>
        `;
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
                        // Sample articles disabled - only real-time news
        console.log('Sample articles disabled - attempting to reload real-time news');
        articles = [];
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
                            // Sample articles disabled - only real-time news
            console.log('Sample articles disabled - only real-time news will be displayed');
            this.allArticles = [];
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
            // Emergency fallback - sample articles disabled
            try {
                console.log('Emergency fallback triggered - only real-time news available');
                this.allArticles = [];
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
                        this.loadImageWithOptimization(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px 0px', // Increased preload distance for faster perceived loading
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                this.loadImageWithOptimization(img);
            });
        }
        
        // Preload first 3 images for instant display
        const firstImages = Array.from(images).slice(0, 3);
        firstImages.forEach(img => {
            if (img.dataset.src) {
                this.preloadImage(img.dataset.src);
            }
        });
    }
    
    /**
     * Preload critical images for instant display
     */
    preloadImage(src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    }
    
    /**
     * ENHANCED: Load image with WebP support and advanced optimization
     */
    loadImageWithOptimization(img) {
        if (!img.dataset.src) return;
        
        const originalSrc = img.dataset.src;
        
        // Check for WebP support and optimize accordingly
        if (this.supportsWebP()) {
            const webpSrc = this.convertToWebP(originalSrc);
            this.loadImageWithFallbackChain(img, [webpSrc, originalSrc]);
        } else {
            this.loadImageWithFallbackChain(img, [originalSrc]);
        }
    }
    
    /**
     * Check if browser supports WebP format
     */
    supportsWebP() {
        if (this.webpSupport !== undefined) return this.webpSupport;
        
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        this.webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        return this.webpSupport;
    }
    
    /**
     * Convert image URL to WebP if possible
     */
    convertToWebP(url) {
        // For services that support WebP conversion
        if (url.includes('unsplash.com')) {
            return url.includes('&fm=') ? url.replace(/&fm=[^&]*/, '&fm=webp') : url + '&fm=webp';
        }
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_webp/');
        }
        if (url.includes('wp.com') || url.includes('wordpress.com')) {
            return url + (url.includes('?') ? '&format=webp' : '?format=webp');
        }
        
        return url; // Return original if no WebP conversion available
    }
    
    /**
     * Load image with fallback chain for maximum compatibility
     */
    loadImageWithFallbackChain(img, urlChain) {
        let currentIndex = 0;
        
        const tryNextUrl = () => {
            if (currentIndex >= urlChain.length) {
                // All URLs failed, show optimized placeholder
                this.showOptimizedPlaceholder(img);
                return;
            }
            
            const currentUrl = urlChain[currentIndex];
            const testImg = new Image();
            
            // Add loading performance tracking
            const startTime = performance.now();
            
            testImg.onload = () => {
                const loadTime = (performance.now() - startTime).toFixed(2);
                console.log(`✅ Image loaded in ${loadTime}ms: ${currentUrl.substring(0, 50)}...`);
                
                img.src = currentUrl;
                img.classList.remove('lazy-image');
                img.classList.add('loaded');
                img.style.opacity = '1';
                
                // Add fade-in animation for smooth appearance
                img.style.transition = 'opacity 0.3s ease-in-out';
            };
            
            testImg.onerror = () => {
                console.warn(`❌ Image failed to load: ${currentUrl.substring(0, 50)}...`);
                currentIndex++;
                
                // Try HTTPS conversion as fallback
                if (currentUrl.startsWith('http://')) {
                    urlChain.splice(currentIndex, 0, currentUrl.replace('http://', 'https://'));
                }
                
                tryNextUrl();
            };
            
            // Set a timeout for slow-loading images
            setTimeout(() => {
                if (!testImg.complete) {
                    testImg.onerror(); // Trigger fallback for slow images
                }
            }, 8000); // 8 second timeout
            
            testImg.src = currentUrl;
        };
        
        tryNextUrl();
    }
    
    /**
     * Show optimized branded placeholder for failed images
     */
    showOptimizedPlaceholder(img) {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZDRlZGQiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PGNpcmNsZSBjeD0iNDAwIiBjeT0iMjI1IiByPSI2MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIi8+PHRleHQgeD0iNDAwIiB5PSIyNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CcmlnaHRsZW5zIE5ld3M8L3RleHQ+PHRleHQgeD0iNDAwIiB5PSIyNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjgpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5IaWdoIFF1YWxpdHkgTmV3czwvdGV4dD48L3N2Zz4=';
        img.classList.remove('lazy-image');
        img.classList.add('loaded', 'placeholder');
        img.style.opacity = '1';
    }
    
    /**
     * Validate image URL format and accessibility
     */
    isValidImageUrl(url) {
        // Basic URL format validation
        try {
            new URL(url);
        } catch {
            return false;
        }
        
        // Check for valid image file extensions or known image services
        const validImagePatterns = [
            /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i,
            /unsplash\.com/,
            /images\..*\.(com|org|net)/,
            /cdn\./,
            /cloudinary\./,
            /amazonaws\.com/,
            /googleusercontent\.com/
        ];
        
        return validImagePatterns.some(pattern => pattern.test(url));
    }
    
    /**
     * Sanitize text to prevent XSS and ensure clean display
     */
    sanitizeText(text) {
        if (!text) return '';
        
        return text
            .replace(/[<>]/g, '') // Remove HTML tags
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .trim();
    }

    createArticleHTML(article) {
        const imageUrl = article.urlToImage;
        const formattedDate = this.newsAPI.formatDate(article.publishedAt);
        const description = article.description || 'Read the full article for complete details.';
        
        // ULTRA-STRICT image validation with enhanced quality checks
        const hasValidImage = imageUrl && 
                             imageUrl !== 'null' && 
                             imageUrl !== 'None' && 
                             imageUrl !== 'undefined' &&
                             imageUrl !== '' &&
                             imageUrl.startsWith('http') &&
                             !imageUrl.includes('placeholder') &&
                             !imageUrl.includes('example.com') &&
                             !imageUrl.includes('sample') &&
                             this.isValidImageUrl(imageUrl);
        
        // Smart image section with WebP support and high-quality optimization
        const imageSection = hasValidImage ? `
            <div class="news-image">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg=="
                     data-src="${imageUrl}" 
                     alt="${this.sanitizeText(article.title)}" 
                     loading="lazy"
                     class="lazy-image"
                     width="800"
                     height="450"
                     style="aspect-ratio: 16/9; object-fit: cover;"
                     onload="this.classList.add('loaded'); this.style.opacity='1';"
                     onerror="this.parentElement.innerHTML='<div class=\\"text-placeholder\\"><div class=\\"placeholder-content\\"><div class=\\"placeholder-icon\\">📰</div><div class=\\"placeholder-text\\">Brightlens News</div></div></div>';">
            </div>` : `
            <div class="text-placeholder">
                <div class="placeholder-content">
                    <div class="placeholder-icon">📰</div>
                    <div class="placeholder-text">Brightlens News</div>
                    <div class="placeholder-subtext">High Quality News</div>
                </div>
            </div>`;
        
        return `
            <article class="news-card" data-category="${article.category}" data-source="${this.sanitizeText(article.source)}">
                ${imageSection}
                <div class="news-content">
                    <div class="news-meta">
                        <span class="news-source">${this.sanitizeText(article.source)}</span>
                        <span class="news-date">${formattedDate}</span>
                    </div>
                    <h3 class="news-title">
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                            ${this.sanitizeText(article.title)}
                        </a>
                    </h3>
                    <p class="news-description">${this.sanitizeText(description)}</p>
                    <div class="news-actions">
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more-btn">
                            <i class="fas fa-external-link-alt"></i> Read Full Article
                        </a>
                        <div class="article-tags">
                            <span class="tag category-tag">${article.category.charAt(0).toUpperCase() + article.category.slice(1)}</span>
                        </div>
                    </div>
                </div>
            </article>`;
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
