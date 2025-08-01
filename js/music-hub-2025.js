/**
 * Music Discovery Hub 2025
 * Reliable JavaScript for modern music experience
 * Uses Last.fm API (public, no authentication required)
 */

class MusicHub2025 {
    constructor() {
        // API Configuration - Using only reliable, public APIs
        this.apis = {
            lastfm: {
                baseUrl: 'https://ws.audioscrobbler.com/2.0/',
                key: 'b25b959554ed76058ac220b7b2e0a026', // Public Last.fm API key
                format: 'json'
            }
        };

        // State Management
        this.state = {
            currentTrack: null,
            currentTime: 0,
            duration: 0,
            volume: 0.5,
            isPlaying: false,
            isShuffled: false,
            isRepeating: false,
            queue: [],
            favorites: JSON.parse(localStorage.getItem('music_favorites') || '[]'),
            recentSearches: JSON.parse(localStorage.getItem('recent_searches') || '[]'),
            currentGenre: 'all',
            currentRegion: 'global',
            viewMode: 'grid'
        };

        // Performance Optimization
        this.cache = new Map();
        this.searchDebounceTimer = null;
        this.currentPage = 1;
        
        // DOM Elements
        this.elements = {};
        this.bindElements();
        
        // Initialize
        this.init();
    }

    /**
     * Bind DOM elements
     */
    bindElements() {
        this.elements = {
            // Loading
            loadingScreen: document.getElementById('loading-screen'),
            globalLoader: document.getElementById('global-loader'),
            
            // Search
            globalSearch: document.getElementById('global-search'),
            searchSuggestions: document.getElementById('search-suggestions'),
            voiceSearch: document.getElementById('voice-search'),
            
            // Hero Stats
            totalTracks: document.getElementById('total-tracks'),
            activeListeners: document.getElementById('active-listeners'),
            genresExplored: document.getElementById('genres-explored'),
            heroAlbumArt: document.getElementById('hero-album-art'),
            
            // Dashboard
            trendingTracks: document.getElementById('trending-tracks'),
            chartTracks: document.getElementById('chart-tracks'),
            discoverContent: document.getElementById('discover-content'),
            chartRegion: document.getElementById('chart-region'),
            refreshDiscover: document.getElementById('refresh-discover'),
            
            // Genre
            genreGrid: document.getElementById('genre-grid'),
            
            // Player (simplified - no complex audio features)
            currentTrackTitle: document.getElementById('current-track-title'),
            currentArtistName: document.getElementById('current-artist-name'),
            currentAlbumArt: document.getElementById('current-album-art'),
            
            // Music Grid
            musicGrid: document.getElementById('music-grid'),
            loadMoreBtn: document.getElementById('load-more-btn'),
            
            // Artist Section
            artistCarousel: document.getElementById('artist-carousel'),
            refreshArtists: document.getElementById('refresh-artists'),
            
            // Toast Container
            toastContainer: document.getElementById('toast-container')
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.showLoadingScreen();
            await this.loadInitialData();
            this.setupEventListeners();
            this.hideLoadingScreen();
            this.animateHeroStats();
            this.showToast('🎵 Welcome to Music Hub 2025!', 'success');
        } catch (error) {
            console.error('Failed to initialize Music Hub:', error);
            this.showToast('Failed to load music data. Please refresh the page.', 'error');
            this.hideLoadingScreen();
        }
    }

    /**
     * Load initial data from APIs
     */
    async loadInitialData() {
        const promises = [
            this.loadTrendingTracks(),
            this.loadGlobalCharts(),
            this.loadGenres(),
            this.loadFeaturedArtists(),
            this.loadDiscoverContent(),
            this.loadInitialMusicGrid()
        ];

        await Promise.allSettled(promises);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search
        if (this.elements.globalSearch) {
            this.elements.globalSearch.addEventListener('input', this.handleSearchInput.bind(this));
            this.elements.globalSearch.addEventListener('keypress', this.handleSearchKeypress.bind(this));
        }

        // Voice Search (only if supported)
        if (this.elements.voiceSearch) {
            this.elements.voiceSearch.addEventListener('click', this.handleVoiceSearch.bind(this));
        }

        // Region and Refresh Controls
        if (this.elements.chartRegion) {
            this.elements.chartRegion.addEventListener('change', this.handleRegionChange.bind(this));
        }

        if (this.elements.refreshDiscover) {
            this.elements.refreshDiscover.addEventListener('click', this.refreshDiscoverContent.bind(this));
        }

        if (this.elements.refreshArtists) {
            this.elements.refreshArtists.addEventListener('click', this.refreshArtists.bind(this));
        }

        // Load More
        if (this.elements.loadMoreBtn) {
            this.elements.loadMoreBtn.addEventListener('click', this.loadMoreMusic.bind(this));
        }

        // Filter Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', this.handleTabFilter.bind(this));
        });

        // Genre Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', this.handleGenreFilter.bind(this));
        });

        // View Options
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', this.handleViewChange.bind(this));
        });
    }

    /**
     * Animate hero statistics
     */
    animateHeroStats() {
        this.animateCounter(this.elements.totalTracks, 0, 2847392, 2000);
        this.animateCounter(this.elements.activeListeners, 0, 58492, 2000);
        this.animateCounter(this.elements.genresExplored, 0, 47, 2000);
    }

    /**
     * Animate counter from start to end
     */
    animateCounter(element, start, end, duration) {
        if (!element) return;

        const startTime = performance.now();
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            
            element.textContent = this.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        requestAnimationFrame(updateCounter);
    }

    /**
     * Easing function for animations
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Format number with commas
     */
    formatNumber(num) {
        return num.toLocaleString();
    }

    /**
     * Load trending tracks from Last.fm
     */
    async loadTrendingTracks() {
        try {
            const data = await this.makeAPIRequest('lastfm', {
                method: 'chart.gettoptracks',
                limit: 10
            });

            if (data && data.tracks && data.tracks.track) {
                this.renderTrendingTracks(data.tracks.track);
            }
        } catch (error) {
            console.error('Failed to load trending tracks:', error);
            this.renderFallbackTrending();
        }
    }

    /**
     * Load global charts
     */
    async loadGlobalCharts() {
        try {
            const region = this.state.currentRegion;
            let data;

            if (region === 'global') {
                data = await this.makeAPIRequest('lastfm', {
                    method: 'chart.gettoptracks',
                    limit: 15
                });
            } else {
                data = await this.makeAPIRequest('lastfm', {
                    method: 'geo.gettoptracks',
                    country: region,
                    limit: 15
                });
            }

            if (data && data.tracks && data.tracks.track) {
                this.renderChartTracks(data.tracks.track);
            }
        } catch (error) {
            console.error('Failed to load charts:', error);
            this.renderFallbackCharts();
        }
    }

    /**
     * Load music genres
     */
    async loadGenres() {
        try {
            const data = await this.makeAPIRequest('lastfm', {
                method: 'tag.getTopTags'
            });

            if (data && data.toptags && data.toptags.tag) {
                this.renderGenres(data.toptags.tag.slice(0, 20));
            } else {
                this.renderGenres(this.getFallbackGenres());
            }
        } catch (error) {
            console.error('Failed to load genres:', error);
            this.renderGenres(this.getFallbackGenres());
        }
    }

    /**
     * Load featured artists
     */
    async loadFeaturedArtists() {
        try {
            const data = await this.makeAPIRequest('lastfm', {
                method: 'chart.gettopartists',
                limit: 12
            });

            if (data && data.artists && data.artists.artist) {
                this.renderFeaturedArtists(data.artists.artist);
            }
        } catch (error) {
            console.error('Failed to load featured artists:', error);
            this.renderFallbackArtists();
        }
    }

    /**
     * Load discover content
     */
    async loadDiscoverContent() {
        try {
            const data = await this.makeAPIRequest('lastfm', {
                method: 'track.search',
                track: this.getRandomDiscoverQuery(),
                limit: 6
            });

            if (data && data.results && data.results.trackmatches && data.results.trackmatches.track) {
                this.renderDiscoverContent(data.results.trackmatches.track);
            }
        } catch (error) {
            console.error('Failed to load discover content:', error);
            this.renderFallbackDiscover();
        }
    }

    /**
     * Load initial music grid
     */
    async loadInitialMusicGrid() {
        try {
            const data = await this.makeAPIRequest('lastfm', {
                method: 'chart.gettoptracks',
                limit: 24,
                page: 1
            });

            if (data && data.tracks && data.tracks.track) {
                this.renderMusicGrid(data.tracks.track, false);
            }
        } catch (error) {
            console.error('Failed to load initial music grid:', error);
            this.renderFallbackMusicGrid();
        }
    }

    /**
     * Make API request with caching and error handling
     */
    async makeAPIRequest(apiName, params) {
        const cacheKey = `${apiName}_${JSON.stringify(params)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
                return cached.data;
            }
        }

        try {
            const url = this.buildLastFmUrl(params);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the response
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`API request failed:`, error);
            throw error;
        }
    }

    /**
     * Build Last.fm API URL
     */
    buildLastFmUrl(params) {
        const url = new URL(this.apis.lastfm.baseUrl);
        url.searchParams.append('api_key', this.apis.lastfm.key);
        url.searchParams.append('format', this.apis.lastfm.format);
        
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        
        return url.toString();
    }

    /**
     * Handle search input with debouncing
     */
    handleSearchInput(event) {
        const query = event.target.value.trim();
        
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }
        
        this.searchDebounceTimer = setTimeout(() => {
            if (query.length >= 2) {
                this.performSearch(query);
            } else {
                this.loadInitialMusicGrid();
            }
        }, 300);
    }

    /**
     * Handle search keypress (Enter)
     */
    handleSearchKeypress(event) {
        if (event.key === 'Enter') {
            const query = event.target.value.trim();
            if (query) {
                this.performSearch(query);
                this.addToRecentSearches(query);
            }
        }
    }

    /**
     * Perform search
     */
    async performSearch(query) {
        try {
            this.showGlobalLoader();
            
            const data = await this.makeAPIRequest('lastfm', {
                method: 'track.search',
                track: query,
                limit: 24
            });

            if (data && data.results && data.results.trackmatches && data.results.trackmatches.track) {
                this.renderMusicGrid(data.results.trackmatches.track, false);
                this.showToast(`Found results for "${query}"`, 'info');
            } else {
                this.renderNoResults(query);
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.showToast('Search failed. Please try again.', 'error');
        } finally {
            this.hideGlobalLoader();
        }
    }

    /**
     * Handle voice search (with browser support check)
     */
    handleVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showToast('Voice search is not supported in your browser', 'error');
            return;
        }

        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                this.elements.voiceSearch.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                this.showToast('🎤 Listening... Speak now!', 'info');
            };

            recognition.onresult = (event) => {
                const query = event.results[0][0].transcript;
                this.elements.globalSearch.value = query;
                this.performSearch(query);
            };

            recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                this.showToast('Voice search failed. Please try again.', 'error');
            };

            recognition.onend = () => {
                this.elements.voiceSearch.innerHTML = '<i class="fas fa-microphone"></i>';
            };

            recognition.start();
        } catch (error) {
            console.error('Voice search error:', error);
            this.showToast('Voice search is not available', 'error');
        }
    }

    /**
     * Handle region change
     */
    handleRegionChange(event) {
        this.state.currentRegion = event.target.value;
        this.loadGlobalCharts();
    }

    /**
     * Handle tab filter
     */
    handleTabFilter(event) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const category = event.target.getAttribute('data-category');
        this.filterMusicByCategory(category);
    }

    /**
     * Filter music by category
     */
    async filterMusicByCategory(category) {
        try {
            this.showGlobalLoader();
            
            let data;
            switch (category) {
                case 'new-releases':
                    data = await this.makeAPIRequest('lastfm', {
                        method: 'chart.gettoptracks',
                        limit: 24
                    });
                    break;
                case 'top-tracks':
                    data = await this.makeAPIRequest('lastfm', {
                        method: 'chart.gettoptracks',
                        limit: 24
                    });
                    break;
                case 'favorites':
                    this.renderFavorites();
                    return;
                default:
                    data = await this.makeAPIRequest('lastfm', {
                        method: 'chart.gettoptracks',
                        limit: 24
                    });
            }

            if (data && data.tracks && data.tracks.track) {
                this.renderMusicGrid(data.tracks.track, false);
            }
        } catch (error) {
            console.error('Failed to filter music:', error);
        } finally {
            this.hideGlobalLoader();
        }
    }

    /**
     * Render favorites
     */
    renderFavorites() {
        if (this.state.favorites.length === 0) {
            this.elements.musicGrid.innerHTML = `
                <div class="no-favorites">
                    <i class="fas fa-heart"></i>
                    <h3>No favorites yet</h3>
                    <p>Add some tracks to your favorites to see them here!</p>
                </div>
            `;
            return;
        }

        const tracks = this.state.favorites.map(fav => fav.track);
        this.renderMusicGrid(tracks, false);
    }

    /**
     * Explore genre
     */
    async exploreGenre(genreName) {
        try {
            this.showGlobalLoader();
            
            const data = await this.makeAPIRequest('lastfm', {
                method: 'tag.gettoptracks',
                tag: genreName,
                limit: 24
            });

            if (data && data.tracks && data.tracks.track) {
                this.renderMusicGrid(data.tracks.track, false);
                this.showToast(`🎵 Exploring ${genreName} music`, 'success');
            }
        } catch (error) {
            console.error('Failed to explore genre:', error);
            this.showToast('Failed to load genre tracks', 'error');
        } finally {
            this.hideGlobalLoader();
        }
    }

    /**
     * Add to recent searches
     */
    addToRecentSearches(query) {
        if (!this.state.recentSearches.includes(query)) {
            this.state.recentSearches.unshift(query);
            this.state.recentSearches = this.state.recentSearches.slice(0, 10); // Keep only 10
            localStorage.setItem('recent_searches', JSON.stringify(this.state.recentSearches));
        }
    }

    /**
     * Refresh discover content
     */
    async refreshDiscoverContent() {
        await this.loadDiscoverContent();
        this.showToast('Discover content refreshed!', 'success');
    }

    /**
     * Refresh artists
     */
    async refreshArtists() {
        await this.loadFeaturedArtists();
        this.showToast('Artists refreshed!', 'success');
    }

    /**
     * Load more music
     */
    async loadMoreMusic() {
        try {
            this.currentPage++;
            const data = await this.makeAPIRequest('lastfm', {
                method: 'chart.gettoptracks',
                limit: 24,
                page: this.currentPage
            });

            if (data && data.tracks && data.tracks.track) {
                this.renderMusicGrid(data.tracks.track, true);
            }
        } catch (error) {
            console.error('Failed to load more music:', error);
            this.showToast('Failed to load more tracks', 'error');
        }
    }

    /**
     * Handle view change
     */
    handleViewChange(event) {
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const view = event.target.getAttribute('data-view');
        this.state.viewMode = view;
        
        if (view === 'list') {
            this.elements.musicGrid.classList.add('list-view');
        } else {
            this.elements.musicGrid.classList.remove('list-view');
        }
    }

    /**
     * Handle genre filter
     */
    handleGenreFilter(event) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const filter = event.target.getAttribute('data-filter');
        this.state.currentGenre = filter;
        // Apply genre filtering logic here
    }

    /**
     * Render trending tracks
     */
    renderTrendingTracks(tracks) {
        if (!this.elements.trendingTracks) return;

        const html = tracks.slice(0, 5).map((track, index) => `
            <div class="trending-item">
                <div class="trending-rank">${index + 1}</div>
                <div class="trending-info">
                    <div class="trending-title">${this.escapeHtml(track.name)}</div>
                    <div class="trending-artist">${this.escapeHtml(track.artist.name)}</div>
                </div>
                <div class="trending-listeners">${this.formatNumber(parseInt(track.listeners || 0))}</div>
            </div>
        `).join('');

        this.elements.trendingTracks.innerHTML = html;
    }

    /**
     * Render chart tracks
     */
    renderChartTracks(tracks) {
        if (!this.elements.chartTracks) return;

        const html = tracks.slice(0, 10).map((track, index) => `
            <div class="chart-item">
                <div class="chart-position">${index + 1}</div>
                <div class="chart-info">
                    <div class="chart-title">${this.escapeHtml(track.name)}</div>
                    <div class="chart-artist">${this.escapeHtml(track.artist.name)}</div>
                </div>
                <div class="chart-listeners">${this.formatNumber(parseInt(track.listeners || 0))} listeners</div>
            </div>
        `).join('');

        this.elements.chartTracks.innerHTML = html;
    }

    /**
     * Render music grid
     */
    renderMusicGrid(tracks, append = false) {
        if (!this.elements.musicGrid) return;

        const html = tracks.map(track => this.createMusicCard(track)).join('');
        
        if (append) {
            this.elements.musicGrid.insertAdjacentHTML('beforeend', html);
        } else {
            this.elements.musicGrid.innerHTML = html;
        }
    }

    /**
     * Create music card HTML
     */
    createMusicCard(track) {
        const trackId = this.getTrackId(track);
        const isFavorited = this.state.favorites.some(fav => fav.id === trackId);
        const imageUrl = this.getImageUrl(track.image, 'large') || 'assets/default.svg';

        return `
            <div class="music-card" onclick="musicHub.selectTrack('${trackId}')">
                <div class="card-image">
                    <img src="${imageUrl}" alt="${this.escapeHtml(track.name)}" loading="lazy">
                    <div class="play-overlay">
                        <i class="fas fa-music"></i>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${this.escapeHtml(track.name)}</h3>
                    <p class="card-artist">${this.escapeHtml(track.artist?.name || track.artist)}</p>
                    <div class="card-actions">
                        <button class="card-favorite ${isFavorited ? 'favorited' : ''}" 
                                onclick="event.stopPropagation(); musicHub.toggleTrackFavorite('${trackId}', this)">
                            <i class="${isFavorited ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <div class="card-meta">
                            <span class="listeners">${this.formatNumber(parseInt(track.listeners || 0))} listeners</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Select track (simplified version without audio playback)
     */
    selectTrack(trackId) {
        const track = this.findTrackById(trackId);
        if (track) {
            this.state.currentTrack = track;
            this.updatePlayerDisplay(track);
            this.showToast(`🎵 Selected: ${track.name} by ${track.artist.name || track.artist}`, 'success');
        }
    }

    /**
     * Find track by ID
     */
    findTrackById(trackId) {
        // This would need to be implemented to find the track from current data
        return null;
    }

    /**
     * Update player display
     */
    updatePlayerDisplay(track) {
        if (this.elements.currentTrackTitle) {
            this.elements.currentTrackTitle.textContent = track.name;
        }
        
        if (this.elements.currentArtistName) {
            this.elements.currentArtistName.textContent = track.artist.name || track.artist;
        }
        
        if (this.elements.currentAlbumArt && track.image) {
            const largeImage = track.image.find(img => img.size === 'large' || img.size === 'extralarge');
            if (largeImage) {
                this.elements.currentAlbumArt.src = largeImage['#text'];
                if (this.elements.heroAlbumArt) {
                    this.elements.heroAlbumArt.src = largeImage['#text'];
                }
            }
        }
    }

    /**
     * Toggle track favorite
     */
    toggleTrackFavorite(trackId, buttonElement) {
        const index = this.state.favorites.findIndex(fav => fav.id === trackId);
        
        if (index === -1) {
            // Add to favorites (need to find the track data)
            const track = this.findTrackById(trackId);
            if (track) {
                this.state.favorites.push({
                    id: trackId,
                    track: track,
                    addedAt: Date.now()
                });
                buttonElement.classList.add('favorited');
                buttonElement.querySelector('i').className = 'fas fa-heart';
                this.showToast('Added to favorites ❤️', 'success');
            }
        } else {
            // Remove from favorites
            this.state.favorites.splice(index, 1);
            buttonElement.classList.remove('favorited');
            buttonElement.querySelector('i').className = 'far fa-heart';
            this.showToast('Removed from favorites', 'info');
        }

        this.saveFavorites();
    }

    /**
     * Get unique track ID
     */
    getTrackId(track) {
        const artist = track.artist?.name || track.artist;
        return `${artist}-${track.name}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    /**
     * Save favorites to localStorage
     */
    saveFavorites() {
        localStorage.setItem('music_favorites', JSON.stringify(this.state.favorites));
    }

    /**
     * Get image URL from Last.fm image array
     */
    getImageUrl(images, size = 'medium') {
        if (!images || !Array.isArray(images)) return null;
        
        const image = images.find(img => img.size === size) || images[images.length - 1];
        return image ? image['#text'] : null;
    }

    /**
     * Render genres
     */
    renderGenres(genres) {
        if (!this.elements.genreGrid) return;

        const html = genres.slice(0, 12).map(genre => `
            <div class="genre-card" onclick="musicHub.exploreGenre('${genre.name}')">
                <div class="genre-icon">🎵</div>
                <div class="genre-name">${this.escapeHtml(genre.name)}</div>
                <div class="genre-count">${this.formatNumber(genre.count || genre.reach || 1000)} tracks</div>
            </div>
        `).join('');

        this.elements.genreGrid.innerHTML = html;
    }

    /**
     * Render featured artists
     */
    renderFeaturedArtists(artists) {
        if (!this.elements.artistCarousel) return;

        const html = artists.slice(0, 8).map(artist => `
            <div class="artist-card">
                <div class="artist-image">
                    <img src="${this.getImageUrl(artist.image, 'large') || 'assets/default.svg'}" alt="${this.escapeHtml(artist.name)}">
                </div>
                <div class="artist-name">${this.escapeHtml(artist.name)}</div>
                <div class="artist-listeners">${this.formatNumber(parseInt(artist.listeners || 0))} listeners</div>
            </div>
        `).join('');

        this.elements.artistCarousel.innerHTML = html;
    }

    /**
     * Render discover content
     */
    renderDiscoverContent(tracks) {
        if (!this.elements.discoverContent) return;

        const html = tracks.slice(0, 4).map(track => `
            <div class="discover-item">
                <div class="discover-title">${this.escapeHtml(track.name)}</div>
                <div class="discover-artist">${this.escapeHtml(track.artist)}</div>
            </div>
        `).join('');

        this.elements.discoverContent.innerHTML = html;
    }

    /**
     * Render no results
     */
    renderNoResults(query) {
        this.elements.musicGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No results found</h3>
                <p>Sorry, we couldn't find any tracks matching "${this.escapeHtml(query)}"</p>
            </div>
        `;
    }

    /**
     * Get random discover query
     */
    getRandomDiscoverQuery() {
        const queries = [
            'love', 'dream', 'night', 'summer', 'dance', 'rock', 'soul', 'heart',
            'fire', 'light', 'moon', 'star', 'blue', 'red', 'gold', 'wild'
        ];
        return queries[Math.floor(Math.random() * queries.length)];
    }

    /**
     * Get fallback genres
     */
    getFallbackGenres() {
        return [
            { name: 'Pop', count: 50000 },
            { name: 'Rock', count: 45000 },
            { name: 'Hip-Hop', count: 40000 },
            { name: 'Electronic', count: 35000 },
            { name: 'R&B', count: 30000 },
            { name: 'Country', count: 25000 },
            { name: 'Jazz', count: 20000 },
            { name: 'Classical', count: 15000 },
            { name: 'Reggae', count: 12000 },
            { name: 'Folk', count: 10000 }
        ];
    }

    /**
     * Fallback rendering methods
     */
    renderFallbackTrending() {
        if (!this.elements.trendingTracks) return;
        this.elements.trendingTracks.innerHTML = '<div class="loading-fallback">Loading trending tracks...</div>';
    }

    renderFallbackCharts() {
        if (!this.elements.chartTracks) return;
        this.elements.chartTracks.innerHTML = '<div class="loading-fallback">Loading charts...</div>';
    }

    renderFallbackArtists() {
        if (!this.elements.artistCarousel) return;
        this.elements.artistCarousel.innerHTML = '<div class="loading-fallback">Loading artists...</div>';
    }

    renderFallbackDiscover() {
        if (!this.elements.discoverContent) return;
        this.elements.discoverContent.innerHTML = '<div class="loading-fallback">Loading discover content...</div>';
    }

    renderFallbackMusicGrid() {
        if (!this.elements.musicGrid) return;
        this.elements.musicGrid.innerHTML = '<div class="loading-fallback">Loading music...</div>';
    }

    /**
     * Show/hide loading states
     */
    showLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        if (this.elements.loadingScreen) {
            setTimeout(() => {
                this.elements.loadingScreen.classList.add('hidden');
            }, 1000);
        }
    }

    showGlobalLoader() {
        if (this.elements.globalLoader) {
            this.elements.globalLoader.style.display = 'flex';
        }
    }

    hideGlobalLoader() {
        if (this.elements.globalLoader) {
            this.elements.globalLoader.style.display = 'none';
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        if (!this.elements.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the Music Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicHub = new MusicHub2025();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.musicHub) {
        window.musicHub.showToast('An unexpected error occurred', 'error');
    }
});