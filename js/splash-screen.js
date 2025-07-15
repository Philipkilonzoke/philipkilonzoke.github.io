/**
 * BrightLens News 3D Splash Screen Manager
 * Handles the advanced 3D logo animation and loading experience
 */

// Modernized 3D Splash Screen
class SplashScreen3D {
    constructor() {
        this.splashElement = null;
        this.minDisplayTime = 2500;
        this.isAnimating = false;
        this.createSplashScreen();
    }
    createSplashScreen() {
        // Remove any existing splash
        if (document.getElementById('splash-screen-3d')) {
            document.getElementById('splash-screen-3d').remove();
        }
        this.splashElement = document.createElement('div');
        this.splashElement.id = 'splash-screen-3d';
        this.splashElement.className = 'splash-screen-3d';
        this.splashElement.innerHTML = `
            <div class="splash-logo-container">
                <img src="assets/brightlens-3d-logo.svg" alt="BrightLens News" class="splash-logo-3d animated-logo" />
                <div class="splash-text">
                    <h1 class="splash-title gradient-text">BrightLens News</h1>
                    <p class="splash-subtitle">Loading the latest stories...</p>
                </div>
                <div class="splash-progress">
                    <div class="splash-progress-bar"></div>
                </div>
                <div class="splash-particles"></div>
            </div>
        `;
        document.body.appendChild(this.splashElement);
        this.progressBar = this.splashElement.querySelector('.splash-progress-bar');
        // Add more dynamic particles
        const particlesContainer = this.splashElement.querySelector('.splash-particles');
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'splash-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = (Math.random() * 2) + 's';
            particle.style.background = `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`;
            particle.style.opacity = 0.7 + Math.random() * 0.3;
            particle.style.width = particle.style.height = (8 + Math.random() * 16) + 'px';
            particlesContainer.appendChild(particle);
        }
        this.isAnimating = true;
        setTimeout(() => this.hide(), this.minDisplayTime + 500);
    }
    setProgress(percent) {
        if (this.progressBar) {
            this.progressBar.style.width = percent + '%';
        }
    }
    hide() {
        if (!this.isAnimating || !this.splashElement) return;
        this.splashElement.classList.add('hidden');
        setTimeout(() => {
            if (this.splashElement && this.splashElement.parentNode) {
                this.splashElement.parentNode.removeChild(this.splashElement);
            }
            this.splashElement = null;
            this.isAnimating = false;
        }, 700);
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
// Auto-initialize splash on every page
window.addEventListener('DOMContentLoaded', () => {
    window.splashScreen = new SplashScreen3D();
    
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
            window.splashScreen.hide();
        }, 500);
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SplashScreen3D, PagePerformanceManager };
}