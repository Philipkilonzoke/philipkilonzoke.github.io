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
        this.articlesPerPage = 30;
        this.allArticles = [];
        this.displayedArticles = [];
        this.isLoading = false;
        
        // Sports subcategory support
        this.currentSport = 'all';
        this.sportsKeywords = {
            'american-football': [
                'nfl', 'american football', 'gridiron', 'quarterback', 'touchdown', 'super bowl',
                'nfl draft', 'nfl playoffs', 'college football', 'ncaa football', 'football game',
                'nfl news', 'nfl teams', 'nfl players', 'football league', 'football season',
                'patriots', 'cowboys', 'steelers', 'packers', 'giants', 'eagles', 'chiefs',
                '49ers', 'rams', 'saints', 'ravens', 'bengals', 'browns', 'bills', 'dolphins'
            ],
            basketball: [
                'nba', 'basketball', 'basketball game', 'dunk', 'three-pointer', 'basketball player',
                'hoops', 'nba draft', 'nba playoffs', 'basketball league', 'basketball season',
                'ncaa basketball', 'college basketball', 'basketball news', 'basketball teams',
                'lakers', 'warriors', 'celtics', 'heat', 'bulls', 'knicks', 'nets', 'sixers',
                'lebron', 'curry', 'durant', 'giannis', 'jokic', 'tatum', 'doncic', 'embiid'
            ],
            football: [
                'soccer', 'football', 'fifa', 'world cup', 'premier league', 'champions league', 'goal',
                'penalty', 'uefa', 'mls', 'la liga', 'serie a', 'bundesliga', 'ligue 1',
                'soccer game', 'football game', 'soccer player', 'football player', 'soccer news', 'football news',
                'soccer teams', 'football teams', 'soccer league', 'football league', 'el clasico',
                'messi', 'ronaldo', 'mbappe', 'haaland', 'benzema', 'modric', 'neymar', 'lewandowski',
                'manchester united', 'real madrid', 'barcelona', 'liverpool', 'chelsea', 'arsenal',
                'manchester city', 'tottenham', 'psg', 'bayern munich', 'juventus', 'ac milan',
                'inter milan', 'atletico madrid', 'valencia', 'sevilla', 'napoli', 'roma',
                'borussia dortmund', 'ajax', 'porto', 'benfica', 'celtic', 'rangers',
                'epl', 'ucl', 'europa league', 'fa cup', 'carabao cup', 'copa del rey',
                'coppa italia', 'dfb pokal', 'ligue des champions', 'coupe de france'
            ],
            golf: [
                'golf', 'pga', 'masters', 'golfer', 'tournament', 'birdie', 'eagle', 'putting',
                'pga tour', 'golf course', 'golf news', 'golf championship', 'golf player',
                'tiger woods', 'rory mcilroy', 'jon rahm', 'scottie scheffler', 'jordan spieth',
                'us open golf', 'british open', 'pga championship', 'masters tournament'
            ],
            tennis: [
                'tennis', 'wimbledon', 'us open tennis', 'french open', 'australian open',
                'tennis player', 'serve', 'ace', 'tennis match', 'tennis news', 'tennis tournament',
                'atp', 'wta', 'grand slam', 'roland garros', 'tennis championship',
                'djokovic', 'nadal', 'federer', 'alcaraz', 'medvedev', 'tsitsipas', 'zverev',
                'serena williams', 'osaka', 'swiatek', 'sabalenka', 'rybakina'
            ],
            baseball: [
                'baseball', 'mlb', 'world series', 'home run', 'pitcher', 'baseball game',
                'innings', 'baseball news', 'baseball teams', 'baseball league', 'baseball season',
                'yankees', 'dodgers', 'red sox', 'astros', 'cardinals', 'cubs', 'giants',
                'angels', 'mets', 'phillies', 'braves', 'marlins', 'nationals', 'orioles'
            ],
            hockey: [
                'hockey', 'nhl', 'ice hockey', 'stanley cup', 'puck', 'hockey game', 'power play',
                'hockey news', 'hockey teams', 'hockey league', 'hockey season', 'nhl playoffs',
                'rangers', 'bruins', 'blackhawks', 'penguins', 'flyers', 'devils', 'islanders',
                'capitals', 'lightning', 'panthers', 'maple leafs', 'canadiens', 'senators'
            ]
        };
        
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
        
        // Sports subcategory tab event listeners
        if (this.category === 'sports') {
            this.setupSportsSubcategories();
        }
    }

    setupSportsSubcategories() {
        const subcategoryTabs = document.querySelectorAll('.subcategory-tab');
        const indicatorLine = document.querySelector('.indicator-line');
        
        subcategoryTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                const sport = tab.getAttribute('data-sport');
                this.switchSport(sport, index);
            });
        });
        
        // Initialize indicator position
        this.updateIndicatorPosition(0);
    }

    switchSport(sport, tabIndex) {
        if (this.currentSport === sport || this.isLoading) return;
        
        this.currentSport = sport;
        
        // Update active tab
        document.querySelectorAll('.subcategory-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-sport="${sport}"]`).classList.add('active');
        
        // Update indicator position
        this.updateIndicatorPosition(tabIndex);
        
        // Add loading state to the active tab
        const activeTab = document.querySelector(`[data-sport="${sport}"]`);
        activeTab.classList.add('subcategory-loading');
        
        // Add switching animation
        const mainContainer = document.querySelector('.main');
        mainContainer.classList.add('subcategory-tab-switching');
        
        // Filter and display articles
        setTimeout(() => {
            this.filterArticlesBySport();
            mainContainer.classList.remove('subcategory-tab-switching');
            mainContainer.classList.add('subcategory-tab-switched');
            activeTab.classList.remove('subcategory-loading');
            
            // Log filtering stats for debugging
            console.log(`Filtered for ${sport}:`, {
                totalArticles: this.allArticles.length,
                filteredArticles: this.displayedArticles.length,
                sport: sport,
                filteringEnabled: sport !== 'all'
            });
            
            // Remove switched class after animation
            setTimeout(() => {
                mainContainer.classList.remove('subcategory-tab-switched');
            }, 300);
        }, 150);
        
        // Update category title
        this.updateCategoryTitle(sport);
    }

    updateIndicatorPosition(index) {
        const indicatorLine = document.querySelector('.indicator-line');
        if (indicatorLine) {
            const leftPosition = (index * 12.5); // 100% / 8 tabs = 12.5%
            indicatorLine.style.left = `${leftPosition}%`;
        }
    }

    updateCategoryTitle(sport) {
        const categoryTitle = document.getElementById('category-title');
        if (categoryTitle) {
            if (sport === 'all') {
                categoryTitle.textContent = 'Sports News';
            } else if (sport === 'american-football') {
                categoryTitle.textContent = 'American Football News';
            } else if (sport === 'football') {
                categoryTitle.textContent = 'Football News';
            } else {
                const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);
                categoryTitle.textContent = `${sportName} News`;
            }
        }
    }

    filterArticlesBySport() {
        if (this.currentSport === 'all') {
            this.displayedArticles = [...this.allArticles];
        } else {
            this.displayedArticles = this.allArticles.filter(article => 
                this.isArticleRelatedToSport(article, this.currentSport)
            );
            
            // If we have very few football articles and user selected football, try to fetch more
            if (this.currentSport === 'football' && this.displayedArticles.length < 5) {
                this.fetchAdditionalFootballNews();
            }
        }
        
        this.renderFilteredNews();
        this.updateArticleCount();
    }

    // Fetch additional football news when needed
    async fetchAdditionalFootballNews() {
        try {
            console.log('Fetching additional football news...');
            const footballArticles = await this.newsAPI.fetchFootballNews(20);
            
            if (footballArticles && footballArticles.length > 0) {
                // Add to our main articles array and remove duplicates
                const combinedArticles = [...this.allArticles, ...footballArticles];
                this.allArticles = this.newsAPI.removeDuplicates(combinedArticles);
                
                // Re-filter for football
                this.displayedArticles = this.allArticles.filter(article => 
                    this.isArticleRelatedToSport(article, 'football')
                );
                
                this.renderFilteredNews();
                this.updateArticleCount();
                
                console.log('Additional football news fetched:', footballArticles.length, 'articles');
            }
        } catch (error) {
            console.warn('Failed to fetch additional football news:', error);
        }
    }

    isArticleRelatedToSport(article, sport) {
        const keywords = this.sportsKeywords[sport] || [];
        const searchText = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
        
        // Enhanced matching with confidence scoring
        let matchScore = 0;
        let matchedKeywords = [];
        
        // Check for keyword matches
        for (const keyword of keywords) {
            const keywordLower = keyword.toLowerCase();
            
            // Title matches get higher weight
            if (article.title.toLowerCase().includes(keywordLower)) {
                matchScore += 3;
                matchedKeywords.push(keyword);
            }
            // Description matches get medium weight
            else if ((article.description || '').toLowerCase().includes(keywordLower)) {
                matchScore += 2;
                matchedKeywords.push(keyword);
            }
            // Content matches get lower weight
            else if ((article.content || '').toLowerCase().includes(keywordLower)) {
                matchScore += 1;
                matchedKeywords.push(keyword);
            }
        }
        
        // Special handling for football vs soccer disambiguation
        if (sport === 'american-football') {
            // If article mentions soccer-specific terms, reduce score for American football
            const soccerTerms = ['fifa', 'premier league', 'champions league', 'messi', 'ronaldo', 'uefa'];
            const hasSoccerTerms = soccerTerms.some(term => searchText.includes(term));
            if (hasSoccerTerms) {
                matchScore = Math.max(0, matchScore - 5);
            }
            
            // Boost score for American football specific terms
            const americanFootballTerms = ['nfl', 'quarterback', 'touchdown', 'super bowl'];
            const hasAmericanFootballTerms = americanFootballTerms.some(term => searchText.includes(term));
            if (hasAmericanFootballTerms) {
                matchScore += 2;
            }
        } else if (sport === 'football') {
            // If article mentions American football terms, reduce score for soccer
            const americanFootballTerms = ['nfl', 'quarterback', 'touchdown', 'super bowl'];
            const hasAmericanFootballTerms = americanFootballTerms.some(term => searchText.includes(term));
            if (hasAmericanFootballTerms) {
                matchScore = Math.max(0, matchScore - 5);
            }
        }
        
        // Source-based scoring boost
        const source = article.source || '';
        if (sport === 'american-football' && (source.toLowerCase().includes('nfl') || source.toLowerCase().includes('espn'))) {
            matchScore += 1;
        } else if (sport === 'basketball' && (source.toLowerCase().includes('nba') || source.toLowerCase().includes('espn'))) {
            matchScore += 1;
        } else if (sport === 'football' && (source.toLowerCase().includes('fifa') || source.toLowerCase().includes('uefa'))) {
            matchScore += 1;
        }
        
        // Return true if we have a confident match (score >= 2)
        return matchScore >= 2;
    }

    renderFilteredNews() {
        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) return;

        if (this.displayedArticles.length === 0) {
            const sportName = this.currentSport.charAt(0).toUpperCase() + this.currentSport.slice(1);
            newsGrid.innerHTML = `
                <div class="no-articles-message">
                    <div class="no-articles-content">
                        <i class="fas fa-search"></i>
                        <h3>No ${sportName} Articles Found</h3>
                        <p>We couldn't find any recent ${sportName.toLowerCase()} articles. This might be because:</p>
                        <ul style="text-align: left; margin: 1rem 0; padding-left: 1.5rem;">
                            <li>Limited ${sportName.toLowerCase()} news coverage today</li>
                            <li>No recent updates from sports sources</li>
                            <li>API sources might be temporarily unavailable</li>
                        </ul>
                        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
                            <button onclick="window.categoryNews.switchSport('all', 0)" class="back-to-all-btn">
                                <i class="fas fa-arrow-left"></i> View All Sports
                            </button>
                            <button onclick="window.categoryNews.refreshSportsNews()" class="refresh-btn">
                                <i class="fas fa-sync-alt"></i> Refresh News
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            newsGrid.innerHTML = this.displayedArticles.map(article => 
                this.createArticleHTML(article)
            ).join('');
            
            this.setupLazyLoading();
        }
        
        this.updateLoadMoreButton();
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
            // Request more articles for sports category for comprehensive coverage
            const articleLimit = this.category === 'sports' ? 250 : 50;
            const articles = await this.newsAPI.fetchNews(this.category, articleLimit);
            
            if (articles && articles.length > 0) {
                this.allArticles = articles;
                this.renderNews();
                this.updateArticleCount();
                this.updateLastUpdated();
                this.showNewsGrid();
                console.log(`${this.category} news loaded successfully:`, articles.length, 'articles');
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

        // For sports category with subcategory filtering
        if (this.category === 'sports') {
            this.filterArticlesBySport();
            return;
        }

        // For other categories, show all articles
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
                        this.loadImageWithFallback(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px' // Start loading 50px before entering viewport
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            images.forEach(img => {
                this.loadImageWithFallback(img);
            });
        }
    }

    loadImageWithFallback(img) {
        const originalSrc = img.dataset.src;
        if (!originalSrc) return;

        // Create a new image element to test loading
        const testImg = new Image();
        
        testImg.onload = () => {
            // Check if browser supports WebP
            if (this.supportsWebP() && !originalSrc.includes('.webp')) {
                const webpSrc = this.convertToWebP(originalSrc);
                
                // Test WebP version first
                const webpTest = new Image();
                webpTest.onload = () => {
                    img.src = webpSrc;
                    img.classList.remove('lazy-image');
                    img.classList.add('loaded');
                };
                webpTest.onerror = () => {
                    // Fallback to original if WebP fails
                    img.src = originalSrc;
                    img.classList.remove('lazy-image');
                    img.classList.add('loaded');
                };
                webpTest.src = webpSrc;
            } else {
                img.src = originalSrc;
                img.classList.remove('lazy-image');
                img.classList.add('loaded');
            }
        };
        
        testImg.onerror = () => {
            // Image failed to load, show fallback
            img.parentElement.innerHTML = `
                <div class="image-placeholder">
                    <i class="fas fa-image"></i>
                    <span>Brightlens News</span>
                </div>
            `;
        };
        
        testImg.src = originalSrc;
    }

    supportsWebP() {
        if (this.webpSupported !== undefined) return this.webpSupported;
        
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        this.webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        return this.webpSupported;
    }

    convertToWebP(url) {
        // Simple conversion for common image services
        if (url.includes('unsplash.com')) {
            return url.replace(/\.(jpg|jpeg|png)/, '.webp');
        }
        return url;
    }

    createArticleHTML(article) {
        const imageUrl = article.urlToImage;
        const formattedDate = this.newsAPI.formatDate(article.publishedAt);
        const description = article.description || 'No description available.';
        
        // Enhanced image URL validation
        const hasValidImage = imageUrl && 
                             imageUrl !== 'null' && 
                             imageUrl !== 'None' && 
                             imageUrl !== 'undefined' &&
                             imageUrl !== 'N/A' &&
                             imageUrl.length > 10 &&
                             (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
                             !imageUrl.includes('placeholder');
        
        // Improved image section with better fallback
        const imageSection = hasValidImage ? `
            <div class="news-image">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+"
                     data-src="${imageUrl}" 
                     alt="${article.title}" 
                     loading="lazy"
                     class="lazy-image">
            </div>` : `
            <div class="image-placeholder">
                <i class="fas fa-newspaper"></i>
                <span>Brightlens News</span>
            </div>`;
        
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
                            <i class="fas fa-external-link-alt"></i>
                            Read More
                        </a>
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
    
    // Refresh sports news method
    async refreshSportsNews() {
        if (this.isLoading) return;
        
        // Clear cache to force fresh data
        this.newsAPI.cache.clear();
        
        // Show loading state
        this.showNewsLoading();
        
        try {
            console.log('Refreshing sports news...');
            // Request more articles for sports category for comprehensive coverage
            const articleLimit = this.category === 'sports' ? 250 : 50;
            const articles = await this.newsAPI.fetchNews(this.category, articleLimit);
            
            if (articles && articles.length > 0) {
                this.allArticles = articles;
                this.renderNews();
                this.updateArticleCount();
                this.updateLastUpdated();
                this.showNewsGrid();
                console.log('Sports news refreshed successfully:', articles.length, 'articles');
            } else {
                this.showNewsError('No articles found after refresh. Please try again later.');
            }
        } catch (error) {
            console.error('Error refreshing sports news:', error);
            this.showNewsError('Failed to refresh news. Please check your internet connection and try again.');
        }
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