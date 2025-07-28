// Showtime JavaScript - Entertainment Hub
class ShowtimeApp {
    constructor() {
        this.apiBase = 'https://imdb.iamidiotareyoutoo.com/api';
        this.currentTab = 'trending';
        this.currentPage = {
            movies: 1,
            series: 1
        };
        this.isLoading = false;
        this.cache = new Map();
        this.watchedMovies = JSON.parse(localStorage.getItem('watchedMovies') || '[]');
        this.themePreference = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    async init() {
        console.log('🎬 Initializing Showtime App...');
        
        // Set theme
        this.setTheme(this.themePreference);
        
        // Bind events
        this.bindEvents();
        
        // Load initial content
        await this.loadTrendingContent();
        
        // Show random movie pick
        this.showTodaysPick();
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Auto-refresh trending every 30 minutes
        setInterval(() => {
            if (this.currentTab === 'trending') {
                this.loadTrendingContent();
            }
        }, 30 * 60 * 1000);
        
        console.log('✅ Showtime App initialized successfully');
    }

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length > 0) {
                searchClear.style.display = 'block';
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            } else {
                searchClear.style.display = 'none';
                this.hideSearchResults();
            }
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.style.display = 'none';
            this.hideSearchResults();
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });

        // Refresh buttons
        document.getElementById('refresh-trending')?.addEventListener('click', () => {
            this.loadTrendingContent();
        });

        // Load more buttons
        document.getElementById('load-more-movies')?.addEventListener('click', () => {
            this.loadMoreMovies();
        });

        document.getElementById('load-more-series')?.addEventListener('click', () => {
            this.loadMoreSeries();
        });

        // Genre filters
        document.getElementById('movie-genre-filter')?.addEventListener('change', (e) => {
            this.filterMoviesByGenre(e.target.value);
        });

        document.getElementById('series-genre-filter')?.addEventListener('change', (e) => {
            this.filterSeriesByGenre(e.target.value);
        });

        // Modal events
        document.getElementById('modal-close')?.addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.hideModal();
            }
        });

        // Genre navigation
        document.getElementById('back-to-genres')?.addEventListener('click', () => {
            this.showGenresList();
        });

        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                this.hideSearchResults();
            }
            if (e.key === '/' && !e.target.matches('input')) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // API Methods
    async fetchFromAPI(endpoint, useCache = true) {
        const cacheKey = endpoint;
        
        if (useCache && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.apiBase}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (useCache) {
                this.cache.set(cacheKey, data);
                // Clear cache after 10 minutes
                setTimeout(() => {
                    this.cache.delete(cacheKey);
                }, 10 * 60 * 1000);
            }
            
            return data;
        } catch (error) {
            console.warn('API unavailable, using fallback data:', error);
            return this.getMockData(endpoint);
        }
    }

    // 2025 Entertainment Database - Load from external file or fallback data
    getMockData(endpoint) {
        // Load comprehensive 2025 data
        const allContent = [
            // Major 2025 Blockbusters
            { id: '1', title: 'Avatar: Fire and Ash', poster: 'https://images.tmdb.org/t/p/w500/nP1iXPFIjQQY8GzOHGw6oKK9ZLO.jpg', rating: '8.9', year: '2025', type: 'movie', description: 'The third Avatar film continues Jake Sully\'s journey on Pandora with new adventures and fire-breathing creatures.', genre: ['Action', 'Adventure', 'Sci-Fi'] },
            { id: '2', title: 'Fantastic Four: First Steps', poster: 'https://images.tmdb.org/t/p/w500/6psPUE8TsQHKr7bFa8zJ8v3P3eP.jpg', rating: '8.2', year: '2025', type: 'movie', description: 'Marvel\'s First Family embarks on their cosmic adventures in this highly anticipated MCU debut.', genre: ['Action', 'Adventure', 'Superhero'] },
            { id: '3', title: 'Captain America: Brave New World', poster: 'https://images.tmdb.org/t/p/w500/tZLjGGIWZO7yISyBXELEEXHIDBg.jpg', rating: '8.5', year: '2025', type: 'movie', description: 'Sam Wilson takes on the mantle of Captain America in this thrilling new chapter of the MCU.', genre: ['Action', 'Adventure', 'Superhero'] },
            { id: '4', title: 'Thunderbolts', poster: 'https://images.tmdb.org/t/p/w500/8pEPQZYjgGUzGsLl5XQ6y5r8TfM.jpg', rating: '8.1', year: '2025', type: 'movie', description: 'A team of reformed villains must work together to save the world in this Marvel anti-hero ensemble.', genre: ['Action', 'Adventure', 'Superhero'] },
            { id: '5', title: 'Superman', poster: 'https://images.tmdb.org/t/p/w500/p3GnR0DkECdCW1lGtWCXEYwM3TX.jpg', rating: '8.7', year: '2025', type: 'movie', description: 'James Gunn\'s Superman reboot brings the Man of Steel back to the big screen with a fresh perspective.', genre: ['Action', 'Adventure', 'Superhero'] },
            { id: '6', title: 'Mission: Impossible 8', poster: 'https://images.tmdb.org/t/p/w500/zJEEfA2VbgQI35oGcNTweTWYo9F.jpg', rating: '8.3', year: '2025', type: 'movie', description: 'Ethan Hunt returns for what may be his final mission in this explosive conclusion to the franchise.', genre: ['Action', 'Thriller', 'Adventure'] },
            { id: '7', title: 'Jurassic World Rebirth', poster: 'https://images.tmdb.org/t/p/w500/t6eNjeWpGRvQFKrx12rOBvOsKiP.jpg', rating: '7.8', year: '2025', type: 'movie', description: 'The dinosaur franchise returns with new characters and prehistoric adventures.', genre: ['Action', 'Adventure', 'Sci-Fi'] },
            { id: '8', title: 'Blade', poster: 'https://images.tmdb.org/t/p/w500/AeG8Y5ZQv9rVCxkPsL6qy3zzKjc.jpg', rating: '8.0', year: '2025', type: 'movie', description: 'Mahershala Ali brings the vampire hunter to the MCU in this supernatural action thriller.', genre: ['Action', 'Horror', 'Supernatural'] },
            { id: '9', title: 'Fast & Furious 11', poster: 'https://images.tmdb.org/t/p/w500/yGl4eO2IzVBxmqfJ8Qr5y9XFSvN.jpg', rating: '7.5', year: '2025', type: 'movie', description: 'The Fast family returns for one final ride in this action-packed conclusion.', genre: ['Action', 'Adventure', 'Crime'] },
            { id: '10', title: 'Shrek 5', poster: 'https://images.tmdb.org/t/p/w500/dDH3QHdUXiKeMz2YdmN5qNJmYw8.jpg', rating: '8.6', year: '2025', type: 'movie', description: 'Everyone\'s favorite ogre returns for another hilarious adventure in Far Far Away.', genre: ['Animation', 'Comedy', 'Family'] },
            { id: '11', title: 'Toy Story 5', poster: 'https://images.tmdb.org/t/p/w500/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg', rating: '8.8', year: '2025', type: 'movie', description: 'Woody, Buzz, and the gang return for another heartwarming Pixar adventure.', genre: ['Animation', 'Comedy', 'Family'] },
            { id: '12', title: 'Frozen 3', poster: 'https://images.tmdb.org/t/p/w500/rKSMDU7J5NqDYFvlDQqIAhJDrGp.jpg', rating: '8.4', year: '2025', type: 'movie', description: 'Elsa and Anna embark on a new magical journey in this highly anticipated sequel.', genre: ['Animation', 'Musical', 'Family'] },
            { id: '13', title: 'John Wick: Chapter 5', poster: 'https://images.tmdb.org/t/p/w500/z73NLRUC3lR1M6vn5VgdP5gj14L.jpg', rating: '8.7', year: '2025', type: 'movie', description: 'Keanu Reeves returns as the legendary assassin in this action-packed sequel.', genre: ['Action', 'Thriller', 'Crime'] },
            { id: '14', title: 'Deadpool 3', poster: 'https://images.tmdb.org/t/p/w500/h4pjKj4Q6GU8fPdBzP1gKJiG6Vm.jpg', rating: '8.9', year: '2025', type: 'movie', description: 'The Merc with a Mouth enters the MCU with his trademark humor and violence.', genre: ['Action', 'Comedy', 'Superhero'] },
            { id: '15', title: 'Spider-Man 4', poster: 'https://images.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', rating: '8.6', year: '2025', type: 'movie', description: 'Tom Holland swings back as Spider-Man in this new chapter of the web-slinger\'s story.', genre: ['Action', 'Adventure', 'Superhero'] },
            { id: '16', title: 'The Batman 2', poster: 'https://images.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', rating: '8.8', year: '2025', type: 'movie', description: 'Robert Pattinson returns as the Dark Knight in this gripping sequel.', genre: ['Action', 'Crime', 'Drama'] },
            { id: '17', title: 'Moana 2', poster: 'https://images.tmdb.org/t/p/w500/1MjW9c40JKRp8ykT1w6D1D3KS6x.jpg', rating: '8.3', year: '2025', type: 'movie', description: 'Moana sets sail on a new ocean adventure with Maui in this Disney sequel.', genre: ['Animation', 'Musical', 'Adventure'] },
            { id: '18', title: 'Gladiator 2', poster: 'https://images.tmdb.org/t/p/w500/18TSJF1WLA4CkymvVUcKDBwUJ9F.jpg', rating: '8.5', year: '2025', type: 'movie', description: 'Ridley Scott returns to the arena with this epic sequel starring Paul Mescal.', genre: ['Action', 'Drama', 'Historical'] },
            { id: '19', title: 'Wicked: Part Two', poster: 'https://images.tmdb.org/t/p/w500/xDGKhVhSJnGCS3pQX8KzlXvBJQW.jpg', rating: '8.3', year: '2025', type: 'movie', description: 'The conclusion to the beloved musical adaptation starring Ariana Grande and Cynthia Erivo.', genre: ['Musical', 'Fantasy', 'Drama'] },
            { id: '20', title: 'The Hunger Games: Sunrise on the Reaping', poster: 'https://images.tmdb.org/t/p/w500/2ZeVSQlmvEyJgK5MmJJNFrfgr7L.jpg', rating: '8.0', year: '2025', type: 'movie', description: 'A new chapter in the Hunger Games saga focusing on Haymitch\'s story.', genre: ['Action', 'Adventure', 'Sci-Fi'] },
            // 2025 TV Series
            { id: '101', title: 'Stranger Things 5', poster: 'https://images.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg', rating: '9.1', year: '2025', type: 'series', description: 'The final season of the beloved sci-fi series brings the Hawkins story to its epic conclusion.', genre: ['Drama', 'Horror', 'Sci-Fi'] },
            { id: '102', title: 'The Mandalorian Season 4', poster: 'https://images.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg', rating: '8.9', year: '2025', type: 'series', description: 'Din Djarin and Grogu continue their adventures across the galaxy in this Star Wars series.', genre: ['Action', 'Adventure', 'Sci-Fi'] },
            { id: '103', title: 'The Boys Season 5', poster: 'https://images.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg', rating: '8.8', year: '2025', type: 'series', description: 'The dark superhero satire continues with more shocking twists and brutal action.', genre: ['Action', 'Comedy', 'Drama'] },
            { id: '104', title: 'Wednesday Season 2', poster: 'https://images.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', rating: '8.5', year: '2025', type: 'series', description: 'Wednesday Addams returns to Nevermore Academy for more dark and twisted adventures.', genre: ['Comedy', 'Horror', 'Mystery'] },
            { id: '105', title: 'House of the Dragon Season 3', poster: 'https://images.tmdb.org/t/p/w500/17BLKCSDy9hvmz9iAA9HEEGy0DL.jpg', rating: '8.7', year: '2025', type: 'series', description: 'The Targaryen civil war intensifies in this continuation of the Game of Thrones prequel.', genre: ['Drama', 'Fantasy', 'Action'] },
            { id: '106', title: 'The Last of Us Season 3', poster: 'https://images.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', rating: '9.0', year: '2025', type: 'series', description: 'Joel and Ellie\'s journey continues in this post-apocalyptic masterpiece.', genre: ['Drama', 'Horror', 'Thriller'] },
            { id: '107', title: 'Daredevil: Born Again', poster: 'https://images.tmdb.org/t/p/w500/3iIB1eUt6uWEBf8mVw9YsUXoaEr.jpg', rating: '8.7', year: '2025', type: 'series', description: 'Charlie Cox returns as the Devil of Hell\'s Kitchen in this MCU series.', genre: ['Action', 'Crime', 'Drama'] },
            { id: '108', title: 'The Witcher Season 4', poster: 'https://images.tmdb.org/t/p/w500/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg', rating: '8.2', year: '2025', type: 'series', description: 'Geralt of Rivia continues his monster-hunting adventures in this fantasy epic.', genre: ['Fantasy', 'Action', 'Adventure'] },
            { id: '109', title: 'Avatar: The Last Airbender Season 2', poster: 'https://images.tmdb.org/t/p/w500/cGXFosYdbxyHiSQgNe4GjBNOiwn.jpg', rating: '8.6', year: '2025', type: 'series', description: 'The live-action adaptation continues Aang\'s journey to master the elements.', genre: ['Adventure', 'Fantasy', 'Family'] },
            { id: '110', title: 'Euphoria Season 3', poster: 'https://images.tmdb.org/t/p/w500/jtnfNzqZwN4E32FGGxx1YZaBWWf.jpg', rating: '8.4', year: '2025', type: 'series', description: 'The critically acclaimed teen drama returns with more intense storylines.', genre: ['Drama', 'Romance', 'Teen'] }
        ];

        const mockGenres = [
            { id: '1', name: 'Action' },
            { id: '2', name: 'Adventure' },
            { id: '3', name: 'Animation' },
            { id: '4', name: 'Biography' },
            { id: '5', name: 'Comedy' },
            { id: '6', name: 'Crime' },
            { id: '7', name: 'Documentary' },
            { id: '8', name: 'Drama' },
            { id: '9', name: 'Family' },
            { id: '10', name: 'Fantasy' },
            { id: '11', name: 'Horror' },
            { id: '12', name: 'Music' },
            { id: '13', name: 'Mystery' },
            { id: '14', name: 'Romance' },
            { id: '15', name: 'Sci-Fi' },
            { id: '16', name: 'Thriller' }
        ];

        switch (endpoint) {
            case '/trending':
                return { results: allContent };
            case '/top':
                return { results: allContent.filter(m => m.type === 'movie') };
            case '/series/top':
                return { results: allContent.filter(m => m.type === 'series') };
            case '/genres':
                return { genres: mockGenres };
            default:
                if (endpoint.includes('/search')) {
                    const query = endpoint.split('q=')[1];
                    if (query) {
                        const searchTerm = decodeURIComponent(query).toLowerCase();
                        const filtered = allContent.filter(item => 
                            item.title.toLowerCase().includes(searchTerm) ||
                            item.description.toLowerCase().includes(searchTerm) ||
                            (item.genre && item.genre.some(g => g.toLowerCase().includes(searchTerm)))
                        );
                        return { results: filtered };
                    }
                }
                return { results: allContent };
        }
    }

    // Content Loading Methods
    async loadTrendingContent() {
        this.showLoadingInSection('trending-content');
        
        try {
            const data = await this.fetchFromAPI('/trending');
            
            if (data && data.results) {
                this.renderContentGrid(data.results, 'trending-content');
            } else {
                this.showErrorInSection('trending-content', 'No trending content available');
            }
        } catch (error) {
            this.showErrorInSection('trending-content', 'Failed to load trending content');
        }
    }

    async loadMoviesContent() {
        this.showLoadingInSection('movies-content');
        
        try {
            const data = await this.fetchFromAPI('/top');
            
            if (data && data.results) {
                this.renderContentGrid(data.results, 'movies-content');
                this.showLoadMoreButton('load-more-movies');
                this.loadGenres('movie-genre-filter');
            } else {
                this.showErrorInSection('movies-content', 'No movies available');
            }
        } catch (error) {
            this.showErrorInSection('movies-content', 'Failed to load movies');
        }
    }

    async loadSeriesContent() {
        this.showLoadingInSection('series-content');
        
        try {
            const data = await this.fetchFromAPI('/series/top');
            
            if (data && data.results) {
                this.renderContentGrid(data.results, 'series-content');
                this.showLoadMoreButton('load-more-series');
                this.loadGenres('series-genre-filter');
            } else {
                this.showErrorInSection('series-content', 'No series available');
            }
        } catch (error) {
            this.showErrorInSection('series-content', 'Failed to load TV series');
        }
    }

    async loadGenresContent() {
        this.showLoadingInSection('genres-content');
        
        try {
            const data = await this.fetchFromAPI('/genres');
            
            if (data && data.genres) {
                this.renderGenresGrid(data.genres);
            } else {
                this.showErrorInSection('genres-content', 'No genres available');
            }
        } catch (error) {
            this.showErrorInSection('genres-content', 'Failed to load genres');
        }
    }

    async loadMoreMovies() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.currentPage.movies++;
        
        try {
            const data = await this.fetchFromAPI(`/top?page=${this.currentPage.movies}`, false);
            
            if (data && data.results && data.results.length > 0) {
                this.appendContentGrid(data.results, 'movies-content');
            } else {
                this.hideLoadMoreButton('load-more-movies');
                this.showToast('No more movies to load', 'info');
            }
        } catch (error) {
            this.showToast('Failed to load more movies', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async loadMoreSeries() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.currentPage.series++;
        
        try {
            const data = await this.fetchFromAPI(`/series/top?page=${this.currentPage.series}`, false);
            
            if (data && data.results && data.results.length > 0) {
                this.appendContentGrid(data.results, 'series-content');
            } else {
                this.hideLoadMoreButton('load-more-series');
                this.showToast('No more series to load', 'info');
            }
        } catch (error) {
            this.showToast('Failed to load more series', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async loadGenres(selectId) {
        try {
            const data = await this.fetchFromAPI('/genres');
            
            if (data && data.genres) {
                const select = document.getElementById(selectId);
                if (select) {
                    select.innerHTML = '<option value="">All Genres</option>';
                    data.genres.forEach(genre => {
                        const option = document.createElement('option');
                        option.value = genre.id;
                        option.textContent = genre.name;
                        select.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load genres:', error);
        }
    }

    // Search Methods
    async performSearch(query) {
        try {
            const data = await this.fetchFromAPI(`/search?q=${encodeURIComponent(query)}`, false);
            
            if (data && data.results) {
                this.renderSearchResults(data.results);
            } else {
                this.showNoSearchResults();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showNoSearchResults();
        }
    }

    renderSearchResults(results) {
        const searchResults = document.getElementById('search-results');
        
        if (results.length === 0) {
            this.showNoSearchResults();
            return;
        }
        
        const html = results.slice(0, 8).map(item => `
            <div class="search-result-item" onclick="window.showtime.showDetails('${item.id}', '${item.type || 'movie'}')">
                <div class="search-result-poster">
                    <img src="${item.poster || 'https://via.placeholder.com/60x90?text=No+Image'}" 
                         alt="${item.title}" 
                         onerror="this.src='https://via.placeholder.com/60x90?text=No+Image'">
                </div>
                <div class="search-result-info">
                    <h4>${item.title}</h4>
                    <p>${item.year || 'N/A'} ${item.type === 'series' ? '📺' : '🎬'}</p>
                    ${item.rating ? `<span class="search-rating">⭐ ${item.rating}</span>` : ''}
                </div>
            </div>
        `).join('');
        
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    showNoSearchResults() {
        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = `
            <div class="no-search-results">
                <i class="fas fa-search"></i>
                <p>No results found</p>
            </div>
        `;
        searchResults.style.display = 'block';
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        searchResults.style.display = 'none';
    }

    // Rendering Methods
    renderContentGrid(items, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const html = items.map(item => this.createContentCard(item)).join('');
        container.innerHTML = html;
        
        // Initialize image optimization
        this.initializeImageOptimization(container);
        
        // Add fade-in animation
        container.classList.add('fade-in');
    }

    appendContentGrid(items, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const html = items.map(item => this.createContentCard(item)).join('');
        container.insertAdjacentHTML('beforeend', html);
        
        // Initialize image optimization for new items
        this.initializeImageOptimization(container);
    }

    createContentCard(item) {
        const isWatched = this.watchedMovies.includes(item.id);
        const type = item.type || (item.title_type === 'tv' ? 'series' : 'movie');
        const cardId = `card-${item.id}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Optimize image URL for faster loading
        const optimizedPoster = this.optimizeImageUrl(item.poster || item.image);
        const fallbackImage = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Loading...';
        
        return `
            <div class="content-card" id="${cardId}" onclick="window.showtime.showDetails('${item.id}', '${type}')">
                <div class="card-poster">
                    <div class="image-container">
                        <div class="image-placeholder">
                            <i class="fas fa-film"></i>
                            <span>Loading...</span>
                        </div>
                        <img src="${fallbackImage}" 
                             data-src="${optimizedPoster}" 
                             alt="${item.title}" 
                             class="poster-image lazy-load"
                             loading="lazy"
                             decoding="async"
                             onload="window.showtime.handleImageLoad(this)"
                             onerror="window.showtime.handleImageError(this, '${item.title}')">
                    </div>
                    ${item.rating ? `
                        <div class="card-rating">
                            <i class="fas fa-star"></i>
                            ${item.rating}
                        </div>
                    ` : ''}
                    <div class="card-type">
                        ${type === 'series' ? '📺 Series' : '🎬 Movie'}
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta">
                        <span class="card-year">${item.year || 'N/A'}</span>
                        ${isWatched ? '<span class="card-watched">Watched</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Image Optimization Methods
    optimizeImageUrl(originalUrl) {
        if (!originalUrl) return this.getGenericPoster();
        
        // For TMDB images, optimize the size for faster loading
        if (originalUrl.includes('tmdb.org')) {
            // Use w300 instead of w500 for card view (faster loading)
            return originalUrl.replace('/w500/', '/w300/');
        }
        
        return originalUrl;
    }

    getGenericPoster(title = 'No Image') {
        return `https://via.placeholder.com/300x450/2a2a2a/ffffff?text=${encodeURIComponent(title)}`;
    }

    handleImageLoad(img) {
        const container = img.closest('.image-container');
        const placeholder = container.querySelector('.image-placeholder');
        
        // Hide placeholder and show image with fade-in effect
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        img.classList.add('loaded');
        
        // Progressive enhancement: load higher quality version if available
        const highResUrl = img.dataset.highRes;
        if (highResUrl && img.dataset.src !== highResUrl) {
            this.loadHigherQuality(img, highResUrl);
        }
    }

    handleImageError(img, title) {
        const container = img.closest('.image-container');
        const placeholder = container.querySelector('.image-placeholder');
        
        // Show fallback image
        img.src = this.getGenericPoster(title);
        img.classList.add('error');
        
        if (placeholder) {
            placeholder.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>Image unavailable</span>
            `;
        }
        
        console.warn(`Failed to load image for: ${title}`);
    }

    loadHigherQuality(img, highResUrl) {
        // Preload higher quality image
        const highResImg = new Image();
        highResImg.onload = () => {
            img.src = highResUrl;
            img.classList.add('high-quality');
        };
        highResImg.src = highResUrl;
    }

    // Advanced Image Optimization System
    initializeImageOptimization(container) {
        // Initialize intersection observer for lazy loading
        if (!this.imageObserver) {
            this.setupIntersectionObserver();
        }

        // Find all lazy load images in the container
        const lazyImages = container.querySelectorAll('.lazy-load');
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });

        // Preload critical images (first few visible ones)
        this.preloadCriticalImages(container);

        // Setup image optimization events
        this.setupImageOptimizationEvents(container);
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px', // Start loading 50px before entering viewport
            threshold: 0.1
        };

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }, options);
    }

    loadImage(img) {
        const realSrc = img.dataset.src;
        if (realSrc) {
            // Create a new image to preload
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = realSrc;
                img.classList.remove('lazy-load');
                img.classList.add('loading-complete');
            };
            tempImg.onerror = () => {
                this.handleImageError(img, img.alt);
            };
            tempImg.src = realSrc;
        }
    }

    preloadCriticalImages(container) {
        // Preload first 6 images that are likely to be visible immediately
        const criticalImages = container.querySelectorAll('.lazy-load');
        const criticalCount = Math.min(6, criticalImages.length);
        
        for (let i = 0; i < criticalCount; i++) {
            const img = criticalImages[i];
            // Add slight delay to avoid overwhelming the browser
            setTimeout(() => {
                this.loadImage(img);
            }, i * 50);
        }
    }

    setupImageOptimizationEvents(container) {
        // Add connection-aware loading
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Adjust image quality based on connection speed
            if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                container.classList.add('low-bandwidth');
                this.optimizeForLowBandwidth(container);
            }
        }

        // Handle visibility change to pause/resume loading
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseImageLoading();
            } else {
                this.resumeImageLoading();
            }
        });
    }

    optimizeForLowBandwidth(container) {
        const images = container.querySelectorAll('.lazy-load');
        images.forEach(img => {
            // Use smaller images for slow connections
            const originalSrc = img.dataset.src;
            if (originalSrc && originalSrc.includes('tmdb.org')) {
                img.dataset.src = originalSrc.replace('/w300/', '/w200/');
            }
        });
    }

    pauseImageLoading() {
        this.imageLoadingPaused = true;
    }

    resumeImageLoading() {
        this.imageLoadingPaused = false;
    }

    renderGenresGrid(genres) {
        const container = document.getElementById('genres-content');
        if (!container) return;
        
        const html = genres.map(genre => `
            <div class="genre-card" onclick="window.showtime.loadGenreContent('${genre.id}', '${genre.name}')">
                <h3>${genre.name}</h3>
                <p>Explore ${genre.name} movies and shows</p>
            </div>
        `).join('');
        
        container.innerHTML = html;
        container.classList.add('fade-in');
    }

    async loadGenreContent(genreId, genreName) {
        const genreResults = document.getElementById('genre-results');
        const genreResultsTitle = document.getElementById('genre-results-title');
        const genreResultsContent = document.getElementById('genre-results-content');
        const genresContent = document.getElementById('genres-content');
        
        genreResultsTitle.textContent = `${genreName} Movies & Shows`;
        genresContent.style.display = 'none';
        genreResults.style.display = 'block';
        
        this.showLoadingInSection('genre-results-content');
        
        try {
            // In a real implementation, you would fetch by genre ID
            // For demo purposes, we'll show trending content
            const data = await this.fetchFromAPI('/trending');
            
            if (data && data.results) {
                this.renderContentGrid(data.results, 'genre-results-content');
            } else {
                this.showErrorInSection('genre-results-content', `No ${genreName} content available`);
            }
        } catch (error) {
            this.showErrorInSection('genre-results-content', `Failed to load ${genreName} content`);
        }
    }

    showGenresList() {
        const genreResults = document.getElementById('genre-results');
        const genresContent = document.getElementById('genres-content');
        
        genreResults.style.display = 'none';
        genresContent.style.display = 'grid';
    }

    // Modal Methods
    async showDetails(id, type) {
        const modal = document.getElementById('modal-overlay');
        const modalBody = document.getElementById('modal-body');
        const modalTitle = document.getElementById('modal-title');
        
        modal.classList.add('show');
        modalTitle.textContent = 'Loading...';
        modalBody.innerHTML = '<div class="loading-placeholder"><div class="spinner"></div><p>Loading details...</p></div>';
        
        try {
            // Find the item in our data
            const trendingData = this.getMockData('/trending');
            const item = trendingData.results.find(movie => movie.id === id);
            
            if (item) {
                const detailedInfo = {
                    title: item.title,
                    poster: item.poster,
                    rating: item.rating,
                    year: item.year,
                    description: item.description,
                    cast: this.generateCast(item.title, type),
                    director: this.generateDirector(item.title),
                    genre: item.genre || [type === 'series' ? 'Drama' : 'Action'],
                    runtime: type === 'series' ? '45-60 min/episode' : '120 min'
                };
                
                this.renderModalContent(detailedInfo, id, type);
            } else {
                throw new Error('Item not found');
            }
        } catch (error) {
            modalBody.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load details. Please try again.</p>
                </div>
            `;
        }
    }

    renderModalContent(details, id, type) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const isWatched = this.watchedMovies.includes(id);
        
        modalTitle.textContent = details.title;
        
        modalBody.innerHTML = `
            <div class="modal-details">
                <div class="modal-poster">
                    <img src="${details.poster}" alt="${details.title}" 
                         onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
                </div>
                <div class="modal-info">
                    <div class="modal-meta">
                        <span class="modal-rating">⭐ ${details.rating}</span>
                        <span class="modal-year">${details.year}</span>
                        <span class="modal-runtime">${details.runtime}</span>
                    </div>
                    <div class="modal-genres">
                        ${details.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                    </div>
                    <p class="modal-description">${details.description}</p>
                    <div class="modal-cast">
                        <h4>Cast</h4>
                        <div class="cast-list">
                            ${details.cast.map(actor => `<span class="cast-member">${actor}</span>`).join('')}
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn primary" onclick="window.showtime.toggleWatched('${id}')">
                            <i class="fas fa-${isWatched ? 'check' : 'plus'}"></i>
                            ${isWatched ? 'Watched' : 'Mark as Watched'}
                        </button>
                        <button class="modal-btn secondary" onclick="window.showtime.searchTrailer('${details.title}')">
                            <i class="fab fa-youtube"></i>
                            Watch Trailer
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    hideModal() {
        const modal = document.getElementById('modal-overlay');
        modal.classList.remove('show');
    }

    // Helper Methods for Realistic Content
    generateCast(title, type) {
        const actors = [
            'Chris Evans', 'Scarlett Johansson', 'Robert Downey Jr.', 'Mark Ruffalo', 'Chris Hemsworth',
            'Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Elizabeth Olsen', 'Paul Rudd',
            'Ryan Reynolds', 'Blake Lively', 'Emma Stone', 'Ryan Gosling', 'Margot Robbie',
            'Leonardo DiCaprio', 'Brad Pitt', 'Angelina Jolie', 'Jennifer Lawrence', 'Will Smith',
            'Dwayne Johnson', 'Gal Gadot', 'Wonder Woman', 'Henry Cavill', 'Amy Adams',
            'Keanu Reeves', 'Charlize Theron', 'Tom Cruise', 'Mission Impossible', 'Ethan Hunt',
            'Millie Bobby Brown', 'Finn Wolfhard', 'Gaten Matarazzo', 'Caleb McLaughlin',
            'Pedro Pascal', 'Bella Ramsey', 'Anna Taylor-Joy', 'Emilia Clarke', 'Kit Harington'
        ];
        
        // Get random cast members
        const shuffled = actors.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }

    generateDirector(title) {
        const directors = [
            'Christopher Nolan', 'Denis Villeneuve', 'Taika Waititi', 'Russo Brothers', 'James Gunn',
            'Ryan Coogler', 'Chloe Zhao', 'Sam Raimi', 'Jon Favreau', 'Dave Filoni',
            'Ridley Scott', 'Martin Scorsese', 'Quentin Tarantino', 'Jordan Peele', 'Greta Gerwig',
            'Rian Johnson', 'J.J. Abrams', 'Zack Snyder', 'Matt Reeves', 'James Cameron'
        ];
        
        return directors[Math.floor(Math.random() * directors.length)];
    }

    // Utility Methods
    toggleWatched(id) {
        const index = this.watchedMovies.indexOf(id);
        
        if (index > -1) {
            this.watchedMovies.splice(index, 1);
            this.showToast('Removed from watched list', 'success');
        } else {
            this.watchedMovies.push(id);
            this.showToast('Added to watched list', 'success');
        }
        
        localStorage.setItem('watchedMovies', JSON.stringify(this.watchedMovies));
        
        // Refresh current view to update cards
        this.refreshCurrentTab();
    }

    searchTrailer(title) {
        const query = encodeURIComponent(`${title} trailer`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

    async showTodaysPick() {
        try {
            const data = await this.fetchFromAPI('/trending');
            
            if (data && data.results && data.results.length > 0) {
                const randomPick = data.results[Math.floor(Math.random() * Math.min(10, data.results.length))];
                this.renderTodaysPick(randomPick);
                document.getElementById('todays-pick').style.display = 'block';
            }
        } catch (error) {
            console.error('Failed to load today\'s pick:', error);
        }
    }

    renderTodaysPick(item) {
        const container = document.getElementById('pick-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="pick-poster">
                <img src="${item.poster || item.image || 'https://via.placeholder.com/400x600?text=No+Image'}" 
                     alt="${item.title}"
                     onerror="this.src='https://via.placeholder.com/400x600?text=No+Image'">
            </div>
            <div class="pick-details">
                <h2 class="pick-title">${item.title}</h2>
                <div class="pick-meta">
                    ${item.rating ? `<span class="pick-rating">⭐ ${item.rating}</span>` : ''}
                    <span class="pick-year">${item.year || 'N/A'}</span>
                    <span class="pick-type">${item.type === 'series' ? '📺 Series' : '🎬 Movie'}</span>
                </div>
                <p class="pick-description">
                    ${item.description || 'Discover this amazing piece of entertainment that\'s trending today. Don\'t miss out on what everyone is talking about!'}
                </p>
                <div class="pick-actions">
                    <button class="pick-btn" onclick="window.showtime.showDetails('${item.id}', '${item.type || 'movie'}')">
                        <i class="fas fa-play"></i> View Details
                    </button>
                    <button class="pick-btn secondary" onclick="window.showtime.searchTrailer('${item.title}')">
                        <i class="fab fa-youtube"></i> Watch Trailer
                    </button>
                </div>
            </div>
        `;
    }

    switchTab(tabName) {
        if (this.currentTab === tabName) return;
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        this.currentTab = tabName;
        
        // Load content for the new tab
        switch (tabName) {
            case 'trending':
                if (!document.getElementById('trending-content').innerHTML.includes('content-card')) {
                    this.loadTrendingContent();
                }
                break;
            case 'movies':
                if (!document.getElementById('movies-content').innerHTML.includes('content-card')) {
                    this.loadMoviesContent();
                }
                break;
            case 'series':
                if (!document.getElementById('series-content').innerHTML.includes('content-card')) {
                    this.loadSeriesContent();
                }
                break;
            case 'genres':
                if (!document.getElementById('genres-content').innerHTML.includes('genre-card')) {
                    this.loadGenresContent();
                }
                break;
        }
    }

    refreshCurrentTab() {
        switch (this.currentTab) {
            case 'trending':
                this.loadTrendingContent();
                break;
            case 'movies':
                this.loadMoviesContent();
                break;
            case 'series':
                this.loadSeriesContent();
                break;
            case 'genres':
                this.loadGenresContent();
                break;
        }
    }

    filterMoviesByGenre(genreId) {
        // Implementation would filter movies by genre
        console.log('Filtering movies by genre:', genreId);
        this.showToast('Genre filtering not yet implemented', 'warning');
    }

    filterSeriesByGenre(genreId) {
        // Implementation would filter series by genre
        console.log('Filtering series by genre:', genreId);
        this.showToast('Genre filtering not yet implemented', 'warning');
    }

    // UI Helper Methods
    showLoadingInSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.innerHTML = `
                <div class="loading-placeholder">
                    <div class="spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
        }
    }

    showErrorInSection(sectionId, message) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.innerHTML = `
                <div class="error-placeholder">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button onclick="window.showtime.refreshCurrentTab()" class="retry-btn">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    }

    showLoadMoreButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.display = 'inline-flex';
        }
    }

    hideLoadMoreButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.style.display = 'none';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1000);
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        }[type] || 'fas fa-info-circle';
        
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Theme Management
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        this.themePreference = theme;
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.themePreference === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.showToast(`Switched to ${newTheme} theme`, 'success');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.showtime = new ShowtimeApp();
});

// Add CSS for search results and other dynamic content
const additionalStyles = `
<style>
.search-result-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-result-item:hover {
    background: var(--bg-secondary);
}

.search-result-item:last-child {
    border-bottom: none;
}

.search-result-poster {
    width: 60px;
    height: 90px;
    margin-right: 1rem;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
}

.search-result-poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.search-result-info {
    flex: 1;
}

.search-result-info h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.search-result-info p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
}

.search-rating {
    background: #fbbf24;
    color: #1f2937;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 500;
}

.no-search-results {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.no-search-results i {
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.modal-details {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
}

.modal-poster img {
    width: 100%;
    border-radius: 15px;
}

.modal-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.modal-rating, .modal-year, .modal-runtime {
    background: var(--bg-secondary);
    padding: 0.5rem 1rem;
    border-radius: 10px;
    font-weight: 500;
}

.modal-rating {
    background: #fbbf24;
    color: #1f2937;
}

.modal-genres {
    margin-bottom: 1rem;
}

.genre-tag {
    background: var(--accent-primary);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    display: inline-block;
}

.modal-description {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.modal-cast h4 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.cast-list {
    margin-bottom: 1.5rem;
}

.cast-member {
    background: var(--bg-secondary);
    padding: 0.5rem 1rem;
    border-radius: 10px;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    display: inline-block;
    color: var(--text-primary);
}

.modal-actions {
    display: flex;
    gap: 1rem;
}

.modal-btn {
    background: var(--accent-gradient);
    color: white;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
}

.modal-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-heavy);
}

.modal-btn.secondary {
    background: transparent;
    border: 2px solid var(--accent-primary);
    color: var(--accent-primary);
}

.modal-btn.secondary:hover {
    background: var(--accent-primary);
    color: white;
}

.error-placeholder {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
    grid-column: 1 / -1;
}

.error-placeholder i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--error-color);
}

.retry-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.retry-btn:hover {
    background: var(--accent-secondary);
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .modal-details {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .modal-poster {
        max-width: 250px;
        margin: 0 auto;
    }
    
    .modal-actions {
        flex-direction: column;
    }
    
    .search-result-poster {
        width: 50px;
        height: 75px;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);