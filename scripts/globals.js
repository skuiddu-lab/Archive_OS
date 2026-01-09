const MAX_LIMIT_BREAK = 5;
const MAX_AFFINITY = 100;
const MAX_ADVISORS = 4;
let currentBannerIndex = 0;

let qp = 1000; // Renamed to "TB" (Terabytes) in UI
let globalBonus = 1;
let myUnits = []; 
let selectedUnitIndex = null;
let currentDetailTab = 'OPS'; // 'OPS' (Operations) oppure 'INFO' (Archive)
let userStats = {
    totalSummons: 0,
    totalOps: 0,
    adminLvl: 1,
    adminXp: 0,
    joinDate: Date.now(),
    stamina: 100,
    maxStamina: 100,
    state: "ACTIVE" // "ACTIVE" oppure "EXHAUSTED"
};

let activeNeuralUid = null;
let trainingActive = false;
let trainingScore = 0;
let trainingTimer = null;