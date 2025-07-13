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
