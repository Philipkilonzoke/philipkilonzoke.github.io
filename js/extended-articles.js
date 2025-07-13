/**
 * Extended Articles Database for Brightlens News
 * Modified to return empty arrays - only real-time news should be displayed
 */

class ExtendedArticlesDB {
    constructor() {
        this.baseDate = new Date();
    }

    generateTimeOffsets() {
        const offsets = [];
        for (let i = 0; i < 50; i++) {
            offsets.push(i * 2 + Math.random() * 3); // Hours ago
        }
        return offsets.sort((a, b) => a - b);
    }

    getTimeFromOffset(hoursAgo) {
        const date = new Date(this.baseDate.getTime() - (hoursAgo * 60 * 60 * 1000));
        return date.toISOString();
    }

    getExtendedLatestNews(source = 'News Source') {
        // Return empty array - only real-time news should be displayed
        // This prevents showing sample articles when APIs fail
        return [];
    }

    getExtendedKenyaNews(source = 'Kenya News Source') {
        // Return empty array - only real-time news should be displayed
        // This prevents showing sample articles when APIs fail
        return [];
    }

    getExtendedWorldNews(source = 'World News Source') {
        // Return empty array - only real-time news should be displayed
        return [];
    }

    getExtendedTechnologyNews(source = 'Tech News Source') {
        // Return empty array - only real-time news should be displayed
        return [];
    }

    getExtendedEntertainmentNews(source = 'Entertainment News Source') {
        // Return empty array - only real-time news should be displayed
        return [];
    }

    getExtendedBusinessNews(source = 'Business News Source') {
        // Return empty array - only real-time news should be displayed
        return [];
    }

    getExtendedSportsNews(source = 'Sports News Source') {
        // Return empty array - only real-time news should be displayed
        return [];
    }

    getExtendedHealthNews(source = 'Health News Source') {
        // Return empty array - only real-time news should be displayed
        return [];
    }

    getExtendedLifestyleNews(source = 'Lifestyle News Source') {
        // Return empty array - only real-time news should be displayed
        return [];
    }
}

// Export for use in other scripts
window.ExtendedArticlesDB = ExtendedArticlesDB;