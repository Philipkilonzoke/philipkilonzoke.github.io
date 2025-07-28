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
            console.warn('API unavailable, using mock data:', error);
            this.showToast('Using demo content (API unavailable)', 'warning');
            return this.getMockData(endpoint);
        }
    }

    // Mock Data for Demo Purposes
    getMockData(endpoint) {
        const mockMovies = [
            {
                id: '1',
                title: 'Dune: Part Two',
                poster: 'https://images.unsplash.com/photo-1489599735734-79b4736ce2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450',
                rating: '8.7',
                year: '2024',
                type: 'movie',
                description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
            },
            {
                id: '2',
                title: 'The Last of Us',
                poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450',
                rating: '8.9',
                year: '2023',
                type: 'series',
                description: 'Twenty years after a pandemic radically changed known civilization, infected humans run wild and survivors are killing each other for food.'
            },
            {
                id: '3',
                title: 'Oppenheimer',
                poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450',
                rating: '8.4',
                year: '2023',
                type: 'movie',
                description: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II.'
            },
            {
                id: '4',
                title: 'Wednesday',
                poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450',
                rating: '8.1',
                year: '2022',
                type: 'series',
                description: 'Follows Wednesday Addams\' years as a student at Nevermore Academy.'
            },
            {
                id: '5',
                title: 'Barbie',
                poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450',
                rating: '7.0',
                year: '2023',
                type: 'movie',
                description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.'
            },
            {
                id: '6',
                title: 'House of the Dragon',
                poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450',
                rating: '8.5',
                year: '2022',
                type: 'series',
                description: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.'
            },
            {
                id: '7',
                title: 'Avatar: The Way of Water',
                poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450',
                rating: '7.6',
                year: '2022',
                type: 'movie',
                description: 'Jake Sully lives with his newfamily on the planet Pandora. Once a familiar threat returns to finish what was previously started.'
            },
            {
                id: '8',
                title: 'Stranger Things',
                poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450',
                rating: '8.7',
                year: '2022',
                type: 'series',
                description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces.'
            }
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
                return { results: mockMovies };
            case '/top':
                return { results: mockMovies.filter(m => m.type === 'movie') };
            case '/series/top':
                return { results: mockMovies.filter(m => m.type === 'series') };
            case '/genres':
                return { genres: mockGenres };
            default:
                if (endpoint.includes('/search')) {
                    const query = endpoint.split('q=')[1];
                    const filtered = mockMovies.filter(movie => 
                        movie.title.toLowerCase().includes(decodeURIComponent(query).toLowerCase())
                    );
                    return { results: filtered };
                }
                return { results: mockMovies };
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
        
        // Add fade-in animation
        container.classList.add('fade-in');
    }

    appendContentGrid(items, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const html = items.map(item => this.createContentCard(item)).join('');
        container.insertAdjacentHTML('beforeend', html);
    }

    createContentCard(item) {
        const isWatched = this.watchedMovies.includes(item.id);
        const type = item.type || (item.title_type === 'tv' ? 'series' : 'movie');
        
        return `
            <div class="content-card" onclick="window.showtime.showDetails('${item.id}', '${type}')">
                <div class="card-poster">
                    <img src="${item.poster || item.image || 'https://via.placeholder.com/300x450?text=No+Image'}" 
                         alt="${item.title}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
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
            // Find the item in our mock data
            const mockData = this.getMockData('/trending');
            const item = mockData.results.find(movie => movie.id === id);
            
            if (item) {
                const detailedInfo = {
                    title: item.title,
                    poster: item.poster,
                    rating: item.rating,
                    year: item.year,
                    description: item.description,
                    cast: ['John Doe', 'Jane Smith', 'Bob Johnson'],
                    director: 'Christopher Nolan',
                    genre: type === 'series' ? ['Drama', 'Thriller'] : ['Action', 'Adventure'],
                    runtime: type === 'series' ? '60 min/episode' : '120 min'
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