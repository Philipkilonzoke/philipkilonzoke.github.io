/**
 * BrightLens News Enhanced 3D Splash Screen Manager
 * Handles the advanced 3D logo animation and immersive loading experience
 * with holographic effects and particle systems
 */

class SplashScreen3D {
    constructor() {
        this.splashElement = null;
        this.progressBar = null;
        this.particles = [];
        this.scanLine = null;
        this.isAnimating = false;
        this.loadStartTime = Date.now();
        this.minDisplayTime = 3000; // Minimum time to show splash screen
        this.maxDisplayTime = 6000; // Maximum time before auto-hide
        this.progressSpeed = 1;
        this.particleCount = window.innerWidth < 768 ? 20 : 35; // More particles for better effect
        
        this.init();
    }

    init() {
        this.createSplashScreen();
        this.createAdvancedParticles();
        this.createHolographicEffects();
        this.startLoadingAnimation();
        this.setupPerformanceOptimizations();
        this.setupInteractivity();
    }

    createSplashScreen() {
        // Remove existing loading screens
        const existingScreens = document.querySelectorAll('#loading-screen, .loading-screen');
        existingScreens.forEach(screen => {
            screen.style.display = 'none';
        });

        // Create new enhanced 3D splash screen
        this.splashElement = document.createElement('div');
        this.splashElement.id = 'splash-screen-3d';
        this.splashElement.className = 'splash-screen-3d';
        
        this.splashElement.innerHTML = `
            <div class="splash-logo-container">
                <img src="assets/brightlens-3d-logo.svg" alt="BrightLens News" class="splash-logo-3d" />
                <div class="splash-text">
                    <h1 class="splash-title">BrightLens News</h1>
                    <p class="splash-subtitle">Immersive News Experience Loading...</p>
                    <div class="splash-status">
                        <span class="status-text">Initializing systems...</span>
                        <div class="status-dots">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
                <div class="splash-progress">
                    <div class="splash-progress-bar"></div>
                    <div class="progress-percentage">0%</div>
                </div>
            </div>
            <div class="splash-particles"></div>
            <div class="holographic-overlay"></div>
        `;

        document.body.appendChild(this.splashElement);
        this.progressBar = this.splashElement.querySelector('.splash-progress-bar');
        this.progressPercentage = this.splashElement.querySelector('.progress-percentage');
        this.statusText = this.splashElement.querySelector('.status-text');
    }

    createAdvancedParticles() {
        const particlesContainer = this.splashElement.querySelector('.splash-particles');
        
        // Create different types of particles
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and properties
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (8 + Math.random() * 6) + 's';
            
            // Add different particle types based on index
            if (i % 5 === 0) {
                particle.classList.add('particle-large');
            } else if (i % 3 === 0) {
                particle.classList.add('particle-glow');
            }
            
            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }

        // Create floating geometric shapes
        this.createGeometricShapes(particlesContainer);
    }

    createGeometricShapes(container) {
        const shapes = ['triangle', 'hexagon', 'diamond'];
        for (let i = 0; i < 6; i++) {
            const shape = document.createElement('div');
            shape.className = `geometric-shape ${shapes[i % shapes.length]}`;
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.animationDelay = Math.random() * 10 + 's';
            container.appendChild(shape);
        }
    }

    createHolographicEffects() {
        // Add holographic overlay effects
        const overlay = this.splashElement.querySelector('.holographic-overlay');
        
        // Create scanning beam effect
        const scanBeam = document.createElement('div');
        scanBeam.className = 'scan-beam';
        overlay.appendChild(scanBeam);
        
        // Create data stream effects
        for (let i = 0; i < 3; i++) {
            const dataStream = document.createElement('div');
            dataStream.className = 'data-stream';
            dataStream.style.left = (20 + i * 30) + '%';
            dataStream.style.animationDelay = i * 2 + 's';
            overlay.appendChild(dataStream);
        }
    }

    startLoadingAnimation() {
        this.isAnimating = true;
        
        // Start enhanced progress animation
        this.animateEnhancedProgress();
        
        // Auto-hide after max time
        setTimeout(() => {
            if (this.isAnimating) {
                this.hide();
            }
        }, this.maxDisplayTime);
    }

    animateEnhancedProgress() {
        let progress = 0;
        const duration = 4000; // 4 seconds for progress
        const startTime = Date.now();
        const stages = [
            { progress: 15, text: "Loading neural networks...", duration: 800 },
            { progress: 35, text: "Connecting to news sources...", duration: 1000 },
            { progress: 55, text: "Processing data streams...", duration: 800 },
            { progress: 75, text: "Optimizing user experience...", duration: 700 },
            { progress: 90, text: "Finalizing holographic interface...", duration: 500 },
            { progress: 100, text: "Welcome to the future of news!", duration: 200 }
        ];
        
        let currentStage = 0;
        let stageStartTime = startTime;
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const totalProgress = Math.min((elapsed / duration) * 100, 100);
            
            // Update stage-based progress
            if (currentStage < stages.length) {
                const stage = stages[currentStage];
                const stageElapsed = Date.now() - stageStartTime;
                
                if (stageElapsed >= stage.duration) {
                    currentStage++;
                    stageStartTime = Date.now();
                    if (this.statusText && currentStage < stages.length) {
                        this.statusText.textContent = stages[currentStage].text;
                    }
                }
                
                progress = Math.min(stage.progress, totalProgress);
            }
            
            // Update progress bar and percentage
            if (this.progressBar) {
                this.progressBar.style.width = progress + '%';
            }
            if (this.progressPercentage) {
                this.progressPercentage.textContent = Math.floor(progress) + '%';
            }
            
            // Add shake effect at certain milestones
            if (Math.floor(progress) === 50 || Math.floor(progress) === 100) {
                this.addShakeEffect();
            }
            
            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                this.onLoadingComplete();
            }
        };
        
        requestAnimationFrame(updateProgress);
    }

    addShakeEffect() {
        const logo = this.splashElement.querySelector('.splash-logo-3d');
        if (logo) {
            logo.style.animation = 'logoShake 0.5s ease-in-out';
            setTimeout(() => {
                logo.style.animation = '';
            }, 500);
        }
    }

    onLoadingComplete() {
        if (this.statusText) {
            this.statusText.textContent = "System ready!";
        }
        
        // Add completion effects
        this.addCompletionEffects();
        
        // Auto-hide after a short delay
        setTimeout(() => {
            this.hide();
        }, 1000);
    }

    addCompletionEffects() {
        // Create burst effect
        const burst = document.createElement('div');
        burst.className = 'completion-burst';
        this.splashElement.appendChild(burst);
        
        // Create success ripple
        const ripple = document.createElement('div');
        ripple.className = 'success-ripple';
        this.splashElement.appendChild(ripple);
        
        // Remove effects after animation
        setTimeout(() => {
            if (burst.parentNode) burst.parentNode.removeChild(burst);
            if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 2000);
    }

    setupInteractivity() {
        // Add click to skip functionality
        this.splashElement.addEventListener('click', () => {
            if (this.isAnimating) {
                this.hide();
            }
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Escape' || e.key === ' ') && this.isAnimating) {
                this.hide();
            }
        });
        
        // Add skip button
        const skipButton = document.createElement('button');
        skipButton.className = 'splash-skip-button';
        skipButton.innerHTML = '<i class="fas fa-forward"></i> Skip';
        skipButton.addEventListener('click', () => this.hide());
        this.splashElement.appendChild(skipButton);
    }

    hide() {
        if (!this.isAnimating || !this.splashElement) return;
        
        const elapsedTime = Date.now() - this.loadStartTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
        
        setTimeout(() => {
            this.isAnimating = false;
            this.splashElement.classList.add('hidden');
            
            // Trigger page transition effect
            this.triggerPageTransition();
            
            // Remove from DOM after transition
            setTimeout(() => {
                if (this.splashElement && this.splashElement.parentNode) {
                    this.splashElement.parentNode.removeChild(this.splashElement);
                }
                this.cleanup();
                this.onHideComplete();
            }, 1200);
        }, remainingTime);
    }

    triggerPageTransition() {
        document.body.classList.add('page-transition-in');
        setTimeout(() => {
            document.body.classList.remove('page-transition-in');
        }, 1000);
    }

    onHideComplete() {
        // Dispatch custom event for other components
        const event = new CustomEvent('splashScreenHidden', {
            detail: { loadTime: Date.now() - this.loadStartTime }
        });
        document.dispatchEvent(event);
        
        // Start main app animations
        this.startMainAppAnimations();
    }

    startMainAppAnimations() {
        // Animate in main content
        const header = document.querySelector('.header');
        const sidebar = document.querySelector('.sidebar');
        const main = document.querySelector('.main');
        
        if (header) header.classList.add('animate-slide-down');
        if (sidebar) sidebar.classList.add('animate-slide-right');
        if (main) main.classList.add('animate-fade-in');
    }

    cleanup() {
        this.particles = [];
        this.progressBar = null;
        this.progressPercentage = null;
        this.statusText = null;
        this.splashElement = null;
    }

    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalAssets();
        
        // Setup intersection observer for lazy loading
        this.setupLazyLoading();
        
        // Enable hardware acceleration
        this.enableHardwareAcceleration();
        
        // Setup resource monitoring
        this.setupResourceMonitoring();
    }

    preloadCriticalAssets() {
        const criticalAssets = [
            'css/styles.css',
            'css/splash-screen.css',
            'css/themes.css',
            'assets/brightlens-3d-logo.svg',
            'js/main.js'
        ];

        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = asset.endsWith('.css') ? 'style' : asset.endsWith('.js') ? 'script' : 'image';
            link.href = asset;
            document.head.appendChild(link);
        });
    }

    setupLazyLoading() {
        // Enhanced intersection observer with better performance
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.01
        });

        // Apply to images after initial load
        setTimeout(() => {
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }, 1500);
    }

    setupResourceMonitoring() {
        // Monitor resource loading
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
                
                // Report to analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_load_time', {
                        'custom_parameter': loadTime
                    });
                }
            });
        }
    }

    enableHardwareAcceleration() {
        const acceleratedElements = [
            '.splash-screen-3d',
            '.splash-logo-container',
            '.splash-logo-3d',
            '.particle',
            '.geometric-shape',
            '.article-card',
            '.header',
            '.sidebar'
        ];

        acceleratedElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.transform = element.style.transform || 'translateZ(0)';
                element.style.backfaceVisibility = 'hidden';
                element.style.willChange = 'transform';
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
        this.setupMetrics();
    }

    setupCriticalResourceHints() {
        // DNS prefetch for external resources
        const domains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'cdnjs.cloudflare.com',
            'newsapi.org'
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
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        console.log('New version available');
                    });
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
            { rel: 'prefetch', href: '/manifest.json' }
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

    setupMetrics() {
        // Setup Core Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    console.log('LCP:', entry.startTime);
                }
            }).observe({entryTypes: ['largest-contentful-paint']});

            // First Input Delay
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
            }).observe({entryTypes: ['first-input']});
        }
    }
}

/**
 * Initialize everything when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize enhanced 3D splash screen
    const splashScreen = new SplashScreen3D();
    
    // Initialize performance manager
    const performanceManager = new PagePerformanceManager();
    
    // Enhanced page visibility API for better performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, pause non-critical animations
            const animations = document.getAnimations();
            animations.forEach(animation => {
                if (!animation.effect.target.closest('.splash-screen-3d')) {
                    animation.pause();
                }
            });
        } else {
            // Page is visible, resume animations
            const animations = document.getAnimations();
            animations.forEach(animation => animation.play());
        }
    });
    
    // Enhanced auto-hide splash screen when content is ready
    window.addEventListener('load', () => {
        setTimeout(() => {
            splashScreen.hide();
        }, 800);
    });
    
    // Listen for splash screen completion
    document.addEventListener('splashScreenHidden', (e) => {
        console.log(`Splash screen completed in ${e.detail.loadTime}ms`);
        
        // Initialize main app features
        if (typeof initializeMainApp === 'function') {
            initializeMainApp();
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SplashScreen3D, PagePerformanceManager };
}

// Global function to show splash screen on page transitions
window.showSplashScreen = () => {
    new SplashScreen3D();
};