import { useState, useEffect } from 'react'
import './App.css'

const CARDS = {
  civilian: [
    { id: 'altar', name: 'Altar', icon: '⛪', points: 2, age: 1 },
    { id: 'theater', name: 'Theater', icon: '🎭', points: 2, age: 1 },
    { id: 'baths', name: 'Baths', icon: '🛁', points: 3, age: 1 },
    { id: 'courthouse', name: 'Courthouse', icon: '⚖️', points: 4, age: 2 },
    { id: 'statue', name: 'Statue', icon: '🗿', points: 4, age: 2 },
    { id: 'temple', name: 'Temple', icon: '🏛️', points: 3, age: 2 },
    { id: 'aqueduct', name: 'Aqueduct', icon: '💧', points: 5, age: 2 },
    { id: 'gardens', name: 'Gardens', icon: '🌺', points: 5, age: 3 },
    { id: 'senate', name: 'Senate', icon: '🏛️', points: 6, age: 3 },
    { id: 'townhall', name: 'Town Hall', icon: '🏛️', points: 6, age: 3 },
    { id: 'pantheon', name: 'Pantheon', icon: '🏛️', points: 7, age: 3 },
    { id: 'palace', name: 'Palace', icon: '🏰', points: 8, age: 3 }
  ],
  commercial: [
    { id: 'tavern', name: 'Tavern', icon: '🍺', points: 5, age: 1 },
    { id: 'easttrading', name: 'East Trading Post', icon: '🏪', points: 'neighbor', age: 1 },
    { id: 'westtrading', name: 'West Trading Post', icon: '🏪', points: 'neighbor', age: 1 },
    { id: 'marketplace', name: 'Marketplace', icon: '🏪', points: 'neighbor', age: 1 },
    { id: 'caravansery', name: 'Caravansery', icon: '🐪', points: 'neighbor', age: 2 },
    { id: 'forum', name: 'Forum', icon: '🏛️', points: 'neighbor', age: 2 },
    { id: 'vineyard', name: 'Vineyard', icon: '🍇', points: 'neighbor', age: 2 },
    { id: 'bazaar', name: 'Bazaar', icon: '🏪', points: 'neighbor', age: 2 },
    { id: 'haven', name: 'Haven', icon: '⚓', points: 'neighbor', age: 3 },
    { id: 'lighthouse', name: 'Lighthouse', icon: '🗼', points: 'neighbor', age: 3 },
    { id: 'chamber', name: 'Chamber of Commerce', icon: '💰', points: 'neighbor', age: 3 },
    { id: 'arena', name: 'Arena', icon: '🏟️', points: 'neighbor', age: 3 },
    { id: 'ludus', name: 'Ludus Magnus', icon: '🏟️', points: 'neighbor', age: 3 }
  ],
  military: [
    { id: 'barracks', name: 'Barracks', icon: '🏠', points: 1, age: 1 },
    { id: 'guard_tower', name: 'Guard Tower', icon: '🗼', points: 1, age: 1 },
    { id: 'stockade', name: 'Stockade', icon: '🛡️', points: 1, age: 1 },
    { id: 'walls', name: 'Walls', icon: '🧱', points: 2, age: 2 },
    { id: 'training_ground', name: 'Training Ground', icon: '⚔️', points: 2, age: 2 },
    { id: 'stables', name: 'Stables', icon: '🐎', points: 2, age: 2 },
    { id: 'archery_range', name: 'Archery Range', icon: '🏹', points: 2, age: 2 },
    { id: 'fortifications', name: 'Fortifications', icon: '🏰', points: 3, age: 3 },
    { id: 'circus', name: 'Circus', icon: '🎪', points: 3, age: 3 },
    { id: 'arsenal', name: 'Arsenal', icon: '⚔️', points: 3, age: 3 },
    { id: 'siege_workshop', name: 'Siege Workshop', icon: '🏗️', points: 3, age: 3 }
  ],
  guilds: [
    { id: 'workers', name: 'Workers Guild', icon: '🔨', points: 'neighbor' },
    { id: 'craftmens', name: 'Craftmens Guild', icon: '⚒️', points: 'neighbor' },
    { id: 'traders', name: 'Traders Guild', icon: '💰', points: 'neighbor' },
    { id: 'philosophers', name: 'Philosophers Guild', icon: '📚', points: 'neighbor' },
    { id: 'spies', name: 'Spies Guild', icon: '🕵️', points: 'neighbor' },
    { id: 'strategists', name: 'Strategists Guild', icon: '⚔️', points: 'neighbor' },
    { id: 'shipowners', name: 'Shipowners Guild', icon: '⛵', points: 'neighbor' },
    { id: 'scientists', name: 'Scientists Guild', icon: '🧪', points: 'neighbor' },
    { id: 'magistrates', name: 'Magistrates Guild', icon: '⚖️', points: 'neighbor' },
    { id: 'builders', name: 'Builders Guild', icon: '🏗️', points: 'neighbor' }
  ],
  science: [
    { id: 'apothecary', name: 'Apothecary', icon: '🧪', symbol: 'compass', points: 'science', age: 1 },
    { id: 'workshop', name: 'Workshop', icon: '⚙️', symbol: 'gear', points: 'science', age: 1 },
    { id: 'scriptorium', name: 'Scriptorium', icon: '📜', symbol: 'tablet', points: 'science', age: 1 },
    { id: 'dispensary', name: 'Dispensary', icon: '🧪', symbol: 'compass', points: 'science', age: 2 },
    { id: 'laboratory', name: 'Laboratory', icon: '⚗️', symbol: 'gear', points: 'science', age: 2 },
    { id: 'library', name: 'Library', icon: '📚', symbol: 'tablet', points: 'science', age: 2 },
    { id: 'school', name: 'School', icon: '🏫', symbol: 'tablet', points: 'science', age: 2 },
    { id: 'lodge', name: 'Lodge', icon: '🧭', symbol: 'compass', points: 'science', age: 3 },
    { id: 'observatory', name: 'Observatory', icon: '🔭', symbol: 'gear', points: 'science', age: 3 },
    { id: 'university', name: 'University', icon: '🎓', symbol: 'tablet', points: 'science', age: 3 },
    { id: 'academy', name: 'Academy', icon: '🏫', symbol: 'compass', points: 'science', age: 3 },
    { id: 'study', name: 'Study', icon: '📖', symbol: 'gear', points: 'science', age: 3 }
  ]
};

const WONDERS = [
  { 
    id: 'colossus', 
    name: 'Rhódos (Colossus)', 
    icon: '🗿',
    stages: { 
      A: [3, 0, 7], // Stage 2 gives military strength only
      B: [3, 4] // Only 2 stages on B side
    }
  },
  { 
    id: 'alexandria', 
    name: 'Alexandria (Lighthouse)', 
    icon: '🗼',
    stages: { 
      A: [3, 0, 7], // Stage 2 gives resources only
      B: [0, 0, 7] // Stages 1&2 give resources only
    }
  },
  { 
    id: 'ephesos', 
    name: 'Éphesos (Temple of Artemis)', 
    icon: '🏛️',
    stages: { 
      A: [3, 0, 7], // Stage 2 gives coins only
      B: [2, 3, 5] // All stages give points + coins
    }
  },
  { 
    id: 'babylon', 
    name: 'Babylon (Hanging Gardens)', 
    icon: '🏛️',
    stages: { 
      A: [3, 0, 7], // Stage 2 gives science symbol only
      B: [0, 0] // Stages give special abilities only
    }
  },
  { 
    id: 'olympia', 
    name: 'Olympía (Statue of Zeus)', 
    icon: '🏛️',
    stages: { 
      A: [3, 0, 7], // Stage 2 gives free building ability only
      B: [2, 3, 5] // All stages give points + abilities
    }
  },
  { 
    id: 'halikarnassos', 
    name: 'Halikarnassos (Mausoleum)', 
    icon: '⚱️',
    stages: { 
      A: [3, 0, 7], // Stage 2 gives discard ability only
      B: [2, 1, 0] // Stage 3 gives discard ability only
    }
  },
  { 
    id: 'gizah', 
    name: 'Gizah (Great Pyramid)', 
    icon: '🔺',
    stages: { 
      A: [3, 5, 7],
      B: [3, 5, 5, 7] // 4 stages on B side
    }
  }
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [gameData, setGameData] = useState({
    playerCount: 3,
    wonder: null,
    wonderSide: 'A',
    wonderStages: [],
    civilianCards: [],
    commercialCards: [],
    guildsCards: [],
    scienceCards: [],
    militaryScore: 0,
    wonderScience: { compass: 0, gear: 0, tablet: 0 },
    neighborInteractions: {}
  });
  const [showNeighborDialog, setShowNeighborDialog] = useState(null);

  // Auto-update Babylon science when science cards change
  useEffect(() => {
    if (steps[currentStep] === 'Wonder Science Bonus' && gameData.wonder?.id === 'babylon') {
      const babylonData = calculateOptimalBabylonScience();
      if (babylonData) {
        setGameData(prev => ({
          ...prev,
          wonderScience: {
            compass: babylonData.bestChoice === 'compass' ? 1 : 0,
            gear: babylonData.bestChoice === 'gear' ? 1 : 0,
            tablet: babylonData.bestChoice === 'tablet' ? 1 : 0
          }
        }));
      }
    }
  }, [gameData.scienceCards, currentStep]);

  const steps = [
    'Player Count',
    'Wonder Selection', 
    'Wonder Stages',
    'Civilian Buildings (Blue)',
    'Science Buildings (Green)',
    ...(gameData.wonder?.id === 'babylon' && 
        ((gameData.wonderSide === 'A' && gameData.wonderStages.length >= 2) ||
         (gameData.wonderSide === 'B' && gameData.wonderStages.length >= 2)) ? ['Wonder Science Bonus'] : []),
    'Military Score',
    'Commercial Buildings (Yellow)',
    'Guilds (Purple)',
    'Final Score'
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectWonder = (wonder) => {
    setGameData(prev => ({ ...prev, wonder }));
  };

  const toggleWonderSide = () => {
    setGameData(prev => ({ 
      ...prev, 
      wonderSide: prev.wonderSide === 'A' ? 'B' : 'A',
      wonderStages: [] 
    }));
  };

  const toggleWonderStage = (stage) => {
    setGameData(prev => {
      if (prev.wonderStages.includes(stage)) {
        // If removing a stage, remove all higher stages too
        return {
          ...prev,
          wonderStages: prev.wonderStages.filter(s => s < stage)
        };
      } else {
        // If adding a stage, add all lower stages too
        const allStages = [];
        for (let i = 1; i <= stage; i++) {
          allStages.push(i);
        }
        return {
          ...prev,
          wonderStages: [...new Set([...prev.wonderStages, ...allStages])]
        };
      }
    });
  };

  const toggleCard = (card, category) => {
    const categoryKey = `${category}Cards`;
    const isSelected = gameData[categoryKey].find(c => c.id === card.id);
    
    // Check guild card limit
    if (category === 'guilds' && !isSelected && gameData.guildsCards.length >= gameData.playerCount) {
      alert(`You can only select ${gameData.playerCount} guild cards.`);
      return;
    }
    
    setGameData(prev => ({
      ...prev,
      [categoryKey]: isSelected
        ? prev[categoryKey].filter(c => c.id !== card.id)
        : [...prev[categoryKey], card]
    }));

    if (card.points === 'neighbor' && !isSelected) {
      setShowNeighborDialog({ card, category });
    }
  };

  const handleNeighborInteraction = (value) => {
    const { multiplier } = getNeighborPrompt(showNeighborDialog.card.id);
    const actualPoints = value * multiplier;
    
    setGameData(prev => ({
      ...prev,
      neighborInteractions: {
        ...prev.neighborInteractions,
        [showNeighborDialog.card.id]: actualPoints
      }
    }));
    setShowNeighborDialog(null);
  };

  const getNeighborPrompt = (cardId) => {
    const maxWonderStages = gameData.wonder?.id === 'gizah' && gameData.wonderSide === 'B' ? 4 : 3;
    
    const prompts = {
      // Guilds
      'workers': { question: "How many brown resource cards do your neighbors have?", multiplier: 1 },
      'craftmens': { question: "How many gray manufactured good cards do your neighbors have?", multiplier: 2 },
      'traders': { question: "How many yellow commercial cards do your neighbors have?", multiplier: 1 },
      'philosophers': { question: "How many green science cards do your neighbors have?", multiplier: 1 },
      'spies': { question: "How many red military cards do your neighbors have?", multiplier: 1 },
      'strategists': { question: "How many military defeat tokens do your neighbors have?", multiplier: 1 },
      'shipowners': { question: "How many brown/gray/purple cards do your neighbors have?", multiplier: 1 },
      'scientists': { question: "How many science symbols do your neighbors have?", multiplier: 1 },
      'magistrates': { question: "How many blue civilian cards do your neighbors have?", multiplier: 1 },
      'builders': { question: "How many wonder stages have your neighbors built?", multiplier: 1 },
      
      // Commercial buildings
      'easttrading': { question: "How many brown resource cards does your right neighbor have?", multiplier: 1 },
      'westtrading': { question: "How many brown resource cards does your left neighbor have?", multiplier: 1 },
      'marketplace': { question: "How many gray manufactured good cards do your neighbors have?", multiplier: 1 },
      'caravansery': { question: "How many brown resource cards do your neighbors have?", multiplier: 1 },
      'forum': { question: "How many gray manufactured good cards do your neighbors have?", multiplier: 1 },
      'vineyard': { question: "How many brown resource cards do you and your neighbors have?", multiplier: 1 },
      'bazaar': { question: "How many gray manufactured good cards do you and your neighbors have?", multiplier: 2 },
      'haven': { question: "How many brown resource cards do you have?", multiplier: 1 },
      'lighthouse': { question: "How many yellow commercial cards do you have?", multiplier: 1 },
      'chamber': { question: "How many gray manufactured good cards do you have?", multiplier: 2 },
      'arena': { question: `How many wonder stages have you built? (Max ${maxWonderStages})`, multiplier: 3, max: maxWonderStages },
      'ludus': { question: "How many wonder stages have your neighbors built?", multiplier: 3 }
    };
    
    return prompts[cardId] || { question: "Enter points from neighbors:", multiplier: 1 };
  };

  const renderWonderSelection = () => (
    <div className="step-content">
      <h2>Select Your Wonder</h2>
      <div className="wonder-grid">
        {WONDERS.map(wonder => (
          <div 
            key={wonder.id} 
            className={`wonder-card ${gameData.wonder?.id === wonder.id ? 'selected' : ''}`}
            onClick={() => selectWonder(wonder)}
          >
            <div className="wonder-icon">{wonder.icon}</div>
            <h3>{wonder.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlayerCount = () => (
    <div className="step-content">
      <h2>Number of Players</h2>
      <div className="player-count-selector">
        <p>How many players are in this game?</p>
        <div className="player-buttons">
          {[3, 4, 5, 6, 7].map(count => (
            <button
              key={count}
              className={`player-btn ${gameData.playerCount === count ? 'active' : ''}`}
              onClick={() => setGameData(prev => ({ ...prev, playerCount: count }))}
            >
              {count} Players
            </button>
          ))}
        </div>
        <p className="player-info">
          Guild cards available: {gameData.playerCount + 2}<br/>
          (Only {gameData.playerCount} guilds will be used in the game)
        </p>
      </div>
    </div>
  );

  const renderWonderStages = () => {
    const wonderStages = gameData.wonder?.stages[gameData.wonderSide] || [];
    
    return (
      <div className="step-content">
        <h2>Wonder Stages - {gameData.wonder?.name}</h2>
        
        <div className="wonder-side-selector">
          <button 
            className={`side-btn ${gameData.wonderSide === 'A' ? 'active' : ''}`}
            onClick={toggleWonderSide}
          >
            Side A (Day)
          </button>
          <button 
            className={`side-btn ${gameData.wonderSide === 'B' ? 'active' : ''}`}
            onClick={toggleWonderSide}
          >
            Side B (Night)
          </button>
        </div>

        <div className="wonder-stages">
          <h3>Select Completed Stages:</h3>
          {wonderStages.map((stagePoints, index) => {
            const stageNumber = index + 1;
            return (
              <div 
                key={stageNumber}
                className={`stage-card ${gameData.wonderStages.includes(stageNumber) ? 'selected' : ''}`}
                onClick={() => toggleWonderStage(stageNumber)}
              >
                <div className="stage-header">Stage {stageNumber} ({gameData.wonderSide})</div>
                <div className="stage-points">{stagePoints} VP</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCardSelection = (category, cards, title) => (
    <div className="step-content">
      <h2>{title}</h2>
      <div className="card-grid">
        {cards.map(card => (
          <div 
            key={card.id}
            className={`card ${gameData[`${category}Cards`]?.find(c => c.id === card.id) ? 'selected' : ''}`}
            onClick={() => toggleCard(card, category)}
          >
            <div className="card-icon">{card.icon}</div>
            <div className="card-info">
              <h4>{card.name}</h4>
              <span className="points">
                {card.points === 'neighbor' ? 'Neighbor' : 
                 card.points === 'science' ? card.symbol : 
                 `${card.points}pts`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const calculateOptimalBabylonScience = () => {
    if (gameData.wonder?.id !== 'babylon' || 
        !((gameData.wonderSide === 'A' && gameData.wonderStages.length >= 2) ||
          (gameData.wonderSide === 'B' && gameData.wonderStages.length >= 2))) {
      return null;
    }

    // Count current science symbols from cards
    const currentSymbols = { compass: 0, gear: 0, tablet: 0 };
    gameData.scienceCards.forEach(card => {
      currentSymbols[card.symbol]++;
    });

    // Calculate score for each possible choice
    const choices = ['compass', 'gear', 'tablet'];
    let bestChoice = 'compass';
    let bestScore = 0;

    choices.forEach(choice => {
      const testSymbols = { ...currentSymbols };
      testSymbols[choice]++;
      
      const compassSquared = testSymbols.compass * testSymbols.compass;
      const gearSquared = testSymbols.gear * testSymbols.gear;
      const tabletSquared = testSymbols.tablet * testSymbols.tablet;
      const sets = Math.min(testSymbols.compass, testSymbols.gear, testSymbols.tablet);
      
      const score = compassSquared + gearSquared + tabletSquared + (sets * 7);
      
      if (score > bestScore) {
        bestScore = score;
        bestChoice = choice;
      }
    });

    return { bestChoice, bestScore, currentSymbols };
  };

  const renderWonderScience = () => {
    const babylonData = calculateOptimalBabylonScience();

    if (!babylonData) {
      return (
        <div className="step-content">
          <h2>Wonder Science Bonus</h2>
          <p>Your wonder doesn't provide science symbols. Click Next to continue.</p>
        </div>
      );
    }

    const { bestChoice, currentSymbols } = babylonData;
    
    // Auto-select the optimal choice only once
    if (gameData.wonderScience.compass === 0 && gameData.wonderScience.gear === 0 && gameData.wonderScience.tablet === 0) {
      setGameData(prev => ({
        ...prev,
        wonderScience: {
          compass: bestChoice === 'compass' ? 1 : 0,
          gear: bestChoice === 'gear' ? 1 : 0,
          tablet: bestChoice === 'tablet' ? 1 : 0
        }
      }));
    }

    const symbolEmoji = bestChoice === 'compass' ? '🧭' : bestChoice === 'gear' ? '⚙️' : '📜';

    return (
      <div className="step-content">
        <h2>Wonder Science Bonus - Babylon</h2>
        <div className="babylon-analysis">
          <p>Your current science cards:</p>
          <div className="current-science">
            <span>🧭 Compass: {currentSymbols.compass}</span>
            <span>⚙️ Gear: {currentSymbols.gear}</span>
            <span>📜 Tablet: {currentSymbols.tablet}</span>
          </div>
          
          <div className="optimal-choice">
            <h3>Optimal Choice: {symbolEmoji} {bestChoice}</h3>
            <p>This maximizes your science score based on your current cards.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderMilitaryScore = () => (
    <div className="step-content">
      <h2>Military Score</h2>
      <div className="military-input">
        <label>Total Military Points:</label>
        <input 
          type="number" 
          value={gameData.militaryScore}
          onChange={(e) => setGameData(prev => ({ 
            ...prev, 
            militaryScore: parseInt(e.target.value) || 0 
          }))}
          min="-6"
          max="18"
        />
        <p>Enter your total military victory points (+1/+3/+5 per age win, -1 per loss)</p>
      </div>
    </div>
  );

  const renderFinalScore = () => {
    const calculateScore = () => {
      let total = 0;
      let breakdown = {};
      
      // Civilian cards
      const civilianPoints = gameData.civilianCards.reduce((sum, card) => sum + (card.points || 0), 0);
      breakdown.civilian = civilianPoints;
      total += civilianPoints;
      
      // Military conflict points
      breakdown.military = gameData.militaryScore;
      total += gameData.militaryScore;
      
      // Wonder stages
      const wonderPoints = gameData.wonderStages.reduce((sum, stageNum) => {
        const stagePoints = gameData.wonder?.stages[gameData.wonderSide]?.[stageNum - 1];
        return sum + (stagePoints || 0);
      }, 0);
      
      // Add bonus points for Gizah wonder stages
      let wonderBonus = 0;
      if (gameData.wonder?.id === 'gizah' && gameData.wonderStages.length > 0) {
        const maxStage = Math.max(...gameData.wonderStages);
        if (gameData.wonderSide === 'A' && maxStage >= 3) {
          // Stage 3 A gives +2 VP per wonder stage built
          wonderBonus = gameData.wonderStages.length * 2;
        } else if (gameData.wonderSide === 'B') {
          if (maxStage >= 3) {
            // Stage 3 B gives +3 VP per wonder stage built
            wonderBonus = gameData.wonderStages.length * 3;
          }
          if (maxStage >= 4) {
            // Stage 4 B gives +4 VP per wonder stage built (replaces stage 3 bonus)
            wonderBonus = gameData.wonderStages.length * 4;
          }
        }
      }
      
      breakdown.wonder = wonderPoints + wonderBonus;
      total += wonderPoints + wonderBonus;
      
      // Science points calculation
      const scienceSymbols = { compass: 0, gear: 0, tablet: 0 };
      
      // Count science cards
      gameData.scienceCards.forEach(card => {
        scienceSymbols[card.symbol]++;
      });
      
      // Add wonder science bonus
      scienceSymbols.compass += gameData.wonderScience.compass;
      scienceSymbols.gear += gameData.wonderScience.gear;
      scienceSymbols.tablet += gameData.wonderScience.tablet;
      
      // Calculate science score: sum of squares + 7 * sets of 3
      const compassSquared = scienceSymbols.compass * scienceSymbols.compass;
      const gearSquared = scienceSymbols.gear * scienceSymbols.gear;
      const tabletSquared = scienceSymbols.tablet * scienceSymbols.tablet;
      const sets = Math.min(scienceSymbols.compass, scienceSymbols.gear, scienceSymbols.tablet);
      
      const sciencePoints = compassSquared + gearSquared + tabletSquared + (sets * 7);
      breakdown.science = sciencePoints;
      total += sciencePoints;
      
      // Commercial points
      const commercialPoints = gameData.commercialCards.reduce((sum, card) => {
        if (card.points === 'neighbor') {
          return sum + (gameData.neighborInteractions[card.id] || 0);
        }
        return sum + (card.points || 0);
      }, 0);
      breakdown.commercial = commercialPoints;
      total += commercialPoints;
      
      // Guild points
      const guildPoints = gameData.guildsCards.reduce((sum, card) => {
        return sum + (gameData.neighborInteractions[card.id] || 0);
      }, 0);
      breakdown.guilds = guildPoints;
      total += guildPoints;
      
      return { total, breakdown };
    };

    const { total, breakdown } = calculateScore();

    return (
      <div className="step-content">
        <h2>Final Score</h2>
        <div className="score-breakdown">
          <div className="score-item">
            <span>Wonder Stages:</span>
            <span>{breakdown.wonder} pts</span>
          </div>
          <div className="score-item">
            <span>Civilian Buildings:</span>
            <span>{breakdown.civilian} pts</span>
          </div>
          <div className="score-item">
            <span>Military Conflicts:</span>
            <span>{breakdown.military} pts</span>
          </div>
          <div className="score-item">
            <span>Science Buildings:</span>
            <span>{breakdown.science} pts</span>
          </div>
          <div className="score-item">
            <span>Commercial Buildings:</span>
            <span>{breakdown.commercial} pts</span>
          </div>
          <div className="score-item">
            <span>Guilds:</span>
            <span>{breakdown.guilds} pts</span>
          </div>
          <div className="score-total">
            <span>Total Score:</span>
            <span>{total} pts</span>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    const stepName = steps[currentStep];
    
    switch (stepName) {
      case 'Player Count': return renderPlayerCount();
      case 'Wonder Selection': return renderWonderSelection();
      case 'Wonder Stages': return renderWonderStages();
      case 'Civilian Buildings (Blue)': return renderCardSelection('civilian', CARDS.civilian, 'Civilian Buildings (Blue)');
      case 'Science Buildings (Green)': return renderCardSelection('science', CARDS.science, 'Science Buildings (Green)');
      case 'Wonder Science Bonus': return renderWonderScience();
      case 'Military Score': return renderMilitaryScore();
      case 'Commercial Buildings (Yellow)': return renderCardSelection('commercial', CARDS.commercial, 'Commercial Buildings (Yellow)');
      case 'Guilds (Purple)': return renderCardSelection('guilds', CARDS.guilds, 'Guilds (Purple)');
      case 'Final Score': return renderFinalScore();
      default: return renderPlayerCount();
    }
  };

  return (
    <div className="app">
      <h1>7 Wonders Calculator</h1>
      
      <div className="progress">
        <div className="steps">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(index)}
              style={{ cursor: 'pointer' }}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {renderCurrentStep()}

      <div className="navigation">
        <button 
          onClick={prevStep} 
          disabled={currentStep === 0}
          className="nav-btn"
        >
          Previous
        </button>
        <span className="step-counter">{currentStep + 1} of {steps.length}</span>
        <button 
          onClick={nextStep} 
          disabled={currentStep === steps.length - 1 || (steps[currentStep] === 'Wonder Selection' && !gameData.wonder)}
          className="nav-btn"
        >
          Next
        </button>
      </div>

      {showNeighborDialog && (
        <div className="modal-overlay">
          <div className="neighbor-dialog">
            <h3>{showNeighborDialog.card.name}</h3>
            <p>{getNeighborPrompt(showNeighborDialog.card.id).question}</p>
            <input 
              type="number" 
              min="0" 
              max={getNeighborPrompt(showNeighborDialog.card.id).max || undefined}
              placeholder="Count"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNeighborInteraction(parseInt(e.target.value) || 0);
                }
              }}
            />
            <div className="dialog-buttons">
              <button onClick={() => handleNeighborInteraction(0)}>Cancel</button>
              <button onClick={() => {
                const input = document.querySelector('.neighbor-dialog input');
                handleNeighborInteraction(parseInt(input.value) || 0);
              }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
