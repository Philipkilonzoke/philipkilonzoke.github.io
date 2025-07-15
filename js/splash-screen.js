/**
 * BrightLens News 3D Splash Screen Manager
 * Handles the advanced 3D logo animation and loading experience
 */

class SplashScreen3D {
    constructor() {
        this.splashElement = null;
        this.progressBar = null;
        this.particles = [];
        this.isAnimating = false;
        this.loadStartTime = Date.now();
        this.minDisplayTime = 2500; // Minimum time to show splash screen
        this.maxDisplayTime = 5000; // Maximum time before auto-hide
        
        this.init();
    }

    init() {
        this.createSplashScreen();
        this.createParticles();
        this.startLoadingAnimation();
        this.setupPerformanceOptimizations();
    }

    createSplashScreen() {
        // Remove existing loading screen if present
        const existingScreen = document.getElementById('loading-screen');
        if (existingScreen) {
            existingScreen.style.display = 'none';
        }

        // Create new 3D splash screen
        this.splashElement = document.createElement('div');
        this.splashElement.id = 'splash-screen-3d';
        this.splashElement.className = 'splash-screen-3d';
        
        this.splashElement.innerHTML = `
            <div class="splash-logo-container">
                <img src="assets/brightlens-3d-logo.svg" alt="BrightLens News" class="splash-logo-3d" />
                <div class="splash-text">
                    <h1 class="splash-title">BrightLens News</h1>
                    <p class="splash-subtitle">Loading the latest stories...</p>
                </div>
                <div class="splash-progress">
                    <div class="splash-progress-bar"></div>
                </div>
            </div>
            <div class="splash-particles"></div>
        `;

        document.body.appendChild(this.splashElement);
        this.progressBar = this.splashElement.querySelector('.splash-progress-bar');
    }

    createParticles() {
        const particlesContainer = this.splashElement.querySelector('.splash-particles');
        const particleCount = window.innerWidth < 768 ? 15 : 25; // Fewer particles on mobile

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';
            
            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    startLoadingAnimation() {
        this.isAnimating = true;
        
        // Start progress animation
        this.animateProgress();
        
        // Auto-hide after max time
        setTimeout(() => {
            if (this.isAnimating) {
                this.hide();
            }
        }, this.maxDisplayTime);
    }

    animateProgress() {
        let progress = 0;
        const duration = 2000; // 2 seconds for progress
        const startTime = Date.now();
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            progress = Math.min((elapsed / duration) * 100, 100);
            
            if (this.progressBar) {
                this.progressBar.style.width = progress + '%';
            }
            
            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        requestAnimationFrame(updateProgress);
    }

    hide() {
        if (!this.isAnimating || !this.splashElement) return;
        
        const elapsedTime = Date.now() - this.loadStartTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
        
        setTimeout(() => {
            this.isAnimating = false;
            this.splashElement.classList.add('hidden');
            
            // Remove from DOM after transition
            setTimeout(() => {
                if (this.splashElement && this.splashElement.parentNode) {
                    this.splashElement.parentNode.removeChild(this.splashElement);
                }
                this.cleanup();
            }, 800);
        }, remainingTime);
    }

    cleanup() {
        this.particles = [];
        this.progressBar = null;
        this.splashElement = null;
    }

    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalAssets();
        
        // Setup intersection observer for lazy loading
        this.setupLazyLoading();
        
        // Enable hardware acceleration
        this.enableHardwareAcceleration();
    }

    preloadCriticalAssets() {
        const criticalAssets = [
            'css/styles.css',
            'css/splash-screen.css',
            'assets/brightlens-3d-logo.svg'
        ];

        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = asset.endsWith('.css') ? 'style' : 'image';
            link.href = asset;
            document.head.appendChild(link);
        });
    }

    setupLazyLoading() {
        // Create intersection observer for images
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Apply to images that haven't loaded yet
        setTimeout(() => {
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }, 1000);
    }

    enableHardwareAcceleration() {
        const acceleratedElements = [
            '.splash-screen-3d',
            '.splash-logo-container',
            '.splash-logo-3d',
            '.article-card',
            '.header'
        ];

        acceleratedElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.transform = element.style.transform || 'translateZ(0)';
                element.style.backfaceVisibility = 'hidden';
            });
        });
    }
}

/**
 * Enhanced Page Performance Manager
 */
class PagePerformanceManager {
    constructor() {
        this.setupCriticalResourceHints();
        this.setupServiceWorker();
        this.optimizeImages();
        this.setupResourcePriorities();
    }

    setupCriticalResourceHints() {
        // DNS prefetch for external resources
        const domains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'cdnjs.cloudflare.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    optimizeImages() {
        // Convert images to WebP when supported
        const supportsWebP = () => {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').startsWith('data:image/webp');
        };

        if (supportsWebP()) {
            const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".png"]');
            images.forEach(img => {
                const webpSrc = img.src.replace(/\.(jpg|png)$/, '.webp');
                // Check if WebP version exists (this would be done server-side in production)
                const testImg = new Image();
                testImg.onload = () => {
                    img.src = webpSrc;
                };
                testImg.src = webpSrc;
            });
        }
    }

    setupResourcePriorities() {
        // Set resource hints for better loading
        const resourceHints = [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
            { rel: 'prefetch', href: '/assets/icons/favicon.ico' }
        ];

        resourceHints.forEach(hint => {
            const link = document.createElement('link');
            Object.entries(hint).forEach(([key, value]) => {
                if (key === 'crossorigin' && value === true) {
                    link.crossOrigin = '';
                } else {
                    link[key] = value;
                }
            });
            document.head.appendChild(link);
        });
    }
}

/**
 * Initialize everything when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D splash screen
    const splashScreen = new SplashScreen3D();
    
    // Initialize performance manager
    const performanceManager = new PagePerformanceManager();
    
    // Enhanced page visibility API for better performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, pause animations
            const animations = document.getAnimations();
            animations.forEach(animation => animation.pause());
        } else {
            // Page is visible, resume animations
            const animations = document.getAnimations();
            animations.forEach(animation => animation.play());
        }
    });
    
    // Auto-hide splash screen when content is ready
    window.addEventListener('load', () => {
        setTimeout(() => {
            splashScreen.hide();
        }, 500);
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SplashScreen3D, PagePerformanceManager };
}