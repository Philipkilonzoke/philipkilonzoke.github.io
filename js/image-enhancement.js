/**
 * Smart Image Enhancement for Food & Recipes Category
 * Enhances recipe images for better visual appeal
 */

class ImageEnhancement {
    constructor() {
        this.apiKey = 'your-api-key'; // Will use existing API key
        this.enhancedImages = new Map(); // Cache enhanced images
        this.init();
    }

    init() {
        // Only run on food.html page
        if (window.location.pathname.includes('food.html') || 
            window.location.pathname.includes('food') ||
            document.querySelector('.recipe-card')) {
            this.setupImageEnhancement();
        }
    }

    setupImageEnhancement() {
        // Wait for recipe cards to load
        this.waitForRecipes();
    }

    waitForRecipes() {
        const checkRecipes = () => {
            const recipeCards = document.querySelectorAll('.recipe-card');
            if (recipeCards.length > 0) {
                this.enhanceRecipeImages();
            } else {
                // Check again in 500ms if recipes haven't loaded yet
                setTimeout(checkRecipes, 500);
            }
        };
        checkRecipes();
    }

    enhanceRecipeImages() {
        const recipeImages = document.querySelectorAll('.recipe-card .recipe-image');
        
        recipeImages.forEach((img, index) => {
            // Skip if already enhanced
            if (img.classList.contains('enhanced')) return;
            
            const originalSrc = img.src;
            if (!originalSrc || originalSrc.includes('placeholder')) return;

            // Add loading state
            img.classList.add('enhancing');
            this.addEnhancementOverlay(img);

            // Enhance image with slight delay to avoid overwhelming the API
            setTimeout(() => {
                this.enhanceImage(img, originalSrc);
            }, index * 200); // Stagger requests
        });
    }

    addEnhancementOverlay(img) {
        // Create enhancement indicator
        const overlay = document.createElement('div');
        overlay.className = 'enhancement-overlay';
        overlay.innerHTML = `
            <div class="enhancement-spinner"></div>
            <span>Enhancing...</span>
        `;
        
        const container = img.parentElement;
        container.style.position = 'relative';
        container.appendChild(overlay);
    }

    async enhanceImage(img, originalSrc) {
        try {
            // Use a simple image enhancement approach
            // This enhances images without external API calls
            const enhancedSrc = await this.processImageLocally(originalSrc);
            
            if (enhancedSrc) {
                // Preload the enhanced image
                const preloadImg = new Image();
                preloadImg.onload = () => {
                    // Replace with enhanced image
                    img.src = enhancedSrc;
                    img.classList.remove('enhancing');
                    img.classList.add('enhanced');
                    this.removeEnhancementOverlay(img);
                    this.addEnhancementBadge(img);
                };
                preloadImg.onerror = () => {
                    // Fallback to original if enhancement fails
                    img.classList.remove('enhancing');
                    this.removeEnhancementOverlay(img);
                };
                preloadImg.src = enhancedSrc;
            } else {
                // Fallback to original
                img.classList.remove('enhancing');
                this.removeEnhancementOverlay(img);
            }
        } catch (error) {
            console.error('Image enhancement failed:', error);
            img.classList.remove('enhancing');
            this.removeEnhancementOverlay(img);
        }
    }

    async processImageLocally(imageSrc) {
        try {
            // Create a canvas for image processing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Load the image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            return new Promise((resolve) => {
                img.onload = () => {
                    // Set canvas size
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Draw original image
                    ctx.drawImage(img, 0, 0);
                    
                    // Apply enhancement filters
                    this.applyEnhancementFilters(ctx, canvas.width, canvas.height);
                    
                    // Convert to enhanced image
                    const enhancedSrc = canvas.toDataURL('image/jpeg', 0.9);
                    resolve(enhancedSrc);
                };
                
                img.onerror = () => {
                    resolve(null); // Return null if image fails to load
                };
                
                img.src = imageSrc;
            });
        } catch (error) {
            console.error('Local image processing failed:', error);
            return null;
        }
    }

    applyEnhancementFilters(ctx, width, height) {
        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Apply enhancement filters
        for (let i = 0; i < data.length; i += 4) {
            // Enhance brightness slightly
            data[i] = Math.min(255, data[i] * 1.05);     // Red
            data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Green
            data[i + 2] = Math.min(255, data[i + 2] * 1.05); // Blue
            
            // Enhance contrast slightly
            const factor = 1.1;
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128));
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * factor + 128));
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * factor + 128));
            
            // Slightly increase saturation
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = Math.min(255, avg + (data[i] - avg) * 1.1);
            data[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * 1.1);
            data[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * 1.1);
        }
        
        // Put enhanced image data back
        ctx.putImageData(imageData, 0, 0);
    }

    removeEnhancementOverlay(img) {
        const overlay = img.parentElement.querySelector('.enhancement-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    addEnhancementBadge(img) {
        const badge = document.createElement('div');
        badge.className = 'enhancement-badge';
        badge.innerHTML = '<i class="fas fa-magic"></i> Enhanced';
        badge.title = 'AI Enhanced Image';
        
        const container = img.parentElement;
        container.appendChild(badge);
    }

    // Monitor for new recipe cards (for dynamic content)
    observeNewRecipes() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const recipeCards = node.querySelectorAll ? 
                            node.querySelectorAll('.recipe-card') : 
                            (node.classList && node.classList.contains('recipe-card') ? [node] : []);
                        
                        recipeCards.forEach(card => {
                            const img = card.querySelector('.recipe-image');
                            if (img && !img.classList.contains('enhanced')) {
                                setTimeout(() => this.enhanceRecipeImages(), 100);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize Image Enhancement when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.imageEnhancement = new ImageEnhancement();
    } catch (error) {
        console.error('Image Enhancement initialization failed:', error);
        // Graceful degradation - enhancement won't work but site continues to function
    }
});

// Start observing for new recipes after initial load
setTimeout(() => {
    if (window.imageEnhancement) {
        window.imageEnhancement.observeNewRecipes();
    }
}, 2000);