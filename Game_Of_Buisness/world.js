// World Generation System - Ultra Simple and Robust
class WorldGenerator {
    constructor() {
        try {
            this.continents = [
                { name: "Nova Verdania", color: "#10b981", size: 0.22, x: 0.15, y: 0.20 },
                { name: "Emerald Expanse", color: "#059669", size: 0.20, x: 0.40, y: 0.15 },
                { name: "Viridian Vale", color: "#047857", size: 0.18, x: 0.65, y: 0.25 },
                { name: "Jade Junction", color: "#065f46", size: 0.21, x: 0.80, y: 0.20 },
                { name: "Sylvan Sphere", color: "#064e3b", size: 0.19, x: 0.20, y: 0.40 },
                { name: "Forest Frontier", color: "#14532d", size: 0.17, x: 0.45, y: 0.45 },
                { name: "Mossy Meadows", color: "#166534", size: 0.16, x: 0.70, y: 0.40 },
                { name: "Pine Plateau", color: "#15803d", size: 0.18, x: 0.85, y: 0.35 },
                { name: "Cedar Crest", color: "#16a34a", size: 0.20, x: 0.10, y: 0.60 },
                { name: "Oak Oasis", color: "#22c55e", size: 0.17, x: 0.35, y: 0.65 },
                { name: "Willow Way", color: "#4ade80", size: 0.19, x: 0.60, y: 0.60 },
                { name: "Birch Basin", color: "#10b981", size: 0.18, x: 0.75, y: 0.55 },
                { name: "Maple Mesa", color: "#059669", size: 0.23, x: 0.90, y: 0.70 },
                { name: "Elm Empire", color: "#047857", size: 0.15, x: 0.50, y: 0.80 }
            ];
            
            this.seaColor = "#4c1d95";
            this.starField = [];
            this.countries = [];
            this.continentShapes = [];
            
            // Always use the simple generation to avoid any errors
            this.generateSimpleWorld();
        } catch (error) {
            console.error('Error in WorldGenerator constructor:', error);
            // Set up minimal fallback data
            this.continents = [{ name: "Test Continent", color: "#10b981", size: 0.22, x: 0.5, y: 0.5 }];
            this.seaColor = "#4c1d95";
            this.starField = [];
            this.countries = [{ id: 1, name: "Test Country", continent: "Test Continent", population: 1000000, gdp: 1000000000, x: 400, y: 300, radius: 20 }];
            this.continentShapes = [];
        }
    }
    
    generateSimpleWorld() {
        try {
            console.log('Generating simple world...');
            
            // Generate simple starfield
            for (let i = 0; i < 100; i++) {
                this.starField.push({
                    x: Math.random() * 800,
                    y: Math.random() * 600,
                    size: Math.random() * 2 + 0.5,
                    brightness: Math.random() * 0.8 + 0.2,
                    twinkle: Math.random() * Math.PI * 2
                });
            }
            
            // Generate simple continent shapes
            this.continents.forEach((continent, index) => {
                const centerX = continent.x * 800;
                const centerY = continent.y * 600;
                const radius = continent.size * 200;
                
                this.continentShapes.push({
                    name: continent.name,
                    color: continent.color,
                    center: { x: centerX, y: centerY },
                    radius: radius,
                    index: index
                });
            });
            
            // Generate simple countries
            let countryId = 1;
            this.continents.forEach((continent, continentIndex) => {
                const countryCount = 10 + Math.floor(Math.random() * 5); // 10-15 countries per continent
                
                for (let i = 0; i < countryCount; i++) {
                    const centerX = continent.x * 800 + (Math.random() - 0.5) * 150;
                    const centerY = continent.y * 600 + (Math.random() - 0.5) * 150;
                    const radius = 10 + Math.random() * 15;
                    
                    const country = {
                        id: countryId++,
                        name: this.generateCountryName(continent.name),
                        continent: continent.name,
                        continentIndex: continentIndex,
                        population: Math.floor(Math.random() * 50000000) + 1000000,
                        gdp: Math.floor(Math.random() * 1000000000000) + 1000000000,
                        x: centerX,
                        y: centerY,
                        radius: radius
                    };
                    
                    this.countries.push(country);
                }
            });
            
            console.log('Simple world generated with', this.countries.length, 'countries');
        } catch (error) {
            console.error('Error generating simple world:', error);
            // Create minimal fallback data
            this.countries = [
                { id: 1, name: "Test Country", continent: "Test Continent", population: 1000000, gdp: 1000000000, x: 400, y: 300, radius: 20 }
            ];
            this.continentShapes = [
                { name: "Test Continent", color: "#10b981", center: { x: 400, y: 300 }, radius: 100, index: 0 }
            ];
            console.log('Fallback world data created');
        }
    }
    
    generateCountryName(continentName) {
        const prefixes = ["New", "Great", "United", "Free", "Democratic", "Republic of", "Kingdom of", "Empire of"];
        const suffixes = ["land", "ia", "stan", "burg", "ville", "ton", "shire", "dale", "mere"];
        const names = ["Avalon", "Eldoria", "Mystara", "Zenith", "Nexus", "Polaris", "Vega", "Orion", "Atlas", "Titan"];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        return `${prefix} ${name}${suffix}`;
    }
    
    drawWorld(canvas, selectedBusiness = null, zoom = 1, offsetX = 0, offsetY = 0) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw map border
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Apply zoom and pan transformations
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(zoom, zoom);
        
        // Draw cosmic background gradient
        const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 600);
        gradient.addColorStop(0, '#1e1b4b');
        gradient.addColorStop(0.5, '#312e81');
        gradient.addColorStop(1, '#4c1d95');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Draw starfield
        this.drawStarField(ctx, zoom);
        
        // Draw continents as simple circles
        this.continentShapes.forEach((continent, index) => {
            this.drawSimpleContinent(ctx, continent, zoom);
        });
        
        // Draw business locations
        if (selectedBusiness && selectedBusiness.locations) {
            selectedBusiness.locations.forEach(location => {
                const country = this.countries.find(c => c.name === location.country);
                if (country) {
                    ctx.fillStyle = '#ff6b6b';
                    ctx.beginPath();
                    ctx.arc(country.x, country.y, 15 / zoom, 0, 2 * Math.PI);
                    ctx.fill();
                    
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 4 / zoom;
                    ctx.stroke();
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(country.x, country.y, 6 / zoom, 0, 2 * Math.PI);
                    ctx.fill();
                }
            });
        }
        
        // Draw expansion target indicator
        if (window.uiManager && window.uiManager.selectedCountry) {
            const selectedCountry = window.uiManager.selectedCountry;
            const time = Date.now() * 0.005;
            const pulseSize = Math.sin(time) * 0.3 + 1;
            
            ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
            ctx.beginPath();
            ctx.arc(selectedCountry.x, selectedCountry.y, (20 * pulseSize) / zoom, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 5 / zoom;
            ctx.stroke();
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(selectedCountry.x, selectedCountry.y, 8 / zoom, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Draw countries as simple circles
        this.countries.forEach(country => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(country.x, country.y, country.radius / zoom, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.9)';
            ctx.lineWidth = Math.max(1, 2 / zoom);
            ctx.stroke();
            
            // Show country names at medium zoom levels
            if (zoom > 1.5) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.font = `${Math.max(8, 12 / zoom)}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(country.name, country.x, country.y);
            }
        });
        
        ctx.restore();
    }
    
    drawStarField(ctx, zoom) {
        const time = Date.now() * 0.001;
        
        this.starField.forEach(star => {
            const twinkle = Math.sin(time + star.twinkle) * 0.3 + 0.7;
            const alpha = star.brightness * twinkle;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size / zoom, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    drawSimpleContinent(ctx, continent, zoom = 1) {
        // Draw continent as a simple circle
        const gradient = ctx.createRadialGradient(
            continent.center.x, continent.center.y, 0,
            continent.center.x, continent.center.y, continent.radius
        );
        gradient.addColorStop(0, continent.color);
        gradient.addColorStop(1, this.darkenColor(continent.color, 0.3));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(continent.center.x, continent.center.y, continent.radius / zoom, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw continent border
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = Math.max(2, 4 / zoom);
        ctx.stroke();
        
        // Add continent name
        if (zoom > 0.5) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(8, 16 / zoom)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(continent.name, continent.center.x, continent.center.y);
        }
    }
    
    darkenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    
    getCountryAtPosition(x, y) {
        return this.countries.find(country => {
            const distance = Math.sqrt((country.x - x) ** 2 + (country.y - y) ** 2);
            return distance < country.radius * 1.5;
        });
    }
    
    getAllCountries() {
        return this.countries;
    }
    
    getContinents() {
        return this.continents;
    }
    
    getContinentShapes() {
        return this.continentShapes;
    }
}

// World instance
console.log('World: Creating world generator...');
try {
    window.world = new WorldGenerator();
    console.log('World: World generator created with', window.world.countries.length, 'countries');
} catch (error) {
    console.error('Error creating world:', error);
    // Create a minimal fallback world
    window.world = {
        countries: [
            { id: 1, name: "Test Country", continent: "Test Continent", population: 1000000, gdp: 1000000000, x: 400, y: 300, radius: 20 }
        ],
        continents: [{ name: "Test Continent", color: "#10b981" }],
        drawWorld: function(canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(400, 300, 50, 0, 2 * Math.PI);
            ctx.fill();
        }
    };
    console.log('World: Fallback world created');
} 