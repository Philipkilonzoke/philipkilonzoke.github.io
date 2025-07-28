/**
 * Professional Weather Dashboard for Brightlens News
 * All features as specified in requirements
 * Using Open-Meteo API (no key required) and full functionality
 */

class WeatherDashboard {
    constructor() {
        // API Configuration (Open-Meteo - no key required)
        this.weatherAPI = 'https://api.open-meteo.com/v1/forecast';
        this.geocodingAPI = 'https://geocoding-api.open-meteo.com/v1/search';
        this.airQualityAPI = 'https://air-quality-api.open-meteo.com/v1/air-quality';
        
        // App State
        this.currentUnit = 'celsius'; // celsius or fahrenheit
        this.currentLocation = null;
        this.weatherData = null;
        this.isLoading = false;
        this.refreshInterval = null;
        this.searchTimeout = null;
        this.chart = null;
        
        // Weather code mappings for icons and descriptions
        this.weatherCodes = {
            0: { icon: 'fas fa-sun', description: 'Clear sky', bg: 'sunny' },
            1: { icon: 'fas fa-sun', description: 'Mainly clear', bg: 'sunny' },
            2: { icon: 'fas fa-cloud-sun', description: 'Partly cloudy', bg: 'cloudy' },
            3: { icon: 'fas fa-cloud', description: 'Overcast', bg: 'cloudy' },
            45: { icon: 'fas fa-smog', description: 'Fog', bg: 'cloudy' },
            48: { icon: 'fas fa-smog', description: 'Depositing rime fog', bg: 'cloudy' },
            51: { icon: 'fas fa-cloud-rain', description: 'Light drizzle', bg: 'rainy' },
            53: { icon: 'fas fa-cloud-rain', description: 'Moderate drizzle', bg: 'rainy' },
            55: { icon: 'fas fa-cloud-rain', description: 'Dense drizzle', bg: 'rainy' },
            56: { icon: 'fas fa-cloud-rain', description: 'Light freezing drizzle', bg: 'rainy' },
            57: { icon: 'fas fa-cloud-rain', description: 'Dense freezing drizzle', bg: 'rainy' },
            61: { icon: 'fas fa-cloud-rain', description: 'Slight rain', bg: 'rainy' },
            63: { icon: 'fas fa-cloud-rain', description: 'Moderate rain', bg: 'rainy' },
            65: { icon: 'fas fa-cloud-rain', description: 'Heavy rain', bg: 'rainy' },
            66: { icon: 'fas fa-cloud-rain', description: 'Light freezing rain', bg: 'rainy' },
            67: { icon: 'fas fa-cloud-rain', description: 'Heavy freezing rain', bg: 'rainy' },
            71: { icon: 'fas fa-snowflake', description: 'Slight snow fall', bg: 'snowy' },
            73: { icon: 'fas fa-snowflake', description: 'Moderate snow fall', bg: 'snowy' },
            75: { icon: 'fas fa-snowflake', description: 'Heavy snow fall', bg: 'snowy' },
            77: { icon: 'fas fa-snowflake', description: 'Snow grains', bg: 'snowy' },
            80: { icon: 'fas fa-cloud-showers-heavy', description: 'Slight rain showers', bg: 'rainy' },
            81: { icon: 'fas fa-cloud-showers-heavy', description: 'Moderate rain showers', bg: 'rainy' },
            82: { icon: 'fas fa-cloud-showers-heavy', description: 'Violent rain showers', bg: 'rainy' },
            85: { icon: 'fas fa-snowflake', description: 'Slight snow showers', bg: 'snowy' },
            86: { icon: 'fas fa-snowflake', description: 'Heavy snow showers', bg: 'snowy' },
            95: { icon: 'fas fa-bolt', description: 'Thunderstorm', bg: 'stormy' },
            96: { icon: 'fas fa-bolt', description: 'Thunderstorm with slight hail', bg: 'stormy' },
            99: { icon: 'fas fa-bolt', description: 'Thunderstorm with heavy hail', bg: 'stormy' }
        };

        // UV Index levels
        this.uvLevels = {
            0: 'Low',
            3: 'Moderate', 
            6: 'High',
            8: 'Very High',
            11: 'Extreme'
        };
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the weather application
     */
    async init() {
        this.hideLoading();
        this.loadUserPreferences();
        this.setupEventListeners();
        this.setupAutoRefresh();
        
        // Show welcome state initially instead of trying to load location
        this.showWelcome();
        
        this.updateLastUpdated();
    }

    /**
     * Show welcome state
     */
    showWelcome() {
        this.hideError();
        this.hideLoading();
        this.hideWeather();
        document.getElementById('weather-welcome').style.display = 'block';
    }

    /**
     * Hide welcome state
     */
    hideWelcome() {
        document.getElementById('weather-welcome').style.display = 'none';
    }

    /**
     * Load user preferences from localStorage
     */
    loadUserPreferences() {
        const savedUnit = localStorage.getItem('brightlens-weather-unit');
        const savedLocation = localStorage.getItem('brightlens-weather-location');
        
        if (savedUnit) {
            this.currentUnit = savedUnit;
            const unitDisplay = document.getElementById('unit-display');
            if (unitDisplay) {
                unitDisplay.textContent = savedUnit === 'celsius' ? '°C' : '°F';
            }
        }
        
        if (savedLocation) {
            try {
                this.currentLocation = JSON.parse(savedLocation);
            } catch (e) {
                console.warn('Failed to parse saved location:', e);
            }
        }
    }

    /**
     * Save user preferences to localStorage
     */
    saveUserPreferences() {
        localStorage.setItem('brightlens-weather-unit', this.currentUnit);
        if (this.currentLocation) {
            localStorage.setItem('brightlens-weather-location', JSON.stringify(this.currentLocation));
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('city-input');
        const searchBtn = document.getElementById('search-btn');
        const locationBtn = document.getElementById('location-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.searchLocation(e.target.value);
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput?.value;
                if (query) this.searchLocation(query);
            });
        }
        
        if (locationBtn) {
            locationBtn.addEventListener('click', () => {
                this.getCurrentLocation();
            });
        }

        // Quick city buttons with optimized coordinates
        const cityButtons = document.querySelectorAll('.city-btn');
        cityButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const city = btn.getAttribute('data-city');
                const country = btn.getAttribute('data-country');
                const lat = parseFloat(btn.getAttribute('data-lat'));
                const lon = parseFloat(btn.getAttribute('data-lon'));
                
                console.log(`City button clicked: ${city}, lat: ${lat}, lon: ${lon}`);
                
                if (!isNaN(lat) && !isNaN(lon) && city) {
                    // Use coordinates directly for faster loading
                    this.searchLocationByCoords(lat, lon, {
                        name: city,
                        country: country,
                        admin1: ''
                    });
                } else {
                    console.error(`Invalid coordinates for ${city}: lat=${lat}, lon=${lon}`);
                }
            });
        });

        // Unit toggle
        const unitToggle = document.getElementById('unit-toggle');
        if (unitToggle) {
            unitToggle.addEventListener('click', () => {
                this.toggleUnit();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if (this.currentLocation) {
                    this.fetchWeatherData(this.currentLocation.latitude, this.currentLocation.longitude);
                }
            });
        }

        // Retry button
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                if (this.currentLocation) {
                    this.fetchWeatherData(this.currentLocation.latitude, this.currentLocation.longitude);
                } else {
                    this.showWelcome();
                }
            });
        }

        // Suggestion clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                const lat = parseFloat(e.target.getAttribute('data-lat'));
                const lon = parseFloat(e.target.getAttribute('data-lon'));
                const name = e.target.getAttribute('data-name');
                const country = e.target.getAttribute('data-country');
                const admin1 = e.target.getAttribute('data-admin1');
                
                this.searchLocationByCoords(lat, lon, {
                    name,
                    country,
                    admin1
                });
                
                this.hideSuggestions();
                if (searchInput) searchInput.value = `${name}, ${country}`;
            }
        });
    }

    /**
     * Setup auto-refresh every 15 minutes
     */
    setupAutoRefresh() {
        // Clear existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Set new interval for 15 minutes
        this.refreshInterval = setInterval(() => {
            if (this.currentLocation) {
                this.fetchWeatherData(this.currentLocation.latitude, this.currentLocation.longitude);
            }
        }, 15 * 60 * 1000); // 15 minutes
    }

    /**
     * Load default location (saved location or show welcome)
     */
    async loadDefaultLocation() {
        if (this.currentLocation) {
            await this.fetchWeatherData(this.currentLocation.latitude, this.currentLocation.longitude);
        } else {
            // Show welcome instead of trying geolocation immediately
            this.showWelcome();
        }
    }

    /**
     * Handle search input with autocomplete
     */
    async handleSearchInput(query) {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        // Debounce search requests
        this.searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`${this.geocodingAPI}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
                const data = await response.json();
                
                if (data.results && data.results.length > 0) {
                    this.showSuggestions(data.results);
                } else {
                    this.hideSuggestions();
                }
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
                this.hideSuggestions();
            }
        }, 300);
    }

    /**
     * Show search suggestions
     */
    showSuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;

        suggestionsContainer.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.setAttribute('data-lat', suggestion.latitude);
            item.setAttribute('data-lon', suggestion.longitude);
            item.setAttribute('data-name', suggestion.name);
            item.setAttribute('data-country', suggestion.country);
            item.setAttribute('data-admin1', suggestion.admin1);
            item.innerHTML = `
                <i class="fas fa-map-marker-alt suggestion-icon"></i>
                <div class="suggestion-text">
                    <div>${suggestion.name}</div>
                    <div class="suggestion-country">${suggestion.country}${suggestion.admin1 ? ', ' + suggestion.admin1 : ''}</div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                document.getElementById('city-input').value = suggestion.name;
                this.hideSuggestions();
                this.searchLocationByCoords(suggestion.latitude, suggestion.longitude, suggestion);
            });
            
            suggestionsContainer.appendChild(item);
        });
        
        suggestionsContainer.classList.add('show');
    }

    /**
     * Hide search suggestions
     */
    hideSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.remove('show');
        }
    }

    /**
     * Search for a location
     */
    async searchLocation(query) {
        if (!query.trim()) return;
        
        this.showLoading();
        
        try {
            // Create timeout for geocoding request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const geocodingUrl = `${this.geocodingAPI}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
            console.log('Searching for location:', query, 'URL:', geocodingUrl);

            const response = await fetch(geocodingUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'BrightlensNewsWeatherApp/1.0'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Geocoding API returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Geocoding response:', data);
            
            if (data.results && data.results.length > 0) {
                const location = data.results[0];
                console.log('Found location:', location);
                await this.searchLocationByCoords(location.latitude, location.longitude, location);
            } else {
                this.hideLoading();
                this.showError('Location not found. Please try a different search term.');
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.hideLoading();
            
            let errorMessage = 'Failed to search for location. ';
            if (error.name === 'AbortError') {
                errorMessage += 'The search timed out. Please try again.';
            } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                errorMessage += 'Please check your internet connection and try again.';
            } else {
                errorMessage += 'Please try again.';
            }
            this.showError(errorMessage);
        }
    }

    /**
     * Search location by coordinates
     */
    async searchLocationByCoords(lat, lon, locationData = null) {
        this.currentLocation = {
            latitude: lat,
            longitude: lon,
            name: locationData?.name || 'Unknown Location',
            country: locationData?.country || '',
            admin1: locationData?.admin1 || ''
        };
        
        // Hide welcome state when starting to fetch data
        this.hideWelcome();
        
        this.saveUserPreferences();
        await this.fetchWeatherData(lat, lon);
    }

    /**
     * Get current location using geolocation API
     */
    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        this.showLoading();
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                // Reverse geocoding to get location name
                try {
                    const response = await fetch(`${this.geocodingAPI}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`);
                    const data = await response.json();
                    
                    let locationName = 'Current Location';
                    let country = '';
                    let admin1 = '';
                    
                    if (data.results && data.results.length > 0) {
                        locationName = data.results[0].name;
                        country = data.results[0].country;
                        admin1 = data.results[0].admin1;
                    }
                    
                    this.currentLocation = {
                        latitude,
                        longitude,
                        name: locationName,
                        country,
                        admin1
                    };
                    
                    this.saveUserPreferences();
                    await this.fetchWeatherData(latitude, longitude);
                } catch (error) {
                    console.error('Reverse geocoding failed:', error);
                    // Still proceed with coordinates
                    this.currentLocation = {
                        latitude,
                        longitude,
                        name: 'Current Location',
                        country: '',
                        admin1: ''
                    };
                    await this.fetchWeatherData(latitude, longitude);
                }
            },
            (error) => {
                let errorMessage = 'Failed to get your location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access was denied. Please enable location access and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                this.showError(errorMessage);
            },
            options
        );
    }

    /**
     * Fetch weather data from Open-Meteo API (optimized for speed)
     */
    async fetchWeatherData(latitude, longitude) {
        this.showLoading();
        
        // Validate coordinates
        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
            this.showError('Invalid coordinates provided.');
            return;
        }
        
        try {
            // Optimized weather parameters for faster response
            const weatherParams = new URLSearchParams({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
                hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index',
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
                timezone: 'auto',
                forecast_days: '7'
            });

            console.log('Fetching weather data for:', { latitude, longitude });
            const apiUrl = `${this.weatherAPI}?${weatherParams}`;
            console.log('API URL:', apiUrl);

            // Create an AbortController for timeout handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            try {
                // Make the weather API request with timeout
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'BrightlensNewsWeatherApp/1.0'
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                console.log('Weather API response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Weather API error response:', errorText);
                    throw new Error(`Weather API returned ${response.status}: ${response.statusText || errorText}`);
                }

                const weatherData = await response.json();
                console.log('Weather API response data:', weatherData);

                // Validate the response structure
                if (!weatherData || !weatherData.current) {
                    throw new Error('Invalid weather data structure received from API');
                }

                this.weatherData = weatherData;
                
                // Fetch air quality data in parallel (non-blocking)
                this.fetchAirQuality(latitude, longitude).catch(error => {
                    console.warn('Air quality data fetch failed:', error);
                    // Don't fail the whole operation for air quality
                });
                
                // Hide welcome and show weather data
                this.hideWelcome();
                this.hideError();
                this.renderWeatherData();
                this.updatePageTitle();
                this.updateBackground();
                this.hideLoading();
                this.updateLastUpdated();
                
                console.log('Weather data successfully processed and displayed');
                
            } catch (fetchError) {
                clearTimeout(timeoutId);
                
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timed out. Please check your internet connection and try again.');
                }
                throw fetchError;
            }
            
        } catch (error) {
            console.error('Weather fetch failed:', error);
            console.error('Coordinates were:', { latitude, longitude });
            this.hideLoading();
            
            // Provide more specific error messages
            let errorMessage = 'Unable to fetch weather data. ';
            if (error.message.includes('timed out')) {
                errorMessage += 'The request timed out. Please check your internet connection and try again.';
            } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                errorMessage += 'Network error. Please check your internet connection and try again.';
            } else if (error.message.includes('Invalid weather data')) {
                errorMessage += 'The weather service returned invalid data. Please try again later.';
            } else {
                errorMessage += error.message || 'Please try again or check your internet connection.';
            }
            
            this.showError(errorMessage);
        }
    }

    /**
     * Fetch air quality data (optimized for parallel processing)
     */
    async fetchAirQuality(latitude, longitude) {
        try {
            const aqParams = new URLSearchParams({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                current: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi',
                timezone: 'auto'
            });

            // Create timeout for air quality request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for air quality

            const response = await fetch(`${this.airQualityAPI}?${aqParams}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'BrightlensNewsWeatherApp/1.0'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            const data = await response.json();
            
            if (response.ok && data) {
                this.weatherData.airQuality = data;
                console.log('Air quality data fetched successfully');
            } else {
                console.warn('Air quality API returned non-OK response:', response.status);
            }
        } catch (error) {
            console.warn('Air quality data unavailable:', error);
        }
    }

    /**
     * Render all weather data
     */
    renderWeatherData() {
        try {
            console.log('Starting to render weather data...', this.weatherData);
            
            if (!this.weatherData || !this.weatherData.current) {
                throw new Error('Weather data is missing or invalid');
            }
            
            // Show sections first
            this.showWeatherSections();
            
            // Render each component with error handling
            try {
                this.renderCurrentWeather();
                console.log('Current weather rendered');
            } catch (error) {
                console.error('Error rendering current weather:', error);
            }
            
            try {
                this.renderHourlyForecast();
                console.log('Hourly forecast rendered');
            } catch (error) {
                console.error('Error rendering hourly forecast:', error);
            }
            
            try {
                this.renderDailyForecast();
                console.log('Daily forecast rendered');
            } catch (error) {
                console.error('Error rendering daily forecast:', error);
            }
            
            try {
                this.renderAirQuality();
                console.log('Air quality rendered');
            } catch (error) {
                console.error('Error rendering air quality:', error);
            }
            
            try {
                this.renderTemperatureChart();
                console.log('Temperature chart rendered');
            } catch (error) {
                console.error('Error rendering temperature chart:', error);
            }
            
            console.log('Weather data rendered successfully');
        } catch (error) {
            console.error('Error rendering weather data:', error);
            this.showError(`Failed to display weather data: ${error.message}`);
        }
    }

    /**
     * Render current weather
     */
    renderCurrentWeather() {
        const current = this.weatherData.current;
        const daily = this.weatherData.daily;
        
        console.log('Rendering current weather with data:', current);
        
        // Helper function to safely update element
        const safeUpdate = (elementId, value, property = 'textContent') => {
            const element = document.getElementById(elementId);
            if (element) {
                element[property] = value;
            } else {
                console.warn(`Element not found: ${elementId}`);
            }
        };
        
        // Location info
        safeUpdate('current-city', 
            `${this.currentLocation.name}${this.currentLocation.country ? ', ' + this.currentLocation.country : ''}`);
        
        // Current date and time
        const now = new Date();
        const timeOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        safeUpdate('current-datetime', now.toLocaleDateString('en-US', timeOptions));
        
        // Coordinates
        safeUpdate('coordinates', 
            `${this.currentLocation.latitude.toFixed(4)}°, ${this.currentLocation.longitude.toFixed(4)}°`);

        // Weather icon and description
        const weatherCode = current.weather_code;
        const weatherInfo = this.weatherCodes[weatherCode] || this.weatherCodes[0];
        
        safeUpdate('current-weather-icon', `weather-icon ${weatherInfo.icon}`, 'className');
        safeUpdate('current-description', weatherInfo.description);

        // Temperature
        const temp = this.convertTemperature(current.temperature_2m);
        const feelsLike = this.convertTemperature(current.apparent_temperature);
        
        safeUpdate('current-temp', Math.round(temp));
        safeUpdate('temp-unit-symbol', this.currentUnit === 'celsius' ? 'C' : 'F');
        safeUpdate('feels-like-temp', Math.round(feelsLike));
        safeUpdate('feels-like-unit', this.currentUnit === 'celsius' ? 'C' : 'F');

        // Weather details
        safeUpdate('wind-speed', `${Math.round(current.wind_speed_10m)} km/h`);
        safeUpdate('wind-direction', this.getWindDirection(current.wind_direction_10m));
        safeUpdate('humidity', `${current.relative_humidity_2m}%`);
        safeUpdate('pressure', `${Math.round(current.pressure_msl)} hPa`);
        safeUpdate('visibility', `10 km`); // Open-Meteo doesn't provide visibility in basic plan
        safeUpdate('cloud-cover', `${current.cloud_cover}%`);

        // UV Index
        const uvIndex = daily.uv_index_max ? daily.uv_index_max[0] || 0 : 0;
        safeUpdate('uv-index', Math.round(uvIndex));
        safeUpdate('uv-description', this.getUVDescription(uvIndex));

        // Sunrise and sunset
        if (daily.sunrise && daily.sunset) {
            const sunrise = new Date(daily.sunrise[0]);
            const sunset = new Date(daily.sunset[0]);
            
            safeUpdate('sunrise-time', sunrise.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }));
            safeUpdate('sunset-time', sunset.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }));
        }
    }

    /**
     * Render hourly forecast
     */
    renderHourlyForecast() {
        const hourlyContainer = document.getElementById('hourly-container');
        if (!hourlyContainer) return;

        const hourlyData = this.weatherData.hourly;
        const currentHour = new Date().getHours();
        
        hourlyContainer.innerHTML = '';

        // Show next 24 hours
        for (let i = 0; i < 24; i++) {
            const time = new Date(hourlyData.time[i]);
            const temp = this.convertTemperature(hourlyData.temperature_2m[i]);
            const weatherCode = hourlyData.weather_code[i];
            const weatherInfo = this.weatherCodes[weatherCode] || this.weatherCodes[0];
            const precipitation = hourlyData.precipitation_probability[i] || 0;
            const windSpeed = hourlyData.wind_speed_10m[i] || 0;

            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            hourlyItem.innerHTML = `
                <div class="hourly-time">${time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                <div class="hourly-icon">
                    <i class="${weatherInfo.icon}"></i>
                </div>
                <div class="hourly-temp">${Math.round(temp)}°</div>
                <div class="hourly-details">
                    <div>${precipitation}% rain</div>
                    <div>${Math.round(windSpeed)} km/h</div>
                </div>
            `;

            hourlyContainer.appendChild(hourlyItem);
        }
    }

    /**
     * Render daily forecast
     */
    renderDailyForecast() {
        const dailyContainer = document.getElementById('daily-container');
        if (!dailyContainer) return;

        const dailyData = this.weatherData.daily;
        dailyContainer.innerHTML = '';

        for (let i = 0; i < 7; i++) {
            const date = new Date(dailyData.time[i]);
            const maxTemp = this.convertTemperature(dailyData.temperature_2m_max[i]);
            const minTemp = this.convertTemperature(dailyData.temperature_2m_min[i]);
            const weatherCode = dailyData.weather_code[i];
            const weatherInfo = this.weatherCodes[weatherCode] || this.weatherCodes[0];
            const precipitation = dailyData.precipitation_sum[i] || 0;
            const windSpeed = dailyData.wind_speed_10m_max[i] || 0;

            const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' });

            const dailyItem = document.createElement('div');
            dailyItem.className = 'daily-item';
            dailyItem.innerHTML = `
                <div class="daily-day">${dayName}</div>
                <div class="daily-icon">
                    <i class="${weatherInfo.icon}"></i>
                </div>
                <div class="daily-description">${weatherInfo.description}</div>
                <div class="daily-temps">
                    <span class="daily-high">${Math.round(maxTemp)}°</span>
                    <span class="daily-low">${Math.round(minTemp)}°</span>
                </div>
                <div class="daily-details">
                    <div>${precipitation.toFixed(1)}mm rain</div>
                    <div>${Math.round(windSpeed)} km/h wind</div>
                </div>
            `;

            dailyContainer.appendChild(dailyItem);
        }
    }

    /**
     * Render air quality information
     */
    renderAirQuality() {
        const airQualitySection = document.getElementById('air-quality');
        
        if (!this.weatherData.airQuality || !this.weatherData.airQuality.current) {
            if (airQualitySection) {
                airQualitySection.style.display = 'none';
            }
            return;
        }

        const airQuality = this.weatherData.airQuality.current;
        const aqi = airQuality.european_aqi || airQuality.us_aqi || 0;
        
        // Helper function to safely update element
        const safeUpdate = (elementId, value, property = 'textContent') => {
            const element = document.getElementById(elementId);
            if (element) {
                element[property] = value;
            }
        };
        
        safeUpdate('aqi-value', Math.round(aqi));
        safeUpdate('aqi-label', this.getAQIDescription(aqi));
        safeUpdate('pm25', airQuality.pm2_5 ? `${Math.round(airQuality.pm2_5)} μg/m³` : '--');
        safeUpdate('pm10', airQuality.pm10 ? `${Math.round(airQuality.pm10)} μg/m³` : '--');
        
        if (airQualitySection) {
            airQualitySection.style.display = 'block';
        }
    }

    /**
     * Render temperature chart using Canvas
     */
    renderTemperatureChart() {
        const canvas = document.getElementById('temperature-chart');
        const chartsSection = document.getElementById('weather-charts');
        
        if (!canvas || !this.weatherData.hourly || !this.weatherData.hourly.time) {
            if (chartsSection) {
                chartsSection.style.display = 'none';
            }
            return;
        }

        const ctx = canvas.getContext('2d');
        const hourlyData = this.weatherData.hourly;
        
        // Clear previous chart
        if (this.chart) {
            this.chart.destroy();
        }

        // Prepare data for next 24 hours
        const chartData = [];
        const feelsLikeData = [];
        const precipitationData = [];
        const maxHours = Math.min(24, hourlyData.time.length);
        
        for (let i = 0; i < maxHours; i++) {
            if (hourlyData.time[i] && hourlyData.temperature_2m[i] !== undefined) {
                const time = new Date(hourlyData.time[i]);
                const temp = this.convertTemperature(hourlyData.temperature_2m[i]);
                const feelsLike = this.convertTemperature(hourlyData.apparent_temperature[i] || hourlyData.temperature_2m[i]);
                const precipitation = hourlyData.precipitation_probability[i] || 0;
                
                chartData.push({
                    x: time,
                    y: temp
                });
                
                feelsLikeData.push({
                    x: time,
                    y: feelsLike
                });

                precipitationData.push({
                    x: time,
                    y: precipitation
                });
            }
        }

        if (chartData.length > 0) {
            this.createAdvancedChart(ctx, chartData, feelsLikeData, precipitationData);
            
            if (chartsSection) {
                chartsSection.style.display = 'block';
            }
        } else {
            if (chartsSection) {
                chartsSection.style.display = 'none';
            }
        }
    }

    /**
     * Create advanced Chart.js temperature chart
     */
    createAdvancedChart(ctx, temperatureData, feelsLikeData, precipitationData) {
        // Get CSS custom properties for theming
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#2563eb';
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#1e293b';
        const textMuted = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#64748b';
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#e2e8f0';
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Temperature',
                        data: temperatureData,
                        borderColor: primaryColor,
                        backgroundColor: primaryColor + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: primaryColor,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: primaryColor,
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 3,
                        yAxisID: 'temperature'
                    },
                    {
                        label: 'Feels Like',
                        data: feelsLikeData,
                        borderColor: '#f59e0b',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#f59e0b',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        yAxisID: 'temperature'
                    },
                    {
                        label: 'Precipitation %',
                        data: precipitationData,
                        borderColor: '#06b6d4',
                        backgroundColor: '#06b6d4' + '30',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: '#06b6d4',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        yAxisID: 'precipitation'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    title: {
                        display: true,
                        text: '24-Hour Temperature & Precipitation Trend',
                        color: textColor,
                        font: {
                            size: 16,
                            weight: '600',
                            family: 'Inter, sans-serif'
                        },
                        padding: {
                            bottom: 20
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: textColor,
                            font: {
                                family: 'Inter, sans-serif',
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: borderColor,
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        titleFont: {
                            family: 'Inter, sans-serif',
                            size: 14,
                            weight: '600'
                        },
                        bodyFont: {
                            family: 'Inter, sans-serif',
                            size: 12
                        },
                        callbacks: {
                            title: function(context) {
                                const date = new Date(context[0].parsed.x);
                                return date.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    hour12: true 
                                });
                            },
                            label: function(context) {
                                if (context.datasetIndex === 2) {
                                    return `${context.dataset.label}: ${Math.round(context.parsed.y)}%`;
                                } else {
                                    return `${context.dataset.label}: ${Math.round(context.parsed.y)}°`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'HH:mm'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Time',
                            color: textMuted,
                            font: {
                                family: 'Inter, sans-serif',
                                size: 12,
                                weight: '500'
                            }
                        },
                        grid: {
                            color: borderColor,
                            lineWidth: 1
                        },
                        ticks: {
                            color: textMuted,
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11
                            },
                            maxTicksLimit: 8
                        }
                    },
                    temperature: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: `Temperature (°${this.currentUnit === 'celsius' ? 'C' : 'F'})`,
                            color: textMuted,
                            font: {
                                family: 'Inter, sans-serif',
                                size: 12,
                                weight: '500'
                            }
                        },
                        grid: {
                            color: borderColor,
                            lineWidth: 1
                        },
                        ticks: {
                            color: textMuted,
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11
                            },
                            callback: function(value) {
                                return Math.round(value) + '°';
                            }
                        }
                    },
                    precipitation: {
                        type: 'linear',
                        position: 'right',
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Precipitation (%)',
                            color: '#06b6d4',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 12,
                                weight: '500'
                            }
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#06b6d4',
                            font: {
                                family: 'Inter, sans-serif',
                                size: 11
                            },
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                elements: {
                    point: {
                        hoverBorderWidth: 3
                    }
                }
            }
        });
    }

    /**
     * Show weather sections
     */
    showWeatherSections() {
        document.getElementById('current-weather').style.display = 'block';
        document.getElementById('hourly-forecast').style.display = 'block';
        document.getElementById('daily-forecast').style.display = 'block';
        document.getElementById('weather-charts').style.display = 'block';
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.isLoading = true;
        document.getElementById('weather-loading').style.display = 'block';
        document.getElementById('weather-error').style.display = 'none';
        this.hideWeatherSections();
        
        // Animate progress bar
        const progressBar = document.getElementById('loading-progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            setTimeout(() => progressBar.style.width = '100%', 100);
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        this.isLoading = false;
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('weather-loading').style.display = 'none';
    }

    /**
     * Show error state
     */
    showError(message) {
        this.isLoading = false;
        document.getElementById('weather-loading').style.display = 'none';
        document.getElementById('weather-error').style.display = 'block';
        document.getElementById('error-message').textContent = message;
        this.hideWeatherSections();
        this.hideWelcome();
    }

    /**
     * Hide error state
     */
    hideError() {
        document.getElementById('weather-error').style.display = 'none';
    }

    /**
     * Hide weather sections
     */
    hideWeatherSections() {
        const sections = ['current-weather', 'hourly-forecast', 'daily-forecast', 'weather-charts', 'air-quality'];
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    /**
     * Show weather sections
     */
    showWeatherSections() {
        const sections = ['current-weather', 'hourly-forecast', 'daily-forecast', 'weather-charts', 'air-quality'];
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.style.display = 'block';
            }
        });
    }

    /**
     * Toggle temperature unit
     */
    toggleUnit() {
        this.currentUnit = this.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        const unitDisplay = document.getElementById('unit-display');
        if (unitDisplay) {
            unitDisplay.textContent = this.currentUnit === 'celsius' ? '°C' : '°F';
        }
        this.saveUserPreferences();
        
        if (this.weatherData) {
            this.renderWeatherData();
        }
    }

    /**
     * Convert temperature based on current unit
     */
    convertTemperature(celsius) {
        return this.currentUnit === 'celsius' ? celsius : (celsius * 9/5) + 32;
    }

    /**
     * Refresh weather data
     */
    async refreshWeatherData() {
        if (this.currentLocation && !this.isLoading) {
            await this.fetchWeatherData(this.currentLocation.latitude, this.currentLocation.longitude);
        }
    }

    /**
     * Update page title and favicon based on weather
     */
    updatePageTitle() {
        if (!this.weatherData) return;
        
        const current = this.weatherData.current;
        const temp = Math.round(this.convertTemperature(current.temperature_2m));
        const weatherCode = current.weather_code;
        const weatherInfo = this.weatherCodes[weatherCode] || this.weatherCodes[0];
        const location = this.currentLocation.name;
        
        // Update title
        const title = `${this.getWeatherEmoji(weatherCode)} ${temp}° ${location} - Brightlens News`;
        document.getElementById('page-title').textContent = title;
        
        // Update favicon
        const favicon = document.getElementById('weather-favicon');
        if (favicon) {
            const emoji = this.getWeatherEmoji(weatherCode);
            favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
        }
    }

    /**
     * Update background based on weather condition
     */
    updateBackground() {
        if (!this.weatherData) return;
        
        const weatherCode = this.weatherData.current.weather_code;
        const weatherInfo = this.weatherCodes[weatherCode] || this.weatherCodes[0];
        const background = document.getElementById('weather-background');
        
        if (background) {
            // Remove all background classes
            background.className = 'weather-background';
            // Add new background class
            background.classList.add(weatherInfo.bg);
        }
    }

    /**
     * Update last updated time
     */
    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = timeString;
        }
    }

    /**
     * Get wind direction from degrees
     */
    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

    /**
     * Get UV description
     */
    getUVDescription(uvIndex) {
        if (uvIndex < 3) return 'Low';
        if (uvIndex < 6) return 'Moderate';
        if (uvIndex < 8) return 'High';
        if (uvIndex < 11) return 'Very High';
        return 'Extreme';
    }

    /**
     * Get AQI description
     */
    getAQIDescription(aqi) {
        if (aqi <= 20) return 'Good';
        if (aqi <= 40) return 'Fair';
        if (aqi <= 60) return 'Moderate';
        if (aqi <= 80) return 'Poor';
        if (aqi <= 100) return 'Very Poor';
        return 'Extremely Poor';
    }

    /**
     * Get weather emoji for title/favicon
     */
    getWeatherEmoji(weatherCode) {
        const emojiMap = {
            0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
            45: '🌫️', 48: '🌫️',
            51: '🌦️', 53: '🌦️', 55: '🌦️', 56: '🌦️', 57: '🌦️',
            61: '🌧️', 63: '🌧️', 65: '⛈️', 66: '🌧️', 67: '⛈️',
            71: '🌨️', 73: '❄️', 75: '❄️', 77: '🌨️',
            80: '🌦️', 81: '🌧️', 82: '⛈️',
            85: '🌨️', 86: '❄️',
            95: '⛈️', 96: '⛈️', 99: '⛈️'
        };
        return emojiMap[weatherCode] || '🌤️';
    }
}

// Initialize weather dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherDashboard = new WeatherDashboard();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherDashboard;
}