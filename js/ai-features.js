/**
 * AI-Powered Features for Brightlens News
 * Simple, safe features that enhance user experience
 */

class AIFeatures {
    constructor() {
        this.searchHistory = this.loadSearchHistory();
        this.init();
    }

    init() {
        this.setupReadingTime();
        this.setupSmartSearch();
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

    // ===== SMART SEARCH SUGGESTIONS =====
    setupSmartSearch() {
        const searchInput = document.getElementById('quick-search-input');
        if (!searchInput) return;

        // Enhanced search suggestions based on user behavior
        const enhancedSuggestions = this.generateSmartSuggestions();
        this.updateSearchSuggestions(enhancedSuggestions);
    }

    generateSmartSuggestions() {
        const baseSuggestions = [
            'Breaking News', 'Technology News', 'Sports Updates', 'Weather Forecast',
            'Food Recipes', 'Business News', 'Entertainment News', 'Health News'
        ];

        // Add personalized suggestions based on user history
        const personalizedSuggestions = this.getPersonalizedSuggestions();
        
        return [...baseSuggestions, ...personalizedSuggestions];
    }

    getPersonalizedSuggestions() {
        const suggestions = [];
        
        // Based on search history
        if (this.searchHistory.length > 0) {
            const recentSearches = this.searchHistory.slice(-3);
            suggestions.push(...recentSearches);
        }

        return suggestions.slice(0, 3); // Limit to 3 personalized suggestions
    }

    updateSearchSuggestions(suggestions) {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) return;

        // Check if AI suggestions already exist
        if (suggestionsContainer.querySelector('.ai-suggestions')) return;

        // Add AI-powered suggestions
        const aiSuggestions = document.createElement('div');
        aiSuggestions.className = 'ai-suggestions';
        aiSuggestions.innerHTML = `
            <div class="suggestion-header">
                <i class="fas fa-brain"></i>
                <span>AI Suggestions</span>
            </div>
            ${suggestions.map(suggestion => `
                <div class="suggestion-item ai-suggestion" data-query="${suggestion.toLowerCase()}">
                    <i class="fas fa-lightbulb"></i>
                    <span>${suggestion}</span>
                </div>
            `).join('')}
        `;

        suggestionsContainer.appendChild(aiSuggestions);
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

    // ===== STORAGE FUNCTIONS =====
    loadSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('ai_search_history')) || [];
        } catch {
            return [];
        }
    }

    saveSearchHistory(query) {
        try {
            const history = this.loadSearchHistory();
            if (!history.includes(query)) {
                history.push(query);
                
                // Keep only last 10 searches
                if (history.length > 10) {
                    history.splice(0, history.length - 10);
                }
                
                localStorage.setItem('ai_search_history', JSON.stringify(history));
            }
        } catch (error) {
            console.error('Error saving search history:', error);
        }
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

// Track search queries
document.addEventListener('submit', (e) => {
    try {
        if (e.target.id === 'quick-search-form' && window.aiFeatures) {
            const query = e.target.querySelector('input').value.trim();
            if (query) {
                window.aiFeatures.saveSearchHistory(query);
            }
        }
    } catch (error) {
        console.error('Error tracking search query:', error);
    }
});