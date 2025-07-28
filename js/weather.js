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
            document.getElementById('unit-display').textContent = savedUnit === 'celsius' ? '°C' : '°F';
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
            const response = await fetch(`${this.geocodingAPI}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const location = data.results[0];
                await this.searchLocationByCoords(location.latitude, location.longitude, location);
            } else {
                this.showError('Location not found. Please try a different search term.');
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.showError('Failed to search for location. Please check your internet connection.');
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
            console.log('API URL:', `${this.weatherAPI}?${weatherParams}`);

            // Make the weather API request
            const response = await fetch(`${this.weatherAPI}?${weatherParams}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            console.log('Weather API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Weather API error response:', errorText);
                throw new Error(`Weather API returned ${response.status}: ${errorText}`);
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
            
        } catch (error) {
            console.error('Weather fetch failed:', error);
            console.error('Coordinates were:', { latitude, longitude });
            this.hideLoading();
            this.showError(`Unable to fetch weather data. Please try again or check your internet connection.`);
        }
    }

    /**
     * Fetch air quality data (optimized for parallel processing)
     */
    async fetchAirQuality(latitude, longitude) {
        try {
            const aqParams = new URLSearchParams({
                latitude: latitude,
                longitude: longitude,
                current: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi',
                timezone: 'auto'
            });

            const response = await fetch(`${this.airQualityAPI}?${aqParams}`);
            const data = await response.json();
            
            if (response.ok) {
                this.weatherData.airQuality = data;
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
            const precipitation = dailyData.precipitation_probability_max[i] || 0;
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
                    <div>${precipitation}% rain</div>
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
        const labels = [];
        const temperatures = [];
        
        const maxHours = Math.min(24, hourlyData.time.length);
        
        for (let i = 0; i < maxHours; i++) {
            if (hourlyData.time[i] && hourlyData.temperature_2m[i] !== undefined) {
                const time = new Date(hourlyData.time[i]);
                labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit' }));
                temperatures.push(this.convertTemperature(hourlyData.temperature_2m[i]));
            }
        }

        if (temperatures.length > 0) {
            // Simple canvas chart implementation
            this.drawTemperatureChart(ctx, canvas, labels, temperatures);
            
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
     * Draw temperature chart on canvas
     */
    drawTemperatureChart(ctx, canvas, labels, temperatures) {
        const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        const chartWidth = canvas.offsetWidth - 80;
        const chartHeight = canvas.offsetHeight - 80;
        const startX = 40;
        const startY = 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        
        // Find min and max temperatures
        const minTemp = Math.min(...temperatures);
        const maxTemp = Math.max(...temperatures);
        const tempRange = maxTemp - minTemp || 1;
        
        // Draw grid lines
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#e2e8f0';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = startY + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + chartWidth, y);
            ctx.stroke();
        }
        
        // Vertical grid lines
        for (let i = 0; i <= 6; i++) {
            const x = startX + (chartWidth / 6) * i;
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY + chartHeight);
            ctx.stroke();
        }
        
        // Draw temperature line
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#2563eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i < temperatures.length; i++) {
            const x = startX + (chartWidth / (temperatures.length - 1)) * i;
            const y = startY + chartHeight - ((temperatures[i] - minTemp) / tempRange) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw temperature points and labels
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#2563eb';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        
        for (let i = 0; i < temperatures.length; i += 4) { // Show every 4th hour
            const x = startX + (chartWidth / (temperatures.length - 1)) * i;
            const y = startY + chartHeight - ((temperatures[i] - minTemp) / tempRange) * chartHeight;
            
            // Draw point
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw temperature label
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#1e293b';
            ctx.fillText(`${Math.round(temperatures[i])}°`, x, y - 10);
            
            // Draw time label
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#64748b';
            ctx.fillText(labels[i], x, startY + chartHeight + 20);
            
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#2563eb';
        }
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
        document.getElementById('unit-display').textContent = this.currentUnit === 'celsius' ? '°C' : '°F';
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
        document.getElementById('last-updated-time').textContent = timeString;
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