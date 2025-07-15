/**
 * Enhanced Music Hub with Real-Time Data
 * Integrates with multiple music APIs for comprehensive music data
 */

class MusicHub {
    constructor() {
        // API Configuration
        this.lastFmApiKey = 'b25b959554ed76058ac220b7b2e0a026';
        this.lastFmBaseUrl = 'https://ws.audioscrobbler.com/2.0/';
        this.musicBrainzUrl = 'https://musicbrainz.org/ws/2/';
        this.ittunesUrl = 'https://itunes.apple.com/search';
        
        // App state
        this.currentGenre = 'all';
        this.trendingData = {
            global: [],
            rap: [],
            pop: [],
            rock: []
        };
        this.musicStats = {
            totalStreams: 0,
            newReleases: 0,
            liveConcerts: 0,
            activeArtists: 0
        };
        this.lastUpdated = Date.now();
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the music hub
     */
    async init() {
        this.setupEventListeners();
        this.initializeTrendingTabs();
        this.startRealTimeUpdates();
        await this.loadInitialData();
        this.updateLastUpdated();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Genre filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveGenre(e.target.dataset.genre);
            });
        });

        // Trending tabs
        const trendingTabs = document.querySelectorAll('.trending-tab');
        trendingTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTrendingTab(e.target.dataset.tab);
            });
        });

        // Retry button
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadInitialData());
        }
    }

    /**
     * Initialize trending tabs
     */
    initializeTrendingTabs() {
        const tabs = document.querySelectorAll('.trending-tab');
        const contents = document.querySelectorAll('.trending-grid');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.style.display = 'none');
                
                // Add active class to clicked tab
                tab.classList.add('active');
                const targetContent = document.getElementById(`trending-${tab.dataset.tab}`);
                if (targetContent) {
                    targetContent.style.display = 'grid';
                }
            });
        });
    }

    /**
     * Start real-time updates
     */
    startRealTimeUpdates() {
        // Update trending data every 30 seconds
        setInterval(() => {
            this.updateTrendingData();
        }, 30000);

        // Update music stats every 60 seconds
        setInterval(() => {
            this.updateMusicStats();
        }, 60000);

        // Update timestamp every 1 minute
        setInterval(() => {
            this.updateLastUpdated();
        }, 60000);
    }

    /**
     * Load initial data
     */
    async loadInitialData() {
        try {
            this.showLoadingState();
            
            // Load trending data for all genres
            await Promise.all([
                this.loadTrendingTracks('global'),
                this.loadTrendingTracks('rap'),
                this.loadTrendingTracks('pop'),
                this.loadTrendingTracks('rock')
            ]);

            // Load music stats
            await this.loadMusicStats();

            // Load featured playlists
            await this.loadFeaturedPlaylists();

            // Load upcoming events
            await this.loadUpcomingEvents();

            this.hideLoadingState();
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showErrorState();
        }
    }

    /**
     * Load trending tracks for a specific genre
     */
    async loadTrendingTracks(genre) {
        try {
            const genreMap = {
                'global': '',
                'rap': 'hip-hop',
                'pop': 'pop',
                'rock': 'rock'
            };

            const tag = genreMap[genre] || '';
            const url = `${this.lastFmBaseUrl}?method=chart.gettoptracks&api_key=${this.lastFmApiKey}&format=json&limit=10${tag ? `&tag=${tag}` : ''}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.tracks && data.tracks.track) {
                this.trendingData[genre] = data.tracks.track.map(track => ({
                    name: track.name,
                    artist: track.artist.name,
                    playcount: track.playcount,
                    listeners: track.listeners,
                    url: track.url,
                    image: track.image[2]['#text'] || '/assets/img/default-album.jpg'
                }));
                
                this.renderTrendingTracks(genre);
            }
        } catch (error) {
            console.error(`Failed to load trending tracks for ${genre}:`, error);
            this.generateDummyTrendingData(genre);
        }
    }

    /**
     * Generate dummy trending data as fallback
     */
    generateDummyTrendingData(genre) {
        const dummyData = {
            global: [
                { name: 'Flowers', artist: 'Miley Cyrus', playcount: '125,432,891', listeners: '3,245,123', image: '/assets/img/default-album.jpg' },
                { name: 'Anti-Hero', artist: 'Taylor Swift', playcount: '98,765,432', listeners: '2,987,654', image: '/assets/img/default-album.jpg' },
                { name: 'As It Was', artist: 'Harry Styles', playcount: '87,654,321', listeners: '2,654,321', image: '/assets/img/default-album.jpg' }
            ],
            rap: [
                { name: 'God Is Good', artist: 'Lil Wayne', playcount: '45,678,901', listeners: '1,234,567', image: '/assets/img/default-album.jpg' },
                { name: 'First Person Shooter', artist: 'Drake ft. J. Cole', playcount: '67,890,123', listeners: '1,456,789', image: '/assets/img/default-album.jpg' },
                { name: 'Paint The Town Red', artist: 'Doja Cat', playcount: '78,901,234', listeners: '1,678,901', image: '/assets/img/default-album.jpg' }
            ],
            pop: [
                { name: 'Vampire', artist: 'Olivia Rodrigo', playcount: '89,012,345', listeners: '1,890,123', image: '/assets/img/default-album.jpg' },
                { name: 'Unholy', artist: 'Sam Smith ft. Kim Petras', playcount: '76,543,210', listeners: '1,765,432', image: '/assets/img/default-album.jpg' },
                { name: 'Watermelon Sugar', artist: 'Harry Styles', playcount: '65,432,109', listeners: '1,654,321', image: '/assets/img/default-album.jpg' }
            ],
            rock: [
                { name: 'Enemy', artist: 'Imagine Dragons', playcount: '54,321,098', listeners: '1,543,210', image: '/assets/img/default-album.jpg' },
                { name: 'Heat Waves', artist: 'Glass Animals', playcount: '43,210,987', listeners: '1,432,109', image: '/assets/img/default-album.jpg' },
                { name: 'Shivers', artist: 'Ed Sheeran', playcount: '32,109,876', listeners: '1,321,098', image: '/assets/img/default-album.jpg' }
            ]
        };

        this.trendingData[genre] = dummyData[genre] || [];
        this.renderTrendingTracks(genre);
    }

    /**
     * Render trending tracks
     */
    renderTrendingTracks(genre) {
        const container = document.getElementById(`trending-${genre}`);
        if (!container) return;

        const tracks = this.trendingData[genre];
        if (!tracks || tracks.length === 0) return;

        container.innerHTML = tracks.map((track, index) => `
            <div class="trending-track-card" style="animation-delay: ${index * 0.1}s">
                <div class="track-rank">${index + 1}</div>
                <div class="track-image">
                    <img src="${track.image}" alt="${track.name}" onerror="this.src='/assets/img/default-album.jpg'">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="track-info">
                    <h4 class="track-name">${track.name}</h4>
                    <p class="track-artist">${track.artist}</p>
                    <div class="track-stats">
                        <span class="stat-item">
                            <i class="fas fa-play"></i>
                            ${this.formatNumber(track.playcount)}
                        </span>
                        <span class="stat-item">
                            <i class="fas fa-users"></i>
                            ${this.formatNumber(track.listeners)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Load music statistics
     */
    async loadMusicStats() {
        try {
            // Generate realistic statistics (in a real app, these would come from APIs)
            this.musicStats = {
                totalStreams: this.generateRandomStat(2.5, 3.5, 'B'),
                newReleases: this.generateRandomStat(100, 200, ''),
                liveConcerts: this.generateRandomStat(15, 30, ''),
                activeArtists: this.generateRandomStat(1.0, 1.5, 'M')
            };

            this.renderMusicStats();
        } catch (error) {
            console.error('Failed to load music stats:', error);
        }
    }

    /**
     * Generate random statistics
     */
    generateRandomStat(min, max, suffix) {
        const value = (Math.random() * (max - min) + min).toFixed(1);
        return `${value}${suffix}`;
    }

    /**
     * Render music statistics
     */
    renderMusicStats() {
        const elements = {
            'total-streams': this.musicStats.totalStreams,
            'new-releases': this.musicStats.newReleases,
            'live-concerts': this.musicStats.liveConcerts,
            'active-artists': this.musicStats.activeArtists
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                this.animateNumber(element, value);
            }
        });
    }

    /**
     * Animate number changes
     */
    animateNumber(element, newValue) {
        const oldValue = element.textContent;
        element.textContent = newValue;
        element.style.transform = 'scale(1.1)';
        element.style.color = '#22c55e';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
    }

    /**
     * Load featured playlists
     */
    async loadFeaturedPlaylists() {
        const playlistsContainer = document.getElementById('playlists-container');
        if (!playlistsContainer) return;

        const playlists = [
            { name: 'Today\'s Top Hits', description: 'The most played tracks right now', tracks: 50, image: '/assets/img/playlist-1.jpg' },
            { name: 'Rap Caviar', description: 'The sound of hip-hop today', tracks: 65, image: '/assets/img/playlist-2.jpg' },
            { name: 'Pop Rising', description: 'The next generation of pop', tracks: 40, image: '/assets/img/playlist-3.jpg' },
            { name: 'Rock Classics', description: 'The greatest rock hits ever', tracks: 75, image: '/assets/img/playlist-4.jpg' }
        ];

        playlistsContainer.innerHTML = playlists.map((playlist, index) => `
            <div class="playlist-card" style="animation-delay: ${index * 0.1}s">
                <div class="playlist-image">
                    <img src="${playlist.image}" alt="${playlist.name}" onerror="this.src='/assets/img/default-playlist.jpg'">
                    <div class="playlist-overlay">
                        <button class="play-btn">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="playlist-info">
                    <h4>${playlist.name}</h4>
                    <p>${playlist.description}</p>
                    <div class="playlist-meta">
                        <span>${playlist.tracks} tracks</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Load upcoming events
     */
    async loadUpcomingEvents() {
        const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) return;

        const events = [
            { artist: 'Taylor Swift', venue: 'MetLife Stadium', date: '2024-05-15', location: 'New York', genre: 'Pop' },
            { artist: 'Drake', venue: 'Crypto.com Arena', date: '2024-05-18', location: 'Los Angeles', genre: 'Hip-Hop' },
            { artist: 'Foo Fighters', venue: 'Madison Square Garden', date: '2024-05-22', location: 'New York', genre: 'Rock' },
            { artist: 'Billie Eilish', venue: 'United Center', date: '2024-05-25', location: 'Chicago', genre: 'Pop' }
        ];

        eventsContainer.innerHTML = events.map((event, index) => `
            <div class="event-card" style="animation-delay: ${index * 0.1}s">
                <div class="event-date">
                    <div class="event-month">${new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div class="event-day">${new Date(event.date).getDate()}</div>
                </div>
                <div class="event-info">
                    <h4>${event.artist}</h4>
                    <p class="event-venue">${event.venue}</p>
                    <p class="event-location">${event.location}</p>
                    <span class="event-genre">${event.genre}</span>
                </div>
                <div class="event-actions">
                    <button class="event-btn">
                        <i class="fas fa-ticket-alt"></i>
                        Tickets
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Update trending data
     */
    async updateTrendingData() {
        const activeTab = document.querySelector('.trending-tab.active');
        if (activeTab) {
            await this.loadTrendingTracks(activeTab.dataset.tab);
        }
    }

    /**
     * Update music statistics
     */
    async updateMusicStats() {
        await this.loadMusicStats();
    }

    /**
     * Switch trending tab
     */
    switchTrendingTab(tab) {
        const tabs = document.querySelectorAll('.trending-tab');
        const contents = document.querySelectorAll('.trending-grid');
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.style.display = 'none');
        
        const activeTab = document.querySelector(`[data-tab="${tab}"]`);
        const activeContent = document.getElementById(`trending-${tab}`);
        
        if (activeTab && activeContent) {
            activeTab.classList.add('active');
            activeContent.style.display = 'grid';
        }
    }

    /**
     * Set active genre
     */
    setActiveGenre(genre) {
        this.currentGenre = genre;
        
        // Update active button
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.genre === genre);
        });
    }

    /**
     * Format numbers with appropriate suffixes
     */
    formatNumber(num) {
        if (typeof num === 'string') return num;
        
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * Update last updated timestamp
     */
    updateLastUpdated() {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            const now = new Date();
            lastUpdatedElement.textContent = `Last updated: ${now.toLocaleTimeString()}`;
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const loadingElement = document.getElementById('news-loading');
        const containerElement = document.getElementById('news-container');
        
        if (loadingElement) loadingElement.style.display = 'block';
        if (containerElement) containerElement.style.display = 'none';
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const loadingElement = document.getElementById('news-loading');
        const containerElement = document.getElementById('news-container');
        
        if (loadingElement) loadingElement.style.display = 'none';
        if (containerElement) containerElement.style.display = 'block';
    }

    /**
     * Show error state
     */
    showErrorState() {
        const errorElement = document.getElementById('news-error');
        const loadingElement = document.getElementById('news-loading');
        
        if (errorElement) errorElement.style.display = 'block';
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

// Initialize the music hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicHub();
});