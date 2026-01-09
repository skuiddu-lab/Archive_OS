setInterval(() => {
    let now = Date.now();
    let renderNeeded = false;

    // 1. RIGENERAZIONE STAMINA ADMIN
    let isAdminIdle = (activeNeuralUid === null);
    let isAdminKO = (userStats.state === "EXHAUSTED");

    if (now % 1000 < 60) { // Tick ogni secondo circa
        if (isAdminIdle || isAdminKO) {
            if (userStats.stamina < userStats.maxStamina) {
                // Recupero veloce se KO (5), lento se riposo (2)
                let regenRate = isAdminKO ? 5 : 2;
                userStats.stamina = Math.min(userStats.maxStamina, userStats.stamina + regenRate);

                // Se era KO ed è tornato pieno, si riattiva
                if (isAdminKO && userStats.stamina >= userStats.maxStamina) {
                    userStats.state = "ACTIVE";
                    log("SYSTEM: Admin mental stability restored. Neural Link RESUMING.");
                }

                updateGlobalBonus(); // Aggiorna barra stamina

                // Aggiorna vista training se aperta per togliere l'avviso KO
                if (isAdminKO && document.getElementById('view-training').classList.contains('hidden') === false) {
                    if (selectedUnitIndex !== null) selectTrainingUnit(selectedUnitIndex);
                }
            }
        }
    }

    // 2. LOOP UNITÀ
    myUnits.forEach(unit => {
        // A. ATTIVITÀ (Training / Working)
        if (unit.state === "TRAINING" || unit.state === "WORKING") {
            let elapsed = now - unit.startTime;
            if (elapsed >= unit.duration) {
                completeTask(unit);
                renderNeeded = true;
            } else {
                updateProgressBar(unit, elapsed);
            }
        }
        // B. ATTIVITÀ NEURAL LINK (Continuo)
        else if (unit.state === "LINKED") {
            if (userStats.state === "EXHAUSTED") {
                unit.startTime += 50; // Pausa se l'Admin è KO
            } else {
                let elapsed = now - unit.startTime;
                let op = unit.currentTask;

                // --- RIDUZIONE GRADUALE ---
                let staminaTick = (op.staminaCost / op.duration) * 50;
                let hpTick = (op.hpCost / op.duration) * 50;

                userStats.stamina -= staminaTick;
                unit.hp -= hpTick;

                // Limiti
                if (userStats.stamina < 0) userStats.stamina = 0;
                if (unit.hp < 0) unit.hp = 0;

                // Check Admin KO
                if (userStats.stamina <= 0 && userStats.state !== "EXHAUSTED") {
                    userStats.state = "EXHAUSTED";
                    unit.neuralStats.adminKoCount++;
                    log(`⚠ CRITICAL: Mental Stability collapsed during sync!`);
                }

                // (Unit KO viene gestito in processNeuralCycle, qui lasciamo scendere a 0)

                if (elapsed >= unit.duration) {
                    processNeuralCycle(unit);
                    renderNeeded = true;
                } else {
                    // Aggiorna barra progresso viola
                    let neuralBar = document.getElementById('neural-bar');
                    if (neuralBar && selectedUnitIndex !== null && myUnits[selectedUnitIndex].uid === unit.uid) {
                        let pct = Math.min((elapsed / unit.duration) * 100, 100);
                        neuralBar.style.width = pct + "%";
                        updateGlobalBonus(); // Aggiorna stamina admin live
                    }
                }
            }
        }
        // C. RECOVERY
        else if (unit.state === "RECOVERING") {
            let heal = Math.ceil(unit.maxHp * 0.01);
            unit.hp += heal;
            if (unit.hp >= unit.maxHp) {
                unit.hp = unit.maxHp;
                unit.state = unit.previousState || "IDLE";
                unit.startTime = Date.now();
                renderNeeded = true;
            }
            updateProgressBar(unit, 0, true);
        }
        // D. IDLE REGEN
        else if (unit.state === "IDLE") {
            if (unit.hp < unit.maxHp && now % 1000 < 60) {
                let passiveHeal = Math.ceil(unit.maxHp * 0.01);
                unit.hp = Math.min(unit.hp + passiveHeal, unit.maxHp);
                if (selectedUnitIndex !== null && myUnits[selectedUnitIndex].uid === unit.uid) {
                    // Non serve renderNeeded completo, aggiorniamo solo la barra sotto
                }
            }
        }

        // --- AGGIORNAMENTO LIVE UI (HP BAR & STATUS) ---
        // Questo aggiorna la barra HP verde/rossa in tempo reale senza ricaricare tutta la pagina
        if (selectedUnitIndex !== null && myUnits[selectedUnitIndex].uid === unit.uid) {
            let hpBar = document.getElementById('training-hp-bar');
            let hpVal = document.getElementById('training-hp-val');
            let statusText = document.getElementById('training-status-text');

            if (hpBar && hpVal) {
                // ... (Codice esistente aggiornamento HP Bar) ... 
                // Assicurati che il codice HP Bar sia qui (copia quello che avevi o che ti ho dato prima)

                let pct = (unit.hp / unit.maxHp) * 100;
                hpBar.style.width = pct + "%";
                hpVal.innerText = Math.floor(unit.hp);

                if (unit.hp <= 0) {
                    hpBar.classList.add('critical'); hpBar.classList.remove('neural');
                    if (statusText) statusText.innerHTML = "<span class='status-text-ko'>⚠ CRITICAL FAILURE (KO)</span>";
                } else {
                    hpBar.classList.remove('critical'); hpBar.classList.add('neural');

                    // Messaggi di stato dinamici
                    if (userStats.state === "EXHAUSTED" && unit.state === "LINKED") {
                        // NUOVO MESSAGGIO SE ADMIN KO
                        if (statusText) statusText.innerHTML = "<span style='color:#f55'>⚠ SYNC PAUSED (WAITING FOR ADMIN)</span>";
                    } else if (unit.state === "IDLE" && unit.hp < unit.maxHp) {
                        if (statusText) statusText.innerHTML = "<span class='status-text-regen'>♻ REGENERATING...</span>";
                    } else if (unit.state === "LINKED") {
                        // --- RIDUZIONE GRADUALE ---
                        let staminaTick = (op.staminaCost / op.duration) * 50;

                        // MODIFICA QUI: Danno HP ridotto dalla RES dell'unità
                        // Se RES = 50, danno dimezzato (100 / 150 = 0.66)
                        let mitigation = 100 / (100 + (unit.res || 0));
                        let hpTick = ((op.hpCost * mitigation) / op.duration) * 50;

                        userStats.stamina -= staminaTick;
                        unit.hp -= hpTick;
                        if (statusText) statusText.innerHTML = "<span style='color:#0af'>⚡ SYNCING (HP DRAINING)</span>";
                    } else if (statusText) {
                        statusText.innerHTML = "STABLE";
                    }
                }
            }

            // --- NUOVO: Aggiornamento Barra Recupero Admin (nella vista Training) ---
            let adminRecBar = document.getElementById('admin-recovery-bar-inner');
            if (adminRecBar && userStats.state === "EXHAUSTED") {
                let recPct = (userStats.stamina / userStats.maxStamina) * 100;
                adminRecBar.style.width = recPct + "%";
                // Se siamo arrivati al 100% (o quasi), un reload della UI scatterà dal blocco Rigenerazione in cima al loop
            }
        }
    });

    if (renderNeeded) render();
}, 50);

setInterval(save, 10000);

load();