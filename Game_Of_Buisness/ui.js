// UI Management System
class UIManager {
    constructor() {
        this.currentModal = null;
        this.selectedCountry = null;
        this.mapZoom = 1;
        this.mapOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        console.log('UIManager: Initializing...');
        
        try {
            this.setupModalHandlers();
            console.log('UIManager: Modal handlers setup complete');
            
            this.setupMapHandlers();
            console.log('UIManager: Map handlers setup complete');
            
            this.setupFormHandlers();
            console.log('UIManager: Form handlers setup complete');
            
            this.setupSearchHandlers();
            console.log('UIManager: Search handlers setup complete');
            
            this.startMapRendering();
            console.log('UIManager: Map rendering started');
            
            // Initialize story system
            if (typeof storySystem !== 'undefined' && storySystem) {
                try {
                    storySystem.updateStory();
                    console.log('UIManager: Story system initialized');
                } catch (error) {
                    console.error('Error initializing story system:', error);
                }
            } else {
                console.warn('Story system not available yet');
            }
            
            console.log('UIManager: Initialization complete');
        } catch (error) {
            console.error('UIManager: Error during initialization:', error);
        }
    }
    
    setupModalHandlers() {
        // New Business Modal
        const newBusinessModal = document.getElementById('new-business-modal');
        const cancelNewBusiness = document.getElementById('cancel-new-business');
        
        cancelNewBusiness.addEventListener('click', () => {
            this.hideModal(newBusinessModal);
        });
        
        // Expansion Modal
        const expansionModal = document.getElementById('expansion-modal');
        const cancelExpansion = document.getElementById('cancel-expansion');
        
        cancelExpansion.addEventListener('click', () => {
            this.hideModal(expansionModal);
        });
        
        // New Item Modal
        const newItemModal = document.getElementById('new-item-modal');
        const cancelNewItem = document.getElementById('cancel-new-item');
        
        cancelNewItem.addEventListener('click', () => {
            this.hideModal(newItemModal);
        });
        
        // Advertise Modal
        const advertiseModal = document.getElementById('advertise-modal');
        const cancelAdvertise = document.getElementById('cancel-advertise');
        
        cancelAdvertise.addEventListener('click', () => {
            this.hideModal(advertiseModal);
        });
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target);
            }
        });
    }
    
    setupMapHandlers() {
        const worldMap = document.getElementById('world-map');
        const expansionMap = document.getElementById('expansion-map');
        
        // World map interactions
        if (worldMap) {
            worldMap.addEventListener('click', (e) => {
                this.handleMapClick(e, worldMap);
            });
            
            worldMap.addEventListener('mousemove', (e) => {
                this.handleMapHover(e, worldMap);
            });
            
            worldMap.addEventListener('mouseleave', () => {
                this.hideCityInfo();
            });
            
            // Add mouse drag for panning
            worldMap.addEventListener('mousedown', (e) => {
                this.startMapDrag(e);
            });
            
            worldMap.addEventListener('mousemove', (e) => {
                this.handleMapDrag(e);
            });
            
            worldMap.addEventListener('mouseup', () => {
                this.endMapDrag();
            });
            
            // Add mouse wheel for zoom
            worldMap.addEventListener('wheel', (e) => {
                e.preventDefault();
                this.handleMapWheel(e);
            });
        }
        
        // Expansion map interactions
        if (expansionMap) {
            expansionMap.addEventListener('click', (e) => {
                this.handleExpansionMapClick(e, expansionMap);
            });
        }
        
        // Map controls
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const resetView = document.getElementById('reset-view');
        
        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                this.zoomMap(1.2);
            });
        }
        
        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                this.zoomMap(0.8);
            });
        }
        
        if (resetView) {
            resetView.addEventListener('click', () => {
                this.resetMapView();
            });
        }
    }
    
    setupFormHandlers() {
        // New Business Form
        const newBusinessForm = document.getElementById('new-business-form');
        if (newBusinessForm) {
            newBusinessForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewBusinessSubmit();
            });
        }
        
        // New Item Form
        const newItemForm = document.getElementById('new-item-form');
        if (newItemForm) {
            newItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewItemSubmit();
            });
        }
        
        // Expansion confirmation
        const confirmExpansion = document.getElementById('confirm-expansion');
        if (confirmExpansion) {
            confirmExpansion.addEventListener('click', () => {
                this.handleExpansionConfirm();
            });
        }
        
        // Advertise confirmation
        const confirmAdvertise = document.getElementById('confirm-advertise');
        if (confirmAdvertise) {
            confirmAdvertise.addEventListener('click', () => {
                this.handleAdvertiseConfirm();
            });
        }
    }
    
    setupSearchHandlers() {
        const businessTypeSearch = document.getElementById('business-type-search');
        if (businessTypeSearch) {
            businessTypeSearch.addEventListener('input', (e) => {
                this.handleBusinessTypeSearch(e.target.value);
            });
        }
    }
    
    handleMapClick(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Convert screen coordinates to world coordinates
        // Transformation order: translate(offsetX, offsetY) then scale(zoom, zoom)
        // To reverse: first divide by zoom, then subtract offset
        const worldX = mouseX / this.mapZoom - this.mapOffset.x / this.mapZoom;
        const worldY = mouseY / this.mapZoom - this.mapOffset.y / this.mapZoom;
        
        const country = world.getCountryAtPosition(worldX, worldY);
        if (country) {
            this.selectedCountry = country;
            this.showCountryInfo(country, e.clientX, e.clientY);
        }
    }
    
    handleMapHover(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Convert screen coordinates to world coordinates
        // Transformation order: translate(offsetX, offsetY) then scale(zoom, zoom)
        // To reverse: first divide by zoom, then subtract offset
        const worldX = mouseX / this.mapZoom - this.mapOffset.x / this.mapZoom;
        const worldY = mouseY / this.mapZoom - this.mapOffset.y / this.mapZoom;
        
        const country = world.getCountryAtPosition(worldX, worldY);
        if (country) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'crosshair';
        }
    }
    
    handleExpansionMapClick(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const country = world.getCountryAtPosition(mouseX, mouseY);
        if (country) {
            this.selectedCountry = country;
            this.updateExpansionMap(country);
        }
    }
    
    showCountryInfo(country, x, y) {
        const cityInfo = document.getElementById('city-info');
        const cityName = document.getElementById('city-name');
        const cityPopulation = document.getElementById('city-population');
        
        if (cityInfo && cityName && cityPopulation) {
            cityName.textContent = country.name;
            cityPopulation.textContent = `Population: ${country.population.toLocaleString()}`;
            
            cityInfo.style.left = `${x + 10}px`;
            cityInfo.style.top = `${y - 10}px`;
            cityInfo.classList.remove('hidden');
        }
    }
    
    hideCityInfo() {
        const cityInfo = document.getElementById('city-info');
        if (cityInfo) {
            cityInfo.classList.add('hidden');
        }
    }
    
    updateExpansionMap(selectedCountry) {
        const expansionMap = document.getElementById('expansion-map');
        if (expansionMap) {
            const ctx = expansionMap.getContext('2d');
            ctx.clearRect(0, 0, expansionMap.width, expansionMap.height);
            
            // Draw world with selected country highlighted (no zoom for expansion map)
            world.drawWorld(expansionMap, null, 1, 0, 0);
            
            // Highlight selected country
            if (selectedCountry) {
                // Draw selection circle
                ctx.fillStyle = '#ff6b6b';
                ctx.beginPath();
                ctx.arc(selectedCountry.x, selectedCountry.y, 20, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 5;
                ctx.stroke();
                
                // Draw country name
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.shadowColor = '#000000';
                ctx.shadowBlur = 3;
                ctx.fillText(selectedCountry.name, selectedCountry.x, selectedCountry.y - 25);
                ctx.shadowBlur = 0;
                
                // Update modal title to show selected country
                const modalTitle = document.querySelector('#expansion-modal .modal-content h2');
                if (modalTitle) {
                    modalTitle.textContent = `New Expansion - ${selectedCountry.name}`;
                }
                
                // Update confirm button text
                const confirmButton = document.getElementById('confirm-expansion');
                if (confirmButton) {
                    confirmButton.textContent = `Expand to ${selectedCountry.name}`;
                }
            }
        }
    }
    
    zoomMap(factor) {
        const oldZoom = this.mapZoom;
        this.mapZoom *= factor;
        this.mapZoom = Math.max(0.1, Math.min(10, this.mapZoom)); // Extended zoom range: 0.1x to 10x
        
        // Adjust offset to keep the view centered and within boundaries
        this.mapOffset.x = this.constrainOffset(this.mapOffset.x, 'x');
        this.mapOffset.y = this.constrainOffset(this.mapOffset.y, 'y');
        
        this.renderMap();
    }
    
    startMapDrag(e) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = 'grabbing';
    }
    
    handleMapDrag(e) {
        if (this.isDragging) {
            const deltaX = e.clientX - this.dragStart.x;
            const deltaY = e.clientY - this.dragStart.y;
            
            // Calculate new offset with boundaries
            const newOffsetX = this.mapOffset.x + deltaX;
            const newOffsetY = this.mapOffset.y + deltaY;
            
            // Apply boundaries to prevent going too far
            this.mapOffset.x = this.constrainOffset(newOffsetX, 'x');
            this.mapOffset.y = this.constrainOffset(newOffsetY, 'y');
            
            this.dragStart = { x: e.clientX, y: e.clientY };
            this.renderMap();
        }
    }
    
    constrainOffset(offset, axis) {
        const canvas = document.getElementById('world-map');
        if (!canvas) return offset;
        
        const worldWidth = 800; // World width in world coordinates
        const worldHeight = 600; // World height in world coordinates
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        if (axis === 'x') {
            const minOffset = canvasWidth - worldWidth * this.mapZoom;
            const maxOffset = 0;
            return Math.max(minOffset, Math.min(maxOffset, offset));
        } else {
            const minOffset = canvasHeight - worldHeight * this.mapZoom;
            const maxOffset = 0;
            return Math.max(minOffset, Math.min(maxOffset, offset));
        }
    }
    
    endMapDrag() {
        this.isDragging = false;
        document.body.style.cursor = 'default';
    }
    
    handleMapWheel(e) {
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoomMap(zoomFactor);
    }
    
    resetMapView() {
        this.mapZoom = 1;
        this.mapOffset = { x: 0, y: 0 };
        this.renderMap();
    }
    
    startMapRendering() {
        setInterval(() => {
            this.renderMap();
        }, 1000); // Update map every second
    }
    
    renderMap() {
        const worldMap = document.getElementById('world-map');
        if (worldMap && world && world.drawWorld) {
            try {
                world.drawWorld(worldMap, window.game?.gameState?.currentBusiness, this.mapZoom, this.mapOffset.x, this.mapOffset.y);
                this.drawZoomIndicator(worldMap);
            } catch (error) {
                console.error('Error rendering map:', error);
            }
        } else {
            console.warn('Map rendering not ready yet');
        }
    }
    
    drawZoomIndicator(canvas) {
        const ctx = canvas.getContext('2d');
        const zoomText = `${(this.mapZoom * 100).toFixed(0)}%`;
        
        // Draw zoom indicator background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 80, 30);
        
        // Draw zoom text
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(zoomText, 50, 25);
        
        // Draw zoom level bar
        const maxZoom = 10;
        const zoomPercentage = (this.mapZoom / maxZoom) * 100;
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(10, 45, (80 * zoomPercentage) / 100, 3);
    }
    
    handleBusinessTypeSearch(query) {
        const resultsContainer = document.getElementById('business-type-results');
        if (!resultsContainer) return;
        
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        // Check if BusinessTypes is available
        if (typeof BusinessTypes === 'undefined' || !BusinessTypes.search) {
            console.warn('BusinessTypes not available yet');
            return;
        }
        
        try {
            const results = BusinessTypes.search(query);
            resultsContainer.innerHTML = results.slice(0, 10).map(type => 
                `<div class="search-result-item" data-type="${type}">${type}</div>`
            ).join('');
            
            // Add click handlers to results
            resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('business-type-search').value = item.dataset.type;
                    resultsContainer.innerHTML = '';
                });
            });
        } catch (error) {
            console.error('Error searching business types:', error);
        }
    }
    
    handleNewBusinessSubmit() {
        const typeInput = document.getElementById('business-type-search');
        const nameInput = document.getElementById('business-name-input');
        
        const type = typeInput.value.trim();
        const name = nameInput.value.trim();
        
        if (!type || !name) {
            alert('Please enter both business type and name.');
            return;
        }
        
        if (window.game) {
            const success = window.game.createBusiness(type, name);
            if (success) {
                this.hideModal(document.getElementById('new-business-modal'));
                typeInput.value = '';
                nameInput.value = '';
                
                // Update story
                if (typeof storySystem !== 'undefined' && storySystem) {
                    try {
                        storySystem.updateStory(window.game.gameState.currentBusiness);
                    } catch (error) {
                        console.error('Error updating story:', error);
                    }
                }
            }
        }
    }
    
    handleNewItemSubmit() {
        const nameInput = document.getElementById('item-name');
        const descriptionInput = document.getElementById('item-description');
        const priceInput = document.getElementById('item-price');
        
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const price = parseFloat(priceInput.value);
        
        if (!name || !description || isNaN(price) || price < 0) {
            alert('Please enter valid product information.');
            return;
        }
        
        if (window.game && window.game.gameState.currentBusiness) {
            window.game.gameState.currentBusiness.addProduct(name, description, price);
            this.hideModal(document.getElementById('new-item-modal'));
            
            nameInput.value = '';
            descriptionInput.value = '';
            priceInput.value = '';
            
            window.game.showNotification(`New product "${name}" created!`);
        }
    }
    
    handleExpansionConfirm() {
        if (!this.selectedCountry) {
            alert('Please select a country to expand to.');
            return;
        }
        
        if (window.game && window.game.gameState.currentBusiness) {
            const business = window.game.gameState.currentBusiness;
            const expansionCost = 10000; // Reduced expansion cost
            
            if (business.canAfford(expansionCost)) {
                business.addLocation(this.selectedCountry.name, this.selectedCountry.name, this.selectedCountry.population);
                business.money -= expansionCost;
                
                this.hideModal(document.getElementById('expansion-modal'));
                const countryName = this.selectedCountry.name; // Store before clearing
                this.selectedCountry = null;
                
                window.game.showNotification(`Expanded to ${countryName}!`);
            } else {
                alert('Insufficient funds for expansion.');
            }
        }
    }
    
    handleAdvertiseConfirm() {
        const regionSelect = document.getElementById('advertise-region');
        const budgetInput = document.getElementById('advertise-budget');
        
        const region = regionSelect.value;
        const budget = parseInt(budgetInput.value);
        
        if (!region || isNaN(budget) || budget < 1000) {
            alert('Please select a region and enter a valid budget (minimum $1,000).');
            return;
        }
        
        if (window.game && window.game.gameState.currentBusiness) {
            const business = window.game.gameState.currentBusiness;
            
            if (business.canAfford(budget)) {
                business.advertise(region, budget);
                
                this.hideModal(document.getElementById('advertise-modal'));
                regionSelect.value = '';
                budgetInput.value = '';
                
                window.game.showNotification(`Advertising campaign launched in ${region}!`);
            } else {
                alert('Insufficient funds for advertising campaign.');
            }
        }
    }
    
    showModal(modal) {
        if (this.currentModal) {
            this.hideModal(this.currentModal);
        }
        
        modal.classList.remove('hidden');
        this.currentModal = modal;
        
        // Special handling for expansion modal
        if (modal.id === 'expansion-modal') {
            this.updateExpansionMap();
        }
        
        // Special handling for advertise modal
        if (modal.id === 'advertise-modal') {
            this.populateAdvertiseRegions();
        }
    }
    
    hideModal(modal) {
        modal.classList.add('hidden');
        this.currentModal = null;
        
        // Reset expansion modal if it's being closed
        if (modal.id === 'expansion-modal') {
            this.selectedCountry = null;
            // Reset modal title
            const modalTitle = document.querySelector('#expansion-modal .modal-content h2');
            if (modalTitle) {
                modalTitle.textContent = 'New Expansion';
            }
            // Reset confirm button
            const confirmButton = document.getElementById('confirm-expansion');
            if (confirmButton) {
                confirmButton.textContent = 'Expand Here';
            }
        }
    }
    
    populateAdvertiseRegions() {
        const regionSelect = document.getElementById('advertise-region');
        if (regionSelect && world) {
            const continents = world.getContinents();
            regionSelect.innerHTML = '<option value="">Choose a region...</option>';
            
            continents.forEach(continent => {
                const option = document.createElement('option');
                option.value = continent.name;
                option.textContent = continent.name;
                regionSelect.appendChild(option);
            });
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification fade-in notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-green)' : type === 'warning' ? 'var(--warning-orange)' : type === 'error' ? 'var(--error-red)' : 'var(--primary-green)'};
            color: ${type === 'success' || type === 'warning' || type === 'error' ? 'white' : 'var(--space-black)'};
            padding: 1rem;
            border-radius: 8px;
            z-index: 3000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    updateLoadingState(loading) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            if (loading) {
                loadingOverlay.classList.remove('hidden');
            } else {
                loadingOverlay.classList.add('hidden');
            }
        }
    }
}

// UI initialization moved to index.html to ensure proper script loading order 