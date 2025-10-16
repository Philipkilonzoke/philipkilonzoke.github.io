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
        try{
            if (typeof window !== 'undefined' && Array.isArray(window.BL_NAV_ITEMS) && window.BL_NAV_ITEMS.length){
                return window.BL_NAV_ITEMS;
            }
        }catch(_){ /* noop */ }
        const items = [
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
                href: 'food.html', 
                icon: 'fas fa-utensils', 
                text: 'Food & Recipes',
                id: 'food'
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
                href: 'live-flight-tracker.html', 
                icon: 'fas fa-plane', 
                text: 'Live Flight Tracker ✈️',
                id: 'aviation'
            },
            { 
                href: 'ai.html', 
                icon: 'fas fa-robot', 
                text: 'AI & ML',
                id: 'ai'
            },
            { 
                href: 'climate.html', 
                icon: 'fas fa-leaf', 
                text: 'Climate',
                id: 'climate'
            },
            { 
                href: 'fact-check.html', 
                icon: 'fas fa-check-double', 
                text: 'Fact-Check',
                id: 'fact-check'
            },

            { 
                href: 'science.html', 
                icon: 'fas fa-flask', 
                text: 'Science',
                id: 'science'
            },
            { 
                href: 'cybersecurity.html', 
                icon: 'fas fa-shield-alt', 
                text: 'Cybersecurity',
                id: 'cybersecurity'
            },
            { 
                href: 'markets.html', 
                icon: 'fas fa-chart-area', 
                text: 'Markets',
                id: 'markets'
            },
            { 
                href: 'mobility.html', 
                icon: 'fas fa-bus', 
                text: 'Mobility',
                id: 'mobility'
            },
            { 
                href: 'gaming.html', 
                icon: 'fas fa-gamepad', 
                text: 'Gaming',
                id: 'gaming'
            },
            { 
                href: 'africa.html', 
                icon: 'fas fa-globe-africa', 
                text: 'Africa',
                id: 'africa'
            },
            { href: 'energy.html', icon: 'fas fa-bolt', text: 'Energy', id: 'energy' },
            { href: 'spaceflight.html', icon: 'fas fa-space-shuttle', text: 'Spaceflight', id: 'spaceflight' },
            { href: 'real-estate.html', icon: 'fas fa-city', text: 'Real Estate', id: 'real-estate' },
            { href: 'agriculture.html', icon: 'fas fa-seedling', text: 'Agriculture', id: 'agriculture' },
            { href: 'personal-finance.html', icon: 'fas fa-wallet', text: 'Personal Finance', id: 'personal-finance' },
            { href: 'politics.html', icon: 'fas fa-landmark', text: 'Politics', id: 'politics' },
            { href: 'travel.html', icon: 'fas fa-suitcase-rolling', text: 'Travel', id: 'travel' },
            { href: 'startups.html', icon: 'fas fa-rocket', text: 'Startups', id: 'startups' },
            { href: 'quantum.html', icon: 'fas fa-atom', text: 'Quantum', id: 'quantum' },
            { href: 'robotics.html', icon: 'fas fa-robot', text: 'Robotics', id: 'robotics' },
            { href: 'ar-vr.html', icon: 'fas fa-vr-cardboard', text: 'AR/VR', id: 'ar-vr' },
            { href: 'iot.html', icon: 'fas fa-house-signal', text: 'Smart Home & IoT', id: 'iot' },
            { href: 'biotech.html', icon: 'fas fa-dna', text: 'Biotech', id: 'biotech' },
            { href: 'defense.html', icon: 'fas fa-shield-halved', text: 'Defense', id: 'defense' },
            { href: 'maritime.html', icon: 'fas fa-ship', text: 'Maritime', id: 'maritime' },
            { href: 'logistics.html', icon: 'fas fa-truck', text: 'Logistics', id: 'logistics' },
            { href: 'ecommerce.html', icon: 'fas fa-bag-shopping', text: 'E-commerce', id: 'ecommerce' },
            { href: 'cloud.html', icon: 'fas fa-cloud', text: 'Cloud & SaaS', id: 'cloud' },
            { href: 'dev-open-source.html', icon: 'fas fa-code', text: 'Dev & OSS', id: 'dev-open-source' },
            { href: 'europe.html', icon: 'fas fa-globe-europe', text: 'Europe', id: 'europe' },
            { href: 'north-america.html', icon: 'fas fa-flag-usa', text: 'North America', id: 'north-america' },
            { href: 'latin-america.html', icon: 'fas fa-earth-americas', text: 'Latin America', id: 'latin-america' },
            { href: 'asia-pacific.html', icon: 'fas fa-earth-asia', text: 'Asia–Pacific', id: 'asia-pacific' },
            { href: 'mena.html', icon: 'fas fa-globe', text: 'Middle East & North Africa', id: 'mena' },
            // Divider
            { divider: true }
        ];
        try{ if (typeof window !== 'undefined') { window.BL_NAV_ITEMS = items; } }catch(_){ /* noop */ }
        return items;
    }

    createSidebarHTML() {
        const navItems = this.getNavigationItems();
        
        const buildLink = (item) => {
            if (!item) return '';
            const isActive = this.currentPage === item.id ? 'active' : '';
            return `
                    <a href="${item.href}" class="sidebar-link ${isActive}" data-page="${item.id}">
                        <i class="${item.icon}"></i> ${item.text}
                    </a>
                `;
        };

        // Identify top-pair items
        const topHome = navItems.find(i => i && i.id === 'index');
        const topWeather = navItems.find(i => i && i.id === 'weather');
        const topBreaking = navItems.find(i => i && i.id === 'latest');
        const topLiveTV = navItems.find(i => i && i.id === 'live-tv');

        // Build two-row, two-column layout for the top section only
        let navHTML = '';
        navHTML += `
            <div class="sidebar-top-grid" style="display: grid; gap: 8px;">
                <div class="sidebar-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${buildLink(topHome)}
                    ${buildLink(topWeather)}
                </div>
                <div class="sidebar-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${buildLink(topBreaking)}
                    ${buildLink(topLiveTV)}
                </div>
            </div>
        `;

        // Divider between the top grid and the rest
        navHTML += '<div class="sidebar-divider"></div>';

        // Render remaining items (from Kenyan News downward) in a two-column grid, excluding the top 4
        const excludedIds = new Set(['index','weather','latest','live-tv']);
        const lowerLinks = navItems
            .filter(item => item && !item.divider && !excludedIds.has(item.id))
            .map(item => {
                const isActive = this.currentPage === item.id ? 'active' : '';
                return `
                    <a href="${item.href}" class="sidebar-link ${isActive}" data-page="${item.id}">
                        <i class="${item.icon}"></i> ${item.text}
                    </a>
                `;
            }).join('');

        navHTML += `
            <div class="sidebar-lower-grid">
                ${lowerLinks}
            </div>
        `;

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

        // Normalize internal links to .html files to avoid 404s on static hosting
        this.normalizeInternalLinks();

        this.isInitialized = true;
        console.log('✅ Sidebar navigation initialized successfully');

        // Conditionally load AI panel script for supported categories (AI & below)
        this.maybeLoadAIScript();
    }

    maybeLoadAIScript() {
        try{
            // Exclude: sports, health, lifestyle, technology, latest (breaking), world, entertainment, kenya
            const allowed = new Set([
                'ai','climate','fact-check','science','cybersecurity','markets','mobility','gaming','africa','energy','spaceflight','real-estate','agriculture','personal-finance','politics','travel','startups','quantum','robotics','ar-vr','iot','biotech','defense','maritime','logistics','ecommerce','cloud','dev-open-source'
            ]);
            const excluded = new Set(['sports','health','lifestyle','technology','latest','world','entertainment','kenya']);
            const slug = this.currentPage;
            // Enable for new regions as well
            const regionAllowed = new Set(['europe','north-america','latin-america','asia-pacific','mena']);
            if (!(allowed.has(slug) || regionAllowed.has(slug)) || excluded.has(slug)) return;
            const hasConfig = document.querySelector('script[src*="/js/ai-config.js"]');
            if (!hasConfig){
                const c = document.createElement('script');
                c.src = '/js/ai-config.js';
                c.defer = true;
                document.head.appendChild(c);
            }
            const already = document.querySelector('script[src*="/js/brightlens-ai.js"]');
            if (already) return;
            const s = document.createElement('script');
            s.src = '/js/brightlens-ai.js';
            s.defer = true;
            document.head.appendChild(s);
            console.log('🧠 AI panel script loaded for category:', slug);
        }catch(e){ console.warn('AI script load skipped:', e); }
    }

    // Ensure internal absolute links use relative .html paths (e.g., /technology -> technology.html)
    normalizeInternalLinks() {
        try {
            const navItems = this.getNavigationItems().filter(i => !i.divider).map(i => i.href);
            const knownPaths = new Set(navItems.concat(['index.html']));
            // Match any internal absolute link (header, footer, or elsewhere)
            const anchors = document.querySelectorAll('a[href^="/"]');
            anchors.forEach(a => {
                const raw = a.getAttribute('href') || '';
                if (!raw || raw.startsWith('http')) return;
                if (raw === '/') { a.setAttribute('href', 'index.html'); return; }
                if (!raw.endsWith('.html')) {
                    const candidate = raw.replace(/^\//, '') + '.html';
                    if (knownPaths.has(candidate)) {
                        a.setAttribute('href', candidate);
                    }
                }
            });
            console.log('🔗 Header links normalized (where applicable)');
        } catch (e) {
            console.warn('Header link normalization failed:', e);
        }
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

        // Handle sidebar link clicks - INSTANT navigation (no delays or transitions)
        const sidebarLinks = this.sidebar?.querySelectorAll('.sidebar-link');
        sidebarLinks?.forEach(link => {
            link.addEventListener('click', () => {
                // Just close sidebar - let browser handle navigation instantly
                this.closeSidebar();
            });
        });

        console.log('✅ All sidebar events bound');
    }

    openSidebar() {
        if (this.sidebar && this.backdrop) {
            this.sidebar.classList.add('open');
            this.backdrop.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeSidebar() {
        if (this.sidebar && this.backdrop) {
            this.sidebar.classList.remove('open');
            this.backdrop.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // REMOVED: navigateToPage method - was causing delays
    // REMOVED: showLoadingIndicator method - was causing loading spinners
    // Browser handles navigation naturally now

    addPageTransitions() {
        // No page transitions - instant navigation like before
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

    // Cleanup method to remove any residual loading indicators or transitions
    cleanup() {
        // Remove any leftover loading indicators
        const loaders = document.querySelectorAll('.page-transition-loader');
        loaders.forEach(loader => loader.remove());
        
        // Reset body styles that might interfere with navigation
        document.body.style.opacity = '';
        document.body.style.transition = '';
        
        console.log('🧹 Sidebar cleanup completed');
    }
}

// Prevent multiple initializations
let sidebarNavInstance = null;

// Initialize sidebar navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!sidebarNavInstance) {
        // Delay sidebar initialization slightly to avoid conflicts with CategoryNews
        setTimeout(() => {
            // Check if there's an active loading screen that might be managed by CategoryNews
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                console.log('⏳ Waiting for loading screen to complete before initializing sidebar...');
                // Wait a bit longer if loading screen is still active
                setTimeout(() => {
                    sidebarNavInstance = new SidebarNavigation();
                    window.sidebarNav = sidebarNavInstance;
                    console.log('🎉 Sidebar navigation ready (after loading screen)');
                }, 500);
            } else {
                sidebarNavInstance = new SidebarNavigation();
                window.sidebarNav = sidebarNavInstance;
                console.log('🎉 Sidebar navigation ready');
            }
        }, 100);
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