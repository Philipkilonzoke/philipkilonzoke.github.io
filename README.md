# Brightlens News

A modern, responsive news aggregation website that provides real-time news from multiple sources with a focus on Kenyan and international news.

## Features

- **Multi-Source News Aggregation**: Integrates with GNews, NewsData, NewsAPI, MediaStack, and CurrentsAPI
- **Enhanced Sports Coverage**: Comprehensive sports news from ESPN, TheSportsDB, Sports News API, and RapidSports
- **Real-time Updates**: Latest news from multiple reliable sources
- **Kenyan News Focus**: Dedicated section for Kenyan news from local sources
- **Category-based Navigation**: Latest, Kenya, World, Entertainment, Technology, Business, Sports, Health
- **Weather Integration**: Real-time weather information
- **Live TV Streaming**: Access to Kenyan live TV channels
- **Theme System**: 12 color themes for personalization
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Progressive Web App**: PWA capabilities with offline functionality

## Pages

- **Home (index.html)**: Landing page with navigation
- **Latest News (latest.html)**: Latest news from all sources
- **Kenya News (kenya.html)**: Kenyan news and local updates
- **World News (world.html)**: International news coverage
- **Entertainment (entertainment.html)**: Entertainment and celebrity news
- **Technology (technology.html)**: Tech news and innovations
- **Business (business.html)**: Business and financial news
- **Sports (sports.html)**: Enhanced sports coverage with multiple sources
- **Health (health.html)**: Health and medical news
- **Weather (weather.html)**: Weather information and forecasts
- **Live TV (live-tv.html)**: Kenyan live TV streaming

## File Structure

```
/
├── index.html              # Main news page
├── weather.html           # Weather page
├── live-tv.html          # Live TV page
├── manifest.json         # PWA manifest
├── package.json          # Dependencies
├── css/
│   ├── styles.css        # Main styles
│   ├── themes.css        # Theme definitions
│   ├── weather.css       # Weather page styles
│   └── live-tv.css       # Live TV styles
├── js/
│   ├── main.js           # Main application logic
│   ├── news-api.js       # News API integration
│   ├── themes.js         # Theme management
│   ├── weather.js        # Weather functionality
│   ├── live-tv.js        # Live TV functionality
│   └── extended-articles.js # Fallback content
└── assets/
    └── default.svg       # Default image placeholder
```

## Deployment

This website is ready for deployment on GitHub Pages. Simply push to your repository and enable GitHub Pages in the repository settings.

## Technologies Used

- Vanilla JavaScript (ES6+)
- CSS3 with Custom Properties
- HTML5 with Semantic Markup
- Font Awesome Icons
- Google Fonts (Inter)
- Progressive Web App Features

## API Integration

The website integrates with multiple news APIs:

### General News APIs:
- GNews API
- NewsData.io API
- NewsAPI.org
- MediaStack API
- CurrentsAPI

### Enhanced Sports APIs:
- ESPN API (NFL, NBA, MLB, NHL, College Sports, Soccer)
- TheSportsDB API
- Sports News API
- RapidSports API

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App support

## Author

Philip Kilonzo

## License

All rights reserved © 2025 Brightlens News