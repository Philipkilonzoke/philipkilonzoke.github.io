/**
 * AI Translation and Text-to-Speech System for Brightlens News
 * Provides smooth, real-time translation and TTS without page reloads
 */

class AITranslationTTS {
    constructor() {
        this.currentLanguage = this.loadLanguagePreference();
        this.isTranslationEnabled = this.loadTranslationPreference();
        this.isTTSEnabled = this.loadTTSPreference();
        this.translationCache = new Map();
        this.ttsCache = new Map();
        this.speaking = false;
        this.currentUtterance = null;
        
        // Supported languages with better organization
        this.supportedLanguages = {
            'en': { name: 'English', native: 'English', flag: '🇺🇸' },
            'sw': { name: 'Swahili', native: 'Kiswahili', flag: '🇹🇿' },
            'es': { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
            'fr': { name: 'French', native: 'Français', flag: '🇫🇷' },
            'de': { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
            'pt': { name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
            'it': { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
            'ru': { name: 'Russian', native: 'Русский', flag: '🇷🇺' },
            'zh': { name: 'Chinese', native: '中文', flag: '🇨🇳' },
            'ja': { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
            'ko': { name: 'Korean', native: '한국어', flag: '🇰🇷' },
            'ar': { name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
            'hi': { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
            'bn': { name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
            'tr': { name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
            'nl': { name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
            'pl': { name: 'Polish', native: 'Polski', flag: '🇵🇱' },
            'sv': { name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
            'no': { name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
            'da': { name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
            'fi': { name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
            'he': { name: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
            'th': { name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
            'vi': { name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
            'id': { name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
            'ms': { name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
            'tl': { name: 'Filipino', native: 'Filipino', flag: '🇵🇭' },
            'ur': { name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
            'fa': { name: 'Persian', native: 'فارسی', flag: '🇮🇷' },
            'am': { name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
            'yo': { name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
            'ha': { name: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
            'ig': { name: 'Igbo', native: 'Igbo', flag: '🇳🇬' },
            'zu': { name: 'Zulu', native: 'isiZulu', flag: '🇿🇦' },
            'xh': { name: 'Xhosa', native: 'isiXhosa', flag: '🇿🇦' },
            'af': { name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦' }
        };
        
        this.init();
    }

    /**
     * Initialize the system
     */
    init() {
        this.setupLanguageObserver();
        this.setupTTSControls();
        this.updateLanguageDisplay();
        
        // Apply current language if not English
        if (this.currentLanguage !== 'en') {
            this.translatePage(this.currentLanguage);
        }
    }

    /**
     * Load language preference
     */
    loadLanguagePreference() {
        try {
            return localStorage.getItem('ai_translation_language') || 'en';
        } catch (error) {
            console.warn('Could not load language preference:', error);
            return 'en';
        }
    }

    /**
     * Save language preference
     */
    saveLanguagePreference(language) {
        try {
            localStorage.setItem('ai_translation_language', language);
            this.currentLanguage = language;
        } catch (error) {
            console.warn('Could not save language preference:', error);
        }
    }

    /**
     * Load translation preference
     */
    loadTranslationPreference() {
        try {
            const saved = localStorage.getItem('ai_translation_enabled');
            return saved === null ? true : JSON.parse(saved);
        } catch (error) {
            console.warn('Could not load translation preference:', error);
            return true;
        }
    }

    /**
     * Save translation preference
     */
    saveTranslationPreference(enabled) {
        try {
            localStorage.setItem('ai_translation_enabled', JSON.stringify(enabled));
            this.isTranslationEnabled = enabled;
        } catch (error) {
            console.warn('Could not save translation preference:', error);
        }
    }

    /**
     * Load TTS preference
     */
    loadTTSPreference() {
        try {
            const saved = localStorage.getItem('ai_tts_enabled');
            return saved === null ? true : JSON.parse(saved);
        } catch (error) {
            console.warn('Could not load TTS preference:', error);
            return true;
        }
    }

    /**
     * Save TTS preference
     */
    saveTTSPreference(enabled) {
        try {
            localStorage.setItem('ai_tts_enabled', JSON.stringify(enabled));
            this.isTTSEnabled = enabled;
        } catch (error) {
            console.warn('Could not save TTS preference:', error);
        }
    }

    /**
     * Setup language observer for dynamic content
     */
    setupLanguageObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && this.isTranslationEnabled && this.currentLanguage !== 'en') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.translateElement(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Setup TTS controls
     */
    setupTTSControls() {
        // Add TTS buttons to article titles and content
        this.addTTSButtons();
        
        // Observe for new content
        const observer = new MutationObserver(() => {
            this.addTTSButtons();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Add TTS buttons to content
     */
    addTTSButtons() {
        if (!this.isTTSEnabled) return;

        // Add to article titles
        document.querySelectorAll('h1, h2, h3, .article-title, .recipe-title').forEach(element => {
            if (!element.querySelector('.tts-button')) {
                this.addTTSButton(element);
            }
        });

        // Add to article content
        document.querySelectorAll('.article-content, .recipe-summary, .news-card p').forEach(element => {
            if (!element.querySelector('.tts-button')) {
                this.addTTSButton(element);
            }
        });
    }

    /**
     * Add TTS button to element
     */
    addTTSButton(element) {
        const button = document.createElement('button');
        button.className = 'tts-button';
        button.innerHTML = '<i class="fas fa-volume-up"></i>';
        button.title = 'Listen to this text';
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(37, 99, 235, 0.9);
            color: white;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            font-size: 12px;
            z-index: 10;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.speakText(element.textContent.trim());
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        // Make parent relative positioned
        if (element.style.position !== 'absolute' && element.style.position !== 'relative') {
            element.style.position = 'relative';
        }

        element.appendChild(button);
    }

    /**
     * Translate page content
     */
    async translatePage(targetLanguage) {
        if (!this.isTranslationEnabled || targetLanguage === 'en') {
            this.restoreOriginalContent();
            return;
        }

        this.showTranslationIndicator();

        try {
            // Translate main content areas
            const contentSelectors = [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                '.article-title', '.recipe-title', '.news-title',
                'p', '.article-content', '.recipe-summary',
                '.news-card p', '.news-card h3',
                'button', 'a', 'span', 'div'
            ];

            for (const selector of contentSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    if (this.shouldTranslateElement(element)) {
                        await this.translateElement(element, targetLanguage);
                    }
                }
            }

            this.hideTranslationIndicator();
            this.showToast(`Page translated to ${this.supportedLanguages[targetLanguage]?.name || targetLanguage}`, 'success');

        } catch (error) {
            console.error('Translation failed:', error);
            this.hideTranslationIndicator();
            this.showToast('Translation failed. Please try again.', 'error');
        }
    }

    /**
     * Check if element should be translated
     */
    shouldTranslateElement(element) {
        // Skip if already translated
        if (element.dataset.translated) return false;
        
        // Skip if no text content
        if (!element.textContent.trim()) return false;
        
        // Skip if too short
        if (element.textContent.trim().length < 3) return false;
        
        // Skip if contains only numbers or symbols
        if (/^[\d\s\W]+$/.test(element.textContent.trim())) return false;
        
        // Skip if contains URLs or emails
        if (element.textContent.includes('http') || element.textContent.includes('@')) return false;
        
        // Skip if it's a code element
        if (element.tagName === 'CODE' || element.tagName === 'PRE') return false;
        
        return true;
    }

    /**
     * Translate a single element
     */
    async translateElement(element, targetLanguage = this.currentLanguage) {
        if (!this.shouldTranslateElement(element)) return;

        const originalText = element.textContent.trim();
        if (!originalText) return;

        try {
            // Check cache first
            const cacheKey = `${originalText}_${targetLanguage}`;
            if (this.translationCache.has(cacheKey)) {
                element.textContent = this.translationCache.get(cacheKey);
                element.dataset.translated = 'true';
                element.dataset.originalText = originalText;
                return;
            }

            // Translate using AI service
            const translatedText = await this.translateText(originalText, targetLanguage);
            
            if (translatedText && translatedText !== originalText) {
                // Cache the translation
                this.translationCache.set(cacheKey, translatedText);
                
                // Apply translation
                element.textContent = translatedText;
                element.dataset.translated = 'true';
                element.dataset.originalText = originalText;
            }

        } catch (error) {
            console.warn('Failed to translate element:', error);
        }
    }

    /**
     * Translate text using AI service
     */
    async translateText(text, targetLanguage) {
        try {
            // Use a free translation API (LibreTranslate or similar)
            // For now, we'll use a simple approach that can be upgraded later
            
            // Option 1: Use LibreTranslate (free, open-source)
            const response = await fetch('https://libretranslate.de/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: 'auto',
                    target: targetLanguage,
                    format: 'text'
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.translatedText;
            }

            // Fallback: Use Google Translate API (if available)
            // This would require an API key but provides better quality
            
            return text; // Fallback to original text

        } catch (error) {
            console.warn('Translation API failed:', error);
            return text; // Fallback to original text
        }
    }

    /**
     * Restore original content
     */
    restoreOriginalContent() {
        document.querySelectorAll('[data-translated="true"]').forEach(element => {
            if (element.dataset.originalText) {
                element.textContent = element.dataset.originalText;
                delete element.dataset.translated;
                delete element.dataset.originalText;
            }
        });
    }

    /**
     * Speak text using TTS
     */
    async speakText(text) {
        if (!this.isTTSEnabled || !text.trim()) return;

        try {
            // Stop any current speech
            this.stopSpeaking();

            // Check cache first
            const cacheKey = `${text}_${this.currentLanguage}`;
            if (this.ttsCache.has(cacheKey)) {
                this.playAudio(this.ttsCache.get(cacheKey));
                return;
            }

            // Use Web Speech API
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = this.currentLanguage;
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 1;

                utterance.onstart = () => {
                    this.speaking = true;
                    this.updateTTSButtons();
                };

                utterance.onend = () => {
                    this.speaking = false;
                    this.updateTTSButtons();
                };

                utterance.onerror = (error) => {
                    console.warn('TTS error:', error);
                    this.speaking = false;
                    this.updateTTSButtons();
                };

                this.currentUtterance = utterance;
                speechSynthesis.speak(utterance);

            } else {
                // Fallback: Use external TTS service
                const audioUrl = await this.getTTSAudio(text);
                if (audioUrl) {
                    this.ttsCache.set(cacheKey, audioUrl);
                    this.playAudio(audioUrl);
                }
            }

        } catch (error) {
            console.error('TTS failed:', error);
            this.showToast('Text-to-speech failed. Please try again.', 'error');
        }
    }

    /**
     * Get TTS audio from external service
     */
    async getTTSAudio(text) {
        try {
            // Use a free TTS service like ResponsiveVoice or similar
            // For now, return null to use Web Speech API fallback
            return null;
        } catch (error) {
            console.warn('External TTS failed:', error);
            return null;
        }
    }

    /**
     * Play audio from URL
     */
    playAudio(audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
            console.warn('Audio playback failed:', error);
        });
    }

    /**
     * Stop current speech
     */
    stopSpeaking() {
        if (this.speaking) {
            if (this.currentUtterance) {
                speechSynthesis.cancel();
                this.currentUtterance = null;
            }
            this.speaking = false;
            this.updateTTSButtons();
        }
    }

    /**
     * Update TTS button states
     */
    updateTTSButtons() {
        document.querySelectorAll('.tts-button').forEach(button => {
            if (this.speaking) {
                button.innerHTML = '<i class="fas fa-stop"></i>';
                button.style.background = 'rgba(239, 68, 68, 0.9)';
                button.title = 'Stop speaking';
            } else {
                button.innerHTML = '<i class="fas fa-volume-up"></i>';
                button.style.background = 'rgba(37, 99, 235, 0.9)';
                button.title = 'Listen to this text';
            }
        });
    }

    /**
     * Show translation indicator
     */
    showTranslationIndicator() {
        let indicator = document.getElementById('translation-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'translation-indicator';
            indicator.innerHTML = `
                <i class="fas fa-language"></i>
                <span>Translating...</span>
            `;
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(37, 99, 235, 0.9);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'flex';
    }

    /**
     * Hide translation indicator
     */
    hideTranslationIndicator() {
        const indicator = document.getElementById('translation-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    /**
     * Update language display
     */
    updateLanguageDisplay() {
        const languageSelect = document.getElementById('ai-language-select');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.ai-toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `ai-toast-notification ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--surface-color);
            color: var(--text-color);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            border-left: 4px solid ${type === 'success' ? '#10b981' : '#ef4444'};
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Set language
     */
    setLanguage(language) {
        this.saveLanguagePreference(language);
        this.translatePage(language);
        this.updateLanguageDisplay();
    }

    /**
     * Toggle translation
     */
    toggleTranslation(enabled) {
        this.saveTranslationPreference(enabled);
        if (!enabled) {
            this.restoreOriginalContent();
        } else if (this.currentLanguage !== 'en') {
            this.translatePage(this.currentLanguage);
        }
    }

    /**
     * Toggle TTS
     */
    toggleTTS(enabled) {
        this.saveTTSPreference(enabled);
        if (!enabled) {
            this.stopSpeaking();
        }
        this.addTTSButtons();
    }
}

// Create global instance
window.aiTranslationTTS = new AITranslationTTS();