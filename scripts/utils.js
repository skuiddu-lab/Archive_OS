function fmt(val, decimals = 1) { return parseFloat(val.toFixed(decimals)); }
function getStars(count) { return "★".repeat(count); }
function showSystemMessage(title, msg, type = "error") {
    const modal = document.getElementById('sys-modal');
    const mTitle = document.getElementById('modal-title');
    const mBody = document.getElementById('modal-body');
    const content = document.querySelector('.modal-content');

    // Colori dinamici in base al tipo
    let color = type === "success" ? "var(--accent-primary)" :
        (type === "gold" ? "var(--accent-gold)" : "var(--accent-secondary)");

    content.style.borderColor = color;
    mTitle.style.color = color;

    mTitle.innerText = title;
    mBody.innerHTML = msg; // Supporta HTML
    modal.classList.remove('hidden');
}
function closeModal() {
    document.getElementById('sys-modal').classList.add('hidden');
}
function log(m) {
    let d = document.getElementById('console-log');
    d.innerHTML += `<div class="log-entry">[${new Date().toLocaleTimeString()}] ${m}</div>`;
    d.scrollTop = d.scrollHeight;
}
function toggleLog() { document.getElementById('console-container').classList.toggle('collapsed'); }
