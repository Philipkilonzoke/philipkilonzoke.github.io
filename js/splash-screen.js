/**
 * BrightLens News Modern Splash Screen Manager
 * Clean, professional splash screen with BRIGHTLENS NEWS logo
 */

class SplashScreen3D {
    constructor() {
        this.splashElement = null;
        this.progressBar = null;
        this.loadStartTime = Date.now();
        this.displayDuration = 4000; // 4 seconds as requested
        this.animationFrameId = null;
        this.isDestroyed = false;
        this.currentProgress = 0;
        this.progressSpeed = 25; // Progress increment per frame (100/4 = 25% per second)
        
        this.init();
    }

    init() {
        this.createSplashScreen();
        this.startProgressAnimation();
        this.setupAutoHide();
    }

    createSplashScreen() {
        // Remove any existing splash screen
        const existingSplash = document.querySelector('.splash-screen-3d');
        if (existingSplash) {
            existingSplash.remove();
        }

        // Create splash screen container
        this.splashElement = document.createElement('div');
        this.splashElement.className = 'splash-screen-3d';
        
        // Create logo container
        const logoContainer = document.createElement('div');
        logoContainer.className = 'splash-logo-container';
        
        // Create logo image
        const logo = document.createElement('img');
        logo.src = 'assets/brightlens-splash-logo.svg';
        logo.alt = 'BrightLens News';
        logo.className = 'splash-logo';
        logo.loading = 'eager';
        
        // Create progress container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'splash-progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'splash-progress-bar';
        
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'splash-progress-fill';
        
        const loadingText = document.createElement('div');
        loadingText.className = 'splash-loading-text';
        loadingText.textContent = 'Loading...';
        
        // Assemble elements
        progressBar.appendChild(this.progressBar);
        progressContainer.appendChild(progressBar);
        logoContainer.appendChild(logo);
        logoContainer.appendChild(progressContainer);
        logoContainer.appendChild(loadingText);
        this.splashElement.appendChild(logoContainer);
        
        // Add to page
        document.body.appendChild(this.splashElement);
        
        // Force reflow to ensure smooth animation
        this.splashElement.offsetHeight;
    }

    startProgressAnimation() {
        const animate = () => {
            if (this.isDestroyed) return;
            
            const elapsed = Date.now() - this.loadStartTime;
            const progress = Math.min((elapsed / this.displayDuration) * 100, 100);
            
            this.updateProgress(progress);
            
            if (progress < 100) {
                this.animationFrameId = requestAnimationFrame(animate);
            }
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
    }

    updateProgress(progress) {
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
        this.currentProgress = progress;
    }

    setupAutoHide() {
        setTimeout(() => {
            this.hide();
        }, this.displayDuration);
    }

    hide() {
        if (this.isDestroyed || !this.splashElement) return;
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Add hidden class for smooth transition
        this.splashElement.classList.add('hidden');
        
        // Remove element after transition
        setTimeout(() => {
            this.destroy();
        }, 1500); // Match transition duration in CSS
    }

    destroy() {
        if (this.isDestroyed) return;
        
        this.isDestroyed = true;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this.splashElement && this.splashElement.parentNode) {
            this.splashElement.parentNode.removeChild(this.splashElement);
        }
        
        this.splashElement = null;
        this.progressBar = null;
        
        // Dispatch custom event to notify that splash screen is complete
        document.dispatchEvent(new CustomEvent('splashScreenComplete'));
    }

    // Static method to create and show splash screen
    static show() {
        return new SplashScreen3D();
    }
}

// Utility function to show splash screen on any page
function showSplashScreen() {
    // Only show if not already showing
    if (!document.querySelector('.splash-screen-3d')) {
        return SplashScreen3D.show();
    }
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        showSplashScreen();
    });
} else {
    showSplashScreen();
}

// Export for manual control if needed
window.SplashScreen3D = SplashScreen3D;
window.showSplashScreen = showSplashScreen;