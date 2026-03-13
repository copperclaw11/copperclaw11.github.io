// Shared utilities for Copper Arcade

// Save game state to localStorage
function saveGameState(gameState) {
    try {
        localStorage.setItem('copperArcade_save', JSON.stringify(gameState));
        return true;
    } catch (error) {
        console.error('Error saving game state:', error);
        return false;
    }
}

// Load game state from localStorage
function loadGameState() {
    try {
        const saved = localStorage.getItem('copperArcade_save');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading game state:', error);
    }
    
    // Return default state if nothing is saved
    return {
        copperBits: 0,
        upgrades: [
            { id: 'faster-reflexes', level: 0 },
            { id: 'target-scanner', level: 0 }
        ],
        clickerUpgrades: [
            { id: 'copper-pickaxe', level: 0 },
            { id: 'auto-miner', level: 0 },
            { id: 'efficient-mining', level: 0 },
            { id: 'copper-drill', level: 0 },
            { id: 'mega-smelter', level: 0 }
        ],
        stats: {
            totalBitsEarned: 0,
            fastestReaction: null,
            clickerClicks: 0,
            targetsHit: 0,
            gamesPlayed: {
                reactionRush: 0,
                copperClicker: 0,
                targetShot: 0
            }
        }
    };
}

// Format large numbers (1000 -> 1K, 1000000 -> 1M, etc.)
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return Math.floor(num).toString();
}

// Calculate upgrade effects for rewards
function applyUpgrades(baseReward, upgradeId, upgrades) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return baseReward;
    
    let multiplier = 1;
    
    switch (upgradeId) {
        case 'faster-reflexes':
            // +10% per level
            multiplier = 1 + (upgrade.level * 0.1);
            break;
        case 'target-scanner':
            // This affects visibility time, not rewards
            return baseReward;
    }
    
    return Math.floor(baseReward * multiplier);
}

// Get flat bonus from copper-magnet upgrade
function getCopperMagnetBonus(upgrades) {
    const upgrade = upgrades.find(u => u.id === 'copper-magnet');
    if (!upgrade) return 0;
    return upgrade.level * 5;
}

// Get target scanner visibility time bonus
function getTargetScannerBonus(upgrades) {
    const upgrade = upgrades.find(u => u.id === 'target-scanner');
    if (!upgrade) return 0;
    return upgrade.level * 0.5; // +0.5 seconds per level
}
