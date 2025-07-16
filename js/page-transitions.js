/**
 * Page Transitions with Splash Screen
 * Ensures splash screen appears when navigating between pages
 */

class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigationInterception();
        this.setupInternalLinkHandling();
    }

    setupNavigationInterception() {
        // Override navigation for internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (link && this.isInternalLink(link)) {
                e.preventDefault();
                this.navigateWithSplash(link.href);
            }
        });
    }

    isInternalLink(link) {
        // Check if link is internal to the website
        const href = link.getAttribute('href');
        if (!href) return false;
        
        // Skip external links, anchors, and certain file types
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
            return false;
        }
        
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return false;
        }
        
        if (href.match(/\.(pdf|jpg|jpeg|png|gif|svg|mp4|mp3|zip|doc|docx)$/i)) {
            return false;
        }
        
        // Check if it's a page navigation
        const pageLinks = [
            'index.html', 'technology.html', 'business.html', 'sports.html',
            'entertainment.html', 'health.html', 'lifestyle.html', 'weather.html',
            'settings.html', 'live-tv.html', 'world.html', 'kenya.html',
            'latest.html', 'music.html'
        ];
        
        return pageLinks.some(page => href.includes(page)) || href === '/';
    }

    navigateWithSplash(url) {
        // Show splash screen before navigation
        if (window.showSplashScreen) {
            window.showSplashScreen();
        }
        
        // Navigate after a brief delay to ensure splash screen shows
        setTimeout(() => {
            window.location.href = url;
        }, 100);
    }

    setupInternalLinkHandling() {
        // Handle programmatic navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function(state, title, url) {
            if (url && window.showSplashScreen) {
                window.showSplashScreen();
            }
            return originalPushState.apply(history, arguments);
        };
        
        history.replaceState = function(state, title, url) {
            if (url && window.showSplashScreen) {
                window.showSplashScreen();
            }
            return originalReplaceState.apply(history, arguments);
        };
        
        // Handle back/forward navigation
        window.addEventListener('popstate', () => {
            if (window.showSplashScreen) {
                window.showSplashScreen();
            }
        });
    }
}

/**
 * Enhanced Loading Performance
 */
class LoadingPerformance {
    constructor() {
        this.setupCriticalResourceOptimization();
        this.setupImageOptimization();
        this.setupFontOptimization();
    }

    setupCriticalResourceOptimization() {
        // Optimize critical rendering path
        const criticalCSS = [
            'css/splash-screen.css',
            'css/styles.css'
        ];

        criticalCSS.forEach(css => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = css;
            link.onload = () => {
                link.rel = 'stylesheet';
            };
            document.head.appendChild(link);
        });
    }

    setupImageOptimization() {
        // Implement progressive image loading
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        img.src = src;
        img.removeAttribute('data-src');
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    }

    setupFontOptimization() {
        // Optimize font loading
        if ('fonts' in document) {
            // Use Font Loading API when available
            const fontFamilies = ['Inter'];
            
            fontFamilies.forEach(family => {
                document.fonts.load(`1rem ${family}`).then(() => {
                    document.body.classList.add('fonts-loaded');
                });
            });
        }
    }
}

/**
 * Performance Monitoring
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.setupPerformanceObserver();
        this.trackPageLoad();
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // Track navigation timing
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.recordMetric(entry.name, entry.duration);
                });
            });

            observer.observe({ entryTypes: ['navigation', 'measure'] });
        }
    }

    trackPageLoad() {
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const navigation = performance.getEntriesByType('navigation')[0];
                
                this.metrics = {
                    ...this.metrics,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalTime: navigation.loadEventEnd - navigation.navigationStart
                };

                console.log('Page Performance Metrics:', this.metrics);
            }
        });
    }

    recordMetric(name, value) {
        this.metrics[name] = value;
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize page transitions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PageTransitions();
    });
} else {
    new PageTransitions();
}

// Export for manual use
window.PageTransitions = PageTransitions;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        PageTransitions, 
        LoadingPerformance, 
        PerformanceMonitor 
    };
}