// Ultra-Smooth Weather Globe - Google Earth Style
// Performance-optimized with level-of-detail loading

const WeatherGlobe = {
    // Core properties
    globe: null,
    isRotating: false,
    showLabels: true,
    currentAltitude: 2.5,
    isLoading: true,
    weatherPanelOpen: false,
    searchPanelOpen: false,
    
    // Performance optimization settings
    performanceSettings: {
        maxLabels: 50,
        labelUpdateThrottle: 200,
        animationFrameThrottle: 16,
        lastUpdate: 0,
        pointResolution: 8,
        enableAtmosphere: true
    },

    // DOM elements cache
    elements: {},

    // Initialize the weather globe
    init() {
        this.cacheElements();
        this.showLoadingScreen();
        this.initializeGlobe();
        this.setupEventListeners();
        this.startLoadingSequence();
    },

    // Cache DOM elements for performance
    cacheElements() {
        this.elements = {
            globe: document.getElementById('globe'),
            loadingScreen: document.getElementById('loading-screen'),
            progressBar: document.getElementById('progress-bar'),
            zoomText: document.getElementById('zoom-text'),
            locationCount: document.getElementById('location-count'),
            navInstructions: document.getElementById('nav-instructions'),
            weatherPanel: document.getElementById('weather-panel'),
            searchPanel: document.getElementById('search-panel'),
            searchInput: document.getElementById('search-input'),
            searchResults: document.getElementById('search-results'),
            // Weather panel elements
            locationName: document.getElementById('location-name'),
            temperature: document.getElementById('temperature'),
            condition: document.getElementById('condition'),
            locationDetails: document.getElementById('location-details'),
            weatherIcon: document.getElementById('weather-icon'),
            feelsLike: document.getElementById('feels-like'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('wind-speed'),
            visibility: document.getElementById('visibility'),
            pressure: document.getElementById('pressure'),
            uvIndex: document.getElementById('uv-index')
        };
    },

    // Show loading screen with animation
    showLoadingScreen() {
        this.elements.loadingScreen.classList.remove('hidden');
        this.animateProgressBar();
    },

    // Animate progress bar
    animateProgressBar() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            this.elements.progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => this.hideLoadingScreen(), 500);
            }
        }, 100);
    },

    // Hide loading screen
    hideLoadingScreen() {
        this.elements.loadingScreen.classList.add('hidden');
        this.isLoading = false;
        this.startInstructionTimer();
    },

    // Start instruction auto-hide timer
    startInstructionTimer() {
        setTimeout(() => {
            this.elements.navInstructions.classList.add('auto-hide');
        }, 8000);
    },

    // Initialize Globe.gl with optimized settings
    initializeGlobe() {
        // Ultra-performance configuration
        this.globe = Globe({
            rendererConfig: {
                antialias: false,
                alpha: true,
                powerPreference: "high-performance",
                preserveDrawingBuffer: false,
                failIfMajorPerformanceCaveat: false
            }
        })(this.elements.globe);

        // Configure globe for maximum performance
        this.globe
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .pointOfView({ lat: 20, lng: 0, altitude: 2.5 })
            .width(window.innerWidth)
            .height(window.innerHeight)
            .enablePointerInteraction(true)
            .showAtmosphere(this.performanceSettings.enableAtmosphere)
            .atmosphereColor('#4285f4')
            .atmosphereAltitude(0.15);

        // Configure points with optimized rendering
        this.globe
            .pointColor(d => WeatherData.getLocationColor(d))
            .pointAltitude(0.01)
            .pointRadius(d => WeatherData.getLocationSize(d))
            .pointResolution(this.performanceSettings.pointResolution)
            .onPointClick(this.handleLocationClick.bind(this));

        // Configure labels with performance limits
        this.globe
            .labelText(d => d.name)
            .labelColor(() => '#ffffff')
            .labelSize(1.2)
            .labelDotRadius(0.4)
            .labelAltitude(0.01)
            .labelResolution(2)
            .onLabelClick(this.handleLocationClick.bind(this));

        // Set up zoom handler with throttling
        this.globe.onZoom(this.throttle(this.handleZoom.bind(this), this.performanceSettings.labelUpdateThrottle));

        // Initialize with world-level data
        this.updateLocationsForZoom(2.5);
    },

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Handle zoom changes with level-of-detail loading
    handleZoom(coords) {
        const now = Date.now();
        if (now - this.performanceSettings.lastUpdate < this.performanceSettings.animationFrameThrottle) {
            return;
        }
        this.performanceSettings.lastUpdate = now;

        this.currentAltitude = coords.altitude;
        
        // Update locations based on zoom level
        this.updateLocationsForZoom(coords.altitude);
        
        // Update UI
        this.updateZoomIndicator();
        this.updateLocationCounter();
        
        // Hide instructions on first interaction
        if (this.elements.navInstructions && !this.elements.navInstructions.classList.contains('hidden')) {
            this.elements.navInstructions.classList.add('auto-hide');
        }
    },

    // Update locations based on zoom level for Google Earth-like experience
    updateLocationsForZoom(altitude) {
        const locations = WeatherData.getLocationsForZoom(altitude);
        
        // Update points data
        this.globe.pointsData(locations);
        
        // Update labels with performance limits
        const maxLabels = Math.min(locations.length, this.performanceSettings.maxLabels);
        const labelData = this.showLabels ? locations.slice(0, maxLabels) : [];
        this.globe.labelsData(labelData);
    },

    // Update zoom level indicator
    updateZoomIndicator() {
        const zoomName = WeatherData.getZoomLevelName(this.currentAltitude);
        this.elements.zoomText.textContent = zoomName;
    },

    // Update location counter
    updateLocationCounter() {
        const count = this.globe.pointsData().length;
        this.elements.locationCount.textContent = count;
    },

    // Handle location click
    async handleLocationClick(location) {
        if (!location || this.isLoading) return;
        
        this.showWeatherPanel();
        this.elements.locationName.textContent = location.name;
        this.resetWeatherData();
        
        try {
            await this.fetchWeatherData(location);
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.displayWeatherError();
        }
    },

    // Reset weather data display
    resetWeatherData() {
        this.elements.temperature.textContent = '--°';
        this.elements.condition.textContent = 'Loading...';
        this.elements.locationDetails.textContent = '--';
        this.elements.feelsLike.textContent = '--°';
        this.elements.humidity.textContent = '--%';
        this.elements.windSpeed.textContent = '-- km/h';
        this.elements.visibility.textContent = '-- km';
        this.elements.pressure.textContent = '-- hPa';
        this.elements.uvIndex.textContent = '--';
        this.elements.weatherIcon.src = '';
    },

    // Fetch weather data with timeout and error handling
    async fetchWeatherData(location) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const query = `${location.name},${location.country}`;
            const response = await fetch(
                `${WeatherData.BASE_URL}?q=${encodeURIComponent(query)}&appid=${WeatherData.API_KEY}&units=metric`,
                { 
                    signal: controller.signal,
                    cache: 'force-cache'
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
            this.displayWeatherData(data);

        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    },

    // Display weather data in panel
    displayWeatherData(data) {
        // Main weather info
        this.elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
        this.elements.condition.textContent = data.weather[0].description;
        this.elements.locationDetails.textContent = `${data.name}, ${data.sys.country}`;

        // Weather icon
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        this.elements.weatherIcon.src = iconUrl;

        // Weather stats
        this.elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        this.elements.humidity.textContent = `${data.main.humidity}%`;
        this.elements.windSpeed.textContent = `${Math.round(data.wind?.speed * 3.6 || 0)} km/h`;
        this.elements.visibility.textContent = `${Math.round((data.visibility || 0) / 1000)} km`;
        this.elements.pressure.textContent = `${data.main.pressure} hPa`;
        this.elements.uvIndex.textContent = data.uvi || 'N/A';
    },

    // Display weather error
    displayWeatherError() {
        this.elements.condition.textContent = 'Weather data unavailable';
        this.elements.locationDetails.textContent = 'Please try another location';
    },

    // Show weather panel
    showWeatherPanel() {
        this.elements.weatherPanel.classList.add('open');
        this.weatherPanelOpen = true;
    },

    // Close weather panel
    closeWeatherPanel() {
        this.elements.weatherPanel.classList.remove('open');
        this.weatherPanelOpen = false;
    },

    // Toggle search panel
    toggleSearch() {
        if (this.searchPanelOpen) {
            this.elements.searchPanel.classList.remove('open');
            this.searchPanelOpen = false;
        } else {
            this.elements.searchPanel.classList.add('open');
            this.searchPanelOpen = true;
            this.elements.searchInput.focus();
        }
    },

    // Clear search
    clearSearch() {
        this.elements.searchInput.value = '';
        this.elements.searchResults.innerHTML = '';
    },

    // Handle search input
    handleSearch() {
        const query = this.elements.searchInput.value.trim();
        if (query.length < 2) {
            this.elements.searchResults.innerHTML = '';
            return;
        }

        const results = WeatherData.searchLocations(query);
        this.displaySearchResults(results);
    },

    // Display search results
    displaySearchResults(results) {
        if (results.length === 0) {
            this.elements.searchResults.innerHTML = '<div class="search-result-item">No locations found</div>';
            return;
        }

        const resultsHTML = results.map(location => `
            <div class="search-result-item" onclick="WeatherGlobe.selectSearchResult(${JSON.stringify(location).replace(/"/g, '&quot;')})">
                <strong>${location.name}</strong><br>
                <small>${location.region} • ${location.country}</small>
            </div>
        `).join('');

        this.elements.searchResults.innerHTML = resultsHTML;
    },

    // Select search result
    selectSearchResult(location) {
        // Navigate to location
        this.globe.pointOfView({
            lat: location.lat,
            lng: location.lng,
            altitude: 1.5
        }, 1500);

        // Close search
        this.toggleSearch();
        this.clearSearch();

        // Open weather for this location
        setTimeout(() => {
            this.handleLocationClick(location);
        }, 1600);
    },

    // Setup all event listeners
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.throttle(() => {
            if (this.globe) {
                this.globe.width(window.innerWidth).height(window.innerHeight);
            }
        }, 250));

        // Search input
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', 
                this.throttle(this.handleSearch.bind(this), 300)
            );
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            switch(e.key) {
                case 'Escape':
                    if (this.weatherPanelOpen) this.closeWeatherPanel();
                    if (this.searchPanelOpen) this.toggleSearch();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleRotation();
                    break;
                case 'r':
                case 'R':
                    this.resetGlobe();
                    break;
                case 'h':
                case 'H':
                    this.toggleLabels();
                    break;
                case 's':
                case 'S':
                    this.toggleSearch();
                    break;
            }
        });

        // Prevent context menu
        document.addEventListener('contextmenu', e => e.preventDefault());

        // Click outside to close panels
        document.addEventListener('click', (e) => {
            if (this.weatherPanelOpen && !this.elements.weatherPanel.contains(e.target) && !e.target.closest('#globe')) {
                this.closeWeatherPanel();
            }
        });
    },

    // Start loading sequence with realistic timing
    startLoadingSequence() {
        const steps = [
            { delay: 200, progress: 15, text: 'Initializing 3D engine...' },
            { delay: 400, progress: 35, text: 'Loading Earth textures...' },
            { delay: 600, progress: 55, text: 'Preparing location data...' },
            { delay: 800, progress: 75, text: 'Optimizing performance...' },
            { delay: 1000, progress: 90, text: 'Final preparations...' },
            { delay: 1200, progress: 100, text: 'Ready!' }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                this.elements.progressBar.style.width = `${step.progress}%`;
                if (index === steps.length - 1) {
                    setTimeout(() => this.hideLoadingScreen(), 300);
                }
            }, step.delay);
        });
    }
};

// Global functions for HTML onclick handlers
function resetGlobe() {
    WeatherGlobe.globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
    WeatherGlobe.currentAltitude = 2.5;
    setTimeout(() => {
        WeatherGlobe.updateLocationsForZoom(2.5);
        WeatherGlobe.updateZoomIndicator();
        WeatherGlobe.updateLocationCounter();
    }, 500);
}

function toggleRotation() {
    WeatherGlobe.isRotating = !WeatherGlobe.isRotating;
    const icon = document.getElementById('rotation-icon');
    const text = document.getElementById('rotation-text');
    const btn = document.getElementById('auto-rotate-btn');
    
    if (WeatherGlobe.isRotating) {
        WeatherGlobe.globe.controls().autoRotate = true;
        WeatherGlobe.globe.controls().autoRotateSpeed = 0.8;
        icon.className = 'fas fa-pause';
        text.textContent = 'Pause';
        btn.classList.add('active');
    } else {
        WeatherGlobe.globe.controls().autoRotate = false;
        icon.className = 'fas fa-play';
        text.textContent = 'Rotate';
        btn.classList.remove('active');
    }
}

function toggleLabels() {
    WeatherGlobe.showLabels = !WeatherGlobe.showLabels;
    const icon = document.getElementById('labels-icon');
    const text = document.getElementById('labels-text');
    const btn = document.getElementById('labels-btn');
    
    if (WeatherGlobe.showLabels) {
        const locations = WeatherData.getLocationsForZoom(WeatherGlobe.currentAltitude);
        const maxLabels = Math.min(locations.length, WeatherGlobe.performanceSettings.maxLabels);
        WeatherGlobe.globe.labelsData(locations.slice(0, maxLabels));
        icon.className = 'fas fa-tags';
        text.textContent = 'Labels';
        btn.classList.add('active');
    } else {
        WeatherGlobe.globe.labelsData([]);
        icon.className = 'fas fa-eye-slash';
        text.textContent = 'Hidden';
        btn.classList.remove('active');
    }
}

function closeWeatherPanel() {
    WeatherGlobe.closeWeatherPanel();
}

function toggleSearch() {
    WeatherGlobe.toggleSearch();
}

function clearSearch() {
    WeatherGlobe.clearSearch();
}

// Performance monitoring (development only)
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('weather-globe-script-loaded');
}