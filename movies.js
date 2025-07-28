// Movies page JavaScript - OMDb API Integration
const OMDB_API_KEY = 'e16d6e4e';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

class MovieApp {
    constructor() {
        this.searchInput = document.getElementById('movie-search');
        this.searchBtn = document.getElementById('search-btn');
        this.loadingState = document.getElementById('loading-movie');
        this.errorState = document.getElementById('error-message');
        this.movieResult = document.getElementById('movie-result');
        this.errorText = document.getElementById('error-text');
        this.autocompleteDropdown = document.getElementById('autocomplete-dropdown');
        this.popularMoviesGrid = document.getElementById('popular-movies');
        this.actionMoviesGrid = document.getElementById('action-movies');
        this.comedyMoviesGrid = document.getElementById('comedy-movies');
        this.dramaMoviesGrid = document.getElementById('drama-movies');
        this.searchResultsGrid = document.getElementById('search-movies-scroll');
        this.loadingPopular = document.getElementById('loading-popular');
        
        this.currentSearch = '';
        this.isLoading = false;
        this.autocompleteTimeout = null;
        this.selectedIndex = -1;
        this.suggestions = [];
        
        // Movie categories for Netflix-style sections
        this.movieCategories = {
            popular: ['Avengers', 'Spider-Man', 'Batman', 'Superman', 'Iron Man', 'Thor', 'Captain America', 'Black Panther'],
            action: ['John Wick', 'Fast Furious', 'Mission Impossible', 'Die Hard', 'Rambo', 'Terminator', 'Mad Max', 'Matrix'],
            comedy: ['Deadpool', 'Guardians Galaxy', 'Anchorman', 'Dumb Dumber', 'Ace Ventura', 'Austin Powers', 'Rush Hour', 'Scary Movie'],
            drama: ['Forrest Gump', 'Shawshank Redemption', 'Titanic', 'Green Mile', 'Good Will Hunting', 'Beautiful Mind', 'Pursuit Happiness', 'Social Network']
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadAllMovieSections();
        this.hideLoading();
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
        
        // Input validation and autocomplete
        this.searchInput.addEventListener('input', () => {
            const query = this.searchInput.value.trim();
            this.searchBtn.disabled = query.length === 0 || this.isLoading;
            
            // Handle autocomplete
            if (query.length >= 2) {
                clearTimeout(this.autocompleteTimeout);
                this.autocompleteTimeout = setTimeout(() => {
                    this.searchAutocomplete(query);
                }, 300);
            } else {
                this.hideAutocomplete();
            }
        });
        
        // Keyboard navigation for autocomplete
        this.searchInput.addEventListener('keydown', (e) => {
            if (this.suggestions.length === 0) return;
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
                    this.updateAutocompleteSelection();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                    this.updateAutocompleteSelection();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this.selectedIndex >= 0) {
                        this.selectAutocompleteItem(this.suggestions[this.selectedIndex]);
                    } else {
                        this.handleSearch();
                    }
                    break;
                case 'Escape':
                    this.hideAutocomplete();
                    break;
            }
        });
        
        // Hide autocomplete when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-autocomplete')) {
                this.hideAutocomplete();
            }
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
            ? `<img src="${movie.Poster.replace('SX300', 'SX800')}" alt="${movie.Title}" class="movie-poster" loading="lazy">`
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
    
    // Popular Movies Functionality
    async loadPopularMovies() {
        const popularTitles = [
            // Major 2025 Blockbusters
            'Captain America Brave New World', 'Superman', 'Thunderbolts', 'F1 The Movie',
            'Mission Impossible The Final Reckoning', 'Ballerina', '28 Years Later', 'How to Train Your Dragon',
            'Jurassic World Rebirth', 'The Fantastic Four First Steps', 'Mickey 17', 'M3GAN 2.0',
            'Karate Kid Legends', 'The Accountant 2', 'Final Destination Bloodlines', 'Snow White',
            
            // Action & Adventure 2025
            'Den of Thieves Pantera', 'Nobody 2', 'The Running Man', 'Sinners', 'Wolf Man',
            'Until Dawn', 'The Monkey', 'Warfare', 'Black Bag', 'A Working Man',
            'Havoc', 'The Amateur', 'Flight Risk', 'Love Hurts', 'The Gorge',
            
            // Horror & Thriller 2025
            'Heart Eyes', 'Companion', 'I Know What You Did Last Summer', 'The Strangers Chapter 2',
            'Fear Street Prom Queen', 'Hurry Up Tomorrow', 'Death of a Unicorn', 'The Ritual',
            'Clown in a Cornfield', 'Bambi The Reckoning', 'Five Nights at Freddys 2',
            
            // Comedy & Drama 2025
            'Bridget Jones Mad About the Boy', 'You\'re Cordially Invited', 'Kinda Pregnant',
            'The Pickup', 'Nonnas', 'Another Simple Favor', 'Honey Don\'t', 'The Roses',
            'Freakier Friday', 'Happy Gilmore 2', 'The Naked Gun', 'Riff Raff',
            
            // Animation & Family 2025
            'Lilo & Stitch', 'Elio', 'The Bad Guys 2', 'Smurfs', 'The SpongeBob Movie Search for Squarepants',
            'Zootopia 2', 'A Minecraft Movie', 'Plankton The Movie', 'How to Train Your Dragon',
            
            // Sci-Fi & Fantasy 2025
            'Tron Ares', 'The Electric State', 'Avatar Fire and Ash', 'Cold Storage',
            'The Legend of Ochi', 'Predator Badlands', 'Star Trek Section 31',
            
            // Biographical & Historical 2025
            'Michael', 'One Battle After Another', 'The King of Kings', 'Monte Cassino',
            'Back in Action', 'The Life of Chuck', 'Eden', 'The Phoenician Scheme'
        ];
        
        try {
            this.showLoadingPopular();
            
            // Load all movies for comprehensive display (increased from 8 to 50+)
            const moviePromises = popularTitles.map(title => this.fetchMovieForPopular(title));
            const movies = await Promise.all(moviePromises);
            
            // Filter out failed requests
            const validMovies = movies.filter(movie => movie !== null);
            
            this.displayPopularMovies(validMovies);
            
        } catch (error) {
            console.error('Error loading popular movies:', error);
            this.popularMoviesGrid.innerHTML = '<p>Unable to load 2025 movies at the moment.</p>';
        } finally {
            this.hideLoadingPopular();
        }
    }
    
    async fetchMovieForPopular(title) {
        try {
            const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.Response === 'True') {
                return data;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching ${title}:`, error);
            return null;
        }
    }
    
    displayPopularMovies(movies) {
        if (!movies || movies.length === 0) {
            this.popularMoviesGrid.innerHTML = '<p>No 2025 movies available at the moment.</p>';
            return;
        }
        
        // Show movie count indicator
        const countIndicator = document.getElementById('movie-count-indicator');
        const movieCount = document.getElementById('movie-count');
        if (countIndicator && movieCount) {
            movieCount.textContent = movies.length;
            countIndicator.style.display = 'inline-block';
        }
        
        const moviesHTML = movies.map(movie => this.createPopularMovieCard(movie)).join('');
        this.popularMoviesGrid.innerHTML = moviesHTML;
        
        // Add click event listeners
        this.popularMoviesGrid.querySelectorAll('.popular-movie-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.searchInput.value = movies[index].Title;
                this.searchMovie(movies[index].Title);
            });
        });
    }
    
    createMovieCard(movie) {
        const poster = movie.Poster && movie.Poster !== 'N/A' 
            ? movie.Poster.replace('SX300', 'SX500') // Higher quality poster
            : 'https://via.placeholder.com/200x280/e2e8f0/64748b?text=No+Poster';
        
        const rating = movie.imdbRating && movie.imdbRating !== 'N/A' 
            ? `<span class="movie-rating"><i class="fas fa-star"></i> ${movie.imdbRating}</span>` 
            : '';
            
        const genre = movie.Genre && movie.Genre !== 'N/A' 
            ? `<div class="movie-genre">${movie.Genre.split(',')[0].trim()}</div>` 
            : '';
        
        return `
            <div class="movie-card" data-title="${movie.Title}">
                <img src="${poster}" alt="${movie.Title}" class="movie-poster" loading="lazy">
                <div class="movie-info">
                    <div class="movie-title">${movie.Title}</div>
                    <div class="movie-year">${movie.Year}</div>
                    ${rating}
                    ${genre}
                </div>
            </div>
        `;
    }
    
    // Netflix-style loading functions
    async loadAllMovieSections() {
        this.showLoadingPopular();
        
        try {
            // Load popular movies
            await this.loadMoviesByCategory('popular', this.popularMoviesGrid);
            
            // Load action movies
            await this.loadMoviesByCategory('action', this.actionMoviesGrid);
            
            // Load comedy movies
            await this.loadMoviesByCategory('comedy', this.comedyMoviesGrid);
            
            // Load drama movies
            await this.loadMoviesByCategory('drama', this.dramaMoviesGrid);
            
        } catch (error) {
            console.error('Error loading movie sections:', error);
        } finally {
            this.hideLoadingPopular();
        }
    }
    
    async loadMoviesByCategory(category, container) {
        const movieTitles = this.movieCategories[category];
        const movies = [];
        
        for (const title of movieTitles) {
            try {
                const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
                const response = await fetch(url);
                const movie = await response.json();
                
                if (movie.Response === 'True') {
                    movies.push(movie);
                }
                
                // Small delay to avoid hitting API limits
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error loading ${title}:`, error);
            }
        }
        
        if (movies.length > 0) {
            container.innerHTML = movies.map(movie => this.createMovieCard(movie)).join('');
            
            // Add click event listeners
            container.querySelectorAll('.movie-card').forEach((card, index) => {
                card.addEventListener('click', () => {
                    this.searchMovie(movies[index].Title);
                });
            });
        }
    }
    
    showLoadingPopular() {
        this.loadingPopular.style.display = 'block';
    }
    
    hideLoadingPopular() {
        this.loadingPopular.style.display = 'none';
    }
    
    // Autocomplete Functionality
    async searchAutocomplete(query) {
        try {
            // Use OMDb search endpoint for autocomplete
            const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.Response === 'True' && data.Search) {
                this.suggestions = data.Search.slice(0, 8); // Limit to 8 suggestions
                this.displayAutocomplete();
            } else {
                this.hideAutocomplete();
            }
        } catch (error) {
            console.error('Error fetching autocomplete:', error);
            this.hideAutocomplete();
        }
    }
    
    displayAutocomplete() {
        if (this.suggestions.length === 0) {
            this.hideAutocomplete();
            return;
        }
        
        const suggestionsHTML = this.suggestions.map((movie, index) => {
            const poster = movie.Poster && movie.Poster !== 'N/A' 
                ? movie.Poster.replace('SX300', 'SX500') // Higher quality
                : 'https://via.placeholder.com/40x60/e2e8f0/64748b?text=?';
            
            return `
                <div class="autocomplete-item" data-index="${index}">
                    <img src="${poster}" alt="${movie.Title}" class="autocomplete-poster" loading="lazy">
                    <div class="autocomplete-info">
                        <div class="autocomplete-title">${movie.Title}</div>
                        <div class="autocomplete-year">${movie.Year}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.autocompleteDropdown.innerHTML = suggestionsHTML;
        this.autocompleteDropdown.style.display = 'block';
        this.selectedIndex = -1;
        
        // Add click event listeners
        this.autocompleteDropdown.querySelectorAll('.autocomplete-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.selectAutocompleteItem(this.suggestions[index]);
            });
        });
    }
    
    updateAutocompleteSelection() {
        const items = this.autocompleteDropdown.querySelectorAll('.autocomplete-item');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
    }
    
    selectAutocompleteItem(movie) {
        this.searchInput.value = movie.Title;
        this.hideAutocomplete();
        this.searchMovie(movie.Title);
    }
    
    hideAutocomplete() {
        this.autocompleteDropdown.style.display = 'none';
        this.suggestions = [];
        this.selectedIndex = -1;
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

// Netflix-style scroll functionality
function scrollMovies(section, direction) {
    const container = document.getElementById(`${section}-movies`);
    const scrollAmount = 400;
    
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}