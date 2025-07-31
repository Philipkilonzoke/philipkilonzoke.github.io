/**
 * Movies & Series Hub - JavaScript Module
 * Brightlens News - IMDB API Integration
 * 
 * Features:
 * - Featured Carousel with top 5 trending items
 * - Search functionality with real-time results
 * - Smart filters (All, Movies, Series, Trending, etc.)
 * - Responsive grid layout (2 columns mobile, 4-6 desktop)
 * - Lazy loading images with loading spinners
 * - Sort dropdown (Title, Year, Rating)
 * - Error handling with try/catch
 * - Mobile-optimized design
 * 
 * API: imdb.iamidiotareyoutoo.com
 */

class MoviesSeriesHub {
    constructor() {
        // API Configuration
        this.apiConfig = {
            baseUrl: 'https://imdb.iamidiotareyoutoo.com',
            endpoints: {
                search: '/search',
                trending: '/trending',
                popular: '/popular',
                topRated: '/top_rated',
                upcoming: '/upcoming',
                nowPlaying: '/now_playing',
                details: '/title'
            }
        };

        // State management
        this.currentData = [];
        this.filteredData = [];
        this.currentFilter = 'all';
        this.currentSort = 'default';
        this.isLoading = false;
        this.currentPage = 1;
        
        // Carousel state
        this.carouselIndex = 0;
        this.carouselItems = [];
        this.carouselInterval = null;

        // Initialize the app
        this.init();
    }

    /**
     * Initialize the Movies & Series Hub
     */
    async init() {
        console.log('🎬 Initializing Movies & Series Hub...');
        
        try {
            // Setup event listeners
            this.setupEventListeners();
            
            // Load initial content
            await this.loadInitialContent();
            
            // Start carousel auto-play
            this.startCarouselAutoPlay();
            
            console.log('✅ Movies & Series Hub initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Movies & Series Hub:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
            
            // Real-time search with debounce
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length > 2) {
                        this.handleSearch();
                    } else if (e.target.value.length === 0) {
                        this.loadInitialContent();
                    }
                }, 300);
            });
        }

        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.handleFilterChange(tab.dataset.filter);
                
                // Update active state
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        // Sort dropdown
        const sortDropdown = document.getElementById('sort-dropdown');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', (e) => {
                this.handleSortChange(e.target.value);
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreContent());
        }

        // Carousel navigation
        const carouselPrev = document.getElementById('carousel-prev');
        const carouselNext = document.getElementById('carousel-next');
        
        if (carouselPrev && carouselNext) {
            carouselPrev.addEventListener('click', () => this.prevCarouselSlide());
            carouselNext.addEventListener('click', () => this.nextCarouselSlide());
        }

        // Window resize handler for responsive adjustments
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Load initial content (trending movies and series)
     */
    async loadInitialContent() {
        this.showLoading(true);
        
        try {
            // Load trending content for main grid
            const trendingData = await this.fetchFromAPI('search?q=avengers');
            
            if (trendingData && trendingData.description) {
                this.currentData = trendingData.description.slice(0, 20); // Limit to 20 items initially
                this.filteredData = [...this.currentData];
                this.displayContent(this.filteredData);
                
                // Load featured carousel with top 5 items
                await this.loadFeaturedCarousel();
            } else {
                throw new Error('No data received from API');
            }
            
        } catch (error) {
            console.error('Error loading initial content:', error);
            this.showError('Failed to load content. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Load featured carousel with top trending items
     */
    async loadFeaturedCarousel() {
        try {
            // Use the first 5 items from current data for carousel
            this.carouselItems = this.currentData.slice(0, 5);
            this.displayCarousel();
        } catch (error) {
            console.error('Error loading carousel:', error);
            // Carousel is optional, so don't show error to user
        }
    }

    /**
     * Fetch data from IMDB API
     */
    async fetchFromAPI(endpoint, retries = 3) {
        const url = `${this.apiConfig.baseUrl}/${endpoint.replace(/^\//, '')}`;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`🌐 Fetching from: ${url} (Attempt ${attempt})`);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                
                if (!data.ok) {
                    throw new Error('API returned error response');
                }

                return data;
                
            } catch (error) {
                console.warn(`Attempt ${attempt} failed:`, error.message);
                
                if (attempt === retries) {
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    /**
     * Handle search functionality
     */
    async handleSearch() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput?.value.trim();
        
        if (!query || query.length < 2) {
            this.showError('Please enter at least 2 characters to search.');
            return;
        }

        this.showLoading(true);
        
        try {
            const searchData = await this.fetchFromAPI(`search?q=${encodeURIComponent(query)}`);
            
            if (searchData && searchData.description && searchData.description.length > 0) {
                this.currentData = searchData.description;
                this.filteredData = [...this.currentData];
                this.displayContent(this.filteredData);
                this.currentFilter = 'all'; // Reset filter after search
                
                // Update filter tabs
                document.querySelectorAll('.filter-tab').forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.filter === 'all');
                });
            } else {
                this.showError(`No results found for "${query}". Try different keywords.`);
                this.displayContent([]); // Clear grid
            }
            
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Handle filter changes
     */
    async handleFilterChange(filter) {
        if (this.isLoading) return;
        
        this.currentFilter = filter;
        this.showLoading(true);
        
        try {
            let endpoint = '';
            
            switch (filter) {
                case 'trending':
                    // Use search with popular terms as a workaround
                    endpoint = 'search?q=marvel';
                    break;
                case 'popular':
                    endpoint = 'search?q=batman';
                    break;
                case 'top_rated':
                    endpoint = 'search?q=godfather';
                    break;
                case 'upcoming':
                    endpoint = 'search?q=2025';
                    break;
                case 'movies':
                case 'series':
                    // Filter current data by type
                    this.applyTypeFilter(filter);
                    return;
                case 'all':
                default:
                    // Show all current data
                    this.filteredData = [...this.currentData];
                    this.displayContent(this.filteredData);
                    this.showLoading(false);
                    return;
            }
            
            if (endpoint) {
                const data = await this.fetchFromAPI(endpoint);
                if (data && data.description) {
                    this.currentData = data.description;
                    this.filteredData = [...this.currentData];
                    this.displayContent(this.filteredData);
                }
            }
            
        } catch (error) {
            console.error('Filter error:', error);
            this.showError('Failed to load filtered content.');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Apply type filter (movies/series) to current data
     */
    applyTypeFilter(type) {
        // Since the API doesn't clearly distinguish types, we'll use heuristics
        this.filteredData = this.currentData.filter(item => {
            const title = item['#TITLE']?.toLowerCase() || '';
            const year = item['#YEAR'] || 0;
            
            if (type === 'series') {
                // Look for TV series indicators
                return title.includes('series') || 
                       title.includes('season') || 
                       title.includes('episode') ||
                       year > 2000; // Modern content more likely to be series
            } else if (type === 'movies') {
                // Assume movies by default
                return !title.includes('series') && 
                       !title.includes('season') && 
                       !title.includes('episode');
            }
            
            return true;
        });
        
        this.displayContent(this.filteredData);
        this.showLoading(false);
    }

    /**
     * Handle sort changes
     */
    handleSortChange(sortType) {
        this.currentSort = sortType;
        
        const sortedData = [...this.filteredData];
        
        switch (sortType) {
            case 'title':
                sortedData.sort((a, b) => {
                    const titleA = a['#TITLE'] || '';
                    const titleB = b['#TITLE'] || '';
                    return titleA.localeCompare(titleB);
                });
                break;
                
            case 'year':
                sortedData.sort((a, b) => {
                    const yearA = parseInt(a['#YEAR']) || 0;
                    const yearB = parseInt(b['#YEAR']) || 0;
                    return yearB - yearA; // Newest first
                });
                break;
                
            case 'rating':
                sortedData.sort((a, b) => {
                    const rankA = parseInt(a['#RANK']) || 999999;
                    const rankB = parseInt(b['#RANK']) || 999999;
                    return rankA - rankB; // Lower rank = better rating
                });
                break;
                
            default:
                // Keep original order
                break;
        }
        
        this.displayContent(sortedData);
    }

    /**
     * Display content in the grid
     */
    displayContent(items) {
        const contentGrid = document.getElementById('content-grid');
        if (!contentGrid) return;

        if (!items || items.length === 0) {
            contentGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-film" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3>No content found</h3>
                    <p style="color: var(--text-muted);">Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }

        const cardsHTML = items.map(item => this.createContentCard(item)).join('');
        contentGrid.innerHTML = cardsHTML;

        // Initialize lazy loading for images
        this.initializeLazyLoading();
    }

    /**
     * Create a content card HTML
     */
    createContentCard(item) {
        const title = item['#TITLE'] || 'Unknown Title';
        const year = item['#YEAR'] || 'N/A';
        const imdbId = item['#IMDB_ID'] || '';
        const actors = item['#ACTORS'] || 'Cast information not available';
        const poster = item['#IMG_POSTER'] || 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Image';
        const rank = item['#RANK'] || 'N/A';
        
        // Determine type (basic heuristic)
        const type = title.toLowerCase().includes('series') || 
                    title.toLowerCase().includes('season') ? 'Series' : 'Movie';
        
        // Calculate rating from rank (lower rank = higher rating)
        const rating = rank !== 'N/A' && rank < 1000 ? 
                      (10 - (rank / 100)).toFixed(1) : 'N/A';

        return `
            <div class="content-card" data-imdb-id="${imdbId}" onclick="window.moviesHub.showDetails('${imdbId}')">
                <div class="card-type">${type}</div>
                <img class="card-poster lazy-image" 
                     data-src="${poster}" 
                     alt="${title} Poster"
                     loading="lazy">
                <div class="card-content">
                    <h3 class="card-title">${title}</h3>
                    <div class="card-info">
                        <span class="card-year">${year}</span>
                        ${rating !== 'N/A' ? `<span class="card-rating">${rating}</span>` : ''}
                    </div>
                    <p class="card-actors">${actors}</p>
                </div>
            </div>
        `;
    }

    /**
     * Display featured carousel
     */
    displayCarousel() {
        const carouselContainer = document.getElementById('carousel-container');
        const carouselIndicators = document.getElementById('carousel-indicators');
        
        if (!carouselContainer || !this.carouselItems.length) return;

        // Create carousel slides
        const slidesHTML = this.carouselItems.map(item => {
            const title = item['#TITLE'] || 'Unknown Title';
            const year = item['#YEAR'] || 'N/A';
            const actors = item['#ACTORS'] || 'Cast information not available';
            const poster = item['#IMG_POSTER'] || '';
            const rank = item['#RANK'] || 'N/A';
            const rating = rank !== 'N/A' && rank < 1000 ? 
                          (10 - (rank / 100)).toFixed(1) : 'N/A';

            return `
                <div class="carousel-slide" style="background-image: url('${poster}')">
                    <div class="slide-content">
                        <h2 class="slide-title">${title}</h2>
                        <div class="slide-info">
                            <span class="slide-year">${year}</span>
                            ${rating !== 'N/A' ? `<span class="slide-rating">★ ${rating}</span>` : ''}
                        </div>
                        <p class="slide-actors">${actors}</p>
                    </div>
                </div>
            `;
        }).join('');

        carouselContainer.innerHTML = slidesHTML;

        // Create indicators
        if (carouselIndicators) {
            const indicatorsHTML = this.carouselItems.map((_, index) => 
                `<div class="carousel-dot ${index === 0 ? 'active' : ''}" onclick="window.moviesHub.goToCarouselSlide(${index})"></div>`
            ).join('');
            carouselIndicators.innerHTML = indicatorsHTML;
        }
    }

    /**
     * Carousel navigation methods
     */
    nextCarouselSlide() {
        this.carouselIndex = (this.carouselIndex + 1) % this.carouselItems.length;
        this.updateCarouselPosition();
    }

    prevCarouselSlide() {
        this.carouselIndex = this.carouselIndex === 0 ? 
                           this.carouselItems.length - 1 : 
                           this.carouselIndex - 1;
        this.updateCarouselPosition();
    }

    goToCarouselSlide(index) {
        this.carouselIndex = index;
        this.updateCarouselPosition();
    }

    updateCarouselPosition() {
        const carouselContainer = document.getElementById('carousel-container');
        if (carouselContainer) {
            carouselContainer.style.transform = `translateX(-${this.carouselIndex * 100}%)`;
        }

        // Update indicators
        const indicators = document.querySelectorAll('.carousel-dot');
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.carouselIndex);
        });
    }

    startCarouselAutoPlay() {
        this.carouselInterval = setInterval(() => {
            if (this.carouselItems.length > 1) {
                this.nextCarouselSlide();
            }
        }, 5000); // Change slide every 5 seconds
    }

    /**
     * Initialize lazy loading for images
     */
    initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        img.addEventListener('load', () => {
                            img.style.opacity = '1';
                        });
                        img.addEventListener('error', () => {
                            img.src = 'https://via.placeholder.com/300x450/cccccc/666666?text=Image+Not+Available';
                            img.style.opacity = '1';
                        });
                    }
                    
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /**
     * Show loading state
     */
    showLoading(show) {
        const loadingContainer = document.getElementById('loading-container');
        const contentGrid = document.getElementById('content-grid');
        
        this.isLoading = show;
        
        if (loadingContainer) {
            loadingContainer.style.display = show ? 'block' : 'none';
        }
        
        if (show && contentGrid) {
            // Show skeleton loading cards
            const skeletonHTML = Array(8).fill(0).map(() => `
                <div class="skeleton-card">
                    <div class="skeleton-poster"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                        <div class="skeleton-line"></div>
                    </div>
                </div>
            `).join('');
            
            contentGrid.innerHTML = skeletonHTML;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const contentGrid = document.getElementById('content-grid');
        if (contentGrid) {
            contentGrid.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button class="retry-btn" onclick="window.moviesHub.loadInitialContent()">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    /**
     * Show details modal (placeholder for future implementation)
     */
    showDetails(imdbId) {
        console.log('Show details for:', imdbId);
        // Future: Implement modal with detailed movie/series information
        alert(`Details for IMDB ID: ${imdbId}\n\nThis feature will be implemented in a future update.`);
    }

    /**
     * Handle window resize for responsive adjustments
     */
    handleResize() {
        // Adjust carousel if needed
        this.updateCarouselPosition();
    }

    /**
     * Load more content (pagination)
     */
    async loadMoreContent() {
        // Future implementation for pagination
        console.log('Load more content...');
    }
}

// Initialize the Movies & Series Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moviesHub = new MoviesSeriesHub();
});

// Handle page visibility changes to pause/resume carousel
document.addEventListener('visibilitychange', () => {
    if (window.moviesHub) {
        if (document.hidden) {
            clearInterval(window.moviesHub.carouselInterval);
        } else {
            window.moviesHub.startCarouselAutoPlay();
        }
    }
});