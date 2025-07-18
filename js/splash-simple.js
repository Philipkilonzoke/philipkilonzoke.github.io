/**
 * SIMPLIFIED GUARANTEED 3D SPLASH SCREEN
 * This version will definitely show up and work immediately
 */

// Hide page content immediately to prevent flash
if (!sessionStorage.getItem('brightlens_splash_shown_simple')) {
    document.write('<style>body{visibility:hidden;opacity:0;transition:opacity 0.3s;}</style>');
}

// Create splash screen immediately when script loads
(function() {
    'use strict';
    
    // Check if splash should show
    const hasShown = sessionStorage.getItem('brightlens_splash_shown_simple');
    if (hasShown) {
        console.log('Splash already shown this session');
        // Show page content if splash already shown
        if (document.body) {
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
        }
        return;
    }
    
    console.log('Creating guaranteed splash screen...');
    
    // Create splash screen with inline styles (no external CSS dependency)
    const splashHTML = `
        <div id="brightlens-guaranteed-splash" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #000428 0%, #004e92 25%, #1a1a2e 50%, #16213e 75%, #0f0f23 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            overflow: hidden;
            font-family: 'Inter', Arial, sans-serif;
        ">
            <!-- Animated starfield background -->
            <div style="
                position: absolute;
                width: 200%;
                height: 200%;
                background: 
                    radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.8), transparent),
                    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.6), transparent),
                    radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.9), transparent),
                    radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.7), transparent);
                background-repeat: repeat;
                background-size: 200px 100px;
                animation: starMove 20s linear infinite;
                opacity: 0.3;
            "></div>
            
            <!-- Main content -->
            <div style="text-align: center; z-index: 2;">
                <!-- 3D Logo -->
                <h1 style="
                    font-size: clamp(3rem, 10vw, 8rem);
                    font-weight: 900;
                    margin: 0;
                    background: linear-gradient(45deg, #ff006e, #00bcd4, #ffffff, #00e676);
                    background-size: 300% 300%;
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8));
                    animation: logoAnim 3s ease-in-out, gradientShift 4s ease-in-out infinite;
                    transform-style: preserve-3d;
                ">BRIGHTLENS NEWS</h1>
                

                
                <!-- Loading indicator -->
                <div style="
                    margin-top: 3rem;
                    animation: loadingFade 1.5s ease-out 2s forwards;
                    opacity: 0;
                ">
                    <div style="
                        width: 300px;
                        height: 6px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 50px;
                        margin: 0 auto 1rem;
                        overflow: hidden;
                    ">
                        <div style="
                            height: 100%;
                            background: linear-gradient(90deg, #ff006e, #00bcd4, #00e676);
                            border-radius: 50px;
                            width: 0%;
                            animation: progressFill 4s ease-out forwards;
                        "></div>
                    </div>
                    <div style="
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 1rem;
                        animation: textPulse 2s ease-in-out infinite;
                    ">Loading amazing content...</div>
                </div>
            </div>
            
            <style>
                @keyframes starMove {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                
                @keyframes logoAnim {
                    0% {
                        opacity: 0;
                        transform: perspective(1000px) rotateY(-180deg) scale(0.3);
                    }
                    50% {
                        opacity: 0.8;
                        transform: perspective(1000px) rotateY(-90deg) scale(0.7);
                    }
                    100% {
                        opacity: 1;
                        transform: perspective(1000px) rotateY(0deg) scale(1);
                    }
                }
                
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                

                
                @keyframes loadingFade {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes progressFill {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                
                @keyframes textPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    #brightlens-guaranteed-splash h1 {
                        font-size: clamp(2rem, 15vw, 4rem) !important;
                    }
                    #brightlens-guaranteed-splash p {
                        font-size: clamp(0.9rem, 4vw, 1.2rem) !important;
                        padding: 0.8rem 1.5rem !important;
                    }
                }
            </style>
        </div>
    `;
    
    // Show splash function
    const showSplash = function() {
        // Ensure body exists
        if (!document.body) {
            setTimeout(showSplash, 10);
            return;
        }
        
        // Insert splash screen
        document.body.insertAdjacentHTML('afterbegin', splashHTML);
        console.log('✨ Guaranteed splash screen created');
        
        // Show body with splash on top
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        
        // Mark as shown
        sessionStorage.setItem('brightlens_splash_shown_simple', Date.now().toString());
        
        // Hide splash after 4 seconds
        setTimeout(function() {
            const splash = document.getElementById('brightlens-guaranteed-splash');
            if (splash) {
                splash.style.transition = 'opacity 1s ease-out';
                splash.style.opacity = '0';
                
                setTimeout(function() {
                    splash.remove();
                    console.log('✅ Splash screen completed');
                }, 1000);
            }
        }, 4000);
    };
    
    // Execute immediately if possible, otherwise wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showSplash);
    } else {
        showSplash();
    }
    
})();

// Global function to clear splash session for testing
window.clearBrightLensSplash = function() {
    sessionStorage.removeItem('brightlens_splash_shown_simple');
    console.log('Splash session cleared - will show on next page load');
};