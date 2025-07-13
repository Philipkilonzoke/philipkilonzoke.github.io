/**
 * Enhanced Weather App with glassmorphism design and comprehensive features
 * Integrates with OpenWeather API for real-time weather data
 */

class EnhancedWeatherApp {
    constructor() {
        // OpenWeather API configuration
        this.apiKey = '1106a7ac15d31e2c5f376b1c155e8c6d';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.geocodingUrl = 'https://api.openweathermap.org/geo/1.0';
        
        // App state
        this.currentUnit = 'celsius'; // celsius or fahrenheit
        this.currentLocation = null;
        this.weatherData = null;
        this.forecastData = null;
        this.charts = {};
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the weather application
     */
    async init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        await this.loadDefaultLocation();
        this.createCharts();
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
            searchBtn.addEventListener('click', () => this.searchWeather());
        }
        
        if (cityInput) {
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchWeather();
                }
            });
            
            // Add search suggestions functionality
            cityInput.addEventListener('input', this.debounce((e) => {
                const query = e.target.value.trim();
                if (query.length >= 1) {
                    this.showSearchSuggestions(query);
                } else {
                    this.hideSuggestions();
                }
            }, 300));
        }
        
        if (locationBtn) {
            locationBtn.addEventListener('click', () => this.getCurrentLocation());
        }

        // Unit toggle
        const unitToggle = document.getElementById('unit-toggle');
        if (unitToggle) {
            unitToggle.addEventListener('click', () => this.toggleTemperatureUnit());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshWeatherData());
        }

        // Popular cities
        const cityButtons = document.querySelectorAll('.city-btn');
        cityButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const city = btn.dataset.city;
                this.loadWeatherForLocation(city);
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
    }

    /**
     * Set up mobile menu functionality
     */
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const sidebarClose = document.querySelector('.sidebar-close');

        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.add('open');
            });
        }

        if (sidebarClose && sidebar) {
            sidebarClose.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar?.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                !mobileToggle?.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    /**
     * Load weather for default location (Nairobi)
     */
    async loadDefaultLocation() {
        await this.loadWeatherForLocation('Nairobi,KE');
    }

    /**
     * Search for weather based on user input
     */
    async searchWeather() {
        const cityInput = document.getElementById('city-input');
        const query = cityInput?.value.trim();
        
        if (query) {
            await this.loadWeatherForLocation(query);
            cityInput.value = '';
            // No suggestions to hide - direct search only
        }
    }

    /**
     * Get user's current location using geolocation API
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
     * Load weather data for a specific location
     */
    async loadWeatherForLocation(location) {
        this.showLoading();
        
        try {
            // First, get coordinates for the location
            const geocodingResponse = await fetch(
                `${this.geocodingUrl}/direct?q=${encodeURIComponent(location)}&limit=1&appid=${this.apiKey}`
            );
            
            if (!geocodingResponse.ok) {
                throw new Error(`Geocoding API error: ${geocodingResponse.status}`);
            }
            
            const locations = await geocodingResponse.json();
            
            if (locations.length === 0) {
                throw new Error('Location not found. Please check the spelling and try again.');
            }
            
            const { lat, lon, name, country, state } = locations[0];
            this.currentLocation = { lat, lon, name, country, state };
            
            await this.loadWeatherForCoordinates(lat, lon);
            
        } catch (error) {
            console.error('Location search error:', error);
            this.showError(error.message || 'Unable to find the specified location.');
        }
    }

    /**
     * Load weather data for specific coordinates
     */
    async loadWeatherForCoordinates(lat, lon) {
        try {
            // Get current weather and forecast data
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`),
                fetch(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)
            ]);

            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error('Weather API error');
            }

            const [currentData, forecastData] = await Promise.all([
                currentResponse.json(),
                forecastResponse.json()
            ]);

            this.weatherData = currentData;
            this.forecastData = forecastData;

            // Update UI
            this.displayCurrentWeather(currentData);
            this.displayHourlyForecast(forecastData);
            this.displayDailyForecast(forecastData);
            this.updateCharts(forecastData);
            this.updateBackground(currentData);
            this.checkWeatherAlerts(currentData);

            this.hideLoading();
            this.showWeatherContent();

        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError('Unable to fetch weather data. Please try again later.');
        }
    }

    /**
     * Display current weather information
     */
    displayCurrentWeather(data) {
        const location = this.currentLocation || { name: data.name, country: data.sys.country };
        
        // Update location and date
        document.getElementById('current-city').textContent = `${location.name}, ${location.country}`;
        document.getElementById('current-datetime').textContent = this.formatDateTime(new Date());

        // Update temperature
        const temp = this.currentUnit === 'celsius' ? data.main.temp : this.celsiusToFahrenheit(data.main.temp);
        const feelsLike = this.currentUnit === 'celsius' ? data.main.feels_like : this.celsiusToFahrenheit(data.main.feels_like);
        
        document.getElementById('current-temp').textContent = Math.round(temp);
        document.getElementById('feels-like-temp').textContent = Math.round(feelsLike);
        document.getElementById('temp-unit-symbol').textContent = this.currentUnit === 'celsius' ? 'C' : 'F';
        document.getElementById('feels-like-unit').textContent = this.currentUnit === 'celsius' ? 'C' : 'F';

        // Update description and icon
        document.getElementById('current-description').textContent = this.capitalizeWords(data.weather[0].description);
        this.updateWeatherIcon('current-weather-icon', data.weather[0].icon, data.weather[0].id);

        // Update weather details
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        document.getElementById('cloud-cover').textContent = `${data.clouds.all}%`;

        // UV Index (not available in current weather, set placeholder)
        document.getElementById('uv-index').textContent = 'N/A';

        // Update sunrise and sunset
        document.getElementById('sunrise-time').textContent = this.formatTime(new Date(data.sys.sunrise * 1000));
        document.getElementById('sunset-time').textContent = this.formatTime(new Date(data.sys.sunset * 1000));
    }

    /**
     * Display hourly forecast
     */
    displayHourlyForecast(data) {
        const container = document.getElementById('hourly-container');
        if (!container) return;

        container.innerHTML = '';

        // Show next 24 hours (8 items * 3 hours = 24 hours)
        const hourlyData = data.list.slice(0, 8);

        hourlyData.forEach(item => {
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';

            const temp = this.currentUnit === 'celsius' ? item.main.temp : this.celsiusToFahrenheit(item.main.temp);
            const time = new Date(item.dt * 1000);

            hourlyItem.innerHTML = `
                <div class="hourly-time">${this.formatTime(time)}</div>
                <div class="hourly-icon">
                    <i class="${this.getWeatherIconClass(item.weather[0].icon, item.weather[0].id)}"></i>
                </div>
                <div class="hourly-temp">${Math.round(temp)}°</div>
                <div class="hourly-desc">${this.capitalizeWords(item.weather[0].description)}</div>
            `;

            // Add click event for detailed info
            hourlyItem.addEventListener('click', () => {
                this.showHourlyDetails(item);
            });

            container.appendChild(hourlyItem);
        });
    }

    /**
     * Display daily forecast
     */
    displayDailyForecast(data) {
        const container = document.getElementById('daily-container');
        if (!container) return;

        container.innerHTML = '';

        // Group forecast data by day
        const dailyData = this.groupForecastByDay(data.list);

        dailyData.forEach((day, index) => {
            const dailyItem = document.createElement('div');
            dailyItem.className = 'daily-item';

            const tempMax = this.currentUnit === 'celsius' ? day.tempMax : this.celsiusToFahrenheit(day.tempMax);
            const tempMin = this.currentUnit === 'celsius' ? day.tempMin : this.celsiusToFahrenheit(day.tempMin);
            const unit = this.currentUnit === 'celsius' ? 'C' : 'F';

            dailyItem.innerHTML = `
                <div class="daily-main">
                    <div class="daily-date">${this.formatDayName(day.date, index)}</div>
                    <div class="daily-weather">
                        <i class="daily-icon ${this.getWeatherIconClass(day.icon, day.weatherId)}"></i>
                        <span class="daily-desc">${this.capitalizeWords(day.description)}</span>
                    </div>
                    <div class="daily-temps">
                        <span class="daily-high">${Math.round(tempMax)}°${unit}</span>
                        <span class="daily-low">${Math.round(tempMin)}°${unit}</span>
                    </div>
                </div>
                <div class="daily-details">
                    <div class="daily-detail">
                        <i class="fas fa-tint"></i>
                        <span>Humidity: ${day.humidity}%</span>
                    </div>
                    <div class="daily-detail">
                        <i class="fas fa-wind"></i>
                        <span>Wind: ${Math.round(day.windSpeed * 3.6)} km/h</span>
                    </div>
                    <div class="daily-detail">
                        <i class="fas fa-cloud-rain"></i>
                        <span>Rain: ${day.rainChance}%</span>
                    </div>
                    <div class="daily-detail">
                        <i class="fas fa-compress-arrows-alt"></i>
                        <span>Pressure: ${day.pressure} hPa</span>
                    </div>
                </div>
            `;

            container.appendChild(dailyItem);
        });
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

        this.charts.temperature = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature',
                    data: [],
                    borderColor: '#74b9ff',
                    backgroundColor: 'rgba(116, 185, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#74b9ff',
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

        this.charts.conditions = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Humidity', 'Cloud Cover', 'Visibility'],
                datasets: [{
                    data: [65, 30, 90],
                    backgroundColor: [
                        '#74b9ff',
                        '#fd79a8',
                        '#fdcb6e'
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
    updateCharts(forecastData) {
        if (!forecastData) return;

        // Update temperature chart
        if (this.charts.temperature) {
            const next24Hours = forecastData.list.slice(0, 8);
            const labels = next24Hours.map(item => this.formatTime(new Date(item.dt * 1000)));
            const temps = next24Hours.map(item => 
                this.currentUnit === 'celsius' ? item.main.temp : this.celsiusToFahrenheit(item.main.temp)
            );

            this.charts.temperature.data.labels = labels;
            this.charts.temperature.data.datasets[0].data = temps;
            this.charts.temperature.data.datasets[0].label = `Temperature (°${this.currentUnit === 'celsius' ? 'C' : 'F'})`;
            this.charts.temperature.update();
        }

        // Update conditions chart with current weather
        if (this.charts.conditions && this.weatherData) {
            const humidity = this.weatherData.main.humidity;
            const cloudCover = this.weatherData.clouds.all;
            const visibility = Math.min((this.weatherData.visibility / 10000) * 100, 100); // Convert to percentage

            this.charts.conditions.data.datasets[0].data = [humidity, cloudCover, visibility];
            this.charts.conditions.update();
        }
    }

    /**
     * Update background based on weather conditions
     */
    updateBackground(weatherData) {
        const background = document.getElementById('weather-background');
        if (!background) return;

        const weatherId = weatherData.weather[0].id;
        const isDay = weatherData.weather[0].icon.includes('d');

        // Remove existing weather classes
        background.className = 'weather-background';

        // Add appropriate class based on weather conditions
        if (weatherId >= 200 && weatherId < 300) {
            background.classList.add('stormy');
        } else if (weatherId >= 300 && weatherId < 600) {
            background.classList.add('rainy');
        } else if (weatherId >= 600 && weatherId < 700) {
            background.classList.add('snowy');
        } else if (weatherId >= 700 && weatherId < 800) {
            background.classList.add('cloudy');
        } else if (weatherId === 800) {
            background.classList.add(isDay ? 'sunny' : 'night');
        } else {
            background.classList.add('cloudy');
        }

        // Add weather particles if needed
        this.addWeatherParticles(weatherId);
    }

    /**
     * Add animated weather particles
     */
    addWeatherParticles(weatherId) {
        const particlesContainer = document.querySelector('.background-particles');
        if (!particlesContainer) return;

        particlesContainer.innerHTML = '';

        // Add rain particles
        if (weatherId >= 300 && weatherId < 600) {
            for (let i = 0; i < 50; i++) {
                const drop = document.createElement('div');
                drop.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 20px;
                    background: linear-gradient(rgba(255,255,255,0.6), transparent);
                    left: ${Math.random() * 100}%;
                    animation: rain 1s linear infinite;
                    animation-delay: ${Math.random() * 1}s;
                `;
                particlesContainer.appendChild(drop);
            }

            // Add rain animation if not exists
            if (!document.getElementById('rain-animation')) {
                const style = document.createElement('style');
                style.id = 'rain-animation';
                style.textContent = `
                    @keyframes rain {
                        0% { transform: translateY(-100px); opacity: 1; }
                        100% { transform: translateY(100vh); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Add snow particles
        if (weatherId >= 600 && weatherId < 700) {
            for (let i = 0; i < 30; i++) {
                const flake = document.createElement('div');
                flake.style.cssText = `
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    animation: snow 3s linear infinite;
                    animation-delay: ${Math.random() * 3}s;
                `;
                particlesContainer.appendChild(flake);
            }

            // Add snow animation if not exists
            if (!document.getElementById('snow-animation')) {
                const style = document.createElement('style');
                style.id = 'snow-animation';
                style.textContent = `
                    @keyframes snow {
                        0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
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

        let hasAlert = false;
        let alertText = '';
        let alertDesc = '';

        // Check for extreme weather conditions
        const temp = weatherData.main.temp;
        const weatherId = weatherData.weather[0].id;
        const windSpeed = weatherData.wind.speed;

        if (temp > 35) {
            hasAlert = true;
            alertText = 'Extreme Heat Warning';
            alertDesc = `Temperature is extremely high at ${Math.round(temp)}°C. Stay hydrated and avoid prolonged sun exposure.`;
        } else if (temp < -10) {
            hasAlert = true;
            alertText = 'Extreme Cold Warning';
            alertDesc = `Temperature is extremely low at ${Math.round(temp)}°C. Dress warmly and limit outdoor activities.`;
        } else if (windSpeed > 15) {
            hasAlert = true;
            alertText = 'High Wind Advisory';
            alertDesc = `Strong winds detected at ${Math.round(windSpeed * 3.6)} km/h. Secure loose objects and exercise caution outdoors.`;
        } else if (weatherId >= 200 && weatherId < 300) {
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
     * Show search suggestions
     */
    async showSearchSuggestions(query) {
        if (query.length < 1) {
            this.hideSuggestions();
            return;
        }

        try {
            const response = await fetch(
                `${this.geocodingUrl}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
            );
            
            if (!response.ok) return;
            
            const suggestions = await response.json();
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
            
            const locationText = suggestion.state 
                ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
                : `${suggestion.name}, ${suggestion.country}`;
                
            item.textContent = locationText;
            
            item.addEventListener('click', () => {
                this.loadWeatherForCoordinates(suggestion.lat, suggestion.lon);
                this.currentLocation = suggestion;
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
     * Toggle temperature unit between Celsius and Fahrenheit
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
        }
        
        if (this.forecastData) {
            this.displayHourlyForecast(this.forecastData);
            this.displayDailyForecast(this.forecastData);
            this.updateCharts(this.forecastData);
        }
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
            await this.loadWeatherForCoordinates(this.currentLocation.lat, this.currentLocation.lon);
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

    /**
     * Show detailed hourly information
     */
    showHourlyDetails(hourlyData) {
        // Create a modal or tooltip with detailed hourly information
        // This is a placeholder for future enhancement
        console.log('Hourly details:', hourlyData);
    }

    // Utility Methods

    /**
     * Convert Celsius to Fahrenheit
     */
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    /**
     * Get weather icon class based on OpenWeather icon and condition ID
     */
    getWeatherIconClass(icon, weatherId) {
        const isDay = icon.includes('d');
        
        if (weatherId >= 200 && weatherId < 300) {
            return 'fas fa-bolt'; // Thunderstorm
        } else if (weatherId >= 300 && weatherId < 400) {
            return 'fas fa-cloud-drizzle'; // Drizzle
        } else if (weatherId >= 500 && weatherId < 600) {
            return 'fas fa-cloud-rain'; // Rain
        } else if (weatherId >= 600 && weatherId < 700) {
            return 'fas fa-snowflake'; // Snow
        } else if (weatherId >= 700 && weatherId < 800) {
            return 'fas fa-smog'; // Fog/Mist
        } else if (weatherId === 800) {
            return isDay ? 'fas fa-sun' : 'fas fa-moon'; // Clear
        } else {
            return 'fas fa-cloud'; // Clouds
        }
    }

    /**
     * Update weather icon
     */
    updateWeatherIcon(elementId, icon, weatherId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.className = `weather-icon ${this.getWeatherIconClass(icon, weatherId)}`;
        }
    }

    /**
     * Group forecast data by day
     */
    groupForecastByDay(forecastList) {
        const dailyData = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            
            if (!dailyData[dayKey]) {
                dailyData[dayKey] = {
                    date: date,
                    tempMax: item.main.temp_max,
                    tempMin: item.main.temp_min,
                    humidity: item.main.humidity,
                    pressure: item.main.pressure,
                    windSpeed: item.wind.speed,
                    weatherId: item.weather[0].id,
                    icon: item.weather[0].icon,
                    description: item.weather[0].description,
                    rainChance: Math.round((item.pop || 0) * 100)
                };
            } else {
                dailyData[dayKey].tempMax = Math.max(dailyData[dayKey].tempMax, item.main.temp_max);
                dailyData[dayKey].tempMin = Math.min(dailyData[dayKey].tempMin, item.main.temp_min);
                dailyData[dayKey].rainChance = Math.max(dailyData[dayKey].rainChance, Math.round((item.pop || 0) * 100));
            }
        });
        
        return Object.values(dailyData).slice(0, 7); // Return next 7 days
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
     * Capitalize words
     */
    capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * Debounce function for search input
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
}

// Initialize the weather app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedWeatherApp();
});

// Service Worker registration for offline capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
