function render() {
    renderSidebar(); renderDetails();
}
function renderSidebar() {
    const d = document.getElementById('unit-list');
    d.innerHTML = "";
    myUnits.forEach((u, i) => {
        let active = (i === selectedUnitIndex) ? "active" : "";
        let icon = u.state === "IDLE" ? "●" : (u.state === "RECOVERING" ? "×" : "▶");
        let adv = u.isAdvisor ? "<span style='color:#f05'>[A]</span>" : "";
        d.innerHTML += `
            <button class="unit-list-btn ${active}" onclick="selectedUnitIndex=${i}; render()">
                <div>${icon} ${u.name} ${adv}</div>
                <div style="font-size:0.8em; text-align:right; color:${u.limitBreak === 5 ? 'gold' : '#777'}">
                    ${u.limitBreak === 5 ? 'FULL' : 'v0.' + u.limitBreak}
                </div>
            </button>`;
    });
}
function renderDetails() {
    const d = document.getElementById('unit-details');
    if (selectedUnitIndex === null) {
        d.innerHTML = "<p>> AWAITING INPUT...</p>";
        return;
    }

    const u = myUnits[selectedUnitIndex];
    if (u.missionCount === undefined) u.missionCount = 0;

    let integrityText = u.limitBreak === 5 ? "STABLE (100%)" : `UNSTABLE (v0.${u.limitBreak})`;
    let color = u.limitBreak === 5 ? "var(--accent-gold)" : "var(--accent-primary)";

    // Gestione Tag Sex
    let sexTag = u.sex ? u.sex : "UNKNOWN";

    // 1. HEADER FISSO (QUESTA PARTE MANCAVA NEL TUO CODICE!)
    let html = `
        <div style="border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center">
            <div>
                <h2 style="margin:0; color:${color}">${u.name} <small style="font-size:0.5em; color:#fff">${getStars(u.rarity)}</small></h2>
                <div style="font-size:0.8em; color:#888; margin-top:5px; font-family:var(--font-mono)">
                    ID: ${u.id} | CLASS: ${u.class} | SEX: <span style="color:#fff">${sexTag}</span>
                </div>
                <div style="font-size:0.8em; color:${color}; margin-top:2px">${integrityText}</div>
            </div>
            <button onclick="toggleLock(${selectedUnitIndex})" class="lock-btn ${u.isLocked ? 'locked' : ''}">${u.isLocked ? '🔒' : '🔓'}</button>
        </div>
        
        <div class="details-tabs">
            <button class="tab-btn ${currentDetailTab === 'OPS' ? 'active' : ''}" onclick="currentDetailTab='OPS'; renderDetails()">OPERATIONS</button>
            <button class="tab-btn ${currentDetailTab === 'INFO' ? 'active' : ''}" onclick="currentDetailTab='INFO'; renderDetails()">ARCHIVE DATA</button>
        </div>
    `;

    // 2. CONTENUTO VARIABILE
    if (currentDetailTab === 'INFO') {
        let eventsHtml = "";
        let dbEntry = UNIT_DB.find(x => x.id === u.id);
        let eventsList = dbEntry && dbEntry.events ? dbEntry.events : ["Analysis pending..."];

        eventsList.forEach(evt => {
            let unlocked = false;
            if (evt.includes("Integrity") && u.limitBreak === 5) unlocked = true;
            if (evt.includes("Lv.") && u.lvl >= parseInt(evt.match(/\d+/)[0])) unlocked = true;
            eventsHtml += `<li class="${unlocked ? 'unlocked' : ''}">${unlocked ? '[UNLOCKED]' : '[LOCKED]'} ${evt}</li>`;
        });

        html += `
            <div class="info-panel">
                <div class="lore-box">"${u.desc || "No data available."}"</div>
                <div class="data-grid">
                    <div class="data-box"><h4>SERVICE RECORD</h4><div class="value">${u.missionCount} OPS</div></div>
                    <div class="data-box"><h4>SYNC RATE</h4><div class="value" style="color:#f0f">${u.affinity}%</div></div>
                    <div class="data-box"><h4>LOGIC POWER (CPU)</h4><div class="value" style="color:#0f5">${fmt(u.adm)}</div></div>
                    <div class="data-box"><h4>COMBAT POWER</h4><div class="value" style="color:#f55">${fmt(u.atk)}</div></div>
                </div>
                <h3 style="color:#666; font-size:0.9em; border-bottom:1px solid #333; margin-top:20px">FUTURE PROJECTIONS</h3>
                <ul class="future-events" style="padding-left:0;">${eventsHtml}</ul>
            </div>
        `;

    } else {
        // --- VISTA OPERATIONS (Task & Controlli) ---

        // Pannello Psiche (Read Only in questa vista)
        if (u.psyche) html += renderPsychePanel(u, true);

        // NUOVA GRIGLIA STATS (Correttamente concatenata a 'html')
        html += `
            <div class="stats-grid" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; margin-bottom:15px; font-family:var(--font-mono); font-size:0.8em; background:#111; padding:10px; border:1px solid #333">
                <div title="Health Points">HP: <span style="color:#55f">${Math.floor(u.hp)}</span></div>
                <div title="Attack Power">ATK: <span style="color:#f55">${fmt(u.atk)}</span></div>
                <div title="Logic/CPU Power">ADM: <span style="color:#0f5">${fmt(u.adm)}</span></div>
                
                <div title="Resilience (Reduces Stress/Dmg)">RES: <span style="color:#ea0">${fmt(u.res)}</span></div>
                <div title="Charisma (Boosts Trust/Sync)">CHA: <span style="color:#f0f">${fmt(u.cha)}</span></div>
                <div title="Luck (Crit Chance)">LUC: <span style="color:#0ff">${fmt(u.luc)}</span></div>
            </div>
            <div style="text-align:right; font-size:0.8em; color:#666; margin-bottom:10px">XP: ${u.xp}/${u.maxXp} (Lv.${u.lvl})</div>
        `;

        // Advisor Button
        if (u.role !== 'OPERATOR') {
            let btnTxt = u.isAdvisor ? "REMOVE FROM CPU" : "ASSIGN TO CPU";
            let btnColor = u.isAdvisor ? "#f05" : "#0f5";
            html += `<button onclick="toggleAdvisor(${selectedUnitIndex})" style="width:100%; margin-bottom:15px; border-color:${btnColor}; color:${btnColor}">${btnTxt}</button>`;
        }

        // Active State Check
        if (u.state !== "IDLE") {
            let isRec = u.state === "RECOVERING";
            let barCls = isRec ? "progress-bar-fill recovering" : "progress-bar-fill";
            let txt = isRec ? "RECONSTRUCTING DATA..." : `RUNNING: ${u.currentTask.name}`;
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

function generateTaskGrid(u) {
    let html = `<h3 style="color:#666; font-size:0.9em">AVAILABLE SUBROUTINES</h3><div class="action-grid">`;

    // Merge lists for display logic simplification
    let all = [...TASKS.training.map((t, i) => ({ ...t, type: 'training', idx: i })), ...TASKS.missions.map((t, i) => ({ ...t, type: 'missions', idx: i }))];

    all.forEach(t => {
        let show = t.category === 'UNIVERSAL' || (t.category === 'COMBAT' && u.role !== 'ASSISTANT') || (t.category === 'LOGIC' && u.role !== 'OPERATOR');
        if (!show) return;

        let isMission = t.type === 'missions';
        let sub = isMission ? `RWD: ${t.rewardQP} TB` : `+${t.gain} ${t.stat.toUpperCase()}`;
        let req = isMission ? `<div style="color:#f55; font-size:0.7em">REQ: ${t.minAtk} PWR</div>` : '';

        html += `
            <div class="action-card" onclick="assignTask(${selectedUnitIndex}, '${t.type}', ${t.idx})">
                <div style="color:${isMission ? '#ea0' : '#0ea'}">${t.name}</div>
                <div style="font-size:0.8em; color:#888; margin:5px 0">${sub}</div>
                ${req}
            </div>`;
    });
    html += "</div>";
    return html;
}

function renderBannerList() {
    const container = document.getElementById('banner-container');
    container.innerHTML = "";

    BANNERS.forEach((b, index) => {
        container.innerHTML += `
            <div class="banner-card" style="border-left-color: ${b.color}" onclick="selectBanner(${index})">
                <h3 style="color:${b.color}">${b.name}</h3>
                <p>${b.desc}</p>
            </div>
        `;
    });
}

function selectBanner(index) {
    currentBannerIndex = index;
    const banner = BANNERS[index];

    // Nascondi lista, mostra controlli
    document.getElementById('banner-container').classList.add('hidden');
    document.getElementById('summon-actions').classList.remove('hidden');

    // Aggiorna testi
    document.getElementById('selected-banner-title').innerText = banner.name;
    document.getElementById('selected-banner-title').style.color = banner.color;
    document.getElementById('selected-banner-desc').innerText = banner.desc;
}
function closeBanner() {
    document.getElementById('banner-container').classList.remove('hidden');
    document.getElementById('summon-actions').classList.add('hidden');
    document.getElementById('summon-result').classList.add('hidden');
    document.getElementById('summon-result').innerHTML = "";
}
function summonSingle() {
    if (qp < 10) { log("ERROR: Insufficient Buffer (Need 10 TB)."); return; }
    qp -= 10; updateGlobalBonus();

    let resDiv = document.getElementById('summon-result');
    resDiv.innerHTML = ""; resDiv.className = "hidden";

    log("SCANNER: Initializing Sector Scan...");
    setTimeout(() => {
        let res = processSummonLogic();
        log(res.msg);
        resDiv.classList.remove('hidden');
        // Rimuovi classe mini per single view
        resDiv.innerHTML = res.html.replace('mini', '');
        renderSidebar();
    }, 300);
}
function summonMulti() {
    if (qp < 100) { log("ERROR: Insufficient Buffer (Need 100 TB)."); return; }
    qp -= 100; updateGlobalBonus();

    let resDiv = document.getElementById('summon-result');
    resDiv.innerHTML = ""; resDiv.className = "summon-grid hidden";

    log("SCANNER: ⚡ DEEP DIVE INITIATED...");
    setTimeout(() => {
        resDiv.classList.remove('hidden');
        let html = "";
        for (let i = 0; i < 10; i++) {
            let res = processSummonLogic();
            html += res.html.replace('mini', `mini" style="animation-delay:${i * 0.1}s`);
        }
        resDiv.innerHTML = html;
        log("SCANNER: Batch reconstruction complete.");
        renderSidebar();
    }, 500);
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
    const trainingView = document.getElementById('view-training');
    if (trainingView) trainingView.classList.add('hidden');

    const target = document.getElementById('view-' + t);
    if (target) target.classList.remove('hidden');

    if (t === 'summon') {
        document.getElementById('summon-result').innerHTML = "";
        document.getElementById('summon-result').className = "hidden";
        closeBanner();
        renderBannerList();
    } else if (t === 'training') {
        // --- FIX BUG OPERATOR ---
        // Se c'è un'unità selezionata ed è un OPERATOR, deselezionala per evitare errori
        if (selectedUnitIndex !== null && myUnits[selectedUnitIndex].role === 'OPERATOR') {
            selectedUnitIndex = null;
            document.getElementById('training-area').innerHTML = "<p>> SELECT A UNIT TO BEGIN NEURAL SYNC...</p>";
        }
        renderTrainingView();
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
function renderTrainingView() {
    const list = document.getElementById('training-unit-list');
    list.innerHTML = "";

    myUnits.forEach((u, i) => {
        // RIMOSSO IL FILTRO: Ora tutti possono allenarsi
        // if (u.role === 'OPERATOR') return; 

        let isSel = i === selectedUnitIndex;
        let bgStyle = isSel ? 'background:#222;' : '';

        list.innerHTML += `
            <div class="action-card" onclick="selectTrainingUnit(${i})" 
                 style="margin-bottom:10px; border-left:3px solid ${u.limitBreak === 5 ? 'gold' : 'var(--accent-primary)'}; ${bgStyle}">
                <strong>${u.name}</strong><br>
                <small style="color:#888">SYNC: ${u.affinity}%</small>
            </div>
        `;
    });
}
function selectTrainingUnit(index) {
    selectedUnitIndex = index;
    const u = myUnits[index];
    const area = document.getElementById('training-area');

    // Fix dati mancanti
    if (!u.neuralStats) u.neuralStats = { adminKoCount: 0, unitKoCount: 0, history: {} };
    if (!u.psyche) u.psyche = { archetype: "UNSTABLE", resistance: 50, stress: 0, trust: 0 };

    renderTrainingView();

    // --- SEZIONE COMUNE: BARRA HP LIVE (Costruita qui per essere usata sia in Idle che in Linked) ---
    let hpPct = (u.hp / u.maxHp) * 100;
    // Se è KO usa rosso, altrimenti rosa (stile neural)
    let hpColorClass = u.hp <= 0 ? "critical" : "neural";

    let statusText = "";
    if (u.hp <= 0) statusText = "<span class='status-text-ko'>⚠ CRITICAL FAILURE (KO)</span>";
    else if (u.state === "IDLE" && u.hp < u.maxHp) statusText = "<span class='status-text-regen'>♻ REGENERATING...</span>";
    else statusText = "STABLE";

    let hpBarHtml = `
        <div class="unit-status-panel">
            <div style="display:flex; justify-content:space-between; font-size:0.8em; color:#aaa">
                <span>UNIT INTEGRITY</span>
                <span id="training-status-text">${statusText}</span>
            </div>
            <div class="hp-bar-container">
                <div id="training-hp-bar" class="hp-bar-fill ${hpColorClass}" style="width:${hpPct}%"></div>
            </div>
            <div style="text-align:right; font-size:0.7em; margin-top:2px; font-family:var(--font-mono)">
                <span id="training-hp-val">${Math.floor(u.hp)}</span> / ${u.maxHp} HP
            </div>
        </div>
    `;

    // 1. CHECK LINK ATTIVO (Ripristinato il codice reale)
    if (u.state === 'LINKED') {
        let elapsed = Date.now() - u.startTime;
        let pct = Math.min((elapsed / u.duration) * 100, 100);
        let isOverload = userStats.state === "EXHAUSTED";

        let titleLink = isOverload ? "⚠ SYNC PAUSED (ADMIN OVERLOAD)" : "NEURAL SYNC IN PROGRESS...";
        let titleColor = isOverload ? "#f00" : "#f0f";
        let barColor = isOverload ? "#555" : "#f0f"; // Grigio se in pausa, viola se attivo

        // HTML EXTRA PER IL RECUPERO ADMIN (Visibile solo se Exhausted)
        let adminRecoveryHtml = "";
        if (isOverload) {
            let adminPct = (userStats.stamina / userStats.maxStamina) * 100;
            adminRecoveryHtml = `
                <div style="margin-top:20px; padding:15px; border:1px solid #f00; background:rgba(50,0,0,0.5); animation: flashText 1s infinite;">
                    <div style="color:#f00; font-weight:bold; margin-bottom:5px">MENTAL STABILITY CRITICAL</div>
                    <div style="font-size:0.8em; color:#aaa; margin-bottom:5px">RECOVERING CONSCIOUSNESS...</div>
                    <div class="progress-bar-bg" style="background:#300; height:10px">
                        <div id="admin-recovery-bar-inner" style="width:${adminPct}%; height:100%; background:#f00; box-shadow:0 0 10px #f00; transition:width 0.2s"></div>
                    </div>
                </div>
            `;
        }

        area.innerHTML = `
            <div style="text-align:center; width:100%; max-width:600px; animation:fadeIn 0.3s">
                ${hpBarHtml} <h2 class="${isOverload ? 'blink' : ''}" style="color:${titleColor}; margin-top:20px">${titleLink}</h2>
                <p style="color:${isOverload ? '#888' : '#ccc'}">${u.currentTask.name}</p>
                
                <div class="progress-bar-bg" style="height:20px; border:1px solid ${titleColor}">
                    <div id="neural-bar" style="width:${pct}%; height:100%; background:${barColor}; box-shadow:0 0 15px ${barColor}"></div>
                </div>

                ${adminRecoveryHtml}
                
                <button onclick="abortNeuralLink()" style="margin-top:20px; border-color:var(--accent-secondary); color:var(--accent-secondary)">
                    ${isOverload ? 'EMERGENCY ABORT' : 'ABORT LINK'}
                </button>
            </div>
        `;
        return;
    }

    // 2. CHECK ADMIN ESAUSTO (Senza link attivo su questa unità)
    if (userStats.state === "EXHAUSTED") {
        let adminPct = (userStats.stamina / userStats.maxStamina) * 100;
        area.innerHTML = `
            <div style="text-align:center; color:#f55; animation:fadeIn 0.3s">
                ${hpBarHtml}
                <h2 class="blink">⚠ MENTAL OVERLOAD ⚠</h2>
                <div style="font-size:3em; margin:20px">🧠</div>
                <p>System frozen. Restoring Stability...</p>
                <div class="progress-bar-bg" style="width:200px; margin:0 auto; background:#300">
                     <div id="admin-recovery-bar-inner" style="width:${adminPct}%; height:100%; background:#f00; transition:width 0.2s"></div>
                </div>
            </div>
        `;
        return;
    }

    // --- NUOVA UI PSICHE (Condizionamento - Solo se non in Link) ---
    let p = u.psyche;
    let psycheHtml = "";

    // FASE 1: ROTTURA DEL MURO (Hostility > 0)
    if (p.resistance > 0) {
        psycheHtml = `
            <div style="background:#1a0505; border:1px solid #500; padding:15px; margin-bottom:15px">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                    <span style="color:#f55; font-weight:bold">⚠ NEURAL BARRIER DETECTED</span>
                    <span style="color:#888; font-size:0.8em">STATUS: HOSTILE</span>
                </div>
                <div style="font-size:0.7em; color:#aaa; margin-bottom:5px">Reducing resistance required to enable Core Imprinting.</div>
                
                <div class="progress-bar-bg" style="background:#300; margin-bottom:15px">
                    <div style="width:${p.resistance}%; background:#f00; height:100%; box-shadow:0 0 10px #f00"></div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
                    <button onclick="psycheAction(${index}, 'SOOTHE')" style="border-color:#0af; color:#0af; font-size:0.8em">
                        SOOTHE PROTOCOL<br><span style="font-size:0.7em; opacity:0.7">-5 Res | -10 TB</span>
                    </button>
                    <button onclick="psycheAction(${index}, 'BREAK')" style="border-color:#f00; color:#f00; font-size:0.8em">
                        FORCE BREAK<br><span style="font-size:0.7em; opacity:0.7">-15 Res | +Stress | -10 TB</span>
                    </button>
                </div>
            </div>
        `;
    }
    // FASE 2: IMPRINTING (Hostility == 0)
    else {
        // MODIFICA QUI: Cambia "PARTNER" in "DEVOTED"
        let archetypeColor = p.archetype === "DEVOTED" ? "#f0f" : (p.archetype === "THRALL" ? "#a0f" : "#0ff");

        psycheHtml = `
            <div style="background:#051015; border:1px solid ${archetypeColor}; padding:15px; margin-bottom:15px">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                    <span style="color:${archetypeColor}; font-weight:bold">✔ NEURAL PATHWAY OPEN</span>
                    <span style="color:${archetypeColor}; font-size:0.8em">ARCHETYPE: ${p.archetype}</span>
                </div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px">
                    <div>
                        <div style="font-size:0.7em; color:#0af">TRUST (Devotion)</div>
                        <div class="progress-bar-bg"><div style="width:${p.trust}%; background:#0af; height:100%"></div></div>
                    </div>
                    <div>
                        <div style="font-size:0.7em; color:#a0f; text-align:right">STRESS (Fear)</div>
                        <div class="progress-bar-bg"><div style="width:${p.stress}%; background:#a0f; height:100%"></div></div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
                    <button onclick="psycheAction(${index}, 'PRAISE')" style="border-color:#0af; color:#0af; font-size:0.8em">
                        PRAISE<br><span style="font-size:0.7em; opacity:0.7">+Trust | -Stress</span>
                    </button>
                    <button onclick="psycheAction(${index}, 'INTIMIDATE')" style="border-color:#a0f; color:#a0f; font-size:0.8em">
                        INTIMIDATE<br><span style="font-size:0.7em; opacity:0.7">+Stress | -Trust</span>
                    </button>
                </div>
            </div>
        `;
    }

    // --- UNIONE HTML ---
    // --- UNIONE HTML ---
    let opsHtml = `<div class="training-options-grid">`;
    JOINT_OPS.forEach(op => {
        // 1. FILTRO SESSO: Se l'opzione ha un requisito e l'unità non corrisponde, la saltiamo
        if (op.reqSex && op.reqSex !== u.sex) return;

        let isLocked = userStats.adminLvl < op.reqLvl;
        let lockIcon = isLocked ? "🔒" : "⚡";
        let color = isLocked ? "#555" : "var(--accent-gold)";
        let count = u.neuralStats.history[op.id] || 0;

        // Colori diversi per i tag sesso
        let tagHtml = "";
        if (op.reqSex === 'MALE') tagHtml = `<span style="color:#66f; font-size:0.7em; border:1px solid #44a; padding:0 3px; margin-right:5px">♂</span>`;
        else if (op.reqSex === 'FEMALE') tagHtml = `<span style="color:#f6a; font-size:0.7em; border:1px solid #a46; padding:0 3px; margin-right:5px">♀</span>`;
        else if (op.reqSex === 'ENTITY') tagHtml = `<span style="color:#a6f; font-size:0.7em; border:1px solid #64a; padding:0 3px; margin-right:5px">⟁</span>`;

        opsHtml += `
            <div class="joint-op-card ${isLocked ? 'locked' : ''}" onclick="${isLocked ? '' : `startJointOp('${op.id}')`}">
                <div>
                    <div style="color:${color}; font-weight:bold">
                        ${tagHtml} ${lockIcon} ${op.name} <span id="badge-${op.id}" class="count-badge">x${count}</span>
                    </div>
                    <div style="font-size:0.8em; color:#888">${op.desc}</div>
                </div>
                <div style="text-align:right; font-family:var(--font-mono)">
                    <div style="color:#0af; font-size:0.9em">-${op.staminaCost} STM</div>
                    <div style="color:#f55; font-size:0.8em">-${op.hpCost} HP</div>
                </div>
            </div>
        `;
    });
    opsHtml += `</div>`;

    // Render Finale (Idle)
    area.innerHTML = `
        <div style="width:100%; max-width:600px; animation:fadeIn 0.3s">
            <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:15px">
                <div>
                    <h2 style="margin:0; color:var(--accent-primary)">NEURAL LINK: ${u.name}</h2>
                    <div style="font-size:0.75em; color:#aaa; margin-top:5px; font-family:var(--font-mono)">
                        ADMIN KO: <span id="val-admin-ko" style="color:#f55">${u.neuralStats.adminKoCount}</span> | 
                        UNIT KO: <span id="val-unit-ko" style="color:#f55">${u.neuralStats.unitKoCount}</span>
                    </div>
                </div>
                <div style="text-align:right">
                    <div style="font-size:2em">${u.affinity >= 100 ? '♥' : '♡'}</div>
                    <small style="color:#aaa"><span id="training-sync-val">${u.affinity}</span>% SYNC</small>
                </div>
            </div>

            ${hpBarHtml} ${psycheHtml} <h3 style="color:#666; font-size:0.9em; margin-top:20px">SYNC OPERATIONS</h3>
            ${opsHtml}
        </div>
    `;
}
function renderPsychePanel(u, readOnly = false) {
    let p = u.psyche;

    // Calcolo stato attuale
    let statusColor = "#fff";
    if (p.archetype === "UNSTABLE") statusColor = "#f55";
    else if (p.archetype === "THRALL") statusColor = "#a0f";

    // MODIFICA QUI: Riconosci "DEVOTED" invece di PARTNER
    else if (p.archetype === "DEVOTED") statusColor = "#f0f"; // #f0f è Magenta (Devotion)

    else statusColor = "#0ff"; // Asset
    let html = `
        <div style="border:1px solid #333; padding:10px; margin-bottom:15px; background:#050505">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px">
                <span style="color:#888">MENTAL STATE:</span>
                <span style="color:${statusColor}; font-weight:bold; letter-spacing:1px">${p.archetype}</span>
            </div>

            ${p.resistance > 0 ? `
            <div style="font-size:0.8em; color:#f55; margin-bottom:2px">HOSTILITY / RESISTANCE</div>
            <div class="progress-bar-bg" style="background:#300; margin-top:0; margin-bottom:10px">
                <div style="width:${p.resistance}%; background:#f00; height:100%"></div>
            </div>` : ''}

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
                <div>
                    <div style="font-size:0.7em; color:#0af">TRUST (Devotion)</div>
                    <div class="progress-bar-bg" style="margin-top:2px">
                        <div style="width:${p.trust}%; background:#0af; height:100%"></div>
                    </div>
                </div>
                <div>
                    <div style="font-size:0.7em; color:#a0f; text-align:right">STRESS (Fear)</div>
                    <div class="progress-bar-bg" style="margin-top:2px; background:#202">
                        <div style="width:${p.stress}%; background:#a0f; height:100%"></div>
                    </div>
                </div>
            </div>
    `;

    // NUOVO: Mostra i pulsanti SOLO se readOnly è false (quindi solo in Neural Link se lo usiamo lì)
    // Nota: Attualmente Neural Link usa la sua funzione di render interna in 'selectTrainingUnit', 
    // quindi questa funzione viene usata principalmente da Virtual Assets (dove vogliamo readOnly=true).
    if (!readOnly) {
        html += `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px">
                <button onclick="psycheAction(${selectedUnitIndex}, 'PRAISE')" style="font-size:0.8em; border-color:#0af; color:#0af">
                    PRAISE<br><span style="font-size:0.7em; opacity:0.7">-Res, +Trust</span>
                </button>
                <button onclick="psycheAction(${selectedUnitIndex}, 'PUNISH')" style="font-size:0.8em; border-color:#a0f; color:#a0f">
                    INTIMIDATE<br><span style="font-size:0.7em; opacity:0.7">-Res, +Stress</span>
                </button>
            </div>
        `;
    }

    html += `</div>`;
    return html;
}
function updateProgressBar(unit, elapsed, isHeal = false) {
    let bar = document.getElementById(`bar-${unit.uid}`);
    if (!bar) return;

    let pct = 0;
    if (isHeal) pct = (unit.hp / unit.maxHp) * 100;
    else pct = Math.min((elapsed / unit.duration) * 100, 100);

    bar.style.width = pct + "%";
}