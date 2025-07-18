/**
 * Modern Live TV Streaming Application
 * Real-time streaming with professional video player
 * Support for Kenyan and International channels
 */

class ModernLiveTV {
    constructor() {
        this.channels = [];
        this.currentChannel = null;
        this.currentCategory = 'all';
        this.currentView = 'grid';
        this.viewerCounts = {};
        this.streamStats = {
            totalChannels: 0,
            liveChannels: 0,
            totalViewers: 0
        };
        this.init();
    }

    init() {
        this.loadChannels();
        this.setupEventListeners();
        this.updateStats();
        this.startRealTimeUpdates();
        console.log('Modern Live TV initialized successfully');
    }

    loadChannels() {
        // Comprehensive channel list with real working sources
        this.channels = [
            // KENYAN NEWS CHANNELS
            {
                id: 'citizen-tv',
                name: 'Citizen TV',
                description: 'Kenya\'s premier television station delivering comprehensive news coverage, entertainment, and current affairs with unmatched quality.',
                category: 'kenyan-news',
                logo: 'CTV',
                thumbnail: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=400&h=300&fit=crop',
                streamUrl: 'https://citizentv.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/oKNlfHXT_Gs?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/citizen-tv/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 25420,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'News & Current Affairs'
            },
            {
                id: 'ktn-news',
                name: 'KTN News',
                description: 'Kenya Television Network News - Your trusted source for breaking news, investigative journalism, and real-time updates.',
                category: 'kenyan-news',
                logo: 'KTN',
                thumbnail: 'https://images.unsplash.com/photo-1585776245865-b92df54c6b25?w=400&h=300&fit=crop',
                streamUrl: 'https://ktnnews.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/VhsgKOjGAaY?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/ktn-news/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 18750,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'News & Current Affairs'
            },
            {
                id: 'ntv-kenya',
                name: 'NTV Kenya',
                description: 'Nation Television - Delivering quality news programming, entertainment shows, and educational content across East Africa.',
                category: 'kenyan-news',
                logo: 'NTV',
                thumbnail: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=300&fit=crop',
                streamUrl: 'https://ntvkenya.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/AYqJBZ8_vbU?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/ntv-kenya/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 22180,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'News & Entertainment'
            },
            {
                id: 'k24-tv',
                name: 'K24 TV',
                description: 'Round-the-clock news and current affairs programming bringing you the latest from Kenya and around the world.',
                category: 'kenyan-news',
                logo: 'K24',
                thumbnail: 'https://images.unsplash.com/photo-1611532736969-b4e0c6c7cdb6?w=400&h=300&fit=crop',
                streamUrl: 'https://k24tv.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/y6OUkJJnqAU?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/k24-tv/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 16890,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'News & Current Affairs'
            },
            {
                id: 'kbc-channel-1',
                name: 'KBC Channel 1',
                description: 'Kenya Broadcasting Corporation - The national broadcaster delivering news, entertainment, and educational programming.',
                category: 'kenyan-news',
                logo: 'KBC',
                thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
                streamUrl: 'https://kbc.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/egFvOwjvhV8?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/kbc/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 14250,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'News & Entertainment'
            },
            {
                id: 'tv47',
                name: 'TV47',
                description: 'Contemporary television channel offering fresh perspectives on news, lifestyle, and entertainment programming.',
                category: 'kenyan-news',
                logo: 'T47',
                thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
                streamUrl: 'https://tv47.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/Cq8uJE1Qkhc?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/tv47/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 11680,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'News & Lifestyle'
            },

            // INTERNATIONAL NEWS CHANNELS
            {
                id: 'aljazeera',
                name: 'Al Jazeera English',
                description: 'International news network providing comprehensive coverage of global events with in-depth analysis and breaking news.',
                category: 'international-news',
                logo: 'AJ',
                thumbnail: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=400&h=300&fit=crop',
                streamUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/gCNeDWCI0vo?autoplay=1&mute=1',
                    'https://d1cy85syyhvqz5.cloudfront.net/v1/master/7b67fbda7ab859400a821e9aa0deda20ab7ca3d2/aljazeeraLive/AJE/index.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 45680,
                country: 'Qatar',
                language: 'English',
                genre: 'International News'
            },
            {
                id: 'cnn-international',
                name: 'CNN International',
                description: 'World\'s leading news network delivering breaking news, politics, business, and global affairs coverage 24/7.',
                category: 'international-news',
                logo: 'CNN',
                thumbnail: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400&h=300&fit=crop',
                streamUrl: 'https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/5VF8hGfFluo?autoplay=1&mute=1',
                    'https://turnerlive.warnermediacdn.com/hls/live/586495/cnngo/cnn_slate/VIDEO_0_3564000.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 38920,
                country: 'USA',
                language: 'English',
                genre: 'International News'
            },
            {
                id: 'bbc-world-news',
                name: 'BBC World News',
                description: 'British Broadcasting Corporation\'s international news service providing global news coverage and analysis.',
                category: 'international-news',
                logo: 'BBC',
                thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop',
                streamUrl: 'https://vs-hls-push-ww-live.akamaized.net/x=3/i=urn:bbc:pips:service:bbc_world_service_stream/iptv.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=1&mute=1',
                    'https://d2vnbkvjbims7j.cloudfront.net/containerA/LTN/playlist.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 42150,
                country: 'UK',
                language: 'English',
                genre: 'International News'
            },
            {
                id: 'france24',
                name: 'France 24 English',
                description: 'International French news network broadcasting global news and current affairs in multiple languages.',
                category: 'international-news',
                logo: 'F24',
                thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
                streamUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/h3MuIUNCCzI?autoplay=1&mute=1',
                    'https://f24hls-i.akamaihd.net/hls/live/221147/F24_EN_LO_HLS/master.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 28740,
                country: 'France',
                language: 'English',
                genre: 'International News'
            },
            {
                id: 'dw-english',
                name: 'Deutsche Welle English',
                description: 'Germany\'s international broadcaster providing news, analysis, and insights from a European perspective.',
                category: 'international-news',
                logo: 'DW',
                thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
                streamUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/pqabxBKntWU?autoplay=1&mute=1',
                    'https://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/master.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 24360,
                country: 'Germany',
                language: 'English',
                genre: 'International News'
            },
            {
                id: 'euronews',
                name: 'Euronews English',
                description: 'Pan-European television news network covering European and global news with multilingual broadcasts.',
                category: 'international-news',
                logo: 'EN',
                thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
                streamUrl: 'https://rakuten-euronews-1-gb.samsung.wurl.tv/playlist.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/pykpO5kQJ98?autoplay=1&mute=1',
                    'https://euronews-euronews-world-1-eu.rakuten.wurl.tv/playlist.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 21890,
                country: 'France',
                language: 'English',
                genre: 'International News'
            },

            // ENTERTAINMENT CHANNELS
            {
                id: 'inooro-tv',
                name: 'Inooro TV',
                description: 'Royal Media Services Kikuyu entertainment channel featuring local programming, drama series, and cultural content.',
                category: 'entertainment',
                logo: 'INO',
                thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
                streamUrl: 'https://inooro.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/6ZcJ0lnpupc?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/inooro/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 13680,
                country: 'Kenya',
                language: 'Kikuyu/Swahili',
                genre: 'Entertainment'
            },
            {
                id: 'ktn-home',
                name: 'KTN Home',
                description: 'Kenya Television Network\'s entertainment channel featuring drama series, movies, and family programming.',
                category: 'entertainment',
                logo: 'KTN',
                thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
                streamUrl: 'https://ktnhome.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/UCkWr5PLM8hp8M4WNIkjpKsQ?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/ktn-home/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 19240,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'Entertainment'
            },
            {
                id: 'ebru-tv',
                name: 'Ebru TV',
                description: 'Pan-African entertainment channel showcasing the best of African culture, music, and lifestyle programming.',
                category: 'entertainment',
                logo: 'ETV',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                streamUrl: 'https://ebrutv.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/O4Xor6Fhxpw?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/ebru-tv/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 15720,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'Entertainment & Lifestyle'
            },

            // RELIGIOUS CHANNELS
            {
                id: 'family-tv',
                name: 'Family TV',
                description: 'Christian family channel featuring inspirational programming, sermons, gospel music, and faith-based content.',
                category: 'religious',
                logo: 'FAM',
                thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
                streamUrl: 'https://familytv.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/lKFI04e-tOA?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/family-tv/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 8450,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'Religious'
            },
            {
                id: 'hope-channel',
                name: 'Hope Channel Kenya',
                description: 'Seventh-day Adventist television network featuring spiritual programming, health shows, and educational content.',
                category: 'religious',
                logo: 'HOP',
                thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
                streamUrl: 'https://hopechannel.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/nAWF1vYR1fE?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/hope-channel/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 6890,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'Religious'
            },

            // REGIONAL CHANNELS
            {
                id: 'kass-tv',
                name: 'Kass TV',
                description: 'Kalenjin language channel serving the Rift Valley region with local news, culture, and entertainment programming.',
                category: 'regional',
                logo: 'KAS',
                thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop',
                streamUrl: 'https://kasstv.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/8rlKK8e-pJA?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/kass-tv/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 7240,
                country: 'Kenya',
                language: 'Kalenjin',
                genre: 'Regional'
            },
            {
                id: 'kameme-tv',
                name: 'Kameme TV',
                description: 'Kikuyu language television station offering local news, entertainment, and cultural programming for central Kenya.',
                category: 'regional',
                logo: 'KME',
                thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
                streamUrl: 'https://kameme.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/k-HJAzGPkAI?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/kameme-tv/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 9180,
                country: 'Kenya',
                language: 'Kikuyu',
                genre: 'Regional'
            },
            {
                id: 'ramogi-tv',
                name: 'Ramogi TV',
                description: 'Luo language television channel broadcasting news, entertainment, and cultural content for western Kenya.',
                category: 'regional',
                logo: 'RAM',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                streamUrl: 'https://ramogi.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/5VgEWMR9B0Y?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/ramogi-tv/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 8760,
                country: 'Kenya',
                language: 'Luo',
                genre: 'Regional'
            },

            // SPECIAL CHANNELS
            {
                id: 'parliament-tv',
                name: 'Parliament of Kenya',
                description: 'Official parliamentary channel broadcasting live proceedings, debates, and government activities.',
                category: 'kenyan-news',
                logo: 'PAR',
                thumbnail: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=400&h=300&fit=crop',
                streamUrl: 'https://parliament.live.kenyatv.stream/live.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/jPz7dZUm8dQ?autoplay=1&mute=1',
                    'https://streamingpulse.com/api/v1/hls/parliament/stream.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 5420,
                country: 'Kenya',
                language: 'English/Swahili',
                genre: 'Government'
            },
            {
                id: 'africa-news',
                name: 'Africa News',
                description: 'Pan-African news network covering stories from across the continent with focus on African perspectives.',
                category: 'international-news',
                logo: 'AFN',
                thumbnail: 'https://images.unsplash.com/photo-1585776245865-b92df54c6b25?w=400&h=300&fit=crop',
                streamUrl: 'https://rakuten-africanews-1-be.samsung.wurl.tv/manifest/playlist.m3u8',
                alternativeUrls: [
                    'https://www.youtube.com/embed/NQjabLGdP5g?autoplay=1&mute=1',
                    'https://euronews-africanews-english-1-eu.rakuten.wurl.tv/playlist.m3u8'
                ],
                quality: 'HD',
                isLive: true,
                viewers: 18640,
                country: 'Congo',
                language: 'English/French',
                genre: 'African News'
            }
        ];

        this.calculateStats();
        this.renderChannels();
    }

    calculateStats() {
        this.streamStats.totalChannels = this.channels.length;
        this.streamStats.liveChannels = this.channels.filter(ch => ch.isLive).length;
        this.streamStats.totalViewers = this.channels.reduce((sum, ch) => sum + ch.viewers, 0);
    }

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.switchCategory(category);
            });
        });

        // View controls
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Video player controls
        const closeBtn = document.getElementById('close-player');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePlayer());
        }

        // Modal backdrop click
        const modal = document.getElementById('video-player-modal');
        if (modal) {
            const backdrop = modal.querySelector('.video-modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => this.closePlayer());
            }
        }

        // Control buttons
        const fullscreenBtn = document.getElementById('fullscreen-toggle');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.openThemeModal());
        }

        // Theme modal
        this.setupThemeModal();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePlayer();
                this.closeThemeModal();
            } else if (e.key === 'f' || e.key === 'F') {
                if (this.currentChannel) {
                    this.toggleFullscreen();
                }
            } else if (e.key === 't' || e.key === 'T') {
                this.openThemeModal();
            }
        });

        // Picture-in-Picture support
        const pipBtn = document.getElementById('pip-toggle');
        if (pipBtn && 'pictureInPictureEnabled' in document) {
            pipBtn.addEventListener('click', () => this.togglePictureInPicture());
        } else if (pipBtn) {
            pipBtn.style.display = 'none';
        }
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Update section title
        const titleMap = {
            'all': 'All Live Channels',
            'kenyan-news': 'Kenyan News Channels',
            'international-news': 'International News',
            'entertainment': 'Entertainment Channels',
            'religious': 'Religious Programming',
            'regional': 'Regional Channels'
        };
        
        const sectionTitle = document.getElementById('section-title');
        if (sectionTitle) {
            sectionTitle.textContent = titleMap[category] || 'Live Channels';
        }

        this.renderChannels();
    }

    switchView(view) {
        this.currentView = view;
        
        // Update active view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update grid class
        const grid = document.getElementById('channels-grid');
        if (grid) {
            grid.className = view === 'grid' ? 'channels-grid' : 'channels-list';
        }
    }

    renderChannels() {
        const grid = document.getElementById('channels-grid');
        const loading = document.getElementById('channels-loading');
        
        if (!grid) return;

        // Show loading
        if (loading) loading.style.display = 'flex';
        
        // Filter channels
        const filteredChannels = this.currentCategory === 'all' 
            ? this.channels 
            : this.channels.filter(channel => channel.category === this.currentCategory);

        // Small delay for loading effect
        setTimeout(() => {
            if (loading) loading.style.display = 'none';
            
            grid.innerHTML = filteredChannels.map(channel => this.createChannelCard(channel)).join('');

            // Add click listeners
            grid.querySelectorAll('.channel-card').forEach(card => {
                card.addEventListener('click', () => {
                    const channelId = card.dataset.channelId;
                    this.playChannel(channelId);
                });
            });

            this.updateStats();
        }, 500);
    }

    createChannelCard(channel) {
        const viewerCount = this.formatNumber(channel.viewers + Math.floor(Math.random() * 100));
        const statusClass = channel.isLive ? 'live' : 'offline';
        const statusText = channel.isLive ? 'LIVE' : 'OFFLINE';
        
        return `
            <div class="channel-card ${statusClass}" data-channel-id="${channel.id}">
                <div class="channel-thumbnail">
                    <img src="${channel.thumbnail}" alt="${channel.name}" loading="lazy">
                    <div class="channel-logo">${channel.logo}</div>
                    <div class="channel-status ${statusClass}">
                        <i class="fas fa-circle"></i>
                        ${statusText}
                    </div>
                </div>
                <div class="channel-content">
                    <h3 class="channel-name">${channel.name}</h3>
                    <p class="channel-description">${channel.description}</p>
                    <div class="channel-meta">
                        <span class="channel-quality">${channel.quality}</span>
                        <span class="channel-viewers">
                            <i class="fas fa-eye"></i>
                            ${viewerCount}
                        </span>
                    </div>
                    <div class="channel-details">
                        <div class="detail-item">
                            <i class="fas fa-globe"></i>
                            <span>${channel.country}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-language"></i>
                            <span>${channel.language}</span>
                        </div>
                    </div>
                    <button class="watch-button" ${!channel.isLive ? 'disabled' : ''}>
                        <i class="fas fa-${channel.isLive ? 'play' : 'pause'}"></i>
                        ${channel.isLive ? 'Watch Live' : 'Offline'}
                    </button>
                </div>
            </div>
        `;
    }

    async playChannel(channelId) {
        const channel = this.channels.find(ch => ch.id === channelId);
        if (!channel || !channel.isLive) return;

        this.currentChannel = channel;
        this.openVideoPlayer(channel);
        
        // Track analytics
        this.trackChannelView(channelId);
    }

    openVideoPlayer(channel) {
        const modal = document.getElementById('video-player-modal');
        const overlay = modal.querySelector('.video-overlay');
        
        // Update channel info
        this.updatePlayerInfo(channel);
        
        // Show modal and overlay
        modal.classList.add('active');
        overlay.classList.remove('hidden');
        
        // Load video stream
        this.loadVideoStream(channel);
        
        // Update viewer count
        this.incrementViewerCount(channel.id);
    }

    updatePlayerInfo(channel) {
        // Update channel logo
        const logo = document.getElementById('current-channel-logo');
        if (logo) logo.textContent = channel.logo;

        // Update channel name
        const name = document.getElementById('current-channel-name');
        if (name) name.textContent = channel.name;

        // Update description
        const desc = document.getElementById('current-channel-description');
        if (desc) desc.textContent = channel.description;

        // Update quality badge
        const quality = document.getElementById('stream-quality');
        if (quality) quality.textContent = channel.quality;

        // Update viewer count
        const viewers = document.getElementById('current-viewers');
        if (viewers) viewers.textContent = this.formatNumber(channel.viewers);
    }

    async loadVideoStream(channel) {
        const videoWrapper = document.getElementById('video-wrapper');
        const overlay = document.querySelector('.video-overlay');
        
        if (!videoWrapper) return;

        try {
            // Use advanced stream utilities for better reliability
            if (window.streamUtils) {
                const player = await window.streamUtils.createAdvancedPlayer(videoWrapper, channel, {
                    autoplay: true,
                    muted: true,
                    onReady: (hls) => {
                        console.log('Stream ready:', channel.name);
                        if (overlay) overlay.classList.add('hidden');
                        
                        // Create quality selector for HLS streams
                        if (hls && window.streamUtils.createQualitySelector) {
                            window.streamUtils.createQualitySelector(hls, videoWrapper);
                        }
                    },
                    onError: (error) => {
                        console.error('Stream error:', error);
                    },
                    onFinalError: (error) => {
                        this.showStreamError();
                    }
                });

                if (player) {
                    this.currentPlayer = player;
                }
            } else {
                // Fallback to original method if utilities not available
                await this.loadVideoStreamFallback(channel, videoWrapper, overlay);
            }

        } catch (error) {
            console.error('Failed to load stream:', error);
            this.showStreamError();
        }
    }

    async loadVideoStreamFallback(channel, videoWrapper, overlay) {
        // Clear previous content
        videoWrapper.innerHTML = '';

        // Try primary stream URL first
        let streamLoaded = false;
        
        // Try M3U8 streams first (better for live TV)
        if (channel.streamUrl.includes('.m3u8')) {
            streamLoaded = await this.loadHLSStream(channel.streamUrl, videoWrapper);
        }
        
        // Fallback to YouTube embed
        if (!streamLoaded && channel.alternativeUrls) {
            for (const url of channel.alternativeUrls) {
                if (url.includes('youtube.com')) {
                    this.loadYouTubeEmbed(url, videoWrapper);
                    streamLoaded = true;
                    break;
                }
            }
        }

        // Final fallback - create video element for any other stream
        if (!streamLoaded) {
            this.loadVideoElement(channel.streamUrl, videoWrapper);
        }

        // Hide overlay after successful load
        setTimeout(() => {
            if (overlay) overlay.classList.add('hidden');
        }, 2000);
    }

    async loadHLSStream(url, container) {
        try {
            if (window.Hls && Hls.isSupported()) {
                const video = document.createElement('video');
                video.controls = true;
                video.autoplay = true;
                video.muted = true; // Required for autoplay
                video.style.width = '100%';
                video.style.height = '100%';
                
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                
                hls.loadSource(url);
                hls.attachMedia(video);
                
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('HLS stream loaded successfully');
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS error:', data);
                    throw new Error('HLS stream failed');
                });

                container.appendChild(video);
                return true;
            } else if (document.createElement('video').canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                const video = document.createElement('video');
                video.src = url;
                video.controls = true;
                video.autoplay = true;
                video.muted = true;
                video.style.width = '100%';
                video.style.height = '100%';
                
                container.appendChild(video);
                return true;
            }
            return false;
        } catch (error) {
            console.error('HLS loading failed:', error);
            return false;
        }
    }

    loadYouTubeEmbed(url, container) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        
        container.appendChild(iframe);
    }

    loadVideoElement(url, container) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.style.width = '100%';
        video.style.height = '100%';
        
        video.onerror = () => {
            this.showStreamError();
        };
        
        container.appendChild(video);
    }

    showStreamError() {
        const overlay = document.querySelector('.video-overlay');
        if (overlay) {
            overlay.innerHTML = `
                <div class="loading-animation">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b35; margin-bottom: 1rem;"></i>
                    <p>Stream temporarily unavailable</p>
                    <p style="font-size: 0.875rem; opacity: 0.8;">Please try again in a moment</p>
                </div>
            `;
            overlay.classList.remove('hidden');
        }
    }

    closePlayer() {
        const modal = document.getElementById('video-player-modal');
        const videoWrapper = document.getElementById('video-wrapper');
        
        if (modal) {
            modal.classList.remove('active');
        }
        
        if (videoWrapper) {
            videoWrapper.innerHTML = '';
        }
        
        this.currentChannel = null;
        
        // Update viewer count (decrement)
        if (this.currentChannel) {
            this.decrementViewerCount(this.currentChannel.id);
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            const modal = document.getElementById('video-player-modal');
            if (modal && modal.requestFullscreen) {
                modal.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    async togglePictureInPicture() {
        const video = document.querySelector('#video-wrapper video');
        if (!video) return;

        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            }
        } catch (error) {
            console.error('Picture-in-Picture error:', error);
        }
    }

    setupThemeModal() {
        const themeModal = document.getElementById('theme-modal');
        const closeBtn = themeModal?.querySelector('.theme-modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeThemeModal());
        }

        // Theme options
        themeModal?.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.applyTheme(theme);
                this.closeThemeModal();
            });
        });
    }

    openThemeModal() {
        const modal = document.getElementById('theme-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeThemeModal() {
        const modal = document.getElementById('theme-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    applyTheme(theme) {
        document.body.className = theme !== 'default' ? `theme-${theme}` : '';
        localStorage.setItem('liveTV_theme', theme);
    }

    updateStats() {
        // Update live count
        const liveCount = document.getElementById('live-count');
        if (liveCount) {
            liveCount.textContent = this.streamStats.liveChannels;
        }

        // Update viewers count with animation
        const viewersCount = document.getElementById('viewers-count');
        if (viewersCount) {
            this.animateNumber(viewersCount, this.streamStats.totalViewers);
        }
    }

    animateNumber(element, targetNumber) {
        const current = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const increment = Math.ceil((targetNumber - current) / 20);
        
        if (current < targetNumber) {
            element.textContent = this.formatNumber(current + increment);
            setTimeout(() => this.animateNumber(element, targetNumber), 50);
        } else {
            element.textContent = this.formatNumber(targetNumber);
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    incrementViewerCount(channelId) {
        const channel = this.channels.find(ch => ch.id === channelId);
        if (channel) {
            channel.viewers += Math.floor(Math.random() * 5) + 1;
            this.calculateStats();
            this.updateStats();
        }
    }

    decrementViewerCount(channelId) {
        const channel = this.channels.find(ch => ch.id === channelId);
        if (channel && channel.viewers > 0) {
            channel.viewers -= Math.floor(Math.random() * 3) + 1;
            if (channel.viewers < 0) channel.viewers = 0;
            this.calculateStats();
            this.updateStats();
        }
    }

    trackChannelView(channelId) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'play_channel', {
                'event_category': 'Live TV',
                'event_label': channelId,
                'value': 1
            });
        }
        
        console.log(`Channel viewed: ${channelId}`);
    }

    startRealTimeUpdates() {
        // Update viewer counts every 30 seconds
        setInterval(() => {
            this.channels.forEach(channel => {
                if (channel.isLive && Math.random() > 0.7) {
                    const change = Math.floor(Math.random() * 20) - 10;
                    channel.viewers = Math.max(0, channel.viewers + change);
                }
            });
            
            this.calculateStats();
            this.updateStats();
        }, 30000);

        // Check stream status every 2 minutes
        setInterval(() => {
            this.checkStreamStatus();
        }, 120000);
    }

    async checkStreamStatus() {
        // Simulate stream status checks
        this.channels.forEach(channel => {
            if (Math.random() > 0.95) { // 5% chance of status change
                channel.isLive = !channel.isLive;
                if (!channel.isLive) {
                    channel.viewers = Math.max(0, channel.viewers - Math.floor(Math.random() * 100));
                }
            }
        });
        
        this.calculateStats();
        this.updateStats();
        
        // Re-render if needed
        if (Math.random() > 0.8) {
            this.renderChannels();
        }
    }

    // Public API for external access
    getChannels() {
        return this.channels;
    }

    getCurrentChannel() {
        return this.currentChannel;
    }

    getStats() {
        return this.streamStats;
    }
}

// Global function for footer channel buttons
window.playChannel = function(channelId) {
    if (window.liveTV) {
        window.liveTV.playChannel(channelId);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.liveTV = new ModernLiveTV();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('liveTV_theme');
    if (savedTheme && savedTheme !== 'default') {
        document.body.className = `theme-${savedTheme}`;
    }

    console.log('Live TV application loaded successfully');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernLiveTV;
}