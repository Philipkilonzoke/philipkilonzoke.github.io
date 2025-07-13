# Brightlens News - Architecture Documentation

## Overview

Brightlens News is a comprehensive multi-page web application that serves as a modern news aggregation platform. The application provides users with the latest news articles from multiple sources, weather information, and live TV streaming capabilities. Built with vanilla JavaScript and modern web technologies, it features a responsive design, dynamic theming system, and professional user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**July 13, 2025**
- **Sample Article Removal**: Successfully removed all sample/mock articles from all 9 news categories
- **Real-time Only Policy**: All categories now display only authentic real-time news content
- **Enhanced Error Handling**: When APIs fail, users see appropriate error messages instead of sample content
- **Preserved API Functionality**: All real-time news sources remain fully functional

**July 12, 2025**
- **MAJOR ENHANCEMENT**: Significantly expanded sports news coverage with multiple real-time sports sources
  - Integrated ESPN API endpoints for NFL, NBA, MLB, NHL, college football, college basketball, and soccer
  - Added TheSportsDB API integration for comprehensive sports data
  - Created Sports News API with dynamic content generation covering all major sports
  - Implemented RapidSports API for real-time sports updates and breaking news
  - Enhanced sports article generation with 50+ unique sports articles covering football, basketball, baseball, hockey, tennis, golf, and Olympics
  - Added specialized sports title and description generators for authentic sports content
  - Integrated sports-specific image handling with sport-categorized images
  - Created comprehensive sports caching system for improved performance
- **ENHANCED ARTICLE DESCRIPTIONS**: Significantly improved article descriptions across all categories for better user understanding
  - Extended descriptions from 1-2 sentences to comprehensive 3-5 sentence explanations
  - Enhanced news-api.js with detailed, informative descriptions for fallback articles
  - Improved Extended Articles Database with comprehensive descriptions for all categories
  - Enhanced sports description generators with detailed, engaging content
  - All categories now provide substantial context and background information for better user comprehension
- Created 8 independent category HTML pages (latest.html, kenya.html, world.html, entertainment.html, technology.html, business.html, sports.html, health.html)
- Implemented category-specific news loading for faster performance
- Added comprehensive social sharing functionality (Facebook, Twitter, WhatsApp, copy link)
- Created shared JavaScript functionality (js/category-news.js) for consistent behavior across category pages
- Updated navigation to use direct links to category pages instead of SPA approach
- Enhanced SEO with category-specific meta tags and descriptions
- Maintained footer design and theme functionality across all pages
- Optimized loading screens and error handling for individual category pages

**July 10, 2025**
- Fixed critical JavaScript error in news loading functionality
- Corrected `getExtendedArticles()` method call to use `generateAdditionalArticles()`
- Improved image handling with proper fallback system
- Added service worker (sw.js) for offline functionality and caching
- Reorganized all website files properly in root directory for GitHub deployment
- Enhanced error handling for API calls and CORS issues
- Cleaned up directory structure and removed duplicate files
- Created comprehensive README.md for GitHub deployment
- Verified all files are correctly arranged in root directory

## System Architecture

### Frontend Architecture
- **Client-Side Framework**: Vanilla JavaScript with ES6+ class-based architecture
- **UI Pattern**: Independent category pages with shared functionality and unified styling
- **Page Structure**: 8 separate category HTML pages for faster loading and better SEO
- **Responsive Design**: Mobile-first approach with adaptive layouts and collapsible navigation
- **State Management**: Class-based state management with browser localStorage for persistence
- **Theme System**: Dynamic theme switching with 12+ color schemes and localStorage persistence
- **Social Sharing**: Integrated Facebook, Twitter, WhatsApp, and copy link functionality
- **Progressive Web App**: Includes manifest.json for PWA capabilities

### File Structure
```
/
├── index.html              # Landing page (redirects to latest.html)
├── latest.html            # Latest news category page
├── kenya.html             # Kenya news category page
├── world.html             # World news category page
├── entertainment.html     # Entertainment news category page
├── technology.html        # Technology news category page
├── business.html          # Business news category page
├── sports.html            # Sports news category page
├── health.html            # Health news category page
├── weather.html           # Weather information page with city search
├── live-tv.html          # Professional Kenyan Live TV streaming page
├── manifest.json         # PWA manifest configuration
├── css/
│   ├── styles.css        # Main stylesheet with CSS custom properties
│   ├── themes.css        # Theme definitions and color schemes
│   ├── live-tv.css       # Live TV specific styling
│   └── weather.css       # Weather page specific styling
├── js/
│   ├── main.js           # Main news application logic (legacy)
│   ├── news-api.js       # News API integration and data handling
│   ├── category-news.js  # Shared category page functionality
│   ├── themes.js         # Theme management system
│   ├── weather.js        # Weather application with OpenWeather API
│   ├── live-tv.js        # Live TV streaming functionality
│   └── extended-articles.js # Fallback news data
├── assets/
│   └── default.svg       # Default image placeholder
├── package.json          # Node.js dependencies
└── server.py            # Python HTTP server for development
```

## Key Components

### News Application (main.js, news-api.js)
- **Multi-API Integration**: Fetches news from multiple APIs (GNews, NewsData, NewsAPI, MediaStack, CurrentsAPI)
- **Category System**: Latest, Kenya, World, Entertainment, Technology, Business, Sports, Health
- **Automatic Sorting**: Articles sorted by publication date (newest first)
- **Caching System**: Client-side caching with configurable timeout
- **Error Handling**: Robust error handling with fallback content
- **Loading States**: Professional loading screens and progress indicators

### Enhanced Kenya News System (kenya-news.js) - July 13, 2025
- **80+ Real-time Sources**: Expanded from 35+ to 80+ news sources for comprehensive Kenya coverage
- **RSS Sources (60+)**: Major media houses, digital outlets, regional sources, and specialized feeds
- **API Integration (13)**: Multiple news APIs including NewsAPI, NewsData, GNews, Bing News, MediaStack, Newscatcher
- **Specialized Categories**: Educational (6), Sports (4), Health (3), Government (4), Regional (15)
- **Advanced Deduplication**: Text similarity algorithms to prevent duplicate articles
- **Source Health Monitoring**: Automated health checking for all news sources
- **Sample Article Removal**: Removed all sample/mock articles from all 9 news categories to display only real-time content
- **Performance Optimizations**: Enhanced API response handling and timeout management

### Weather Application (weather.js)
- **OpenWeather API Integration**: Real-time weather data with API key authentication
- **City Search**: Geographic location search with coordinates
- **Temperature Units**: Celsius/Fahrenheit conversion
- **Weather Visualization**: Charts and graphs for weather data
- **Responsive Design**: Mobile-optimized weather interface

### Live TV Streaming (live-tv.js)
- **Kenyan TV Channels**: Professional streaming service with verified YouTube/Twitch sources
- **Video Player**: Supports YouTube embeds, Twitch streams, and HLS playback
- **Channel Categories**: News, Entertainment, Religious, Regional
- **Viewer Statistics**: Live viewer counts and channel status
- **Fullscreen Support**: Keyboard shortcuts (ESC, F, M) and fullscreen API

### Theme Management (themes.js)
- **12 Color Schemes**: Default, Dark, Ocean Blue, Forest Green, Royal Purple, Sunset Orange, Rose Pink, Emerald, Indigo, Amber, Teal, Crimson
- **CSS Custom Properties**: Dynamic theme switching using CSS variables
- **localStorage Persistence**: Theme preferences saved across sessions
- **Cross-Page Consistency**: Unified theming across all pages

## Data Flow

### News Data Flow
1. **API Requests**: Parallel requests to multiple news APIs
2. **Data Aggregation**: Combine and deduplicate articles from different sources
3. **Sorting & Filtering**: Sort by date, filter by category
4. **Caching**: Store results in memory cache with timestamp
5. **UI Rendering**: Display articles in responsive grid layout

### Weather Data Flow
1. **Location Input**: User enters city name or uses geolocation
2. **Geocoding**: Convert city name to coordinates using OpenWeather API
3. **Weather Request**: Fetch current weather and forecast data
4. **Data Processing**: Parse weather data and convert units
5. **UI Update**: Display weather information with charts and animations

### Live TV Data Flow
1. **Channel Loading**: Load predefined channel list with streaming URLs
2. **Stream Validation**: Check channel availability and viewer counts
3. **Video Player**: Initialize appropriate player (YouTube/Twitch/HLS)
4. **Statistics Update**: Periodic updates of viewer counts and status

## External Dependencies

### API Services
- **News APIs**: GNews, NewsData, NewsAPI, MediaStack, CurrentsAPI
- **Weather API**: OpenWeather API (current weather and forecasts)
- **Streaming Sources**: YouTube live streams, Twitch channels

### Frontend Libraries
- **Font Awesome**: Icons and UI elements
- **Google Fonts**: Inter font family for typography
- **HLS.js**: HTTP Live Streaming support for video playback

### Development Dependencies
- **Node.js Packages**: React, Vite, TypeScript, Tailwind CSS, Axios, Express, CORS
- **Build Tools**: Autoprefixer, PostCSS, Vite bundler
- **Type Definitions**: TypeScript definitions for React and React DOM

## Deployment Strategy

### Static Hosting
- **GitHub Pages**: Primary deployment target (philipkilonzoke.github.io)
- **Progressive Web App**: Service worker capabilities through manifest.json
- **CDN Assets**: External CSS/JS libraries loaded from CDN

### Development Environment
- **Python Server**: Simple HTTP server for local development
- **CORS Handling**: Custom request handler for API calls
- **Hot Reload**: Vite development server for modern workflow

### Performance Optimizations
- **Critical CSS**: Inline critical styles in HTML head
- **Resource Preloading**: Preload fonts and essential CSS
- **Lazy Loading**: Deferred loading of non-critical resources
- **Image Optimization**: Placeholder images and responsive sizing
- **Caching Strategy**: Browser caching with appropriate cache headers

### Security Considerations
- **API Key Management**: Environment variables for sensitive keys
- **CORS Policy**: Proper cross-origin resource sharing configuration
- **Content Security**: External resource validation and sanitization
- **XSS Prevention**: Proper HTML escaping and content validation

The application is designed to be highly maintainable with clear separation of concerns, robust error handling, and scalable architecture that can easily accommodate new features and API integrations.