/**
 * Comprehensive Share Utilities for Brightlens News
 * Supports sharing to WhatsApp, Telegram, Twitter, Facebook, Email, and more
 */

class ShareUtils {
    constructor() {
        this.platforms = {
            whatsapp: {
                name: 'WhatsApp',
                icon: 'fab fa-whatsapp',
                color: '#25D366',
                url: 'https://wa.me/?text='
            },
            telegram: {
                name: 'Telegram',
                icon: 'fab fa-telegram-plane',
                color: '#0088cc',
                url: 'https://t.me/share/url?url='
            },
            twitter: {
                name: 'Twitter',
                icon: 'fab fa-twitter',
                color: '#1DA1F2',
                url: 'https://twitter.com/intent/tweet?text='
            },
            facebook: {
                name: 'Facebook',
                icon: 'fab fa-facebook',
                color: '#1877F2',
                url: 'https://www.facebook.com/sharer/sharer.php?u='
            },
            email: {
                name: 'Email',
                icon: 'fas fa-envelope',
                color: '#EA4335',
                url: 'mailto:?subject='
            },
            linkedin: {
                name: 'LinkedIn',
                icon: 'fab fa-linkedin',
                color: '#0A66C2',
                url: 'https://www.linkedin.com/sharing/share-offsite/?url='
            },
            copy: {
                name: 'Copy Link',
                icon: 'fas fa-link',
                color: '#6B7280',
                action: 'copy'
            }
        };
    }

    /**
     * Create share content for different types
     */
    createShareContent(type, data) {
        const baseUrl = window.location.origin;
        
        switch (type) {
            case 'recipe':
                return {
                    title: data.title || 'Amazing Recipe',
                    description: data.summary ? this.stripHtml(data.summary).substring(0, 150) + '...' : 'Check out this delicious recipe!',
                    url: data.sourceUrl || data.spoonacularSourceUrl || `${baseUrl}/food`,
                    hashtags: '#recipes #food #cooking #delicious'
                };
            
            case 'flight':
                const flightInfo = `${data.airline || 'Flight'} ${data.flightNumber || 'N/A'}`;
                const route = `${data.departure || 'N/A'} → ${data.arrival || 'N/A'}`;
                const status = data.status || 'unknown';
                return {
                    title: `${flightInfo} - ${route}`,
                    description: `Flight ${flightInfo} from ${data.departureAirport || 'Unknown'} to ${data.arrivalAirport || 'Unknown'} - Status: ${status}`,
                    url: `${baseUrl}/aviation`,
                    hashtags: '#aviation #flight #travel #airlines'
                };
            
            case 'article':
                return {
                    title: data.title || 'Interesting Article',
                    description: data.description || data.summary || 'Check out this interesting article!',
                    url: data.url || `${baseUrl}`,
                    hashtags: '#news #article #brightlens'
                };
            
            default:
                return {
                    title: 'Brightlens News',
                    description: 'Check out this amazing content on Brightlens News!',
                    url: baseUrl,
                    hashtags: '#brightlens #news'
                };
        }
    }

    /**
     * Strip HTML tags from text
     */
    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    /**
     * Share to specific platform
     */
    async shareToPlatform(platform, content) {
        const platformData = this.platforms[platform];
        
        if (!platformData) {
            console.error('Unknown platform:', platform);
            return false;
        }

        if (platformData.action === 'copy') {
            return await this.copyToClipboard(content.url);
        }

        let shareUrl = platformData.url;
        
        switch (platform) {
            case 'whatsapp':
                shareUrl += encodeURIComponent(`${content.title}\n\n${content.description}\n\n${content.url}\n\n${content.hashtags}`);
                break;
            
            case 'telegram':
                shareUrl += encodeURIComponent(content.url) + '&text=' + encodeURIComponent(`${content.title}\n\n${content.description}\n\n${content.hashtags}`);
                break;
            
            case 'twitter':
                const twitterText = `${content.title}\n\n${content.description}\n\n${content.hashtags}`;
                shareUrl += encodeURIComponent(twitterText.length > 280 ? twitterText.substring(0, 277) + '...' : twitterText);
                break;
            
            case 'facebook':
                shareUrl += encodeURIComponent(content.url);
                break;
            
            case 'email':
                const emailSubject = encodeURIComponent(content.title);
                const emailBody = encodeURIComponent(`${content.description}\n\n${content.url}\n\n${content.hashtags}`);
                shareUrl += emailSubject + '&body=' + emailBody;
                break;
            
            case 'linkedin':
                shareUrl += encodeURIComponent(content.url);
                break;
        }

        // Open in new window
        window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        return true;
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Link copied to clipboard!', 'success');
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showToast('Failed to copy link', 'error');
            return false;
        }
    }

    /**
     * Show share modal
     */
    showShareModal(content, type = 'default') {
        // Remove existing modal
        const existingModal = document.getElementById('share-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'share-modal';
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-overlay"></div>
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3><i class="fas fa-share-alt"></i> Share ${type === 'recipe' ? 'Recipe' : type === 'flight' ? 'Flight' : 'Content'}</h3>
                    <button class="share-modal-close" onclick="this.closest('.share-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="share-modal-body">
                    <div class="share-preview">
                        <h4>${content.title}</h4>
                        <p>${content.description}</p>
                    </div>
                    <div class="share-platforms">
                        ${Object.entries(this.platforms).map(([key, platform]) => `
                            <button class="share-platform-btn" data-platform="${key}" style="--platform-color: ${platform.color}">
                                <i class="${platform.icon}"></i>
                                <span>${platform.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add styles
        this.addShareModalStyles();

        // Add event listeners
        modal.querySelectorAll('.share-platform-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const platform = btn.dataset.platform;
                await this.shareToPlatform(platform, content);
                
                // Add visual feedback
                btn.classList.add('shared');
                setTimeout(() => btn.classList.remove('shared'), 1000);
            });
        });

        // Close on overlay click
        modal.querySelector('.share-modal-overlay').addEventListener('click', () => {
            modal.remove();
        });

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => modal.classList.add('show'), 10);
    }

    /**
     * Add share modal styles
     */
    addShareModalStyles() {
        if (document.getElementById('share-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'share-modal-styles';
        styles.textContent = `
            .share-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .share-modal.show {
                opacity: 1;
            }

            .share-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }

            .share-modal-content {
                position: relative;
                background: var(--surface-color);
                border-radius: 12px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .share-modal.show .share-modal-content {
                transform: scale(1);
            }

            .share-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
                background: var(--background-color);
            }

            .share-modal-header h3 {
                margin: 0;
                font-size: 1.25rem;
                color: var(--text-color);
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .share-modal-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                color: #64748b;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 6px;
                transition: all 0.2s ease;
            }

            .share-modal-close:hover {
                background: var(--border-color);
                color: var(--text-color);
            }

            .share-modal-body {
                padding: 1.5rem;
            }

            .share-preview {
                background: var(--background-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1.5rem;
            }

            .share-preview h4 {
                margin: 0 0 0.5rem 0;
                font-size: 1rem;
                color: var(--text-color);
            }

            .share-preview p {
                margin: 0;
                font-size: 0.875rem;
                color: #64748b;
                line-height: 1.5;
            }

            .share-platforms {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 0.75rem;
            }

            .share-platform-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
                background: var(--background-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-color);
                text-decoration: none;
            }

            .share-platform-btn:hover {
                background: var(--platform-color);
                color: white;
                border-color: var(--platform-color);
                transform: translateY(-2px);
            }

            .share-platform-btn.shared {
                background: #10b981;
                color: white;
                border-color: #10b981;
            }

            .share-platform-btn i {
                font-size: 1.5rem;
            }

            .share-platform-btn span {
                font-size: 0.875rem;
                font-weight: 500;
            }

            @media (max-width: 768px) {
                .share-modal-content {
                    width: 95%;
                    margin: 1rem;
                }

                .share-platforms {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;

        document.head.appendChild(styles);
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles if not already added
        if (!document.getElementById('toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'toast-styles';
            styles.textContent = `
                .toast-notification {
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
                    border-left: 4px solid;
                    animation: slideIn 0.3s ease;
                }

                .toast-notification.success {
                    border-left-color: #10b981;
                }

                .toast-notification.error {
                    border-left-color: #ef4444;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Quick share function for simple sharing
     */
    async quickShare(content, type = 'default') {
        if (navigator.share && type !== 'flight') {
            try {
                await navigator.share({
                    title: content.title,
                    text: content.description,
                    url: content.url
                });
                return true;
            } catch (error) {
                console.log('Native sharing not available, falling back to modal');
            }
        }
        
        this.showShareModal(content, type);
        return true;
    }
}

// Create global instance
window.shareUtils = new ShareUtils();