/**
 * BRIGHTLENS NEWS - ULTRA MODERN 3D SPLASH SCREEN SYSTEM
 * Revolutionary splash screen with advanced 3D animations
 * Cross-page session management with smooth transitions
 * Optimized for performance and accessibility
 */

class BrightLensModernSplash {
    constructor() {
        this.splashElement = null;
        this.displayDuration = 4000; // 4 seconds as requested
        this.sessionKey = 'brightlens_modern_splash_shown';
        this.isDestroyed = false;
        this.animationId = null;
        
        // Performance optimization flags
        this.useGPUAcceleration = this.checkGPUSupport();
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        console.log('🚀 BrightLens Modern Splash - Initializing...');
        this.init();
    }

    checkGPUSupport() {
        // Check for WebGL support for better performance
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    }

    init() {
        // Check if splash should be shown on this page load
        if (this.shouldShowSplash()) {
            console.log('✨ BrightLens - Creating ultra-modern splash screen');
            this.createModernSplash();
            this.markSplashShown();
            this.startAutoHide();
        } else {
            console.log('🎯 BrightLens - Splash already shown this session, skipping');
            this.enablePageContent();
        }
    }

    shouldShowSplash() {
        // Check if splash was already shown in this session
        const hasShown = sessionStorage.getItem(this.sessionKey);
        
        // Also check if user is navigating back/forward (don't show splash)
        const navigationType = performance.getEntriesByType('navigation')[0]?.type;
        if (navigationType === 'back_forward') {
            return false;
        }
        
        return !hasShown;
    }

    markSplashShown() {
        sessionStorage.setItem(this.sessionKey, Date.now().toString());
        console.log('💾 Splash session marked');
    }

    createModernSplash() {
        // Remove any existing splash
        this.removePreviousSplash();
        
        // Prevent page scrolling
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Create the main splash container
        this.splashElement = document.createElement('div');
        this.splashElement.className = 'brightlens-splash';
        
        // Add performance optimizations
        if (this.useGPUAcceleration) {
            this.splashElement.style.transform = 'translateZ(0)';
        }
        
        // Create the splash content with all elements
        this.splashElement.innerHTML = this.createSplashHTML();
        
        // Insert at the very beginning of body
        document.body.insertBefore(this.splashElement, document.body.firstChild);
        
        // Force reflow for smooth animation start
        this.splashElement.offsetHeight;
        
        console.log('🎨 Modern splash screen created with advanced animations');
        
        // Start particle animation if supported
        if (!this.reducedMotion && this.useGPUAcceleration) {
            this.startAdvancedAnimations();
        }
    }

    createSplashHTML() {
        return `
            <!-- Orbital ring decorations -->
            <div class="brightlens-orbitals">
                <div class="brightlens-orbital"></div>
                <div class="brightlens-orbital"></div>
                <div class="brightlens-orbital"></div>
            </div>
            
            <!-- Main logo container -->
            <div class="brightlens-logo-container">
                <h1 class="brightlens-logo">BRIGHTLENS NEWS</h1>
                <p class="brightlens-subtitle">Your Window to the World</p>
            </div>
            
            <!-- Futuristic loading system -->
            <div class="brightlens-loading">
                <div class="brightlens-progress">
                    <div class="brightlens-progress-fill"></div>
                </div>
                <div class="brightlens-loading-text">Initializing...</div>
            </div>
        `;
    }

    startAdvancedAnimations() {
        // Update loading text dynamically
        const loadingText = this.splashElement.querySelector('.brightlens-loading-text');
        const loadingSteps = [
            'Initializing...',
            'Loading Assets...',
            'Preparing Interface...',
            'Almost Ready...'
        ];
        
        let stepIndex = 0;
        const updateInterval = setInterval(() => {
            if (stepIndex < loadingSteps.length && loadingText) {
                loadingText.textContent = loadingSteps[stepIndex];
                stepIndex++;
            } else {
                clearInterval(updateInterval);
            }
        }, 1000);
        
        // Store interval for cleanup
        this.loadingInterval = updateInterval;
    }

    startAutoHide() {
        if (this.isDestroyed) return;
        
        // Auto-hide after display duration
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.hideSplash();
            }
        }, this.displayDuration);
    }

    hideSplash() {
        if (this.isDestroyed || !this.splashElement) return;
        
        console.log('🎭 Hiding modern splash with smooth transition');
        
        // Clear any ongoing animations
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }
        
        // Add hidden class for CSS transition
        this.splashElement.classList.add('hidden');
        
        // Remove from DOM after transition
        setTimeout(() => {
            this.destroySplash();
        }, 1200); // Match CSS transition duration
    }

    destroySplash() {
        if (this.isDestroyed) return;
        
        try {
            // Clean up DOM
            if (this.splashElement && this.splashElement.parentNode) {
                this.splashElement.parentNode.removeChild(this.splashElement);
            }
            
            // Restore page scrolling
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            
            // Mark as destroyed
            this.splashElement = null;
            this.isDestroyed = true;
            
            // Enable page content
            this.enablePageContent();
            
            console.log('🏁 Modern splash screen removed successfully');
            
            // Dispatch completion event
            document.dispatchEvent(new CustomEvent('brightlensSplashComplete', {
                detail: { 
                    timestamp: Date.now(),
                    duration: this.displayDuration 
                }
            }));
            
        } catch (error) {
            console.error('❌ Error removing splash screen:', error);
            this.enablePageContent(); // Ensure page is usable
        }
    }

    enablePageContent() {
        // Ensure page content is visible and interactive
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        // Remove any splash-related classes from body
        document.body.classList.remove('splash-active');
        
        // Optimize page performance after splash
        this.optimizePagePerformance();
    }

    optimizePagePerformance() {
        // Remove will-change properties to free up GPU memory
        requestAnimationFrame(() => {
            const elements = document.querySelectorAll('[style*="will-change"]');
            elements.forEach(el => {
                el.style.willChange = 'auto';
            });
        });
    }

    removePreviousSplash() {
        // Remove any existing splash screens with different class names
        const existingSplashes = document.querySelectorAll(
            '.splash-screen, .brightlens-splash, .old-splash'
        );
        existingSplashes.forEach(splash => splash.remove());
    }

    // Public methods for external control
    forceHide() {
        console.log('🔧 Force hiding splash screen');
        this.hideSplash();
    }

    forceShow() {
        console.log('🔧 Force showing splash screen');
        this.clearSession();
        this.init();
    }

    clearSession() {
        sessionStorage.removeItem(this.sessionKey);
        console.log('🔄 Splash session cleared');
    }

    hasShown() {
        return !!sessionStorage.getItem(this.sessionKey);
    }
}

/**
 * CROSS-PAGE NAVIGATION MANAGER
 * Handles splash screen for page navigation
 */
class BrightLensNavigationManager {
    constructor() {
        this.init();
    }

    init() {
        // Only handle internal navigation
        this.setupInternalNavigation();
        
        // Handle browser back/forward
        window.addEventListener('popstate', this.handlePopState.bind(this));
        
        console.log('🧭 Navigation manager initialized');
    }

    setupInternalNavigation() {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link || !this.isInternalLink(link)) return;
            
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#')) return;
            
            // For same-domain navigation, show splash for different pages
            const currentPath = window.location.pathname;
            const targetPath = this.getTargetPath(href);
            
            if (currentPath !== targetPath && this.shouldShowSplashForNavigation()) {
                event.preventDefault();
                this.navigateWithSplash(href);
            }
        });
    }

    isInternalLink(link) {
        const href = link.getAttribute('href');
        if (!href) return false;
        
        // Skip external links, mailto, tel, etc.
        if (href.startsWith('http') && !href.includes(window.location.hostname)) {
            return false;
        }
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            return false;
        }
        
        return true;
    }

    getTargetPath(href) {
        try {
            const url = new URL(href, window.location.origin);
            return url.pathname;
        } catch {
            return href;
        }
    }

    shouldShowSplashForNavigation() {
        // Show splash for navigation if it's been a while since last splash
        const lastShown = sessionStorage.getItem('brightlens_modern_splash_shown');
        if (!lastShown) return true;
        
        const timeSinceLastSplash = Date.now() - parseInt(lastShown);
        const fiveMinutes = 5 * 60 * 1000;
        
        // Show splash again if more than 5 minutes have passed
        return timeSinceLastSplash > fiveMinutes;
    }

    navigateWithSplash(url) {
        console.log(`🌊 Navigating with splash to: ${url}`);
        
        // Clear session to ensure splash shows
        sessionStorage.removeItem('brightlens_modern_splash_shown');
        
        // Create splash and navigate
        const splash = new BrightLensModernSplash();
        
        // Navigate after a brief delay
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    handlePopState() {
        // Don't show splash for browser back/forward navigation
        console.log('🔄 Browser navigation detected, no splash');
    }
}

/**
 * SESSION AND LIFECYCLE MANAGEMENT
 */
class BrightLensSessionManager {
    static clearSession() {
        sessionStorage.removeItem('brightlens_modern_splash_shown');
        console.log('🗑️ Splash session cleared manually');
    }
    
    static hasShownSplash() {
        return !!sessionStorage.getItem('brightlens_modern_splash_shown');
    }
    
    static getLastShownTime() {
        const timestamp = sessionStorage.getItem('brightlens_modern_splash_shown');
        return timestamp ? new Date(parseInt(timestamp)) : null;
    }
    
    static resetOnNewSession() {
        // Clear splash session for new browser sessions
        if (!sessionStorage.getItem('brightlens_session_id')) {
            sessionStorage.setItem('brightlens_session_id', Date.now().toString());
            sessionStorage.removeItem('brightlens_modern_splash_shown');
            console.log('🆕 New session detected, splash reset');
        }
    }
}

/**
 * INITIALIZATION AND GLOBAL SETUP
 */
function initializeBrightLensSplash() {
    console.log('🎬 BrightLens Modern Splash System - Starting initialization');
    
    // Reset session if needed
    BrightLensSessionManager.resetOnNewSession();
    
    // Create splash screen instance
    const splash = new BrightLensModernSplash();
    
    // Initialize navigation manager
    const navigationManager = new BrightLensNavigationManager();
    
    // Global API for debugging and control
    window.BrightLensSplash = {
        clearSession: BrightLensSessionManager.clearSession,
        forceShow: () => splash.forceShow(),
        forceHide: () => splash.forceHide(),
        hasShown: BrightLensSessionManager.hasShownSplash,
        getLastShown: BrightLensSessionManager.getLastShownTime,
        instance: splash
    };
    
    console.log('✅ BrightLens Modern Splash System - Fully initialized');
}

/**
 * PAGE LIFECYCLE EVENTS
 */
document.addEventListener('DOMContentLoaded', initializeBrightLensSplash);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👁️ Page hidden');
    } else {
        console.log('👁️ Page visible');
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    console.log('🚪 Page unloading');
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BrightLensModernSplash,
        BrightLensNavigationManager,
        BrightLensSessionManager
    };
}

console.log('📦 BrightLens Modern Splash module loaded successfully');