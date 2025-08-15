/**
 * AI-Powered Features for Brightlens News
 * Simple, safe features that enhance user experience
 */

class AIFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.setupReadingTime();
    }

    // ===== READING TIME ESTIMATION =====
    setupReadingTime() {
        // Calculate reading time for articles
        const articles = document.querySelectorAll('.article-card, .recipe-card, .ticker-item');
        articles.forEach(article => {
            // Check if reading time badge already exists
            if (article.querySelector('.reading-time-badge')) return;
            
            const textContent = this.extractTextContent(article);
            const readingTime = this.calculateReadingTime(textContent);
            this.addReadingTimeBadge(article, readingTime);
        });
    }

    extractTextContent(element) {
        const title = element.querySelector('.article-title, .recipe-title, .ticker-title')?.textContent || '';
        const description = element.querySelector('.article-description, .recipe-summary, .ticker-description')?.textContent || '';
        return `${title} ${description}`;
    }

    calculateReadingTime(text) {
        const wordsPerMinute = 200; // Average reading speed
        const wordCount = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return Math.max(1, minutes); // Minimum 1 minute
    }

    addReadingTimeBadge(element, minutes) {
        const badge = document.createElement('div');
        badge.className = 'reading-time-badge';
        badge.innerHTML = `<i class="fas fa-clock"></i> ${minutes} min read`;
        
        // Add to article card
        const cardHeader = element.querySelector('.article-image, .recipe-image, .ticker-image')?.parentElement || element;
        cardHeader.appendChild(badge);
    }



    // ===== UTILITY FUNCTIONS =====
    showFeedback(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }


}

// Initialize AI Features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.aiFeatures = new AIFeatures();
    } catch (error) {
        console.error('AI Features initialization failed:', error);
        // Graceful degradation - features won't work but site continues to function
    }
});

