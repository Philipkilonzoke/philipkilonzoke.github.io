class MusicHub {
    constructor() {
        // API Configuration
        this.apiBaseUrl = 'https://itunes.apple.com/search';
        this.corsProxy = 'https://api.allorigins.win/raw?url=';
        
        // DOM Elements
        this.searchInput = document.getElementById('music-search-input');
        this.searchClearBtn = document.getElementById('search-clear-btn');
        this.musicGrid = document.getElementById('music-grid');
        this.trendingGrid = document.getElementById('trending-grid');
        this.chartsGrid = document.getElementById('charts-grid');
        this.releasesGrid = document.getElementById('releases-grid');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorMessage = document.getElementById('error-message');
        this.retryBtn = document.getElementById('retry-btn');
        this.genreTabsContainer = document.getElementById('genre-tabs');
        this.mainSectionTitle = document.getElementById('main-section-title');
        this.resultsCount = document.getElementById('results-count');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.loadMoreContainer = document.querySelector('.load-more-container');

        // Filter Elements
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');

        // Audio Player Elements
        this.playerContainer = document.getElementById('audio-player-container');
        this.audioElement = document.getElementById('audio-element');
        this.playPauseBtn = document.getElementById('player-play-pause-btn');
        this.prevBtn = document.getElementById('player-prev-btn');
        this.nextBtn = document.getElementById('player-next-btn');
        this.shufflePlayerBtn = document.getElementById('player-shuffle-btn');
        this.repeatBtn = document.getElementById('player-repeat-btn');
        this.progressBar = document.getElementById('progress-bar');
        this.currentTimeEl = document.getElementById('current-time');
        this.totalDurationEl = document.getElementById('total-duration');
        this.playerArtwork = document.getElementById('player-artwork');
        this.playerTrackTitle = document.getElementById('player-track-title');
        this.playerArtistName = document.getElementById('player-artist-name');
        this.favoriteBtn = document.getElementById('favorite-btn');
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeBar = document.getElementById('volume-bar');
        this.queueBtn = document.getElementById('queue-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');

        // State Management
        this.currentTrackIndex = -1;
        this.currentPlaylist = [];
        this.allTracks = [];
        this.trendingTracks = [];
        this.chartTracks = [];
        this.releaseTracks = [];
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 'off'; // 'off', 'one', 'all'
        this.currentFilter = 'all';
        this.currentGenre = '';
        this.searchQuery = '';
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.isLoading = false;
        
        // Favorites Management
        this.favorites = this.loadFavorites();
        
        // Search Debounce
        this.searchTimeout = null;
        this.searchDelay = 200;

        // Music Genres
        this.genres = [
            'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'R&B', 
            'Afrobeats', 'Amapiano', 'Dancehall', 'Jazz', 'Country'
        ];

        // Initialize intersection observer for lazy loading
        this.initIntersectionObserver();
    }

    async init() {
        this.setupEventListeners();
        this.renderGenreTabs();
        this.loadInitialContent();
        this.setupVolumeControl();
        this.updateFilterButtons();
    }

    setupEventListeners() {
        // Search functionality with debounce
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
            this.toggleClearButton(e.target.value);
        });

        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.searchInput.value);
            }
        });

        this.searchClearBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });

        // Shuffle button
        this.shuffleBtn.addEventListener('click', () => {
            this.toggleShuffle();
        });

        // Load more button
        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMoreTracks();
        });

        // Retry button
        this.retryBtn.addEventListener('click', () => {
            this.loadInitialContent();
        });

        // Audio Player Controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.shufflePlayerBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.favoriteBtn.addEventListener('click', () => this.toggleCurrentFavorite());
        
        // Audio Element Events
        this.audioElement.addEventListener('timeupdate', () => this.updateProgressBar());
        this.audioElement.addEventListener('ended', () => this.handleTrackEnd());
        this.audioElement.addEventListener('loadedmetadata', () => this.updateTrackDuration());
        this.audioElement.addEventListener('error', () => this.handleAudioError());
        
        // Progress Bar
        this.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
        
        // Volume Controls
        this.volumeBar.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.volumeBtn.addEventListener('click', () => this.toggleMute());

        // Additional Player Controls
        this.fullscreenBtn.addEventListener('click', () => this.togglePlayerSize());
    }

    // Debounced Search Implementation
    handleSearch(query) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, this.searchDelay);
    }

    async performSearch(query) {
        this.searchQuery = query.trim();
        this.currentPage = 1;
        
        if (this.searchQuery) {
            this.mainSectionTitle.innerHTML = `<i class="fas fa-search"></i> Search Results for "${this.searchQuery}"`;
            await this.fetchMusic(this.searchQuery);
        } else {
            this.mainSectionTitle.innerHTML = `<i class="fas fa-music"></i> All Music`;
            this.showAllMusic();
        }
    }

    toggleClearButton(value) {
        this.searchClearBtn.style.display = value ? 'block' : 'none';
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.toggleClearButton('');
        this.mainSectionTitle.innerHTML = `<i class="fas fa-music"></i> All Music`;
        this.showAllMusic();
    }

    // Genre Tab Rendering
    renderGenreTabs() {
        this.genreTabsContainer.innerHTML = '';
        
        this.genres.forEach((genre, index) => {
            const tab = document.createElement('button');
            tab.className = `genre-tab ${index === 0 ? 'active' : ''}`;
            tab.textContent = genre;
            tab.dataset.genre = genre;
            
            tab.addEventListener('click', () => {
                this.selectGenre(genre, tab);
            });
            
            this.genreTabsContainer.appendChild(tab);
        });
    }

    async selectGenre(genre, tabElement) {
        // Update active tab
        this.genreTabsContainer.querySelectorAll('.genre-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        tabElement.classList.add('active');
        
        this.currentGenre = genre;
        this.currentPage = 1;
        this.searchInput.value = '';
        this.searchQuery = '';
        this.toggleClearButton('');
        
        this.mainSectionTitle.innerHTML = `<i class="fas fa-music"></i> ${genre} Music`;
        await this.fetchMusic(genre);
    }

    // Enhanced Filter System
    setFilter(filter) {
        this.currentFilter = filter;
        this.updateFilterButtons();
        this.applyCurrentFilter();
    }

    updateFilterButtons() {
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }

    applyCurrentFilter() {
        let tracksToShow = [];
        
        switch (this.currentFilter) {
            case 'favorites':
                tracksToShow = this.allTracks.filter(track => this.isFavorite(track.trackId));
                this.mainSectionTitle.innerHTML = `<i class="fas fa-heart"></i> My Favorites`;
                break;
            case 'all':
            default:
                tracksToShow = this.allTracks;
                if (!this.searchQuery && !this.currentGenre) {
                    this.mainSectionTitle.innerHTML = `<i class="fas fa-music"></i> All Music`;
                }
                break;
        }
        
        this.renderMusicGrid(tracksToShow, this.musicGrid);
        this.updateResultsCount(tracksToShow.length);
    }

    // API Integration with Error Handling
    async fetchMusic(term, section = 'main') {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading(true);
        
        try {
            const limit = section === 'main' ? this.itemsPerPage * this.currentPage : 10;
            const response = await fetch(`${this.apiBaseUrl}?term=${encodeURIComponent(term)}&entity=song&limit=${limit}&country=US`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const tracks = data.results.filter(track => track.previewUrl && track.artworkUrl100);
            
            if (section === 'main') {
                if (this.currentPage === 1) {
                    this.allTracks = tracks;
                } else {
                    this.allTracks = [...this.allTracks, ...tracks];
                }
                this.applyCurrentFilter();
                this.toggleLoadMoreButton(tracks.length === this.itemsPerPage);
            } else {
                this.handleSectionTracks(section, tracks);
            }
            
            this.showError(false);
            
        } catch (error) {
            console.error('Error fetching music:', error);
            this.showError(true);
        } finally {
            this.isLoading = false;
            this.showLoading(false);
        }
    }

    handleSectionTracks(section, tracks) {
        switch (section) {
            case 'trending':
                this.trendingTracks = tracks;
                this.renderMusicGrid(tracks, this.trendingGrid);
                break;
            case 'charts':
                this.chartTracks = tracks;
                this.renderMusicGrid(tracks, this.chartsGrid);
                break;
            case 'releases':
                this.releaseTracks = tracks;
                this.renderMusicGrid(tracks, this.releasesGrid);
                break;
        }
    }

    async loadInitialContent() {
        // Load different sections with different search terms
        await Promise.all([
            this.fetchMusic('top hits 2024', 'trending'),
            this.fetchMusic('chart music', 'charts'),
            this.fetchMusic('new music 2024', 'releases'),
            this.fetchMusic('popular music', 'main')
        ]);
    }

    async loadMoreTracks() {
        if (this.isLoading) return;
        
        this.currentPage++;
        const term = this.searchQuery || this.currentGenre || 'popular music';
        await this.fetchMusic(term);
    }

    showAllMusic() {
        this.applyCurrentFilter();
    }

    // Enhanced Music Grid Rendering
    renderMusicGrid(tracks, container) {
        if (!container) return;
        
        if (tracks.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-music-slash"></i>
                    <h3>No tracks found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        tracks.forEach((track, index) => {
            const card = this.createMusicCard(track, index);
            container.appendChild(card);
        });
        
        if (container === this.musicGrid) {
            this.updateResultsCount(tracks.length);
        }
    }

    createMusicCard(track, index) {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.dataset.trackId = track.trackId;
        card.dataset.index = index;

        const artworkUrl = track.artworkUrl100.replace('100x100', '600x600');
        const isFav = this.isFavorite(track.trackId);

        card.innerHTML = `
            <div class="card-image">
                <img src="${artworkUrl}" alt="${this.escapeHtml(track.trackName)}" loading="lazy" onerror="this.src='assets/default.svg'">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="card-content">
                <div class="card-title">${this.escapeHtml(track.trackName)}</div>
                <div class="card-artist">${this.escapeHtml(track.artistName)}</div>
                <div class="card-actions">
                    <button class="card-favorite ${isFav ? 'favorited' : ''}" data-track-id="${track.trackId}">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <a href="${track.trackViewUrl}" target="_blank" class="card-link" rel="noopener noreferrer">
                        <i class="fab fa-apple"></i> View
                    </a>
                </div>
            </div>
        `;

        // Event listeners
        const playOverlay = card.querySelector('.play-overlay');
        const favoriteBtn = card.querySelector('.card-favorite');

        playOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playTrack(track, this.getAllTracksFromCurrentView());
        });

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-favorite') && !e.target.closest('.card-link')) {
                this.playTrack(track, this.getAllTracksFromCurrentView());
            }
        });

        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(track);
        });

        return card;
    }

    getAllTracksFromCurrentView() {
        switch (this.currentFilter) {
            case 'favorites':
                return this.allTracks.filter(track => this.isFavorite(track.trackId));
            default:
                return this.allTracks;
        }
    }

    // Enhanced Audio Player
    async playTrack(track, playlist = null) {
        if (playlist) {
            this.currentPlaylist = playlist;
            this.currentTrackIndex = playlist.findIndex(t => t.trackId === track.trackId);
        } else {
            this.currentPlaylist = [track];
            this.currentTrackIndex = 0;
        }

        const currentTrack = this.currentPlaylist[this.currentTrackIndex];
        
        // Update player UI
        this.playerArtwork.src = currentTrack.artworkUrl100.replace('100x100', '600x600');
        this.playerTrackTitle.textContent = currentTrack.trackName;
        this.playerArtistName.textContent = currentTrack.artistName;
        
        // Update favorite button
        this.updatePlayerFavoriteButton(currentTrack.trackId);
        
        // Load and play audio
        this.audioElement.src = currentTrack.previewUrl;
        
        try {
            await this.audioElement.play();
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.playerContainer.classList.add('active');
            
            // Update visual indicators
            this.updateNowPlayingVisuals();
            
        } catch (error) {
            console.error('Error playing track:', error);
            this.handleAudioError();
        }
    }

    togglePlayPause() {
        if (this.currentTrackIndex === -1) {
            // Start playing the first track if none is selected
            if (this.allTracks.length > 0) {
                this.playTrack(this.allTracks[0], this.allTracks);
            }
            return;
        }

        if (this.isPlaying) {
            this.audioElement.pause();
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.audioElement.play().catch(error => {
                console.error('Error resuming playback:', error);
                this.handleAudioError();
            });
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        
        this.isPlaying = !this.isPlaying;
    }

    playNext() {
        if (this.currentPlaylist.length === 0) return;
        
        let nextIndex;
        
        if (this.isShuffled) {
            nextIndex = Math.floor(Math.random() * this.currentPlaylist.length);
        } else {
            nextIndex = (this.currentTrackIndex + 1) % this.currentPlaylist.length;
        }
        
        this.currentTrackIndex = nextIndex;
        this.playTrack(this.currentPlaylist[this.currentTrackIndex]);
    }

    playPrevious() {
        if (this.currentPlaylist.length === 0) return;
        
        let prevIndex;
        
        if (this.isShuffled) {
            prevIndex = Math.floor(Math.random() * this.currentPlaylist.length);
        } else {
            prevIndex = (this.currentTrackIndex - 1 + this.currentPlaylist.length) % this.currentPlaylist.length;
        }
        
        this.currentTrackIndex = prevIndex;
        this.playTrack(this.currentPlaylist[this.currentTrackIndex]);
    }

    handleTrackEnd() {
        switch (this.repeatMode) {
            case 'one':
                this.audioElement.currentTime = 0;
                this.audioElement.play();
                break;
            case 'all':
                this.playNext();
                break;
            default:
                if (this.currentTrackIndex < this.currentPlaylist.length - 1) {
                    this.playNext();
                } else {
                    this.isPlaying = false;
                    this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
                break;
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('active', this.isShuffled);
        this.shufflePlayerBtn.classList.toggle('active', this.isShuffled);
        
        // Show feedback
        this.showToast(this.isShuffled ? 'Shuffle enabled' : 'Shuffle disabled');
    }

    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        this.repeatMode = modes[nextIndex];
        
        // Update button appearance
        this.repeatBtn.classList.toggle('active', this.repeatMode !== 'off');
        
        // Update icon based on mode
        const icon = this.repeatBtn.querySelector('i');
        switch (this.repeatMode) {
            case 'one':
                icon.className = 'fas fa-redo-alt';
                this.repeatBtn.style.position = 'relative';
                this.repeatBtn.setAttribute('data-mode', '1');
                break;
            case 'all':
                icon.className = 'fas fa-redo';
                this.repeatBtn.removeAttribute('data-mode');
                break;
            default:
                icon.className = 'fas fa-redo';
                this.repeatBtn.removeAttribute('data-mode');
                break;
        }
        
        this.showToast(`Repeat ${this.repeatMode === 'off' ? 'disabled' : this.repeatMode}`);
    }

    // Volume and Progress Controls
    setupVolumeControl() {
        this.audioElement.volume = 0.5;
        this.volumeBar.value = 50;
    }

    setVolume(value) {
        const volume = value / 100;
        this.audioElement.volume = volume;
        
        // Update volume icon
        const icon = this.volumeBtn.querySelector('i');
        if (volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    toggleMute() {
        if (this.audioElement.volume > 0) {
            this.audioElement.dataset.prevVolume = this.audioElement.volume;
            this.audioElement.volume = 0;
            this.volumeBar.value = 0;
            this.volumeBtn.querySelector('i').className = 'fas fa-volume-mute';
        } else {
            const prevVolume = parseFloat(this.audioElement.dataset.prevVolume) || 0.5;
            this.audioElement.volume = prevVolume;
            this.volumeBar.value = prevVolume * 100;
            this.setVolume(prevVolume * 100);
        }
    }

    updateProgressBar() {
        const { duration, currentTime } = this.audioElement;
        if (duration && !isNaN(duration)) {
            const progress = (currentTime / duration) * 100;
            this.progressBar.value = progress;
            this.currentTimeEl.textContent = this.formatTime(currentTime);
        }
    }

    updateTrackDuration() {
        const { duration } = this.audioElement;
        if (duration && !isNaN(duration)) {
            this.totalDurationEl.textContent = this.formatTime(duration);
        }
    }

    seek(value) {
        const { duration } = this.audioElement;
        if (duration && !isNaN(duration)) {
            this.audioElement.currentTime = (value / 100) * duration;
        }
    }

    // Favorites Management with localStorage
    loadFavorites() {
        try {
            const saved = localStorage.getItem('musicHubFavorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('musicHubFavorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    isFavorite(trackId) {
        return this.favorites.includes(trackId);
    }

    toggleFavorite(track) {
        const trackId = track.trackId;
        const index = this.favorites.indexOf(trackId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('Removed from favorites');
        } else {
            this.favorites.push(trackId);
            this.showToast('Added to favorites');
        }
        
        this.saveFavorites();
        this.updateFavoriteButton(trackId);
        
        // Update player favorite button if this is the current track
        if (this.currentPlaylist[this.currentTrackIndex]?.trackId === trackId) {
            this.updatePlayerFavoriteButton(trackId);
        }
        
        // Refresh display if showing favorites
        if (this.currentFilter === 'favorites') {
            this.applyCurrentFilter();
        }
    }

    toggleCurrentFavorite() {
        if (this.currentTrackIndex >= 0 && this.currentPlaylist[this.currentTrackIndex]) {
            this.toggleFavorite(this.currentPlaylist[this.currentTrackIndex]);
        }
    }

    updateFavoriteButton(trackId) {
        const card = document.querySelector(`[data-track-id="${trackId}"]`);
        if (card) {
            const favoriteBtn = card.querySelector('.card-favorite');
            const icon = favoriteBtn.querySelector('i');
            const isFav = this.isFavorite(trackId);
            
            favoriteBtn.classList.toggle('favorited', isFav);
            icon.className = isFav ? 'fas fa-heart' : 'far fa-heart';
        }
    }

    updatePlayerFavoriteButton(trackId) {
        const isFav = this.isFavorite(trackId);
        this.favoriteBtn.classList.toggle('favorited', isFav);
        this.favoriteBtn.querySelector('i').className = isFav ? 'fas fa-heart' : 'far fa-heart';
    }

    // UI State Management
    showLoading(show) {
        this.loadingIndicator.style.display = show ? 'flex' : 'none';
    }

    showError(show) {
        this.errorMessage.style.display = show ? 'block' : 'none';
    }

    updateResultsCount(count) {
        this.resultsCount.textContent = `${count} tracks`;
    }

    toggleLoadMoreButton(show) {
        this.loadMoreContainer.style.display = show ? 'block' : 'none';
    }

    updateNowPlayingVisuals() {
        // Remove previous now-playing indicators
        document.querySelectorAll('.music-card.now-playing').forEach(card => {
            card.classList.remove('now-playing');
        });
        
        // Add to current track
        const currentTrack = this.currentPlaylist[this.currentTrackIndex];
        if (currentTrack) {
            const card = document.querySelector(`[data-track-id="${currentTrack.trackId}"]`);
            if (card) {
                card.classList.add('now-playing');
            }
        }
    }

    togglePlayerSize() {
        this.playerContainer.classList.toggle('minimized');
        const icon = this.fullscreenBtn.querySelector('i');
        icon.className = this.playerContainer.classList.contains('minimized') 
            ? 'fas fa-expand' 
            : 'fas fa-compress';
    }

    handleAudioError() {
        console.error('Audio playback error');
        this.showToast('Error playing track');
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    // Intersection Observer for Lazy Loading
    initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            this.imageObserver.unobserve(img);
                        }
                    }
                });
            });
        }
    }

    // Utility Functions
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize Music Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const musicHub = new MusicHub();
    musicHub.init();

    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800);
    }
    
    // Global reference for debugging
    window.musicHub = musicHub;
});