// ==========================================
// 1. CLOCK ENGINE
// ==========================================
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;

    const now = new Date();
    const options = {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
        timeZone: 'Africa/Nairobi'
    };

    try {
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(now);
        const d = parts.find(p => p.type === 'day').value;
        const mn = parts.find(p => p.type === 'month').value;
        const y = parts.find(p => p.type === 'year').value;
        const hh = parts.find(p => p.type === 'hour').value;
        const mm = parts.find(p => p.type === 'minute').value;
        const ss = parts.find(p => p.type === 'second').value;

        clockElement.innerText = `${d}/${mn}/${y} // ${hh}:${mm}:${ss} EAT`;
    } catch (e) {
        clockElement.innerText = now.toLocaleString();
    }
}

// ==========================================
// 2. DYNAMIC NOC INVENTORY (DATABASE FETCH)
// ==========================================
async function refreshNOCInventory() {
    const grid = document.getElementById('dynamic-lab-grid');
    if (!grid) return;

    try {
        const response = await fetch('https://pacosnet-api.onrender.com/get-labs');
        const labs = await response.json();
        
        grid.innerHTML = ''; // Wipe existing static cards

        labs.forEach(lab => {
            // CRITICAL: Using backticks (`) for template literals
            grid.innerHTML += `
                <article class="module-card">
                  <div class="module-id">L-ID: ${lab.id}</div>
                  <h3>${lab.title}</h3>
                  <p>${lab.description}</p>
                  <div class="actions">
                    <span class="status-tag" style="color: #00ff00;">[ ${lab.status} ]</span>
                  </div>
                </article>
            `;
        });
    } catch (err) {
        console.error("Uplink failed:", err);
    }
}

// ==========================================
// 3. PACOSNET LIVE TELEMETRY
// ==========================================
async function fetchNetworkStatus() {
    const statusElement = document.getElementById('pacos-status-display');
    if (!statusElement) return;

    try {
        const response = await fetch('https://pacosnet-api.onrender.com/latest-policy');
        const data = await response.json();
        
        // Use the instruction from DB, or fallback to Standby
        const currentPolicy = data.instruction || "Node Standby - Awaiting Command";
        statusElement.innerText = `Active Policy: ${currentPolicy}`;
        statusElement.style.color = "#00ff00"; 
    } catch (err) {
        statusElement.innerText = "Active Policy: STANDALONE_MODE";
        console.log("PacosNet API currently unreachable.");
    }
}

// ==========================================
// 4. SYSTEM INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Start Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Initial Data Fetch
    refreshNOCInventory();
    fetchNetworkStatus();

    // Polling every 30 seconds
    setInterval(fetchNetworkStatus, 30000);
});