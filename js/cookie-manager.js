/**
 * Advanced Cookie Management System for Brightlens News
 * Handles theme preferences, welcome messages, and recently viewed articles
 */

class CookieManager {
    constructor() {
        this.init();
    }

    /**
     * Initialize cookie manager
     */
    init() {
        this.setupWelcomeMessage();
        this.setupThemePersistence();
        this.setupRecentArticlesDisplay();
        this.setupArticleTracking();
    }

    /**
     * Utility function to set cookies with 30-day expiration
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Days until expiration (default 30)
     */
    setCookie(name, value, days = 30) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    /**
     * Utility function to get cookie value
     * @param {string} name - Cookie name
     * @returns {string|null} - Cookie value or null if not found
     */
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    /**
     * Utility function to delete cookie
     * @param {string} name - Cookie name
     */
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }

    /**
     * Setup first-time welcome message
     */
    setupWelcomeMessage() {
        // Check if welcome message has been shown
        const welcomeShown = this.getCookie('welcomeShown');
        
        if (!welcomeShown) {
            // Show welcome message after a short delay
            setTimeout(() => {
                this.showWelcomeMessage();
            }, 1000);
        }
    }

    /**
     * Display welcome message popup
     */
    showWelcomeMessage() {
        // Create welcome popup
        const welcomePopup = document.createElement('div');
        welcomePopup.className = 'welcome-popup';
        welcomePopup.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-header">
                    <span class="welcome-emoji">👋</span>
                    <h3>Welcome to Brightlens News!</h3>
                    <button class="welcome-close" onclick="cookieManager.closeWelcome()">&times;</button>
                </div>
                <p>Enjoy the latest updates tailored for you.</p>
                <button class="welcome-btn" onclick="cookieManager.closeWelcome()">Get Started</button>
            </div>
        `;

        // Add styles
        const styles = `
            <style>
                .welcome-popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                
                .welcome-content {
                    background: var(--surface-color);
                    padding: 2rem;
                    border-radius: 1rem;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--border-color);
                    animation: slideIn 0.3s ease;
                }
                
                .welcome-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                
                .welcome-header h3 {
                    color: var(--text-color);
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .welcome-emoji {
                    font-size: 1.5rem;
                    margin-right: 0.5rem;
                }
                
                .welcome-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }
                
                .welcome-close:hover {
                    background: var(--border-color);
                }
                
                .welcome-content p {
                    color: var(--text-muted);
                    margin-bottom: 1.5rem;
                    line-height: 1.5;
                }
                
                .welcome-btn {
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .welcome-btn:hover {
                    background: var(--secondary-color);
                    transform: translateY(-1px);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @media (max-width: 480px) {
                    .welcome-content {
                        padding: 1.5rem;
                        margin: 1rem;
                    }
                }
            </style>
        `;

        // Add styles to head
        document.head.insertAdjacentHTML('beforeend', styles);
        
        // Add popup to body
        document.body.appendChild(welcomePopup);
    }

    /**
     * Close welcome message and set cookie
     */
    closeWelcome() {
        const welcomePopup = document.querySelector('.welcome-popup');
        if (welcomePopup) {
            welcomePopup.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                welcomePopup.remove();
            }, 300);
        }
        
        // Set cookie to prevent showing again
        this.setCookie('welcomeShown', 'true');
    }

    /**
     * Setup theme persistence using cookies instead of localStorage
     */
    setupThemePersistence() {
        // Override the existing theme manager's localStorage usage
        if (window.themeManager) {
            // Save current localStorage theme to cookie and clear localStorage
            const localStorageTheme = localStorage.getItem('brightlens-theme');
            if (localStorageTheme && !this.getCookie('selectedTheme')) {
                this.setCookie('selectedTheme', localStorageTheme);
                localStorage.removeItem('brightlens-theme');
            }
        }

        // Apply saved theme from cookie
        const savedTheme = this.getCookie('selectedTheme') || 'default';
        this.applyTheme(savedTheme);

        // Override theme switching to use cookies
        this.setupThemeEventListeners();
    }

    /**
     * Apply theme to document
     * @param {string} theme - Theme name
     */
    applyTheme(theme) {
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    /**
     * Setup theme event listeners
     */
    setupThemeEventListeners() {
        // Wait for DOM to be ready
        const setupListeners = () => {
            // Theme buttons in modal
            const themeButtons = document.querySelectorAll('.theme-option');
            themeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const theme = e.currentTarget.dataset.theme;
                    if (theme) {
                        this.setTheme(theme);
                    }
                });
            });

            // Theme toggle button
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    const currentTheme = this.getCookie('selectedTheme') || 'default';
                    const newTheme = currentTheme === 'default' ? 'dark' : 'default';
                    this.setTheme(newTheme);
                });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupListeners);
        } else {
            setupListeners();
        }
    }

    /**
     * Set theme and save to cookie
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        this.applyTheme(theme);
        this.setCookie('selectedTheme', theme);
        
        // Update active theme button
        const themeButtons = document.querySelectorAll('.theme-option');
        themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.theme === theme) {
                button.classList.add('active');
            }
        });
    }

    /**
     * Setup article tracking for external links
     */
    setupArticleTracking() {
        // Track clicks on article links
        document.addEventListener('click', (e) => {
            // Check if clicked element is an article link
            const articleLink = e.target.closest('a[href^="http"], .news-link, .article-link');
            if (articleLink) {
                // Find article title
                let articleTitle = this.extractArticleTitle(articleLink);
                if (articleTitle) {
                    this.saveRecentArticle(articleTitle);
                }
            }

            // Also track ticker items and other clickable article elements
            const tickerItem = e.target.closest('.ticker-item');
            if (tickerItem) {
                const titleElement = tickerItem.querySelector('.ticker-title, h3, .news-title');
                if (titleElement) {
                    this.saveRecentArticle(titleElement.textContent.trim());
                }
            }
        });
    }

    /**
     * Extract article title from link element
     * @param {Element} linkElement - The clicked link element
     * @returns {string|null} - Article title or null
     */
    extractArticleTitle(linkElement) {
        // Try to find title in various ways
        let title = null;

        // 1. Check for title attribute
        if (linkElement.title) {
            title = linkElement.title;
        }
        // 2. Check for data-title attribute
        else if (linkElement.dataset.title) {
            title = linkElement.dataset.title;
        }
        // 3. Look for title in parent container
        else {
            const container = linkElement.closest('.news-item, .article-item, .ticker-item');
            if (container) {
                const titleElement = container.querySelector('.news-title, .article-title, h3, h2');
                if (titleElement) {
                    title = titleElement.textContent;
                }
            }
        }
        // 4. Use link text as fallback
        if (!title && linkElement.textContent.trim()) {
            title = linkElement.textContent.trim();
        }

        return title ? title.substring(0, 100) : null; // Limit title length
    }

    /**
     * Save recently viewed article to cookie
     * @param {string} title - Article title
     */
    saveRecentArticle(title) {
        if (title && title.length > 5) { // Only save meaningful titles
            this.setCookie('recentArticle', title);
        }
    }

    /**
     * Setup recent articles display on homepage
     */
    setupRecentArticlesDisplay() {
        // Only show on homepage
        if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            const recentArticle = this.getCookie('recentArticle');
            if (recentArticle) {
                this.displayRecentArticle(recentArticle);
            }
        }
    }

    /**
     * Display recent article box on homepage
     * @param {string} title - Article title
     */
    displayRecentArticle(title) {
        // Wait for page to load
        const displayBox = () => {
            // Find a good place to insert the recent article box
            const heroSection = document.querySelector('.hero-section');
            const mainContent = document.querySelector('.main-content, main, .container');
            
            const targetElement = heroSection || mainContent;
            if (!targetElement) return;

            // Create recent article box
            const recentBox = document.createElement('div');
            recentBox.className = 'recent-article-box';
            recentBox.innerHTML = `
                <div class="recent-article-content">
                    <span class="recent-article-icon">🕵️</span>
                    <div class="recent-article-text">
                        <strong>Last article you viewed:</strong>
                        <span class="recent-article-title">${title}</span>
                    </div>
                    <button class="recent-article-close" onclick="cookieManager.closeRecentArticle()">&times;</button>
                </div>
            `;

            // Add styles for recent article box
            const styles = `
                <style>
                    .recent-article-box {
                        background: var(--surface-color);
                        border: 1px solid var(--border-color);
                        border-radius: 0.75rem;
                        padding: 1rem;
                        margin: 1rem auto;
                        max-width: 600px;
                        box-shadow: var(--shadow-sm);
                        animation: slideInUp 0.5s ease;
                    }
                    
                    .recent-article-content {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                    }
                    
                    .recent-article-icon {
                        font-size: 1.25rem;
                        flex-shrink: 0;
                    }
                    
                    .recent-article-text {
                        flex: 1;
                        color: var(--text-color);
                        font-size: 0.9rem;
                        line-height: 1.4;
                    }
                    
                    .recent-article-text strong {
                        display: block;
                        margin-bottom: 0.25rem;
                        font-weight: 600;
                    }
                    
                    .recent-article-title {
                        color: var(--text-muted);
                        font-style: italic;
                    }
                    
                    .recent-article-close {
                        background: none;
                        border: none;
                        font-size: 1.25rem;
                        color: var(--text-muted);
                        cursor: pointer;
                        padding: 0;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: background-color 0.2s;
                        flex-shrink: 0;
                    }
                    
                    .recent-article-close:hover {
                        background: var(--border-color);
                    }
                    
                    @keyframes slideInUp {
                        from { 
                            transform: translateY(20px); 
                            opacity: 0; 
                        }
                        to { 
                            transform: translateY(0); 
                            opacity: 1; 
                        }
                    }
                    
                    @media (max-width: 768px) {
                        .recent-article-box {
                            margin: 1rem;
                        }
                        
                        .recent-article-text {
                            font-size: 0.85rem;
                        }
                    }
                </style>
            `;

            // Add styles to head if not already added
            if (!document.querySelector('#recent-article-styles')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'recent-article-styles';
                styleElement.textContent = styles.replace(/<\/?style>/g, '');
                document.head.appendChild(styleElement);
            }

            // Insert after hero section or at the beginning of main content
            if (heroSection) {
                heroSection.insertAdjacentElement('afterend', recentBox);
            } else if (mainContent) {
                mainContent.insertAdjacentElement('afterbegin', recentBox);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', displayBox);
        } else {
            displayBox();
        }
    }

    /**
     * Close recent article box
     */
    closeRecentArticle() {
        const recentBox = document.querySelector('.recent-article-box');
        if (recentBox) {
            recentBox.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => {
                recentBox.remove();
            }, 300);
        }
    }
}

// Initialize cookie manager when script loads
const cookieManager = new CookieManager();

// Make it globally available
window.cookieManager = cookieManager;

// Add slideOutUp animation
const additionalStyles = `
    <style>
        @keyframes slideOutUp {
            from { 
                transform: translateY(0); 
                opacity: 1; 
            }
            to { 
                transform: translateY(-20px); 
                opacity: 0; 
            }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    </style>
`;

document.addEventListener('DOMContentLoaded', () => {
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
});