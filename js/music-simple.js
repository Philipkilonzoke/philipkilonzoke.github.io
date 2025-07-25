// Simplified Music Hub JavaScript - Only Working Features
const SimpleMusicHub = {
    // State management
    state: {
        currentGenre: 'all',
        currentSort: 'latest',
        currentFilter: 'all',
        searchQuery: '',
        trendingIndex: 0
    },

    // Initialize the music hub
    init() {
        this.setupEventListeners();
        this.hideLoading();
    },

    // Setup all event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('music-search');
        const searchClear = document.getElementById('search-clear');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.searchQuery = e.target.value;
                this.toggleSearchClear();
                this.filterVisibleContent();
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.state.searchQuery = '';
                this.toggleSearchClear();
                this.filterVisibleContent();
            });
        }

        // Filter controls
        const sortFilter = document.getElementById('sort-filter');
        const contentFilter = document.getElementById('content-filter');

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.state.currentSort = e.target.value;
                this.filterVisibleContent();
            });
        }

        if (contentFilter) {
            contentFilter.addEventListener('change', (e) => {
                this.state.currentFilter = e.target.value;
                this.filterVisibleContent();
            });
        }

        // Genre tabs
        const genreTabs = document.querySelectorAll('.genre-tab');
        genreTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleGenreChange(e.target.dataset.genre);
            });
        });

        // Carousel controls
        const prevBtn = document.getElementById('trending-prev');
        const nextBtn = document.getElementById('trending-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.moveTrendingCarousel('prev');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.moveTrendingCarousel('next');
            });
        }

        // Add hover effects to cards
        this.setupCardHoverEffects();
    },

    // Toggle search clear button visibility
    toggleSearchClear() {
        const searchClear = document.getElementById('search-clear');
        if (searchClear) {
            if (this.state.searchQuery) {
                searchClear.classList.add('active');
            } else {
                searchClear.classList.remove('active');
            }
        }
    },

    // Handle genre tab changes
    handleGenreChange(genre) {
        this.state.currentGenre = genre;
        
        // Update active tab
        document.querySelectorAll('.genre-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-genre="${genre}"]`).classList.add('active');
        
        // Filter content
        this.filterVisibleContent();
    },

    // Filter visible content based on current state
    filterVisibleContent() {
        const allSongs = document.querySelectorAll('.music-card');
        const allNews = document.querySelectorAll('.news-card');
        const allTrending = document.querySelectorAll('.trending-card');

        // Filter songs
        allSongs.forEach(card => {
            const shouldShow = this.shouldShowCard(card, 'song');
            card.style.display = shouldShow ? 'block' : 'none';
        });

        // Filter news
        allNews.forEach(card => {
            const shouldShow = this.shouldShowCard(card, 'news');
            card.style.display = shouldShow ? 'block' : 'none';
        });

        // Filter trending (only by search, not by genre)
        allTrending.forEach(card => {
            const shouldShow = this.shouldShowCard(card, 'trending');
            card.style.display = shouldShow ? 'block' : 'none';
        });

        // Hide sections if no content
        this.updateSectionVisibility();
    },

    // Check if a card should be shown based on current filters
    shouldShowCard(card, type) {
        const query = this.state.searchQuery.toLowerCase();
        const genre = this.state.currentGenre;
        const filter = this.state.currentFilter;

        // Content type filter
        if (filter === 'songs' && type !== 'song' && type !== 'trending') return false;
        if (filter === 'news' && type !== 'news') return false;

        // Search filter
        if (query) {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const artist = card.querySelector('.card-artist')?.textContent.toLowerCase() || '';
            const source = card.querySelector('.card-source')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
            
            const searchText = `${title} ${artist} ${source} ${description}`;
            if (!searchText.includes(query)) return false;
        }

        // Genre filter (only for songs, not trending or news)
        if (type === 'song' && genre !== 'all') {
            const cardGenre = card.querySelector('.card-genre')?.textContent.toLowerCase() || '';
            const genreMap = {
                'hip-hop': 'hip-hop',
                'afrobeats': 'afrobeats',
                'amapiano': 'amapiano',
                'rnb': 'r&b',
                'pop': 'pop',
                'dancehall': 'dancehall'
            };
            
            if (cardGenre !== genreMap[genre]) return false;
        }

        return true;
    },

    // Update section visibility based on filtered content
    updateSectionVisibility() {
        const songsSection = document.querySelector('.latest-songs-section');
        const newsSection = document.querySelector('.music-news-section');
        const trendingSection = document.querySelector('.trending-section');

        // Check if sections have visible content
        const visibleSongs = document.querySelectorAll('.music-card[style*="block"], .music-card:not([style*="none"])').length;
        const visibleNews = document.querySelectorAll('.news-card[style*="block"], .news-card:not([style*="none"])').length;
        const visibleTrending = document.querySelectorAll('.trending-card[style*="block"], .trending-card:not([style*="none"])').length;

        // Show/hide sections
        if (songsSection) {
            songsSection.style.display = (visibleSongs > 0 || this.state.currentFilter !== 'news') ? 'block' : 'none';
        }
        if (newsSection) {
            newsSection.style.display = (visibleNews > 0 || this.state.currentFilter !== 'songs') ? 'block' : 'none';
        }
        if (trendingSection) {
            trendingSection.style.display = (visibleTrending > 0) ? 'block' : 'none';
        }
    },

    // Move trending carousel
    moveTrendingCarousel(direction) {
        const container = document.getElementById('trending-container');
        if (!container) return;

        const cards = container.querySelectorAll('.trending-card');
        const cardWidth = 300 + 24; // card width + gap
        const maxIndex = Math.max(0, cards.length - 3); // Show 3 cards at once

        if (direction === 'next' && this.state.trendingIndex < maxIndex) {
            this.state.trendingIndex++;
        } else if (direction === 'prev' && this.state.trendingIndex > 0) {
            this.state.trendingIndex--;
        }

        const translateX = -this.state.trendingIndex * cardWidth;
        container.style.transform = `translateX(${translateX}px)`;

        // Update button states
        this.updateCarouselButtons();
    },

    // Update carousel button states
    updateCarouselButtons() {
        const prevBtn = document.getElementById('trending-prev');
        const nextBtn = document.getElementById('trending-next');
        const container = document.getElementById('trending-container');
        
        if (!container) return;
        
        const cards = container.querySelectorAll('.trending-card');
        const maxIndex = Math.max(0, cards.length - 3);
        
        if (prevBtn) {
            prevBtn.disabled = this.state.trendingIndex <= 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.state.trendingIndex >= maxIndex;
        }
    },

    // Setup card hover effects
    setupCardHoverEffects() {
        const musicCards = document.querySelectorAll('.music-card, .news-card, .trending-card');
        
        musicCards.forEach(card => {
            // Add click effect
            card.addEventListener('click', () => {
                // Add a clicked effect
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
                
                // You can add more click functionality here
                console.log('Card clicked:', card.querySelector('.card-title')?.textContent);
            });

            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                const image = card.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1.1)';
                }
            });

            card.addEventListener('mouseleave', () => {
                const image = card.querySelector('img');
                if (image) {
                    image.style.transform = 'scale(1)';
                }
            });
        });
    },

    // Auto-scroll carousel (optional, only if you want it)
    startAutoCarousel() {
        setInterval(() => {
            const container = document.getElementById('trending-container');
            if (!container) return;
            
            const cards = container.querySelectorAll('.trending-card');
            const maxIndex = Math.max(0, cards.length - 3);
            
            if (this.state.trendingIndex >= maxIndex) {
                this.state.trendingIndex = 0;
            } else {
                this.state.trendingIndex++;
            }
            
            const cardWidth = 300 + 24;
            const translateX = -this.state.trendingIndex * cardWidth;
            container.style.transform = `translateX(${translateX}px)`;
            
            this.updateCarouselButtons();
        }, 5000); // Auto scroll every 5 seconds
    },

    // Hide loading screen
    hideLoading() {
        const loading = document.getElementById('music-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    },

    // Utility functions
    formatGenre(genre) {
        const genreMap = {
            'hip-hop': 'Hip-Hop',
            'afrobeats': 'Afrobeats',
            'amapiano': 'Amapiano',
            'rnb': 'R&B',
            'pop': 'Pop',
            'dancehall': 'Dancehall'
        };
        return genreMap[genre] || genre;
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof SimpleMusicHub !== 'undefined') {
            SimpleMusicHub.init();
        }
    });
} else {
    if (typeof SimpleMusicHub !== 'undefined') {
        SimpleMusicHub.init();
    }
}