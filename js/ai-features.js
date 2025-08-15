/**
 * AI-Powered Features for Brightlens News
 * Simple, reliable features that enhance user experience
 */

class AIFeatures {
    constructor() {
        this.userPreferences = this.loadUserPreferences();
        this.readingHistory = this.loadReadingHistory();
        this.searchHistory = this.loadSearchHistory();
        this.init();
    }

    init() {
        this.setupReadingTime();
        this.setupSmartSearch();
        this.setupRecommendations();
        this.setupContentFiltering();
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
        
        // Based on reading history
        if (this.readingHistory.length > 0) {
            const recentCategories = this.readingHistory.slice(-5).map(item => item.category);
            const popularCategory = this.getMostFrequent(recentCategories);
            if (popularCategory) {
                suggestions.push(`${popularCategory} Latest`);
            }
        }

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

    // ===== PERSONALIZED RECOMMENDATIONS =====
    setupRecommendations() {
        // Add recommendations section to homepage
        this.addRecommendationsSection();
    }

    addRecommendationsSection() {
        const mainContent = document.querySelector('main');
        if (!mainContent) return;

        // Check if recommendations section already exists
        if (document.querySelector('.recommendations-section')) return;

        const recommendationsSection = document.createElement('section');
        recommendationsSection.className = 'recommendations-section';
        recommendationsSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2><i class="fas fa-star"></i> Recommended for You</h2>
                    <p>Based on your reading preferences</p>
                </div>
                <div class="recommendations-grid" id="recommendations-grid">
                    <div class="loading-placeholder">
                        <div class="loading-spinner"></div>
                        <p>Loading personalized recommendations...</p>
                    </div>
                </div>
            </div>
        `;

        // Insert after the first section
        const firstSection = mainContent.querySelector('section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(recommendationsSection, firstSection.nextSibling);
        }

        // Load recommendations
        this.loadRecommendations();
    }

    async loadRecommendations() {
        try {
            // Get user preferences
            const preferredCategories = this.getPreferredCategories();
            
            // Load articles from preferred categories
            const recommendations = await this.fetchRecommendedArticles(preferredCategories);
            
            // Display recommendations
            this.displayRecommendations(recommendations);
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    }

    getPreferredCategories() {
        if (this.readingHistory.length === 0) {
            return ['latest', 'technology', 'sports']; // Default categories
        }

        const categoryCounts = {};
        this.readingHistory.forEach(item => {
            categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        });

        return Object.keys(categoryCounts)
            .sort((a, b) => categoryCounts[b] - categoryCounts[a])
            .slice(0, 3);
    }

    async fetchRecommendedArticles(categories) {
        // Since we don't have an API, we'll use existing articles from the page
        const articles = [];
        
        // Get existing articles from the page
        const existingArticles = document.querySelectorAll('.article-card, .recipe-card, .ticker-item');
        
        if (existingArticles.length > 0) {
            // Convert existing articles to recommendation format
            existingArticles.forEach((article, index) => {
                if (index < 6) { // Limit to 6 recommendations
                    const title = article.querySelector('.article-title, .recipe-title, .ticker-title')?.textContent || '';
                    const description = article.querySelector('.article-description, .recipe-summary, .ticker-description')?.textContent || '';
                    const image = article.querySelector('.article-image, .recipe-image, .ticker-image')?.src || '';
                    const url = article.getAttribute('onclick')?.match(/window\.open\('([^']+)'/)?.[1] || '#';
                    
                    articles.push({
                        title,
                        description,
                        urlToImage: image,
                        url,
                        source: { name: 'Brightlens News' },
                        publishedAt: new Date().toISOString()
                    });
                }
            });
        }
        
        // If no articles found, show a friendly message
        if (articles.length === 0) {
            this.showNoRecommendationsMessage();
        }

        return articles;
    }

    displayRecommendations(articles) {
        const grid = document.getElementById('recommendations-grid');
        if (!grid) return;

        if (articles.length === 0) {
            this.showNoRecommendationsMessage();
            return;
        }

        grid.innerHTML = articles.map(article => `
            <div class="recommendation-card" onclick="window.open('${article.url}', '_blank')">
                <div class="recommendation-image">
                    <img src="${article.urlToImage || '/images/placeholder.jpg'}" 
                         alt="${article.title}" 
                         onerror="this.src='/images/placeholder.jpg'">
                    <div class="reading-time-badge">
                        <i class="fas fa-clock"></i> ${this.calculateReadingTime(article.title + ' ' + (article.description || ''))} min read
                    </div>
                </div>
                <div class="recommendation-content">
                    <h3 class="recommendation-title">${article.title}</h3>
                    <p class="recommendation-description">${article.description || ''}</p>
                    <div class="recommendation-meta">
                        <span class="recommendation-source">${article.source?.name || 'Brightlens News'}</span>
                        <span class="recommendation-date">${this.formatDate(article.publishedAt)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showNoRecommendationsMessage() {
        const grid = document.getElementById('recommendations-grid');
        if (!grid) return;

        grid.innerHTML = `
            <div class="no-recommendations">
                <div class="no-recommendations-content">
                    <i class="fas fa-star"></i>
                    <h3>Start Exploring!</h3>
                    <p>Read some articles to get personalized recommendations</p>
                    <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="explore-btn">
                        <i class="fas fa-arrow-up"></i>
                        Explore Articles
                    </button>
                </div>
            </div>
        `;
    }

    // ===== SMART CONTENT FILTERING =====
    setupContentFiltering() {
        // Add "Show more/less like this" buttons to article cards
        this.addContentFilterButtons();
    }

    addContentFilterButtons() {
        const articles = document.querySelectorAll('.article-card, .recipe-card');
        
        articles.forEach(article => {
            // Check if filter button already exists
            if (article.querySelector('.content-filter-btn')) return;
            
            const filterButton = document.createElement('button');
            filterButton.className = 'content-filter-btn';
            filterButton.innerHTML = '<i class="fas fa-thumbs-up"></i> Show more like this';
            filterButton.onclick = (e) => {
                e.stopPropagation();
                this.handleContentFilter(article, 'more');
            };

            const cardActions = article.querySelector('.article-actions, .recipe-actions') || article;
            cardActions.appendChild(filterButton);
        });
    }

    handleContentFilter(article, action) {
        const articleData = this.extractArticleData(article);
        
        if (action === 'more') {
            this.userPreferences.likedCategories = this.userPreferences.likedCategories || [];
            this.userPreferences.likedCategories.push(articleData.category);
            this.saveUserPreferences();
            
            // Show feedback
            this.showFeedback('We\'ll show you more content like this!', 'success');
        }
    }

    extractArticleData(article) {
        const title = article.querySelector('.article-title, .recipe-title')?.textContent || '';
        const category = this.detectCategoryFromTitle(title);
        
        return {
            title,
            category,
            timestamp: new Date().toISOString()
        };
    }

    detectCategoryFromTitle(title) {
        const titleLower = title.toLowerCase();
        
        if (titleLower.includes('tech') || titleLower.includes('ai') || titleLower.includes('software')) return 'technology';
        if (titleLower.includes('sport') || titleLower.includes('football') || titleLower.includes('basketball')) return 'sports';
        if (titleLower.includes('food') || titleLower.includes('recipe') || titleLower.includes('cook')) return 'food';
        if (titleLower.includes('weather') || titleLower.includes('climate')) return 'weather';
        if (titleLower.includes('business') || titleLower.includes('economy')) return 'business';
        
        return 'latest';
    }

    // ===== UTILITY FUNCTIONS =====
    getMostFrequent(array) {
        const counts = {};
        array.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });
        
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    }

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
    loadUserPreferences() {
        try {
            return JSON.parse(localStorage.getItem('ai_user_preferences')) || {};
        } catch {
            return {};
        }
    }

    saveUserPreferences() {
        try {
            localStorage.setItem('ai_user_preferences', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.error('Error saving user preferences:', error);
        }
    }

    loadReadingHistory() {
        try {
            return JSON.parse(localStorage.getItem('ai_reading_history')) || [];
        } catch {
            return [];
        }
    }

    saveReadingHistory(item) {
        try {
            const history = this.loadReadingHistory();
            history.push({ ...item, timestamp: new Date().toISOString() });
            
            // Keep only last 50 items
            if (history.length > 50) {
                history.splice(0, history.length - 50);
            }
            
            localStorage.setItem('ai_reading_history', JSON.stringify(history));
        } catch (error) {
            console.error('Error saving reading history:', error);
        }
    }

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

// Track user interactions for better recommendations
document.addEventListener('click', (e) => {
    try {
        const articleCard = e.target.closest('.article-card, .recipe-card, .ticker-item');
        if (articleCard && window.aiFeatures) {
            const articleData = window.aiFeatures.extractArticleData(articleCard);
            window.aiFeatures.saveReadingHistory(articleData);
        }
    } catch (error) {
        console.error('Error tracking user interaction:', error);
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