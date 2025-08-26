// Story System - Choose Your Own Adventure
class StorySystem {
    constructor() {
        this.currentStory = null;
        this.storyHistory = [];
        this.storyEvents = [];
        this.lastEventTime = Date.now();
        
        this.storyTemplates = {
            businessStart: [
                {
                    text: "The dreamy green continents of Nova Terra stretch before you, their majestic lavender seas glistening in the alien sun. You've arrived with nothing but ambition and a dream to build an empire that spans all 562 countries across the 14 continents.",
                    choices: [
                        { text: "Start your first business venture", action: "start_business" },
                        { text: "Research the local market", action: "research_market" },
                        { text: "Network with local entrepreneurs", action: "network" }
                    ]
                }
            ],
            businessGrowth: [
                {
                    text: "Your business is gaining momentum! Customers are starting to notice your presence in the market. The local Nova Terran media is beginning to take interest.",
                    choices: [
                        { text: "Focus on product development", action: "develop_products" },
                        { text: "Expand to new locations", action: "expand_locations" },
                        { text: "Invest in marketing", action: "invest_marketing" }
                    ]
                }
            ],
            marketEvents: [
                {
                    text: "A new competitor has emerged in your market! They're offering similar products at lower prices. How will you respond?",
                    choices: [
                        { text: "Lower your prices to compete", action: "lower_prices" },
                        { text: "Improve your product quality", action: "improve_quality" },
                        { text: "Focus on customer service", action: "customer_service" }
                    ]
                },
                {
                    text: "The Nova Terran economy is experiencing a boom! Consumer spending is up across all continents. This could be your chance to expand rapidly.",
                    choices: [
                        { text: "Take advantage of the boom", action: "economic_boom" },
                        { text: "Stay conservative", action: "stay_conservative" },
                        { text: "Invest in research", action: "invest_research" }
                    ]
                }
            ],
            expansionEvents: [
                {
                    text: "You've identified a promising new market in a distant continent. The local population is eager for your products, but the logistics will be challenging.",
                    choices: [
                        { text: "Establish a local branch", action: "local_branch" },
                        { text: "Partner with local businesses", action: "local_partnership" },
                        { text: "Acquire existing businesses", action: "acquire_businesses" }
                    ]
                }
            ],
            crisisEvents: [
                {
                    text: "A supply chain disruption has affected your operations! Your suppliers are struggling to meet demand, and costs are rising.",
                    choices: [
                        { text: "Find new suppliers", action: "new_suppliers" },
                        { text: "Increase prices", action: "increase_prices" },
                        { text: "Reduce operations", action: "reduce_operations" }
                    ]
                },
                {
                    text: "A scandal has erupted involving one of your competitors! The media is questioning business practices across your industry.",
                    choices: [
                        { text: "Distance yourself from the industry", action: "distance_industry" },
                        { text: "Improve transparency", action: "improve_transparency" },
                        { text: "Use this as an opportunity", action: "opportunity" }
                    ]
                }
            ],
            successEvents: [
                {
                    text: "Congratulations! Your business has reached a major milestone. You're now operating in over 100 countries across Nova Terra!",
                    choices: [
                        { text: "Celebrate the achievement", action: "celebrate" },
                        { text: "Set new goals", action: "new_goals" },
                        { text: "Give back to the community", action: "give_back" }
                    ]
                }
            ]
        };
    }
    
    generateStory(business = null) {
        const now = Date.now();
        const timeSinceLastEvent = now - this.lastEventTime;
        
        // Generate story based on business state
        if (!business) {
            return this.getRandomStory('businessStart');
        }
        
        // Determine story type based on business metrics
        let storyType = 'businessGrowth';
        
        if (business.customers > 10000 && Math.random() < 0.3) {
            storyType = 'successEvents';
        } else if (business.countries > 50 && Math.random() < 0.4) {
            storyType = 'expansionEvents';
        } else if (business.reputation < 30 && Math.random() < 0.5) {
            storyType = 'crisisEvents';
        } else if (timeSinceLastEvent > 30000 && Math.random() < 0.6) { // 30 seconds
            storyType = 'marketEvents';
        }
        
        this.lastEventTime = now;
        return this.getRandomStory(storyType);
    }
    
    getRandomStory(type) {
        const stories = this.storyTemplates[type];
        if (!stories || stories.length === 0) {
            return this.getDefaultStory();
        }
        
        const story = stories[Math.floor(Math.random() * stories.length)];
        return {
            ...story,
            id: Date.now() + Math.random(),
            timestamp: Date.now(),
            type: type
        };
    }
    
    getDefaultStory() {
        return {
            id: Date.now() + Math.random(),
            text: "Your business continues to operate smoothly on Nova Terra. The dreamy green landscapes and majestic lavender seas provide a beautiful backdrop for your entrepreneurial journey.",
            choices: [
                { text: "Continue business operations", action: "continue" },
                { text: "Review business strategy", action: "review_strategy" },
                { text: "Explore new opportunities", action: "explore" }
            ],
            timestamp: Date.now(),
            type: 'default'
        };
    }
    
    handleChoice(choice, business = null) {
        const action = choice.action;
        let result = {
            success: true,
            message: "Action completed successfully.",
            effects: {}
        };
        
        switch (action) {
            case 'start_business':
                result.message = "You've decided to start your business journey on Nova Terra! The local population is excited about new opportunities.";
                break;
                
            case 'research_market':
                result.message = "Market research reveals promising opportunities across multiple continents. You've gained valuable insights into local consumer preferences.";
                result.effects = { reputation: 5, knowledge: 10 };
                break;
                
            case 'network':
                result.message = "Networking with local entrepreneurs has opened doors to new partnerships and opportunities.";
                result.effects = { reputation: 3, connections: 5 };
                break;
                
            case 'develop_products':
                if (business) {
                    result.message = "Product development focus has led to innovative new offerings. Your customers are impressed!";
                    result.effects = { reputation: 8, productQuality: 15 };
                }
                break;
                
            case 'expand_locations':
                if (business) {
                    result.message = "Expansion plans are in motion. New locations will help you reach more customers across Nova Terra.";
                    result.effects = { expansion: 10, customers: 5 };
                }
                break;
                
            case 'invest_marketing':
                if (business) {
                    result.message = "Marketing investment is paying off! Your brand awareness is growing across the continents.";
                    result.effects = { reputation: 10, customers: 8 };
                }
                break;
                
            case 'lower_prices':
                if (business) {
                    result.message = "Price reduction strategy implemented. Sales volume has increased, though profit margins are tighter.";
                    result.effects = { customers: 15, revenue: -5 };
                }
                break;
                
            case 'improve_quality':
                if (business) {
                    result.message = "Quality improvements have enhanced customer satisfaction and loyalty.";
                    result.effects = { reputation: 12, customers: 8 };
                }
                break;
                
            case 'customer_service':
                if (business) {
                    result.message = "Exceptional customer service has become your competitive advantage. Word-of-mouth is spreading!";
                    result.effects = { reputation: 15, customers: 10 };
                }
                break;
                
            case 'economic_boom':
                if (business) {
                    result.message = "The economic boom has created unprecedented opportunities. Your business is thriving!";
                    result.effects = { revenue: 20, customers: 15, reputation: 10 };
                }
                break;
                
            case 'stay_conservative':
                if (business) {
                    result.message = "Conservative approach has provided stability during uncertain times.";
                    result.effects = { stability: 10, risk: -5 };
                }
                break;
                
            case 'invest_research':
                if (business) {
                    result.message = "Research investment is leading to breakthrough innovations. Your competitive edge is strengthening.";
                    result.effects = { innovation: 15, reputation: 8 };
                }
                break;
                
            case 'local_branch':
                if (business) {
                    result.message = "Local branch establishment is proceeding smoothly. New markets are opening up!";
                    result.effects = { expansion: 15, customers: 12 };
                }
                break;
                
            case 'local_partnership':
                if (business) {
                    result.message = "Local partnerships have accelerated your market entry and reduced risks.";
                    result.effects = { expansion: 10, risk: -8, reputation: 5 };
                }
                break;
                
            case 'acquire_businesses':
                if (business) {
                    result.message = "Strategic acquisitions have expanded your market presence and eliminated competition.";
                    result.effects = { expansion: 20, customers: 18, cost: 10 };
                }
                break;
                
            case 'new_suppliers':
                if (business) {
                    result.message = "New supplier relationships have stabilized your supply chain and reduced costs.";
                    result.effects = { cost: -10, stability: 8 };
                }
                break;
                
            case 'increase_prices':
                if (business) {
                    result.message = "Price increases have improved margins, though some customers have been lost.";
                    result.effects = { revenue: 15, customers: -8 };
                }
                break;
                
            case 'reduce_operations':
                if (business) {
                    result.message = "Operational reduction has cut costs but limited growth potential.";
                    result.effects = { cost: -15, customers: -5, revenue: -10 };
                }
                break;
                
            case 'distance_industry':
                if (business) {
                    result.message = "Distancing from industry scandals has protected your reputation.";
                    result.effects = { reputation: 5, risk: -10 };
                }
                break;
                
            case 'improve_transparency':
                if (business) {
                    result.message = "Improved transparency has enhanced trust with customers and regulators.";
                    result.effects = { reputation: 12, trust: 15 };
                }
                break;
                
            case 'opportunity':
                if (business) {
                    result.message = "Using the crisis as an opportunity has positioned you as an industry leader.";
                    result.effects = { reputation: 18, customers: 12, marketShare: 10 };
                }
                break;
                
            case 'celebrate':
                if (business) {
                    result.message = "Celebrating your achievements has boosted employee morale and customer loyalty.";
                    result.effects = { reputation: 8, employeeMorale: 15 };
                }
                break;
                
            case 'new_goals':
                if (business) {
                    result.message = "Setting new ambitious goals has inspired your team and attracted new investors.";
                    result.effects = { motivation: 15, investment: 10 };
                }
                break;
                
            case 'give_back':
                if (business) {
                    result.message = "Giving back to the Nova Terran community has enhanced your social responsibility reputation.";
                    result.effects = { reputation: 15, socialImpact: 20 };
                }
                break;
                
            default:
                result.message = "You've made a decision that will shape your business's future on Nova Terra.";
                break;
        }
        
        // Apply effects to business if available
        if (business && result.effects) {
            this.applyEffects(business, result.effects);
        }
        
        // Add to story history
        this.storyHistory.push({
            story: this.currentStory,
            choice: choice,
            result: result,
            timestamp: Date.now()
        });
        
        return result;
    }
    
    applyEffects(business, effects) {
        if (effects.reputation) {
            business.reputation += effects.reputation;
            business.reputation = Math.min(100, Math.max(0, business.reputation));
        }
        
        if (effects.customers) {
            business.customers += Math.floor(business.customers * (effects.customers / 100));
        }
        
        if (effects.revenue) {
            business.revenue *= (1 + effects.revenue / 100);
        }
        
        if (effects.cost) {
            business.expenses *= (1 + effects.cost / 100);
        }
        
        if (effects.expansion) {
            // This could trigger expansion opportunities
            business.expansionOpportunities = (business.expansionOpportunities || 0) + effects.expansion;
        }
    }
    
    updateStory(business = null) {
        const newStory = this.generateStory(business);
        this.currentStory = newStory;
        this.updateStoryUI(newStory);
    }
    
    updateStoryUI(story) {
        const storyContent = document.getElementById('story-content');
        const storyChoices = document.getElementById('story-choices');
        
        if (storyContent && storyChoices) {
            // Update story text
            storyContent.innerHTML = `<p class="story-text">${story.text}</p>`;
            
            // Update choices
            storyChoices.innerHTML = story.choices.map((choice, index) => 
                `<button class="choice-btn" data-choice="${index + 1}" data-action="${choice.action}">${choice.text}</button>`
            ).join('');
            
            // Add event listeners to new choice buttons
            storyChoices.querySelectorAll('.choice-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const choiceIndex = parseInt(e.target.dataset.choice) - 1;
                    const choice = story.choices[choiceIndex];
                    const result = this.handleChoice(choice, window.game?.gameState?.currentBusiness);
                    
                    // Show result notification
                    if (window.game) {
                        window.game.showNotification(result.message);
                    }
                    
                    // Generate new story after a short delay
                    setTimeout(() => {
                        this.updateStory(window.game?.gameState?.currentBusiness);
                    }, 2000);
                });
            });
        }
    }
    
    getStoryHistory() {
        return this.storyHistory;
    }
    
    clearHistory() {
        this.storyHistory = [];
    }
}

// Initialize story system
let storySystem = new StorySystem(); 