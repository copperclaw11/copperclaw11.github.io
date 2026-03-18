// Stats Manager - Tracks and displays player statistics

class StatsManager {
    constructor() {
        // Ensure stats object exists
        if (!gameState.stats) {
            gameState.stats = {
                totalBitsEarned: 0,
                fastestReaction: null,
                clickerClicks: 0,
                gamesPlayed: {
                    reactionRush: 0,
                    copperClicker: 0
                }
            };
            saveGameState(gameState);
        }
    }

    recordReactionTime(time) {
        if (gameState.stats.fastestReaction === null || time < gameState.stats.fastestReaction) {
            gameState.stats.fastestReaction = time;
            saveGameState(gameState);
        }
    }

    recordClickerClick() {
        gameState.stats.clickerClicks++;
        saveGameState(gameState);
    }

    recordGamePlayed(gameType) {
        if (gameState.stats.gamesPlayed[gameType] !== undefined) {
            gameState.stats.gamesPlayed[gameType]++;
            saveGameState(gameState);
        }
    }

    render() {
        const statsContainer = document.getElementById('stats-content');
        if (!statsContainer) return;

        const stats = gameState.stats;

        const totalEarned = stats.totalBitsEarned;
        const balance = gameState.copperBits;
        const clicks = stats.clickerClicks;
        const gamesPlayedSum = stats.gamesPlayed.reactionRush + stats.gamesPlayed.copperClicker;

        statsContainer.innerHTML = `
            <div class="stat-card">
                <h3>Total Copper Bits Earned</h3>
                <div class="stat-value ${!Number.isFinite(totalEarned) ? 'infinity-value' : ''}">${formatNumber(totalEarned)}</div>
                <div class="stat-label">Lifetime earnings</div>
            </div>

            <div class="stat-card">
                <h3>Current Balance</h3>
                <div class="stat-value ${!Number.isFinite(balance) ? 'infinity-value' : ''}">${formatNumber(balance)}</div>
                <div class="stat-label">Copper Bits</div>
            </div>

            <div class="stat-card">
                <h3>Fastest Reaction Time</h3>
                <div class="stat-value">${stats.fastestReaction !== null ? stats.fastestReaction + 'ms' : 'N/A'}</div>
                <div class="stat-label">Reaction Rush</div>
            </div>

            <div class="stat-card">
                <h3>Total Clicks</h3>
                <div class="stat-value ${!Number.isFinite(clicks) ? 'infinity-value' : ''}">${formatNumber(clicks)}</div>
                <div class="stat-label">Copper Clicker</div>
            </div>

            <div class="stat-card">
                <h3>Games Played</h3>
                <div class="stat-value ${!Number.isFinite(gamesPlayedSum) ? 'infinity-value' : ''}">${formatNumber(gamesPlayedSum)}</div>
                <div class="stat-label">
                    Rush: ${stats.gamesPlayed.reactionRush} | 
                    Clicker: ${stats.gamesPlayed.copperClicker}
                </div>
            </div>
        `;
    }
}

// Initialize stats manager
let statsManager;
document.addEventListener('DOMContentLoaded', () => {
    statsManager = new StatsManager();
    window.statsManager = statsManager;
});
