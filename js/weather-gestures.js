/**
 * =======================================
 * PREMIUM MOBILE GESTURES & TOUCH INTERACTIONS
 * World-Class Mobile Weather Experience
 * =======================================
 */

class WeatherMobileGestures {
    constructor() {
        this.isTouch = 'ontouchstart' in window;
        this.isScrolling = false;
        this.velocity = { x: 0, y: 0 };
        this.lastTouch = { x: 0, y: 0, time: 0 };
        this.momentum = { x: 0, y: 0 };
        
        if (this.isTouch) {
            this.init();
        }
    }

    init() {
        this.setupTouchEvents();
        this.setupPinchZoom();
        this.setupPullToRefresh();
        this.setupHapticFeedback();
        this.setupMobileOptimizations();
    }

    setupTouchEvents() {
        let startTime = 0;
        let startPos = { x: 0, y: 0 };
        let lastPos = { x: 0, y: 0 };
        let isTracking = false;

        // Enhanced touch handling for weather cards
        document.addEventListener('touchstart', (e) => {
            startTime = Date.now();
            startPos.x = e.touches[0].clientX;
            startPos.y = e.touches[0].clientY;
            lastPos = { ...startPos };
            isTracking = true;
            
            this.handleTouchStart(e);
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!isTracking) return;
            
            const currentPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            
            const deltaTime = Date.now() - startTime;
            this.velocity.x = (currentPos.x - lastPos.x) / Math.max(deltaTime, 1);
            this.velocity.y = (currentPos.y - lastPos.y) / Math.max(deltaTime, 1);
            
            lastPos = currentPos;
            this.handleTouchMove(e, startPos, currentPos);
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (!isTracking) return;
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            isTracking = false;
            this.handleTouchEnd(e, startPos, duration);
        }, { passive: false });
    }

    handleTouchStart(e) {
        const target = e.target.closest('.hourly-item, .hourly-card-modern, .daily-item, .daily-card-modern');
        
        if (target) {
            target.classList.add('touching');
            this.addTouchRipple(target, e.touches[0]);
            this.simulateHaptic('light');
        }
    }

    handleTouchMove(e, startPos, currentPos) {
        const deltaX = currentPos.x - startPos.x;
        const deltaY = currentPos.y - startPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Remove touch state if moved too far
        if (distance > 20) {
            const touchingElements = document.querySelectorAll('.touching');
            touchingElements.forEach(el => el.classList.remove('touching'));
        }
        
        // Handle horizontal swipe in hourly forecast
        const hourlyContainer = e.target.closest('.hourly-scroll, .hourly-scroll-modern');
        if (hourlyContainer && Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
            this.handleHorizontalSwipe(hourlyContainer, deltaX);
        }
    }

    handleTouchEnd(e, startPos, duration) {
        // Remove all touch states
        const touchingElements = document.querySelectorAll('.touching');
        touchingElements.forEach(el => el.classList.remove('touching'));
        
        const endPos = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };
        
        const deltaX = endPos.x - startPos.x;
        const deltaY = endPos.y - startPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Detect gesture type
        if (duration < 300 && distance < 10) {
            this.handleTap(e);
        } else if (distance > 50) {
            this.handleSwipe(deltaX, deltaY, duration);
        }
        
        // Apply momentum if velocity is high enough
        if (Math.abs(this.velocity.x) > 0.5 || Math.abs(this.velocity.y) > 0.5) {
            this.applyMomentumScroll(e.target);
        }
    }

    handleTap(e) {
        const target = e.target.closest('.hourly-item, .hourly-card-modern, .daily-item, .daily-card-modern');
        
        if (target) {
            this.simulateHaptic('medium');
            target.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                target.style.transform = '';
            }, 150);
            
            // Trigger click event
            target.click();
        }
    }

    handleSwipe(deltaX, deltaY, duration) {
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
        const minSwipeDistance = 75;
        
        if (isHorizontal && Math.abs(deltaX) > minSwipeDistance) {
            this.handleHorizontalGesture(deltaX > 0 ? 'right' : 'left');
        } else if (isVertical && Math.abs(deltaY) > minSwipeDistance) {
            this.handleVerticalGesture(deltaY > 0 ? 'down' : 'up');
        }
    }

    handleHorizontalGesture(direction) {
        const hourlyContainer = document.querySelector('.hourly-scroll, .hourly-scroll-modern');
        
        if (hourlyContainer) {
            const cards = hourlyContainer.querySelectorAll('.hourly-item, .hourly-card-modern');
            const currentIndex = this.getCurrentVisibleCard(hourlyContainer);
            
            let newIndex;
            if (direction === 'left') {
                newIndex = Math.min(cards.length - 1, currentIndex + 1);
            } else {
                newIndex = Math.max(0, currentIndex - 1);
            }
            
            this.scrollToCardSmooth(hourlyContainer, newIndex);
            this.simulateHaptic('medium');
        }
    }

    handleVerticalGesture(direction) {
        if (direction === 'down' && window.scrollY < 100) {
            this.triggerPullToRefresh();
        } else if (direction === 'up') {
            // Scroll to next section
            this.scrollToNextSection();
        }
    }

    getCurrentVisibleCard(container) {
        const cards = container.querySelectorAll('.hourly-item, .hourly-card-modern');
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        
        return closestIndex;
    }

    scrollToCardSmooth(container, index) {
        const cards = container.querySelectorAll('.hourly-item, .hourly-card-modern');
        const targetCard = cards[index];
        
        if (targetCard) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = targetCard.getBoundingClientRect();
            const scrollLeft = container.scrollLeft + cardRect.left - containerRect.left - 
                             (containerRect.width - cardRect.width) / 2;
            
            this.smoothScrollTo(container, scrollLeft, 0, 400);
        }
    }

    smoothScrollTo(element, targetX, targetY, duration) {
        const startX = element.scrollLeft || 0;
        const startY = element.scrollTop || 0;
        const distanceX = targetX - startX;
        const distanceY = targetY - startY;
        const startTime = Date.now();
        
        const animateScroll = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            element.scrollLeft = startX + distanceX * easeOutQuart;
            element.scrollTop = startY + distanceY * easeOutQuart;
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }

    addTouchRipple(element, touch) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = touch.clientX - rect.left - size / 2;
        const y = touch.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            transition: transform 0.6s ease;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.transform = 'scale(2)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    setupPinchZoom() {
        let initialDistance = 0;
        let currentScale = 1;
        const maxScale = 2;
        const minScale = 0.8;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = currentDistance / initialDistance;
                currentScale = Math.max(minScale, Math.min(maxScale, scale));
                
                const weatherContainer = document.querySelector('.weather-container');
                if (weatherContainer) {
                    weatherContainer.style.transform = `scale(${currentScale})`;
                    weatherContainer.style.transformOrigin = 'center center';
                }
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                const weatherContainer = document.querySelector('.weather-container');
                if (weatherContainer) {
                    weatherContainer.style.transform = '';
                    weatherContainer.style.transformOrigin = '';
                }
                currentScale = 1;
            }
        });
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let isRefreshing = false;
        const refreshThreshold = 80;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && !isRefreshing) {
                currentY = e.touches[0].clientY;
                const pullDistance = currentY - startY;
                
                if (pullDistance > 0) {
                    e.preventDefault();
                    this.updatePullToRefreshIndicator(pullDistance, refreshThreshold);
                }
            }
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            if (window.scrollY === 0 && !isRefreshing) {
                const pullDistance = currentY - startY;
                
                if (pullDistance > refreshThreshold) {
                    this.triggerPullToRefresh();
                } else {
                    this.hidePullToRefreshIndicator();
                }
            }
        });
    }

    updatePullToRefreshIndicator(distance, threshold) {
        let indicator = document.querySelector('.pull-refresh-indicator');
        
        if (!indicator) {
            indicator = this.createPullToRefreshIndicator();
        }
        
        const progress = Math.min(distance / threshold, 1);
        indicator.style.opacity = progress;
        indicator.style.transform = `translateY(${Math.min(distance * 0.5, 40)}px) scale(${progress})`;
        
        if (progress >= 1) {
            indicator.classList.add('ready');
            this.simulateHaptic('medium');
        } else {
            indicator.classList.remove('ready');
        }
    }

    createPullToRefreshIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'pull-refresh-indicator';
        indicator.innerHTML = `
            <div class="refresh-spinner"></div>
            <span>Pull to refresh</span>
        `;
        
        indicator.style.cssText = `
            position: fixed;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            color: #333;
            padding: 10px 20px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(indicator);
        return indicator;
    }

    triggerPullToRefresh() {
        const indicator = document.querySelector('.pull-refresh-indicator');
        
        if (indicator) {
            indicator.querySelector('span').textContent = 'Refreshing...';
            indicator.querySelector('.refresh-spinner').style.animation = 'spin 1s linear infinite';
        }
        
        this.simulateHaptic('heavy');
        
        // Trigger actual refresh
        if (window.weatherDashboard && window.weatherDashboard.refreshWeatherData) {
            window.weatherDashboard.refreshWeatherData();
        }
        
        // Hide indicator after delay
        setTimeout(() => {
            this.hidePullToRefreshIndicator();
        }, 2000);
    }

    hidePullToRefreshIndicator() {
        const indicator = document.querySelector('.pull-refresh-indicator');
        
        if (indicator) {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateX(-50%) translateY(-20px) scale(0.8)';
            
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }

    setupHapticFeedback() {
        // Add CSS for touch feedback
        const style = document.createElement('style');
        style.textContent = `
            .touching {
                transform: scale(0.98) !important;
                transition: transform 0.1s ease !important;
            }
            
            .refresh-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid #ddd;
                border-left: 2px solid #333;
                border-radius: 50%;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .pull-refresh-indicator.ready {
                background: rgba(59, 130, 246, 0.95);
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    simulateHaptic(intensity) {
        // Use Vibration API where available
        if ('vibrator' in navigator || 'vibrate' in navigator) {
            let pattern;
            
            switch (intensity) {
                case 'light':
                    pattern = [10];
                    break;
                case 'medium':
                    pattern = [20];
                    break;
                case 'heavy':
                    pattern = [50];
                    break;
                default:
                    pattern = [15];
            }
            
            navigator.vibrate && navigator.vibrate(pattern);
        }
    }

    setupMobileOptimizations() {
        // Optimize touch targets
        const touchTargets = document.querySelectorAll('.hourly-item, .hourly-card-modern, .daily-item, .daily-card-modern, .city-btn, .control-btn');
        
        touchTargets.forEach(target => {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
        });
        
        // Prevent zoom on input focus
        const inputs = document.querySelectorAll('input[type="text"], input[type="search"]');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            });
            
            input.addEventListener('blur', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                }
            });
        });
    }

    scrollToNextSection() {
        const sections = document.querySelectorAll('.forecast-section, .weather-charts');
        const currentScrollY = window.scrollY;
        
        for (let section of sections) {
            const sectionTop = section.offsetTop;
            if (sectionTop > currentScrollY + 100) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                break;
            }
        }
    }

    // Public methods
    enableTouchOptimizations() {
        document.body.style.touchAction = 'manipulation';
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.webkitTouchCallout = 'none';
        document.body.style.webkitTapHighlightColor = 'transparent';
    }

    disableTouchOptimizations() {
        document.body.style.touchAction = '';
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.webkitTouchCallout = '';
        document.body.style.webkitTapHighlightColor = '';
    }
}

// Initialize mobile gestures
const weatherMobileGestures = new WeatherMobileGestures();

// Export for global access
window.WeatherMobileGestures = WeatherMobileGestures;
window.weatherMobileGestures = weatherMobileGestures;