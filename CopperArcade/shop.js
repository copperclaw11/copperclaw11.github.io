// Shop Manager - Handles upgrades and purchases

class ShopManager {
    constructor() {
        this.upgrades = [
            {
                id: 'faster-reflexes',
                name: 'Faster Reflexes',
                description: 'Increases Reaction Rush rewards by 10% per level',
                baseCost: 50,
                effect: (level) => 1 + (level * 0.1)
            }
        ];
    }

    getUpgradeCost(upgradeId, level) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return Infinity;
        
        // Cost scaling: base cost * (1.5 ^ level)
        return Math.floor(upgrade.baseCost * Math.pow(1.5, level));
    }

    getUpgradeLevel(upgradeId) {
        const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
        return upgrade ? upgrade.level : 0;
    }

    canPurchase(upgradeId) {
        const level = this.getUpgradeLevel(upgradeId);
        const cost = this.getUpgradeCost(upgradeId, level);
        return window.copperBitsManager.canAfford(cost);
    }

    purchase(upgradeId) {
        const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return false;

        const level = upgrade.level;
        const cost = this.getUpgradeCost(upgradeId, level);

        if (window.copperBitsManager.spendBits(cost)) {
            upgrade.level++;
            saveGameState(gameState);
            this.render();
            return true;
        }
        return false;
    }

    render() {
        const shopContainer = document.getElementById('shop-items');
        if (!shopContainer) return;

        shopContainer.innerHTML = '';

        this.upgrades.forEach(upgradeDef => {
            const level = this.getUpgradeLevel(upgradeDef.id);
            const cost = this.getUpgradeCost(upgradeDef.id, level);
            const canAfford = window.copperBitsManager.canAfford(cost);

            const item = document.createElement('div');
            item.className = 'shop-item-card';
            
            item.innerHTML = `
                <div class="shop-item-header">
                    <h3>${upgradeDef.name}</h3>
                    <span class="shop-item-level">Level ${level}</span>
                </div>
                <p class="shop-item-description">${upgradeDef.description}</p>
                <div class="shop-item-footer">
                    <div class="shop-item-cost">${formatNumber(cost)} bits</div>
                    <button class="btn-primary shop-buy-btn ${!canAfford ? 'disabled' : ''}" 
                            data-upgrade-id="${upgradeDef.id}" 
                            ${!canAfford ? 'disabled' : ''}>
                        Buy
                    </button>
                </div>
            `;

            const buyBtn = item.querySelector('.shop-buy-btn');
            if (buyBtn && canAfford) {
                buyBtn.addEventListener('click', () => {
                    if (this.purchase(upgradeDef.id)) {
                        this.render();
                    }
                });
            }

            shopContainer.appendChild(item);
        });
    }
}

// Initialize shop manager
let shopManager;
document.addEventListener('DOMContentLoaded', () => {
    shopManager = new ShopManager();
    window.shopManager = shopManager;
});
