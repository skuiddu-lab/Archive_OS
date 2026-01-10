function render() {
    renderSidebar(); renderDetails();
}
function renderSidebar() {
    const d = document.getElementById('unit-list');
    const scrollPos = d.scrollTop;
    let html = "";
    myUnits.forEach((u, i) => {
        let active = (i === selectedUnitIndex) ? "active" : "";

        // Define Icon based on state
        let icon = "●"; // IDLE
        if (u.state === "TRAINING" || u.state === "WORKING") icon = "▶";
        if (u.state === "RECOVERING") icon = "×";

        let adv = u.isAdvisor ? "<span style='color:#f05'>[A]</span>" : "";
        let limitTxt = u.limitBreak === 5 ? "<span style='color:gold'>★ MAX</span>" : `v0.${u.limitBreak}`;

        html += `
            <button class="unit-list-btn ${active}" onclick="selectedUnitIndex=${i}; render()">
                <div style="pointer-events:none;">${icon} ${u.name} ${adv}</div>
                <div style="font-size:0.8em; text-align:right; color:#777; pointer-events:none;">
                    ${limitTxt}
                </div>
            </button>`;
    });
    // Only update DOM if it changed to avoid unnecessary repaints
    if (d.innerHTML !== html) {
        d.innerHTML = html;
        // 2. RESTORE SCROLL POSITION
        d.scrollTop = scrollPos;
    }
}
function renderDetails() {
    const d = document.getElementById('unit-details');
    if (selectedUnitIndex === null) {
        d.innerHTML = "<p>> SELECT A FILE TO ANALYZE...</p>";
        return;
    }
    const u = myUnits[selectedUnitIndex];
    if (u.missionCount === undefined) u.missionCount = 0;

    let integrityText = u.limitBreak === 5 ? "STABLE (100%)" : `UNSTABLE (v0.${u.limitBreak})`;
    let color = u.limitBreak === 5 ? "var(--accent-gold)" : "var(--accent-primary)";
    let sexTag = u.sex ? u.sex : "UNKNOWN";

    let traitsHtml = "";
    if (u.traits) {
        traitsHtml = `<div style="margin-top:5px; display:flex; gap:5px; flex-wrap:wrap;">`;
        u.traits.forEach(t => traitsHtml += `<span style="background:#222; border:1px solid #444; color:#aaa; font-size:0.7em; padding:2px 5px; border-radius:3px">${t}</span>`);
        traitsHtml += `</div>`;
    }

    let html = `
        <div style="border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center">
            <div>
                <h2 style="margin:0; color:${color}">${u.name} <small style="font-size:0.5em; color:#fff">${getStars(u.rarity)}</small></h2>
                <div style="font-size:0.8em; color:#888; margin-top:5px; font-family:var(--font-mono)">ID: ${u.id} | ${u.class} | ${sexTag}</div>
                ${traitsHtml} <div style="font-size:0.8em; color:${color}; margin-top:2px">${integrityText}</div>
            </div>
            <button onclick="toggleLock(${selectedUnitIndex})" class="lock-btn ${u.isLocked ? 'locked' : ''}">${u.isLocked ? '🔒' : '🔓'}</button>
        </div>
        
        <div class="details-tabs">
            <button class="tab-btn ${currentDetailTab === 'OPS' ? 'active' : ''}" onclick="currentDetailTab='OPS'; renderDetails()">OPERATIONS</button>
            <button class="tab-btn ${currentDetailTab === 'INFO' ? 'active' : ''}" onclick="currentDetailTab='INFO'; renderDetails()">ARCHIVE DATA</button>
        </div>
    `;

    if (currentDetailTab === 'INFO') {
        // ... (Codice Info identico a prima) ...
        let eventsHtml = ""; 
        /* ... recupera eventi ... */
        let dbEntry = UNIT_DB.find(x => x.id === u.id);
        let eventsList = dbEntry && dbEntry.events ? dbEntry.events : ["Analysis pending..."];
        eventsList.forEach(evt => eventsHtml += `<li>${evt}</li>`);
        
        html += `<div class="info-panel"><div class="lore-box">"${u.desc}"</div><ul class="future-events">${eventsHtml}</ul></div>`;
} else {
        // ... (Codice Stats Grid e Advisor Button rimane uguale) ...
        html += `
        <div class="stats-grid" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; margin-bottom:15px; font-family:var(--font-mono); font-size:0.8em; background:#111; padding:10px; border:1px solid #333">
             <div title="Health Points">HP: <span style="color:#55f">${Math.floor(u.hp)}</span></div>
             <div title="Attack Power">ATK: <span style="color:#f55">${fmt(u.atk)}</span></div>
             <div title="Logic/CPU Power">ADM: <span style="color:#0f5">${fmt(u.adm)}</span></div>
             <div>RES: ${fmt(u.res)}</div> <div>CHA: ${fmt(u.cha)}</div> <div>LUC: ${fmt(u.luc)}</div>
        </div>`;
        
        if (u.role !== 'OPERATOR') {
            let btnTxt = u.isAdvisor ? "REMOVE FROM CPU" : "ASSIGN TO CPU";
            let btnColor = u.isAdvisor ? "#f05" : "#0f5";
            html += `<button onclick="toggleAdvisor(${selectedUnitIndex})" style="width:100%; margin-bottom:15px; border-color:${btnColor}; color:${btnColor}">${btnTxt}</button>`;
        }

        // --- RIPRISTINO BARRA PROGRESSO QUI ---
        if (u.state !== "IDLE") {
            let isRec = u.state === "RECOVERING";
            let barCls = isRec ? "progress-bar-fill recovering" : "progress-bar-fill";
            
            // Recupera il nome del task in sicurezza
            let taskName = u.currentTask ? u.currentTask.name : "UNKNOWN PROTOCOL";
            let txt = isRec ? "RECONSTRUCTING DATA..." : `RUNNING: ${taskName}`;
            
            let elapsed = Date.now() - u.startTime;
            let pct = isRec ? (u.hp / u.maxHp) * 100 : Math.min((elapsed / u.duration) * 100, 100);

            html += `
                <div style="text-align:center; padding:20px; background:#080808; border:1px solid #333">
                    <div class="blink" style="color:${isRec ? '#f05' : '#0f5'}; font-weight:bold; margin-bottom:10px">${txt}</div>
                    <div class="progress-bar-bg"><div id="bar-${u.uid}" class="${barCls}" style="width:${pct}%"></div></div>
                    <button onclick="stopTask(${selectedUnitIndex})" style="margin-top:15px; border-color:#f05; color:#f05">TERMINATE PROCESS</button>
                </div>
            `;
        } else {
             html += generateTaskGrid(u);
        }
    }
    d.innerHTML = html;
}


// scripts/view.js - Versione corretta con Requisiti visibili

function generateTaskGrid(u) {
    let html = `<h3 style="color:#666; font-size:0.9em">AVAILABLE SUBROUTINES</h3><div class="action-grid">`;
    
    // Uniamo Training e Missioni in un'unica lista
    let all = [...TASKS.training.map((t, i) => ({ ...t, type: 'training', idx: i })), 
               ...TASKS.missions.map((t, i) => ({ ...t, type: 'missions', idx: i }))];

    all.forEach(t => {
        let isMission = t.type === 'missions';
        
        // --- CALCOLO REQUISITI E STATO ---
        let reqHtml = "";
        let canDo = true;

        // 1. Controllo Ruolo (Logica vs Combattimento)
        if (t.category === 'LOGIC' && u.role === 'OPERATOR') {
            reqHtml += `<div style="color:#f55; font-weight:bold; font-size:0.7em">❌ CLASS LOCK: OPERATOR</div>`;
            canDo = false;
        }
        else if (t.category === 'COMBAT' && u.role === 'ASSISTANT') {
            reqHtml += `<div style="color:#f55; font-weight:bold; font-size:0.7em">❌ CLASS LOCK: ASSISTANT</div>`;
            canDo = false;
        }

        // 2. Controllo Statistiche (Solo per Missioni)
        if (isMission) {
            let color = u.atk >= t.minAtk ? '#666' : '#f55';
            let icon = u.atk >= t.minAtk ? '' : '⚠️ ';
            reqHtml += `<div style="color:${color}; font-size:0.7em">${icon}REQ: ${t.minAtk} ATK</div>`;
            
            if (u.atk < t.minAtk) canDo = false;
        }

        // --- PREPARAZIONE DATI GRAFICI ---
        let typeInfo = isMission ? `<div style="font-size:0.7em; color:#888">ENEMY: ${t.enemyType}</div>` : "";
        let dropInfo = isMission ? `<div style="font-size:0.7em; color:var(--accent-gold)">LOOT: ${Math.floor(t.dropRate*100)}% CHANCE</div>` : "";
        let rewardInfo = isMission ? `RWD: ${t.rewardQP} TB` : `+${t.gain} ${t.stat.toUpperCase()}`;

        // Stile: se non può farlo, è mezzo trasparente e bordo rosso scuro
        let style = canDo ? "" : "opacity:0.6; border-color:#400; cursor:not-allowed;";
        let action = canDo ? `onclick="assignTask(${selectedUnitIndex}, '${t.type}', ${t.idx})"` : "";

        // --- GENERAZIONE CARD ---
        html += `
            <div class="action-card" style="${style}" ${action}>
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <span style="color:${isMission ? '#ea0' : '#0ea'}">${t.name}</span>
                    <span style="font-size:0.6em; border:1px solid #333; padding:1px 4px; border-radius:3px; color:#666">${t.category}</span>
                </div>
                
                ${typeInfo}
                
                <div style="font-size:0.8em; color:#ccc; margin:5px 0; border-bottom:1px dashed #333; padding-bottom:5px">
                    ${rewardInfo}
                </div>
                
                <div style="margin-top:5px">
                    ${reqHtml}
                    ${dropInfo}
                </div>
            </div>`;
    });
    
    html += "</div>";
    return html;
}

function nextBanner() {
    currentBannerIndex++;
    if (currentBannerIndex >= BANNERS.length) currentBannerIndex = 0;
    renderFeaturedBanner();
}

function prevBanner() {
    currentBannerIndex--;
    if (currentBannerIndex < 0) currentBannerIndex = BANNERS.length - 1;
    renderFeaturedBanner();
}

function renderFeaturedBanner() {
    const b = BANNERS[currentBannerIndex];
    const card = document.getElementById('active-banner-card');

    if (!card) return;

    // Effetti visivi basati sul colore del banner
    card.style.borderColor = b.color;
    card.style.boxShadow = `0 0 40px ${b.color}15`; // 15 = bassa opacità

    // Contenuto Banner
    card.innerHTML = `
        <div class="banner-source" style="color:${b.color}; border-color:${b.color}">// SOURCE: ${b.source}</div>
        <h2 style="color:${b.color}; text-shadow:0 0 15px ${b.color}40">${b.name}</h2>
        <p>${b.desc}</p>
        <div style="margin-top:30px; font-size:0.8em; color:#555; font-family:var(--font-mono)">
            ID: ${b.id.toUpperCase()} <span style="margin:0 10px">|</span> RATE-UP: <span style="color:#fff">ACTIVE</span>
        </div>
    `;
}
// scripts/view.js

// Funzione per chiudere la modale
function closeSummonModal() {
    const overlay = document.getElementById('summon-modal-overlay');
    overlay.classList.add('hidden');
    document.getElementById('summon-result-content').innerHTML = ""; // Pulisci memoria
}

function summonSingle() {
    if (qp < 10) { log("ERROR: Insufficient Buffer (Need 10 TB)."); return; }
    qp -= 10; updateGlobalBonus();

    // Mostra Overlay
    const overlay = document.getElementById('summon-modal-overlay');
    const content = document.getElementById('summon-result-content');

    content.innerHTML = "<div class='blink'>DECODING DATA STREAM...</div>";
    content.className = ""; // Rimuovi griglia (centrato per singola)
    overlay.classList.remove('hidden');

    log("SCANNER: Initializing Sector Scan...");

    setTimeout(() => {
        let res = processSummonLogic();
        log(res.msg);

        // Rimuovi la classe 'mini' per farla vedere grande nella singola
        // E aggiungi un'animazione di entrata
        content.innerHTML = res.html.replace('mini', 'summon-card');
        renderSidebar();
    }, 500); // Ritardo scenico
}

function summonMulti() {
    if (qp < 100) { log("ERROR: Insufficient Buffer (Need 100 TB)."); return; }
    qp -= 100; updateGlobalBonus();

    const overlay = document.getElementById('summon-modal-overlay');
    const content = document.getElementById('summon-result-content');

    content.innerHTML = "<div class='blink'>BATCH PROCESSING (x10)...</div>";
    content.className = ""; // Reset classe
    overlay.classList.remove('hidden');

    log("SCANNER: ⚡ DEEP DIVE INITIATED...");

    setTimeout(() => {
        content.classList.add('grid-layout'); // Attiva griglia
        let html = "";

        for (let i = 0; i < 10; i++) {
            let res = processSummonLogic();
            // Aggiunge un ritardo a cascata per ogni carta (effetto scenico)
            html += res.html.replace('mini', `mini" style="animation-delay:${i * 0.1}s`);
        }

        content.innerHTML = html;
        log("SCANNER: Batch reconstruction complete.");
        renderSidebar();
    }, 800);
}
function updateGlobalBonus() {
    // ... (Codice esistente calcolo bonus ...)
    let advisors = myUnits.filter(u => u.isAdvisor);
    let totalAdm = advisors.reduce((a, b) => a + b.adm, 0);
    globalBonus = 1 + (totalAdm / 100);
    document.getElementById('qp-count').innerText = qp;

    // ... (Codice esistente CPU Display ...)
    const cpuDisplay = document.getElementById('cpu-display');
    let bonusPct = fmt(totalAdm);
    if (advisors.length === 0) {
        cpuDisplay.innerHTML = `CPU: [ NONE ] <span style="color:#555">(0/${MAX_ADVISORS})</span>`;
    } else {
        let names = advisors.map(u => u.name.split(' ')[0]).join(', ');
        cpuDisplay.innerHTML = `CPU: [ <span style="color:var(--accent-primary)">${names}</span> ] <span style="color:#0f5;">+${bonusPct}%</span>`;
    }

    // NUOVO: Aggiorna Barra Stamina Admin
    const stamBar = document.getElementById('admin-stamina-bar');
    const badge = document.getElementById('admin-badge-el'); // Aggiungi id="admin-badge-el" nell'HTML se manca
    if (stamBar) {
        let pct = (userStats.stamina / userStats.maxStamina) * 100;
        stamBar.style.width = pct + "%";

        // Cambio colore se esausto
        if (userStats.state === "EXHAUSTED") {
            document.body.classList.add('admin-exhausted'); // Gestito via CSS
        } else {
            document.body.classList.remove('admin-exhausted');
        }
    }
}
function switchTab(t) {
    document.getElementById('view-summon').classList.add('hidden');
    document.getElementById('view-manage').classList.add('hidden');
    document.getElementById('view-storage').classList.add('hidden'); // Nuovo

    const target = document.getElementById('view-' + t);
    if (target) target.classList.remove('hidden');

    if (t === 'summon') {
        renderFeaturedBanner();
    } else if (t === 'storage') {
        renderStorage(); // Nuovo
    } else {
        render();
    }
}
function toggleProfile() {
    const panel = document.getElementById('user-profile-panel');
    const content = document.getElementById('user-stats-content');

    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
    } else {
        // Genera stats al volo
        let days = Math.floor((Date.now() - userStats.joinDate) / (1000 * 60 * 60 * 24));
        let totalLevels = myUnits.reduce((a, b) => a + b.lvl, 0);
        let completedColl = myUnits.filter(u => u.limitBreak === 5).length;

        content.innerHTML = `
            <div class="stat-row"><span>ADMIN RANK</span> <span style="color:var(--accent-gold)">B-RANK</span></div>
            <div class="stat-row"><span>DAYS ACTIVE</span> <span>${days} DAYS</span></div>
            <div class="stat-row"><span>TOTAL SCANS</span> <span>${userStats.totalSummons}</span></div>
            <div class="stat-row"><span>OPS COMPLETED</span> <span>${userStats.totalOps}</span></div>
            <div class="stat-row"><span>TOTAL LEVELS</span> <span>${totalLevels}</span></div>
            <div class="stat-row"><span>FULL INTEGRITY</span> <span>${completedColl} UNITS</span></div>
            
            <div style="margin-top:30px; border:1px solid #333; padding:10px; text-align:center">
                <small style="color:#666">CURRENT ID</small><br>
                <span style="font-family:var(--font-header); letter-spacing:2px">USR-${Date.now().toString().slice(-6)}</span>
            </div>
        `;
        panel.classList.add('open');
    }
}

function updateProgressBar(unit, elapsed, isHeal = false) {
    let bar = document.getElementById(`bar-${unit.uid}`);
    if (!bar) return;

    let pct = 0;
    if (isHeal) pct = (unit.hp / unit.maxHp) * 100;
    else pct = Math.min((elapsed / unit.duration) * 100, 100);

    bar.style.width = pct + "%";
}
function renderStorage() {
    const grid = document.getElementById('storage-grid');
    if (!grid) return;

    if (typeof myInventory === 'undefined') myInventory = {};
    let keys = Object.keys(myInventory);

    if (keys.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#444; border:1px dashed #333">
            NO DATA FRAGMENTS FOUND.<br>Complete missions to acquire resources.
        </div>`;
        return;
    }

    let html = "";
    keys.forEach(k => {
        let item = ITEMS_DB[k];
        if (!item) return;
        let qty = myInventory[k];
        let isUsable = item.type === 'CONSUMABLE';

        // Tasto USE apre il selettore
        let actionBtn = isUsable 
            ? `<button onclick="openUnitSelector('${k}')" style="width:100%; margin-top:10px; border-color:#0f5; color:#0f5;">USE ITEM</button>` 
            : `<div style="font-size:0.7em; color:#555; margin-top:15px; border:1px solid #333; padding:5px">CRAFTING MATERIAL</div>`;

        html += `
        <div class="action-card" style="cursor:default; text-align:left">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#fff; font-weight:bold; font-size:1.1em">${item.name}</span>
                <span style="font-family:var(--font-mono); font-size:1.2em; color:var(--accent-primary)">x${qty}</span>
            </div>
            <div style="font-size:0.8em; color:#888; margin-top:5px; height:40px">${item.desc}</div>
            ${actionBtn}
        </div>`;
    });
    grid.innerHTML = html;
}

function openUnitSelector(itemId) {
    pendingItemId = itemId; // Salviamo l'ID dell'oggetto
    const modal = document.getElementById('unit-selector-modal');
    const list = document.getElementById('unit-selector-list');
    
    modal.classList.remove('hidden');
    
    // Genera lista unità stile "mini"
    let html = "";
    myUnits.forEach((u, i) => {
        let hpPct = Math.floor((u.hp / u.maxHp) * 100);
        let hpColor = hpPct < 50 ? '#f55' : '#0f5';
        
        html += `
        <div onclick="selectTargetUnit(${i})" style="padding:10px; border-bottom:1px solid #333; cursor:pointer; display:flex; justify-content:space-between; align-items:center; background:#111; margin-bottom:5px">
            <div>
                <div style="color:#fff; font-weight:bold">${u.name}</div>
                <div style="font-size:0.7em; color:#888">Lv.${u.lvl} | ${u.class}</div>
            </div>
            <div style="text-align:right">
                <div style="color:${hpColor}; font-family:var(--font-mono)">HP: ${hpPct}%</div>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

function closeUnitSelector() {
    document.getElementById('unit-selector-modal').classList.add('hidden');
    pendingItemId = null;
}

function selectTargetUnit(uIdx) {
    if (pendingItemId !== null) {
        useItemOnTarget(pendingItemId, uIdx); // Chiamiamo la meccanica
        closeUnitSelector();
        renderStorage(); // Ridisegna inventario (aggiorna quantità)
    }
}