/**
 * Enhanced Music API Manager for Real-Time Music Data
 * Integrates with multiple music streaming services and provides real-time updates
 */

class MusicDataManager {
    constructor() {
        // Multiple API endpoints for redundancy
        this.spotifyConfig = {
            clientId: 'your_spotify_client_id', // Replace with actual client ID
            clientSecret: 'your_spotify_client_secret', // Replace with actual client secret
            baseUrl: 'https://api.spotify.com/v1',
            tokenUrl: 'https://accounts.spotify.com/api/token'
        };
        
        this.musicNewsAPI = {
            baseUrl: 'https://musicapi.com/api/v1', // Alternative music API
            key: 'your_api_key'
        };
        
        // Last.fm for music trends and charts
        this.lastFmConfig = {
            baseUrl: 'http://ws.audioscrobbler.com/2.0/',
            apiKey: '87a9a1be65c44e3d87a9a1be65c44e3d' // Public demo key
        };
        
        // iTunes API for music data
        this.itunesConfig = {
            baseUrl: 'https://itunes.apple.com',
            searchUrl: 'https://itunes.apple.com/search'
        };
        
        // Cache for performance
        this.cache = new Map();
        this.cacheTimeout = 300000; // 5 minutes
        
        // Real-time update settings
        this.updateInterval = 60000; // 1 minute
        this.intervalId = null;
        
        this.init();
    }
    
    async init() {
        try {
            await this.authenticate();
            this.startRealTimeUpdates();
            this.displayMusicData();
        } catch (error) {
            console.error('Music API initialization failed:', error);
            this.fallbackToStaticData();
        }
    }
    
    /**
     * Authenticate with Spotify API using Client Credentials flow
     */
    async authenticate() {
        try {
            const response = await fetch(this.spotifyConfig.tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(this.spotifyConfig.clientId + ':' + this.spotifyConfig.clientSecret)
                },
                body: 'grant_type=client_credentials'
            });
            
            if (response.ok) {
                const data = await response.json();
                this.accessToken = data.access_token;
                
                // Schedule token refresh
                setTimeout(() => this.authenticate(), (data.expires_in - 300) * 1000);
                
                console.log('Spotify API authenticated successfully');
                return true;
            }
        } catch (error) {
            console.warn('Spotify authentication failed, using alternative sources');
        }
        return false;
    }
    
    /**
     * Get trending tracks from multiple sources
     */
    async getTrendingTracks() {
        const cacheKey = 'trending_tracks';
        const cached = this.getFromCache(cacheKey);
        
        if (cached) return cached;
        
        try {
            // Try multiple sources for better data coverage
            const [spotifyTrending, lastFmTrending, itunesTrending] = await Promise.allSettled([
                this.getSpotifyTrending(),
                this.getLastFmTopTracks(),
                this.getItunesTrending()
            ]);
            
            const combinedData = this.combineTrendingData(
                spotifyTrending.value || [],
                lastFmTrending.value || [],
                itunesTrending.value || []
            );
            
            this.setCache(cacheKey, combinedData);
            return combinedData;
            
        } catch (error) {
            console.error('Error fetching trending tracks:', error);
            return this.getFallbackTrendingData();
        }
    }
    
    /**
     * Get trending tracks from Spotify
     */
    async getSpotifyTrending() {
        if (!this.accessToken) return [];
        
        try {
            // Get featured playlists which often contain trending music
            const response = await fetch(`${this.spotifyConfig.baseUrl}/browse/featured-playlists?limit=5`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            
            if (!response.ok) throw new Error('Spotify API error');
            
            const data = await response.json();
            const tracks = [];
            
            // Get tracks from first featured playlist
            if (data.playlists?.items?.length > 0) {
                const playlistId = data.playlists.items[0].id;
                const tracksResponse = await fetch(`${this.spotifyConfig.baseUrl}/playlists/${playlistId}/tracks?limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                });
                
                if (tracksResponse.ok) {
                    const tracksData = await tracksResponse.json();
                    tracksData.items?.forEach(item => {
                        if (item.track) {
                            tracks.push({
                                title: item.track.name,
                                artist: item.track.artists?.[0]?.name || 'Unknown Artist',
                                album: item.track.album?.name || '',
                                image: item.track.album?.images?.[1]?.url || '',
                                preview_url: item.track.preview_url,
                                external_url: item.track.external_urls?.spotify || '',
                                popularity: item.track.popularity || 0,
                                source: 'Spotify'
                            });
                        }
                    });
                }
            }
            
            return tracks;
        } catch (error) {
            console.error('Spotify trending error:', error);
            return [];
        }
    }
    
    /**
     * Get top tracks from Last.fm
     */
    async getLastFmTopTracks() {
        try {
            const response = await fetch(
                `${this.lastFmConfig.baseUrl}?method=chart.gettoptracks&api_key=${this.lastFmConfig.apiKey}&format=json&limit=10`
            );
            
            if (!response.ok) throw new Error('Last.fm API error');
            
            const data = await response.json();
            const tracks = [];
            
            data.tracks?.track?.forEach(track => {
                tracks.push({
                    title: track.name,
                    artist: track.artist?.name || 'Unknown Artist',
                    album: '',
                    image: track.image?.find(img => img.size === 'medium')?.['#text'] || '',
                    preview_url: '',
                    external_url: track.url || '',
                    popularity: parseInt(track.playcount) || 0,
                    source: 'Last.fm'
                });
            });
            
            return tracks;
        } catch (error) {
            console.error('Last.fm error:', error);
            return [];
        }
    }
    
    /**
     * Get trending from iTunes
     */
    async getItunesTrending() {
        try {
            const response = await fetch(
                `${this.itunesConfig.searchUrl}?term=trending&media=music&entity=song&limit=10`
            );
            
            if (!response.ok) throw new Error('iTunes API error');
            
            const data = await response.json();
            const tracks = [];
            
            data.results?.forEach(track => {
                tracks.push({
                    title: track.trackName,
                    artist: track.artistName || 'Unknown Artist',
                    album: track.collectionName || '',
                    image: track.artworkUrl100 || '',
                    preview_url: track.previewUrl || '',
                    external_url: track.trackViewUrl || '',
                    popularity: 50, // iTunes doesn't provide popularity scores
                    source: 'iTunes'
                });
            });
            
            return tracks;
        } catch (error) {
            console.error('iTunes error:', error);
            return [];
        }
    }
    
    /**
     * Combine trending data from multiple sources
     */
    combineTrendingData(spotify, lastfm, itunes) {
        const allTracks = [...spotify, ...lastfm, ...itunes];
        
        // Remove duplicates and sort by popularity
        const uniqueTracks = allTracks.reduce((acc, track) => {
            const key = `${track.title.toLowerCase()}-${track.artist.toLowerCase()}`;
            if (!acc.has(key) || acc.get(key).popularity < track.popularity) {
                acc.set(key, track);
            }
            return acc;
        }, new Map());
        
        return Array.from(uniqueTracks.values())
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 12);
    }
    
    /**
     * Get music news from multiple sources
     */
    async getMusicNews() {
        const cacheKey = 'music_news';
        const cached = this.getFromCache(cacheKey);
        
        if (cached) return cached;
        
        try {
            // Simulate music news API call
            const newsData = await this.fetchMusicNews();
            this.setCache(cacheKey, newsData);
            return newsData;
        } catch (error) {
            console.error('Error fetching music news:', error);
            return this.getFallbackNewsData();
        }
    }
    
    /**
     * Fetch music news from various sources
     */
    async fetchMusicNews() {
        // In a real implementation, you would call actual news APIs
        // For demo purposes, we'll return simulated data
        return [
            {
                title: "New Album Releases Dominate Streaming Charts",
                summary: "Latest releases from top artists are breaking streaming records worldwide.",
                category: "Releases",
                timestamp: new Date().toISOString(),
                source: "Music Industry Weekly"
            },
            {
                title: "Grammy Nominations Announced",
                summary: "The Recording Academy reveals this year's Grammy nominees across all categories.",
                category: "Awards",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                source: "Entertainment Today"
            },
            {
                title: "Vinyl Sales Reach New Heights",
                summary: "Physical music sales continue to grow as vinyl popularity surges among younger audiences.",
                category: "Industry",
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                source: "Billboard"
            }
        ];
    }
    
    /**
     * Get artist information
     */
    async getArtistInfo(artistName) {
        try {
            const [spotifyArtist, lastFmArtist] = await Promise.allSettled([
                this.searchSpotifyArtist(artistName),
                this.getLastFmArtistInfo(artistName)
            ]);
            
            return this.combineArtistData(
                spotifyArtist.value || {},
                lastFmArtist.value || {}
            );
        } catch (error) {
            console.error('Error fetching artist info:', error);
            return null;
        }
    }
    
    /**
     * Start real-time updates
     */
    startRealTimeUpdates() {
        this.intervalId = setInterval(async () => {
            try {
                await this.updateMusicData();
            } catch (error) {
                console.error('Real-time update failed:', error);
            }
        }, this.updateInterval);
        
        console.log('Real-time music updates started');
    }
    
    /**
     * Stop real-time updates
     */
    stopRealTimeUpdates() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('Real-time music updates stopped');
        }
    }
    
    /**
     * Update music data
     */
    async updateMusicData() {
        // Clear cache to force fresh data
        this.cache.clear();
        
        // Update trending tracks
        const trendingTracks = await this.getTrendingTracks();
        this.displayTrendingTracks(trendingTracks);
        
        // Update music news
        const musicNews = await this.getMusicNews();
        this.displayMusicNews(musicNews);
        
        // Update timestamp
        this.updateLastUpdated();
    }
    
    /**
     * Display music data on the page
     */
    async displayMusicData() {
        try {
            const [trendingTracks, musicNews] = await Promise.all([
                this.getTrendingTracks(),
                this.getMusicNews()
            ]);
            
            this.displayTrendingTracks(trendingTracks);
            this.displayMusicNews(musicNews);
            this.updateLastUpdated();
        } catch (error) {
            console.error('Error displaying music data:', error);
        }
    }
    
    /**
     * Display trending tracks
     */
    displayTrendingTracks(tracks) {
        const container = document.getElementById('trending-tracks-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="music-section-header">
                <h2><i class="fas fa-fire"></i> Trending Now</h2>
                <div class="update-indicator">
                    <span class="status-dot"></span>
                    Live Updates
                </div>
            </div>
            <div class="tracks-grid">
                ${tracks.map((track, index) => `
                    <div class="track-card" data-index="${index}">
                        <div class="track-image">
                            <img src="${track.image || '/assets/default-album.png'}" alt="${track.title}" loading="lazy">
                            <div class="track-overlay">
                                <button class="play-btn" data-preview="${track.preview_url}">
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                            <div class="track-rank">#${index + 1}</div>
                        </div>
                        <div class="track-info">
                            <h3 class="track-title">${track.title}</h3>
                            <p class="track-artist">${track.artist}</p>
                            <div class="track-metadata">
                                <span class="track-source">${track.source}</span>
                                <div class="popularity-bar">
                                    <div class="popularity-fill" style="width: ${(track.popularity / 100) * 100}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.attachTrackEventListeners();
    }
    
    /**
     * Display music news
     */
    displayMusicNews(newsItems) {
        const container = document.getElementById('music-news-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="music-section-header">
                <h2><i class="fas fa-newspaper"></i> Latest Music News</h2>
            </div>
            <div class="news-grid">
                ${newsItems.map(item => `
                    <article class="news-card">
                        <div class="news-category">${item.category}</div>
                        <h3 class="news-title">${item.title}</h3>
                        <p class="news-summary">${item.summary}</p>
                        <div class="news-meta">
                            <span class="news-source">${item.source}</span>
                            <time class="news-time">${this.formatTimeAgo(item.timestamp)}</time>
                        </div>
                    </article>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Attach event listeners to track cards
     */
    attachTrackEventListeners() {
        const playButtons = document.querySelectorAll('.play-btn');
        
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const previewUrl = btn.dataset.preview;
                if (previewUrl) {
                    this.playPreview(previewUrl, btn);
                }
            });
        });
    }
    
    /**
     * Play track preview
     */
    playPreview(url, button) {
        // Stop any currently playing audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        
        // Reset all play buttons
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-play"></i>';
            btn.classList.remove('playing');
        });
        
        if (url) {
            this.currentAudio = new Audio(url);
            this.currentAudio.volume = 0.5;
            
            button.innerHTML = '<i class="fas fa-pause"></i>';
            button.classList.add('playing');
            
            this.currentAudio.play().catch(error => {
                console.error('Audio play failed:', error);
            });
            
            this.currentAudio.addEventListener('ended', () => {
                button.innerHTML = '<i class="fas fa-play"></i>';
                button.classList.remove('playing');
            });
        }
    }
    
    /**
     * Update last updated timestamp
     */
    updateLastUpdated() {
        const indicator = document.querySelector('.last-updated');
        if (indicator) {
            indicator.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        }
    }
    
    /**
     * Cache management
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }
    
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    
    /**
     * Utility functions
     */
    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
    
    /**
     * Fallback data when APIs fail
     */
    getFallbackTrendingData() {
        return [
            {
                title: "Anti-Hero",
                artist: "Taylor Swift",
                album: "Midnights",
                image: "",
                popularity: 95,
                source: "Fallback Data"
            },
            {
                title: "As It Was",
                artist: "Harry Styles",
                album: "Harry's House",
                image: "",
                popularity: 90,
                source: "Fallback Data"
            },
            {
                title: "Bad Habit",
                artist: "Steve Lacy",
                album: "Gemini Rights",
                image: "",
                popularity: 85,
                source: "Fallback Data"
            }
        ];
    }
    
    getFallbackNewsData() {
        return [
            {
                title: "Music Industry Updates",
                summary: "Stay tuned for the latest music industry news and updates.",
                category: "General",
                timestamp: new Date().toISOString(),
                source: "BrightLens Music"
            }
        ];
    }
    
    fallbackToStaticData() {
        console.log('Using fallback data due to API limitations');
        this.displayTrendingTracks(this.getFallbackTrendingData());
        this.displayMusicNews(this.getFallbackNewsData());
    }
}

// Initialize music data manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicManager = new MusicDataManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicDataManager;
}