/**
 * Professional Weather Dashboard
 * Using Open-Meteo API (no key required) and Geocoding API
 * Features: Dark mode, charts, geolocation, localStorage, auto-refresh
 */

class WeatherDashboard {
    constructor() {
        // API Configuration (Open-Meteo - no key required)
        this.weatherAPI = 'https://api.open-meteo.com/v1/forecast';
        this.geocodingAPI = 'https://geocoding-api.open-meteo.com/v1/search';
        
        // App State
        this.currentUnit = 'celsius'; // celsius or fahrenheit
        this.isDarkMode = false;
        this.currentLocation = null;
        this.weatherData = null;
        this.forecastData = null;
        this.refreshInterval = null;
        this.charts = {};
        
        // Weather code mappings for icons and descriptions
        this.weatherCodes = {
            0: { icon: 'fas fa-sun', description: 'Clear sky' },
            1: { icon: 'fas fa-sun', description: 'Mainly clear' },
            2: { icon: 'fas fa-cloud-sun', description: 'Partly cloudy' },
            3: { icon: 'fas fa-cloud', description: 'Overcast' },
            45: { icon: 'fas fa-smog', description: 'Fog' },
            48: { icon: 'fas fa-smog', description: 'Depositing rime fog' },
            51: { icon: 'fas fa-cloud-drizzle', description: 'Light drizzle' },
            53: { icon: 'fas fa-cloud-drizzle', description: 'Moderate drizzle' },
            55: { icon: 'fas fa-cloud-drizzle', description: 'Dense drizzle' },
            56: { icon: 'fas fa-cloud-drizzle', description: 'Light freezing drizzle' },
            57: { icon: 'fas fa-cloud-drizzle', description: 'Dense freezing drizzle' },
            61: { icon: 'fas fa-cloud-rain', description: 'Slight rain' },
            63: { icon: 'fas fa-cloud-rain', description: 'Moderate rain' },
            65: { icon: 'fas fa-cloud-rain', description: 'Heavy rain' },
            66: { icon: 'fas fa-cloud-rain', description: 'Light freezing rain' },
            67: { icon: 'fas fa-cloud-rain', description: 'Heavy freezing rain' },
            71: { icon: 'fas fa-snowflake', description: 'Slight snow fall' },
            73: { icon: 'fas fa-snowflake', description: 'Moderate snow fall' },
            75: { icon: 'fas fa-snowflake', description: 'Heavy snow fall' },
            77: { icon: 'fas fa-snowflake', description: 'Snow grains' },
            80: { icon: 'fas fa-cloud-showers-heavy', description: 'Slight rain showers' },
            81: { icon: 'fas fa-cloud-showers-heavy', description: 'Moderate rain showers' },
            82: { icon: 'fas fa-cloud-showers-heavy', description: 'Violent rain showers' },
            85: { icon: 'fas fa-snowflake', description: 'Slight snow showers' },
            86: { icon: 'fas fa-snowflake', description: 'Heavy snow showers' },
            95: { icon: 'fas fa-bolt', description: 'Thunderstorm' },
            96: { icon: 'fas fa-bolt', description: 'Thunderstorm with slight hail' },
            99: { icon: 'fas fa-bolt', description: 'Thunderstorm with heavy hail' }
        };
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the weather application
     */
    async init() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.setupAutoRefresh();
        await this.loadDefaultLocation();
        this.createCharts();
        this.updateLastUpdated();
        
        // Initialize smooth scrolling after DOM is ready
        setTimeout(() => {
            if (window.weatherSmoothInteractions) {
                window.weatherSmoothInteractions.updateSmoothScrolling();
            }
        }, 500);
    }

    /**
     * Load user preferences from localStorage
     */
    loadUserPreferences() {
        const savedUnit = localStorage.getItem('weather-unit');
        const savedTheme = localStorage.getItem('weather-theme');
        const savedLocation = localStorage.getItem('weather-last-location');
        
        if (savedUnit) {
            this.currentUnit = savedUnit;
            document.getElementById('unit-display').textContent = savedUnit === 'celsius' ? '°C' : '°F';
        }
        
        if (savedTheme === 'dark') {
            this.enableDarkMode();
        }
        
        if (savedLocation) {
            this.currentLocation = JSON.parse(savedLocation);
        }
    }

    /**
     * Save user preferences to localStorage
     */
    saveUserPreferences() {
        localStorage.setItem('weather-unit', this.currentUnit);
        localStorage.setItem('weather-theme', this.isDarkMode ? 'dark' : 'light');
        if (this.currentLocation) {
            localStorage.setItem('weather-last-location', JSON.stringify(this.currentLocation));
        }
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const cityInput = document.getElementById('city-input');
        const locationBtn = document.getElementById('location-btn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }
        
        if (cityInput) {
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
            
            // Search suggestions
            cityInput.addEventListener('input', this.debounce((e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    this.showSearchSuggestions(query);
                } else {
                    this.hideSuggestions();
                }
            }, 300));
        }
        
        if (locationBtn) {
            locationBtn.addEventListener('click', () => this.getCurrentLocation());
        }

        // Control buttons
        const unitToggle = document.getElementById('unit-toggle');
        if (unitToggle) {
            unitToggle.addEventListener('click', () => this.toggleTemperatureUnit());
        }

        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshWeatherData());
        }

        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }

        // Quick city buttons
        const cityButtons = document.querySelectorAll('.city-btn');
        cityButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const city = btn.dataset.city;
                this.searchCity(city);
            });
        });

        // Retry button
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadDefaultLocation());
        }

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSuggestions();
            }
        });
    }

    /**
     * Set up auto-refresh functionality
     */
    setupAutoRefresh() {
        // Refresh every 15 minutes
        this.refreshInterval = setInterval(() => {
            if (this.currentLocation) {
                this.loadWeatherForCoordinates(this.currentLocation.latitude, this.currentLocation.longitude, false);
            }
        }, 15 * 60 * 1000);
        
        // Refresh when page becomes visible again
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.currentLocation) {
                const lastUpdate = localStorage.getItem('weather-last-update');
                const now = Date.now();
                
                // Refresh if more than 10 minutes since last update
                if (!lastUpdate || (now - parseInt(lastUpdate)) > 10 * 60 * 1000) {
                    this.loadWeatherForCoordinates(this.currentLocation.latitude, this.currentLocation.longitude, false);
                }
            }
        });
    }

    /**
     * Load weather for default location (Nairobi or saved location)
     */
    async loadDefaultLocation() {
        try {
            if (this.currentLocation) {
                await this.loadWeatherForCoordinates(
                    this.currentLocation.latitude, 
                    this.currentLocation.longitude,
                    false
                );
            } else {
                // Set Nairobi as default location
                this.currentLocation = {
                    name: 'Nairobi',
                    country: 'Kenya',
                    admin1: 'Nairobi County',
                    latitude: -1.2921,
                    longitude: 36.8219
                };
                await this.loadNairobiWeatherDirect();
            }
        } catch (error) {
            console.error('Default location load failed:', error);
            // Final fallback - load Nairobi directly
            try {
                this.currentLocation = {
                    name: 'Nairobi',
                    country: 'Kenya',
                    admin1: 'Nairobi County',
                    latitude: -1.2921,
                    longitude: 36.8219
                };
                await this.loadNairobiWeatherDirect();
            } catch (fallbackError) {
                console.error('Final fallback failed:', fallbackError);
                this.showError('Unable to load weather data. Please try searching for a location.');
            }
        }
    }

    /**
     * Handle search input
     */
    async handleSearch() {
        const cityInput = document.getElementById('city-input');
        const query = cityInput?.value.trim();
        
        if (query) {
            await this.searchCity(query);
            cityInput.value = '';
            this.hideSuggestions();
        }
    }

    /**
     * Search for a city and load its weather
     */
    async searchCity(cityName) {
        this.showLoading();
        
        try {
            // First, get coordinates for the city
            const geocodingResponse = await fetch(
                `${this.geocodingAPI}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
            );
            
            if (!geocodingResponse.ok) {
                throw new Error(`Geocoding API error: ${geocodingResponse.status}`);
            }
            
            const geocodingData = await geocodingResponse.json();
            
            if (!geocodingData.results || geocodingData.results.length === 0) {
                throw new Error('Location not found. Please check the spelling and try again.');
            }
            
            const location = geocodingData.results[0];
            this.currentLocation = {
                name: location.name,
                country: location.country,
                admin1: location.admin1,
                latitude: location.latitude,
                longitude: location.longitude
            };
            
            await this.loadWeatherForCoordinates(location.latitude, location.longitude);
            
        } catch (error) {
            console.error('Location search error:', error);
            this.showError(error.message || 'Unable to find the specified location.');
        }
    }

    /**
     * Get user's current location
     */
    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        const locationBtn = document.getElementById('location-btn');
        const originalIcon = locationBtn?.innerHTML;
        
        if (locationBtn) {
            locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                // Reverse geocode to get location name
                try {
                    const response = await fetch(
                        `${this.geocodingAPI}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.results && data.results.length > 0) {
                            const location = data.results[0];
                            this.currentLocation = {
                                name: location.name,
                                country: location.country,
                                admin1: location.admin1,
                                latitude: latitude,
                                longitude: longitude
                            };
                        }
                    }
                } catch (error) {
                    console.error('Reverse geocoding error:', error);
                    // Continue with coordinates even if reverse geocoding fails
                    this.currentLocation = {
                        name: 'Current Location',
                        country: '',
                        latitude: latitude,
                        longitude: longitude
                    };
                }
                
                await this.loadWeatherForCoordinates(latitude, longitude);
                
                if (locationBtn) {
                    locationBtn.innerHTML = originalIcon;
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                this.showError('Unable to get your location. Please search for a city manually.');
                
                if (locationBtn) {
                    locationBtn.innerHTML = originalIcon;
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    }

    /**
     * Load weather data for coordinates
     */
    async loadWeatherForCoordinates(lat, lon, showLoading = true) {
        if (showLoading) {
            this.showLoading();
        }
        
        try {
            // Build API URL with all required parameters
            const weatherParams = new URLSearchParams({
                latitude: lat,
                longitude: lon,
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
                hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day',
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,uv_index_max',
                timezone: 'auto',
                forecast_days: 7
            });

            const weatherResponse = await fetch(`${this.weatherAPI}?${weatherParams}`);
            
            if (!weatherResponse.ok) {
                throw new Error(`Weather API error: ${weatherResponse.status}`);
            }

            const weatherData = await weatherResponse.json();
            
            this.weatherData = weatherData;
            
            // Update UI
            this.displayCurrentWeather(weatherData);
            this.displayHourlyForecast(weatherData);
            this.displayDailyForecast(weatherData);
            this.updateCharts(weatherData);
            this.updateBackground(weatherData);
            this.checkWeatherAlerts(weatherData);
            this.updatePageTitle(weatherData);
            this.updateFavicon(weatherData);

            this.hideLoading();
            this.showWeatherContent();
            this.saveUserPreferences();
            this.updateLastUpdated();
            
            // Store last update timestamp
            localStorage.setItem('weather-last-update', Date.now().toString());
            
            // Refresh smooth scrolling after content update
            setTimeout(() => {
                if (window.weatherSmoothInteractions) {
                    window.weatherSmoothInteractions.updateSmoothScrolling();
                }
            }, 100);

        } catch (error) {
            console.error('Weather fetch error:', error);
            // Fallback to Nairobi coordinates if API fails
            if (!this.currentLocation || (this.currentLocation.latitude !== -1.2921 || this.currentLocation.longitude !== 36.8219)) {
                console.log('Falling back to Nairobi weather data...');
                this.currentLocation = {
                    name: 'Nairobi',
                    country: 'Kenya',
                    admin1: 'Nairobi County',
                    latitude: -1.2921,
                    longitude: 36.8219
                };
                try {
                    // Try to load Nairobi weather directly with coordinates
                    await this.loadNairobiWeatherDirect();
                } catch (fallbackError) {
                    console.error('Fallback error:', fallbackError);
                    this.showError('Unable to fetch weather data. Please try again later.');
                }
            } else {
                this.showError('Unable to fetch weather data. Please try again later.');
            }
        }
    }

    /**
     * Load Nairobi weather as a reliable fallback
     */
    async loadNairobiWeatherDirect() {
        try {
            // Nairobi coordinates
            const latitude = -1.2921;
            const longitude = 36.8219;
            
            // Construct weather API URL for Nairobi
            const unit = this.currentUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
            const weatherURL = `${this.weatherAPI}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl&hourly=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max&temperature_unit=${unit}&timezone=auto`;
            
            const response = await fetch(weatherURL);
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const weatherData = await response.json();
            this.weatherData = weatherData;
            
            // Update UI with Nairobi weather
            this.displayCurrentWeather(weatherData);
            this.displayHourlyForecast(weatherData);
            this.displayDailyForecast(weatherData);
            this.updateCharts(weatherData);
            this.updateBackground(weatherData);
            this.checkWeatherAlerts(weatherData);
            this.updatePageTitle(weatherData);
            this.updateFavicon(weatherData);

            this.hideLoading();
            this.showWeatherContent();
            this.saveUserPreferences();
            this.updateLastUpdated();
            
            // Store last update timestamp
            localStorage.setItem('weather-last-update', Date.now().toString());
            
            console.log('Successfully loaded Nairobi weather as fallback');
            
        } catch (error) {
            console.error('Nairobi fallback failed:', error);
            throw error; // Re-throw to be handled by caller
        }
    }

    /**
     * Display current weather
     */
    displayCurrentWeather(data) {
        const current = data.current;
        const location = this.currentLocation;
        
        // Location info
        const locationText = location.admin1 
            ? `${location.name}, ${location.admin1}, ${location.country}`
            : `${location.name}, ${location.country}`;
        document.getElementById('current-city').textContent = locationText;
        document.getElementById('current-datetime').textContent = this.formatDateTime(new Date());
        
        // Show coordinates
        const coordsElement = document.getElementById('coordinates');
        if (coordsElement) {
            coordsElement.textContent = `${location.latitude.toFixed(4)}°, ${location.longitude.toFixed(4)}°`;
        }

        // Weather icon and description
        const weatherCode = current.weather_code;
        const weatherInfo = this.weatherCodes[weatherCode] || this.weatherCodes[0];
        
        document.getElementById('current-weather-icon').className = `weather-icon ${weatherInfo.icon}`;
        document.getElementById('current-description').textContent = weatherInfo.description;

        // Temperature
        this.updateTemperature(current);

        // Weather details
        document.getElementById('wind-speed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
        document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} hPa`;
        document.getElementById('cloud-cover').textContent = `${current.cloud_cover}%`;
        
        // For visibility and UV index, we'll use hourly data for current hour
        const currentHour = new Date().getHours();
        const hourlyData = data.hourly;
        const currentHourIndex = hourlyData.time.findIndex(time => new Date(time).getHours() === currentHour);
        
        if (currentHourIndex !== -1) {
            const visibility = hourlyData.visibility[currentHourIndex];
            const uvIndex = hourlyData.uv_index[currentHourIndex];
            
            document.getElementById('visibility').textContent = visibility ? `${(visibility / 1000).toFixed(1)} km` : 'N/A';
            document.getElementById('uv-index').textContent = uvIndex ? Math.round(uvIndex) : 'N/A';
        } else {
            document.getElementById('visibility').textContent = 'N/A';
            document.getElementById('uv-index').textContent = 'N/A';
        }

        // Sunrise and sunset
        const dailyData = data.daily;
        if (dailyData.sunrise && dailyData.sunset) {
            document.getElementById('sunrise-time').textContent = this.formatTime(new Date(dailyData.sunrise[0]));
            document.getElementById('sunset-time').textContent = this.formatTime(new Date(dailyData.sunset[0]));
        }
    }

    /**
     * Update temperature display
     */
    updateTemperature(current) {
        const temp = this.currentUnit === 'celsius' ? 
            current.temperature_2m : 
            this.celsiusToFahrenheit(current.temperature_2m);
        
        const feelsLike = this.currentUnit === 'celsius' ? 
            current.apparent_temperature : 
            this.celsiusToFahrenheit(current.apparent_temperature);
        
        document.getElementById('current-temp').textContent = Math.round(temp);
        document.getElementById('feels-like-temp').textContent = Math.round(feelsLike);
        
        const unit = this.currentUnit === 'celsius' ? 'C' : 'F';
        document.getElementById('temp-unit-symbol').textContent = unit;
        document.getElementById('feels-like-unit').textContent = unit;
    }

    /**
     * Display hourly forecast
     */
    displayHourlyForecast(data) {
        const container = document.getElementById('hourly-container');
        if (!container) return;

        container.innerHTML = '';

        // Show next 24 hours
        const hourlyData = data.hourly;
        const now = new Date();
        const currentHour = now.getHours();
        
        for (let i = 0; i < 24; i++) {
            const hourIndex = (currentHour + i) % 168; // 7 days * 24 hours
            if (hourIndex >= hourlyData.time.length) break;
            
            const time = new Date(hourlyData.time[hourIndex]);
            const temp = this.currentUnit === 'celsius' ? 
                hourlyData.temperature_2m[hourIndex] : 
                this.celsiusToFahrenheit(hourlyData.temperature_2m[hourIndex]);
            
            const weatherCode = hourlyData.weather_code[hourIndex];
            const weatherInfo = this.weatherCodes[weatherCode] || this.weatherCodes[0];
            const precipitation = hourlyData.precipitation_probability[hourIndex];
            
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            
            hourlyItem.innerHTML = `
                <div class="hourly-time">${this.formatTime(time)}</div>
                <div class="hourly-icon">
                    <i class="${weatherInfo.icon}"></i>
                </div>
                <div class="hourly-temp">${Math.round(temp)}°</div>
                <div class="hourly-desc">${precipitation}% rain</div>
            `;

            // Add tooltip with more details
            hourlyItem.title = `${weatherInfo.description}\nTemperature: ${Math.round(temp)}°${this.currentUnit === 'celsius' ? 'C' : 'F'}\nPrecipitation: ${precipitation}%\nWind: ${Math.round(hourlyData.wind_speed_10m[hourIndex])} km/h`;

            container.appendChild(hourlyItem);
        }
    }

    /**
     * Display daily forecast
     */
    displayDailyForecast(data) {
        const container = document.getElementById('daily-container');
        if (!container) return;

        container.innerHTML = '';

        const dailyData = data.daily;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(dailyData.time[i]);
            const dayName = this.formatDayName(date, i);
            
            const tempMax = this.currentUnit === 'celsius' ? 
                dailyData.temperature_2m_max[i] : 
                this.celsiusToFahrenheit(dailyData.temperature_2m_max[i]);
            
            const tempMin = this.currentUnit === 'celsius' ? 
                dailyData.temperature_2m_min[i] : 
                this.celsiusToFahrenheit(dailyData.temperature_2m_min[i]);
            
            const weatherCode = dailyData.weather_code[i];
            const weatherInfo = this.weatherCodes[weatherCode] || this.weatherCodes[0];
            
            const precipitation = Math.round(dailyData.precipitation_probability_max[i]);
            const windSpeed = Math.round(dailyData.wind_speed_10m_max[i]);
            const uvIndex = Math.round(dailyData.uv_index_max[i]);
            
            const unit = this.currentUnit === 'celsius' ? 'C' : 'F';
            
            const dailyItem = document.createElement('div');
            dailyItem.className = 'daily-item';
            
            dailyItem.innerHTML = `
                <div class="daily-main">
                    <div class="daily-date">${dayName}</div>
                    <div class="daily-weather">
                        <i class="daily-icon ${weatherInfo.icon}"></i>
                        <span class="daily-desc">${weatherInfo.description}</span>
                    </div>
                    <div class="daily-temps">
                        <span class="daily-high">${Math.round(tempMax)}°${unit}</span>
                        <span class="daily-low">${Math.round(tempMin)}°${unit}</span>
                    </div>
                </div>
                <div class="daily-details">
                    <div class="daily-detail">
                        <i class="fas fa-cloud-rain"></i>
                        <span>Rain: ${precipitation}%</span>
                    </div>
                    <div class="daily-detail">
                        <i class="fas fa-wind"></i>
                        <span>Wind: ${windSpeed} km/h</span>
                    </div>
                    <div class="daily-detail">
                        <i class="fas fa-sun"></i>
                        <span>UV Index: ${uvIndex}</span>
                    </div>
                    <div class="daily-detail">
                        <i class="fas fa-eye"></i>
                        <span>Daylight: ${this.formatDaylight(dailyData.daylight_duration[i])}</span>
                    </div>
                </div>
            `;

            container.appendChild(dailyItem);
        }
    }

    /**
     * Create and update weather charts
     */
    createCharts() {
        this.createTemperatureChart();
        this.createConditionsChart();
    }

    /**
     * Create temperature trend chart
     */
    createTemperatureChart() {
        const ctx = document.getElementById('temperature-chart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.temperature) {
            this.charts.temperature.destroy();
        }

        this.charts.temperature = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white',
                            font: {
                                size: 14,
                                weight: '500'
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value + '°';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Create weather conditions chart
     */
    createConditionsChart() {
        const ctx = document.getElementById('conditions-chart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.conditions) {
            this.charts.conditions.destroy();
        }

        this.charts.conditions = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Humidity', 'Cloud Cover', 'Precipitation Probability'],
                datasets: [{
                    data: [65, 30, 20],
                    backgroundColor: [
                        '#3b82f6',
                        '#8b5cf6',
                        '#f97316'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: {
                                size: 14,
                                weight: '500'
                            },
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    /**
     * Update charts with new data
     */
    updateCharts(weatherData) {
        if (!weatherData) return;

        // Update temperature chart
        if (this.charts.temperature) {
            const hourlyData = weatherData.hourly;
            const now = new Date();
            const currentHour = now.getHours();
            
            const labels = [];
            const temps = [];
            
            for (let i = 0; i < 24; i++) {
                const hourIndex = (currentHour + i) % Math.min(168, hourlyData.time.length);
                if (hourIndex >= hourlyData.time.length) break;
                
                const time = new Date(hourlyData.time[hourIndex]);
                const temp = this.currentUnit === 'celsius' ? 
                    hourlyData.temperature_2m[hourIndex] : 
                    this.celsiusToFahrenheit(hourlyData.temperature_2m[hourIndex]);
                
                labels.push(this.formatTime(time));
                temps.push(Math.round(temp));
            }

            this.charts.temperature.data.labels = labels;
            this.charts.temperature.data.datasets[0].data = temps;
            this.charts.temperature.data.datasets[0].label = `Temperature (°${this.currentUnit === 'celsius' ? 'C' : 'F'})`;
            this.charts.temperature.update();
        }

        // Update conditions chart
        if (this.charts.conditions && weatherData.current) {
            const humidity = weatherData.current.relative_humidity_2m;
            const cloudCover = weatherData.current.cloud_cover;
            
            // Get current hour precipitation probability
            const now = new Date();
            const currentHour = now.getHours();
            const hourlyData = weatherData.hourly;
            const currentHourIndex = hourlyData.time.findIndex(time => new Date(time).getHours() === currentHour);
            const precipitationProb = currentHourIndex !== -1 ? hourlyData.precipitation_probability[currentHourIndex] : 0;

            this.charts.conditions.data.datasets[0].data = [humidity, cloudCover, precipitationProb];
            this.charts.conditions.update();
        }
    }

    /**
     * Update background based on weather
     */
    updateBackground(weatherData) {
        const background = document.getElementById('weather-background');
        if (!background) return;

        const current = weatherData.current;
        const weatherCode = current.weather_code;
        const isDay = current.is_day;

        // Remove existing weather classes
        background.className = 'weather-background';

        // Add appropriate class based on weather conditions
        if (weatherCode >= 95) {
            background.classList.add('stormy');
            this.addWeatherParticles('storm');
        } else if (weatherCode >= 61 && weatherCode <= 67) {
            background.classList.add('rainy');
            this.addWeatherParticles('rain');
        } else if (weatherCode >= 71 && weatherCode <= 86) {
            background.classList.add('snowy');
            this.addWeatherParticles('snow');
        } else if (weatherCode >= 45 && weatherCode <= 48) {
            background.classList.add('cloudy');
        } else if (weatherCode >= 2) {
            background.classList.add('cloudy');
        } else {
            background.classList.add(isDay ? 'sunny' : 'night');
        }
    }

    /**
     * Add weather particles animation
     */
    addWeatherParticles(type) {
        const particlesContainer = document.querySelector('.background-particles');
        if (!particlesContainer) return;

        particlesContainer.innerHTML = '';

        if (type === 'rain') {
            for (let i = 0; i < 50; i++) {
                const drop = document.createElement('div');
                drop.className = 'rain-drop';
                drop.style.left = Math.random() * 100 + '%';
                drop.style.animationDelay = Math.random() * 1 + 's';
                drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
                particlesContainer.appendChild(drop);
            }
        } else if (type === 'snow') {
            for (let i = 0; i < 30; i++) {
                const flake = document.createElement('div');
                flake.className = 'snow-flake';
                flake.style.left = Math.random() * 100 + '%';
                flake.style.animationDelay = Math.random() * 3 + 's';
                flake.style.animationDuration = (Math.random() * 2 + 2) + 's';
                particlesContainer.appendChild(flake);
            }
        }
    }

    /**
     * Check for weather alerts
     */
    checkWeatherAlerts(weatherData) {
        const alertsContainer = document.getElementById('weather-alerts');
        const alertTitle = document.getElementById('alert-title');
        const alertDescription = document.getElementById('alert-description');
        
        if (!alertsContainer || !alertTitle || !alertDescription) return;

        const current = weatherData.current;
        const temp = current.temperature_2m;
        const weatherCode = current.weather_code;
        const windSpeed = current.wind_speed_10m;

        let hasAlert = false;
        let alertText = '';
        let alertDesc = '';

        // Check for extreme conditions
        if (temp > 35) {
            hasAlert = true;
            alertText = 'Extreme Heat Warning';
            alertDesc = `Temperature is extremely high at ${Math.round(temp)}°C. Stay hydrated and avoid prolonged sun exposure.`;
        } else if (temp < -10) {
            hasAlert = true;
            alertText = 'Extreme Cold Warning';
            alertDesc = `Temperature is extremely low at ${Math.round(temp)}°C. Dress warmly and limit outdoor activities.`;
        } else if (windSpeed > 50) {
            hasAlert = true;
            alertText = 'High Wind Advisory';
            alertDesc = `Strong winds detected at ${Math.round(windSpeed)} km/h. Secure loose objects and exercise caution outdoors.`;
        } else if (weatherCode >= 95) {
            hasAlert = true;
            alertText = 'Thunderstorm Warning';
            alertDesc = 'Thunderstorms are present in your area. Seek shelter and avoid outdoor activities.';
        }

        if (hasAlert) {
            alertTitle.textContent = alertText;
            alertDescription.textContent = alertDesc;
            alertsContainer.style.display = 'block';
        } else {
            alertsContainer.style.display = 'none';
        }
    }

    /**
     * Update page title with current weather
     */
    updatePageTitle(weatherData) {
        const current = weatherData.current;
        const temp = Math.round(this.currentUnit === 'celsius' ? 
            current.temperature_2m : 
            this.celsiusToFahrenheit(current.temperature_2m));
        const unit = this.currentUnit === 'celsius' ? 'C' : 'F';
        const weatherCode = current.weather_code;
        const weatherInfo = this.weatherCodes[weatherCode] || this.weatherCodes[0];
        const location = this.currentLocation;
        
        const title = `${temp}°${unit} ${weatherInfo.description} in ${location.name} - Weather Dashboard`;
        document.getElementById('page-title').textContent = title;
    }

    /**
     * Update favicon based on weather
     */
    updateFavicon(weatherData) {
        const current = weatherData.current;
        const weatherCode = current.weather_code;
        const isDay = current.is_day;
        
        let emoji = '☀️';
        
        if (weatherCode >= 95) {
            emoji = '⛈️';
        } else if (weatherCode >= 71 && weatherCode <= 86) {
            emoji = '❄️';
        } else if (weatherCode >= 61 && weatherCode <= 67) {
            emoji = '🌧️';
        } else if (weatherCode >= 45 && weatherCode <= 48) {
            emoji = '🌫️';
        } else if (weatherCode >= 2) {
            emoji = '☁️';
        } else {
            emoji = isDay ? '☀️' : '🌙';
        }
        
        const favicon = document.getElementById('weather-favicon');
        if (favicon) {
            favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
        }
    }

    /**
     * Show search suggestions
     */
    async showSearchSuggestions(query) {
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        try {
            const response = await fetch(
                `${this.geocodingAPI}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
            );
            
            if (!response.ok) return;
            
            const data = await response.json();
            const suggestions = data.results || [];
            
            this.displaySuggestions(suggestions);
            
        } catch (error) {
            console.error('Suggestions error:', error);
        }
    }

    /**
     * Display search suggestions
     */
    displaySuggestions(suggestions) {
        const container = document.getElementById('search-suggestions');
        if (!container) return;

        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        container.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            
            const locationText = suggestion.admin1 
                ? `${suggestion.name}, ${suggestion.admin1}, ${suggestion.country}`
                : `${suggestion.name}, ${suggestion.country}`;
                
            item.textContent = locationText;
            
            item.addEventListener('click', () => {
                this.currentLocation = {
                    name: suggestion.name,
                    country: suggestion.country,
                    admin1: suggestion.admin1,
                    latitude: suggestion.latitude,
                    longitude: suggestion.longitude
                };
                
                this.loadWeatherForCoordinates(suggestion.latitude, suggestion.longitude);
                document.getElementById('city-input').value = '';
                this.hideSuggestions();
            });
            
            container.appendChild(item);
        });
        
        container.style.display = 'block';
    }

    /**
     * Hide search suggestions
     */
    hideSuggestions() {
        const container = document.getElementById('search-suggestions');
        if (container) {
            container.style.display = 'none';
        }
    }

    /**
     * Toggle temperature unit
     */
    toggleTemperatureUnit() {
        this.currentUnit = this.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        
        // Update unit display
        const unitDisplay = document.getElementById('unit-display');
        if (unitDisplay) {
            unitDisplay.textContent = this.currentUnit === 'celsius' ? '°C' : '°F';
        }

        // Refresh displays if we have data
        if (this.weatherData) {
            this.displayCurrentWeather(this.weatherData);
            this.displayHourlyForecast(this.weatherData);
            this.displayDailyForecast(this.weatherData);
            this.updateCharts(this.weatherData);
            this.updatePageTitle(this.weatherData);
        }
        
        this.saveUserPreferences();
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        
        if (this.isDarkMode) {
            this.enableDarkMode();
        } else {
            this.disableDarkMode();
        }
        
        this.saveUserPreferences();
    }

    /**
     * Enable dark mode
     */
    enableDarkMode() {
        document.documentElement.setAttribute('data-theme', 'dark');
        const darkModeBtn = document.getElementById('dark-mode-toggle');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
        this.isDarkMode = true;
    }

    /**
     * Disable dark mode
     */
    disableDarkMode() {
        document.documentElement.removeAttribute('data-theme');
        const darkModeBtn = document.getElementById('dark-mode-toggle');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
        this.isDarkMode = false;
    }

    /**
     * Refresh weather data
     */
    async refreshWeatherData() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.classList.add('spinning');
        }

        if (this.currentLocation) {
            await this.loadWeatherForCoordinates(
                this.currentLocation.latitude, 
                this.currentLocation.longitude,
                false
            );
        } else {
            await this.loadDefaultLocation();
        }

        setTimeout(() => {
            if (refreshBtn) {
                refreshBtn.classList.remove('spinning');
            }
        }, 1000);
    }

    /**
     * Update last updated time
     */
    updateLastUpdated() {
        const lastUpdatedElement = document.getElementById('last-updated-time');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = this.formatDateTime(new Date());
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        document.getElementById('weather-loading').style.display = 'block';
        document.getElementById('weather-error').style.display = 'none';
        this.hideWeatherContent();
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        document.getElementById('weather-loading').style.display = 'none';
    }

    /**
     * Show error state
     */
    showError(message) {
        document.getElementById('weather-error').style.display = 'block';
        document.getElementById('error-message').textContent = message;
        document.getElementById('weather-loading').style.display = 'none';
        this.hideWeatherContent();
    }

    /**
     * Show weather content
     */
    showWeatherContent() {
        document.getElementById('current-weather').style.display = 'block';
        document.getElementById('hourly-forecast').style.display = 'block';
        document.getElementById('daily-forecast').style.display = 'block';
        document.getElementById('weather-charts').style.display = 'block';
        document.getElementById('weather-error').style.display = 'none';
    }

    /**
     * Hide weather content
     */
    hideWeatherContent() {
        document.getElementById('current-weather').style.display = 'none';
        document.getElementById('hourly-forecast').style.display = 'none';
        document.getElementById('daily-forecast').style.display = 'none';
        document.getElementById('weather-charts').style.display = 'none';
    }

    // Utility Methods

    /**
     * Convert Celsius to Fahrenheit
     */
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    /**
     * Format date and time
     */
    formatDateTime(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Format time
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    /**
     * Format day name
     */
    formatDayName(date, index) {
        if (index === 0) return 'Today';
        if (index === 1) return 'Tomorrow';
        
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    /**
     * Format daylight duration
     */
    formatDaylight(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Cleanup on page unload
     */
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Initialize the weather dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const weatherDashboard = new WeatherDashboard();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        weatherDashboard.destroy();
    });
    
    // Add public refresh method
    weatherDashboard.refreshWeatherData = async function() {
        if (this.currentLocation) {
            await this.loadWeatherForCoordinates(this.currentLocation.lat, this.currentLocation.lon, this.currentLocation.name);
        }
    };
    
    // Make it globally accessible for debugging
    window.weatherDashboard = weatherDashboard;
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully');
            })
            .catch(registrationError => {
                console.log('Service Worker registration failed:', registrationError);
            });
    });
}
