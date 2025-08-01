class MusicPlayer {
    constructor() {
        // API
        this.apiBaseUrl = 'https://itunes.apple.com/search';

        // DOM Elements
        this.searchInput = document.getElementById('music-search-input');
        this.musicGrid = document.getElementById('music-grid');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorMessage = document.getElementById('error-message');
        this.genreTabsContainer = document.getElementById('genre-tabs');

        // Audio Player Elements
        this.playerContainer = document.getElementById('audio-player-container');
        this.audioElement = document.getElementById('audio-element');
        this.playPauseBtn = document.getElementById('player-play-pause-btn');
        this.prevBtn = document.getElementById('player-prev-btn');
        this.nextBtn = document.getElementById('player-next-btn');
        this.progressBar = document.getElementById('progress-bar');
        this.currentTimeEl = document.getElementById('current-time');
        this.totalDurationEl = document.getElementById('total-duration');
        this.playerArtwork = document.getElementById('player-artwork');
        this.playerTrackTitle = document.getElementById('player-track-title');
        this.playerArtistName = document.getElementById('player-artist-name');

        // State
        this.currentTrackIndex = -1;
        this.currentPlaylist = [];
        this.isPlaying = false;

        // Genres for tabs
        this.genres = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Afrobeats', 'Amapiano', 'Dancehall'];
    }

    init() {
        this.setupEventListeners();
        this.renderGenreTabs();
        // Load initial music
        this.fetchMusic('latest hits');
    }

    setupEventListeners() {
        // Search
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.fetchMusic(this.searchInput.value);
            }
        });

        // Audio Player
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.nextBtn.addEventListener('click', () => this.playNextTrack());
        this.prevBtn.addEventListener('click', () => this.playPrevTrack());
        this.audioElement.addEventListener('timeupdate', () => this.updateProgressBar());
        this.audioElement.addEventListener('ended', () => this.playNextTrack());
        this.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
    }

    renderGenreTabs() {
        this.genres.forEach(genre => {
            const tab = document.createElement('button');
            tab.className = 'genre-tab';
            tab.textContent = genre;
            tab.dataset.genre = genre;
            tab.addEventListener('click', () => {
                this.fetchMusic(genre);
                // Active state styling
                this.genreTabsContainer.querySelector('.active')?.classList.remove('active');
                tab.classList.add('active');
            });
            this.genreTabsContainer.appendChild(tab);
        });
        // Set first tab as active initially
        this.genreTabsContainer.firstChild.classList.add('active');
    }

    async fetchMusic(term) {
        this.showLoading(true);
        this.musicGrid.innerHTML = '';
        try {
            const response = await fetch(`${this.apiBaseUrl}?term=${encodeURIComponent(term)}&entity=song&limit=50`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            this.currentPlaylist = data.results.filter(track => track.previewUrl); // Only include tracks with previews
            this.renderMusicGrid();
        } catch (error) {
            console.error('Error fetching music:', error);
            this.showError(true);
        } finally {
            this.showLoading(false);
        }
    }

    renderMusicGrid() {
        this.musicGrid.innerHTML = '';
        if (this.currentPlaylist.length === 0) {
            this.musicGrid.innerHTML = '<p class="no-results">No songs found. Try a different search.</p>';
            return;
        }
        this.currentPlaylist.forEach((track, index) => {
            const card = this.createSongCard(track, index);
            this.musicGrid.appendChild(card);
        });
    }

    createSongCard(track, index) {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.dataset.index = index;

        const artworkUrl = track.artworkUrl100.replace('100x100', '400x400');

        card.innerHTML = `
            <div class="card-image">
                <img src="${artworkUrl}" alt="${track.trackName}" loading="lazy">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="card-content">
                <div class="card-title">${track.trackName}</div>
                <div class="card-artist">${track.artistName}</div>
                <a href="${track.trackViewUrl}" target="_blank" class="card-link">View on Apple Music</a>
            </div>
        `;

        card.addEventListener('click', () => {
            this.playTrack(index);
        });

        return card;
    }

    playTrack(index) {
        this.currentTrackIndex = index;
        const track = this.currentPlaylist[this.currentTrackIndex];

        this.playerArtwork.src = track.artworkUrl100.replace('100x100', '400x400');
        this.playerTrackTitle.textContent = track.trackName;
        this.playerArtistName.textContent = track.artistName;
        this.audioElement.src = track.previewUrl;

        this.audioElement.play();
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.playerContainer.classList.add('active');
    }

    togglePlayPause() {
        if (this.currentTrackIndex === -1) return;

        if (this.isPlaying) {
            this.audioElement.pause();
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.audioElement.play();
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        this.isPlaying = !this.isPlaying;
    }

    playNextTrack() {
        if (this.currentPlaylist.length === 0) return;
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.currentPlaylist.length;
        this.playTrack(this.currentTrackIndex);
    }

    playPrevTrack() {
        if (this.currentPlaylist.length === 0) return;
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.currentPlaylist.length) % this.currentPlaylist.length;
        this.playTrack(this.currentTrackIndex);
    }

    updateProgressBar() {
        const { duration, currentTime } = this.audioElement;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            this.progressBar.value = progressPercent;
            this.currentTimeEl.textContent = this.formatTime(currentTime);
            this.totalDurationEl.textContent = this.formatTime(duration);
        }
    }

    seek(value) {
        const { duration } = this.audioElement;
        if (duration) {
            this.audioElement.currentTime = (value / 100) * duration;
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    showLoading(isLoading) {
        this.loadingIndicator.style.display = isLoading ? 'flex' : 'none';
    }

    showError(hasError) {
        this.errorMessage.style.display = hasError ? 'block' : 'none';
    }
}

// Initialize the music player when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const musicPlayer = new MusicPlayer();
    musicPlayer.init();

    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
});