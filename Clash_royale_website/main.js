console.log('Welcome to Clash Stats!'); 

// Clash Royale monthly theme detection and application
function applyMonthlyTheme() {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  
  let theme = 'default';
  
  // Clash Royale Monthly Themes
  switch(month) {
    case 1: // January - New Year
      theme = 'newyear';
      break;
    case 2: // February - Valentine's
      theme = 'valentine';
      break;
    case 3: // March - St. Patrick's
      theme = 'stpatricks';
      break;
    case 4: // April - Spring
      theme = 'spring';
      break;
    case 5: // May - Mother's Day
      theme = 'mothersday';
      break;
    case 6: // June - Summer
      theme = 'summer';
      break;
    case 7: // July - Independence Day
      theme = 'independence';
      break;
    case 8: // August - Summer
      theme = 'summer';
      break;
    case 9: // September - Back to School
      theme = 'backtoschool';
      break;
    case 10: // October - Halloween
      theme = 'halloween';
      break;
    case 11: // November - Thanksgiving
      theme = 'thanksgiving';
      break;
    case 12: // December - Christmas
      theme = 'christmas';
      break;
  }
  
  // Remove all theme classes and add current theme
  document.body.classList.remove('newyear', 'valentine', 'stpatricks', 'spring', 'mothersday', 
                                'summer', 'independence', 'backtoschool', 'halloween', 'thanksgiving', 'christmas');
  document.body.classList.add(theme);
  
  console.log(`Applied ${theme} theme`);
}

// Apply monthly theme on page load
applyMonthlyTheme();

// Deck Maker logic (only runs on deck-maker.html)
if (window.location.pathname.includes('deck-maker.html')) {
  // Elixir costs for all cards (from https://www.deckshop.pro/card/list)
  const elixirCosts = {
    // Champions
    'Little Prince': 3, 'Golden Knight': 4, 'Skeleton King': 4, 'Mighty Miner': 4, 'Archer Queen': 5, 'Goblinstein': 5, 'Monk': 5, 'Boss Bandit': 6,
    // Legendaries
    'The Log': 2, 'Miner': 3, 'Princess': 3, 'Ice Wizard': 3, 'Royal Ghost': 3, 'Bandit': 3, 'Fisherman': 3, 'Electro Wizard': 4, 'Inferno Dragon': 4, 'Phoenix': 4, 'Magic Archer': 4, 'Lumberjack': 4, 'Night Witch': 4, 'Mother Witch': 4, 'Ram Rider': 5, 'Graveyard': 5, 'Goblin Machine': 5, 'Sparky': 6, 'Spirit Empress': 6, 'Mega Knight': 7, 'Lava Hound': 7,
    // Epics
    'Mirror': '?', 'Barbarian Barrel': 2, 'Wall Breakers': 2, 'Goblin Curse': 2, 'Rage': 2, 'Goblin Barrel': 3, 'Guards': 3, 'Skeleton Army': 3, 'Clone': 3, 'Tornado': 3, 'Void': 3, 'Baby Dragon': 4, 'Dark Prince': 4, 'Freeze': 4, 'Poison': 4, 'Rune Giant': 4, 'Hunter': 4, 'Goblin Drill': 4, 'Witch': 5, 'Balloon': 5, 'Prince': 5, 'Electro Dragon': 5, 'Bowler': 5, 'Executioner': 5, 'Cannon Cart': 5, 'Giant Skeleton': 6, 'Lightning': 6, 'Goblin Giant': 6, 'X-Bow': 6, 'P.E.K.K.A': 7, 'Electro Giant': 7, 'Golem': 8,
    // Rares
    'Heal Spirit': 1, 'Ice Golem': 2, 'Suspicious Bush': 2, 'Tombstone': 3, 'Mega Minion': 3, 'Dart Goblin': 3, 'Earthquake': 3, 'Elixir Golem': 3, 'Fireball': 4, 'Mini P.E.K.K.A': 4, 'Musketeer': 4, 'Goblin Cage': 4, 'Goblin Hut': 4, 'Valkyrie': 4, 'Battle Ram': 4, 'Bomb Tower': 4, 'Flying Machine': 4, 'Hog Rider': 4, 'Rocket': 6, 'Giant': 5, 'Wizard': 5, 'Royal Hogs': 5, 'Three Musketeers': 9, 'Inferno Tower': 5, 'Furnace': 4, 'Zap': 2, 'Fire Spirits': 2, 'Goblin Gang': 3, 'Skeletons': 1, 'Bats': 2, 'Archers': 3, 'Knight': 3, 'Cannon': 3, 'Skeleton Barrel': 3, 'Firecracker': 3, 'Mortar': 4, 'Barbarians': 5, 'Royal Giant': 6, 'Ice Spirit': 1, 'Bomber': 2, 'Spear Goblins': 2,
    // Additional cards with correct elixir costs
    'Battle Healer': 4, 'Zappies': 4, 'Goblin Demolisher': 4, 'Barbarian Hut': 6, 'Elixir Collector': 6, 'Electro Spirit': 1, 'Fire Spirit': 1, 'Goblins': 2, 'Giant Snowball': 2, 'Berserker': 2, 'Arrows': 3, 'Minions': 3, 'Royal Delivery': 3, 'Skeleton Dragons': 4, 'Tesla': 4, 'Minion Horde': 5, 'Rascals': 5, 'Elite Barbarians': 6, 'Royal Recruits': 7
  };
  // Heroes data (January 2026)
  const heroesCards = {
    'Hero Mini P.E.K.K.A': {
      name: 'Hero Mini P.E.K.K.A',
      image: 'https://via.placeholder.com/150x180/FFD700/000000?text=Hero+Mini+P.E.K.K.A',
      elixir: 4,
      ability: 'Breakfast Boost',
      abilityCost: 2,
      abilityDescription: 'Each pancake consumed levels him up by one'
    },
    'Hero Musketeer': {
      name: 'Hero Musketeer',
      image: 'https://via.placeholder.com/150x180/FFD700/000000?text=Hero+Musketeer',
      elixir: 4,
      ability: 'Trusty Turret',
      abilityCost: 2,
      abilityDescription: 'Deploys a turret for additional firepower'
    },
    'Hero Knight': {
      name: 'Hero Knight',
      image: 'https://via.placeholder.com/150x180/FFD700/000000?text=Hero+Knight',
      elixir: 3,
      ability: 'Triumphant Taunt',
      abilityCost: 2,
      abilityDescription: 'Taunts nearby enemies and gains a shield'
    },
    'Hero Giant': {
      name: 'Hero Giant',
      image: 'https://via.placeholder.com/150x180/FFD700/000000?text=Hero+Giant',
      elixir: 5,
      ability: 'Heroic Hurl',
      abilityCost: 2,
      abilityDescription: 'Throws the nearest troop, stunning them and swapping lanes'
    },
    'Hero Wizard': {
      name: 'Hero Wizard',
      image: 'https://via.placeholder.com/150x180/FFD700/000000?text=Hero+Wizard',
      elixir: 5,
      ability: 'Fiery Flight',
      abilityCost: 2,
      abilityDescription: 'Enhances offensive power with flaming tornadoes that deal splash damage'
    },
    'Hero Ice Golem': {
      name: 'Hero Ice Golem',
      image: 'https://via.placeholder.com/150x180/FFD700/000000?text=Hero+Ice+Golem',
      elixir: 2,
      ability: 'Snowstorm',
      abilityCost: 2,
      abilityDescription: 'Unleashes powerful gusts of wind that slow and freeze nearby enemies, focusing on crowd control and battlefield disruption'
    }
  };

  // Complete card data by rarity, based on Deck Shop (https://www.deckshop.pro/card/list)
  const cardsByRarity = {
    'Champion': [
      { name: 'Little Prince', image: 'https://royaleapi.github.io/cr-api-assets/cards/little-prince.png', elixir: 3 },
      { name: 'Golden Knight', image: 'https://royaleapi.github.io/cr-api-assets/cards/golden-knight.png', elixir: 4 },
      { name: 'Skeleton King', image: 'https://royaleapi.github.io/cr-api-assets/cards/skeleton-king.png', elixir: 4 },
      { name: 'Mighty Miner', image: 'https://royaleapi.github.io/cr-api-assets/cards/mighty-miner.png', elixir: 4 },
      { name: 'Archer Queen', image: 'https://royaleapi.github.io/cr-api-assets/cards/archer-queen.png', elixir: 5 },
      // Official render: https://royaleapi.com/static/img/cards-150/goblinstein.png
      { name: 'Goblinstein', image: 'https://royaleapi.com/static/img/cards-150/goblinstein.png', elixir: 4 },
      { name: 'Monk', image: 'https://royaleapi.github.io/cr-api-assets/cards/monk.png', elixir: 4 },
      // Official render: https://royaleapi.com/static/img/cards-150/boss-bandit.png
      { name: 'Boss Bandit', image: 'https://royaleapi.com/static/img/cards-150/boss-bandit.png', elixir: 4 }
    ],
    'Legendary': [
      { name: 'The Log', image: 'https://royaleapi.github.io/cr-api-assets/cards/the-log.png' },
      { name: 'Miner', image: 'https://royaleapi.github.io/cr-api-assets/cards/miner.png' },
      { name: 'Princess', image: 'https://royaleapi.github.io/cr-api-assets/cards/princess.png' },
      { name: 'Ice Wizard', image: 'https://royaleapi.github.io/cr-api-assets/cards/ice-wizard.png' },
      { name: 'Royal Ghost', image: 'https://royaleapi.github.io/cr-api-assets/cards/royal-ghost.png' },
      { name: 'Bandit', image: 'https://royaleapi.github.io/cr-api-assets/cards/bandit.png' },
      { name: 'Fisherman', image: 'https://royaleapi.github.io/cr-api-assets/cards/fisherman.png' },
      { name: 'Electro Wizard', image: 'https://royaleapi.github.io/cr-api-assets/cards/electro-wizard.png' },
      { name: 'Inferno Dragon', image: 'https://royaleapi.github.io/cr-api-assets/cards/inferno-dragon.png' },
      { name: 'Phoenix', image: 'https://royaleapi.github.io/cr-api-assets/cards/phoenix.png' },
      { name: 'Magic Archer', image: 'https://royaleapi.github.io/cr-api-assets/cards/magic-archer.png' },
      { name: 'Lumberjack', image: 'https://royaleapi.github.io/cr-api-assets/cards/lumberjack.png' },
      { name: 'Night Witch', image: 'https://royaleapi.github.io/cr-api-assets/cards/night-witch.png' },
      { name: 'Mother Witch', image: 'https://royaleapi.github.io/cr-api-assets/cards/mother-witch.png' },
      { name: 'Ram Rider', image: 'https://royaleapi.github.io/cr-api-assets/cards/ram-rider.png' },
      { name: 'Graveyard', image: 'https://royaleapi.github.io/cr-api-assets/cards/graveyard.png' },
      // Official render: https://royaleapi.com/static/img/cards-150/goblin-machine.png
      { name: 'Goblin Machine', image: 'https://royaleapi.com/static/img/cards-150/goblin-machine.png' },
      { name: 'Sparky', image: 'https://royaleapi.github.io/cr-api-assets/cards/sparky.png' },
      // Official render: https://royaleapi.com/static/img/cards-150/spirit-empress.png
      { name: 'Spirit Empress', image: 'https://royaleapi.com/static/img/cards-150/spirit-empress.png' },
      { name: 'Mega Knight', image: 'https://royaleapi.github.io/cr-api-assets/cards/mega-knight.png' },
      { name: 'Lava Hound', image: 'https://royaleapi.github.io/cr-api-assets/cards/lava-hound.png' }
    ],
    'Epic': [
      { name: 'Mirror', image: 'https://royaleapi.github.io/cr-api-assets/cards/mirror.png' },
      { name: 'Barbarian Barrel', image: 'https://royaleapi.github.io/cr-api-assets/cards/barbarian-barrel.png' },
      { name: 'Wall Breakers', image: 'https://royaleapi.github.io/cr-api-assets/cards/wall-breakers.png' },
      // Official render: https://royaleapi.com/static/img/cards-150/goblin-curse.png
      { name: 'Goblin Curse', image: 'https://royaleapi.com/static/img/cards-150/goblin-curse.png' },
      { name: 'Rage', image: 'https://royaleapi.github.io/cr-api-assets/cards/rage.png' },
      { name: 'Goblin Barrel', image: 'https://royaleapi.github.io/cr-api-assets/cards/goblin-barrel.png' },
      { name: 'Guards', image: 'https://royaleapi.github.io/cr-api-assets/cards/guards.png' },
      { name: 'Skeleton Army', image: 'https://royaleapi.github.io/cr-api-assets/cards/skeleton-army.png' },
      { name: 'Clone', image: 'https://royaleapi.github.io/cr-api-assets/cards/clone.png' },
      { name: 'Tornado', image: 'https://royaleapi.github.io/cr-api-assets/cards/tornado.png' },
      // Official render: https://royaleapi.com/static/img/cards-150/void.png
      { name: 'Void', image: 'https://royaleapi.com/static/img/cards-150/void.png' },
      { name: 'Baby Dragon', image: 'https://royaleapi.github.io/cr-api-assets/cards/baby-dragon.png' },
      { name: 'Dark Prince', image: 'https://royaleapi.github.io/cr-api-assets/cards/dark-prince.png' },
      { name: 'Freeze', image: 'https://royaleapi.github.io/cr-api-assets/cards/freeze.png' },
      { name: 'Poison', image: 'https://royaleapi.github.io/cr-api-assets/cards/poison.png' },
      // Official render: https://royaleapi.com/static/img/cards-150/rune-giant.png
      { name: 'Rune Giant', image: 'https://royaleapi.com/static/img/cards-150/rune-giant.png' },
      { name: 'Hunter', image: 'https://royaleapi.github.io/cr-api-assets/cards/hunter.png' },
      { name: 'Goblin Drill', image: 'https://royaleapi.github.io/cr-api-assets/cards/goblin-drill.png' },
      { name: 'Witch', image: 'https://royaleapi.github.io/cr-api-assets/cards/witch.png' },
      { name: 'Balloon', image: 'https://royaleapi.github.io/cr-api-assets/cards/balloon.png' },
      { name: 'Prince', image: 'https://royaleapi.github.io/cr-api-assets/cards/prince.png' },
      { name: 'Electro Dragon', image: 'https://royaleapi.github.io/cr-api-assets/cards/electro-dragon.png' },
      { name: 'Bowler', image: 'https://royaleapi.github.io/cr-api-assets/cards/bowler.png' },
      { name: 'Executioner', image: 'https://royaleapi.github.io/cr-api-assets/cards/executioner.png' },
      { name: 'Cannon Cart', image: 'https://royaleapi.github.io/cr-api-assets/cards/cannon-cart.png' },
      { name: 'Giant Skeleton', image: 'https://royaleapi.github.io/cr-api-assets/cards/giant-skeleton.png' },
      { name: 'Lightning', image: 'https://royaleapi.github.io/cr-api-assets/cards/lightning.png' },
      { name: 'Goblin Giant', image: 'https://royaleapi.github.io/cr-api-assets/cards/goblin-giant.png' },
      { name: 'X-Bow', image: 'https://royaleapi.github.io/cr-api-assets/cards/x-bow.png' },
      { name: 'P.E.K.K.A', image: 'https://royaleapi.github.io/cr-api-assets/cards/pekka.png' },
      { name: 'Electro Giant', image: 'https://royaleapi.github.io/cr-api-assets/cards/electro-giant.png' },
      { name: 'Golem', image: 'https://royaleapi.github.io/cr-api-assets/cards/golem.png' }
    ],
    'Rare': [
      { name: 'Heal Spirit', image: 'https://royaleapi.github.io/cr-api-assets/cards/heal-spirit.png' },
      { name: 'Ice Golem', image: 'https://royaleapi.github.io/cr-api-assets/cards/ice-golem.png' },
      // Official render: https://royaleapi.com/static/img/cards-150/suspicious-bush.png
      { name: 'Suspicious Bush', image: 'https://royaleapi.com/static/img/cards-150/suspicious-bush.png' },
      { name: 'Tombstone', image: 'https://royaleapi.github.io/cr-api-assets/cards/tombstone.png' },
      { name: 'Mega Minion', image: 'https://royaleapi.github.io/cr-api-assets/cards/mega-minion.png' },
      { name: 'Dart Goblin', image: 'https://royaleapi.github.io/cr-api-assets/cards/dart-goblin.png' },
      { name: 'Earthquake', image: 'https://royaleapi.github.io/cr-api-assets/cards/earthquake.png' },
      { name: 'Elixir Golem', image: 'https://royaleapi.github.io/cr-api-assets/cards/elixir-golem.png' },
      { name: 'Fireball', image: 'https://royaleapi.github.io/cr-api-assets/cards/fireball.png' },
      { name: 'Mini P.E.K.K.A', image: 'https://royaleapi.github.io/cr-api-assets/cards/mini-pekka.png' },
      { name: 'Musketeer', image: 'https://royaleapi.github.io/cr-api-assets/cards/musketeer.png' },
      { name: 'Goblin Cage', image: 'https://royaleapi.github.io/cr-api-assets/cards/goblin-cage.png' },
      { name: 'Goblin Hut', image: 'https://cdns3.royaleapi.com/cdn-cgi/image/w=150,h=180,format=auto,q=90/static/img/cards/v5-989631e2/goblin-hut.png', elixir: 4 },
      { name: 'Valkyrie', image: 'https://royaleapi.github.io/cr-api-assets/cards/valkyrie.png' },
      { name: 'Battle Ram', image: 'https://royaleapi.github.io/cr-api-assets/cards/battle-ram.png' },
      { name: 'Bomb Tower', image: 'https://royaleapi.github.io/cr-api-assets/cards/bomb-tower.png' },
      { name: 'Flying Machine', image: 'https://royaleapi.github.io/cr-api-assets/cards/flying-machine.png' },
      { name: 'Hog Rider', image: 'https://royaleapi.github.io/cr-api-assets/cards/hog-rider.png' },
      { name: 'Battle Healer', image: 'https://royaleapi.github.io/cr-api-assets/cards/battle-healer.png' },
      { name: 'Furnace', image: 'https://royaleapi.github.io/cr-api-assets/cards/furnace.png' },
      { name: 'Zappies', image: 'https://royaleapi.github.io/cr-api-assets/cards/zappies.png' },
      // Official render: https://royaleapi.com/static/img/cards-150/goblin-demolisher.png
      { name: 'Goblin Demolisher', image: 'https://royaleapi.com/static/img/cards-150/goblin-demolisher.png' },
      { name: 'Giant', image: 'https://royaleapi.github.io/cr-api-assets/cards/giant.png' },
      { name: 'Inferno Tower', image: 'https://royaleapi.github.io/cr-api-assets/cards/inferno-tower.png' },
      { name: 'Wizard', image: 'https://royaleapi.github.io/cr-api-assets/cards/wizard.png' },
      { name: 'Royal Hogs', image: 'https://royaleapi.github.io/cr-api-assets/cards/royal-hogs.png' },
      { name: 'Rocket', image: 'https://royaleapi.github.io/cr-api-assets/cards/rocket.png' },
      { name: 'Barbarian Hut', image: 'https://royaleapi.github.io/cr-api-assets/cards/barbarian-hut.png' },
      { name: 'Elixir Collector', image: 'https://royaleapi.github.io/cr-api-assets/cards/elixir-collector.png' },
      { name: 'Three Musketeers', image: 'https://royaleapi.github.io/cr-api-assets/cards/three-musketeers.png' }
    ],
    'Common': [
      { name: 'Skeletons', image: 'https://royaleapi.github.io/cr-api-assets/cards/skeletons.png' },
      { name: 'Electro Spirit', image: 'https://royaleapi.github.io/cr-api-assets/cards/electro-spirit.png' },
      { name: 'Fire Spirit', image: 'https://royaleapi.github.io/cr-api-assets/cards/fire-spirit.png' },
      { name: 'Ice Spirit', image: 'https://royaleapi.github.io/cr-api-assets/cards/ice-spirit.png' },
      { name: 'Goblins', image: 'https://royaleapi.github.io/cr-api-assets/cards/goblins.png' },
      { name: 'Spear Goblins', image: 'https://royaleapi.github.io/cr-api-assets/cards/spear-goblins.png' },
      { name: 'Bomber', image: 'https://royaleapi.github.io/cr-api-assets/cards/bomber.png' },
      { name: 'Bats', image: 'https://royaleapi.github.io/cr-api-assets/cards/bats.png' },
      { name: 'Zap', image: 'https://royaleapi.github.io/cr-api-assets/cards/zap.png' },
      { name: 'Giant Snowball', image: 'https://royaleapi.github.io/cr-api-assets/cards/giant-snowball.png' },
      // Official render: https://royaleapi.com/static/img/cards-150/berserker.png
      { name: 'Berserker', image: 'https://royaleapi.com/static/img/cards-150/berserker.png' },
      { name: 'Archers', image: 'https://royaleapi.github.io/cr-api-assets/cards/archers.png' },
      { name: 'Arrows', image: 'https://royaleapi.github.io/cr-api-assets/cards/arrows.png' },
      { name: 'Knight', image: 'https://royaleapi.github.io/cr-api-assets/cards/knight.png' },
      { name: 'Minions', image: 'https://royaleapi.github.io/cr-api-assets/cards/minions.png' },
      { name: 'Cannon', image: 'https://royaleapi.github.io/cr-api-assets/cards/cannon.png' },
      { name: 'Goblin Gang', image: 'https://royaleapi.github.io/cr-api-assets/cards/goblin-gang.png' },
      { name: 'Skeleton Barrel', image: 'https://royaleapi.github.io/cr-api-assets/cards/skeleton-barrel.png' },
      { name: 'Firecracker', image: 'https://royaleapi.github.io/cr-api-assets/cards/firecracker.png' },
      { name: 'Royal Delivery', image: 'https://royaleapi.github.io/cr-api-assets/cards/royal-delivery.png' },
      { name: 'Skeleton Dragons', image: 'https://royaleapi.github.io/cr-api-assets/cards/skeleton-dragons.png' },
      { name: 'Mortar', image: 'https://royaleapi.github.io/cr-api-assets/cards/mortar.png' },
      { name: 'Tesla', image: 'https://royaleapi.github.io/cr-api-assets/cards/tesla.png' },
      { name: 'Barbarians', image: 'https://royaleapi.github.io/cr-api-assets/cards/barbarians.png' },
      { name: 'Minion Horde', image: 'https://royaleapi.github.io/cr-api-assets/cards/minion-horde.png' },
      { name: 'Rascals', image: 'https://royaleapi.github.io/cr-api-assets/cards/rascals.png' },
      { name: 'Royal Giant', image: 'https://royaleapi.github.io/cr-api-assets/cards/royal-giant.png' },
      { name: 'Elite Barbarians', image: 'https://royaleapi.github.io/cr-api-assets/cards/elite-barbarians.png' },
      { name: 'Royal Recruits', image: 'https://royaleapi.github.io/cr-api-assets/cards/royal-recruits.png' }
    ]
  };

  const cardList = document.getElementById('card-list');
  const deck = document.getElementById('deck');
  const clearBtn = document.getElementById('clear-deck');
  const saveBtn = document.getElementById('save-deck');
  const suggestBtn = document.getElementById('suggest-deck');

  // Load deck from localStorage if available
  let currentDeck = JSON.parse(localStorage.getItem('clashDeck')) || [];
  let evolvedIndex = null; // Track which card is evolved
  let lastSuggestionNames = [];

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function renderCardList() {
    cardList.innerHTML = '';
    // Render Heroes section first
    const heroesSection = document.createElement('section');
    heroesSection.className = 'rarity-section';
    const heroesHeader = document.createElement('h4');
    heroesHeader.textContent = `Hero (${Object.keys(heroesCards).length})`;
    heroesHeader.setAttribute('data-rarity', 'Hero');
    heroesSection.appendChild(heroesHeader);
    const heroesGroup = document.createElement('div');
    heroesGroup.className = 'card-list';
    Object.values(heroesCards).forEach(hero => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card-item hero-card-item';
      const elixirClass = 'card-elixir';
      cardDiv.innerHTML = `
        <div class="${elixirClass}">${hero.elixir}</div>
        <img src="${hero.image}" alt="${hero.name}">
        <div class="card-name">${hero.name}</div>
        <div class="card-hero">👑</div>
      `;
      cardDiv.onclick = () => addHero(hero);
      cardDiv.draggable = true;
      cardDiv.ondragstart = (e) => {
        e.dataTransfer.setData('hero-card', hero.name);
      };
      heroesGroup.appendChild(cardDiv);
    });
    heroesSection.appendChild(heroesGroup);
    cardList.appendChild(heroesSection);
    
    // Render regular card rarities
    for (const rarity in cardsByRarity) {
      const section = document.createElement('section');
      section.className = 'rarity-section';
      const header = document.createElement('h4');
      header.textContent = `${rarity} (${cardsByRarity[rarity].length})`;
      header.setAttribute('data-rarity', rarity);
      section.appendChild(header);
      const group = document.createElement('div');
      group.className = 'card-list';
      cardsByRarity[rarity].forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card-item';
        const elixirCost = getElixirCost(card.name);
        const isEvo = isEvolvable(card);
        const elixirClass = elixirCost === '?' ? 'card-elixir mirror' : 'card-elixir';
        cardDiv.innerHTML = `
          <div class="${elixirClass}">${elixirCost}</div>
          <img src="${card.image}" alt="${card.name}">
          <div class="card-name">${card.name}</div>
          ${isEvo ? '<div class="card-evolution">★</div>' : ''}
        `;
        cardDiv.onclick = () => addToDeck(card);
        group.appendChild(cardDiv);
      });
      section.appendChild(group);
      cardList.appendChild(section);
    }
  }

  function getAllCardsFlat() {
    return Object.values(cardsByRarity).flat();
  }

  function getCardByName(name) {
    for (const rarity in cardsByRarity) {
      const found = cardsByRarity[rarity].find(card => card.name === name);
      if (found) return found;
    }
    return null;
  }

  function getSuggestions(currentDeck, excludeNames = []) {
    const allCards = getAllCardsFlat();
    const deckNames = currentDeck.map(c => c.name);
    const excludeSet = new Set([...deckNames, ...excludeNames]);
    const suggestions = [...currentDeck];

    // How many cards do we need to suggest?
    const numToSuggest = 8 - currentDeck.length;
    if (numToSuggest <= 0) return suggestions;

    // Get current deck analysis
    const deckAnalysis = analyzeDeck(currentDeck);
    
    // Pool of available cards (not locked-in, not in last suggestion)
    let available = allCards.filter(card => !excludeSet.has(card.name));
    
    // Remove champions if we already have one
    if (deckAnalysis.hasChampion) {
      available = available.filter(card => !Object.values(cardsByRarity['Champion']).some(champ => champ.name === card.name));
    }

    // Strategic card selection based on deck needs
    const strategicCards = [];
    
    // 1. Win Condition (if missing)
    if (!deckAnalysis.hasWinCondition) {
      const winConditions = available.filter(card => isWinCondition(card));
      if (winConditions.length > 0) {
        strategicCards.push(winConditions[Math.floor(Math.random() * winConditions.length)]);
      }
    }
    
    // 2. Spell support (if missing or insufficient)
    if (deckAnalysis.spellCount < 2) {
      const spells = available.filter(card => isSpell(card));
      const neededSpells = Math.min(2 - deckAnalysis.spellCount, spells.length);
      for (let i = 0; i < neededSpells; i++) {
        if (spells.length > 0) {
          strategicCards.push(spells[Math.floor(Math.random() * spells.length)]);
        }
      }
    }
    
    // 3. Anti-air (if missing)
    if (!deckAnalysis.hasAntiAir) {
      const antiAir = available.filter(card => isAntiAir(card));
      if (antiAir.length > 0) {
        strategicCards.push(antiAir[Math.floor(Math.random() * antiAir.length)]);
      }
    }
    
    // 4. Building (if missing)
    if (!deckAnalysis.hasBuilding) {
      const buildings = available.filter(card => isBuilding(card));
      if (buildings.length > 0) {
        strategicCards.push(buildings[Math.floor(Math.random() * buildings.length)]);
      }
    }
    
    // 5. Fill remaining slots with balanced cards
    const remainingSlots = numToSuggest - strategicCards.length;
    if (remainingSlots > 0) {
      const remainingCards = available.filter(card => !strategicCards.some(sc => sc.name === card.name));
      const balancedCards = selectBalancedCards(remainingCards, remainingSlots, deckAnalysis);
      strategicCards.push(...balancedCards);
    }

    // Add strategic cards to suggestions
    suggestions.push(...strategicCards.slice(0, numToSuggest));
    return suggestions.slice(0, 8);
  }

  // Analyze current deck composition
  function analyzeDeck(deck) {
    const analysis = {
      hasChampion: false,
      hasWinCondition: false,
      hasAntiAir: false,
      hasBuilding: false,
      spellCount: 0,
      averageElixir: 0,
      totalElixir: 0,
      validCards: 0
    };

    deck.forEach(card => {
      const cost = getElixirCost(card.name);
      if (cost !== '?' && cost !== 0) {
        analysis.totalElixir += cost;
        analysis.validCards++;
      }
      
      // Check for champion
      if (Object.values(cardsByRarity['Champion']).some(champ => champ.name === card.name)) {
        analysis.hasChampion = true;
      }
      
      // Check for win condition
      if (isWinCondition(card)) {
        analysis.hasWinCondition = true;
      }
      
      // Check for anti-air
      if (isAntiAir(card)) {
        analysis.hasAntiAir = true;
      }
      
      // Check for building
      if (isBuilding(card)) {
        analysis.hasBuilding = true;
      }
      
      // Check for spell
      if (isSpell(card)) {
        analysis.spellCount++;
      }
    });

    if (analysis.validCards > 0) {
      analysis.averageElixir = analysis.totalElixir / analysis.validCards;
    }

    return analysis;
  }

  // Card type classification functions
  function isWinCondition(card) {
    const winConditions = [
      'Hog Rider', 'Giant', 'Royal Giant', 'Golem', 'Electro Giant', 'Goblin Giant', 'Lava Hound',
      'Balloon', 'X-Bow', 'Mortar', 'Goblin Barrel', 'Goblin Drill', 'Ram Rider', 'Battle Ram',
      'Royal Hogs', 'Three Musketeers', 'Elite Barbarians', 'Royal Recruits', 'Goblin Machine',
      'Rune Giant', 'Giant Skeleton', 'P.E.K.K.A', 'Mega Knight', 'Sparky', 'Lumberjack',
      'Little Prince', 'Golden Knight', 'Skeleton King', 'Mighty Miner', 'Archer Queen', 'Goblinstein', 'Monk', 'Boss Bandit'
    ];
    return winConditions.includes(card.name);
  }

  function isSpell(card) {
    const spells = [
      'Zap', 'Arrows', 'Fireball', 'Poison', 'Lightning', 'Rocket', 'Freeze', 'Rage', 'Clone',
      'Mirror', 'Tornado', 'Earthquake', 'Giant Snowball', 'The Log', 'Barbarian Barrel',
      'Goblin Barrel', 'Graveyard', 'Royal Delivery', 'Goblin Curse', 'Void'
    ];
    return spells.includes(card.name);
  }

  function isAntiAir(card) {
    const antiAir = [
      'Musketeer', 'Archers', 'Wizard', 'Witch', 'Executioner', 'Dart Goblin', 'Magic Archer',
      'Electro Wizard', 'Ice Wizard', 'Hunter', 'Flying Machine', 'Mega Minion', 'Minions',
      'Minion Horde', 'Skeleton Dragons', 'Baby Dragon', 'Electro Dragon', 'Inferno Dragon',
      'Phoenix', 'Lava Hound', 'Balloon', 'Bats', 'Firecracker', 'Princess', 'Royal Ghost',
      'Bandit', 'Night Witch', 'Mother Witch', 'Ram Rider', 'Royal Hogs', 'Elite Barbarians',
      'Royal Recruits', 'Goblin Machine', 'Rune Giant', 'Giant Skeleton', 'P.E.K.K.A', 'Mega Knight',
      'Sparky', 'Lumberjack', 'Little Prince', 'Golden Knight', 'Skeleton King', 'Mighty Miner',
      'Archer Queen', 'Goblinstein', 'Monk', 'Boss Bandit'
    ];
    return antiAir.includes(card.name);
  }

  function isBuilding(card) {
    const buildings = [
      'Cannon', 'Tesla', 'Inferno Tower', 'Bomb Tower', 'X-Bow', 'Mortar', 'Furnace',
      'Goblin Hut', 'Barbarian Hut', 'Tombstone', 'Goblin Cage', 'Elixir Collector'
    ];
    return buildings.includes(card.name);
  }

  function selectBalancedCards(availableCards, count, deckAnalysis) {
    const selected = [];
    const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
    
    // Prioritize cards that complement the current deck
    for (let i = 0; i < shuffled.length && selected.length < count; i++) {
      const card = shuffled[i];
      const cost = getElixirCost(card.name);
      
      // Skip if cost is invalid
      if (cost === '?' || cost === 0) continue;
      
      // Balance elixir curve
      const wouldBeAverage = (deckAnalysis.totalElixir + cost) / (deckAnalysis.validCards + 1);
      const isGoodFit = wouldBeAverage >= 3.0 && wouldBeAverage <= 4.5;
      
      if (isGoodFit) {
        selected.push(card);
      }
    }
    
    // If we don't have enough balanced cards, add any remaining
    for (let i = 0; i < shuffled.length && selected.length < count; i++) {
      const card = shuffled[i];
      if (!selected.some(s => s.name === card.name)) {
        selected.push(card);
      }
    }
    
    return selected.slice(0, count);
  }

  // Suggest evolutions for the current deck
  function suggestEvolutions() {
    // Clear current evolutions
    evolutions = [];
    
    // Get evolvable cards in the deck
    const evolvableCardsInDeck = currentDeck.filter(card => isEvolvable(card));
    
    if (evolvableCardsInDeck.length === 0) {
      return; // No evolvable cards in deck
    }
    
    // Strategic evolution selection
    const suggestedEvolutions = selectStrategicEvolutions(evolvableCardsInDeck);
    
    // Add up to 2 suggested evolutions
    evolutions = suggestedEvolutions.slice(0, 2);
    
    // Update the display
    renderEvolutions();
    renderDeck();
  }

  // Select strategic evolutions based on deck composition
  function selectStrategicEvolutions(evolvableCards) {
    const deckAnalysis = analyzeDeck(currentDeck);
    const evolutionPriorities = [];
    
    // Priority 1: Win condition evolutions (highest priority)
    const winConditionEvolutions = evolvableCards.filter(card => isWinCondition(card));
    if (winConditionEvolutions.length > 0) {
      evolutionPriorities.push(...winConditionEvolutions);
    }
    
    // Priority 2: Spell evolutions (for cycle decks)
    const spellEvolutions = evolvableCards.filter(card => isSpell(card));
    if (spellEvolutions.length > 0) {
      evolutionPriorities.push(...spellEvolutions);
    }
    
    // Priority 3: Anti-air evolutions (for defense)
    const antiAirEvolutions = evolvableCards.filter(card => isAntiAir(card));
    if (antiAirEvolutions.length > 0) {
      evolutionPriorities.push(...antiAirEvolutions);
    }
    
    // Priority 4: Building evolutions (for defense)
    const buildingEvolutions = evolvableCards.filter(card => isBuilding(card));
    if (buildingEvolutions.length > 0) {
      evolutionPriorities.push(...buildingEvolutions);
    }
    
    // Priority 5: Support evolutions (remaining cards)
    const supportEvolutions = evolvableCards.filter(card => 
      !winConditionEvolutions.includes(card) &&
      !spellEvolutions.includes(card) &&
      !antiAirEvolutions.includes(card) &&
      !buildingEvolutions.includes(card)
    );
    if (supportEvolutions.length > 0) {
      evolutionPriorities.push(...supportEvolutions);
    }
    
    // Remove duplicates and shuffle within each priority group for variety
    const uniqueCards = [];
    const seenNames = new Set();
    
    evolutionPriorities.forEach(card => {
      if (!seenNames.has(card.name)) {
        uniqueCards.push(card);
        seenNames.add(card.name);
      }
    });
    
    const shuffled = [];
    let currentPriority = [];
    let currentType = null;
    
    uniqueCards.forEach(card => {
      const cardType = getEvolutionPriorityType(card);
      
      if (currentType !== cardType) {
        if (currentPriority.length > 0) {
          shuffled.push(...currentPriority.sort(() => Math.random() - 0.5));
        }
        currentPriority = [card];
        currentType = cardType;
      } else {
        currentPriority.push(card);
      }
    });
    
    // Add the last group
    if (currentPriority.length > 0) {
      shuffled.push(...currentPriority.sort(() => Math.random() - 0.5));
    }
    
    return shuffled;
  }

  // Get evolution priority type for sorting
  function getEvolutionPriorityType(card) {
    if (isWinCondition(card)) return 'win';
    if (isSpell(card)) return 'spell';
    if (isAntiAir(card)) return 'antiAir';
    if (isBuilding(card)) return 'building';
    return 'support';
  }

  // Show error message for non-evolvable cards
  function showEvolutionError(cardName) {
    // Create temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'evolution-error';
    errorDiv.textContent = `${cardName} cannot be evolved!`;
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #e74c3c;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: fadeInOut 2s ease-in-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(errorDiv);
    
    // Remove after animation
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 2000);
  }

  function updateSuggestBtn() {
    suggestBtn.style.display = '';
  }

  // Suggest Cards button event handler
  suggestBtn.onclick = () => {
    // Treat any card not in lastSuggestionNames as locked (user-selected)
    const lockedNames = currentDeck.map(c => c.name).filter(name => !lastSuggestionNames.includes(name));
    const lockedCards = lockedNames.map(name => getCardByName(name));
    let suggestions, suggestionNames;
    let tries = 0;
    do {
      suggestions = getSuggestions(lockedCards, lastSuggestionNames);
      suggestionNames = suggestions.map(c => c.name);
      tries++;
    } while (
      // Only compare suggested (non-locked) cards for uniqueness within this suggestion
      (suggestionNames.filter(n => !lockedNames.includes(n)).some(n => lastSuggestionNames.includes(n)))
      && tries < 20
    );
    const newSuggestions = suggestions.filter(c => !lockedNames.includes(c.name));
    currentDeck = [...lockedCards, ...newSuggestions].slice(0, 8);
    // Track only the suggested (not locked) cards for next comparison
    lastSuggestionNames = newSuggestions.map(c => c.name);
    
    // Suggest evolutions for the new deck
    suggestEvolutions();
    
    renderDeck();
    updateSuggestBtn();
  };

  // List of evolvable cards (from https://www.deckshop.pro/card/list)
  const evolvableCards = {
    // Current evolution cards as of January 2026
    'Archers': 'https://royaleapi.com/static/img/cards-150/archers-evo.png',
    'Bats': 'https://royaleapi.com/static/img/cards-150/bats-evo.png',
    'Barbarians': 'https://royaleapi.com/static/img/cards-150/barbarians-evo.png',
    'Bomber': 'https://royaleapi.com/static/img/cards-150/bomber-evo.png',
    'Cannon': 'https://royaleapi.com/static/img/cards-150/cannon-evo.png',
    'Dart Goblin': 'https://royaleapi.com/static/img/cards-150/dart-goblin-evo.png',
    'Firecracker': 'https://royaleapi.com/static/img/cards-150/firecracker-evo.png',
    'Ice Spirit': 'https://royaleapi.com/static/img/cards-150/ice-spirit-evo.png',
    'Knight': 'https://royaleapi.com/static/img/cards-150/knight-evo.png',
    'Lumberjack': 'https://royaleapi.com/static/img/cards-150/lumberjack-evo.png',
    'Mortar': 'https://royaleapi.com/static/img/cards-150/mortar-evo.png',
    'Musketeer': 'https://royaleapi.com/static/img/cards-150/musketeer-evo.png',
    'Royal Giant': 'https://royaleapi.com/static/img/cards-150/royal-giant-evo.png',
    'Skeleton Barrel': 'https://royaleapi.com/static/img/cards-150/skeleton-barrel-evo.png',
    'Skeletons': 'https://royaleapi.com/static/img/cards-150/skeletons-evo.png',
    'Valkyrie': 'https://royaleapi.com/static/img/cards-150/valkyrie-evo.png',
    'Wall Breakers': 'https://royaleapi.com/static/img/cards-150/wall-breakers-evo.png',
    'Zap': 'https://royaleapi.com/static/img/cards-150/zap-evo.png',
    'Battle Ram': 'https://royaleapi.com/static/img/cards-150/battle-ram-evo.png',
    'Elixir Golem': 'https://royaleapi.com/static/img/cards-150/elixir-golem-evo.png',
    'Goblin Barrel': 'https://royaleapi.com/static/img/cards-150/goblin-barrel-ev1.png',
    'Witch': 'https://royaleapi.com/static/img/cards-150/witch-ev1.png',
    'Inferno Dragon': 'https://royaleapi.com/static/img/cards-150/inferno-dragon-evo.png',
    'Mega Knight': 'https://royaleapi.com/static/img/cards-150/mega-knight-evo.png',
    'Hunter': 'https://royaleapi.com/static/img/cards-150/hunter-evo.png',
    'Goblin Drill': 'https://royaleapi.com/static/img/cards-150/goblin-drill-evo.png',
    'Electro Dragon': 'https://royaleapi.com/static/img/cards-150/electro-dragon-evo.png',
    'Executioner': 'https://royaleapi.com/static/img/cards-150/executioner-evo.png',
    'P.E.K.K.A': 'https://royaleapi.com/static/img/cards-150/pekka-evo.png',
    'Wizard': 'https://royaleapi.com/static/img/cards-150/wizard-evo.png',
    'Giant Snowball': 'https://royaleapi.com/static/img/cards-150/giant-snowball-evo.png',
    'Tesla': 'https://royaleapi.com/static/img/cards-150/tesla-evo.png',
    'Royal Recruits': 'https://royaleapi.com/static/img/cards-150/royal-recruits-evo.png',
    'Baby Dragon': 'https://royaleapi.com/static/img/cards-150/baby-dragon-evo.png',
    'Royal Ghost': 'https://royaleapi.com/static/img/cards-150/royal-ghost-evo.png',
    'Skeleton Army': 'https://royaleapi.com/static/img/cards-150/skeleton-army-evo.png',
    'Royal Hogs': 'https://royaleapi.com/static/img/cards-150/royal-hogs-evo.png'
  };

  // Normalize card names for evolvable check
  function normalizeName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Build a normalized evolvableCards map for fast lookup
  const evolvableCardsNormalized = {};
  for (const key in evolvableCards) {
    evolvableCardsNormalized[normalizeName(key)] = evolvableCards[key];
  }

  // Track up to 2 evolved card indexes in the deck
  let evolvedIndexes = JSON.parse(localStorage.getItem('clashDeckEvolvedIndexes')) || [];

  // Get elixir cost for a card
  function getElixirCost(cardName) {
    return elixirCosts[cardName] || 0;
  }

  // Calculate and update average elixir cost
  function updateAverageElixir() {
    const averageElixirDiv = document.getElementById('average-elixir');
    if (currentDeck.length === 0) {
      averageElixirDiv.textContent = 'Average: --';
      return;
    }
    
    let totalElixir = 0;
    let validCards = 0;
    
    currentDeck.forEach(card => {
      const cost = getElixirCost(card.name);
      if (cost !== '?' && cost !== 0) {
        totalElixir += cost;
        validCards++;
      }
    });
    
    if (validCards === 0) {
      averageElixirDiv.textContent = 'Average: --';
      return;
    }
    
    const average = (totalElixir / validCards).toFixed(1);
    averageElixirDiv.textContent = `Average: ${average}`;
  }

  function isEvolvable(card) {
    return evolvableCards.hasOwnProperty(card.name);
  }

  function getEvolvedImage(card) {
    return card.image;
  }

  // --- Heroes helper functions ---
  function isHero(cardName) {
    return heroesCards.hasOwnProperty(cardName);
  }

  function getHeroByName(name) {
    return heroesCards[name] || null;
  }

  // --- Drag-and-drop Evolutions logic ---
  let evolutions = [];
  const evolutionsDrop = document.getElementById('evolutions-drop');

  // --- Drag-and-drop Heroes logic ---
  let heroes = [];
  const heroesDrop = document.getElementById('heroes-drop');

  function renderEvolutions() {
    // Always show evolutions area
    const evolutionsArea = document.getElementById('evolutions-area');
    evolutionsArea.style.display = '';
    evolutionsDrop.innerHTML = '';
    if (evolutions.length === 0) {
      evolutionsDrop.textContent = 'Drag up to 2 cards here';
    } else {
      // Add a small indicator if evolutions were auto-suggested
      const suggestionIndicator = document.createElement('div');
      suggestionIndicator.className = 'evolution-suggestion-indicator';
      suggestionIndicator.textContent = '✨ Suggested';
      suggestionIndicator.style.cssText = 'font-size: 10px; color: #a569bd; margin-bottom: 5px; font-weight: bold;';
      evolutionsDrop.appendChild(suggestionIndicator);
      
      evolutions.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'evo-card';
        cardDiv.draggable = true;
        const elixirCost = getElixirCost(card.name);
        const isEvo = isEvolvable(card);
        const elixirClass = elixirCost === '?' ? 'card-elixir mirror' : 'card-elixir';
        cardDiv.innerHTML = `
          <div class="${elixirClass}">${elixirCost}</div>
          <img src="${card.image}" alt="${card.name}">
          <div class="card-name">${card.name}</div>
          ${isEvo ? '<div class="card-evolution">★</div>' : ''}
        `;
        cardDiv.ondragstart = (e) => {
          e.dataTransfer.setData('evo-card', card.name);
        };
        cardDiv.onclick = () => {
          evolutions = evolutions.filter(c => c.name !== card.name);
          renderEvolutions();
          renderDeck();
        };
        evolutionsDrop.appendChild(cardDiv);
      });
    }
  }

  evolutionsDrop.ondragover = (e) => {
    e.preventDefault();
    const cardName = e.dataTransfer.getData('deck-card');
    if (cardName) {
      const card = currentDeck.find(c => c.name === cardName);
      if (card && isEvolvable(card)) {
        evolutionsDrop.classList.add('dragover');
      } else {
        evolutionsDrop.classList.add('dragover-invalid');
      }
    } else {
      evolutionsDrop.classList.add('dragover');
    }
  };
  evolutionsDrop.ondragleave = () => {
    evolutionsDrop.classList.remove('dragover');
    evolutionsDrop.classList.remove('dragover-invalid');
  };
  evolutionsDrop.ondrop = (e) => {
    evolutionsDrop.classList.remove('dragover');
    evolutionsDrop.classList.remove('dragover-invalid');
    const cardName = e.dataTransfer.getData('deck-card');
    if (!cardName) return;
    if (evolutions.length >= 2) return;
    const card = currentDeck.find(c => c.name === cardName);
    if (card && !evolutions.some(c => c.name === card.name)) {
      // Check if the card is evolvable before allowing it to be dropped
      if (isEvolvable(card)) {
        evolutions.push(card);
        renderEvolutions();
        renderDeck();
      } else {
        // Show feedback that the card cannot be evolved
        showEvolutionError(card.name);
      }
    }
  };

  // --- Update renderDeck for drag ---
  function renderDeck() {
    deck.innerHTML = '';
    currentDeck.forEach((card, idx) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'deck-card';
      cardDiv.draggable = true;
      const elixirCost = getElixirCost(card.name);
      const isEvo = isEvolvable(card);
      const elixirClass = elixirCost === '?' ? 'card-elixir mirror' : 'card-elixir';
      cardDiv.innerHTML = `
        <div class="${elixirClass}">${elixirCost}</div>
        <img src="${card.image}" alt="${card.name}">
        <div class="card-name">${card.name}</div>
        ${isEvo ? '<div class="card-evolution">★</div>' : ''}
      `;
      cardDiv.ondragstart = (e) => {
        e.dataTransfer.setData('deck-card', card.name);
      };
      // If card is in evolutions, show a purple border
      if (evolutions.some(c => c.name === card.name)) {
        cardDiv.style.border = '2.5px solid #a569bd';
        cardDiv.style.background = '#f8e6ff';
      }
      cardDiv.title = 'Click to remove';
      cardDiv.onclick = () => {
        // Remove from deck and from evolutions if present
        evolutions = evolutions.filter(c => c.name !== card.name);
        removeFromDeck(idx);
        renderEvolutions();
      };
      deck.appendChild(cardDiv);
    });
    updateSuggestBtn();
    renderEvolutions();
    updateAverageElixir();
  }

  function addToDeck(card) {
    // Heroes cannot be added to the regular deck - they use Hero Slots
    if (isHero(card.name)) {
      alert('Heroes cannot be added to your regular deck! Use the Heroes area to select Heroes.');
      return;
    }
    if (currentDeck.length >= 8) {
      alert('Your deck can only have 8 cards!');
      return;
    }
    if (currentDeck.find(c => c.name === card.name)) {
      alert('This card is already in your deck!');
      return;
    }
    // Only allow one Champion in the deck
    const isChampion = Object.values(cardsByRarity['Champion']).some(c => c.name === card.name);
    if (isChampion && currentDeck.some(c => Object.values(cardsByRarity['Champion']).some(champ => champ.name === c.name))) {
      alert('You can only have one Champion in your deck!');
      return;
    }
    currentDeck.push(card);
    renderDeck();
  }

  function removeFromDeck(idx) {
    currentDeck.splice(idx, 1);
    evolvedIndexes = evolvedIndexes.filter(i => i !== idx).map(i => (i > idx ? i - 1 : i));
    renderDeck();
  }

  function renderHeroes() {
    const heroesArea = document.getElementById('heroes-area');
    if (!heroesArea) return; // Heroes area may not exist on all pages
    heroesArea.style.display = '';
    heroesDrop.innerHTML = '';
    if (heroes.length === 0) {
      heroesDrop.textContent = 'Drag up to 2 Heroes here';
    } else {
      heroes.forEach(hero => {
        const heroDiv = document.createElement('div');
        heroDiv.className = 'hero-card';
        heroDiv.draggable = true;
        heroDiv.innerHTML = `
          <div class="card-elixir">${hero.elixir}</div>
          <img src="${hero.image}" alt="${hero.name}">
          <div class="card-name">${hero.name}</div>
          <div class="card-hero">👑</div>
        `;
        heroDiv.ondragstart = (e) => {
          e.dataTransfer.setData('hero-card', hero.name);
        };
        heroDiv.onclick = () => {
          heroes = heroes.filter(h => h.name !== hero.name);
          renderHeroes();
        };
        heroesDrop.appendChild(heroDiv);
      });
    }
  }

  function addHero(hero) {
    if (heroes.length >= 2) {
      alert('You can only have up to 2 Heroes!');
      return;
    }
    if (heroes.find(h => h.name === hero.name)) {
      alert('This Hero is already selected!');
      return;
    }
    heroes.push(hero);
    renderHeroes();
  }

  // Heroes drag and drop handlers
  if (heroesDrop) {
    heroesDrop.ondragover = (e) => {
      e.preventDefault();
      const heroName = e.dataTransfer.getData('hero-card');
      if (heroName && isHero(heroName)) {
        heroesDrop.classList.add('dragover');
      } else {
        heroesDrop.classList.add('dragover-invalid');
      }
    };

    heroesDrop.ondragleave = () => {
      heroesDrop.classList.remove('dragover');
      heroesDrop.classList.remove('dragover-invalid');
    };

    heroesDrop.ondrop = (e) => {
      e.preventDefault();
      heroesDrop.classList.remove('dragover');
      heroesDrop.classList.remove('dragover-invalid');
      const heroName = e.dataTransfer.getData('hero-card');
      if (!heroName || !isHero(heroName)) return;
      if (heroes.length >= 2) return;
      const hero = getHeroByName(heroName);
      if (hero && !heroes.some(h => h.name === hero.name)) {
        heroes.push(hero);
        renderHeroes();
      }
    };
  }

  // When clearing deck, also clear evolutions and heroes
  clearBtn.onclick = () => {
    currentDeck = [];
    evolutions = [];
    heroes = [];
    // Reset suggestion tracking when clearing deck
    lastSuggestionNames = [];
    renderDeck();
    renderEvolutions();
    renderHeroes();
  };

  // When saving, save evolutions and heroes too
  saveBtn.onclick = () => {
    localStorage.setItem('clashDeck', JSON.stringify(currentDeck));
    localStorage.setItem('clashDeckEvolutions', JSON.stringify(evolutions.map(c => c.name)));
    localStorage.setItem('clashDeckHeroes', JSON.stringify(heroes.map(h => h.name)));
    alert('Deck saved!');
  };

  // On load, restore evolutions and heroes if possible
  if (localStorage.getItem('clashDeckEvolutions')) {
    const evoNames = JSON.parse(localStorage.getItem('clashDeckEvolutions'));
    evolutions = evoNames.map(name => getCardByName(name)).filter(Boolean);
  }

  if (localStorage.getItem('clashDeckHeroes')) {
    const heroNames = JSON.parse(localStorage.getItem('clashDeckHeroes'));
    heroes = heroNames.map(name => getHeroByName(name)).filter(Boolean);
  }

  // Initial render
  renderCardList();
  renderDeck();
  renderEvolutions();
  renderHeroes();
} 