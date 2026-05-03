// ==========================================
// 1. CLOCK ENGINE
// ==========================================
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;

    const options = {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
        timeZone: 'Africa/Nairobi'
    };
async function refreshNOCInventory() {
    const grid = document.getElementById('dynamic-lab-grid');
    if (!grid) return;

    try {
        const response = await fetch('https://pacosnet-api.onrender.com/get-labs');
        const labs = await response.json();
        
        grid.innerHTML = ''; // Wipe existing static cards

        labs.forEach(lab => {
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

// Call it on load
document.addEventListener('DOMContentLoaded', refreshNOCInventory);
    try {
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(new Date());
        const d = parts.find(p => p.type === 'day').value;
        const m = parts.find(p => p.type === 'month').value;
        const y = parts.find(p => p.type === 'year').value;
        const hh = parts.find(p => p.type === 'hour').value;
        const mm = parts.find(p => p.type === 'minute').value;
        const ss = parts.find(p => p.type === 'second').value;

        clockElement.innerText = `${d}/${m}/${y} // ${hh}:${mm}:${ss} EAT`;
    } catch (e) {
        clockElement.innerText = new Date().toLocaleString();
    }
}

// ==========================================
// 2. PACOSNET LIVE TELEMETRY (NEW)
// ==========================================
async function fetchNetworkStatus() {
    const statusElement = document.getElementById('pacos-status-display');
    if (!statusElement) return;

    try {
        // This endpoint will be hosted on Render/Railway in the next step
        const response = await fetch('https://pacosnet-api.onrender.com/latest-policy');
        const data = await response.json();
        
        // Reflecting the instruction sent from your Admin Dashboard
        statusElement.innerText = `Active Policy: ${data.instruction}`;
        statusElement.style.color = "#00ff00"; // Status Green
    } catch (error) {
        // Fallback if the local lab/API is offline
        statusElement.innerText = "Node Status: Standalone Mode";
        console.log("PacosNet API currently unreachable.");
    }
}

// ==========================================
// 3. SYSTEM INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Start Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Start Network Telemetry
    fetchNetworkStatus();
    setInterval(fetchNetworkStatus, 30000); // Polling every 30 seconds

    const consoleArea = document.querySelector('.console');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');

    // --- SMART SCROLL CONTROL ---
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const isMobile = window.innerWidth <= 1024;
                    if (isMobile) {
                        const offset = 140;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    } else if (consoleArea) {
                        consoleArea.scrollTo({
                            top: targetElement.offsetTop - 50,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // --- SCROLL SPY ---
    const scrollTarget = window.innerWidth <= 1024 ? window : consoleArea;
    if (scrollTarget) {
        scrollTarget.addEventListener('scroll', () => {
            let current = "";
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const scrollTop = (scrollTarget === window) ? window.pageYOffset : consoleArea.scrollTop;
                if (scrollTop >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        });
    }

    // --- KEYBOARD SHORTCUTS ---
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'n') window.location.href = 'networking.html';
        if (key === 'h') window.location.href = 'index.html';
        if (key === 'c') document.querySelector('a[download]')?.click();
    });
});