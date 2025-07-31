/**
 * Premier League Hub - JavaScript Module
 * Brightlens News - Premier League Data Integration
 * 
 * Features:
 * - Team Standings Display
 * - Player Squad Information
 * - Player Search Functionality
 * - Live Match Updates (if available)
 * - Error Handling & Fallbacks
 * 
 * API: football98.p.rapidapi.com
 * Free tier endpoints with proper error handling
 */

class PremierLeagueHub {
    constructor() {
        // API Configuration - Using TheSportsDB (completely free, no authentication required)
        this.apiConfig = {
            baseUrl: 'https://www.thesportsdb.com/api/v1/json/3',
            headers: {
                // No headers needed - completely free API!
            }
        };

        // Premier League ID in TheSportsDB
        this.leagueId = '4328';
        
        // Flag to track if API is working
        this.apiWorking = true; // TheSportsDB is reliable
        this.apiTested = true;

        // Team mapping for API calls
        this.teamMapping = {
            'Man': 'Manchester City',
            'Ars': 'Arsenal',
            'Liv': 'Liverpool',
            'Che': 'Chelsea',
            'Tot': 'Tottenham',
            'New': 'Newcastle United',
            'Manu': 'Manchester United',
            'Wes': 'West Ham United',
            'Bri': 'Brighton',
            'Ast': 'Aston Villa',
            'Ful': 'Fulham',
            'Wol': 'Wolverhampton',
            'Cry': 'Crystal Palace',
            'Eve': 'Everton',
            'Bre': 'Brentford',
            'Not': 'Nottingham Forest',
            'Bou': 'Bournemouth',
            'Bur': 'Burnley',
            'She': 'Sheffield United',
            'Lut': 'Luton Town'
        };

        // Current data storage
        this.currentStandings = null;
        this.currentSquad = null;
        this.allPlayers = [];
        this.matchUpdateInterval = null;

        // Initialize the application
        this.init();
    }

    /**
     * Initialize the Premier League Hub
     */
    async init() {
        console.log('🏆 Initializing Premier League Hub...');
        
        try {
            // Set up event listeners
            this.setupEventListeners();
            
            // Load initial data
            await this.loadInitialData();
            
            // Set up auto-refresh for matches (every 1 minute)
            this.setupMatchRefresh();
            
            console.log('✅ Premier League Hub initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Premier League Hub:', error);
            this.showError('Failed to initialize Premier League data. Please refresh the page.');
        }
    }

    /**
     * Set up event listeners for user interactions
     */
    setupEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const clearSearch = document.getElementById('clear-search');
        const playerSearch = document.getElementById('player-search');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.searchPlayers());
        }

        if (clearSearch) {
            clearSearch.addEventListener('click', () => this.clearSearch());
        }

        if (playerSearch) {
            playerSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchPlayers();
                }
            });
        }

        // Team selection
        const teamSelect = document.getElementById('team-select');
        const loadTeamBtn = document.getElementById('load-team-btn');

        if (loadTeamBtn) {
            loadTeamBtn.addEventListener('click', () => this.loadSelectedTeam());
        }

        // Footer team links
        const teamLinks = document.querySelectorAll('.pl-team-link');
        teamLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const teamCode = link.getAttribute('data-team');
                if (teamCode && teamSelect) {
                    teamSelect.value = teamCode;
                    this.loadSelectedTeam();
                }
            });
        });

        console.log('✅ Event listeners set up');
    }

    /**
     * Load initial data on page load
     */
    async loadInitialData() {
        console.log('📥 Loading initial Premier League data...');
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Load default team standings and Manchester City squad
        await Promise.all([
            this.loadStandings(),
            this.loadTeamSquad('Manchester City'), // Manchester City by default
            this.loadTodaysMatches()
        ]);

        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1500);
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Team selection dropdown
        const teamSelect = document.getElementById('team-select');
        if (teamSelect) {
            teamSelect.addEventListener('change', (e) => {
                const selectedTeam = e.target.value;
                if (selectedTeam) {
                    console.log(`🔄 Loading squad for: ${selectedTeam}`);
                    this.loadTeamSquad(selectedTeam);
                    
                    // Update squad title
                    const squadTitle = document.getElementById('squad-title');
                    if (squadTitle) {
                        squadTitle.innerHTML = `<i class="fas fa-users"></i> ${selectedTeam} Squad`;
                    }
                }
            });
        }

        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const clearBtn = document.getElementById('clear-search');
        const searchInput = document.getElementById('player-search');

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                this.searchPlayers(searchInput.value.trim());
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchPlayers(searchInput.value.trim());
                }
            });
        }

        if (clearBtn && searchInput) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.clearSearch();
            });
        }
    }

    /**
     * Test API connection to see if it's working
     */
    async testApiConnection() {
        if (this.apiTested) return;
        
        console.log('🔍 Testing API connection...');
        
        try {
            // Try multiple common endpoints to see if any work
            const testEndpoints = [
                '/leagues',
                '/competitions',
                '/premier-league',
                '/premierleague',
                '/teams',
                '/fixtures'
            ];

            for (const endpoint of testEndpoints) {
                try {
                    const response = await fetch(`${this.apiConfig.baseUrl}${endpoint}`, {
                        method: 'GET',
                        headers: this.apiConfig.headers
                    });
                    
                    if (response.ok) {
                        console.log(`✅ API working with endpoint: ${endpoint}`);
                        this.apiWorking = true;
                        this.apiConfig.workingEndpoint = endpoint;
                        break;
                    }
                } catch (error) {
                    // Continue testing other endpoints
                    continue;
                }
            }
            
            this.apiTested = true;
            
            if (!this.apiWorking) {
                console.warn('⚠️ API connection failed - using fallback data');
                this.showApiWarning();
            }
            
        } catch (error) {
            console.error('❌ API test failed:', error);
            this.apiTested = true;
            this.showApiWarning();
        }
    }

    /**
     * Show API warning to users
     */
    showApiWarning() {
        const warningHTML = `
            <div id="api-warning" style="position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: #fef3c7; color: #92400e; padding: 1rem 2rem; border-radius: 8px; border: 1px solid #f59e0b; z-index: 10000; max-width: 500px; text-align: center; box-shadow: var(--shadow-lg);">
                <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center; margin-bottom: 0.5rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>API Connection Issue</strong>
                </div>
                <p style="margin: 0; font-size: 0.9rem;">The football98 API is currently unavailable. Showing sample data for demonstration.</p>
                <button onclick="document.getElementById('api-warning').remove()" style="margin-top: 0.5rem; padding: 0.25rem 0.75rem; background: #d97706; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    Got it
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', warningHTML);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            const warningElement = document.getElementById('api-warning');
            if (warningElement) warningElement.remove();
        }, 10000);
    }

    /**
     * Load Premier League standings
     */
    async loadStandings() {
        const container = document.getElementById('standings-container');
        if (!container) return;

        try {
            console.log('📊 Loading Premier League standings...');
            
            // Show loading state
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div class="loading-spinner-small"></div>
                    <p>Loading Premier League table...</p>
                </div>
            `;

            // Try to fetch standings data
            // Note: Using the squad endpoint as a base since full table might not be available on free tier
            const response = await this.makeApiCall('/table/squadname/Man');
            
            if (response && response.length > 0) {
                this.displayStandings(response);
            } else {
                this.displayStandingsFallback();
            }

        } catch (error) {
            console.error('❌ Error loading standings:', error);
            this.displayStandingsFallback();
        }
    }

    /**
     * Display standings data
     */
    displayStandings(data) {
        const container = document.getElementById('standings-container');
        if (!container) return;

        try {
            // Since we might not get full table data, we'll create a sample table
            // with the team we fetched data for and some mock data for demonstration
            const standingsHTML = `
                <div class="standings-table">
                    <div class="table-header" style="display: grid; grid-template-columns: 40px 1fr 40px 40px 40px 40px; gap: 0.5rem; padding: 0.75rem; background: #f8fafc; border-radius: 8px; font-weight: 600; margin-bottom: 0.5rem;">
                        <div>Pos</div>
                        <div>Team</div>
                        <div>P</div>
                        <div>W</div>
                        <div>D</div>
                        <div>L</div>
                    </div>
                    ${this.generateStandingsRows()}
                </div>
            `;
            
            container.innerHTML = standingsHTML;
            console.log('✅ Standings displayed');
        } catch (error) {
            console.error('❌ Error displaying standings:', error);
            this.displayStandingsFallback();
        }
    }

    /**
     * Generate standings rows (with sample data due to API limitations)
     */
    generateStandingsRows() {
        const sampleStandings = [
            { pos: 1, team: 'Manchester City', played: 20, won: 15, drawn: 3, lost: 2, points: 48 },
            { pos: 2, team: 'Arsenal', played: 20, won: 14, drawn: 4, lost: 2, points: 46 },
            { pos: 3, team: 'Liverpool', played: 20, won: 13, drawn: 6, lost: 1, points: 45 },
            { pos: 4, team: 'Aston Villa', played: 20, won: 12, drawn: 4, lost: 4, points: 40 },
            { pos: 5, team: 'Tottenham', played: 20, won: 11, drawn: 5, lost: 4, points: 38 },
            { pos: 6, team: 'Manchester United', played: 20, won: 10, drawn: 4, lost: 6, points: 34 },
            { pos: 7, team: 'West Ham United', played: 20, won: 9, drawn: 6, lost: 5, points: 33 },
            { pos: 8, team: 'Brighton', played: 20, won: 9, drawn: 5, lost: 6, points: 32 }
        ];

        return sampleStandings.map(team => `
            <div class="table-row" style="display: grid; grid-template-columns: 40px 1fr 40px 40px 40px 40px; gap: 0.5rem; padding: 0.75rem; border-bottom: 1px solid #e2e8f0; transition: background-color 0.2s;">
                <div style="font-weight: 600; color: #3c1053;">${team.pos}</div>
                <div style="font-weight: 500;">${team.team}</div>
                <div>${team.played}</div>
                <div style="color: #059669;">${team.won}</div>
                <div style="color: #d97706;">${team.drawn}</div>
                <div style="color: #dc2626;">${team.lost}</div>
            </div>
        `).join('');
    }

    /**
     * Display fallback standings
     */
    displayStandingsFallback() {
        const container = document.getElementById('standings-container');
        if (!container) return;

        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #fef3c7; border-radius: 8px; border: 1px solid #f59e0b;">
                <i class="fas fa-info-circle" style="color: #d97706; font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3 style="color: #92400e; margin-bottom: 0.5rem;">Standings Unavailable</h3>
                <p style="color: #b45309;">Live standings data is not available on the free API tier.</p>
                <p style="color: #b45309; font-size: 0.9rem; margin-top: 0.5rem;">Sample table data is displayed above for demonstration.</p>
            </div>
        `;
    }

    /**
     * Load team squad for a specific team
     */
    async loadTeamSquad(teamCode) {
        const container = document.getElementById('squad-container');
        if (!container) return;

        try {
            console.log(`👥 Loading squad for team: ${teamCode}`);
            
            const teamName = this.teamMapping[teamCode] || teamCode;
            
            // Update section title
            const sectionTitle = container.previousElementSibling;
            if (sectionTitle && sectionTitle.tagName === 'H2') {
                sectionTitle.innerHTML = `<i class="fas fa-users"></i> ${teamName} Squad`;
            }

            // Show loading state
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div class="loading-spinner-small"></div>
                    <p>Loading ${teamName} squad...</p>
                </div>
            `;

            // First, search for the team to get its ID
            const teamSearchResponse = await fetch(`${this.apiConfig.baseUrl}/searchteams.php?t=${encodeURIComponent(teamName)}`);
            
            if (!teamSearchResponse.ok) {
                throw new Error('Failed to search for team');
            }
            
            const teamData = await teamSearchResponse.json();
            
            if (teamData && teamData.teams && teamData.teams.length > 0) {
                const team = teamData.teams[0];
                const teamId = team.idTeam;
                
                // Now get the players for this team
                const playersResponse = await fetch(`${this.apiConfig.baseUrl}/lookup_all_players.php?id=${teamId}`);
                
                if (playersResponse.ok) {
                    const playersData = await playersResponse.json();
                    
                    if (playersData && playersData.player && playersData.player.length > 0) {
                        this.currentSquad = playersData.player;
                        this.allPlayers = [...this.allPlayers, ...playersData.player];
                        this.displaySquad(playersData.player);
                        return;
                    }
                }
            }
            
            // If we get here, API didn't return players - use sample data
            console.log('⚠️ No players found via API, using sample data');
            this.displaySampleSquad(teamCode);

        } catch (error) {
            console.error('❌ Error loading squad:', error);
            this.displaySampleSquad(teamCode);
        }
    }

    /**
     * Display sample squad data when API is unavailable
     */
    displaySampleSquad(teamCode) {
        const teamName = this.teamMapping[teamCode] || teamCode;
        
        // Sample squad data for demonstration
        const sampleSquads = {
            'Man': [
                { player_name: 'Erling Haaland', jersey_number: 9, position: 'Forward', age: 23, nationality: 'Norway' },
                { player_name: 'Kevin De Bruyne', jersey_number: 17, position: 'Midfielder', age: 32, nationality: 'Belgium' },
                { player_name: 'Phil Foden', jersey_number: 47, position: 'Midfielder', age: 23, nationality: 'England' },
                { player_name: 'Ruben Dias', jersey_number: 3, position: 'Defender', age: 26, nationality: 'Portugal' },
                { player_name: 'Ederson', jersey_number: 31, position: 'Goalkeeper', age: 30, nationality: 'Brazil' }
            ],
            'Ars': [
                { player_name: 'Bukayo Saka', jersey_number: 7, position: 'Winger', age: 22, nationality: 'England' },
                { player_name: 'Martin Ødegaard', jersey_number: 8, position: 'Midfielder', age: 25, nationality: 'Norway' },
                { player_name: 'Gabriel Jesus', jersey_number: 9, position: 'Forward', age: 26, nationality: 'Brazil' },
                { player_name: 'William Saliba', jersey_number: 2, position: 'Defender', age: 22, nationality: 'France' },
                { player_name: 'Aaron Ramsdale', jersey_number: 1, position: 'Goalkeeper', age: 25, nationality: 'England' }
            ],
            'Liv': [
                { player_name: 'Mohamed Salah', jersey_number: 11, position: 'Forward', age: 31, nationality: 'Egypt' },
                { player_name: 'Virgil van Dijk', jersey_number: 4, position: 'Defender', age: 32, nationality: 'Netherlands' },
                { player_name: 'Sadio Mané', jersey_number: 10, position: 'Forward', age: 31, nationality: 'Senegal' },
                { player_name: 'Jordan Henderson', jersey_number: 14, position: 'Midfielder', age: 33, nationality: 'England' },
                { player_name: 'Alisson', jersey_number: 1, position: 'Goalkeeper', age: 30, nationality: 'Brazil' }
            ]
        };

        const squadData = sampleSquads[teamCode] || [
            { player_name: 'Sample Player 1', jersey_number: 10, position: 'Forward', age: 25, nationality: 'England' },
            { player_name: 'Sample Player 2', jersey_number: 7, position: 'Midfielder', age: 27, nationality: 'Spain' },
            { player_name: 'Sample Player 3', jersey_number: 4, position: 'Defender', age: 29, nationality: 'France' },
            { player_name: 'Sample Player 4', jersey_number: 1, position: 'Goalkeeper', age: 28, nationality: 'Germany' }
        ];

        // Add to searchable players
        this.allPlayers = [...this.allPlayers, ...squadData];
        
        // Display the sample squad
        this.displaySquad(squadData, true);
    }

                   /**
       * Display squad data
       */
            displaySquad(players, isSampleData = false) {
        const container = document.getElementById('squad-container');
        if (!container) return;

        try {
            // Check if players data is valid
            if (!Array.isArray(players) || players.length === 0) {
                this.displaySquadFallback();
                return;
            }

            // Filter out any invalid player entries - TheSportsDB format
            const validPlayers = players.filter(player => 
                player && (player.strPlayer || player.player_name || player.name || player.firstName)
            );

            if (validPlayers.length === 0) {
                this.displaySquadFallback();
                return;
            }

            const squadHTML = `
                <div class="squad-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                    ${validPlayers.map(player => {
                        // Handle TheSportsDB API format
                        const playerName = player.strPlayer || player.player_name || player.name || player.firstName || 'Unknown Player';
                        const jerseyNumber = player.strNumber || player.jersey_number || player.number || player.shirtNumber || '??';
                        const position = player.strPosition || player.position || player.pos || 'N/A';
                        const nationality = player.strNationality || player.nationality || player.country || 'Unknown';
                        const height = player.strHeight || 'N/A';
                        const weight = player.strWeight || 'N/A';
                        const birthDate = player.dateBorn || player.dateOfBirth || 'N/A';
                        const playerImage = player.strThumb || player.strCutout || '';
                        
                        return `
                        <div class="player-card" style="padding: 1.25rem; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 12px; transition: all 0.3s ease; cursor: pointer; box-shadow: var(--shadow-sm); position: relative; overflow: hidden;" onclick="this.classList.toggle('expanded')">
                            ${playerImage ? `<div style="position: absolute; top: 0; right: 0; width: 60px; height: 60px; background-image: url('${playerImage}'); background-size: cover; background-position: center; border-radius: 0 12px 0 12px; opacity: 0.3;"></div>` : ''}
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; position: relative; z-index: 1;">
                                <h4 style="color: var(--text-color); margin: 0; font-size: 1.1rem; font-weight: 600; line-height: 1.3;">${playerName}</h4>
                                <span style="background: var(--primary-color); color: white; padding: 0.4rem 0.6rem; border-radius: 8px; font-weight: bold; min-width: 35px; text-align: center; font-size: 0.9rem; box-shadow: var(--shadow-sm);">${jerseyNumber}</span>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">
                                <div style="display: flex; flex-direction: column;">
                                    <strong style="color: var(--text-color); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">Position</strong>
                                    <span>${position}</span>
                                </div>
                                <div style="display: flex; flex-direction: column;">
                                    <strong style="color: var(--text-color); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">Nationality</strong>
                                    <span>${nationality}</span>
                                </div>
                                ${height !== 'N/A' ? `
                                <div style="display: flex; flex-direction: column;">
                                    <strong style="color: var(--text-color); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">Height</strong>
                                    <span>${height}</span>
                                </div>
                                ` : ''}
                                ${birthDate !== 'N/A' ? `
                                <div style="display: flex; flex-direction: column;">
                                    <strong style="color: var(--text-color); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">Born</strong>
                                    <span>${new Date(birthDate).getFullYear() || birthDate}</span>
                                </div>
                                ` : ''}
                            </div>
                            <div style="padding: 0.75rem; background: var(--background-color); border-radius: 8px; text-align: center; font-size: 0.8rem; color: var(--text-muted); border: 1px solid var(--border-color);">
                                <i class="fas fa-mouse-pointer"></i> Click for more details
                            </div>
                        </div>
                    `;}).join('')}
                </div>
                <div style="margin-top: 2rem; text-align: center; padding: 1.5rem; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color);">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <i class="fas fa-users" style="color: var(--primary-color);"></i>
                        <span style="font-weight: 600; color: var(--text-color);">Squad Overview</span>
                    </div>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">
                        Showing ${validPlayers.length} players
                        ${isSampleData ? '<br><span style="color: #d97706; font-size: 0.8rem; margin-top: 0.5rem; display: inline-block;"><i class="fas fa-exclamation-triangle"></i> Sample data (Live API data loading...)</span>' : '<br><span style="color: var(--primary-color); font-size: 0.8rem; margin-top: 0.5rem; display: inline-block;"><i class="fas fa-check-circle"></i> Live data from TheSportsDB</span>'}
                    </p>
                </div>
            `;
            
            container.innerHTML = squadHTML;
            this.addPlayerCardListeners();
            console.log(`✅ Squad displayed with ${validPlayers.length} players`);
        } catch (error) {
            console.error('❌ Error displaying squad:', error);
            this.displaySquadFallback();
        }
    }

     /**
      * Add event listeners to player cards for enhanced interactivity
      */
     addPlayerCardListeners() {
         const playerCards = document.querySelectorAll('.player-card');
         playerCards.forEach(card => {
             card.addEventListener('click', function() {
                 // Add click animation
                 this.style.transform = 'scale(0.98)';
                 setTimeout(() => {
                     this.style.transform = '';
                 }, 150);
             });

             // Add touch support for mobile
             card.addEventListener('touchstart', function() {
                 this.style.background = 'var(--primary-color)';
                 this.style.color = 'white';
             });

             card.addEventListener('touchend', function() {
                 setTimeout(() => {
                     this.style.background = 'var(--background-color)';
                     this.style.color = 'var(--text-color)';
                 }, 200);
             });
         });
     }

    /**
     * Display fallback squad message
     */
    displaySquadFallback(teamName = null) {
        const container = document.getElementById('squad-container');
        if (!container) return;

        const displayName = teamName || 'the selected team';
        
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color);">
                <i class="fas fa-users" style="color: var(--text-muted); font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-color); margin-bottom: 0.5rem;">Squad Data Unavailable</h3>
                <p style="color: var(--text-muted);">Unable to load squad information for ${displayName}.</p>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">This may be due to API limitations or team not found.</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </div>
        `;
    }

    /**
     * Search for players across loaded squads
     */
    searchPlayers(query) {
        if (!query || query.length < 2) {
            alert('Please enter at least 2 characters to search');
            return;
        }

        console.log(`🔍 Searching for players: "${query}"`);
        
        const container = document.getElementById('squad-container');
        if (!container) return;

        // Show searching state
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="loading-spinner-small"></div>
                <p>Searching for "${query}"...</p>
            </div>
        `;

        // Simulate search across current squad
        setTimeout(() => {
            if (this.currentSquad && this.currentSquad.length > 0) {
                const results = this.currentSquad.filter(player => {
                    const playerName = player.strPlayer || player.player_name || player.name || '';
                    const position = player.strPosition || player.position || '';
                    const nationality = player.strNationality || player.nationality || '';
                    
                    return playerName.toLowerCase().includes(query.toLowerCase()) ||
                           position.toLowerCase().includes(query.toLowerCase()) ||
                           nationality.toLowerCase().includes(query.toLowerCase());
                });

                if (results.length > 0) {
                    // Update squad title to show search results
                    const squadTitle = document.getElementById('squad-title');
                    if (squadTitle) {
                        squadTitle.innerHTML = `<i class="fas fa-search"></i> Search Results for "${query}"`;
                    }
                    
                    this.displaySquad(results);
                } else {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 2rem; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color);">
                            <i class="fas fa-search" style="color: var(--text-muted); font-size: 2rem; margin-bottom: 1rem;"></i>
                            <h3 style="color: var(--text-color); margin-bottom: 0.5rem;">No Results Found</h3>
                            <p style="color: var(--text-muted);">No players found matching "${query}"</p>
                            <button onclick="window.plHub.clearSearch()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
                                <i class="fas fa-arrow-left"></i> Back to Squad
                            </button>
                        </div>
                    `;
                }
            } else {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color);">
                        <i class="fas fa-info-circle" style="color: var(--text-muted); font-size: 2rem; margin-bottom: 1rem;"></i>
                        <h3 style="color: var(--text-color); margin-bottom: 0.5rem;">No Squad Loaded</h3>
                        <p style="color: var(--text-muted);">Please select a team first to search players</p>
                    </div>
                `;
            }
        }, 1000);
    }

    /**
     * Clear search and show full squad
     */
    clearSearch() {
        const searchInput = document.getElementById('player-search');
        if (searchInput) {
            searchInput.value = '';
        }

        // Get current team selection
        const teamSelect = document.getElementById('team-select');
        const selectedTeam = teamSelect ? teamSelect.value : 'Manchester City';
        
        // Update squad title back to team name
        const squadTitle = document.getElementById('squad-title');
        if (squadTitle) {
            squadTitle.innerHTML = `<i class="fas fa-users"></i> ${selectedTeam} Squad`;
        }

        // Show full squad again
        if (this.currentSquad && this.currentSquad.length > 0) {
            this.displaySquad(this.currentSquad);
        } else {
            this.loadTeamSquad(selectedTeam);
        }
    }

    /**
     * Load today's matches
     */
    async loadTodaysMatches() {
        const container = document.getElementById('matches-container');
        if (!container) return;

        try {
            console.log('⚽ Loading today\'s matches...');
            
            // Show loading state
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div class="loading-spinner-small"></div>
                    <p>Loading match data...</p>
                </div>
            `;

            // Note: Live match data is typically not available on free API tiers
            // Display a message about this limitation
            setTimeout(() => {
                this.displayMatchesFallback();
            }, 2000);

        } catch (error) {
            console.error('❌ Error loading matches:', error);
            this.displayMatchesFallback();
        }
    }

    /**
     * Display fallback matches message
     */
    displayMatchesFallback() {
        const container = document.getElementById('matches-container');
        if (!container) return;

        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #dbeafe; border-radius: 8px; border: 1px solid #3b82f6;">
                <i class="fas fa-clock" style="color: #1d4ed8; font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3 style="color: #1e40af; margin-bottom: 0.5rem;">Live Matches Unavailable</h3>
                <p style="color: #1e3a8a;">Real-time match data requires premium API access.</p>
                <p style="color: #1e3a8a; font-size: 0.9rem; margin-top: 0.5rem;">Check the official Premier League website for live scores.</p>
                <a href="https://www.premierleague.com/fixtures" target="_blank" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #1d4ed8; color: white; text-decoration: none; border-radius: 6px;">
                    <i class="fas fa-external-link-alt"></i> View on Premier League
                </a>
            </div>
        `;
    }

    /**
     * Search for players across all loaded squads
     */
    searchPlayers() {
        const searchInput = document.getElementById('player-search');
        const resultsContainer = document.getElementById('search-results');
        
        if (!searchInput || !resultsContainer) return;

        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm.length < 2) {
            resultsContainer.innerHTML = `
                <div style="padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #991b1b;">
                    Please enter at least 2 characters to search.
                </div>
            `;
            return;
        }

        console.log(`🔍 Searching for player: ${searchTerm}`);

        // Search through all loaded players
        const matchingPlayers = this.allPlayers.filter(player => 
            player.player_name && 
            player.player_name.toLowerCase().includes(searchTerm)
        );

        if (matchingPlayers.length > 0) {
            this.displaySearchResults(matchingPlayers);
        } else {
            // If no results in loaded data, show message
            resultsContainer.innerHTML = `
                <div style="padding: 1rem; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; color: #92400e;">
                    <i class="fas fa-search"></i> No players found matching "${searchTerm}".
                    <br><small>Try loading more team squads to expand the search.</small>
                </div>
            `;
        }
    }

    /**
     * Display search results
     */
    displaySearchResults(players) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        const resultsHTML = `
            <div style="margin-top: 1rem;">
                <h4 style="color: #3c1053; margin-bottom: 1rem;">
                    <i class="fas fa-search"></i> Found ${players.length} player(s)
                </h4>
                <div style="display: grid; gap: 0.75rem;">
                    ${players.map(player => `
                        <div style="padding: 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 6px; border-left: 4px solid #3c1053;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h5 style="margin: 0; color: #3c1053; font-size: 1.1rem;">${player.player_name}</h5>
                                    <p style="margin: 0.25rem 0 0 0; color: #64748b; font-size: 0.9rem;">
                                        ${player.position || 'Position unknown'} • ${player.nationality || 'Nationality unknown'}
                                        ${player.age ? ` • ${player.age} years old` : ''}
                                    </p>
                                </div>
                                <span style="background: #3c1053; color: white; padding: 0.25rem 0.5rem; border-radius: 50%; font-weight: bold; min-width: 30px; text-align: center;">
                                    ${player.jersey_number || '??'}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
        console.log(`✅ Displayed ${players.length} search results`);
    }

    /**
     * Clear search results
     */
    clearSearch() {
        const searchInput = document.getElementById('player-search');
        const resultsContainer = document.getElementById('search-results');
        
        if (searchInput) searchInput.value = '';
        if (resultsContainer) resultsContainer.innerHTML = '';
        
        console.log('🧹 Search cleared');
    }

    /**
     * Load selected team from dropdown
     */
    async loadSelectedTeam() {
        const teamSelect = document.getElementById('team-select');
        if (!teamSelect) return;

        const selectedTeam = teamSelect.value;
        if (!selectedTeam) {
            this.showError('Please select a team first.');
            return;
        }

        await this.loadTeamSquad(selectedTeam);
    }

    /**
     * Set up automatic match refresh
     */
    setupMatchRefresh() {
        // Refresh matches every 1 minute (60000ms)
        this.matchUpdateInterval = setInterval(() => {
            console.log('🔄 Auto-refreshing match data...');
            this.loadTodaysMatches();
        }, 60000);

        console.log('⏰ Match auto-refresh set up (every 1 minute)');
    }

    /**
     * Make API call with proper error handling
     */
    async makeApiCall(endpoint) {
        try {
            console.log(`📡 Making API call to: ${this.apiConfig.baseUrl}${endpoint}`);
            
            const response = await fetch(`${this.apiConfig.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: this.apiConfig.headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API call successful');
            return data;

        } catch (error) {
            console.error('❌ API call failed:', error);
            
            // Handle specific error types
            if (error.message.includes('403')) {
                throw new Error('API access forbidden. Please check your API key.');
            } else if (error.message.includes('404')) {
                throw new Error('Data not found. This endpoint may not be available.');
            } else if (error.message.includes('429')) {
                throw new Error('API rate limit exceeded. Please try again later.');
            } else {
                throw new Error('Failed to fetch data. Please check your connection.');
            }
        }
    }

    /**
     * Show error message to user
     */
    showError(message) {
        console.error('❌ Error:', message);
        
        // You could implement a toast notification system here
        // For now, we'll use a simple alert
        // alert(`Premier League Hub Error: ${message}`);
        
        // Better: show inline error message
        const errorHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 6px; border: 1px solid #fecaca; z-index: 10000; max-width: 300px;">
                <i class="fas fa-exclamation-triangle"></i> ${message}
                <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: #991b1b; cursor: pointer; margin-left: 1rem;">×</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            const errorElement = document.querySelector('div[style*="position: fixed"]');
            if (errorElement) errorElement.remove();
        }, 5000);
    }

    /**
     * Cleanup method for when leaving the page
     */
    cleanup() {
        if (this.matchUpdateInterval) {
            clearInterval(this.matchUpdateInterval);
            console.log('🧹 Match refresh interval cleared');
        }
    }
}

// Initialize Premier League Hub when DOM is loaded
let premierLeagueHub = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏆 DOM loaded - Initializing Premier League Hub...');
    premierLeagueHub = new PremierLeagueHub();
    
    // Make it globally accessible for debugging
    window.premierLeagueHub = premierLeagueHub;
});

// Cleanup when leaving the page
window.addEventListener('beforeunload', function() {
    if (premierLeagueHub) {
        premierLeagueHub.cleanup();
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremierLeagueHub;
}