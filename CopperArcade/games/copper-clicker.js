// Copper Clicker Game

class CopperClicker {
    constructor() {
        this.clickValue = 1;
        this.passiveIncome = 0;
        this.passiveInterval = null;
        this.autoClickInterval = null;
        this.isPaused = false;
        this.isFullscreen = false;
        this.particles = [];
        this.particleContainer = null;
        this.shopOpen = false;
        this.init();
    }

    init() {
        const oreBlock = document.getElementById('ore-block');
        if (!oreBlock) return;

        this.particleContainer = document.getElementById('particle-container');

        oreBlock.addEventListener('click', (e) => {
            if (!this.isPaused) {
                this.handleClick(e);
            }
        });

        const pauseBtn = document.getElementById('clicker-pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.togglePause();
            });
        }

        const fullscreenBtn = document.getElementById('clicker-fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        const shopBtn = document.getElementById('clicker-shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                this.toggleShop();
            });
        }

        // Attach close button handler using event delegation on the shop panel
        const shopPanel = document.getElementById('clicker-shop-panel');
        if (shopPanel) {
            shopPanel.addEventListener('click', (e) => {
                // Check if click is on close button or icon inside it
                if (e.target.id === 'clicker-shop-close-btn' || 
                    e.target.closest('#clicker-shop-close-btn') ||
                    (e.target.tagName === 'I' && e.target.closest('.shop-close-btn'))) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeShop();
                }
            });
        }

        // Initialize shop
        this.initShop();

        // Listen for page visibility changes (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else if (!document.hidden && this.isPaused) {
                // Auto-resume if tab becomes visible and game was auto-paused
                this.resume();
            }
        });

        // Start passive income loop
        this.startPassiveIncome();
        
        // Start auto-clicker if applicable
        this.startAutoClicker();
        
        // Update display
        this.updateDisplay();
    }

    initShop() {
        // Ensure clickerUpgrades exist in gameState
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
        this.renderShop();
    }

    getClickerUpgradeLevel(upgradeId) {
        const upgrade = gameState.clickerUpgrades.find(u => u.id === upgradeId);
        return upgrade ? upgrade.level : 0;
    }

    getClickerUpgradeCost(upgradeId, level) {
        const costs = {
            'copper-pickaxe': 50,
            'auto-miner': 100,
            'efficient-mining': 150,
            'copper-drill': 200,
            'mega-smelter': 300
        };
        const baseCost = costs[upgradeId] || 100;
        return Math.floor(baseCost * Math.pow(1.5, level));
    }

    purchaseClickerUpgrade(upgradeId) {
        const upgrade = gameState.clickerUpgrades.find(u => u.id === upgradeId);
        if (!upgrade) return false;

        const level = upgrade.level;
        const cost = this.getClickerUpgradeCost(upgradeId, level);

        if (window.copperBitsManager && window.copperBitsManager.spendBits(cost)) {
            upgrade.level++;
            saveGameState(gameState);
            this.renderShop();
            this.updateDisplay();
            
            // Restart auto-clicker if drill was upgraded
            if (upgradeId === 'copper-drill') {
                this.startAutoClicker();
            }
            return true;
        }
        return false;
    }

    renderShop() {
        const shopContainer = document.getElementById('clicker-shop-items');
        if (!shopContainer) return;

        const upgrades = [
            {
                id: 'copper-pickaxe',
                name: 'Copper Pickaxe',
                description: 'Increases click value by 2x per level',
                icon: 'fas fa-hammer'
            },
            {
                id: 'auto-miner',
                name: 'Auto Miner',
                description: 'Generates +1 bit/sec per level',
                icon: 'fas fa-cog'
            },
            {
                id: 'efficient-mining',
                name: 'Efficient Mining',
                description: 'Increases click value by 50% per level',
                icon: 'fas fa-tachometer-alt'
            },
            {
                id: 'copper-drill',
                name: 'Copper Drill',
                description: 'Auto-clicks once per 2 seconds per level',
                icon: 'fas fa-tools'
            },
            {
                id: 'mega-smelter',
                name: 'Mega Smelter',
                description: 'Doubles passive income per level',
                icon: 'fas fa-fire'
            }
        ];

        shopContainer.innerHTML = '';

        upgrades.forEach(upgradeDef => {
            const level = this.getClickerUpgradeLevel(upgradeDef.id);
            const cost = this.getClickerUpgradeCost(upgradeDef.id, level);
            const canAfford = window.copperBitsManager && window.copperBitsManager.canAfford(cost);

            const item = document.createElement('div');
            item.className = 'clicker-shop-item';
            
            item.innerHTML = `
                <div class="shop-item-icon">
                    <i class="${upgradeDef.icon}"></i>
                </div>
                <div class="shop-item-content">
                    <h4>${upgradeDef.name}</h4>
                    <p>${upgradeDef.description}</p>
                    <div class="shop-item-footer">
                        <div class="shop-item-info">
                            <span class="shop-cost">${formatNumber(cost)} bits</span>
                            <span class="shop-level">Level: ${level}</span>
                        </div>
                        <button class="btn-primary shop-buy-btn ${!canAfford ? 'disabled' : ''}" 
                                data-upgrade-id="${upgradeDef.id}"
                                ${!canAfford ? 'disabled' : ''}>
                            Buy
                        </button>
                    </div>
                </div>
            `;

            const buyBtn = item.querySelector('.shop-buy-btn');
            buyBtn.addEventListener('click', () => {
                if (this.purchaseClickerUpgrade(upgradeDef.id)) {
                    buyBtn.textContent = 'Purchased!';
                    buyBtn.disabled = true;
                    setTimeout(() => {
                        this.renderShop();
                    }, 500);
                }
            });

            shopContainer.appendChild(item);
        });
    }

    toggleShop() {
        const shopPanel = document.getElementById('clicker-shop-panel');
        if (!shopPanel) return;

        this.shopOpen = !this.shopOpen;
        if (this.shopOpen) {
            shopPanel.classList.add('open');
            this.renderShop();
        } else {
            shopPanel.classList.remove('open');
        }
    }

    closeShop() {
        const shopPanel = document.getElementById('clicker-shop-panel');
        if (!shopPanel) return;

        this.shopOpen = false;
        shopPanel.classList.remove('open');
    }

    calculateClickValue() {
        let baseValue = 1;
        
        // Apply Copper Pickaxe (2x per level)
        const pickaxeLevel = this.getClickerUpgradeLevel('copper-pickaxe');
        baseValue *= Math.pow(2, pickaxeLevel);
        
        // Apply Efficient Mining (50% per level)
        const efficientLevel = this.getClickerUpgradeLevel('efficient-mining');
        baseValue *= (1 + (efficientLevel * 0.5));
        
        return Math.floor(baseValue);
    }

    calculatePassiveIncome() {
        let income = 0;
        
        // Auto Miner: +1 bit/sec per level
        const autoMinerLevel = this.getClickerUpgradeLevel('auto-miner');
        income += autoMinerLevel;
        
        // Mega Smelter: doubles passive income per level
        const smelterLevel = this.getClickerUpgradeLevel('mega-smelter');
        income *= Math.pow(2, smelterLevel);
        
        return Math.floor(income);
    }

    handleClick(e) {
        const clickValue = this.calculateClickValue();
        
        // Add visual feedback
        const oreBlock = document.getElementById('ore-block');
        oreBlock.classList.add('clicking');
        setTimeout(() => {
            oreBlock.classList.remove('clicking');
        }, 200);

        // Award bits
        if (window.copperBitsManager) {
            window.copperBitsManager.addBits(clickValue);
        }

        // Record stats
        if (window.statsManager) {
            window.statsManager.recordClickerClick();
        }

        // Create particle effects
        this.createParticles(e, clickValue);
    }

    createParticles(e, value) {
        if (!this.particleContainer) return;

        const oreBlock = document.getElementById('ore-block');
        const rect = oreBlock.getBoundingClientRect();
        const containerRect = this.particleContainer.getBoundingClientRect();
        
        const centerX = rect.left + rect.width / 2 - containerRect.left;
        const centerY = rect.top + rect.height / 2 - containerRect.top;

        // Main value particle
        const mainParticle = document.createElement('div');
        mainParticle.className = 'particle';
        mainParticle.textContent = `+${formatNumber(value)}`;
        mainParticle.style.left = centerX + 'px';
        mainParticle.style.top = centerY + 'px';
        
        // Random horizontal offset
        const xOffset = (Math.random() - 0.5) * 100;
        mainParticle.style.setProperty('--particle-x', xOffset + 'px');
        mainParticle.style.animation = 'particleFloat 1.5s ease-out forwards';
        
        this.particleContainer.appendChild(mainParticle);

        // Create sparkle particles
        const sparkleCount = Math.min(8, Math.floor(value / 5) + 3);
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'particle-sparkle';
                
                const angle = (Math.PI * 2 * i) / sparkleCount;
                const distance = 50 + Math.random() * 30;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                sparkle.style.left = x + 'px';
                sparkle.style.top = y + 'px';
                
                const sparkleX = (Math.random() - 0.5) * 80;
                sparkle.style.setProperty('--particle-x', sparkleX + 'px');
                sparkle.style.animation = 'particleFloat 1s ease-out forwards';
                
                this.particleContainer.appendChild(sparkle);

                // Remove after animation
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1000);
            }, i * 20);
        }

        // Remove main particle after animation
        setTimeout(() => {
            if (mainParticle.parentNode) {
                mainParticle.parentNode.removeChild(mainParticle);
            }
        }, 1500);
    }

    startPassiveIncome() {
        // Update passive income every second
        this.passiveInterval = setInterval(() => {
            if (!this.isPaused) {
                const income = this.calculatePassiveIncome();
                if (income > 0 && window.copperBitsManager) {
                    window.copperBitsManager.addBits(income);
                }
            }
        }, 1000);
    }

    startAutoClicker() {
        // Stop existing auto-clicker
        if (this.autoClickInterval) {
            clearInterval(this.autoClickInterval);
            this.autoClickInterval = null;
        }

        // Get Copper Drill level
        const drillLevel = this.getClickerUpgradeLevel('copper-drill');
        if (drillLevel === 0) return;

        // Auto-click every 2 seconds per level (so level 1 = every 2s, level 2 = every 1s, etc.)
        const clickInterval = 2000 / drillLevel;
        
        this.autoClickInterval = setInterval(() => {
            if (!this.isPaused) {
                const oreBlock = document.getElementById('ore-block');
                if (oreBlock) {
                    // Simulate a click
                    const clickValue = this.calculateClickValue();
                    
                    // Award bits
                    if (window.copperBitsManager) {
                        window.copperBitsManager.addBits(clickValue);
                    }

                    // Record stats
                    if (window.statsManager) {
                        window.statsManager.recordClickerClick();
                    }

                    // Create particles at center
                    const rect = oreBlock.getBoundingClientRect();
                    const fakeEvent = {
                        clientX: rect.left + rect.width / 2,
                        clientY: rect.top + rect.height / 2
                    };
                    this.createParticles(fakeEvent, clickValue);
                }
            }
        }, clickInterval);
    }

    stopAutoClicker() {
        if (this.autoClickInterval) {
            clearInterval(this.autoClickInterval);
            this.autoClickInterval = null;
        }
    }

    stopPassiveIncome() {
        if (this.passiveInterval) {
            clearInterval(this.passiveInterval);
            this.passiveInterval = null;
        }
    }

    pause() {
        if (this.isPaused) return;
        this.isPaused = true;
        
        const pauseBtn = document.getElementById('clicker-pause-btn');
        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        }
    }

    resume() {
        if (!this.isPaused) return;
        this.isPaused = false;
        
        const pauseBtn = document.getElementById('clicker-pause-btn');
        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
        
        // Restart auto-clicker
        this.startAutoClicker();
    }

    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    toggleFullscreen() {
        const gameArea = document.getElementById('copper-clicker-area');
        const fullscreenBtn = document.getElementById('clicker-fullscreen-btn');
        if (!gameArea) return;

        const updateButton = () => {
            if (fullscreenBtn) {
                if (this.isFullscreen) {
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
                } else {
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
                }
            }
        };

        if (!this.isFullscreen) {
            // Enter fullscreen
            const enterFullscreen = () => {
                if (gameArea.requestFullscreen) {
                    return gameArea.requestFullscreen();
                } else if (gameArea.webkitRequestFullscreen) {
                    return gameArea.webkitRequestFullscreen();
                } else if (gameArea.mozRequestFullScreen) {
                    return gameArea.mozRequestFullScreen();
                } else if (gameArea.msRequestFullscreen) {
                    return gameArea.msRequestFullscreen();
                }
                return Promise.reject('Fullscreen not supported');
            };

            enterFullscreen().then(() => {
                this.isFullscreen = true;
                updateButton();
            }).catch(() => {
                // Fullscreen failed or not supported
            });
        } else {
            // Exit fullscreen
            const exitFullscreen = () => {
                if (document.exitFullscreen) {
                    return document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    return document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    return document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    return document.msExitFullscreen();
                }
                return Promise.reject('Exit fullscreen not supported');
            };

            exitFullscreen().then(() => {
                this.isFullscreen = false;
                updateButton();
            }).catch(() => {
                // Exit fullscreen failed
            });
        }

        // Listen for fullscreen changes (in case user exits via ESC key)
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
            
            if (this.isFullscreen !== isCurrentlyFullscreen) {
                this.isFullscreen = isCurrentlyFullscreen;
                updateButton();
            }
        };

        // Remove old listeners and add new ones
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange);

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
    }

    updateDisplay() {
        const clickValueDisplay = document.getElementById('click-value');
        const passiveIncomeDisplay = document.getElementById('passive-income');

        if (clickValueDisplay) {
            this.clickValue = this.calculateClickValue();
            clickValueDisplay.textContent = formatNumber(this.clickValue);
        }

        if (passiveIncomeDisplay) {
            this.passiveIncome = this.calculatePassiveIncome();
            passiveIncomeDisplay.textContent = formatNumber(this.passiveIncome);
        }

        // Update every second to reflect upgrade changes
        setTimeout(() => {
            this.updateDisplay();
        }, 1000);
    }
}

// Initialize game when DOM is ready
let copperClicker;
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other systems to initialize
    setTimeout(() => {
        copperClicker = new CopperClicker();
        window.copperClicker = copperClicker;
    }, 100);
});
