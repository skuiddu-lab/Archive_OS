// scripts/datas.js

// 1. SISTEMA DI TRATTI (Bonus passivi)
const TRAITS_DB = {
    'RUBBER': { name: 'Rubber Body', desc: 'High physical resistance', statMod: { res: 1.5 } },
    'LOGIA': { name: 'Logia User', desc: 'Immune to normal attacks', statMod: { hp: 0.8, adm: 1.2 } }, // Meno HP ma schiva
    'NINJA': { name: 'Shinobi', desc: 'High speed and critical', statMod: { luc: 1.3, atk: 1.1 } },
    'KURAMA': { name: 'Nine-Tails Vessel', desc: 'Massive Chakra reserves', statMod: { hp: 2.0, atk: 1.5, adm: 0.5 } },
    'SAIYAN': { name: 'Saiyan Blood', desc: 'Gets stronger when low HP', statMod: { atk: 1.4, growth: 1.2 } }
};

const UNIT_DB = [
    // --- ONE PIECE ---
    {
        id: "luffy_base", source: "ONE_PIECE", name: "Straw Hat Boy", class: "Brawler", rarity: 3, role: "OPERATOR", sex: "MALE",
        baseAtk: 120, baseHp: 600, baseAdm: 5, growth: 1.2,
        traits: ["RUBBER", "PIRATE"],
        desc: "A boy made of rubber who dreams of being King of the Pirates.",
        events: ["Lv.20: Unlock 'Gear Second'", "Integrity 100%: Unlock 'Haki'"]
    },
    {
        id: "zoro_base", source: "ONE_PIECE", name: "Pirate Hunter", class: "Saber", rarity: 4, role: "COMBAT", sex: "MALE",
        baseAtk: 250, baseHp: 1200, baseAdm: 10, growth: 1.3,
        traits: ["PIRATE", "SWORDSMAN"],
        desc: "Uses three swords style. Terrible sense of direction.",
        events: ["Lv.30: 'Asura'", "Integrity 100%: Black Blade"]
    },

    // --- NARUTO ---
    {
        id: "naruto_kid", source: "NARUTO", name: "Knucklehead Ninja", class: "Assassin", rarity: 3, role: "OPERATOR", sex: "MALE",
        baseAtk: 90, baseHp: 800, baseAdm: 10, growth: 1.2,
        traits: ["NINJA", "UZUMAKI"],
        desc: "Noisy ninja who loves ramen. Contains a beast.",
        events: ["Lv.15: 'Shadow Clone'", "Integrity 100%: Rasengan Mastery"]
    },
    {
        id: "kakashi", source: "NARUTO", name: "Copy Ninja", class: "Assassin", rarity: 5, role: "ADVISOR", sex: "MALE",
        baseAtk: 400, baseHp: 1800, baseAdm: 150, growth: 1.4,
        traits: ["NINJA", "SHARINGAN", "TEACHER"],
        desc: "Elite Jonin famous for copying over 1000 jutsus.",
        events: ["Lv.50: 'Kamui'", "Integrity 100%: Sixth Hokage Candidate"]
    },

    // --- SOLO LEVELING ---
    {
        id: "shadow_monarch", source: "SOLO", name: "Shadow Monarch", class: "Necromancer", rarity: 5, role: "OPERATOR", sex: "MALE",
        baseAtk: 800, baseHp: 2000, baseAdm: 10, growth: 1.6,
        traits: ["SYSTEM_USER", "MONARCH"],
        desc: "The one who defies death. Commands an army of shadows.",
        events: ["Lv.30: 'Arise'", "Integrity 100%: Complete Resurrection"]
    },

    // --- GENERIC ---
    {
        id: "slime", source: "GENERIC", name: "Basic Slime", class: "Monster", rarity: 3, role: "OPERATOR", sex: "UNKNOWN",
        baseAtk: 50, baseHp: 300, baseAdm: 0, growth: 1.0,
        traits: ["MONSTER"],
        desc: "Weakest monster. Good for practice.",
        events: []
    }
];

const BANNERS = [
    { id: 'standard', name: 'STANDARD CACHE', source: 'ALL', color: '#00ffcc', desc: 'Mixed data fragments from all worlds.' },
    { id: 'op_sea', name: 'GATE: GRAND LINE', source: 'ONE_PIECE', color: '#ff4400', desc: 'High chance for Pirates and Marines.' },
    { id: 'ninja_w', name: 'GATE: HIDDEN LEAF', source: 'NARUTO', color: '#ffaa00', desc: 'High chance for Shinobi.' },
    { id: 'solo', name: 'GATE: DUNGEON', source: 'SOLO', color: '#4488ff', desc: 'System Players and Shadows.' }
];

// Per importare facilmente task: Basta aggiungere oggetti a questo array.
// Modulo 'requirements' aggiunto per filtrare chi può farle.
const TASKS = {
    training: [
        { id: 't_phys', name: 'Physical Cond.', category: 'COMBAT', duration: 1000, stat: 'atk', gain: 0.5, cost: 0 },
        { id: 't_med', name: 'Meditation', category: 'LOGIC', duration: 1000, stat: 'adm', gain: 0.5, cost: 0 },
        { id: 't_soc', name: 'Social Studies', category: 'UNIVERSAL', duration: 2000, stat: 'cha', gain: 0.5, cost: 0 }
    ],
    missions: [
        // One Piece Missions
        { id: 'm_east_blue', name: 'Patrol East Blue', category: 'COMBAT', duration: 5000, rewardQP: 20, minAtk: 50, dmg: 20, tags: ['PIRATE', 'MARINE'] },
        { id: 'm_marineford', name: 'War of the Best', category: 'COMBAT', duration: 30000, rewardQP: 500, minAtk: 500, dmg: 1500, tags: ['PIRATE'] },
        
        // Naruto Missions
        { id: 'm_cat', name: 'Catch the Cat', category: 'LOGIC', duration: 3000, rewardQP: 10, minAtk: 10, dmg: 5, tags: ['NINJA'] },
        { id: 'm_chuunin', name: 'Chuunin Exams', category: 'COMBAT', duration: 15000, rewardQP: 150, minAtk: 200, dmg: 300, tags: ['NINJA'] },

        // Generic
        { id: 'm_rats', name: 'Clear Rats', category: 'COMBAT', duration: 2000, rewardQP: 5, minAtk: 5, dmg: 1 }
    ]
};