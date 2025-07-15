/**
 * BrightLens News Ultra-Modern 3D Splash Screen Manager
 * Handles the advanced 3D logo animation and immersive loading experience
 * with holographic effects and optimized particle systems
 */

class SplashScreen3D {
    constructor() {
        this.splashElement = null;
        this.progressBar = null;
        this.particles = [];
        this.loadStartTime = Date.now();
        this.minDisplayTime = 2000; // Minimum time to show splash screen
        this.maxDisplayTime = 5000; // Maximum time before auto-hide
        this.progressSpeed = 1.5;
        this.particleCount = window.innerWidth < 768 ? 15 : 25; // Optimized particle count
        this.animationFrameId = null;
        this.isDestroyed = false;
        
        this.init();
    }

    init() {
        this.createSplashScreen();
        this.createParticleSystem();
        this.create3DShapes();
        this.createHolographicEffect();
        this.startLoadingAnimation();
        this.setupPerformanceOptimizations();
    }

    createSplashScreen() {
        // Remove existing loading screens
        const existingScreens = document.querySelectorAll('#loading-screen, .loading-screen, #splash-screen-3d');
        existingScreens.forEach(screen => screen.remove());

        // Create new ultra-modern 3D splash screen
        this.splashElement = document.createElement('div');
        this.splashElement.id = 'splash-screen-3d';
        this.splashElement.className = 'splash-screen-3d';
        
        this.splashElement.innerHTML = `
            <div class="splash-logo-container">
                <img src="assets/brightlens-3d-logo.svg" alt="BrightLens News" class="splash-logo-3d" />
                <div class="splash-text">
                    <h1 class="splash-title">BrightLens News</h1>
                    <p class="splash-subtitle">Ultra-Modern News Experience Loading...</p>
                    <div class="splash-status">
                        <div class="splash-status-text">Initializing Systems...</div>
                        <div class="splash-progress-container">
                            <div class="splash-progress-bar" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="splash-particles"></div>
            <div class="splash-3d-shapes">
                <div class="shape-3d"></div>
                <div class="shape-3d"></div>
                <div class="shape-3d"></div>
                <div class="shape-3d"></div>
            </div>
            <div class="splash-hologram"></div>
        `;
        
        document.body.appendChild(this.splashElement);
        
        // Get references to elements
        this.progressBar = this.splashElement.querySelector('.splash-progress-bar');
        this.statusText = this.splashElement.querySelector('.splash-status-text');
        this.particlesContainer = this.splashElement.querySelector('.splash-particles');
    }

    createParticleSystem() {
        const particlesContainer = this.splashElement.querySelector('.splash-particles');
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (12 + Math.random() * 8) + 's';
            
            // Random horizontal drift
            particle.style.setProperty('--drift', (Math.random() - 0.5) * 200 + 'px');
            
            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    create3DShapes() {
        const shapes = this.splashElement.querySelectorAll('.shape-3d');
        shapes.forEach((shape, index) => {
            // Add random animations
            const duration = 15 + Math.random() * 10;
            const delay = Math.random() * 5;
            
            shape.style.animationDuration = duration + 's';
            shape.style.animationDelay = -delay + 's';
        });
    }

    createHolographicEffect() {
        const hologram = this.splashElement.querySelector('.splash-hologram');
        if (hologram) {
            // Add dynamic holographic pulse
            const duration = 6 + Math.random() * 4;
            hologram.style.animationDuration = duration + 's';
        }
    }

    startLoadingAnimation() {
        const statusMessages = [
            'Initializing Systems...',
            'Loading News Sources...',
            'Optimizing Performance...',
            'Preparing Interface...',
            'Almost Ready...'
        ];
        
        let currentMessage = 0;
        let progress = 0;
        const targetProgress = 100;
        const progressIncrement = 2;
        
        const updateProgress = () => {
            if (this.isDestroyed) return;
            
            progress += progressIncrement;
            
            // Update progress bar
            if (this.progressBar) {
                this.progressBar.style.width = Math.min(progress, targetProgress) + '%';
            }
            
            // Update status message
            if (this.statusText && progress % 25 === 0 && currentMessage < statusMessages.length - 1) {
                currentMessage++;
                this.statusText.textContent = statusMessages[currentMessage];
            }
            
            // Continue animation
            if (progress < targetProgress) {
                setTimeout(updateProgress, 50 + Math.random() * 100);
            } else {
                this.completeLoading();
            }
        };
        
        // Start progress animation
        setTimeout(updateProgress, 500);
        
        // Auto-hide after maximum time
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.completeLoading();
            }
        }, this.maxDisplayTime);
    }

    completeLoading() {
        if (this.isDestroyed) return;
        
        const timePassed = Date.now() - this.loadStartTime;
        const remainingTime = Math.max(0, this.minDisplayTime - timePassed);
        
        setTimeout(() => {
            this.hideSplashScreen();
        }, remainingTime);
    }

    hideSplashScreen() {
        if (this.isDestroyed || !this.splashElement) return;
        
        // Update final status
        if (this.statusText) {
            this.statusText.textContent = 'Launch Complete!';
        }
        
        // Complete progress bar
        if (this.progressBar) {
            this.progressBar.style.width = '100%';
        }
        
        // Hide splash screen with animation
        setTimeout(() => {
            if (this.splashElement) {
                this.splashElement.classList.add('hidden');
                
                // Remove element after animation
                setTimeout(() => {
                    this.destroy();
                }, 1500);
            }
        }, 300);
    }

    setupPerformanceOptimizations() {
        // Optimize animations based on device performance
        const isLowEndDevice = this.detectLowEndDevice();
        
        if (isLowEndDevice) {
            // Reduce particle count for low-end devices
            const particlesToRemove = Math.floor(this.particles.length * 0.4);
            for (let i = 0; i < particlesToRemove; i++) {
                if (this.particles[i]) {
                    this.particles[i].remove();
                }
            }
            this.particles = this.particles.slice(particlesToRemove);
            
            // Reduce animation complexity
            this.splashElement.style.setProperty('--reduced-animations', '1');
        }
        
        // Optimize for battery
        if (this.isBatteryLow()) {
            this.splashElement.style.setProperty('--battery-saver', '1');
        }
        
        // Preload critical assets
        this.preloadCriticalAssets();
    }

    detectLowEndDevice() {
        // Simple device performance detection
        const userAgent = navigator.userAgent.toLowerCase();
        const isOldAndroid = userAgent.includes('android') && 
                           (userAgent.includes('android 4') || userAgent.includes('android 5'));
        const isOldIOS = userAgent.includes('os 10_') || userAgent.includes('os 11_');
        const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const hasSlowConnection = navigator.connection && 
                                navigator.connection.effectiveType === 'slow-2g' ||
                                navigator.connection.effectiveType === '2g';
        
        return isOldAndroid || isOldIOS || hasLowMemory || hasSlowConnection;
    }

    isBatteryLow() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                return battery.level < 0.2;
            });
        }
        return false;
    }

    preloadCriticalAssets() {
        const criticalAssets = [
            'css/styles.css',
            'css/themes.css',
            'js/main.js',
            'js/news-api.js'
        ];
        
        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = asset;
            link.as = asset.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    destroy() {
        this.isDestroyed = true;
        
        // Cancel any pending animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Remove splash screen element
        if (this.splashElement && this.splashElement.parentNode) {
            this.splashElement.parentNode.removeChild(this.splashElement);
        }
        
        // Clear references
        this.splashElement = null;
        this.progressBar = null;
        this.statusText = null;
        this.particles = [];
        
        // Dispatch completion event
        document.dispatchEvent(new CustomEvent('splashScreenComplete', {
            detail: { 
                loadTime: Date.now() - this.loadStartTime,
                performance: {
                    particleCount: this.particleCount,
                    isLowEndDevice: this.detectLowEndDevice()
                }
            }
        }));
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only create splash screen if not already created
    if (!document.getElementById('splash-screen-3d')) {
        const splashScreen = new SplashScreen3D();
        
        // Global reference for manual control if needed
        window.splashScreen3D = splashScreen;
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden && window.splashScreen3D) {
        // Pause animations when page is hidden
        window.splashScreen3D.splashElement?.style.setProperty('animation-play-state', 'paused');
    } else if (!document.hidden && window.splashScreen3D) {
        // Resume animations when page is visible
        window.splashScreen3D.splashElement?.style.setProperty('animation-play-state', 'running');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SplashScreen3D;
}