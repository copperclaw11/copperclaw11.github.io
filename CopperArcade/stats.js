// Stats Manager - Tracks and displays player statistics

class StatsManager {
    constructor() {
        // Ensure stats object exists
        if (!gameState.stats) {
            gameState.stats = {
                totalBitsEarned: 0,
                fastestReaction: null,
                clickerClicks: 0,
                targetsHit: 0,
                gamesPlayed: {
                    reactionRush: 0,
                    copperClicker: 0,
                    targetShot: 0
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

    recordTargetHit() {
        gameState.stats.targetsHit++;
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

        statsContainer.innerHTML = `
            <div class="stat-card">
                <h3>Total Copper Bits Earned</h3>
                <div class="stat-value">${formatNumber(stats.totalBitsEarned)}</div>
                <div class="stat-label">Lifetime earnings</div>
            </div>

            <div class="stat-card">
                <h3>Current Balance</h3>
                <div class="stat-value">${formatNumber(gameState.copperBits)}</div>
                <div class="stat-label">Copper Bits</div>
            </div>

            <div class="stat-card">
                <h3>Fastest Reaction Time</h3>
                <div class="stat-value">${stats.fastestReaction !== null ? stats.fastestReaction + 'ms' : 'N/A'}</div>
                <div class="stat-label">Reaction Rush</div>
            </div>

            <div class="stat-card">
                <h3>Total Clicks</h3>
                <div class="stat-value">${formatNumber(stats.clickerClicks)}</div>
                <div class="stat-label">Copper Clicker</div>
            </div>

            <div class="stat-card">
                <h3>Targets Hit</h3>
                <div class="stat-value">${formatNumber(stats.targetsHit)}</div>
                <div class="stat-label">Target Shot</div>
            </div>

            <div class="stat-card">
                <h3>Games Played</h3>
                <div class="stat-value">${formatNumber(
                    stats.gamesPlayed.reactionRush + 
                    stats.gamesPlayed.copperClicker + 
                    stats.gamesPlayed.targetShot
                )}</div>
                <div class="stat-label">
                    Rush: ${stats.gamesPlayed.reactionRush} | 
                    Clicker: ${stats.gamesPlayed.copperClicker} | 
                    Shot: ${stats.gamesPlayed.targetShot}
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
