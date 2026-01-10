// main.js - Optimized Loop
//test

const TICK_RATE = 50; // Logic runs every 50ms
const SAVE_INTERVAL = 10000;

// LOGIC LOOP
setInterval(() => {
    let now = Date.now();
    let globalRenderNeeded = false;

    myUnits.forEach((unit, index) => {
        // Skip IDLE units for performance
        if (unit.state === "IDLE") {
             // Optional: Passive regen logic here (every 1 sec)
             return;
        }

        // 1. RECOVERY LOGIC
        if (unit.state === "RECOVERING") {
            let heal = Math.ceil(unit.maxHp * 0.01); 
            unit.hp += heal;
            if (unit.hp >= unit.maxHp) {
                unit.hp = unit.maxHp;
                unit.state = unit.previousState || "IDLE";
                unit.startTime = Date.now();
                log(`SYSTEM: ${unit.name} fully reconstructed.`);
                globalRenderNeeded = true; // State changed, full redraw needed
            }
            // Update Bar only (Lightweight)
            updateProgressBar(unit, 0, true);
        }
        // 2. WORKING/TRAINING LOGIC
        else {
            let elapsed = now - unit.startTime;
            
            // Task Complete?
            if (elapsed >= unit.duration) {
                completeTask(unit); 
                // We do NOT set globalRenderNeeded = true here to avoid scroll jumping
                // completeTask handles specific UI updates if needed
            } else {
                // Update Bar only (Lightweight)
                updateProgressBar(unit, elapsed, false);
            }
        }
    });

    // Only do a full render (heavy) if a state change happened (like recovery finish)
    if (globalRenderNeeded) render();

}, TICK_RATE);

// AUTO-SAVE
setInterval(() => {
    save();
    // Optional: Visual indicator that save happened
    // document.getElementById('log-status').style.color = '#0f5'; 
    // setTimeout(() => document.getElementById('log-status').style.color = '#555', 500);
}, SAVE_INTERVAL);

// INIT
load();