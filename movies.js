// Movies page JavaScript - OMDb API Integration
const OMDB_API_KEY = 'e16d6e4e';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

class MovieApp {
    constructor() {
        this.searchInput = document.getElementById('movie-search');
        this.searchBtn = document.getElementById('search-btn');
        this.welcomeState = document.getElementById('welcome-state');
        this.loadingState = document.getElementById('loading-movie');
        this.errorState = document.getElementById('error-message');
        this.movieResult = document.getElementById('movie-result');
        this.errorText = document.getElementById('error-text');
        
        this.currentSearch = '';
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showWelcomeState();
    }
    
    setupEventListeners() {
        // Search button click
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        
        // Enter key press
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch();
            }
        });
        
        // Input validation
        this.searchInput.addEventListener('input', () => {
            const query = this.searchInput.value.trim();
            this.searchBtn.disabled = query.length === 0 || this.isLoading;
        });
    }
    
    async handleSearch() {
        const query = this.searchInput.value.trim();
        
        if (!query) {
            this.showError('Please enter a movie title to search.');
            return;
        }
        
        if (this.isLoading) return;
        
        this.currentSearch = query;
        await this.searchMovie(query);
    }
    
    async searchMovie(title) {
        try {
            this.showLoading();
            
            const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&plot=full`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.Response === 'False') {
                this.showError(data.Error || 'Movie not found. Please check the spelling and try again.');
                return;
            }
            
            this.displayMovie(data);
            
        } catch (error) {
            console.error('Error fetching movie data:', error);
            this.showError('Unable to fetch movie data. Please check your internet connection and try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    displayMovie(movie) {
        this.hideAllStates();
        
        const movieHTML = this.createMovieHTML(movie);
        this.movieResult.innerHTML = movieHTML;
        this.movieResult.style.display = 'block';
        
        // Smooth scroll to result
        this.movieResult.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    createMovieHTML(movie) {
        const genres = movie.Genre ? movie.Genre.split(', ') : [];
        const genreTags = genres.map(genre => 
            `<span class="genre-tag">${genre}</span>`
        ).join('');
        
        const poster = movie.Poster && movie.Poster !== 'N/A' 
            ? `<img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster" loading="lazy">`
            : `<div class="movie-poster-placeholder">🎬</div>`;
        
        const rating = movie.imdbRating && movie.imdbRating !== 'N/A'
            ? `<div class="rating-badge">
                 <i class="fas fa-star"></i>
                 ${movie.imdbRating}/10 IMDb
               </div>`
            : '';
        
        const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' trailer')}`;
        
        return `
            <div class="movie-header">
                <div class="movie-poster-container">
                    ${poster}
                </div>
                <div class="movie-info">
                    <h2 class="movie-title">${movie.Title}</h2>
                    <div class="movie-year">${movie.Year}</div>
                    
                    ${rating}
                    
                    <div class="genre-tags">
                        ${genreTags}
                    </div>
                    
                    <div class="movie-meta">
                        <div class="meta-item">
                            <i class="fas fa-clock meta-icon"></i>
                            <span>${movie.Runtime || 'N/A'}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-certificate meta-icon"></i>
                            <span>${movie.Rated || 'Not Rated'}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar meta-icon"></i>
                            <span>${movie.Released || 'N/A'}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-dollar-sign meta-icon"></i>
                            <span>${movie.BoxOffice || 'N/A'}</span>
                        </div>
                    </div>
                    
                    ${movie.Plot && movie.Plot !== 'N/A' ? `
                        <div class="movie-plot">
                            ${movie.Plot}
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="movie-details">
                <div class="detail-item">
                    <div class="detail-label">Director</div>
                    <div class="detail-value">${movie.Director || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Writer</div>
                    <div class="detail-value">${movie.Writer || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Actors</div>
                    <div class="detail-value">${movie.Actors || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Language</div>
                    <div class="detail-value">${movie.Language || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Country</div>
                    <div class="detail-value">${movie.Country || 'N/A'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Awards</div>
                    <div class="detail-value">${movie.Awards || 'N/A'}</div>
                </div>
                ${movie.Metascore && movie.Metascore !== 'N/A' ? `
                    <div class="detail-item">
                        <div class="detail-label">Metascore</div>
                        <div class="detail-value">${movie.Metascore}/100</div>
                    </div>
                ` : ''}
                ${movie.imdbVotes && movie.imdbVotes !== 'N/A' ? `
                    <div class="detail-item">
                        <div class="detail-label">IMDb Votes</div>
                        <div class="detail-value">${movie.imdbVotes}</div>
                    </div>
                ` : ''}
            </div>
            
            <div class="movie-actions">
                <a href="${trailerUrl}" target="_blank" rel="noopener noreferrer" class="trailer-btn">
                    <i class="fab fa-youtube"></i>
                    Watch Trailer
                </a>
            </div>
        `;
    }
    
    showLoading() {
        this.isLoading = true;
        this.searchBtn.disabled = true;
        this.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        
        this.hideAllStates();
        this.loadingState.style.display = 'block';
    }
    
    hideLoading() {
        this.isLoading = false;
        this.searchBtn.disabled = this.searchInput.value.trim().length === 0;
        this.searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
        
        this.loadingState.style.display = 'none';
    }
    
    showError(message) {
        this.hideAllStates();
        
        this.errorText.textContent = message;
        this.errorState.style.display = 'block';
        
        // Scroll to error message
        this.errorState.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
    
    showWelcomeState() {
        this.hideAllStates();
        this.welcomeState.style.display = 'block';
    }
    
    hideAllStates() {
        this.welcomeState.style.display = 'none';
        this.loadingState.style.display = 'none';
        this.errorState.style.display = 'none';
        this.movieResult.style.display = 'none';
    }
}

// Utility functions
function formatBoxOffice(boxOffice) {
    if (!boxOffice || boxOffice === 'N/A') return 'N/A';
    
    // Convert to millions if it's a large number
    const number = parseFloat(boxOffice.replace(/[^0-9.-]+/g, ''));
    if (number >= 1000000) {
        return `$${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
        return `$${(number / 1000).toFixed(1)}K`;
    }
    return boxOffice;
}

function formatRuntime(runtime) {
    if (!runtime || runtime === 'N/A') return 'N/A';
    
    const minutes = parseInt(runtime);
    if (isNaN(minutes)) return runtime;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes} min`;
}

// Initialize the movie app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.movieApp = new MovieApp();
    }, 100);
});

// Add some popular movie suggestions
const POPULAR_MOVIES = [
    'The Godfather',
    'The Shawshank Redemption',
    'The Dark Knight',
    'Pulp Fiction',
    'Forrest Gump',
    'Inception',
    'The Matrix',
    'Interstellar',
    'Avatar',
    'Titanic',
    'Star Wars',
    'Jurassic Park',
    'Back to the Future',
    'Casablanca',
    'Gone with the Wind'
];

// Add random movie suggestion feature
function getRandomMovieSuggestion() {
    return POPULAR_MOVIES[Math.floor(Math.random() * POPULAR_MOVIES.length)];
}

// Add suggestion click handler
document.addEventListener('DOMContentLoaded', function() {
    // Add click handler for suggestion examples
    setTimeout(() => {
        const welcomeState = document.getElementById('welcome-state');
        if (welcomeState) {
            const suggestions = welcomeState.querySelectorAll('strong');
            suggestions.forEach(suggestion => {
                suggestion.style.cursor = 'pointer';
                suggestion.style.textDecoration = 'underline';
                suggestion.addEventListener('click', function() {
                    const movieInput = document.getElementById('movie-search');
                    if (movieInput) {
                        movieInput.value = this.textContent;
                        movieInput.focus();
                    }
                });
            });
        }
    }, 500);
});