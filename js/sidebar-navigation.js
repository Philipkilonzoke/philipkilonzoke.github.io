// Sidebar Navigation Component
class SidebarNavigation {
    constructor() {
        this.sidebar = null;
        this.backdrop = null;
        this.mobileToggle = null;
        this.sidebarClose = null;
        this.currentPage = this.getCurrentPage();
        this.isInitialized = false;
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        const pageName = filename.replace('.html', '') || 'index';
        console.log('Current page detected:', pageName);
        return pageName;
    }

    getNavigationItems() {
        return [
            { 
                href: 'index.html', 
                icon: 'fas fa-home', 
                text: 'Homepage',
                id: 'index'
            },
            { 
                href: 'latest.html', 
                icon: 'fas fa-bolt', 
                text: 'Breaking News',
                id: 'latest'
            },
            { 
                href: 'kenya.html', 
                icon: 'fas fa-flag', 
                text: 'Kenyan News',
                id: 'kenya'
            },
            { 
                href: 'world.html', 
                icon: 'fas fa-globe', 
                text: 'World News',
                id: 'world'
            },
            { 
                href: 'entertainment.html', 
                icon: 'fas fa-film', 
                text: 'Entertainment',
                id: 'entertainment'
            },
            { 
                href: 'technology.html', 
                icon: 'fas fa-microchip', 
                text: 'Technology',
                id: 'technology'
            },
            { 
                href: 'business.html', 
                icon: 'fas fa-chart-line', 
                text: 'Business',
                id: 'business'
            },
            { 
                href: 'sports.html', 
                icon: 'fas fa-football-ball', 
                text: 'Sports',
                id: 'sports'
            },
            { 
                href: 'health.html', 
                icon: 'fas fa-heartbeat', 
                text: 'Health',
                id: 'health'
            },
            { 
                href: 'lifestyle.html', 
                icon: 'fas fa-spa', 
                text: 'Lifestyle',
                id: 'lifestyle'
            },
            { 
                href: 'music.html', 
                icon: 'fas fa-music', 
                text: 'Music',
                id: 'music'
            },
            { 
                href: 'food.html', 
                icon: 'fas fa-utensils', 
                text: 'Food & Recipes',
                id: 'food'
            },
            { 
                href: 'movies.html', 
                icon: 'fas fa-video', 
                text: 'Movies',
                id: 'movies'
            },
            { 
                href: 'crypto.html', 
                icon: 'fas fa-coins', 
                text: 'Crypto 🪙',
                id: 'crypto'
            },
            { 
                href: 'astronomy.html', 
                icon: 'fas fa-rocket', 
                text: 'Astronomy 🚀',
                id: 'astronomy'
            },
            { 
                href: 'aviation.html', 
                icon: 'fas fa-plane', 
                text: 'Aviation ✈️',
                id: 'aviation'
            },
            // Divider
            { divider: true },
            { 
                href: 'weather.html', 
                icon: 'fas fa-cloud-sun', 
                text: 'Weather',
                id: 'weather'
            },
            { 
                href: 'live-tv.html', 
                icon: 'fas fa-tv', 
                text: 'Live TV',
                id: 'live-tv'
            }
        ];
    }

    createSidebarHTML() {
        const navItems = this.getNavigationItems();
        
        let navHTML = '';
        navItems.forEach(item => {
            if (item.divider) {
                navHTML += '<div class="sidebar-divider"></div>';
            } else {
                const isActive = this.currentPage === item.id ? 'active' : '';
                navHTML += `
                    <a href="${item.href}" class="sidebar-link ${isActive}" data-page="${item.id}">
                        <i class="${item.icon}"></i> ${item.text}
                    </a>
                `;
            }
        });

        return `
            <!-- Sidebar -->
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-content">
                    <div class="sidebar-header">
                        <h3>Navigation</h3>
                        <button class="sidebar-close" id="sidebar-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <nav class="sidebar-nav">
                        ${navHTML}
                    </nav>
                </div>
            </aside>
            
            <!-- Sidebar Backdrop -->
            <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
        `;
    }

    ensureMobileToggle() {
        // Check if mobile toggle exists, if not create it
        if (!document.querySelector('.mobile-menu-toggle')) {
            const headerContent = document.querySelector('.header-content');
            if (headerContent) {
                const toggleHTML = `
                    <div class="mobile-menu-toggle" id="mobile-menu-toggle">
                        <i class="fas fa-bars"></i>
                    </div>
                `;
                headerContent.insertAdjacentHTML('beforeend', toggleHTML);
                console.log('✅ Mobile toggle button created');
            } else {
                console.warn('⚠️ Header content not found - mobile toggle not created');
            }
        } else {
            console.log('ℹ️ Mobile toggle already exists');
        }
    }

    init() {
        // Prevent multiple initializations
        if (this.isInitialized) {
            console.log('⚠️ Sidebar already initialized');
            return;
        }

        console.log('🚀 Initializing sidebar navigation for page:', this.currentPage);

        // Run compatibility check
        if (!this.checkCompatibility()) {
            console.error('❌ Compatibility issues detected - sidebar may not work properly');
        }

        // Remove existing sidebar if present
        const existingSidebar = document.querySelector('.sidebar');
        const existingBackdrop = document.querySelector('.sidebar-backdrop');
        if (existingSidebar) {
            existingSidebar.remove();
            console.log('🗑️ Removed existing sidebar');
        }
        if (existingBackdrop) {
            existingBackdrop.remove();
            console.log('🗑️ Removed existing backdrop');
        }

        // Ensure mobile toggle exists
        this.ensureMobileToggle();

        // Insert sidebar HTML
        document.body.insertAdjacentHTML('afterbegin', this.createSidebarHTML());
        console.log('✅ Sidebar HTML inserted');

        // Get DOM elements
        this.sidebar = document.getElementById('sidebar');
        this.backdrop = document.getElementById('sidebar-backdrop');
        this.mobileToggle = document.getElementById('mobile-menu-toggle');
        this.sidebarClose = document.getElementById('sidebar-close');

        if (!this.sidebar || !this.backdrop) {
            console.error('❌ Failed to find sidebar elements');
            return;
        }

        // Bind events
        this.bindEvents();

        // Add smooth page transitions
        this.addPageTransitions();

        this.isInitialized = true;
        console.log('✅ Sidebar navigation initialized successfully');
    }

    bindEvents() {
        // Mobile toggle click
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openSidebar();
            });
            console.log('✅ Mobile toggle event bound');
        } else {
            console.warn('⚠️ Mobile toggle not found');
        }

        // Close button click
        if (this.sidebarClose) {
            this.sidebarClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeSidebar();
            });
        }

        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebar?.classList.contains('open')) {
                this.closeSidebar();
            }
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (this.sidebar?.classList.contains('open') &&
                !this.sidebar.contains(e.target) &&
                !this.mobileToggle?.contains(e.target)) {
                this.closeSidebar();
            }
        });

        // Handle sidebar link clicks with smooth transitions
        const sidebarLinks = this.sidebar?.querySelectorAll('.sidebar-link');
        sidebarLinks?.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== window.location.pathname.split('/').pop()) {
                    e.preventDefault();
                    this.navigateToPage(href);
                }
            });
        });

        console.log('✅ All sidebar events bound');
    }

    openSidebar() {
        if (this.sidebar && this.backdrop) {
            this.sidebar.classList.add('open');
            this.backdrop.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Add entrance animation
            this.sidebar.style.animation = 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            console.log('📱 Sidebar opened');
        }
    }

    closeSidebar() {
        if (this.sidebar && this.backdrop) {
            this.sidebar.classList.remove('open');
            this.backdrop.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset animation
            setTimeout(() => {
                if (this.sidebar) {
                    this.sidebar.style.animation = '';
                }
            }, 400);
            console.log('📱 Sidebar closed');
        }
    }

    navigateToPage(url) {
        // Add loading indicator
        this.showLoadingIndicator();
        
        // Close sidebar
        this.closeSidebar();
        
        // Add page transition
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.3s ease';
        
        console.log('🔄 Navigating to:', url);
        
        // Navigate after a short delay for smooth transition
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    }

    showLoadingIndicator() {
        // Remove existing loader if present
        const existingLoader = document.querySelector('.page-transition-loader');
        if (existingLoader) {
            existingLoader.remove();
        }

        // Create a subtle loading indicator
        const loader = document.createElement('div');
        loader.className = 'page-transition-loader';
        loader.innerHTML = '<div class="loading-spinner-small"></div>';
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            background: rgba(255, 255, 255, 0.9);
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        document.body.appendChild(loader);
    }

    addPageTransitions() {
        // Add smooth page load animation
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 50);
            });
        }
    }

    // Compatibility check to ensure no conflicts with existing functionality
    checkCompatibility() {
        try {
            // Check if critical page elements exist
            const header = document.querySelector('.header');
            const main = document.querySelector('.main, main, .container');
            
            if (!header) {
                console.warn('⚠️ Header element not found - page structure may be different');
            }
            
            if (!main) {
                console.warn('⚠️ Main content area not found - page structure may be different');
            }
            
            // Check for conflicting scripts or elements
            const existingSidebars = document.querySelectorAll('aside:not(#sidebar)');
            if (existingSidebars.length > 0) {
                console.log('ℹ️ Found existing sidebar elements - ensuring no conflicts');
            }
            
            // Ensure FontAwesome is loaded for icons
            const faLoaded = document.querySelector('link[href*="font-awesome"]') || 
                           document.querySelector('script[src*="font-awesome"]') ||
                           window.FontAwesome;
            
            if (!faLoaded) {
                console.warn('⚠️ FontAwesome may not be loaded - icons might not display');
            }
            
            console.log('✅ Compatibility check completed');
            return true;
        } catch (error) {
            console.error('❌ Compatibility check failed:', error);
            return false;
        }
    }

    // Method to update active link when page changes
    updateActiveLink() {
        const links = this.sidebar?.querySelectorAll('.sidebar-link');
        links?.forEach(link => {
            link.classList.remove('active');
            const dataPage = link.getAttribute('data-page');
            if (dataPage === this.currentPage) {
                link.classList.add('active');
                console.log('✅ Active link set for:', dataPage);
            }
        });
    }

    // Method to refresh the sidebar (useful for dynamic updates)
    refresh() {
        this.isInitialized = false;
        this.currentPage = this.getCurrentPage();
        this.init();
        this.updateActiveLink();
    }
}

// Prevent multiple initializations
let sidebarNavInstance = null;

// Initialize sidebar navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!sidebarNavInstance) {
        sidebarNavInstance = new SidebarNavigation();
        window.sidebarNav = sidebarNavInstance;
        console.log('🎉 Sidebar navigation ready');
    }
});

// Reinitialize if needed (for dynamic content)
window.initSidebarNavigation = () => {
    if (sidebarNavInstance) {
        sidebarNavInstance.refresh();
    } else {
        sidebarNavInstance = new SidebarNavigation();
        window.sidebarNav = sidebarNavInstance;
    }
};

// Debug function for troubleshooting
window.debugSidebar = () => {
    console.log('🔍 Sidebar Debug Info:');
    console.log('Current page:', sidebarNavInstance?.currentPage);
    console.log('Sidebar element:', !!sidebarNavInstance?.sidebar);
    console.log('Mobile toggle:', !!sidebarNavInstance?.mobileToggle);
    console.log('Is initialized:', sidebarNavInstance?.isInitialized);
    
    const navItems = sidebarNavInstance?.getNavigationItems();
    console.log('Navigation items:', navItems?.length);
    navItems?.forEach(item => {
        if (!item.divider) {
            console.log(`- ${item.text} (${item.id})`);
        }
    });
};