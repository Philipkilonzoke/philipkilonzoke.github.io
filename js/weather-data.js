// Weather Data with Geographic Hierarchy for Level-of-Detail Loading
// Organized by zoom levels for Google Earth-like experience

const WeatherData = {
    // API Configuration
    API_KEY: '1106a7ac15d31e2c5f376b1c155e8c6d',
    BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',

    // Zoom level thresholds
    ZOOM_LEVELS: {
        WORLD: 2.5,      // World view - show major continents/regions
        CONTINENT: 2.0,   // Continent view - show countries
        COUNTRY: 1.5,     // Country view - show major cities
        REGION: 1.0,      // Regional view - show all cities
        LOCAL: 0.7        // Local view - show towns and districts
    },

    // Geographic data organized by zoom levels for progressive loading
    locations: {
        // Level 1: World View (2.5+ altitude) - Major Global Cities
        world: [
            // North America
            { name: "New York", lat: 40.7128, lng: -74.0060, country: "US", population: 8400000, type: "megacity", region: "North America" },
            { name: "Los Angeles", lat: 34.0522, lng: -118.2437, country: "US", population: 4000000, type: "major", region: "North America" },
            { name: "Chicago", lat: 41.8781, lng: -87.6298, country: "US", population: 2700000, type: "major", region: "North America" },
            { name: "Toronto", lat: 43.6532, lng: -79.3832, country: "CA", population: 2900000, type: "major", region: "North America" },
            { name: "Mexico City", lat: 19.4326, lng: -99.1332, country: "MX", population: 9200000, type: "megacity", region: "North America" },

            // South America
            { name: "São Paulo", lat: -23.5505, lng: -46.6333, country: "BR", population: 12300000, type: "megacity", region: "South America" },
            { name: "Buenos Aires", lat: -34.6118, lng: -58.3960, country: "AR", population: 3100000, type: "major", region: "South America" },
            { name: "Lima", lat: -12.0464, lng: -77.0428, country: "PE", population: 10700000, type: "megacity", region: "South America" },

            // Europe
            { name: "London", lat: 51.5074, lng: -0.1278, country: "GB", population: 9000000, type: "megacity", region: "Europe" },
            { name: "Paris", lat: 48.8566, lng: 2.3522, country: "FR", population: 2200000, type: "major", region: "Europe" },
            { name: "Berlin", lat: 52.5200, lng: 13.4050, country: "DE", population: 3700000, type: "major", region: "Europe" },
            { name: "Madrid", lat: 40.4168, lng: -3.7038, country: "ES", population: 3200000, type: "major", region: "Europe" },
            { name: "Rome", lat: 41.9028, lng: 12.4964, country: "IT", population: 2800000, type: "major", region: "Europe" },
            { name: "Moscow", lat: 55.7558, lng: 37.6176, country: "RU", population: 12500000, type: "megacity", region: "Europe" },

            // Asia
            { name: "Tokyo", lat: 35.6762, lng: 139.6503, country: "JP", population: 37400000, type: "megacity", region: "Asia" },
            { name: "Beijing", lat: 39.9042, lng: 116.4074, country: "CN", population: 21700000, type: "megacity", region: "Asia" },
            { name: "Shanghai", lat: 31.2304, lng: 121.4737, country: "CN", population: 26300000, type: "megacity", region: "Asia" },
            { name: "Mumbai", lat: 19.0760, lng: 72.8777, country: "IN", population: 20700000, type: "megacity", region: "Asia" },
            { name: "Delhi", lat: 28.7041, lng: 77.1025, country: "IN", population: 32900000, type: "megacity", region: "Asia" },
            { name: "Seoul", lat: 37.5665, lng: 126.9780, country: "KR", population: 9700000, type: "megacity", region: "Asia" },
            { name: "Jakarta", lat: -6.2088, lng: 106.8456, country: "ID", population: 10600000, type: "megacity", region: "Asia" },
            { name: "Bangkok", lat: 13.7563, lng: 100.5018, country: "TH", population: 10600000, type: "megacity", region: "Asia" },
            { name: "Singapore", lat: 1.3521, lng: 103.8198, country: "SG", population: 5900000, type: "major", region: "Asia" },

            // Middle East
            { name: "Dubai", lat: 25.2048, lng: 55.2708, country: "AE", population: 3500000, type: "major", region: "Middle East" },
            { name: "Istanbul", lat: 41.0082, lng: 28.9784, country: "TR", population: 15500000, type: "megacity", region: "Middle East" },
            { name: "Tehran", lat: 35.6892, lng: 51.3890, country: "IR", population: 9000000, type: "megacity", region: "Middle East" },

            // Africa
            { name: "Cairo", lat: 30.0444, lng: 31.2357, country: "EG", population: 20900000, type: "megacity", region: "Africa" },
            { name: "Lagos", lat: 6.5244, lng: 3.3792, country: "NG", population: 15400000, type: "megacity", region: "Africa" },
            { name: "Nairobi", lat: -1.2921, lng: 36.8219, country: "KE", population: 4400000, type: "major", region: "Africa" },
            { name: "Cape Town", lat: -33.9249, lng: 18.4241, country: "ZA", population: 4620000, type: "major", region: "Africa" },
            { name: "Johannesburg", lat: -26.2041, lng: 28.0473, country: "ZA", population: 5600000, type: "major", region: "Africa" },

            // Oceania
            { name: "Sydney", lat: -33.8688, lng: 151.2093, country: "AU", population: 5300000, type: "major", region: "Oceania" },
            { name: "Melbourne", lat: -37.8136, lng: 144.9631, country: "AU", population: 5100000, type: "major", region: "Oceania" }
        ],

        // Level 2: Continental View (2.0-2.5 altitude) - Additional Major Cities
        continental: [
            // Europe
            { name: "Amsterdam", lat: 52.3676, lng: 4.9041, country: "NL", population: 870000, type: "city", region: "Europe" },
            { name: "Barcelona", lat: 41.3851, lng: 2.1734, country: "ES", population: 1600000, type: "city", region: "Europe" },
            { name: "Vienna", lat: 48.2082, lng: 16.3738, country: "AT", population: 1900000, type: "city", region: "Europe" },
            { name: "Stockholm", lat: 59.3293, lng: 18.0686, country: "SE", population: 980000, type: "city", region: "Europe" },
            { name: "Oslo", lat: 59.9139, lng: 10.7522, country: "NO", population: 700000, type: "city", region: "Europe" },
            { name: "Copenhagen", lat: 55.6761, lng: 12.5683, country: "DK", population: 660000, type: "city", region: "Europe" },
            { name: "Warsaw", lat: 52.2297, lng: 21.0122, country: "PL", population: 1790000, type: "city", region: "Europe" },
            { name: "Prague", lat: 50.0755, lng: 14.4378, country: "CZ", population: 1300000, type: "city", region: "Europe" },
            { name: "Brussels", lat: 50.8503, lng: 4.3517, country: "BE", population: 1200000, type: "city", region: "Europe" },
            { name: "Dublin", lat: 53.3498, lng: -6.2603, country: "IE", population: 555000, type: "city", region: "Europe" },

            // Asia
            { name: "Hong Kong", lat: 22.3193, lng: 114.1694, country: "HK", population: 7500000, type: "major", region: "Asia" },
            { name: "Taipei", lat: 25.0330, lng: 121.5654, country: "TW", population: 2700000, type: "major", region: "Asia" },
            { name: "Kuala Lumpur", lat: 3.1390, lng: 101.6869, country: "MY", population: 1800000, type: "city", region: "Asia" },
            { name: "Manila", lat: 14.5995, lng: 120.9842, country: "PH", population: 13500000, type: "megacity", region: "Asia" },
            { name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297, country: "VN", population: 9000000, type: "megacity", region: "Asia" },
            { name: "Bangalore", lat: 12.9716, lng: 77.5946, country: "IN", population: 13200000, type: "megacity", region: "Asia" },
            { name: "Chennai", lat: 13.0827, lng: 80.2707, country: "IN", population: 11700000, type: "megacity", region: "Asia" },
            { name: "Kolkata", lat: 22.5726, lng: 88.3639, country: "IN", population: 14800000, type: "megacity", region: "Asia" },

            // North America
            { name: "San Francisco", lat: 37.7749, lng: -122.4194, country: "US", population: 880000, type: "city", region: "North America" },
            { name: "Miami", lat: 25.7617, lng: -80.1918, country: "US", population: 470000, type: "city", region: "North America" },
            { name: "Seattle", lat: 47.6062, lng: -122.3321, country: "US", population: 750000, type: "city", region: "North America" },
            { name: "Vancouver", lat: 49.2827, lng: -123.1207, country: "CA", population: 680000, type: "city", region: "North America" },
            { name: "Montreal", lat: 45.5017, lng: -73.5673, country: "CA", population: 1800000, type: "city", region: "North America" },

            // Africa
            { name: "Casablanca", lat: 33.5731, lng: -7.5898, country: "MA", population: 3360000, type: "major", region: "Africa" },
            { name: "Addis Ababa", lat: 9.1450, lng: 38.7451, country: "ET", population: 5000000, type: "major", region: "Africa" },
            { name: "Dar es Salaam", lat: -6.7924, lng: 39.2083, country: "TZ", population: 6700000, type: "major", region: "Africa" },
            { name: "Algiers", lat: 36.7525, lng: 3.0420, country: "DZ", population: 2400000, type: "major", region: "Africa" },

            // Oceania
            { name: "Brisbane", lat: -27.4698, lng: 153.0251, country: "AU", population: 2560000, type: "major", region: "Oceania" },
            { name: "Perth", lat: -31.9505, lng: 115.8605, country: "AU", population: 2140000, type: "major", region: "Oceania" },
            { name: "Auckland", lat: -36.8485, lng: 174.7633, country: "NZ", population: 1700000, type: "city", region: "Oceania" }
        ],

        // Level 3: Country View (1.5-2.0 altitude) - Regional Centers
        country: [
            // Kenya (detailed)
            { name: "Mombasa", lat: -4.0435, lng: 39.6682, country: "KE", population: 1200000, type: "city", region: "Africa" },
            { name: "Kisumu", lat: -0.1022, lng: 34.7617, country: "KE", population: 610000, type: "town", region: "Africa" },
            { name: "Nakuru", lat: -0.3031, lng: 36.0800, country: "KE", population: 570000, type: "town", region: "Africa" },
            { name: "Eldoret", lat: 0.5143, lng: 35.2698, country: "KE", population: 290000, type: "town", region: "Africa" },
            { name: "Thika", lat: -1.0332, lng: 37.0692, country: "KE", population: 280000, type: "town", region: "Africa" },
            { name: "Meru", lat: 0.0500, lng: 37.6500, country: "KE", population: 240000, type: "town", region: "Africa" },

            // United States (regional centers)
            { name: "Houston", lat: 29.7604, lng: -95.3698, country: "US", population: 2300000, type: "major", region: "North America" },
            { name: "Phoenix", lat: 33.4484, lng: -112.0740, country: "US", population: 1700000, type: "city", region: "North America" },
            { name: "Philadelphia", lat: 39.9526, lng: -75.1652, country: "US", population: 1580000, type: "city", region: "North America" },
            { name: "San Antonio", lat: 29.4241, lng: -98.4936, country: "US", population: 1500000, type: "city", region: "North America" },
            { name: "San Diego", lat: 32.7157, lng: -117.1611, country: "US", population: 1400000, type: "city", region: "North America" },
            { name: "Dallas", lat: 32.7767, lng: -96.7970, country: "US", population: 1340000, type: "city", region: "North America" },
            { name: "Austin", lat: 30.2672, lng: -97.7431, country: "US", population: 980000, type: "city", region: "North America" },
            { name: "Denver", lat: 39.7392, lng: -104.9903, country: "US", population: 715000, type: "city", region: "North America" },

            // Europe (regional centers)
            { name: "Milan", lat: 45.4642, lng: 9.1900, country: "IT", population: 1390000, type: "city", region: "Europe" },
            { name: "Naples", lat: 40.8518, lng: 14.2681, country: "IT", population: 970000, type: "city", region: "Europe" },
            { name: "Munich", lat: 48.1351, lng: 11.5820, country: "DE", population: 1500000, type: "city", region: "Europe" },
            { name: "Hamburg", lat: 53.5511, lng: 9.9937, country: "DE", population: 1900000, type: "city", region: "Europe" },
            { name: "Lyon", lat: 45.7640, lng: 4.8357, country: "FR", population: 520000, type: "city", region: "Europe" },
            { name: "Marseille", lat: 43.2965, lng: 5.3698, country: "FR", population: 870000, type: "city", region: "Europe" },

            // Asia (regional centers)
            { name: "Osaka", lat: 34.6937, lng: 135.5023, country: "JP", population: 2700000, type: "major", region: "Asia" },
            { name: "Yokohama", lat: 35.4437, lng: 139.6380, country: "JP", population: 3750000, type: "major", region: "Asia" },
            { name: "Guangzhou", lat: 23.1291, lng: 113.2644, country: "CN", population: 15300000, type: "megacity", region: "Asia" },
            { name: "Shenzhen", lat: 22.5431, lng: 114.0579, country: "CN", population: 12600000, type: "megacity", region: "Asia" },
            { name: "Chengdu", lat: 30.5728, lng: 104.0668, country: "CN", population: 16300000, type: "megacity", region: "Asia" },
            { name: "Wuhan", lat: 30.5928, lng: 114.3055, country: "CN", population: 11300000, type: "megacity", region: "Asia" }
        ],

        // Level 4: Regional View (1.0-1.5 altitude) - Smaller Cities
        regional: [
            // More detailed locations for close zoom
            { name: "Zurich", lat: 47.3769, lng: 8.5417, country: "CH", population: 430000, type: "city", region: "Europe" },
            { name: "Geneva", lat: 46.2044, lng: 6.1432, country: "CH", population: 200000, type: "town", region: "Europe" },
            { name: "Helsinki", lat: 60.1699, lng: 24.9384, country: "FI", population: 650000, type: "city", region: "Europe" },
            { name: "Gothenburg", lat: 57.7089, lng: 11.9746, country: "SE", population: 580000, type: "city", region: "Europe" },
            { name: "Lisbon", lat: 38.7223, lng: -9.1393, country: "PT", population: 550000, type: "city", region: "Europe" },
            { name: "Porto", lat: 41.1579, lng: -8.6291, country: "PT", population: 230000, type: "town", region: "Europe" },
            { name: "Athens", lat: 37.9838, lng: 23.7275, country: "GR", population: 664000, type: "city", region: "Europe" },
            { name: "Edinburgh", lat: 55.9533, lng: -3.1883, country: "GB", population: 540000, type: "city", region: "Europe" },
            { name: "Glasgow", lat: 55.8642, lng: -4.2518, country: "GB", population: 635000, type: "city", region: "Europe" },
            { name: "Manchester", lat: 53.4808, lng: -2.2426, country: "GB", population: 550000, type: "city", region: "Europe" },

            // Middle East
            { name: "Riyadh", lat: 24.7136, lng: 46.6753, country: "SA", population: 7000000, type: "major", region: "Middle East" },
            { name: "Tel Aviv", lat: 32.0853, lng: 34.7818, country: "IL", population: 460000, type: "city", region: "Middle East" },
            { name: "Kuwait City", lat: 29.3759, lng: 47.9774, country: "KW", population: 320000, type: "city", region: "Middle East" },
            { name: "Doha", lat: 25.2854, lng: 51.5310, country: "QA", population: 640000, type: "city", region: "Middle East" },

            // Africa (more cities)
            { name: "Kampala", lat: 0.3476, lng: 32.5825, country: "UG", population: 1680000, type: "city", region: "Africa" },
            { name: "Kigali", lat: -1.9441, lng: 30.0619, country: "RW", population: 1130000, type: "city", region: "Africa" },
            { name: "Accra", lat: 5.6037, lng: -0.1870, country: "GH", population: 2400000, type: "major", region: "Africa" },
            { name: "Abuja", lat: 9.0765, lng: 7.3986, country: "NG", population: 3500000, type: "major", region: "Africa" },
            { name: "Tunis", lat: 36.8065, lng: 10.1815, country: "TN", population: 1060000, type: "city", region: "Africa" },

            // North America (more cities)
            { name: "Las Vegas", lat: 36.1699, lng: -115.1398, country: "US", population: 650000, type: "city", region: "North America" },
            { name: "Portland", lat: 45.5152, lng: -122.6784, country: "US", population: 650000, type: "city", region: "North America" },
            { name: "Sacramento", lat: 38.5816, lng: -121.4944, country: "US", population: 510000, type: "city", region: "North America" },
            { name: "Salt Lake City", lat: 40.7608, lng: -111.8910, country: "US", population: 200000, type: "town", region: "North America" }
        ]
    },

    // Get locations for current zoom level
    getLocationsForZoom(altitude) {
        const locations = [];
        
        // Always include world-level cities
        locations.push(...this.locations.world);
        
        // Add more detailed locations based on zoom level
        if (altitude <= this.ZOOM_LEVELS.CONTINENT) {
            locations.push(...this.locations.continental);
        }
        
        if (altitude <= this.ZOOM_LEVELS.COUNTRY) {
            locations.push(...this.locations.country);
        }
        
        if (altitude <= this.ZOOM_LEVELS.REGION) {
            locations.push(...this.locations.regional);
        }
        
        return locations;
    },

    // Get zoom level name for UI
    getZoomLevelName(altitude) {
        if (altitude >= this.ZOOM_LEVELS.WORLD) return "World View";
        if (altitude >= this.ZOOM_LEVELS.CONTINENT) return "Continental View";
        if (altitude >= this.ZOOM_LEVELS.COUNTRY) return "Country View";
        if (altitude >= this.ZOOM_LEVELS.REGION) return "Regional View";
        return "Local View";
    },

    // Color coding based on population and type
    getLocationColor(location) {
        if (location.type === "megacity" || location.population > 15000000) return '#ea4335'; // Red for megacities
        if (location.type === "major" || location.population > 5000000) return '#fbbc04';    // Orange for major cities
        if (location.type === "city" || location.population > 1000000) return '#4285f4';     // Blue for cities
        return '#34a853'; // Green for towns
    },

    // Size based on population and type
    getLocationSize(location) {
        if (location.type === "megacity" || location.population > 15000000) return 0.5;
        if (location.type === "major" || location.population > 5000000) return 0.4;
        if (location.type === "city" || location.population > 1000000) return 0.3;
        return 0.25;
    },

    // Search functionality
    searchLocations(query) {
        const allLocations = [
            ...this.locations.world,
            ...this.locations.continental,
            ...this.locations.country,
            ...this.locations.regional
        ];

        return allLocations.filter(location => 
            location.name.toLowerCase().includes(query.toLowerCase()) ||
            location.country.toLowerCase().includes(query.toLowerCase()) ||
            location.region.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10); // Limit results for performance
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherData;
}