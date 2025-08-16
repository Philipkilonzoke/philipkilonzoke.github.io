/**
 * AI-Powered Features for Brightlens News
 * Simple, safe features that enhance user experience
 */

class AIFeatures {
    constructor() {
        this.currentUtterance = null;
        this.synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
        this.init();
    }

    init() {
        this.setupReadingTime();
        this.setupSummaries();
        this.setupPlainLanguageToggle();
        this.setupRelatedSourcesClustering();
        this.setupConsensusAndCompare();
        this.setupKeyFacts();
        this.setupTTSOnCards();

        // Re-apply when category articles finish rendering
        document.addEventListener('categoryNewsLoaded', () => {
            setTimeout(() => this.applyAllFeatures(), 50);
        });

        // Safety: re-apply once after initial paint
        setTimeout(() => this.applyAllFeatures(), 800);
    }

    applyAllFeatures() {
        this.setupReadingTime();
        this.setupSummaries();
        this.setupPlainLanguageToggle();
        this.setupRelatedSourcesClustering();
        this.setupConsensusAndCompare();
        this.setupKeyFacts();
        this.setupTTSOnCards();
    }

    // ===== READING TIME ESTIMATION =====
    setupReadingTime() {
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
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return Math.max(1, minutes);
    }

    addReadingTimeBadge(element, minutes) {
        const badge = document.createElement('div');
        badge.className = 'reading-time-badge';
        badge.style.cssText = 'position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.6);color:#fff;padding:4px 8px;border-radius:12px;font-size:12px;display:flex;gap:6px;align-items:center;';
        badge.innerHTML = `<i class="fas fa-clock"></i> ${minutes} min read`;
        const header = element.querySelector('.news-image, .article-image, .recipe-image, .ticker-image')?.parentElement || element;
        header.style.position = header.style.position || 'relative';
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
                summaryBox.style.cssText = 'background:var(--surface-color,#f8fafc);border:1px solid var(--border-color,#e2e8f0);border-radius:8px;padding:8px 10px;margin-bottom:8px;';
                summaryBox.innerHTML = `
                    <div class="ai-summary-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-weight:600;">
                        <span><i class="fas fa-bolt"></i> Quick Summary</span>
                        <button class="ai-summary-toggle" aria-label="Hide summary" style="background:transparent;border:none;color:var(--primary-color,#2563eb);cursor:pointer;">Hide</button>
                    </div>
                    <ul class="ai-summary-list" style="padding-left:18px;margin:0;">${summary.map(s => `<li style="margin:2px 0;">${s}</li>`).join('')}</ul>
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
        } catch {}
    }

    generateExtractiveSummary(text) {
        if (!text || text.length < 60) return null;
        const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
        if (sentences.length <= 2) return null;
        const stop = new Set(['the','a','an','to','of','in','on','for','and','or','is','are','was','were','by','with','as','that','this','from','at','it','be']);
        const freq = new Map();
        const tokenize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g,'').split(/\s+/).filter(w => w && !stop.has(w));
        sentences.forEach(s => tokenize(s).forEach(w => freq.set(w, (freq.get(w)||0)+1)));
        const score = s => tokenize(s).reduce((sum,w)=> sum + (freq.get(w)||0), 0);
        const ranked = sentences.map(s => ({ s, score: score(s) })).sort((a,b)=> b.score - a.score);
        return ranked.slice(0, Math.min(3, ranked.length)).map(r => r.s.trim());
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
            toggle.style.cssText = 'margin:8px 0;padding:6px 10px;border:1px solid var(--border-color,#e2e8f0);background:#fff;border-radius:6px;cursor:pointer;color:var(--primary-color,#2563eb);';
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
        const jargon = [/utilize/gi, /facilitate/gi, /implement/gi, /leverage/gi, /numerous/gi, /subsequent/gi, /approximately/gi];
        let out = text;
        jargon.forEach(re => out = out.replace(re, (m) => ({
            'utilize':'use','facilitate':'help','implement':'apply','leverage':'use','numerous':'many','subsequent':'next','approximately':'about'
        })[m.toLowerCase()] || ''));
        out = out.split(/(?<=[.!?])\s+/).map(s => s.length > 180 ? s.slice(0, 180).trim() + '…' : s).join(' ');
        return out;
    }

    // ===== RELATED SOURCES CLUSTERING (links on first card) =====
    setupRelatedSourcesClustering() {
        try {
            const cards = Array.from(document.querySelectorAll('.news-card'));
            if (cards.length < 2) return;
            const key = el => (el.querySelector('.news-title')?.textContent || '').toLowerCase().replace(/[^a-z0-9\s]/g,'').slice(0, 80);
            const map = new Map();
            cards.forEach(c => { const k = key(c); if (!k) return; if (!map.has(k)) map.set(k, []); map.get(k).push(c); });
            map.forEach(group => {
                if (group.length <= 1) return;
                const first = group[0];
                if (first.querySelector('.related-sources')) return;
                const container = document.createElement('div');
                container.className = 'related-sources';
                container.style.cssText = 'margin-top:6px;font-size:0.9rem;color:var(--primary-color,#2563eb);';
                const links = group.slice(1, 6).map(el => {
                    const a = el.querySelector('.news-link')?.getAttribute('href');
                    const domain = this.extractDomain(a || '');
                    return a ? `<a href="${a}" target="_blank" rel="noopener">${domain}</a>` : '';
                }).filter(Boolean).join(' · ');
                if (!links) return;
                container.innerHTML = `<i class="fas fa-layer-group"></i> More sources: ${links}`;
                first.querySelector('.news-content')?.appendChild(container);
            });
        } catch {}
    }

    // ===== CONSENSUS BADGE + COMPARE MODAL =====
    setupConsensusAndCompare() {
        const cards = Array.from(document.querySelectorAll('.news-card'));
        if (cards.length < 2) return;
        const key = el => (el.querySelector('.news-title')?.textContent || '').toLowerCase().replace(/[^a-z0-9\s]/g,'').slice(0, 80);
        const map = new Map();
        cards.forEach(c => { const k = key(c); if (!k) return; if (!map.has(k)) map.set(k, []); map.get(k).push(c); });
        map.forEach(group => {
            if (group.length < 3) return; // show badge when >=3
            const first = group[0];
            if (!first || first.querySelector('.consensus-badge')) return;
            const badge = document.createElement('div');
            badge.className = 'consensus-badge';
            badge.style.cssText = 'position:absolute;top:8px;right:8px;background:#10b981;color:#ffffff;padding:4px 8px;border-radius:12px;font-size:12px;display:flex;gap:6px;align-items:center;';
            badge.innerHTML = `<i class="fas fa-check-double"></i> Confirmed by ${group.length} sources`;
            const header = first.querySelector('.news-image')?.parentElement || first;
            header.style.position = header.style.position || 'relative';
            header.appendChild(badge);

            // Compare button
            if (!first.querySelector('.compare-btn')) {
                const btn = document.createElement('button');
                btn.className = 'compare-btn';
                btn.type = 'button';
                btn.style.cssText = 'margin:8px 0;padding:6px 10px;border:1px solid var(--border-color,#e2e8f0);background:#fff;border-radius:6px;cursor:pointer;color:#111827;display:inline-flex;align-items:center;gap:6px;';
                btn.innerHTML = '<i class="fas fa-columns"></i> Compare sources';
                btn.addEventListener('click', () => this.openCompareModal(group));
                const content = first.querySelector('.news-content') || first;
                content.appendChild(btn);
            }
        });
    }

    ensureCompareModal() {
        let modal = document.getElementById('compare-modal');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'compare-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:none;align-items:center;justify-content:center;z-index:10000;';
        modal.innerHTML = `
            <div style="background:#fff;max-width:900px;width:92%;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.2);overflow:hidden;">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #e5e7eb;">
                    <strong><i class="fas fa-columns"></i> Source comparison</strong>
                    <button id="compare-close" style="background:transparent;border:none;font-size:18px;cursor:pointer;">✕</button>
                </div>
                <div id="compare-body" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;padding:12px 16px;max-height:70vh;overflow:auto;"></div>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelector('#compare-close')?.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
        return modal;
    }

    openCompareModal(group) {
        const modal = this.ensureCompareModal();
        const body = modal.querySelector('#compare-body');
        body.innerHTML = '';
        group.slice(0, 6).forEach(card => {
            const url = card.querySelector('.news-link')?.getAttribute('href') || '#';
            const title = card.querySelector('.news-title')?.textContent || '';
            const desc = card.querySelector('.news-description')?.textContent || '';
            const domain = this.extractDomain(url);
            const cell = document.createElement('div');
            cell.style.cssText = 'border:1px solid #e5e7eb;border-radius:8px;padding:10px;';
            cell.innerHTML = `
                <div style="font-size:12px;color:#2563eb;margin-bottom:6px;">${domain}</div>
                <div style="font-weight:600;margin-bottom:6px;">${title}</div>
                <div style="font-size:14px;color:#374151;">${desc}</div>
                <div style="margin-top:8px;"><a href="${url}" target="_blank" rel="noopener" style="color:#2563eb;">Open</a></div>
            `;
            body.appendChild(cell);
        });
        modal.style.display = 'flex';
    }

    extractDomain(url) { try { return new URL(url).hostname.replace(/^www\./,''); } catch { return 'source'; } }

    // ===== KEY FACTS BOX =====
    setupKeyFacts() {
        const cards = document.querySelectorAll('.news-card');
        cards.forEach(card => {
            if (card.querySelector('.key-facts')) return;
            const title = card.querySelector('.news-title')?.textContent || '';
            const desc = card.querySelector('.news-description')?.textContent || '';
            const facts = this.extractKeyFacts(`${title}. ${desc}`);
            if (!facts || facts.length === 0) return;
            const box = document.createElement('div');
            box.className = 'key-facts';
            box.style.cssText = 'margin-top:8px;background:#ffffff;border:1px dashed var(--border-color,#e2e8f0);border-radius:8px;padding:8px 10px;';
            box.innerHTML = `<div style="font-weight:600;margin-bottom:6px;"><i class=\"fas fa-info-circle\"></i> Key facts</div><ul style="margin:0;padding-left:18px;">${facts.map(f => `<li>${f}</li>`).join('')}</ul>`;
            card.querySelector('.news-content')?.appendChild(box);
        });
    }

    extractKeyFacts(text) {
        const res = new Set();
        if (!text) return [];
        // Percentages
        (text.match(/\b\d{1,3}(?:\.\d+)?%/g) || []).slice(0,2).forEach(v => res.add(`${v}`));
        // Currency (KES, KSh, $, USD)
        (text.match(/\b(?:KSh|KES|Sh|USD|\$)\s?\d[\d,]*(?:\.\d+)?\b/g) || []).slice(0,2).forEach(v => res.add(v.replace(/\s+/g,' ')));
        // Dates (simple)
        const months = '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)';
        (text.match(new RegExp(`\\b${months}\\s+\d{1,2}(?:,\\s*\d{4})?`, 'g')) || []).slice(0,2).forEach(v => res.add(v));
        // Numbers with units
        (text.match(/\b\d[\d,]*(?:\.\d+)?\s?(?:km|m|kg|years?|people|cases|votes|goals|points)\b/gi) || []).slice(0,2).forEach(v => res.add(v));
        // Limit to 3 items
        return Array.from(res).slice(0,3);
    }

    // ===== TTS LISTEN BUTTON =====
    setupTTSOnCards() {
        if (!this.synth) return;
        const cards = document.querySelectorAll('.news-card');
        cards.forEach(card => {
            if (card.querySelector('.tts-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'tts-btn';
            btn.type = 'button';
            btn.style.cssText = 'margin:8px 6px 0 0;padding:6px 10px;border:1px solid var(--border-color,#e2e8f0);background:#fff;border-radius:6px;cursor:pointer;color:#111827;display:inline-flex;align-items:center;gap:6px;';
            btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
            btn.addEventListener('click', () => this.toggleSpeak(card, btn));
            const content = card.querySelector('.news-content') || card;
            content.appendChild(btn);
        });
    }

    toggleSpeak(card, btn) {
        try {
            const title = card.querySelector('.news-title')?.textContent || '';
            const desc = card.querySelector('.news-description')?.textContent || '';
            const text = `${title}. ${desc}`.trim();
            if (!text) return;
            if (this.synth.speaking) {
                this.synth.cancel();
                btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
                return;
            }
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'en-US';
            utter.rate = 1.0;
            utter.onend = () => { btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen'; };
            this.currentUtterance = utter;
            btn.innerHTML = '<i class="fas fa-stop"></i> Stop';
            this.synth.speak(utter);
        } catch {}
    }

    // ===== UTILITY TOAST =====
    showFeedback(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#111827;color:#fff;padding:10px 14px;border-radius:8px;z-index:10001;opacity:0;transition:opacity .2s;';
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span style="margin-left:8px;">${message}</span>
        `;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.style.opacity = '1');
        setTimeout(() => {
            toast.style.opacity = '0';
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

