import { useState, useEffect, Component, memo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend);

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

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h3>Something went wrong. Please refresh and try again.</h3>;
    }
    return this.props.children;
  }
}

const Card = memo(({ card, category, selected, toggleCard, getNeighborPrompt }) => (
  <div 
    className={`card ${selected ? 'selected' : ''}`}
    onClick={() => toggleCard(card, category)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && toggleCard(card, category)}
    aria-label={`Select ${card.name} card`}
  >
    <div className="card-icon">{card.icon}</div>
    <div className="card-info">
      <h4>{card.name}</h4>
      <span 
        className="points" 
        title={card.points === 'neighbor' ? getNeighborPrompt(card.id).question : ''}
      >
        {card.points === 'neighbor' ? 'Neighbor' : 
         card.points === 'science' ? card.symbol : 
         `${card.points}pts`}
      </span>
    </div>
  </div>
));

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [gameData, setGameData] = useState({
    playerCount: 3,
    wonder: null,
    wonderSide: 'A',
    wonderStages: [],
    civilianCards: [],
    commercialCards: [],
    militaryCards: [],
    guildsCards: [],
    scienceCards: [],
    militaryScore: 0,
    coins: 0,
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
    'Coins',
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
        return {
          ...prev,
          wonderStages: prev.wonderStages.filter(s => s < stage)
        };
      } else {
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
    const { multiplier, max } = getNeighborPrompt(showNeighborDialog.card.id);
    const actualValue = Math.min(parseInt(value) || 0, max || Infinity);
    const actualPoints = actualValue * multiplier;
    
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
              aria-label={`Select ${count} players`}
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

  const renderWonderSelection = () => (
    <div className="step-content">
      <h2>Select Your Wonder</h2>
      <div className="wonder-grid">
        {WONDERS.map(wonder => (
          <div 
            key={wonder.id} 
            className={`wonder-card ${gameData.wonder?.id === wonder.id ? 'selected' : ''}`}
            onClick={() => selectWonder(wonder)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && selectWonder(wonder)}
            aria-label={`Select ${wonder.name} wonder`}
          >
            <div className="wonder-icon">{wonder.icon}</div>
            <h3>{wonder.name}</h3>
          </div>
        ))}
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
            aria-label="Select Side A (Day)"
          >
            Side A (Day)
          </button>
          <button 
            className={`side-btn ${gameData.wonderSide === 'B' ? 'active' : ''}`}
            onClick={toggleWonderSide}
            aria-label="Select Side B (Night)"
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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleWonderStage(stageNumber)}
                aria-label={`Toggle Stage ${stageNumber}`}
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
      {[1, 2, 3].map(age => (
        <div key={age}>
          <h3>Age {age}</h3>
          <div className="card-grid">
            {cards
              .filter(card => !card.age || card.age === age)
              .map(card => (
                <Card 
                  key={card.id} 
                  card={card} 
                  category={category} 
                  selected={gameData[`${category}Cards`]?.find(c => c.id === card.id)} 
                  toggleCard={toggleCard} 
                  getNeighborPrompt={getNeighborPrompt}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  const calculateOptimalBabylonScience = () => {
    if (gameData.wonder?.id !== 'babylon' || 
        !((gameData.wonderSide === 'A' && gameData.wonderStages.length >= 2) ||
          (gameData.wonderSide === 'B' && gameData.wonderStages.length >= 2))) {
      return null;
    }

    const currentSymbols = { compass: 0, gear: 0, tablet: 0 };
    gameData.scienceCards.forEach(card => {
      currentSymbols[card.symbol]++;
    });

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
          aria-label="Enter total military points"
        />
        <p>Enter your total military victory points (+1/+3/+5 per age win, -1 per loss)</p>
      </div>
    </div>
  );

  const renderCoins = () => (
    <div className="step-content">
      <h2>Coins</h2>
      <div className="coins-input">
        <label>Total Coins:</label>
        <input 
          type="number" 
          value={gameData.coins}
          onChange={(e) => setGameData(prev => ({ 
            ...prev, 
            coins: parseInt(e.target.value) || 0 
          }))}
          min="0"
          aria-label="Enter total coins"
        />
        <p>Enter your total coins (1 VP per 3 coins). Ephesos (Side B) adds 4 coins per stage.</p>
      </div>
    </div>
  );

  const renderFinalScore = () => {
    const calculateScore = () => {
      let total = 0;
      let breakdown = {};
      
      const civilianPoints = gameData.civilianCards.reduce((sum, card) => sum + (card.points || 0), 0);
      breakdown.civilian = civilianPoints;
      total += civilianPoints;
      
      breakdown.military = gameData.militaryScore;
      total += gameData.militaryScore;
      
      const wonderPoints = gameData.wonderStages.reduce((sum, stageNum) => {
        const stagePoints = gameData.wonder?.stages[gameData.wonderSide]?.[stageNum - 1];
        return sum + (stagePoints || 0);
      }, 0);
      
      let wonderBonus = 0;
      if (gameData.wonder?.id === 'gizah' && gameData.wonderStages.length > 0) {
        const maxStage = Math.max(...gameData.wonderStages);
        if (gameData.wonderSide === 'A' && maxStage >= 3) {
          wonderBonus = gameData.wonderStages.length * 2;
        } else if (gameData.wonderSide === 'B') {
          if (maxStage >= 4) {
            wonderBonus = gameData.wonderStages.length * 4;
          } else if (maxStage >= 3) {
            wonderBonus = gameData.wonderStages.length * 3;
          }
        }
      }
      
      breakdown.wonder = wonderPoints + wonderBonus;
      total += wonderPoints + wonderBonus;
      
      const scienceSymbols = { compass: 0, gear: 0, tablet: 0 };
      gameData.scienceCards.forEach(card => {
        scienceSymbols[card.symbol]++;
      });
      scienceSymbols.compass += gameData.wonderScience.compass;
      scienceSymbols.gear += gameData.wonderScience.gear;
      scienceSymbols.tablet += gameData.wonderScience.tablet;
      
      const compassSquared = scienceSymbols.compass * scienceSymbols.compass;
      const gearSquared = scienceSymbols.gear * scienceSymbols.gear;
      const tabletSquared = scienceSymbols.tablet * scienceSymbols.tablet;
      const sets = Math.min(scienceSymbols.compass, scienceSymbols.gear, scienceSymbols.tablet);
      
      const sciencePoints = compassSquared + gearSquared + tabletSquared + (sets * 7);
      breakdown.science = sciencePoints;
      total += sciencePoints;
      
      const commercialPoints = gameData.commercialCards.reduce((sum, card) => {
        if (card.points === 'neighbor') {
          return sum + (gameData.neighborInteractions[card.id] || 0);
        }
        return sum + (card.points || 0);
      }, 0);
      breakdown.commercial = commercialPoints;
      total += commercialPoints;
      
      const guildPoints = gameData.guildsCards.reduce((sum, card) => {
        return sum + (gameData.neighborInteractions[card.id] || 0);
      }, 0);
      breakdown.guilds = guildPoints;
      total += guildPoints;
      
      const coinPoints = Math.floor(gameData.coins / 3);
      breakdown.coins = coinPoints;
      total += coinPoints;
      
      return { total, breakdown };
    };

    const { total, breakdown } = calculateScore();

    const chartData = {
      labels: ['Wonder', 'Civilian', 'Military', 'Science', 'Commercial', 'Guilds', 'Coins'],
      datasets: [{
        data: [
          breakdown.wonder,
          breakdown.civilian,
          breakdown.military,
          breakdown.science,
          breakdown.commercial,
          breakdown.guilds,
          breakdown.coins
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF']
      }]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Score Breakdown' }
      }
    };

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
          <div className="score-item">
            <span>Coins:</span>
            <span>{breakdown.coins} pts</span>
          </div>
          <div className="score-total">
            <span>Total Score:</span>
            <span>{total} pts</span>
          </div>
        </div>
        {/* <div className="score-chart">
          <Pie data={chartData} options={chartOptions} />
        </div> */}
      </div>
    );
  };

  const saveGame = () => {
    localStorage.setItem('7wonders_game', JSON.stringify(gameData));
    alert('Game saved!');
  };

  const loadGame = () => {
    const saved = localStorage.getItem('7wonders_game');
    if (saved) {
      setGameData(JSON.parse(saved));
      alert('Game loaded!');
    } else {
      alert('No saved game found.');
    }
  };

  const resetGame = () => {
    setGameData({
      playerCount: 3,
      wonder: null,
      wonderSide: 'A',
      wonderStages: [],
      civilianCards: [],
      commercialCards: [],
      militaryCards: [],
      guildsCards: [],
      scienceCards: [],
      militaryScore: 0,
      coins: 0,
      wonderScience: { compass: 0, gear: 0, tablet: 0 },
      neighborInteractions: {}
    });
    setCurrentStep(0);
    alert('Game reset!');
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
      case 'Coins': return renderCoins();
      case 'Commercial Buildings (Yellow)': return renderCardSelection('commercial', CARDS.commercial, 'Commercial Buildings (Yellow)');
      case 'Guilds (Purple)': return renderCardSelection('guilds', CARDS.guilds, 'Guilds (Purple)');
      case 'Final Score': return renderFinalScore();
      default: return renderPlayerCount();
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <h1>7 Wonders Calculator</h1>
        <div className="game-controls">
          <button onClick={saveGame} className="nav-btn" aria-label="Save game">Save Game</button>
          <button onClick={loadGame} className="nav-btn" aria-label="Load game">Load Game</button>
          <button onClick={resetGame} className="nav-btn" aria-label="Reset game">Reset Game</button>
        </div>
        
        <div className="progress">
          <div className="steps">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => index <= currentStep ? setCurrentStep(index) : null}
                style={{ cursor: index <= currentStep ? 'pointer' : 'not-allowed' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && index <= currentStep && setCurrentStep(index)}
                aria-label={`Go to ${step}`}
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
            aria-label="Go to previous step"
          >
            Previous
          </button>
          <span className="step-counter">{currentStep + 1} of {steps.length}</span>
          <button 
            onClick={nextStep} 
            disabled={currentStep === steps.length - 1 || (steps[currentStep] === 'Wonder Selection' && !gameData.wonder)}
            className="nav-btn"
            aria-label="Go to next step"
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
                    handleNeighborInteraction(e.target.value);
                  }
                }}
                aria-label="Enter neighbor interaction count"
              />
              <div className="dialog-buttons">
                <button onClick={() => handleNeighborInteraction(0)} aria-label="Cancel neighbor input">Cancel</button>
                <button onClick={() => {
                  const input = document.querySelector('.neighbor-dialog input');
                  handleNeighborInteraction(input.value);
                }} aria-label="Confirm neighbor input">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;