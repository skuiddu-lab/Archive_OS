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
        d.innerHTML = "<p>> AWAITING INPUT...</p>";
        return;
    }

    const u = myUnits[selectedUnitIndex];
    if (u.missionCount === undefined) u.missionCount = 0;

    let integrityText = u.limitBreak === 5 ? "STABLE (100%)" : `UNSTABLE (v0.${u.limitBreak})`;
    let color = u.limitBreak === 5 ? "var(--accent-gold)" : "var(--accent-primary)";

    // Gestione Tag Sex
    let sexTag = u.sex ? u.sex : "UNKNOWN";

    // GENERAZIONE HTML TRATTI
    let traitsHtml = "";
    if (u.traits && u.traits.length > 0) {
        traitsHtml = `<div style="margin-top:5px; display:flex; gap:5px; flex-wrap:wrap;">`;
        u.traits.forEach(t => {
            traitsHtml += `<span style="background:#222; border:1px solid #444; color:#aaa; font-size:0.7em; padding:2px 5px; border-radius:3px">${t}</span>`;
        });
        traitsHtml += `</div>`;
    }

    // 1. HEADER FISSO (QUESTA PARTE MANCAVA NEL TUO CODICE!)
    let html = `
        <div style="border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center">
            <div>
                <h2 style="margin:0; color:${color}">${u.name} <small style="font-size:0.5em; color:#fff">${getStars(u.rarity)}</small></h2>
                <div style="font-size:0.8em; color:#888; margin-top:5px; font-family:var(--font-mono)">
                    ID: ${u.id} | CLASS: ${u.class} | SEX: <span style="color:#fff">${sexTag}</span>
                </div>
                ${traitsHtml} <div style="font-size:0.8em; color:${color}; margin-top:2px">${integrityText}</div>
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

    const target = document.getElementById('view-' + t);
    if (target) target.classList.remove('hidden');

    if (t === 'summon') {
        document.getElementById('summon-result').innerHTML = "";
        document.getElementById('summon-result').className = "hidden";
        closeBanner();
        renderBannerList();

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