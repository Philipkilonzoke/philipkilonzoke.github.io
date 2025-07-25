/**
 * ==========================================
 * MODERN WEATHER DASHBOARD SMOOTH INTERACTIONS
 * World-Class Scrolling & Gesture Controls
 * ==========================================
 */

class WeatherSmoothInteractions {
    constructor() {
        this.init();
        this.setupSmoothScrolling();
        this.setupGestureControls();
        this.setupFloatingControls();
        this.setupIntersectionObserver();
        this.setupKeyboardNavigation();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.currentHourlyIndex = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.lastScrollTime = 0;
        this.scrollVelocity = 0;
        
        // Enhanced smooth scrolling for all devices
        this.enableHardwareAcceleration();
        this.setupModernScrolling();
    }

    enableHardwareAcceleration() {
        // Force hardware acceleration on key elements
        const elements = [
            '.hourly-scroll',
            '.hourly-scroll-modern',
            '.daily-container',
            '.daily-container-modern',
            '.glass-card',
            '.glass-card-premium'
        ];

        elements.forEach(selector => {
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
                el.style.transform = 'translateZ(0)';
                el.style.willChange = 'transform, opacity';
                el.style.backfaceVisibility = 'hidden';
                el.style.perspective = '1000px';
            });
        });
    }

    setupModernScrolling() {
        // Ultra-smooth scrolling for hourly forecast
        const hourlyContainers = document.querySelectorAll('.hourly-scroll, .hourly-scroll-modern');
        
        hourlyContainers.forEach(container => {
            if (container) {
                this.enhanceScrollContainer(container);
                this.addScrollSnapNavigation(container);
                this.addMomentumScrolling(container);
            }
        });
    }

    enhanceScrollContainer(container) {
        // Add smooth scrolling properties
        container.style.scrollBehavior = 'smooth';
        container.style.overflowX = 'auto';
        container.style.overflowY = 'hidden';
        container.style.scrollSnapType = 'x mandatory';
        container.style.WebkitOverflowScrolling = 'touch';
        
        // Hide scrollbar but keep functionality
        container.style.scrollbarWidth = 'none';
        container.style.msOverflowStyle = 'none';
        
        // Add CSS class for webkit scrollbar hiding
        if (!container.style.cssText.includes('scrollbar-width')) {
            const style = document.createElement('style');
            style.textContent = `
                .hourly-scroll::-webkit-scrollbar,
                .hourly-scroll-modern::-webkit-scrollbar {
                    display: none;
                }
            `;
            document.head.appendChild(style);
        }
    }

    addScrollSnapNavigation(container) {
        const cards = container.querySelectorAll('.hourly-item, .hourly-card-modern');
        
        cards.forEach((card, index) => {
            card.style.scrollSnapAlign = 'center';
            card.style.scrollSnapStop = 'always';
            
            // Add click navigation
            card.addEventListener('click', () => {
                this.scrollToCard(container, index);
            });
        });

        // Add navigation dots
        this.createNavigationDots(container, cards.length);
    }

    createNavigationDots(container, count) {
        // Check if dots already exist
        if (container.parentNode.querySelector('.hourly-nav-dots')) return;

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'hourly-nav-dots';
        
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.scrollToCard(container, i);
                this.updateActiveDot(dotsContainer, i);
            });
            
            dotsContainer.appendChild(dot);
        }
        
        container.parentNode.appendChild(dotsContainer);
        
        // Update active dot on scroll
        container.addEventListener('scroll', () => {
            const activeIndex = this.getCurrentActiveCard(container);
            this.updateActiveDot(dotsContainer, activeIndex);
        });
    }

    scrollToCard(container, index) {
        const cards = container.querySelectorAll('.hourly-item, .hourly-card-modern');
        const targetCard = cards[index];
        
        if (targetCard) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = targetCard.getBoundingClientRect();
            const scrollLeft = container.scrollLeft + cardRect.left - containerRect.left - 
                             (containerRect.width - cardRect.width) / 2;
            
            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }

    getCurrentActiveCard(container) {
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

    updateActiveDot(dotsContainer, activeIndex) {
        const dots = dotsContainer.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    addMomentumScrolling(container) {
        let startX = 0;
        let scrollLeft = 0;
        let velocityX = 0;
        let lastTime = 0;
        let lastX = 0;
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            lastTime = Date.now();
            lastX = startX;
            velocityX = 0;
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            const currentTime = Date.now();
            const currentX = e.touches[0].pageX - container.offsetLeft;
            const deltaTime = currentTime - lastTime;
            const deltaX = currentX - lastX;
            
            if (deltaTime > 0) {
                velocityX = deltaX / deltaTime;
            }
            
            const x = currentX - startX;
            container.scrollLeft = scrollLeft - x;
            
            lastTime = currentTime;
            lastX = currentX;
        }, { passive: true });
        
        container.addEventListener('touchend', () => {
            startX = 0;
            
            // Apply momentum scrolling
            if (Math.abs(velocityX) > 0.5) {
                this.applyMomentum(container, velocityX);
            }
        }, { passive: true });
    }

    applyMomentum(container, velocity) {
        const friction = 0.95;
        const threshold = 0.1;
        
        const step = () => {
            velocity *= friction;
            container.scrollLeft -= velocity * 10;
            
            if (Math.abs(velocity) > threshold) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }

    setupGestureControls() {
        // Swipe gesture support for mobile
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleGesture(startX, startY, endX, endY);
        }, { passive: true });
    }

    handleGesture(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            // Horizontal swipe
            const hourlyContainer = document.querySelector('.hourly-scroll, .hourly-scroll-modern');
            if (hourlyContainer) {
                if (deltaX > 0) {
                    // Swipe right - scroll left
                    this.scrollHourlyContainer(hourlyContainer, -1);
                } else {
                    // Swipe left - scroll right
                    this.scrollHourlyContainer(hourlyContainer, 1);
                }
            }
        }
    }

    scrollHourlyContainer(container, direction) {
        const cards = container.querySelectorAll('.hourly-item, .hourly-card-modern');
        const currentIndex = this.getCurrentActiveCard(container);
        const newIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + direction));
        
        this.scrollToCard(container, newIndex);
    }

    setupFloatingControls() {
        // Create floating action buttons if they don't exist
        if (!document.querySelector('.floating-controls')) {
            this.createFloatingControls();
        }
    }

    createFloatingControls() {
        const floatingControls = document.createElement('div');
        floatingControls.className = 'floating-controls';
        
        // Scroll to top button
        const scrollTopBtn = this.createFAB('fas fa-chevron-up', 'Scroll to top');
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Refresh button
        const refreshBtn = this.createFAB('fas fa-sync-alt', 'Refresh weather');
        refreshBtn.addEventListener('click', () => {
            if (window.weatherDashboard && window.weatherDashboard.refreshWeatherData) {
                window.weatherDashboard.refreshWeatherData();
            }
        });
        
        floatingControls.appendChild(scrollTopBtn);
        floatingControls.appendChild(refreshBtn);
        document.body.appendChild(floatingControls);
        
        // Show/hide based on scroll position
        this.setupFloatingControlsVisibility();
    }

    createFAB(iconClass, title) {
        const fab = document.createElement('button');
        fab.className = 'fab-modern';
        fab.title = title;
        fab.innerHTML = `<i class="${iconClass}"></i>`;
        return fab;
    }

    setupFloatingControlsVisibility() {
        const floatingControls = document.querySelector('.floating-controls');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 300) {
                floatingControls.style.opacity = '1';
                floatingControls.style.pointerEvents = 'auto';
                floatingControls.style.transform = 'translateY(0)';
            } else {
                floatingControls.style.opacity = '0';
                floatingControls.style.pointerEvents = 'none';
                floatingControls.style.transform = 'translateY(20px)';
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    setupIntersectionObserver() {
        // Animate elements as they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Staggered animation for children
                    const children = entry.target.querySelectorAll('.hourly-item, .hourly-card-modern, .daily-item, .daily-card-modern');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        // Observe forecast sections
        const forecastSections = document.querySelectorAll('.forecast-section, .weather-charts');
        forecastSections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const hourlyContainer = document.querySelector('.hourly-scroll, .hourly-scroll-modern');
            
            if (!hourlyContainer) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.scrollHourlyContainer(hourlyContainer, -1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.scrollHourlyContainer(hourlyContainer, 1);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.scrollToCard(hourlyContainer, 0);
                    break;
                case 'End':
                    e.preventDefault();
                    const cards = hourlyContainer.querySelectorAll('.hourly-item, .hourly-card-modern');
                    this.scrollToCard(hourlyContainer, cards.length - 1);
                    break;
            }
        });
    }

    // Smooth scroll enhancement for any container
    enhanceAllScrollContainers() {
        const scrollContainers = document.querySelectorAll('[data-smooth-scroll]');
        
        scrollContainers.forEach(container => {
            this.addSmoothScrolling(container);
        });
    }

    addSmoothScrolling(element) {
        let isScrolling = false;
        let scrollTimeout;
        
        element.addEventListener('scroll', () => {
            if (!isScrolling) {
                element.style.pointerEvents = 'none';
            }
            
            isScrolling = true;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                element.style.pointerEvents = 'auto';
            }, 150);
        }, { passive: true });
    }

    // Public methods for external access
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    updateSmoothScrolling() {
        // Re-initialize smooth scrolling after DOM changes
        setTimeout(() => {
            this.setupModernScrolling();
        }, 100);
    }
}

// Auto-initialize when script loads
const weatherSmoothInteractions = new WeatherSmoothInteractions();

// Export for global access
window.WeatherSmoothInteractions = WeatherSmoothInteractions;
window.weatherSmoothInteractions = weatherSmoothInteractions;