/**
 * Simple Features for Brightlens News
 * Ultra-reliable features that enhance user experience
 * No external dependencies, pure JavaScript
 */

class SimpleFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.setupBackToTop();
        this.setupReadingProgress();
        this.setupCopyLinks();
        this.setupReadingTime();
    }

    /**
     * Back to Top Button
     */
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'flex';
                setTimeout(() => backToTopBtn.classList.add('visible'), 10);
            } else {
                backToTopBtn.classList.remove('visible');
                setTimeout(() => backToTopBtn.style.display = 'none', 300);
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Reading Progress Bar
     */
    setupReadingProgress() {
        const progressBar = document.getElementById('reading-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }

    /**
     * Copy Article Links
     */
    setupCopyLinks() {
        // Add copy buttons to existing news cards
        this.addCopyButtonsToCards();
        
        // Listen for new cards being added (for dynamic content)
        const observer = new MutationObserver(() => {
            this.addCopyButtonsToCards();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addCopyButtonsToCards() {
        const newsCards = document.querySelectorAll('.news-card, .ticker-item');
        
        newsCards.forEach(card => {
            // Skip if already has copy button
            if (card.querySelector('.copy-link-btn')) return;
            
            const link = card.querySelector('a[href]') || card;
            const url = link.href || link.getAttribute('onclick')?.match(/window\.open\('([^']+)'/)?.[1];
            
            if (url) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-link-btn';
                copyBtn.innerHTML = '<i class="fas fa-link"></i>';
                copyBtn.title = 'Copy link';
                
                copyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.copyToClipboard(url, copyBtn);
                });
                
                card.style.position = 'relative';
                card.appendChild(copyBtn);
            }
        });
    }

    async copyToClipboard(text, button) {
        try {
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            
            // Visual feedback
            button.classList.add('copied');
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.title = 'Copied!';
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = '<i class="fas fa-link"></i>';
                button.title = 'Copy link';
            }, 2000);
            
        } catch (error) {
            console.log('Copy failed:', error);
            // Fallback: show URL in alert
            alert('Link: ' + text);
        }
    }

    /**
     * Reading Time Estimator
     */
    setupReadingTime() {
        // Add reading time to existing news cards
        this.addReadingTimeToCards();
        
        // Listen for new cards being added
        const observer = new MutationObserver(() => {
            this.addReadingTimeToCards();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addReadingTimeToCards() {
        const newsCards = document.querySelectorAll('.news-card, .ticker-item');
        
        newsCards.forEach(card => {
            // Skip if already has reading time
            if (card.querySelector('.reading-time')) return;
            
            const title = card.querySelector('.news-title, .ticker-title')?.textContent || '';
            const description = card.querySelector('.news-description, .ticker-description')?.textContent || '';
            
            const readingTime = this.calculateReadingTime(title + ' ' + description);
            
            if (readingTime > 0) {
                const timeBadge = document.createElement('div');
                timeBadge.className = 'reading-time';
                timeBadge.textContent = `${readingTime} min read`;
                
                card.style.position = 'relative';
                card.appendChild(timeBadge);
            }
        });
    }

    calculateReadingTime(text) {
        if (!text) return 0;
        
        // Average reading speed: 200-250 words per minute
        const words = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / 200);
        
        // Return minimum 1 minute for very short articles
        return Math.max(readingTime, 1);
    }
}

// Initialize simple features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simpleFeatures = new SimpleFeatures();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleFeatures;
}