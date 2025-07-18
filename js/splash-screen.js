/**
 * BrightLens News Modern Splash Screen Manager
 * Displays a 3D animated splash screen for 4 seconds on first visit
 * Handles session storage for preventing repeated shows
 */

class BrightLensSplashScreen {
    constructor() {
        this.splashElement = null;
        this.displayDuration = 4000; // 4 seconds as requested
        this.sessionKey = 'brightlens_splash_shown';
        this.isDestroyed = false;
        
        // Initialize splash screen
        this.init();
    }

    init() {
        // Check if splash should be shown
        if (this.shouldShowSplash()) {
            console.log('🌟 BrightLens News - Initializing splash screen');
            this.createSplashScreen();
            this.markSplashShown();
            this.startAutoHide();
        } else {
            console.log('🚀 BrightLens News - Splash already shown this session');
        }
    }

    shouldShowSplash() {
        // Check session storage to prevent repeated shows in same session
        return !sessionStorage.getItem(this.sessionKey);
    }

    markSplashShown() {
        // Mark splash as shown for this session
        sessionStorage.setItem(this.sessionKey, 'true');
    }

    createSplashScreen() {
        // Remove any existing splash screen
        const existingSplash = document.querySelector('.splash-screen');
        if (existingSplash) {
            existingSplash.remove();
        }

        // Create splash screen container
        this.splashElement = document.createElement('div');
        this.splashElement.className = 'splash-screen';
        
        // Optimize for smooth animations
        this.splashElement.style.cssText += `
            will-change: opacity, transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        `;
        
        // Create splash content
        this.splashElement.innerHTML = `
            <div class="splash-decoration"></div>
            <div class="splash-logo-container">
                <h1 class="splash-logo">BRIGHTLENS NEWS</h1>
                <p class="splash-subtitle">Your Window to the World</p>
            </div>
            <div class="splash-loading">
                <div class="splash-progress">
                    <div class="splash-progress-fill"></div>
                </div>
                <div class="splash-loading-text">Loading...</div>
            </div>
        `;

        // Add to DOM with smooth entry
        document.body.appendChild(this.splashElement);
        
        // Prevent scrolling while splash is visible
        document.body.style.overflow = 'hidden';
        
        // Force a reflow to ensure smooth animation start
        this.splashElement.offsetHeight;
        
        console.log('✨ Splash screen created and displayed');
    }

    startAutoHide() {
        if (this.isDestroyed) return;
        
        // Hide splash screen after display duration
        setTimeout(() => {
            this.hideSplash();
        }, this.displayDuration);
    }

    hideSplash() {
        if (this.isDestroyed || !this.splashElement) return;
        
        console.log('🎭 Hiding splash screen with fade-out effect');
        
        // Prepare for smooth fade-out
        this.splashElement.style.willChange = 'opacity, transform';
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            // Add hidden class for smooth fade-out
            this.splashElement.classList.add('hidden');
        });
        
        // Remove splash screen from DOM after transition
        setTimeout(() => {
            this.destroySplash();
        }, 1000); // Match CSS transition duration
    }

    destroySplash() {
        if (this.isDestroyed) return;
        
        try {
            if (this.splashElement && this.splashElement.parentNode) {
                // Clean up will-change property before removal
                this.splashElement.style.willChange = 'auto';
                this.splashElement.parentNode.removeChild(this.splashElement);
            }
            
            // Restore scrolling
            document.body.style.overflow = '';
            
            this.splashElement = null;
            this.isDestroyed = true;
            
            console.log('🏁 Splash screen removed successfully');
            
            // Dispatch custom event for any listeners
            document.dispatchEvent(new CustomEvent('splashScreenHidden'));
            
        } catch (error) {
            console.error('❌ Error removing splash screen:', error);
        }
    }

    // Public method to manually hide splash (if needed)
    forceHide() {
        this.hideSplash();
    }
}

// Enhanced Page Navigation Manager
class PageNavigationManager {
    constructor() {
        this.init();
    }

    init() {
        // Handle all internal navigation
        this.setupNavigationHandlers();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', this.handlePopState.bind(this));
        
        console.log('🧭 Page navigation manager initialized');
    }

    setupNavigationHandlers() {
        // Handle all internal links
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return; // Skip anchors, mailto, tel links
            }
            
            // Check if it's an internal link
            if (this.isInternalLink(href)) {
                event.preventDefault();
                this.navigateWithSplash(href);
            }
        });
    }

    isInternalLink(href) {
        // Check if it's a relative link or same domain
        if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
            return true;
        }
        
        try {
            const url = new URL(href, window.location.origin);
            return url.origin === window.location.origin;
        } catch {
            return false;
        }
    }

    navigateWithSplash(url) {
        // Only show splash if it's a different page
        const currentPath = window.location.pathname;
        const targetPath = new URL(url, window.location.origin).pathname;
        
        if (currentPath !== targetPath) {
            console.log(`🌊 Navigating with splash to: ${url}`);
            
            // Clear session to show splash on navigation
            sessionStorage.removeItem('brightlens_splash_shown');
            
            // Use requestAnimationFrame for smooth navigation
            requestAnimationFrame(() => {
                // Create and show splash screen
                const splash = new BrightLensSplashScreen();
                
                // Navigate after ensuring splash is rendered
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        window.location.href = url;
                    }, 200); // Slight delay for smooth transition
                });
            });
        } else {
            // Same page, navigate directly
            window.location.href = url;
        }
    }

    handlePopState(event) {
        // Show splash on browser back/forward if it's a different page
        const splash = new BrightLensSplashScreen();
    }
}

// Session Management for Cross-Page Splash Control
class SplashSessionManager {
    static clearSession() {
        sessionStorage.removeItem('brightlens_splash_shown');
        console.log('🔄 Splash session cleared');
    }
    
    static hasShownSplash() {
        return !!sessionStorage.getItem('brightlens_splash_shown');
    }
    
    static resetOnNewTab() {
        // Clear splash session when opening in new tab
        if (document.referrer === '') {
            sessionStorage.removeItem('brightlens_splash_shown');
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BrightLens News - DOM loaded, initializing splash system');
    
    // Reset splash session for new tabs
    SplashSessionManager.resetOnNewTab();
    
    // Create splash screen instance
    const splashScreen = new BrightLensSplashScreen();
    
    // Initialize navigation manager
    const navigationManager = new PageNavigationManager();
    
    // Global access for debugging
    window.BrightLensSplash = {
        clearSession: SplashSessionManager.clearSession,
        forceShow: () => {
            SplashSessionManager.clearSession();
            new BrightLensSplashScreen();
        },
        hasShown: SplashSessionManager.hasShownSplash
    };
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        console.log('👁️ Page hidden');
    } else {
        // Page is visible
        console.log('👁️ Page visible');
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BrightLensSplashScreen,
        PageNavigationManager,
        SplashSessionManager
    };
}

console.log('📦 BrightLens Splash Screen module loaded successfully');