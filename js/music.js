// Music Hub JavaScript
const MusicHub = {
    // State management
    state: {
        currentGenre: 'all',
        currentSort: 'latest',
        currentFilter: 'all',
        searchQuery: '',
        trendingIndex: 0,
        isPlaying: false,
        currentSong: null
    },

    // Sample data (simulating API responses)
    data: {
        trending: [
            {
                id: 1,
                title: "Watermelon Sugar",
                artist: "Harry Styles",
                genre: "pop",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                duration: "2:54",
                type: "song",
                plays: "1.2M",
                date: "2024-01-15"
            },
            {
                id: 2,
                title: "Blinding Lights",
                artist: "The Weeknd",
                genre: "pop",
                image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=400&fit=crop",
                duration: "3:20",
                type: "song",
                plays: "2.8M",
                date: "2024-01-14"
            },
            {
                id: 3,
                title: "Love Nwantiti",
                artist: "CKay",
                genre: "afrobeats",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                duration: "3:06",
                type: "song",
                plays: "5.1M",
                date: "2024-01-13"
            },
            {
                id: 4,
                title: "Ke Star",
                artist: "Focalistic ft. Vigro Deep",
                genre: "amapiano",
                image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=400&fit=crop",
                duration: "4:12",
                type: "song",
                plays: "3.5M",
                date: "2024-01-12"
            },
            {
                id: 5,
                title: "Stay",
                artist: "The Kid LAROI & Justin Bieber",
                genre: "pop",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                duration: "2:21",
                type: "song",
                plays: "1.8M",
                date: "2024-01-11"
            }
        ],
        songs: [
            {
                id: 6,
                title: "Good as Hell",
                artist: "Lizzo",
                genre: "pop",
                image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=400&fit=crop",
                duration: "2:39",
                type: "song",
                plays: "892K",
                date: "2024-01-10"
            },
            {
                id: 7,
                title: "Industry Baby",
                artist: "Lil Nas X ft. Jack Harlow",
                genre: "hip-hop",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                duration: "3:32",
                type: "song",
                plays: "2.1M",
                date: "2024-01-09"
            },
            {
                id: 8,
                title: "Essence",
                artist: "Wizkid ft. Tems",
                genre: "afrobeats",
                image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=400&fit=crop",
                duration: "4:05",
                type: "song",
                plays: "4.2M",
                date: "2024-01-08"
            },
            {
                id: 9,
                title: "Jerusalema",
                artist: "Master KG ft. Nomcebo Zikode",
                genre: "amapiano",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                duration: "3:33",
                type: "song",
                plays: "6.8M",
                date: "2024-01-07"
            },
            {
                id: 10,
                title: "Fever",
                artist: "Wizkid & Tiwa Savage",
                genre: "afrobeats",
                image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=400&fit=crop",
                duration: "3:21",
                type: "song",
                plays: "1.5M",
                date: "2024-01-06"
            },
            {
                id: 11,
                title: "Temperature",
                artist: "Sean Paul",
                genre: "dancehall",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
                duration: "3:56",
                type: "song",
                plays: "987K",
                date: "2024-01-05"
            }
        ],
        news: [
            {
                id: 12,
                title: "Grammy Awards 2024: Complete List of Winners",
                description: "The 66th Annual Grammy Awards celebrated the best in music with surprising wins and memorable performances.",
                source: "Rolling Stone",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
                type: "news",
                date: "2024-01-15",
                category: "Awards"
            },
            {
                id: 13,
                title: "Afrobeats Takes Center Stage at Global Music Festival",
                description: "African artists dominate international stages as the genre continues its worldwide expansion.",
                source: "Pitchfork",
                image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=300&fit=crop",
                type: "news",
                date: "2024-01-14",
                category: "Festivals"
            },
            {
                id: 14,
                title: "Streaming Numbers Hit Record High in 2024",
                description: "Music streaming platforms report unprecedented growth with new user engagement metrics.",
                source: "Billboard",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
                type: "news",
                date: "2024-01-13",
                category: "Industry"
            },
            {
                id: 15,
                title: "Rising Hip-Hop Artists to Watch This Year",
                description: "Emerging talent from around the globe is reshaping the hip-hop landscape with innovative sounds.",
                source: "Complex",
                image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=300&fit=crop",
                type: "news",
                date: "2024-01-12",
                category: "Hip-Hop"
            }
        ]
    },

    // Initialize the music hub
    init() {
        this.setupEventListeners();
        this.loadTrendingCarousel();
        this.loadSongs();
        this.loadNews();
        this.startAutoCarousel();
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
                this.filterContent();
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.state.searchQuery = '';
                this.toggleSearchClear();
                this.filterContent();
            });
        }

        // Filter controls
        const sortFilter = document.getElementById('sort-filter');
        const contentFilter = document.getElementById('content-filter');

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.state.currentSort = e.target.value;
                this.filterContent();
            });
        }

        if (contentFilter) {
            contentFilter.addEventListener('change', (e) => {
                this.state.currentFilter = e.target.value;
                this.filterContent();
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

        // Mini player controls
        this.setupMiniPlayerControls();
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
        this.filterContent();
    },

    // Filter and display content based on current state
    filterContent() {
        let filteredSongs = [...this.data.songs];
        let filteredNews = [...this.data.news];

        // Apply search filter
        if (this.state.searchQuery) {
            const query = this.state.searchQuery.toLowerCase();
            filteredSongs = filteredSongs.filter(song => 
                song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query) ||
                song.genre.toLowerCase().includes(query)
            );
            filteredNews = filteredNews.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.description.toLowerCase().includes(query)
            );
        }

        // Apply genre filter
        if (this.state.currentGenre !== 'all') {
            filteredSongs = filteredSongs.filter(song => 
                song.genre === this.state.currentGenre
            );
        }

        // Apply content type filter
        if (this.state.currentFilter === 'songs') {
            filteredNews = [];
        } else if (this.state.currentFilter === 'news') {
            filteredSongs = [];
        }

        // Apply sorting
        this.sortContent(filteredSongs, filteredNews);

        // Update displays
        this.displaySongs(filteredSongs);
        this.displayNews(filteredNews);
    },

    // Sort content based on current sort option
    sortContent(songs, news) {
        const sortFunc = {
            'latest': (a, b) => new Date(b.date) - new Date(a.date),
            'popular': (a, b) => {
                const aPlays = parseInt(a.plays?.replace(/[KM]/g, '')) || 0;
                const bPlays = parseInt(b.plays?.replace(/[KM]/g, '')) || 0;
                return bPlays - aPlays;
            },
            'trending': (a, b) => Math.random() - 0.5
        };

        songs.sort(sortFunc[this.state.currentSort]);
        news.sort(sortFunc[this.state.currentSort]);
    },

    // Load and display trending carousel
    loadTrendingCarousel() {
        const container = document.getElementById('trending-container');
        if (!container) return;

        container.innerHTML = this.data.trending.map(item => `
            <div class="trending-card" data-id="${item.id}">
                <div class="card-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="trending-badge">🔥 Trending</div>
                    ${item.duration ? `<div class="card-duration">${item.duration}</div>` : ''}
                </div>
                <div class="card-content">
                    <div class="card-title">${item.title}</div>
                    <div class="card-artist">${item.artist}</div>
                    <div class="card-meta">
                        <span>${item.plays}</span>
                        <span>${this.formatDate(item.date)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click listeners to trending cards
        container.querySelectorAll('.trending-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const item = this.data.trending.find(t => t.id === id);
                if (item && item.type === 'song') {
                    this.playSong(item);
                }
            });
        });
    },

    // Move trending carousel
    moveTrendingCarousel(direction) {
        const container = document.getElementById('trending-container');
        if (!container) return;

        const cardWidth = 300 + 24; // card width + gap
        const maxIndex = this.data.trending.length - 3; // Show 3 cards at once

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
        
        if (prevBtn) {
            prevBtn.disabled = this.state.trendingIndex <= 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.state.trendingIndex >= this.data.trending.length - 3;
        }
    },

    // Start auto carousel
    startAutoCarousel() {
        setInterval(() => {
            if (this.state.trendingIndex >= this.data.trending.length - 3) {
                this.state.trendingIndex = 0;
            } else {
                this.state.trendingIndex++;
            }
            
            const container = document.getElementById('trending-container');
            if (container) {
                const cardWidth = 300 + 24;
                const translateX = -this.state.trendingIndex * cardWidth;
                container.style.transform = `translateX(${translateX}px)`;
            }
            
            this.updateCarouselButtons();
        }, 5000); // Auto scroll every 5 seconds
    },

    // Load and display songs
    loadSongs() {
        this.displaySongs(this.data.songs);
    },

    // Display songs in grid
    displaySongs(songs) {
        const container = document.getElementById('songs-grid');
        if (!container) return;

        if (songs.length === 0) {
            container.innerHTML = '<div class="no-results">No songs found matching your criteria.</div>';
            return;
        }

        container.innerHTML = songs.map(song => `
            <div class="music-card" data-id="${song.id}">
                <div class="card-image">
                    <img src="${song.image}" alt="${song.title}" loading="lazy">
                    <button class="play-button">
                        <i class="fas fa-play"></i>
                    </button>
                    ${song.duration ? `<div class="card-duration">${song.duration}</div>` : ''}
                </div>
                <div class="card-content">
                    <div class="card-title">${song.title}</div>
                    <div class="card-artist">${song.artist}</div>
                    <div class="card-genre">${this.formatGenre(song.genre)}</div>
                    <div class="card-meta">
                        <span>${song.plays}</span>
                        <span>${this.formatDate(song.date)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click listeners to song cards
        container.querySelectorAll('.music-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const song = songs.find(s => s.id === id);
                if (song) {
                    this.playSong(song);
                }
            });
        });
    },

    // Load and display news
    loadNews() {
        this.displayNews(this.data.news);
    },

    // Display news in grid
    displayNews(news) {
        const container = document.getElementById('news-grid');
        if (!container) return;

        if (news.length === 0) {
            container.innerHTML = '<div class="no-results">No news articles found matching your criteria.</div>';
            return;
        }

        container.innerHTML = news.map(article => `
            <div class="news-card" data-id="${article.id}">
                <div class="card-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
                <div class="card-content">
                    <div class="card-source">${article.source}</div>
                    <div class="card-title">${article.title}</div>
                    <div class="card-description">${article.description}</div>
                    <div class="card-date">${this.formatDate(article.date)}</div>
                </div>
            </div>
        `).join('');

        // Add click listeners to news cards
        container.querySelectorAll('.news-card').forEach(card => {
            card.addEventListener('click', () => {
                // Simulate opening article in new tab
                console.log('Opening article:', card.dataset.id);
            });
        });
    },

    // Play a song (show mini player)
    playSong(song) {
        this.state.currentSong = song;
        this.state.isPlaying = true;
        this.showMiniPlayer(song);
    },

    // Show mini player
    showMiniPlayer(song) {
        const player = document.getElementById('mini-player');
        if (!player) return;

        // Update player content
        const albumArt = player.querySelector('.player-album-art');
        const title = player.querySelector('.player-title');
        const artist = player.querySelector('.player-artist');
        const playPauseBtn = player.querySelector('#play-pause-btn');

        if (albumArt) albumArt.src = song.image;
        if (title) title.textContent = song.title;
        if (artist) artist.textContent = song.artist;
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }

        // Show player
        player.style.display = 'block';

        // Add some margin to main content to account for player
        const main = document.querySelector('.main');
        if (main) {
            main.style.marginBottom = '100px';
        }
    },

    // Setup mini player controls
    setupMiniPlayerControls() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const closeBtn = document.getElementById('player-close');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.playPreviousSong();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.playNextSong();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeMiniPlayer();
            });
        }
    },

    // Toggle play/pause
    togglePlayPause() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (!playPauseBtn) return;

        this.state.isPlaying = !this.state.isPlaying;
        
        if (this.state.isPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    },

    // Play previous song
    playPreviousSong() {
        if (!this.state.currentSong) return;

        const allSongs = [...this.data.trending, ...this.data.songs].filter(item => item.type === 'song');
        const currentIndex = allSongs.findIndex(song => song.id === this.state.currentSong.id);
        
        if (currentIndex > 0) {
            this.playSong(allSongs[currentIndex - 1]);
        } else {
            this.playSong(allSongs[allSongs.length - 1]); // Loop to last song
        }
    },

    // Play next song
    playNextSong() {
        if (!this.state.currentSong) return;

        const allSongs = [...this.data.trending, ...this.data.songs].filter(item => item.type === 'song');
        const currentIndex = allSongs.findIndex(song => song.id === this.state.currentSong.id);
        
        if (currentIndex < allSongs.length - 1) {
            this.playSong(allSongs[currentIndex + 1]);
        } else {
            this.playSong(allSongs[0]); // Loop to first song
        }
    },

    // Close mini player
    closeMiniPlayer() {
        const player = document.getElementById('mini-player');
        const main = document.querySelector('.main');
        
        if (player) {
            player.style.display = 'none';
        }
        
        if (main) {
            main.style.marginBottom = '0';
        }

        this.state.isPlaying = false;
        this.state.currentSong = null;
    },

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    },

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
    },

    hideLoading() {
        const loading = document.getElementById('music-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof MusicHub !== 'undefined') {
            MusicHub.init();
        }
    });
} else {
    if (typeof MusicHub !== 'undefined') {
        MusicHub.init();
    }
}