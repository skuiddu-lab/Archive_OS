function createUnitInstance(template) {
    let baseRes = Math.floor(Math.random() * 40) + 10;

    // 1. Calcolo Base (Come prima)
    let rarityMult = template.rarity * 5;
    let defStat = 10 + Math.floor(Math.random() * 20) + rarityMult;
    let chaStat = 10 + Math.floor(Math.random() * 20) + rarityMult;
    let lucStat = Math.floor(Math.random() * 50);

    // 2. CREAZIONE OGGETTO
    let u = {
        ...template,
        uid: Date.now() + Math.random(),
        lvl: 1, xp: 0, maxXp: 100,

        atk: template.baseAtk,
        hp: template.baseHp, maxHp: template.baseHp,
        adm: template.baseAdm,

        res: defStat,
        cha: chaStat,
        luc: lucStat,

        limitBreak: 0, affinity: 0, missionCount: 0,
        state: "IDLE", isAdvisor: false, isLocked: false,
        sex: template.sex || "UNKNOWN",
        traits: template.traits || [] // Assicuriamo che esista l'array
    };

    // 3. APPLICAZIONE BONUS DEI TRATTI (Nuovo codice)
    if (u.traits && typeof TRAITS_DB !== 'undefined') {
        u.traits.forEach(tKey => {
            let traitInfo = TRAITS_DB[tKey];
            if (traitInfo && traitInfo.statMod) {
                // Applica modificatori percentuali
                if (traitInfo.statMod.atk) u.atk = Math.floor(u.atk * traitInfo.statMod.atk);
                if (traitInfo.statMod.hp) {
                    u.maxHp = Math.floor(u.maxHp * traitInfo.statMod.hp);
                    u.hp = u.maxHp;
                }
                if (traitInfo.statMod.luc) u.luc = Math.floor(u.luc * traitInfo.statMod.luc);
                if (traitInfo.statMod.res) u.res = Math.floor(u.res * traitInfo.statMod.res);
                if (traitInfo.statMod.growth) u.growth = u.growth * traitInfo.statMod.growth;
            }
        });
    }

    return u;
}
function processSummonLogic() {
    userStats.totalSummons++;
    const activeBanner = BANNERS[currentBannerIndex];

    // 1. FILTER POOL
    // Regola: Il pool contiene le unità della Source specifica + tutte le GENERIC (3 stars)
    // Se il banner è 'ALL', prende tutto.
    let pool = UNIT_DB.filter(u => {
        if (activeBanner.source === 'ALL') return true;
        return u.source === activeBanner.source || u.source === 'GENERIC';
    });

    // 2. RNG (Base Rarity Math)
    let roll = Math.random() * 100;
    let rarity = roll <= 60 ? 3 : (roll <= 90 ? 4 : 5);

    // Filtra il pool per rarità
    let rarityPool = pool.filter(u => u.rarity === rarity);

    // FALLBACK: Se non ci sono unità di quella rarità nel pool (es. niente 5 stelle Fate),
    // scendiamo di rarità o prendiamo un generico per evitare crash.
    if (rarityPool.length === 0) {
        rarityPool = pool.filter(u => u.rarity === 3);
        rarity = 3;
    }

    let template = rarityPool[Math.floor(Math.random() * rarityPool.length)];
    let existing = myUnits.find(u => u.id === template.id);
    let html = "";
    let msg = "";

    if (existing) {
        // ... (logica integrity up come prima)
        if (existing.limitBreak < MAX_LIMIT_BREAK) {
            existing.limitBreak++;
            // ... stats update ...
            msg = `[${activeBanner.source}] INTEGRITY UP: ${existing.name}`;
            let isComplete = existing.limitBreak === MAX_LIMIT_BREAK;
            html = `<div class="summon-card mini ${isComplete ? 'integrity-full' : 'integrity-low'}" style="border-color:${activeBanner.color}">...HTML...</div>`;
            // Nota: ho semplificato l'HTML qui, usa il tuo vecchio HTML
            // Consiglio: copia il blocco 'if (existing)' dal tuo vecchio codice, è perfetto.
        } else {
            // ... refund logic ...
        }
    } else {
        // ... new unit logic ...
    }
    return checkExistingLogic(template, activeBanner); // Ho creato una funzione helper fittizia sotto per pulizia
}
function checkExistingLogic(template, banner) {
    let existing = myUnits.find(u => u.id === template.id);
    let html = ""; let msg = "";

    if (existing) {
        if (existing.limitBreak < MAX_LIMIT_BREAK) {
            existing.limitBreak++;
            existing.atk += Math.floor(existing.atk * 0.15);
            existing.maxHp += Math.floor(existing.maxHp * 0.15);
            existing.hp = existing.maxHp;
            msg = `INTEGRITY UP: ${existing.name}`;
            let isFull = existing.limitBreak === 5;
            html = `
            <div class="summon-card mini ${isFull ? 'integrity-full' : 'integrity-low'}" style="border-color:${banner.color}">
                <div class="icon-type">▲</div><h2 style="color:${banner.color}">INTEGRITY +</h2>
                <h3>${existing.name}</h3>
                <div style="font-size:0.8em; color:#aaa">STABILITY: ${existing.limitBreak}/5</div>
            </div>`;
        } else {
            let refund = 50 * existing.rarity; qp += refund; msg = `OVERFLOW: ${refund} TB`;
            html = `<div class="summon-card mini" style="filter:grayscale(1)"><div class="icon-type">♻</div><h2>SCRAP</h2><h3>${existing.name}</h3><div>+${refund} TB</div></div>`;
        }
    } else {
        let newUnit = createUnitInstance(template); myUnits.push(newUnit); msg = `NEW: ${newUnit.name}`;
        html = `
        <div class="summon-card mini integrity-low rarity-${newUnit.rarity}">
            <div class="icon-type" style="color:gold">${getStars(newUnit.rarity)}</div>
            <h2>${newUnit.name}</h2>
            <div style="font-size:0.8em; color:#aaa">${newUnit.class}</div>
            <div style="color:red; font-weight:bold; margin-top:5px">⚠ UNSTABLE</div>
        </div>`;
    }
    return { html, msg };
}
function assignTask(uIdx, type, tIdx) {
    let unit = myUnits[uIdx];
    let task = TASKS[type][tIdx];

    if (unit.state !== "IDLE") return;

    // Checks
    if (task.category === 'COMBAT' && unit.role === 'ASSISTANT') { log(`ERR: ${unit.name} incompatible with Combat.`); return; }
    if (task.category === 'LOGIC' && unit.role === 'OPERATOR') { log(`ERR: ${unit.name} incompatible with Logic.`); return; }
    if (type === 'missions') {
        // MODIFICA QUI: Messaggio di errore aggiornato
        if (unit.atk < task.minAtk) {
            log(`ERR: Insufficient ATK (Req: ${task.minAtk}).`);
            return;
        }
    }

    unit.state = type === 'training' ? "TRAINING" : "WORKING";
    unit.currentTask = task;
    unit.startTime = Date.now();
    unit.duration = task.duration;
    render();
}
function stopTask(uIdx) {
    let unit = myUnits[uIdx];
    if (unit.state === "IDLE") return;

    unit.state = "IDLE";
    unit.currentTask = null;

    // --- NUOVO: CALCOLA LIVELLI ORA ---
    checkLevelUp(unit);
    // ----------------------------------

    log(`CMD: ${unit.name} protocol halted.`);
    render();
}

function completeTask(unit) {
    let task = unit.currentTask;

    if (unit.state === "TRAINING") {
        // ... logica training esistente ...
    } else if (unit.state === "WORKING") {
        // Calcolo Danno con mitigazione basata sulla RES dell'unità
        // Più alta è la RES, meno HP perde l'unità durante il lavoro
        let damageMitigation = unit.res / 100; 
        let finalDmg = Math.max(1, task.dmg * (1 - damageMitigation));
        
        // Bonus Classe (Esempio: Assassin schiva il 20% del danno dai VIRUS)
        if (unit.class === 'Assassin' && task.enemyType === 'VIRUS') {
            finalDmg *= 0.8;
        }

        unit.hp -= Math.floor(finalDmg);
        qp += Math.floor(task.rewardQP * globalBonus);
        unit.missionCount++;

        // --- LOGICA DROP ---
        if (task.dropRate && Math.random() < (task.dropRate + (unit.luc / 1000))) {
            let dropId = task.dropPool[Math.floor(Math.random() * task.dropPool.length)];
            addItemToInventory(dropId); // Funzione da aggiungere
            log(`LOOT: ${unit.name} found [${dropId.toUpperCase()}]`);
        }
        
        updateGlobalBonus();
    }

    // Controllo morte e loop come prima...
    if (unit.hp <= 0) {
        unit.hp = 0;
        unit.state = "RECOVERING";
        log(`ALRT: ${unit.name} health critical! Emergency recovery initiated.`);
        render();
        return;
    }

    unit.startTime = Date.now(); 
    renderDetails();
}

function addItemToInventory(id) {
    if (!myInventory[id]) myInventory[id] = 0;
    myInventory[id]++;
}
function checkLevelUp(unit) {
    let leveledUp = false;
    let oldLvl = unit.lvl;

    // Calcolo livelli multipli
    while (unit.xp >= unit.maxXp) {
        unit.xp -= unit.maxXp;
        unit.lvl++;
        unit.maxXp = Math.floor(unit.maxXp * 1.5);

        let gain = Math.floor(10 * unit.growth);
        let hpGain = gain * 5;

        unit.atk += gain;
        unit.maxHp += hpGain;
        unit.hp += hpGain;
        leveledUp = true;
    }

    // Mostra Popup se salito di livello
    if (leveledUp) {
        let diff = unit.lvl - oldLvl;
        log(`UPGRADE: ${unit.name} optimized to v${unit.lvl}.0 (+${diff} Levels)`);
        render();

        // --- FIX: Rimosso il commento qui sotto per attivare il popup ---
        showSystemMessage("UNIT UPGRADE", `<strong>${unit.name}</strong> reached v${unit.lvl}.0 (+${diff})`, "success");
    }
}
function checkAdminLevelUp() {
    let leveledUp = false;
    let levelsGained = 0;

    // Loop finché l'XP è sufficiente (per gestire accumuli)
    while (true) {
        let req = userStats.adminLvl * 100;
        if (userStats.adminXp >= req) {
            userStats.adminLvl++;
            userStats.adminXp -= req; // Sottrai invece di azzerare per mantenere l'eccesso
            leveledUp = true;
            levelsGained++;
        } else {
            break;
        }
    }

    if (leveledUp) {
        log(`SYSTEM: ADMIN PRIVILEGES ELEVATED TO LEVEL ${userStats.adminLvl} (+${levelsGained})`);
        // Mostriamo il popup solo qui
        showSystemMessage("ADMIN LEVEL UP", `AUTHORITY INCREASED TO LEVEL <strong>${userStats.adminLvl}</strong><br>Mental Capacity Expanded.`, "gold");
    }
}

function hardReset() { if (confirm("FORMAT DRIVE?")) { localStorage.clear(); location.reload(); } }
function save() {
    localStorage.setItem('archive_os_save', JSON.stringify({
        qp,
        units: myUnits,
        userStats: userStats // NUOVO
    }));
}
function load() {
    let d = JSON.parse(localStorage.getItem('archive_os_save'));
    if (d) {
        qp = d.qp;
        myUnits = d.units;

        // Fix Units: Ripara dati mancanti e aggiorna strutture vecchie
        myUnits.forEach(u => {
            if (!u.sex) {
                let original = UNIT_DB.find(x => x.id === u.id);
                u.sex = original ? original.sex : "UNKNOWN";
            }
            if (u.res === undefined) u.res = 20;
            if (u.cha === undefined) u.cha = 20;
            if (u.luc === undefined) u.luc = 10;
            if (u.affinity === undefined) u.affinity = 0;

            if (!u.neuralStats) u.neuralStats = { adminKoCount: 0, unitKoCount: 0, history: {} };
            if (u.neuralStats.koCount !== undefined) {
                u.neuralStats.adminKoCount = u.neuralStats.koCount;
                delete u.neuralStats.koCount;
            }

            if (!u.psyche) {
                let baseRes = Math.floor(Math.random() * 40) + 10;
                u.psyche = {
                    archetype: "UNSTABLE",
                    resistance: baseRes,
                    stress: 0,
                    trust: 0
                };
            }
        });

        let linker = myUnits.find(u => u.state === 'LINKED');
        if (linker) activeNeuralUid = linker.uid;
        else activeNeuralUid = null;

        userStats = d.userStats || {};
        if (!userStats.adminLvl) userStats.adminLvl = 1;
        if (!userStats.stamina) userStats.stamina = 100;
        if (!userStats.maxStamina) userStats.maxStamina = 100;
        if (!userStats.state) userStats.state = "ACTIVE";

        log("SYSTEM: Previous session restored.");
    } else {
        userStats = {
            totalSummons: 0, totalOps: 0, adminLvl: 1, adminXp: 0, joinDate: Date.now(),
            stamina: 100, maxStamina: 100, state: "ACTIVE"
        };
        myUnits = [createUnitInstance(UNIT_DB[0])];
        log("SYSTEM: New archive initialized.");
    }

    updateGlobalBonus();
    render();

    // --- MODIFICA QUI ---
    // Invece di renderBannerList(), chiamiamo il nuovo banner
    if (typeof renderFeaturedBanner === "function") {
        renderFeaturedBanner();
    }
}
function toggleLock(i) { myUnits[i].isLocked = !myUnits[i].isLocked; renderDetails(); }
function toggleAdvisor(i) {
    let u = myUnits[i];
    if (u.isAdvisor) u.isAdvisor = false;
    else if (myUnits.filter(x => x.isAdvisor).length < MAX_ADVISORS) u.isAdvisor = true;
    updateGlobalBonus(); render();
}


function useItemOnTarget(itemId, targetIdx) {
    if (!myInventory[itemId] || myInventory[itemId] <= 0) return;
    
    let unit = myUnits[targetIdx];
    let item = ITEMS_DB[itemId];

    if (item.type === 'CONSUMABLE') {
        let used = false;
        
        if (item.effect.hp) {
            if (unit.hp >= unit.maxHp) {
                showSystemMessage("FULL", `${unit.name} is already healthy.`, "gold");
                return;
            }
            unit.hp = Math.min(unit.hp + item.effect.hp, unit.maxHp);
            used = true;
        }
        
        if (item.effect.xp) {
            unit.xp += item.effect.xp;
            checkLevelUp(unit);
            used = true;
        }

        if (used) {
            myInventory[itemId]--;
            if (myInventory[itemId] <= 0) delete myInventory[itemId];
            
            log(`ITEM: [${item.name}] applied to ${unit.name}.`);
            save();
            // Se siamo nella vista manage, aggiorniamo i dettagli
            if (selectedUnitIndex === targetIdx) renderDetails(); 
        }
    }
}