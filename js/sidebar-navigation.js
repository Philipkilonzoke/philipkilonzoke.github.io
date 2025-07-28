// Sidebar Navigation Component
class SidebarNavigation {
    constructor() {
        this.sidebar = null;
        this.backdrop = null;
        this.mobileToggle = null;
        this.sidebarClose = null;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename.replace('.html', '') || 'index';
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
                    <a href="${item.href}" class="sidebar-link ${isActive}">
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
            }
        }
    }

    init() {
        // Remove existing sidebar if present
        const existingSidebar = document.querySelector('.sidebar');
        const existingBackdrop = document.querySelector('.sidebar-backdrop');
        if (existingSidebar) existingSidebar.remove();
        if (existingBackdrop) existingBackdrop.remove();

        // Ensure mobile toggle exists
        this.ensureMobileToggle();

        // Insert sidebar HTML
        document.body.insertAdjacentHTML('afterbegin', this.createSidebarHTML());

        // Get DOM elements
        this.sidebar = document.getElementById('sidebar');
        this.backdrop = document.getElementById('sidebar-backdrop');
        this.mobileToggle = document.getElementById('mobile-menu-toggle');
        this.sidebarClose = document.getElementById('sidebar-close');

        // Bind events
        this.bindEvents();

        // Add smooth page transitions
        this.addPageTransitions();
    }

    bindEvents() {
        // Mobile toggle click
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openSidebar();
            });
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
                if (link.href && link.href !== window.location.href) {
                    e.preventDefault();
                    this.navigateToPage(link.href);
                }
            });
        });
    }

    openSidebar() {
        if (this.sidebar && this.backdrop) {
            this.sidebar.classList.add('open');
            this.backdrop.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Add entrance animation
            this.sidebar.style.animation = 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
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
        
        // Navigate after a short delay for smooth transition
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    }

    showLoadingIndicator() {
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
        document.addEventListener('DOMContentLoaded', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);
        });
    }

    // Method to update active link when page changes
    updateActiveLink() {
        const links = this.sidebar?.querySelectorAll('.sidebar-link');
        links?.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            const linkId = href ? href.replace('.html', '') : '';
            if (linkId === this.currentPage || 
                (this.currentPage === 'index' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize sidebar navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarNav = new SidebarNavigation();
});

// Reinitialize if needed (for dynamic content)
window.initSidebarNavigation = () => {
    window.sidebarNav = new SidebarNavigation();
};