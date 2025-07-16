/**
 * BrightLens News Modern Splash Screen Manager
 * Clean, professional splash screen with BRIGHTLENS NEWS logo
 */

class SplashScreen3D {
    constructor() {
        console.log('🎬 BrightLens Splash Screen initializing...');
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
        console.log('🚀 Creating splash screen elements...');
        this.createSplashScreen();
        this.startProgressAnimation();
        this.setupAutoHide();
    }

    createSplashScreen() {
        // Remove any existing splash screen
        const existingSplash = document.querySelector('.splash-screen-3d');
        if (existingSplash) {
            existingSplash.remove();
            console.log('🗑️ Removed existing splash screen');
        }

        // Create splash screen container
        this.splashElement = document.createElement('div');
        this.splashElement.className = 'splash-screen-3d';
        this.splashElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 30%, #3b82f6 70%, #60a5fa 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            perspective: 1000px;
            transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        // Create logo container
        const logoContainer = document.createElement('div');
        logoContainer.className = 'splash-logo-container';
        logoContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            animation: logoEntrance 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            transform: translateY(30px);
            opacity: 0;
        `;
        
        // Create logo image
        const logo = document.createElement('img');
        logo.src = 'assets/brightlens-splash-logo.svg';
        logo.alt = 'BrightLens News';
        logo.className = 'splash-logo';
        logo.loading = 'eager';
        logo.style.cssText = `
            width: min(400px, 90vw);
            height: auto;
            max-width: 400px;
            filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3));
            animation: logoFloat 3s ease-in-out infinite;
        `;
        
        // Handle logo load/error
        logo.onload = () => {
            console.log('✅ Splash screen logo loaded successfully');
        };
        logo.onerror = () => {
            console.error('❌ Failed to load splash screen logo');
            // Create fallback text logo
            const fallbackLogo = document.createElement('div');
            fallbackLogo.innerHTML = `
                <h1 style="color: white; font-size: 3rem; font-weight: 800; text-shadow: 0 4px 20px rgba(0,0,0,0.5); margin: 0;">
                    🔍 BRIGHTLENS<br>
                    <span style="font-size: 2rem;">NEWS</span>
                </h1>
            `;
            logo.parentNode.replaceChild(fallbackLogo, logo);
        };
        
        // Create progress container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'splash-progress-container';
        progressContainer.style.cssText = `
            margin-top: 40px;
            width: min(300px, 80vw);
            position: relative;
        `;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'splash-progress-bar';
        progressBar.style.cssText = `
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            backdrop-filter: blur(10px);
        `;
        
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'splash-progress-fill';
        this.progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #ffd43b 0%, #fab005 50%, #fd7e14 100%);
            border-radius: 10px;
            width: 0%;
            transition: width 0.3s ease;
            position: relative;
            box-shadow: 0 0 20px rgba(253, 126, 20, 0.5);
        `;
        
        const loadingText = document.createElement('div');
        loadingText.className = 'splash-loading-text';
        loadingText.textContent = 'Loading...';
        loadingText.style.cssText = `
            color: rgba(255, 255, 255, 0.9);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 16px;
            font-weight: 500;
            margin-top: 20px;
            animation: textPulse 2s ease-in-out infinite;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        `;
        
        // Assemble elements
        progressBar.appendChild(this.progressBar);
        progressContainer.appendChild(progressBar);
        logoContainer.appendChild(logo);
        logoContainer.appendChild(progressContainer);
        logoContainer.appendChild(loadingText);
        this.splashElement.appendChild(logoContainer);
        
        // Add to page
        document.body.appendChild(this.splashElement);
        console.log('✨ Splash screen added to page');
        
        // Force reflow to ensure smooth animation
        this.splashElement.offsetHeight;
    }

    startProgressAnimation() {
        console.log('⏳ Starting progress animation...');
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
            console.log('⏰ Auto-hiding splash screen...');
            this.hide();
        }, this.displayDuration);
    }

    hide() {
        if (this.isDestroyed || !this.splashElement) return;
        
        console.log('👋 Hiding splash screen...');
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Add hidden class for smooth transition
        this.splashElement.style.opacity = '0';
        this.splashElement.style.visibility = 'hidden';
        this.splashElement.style.transform = 'scale(0.95) translateY(-20px)';
        this.splashElement.style.filter = 'blur(10px)';
        
        // Remove element after transition
        setTimeout(() => {
            this.destroy();
        }, 1500); // Match transition duration
    }

    destroy() {
        if (this.isDestroyed) return;
        
        console.log('🗑️ Destroying splash screen...');
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
        console.log('✅ Splash screen completed successfully!');
    }

    // Static method to create and show splash screen
    static show() {
        return new SplashScreen3D();
    }
}

// Utility function to show splash screen on any page
function showSplashScreen() {
    console.log('🎯 showSplashScreen() called');
    // Only show if not already showing
    if (!document.querySelector('.splash-screen-3d')) {
        console.log('🎪 Creating new splash screen instance');
        return SplashScreen3D.show();
    } else {
        console.log('⚠️ Splash screen already exists, skipping');
    }
}

// Auto-initialize on page load
console.log('📱 Splash screen script loaded, document state:', document.readyState);

if (document.readyState === 'loading') {
    console.log('⏳ Document still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🎉 DOMContentLoaded event fired, showing splash screen');
        showSplashScreen();
    });
} else {
    console.log('🚀 Document already loaded, showing splash screen immediately');
    showSplashScreen();
}

// Export for manual control if needed
window.SplashScreen3D = SplashScreen3D;
window.showSplashScreen = showSplashScreen;

// Add CSS animations if not already present
if (!document.querySelector('#splash-screen-animations')) {
    const style = document.createElement('style');
    style.id = 'splash-screen-animations';
    style.textContent = `
        @keyframes logoEntrance {
            0% {
                transform: translateY(30px) scale(0.8);
                opacity: 0;
            }
            50% {
                transform: translateY(-5px) scale(1.05);
                opacity: 0.8;
            }
            100% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }
        
        @keyframes logoFloat {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        @keyframes textPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    console.log('🎨 Added splash screen animations');
}