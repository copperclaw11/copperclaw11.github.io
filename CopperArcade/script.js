// Global game state
let gameState = loadGameState();

// Migrate old saves to include clickerUpgrades
if (!gameState.clickerUpgrades) {
    gameState.clickerUpgrades = [
        { id: 'copper-pickaxe', level: 0 },
        { id: 'auto-miner', level: 0 },
        { id: 'efficient-mining', level: 0 },
        { id: 'copper-drill', level: 0 },
        { id: 'mega-smelter', level: 0 }
    ];
    saveGameState(gameState);
}

// CopperBitsManager - Manages currency
class CopperBitsManager {
    constructor() {
        this.updateDisplay();
    }

    addBits(amount) {
        gameState.copperBits += amount;
        gameState.stats.totalBitsEarned += amount;
        this.save();
        this.updateDisplay();
    }

    spendBits(amount) {
        if (this.canAfford(amount)) {
            gameState.copperBits -= amount;
            this.save();
            this.updateDisplay();
            return true;
        }
        return false;
    }

    getBalance() {
        return gameState.copperBits;
    }

    canAfford(amount) {
        return gameState.copperBits >= amount;
    }

    updateDisplay() {
        const display = document.getElementById('copper-bits-display');
        if (display) {
            display.textContent = formatNumber(gameState.copperBits);
        }
        
        // Update fullscreen currency displays
        const reactionBits = document.getElementById('reaction-rush-bits');
        const clickerBits = document.getElementById('clicker-bits');
        const targetBits = document.getElementById('target-shot-bits');
        
        if (reactionBits) {
            reactionBits.textContent = formatNumber(gameState.copperBits);
        }
        if (clickerBits) {
            clickerBits.textContent = formatNumber(gameState.copperBits);
        }
        if (targetBits) {
            targetBits.textContent = formatNumber(gameState.copperBits);
        }
    }

    save() {
        saveGameState(gameState);
    }
}

// GameManager - Handles navigation and page switching
class GameManager {
    constructor() {
        this.currentPage = 'home';
        this.currentGame = null;
        this.init();
    }

    init() {
        // Set up navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Set up game tabs
        const gameTabs = document.querySelectorAll('.game-tab');
        gameTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const game = tab.getAttribute('data-game');
                this.showGame(game);
            });
        });

        // Show home page by default
        this.showPage('home');
    }

    showPage(page, game = null) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === page) {
                btn.classList.add('active');
            }
        });

        // Hide all pages
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected page
        const pageElement = document.getElementById(`${page}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
            this.currentPage = page;
        }

        // If navigating to games page with a specific game, show that game
        if (page === 'games' && game) {
            this.showGame(game);
        } else if (page === 'games') {
            // Default to first game
            this.showGame('reaction-rush');
        }

        // Initialize page-specific functionality
        if (page === 'shop' && window.shopManager) {
            window.shopManager.render();
        }
        if (page === 'stats' && window.statsManager) {
            window.statsManager.render();
        }
    }

    showGame(gameId) {
        // Update game tabs
        document.querySelectorAll('.game-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-game') === gameId) {
                tab.classList.add('active');
            }
        });

        // Hide all games
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.remove('active');
        });

        // Show selected game
        const gameElement = document.getElementById(`${gameId}-game`);
        if (gameElement) {
            gameElement.classList.add('active');
            this.currentGame = gameId;
        }
    }
}

// Initialize on page load
let copperBitsManager;
let gameManager;

document.addEventListener('DOMContentLoaded', () => {
    copperBitsManager = new CopperBitsManager();
    gameManager = new GameManager();
    window.copperBitsManager = copperBitsManager;
    window.gameManager = gameManager;
    
    // Make gameState globally accessible
    window.gameState = gameState;
});
