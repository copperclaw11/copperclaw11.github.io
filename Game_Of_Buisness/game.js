// Game of Business - Main Game Logic
class GameOfBusiness {
    constructor() {
        this.gameState = {
            currentBusiness: null,
            businesses: [],
            gameTime: 0,
            totalCustomers: 0,
            totalCountries: 0,
            availableSlots: 3,
            unlockedSlots: 3
        };
        
        this.timeScale = 600; // 10 minutes = 1 year (600 seconds)
        this.lastUpdate = Date.now();
        
        this.init();
    }
    
    init() {
        console.log('GameOfBusiness: Initializing...');
        
        try {
            this.loadGame();
            console.log('GameOfBusiness: Game loaded');
            
            this.startGameLoop();
            console.log('GameOfBusiness: Game loop started');
            
            this.setupEventListeners();
            console.log('GameOfBusiness: Event listeners setup complete');
            
            this.updateUI();
            console.log('GameOfBusiness: UI updated');
            
            // Ensure world is initialized before allowing business creation
            this.waitForWorld();
            console.log('GameOfBusiness: Waiting for world...');
        } catch (error) {
            console.error('GameOfBusiness: Error during initialization:', error);
        }
    }
    
    waitForWorld() {
        if (window.world && window.world.countries && window.world.countries.length > 0) {
            console.log('World is ready with', window.world.countries.length, 'countries');
        } else {
            console.log('Waiting for world to be ready...');
            setTimeout(() => this.waitForWorld(), 100);
        }
    }
    
    startGameLoop() {
        setInterval(() => {
            this.update();
        }, 1000); // Update every second
    }
    
    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        
        this.gameState.gameTime += deltaTime;
        
        // Update current business if exists
        if (this.gameState.currentBusiness) {
            this.gameState.currentBusiness.update(deltaTime);
        }
        
        // Check for new slot unlocks
        this.checkSlotUnlocks();
        
        this.updateUI();
    }
    
    checkSlotUnlocks() {
        if (this.gameState.currentBusiness) {
            const business = this.gameState.currentBusiness;
            if (business.countries >= 562 && business.money >= 1e100) { // 1 google
                if (this.gameState.unlockedSlots < 10) { // Max 10 slots
                    this.gameState.unlockedSlots++;
                    this.showNotification(`New business slot unlocked! You now have ${this.gameState.unlockedSlots} slots.`);
                }
            }
        }
    }
    
    createBusiness(type, name) {
        if (this.gameState.businesses.length >= this.gameState.availableSlots) {
            this.showNotification("No available business slots!");
            return false;
        }
        
        const business = new Business(type, name, this.gameState.gameTime);
        
        // Add 3 random starting locations after business creation
        this.addRandomStartingLocations(business);
        
        this.gameState.businesses.push(business);
        
        if (!this.gameState.currentBusiness) {
            this.gameState.currentBusiness = business;
        }
        
        this.updateUI();
        this.showNotification(`New business "${name}" created with 3 locations!`);
        return true;
    }
    
    addRandomStartingLocations(business) {
        // Wait for world to be available
        const checkWorld = () => {
            if (window.world && window.world.countries && window.world.countries.length > 0) {
                const availableCountries = [...window.world.countries];
                
                // Shuffle the countries to get random selection
                for (let i = availableCountries.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [availableCountries[i], availableCountries[j]] = [availableCountries[j], availableCountries[i]];
                }
                
                // Add 3 random locations
                for (let i = 0; i < 3 && i < availableCountries.length; i++) {
                    const country = availableCountries[i];
                    business.addLocation(country.name, country.name, country.population);
                }
                
                console.log(`Added 3 starting locations to ${business.name}:`, business.locations.map(l => l.country));
            } else {
                console.log('Waiting for world to be ready...');
                setTimeout(checkWorld, 50);
            }
        };
        
        checkWorld();
    }
    
    switchBusiness(businessIndex) {
        if (businessIndex >= 0 && businessIndex < this.gameState.businesses.length) {
            this.gameState.currentBusiness = this.gameState.businesses[businessIndex];
            this.updateUI();
        }
    }
    
    updateUI() {
        // Update header
        const business = this.gameState.currentBusiness;
        if (business) {
            document.getElementById('business-name').textContent = business.name;
            document.getElementById('business-type').textContent = business.type;
            document.getElementById('money-amount').textContent = this.formatMoney(business.money);
            document.getElementById('customer-count').textContent = `${business.customers.toLocaleString()} Customers`;
            document.getElementById('country-count').textContent = `${business.countries} Countries`;
        } else {
            document.getElementById('business-name').textContent = 'No Business Selected';
            document.getElementById('business-type').textContent = '-';
            document.getElementById('money-amount').textContent = '$0';
            document.getElementById('customer-count').textContent = '0 Customers';
            document.getElementById('country-count').textContent = '0 Countries';
        }
        
        // Update business slots
        this.updateBusinessSlots();
        
        // Update management panel
        this.updateManagementPanel();
    }
    
    updateBusinessSlots() {
        const slotsContainer = document.getElementById('slots-container');
        const slots = slotsContainer.querySelectorAll('.slot');
        
        slots.forEach((slot, index) => {
            const slotNumber = index + 1;
            const business = this.gameState.businesses[index];
            const isActive = this.gameState.currentBusiness === business;
            
            slot.className = `slot ${isActive ? 'active' : ''}`;
            slot.querySelector('.slot-status').textContent = business ? business.name : 'Empty';
        });
    }
    
    updateManagementPanel() {
        const business = this.gameState.currentBusiness;
        if (!business) return;
        
        document.getElementById('current-business-type').textContent = business.type;
        document.getElementById('founded-date').textContent = this.formatDate(business.foundedDate);
        document.getElementById('employee-count').textContent = business.employees.toLocaleString();
        document.getElementById('product-count').textContent = business.products.length;
        
        // Update locations
        const locationsList = document.getElementById('locations-list');
        if (business.locations.length === 0) {
            locationsList.innerHTML = '<p class="no-locations">No locations yet</p>';
        } else {
            locationsList.innerHTML = business.locations.map(location => 
                `<div class="location-item">
                    <strong>${location.country}</strong>
                    <br><small>Population: ${location.population.toLocaleString()}</small>
                </div>`
            ).join('');
        }
        
        // Update products
        const productsList = document.getElementById('products-list');
        if (business.products.length === 0) {
            productsList.innerHTML = '<p class="no-products">No products yet</p>';
        } else {
            productsList.innerHTML = business.products.map(product => 
                `<div class="product-item">
                    <strong>${product.name}</strong> - $${product.price}
                    <br><small>${product.description}</small>
                </div>`
            ).join('');
        }
    }
    
    formatMoney(amount) {
        if (amount >= 1e100) {
            return `$${(amount / 1e100).toFixed(2)} Google`;
        } else if (amount >= 1e9) {
            return `$${(amount / 1e9).toFixed(2)}B`;
        } else if (amount >= 1e6) {
            return `$${(amount / 1e6).toFixed(2)}M`;
        } else if (amount >= 1e3) {
            return `$${(amount / 1e3).toFixed(2)}K`;
        } else {
            return `$${amount.toFixed(2)}`;
        }
    }
    
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    }
    
    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'notification fade-in';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-green);
            color: var(--space-black);
            padding: 1rem;
            border-radius: 8px;
            z-index: 3000;
            box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    saveGame() {
        const saveData = {
            gameState: this.gameState,
            timestamp: Date.now()
        };
        localStorage.setItem('gameOfBusiness_save', JSON.stringify(saveData));
        this.showNotification('Game saved successfully!');
    }
    
    loadGame() {
        const saveData = localStorage.getItem('gameOfBusiness_save');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                this.gameState = data.gameState;
                
                // Reconstruct business objects
                this.gameState.businesses = this.gameState.businesses.map(businessData => {
                    const business = new Business(businessData.type, businessData.name, businessData.foundedDate);
                    Object.assign(business, businessData);
                    return business;
                });
                
                if (this.gameState.currentBusiness) {
                    const currentIndex = this.gameState.businesses.findIndex(b => b.id === this.gameState.currentBusiness.id);
                    if (currentIndex !== -1) {
                        this.gameState.currentBusiness = this.gameState.businesses[currentIndex];
                    }
                }
                
                this.showNotification('Game loaded successfully!');
            } catch (error) {
                console.error('Error loading game:', error);
                this.showNotification('Error loading game data');
            }
        }
    }
    
    setupEventListeners() {
        // New business button
        document.getElementById('new-business').addEventListener('click', () => {
            document.getElementById('new-business-modal').classList.remove('hidden');
        });
        
        // Business slots
        document.querySelectorAll('.slot').forEach((slot, index) => {
            slot.addEventListener('click', () => {
                this.switchBusiness(index);
            });
        });
        
        // Save/Load buttons
        document.getElementById('save-game').addEventListener('click', () => {
            this.saveGame();
        });
        
        document.getElementById('load-game').addEventListener('click', () => {
            this.loadGame();
        });
        
        // Action buttons
        document.getElementById('new-expansion').addEventListener('click', () => {
            if (this.gameState.currentBusiness) {
                document.getElementById('expansion-modal').classList.remove('hidden');
            } else {
                this.showNotification('No business selected!');
            }
        });
        
        document.getElementById('new-item').addEventListener('click', () => {
            if (this.gameState.currentBusiness) {
                document.getElementById('new-item-modal').classList.remove('hidden');
            } else {
                this.showNotification('No business selected!');
            }
        });
        
        document.getElementById('advertise').addEventListener('click', () => {
            if (this.gameState.currentBusiness) {
                document.getElementById('advertise-modal').classList.remove('hidden');
            } else {
                this.showNotification('No business selected!');
            }
        });
    }
}

// Game initialization moved to index.html to ensure proper script loading order 