/**
 * Music Discovery Hub 2025
 * Advanced JavaScript for cutting-edge music experience
 * Integrates with Last.fm, Deezer, Spotify Web API, and more
 */

class MusicHub2025 {
    constructor() {
        // API Configuration
        this.apis = {
            lastfm: {
                baseUrl: 'https://ws.audioscrobbler.com/2.0/',
                key: '8b2b4a76e8f5c9f3e1a2b8c5d9e2f1a4', // Demo key - replace with your own
                format: 'json'
            },
            deezer: {
                baseUrl: 'https://api.deezer.com',
                corsProxy: 'https://api.allorigins.win/raw?url='
            },
            genius: {
                baseUrl: 'https://api.genius.com',
                accessToken: 'YOUR_GENIUS_TOKEN' // Replace with your token
            },
            audioDb: {
                baseUrl: 'https://www.theaudiodb.com/api/v1/json/1'
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
            userPreferences: JSON.parse(localStorage.getItem('user_preferences') || '{}'),
            currentGenre: 'all',
            currentRegion: 'global',
            viewMode: 'grid'
        };

        // Performance Optimization
        this.cache = new Map();
        this.requestQueue = [];
        this.isLoadingMore = false;
        this.currentPage = 1;
        this.searchDebounceTimer = null;
        
        // Audio Context for Visualizations
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.animationId = null;

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
            
            // Player
            currentAlbumArt: document.getElementById('current-album-art'),
            currentTrackTitle: document.getElementById('current-track-title'),
            currentArtistName: document.getElementById('current-artist-name'),
            currentAlbumName: document.getElementById('current-album-name'),
            currentYear: document.getElementById('current-year'),
            audioElement: document.getElementById('audio-element'),
            
            // Player Controls
            playPauseBtn: document.getElementById('play-pause-btn'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            shuffleBtn: document.getElementById('shuffle-btn'),
            repeatBtn: document.getElementById('repeat-btn'),
            favoriteBtn: document.getElementById('favorite-btn'),
            shareBtn: document.getElementById('share-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            
            // Progress
            progressBar: document.getElementById('progress-bar'),
            currentTime: document.getElementById('current-time'),
            totalTime: document.getElementById('total-time'),
            volumeBtn: document.getElementById('volume-btn'),
            volumeSlider: document.getElementById('volume-slider'),
            
            // Queue & Lyrics
            queueToggle: document.getElementById('queue-toggle'),
            lyricsToggle: document.getElementById('lyrics-toggle'),
            queuePanel: document.getElementById('queue-panel'),
            lyricsPanel: document.getElementById('lyrics-panel'),
            queueList: document.getElementById('queue-list'),
            lyricsContent: document.getElementById('lyrics-content'),
            clearQueue: document.getElementById('clear-queue'),
            lyricsClose: document.getElementById('lyrics-close'),
            
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
            this.setupAudioContext();
            this.startPerformanceMonitoring();
            this.hideLoadingScreen();
            this.startLiveUpdates();
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

        if (this.elements.voiceSearch) {
            this.elements.voiceSearch.addEventListener('click', this.handleVoiceSearch.bind(this));
        }

        // Player Controls
        if (this.elements.playPauseBtn) {
            this.elements.playPauseBtn.addEventListener('click', this.togglePlayPause.bind(this));
        }

        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', this.playPrevious.bind(this));
        }

        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', this.playNext.bind(this));
        }

        if (this.elements.shuffleBtn) {
            this.elements.shuffleBtn.addEventListener('click', this.toggleShuffle.bind(this));
        }

        if (this.elements.repeatBtn) {
            this.elements.repeatBtn.addEventListener('click', this.toggleRepeat.bind(this));
        }

        if (this.elements.favoriteBtn) {
            this.elements.favoriteBtn.addEventListener('click', this.toggleFavorite.bind(this));
        }

        if (this.elements.shareBtn) {
            this.elements.shareBtn.addEventListener('click', this.shareTrack.bind(this));
        }

        // Progress and Volume
        if (this.elements.progressBar) {
            this.elements.progressBar.addEventListener('input', this.handleProgressChange.bind(this));
        }

        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', this.handleVolumeChange.bind(this));
        }

        // Audio Element
        if (this.elements.audioElement) {
            this.elements.audioElement.addEventListener('timeupdate', this.updateProgress.bind(this));
            this.elements.audioElement.addEventListener('loadedmetadata', this.updateDuration.bind(this));
            this.elements.audioElement.addEventListener('ended', this.handleTrackEnd.bind(this));
            this.elements.audioElement.addEventListener('error', this.handleAudioError.bind(this));
        }

        // Queue and Lyrics
        if (this.elements.queueToggle) {
            this.elements.queueToggle.addEventListener('click', this.toggleQueue.bind(this));
        }

        if (this.elements.lyricsToggle) {
            this.elements.lyricsToggle.addEventListener('click', this.toggleLyrics.bind(this));
        }

        if (this.elements.clearQueue) {
            this.elements.clearQueue.addEventListener('click', this.clearQueue.bind(this));
        }

        if (this.elements.lyricsClose) {
            this.elements.lyricsClose.addEventListener('click', this.closeLyrics.bind(this));
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

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Intersection Observer for lazy loading
        this.setupIntersectionObserver();
    }

    /**
     * Setup Audio Context for visualizations
     */
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            if (this.elements.audioElement) {
                const source = this.audioContext.createMediaElementSource(this.elements.audioElement);
                source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
            }
        } catch (error) {
            console.warn('Audio Context not supported:', error);
        }
    }

    /**
     * Start live updates for real-time features
     */
    startLiveUpdates() {
        // Update trending tracks every 5 minutes
        setInterval(() => {
            this.loadTrendingTracks();
        }, 5 * 60 * 1000);

        // Update charts every 30 minutes
        setInterval(() => {
            this.loadGlobalCharts();
        }, 30 * 60 * 1000);

        // Update discover content every 10 minutes
        setInterval(() => {
            this.loadDiscoverContent();
        }, 10 * 60 * 1000);
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
            }
        } catch (error) {
            console.error('Failed to load genres:', error);
            // Fallback to predefined genres
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
            let url;
            
            switch (apiName) {
                case 'lastfm':
                    url = this.buildLastFmUrl(params);
                    break;
                case 'deezer':
                    url = this.buildDeezerUrl(params);
                    break;
                default:
                    throw new Error(`Unknown API: ${apiName}`);
            }

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
            console.error(`API request failed (${apiName}):`, error);
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
     * Build Deezer API URL
     */
    buildDeezerUrl(params) {
        const baseUrl = this.apis.deezer.baseUrl;
        const endpoint = params.endpoint || '';
        delete params.endpoint;
        
        const url = new URL(`${baseUrl}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        
        return `${this.apis.deezer.corsProxy}${encodeURIComponent(url.toString())}`;
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
                this.showSearchSuggestions(query);
            } else {
                this.hideSearchSuggestions();
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
                this.showToast(`Found ${data.results['opensearch:totalResults']} results for "${query}"`, 'info');
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
     * Handle voice search
     */
    handleVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showToast('Voice search is not supported in your browser', 'error');
            return;
        }

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
            this.addToRecentSearches(query);
        };

        recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.showToast('Voice search failed. Please try again.', 'error');
        };

        recognition.onend = () => {
            this.elements.voiceSearch.innerHTML = '<i class="fas fa-microphone"></i>';
        };

        recognition.start();
    }

    /**
     * Play track
     */
    async playTrack(track) {
        try {
            this.state.currentTrack = track;
            this.updatePlayerUI(track);
            
            // Try to get preview URL from Deezer
            const preview = await this.getTrackPreview(track);
            
            if (preview) {
                this.elements.audioElement.src = preview;
                await this.elements.audioElement.play();
                this.state.isPlaying = true;
                this.updatePlayPauseButton();
                this.startAudioVisualization();
                this.showToast(`🎵 Now Playing: ${track.name} by ${track.artist.name}`, 'success');
            } else {
                this.showToast('Preview not available for this track', 'error');
            }
        } catch (error) {
            console.error('Failed to play track:', error);
            this.showToast('Failed to play track. Please try another.', 'error');
        }
    }

    /**
     * Get track preview URL
     */
    async getTrackPreview(track) {
        try {
            const query = `${track.artist.name} ${track.name}`;
            const data = await this.makeAPIRequest('deezer', {
                endpoint: '/search',
                q: query,
                limit: 1
            });

            if (data && data.data && data.data.length > 0) {
                return data.data[0].preview;
            }
        } catch (error) {
            console.error('Failed to get preview:', error);
        }
        
        return null;
    }

    /**
     * Toggle play/pause
     */
    togglePlayPause() {
        if (!this.elements.audioElement.src) {
            this.showToast('Please select a track to play', 'info');
            return;
        }

        if (this.state.isPlaying) {
            this.elements.audioElement.pause();
            this.state.isPlaying = false;
            this.stopAudioVisualization();
        } else {
            this.elements.audioElement.play();
            this.state.isPlaying = true;
            this.startAudioVisualization();
        }
        
        this.updatePlayPauseButton();
    }

    /**
     * Update play/pause button
     */
    updatePlayPauseButton() {
        const icon = this.elements.playPauseBtn.querySelector('i');
        if (this.state.isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }

    /**
     * Start audio visualization
     */
    startAudioVisualization() {
        if (!this.analyser || !this.dataArray) return;

        const visualize = () => {
            if (!this.state.isPlaying) return;

            this.analyser.getByteFrequencyData(this.dataArray);
            
            const bars = document.querySelectorAll('.visualizer-bars .bar');
            bars.forEach((bar, index) => {
                const value = this.dataArray[index * 4] || 0;
                const height = (value / 255) * 100;
                bar.style.height = `${Math.max(20, height)}%`;
            });

            this.animationId = requestAnimationFrame(visualize);
        };

        visualize();
    }

    /**
     * Stop audio visualization
     */
    stopAudioVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Update player UI
     */
    updatePlayerUI(track) {
        if (this.elements.currentTrackTitle) {
            this.elements.currentTrackTitle.textContent = track.name;
        }
        
        if (this.elements.currentArtistName) {
            this.elements.currentArtistName.textContent = track.artist.name;
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

        // Update favorite button
        this.updateFavoriteButton(track);
    }

    /**
     * Toggle favorite
     */
    toggleFavorite() {
        if (!this.state.currentTrack) return;

        const trackId = this.getTrackId(this.state.currentTrack);
        const index = this.state.favorites.findIndex(fav => fav.id === trackId);

        if (index === -1) {
            // Add to favorites
            this.state.favorites.push({
                id: trackId,
                track: this.state.currentTrack,
                addedAt: Date.now()
            });
            this.showToast('Added to favorites ❤️', 'success');
        } else {
            // Remove from favorites
            this.state.favorites.splice(index, 1);
            this.showToast('Removed from favorites', 'info');
        }

        this.saveFavorites();
        this.updateFavoriteButton(this.state.currentTrack);
    }

    /**
     * Update favorite button
     */
    updateFavoriteButton(track) {
        if (!this.elements.favoriteBtn || !track) return;

        const trackId = this.getTrackId(track);
        const isFavorited = this.state.favorites.some(fav => fav.id === trackId);
        
        const icon = this.elements.favoriteBtn.querySelector('i');
        if (isFavorited) {
            icon.className = 'fas fa-heart';
            this.elements.favoriteBtn.classList.add('favorited');
        } else {
            icon.className = 'far fa-heart';
            this.elements.favoriteBtn.classList.remove('favorited');
        }
    }

    /**
     * Get unique track ID
     */
    getTrackId(track) {
        return `${track.artist.name}-${track.name}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    /**
     * Save favorites to localStorage
     */
    saveFavorites() {
        localStorage.setItem('music_favorites', JSON.stringify(this.state.favorites));
    }

    /**
     * Share track
     */
    shareTrack() {
        if (!this.state.currentTrack) return;

        const track = this.state.currentTrack;
        const shareText = `🎵 Check out "${track.name}" by ${track.artist.name} on Music Hub 2025!`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: `${track.name} - ${track.artist.name}`,
                text: shareText,
                url: shareUrl
            }).catch(console.error);
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                this.showToast('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Sharing failed', 'error');
            });
        }
    }

    /**
     * Handle progress change
     */
    handleProgressChange(event) {
        const audio = this.elements.audioElement;
        if (audio.duration) {
            const seekTime = (event.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    }

    /**
     * Handle volume change
     */
    handleVolumeChange(event) {
        const volume = event.target.value / 100;
        this.elements.audioElement.volume = volume;
        this.state.volume = volume;
        this.updateVolumeIcon(volume);
    }

    /**
     * Update volume icon
     */
    updateVolumeIcon(volume) {
        const icon = this.elements.volumeBtn.querySelector('i');
        if (volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    /**
     * Update progress
     */
    updateProgress() {
        const audio = this.elements.audioElement;
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            this.elements.progressBar.value = progress;
            this.elements.currentTime.textContent = this.formatTime(audio.currentTime);
        }
    }

    /**
     * Update duration
     */
    updateDuration() {
        const audio = this.elements.audioElement;
        if (audio.duration) {
            this.elements.totalTime.textContent = this.formatTime(audio.duration);
        }
    }

    /**
     * Format time
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Don't trigger shortcuts when typing in inputs
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

        switch (event.key) {
            case ' ':
                event.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                this.playPrevious();
                break;
            case 'ArrowRight':
                this.playNext();
                break;
            case 'f':
                this.toggleFavorite();
                break;
            case 's':
                this.toggleShuffle();
                break;
            case 'r':
                this.toggleRepeat();
                break;
        }
    }

    /**
     * Render trending tracks
     */
    renderTrendingTracks(tracks) {
        if (!this.elements.trendingTracks) return;

        const html = tracks.slice(0, 5).map((track, index) => `
            <div class="trending-item" data-track='${JSON.stringify(track)}'>
                <div class="trending-rank">${index + 1}</div>
                <div class="trending-info">
                    <div class="trending-title">${this.escapeHtml(track.name)}</div>
                    <div class="trending-artist">${this.escapeHtml(track.artist.name)}</div>
                </div>
                <button class="trending-play-btn" onclick="musicHub.playTrack(${this.escapeHtml(JSON.stringify(track))})">
                    <i class="fas fa-play"></i>
                </button>
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
            <div class="chart-item" data-track='${JSON.stringify(track)}'>
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

        // Setup card click handlers
        this.setupMusicCardHandlers();
    }

    /**
     * Create music card HTML
     */
    createMusicCard(track) {
        const trackId = this.getTrackId(track);
        const isFavorited = this.state.favorites.some(fav => fav.id === trackId);
        const imageUrl = this.getImageUrl(track.image, 'large') || 'assets/default.svg';

        return `
            <div class="music-card" data-track='${JSON.stringify(track)}'>
                <div class="card-image">
                    <img src="${imageUrl}" alt="${this.escapeHtml(track.name)}" loading="lazy">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${this.escapeHtml(track.name)}</h3>
                    <p class="card-artist">${this.escapeHtml(track.artist?.name || track.artist)}</p>
                    <div class="card-actions">
                        <button class="card-favorite ${isFavorited ? 'favorited' : ''}" 
                                onclick="musicHub.toggleTrackFavorite('${trackId}', this)">
                            <i class="${isFavorited ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="card-play-btn" onclick="musicHub.playTrack(${this.escapeHtml(JSON.stringify(track))})">
                            <i class="fas fa-play"></i> Play
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup music card handlers
     */
    setupMusicCardHandlers() {
        document.querySelectorAll('.music-card').forEach(card => {
            card.addEventListener('click', (event) => {
                if (event.target.closest('button')) return; // Don't trigger on button clicks
                
                const trackData = card.getAttribute('data-track');
                if (trackData) {
                    const track = JSON.parse(trackData);
                    this.playTrack(track);
                }
            });
        });
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
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
     * Performance monitoring
     */
    startPerformanceMonitoring() {
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
                    console.warn('High memory usage detected, clearing cache');
                    this.cache.clear();
                }
            }, 60000);
        }

        // Monitor API response times
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const start = performance.now();
            try {
                const response = await originalFetch(...args);
                const duration = performance.now() - start;
                
                if (duration > 5000) {
                    console.warn(`Slow API response: ${duration}ms for ${args[0]}`);
                }
                
                return response;
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        };
    }

    /**
     * Setup intersection observer for lazy loading
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        this.observer.unobserve(img);
                    }
                }
            });
        }, options);
    }

    // Additional methods for complete functionality...
    // (Would continue with more methods for queue management, lyrics, etc.)
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

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.musicHub) {
        window.musicHub.showToast('An unexpected error occurred', 'error');
    }
});