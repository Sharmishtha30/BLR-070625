class ParticipantDirectory {
    constructor() {
        this.participants = [];
        this.config = {};
        this.init();
    }

    async init() {
        // Set up theme
        this.initializeTheme();
        
        try {
            // Load configuration
            await this.loadConfig();
            
            // Load all participant data
            await this.loadParticipants();
            
            // Show content
            this.showContent();
            
        } catch (error) {
            console.error('Failed to initialize:', error);
            this.showError('Failed to load workshop data. Please check your connection and try again.');
        }
    }

    initializeTheme() {
        const themeSwitch = document.querySelector('.theme-switch');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeSwitch.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    async loadConfig() {
        try {
            const response = await fetch('./config.json');
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            this.config = await response.json();
            
            // Update page title and description
            if (this.config.title) {
                document.getElementById('workshop-title').textContent = this.config.title;
                document.title = this.config.title;
            }
            
            if (this.config.description) {
                document.getElementById('workshop-description').textContent = this.config.description;
            }
            
        } catch (error) {
            console.error('Error loading config:', error);
            throw new Error('Configuration file not found or invalid');
        }
    }

    async loadParticipants() {
        if (!this.config.participants || this.config.participants.length === 0) {
            throw new Error('No participants found in configuration');
        }

        const participantPromises = this.config.participants.map(username => 
            this.fetchGitHubUser(username)
        );

        try {
            // Fetch all participants in parallel with error handling
            const results = await Promise.allSettled(participantPromises);
            
            this.participants = results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);
            
            // Log any failed requests
            const failures = results
                .filter(result => result.status === 'rejected')
                .map((result, index) => ({
                    username: this.config.participants[index],
                    error: result.reason.message
                }));
            
            if (failures.length > 0) {
                console.warn('Failed to load some participants:', failures);
            }
            
            if (this.participants.length === 0) {
                throw new Error('Failed to load any participant data');
            }
            
            this.renderParticipants();
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading participants:', error);
            throw error;
        }
    }

    async fetchGitHubUser(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`User "${username}" not found on GitHub`);
                } else if (response.status === 403) {
                    throw new Error('GitHub API rate limit exceeded. Please try again later.');
                } else {
                    throw new Error(`Failed to fetch data for "${username}": ${response.status}`);
                }
            }

            const userData = await response.json();
            
            // Add a small delay to avoid hitting rate limits too quickly
            await new Promise(resolve => setTimeout(resolve, 100));
            
            return userData;
            
        } catch (error) {
            console.error(`Error fetching ${username}:`, error);
            throw error;
        }
    }

    renderParticipants() {
        const grid = document.getElementById('participants-grid');
        
        if (this.participants.length === 0) {
            grid.innerHTML = `
                <div class="error">
                    <h3>No participants found</h3>
                    <p>Please check the configuration file and try again.</p>
                </div>
            `;
            return;
        }

        // Sort participants by name (or username if no name)
        const sortedParticipants = [...this.participants].sort((a, b) => {
            const nameA = (a.name || a.login).toLowerCase();
            const nameB = (b.name || b.login).toLowerCase();
            return nameA.localeCompare(nameB);
        });

        grid.innerHTML = sortedParticipants
            .map((participant, index) => this.createParticipantCard(participant, index))
            .join('');
    }

    createParticipantCard(participant, index) {
        const animationDelay = index * 0.1; // Stagger animations
        
        return `
            <div class="participant-card" style="animation-delay: ${animationDelay}s">
                <img 
                    src="${participant.avatar_url}" 
                    alt="${participant.name || participant.login}" 
                    class="profile-image"
                    loading="lazy"
                    onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iMTAiIGN5PSI4IiByPSIzIiBmaWxsPSIjOUI5QkExIi8+CjxwYXRoIGQ9Ik0xNyAxOGMwLTMuMzMzLTMuMTM0LTYtNy02cy03IDIuNjY3LTcgNiIgZmlsbD0iIzlCOUJBMSIvPgo8L3N2Zz4K'"
                >
                <div class="participant-name">${this.escapeHtml(participant.name || participant.login)}</div>
                <div class="participant-username">@${this.escapeHtml(participant.login)}</div>
                
                ${participant.bio ? `
                    <div class="participant-bio">${this.escapeHtml(participant.bio)}</div>
                ` : ''}
                
                <div class="participant-stats">
                    <div class="stat-item">
                        <span class="stat-number">${this.formatNumber(participant.public_repos || 0)}</span>
                        <span class="stat-label">Repos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.formatNumber(participant.followers || 0)}</span>
                        <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.formatNumber(participant.following || 0)}</span>
                        <span class="stat-label">Following</span>
                    </div>
                </div>
                
                <a href="${participant.html_url}" target="_blank" rel="noopener noreferrer" class="github-link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Profile
                </a>
            </div>
        `;
    }

    updateStats() {
        const countElement = document.getElementById('participant-count');
        const count = this.participants.length;
        countElement.textContent = `${count} participant${count !== 1 ? 's' : ''}`;
    }

    showContent() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            mainContent.classList.remove('content-hidden');
            mainContent.classList.add('content-visible');
        }, 1000); // Show loading for at least 1 second for better UX
    }

    showError(message) {
        const grid = document.getElementById('participants-grid');
        grid.innerHTML = `
            <div class="error">
                <h3>⚠️ Error Loading Participants</h3>
                <p>${this.escapeHtml(message)}</p>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 0.9rem;
                ">Try Again</button>
            </div>
        `;
        this.showContent();
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ParticipantDirectory();
});

// Handle errors globally
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
