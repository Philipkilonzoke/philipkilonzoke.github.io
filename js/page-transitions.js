/**
 * Page Transitions with 3D Splash Screen
 * Provides smooth navigation experience between pages
 */

class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.prefetchedPages = new Set();
        
        this.init();
    }

    init() {
        this.setupPageTransitions();
        this.setupPagePrefetching();
        this.setupBrowserNavigation();
    }

    setupPageTransitions() {
        // Intercept internal navigation links
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            
            if (!link || this.isTransitioning) return;
            
            const href = link.getAttribute('href');
            
            // Only handle internal links
            if (this.isInternalLink(href)) {
                event.preventDefault();
                this.navigateWithTransition(href);
            }
        });
    }

    setupPagePrefetching() {
        // Prefetch pages on hover for instant loading
        document.addEventListener('mouseenter', (event) => {
            const link = event.target.closest('a');
            
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            if (this.isInternalLink(href) && !this.prefetchedPages.has(href)) {
                this.prefetchPage(href);
            }
        }, true);
    }

    setupBrowserNavigation() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.navigateWithTransition(event.state.page, false);
            }
        });
        
        // Store initial state
        history.replaceState({ page: window.location.pathname }, document.title, window.location.pathname);
    }

    async navigateWithTransition(href, updateHistory = true) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        try {
            // Show splash screen
            const splashScreen = new SplashScreen3D();
            
            // Prefetch the page if not already done
            if (!this.prefetchedPages.has(href)) {
                await this.prefetchPage(href);
            }
            
            // Wait for minimum splash duration for smooth UX
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Navigate to the new page
            if (updateHistory) {
                history.pushState({ page: href }, '', href);
            }
            
            window.location.href = href;
            
        } catch (error) {
            console.error('Navigation failed:', error);
            // Fallback to normal navigation
            window.location.href = href;
        } finally {
            this.isTransitioning = false;
        }
    }

    async prefetchPage(href) {
        try {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
            
            this.prefetchedPages.add(href);
            
            console.log(`Prefetched: ${href}`);
        } catch (error) {
            console.error(`Failed to prefetch ${href}:`, error);
        }
    }

    isInternalLink(href) {
        if (!href) return false;
        
        // Skip external links, anchors, and special protocols
        if (href.startsWith('#') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            href.startsWith('http://') ||
            href.startsWith('https://')) {
            return false;
        }
        
        // Include relative links and absolute paths on same origin
        return href.startsWith('/') || 
               href.startsWith('./') || 
               href.startsWith('../') ||
               href.endsWith('.html');
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page transitions only if we have splash screen support
    if (typeof SplashScreen3D !== 'undefined') {
        window.pageTransitions = new PageTransitions();
    }
    
    // Initialize performance optimizations
    window.loadingPerformance = new LoadingPerformance();
    window.performanceMonitor = new PerformanceMonitor();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        PageTransitions, 
        LoadingPerformance, 
        PerformanceMonitor 
    };
}