import { useState, useEffect, useMemo, useCallback, Component, memo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./App.css";

ChartJS.register(ArcElement, Tooltip, Legend);

/*
 * Card / wonder data verified against the official 7 Wonders rulebook
 * (Repos Production 2010, Antoine Bauza). Only effects that influence the
 * final score are modeled: victory points, coins, military shields and
 * science symbols. Production / build-cost effects are intentionally omitted
 * because this is a score calculator, not a play aid.
 */

const CARDS = {
  // Blue — score victory points directly.
  civilian: [
    { id: "altar", name: "Altar", icon: "⛪", points: 3, age: 1 },
    { id: "theater", name: "Theater", icon: "🎭", points: 3, age: 1 },
    { id: "baths", name: "Baths", icon: "🛁", points: 3, age: 1 },
    { id: "pawnshop", name: "Pawnshop", icon: "🏦", points: 3, age: 1 },
    { id: "courthouse", name: "Courthouse", icon: "⚖️", points: 4, age: 2 },
    { id: "statue", name: "Statue", icon: "🗿", points: 4, age: 2 },
    { id: "temple", name: "Temple", icon: "🏛️", points: 4, age: 2 },
    { id: "aqueduct", name: "Aqueduct", icon: "💧", points: 5, age: 2 },
    { id: "gardens", name: "Gardens", icon: "🌺", points: 5, age: 3 },
    { id: "senate", name: "Senate", icon: "🏛️", points: 6, age: 3 },
    { id: "townhall", name: "Town Hall", icon: "🏛️", points: 6, age: 3 },
    { id: "pantheon", name: "Pantheon", icon: "🏛️", points: 7, age: 3 },
    { id: "palace", name: "Palace", icon: "🏰", points: 8, age: 3 },
  ],
  // Yellow — most are coin/production effects; only a few Age III cards score
  // end-game VP. `points` (flat VP) or `coinsPer`/`vpPer` neighbor-style entries.
  commercial: [
    { id: "tavern", name: "Tavern", icon: "🍺", points: 0, age: 1 },
    { id: "easttrading", name: "East Trading Post", icon: "🏪", points: 0, age: 1 },
    { id: "westtrading", name: "West Trading Post", icon: "🏪", points: 0, age: 1 },
    { id: "marketplace", name: "Marketplace", icon: "🏪", points: 0, age: 1 },
    { id: "caravansery", name: "Caravansery", icon: "🐪", points: 0, age: 2 },
    { id: "forum", name: "Forum", icon: "🏟️", points: 0, age: 2 },
    { id: "vineyard", name: "Vineyard", icon: "🍇", points: 0, age: 2 },
    { id: "bazaar", name: "Bazaar", icon: "🏺", points: 0, age: 2 },
    { id: "haven", name: "Haven", icon: "⚓", points: "scaling", age: 3 },
    { id: "lighthouse", name: "Lighthouse", icon: "🗼", points: "scaling", age: 3 },
    { id: "chamber", name: "Chamber of Commerce", icon: "💰", points: "scaling", age: 3 },
    { id: "arena", name: "Arena", icon: "🏟️", points: "scaling", age: 3 },
  ],
  // Red — shields. Tracked only through the military conflict score input,
  // so these are informational (not individually selectable for scoring).
  military: [
    { id: "stockade", name: "Stockade", icon: "🛡️", shields: 1, age: 1 },
    { id: "barracks", name: "Barracks", icon: "🏠", shields: 1, age: 1 },
    { id: "guard_tower", name: "Guard Tower", icon: "🗼", shields: 1, age: 1 },
    { id: "walls", name: "Walls", icon: "🧱", shields: 2, age: 2 },
    { id: "training_ground", name: "Training Ground", icon: "⚔️", shields: 2, age: 2 },
    { id: "stables", name: "Stables", icon: "🐎", shields: 2, age: 2 },
    { id: "archery_range", name: "Archery Range", icon: "🏹", shields: 2, age: 2 },
    { id: "fortifications", name: "Fortifications", icon: "🏰", shields: 3, age: 3 },
    { id: "circus", name: "Circus", icon: "🎪", shields: 3, age: 3 },
    { id: "arsenal", name: "Arsenal", icon: "⚔️", shields: 3, age: 3 },
    { id: "siege_workshop", name: "Siege Workshop", icon: "🏗️", shields: 3, age: 3 },
  ],
  // Purple — scored by counting cards in your own and/or neighboring cities.
  guilds: [
    { id: "workers", name: "Workers Guild", icon: "🔨", points: "scaling" },
    { id: "craftmens", name: "Craftsmens Guild", icon: "⚒️", points: "scaling" },
    { id: "traders", name: "Traders Guild", icon: "💰", points: "scaling" },
    { id: "philosophers", name: "Philosophers Guild", icon: "📚", points: "scaling" },
    { id: "spies", name: "Spies Guild", icon: "🕵️", points: "scaling" },
    { id: "decorators", name: "Decorators Guild", icon: "🎨", points: "decorators" },
    { id: "shipowners", name: "Shipowners Guild", icon: "⛵", points: "scaling" },
    { id: "scientists", name: "Scientists Guild", icon: "🧪", points: "science" },
    { id: "magistrates", name: "Magistrates Guild", icon: "⚖️", points: "scaling" },
    { id: "builders", name: "Builders Guild", icon: "🏗️", points: "scaling" },
  ],
  // Green — science symbols (compass / gear / tablet).
  science: [
    { id: "apothecary", name: "Apothecary", icon: "🧪", symbol: "compass", age: 1 },
    { id: "workshop", name: "Workshop", icon: "⚙️", symbol: "gear", age: 1 },
    { id: "scriptorium", name: "Scriptorium", icon: "📜", symbol: "tablet", age: 1 },
    { id: "dispensary", name: "Dispensary", icon: "🧪", symbol: "compass", age: 2 },
    { id: "laboratory", name: "Laboratory", icon: "⚗️", symbol: "gear", age: 2 },
    { id: "library", name: "Library", icon: "📚", symbol: "tablet", age: 2 },
    { id: "school", name: "School", icon: "🏫", symbol: "tablet", age: 2 },
    { id: "lodge", name: "Lodge", icon: "🧭", symbol: "compass", age: 3 },
    { id: "observatory", name: "Observatory", icon: "🔭", symbol: "gear", age: 3 },
    { id: "university", name: "University", icon: "🎓", symbol: "tablet", age: 3 },
    { id: "academy", name: "Academy", icon: "🏫", symbol: "compass", age: 3 },
    { id: "study", name: "Study", icon: "📖", symbol: "gear", age: 3 },
  ],
};

// Local board art lives in /public/wonders/<id>_<side>.webp (downloaded from
// the 7 Wonders wiki, art © Miguel Coimbra / Repos Production).
const boardArt = (wonderId, side) => `${import.meta.env.BASE_URL}wonders/${wonderId}_${side}.webp`;

/*
 * Wonders modeled per stage. Each stage object may carry:
 *   vp      victory points
 *   coins   coins gained when built (scored at 1 VP / 3 coins)
 *   shields military shields (informational — folded into conflict input)
 *   science a science symbol of choice (compass/gear/tablet, player picks)
 *   note    short human description of any non-scoring effect
 * Values verified against the official rulebook (pp. 8–9).
 */
const WONDERS = [
  {
    id: "colossus",
    name: "Rhódos",
    sub: "The Colossus of Rhodes",
    icon: "🗿",
    stages: {
      A: [{ vp: 3 }, { shields: 2, note: "+2 shields" }, { vp: 7 }],
      B: [
        { vp: 3, coins: 3, shields: 1, note: "+1 shield, +3 coins" },
        { vp: 4, coins: 4, shields: 1, note: "+1 shield, +4 coins" },
      ],
    },
  },
  {
    id: "alexandria",
    name: "Alexandria",
    sub: "The Lighthouse of Alexandria",
    icon: "🗼",
    stages: {
      A: [{ vp: 3 }, { note: "Free raw material each turn" }, { vp: 7 }],
      B: [
        { note: "Free raw material each turn" },
        { note: "Free manufactured good each turn" },
        { vp: 7 },
      ],
    },
  },
  {
    id: "ephesos",
    name: "Éphesos",
    sub: "The Temple of Artemis",
    icon: "🏛️",
    stages: {
      A: [{ vp: 3 }, { coins: 9, note: "+9 coins" }, { vp: 7 }],
      B: [
        { vp: 2, coins: 4, note: "+4 coins" },
        { vp: 3, coins: 4, note: "+4 coins" },
        { vp: 5, coins: 4, note: "+4 coins" },
      ],
    },
  },
  {
    id: "babylon",
    name: "Babylon",
    sub: "The Hanging Gardens",
    icon: "🌳",
    stages: {
      A: [{ vp: 3 }, { science: true, note: "+1 science symbol of choice" }, { vp: 7 }],
      B: [
        { vp: 3 },
        { note: "Play your 7th card each Age" },
        { science: true, note: "+1 science symbol of choice" },
      ],
    },
  },
  {
    id: "olympia",
    name: "Olympía",
    sub: "The Statue of Zeus",
    icon: "🏟️",
    stages: {
      A: [{ vp: 3 }, { note: "Build the 1st card of each colour free" }, { vp: 7 }],
      B: [
        { note: "Buy raw materials for 1 coin" },
        { vp: 5 },
        { guild: true, note: "Copy a neighbor's Guild" },
      ],
    },
  },
  {
    id: "halikarnassos",
    name: "Halikarnassós",
    sub: "The Mausoleum",
    icon: "⚱️",
    stages: {
      A: [{ vp: 3 }, { note: "Build a discarded card free" }, { vp: 7 }],
      B: [
        { vp: 2, note: "Build a discarded card free" },
        { vp: 1, note: "Build a discarded card free" },
        { note: "Build a discarded card free" },
      ],
    },
  },
  {
    id: "gizah",
    name: "Gizah",
    sub: "The Great Pyramid",
    icon: "🔺",
    stages: {
      A: [{ vp: 3 }, { vp: 5 }, { vp: 7 }],
      B: [{ vp: 3 }, { vp: 5 }, { vp: 5 }, { vp: 7 }],
    },
  },
];

const SCIENCE_EMOJI = { compass: "🧭", gear: "⚙️", tablet: "📜" };

// Real symbol/token art in /public/icons/ (from the 7 Wonders wiki).
const iconUrl = (name) => `${import.meta.env.BASE_URL}icons/${name}.png`;
const SymbolIcon = ({ name, size = 18, alt = "" }) => (
  <img
    src={iconUrl(name)}
    alt={alt}
    width={size}
    height={size}
    className="sym-icon"
    onError={(e) => (e.currentTarget.style.display = "none")}
  />
);

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <h3 style={{ color: "white", textAlign: "center" }}>Something went wrong. Please refresh and try again.</h3>;
    }
    return this.props.children;
  }
}

const cardArt = (id) => `${import.meta.env.BASE_URL}cards/${id}.png`;

const pointsLabel = (card) => {
  if (card.points === "scaling") return "scaling";
  if (card.points === "decorators") return "7 if full";
  if (card.symbol) return SCIENCE_EMOJI[card.symbol];
  if (card.points === "science") return "science";
  if (card.shields) return `${card.shields} ⚔`;
  if (card.points) return `${card.points} pts`;
  return "—";
};

const Card = memo(({ card, category, selected, toggleCard, hint }) => (
  <div
    className={`card ${selected ? "selected" : ""}`}
    onClick={() => toggleCard(card, category)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggleCard(card, category))}
    aria-pressed={!!selected}
    aria-label={`${card.name}${selected ? ", selected" : ""}`}
    title={hint || card.name}
  >
    <div className="card-art">
      <img
        src={cardArt(card.id)}
        alt=""
        loading="lazy"
        draggable="false"
        onError={(e) => {
          // Fall back to the emoji tile if no art is bundled for this card.
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement.classList.add("noart");
        }}
      />
      <span className="card-emoji" aria-hidden="true">
        {card.icon}
      </span>
      {selected && <span className="card-check" aria-hidden="true">✓</span>}
    </div>
    <div className="card-info">
      <h4>{card.name}</h4>
      <span className="points">
        {card.symbol ? <SymbolIcon name={card.symbol} size={16} alt={card.symbol} /> : pointsLabel(card)}
      </span>
    </div>
  </div>
));

const blankGame = () => ({
  playerCount: 3,
  wonder: null,
  wonderSide: "A",
  wonderStages: [],
  civilianCards: [],
  commercialCards: [],
  guildsCards: [],
  scienceCards: [],
  militaryScore: 0,
  coins: 0,
  wonderScience: null, // chosen symbol for Babylon / Scientists guild copies
  scientistsChoice: null,
  neighborInteractions: {},
});

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [gameData, setGameData] = useState(blankGame);
  const [showNeighborDialog, setShowNeighborDialog] = useState(null);
  const [toast, setToast] = useState("");

  const flash = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }, []);

  const currentStages = useMemo(
    () => gameData.wonder?.stages?.[gameData.wonderSide] || [],
    [gameData.wonder, gameData.wonderSide]
  );

  // Does the chosen wonder/side grant a free science symbol (Babylon)?
  const wonderGrantsScience = useMemo(
    () => currentStages.some((s, i) => s.science && gameData.wonderStages.includes(i + 1)),
    [currentStages, gameData.wonderStages]
  );
  const hasScientistsGuild = gameData.guildsCards.some((c) => c.id === "scientists");
  const needsScienceChoice = wonderGrantsScience || hasScientistsGuild;

  const steps = useMemo(
    () => [
      "Players",
      "Wonder",
      "Stages",
      "Coins",
      "Civilian",
      "Science",
      ...(needsScienceChoice ? ["Science Bonus"] : []),
      "Military",
      "Commercial",
      "Guilds",
      "Score",
    ],
    [needsScienceChoice]
  );

  // Keep currentStep valid when the step list grows/shrinks.
  useEffect(() => {
    if (currentStep > steps.length - 1) setCurrentStep(steps.length - 1);
  }, [steps.length, currentStep]);

  const nextStep = () => setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1));

  const selectWonder = (wonder) => setGameData((prev) => ({ ...prev, wonder, wonderStages: [] }));

  const setSide = (side) =>
    setGameData((prev) => ({ ...prev, wonderSide: side, wonderStages: [] }));

  const toggleCard = (card, category) => {
    const key = `${category}Cards`;
    const isSelected = gameData[key].some((c) => c.id === card.id);

    if (category === "guilds" && !isSelected && gameData.guildsCards.length >= gameData.playerCount) {
      flash(`Only ${gameData.playerCount} guild cards are in a ${gameData.playerCount}-player game.`);
      return;
    }

    setGameData((prev) => ({
      ...prev,
      [key]: isSelected ? prev[key].filter((c) => c.id !== card.id) : [...prev[key], card],
    }));

    const needsPrompt = card.points === "scaling";
    if (needsPrompt && !isSelected) setShowNeighborDialog({ card, category });
    if (isSelected) {
      // Clear any stored interaction value when deselecting.
      setGameData((prev) => {
        const ni = { ...prev.neighborInteractions };
        delete ni[card.id];
        return { ...prev, neighborInteractions: ni };
      });
    }
  };

  const getPrompt = useCallback(
    (cardId) => {
      const wonderStageCount = currentStages.length;
      const prompts = {
        // Guilds (count neighbors unless noted)
        workers: { q: "Brown (raw material) cards in BOTH neighbors?", mult: 1, kind: "vp" },
        craftmens: { q: "Gray (manufactured good) cards in BOTH neighbors?", mult: 2, kind: "vp" },
        traders: { q: "Yellow (commercial) cards in BOTH neighbors?", mult: 1, kind: "vp" },
        philosophers: { q: "Green (science) cards in BOTH neighbors?", mult: 1, kind: "vp" },
        spies: { q: "Red (military) cards in BOTH neighbors?", mult: 1, kind: "vp" },
        strategists: { q: "Defeat tokens in BOTH neighbors?", mult: 1, kind: "vp" },
        shipowners: { q: "Brown + gray + purple cards in YOUR city?", mult: 1, kind: "vp" },
        magistrates: { q: "Blue (civilian) cards in BOTH neighbors?", mult: 1, kind: "vp" },
        builders: { q: "Wonder stages built — YOU + both neighbors?", mult: 1, kind: "vp" },
        // Commercial (Age III VP cards)
        haven: { q: "Brown (raw material) cards in YOUR city?", mult: 1, kind: "vp" },
        lighthouse: { q: "Yellow (commercial) cards in YOUR city?", mult: 1, kind: "vp" },
        chamber: { q: "Gray (manufactured good) cards in YOUR city?", mult: 2, kind: "vp" },
        arena: {
          q: `Wonder stages YOU built? (max ${wonderStageCount})`,
          mult: 3,
          kind: "vp",
          max: wonderStageCount,
        },
      };
      return prompts[cardId] || { q: "Points from this card:", mult: 1, kind: "vp" };
    },
    [currentStages.length]
  );

  const handleNeighborInteraction = (raw) => {
    const { mult, max } = getPrompt(showNeighborDialog.card.id);
    const count = Math.max(0, Math.min(parseInt(raw, 10) || 0, max ?? Infinity));
    setGameData((prev) => ({
      ...prev,
      neighborInteractions: { ...prev.neighborInteractions, [showNeighborDialog.card.id]: count * mult },
    }));
    setShowNeighborDialog(null);
  };

  // --- Optimal science symbol for Babylon / Scientists Guild ---------------
  const scienceCounts = useMemo(() => {
    const c = { compass: 0, gear: 0, tablet: 0 };
    gameData.scienceCards.forEach((card) => c[card.symbol]++);
    return c;
  }, [gameData.scienceCards]);

  const scienceScoreFor = (counts) => {
    const sets = Math.min(counts.compass, counts.gear, counts.tablet);
    return counts.compass ** 2 + counts.gear ** 2 + counts.tablet ** 2 + sets * 7;
  };

  // How many free symbols the player gets to assign (Babylon + Scientists guild).
  const freeSymbols = (wonderGrantsScience ? 1 : 0) + (hasScientistsGuild ? 1 : 0);

  const optimalSymbol = useMemo(() => {
    if (freeSymbols === 0) return null;
    let best = "compass";
    let bestScore = -1;
    ["compass", "gear", "tablet"].forEach((choice) => {
      const test = { ...scienceCounts };
      // Assign all free symbols to the same family as a baseline suggestion.
      test[choice] += freeSymbols;
      const score = scienceScoreFor(test);
      if (score > bestScore) {
        bestScore = score;
        best = choice;
      }
    });
    return best;
  }, [scienceCounts, freeSymbols]);

  // Auto-pick the optimal symbol when the bonus step is relevant.
  useEffect(() => {
    if (freeSymbols > 0 && optimalSymbol && gameData.wonderScience !== optimalSymbol) {
      setGameData((prev) => ({ ...prev, wonderScience: optimalSymbol }));
    }
    if (freeSymbols === 0 && gameData.wonderScience !== null) {
      setGameData((prev) => ({ ...prev, wonderScience: null }));
    }
  }, [freeSymbols, optimalSymbol]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Final score ---------------------------------------------------------
  const score = useMemo(() => {
    const b = { wonder: 0, civilian: 0, military: 0, science: 0, commercial: 0, guilds: 0, coins: 0 };
    let coinTotal = gameData.coins;

    // Civilian (flat VP)
    b.civilian = gameData.civilianCards.reduce((s, c) => s + (c.points || 0), 0);

    // Military conflict tokens (entered directly)
    b.military = gameData.militaryScore;

    // Wonder stages: VP + accumulate coins
    currentStages.forEach((stage, i) => {
      if (gameData.wonderStages.includes(i + 1)) {
        b.wonder += stage.vp || 0;
        coinTotal += stage.coins || 0;
      }
    });

    // Science: card symbols + free symbols (Babylon / Scientists guild)
    const sym = { ...scienceCounts };
    if (gameData.wonderScience) sym[gameData.wonderScience] += freeSymbols;
    b.science = scienceScoreFor(sym);

    // Commercial: flat VP + Age III scaling cards (haven/lighthouse/chamber/arena)
    b.commercial = gameData.commercialCards.reduce((s, c) => {
      if (c.points === "scaling") return s + (gameData.neighborInteractions[c.id] || 0);
      return s + (c.points || 0);
    }, 0);

    // Guilds. Scientists scores via the science block; Decorators is a flat 7
    // VP if every stage of your wonder is built; the rest are neighbor counts.
    const allStagesBuilt = currentStages.length > 0 && gameData.wonderStages.length === currentStages.length;
    b.guilds = gameData.guildsCards.reduce((s, c) => {
      if (c.id === "scientists") return s; // already in science
      if (c.id === "decorators") return s + (allStagesBuilt ? 7 : 0);
      return s + (gameData.neighborInteractions[c.id] || 0);
    }, 0);

    // Coins → 1 VP per 3
    b.coins = Math.floor(coinTotal / 3);

    const total = Object.values(b).reduce((a, n) => a + n, 0);
    return { total, breakdown: b, coinTotal };
  }, [gameData, currentStages, scienceCounts, freeSymbols]);

  // --- Persistence ---------------------------------------------------------
  const saveGame = () => {
    try {
      const { wonder, ...rest } = gameData;
      localStorage.setItem("7wonders_game", JSON.stringify({ ...rest, wonderId: wonder?.id }));
      flash("Game saved");
    } catch {
      flash("Could not save");
    }
  };

  const loadGame = () => {
    try {
      const saved = localStorage.getItem("7wonders_game");
      if (!saved) return flash("No saved game found");
      const parsed = JSON.parse(saved);
      const wonder = WONDERS.find((w) => w.id === parsed.wonderId) || null;
      setGameData({ ...blankGame(), ...parsed, wonder });
      setCurrentStep(0);
      flash("Game loaded");
    } catch {
      flash("Could not load saved game");
    }
  };

  const resetGame = () => {
    setGameData(blankGame());
    setCurrentStep(0);
    flash("New game");
  };

  // --- Render helpers ------------------------------------------------------
  const stepName = steps[currentStep];

  const renderPlayers = () => (
    <div className="step-content">
      <h2>Number of Players</h2>
      <div className="player-count-selector">
        <p>How many players are in this game?</p>
        <div className="player-buttons">
          {[3, 4, 5, 6, 7].map((count) => (
            <button
              key={count}
              className={`player-btn ${gameData.playerCount === count ? "active" : ""}`}
              onClick={() => setGameData((prev) => ({ ...prev, playerCount: count }))}
            >
              {count}
            </button>
          ))}
        </div>
        <p className="player-info">
          {gameData.playerCount + 2} guilds are dealt, but only {gameData.playerCount} (= players + 2 removed)
          stay in the Age III deck.
        </p>
      </div>
    </div>
  );

  const renderWonderSelection = () => (
    <div className="step-content">
      <h2>Select Your Wonder</h2>
      <div className="wonder-grid">
        {WONDERS.map((wonder) => (
          <div
            key={wonder.id}
            className={`wonder-card ${gameData.wonder?.id === wonder.id ? "selected" : ""}`}
            onClick={() => selectWonder(wonder)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), selectWonder(wonder))}
            aria-pressed={gameData.wonder?.id === wonder.id}
            aria-label={`${wonder.name} — ${wonder.sub}`}
          >
            <div className="wonder-thumb">
              <img
                src={boardArt(wonder.id, "A")}
                alt=""
                loading="lazy"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.classList.add("noart");
                }}
              />
              <span className="wonder-thumb-emoji" aria-hidden="true">
                {wonder.icon}
              </span>
            </div>
            <h3>{wonder.name}</h3>
            <span className="wonder-sub">{wonder.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Clicking a stage zone sets completed stages to a contiguous 1..target.
  // Re-clicking the highest completed zone steps the count back by one.
  const setStageProgress = (n) => {
    setGameData((prev) => {
      const built = prev.wonderStages.length;
      const target = n <= built ? n - 1 : n; // re-click highest → undo it
      return { ...prev, wonderStages: Array.from({ length: target }, (_, i) => i + 1) };
    });
  };

  const renderStages = () => {
    const wonder = gameData.wonder;
    const side = gameData.wonderSide;
    const built = gameData.wonderStages.length; // contiguous from 1
    return (
      <div className="step-content">
        <h2>Wonder Stages — {wonder.name}</h2>

        <div className="wonder-side-selector">
          <button className={`side-btn ${side === "A" ? "active" : ""}`} onClick={() => setSide("A")}>
            ☀ Side A · Day
          </button>
          <button className={`side-btn ${side === "B" ? "active" : ""}`} onClick={() => setSide("B")}>
            ☾ Side B · Night
          </button>
        </div>

        {/* Flip-board art (display only) flips between Day / Night. */}
        <div className={`board-flip ${side === "B" ? "flipped" : ""}`}>
          <div className="board-flip-inner">
            {["A", "B"].map((face) => (
              <div className={`board-face ${face === "B" ? "back" : "front"}`} key={face} aria-hidden={face !== side}>
                <img
                  src={boardArt(wonder.id, face)}
                  alt={`${wonder.name} board, side ${face}`}
                  draggable="false"
                  onError={(e) => (e.currentTarget.style.opacity = 0)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Aligned stage-tile strip — the actual selector (always perfectly placed). */}
        <div className="stage-strip" role="group" aria-label="Wonder stages">
          {currentStages.map((stage, i) => {
            const n = i + 1;
            const done = n <= built;
            const next = n === built + 1;
            return (
              <button
                key={n}
                className={`stage-tile ${done ? "done" : ""} ${next ? "next" : ""}`}
                onClick={() => setStageProgress(n)}
                aria-pressed={done}
                aria-label={`Stage ${n}${stage.vp ? `, ${stage.vp} victory points` : ""}${done ? ", completed" : ""}`}
              >
                <span className="tile-badge">{done ? "✓" : n}</span>
                <span className="tile-vp">{stage.vp ? `${stage.vp} VP` : "—"}</span>
                {(stage.coins || stage.note) && (
                  <span className="tile-note">{stage.note || `+${stage.coins} coins`}</span>
                )}
              </button>
            );
          })}
        </div>

        <p className="board-hint">
          Tap a stage to mark it built (everything up to it lights up). Tap the last one again to undo.
        </p>

        {currentStages.some((s) => s.science) && (
          <p className="muted board-science-note">
            🔬 This wonder grants a science symbol — you'll choose which on the <strong>Science Bonus</strong> step,
            and it's added to your science score.
          </p>
        )}
      </div>
    );
  };

  const renderCardSelection = (category, cards, title) => (
    <div className="step-content">
      <h2>{title}</h2>
      {[1, 2, 3].map((age) => {
        const filtered = cards.filter((c) => !c.age || c.age === age);
        if (!filtered.length) return null;
        return (
          <div key={age} className="age-group">
            <h3>Age {age}</h3>
            <div className="card-grid">
              {filtered.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  category={category}
                  selected={gameData[`${category}Cards`].some((c) => c.id === card.id)}
                  toggleCard={toggleCard}
                  hint={card.points === "scaling" ? getPrompt(card.id).q : ""}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGuilds = () => (
    <div className="step-content">
      <h2>Guilds (Purple)</h2>
      <p className="muted">
        Selected {gameData.guildsCards.length}/{gameData.playerCount}. The Scientists Guild adds a science symbol
        instead of a flat value.
      </p>
      <div className="card-grid">
        {CARDS.guilds.map((card) => (
          <Card
            key={card.id}
            card={card}
            category="guilds"
            selected={gameData.guildsCards.some((c) => c.id === card.id)}
            toggleCard={toggleCard}
            hint={
              card.points === "scaling"
                ? getPrompt(card.id).q
                : card.id === "decorators"
                ? "7 VP if all your wonder stages are built (auto-detected)"
                : "Adds a science symbol of choice"
            }
          />
        ))}
      </div>
    </div>
  );

  const renderScienceBonus = () => (
    <div className="step-content">
      <h2>Science Bonus</h2>
      <div className="babylon-analysis">
        <p>
          You have {freeSymbols} free science symbol{freeSymbols > 1 ? "s" : ""} to assign
          {wonderGrantsScience ? " (Babylon)" : ""}
          {wonderGrantsScience && hasScientistsGuild ? " + " : ""}
          {hasScientistsGuild ? "(Scientists Guild)" : ""}.
        </p>
        <div className="current-science">
          <span>
            <SymbolIcon name="compass" size={22} alt="compass" /> {scienceCounts.compass}
          </span>
          <span>
            <SymbolIcon name="gear" size={22} alt="gear" /> {scienceCounts.gear}
          </span>
          <span>
            <SymbolIcon name="tablet" size={22} alt="tablet" /> {scienceCounts.tablet}
          </span>
        </div>
        <p className="muted">Choose which symbol to add (optimal pre-selected):</p>
        <div className="science-selector">
          {["compass", "gear", "tablet"].map((s) => (
            <button
              key={s}
              className={`science-btn ${gameData.wonderScience === s ? "active" : ""}`}
              onClick={() => setGameData((prev) => ({ ...prev, wonderScience: s }))}
            >
              <SymbolIcon name={s} size={20} alt="" /> {s}
            </button>
          ))}
        </div>
        {optimalSymbol && (
          <div className="optimal-choice">
            <h3>
              Optimal: <SymbolIcon name={optimalSymbol} size={20} alt="" /> {optimalSymbol}
            </h3>
            <p>Maximizes science points given your current green cards.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepper = (key, min, max, label, hint) => (
    <div className="step-content">
      <h2>{label}</h2>
      <div className="military-input">
        <div className="input-with-buttons">
          <button
            className="increment-btn"
            onClick={() => setGameData((prev) => ({ ...prev, [key]: Math.max(min, prev[key] - 1) }))}
            aria-label={`Decrease ${label}`}
          >
            −
          </button>
          <input
            type="number"
            value={gameData[key]}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setGameData((prev) => ({ ...prev, [key]: Math.max(min, Math.min(max, isNaN(v) ? 0 : v)) }));
            }}
            min={min}
            max={max}
            aria-label={label}
          />
          <button
            className="increment-btn"
            onClick={() => setGameData((prev) => ({ ...prev, [key]: Math.min(max, prev[key] + 1) }))}
            aria-label={`Increase ${label}`}
          >
            +
          </button>
        </div>
        <p>{hint}</p>
      </div>
    </div>
  );

  const renderScore = () => {
    const { total, breakdown, coinTotal } = score;
    const entries = [
      ["Wonder", breakdown.wonder, "#FF6384"],
      ["Civilian", breakdown.civilian, "#36A2EB"],
      ["Military", breakdown.military, "#FF5252"],
      ["Science", breakdown.science, "#4BC0C0"],
      ["Commercial", breakdown.commercial, "#FFCE56"],
      ["Guilds", breakdown.guilds, "#9966FF"],
      ["Coins", breakdown.coins, "#C9CBCF"],
    ];
    const positive = entries.filter(([, v]) => v > 0);
    const chartData = {
      labels: positive.map(([l]) => l),
      datasets: [{ data: positive.map(([, v]) => v), backgroundColor: positive.map(([, , c]) => c) }],
    };
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" }, title: { display: false } },
    };

    return (
      <div className="step-content">
        <h2>Final Score</h2>
        <div className="score-layout">
          <div className="score-breakdown">
            {entries.map(([label, val, color]) => (
              <div className="score-item" key={label}>
                <span>
                  <span className="dot" style={{ background: color }} /> {label}
                </span>
                <span>{val} pts</span>
              </div>
            ))}
            <div className="score-item muted-row">
              <span>(Coins on hand)</span>
              <span>{coinTotal}🪙</span>
            </div>
            <div className="score-total">
              <span>Total</span>
              <span>{total} pts</span>
            </div>
          </div>
          {positive.length > 0 && (
            <div className="score-chart">
              <Pie data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (stepName) {
      case "Players":
        return renderPlayers();
      case "Wonder":
        return renderWonderSelection();
      case "Stages":
        return renderStages();
      case "Coins":
        return renderStepper("coins", 0, 999, "Coins", "1 VP per 3 coins. Wonder coins are added automatically.");
      case "Civilian":
        return renderCardSelection("civilian", CARDS.civilian, "Civilian Buildings (Blue)");
      case "Science":
        return renderCardSelection("science", CARDS.science, "Science Buildings (Green)");
      case "Science Bonus":
        return renderScienceBonus();
      case "Military":
        return renderStepper(
          "militaryScore",
          -6,
          18,
          "Military Conflict Points",
          "Sum of your conflict tokens: +1/+3/+5 per Age won, −1 per Age lost."
        );
      case "Commercial":
        return renderCardSelection("commercial", CARDS.commercial, "Commercial Buildings (Yellow)");
      case "Guilds":
        return renderGuilds();
      case "Score":
        return renderScore();
      default:
        return renderPlayers();
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <h1>7 Wonders Calculator</h1>
        <div className="game-controls">
          <button onClick={saveGame} className="ghost-btn">
            Save
          </button>
          <button onClick={loadGame} className="ghost-btn">
            Load
          </button>
          <button onClick={resetGame} className="ghost-btn">
            New Game
          </button>
        </div>

        <div className="progress">
          <div className="steps">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`step ${index === currentStep ? "active" : ""} ${index < currentStep ? "completed" : ""}`}
                onClick={() => index <= currentStep && setCurrentStep(index)}
                style={{ cursor: index <= currentStep ? "pointer" : "not-allowed" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && index <= currentStep && setCurrentStep(index)}
                aria-current={index === currentStep ? "step" : undefined}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {renderCurrentStep()}

        <div className="navigation">
          <button onClick={prevStep} disabled={currentStep === 0} className="nav-btn">
            ‹ Previous
          </button>
          <span className="step-counter">
            {currentStep + 1} / {steps.length}
          </span>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1 || (stepName === "Wonder" && !gameData.wonder)}
            className="nav-btn"
          >
            Next ›
          </button>
        </div>

        {showNeighborDialog && (
          <div className="modal-overlay" onClick={() => setShowNeighborDialog(null)}>
            <div className="neighbor-dialog" onClick={(e) => e.stopPropagation()}>
              <h3>
                {showNeighborDialog.card.icon} {showNeighborDialog.card.name}
              </h3>
              <p>{getPrompt(showNeighborDialog.card.id).q}</p>
              <input
                type="number"
                min="0"
                max={getPrompt(showNeighborDialog.card.id).max || undefined}
                placeholder="0"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleNeighborInteraction(e.target.value)}
                aria-label="Count"
              />
              <p className="muted">×{getPrompt(showNeighborDialog.card.id).mult} VP each</p>
              <div className="dialog-buttons">
                <button onClick={() => handleNeighborInteraction(0)}>Cancel</button>
                <button
                  onClick={() => handleNeighborInteraction(document.querySelector(".neighbor-dialog input").value)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </ErrorBoundary>
  );
}

export default App;
