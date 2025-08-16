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
        this.setupSummaries();
        this.setupPlainLanguageToggle();
        this.setupRelatedSourcesClustering();
    }

    // ===== READING TIME ESTIMATION =====
    setupReadingTime() {
        // Calculate reading time for articles
        const articles = document.querySelectorAll('.article-card, .recipe-card, .ticker-item, .news-card');
        articles.forEach(article => {
            if (article.querySelector('.reading-time-badge')) return;
            const textContent = this.extractTextContent(article);
            const readingTime = this.calculateReadingTime(textContent);
            this.addReadingTimeBadge(article, readingTime);
        });
    }

    extractTextContent(element) {
        const title = element.querySelector('.article-title, .recipe-title, .ticker-title, .news-title')?.textContent || '';
        const description = element.querySelector('.article-description, .recipe-summary, .ticker-description, .news-description')?.textContent || '';
        return `${title} ${description}`;
    }

    calculateReadingTime(text) {
        const wordsPerMinute = 200; // Average reading speed
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return Math.max(1, minutes); // Minimum 1 minute
    }

    addReadingTimeBadge(element, minutes) {
        const badge = document.createElement('div');
        badge.className = 'reading-time-badge';
        badge.innerHTML = `<i class="fas fa-clock"></i> ${minutes} min read`;
        const header = element.querySelector('.news-image, .article-image, .recipe-image, .ticker-image')?.parentElement || element;
        header.appendChild(badge);
    }

    // ===== EXTRACTIVE SUMMARIES (CLIENT-SIDE, SAFE) =====
    setupSummaries() {
        try {
            const cards = document.querySelectorAll('.news-card');
            cards.forEach(card => {
                if (card.querySelector('.ai-summary')) return;
                const title = card.querySelector('.news-title')?.textContent || '';
                const desc = card.querySelector('.news-description')?.textContent || '';
                const summary = this.generateExtractiveSummary(`${title}. ${desc}`);
                if (!summary) return;
                const summaryBox = document.createElement('div');
                summaryBox.className = 'ai-summary';
                summaryBox.innerHTML = `
                    <div class="ai-summary-header">
                        <span><i class="fas fa-bolt"></i> Quick Summary</span>
                        <button class="ai-summary-toggle" aria-label="Hide summary">Hide</button>
                    </div>
                    <ul class="ai-summary-list">${summary.map(s => `<li>${s}</li>`).join('')}</ul>
                `;
                const content = card.querySelector('.news-content') || card;
                content.insertBefore(summaryBox, content.firstChild);
                summaryBox.querySelector('.ai-summary-toggle')?.addEventListener('click', () => {
                    const list = summaryBox.querySelector('.ai-summary-list');
                    const isHidden = list.style.display === 'none';
                    list.style.display = isHidden ? 'block' : 'none';
                    summaryBox.querySelector('.ai-summary-toggle').textContent = isHidden ? 'Hide' : 'Show';
                });
            });
        } catch (e) {
            // fail-safe
        }
    }

    generateExtractiveSummary(text) {
        // Simple TextRank-like heuristic: pick top sentences by keyword frequency
        if (!text || text.length < 60) return null;
        const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
        if (sentences.length <= 2) return null;
        const stop = new Set(['the','a','an','to','of','in','on','for','and','or','is','are','was','were','by','with','as','that','this','from','at','it','be']);
        const freq = new Map();
        const tokenize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g,'').split(/\s+/).filter(w => w && !stop.has(w));
        sentences.forEach(s => tokenize(s).forEach(w => freq.set(w, (freq.get(w)||0)+1)));
        const score = s => tokenize(s).reduce((sum,w)=> sum + (freq.get(w)||0), 0);
        const ranked = sentences.map(s => ({ s, score: score(s) })).sort((a,b)=> b.score - a.score);
        const top = ranked.slice(0, Math.min(3, ranked.length)).map(r => r.s.trim());
        return top;
    }

    // ===== PLAIN LANGUAGE TOGGLE =====
    setupPlainLanguageToggle() {
        const cards = document.querySelectorAll('.news-card');
        cards.forEach(card => {
            if (card.querySelector('.plain-lang-toggle')) return;
            const descEl = card.querySelector('.news-description');
            if (!descEl) return;
            const original = descEl.textContent.trim();
            const simplified = this.simplifyText(original);
            if (!simplified || simplified === original) return;
            const toggle = document.createElement('button');
            toggle.className = 'plain-lang-toggle';
            toggle.type = 'button';
            toggle.textContent = 'Plain language';
            toggle.addEventListener('click', () => {
                const usingPlain = descEl.getAttribute('data-plain') === '1';
                if (usingPlain) {
                    descEl.textContent = original;
                    descEl.setAttribute('data-plain','0');
                    toggle.textContent = 'Plain language';
                } else {
                    descEl.textContent = simplified;
                    descEl.setAttribute('data-plain','1');
                    toggle.textContent = 'Original';
                }
            });
            const meta = card.querySelector('.news-meta') || card.querySelector('.news-actions') || card;
            meta?.parentNode?.insertBefore(toggle, meta.nextSibling);
        });
    }

    simplifyText(text) {
        if (!text || text.length < 80) return text;
        // Heuristic simplifier: shorter sentences, remove jargon-like words
        const jargon = [/utilize/gi, /facilitate/gi, /implement/gi, /leverage/gi, /numerous/gi, /subsequent/gi, /approximately/gi];
        let out = text;
        jargon.forEach(re => out = out.replace(re, (m) => ({
            'utilize':'use','facilitate':'help','implement':'apply','leverage':'use','numerous':'many','subsequent':'next','approximately':'about'
        })[m.toLowerCase()] || ''));
        // Shorten very long sentences
        out = out.split(/(?<=[.!?])\s+/).map(s => s.length > 180 ? s.slice(0, 180).trim() + '…' : s).join(' ');
        return out;
    }

    // ===== RELATED SOURCES CLUSTERING (DEDUP UI) =====
    setupRelatedSourcesClustering() {
        try {
            const cards = Array.from(document.querySelectorAll('.news-card'));
            if (cards.length < 2) return;
            const key = el => (el.querySelector('.news-title')?.textContent || '').toLowerCase().replace(/[^a-z0-9\s]/g,'').slice(0, 80);
            const map = new Map();
            cards.forEach(c => {
                const k = key(c);
                if (!k) return;
                if (!map.has(k)) map.set(k, []);
                map.get(k).push(c);
            });
            map.forEach(group => {
                if (group.length <= 1) return;
                // Add a compact "View sources" link to the first card
                const first = group[0];
                if (first.querySelector('.related-sources')) return;
                const container = document.createElement('div');
                container.className = 'related-sources';
                const links = group.slice(1, 6).map(el => {
                    const a = el.querySelector('.news-link')?.getAttribute('href');
                    const name = el.querySelector('.news-category')?.textContent || 'Source';
                    return a ? `<a href="${a}" target="_blank" rel="noopener">Source</a>` : '';
                }).filter(Boolean).join(' · ');
                if (!links) return;
                container.innerHTML = `<i class="fas fa-layer-group"></i> More sources: ${links}`;
                first.querySelector('.news-content')?.appendChild(container);
            });
        } catch (e) {
            // fail-safe
        }
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
        setTimeout(() => toast.classList.add('show'), 100);
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
    }
});

