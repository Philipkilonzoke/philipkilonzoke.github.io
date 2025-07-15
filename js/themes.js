/**
 * Theme Management System for Brightlens News
 * Handles theme switching and persistence
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themes = [
            { id: 'default', name: 'Default', description: 'Clean and modern light theme' },
            { id: 'dark', name: 'Dark', description: 'Easy on the eyes dark theme' },
            { id: 'blue', name: 'Ocean Blue', description: 'Calming blue ocean theme' },
            { id: 'green', name: 'Forest Green', description: 'Natural forest green theme' },
            { id: 'purple', name: 'Royal Purple', description: 'Elegant purple theme' },
            { id: 'orange', name: 'Sunset Orange', description: 'Warm sunset orange theme' },
            { id: 'rose', name: 'Rose Pink', description: 'Beautiful rose pink theme' },
            { id: 'emerald', name: 'Emerald', description: 'Rich emerald green theme' },
            { id: 'indigo', name: 'Indigo', description: 'Deep indigo blue theme' },
            { id: 'amber', name: 'Amber', description: 'Golden amber theme' },
            { id: 'teal', name: 'Teal', description: 'Refreshing teal theme' },
            { id: 'crimson', name: 'Crimson', description: 'Bold crimson red theme' }
        ];
        
        this.init();
    }

    init() {
        // Apply saved theme immediately
        this.applySavedTheme();
        
        // Set up event listeners when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    applySavedTheme() {
        // Get saved theme from localStorage
        const savedTheme = localStorage.getItem('brightlens-theme') || 'default';
        this.setTheme(savedTheme, false);
    }

    setupEventListeners() {
        // First, populate the theme options
        this.populateThemeOptions();
        
        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.openThemeModal());
        }

        // Theme modal controls
        const themeModal = document.getElementById('theme-modal');
        const themeModalClose = document.querySelector('.theme-modal-close');
        
        if (themeModalClose) {
            themeModalClose.addEventListener('click', () => this.closeThemeModal());
        }

        if (themeModal) {
            themeModal.addEventListener('click', (e) => {
                if (e.target === themeModal) {
                    this.closeThemeModal();
                }
            });
        }

        // Theme option buttons
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                this.closeThemeModal();
            });
        });

        // Update active theme option
        this.updateActiveThemeOption();
    }

    populateThemeOptions() {
        const themeGrid = document.querySelector('.theme-grid');
        if (!themeGrid) return;

        // Clear existing options
        themeGrid.innerHTML = '';

        // Create theme option elements
        this.themes.forEach(theme => {
            const themeOption = document.createElement('div');
            themeOption.className = 'theme-option';
            themeOption.dataset.theme = theme.id;
            
            themeOption.innerHTML = `
                <div class="theme-preview theme-preview-${theme.id}"></div>
                <div class="theme-info">
                    <h4>${theme.name}</h4>
                    <p>${theme.description}</p>
                </div>
                <div class="theme-check">
                    <i class="fas fa-check"></i>
                </div>
            `;

            themeGrid.appendChild(themeOption);
        });

        // Re-attach event listeners to new options
        const newThemeOptions = document.querySelectorAll('.theme-option');
        newThemeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                this.closeThemeModal();
            });
        });
    }

    setTheme(themeId, save = true) {
        // Remove current theme
        document.body.removeAttribute('data-theme');
        
        // Apply new theme
        if (themeId !== 'default') {
            document.body.setAttribute('data-theme', themeId);
        }
        
        this.currentTheme = themeId;
        
        // Save to localStorage
        if (save) {
            localStorage.setItem('brightlens-theme', themeId);
        }
        
        // Update UI
        this.updateActiveThemeOption();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeId } 
        }));
    }

    openThemeModal() {
        const modal = document.getElementById('theme-modal');
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    closeThemeModal() {
        const modal = document.getElementById('theme-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    updateActiveThemeOption() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemes() {
        return this.themes;
    }

    cycleTheme() {
        const currentIndex = this.themes.findIndex(theme => theme.id === this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex].id);
    }
}

// Initialize theme manager
window.themeManager = new ThemeManager();

// Keyboard shortcut for theme cycling (Ctrl/Cmd + Shift + T)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        window.themeManager.cycleTheme();
    }
});

/**
 * ===============================================================
 * Navigation / Sidebar Synchronizer  +  Universal 3-D Splash Loader
 * ---------------------------------------------------------------
 *  ‑ Injects any missing category links into the <nav> & sidebar
 *  ‑ Dynamically adds splash-screen assets if a page didn’t include them
 *  ‑ Keeps markup changes minimal & works on every Brightlens page
 * ===============================================================
 */
(() => {
    // Central category registry (order matters)
    const categories = [
        { href: 'latest.html',     nav: 'Latest',       side: 'Latest News',   icon: 'fas fa-home' },
        { href: 'kenya.html',      nav: 'Kenya',        side: 'Kenyan News',   icon: 'fas fa-flag' },
        { href: 'world.html',      nav: 'World',        side: 'World News',    icon: 'fas fa-globe' },
        { href: 'entertainment.html', nav: 'Entertainment', side: 'Entertainment', icon: 'fas fa-film' },
        { href: 'technology.html', nav: 'Technology',   side: 'Technology',    icon: 'fas fa-microchip' },
        { href: 'business.html',   nav: 'Business',     side: 'Business',      icon: 'fas fa-chart-line' },
        { href: 'sports.html',     nav: 'Sports',       side: 'Sports',        icon: 'fas fa-football-ball' },
        { href: 'health.html',     nav: 'Health',       side: 'Health',        icon: 'fas fa-heartbeat' },
        { href: 'lifestyle.html',  nav: 'Lifestyle',    side: 'Lifestyle',     icon: 'fas fa-spa' },
        { href: 'music.html',      nav: 'Music',        side: 'Music',         icon: 'fas fa-music' }
    ];

    const whenReady = (cb) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', cb, { once: true });
        } else {
            cb();
        }
    };

    // Helper to create <script> dynamically
    const loadScript = (src, defer = false, onload) => {
        if (document.querySelector(`script[src="${src}"]`)) return; // already loaded
        const s = document.createElement('script');
        s.src = src;
        if (defer) s.defer = true;
        if (onload) s.onload = onload;
        document.head.appendChild(s);
    };

    // Helper to ensure CSS present
    const ensureCSS = (href) => {
        if (document.querySelector(`link[href="${href}"]`)) return;
        const l = document.createElement('link');
        l.rel = 'preload';
        l.as  = 'style';
        l.href = href;
        l.onload = function () { this.rel = 'stylesheet'; };
        document.head.appendChild(l);
    };

    whenReady(() => {
        /* ------------------ 1) Sync Top Navigation ------------------ */
        const navLinksContainer = document.querySelector('.nav .nav-links');
        if (navLinksContainer) {
            categories.forEach(cat => {
                if (!navLinksContainer.querySelector(`a[href="${cat.href}"]`)) {
                    const a = document.createElement('a');
                    a.href = cat.href;
                    a.className = 'nav-link';
                    a.textContent = cat.nav;
                    navLinksContainer.appendChild(a);
                }
            });
        }

        /* ------------------ 2) Sync Sidebar Navigation -------------- */
        const sidebarNav = document.querySelector('.sidebar-nav');
        if (sidebarNav) {
            // Reference node to keep extra links (Weather, etc.) below categories
            const divider = sidebarNav.querySelector('.sidebar-divider');
            categories.forEach(cat => {
                if (!sidebarNav.querySelector(`a[href="${cat.href}"]`)) {
                    const a = document.createElement('a');
                    a.href = cat.href;
                    a.className = 'sidebar-link';
                    a.innerHTML = `<i class="${cat.icon}"></i> ${cat.side}`;
                    if (divider) {
                        sidebarNav.insertBefore(a, divider);
                    } else {
                        sidebarNav.appendChild(a);
                    }
                }
            });
        }

        /* ------------------ 3) Universal Splash Assets -------------- */
        // CSS (for immediate paint of 3-D splash)
        ensureCSS('css/splash-screen.css');

        // JS (load splash + transitions if they haven’t been included yet)
        if (!window.SplashScreen3D) {
            loadScript('js/splash-screen.js', false, () => {
                // After splash script arrives, make sure page-transitions is present
                if (!window.pageTransitions) {
                    loadScript('js/page-transitions.js', true);
                }
            });
        }
    });
})();
