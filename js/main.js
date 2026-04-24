/**
 * PACOS_NET // CORE_V2 // TELEMETRY_MODULE
 * Priority: High
 */

// 1. GLOBAL TELEMETRY FUNCTION
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;

    const now = new Date();
    
    // Formatting to Nairobi/EAT Standards
    const options = { 
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
        timeZone: 'Africa/Nairobi' 
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(now);
    
    const d = parts.find(p => p.type === 'day').value;
    const m = parts.find(p => p.type === 'month').value;
    const y = parts.find(p => p.type === 'year').value;
    const hh = parts.find(p => p.type === 'hour').value;
    const mm = parts.find(p => p.type === 'minute').value;
    const ss = parts.find(p => p.type === 'second').value;

    clockElement.innerText = `${d}/${m}/${y} // ${hh}:${mm}:${ss} EAT`;
}

// 2. MAIN SYSTEM INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // UI ELEMENTS
    const consoleArea = document.querySelector('.console');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    const logContainer = document.getElementById('status-log');

    // --- START CLOCK (Primary Process) ---
    updateClock(); 
    setInterval(updateClock, 1000);

    // --- LIVE FEED LOGIC (Secondary Process) ---
    const messages = [
        "> Simulating VLAN_77 traffic...",
        "> PacosNet: Uplink Active",
        "> Analyzing packet headers...",
        "> Latency: 12ms [STABLE]",
        "> IsolationForest checking...",
        "> OSPF Convergence: 100%",
        "> Logical architecture mapped.",
        "> High-burst mode standby."
    ];

    function addLog() {
        if (!logContainer) return; // Fail-safe: won't crash if div is missing
        const div = document.createElement('div');
        div.className = 'log-line';
        div.innerText = messages[Math.floor(Math.random() * messages.length)];
        logContainer.appendChild(div);
        if (logContainer.childNodes.length > 5) logContainer.removeChild(logContainer.firstChild);
    }
    
    if (logContainer) {
        setInterval(addLog, 4000);
    }

    // --- INTERFACE CONTROL (Navigation) ---
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement && consoleArea) {
                    consoleArea.scrollTo({
                        top: targetElement.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- SYSTEM MONITOR (Scroll Spy) ---
    if (consoleArea) {
        consoleArea.addEventListener('scroll', () => {
            let current = "";
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (consoleArea.scrollTop >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');