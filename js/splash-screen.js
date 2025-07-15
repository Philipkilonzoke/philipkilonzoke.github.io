/**
 * BrightLens News ULTRA-FUTURISTIC 3D Splash Screen Manager
 * Advanced neural network visualization, quantum particle systems,
 * matrix digital rain effects, and holographic interface elements
 */

class SplashScreen3D {
    constructor() {
        this.splashElement = null;
        this.progressBar = null;
        this.particles = [];
        this.neuralNodes = [];
        this.loadStartTime = Date.now();
        this.minDisplayTime = 3000; // Minimum time to show splash screen
        this.maxDisplayTime = 8000; // Maximum time before auto-hide
        this.progressSpeed = 1.2;
        this.particleCount = this.getOptimalParticleCount();
        this.animationFrameId = null;
        this.isDestroyed = false;
        this.currentProgress = 0;
        this.statusMessages = [
            "Initializing neural networks...",
            "Connecting to quantum servers...",
            "Loading holographic interface...",
            "Processing data streams...",
            "Optimizing user experience...",
            "Calibrating display matrix...",
            "Synchronizing reality layers...",
            "Finalizing quantum entanglement...",
            "Welcome to the future of news!"
        ];
        this.currentStatusIndex = 0;
        
        this.init();
    }

    init() {
        this.detectDeviceCapabilities();
        this.createSplashScreen();
        this.createQuantumParticleSystem();
        this.createNeuralNetwork();
        this.create3DShapes();
        this.createHolographicElements();
        this.createScanningBeam();
        this.startLoadingAnimation();
        this.setupInteractiveElements();
        this.setupPerformanceOptimizations();
    }

    detectDeviceCapabilities() {
        // Advanced device detection for performance optimization
        this.deviceCapabilities = {
            isHighEnd: this.isHighEndDevice(),
            isLowMemory: navigator.deviceMemory && navigator.deviceMemory < 4,
            isSlowConnection: this.isSlowConnection(),
            supportsCSSAnimations: this.supportsCSSAnimations(),
            prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
    }

    getOptimalParticleCount() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const baseCount = Math.floor((screenWidth * screenHeight) / 15000);
        
        if (screenWidth < 768) return Math.min(baseCount, 20);
        if (screenWidth < 1200) return Math.min(baseCount, 35);
        return Math.min(baseCount, 50);
    }

    createSplashScreen() {
        // Remove existing loading screens
        const existingScreens = document.querySelectorAll('#loading-screen, .loading-screen, #splash-screen-3d');
        existingScreens.forEach(screen => screen.remove());

        // Create new ultra-futuristic 3D splash screen
        this.splashElement = document.createElement('div');
        this.splashElement.id = 'splash-screen-3d';
        this.splashElement.className = 'splash-screen-3d';
        
        this.splashElement.innerHTML = `
            <div class="splash-holographic-scan"></div>
            <div class="neural-connections"></div>
            <div class="splash-logo-container">
                <img src="assets/brightlens-3d-logo.svg" alt="BrightLens News" class="splash-logo-3d" />
                <div class="splash-text">
                    <h1 class="splash-title">BrightLens News</h1>
                    <p class="splash-subtitle">Neural Network Interface Loading...</p>
                    <div class="splash-status">
                        <div class="splash-status-text">${this.statusMessages[0]}</div>
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
            <button class="splash-skip-btn" onclick="window.splashScreen3D?.skipSplash()">
                <i class="fas fa-forward"></i> Skip
            </button>
        `;
        
        document.body.appendChild(this.splashElement);
        
        // Get references to elements
        this.progressBar = this.splashElement.querySelector('.splash-progress-bar');
        this.statusText = this.splashElement.querySelector('.splash-status-text');
        this.particlesContainer = this.splashElement.querySelector('.splash-particles');
        this.neuralContainer = this.splashElement.querySelector('.neural-connections');
        this.skipButton = this.splashElement.querySelector('.splash-skip-btn');
    }

    createQuantumParticleSystem() {
        const particlesContainer = this.splashElement.querySelector('.splash-particles');
        
        // Create different types of quantum particles
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Advanced particle positioning with quantum randomness
            const startX = Math.random() * 100;
            const endDrift = (Math.random() - 0.5) * 300;
            const animationDelay = Math.random() * 20;
            const animationDuration = 15 + Math.random() * 15;
            
            particle.style.left = startX + '%';
            particle.style.setProperty('--drift', endDrift + 'px');
            particle.style.animationDelay = animationDelay + 's';
            particle.style.animationDuration = animationDuration + 's';
            
            // Add particle trails for high-end devices
            if (this.deviceCapabilities.isHighEnd) {
                particle.style.boxShadow = `
                    0 0 10px currentColor,
                    0 5px 20px rgba(59, 130, 246, 0.3),
                    0 -5px 20px rgba(16, 185, 129, 0.2)
                `;
            }
            
            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    createNeuralNetwork() {
        const neuralContainer = this.splashElement.querySelector('.neural-connections');
        const nodeCount = this.deviceCapabilities.isHighEnd ? 12 : 8;
        
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';
            
            // Position nodes in a network pattern
            const angle = (i / nodeCount) * 2 * Math.PI;
            const radius = Math.min(window.innerWidth, window.innerHeight) * 0.25;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            node.style.left = x + 'px';
            node.style.top = y + 'px';
            node.style.animationDelay = (i * 0.5) + 's';
            
            neuralContainer.appendChild(node);
            this.neuralNodes.push(node);
        }
    }

    create3DShapes() {
        const shapes = this.splashElement.querySelectorAll('.shape-3d');
        const shapeConfigs = [
            { type: 'triangle', color: 'rgba(59, 130, 246, 0.4)' },
            { type: 'circle', color: 'rgba(16, 185, 129, 0.4)' },
            { type: 'octagon', color: 'rgba(139, 92, 246, 0.4)' },
            { type: 'circle', color: 'rgba(236, 72, 153, 0.4)' }
        ];
        
        shapes.forEach((shape, index) => {
            const config = shapeConfigs[index];
            const duration = 20 + Math.random() * 10;
            const delay = Math.random() * 8;
            
            shape.style.animationDuration = duration + 's';
            shape.style.animationDelay = `-${delay}s`;
            shape.style.borderColor = config.color;
            
            // Add interactive hover effects for high-end devices
            if (this.deviceCapabilities.isHighEnd) {
                shape.addEventListener('mouseenter', () => {
                    shape.style.transform += ' scale(1.2)';
                    shape.style.boxShadow = `0 0 30px ${config.color}`;
                });
                
                shape.addEventListener('mouseleave', () => {
                    shape.style.transform = shape.style.transform.replace(' scale(1.2)', '');
                    shape.style.boxShadow = '';
                });
            }
        });
    }

    createHolographicElements() {
        // Add dynamic holographic interference patterns
        const hologram = this.splashElement.querySelector('.splash-hologram');
        
        if (this.deviceCapabilities.isHighEnd) {
            // Create additional holographic layers
            for (let i = 0; i < 3; i++) {
                const layer = document.createElement('div');
                layer.style.position = 'absolute';
                layer.style.width = (150 + i * 50) + 'px';
                layer.style.height = (150 + i * 50) + 'px';
                layer.style.border = `1px solid rgba(${59 + i * 20}, ${130 + i * 10}, ${246 - i * 30}, ${0.2 + i * 0.1})`;
                layer.style.borderRadius = '50%';
                layer.style.top = '50%';
                layer.style.left = '50%';
                layer.style.transform = 'translate(-50%, -50%)';
                layer.style.animation = `hologramQuantum ${6 + i * 2}s ease-in-out infinite`;
                layer.style.animationDelay = `${i * 0.5}s`;
                
                hologram.appendChild(layer);
            }
        }
    }

    createScanningBeam() {
        const beam = this.splashElement.querySelector('.splash-holographic-scan');
        
        // Add multiple scanning beams for enhanced effect
        if (this.deviceCapabilities.isHighEnd) {
            for (let i = 0; i < 2; i++) {
                const additionalBeam = beam.cloneNode(true);
                additionalBeam.style.animationDelay = `${2 + i * 1.5}s`;
                additionalBeam.style.opacity = '0.6';
                additionalBeam.style.height = '2px';
                this.splashElement.insertBefore(additionalBeam, beam);
            }
        }
    }

    startLoadingAnimation() {
        let progress = 0;
        let statusIndex = 0;
        
        const updateProgress = () => {
            if (this.isDestroyed) return;
            
            // Quantum-style progress updates with realistic timing
            const increment = 0.5 + Math.random() * 2;
            progress += increment;
            
            // Update progress bar with smooth animation
            if (this.progressBar) {
                this.progressBar.style.width = Math.min(progress, 100) + '%';
            }
            
            // Update status messages
            const expectedStatusIndex = Math.floor((progress / 100) * this.statusMessages.length);
            if (expectedStatusIndex > statusIndex && expectedStatusIndex < this.statusMessages.length) {
                statusIndex = expectedStatusIndex;
                this.updateStatusMessage(statusIndex);
            }
            
            // Continue animation until complete
            if (progress < 100) {
                const delay = 100 + Math.random() * 200; // Realistic loading simulation
                setTimeout(updateProgress, delay);
            } else {
                setTimeout(() => {
                    if (!this.isDestroyed) {
                        this.completeLoading();
                    }
                }, 500);
            }
        };
        
        // Start progress animation with initial delay
        setTimeout(updateProgress, 800);
        
        // Auto-hide after maximum time as failsafe
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.completeLoading();
            }
        }, this.maxDisplayTime);
    }

    updateStatusMessage(index) {
        if (this.statusText && index < this.statusMessages.length) {
            // Add typing effect for status updates
            this.statusText.style.opacity = '0.5';
            setTimeout(() => {
                if (this.statusText) {
                    this.statusText.textContent = this.statusMessages[index];
                    this.statusText.style.opacity = '1';
                }
            }, 150);
        }
    }

    setupInteractiveElements() {
        // Keyboard shortcuts
        const handleKeyPress = (e) => {
            if (e.key === 'Escape' || e.key === ' ') {
                e.preventDefault();
                this.skipSplash();
            }
        };
        
        // Click to skip
        const handleClick = (e) => {
            if (e.target === this.splashElement) {
                this.skipSplash();
            }
        };
        
        document.addEventListener('keydown', handleKeyPress);
        this.splashElement.addEventListener('click', handleClick);
        
        // Store event listeners for cleanup
        this.eventListeners = {
            keydown: handleKeyPress,
            click: handleClick
        };
    }

    skipSplash() {
        if (this.isDestroyed) return;
        
        // Add skip animation
        if (this.statusText) {
            this.statusText.textContent = "Skipping to main interface...";
        }
        
        if (this.progressBar) {
            this.progressBar.style.width = '100%';
            this.progressBar.style.transition = 'width 0.3s ease-out';
        }
        
        setTimeout(() => {
            this.completeLoading();
        }, 300);
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
            this.statusText.textContent = 'Neural interface activated!';
        }
        
        // Complete progress bar
        if (this.progressBar) {
            this.progressBar.style.width = '100%';
        }
        
        // Add completion effects for high-end devices
        if (this.deviceCapabilities.isHighEnd) {
            this.splashElement.style.filter = 'brightness(1.2) saturate(1.3)';
        }
        
        // Hide splash screen with advanced animation
        setTimeout(() => {
            if (this.splashElement) {
                this.splashElement.classList.add('hidden');
                
                // Remove element after animation
                setTimeout(() => {
                    this.destroy();
                }, 2000);
            }
        }, 400);
    }

    setupPerformanceOptimizations() {
        // Optimize animations based on device performance
        if (this.deviceCapabilities.isLowMemory || this.deviceCapabilities.isSlowConnection) {
            this.optimizeForLowEndDevice();
        }
        
        // Optimize for battery
        if (this.isBatteryLow()) {
            this.optimizeForBatterySaver();
        }
        
        // Handle reduced motion preference
        if (this.deviceCapabilities.prefersReducedMotion) {
            this.disableAnimations();
        }
        
        // Preload critical assets
        this.preloadCriticalAssets();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
    }

    optimizeForLowEndDevice() {
        // Reduce particle count
        const particlesToRemove = Math.floor(this.particles.length * 0.5);
        for (let i = 0; i < particlesToRemove; i++) {
            if (this.particles[i]) {
                this.particles[i].remove();
            }
        }
        this.particles = this.particles.slice(particlesToRemove);
        
        // Reduce neural nodes
        const nodesToRemove = Math.floor(this.neuralNodes.length * 0.4);
        for (let i = 0; i < nodesToRemove; i++) {
            if (this.neuralNodes[i]) {
                this.neuralNodes[i].remove();
            }
        }
        this.neuralNodes = this.neuralNodes.slice(nodesToRemove);
        
        // Simplify animations
        this.splashElement.style.setProperty('--reduced-animations', '1');
    }

    optimizeForBatterySaver() {
        this.splashElement.style.setProperty('--battery-saver', '1');
        
        // Reduce animation frequency
        const allAnimatedElements = this.splashElement.querySelectorAll('*');
        allAnimatedElements.forEach(el => {
            const currentDuration = parseFloat(getComputedStyle(el).animationDuration);
            if (currentDuration > 0) {
                el.style.animationDuration = (currentDuration * 1.5) + 's';
            }
        });
    }

    disableAnimations() {
        this.splashElement.style.setProperty('--disable-animations', '1');
        
        // Set minimal timing for all animations
        const style = document.createElement('style');
        style.textContent = `
            #splash-screen-3d *, 
            #splash-screen-3d::before, 
            #splash-screen-3d::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
        this.reducedMotionStyle = style;
    }

    setupPerformanceMonitoring() {
        // Monitor frame rate and adjust accordingly
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitorFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Adjust quality based on FPS
                if (fps < 30 && this.deviceCapabilities.isHighEnd) {
                    this.optimizeForLowEndDevice();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            if (!this.isDestroyed) {
                requestAnimationFrame(monitorFPS);
            }
        };
        
        requestAnimationFrame(monitorFPS);
    }

    isHighEndDevice() {
        // Advanced device capability detection
        const userAgent = navigator.userAgent.toLowerCase();
        const hasHighMemory = navigator.deviceMemory && navigator.deviceMemory >= 8;
        const hasModernBrowser = 'IntersectionObserver' in window && 'requestIdleCallback' in window;
        const hasFastConnection = navigator.connection && 
                                 (navigator.connection.effectiveType === '4g' || 
                                  navigator.connection.downlink > 10);
        
        return hasHighMemory || (hasModernBrowser && hasFastConnection);
    }

    isSlowConnection() {
        if (!navigator.connection) return false;
        
        return navigator.connection.effectiveType === 'slow-2g' ||
               navigator.connection.effectiveType === '2g' ||
               navigator.connection.effectiveType === '3g' ||
               navigator.connection.downlink < 1.5;
    }

    supportsCSSAnimations() {
        const element = document.createElement('div');
        const animationSupport = 'animation' in element.style ||
                               'webkitAnimation' in element.style ||
                               'mozAnimation' in element.style;
        return animationSupport;
    }

    isBatteryLow() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                return battery.level < 0.3 && !battery.charging;
            });
        }
        return false;
    }

    preloadCriticalAssets() {
        const criticalAssets = [
            'css/styles.css',
            'css/themes.css',
            'js/main.js',
            'js/news-api.js',
            'js/page-transitions.js'
        ];
        
        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = asset;
            link.as = asset.endsWith('.css') ? 'style' : 'script';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    destroy() {
        this.isDestroyed = true;
        
        // Cancel any pending animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Remove event listeners
        if (this.eventListeners) {
            document.removeEventListener('keydown', this.eventListeners.keydown);
            if (this.splashElement) {
                this.splashElement.removeEventListener('click', this.eventListeners.click);
            }
        }
        
        // Remove reduced motion styles
        if (this.reducedMotionStyle) {
            this.reducedMotionStyle.remove();
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
        this.neuralNodes = [];
        this.eventListeners = null;
        
        // Dispatch completion event with analytics
        document.dispatchEvent(new CustomEvent('splashScreenComplete', {
            detail: { 
                loadTime: Date.now() - this.loadStartTime,
                performance: {
                    particleCount: this.particleCount,
                    deviceCapabilities: this.deviceCapabilities,
                    isOptimized: this.isOptimized || false
                }
            }
        }));
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only create splash screen if not already created
    if (!document.getElementById('splash-screen-3d')) {
        try {
            const splashScreen = new SplashScreen3D();
            
            // Global reference for manual control
            window.splashScreen3D = splashScreen;
            
            // Analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'splash_screen_loaded', {
                    event_category: 'engagement',
                    event_label: 'ultra_futuristic_3d'
                });
            }
        } catch (error) {
            console.error('Splash screen initialization failed:', error);
            // Fallback: just hide any existing loading screens
            const existingScreens = document.querySelectorAll('#loading-screen, .loading-screen');
            existingScreens.forEach(screen => screen.remove());
        }
    }
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (window.splashScreen3D && window.splashScreen3D.splashElement) {
        if (document.hidden) {
            // Pause animations when page is hidden
            window.splashScreen3D.splashElement.style.setProperty('animation-play-state', 'paused');
        } else {
            // Resume animations when page is visible
            window.splashScreen3D.splashElement.style.setProperty('animation-play-state', 'running');
        }
    }
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    if (window.splashScreen3D && !window.splashScreen3D.isDestroyed) {
        // Recalculate optimal particle count
        const newParticleCount = window.splashScreen3D.getOptimalParticleCount();
        
        // Adjust particle system if needed
        if (newParticleCount !== window.splashScreen3D.particleCount) {
            window.splashScreen3D.particleCount = newParticleCount;
            // Recreate particle system with new count
            // This would be implemented for dynamic resizing
        }
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SplashScreen3D;
}