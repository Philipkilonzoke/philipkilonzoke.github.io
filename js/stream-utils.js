/**
 * Stream Utilities for Live TV
 * Handles stream validation, fallbacks, and real-time monitoring
 */

class StreamUtils {
    constructor() {
        this.streamCache = new Map();
        this.failedStreams = new Set();
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        this.monitoringInterval = null;
    }

    /**
     * Validate if a stream URL is accessible
     */
    async validateStream(url) {
        if (this.failedStreams.has(url)) {
            return false;
        }

        try {
            // For M3U8 streams, do a HEAD request
            if (url.includes('.m3u8')) {
                const response = await fetch(url, { 
                    method: 'HEAD',
                    mode: 'no-cors'
                });
                return response.ok || response.type === 'opaque';
            }

            // For YouTube embeds, assume they work
            if (url.includes('youtube.com')) {
                return true;
            }

            // For other streams, try a basic connectivity check
            return await this.checkStreamConnectivity(url);

        } catch (error) {
            console.warn(`Stream validation failed for ${url}:`, error);
            this.failedStreams.add(url);
            return false;
        }
    }

    /**
     * Check stream connectivity
     */
    async checkStreamConnectivity(url) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.muted = true;
            
            const timeout = setTimeout(() => {
                video.src = '';
                resolve(false);
            }, 5000);

            video.onloadstart = () => {
                clearTimeout(timeout);
                video.src = '';
                resolve(true);
            };

            video.onerror = () => {
                clearTimeout(timeout);
                video.src = '';
                resolve(false);
            };

            video.src = url;
        });
    }

    /**
     * Get best working stream from alternatives
     */
    async getBestStream(streamUrl, alternativeUrls = []) {
        const allUrls = [streamUrl, ...alternativeUrls];
        
        // Check cached working streams first
        for (const url of allUrls) {
            if (this.streamCache.has(url) && this.streamCache.get(url).working) {
                const cached = this.streamCache.get(url);
                if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
                    return url;
                }
            }
        }

        // Validate streams in parallel
        const validationPromises = allUrls.map(async (url) => {
            const isValid = await this.validateStream(url);
            this.streamCache.set(url, {
                working: isValid,
                timestamp: Date.now()
            });
            return { url, isValid };
        });

        const results = await Promise.all(validationPromises);
        const workingStream = results.find(result => result.isValid);
        
        return workingStream ? workingStream.url : streamUrl; // Fallback to original
    }

    /**
     * Create HLS player with advanced configuration
     */
    createHLSPlayer(container, streamUrl, options = {}) {
        if (!window.Hls || !Hls.isSupported()) {
            return this.createNativeVideoPlayer(container, streamUrl, options);
        }

        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = options.autoplay !== false;
        video.muted = options.muted !== false;
        video.style.width = '100%';
        video.style.height = '100%';
        video.crossOrigin = 'anonymous';

        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 30,
            maxBufferSize: 60 * 1000 * 1000,
            maxBufferHole: 0.5,
            highBufferWatchdogPeriod: 2,
            nudgeOffset: 0.1,
            nudgeMaxRetry: 3,
            maxLoadingDelay: 4,
            minAutoBitrate: 0,
            ...options.hlsConfig
        });

        // Error handling
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('Network error, trying to recover...');
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('Media error, trying to recover...');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.log('Fatal error, destroying HLS instance');
                        hls.destroy();
                        if (options.onError) {
                            options.onError(data);
                        }
                        break;
                }
            }
        });

        // Quality level handling
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest parsed, levels:', hls.levels.length);
            if (options.onReady) {
                options.onReady(hls);
            }
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        container.appendChild(video);

        return { video, hls };
    }

    /**
     * Create native video player for non-HLS streams
     */
    createNativeVideoPlayer(container, streamUrl, options = {}) {
        const video = document.createElement('video');
        video.src = streamUrl;
        video.controls = true;
        video.autoplay = options.autoplay !== false;
        video.muted = options.muted !== false;
        video.style.width = '100%';
        video.style.height = '100%';
        video.crossOrigin = 'anonymous';

        // Error handling
        video.onerror = () => {
            console.error('Video playback error');
            if (options.onError) {
                options.onError({ type: 'video_error', message: 'Playback failed' });
            }
        };

        video.onloadstart = () => {
            if (options.onReady) {
                options.onReady(null);
            }
        };

        container.appendChild(video);
        return { video, hls: null };
    }

    /**
     * Create YouTube embed player
     */
    createYouTubePlayer(container, embedUrl, options = {}) {
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        // Add loading detection
        iframe.onload = () => {
            if (options.onReady) {
                options.onReady(null);
            }
        };

        iframe.onerror = () => {
            if (options.onError) {
                options.onError({ type: 'iframe_error', message: 'YouTube embed failed' });
            }
        };

        container.appendChild(iframe);
        return { iframe, hls: null };
    }

    /**
     * Start monitoring stream health
     */
    startStreamMonitoring(channels, updateCallback) {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }

        this.monitoringInterval = setInterval(async () => {
            const results = await this.checkChannelsHealth(channels);
            if (updateCallback) {
                updateCallback(results);
            }
        }, 60000); // Check every minute
    }

    /**
     * Stop stream monitoring
     */
    stopStreamMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    /**
     * Check health of multiple channels
     */
    async checkChannelsHealth(channels) {
        const batchSize = 5; // Check 5 channels at a time
        const results = [];

        for (let i = 0; i < channels.length; i += batchSize) {
            const batch = channels.slice(i, i + batchSize);
            const batchPromises = batch.map(async (channel) => {
                const isHealthy = await this.validateStream(channel.streamUrl);
                return {
                    channelId: channel.id,
                    isHealthy,
                    lastChecked: Date.now()
                };
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);

            // Small delay between batches to avoid overwhelming servers
            if (i + batchSize < channels.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return results;
    }

    /**
     * Get stream statistics
     */
    getStreamStats() {
        return {
            totalStreams: this.streamCache.size,
            workingStreams: Array.from(this.streamCache.values()).filter(s => s.working).length,
            failedStreams: this.failedStreams.size,
            cacheSize: this.streamCache.size
        };
    }

    /**
     * Clear cache and reset failed streams
     */
    clearCache() {
        this.streamCache.clear();
        this.failedStreams.clear();
        this.retryAttempts.clear();
    }

    /**
     * Advanced stream player with automatic fallback
     */
    async createAdvancedPlayer(container, channel, options = {}) {
        const bestStreamUrl = await this.getBestStream(
            channel.streamUrl, 
            channel.alternativeUrls || []
        );

        // Clear container
        container.innerHTML = '';

        try {
            // Determine player type based on stream URL
            if (bestStreamUrl.includes('.m3u8')) {
                return this.createHLSPlayer(container, bestStreamUrl, {
                    ...options,
                    onError: (error) => this.handleStreamError(container, channel, error, options)
                });
            } else if (bestStreamUrl.includes('youtube.com')) {
                return this.createYouTubePlayer(container, bestStreamUrl, {
                    ...options,
                    onError: (error) => this.handleStreamError(container, channel, error, options)
                });
            } else {
                return this.createNativeVideoPlayer(container, bestStreamUrl, {
                    ...options,
                    onError: (error) => this.handleStreamError(container, channel, error, options)
                });
            }
        } catch (error) {
            console.error('Failed to create player:', error);
            this.showErrorMessage(container, 'Unable to load stream');
            return null;
        }
    }

    /**
     * Handle stream errors with automatic fallback
     */
    async handleStreamError(container, channel, error, options) {
        console.error('Stream error:', error);

        const retryKey = channel.id;
        const currentRetries = this.retryAttempts.get(retryKey) || 0;

        if (currentRetries < this.maxRetries) {
            this.retryAttempts.set(retryKey, currentRetries + 1);
            
            // Mark current stream as failed
            this.failedStreams.add(channel.streamUrl);
            
            // Try alternative URLs
            if (channel.alternativeUrls && channel.alternativeUrls.length > 0) {
                console.log(`Trying fallback stream for ${channel.name}`);
                setTimeout(() => {
                    this.createAdvancedPlayer(container, channel, options);
                }, 2000);
                return;
            }
        }

        // All retries exhausted
        this.showErrorMessage(container, 'Stream temporarily unavailable');
        if (options.onFinalError) {
            options.onFinalError(error);
        }
    }

    /**
     * Show error message in container
     */
    showErrorMessage(container, message) {
        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                background: #000;
                color: white;
                text-align: center;
                padding: 2rem;
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b35; margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 0.5rem;">${message}</h3>
                <p style="opacity: 0.8; font-size: 0.875rem;">Please try again later</p>
            </div>
        `;
    }

    /**
     * Quality selector for HLS streams
     */
    createQualitySelector(hls, container) {
        if (!hls || !hls.levels || hls.levels.length <= 1) {
            return null;
        }

        const selector = document.createElement('select');
        selector.className = 'quality-selector';
        selector.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            padding: 0.5rem;
            border-radius: 4px;
            z-index: 1000;
        `;

        // Auto quality option
        const autoOption = document.createElement('option');
        autoOption.value = '-1';
        autoOption.textContent = 'Auto';
        selector.appendChild(autoOption);

        // Quality levels
        hls.levels.forEach((level, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${level.height}p (${Math.round(level.bitrate / 1000)}k)`;
            selector.appendChild(option);
        });

        selector.addEventListener('change', (e) => {
            const level = parseInt(e.target.value);
            hls.currentLevel = level;
        });

        // Update selector when quality changes
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
            selector.value = data.level;
        });

        container.style.position = 'relative';
        container.appendChild(selector);

        return selector;
    }
}

// Export the utility class
window.StreamUtils = StreamUtils;

// Create global instance
window.streamUtils = new StreamUtils();

console.log('Stream utilities loaded successfully');