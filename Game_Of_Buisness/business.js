// Business Management System
class Business {
    constructor(type, name, foundedDate) {
        this.id = Date.now() + Math.random();
        this.type = type;
        this.name = name;
        this.foundedDate = foundedDate;
        
        // Financial
        this.money = 50000; // Increased starting capital
        this.revenue = 0;
        this.expenses = 0;
        this.profit = 0;
        
        // Business metrics
        this.customers = 0;
        this.countries = 0;
        this.employees = 1;
        this.reputation = 50;
        
        // Business assets
        this.locations = [];
        this.products = [];
        this.advertising = [];
        
        // Growth rates
        this.customerGrowthRate = 0.01;
        this.revenueGrowthRate = 0.02;
        this.reputationGrowthRate = 0.005;
        
        // Business type modifiers
        this.setBusinessTypeModifiers(type);
    }
    
    setBusinessTypeModifiers(type) {
        const modifiers = BusinessTypes.getModifiers(type);
        this.customerGrowthRate *= modifiers.customerGrowth;
        this.revenueGrowthRate *= modifiers.revenueGrowth;
        this.reputationGrowthRate *= modifiers.reputationGrowth;
        this.startingCapital = modifiers.startingCapital;
        this.money = this.startingCapital || 50000;
    }
    
    addRandomStartingLocations() {
        // Get all available countries from the world
        if (window.world && window.world.countries) {
            const availableCountries = [...window.world.countries];
            
            // Shuffle the countries to get random selection
            for (let i = availableCountries.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableCountries[i], availableCountries[j]] = [availableCountries[j], availableCountries[i]];
            }
            
            // Add 3 random locations
            for (let i = 0; i < 3 && i < availableCountries.length; i++) {
                const country = availableCountries[i];
                this.addLocation(country.name, country.name, country.population);
            }
        }
    }
    
    update(deltaTime) {
        // Convert deltaTime to game years (10 minutes = 1 year)
        const gameYears = deltaTime / 600;
        
        // Update customers
        this.updateCustomers(gameYears);
        
        // Update revenue
        this.updateRevenue(gameYears);
        
        // Update reputation
        this.updateReputation(gameYears);
        
        // Update expenses
        this.updateExpenses(gameYears);
        
        // Calculate profit
        this.profit = this.revenue - this.expenses;
        this.money += this.profit;
        
        // Update country count
        this.updateCountryCount();
    }
    
    updateCustomers(gameYears) {
        const baseGrowth = this.customerGrowthRate * gameYears;
        const reputationBonus = (this.reputation - 50) / 100;
        const locationBonus = this.locations.length * 0.2; // Increased location bonus
        const productBonus = this.products.length * 0.1; // Increased product bonus
        const advertisingBonus = this.advertising.length * 0.05; // Added advertising bonus
        
        const totalGrowth = baseGrowth * (1 + reputationBonus + locationBonus + productBonus + advertisingBonus);
        const newCustomers = Math.floor(this.customers * totalGrowth) + Math.floor(10 * gameYears); // Base growth of 10 customers per year
        this.customers += newCustomers;
    }
    
    updateRevenue(gameYears) {
        const baseRevenue = this.customers * 10; // $10 per customer (much higher)
        const productRevenue = this.products.reduce((sum, product) => sum + (product.price * this.customers * 0.1), 0);
        const locationRevenue = this.locations.reduce((sum, location) => sum + (location.population * 0.01), 0);
        const reputationMultiplier = 1 + (this.reputation - 50) / 100;
        
        this.revenue = (baseRevenue + productRevenue + locationRevenue) * reputationMultiplier * gameYears;
    }
    
    updateReputation(gameYears) {
        const baseReputation = this.reputationGrowthRate * gameYears;
        const customerBonus = this.customers > 1000 ? 0.01 : 0;
        const productBonus = this.products.length * 0.005;
        const locationBonus = this.locations.length * 0.002;
        
        this.reputation += (baseReputation + customerBonus + productBonus + locationBonus) * gameYears;
        this.reputation = Math.min(100, Math.max(0, this.reputation));
    }
    
    updateExpenses(gameYears) {
        const employeeCosts = this.employees * 5000 * gameYears; // Reduced to $5k per employee per year
        const locationCosts = this.locations.length * 1000 * gameYears; // Reduced to $1k per location per year
        const advertisingCosts = this.advertising.reduce((sum, ad) => sum + (ad.cost * gameYears / 365), 0); // Spread over time
        
        this.expenses = employeeCosts + locationCosts + advertisingCosts;
    }
    
    updateCountryCount() {
        const uniqueCountries = new Set(this.locations.map(location => location.country));
        this.countries = uniqueCountries.size;
    }
    
    addLocation(country, countryName, population) {
        const location = {
            country: country,
            population: population,
            established: Date.now(),
            revenue: 0
        };
        
        this.locations.push(location);
        this.employees += Math.floor(population / 10000); // 1 employee per 10k population
        
        // Immediate customer boost from new location
        this.customers += Math.floor(population * 0.01); // 1% of population becomes customers
        
        // Reputation boost from expansion
        this.reputation += 2;
        this.reputation = Math.min(100, this.reputation);
    }
    
    addProduct(name, description, price) {
        const product = {
            id: Date.now() + Math.random(),
            name: name,
            description: description,
            price: price,
            created: Date.now(),
            sales: 0
        };
        
        this.products.push(product);
    }
    
    advertise(region, budget) {
        const advertisement = {
            region: region,
            budget: budget,
            cost: budget,
            startDate: Date.now(),
            duration: 30 * 24 * 60 * 60 * 1000, // 30 days
            effectiveness: Math.random() * 0.5 + 0.5 // 50-100% effectiveness
        };
        
        this.advertising.push(advertisement);
        this.money -= budget;
        
        // Apply advertising effects
        this.reputation += advertisement.effectiveness * 5;
        this.customerGrowthRate += advertisement.effectiveness * 0.01;
    }
    
    canAfford(cost) {
        return this.money >= cost;
    }
    
    getTotalValue() {
        const assetValue = this.locations.length * 100000 + this.products.length * 50000;
        return this.money + assetValue;
    }
    
    getGrowthRate() {
        return {
            customers: this.customerGrowthRate,
            revenue: this.revenueGrowthRate,
            reputation: this.reputationGrowthRate
        };
    }
}

// Business Types Database
class BusinessTypes {
    static types = [
        "Coffee Shop", "Restaurant", "Retail Store", "Tech Startup", "Manufacturing Company",
        "Consulting Firm", "Real Estate Agency", "Law Firm", "Medical Practice", "Bank",
        "Insurance Company", "Transportation Company", "Energy Company", "Mining Company",
        "Agriculture Business", "Fashion Brand", "Entertainment Company", "Sports Team",
        "Educational Institution", "Research Laboratory", "Pharmaceutical Company",
        "Automotive Company", "Aerospace Company", "Construction Company", "Hotel Chain",
        "Travel Agency", "Marketing Agency", "Design Studio", "Software Company",
        "Hardware Company", "Biotechnology Company", "Chemical Company", "Textile Company",
        "Food Processing Company", "Beverage Company", "Tobacco Company", "Weapons Manufacturer",
        "Defense Contractor", "Space Exploration Company", "Renewable Energy Company",
        "Waste Management Company", "Water Treatment Company", "Telecommunications Company",
        "Internet Service Provider", "Social Media Platform", "E-commerce Platform",
        "Streaming Service", "Gaming Company", "Publishing Company", "News Organization",
        "Advertising Agency", "Public Relations Firm", "Human Resources Company",
        "Accounting Firm", "Investment Bank", "Venture Capital Firm", "Hedge Fund",
        "Private Equity Firm", "Cryptocurrency Exchange", "Blockchain Company",
        "Artificial Intelligence Company", "Robotics Company", "3D Printing Company",
        "Virtual Reality Company", "Augmented Reality Company", "Drone Company",
        "Electric Vehicle Company", "Solar Panel Company", "Wind Turbine Company",
        "Battery Company", "Semiconductor Company", "Quantum Computing Company",
        "Nanotechnology Company", "Genetic Engineering Company", "Stem Cell Company",
        "Organ Transplant Company", "Medical Device Company", "Vaccine Company",
        "Antibiotic Company", "Pain Management Company", "Mental Health Company",
        "Fitness Company", "Nutrition Company", "Cosmetics Company", "Perfume Company",
        "Jewelry Company", "Watch Company", "Luxury Brand", "Fast Fashion Company",
        "Sustainable Fashion Company", "Vintage Clothing Company", "Shoe Company",
        "Handbag Company", "Sunglasses Company", "Wine Company", "Beer Company",
        "Spirits Company", "Cigar Company", "Pet Food Company", "Pet Care Company",
        "Veterinary Company", "Zoo Company", "Aquarium Company", "Theme Park Company",
        "Casino Company", "Lottery Company", "Sports Betting Company", "Fantasy Sports Company",
        "Esports Company", "Board Game Company", "Card Game Company", "Puzzle Company",
        "Toy Company", "Doll Company", "Action Figure Company", "Model Kit Company",
        "Collectible Company", "Trading Card Company", "Comic Book Company", "Manga Company",
        "Anime Company", "Cartoon Company", "Movie Studio", "Television Network",
        "Radio Station", "Podcast Company", "Audiobook Company", "E-book Company",
        "Printing Company", "Paper Company", "Ink Company", "Pen Company",
        "Pencil Company", "Notebook Company", "Backpack Company", "Luggage Company",
        "Suitcase Company", "Briefcase Company", "Wallet Company", "Belt Company",
        "Tie Company", "Scarf Company", "Hat Company", "Glove Company",
        "Sock Company", "Underwear Company", "Swimsuit Company", "Ski Company",
        "Snowboard Company", "Surf Company", "Skateboard Company", "Bicycle Company",
        "Motorcycle Company", "Boat Company", "Yacht Company", "Cruise Ship Company",
        "Airline Company", "Private Jet Company", "Helicopter Company", "Submarine Company",
        "Tank Company", "Missile Company", "Satellite Company", "Rocket Company",
        "Space Station Company", "Mars Colony Company", "Moon Base Company",
        "Asteroid Mining Company", "Space Tourism Company", "Time Travel Company",
        "Teleportation Company", "Invisibility Company", "Superpower Company",
        "Superhero Company", "Villain Company", "Secret Agent Company", "Spy Company",
        "Detective Agency", "Private Investigator Company", "Security Company",
        "Bodyguard Company", "Bouncer Company", "Doorman Company", "Valet Company",
        "Chauffeur Company", "Taxi Company", "Ride-sharing Company", "Delivery Company",
        "Courier Company", "Postal Service", "Package Company", "Shipping Company",
        "Freight Company", "Logistics Company", "Supply Chain Company", "Warehouse Company",
        "Storage Company", "Moving Company", "Cleaning Company", "Maintenance Company",
        "Repair Company", "Installation Company", "Assembly Company", "Disassembly Company",
        "Recycling Company", "Composting Company", "Upcycling Company", "Downcycling Company",
        "Zero Waste Company", "Carbon Neutral Company", "Carbon Negative Company",
        "Climate Positive Company", "Eco-friendly Company", "Green Company", "Sustainable Company",
        "Organic Company", "Natural Company", "Holistic Company", "Alternative Medicine Company",
        "Traditional Medicine Company", "Herbal Medicine Company", "Homeopathic Company",
        "Acupuncture Company", "Massage Company", "Spa Company", "Wellness Company",
        "Meditation Company", "Yoga Company", "Pilates Company", "Tai Chi Company",
        "Martial Arts Company", "Self-defense Company", "Fighting Company", "Boxing Company",
        "Wrestling Company", "MMA Company", "UFC Company", "WWE Company",
        "Professional Wrestling Company", "Amateur Wrestling Company", "Olympic Company",
        "Paralympic Company", "Special Olympics Company", "Adaptive Sports Company",
        "Wheelchair Sports Company", "Blind Sports Company", "Deaf Sports Company",
        "Deaflympics Company", "Special Olympics Company", "Paralympic Company",
        "Olympic Company", "World Cup Company", "Super Bowl Company", "World Series Company",
        "NBA Finals Company", "Stanley Cup Company", "Champions League Company",
        "Europa League Company", "Premier League Company", "La Liga Company",
        "Bundesliga Company", "Serie A Company", "Ligue 1 Company", "MLS Company",
        "NHL Company", "NFL Company", "NBA Company", "MLB Company", "NASCAR Company",
        "Formula 1 Company", "IndyCar Company", "MotoGP Company", "WRC Company",
        "Rally Company", "Rallycross Company", "Drift Company", "Drag Racing Company",
        "Street Racing Company", "Illegal Racing Company", "Legal Racing Company",
        "Professional Racing Company", "Amateur Racing Company", "Karting Company",
        "Go-kart Company", "Miniature Golf Company", "Golf Company", "Tennis Company",
        "Badminton Company", "Table Tennis Company", "Ping Pong Company", "Squash Company",
        "Racquetball Company", "Handball Company", "Volleyball Company", "Basketball Company",
        "Soccer Company", "Football Company", "Rugby Company", "Cricket Company",
        "Baseball Company", "Softball Company", "Hockey Company", "Lacrosse Company",
        "Field Hockey Company", "Ice Hockey Company", "Roller Hockey Company", "Street Hockey Company",
        "Pond Hockey Company", "Shinny Company", "Pickup Game Company", "Recreational Sports Company",
        "Intramural Sports Company", "Varsity Sports Company", "College Sports Company",
        "High School Sports Company", "Middle School Sports Company", "Elementary School Sports Company",
        "Youth Sports Company", "Adult Sports Company", "Senior Sports Company", "Veteran Sports Company",
        "Disabled Sports Company", "Adaptive Sports Company", "Inclusive Sports Company",
        "Diverse Sports Company", "Multicultural Sports Company", "International Sports Company",
        "Global Sports Company", "Worldwide Sports Company", "Universal Sports Company",
        "Cosmic Sports Company", "Intergalactic Sports Company", "Extraterrestrial Sports Company",
        "Alien Sports Company", "UFO Sports Company", "Space Sports Company", "Zero Gravity Sports Company",
        "Microgravity Sports Company", "Low Gravity Sports Company", "High Gravity Sports Company",
        "Hypergravity Sports Company", "Ultra Gravity Sports Company", "Super Gravity Sports Company",
        "Mega Gravity Sports Company", "Giga Gravity Sports Company", "Tera Gravity Sports Company",
        "Peta Gravity Sports Company", "Exa Gravity Sports Company", "Zetta Gravity Sports Company",
        "Yotta Gravity Sports Company", "Bronto Gravity Sports Company", "Geop Gravity Sports Company",
        "Sagan Gravity Sports Company", "Pija Gravity Sports Company", "Alpha Gravity Sports Company",
        "Beta Gravity Sports Company", "Gamma Gravity Sports Company", "Delta Gravity Sports Company",
        "Epsilon Gravity Sports Company", "Zeta Gravity Sports Company", "Eta Gravity Sports Company",
        "Theta Gravity Sports Company", "Iota Gravity Sports Company", "Kappa Gravity Sports Company",
        "Lambda Gravity Sports Company", "Mu Gravity Sports Company", "Nu Gravity Sports Company",
        "Xi Gravity Sports Company", "Omicron Gravity Sports Company", "Pi Gravity Sports Company",
        "Rho Gravity Sports Company", "Sigma Gravity Sports Company", "Tau Gravity Sports Company",
        "Upsilon Gravity Sports Company", "Phi Gravity Sports Company", "Chi Gravity Sports Company",
        "Psi Gravity Sports Company", "Omega Gravity Sports Company", "Alpha Omega Sports Company",
        "Omega Alpha Sports Company", "Beta Gamma Sports Company", "Gamma Beta Sports Company",
        "Delta Epsilon Sports Company", "Epsilon Delta Sports Company", "Zeta Eta Sports Company",
        "Eta Zeta Sports Company", "Theta Iota Sports Company", "Iota Theta Sports Company",
        "Kappa Lambda Sports Company", "Lambda Kappa Sports Company", "Mu Nu Sports Company",
        "Nu Mu Sports Company", "Xi Omicron Sports Company", "Omicron Xi Sports Company",
        "Pi Rho Sports Company", "Rho Pi Sports Company", "Sigma Tau Sports Company",
        "Tau Sigma Sports Company", "Upsilon Phi Sports Company", "Phi Upsilon Sports Company",
        "Chi Psi Sports Company", "Psi Chi Sports Company", "Omega Alpha Beta Sports Company",
        "Alpha Beta Gamma Sports Company", "Beta Gamma Delta Sports Company", "Gamma Delta Epsilon Sports Company",
        "Delta Epsilon Zeta Sports Company", "Epsilon Zeta Eta Sports Company", "Zeta Eta Theta Sports Company",
        "Eta Theta Iota Sports Company", "Theta Iota Kappa Sports Company", "Iota Kappa Lambda Sports Company",
        "Kappa Lambda Mu Sports Company", "Lambda Mu Nu Sports Company", "Mu Nu Xi Sports Company",
        "Nu Xi Omicron Sports Company", "Xi Omicron Pi Sports Company", "Omicron Pi Rho Sports Company",
        "Pi Rho Sigma Sports Company", "Rho Sigma Tau Sports Company", "Sigma Tau Upsilon Sports Company",
        "Tau Upsilon Phi Sports Company", "Upsilon Phi Chi Sports Company", "Phi Chi Psi Sports Company",
        "Chi Psi Omega Sports Company", "Psi Omega Alpha Sports Company", "Omega Alpha Beta Gamma Sports Company"
    ];
    
    static getModifiers(type) {
        const modifiers = {
            customerGrowth: 1.0,
            revenueGrowth: 1.0,
            reputationGrowth: 1.0,
            startingCapital: 10000
        };
        
        // Apply type-specific modifiers
        if (type.includes("Tech") || type.includes("Software") || type.includes("AI")) {
            modifiers.customerGrowth = 1.5;
            modifiers.revenueGrowth = 2.0;
            modifiers.startingCapital = 50000;
        } else if (type.includes("Restaurant") || type.includes("Food")) {
            modifiers.customerGrowth = 1.2;
            modifiers.reputationGrowth = 1.3;
        } else if (type.includes("Bank") || type.includes("Financial")) {
            modifiers.revenueGrowth = 1.8;
            modifiers.startingCapital = 100000;
        } else if (type.includes("Manufacturing")) {
            modifiers.customerGrowth = 0.8;
            modifiers.revenueGrowth = 1.5;
            modifiers.startingCapital = 75000;
        }
        
        return modifiers;
    }
    
    static search(query) {
        return this.types.filter(type => 
            type.toLowerCase().includes(query.toLowerCase())
        );
    }
} 