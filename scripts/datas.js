// scripts/datas.js

// 1. SISTEMA DI TRATTI (Bonus passivi)
const TRAITS_DB = {
    'RUBBER': { name: 'Rubber Body', desc: 'High physical resistance', statMod: { res: 1.5 } },
    'LOGIA': { name: 'Logia User', desc: 'Immune to normal attacks', statMod: { hp: 0.8, adm: 1.2 } }, // Meno HP ma schiva
    'NINJA': { name: 'Shinobi', desc: 'High speed and critical', statMod: { luc: 1.3, atk: 1.1 } },
    'KURAMA': { name: 'Nine-Tails Vessel', desc: 'Massive Chakra reserves', statMod: { hp: 2.0, atk: 1.5, adm: 0.5 } },
    'SAIYAN': { name: 'Saiyan Blood', desc: 'Gets stronger when low HP', statMod: { atk: 1.4, growth: 1.2 } },
    // --- UNIVERSAL ---
    'S_RANK': { name: 'S-Rank Hunter', desc: 'Elite capabilities.', statMod: { atk: 1.2, hp: 1.2 } },
    'NATIONAL_LEVEL': { name: 'National Level', desc: 'Rivals military might.', statMod: { atk: 1.5, hp: 1.5, res: 1.5 } },
    'HEALER': { name: 'Healer', desc: 'Recovery specialist.', statMod: { adm: 1.4, res: 1.2 } },
    'TANK': { name: 'Tanker', desc: 'Massive defense.', statMod: { hp: 1.8, atk: 0.8 } },
    'MAGE': { name: 'Mage Type', desc: 'High logic/magic power.', statMod: { adm: 1.6, atk: 1.2, hp: 0.9 } },

    // --- SOLO LEVELING SPECIFIC ---
    'SHADOW': { name: 'Shadow Soldier', desc: 'Regenerates integrity.', statMod: { hp: 1.3, growth: 1.1 } },
    'MONARCH': { name: 'Monarch', desc: 'Ruler of an element.', statMod: { atk: 1.4, adm: 1.4, cha: 1.5 } },
    'ANT_KING': { name: 'Gluttony', desc: 'Absorbs power.', statMod: { atk: 1.3, growth: 1.5 } }
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
    {
        id: "sj_woo", source: "SOLO", name: "Sung Jin-Woo", class: "Shadow Monarch", rarity: 5, role: "OPERATOR", sex: "MALE",
        baseAtk: 900, baseHp: 2500, baseAdm: 50, growth: 1.8,
        traits: ["MONARCH", "S_RANK"],
        desc: "The weakest hunter who became the strongest. Commands the Shadow Army.",
        events: ["Lv.40: 'Arise'", "Integrity 100%: Shadow Domain"]
    },
    {
        id: "cha_hae", source: "SOLO", name: "Cha Hae-In", class: "Dancer", rarity: 5, role: "COMBAT", sex: "FEMALE",
        baseAtk: 600, baseHp: 1800, baseAdm: 30, growth: 1.4,
        traits: ["S_RANK", "SWORDSMAN"],
        desc: "Vice-Guild Master of Hunters Guild. A graceful yet deadly swordswoman.",
        events: ["Lv.30: 'Sword Dance'", "Integrity 100%: Smell Sensitivity"]
    },
    {
        id: "thomas_andre", source: "SOLO", name: "Thomas Andre", class: "Goliath", rarity: 5, role: "COMBAT", sex: "MALE",
        baseAtk: 800, baseHp: 4000, baseAdm: 10, growth: 1.5,
        traits: ["NATIONAL_LEVEL", "TANK"],
        desc: "The Goliath. One of the five National Level Hunters. Uses telekinesis and brute force.",
        events: ["Lv.50: 'Reinforcement'", "Integrity 100%: Spiritual Body Manifestation"]
    },
    {
        id: "go_gun_hee", source: "SOLO", name: "Go Gun-Hee", class: "Chairman", rarity: 4, role: "ADVISOR", sex: "MALE",
        baseAtk: 500, baseHp: 1500, baseAdm: 100, growth: 1.2,
        traits: ["S_RANK", "MONARCH"], // Vessel of the Brightest Fragment
        desc: "Chairman of the Korean Hunters Association. Only age limits his immense power.",
        events: ["Lv.20: 'Authority'", "Integrity 100%: Final Spark"]
    },
    {
        id: "choi_jong", source: "SOLO", name: "Choi Jong-In", class: "Flame Mage", rarity: 4, role: "OPERATOR", sex: "MALE",
        baseAtk: 700, baseHp: 1200, baseAdm: 80, growth: 1.3,
        traits: ["S_RANK", "MAGE"],
        desc: " The Ultimate Soldier. Master of fire magic and Guild Master of Hunters Guild.",
        events: ["Lv.25: 'Flame Dragon'", "Integrity 100%: Burning Field"]
    },
    {
        id: "baek_yoon", source: "SOLO", name: "Baek Yoon-Ho", class: "Beast", rarity: 4, role: "COMBAT", sex: "MALE",
        baseAtk: 550, baseHp: 2200, baseAdm: 20, growth: 1.3,
        traits: ["S_RANK", "TANK"],
        desc: "Guild Master of White Tiger. Can transform into a terrifying beast.",
        events: ["Lv.30: 'Beast Mode'", "Integrity 100%: Primal Fear"]
    },
    {
        id: "min_byung", source: "SOLO", name: "Min Byung-Gyu", class: "Healer", rarity: 4, role: "ADVISOR", sex: "MALE",
        baseAtk: 200, baseHp: 1500, baseAdm: 120, growth: 1.2,
        traits: ["S_RANK", "HEALER"],
        desc: "Retired S-Rank Healer. His support abilities are unmatched in Korea.",
        events: ["Lv.20: 'Divine Blessing'", "Integrity 100%: Resurrection (Partial)"]
    },

    // ================= SOLO LEVELING (SHADOWS) =================

    {
        id: "beru", source: "SOLO", name: "Beru", class: "Marshal", rarity: 5, role: "COMBAT", sex: "MALE",
        baseAtk: 850, baseHp: 2000, baseAdm: 40, growth: 1.6,
        traits: ["SHADOW", "ANT_KING"],
        desc: "The Ant King. Fanatically loyal to his liege. Extremely fast and dangerous.",
        events: ["Lv.40: 'Gluttony'", "Integrity 100%: My Liege!"]
    },
    {
        id: "igris", source: "SOLO", name: "Igris", class: "Marshal", rarity: 5, role: "COMBAT", sex: "MALE",
        baseAtk: 750, baseHp: 2200, baseAdm: 30, growth: 1.5,
        traits: ["SHADOW", "SWORDSMAN"],
        desc: "The Blood-Red Commander. An honorable knight who protects the Monarch's throne.",
        events: ["Lv.35: 'Ruler\\'s Hand'", "Integrity 100%: Promotion"]
    },
    {
        id: "iron", source: "SOLO", name: "Iron", class: "Knight", rarity: 3, role: "COMBAT", sex: "MALE",
        baseAtk: 400, baseHp: 3000, baseAdm: 5, growth: 1.2,
        traits: ["SHADOW", "TANK"],
        desc: "A massive shadow tank. Not very smart, but very sturdy.",
        events: ["Lv.20: 'Taunt'", "Integrity 100%: Titan Form"]
    },
    {
        id: "tusk", source: "SOLO", name: "Tusk", class: "Elite Knight", rarity: 4, role: "OPERATOR", sex: "MALE",
        baseAtk: 700, baseHp: 1500, baseAdm: 90, growth: 1.4,
        traits: ["SHADOW", "MAGE"],
        desc: "High Orc Shaman shadow. Uses the Orb of Avarice to amplify magic.",
        events: ["Lv.30: 'Hymn of Fire'", "Integrity 100%: Gigantification"]
    },
    {
        id: "bellion", source: "SOLO", name: "Bellion", class: "Grand Marshal", rarity: 5, role: "COMBAT", sex: "MALE",
        baseAtk: 950, baseHp: 3000, baseAdm: 60, growth: 1.7,
        traits: ["SHADOW", "MONARCH"], // Technicaly servant of monarch but practically monarch tier
        desc: "The original Grand Marshal of the Shadow Army. Wields a centipede sword.",
        events: ["Lv.60: 'Total Command'", "Integrity 100%: Ashborn's Legacy"]
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
    { id: 'solo', name: 'GATE: DUNGEON', source: 'SOLO', color: '#4488ff', desc: 'High Rate for S-Rank Hunters & Shadows.' }
];

const TASKS = {
    training: [
        { id: 'sim_combat', name: 'Combat Simulation', category: 'COMBAT', duration: 1000, stat: 'atk', gain: 0.5, cost: 0 },
        { id: 'sim_hp', name: 'Firewall Hardening', category: 'COMBAT', duration: 1000, stat: 'hp', gain: 5, cost: 0 },
        { id: 'sim_logic', name: 'Algorithm Study', category: 'LOGIC', duration: 2000, stat: 'adm', gain: 0.5, cost: 0 },
        { id: 'sim_res', name: 'Mental Defrag', category: 'UNIVERSAL', duration: 5000, stat: 'res', gain: 0.2, cost: 0 }
    ],
    missions: [
        // TIER 1: E-RANK
        {
            id: 'm_scan_sec', name: 'Sector Scan (E-Rank)', category: 'LOGIC', duration: 3000,
            rewardQP: 15, minAtk: 10, dmg: 5, enemyType: 'GLITCH',
            dropRate: 0.1, dropPool: ['pot_s', 'xp_chip']
        },
        {
            id: 'm_hunt_bug', name: 'Bug Hunting (E-Rank)', category: 'COMBAT', duration: 5000,
            rewardQP: 25, minAtk: 30, dmg: 20, enemyType: 'VIRUS',
            dropRate: 0.2, dropPool: ['pot_s']
        },
        // TIER 2: C-RANK
        {
            id: 'm_dungeon_c', name: 'C-Rank Dungeon', category: 'COMBAT', duration: 15000,
            rewardQP: 80, minAtk: 150, dmg: 100, enemyType: 'BEAST',
            dropRate: 0.3, dropPool: ['piece_map', 'pot_s']
        },
        // TIER 3: S-RANK
        {
            id: 'm_red_gate', name: 'Red Gate Raid (S-Rank)', category: 'COMBAT', duration: 60000,
            rewardQP: 1000, minAtk: 800, dmg: 1500, enemyType: 'BOSS',
            dropRate: 0.5, dropPool: ['core_gold', 'xp_chip']
        }
    ]
};
// scripts/datas.js - Aggiornamento missioni

const ITEMS_DB = {
    'pot_s': { name: 'Small Potion', type: 'CONSUMABLE', desc: 'Heals 500 HP', effect: { hp: 500 } },
    'xp_chip': { name: 'Data Chip', type: 'CONSUMABLE', desc: 'Grants 100 XP', effect: { xp: 100 } },
    'piece_map': { name: 'Map Fragment', type: 'MATERIAL', desc: 'Used for decryption.' },
    'core_cyan': { name: 'Cyan Core', type: 'MATERIAL', desc: 'Evolution Material v1.' },
    'core_gold': { name: 'Gold Core', type: 'MATERIAL', desc: 'Evolution Material vMax.' }
};

TASKS.missions = [
    {
        id: 'm_scan_sec', name: 'Sector Scan (E-Rank)', category: 'LOGIC', duration: 3000,
        rewardQP: 15, minAtk: 10, dmg: 5, enemyType: 'GLITCH',
        dropRate: 0.1, dropPool: ['pot_s', 'xp_chip']
    },
    {
        id: 'm_hunt_bug', name: 'Bug Hunting (D-Rank)', category: 'COMBAT', duration: 8000,
        rewardQP: 40, minAtk: 100, dmg: 50, enemyType: 'VIRUS',
        dropRate: 0.25, dropPool: ['pot_s', 'core_cyan']
    },
    {
        id: 'm_boss_raid', name: 'Raid: System Overlord (S-Rank)', category: 'COMBAT', duration: 60000,
        rewardQP: 1000, minAtk: 1500, dmg: 2000, enemyType: 'BOSS',
        dropRate: 0.5, dropPool: ['core_gold', 'xp_chip']
    }
];