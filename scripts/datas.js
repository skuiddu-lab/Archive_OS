const UNIT_DB = [
    // 3 STARS
    {
        id: "hunter_e", source: "GENERIC", name: "E-Rank Hunter", class: "Assassin", rarity: 3, role: "OPERATOR", sex: "MALE", // NUOVO
        baseAtk: 80, baseHp: 400, baseAdm: 0, growth: 1.0,
        desc: "A low-tier hunter struggling to survive in the weakest dungeons. Often carries healing stones.",
        events: ["Lv.10: Unlock 'Stone Throw'", "Integrity 50%: Base HP Boost"]
    },
    {
        id: "mage_student", source: "GENERIC", name: "Clock Tower Student", class: "Caster", rarity: 3, role: "ASSISTANT", sex: "FEMALE", // NUOVO
        baseAtk: 20, baseHp: 100, baseAdm: 40, growth: 1.0,
        desc: "An aspiring magus studying modern thaumaturgy. Good at processing logical data.",
        events: ["Lv.10: Unlock 'Mana Transfer'", "Integrity 50%: Logic Efficiency +5%"]
    },

    // 4 STARS
    {
        id: "tank_iron", source: "SOLO", name: "Iron Tank", class: "Tank", rarity: 4, role: "OPERATOR", sex: "MALE", // NUOVO
        baseAtk: 200, baseHp: 1500, baseAdm: 5, growth: 1.2,
        desc: "A high-ranking A-Class hunter known for his impenetrable defense and loud personality.",
        events: ["Lv.20: Unlock 'Taunt'", "Integrity 100%: Become S-Rank (Visual)"]
    },
    {
        id: "shadow_soldier", source: "SOLO", name: "Shadow Infantry", class: "Assassin", rarity: 4, role: "HYBRID", sex: "ENTITY", // NUOVO
        baseAtk: 300, baseHp: 800, baseAdm: 20, growth: 1.3,
        desc: "A soldier risen from the dead. Loyal only to the Monarch, it feels no pain.",
        events: ["Lv.20: Regeneration Passive", "Integrity 100%: Promote to Elite Knight"]
    },

    // 5 STARS
    {
        id: "king_knights", source: "FATE", name: "King of Knights", class: "Saber", rarity: 5, role: "HYBRID", sex: "FEMALE", // NUOVO
        baseAtk: 650, baseHp: 2800, baseAdm: 50, growth: 1.5,
        desc: "The legendary wielder of the holy sword. A virtuous ruler who protects the timeline.",
        events: ["Lv.30: Unlock 'Excalibur'", "Integrity 100%: Avalon Shield (Invincible)"]
    },
    {
        id: "shadow_monarch", source: "SOLO", name: "Shadow Monarch", class: "Necromancer", rarity: 5, role: "OPERATOR", sex: "MALE", // NUOVO
        baseAtk: 800, baseHp: 2000, baseAdm: 10, growth: 1.6,
        desc: "The one who defies death. Commands an army of shadows and grows stronger with every fall.",
        events: ["Lv.30: 'Arise' Skill", "Integrity 100%: Complete Resurrection"]
    },
    {
        id: "grand_caster", source: "FATE", name: "Flower Magus", class: "Caster", rarity: 5, role: "ASSISTANT", sex: "MALE", // NUOVO
        baseAtk: 150, baseHp: 1800, baseAdm: 250, growth: 1.5,
        desc: "The mage of flowers who observes humanity from the tower at the end of the world.",
        events: ["Lv.30: 'Hero Creation'", "Integrity 100%: Garden of Avalon"]
    }
];

const BANNERS = [
    { id: 'standard', name: 'STANDARD CACHE', source: 'ALL', color: '#00ffcc', desc: 'Contains all available data fragments.' },
    { id: 'solo', name: 'GATE: DUNGEON', source: 'SOLO', color: '#4488ff', desc: 'Higher chance for Hunters and Shadows.' },
    { id: 'fate', name: 'GATE: GRAIL', source: 'FATE', color: '#ffcc00', desc: 'Heroic Spirits virtualization focus.' }
];

const TASKS = {
    training: [
        // Training Base (Esistenti)
        { id: 'sim_combat', name: 'Combat Simulation', category: 'COMBAT', duration: 1000, stat: 'atk', gain: 0.2, cost: 0 },
        { id: 'sim_def', name: 'Firewall Hardening', category: 'COMBAT', duration: 1000, stat: 'hp', gain: 5, cost: 0 },
        { id: 'sim_logic', name: 'Algorithm Optimization', category: 'LOGIC', duration: 3000, stat: 'adm', gain: 1, cost: 0 },

        // --- NUOVI TRAINING SPECIALI (Mental & Personality) ---
        { id: 'train_res', name: 'Trauma Dampening', category: 'UNIVERSAL', duration: 5000, stat: 'res', gain: 0.2, cost: 0 },
        { id: 'train_cha', name: 'Empathy Modules', category: 'UNIVERSAL', duration: 5000, stat: 'cha', gain: 0.2, cost: 0 },
        { id: 'train_luc', name: 'RNG Calibration', category: 'LOGIC', duration: 10000, stat: 'luc', gain: 0.1, cost: 0 }, // Molto lento

        // Utility
        { id: 'data_mine', name: 'Data Mining (XP)', category: 'UNIVERSAL', duration: 5000, stat: 'xp', gain: 20, cost: 0 },
        { id: 'repair', name: 'System Defrag (Heal)', category: 'UNIVERSAL', duration: 2000, stat: 'hp', gain: 200, cost: 0 }
    ],
    missions: [
        { id: 'dungeon_e', name: 'E-Rank Dungeon', category: 'COMBAT', duration: 5000, rewardQP: 15, minAtk: 20, dmg: 40 },
        { id: 'grail_war', name: 'Holy Grail Skirmish', category: 'COMBAT', duration: 15000, rewardQP: 50, minAtk: 100, dmg: 200 },
        { id: 'hack_corp', name: 'Arasaka Data Heist', category: 'LOGIC', duration: 10000, rewardQP: 100, minAtk: 50, dmg: 100 },
        { id: 'raid_boss', name: 'Dragon Slaying', category: 'COMBAT', duration: 30000, rewardQP: 300, minAtk: 300, dmg: 1000 }
    ]
};
