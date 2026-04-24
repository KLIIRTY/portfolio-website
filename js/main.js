// 1. CLOCK ENGINE (Independent of DOM items except the clock itself)
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
        const m = parts.find(p => p.type === 'month').value;
        const y = parts.find(p => p.type === 'year').value;
        const hh = parts.find(p => p.type === 'hour').value;
        const mm = parts.find(p => p.type === 'minute').value;
        const ss = parts.find(p => p.type === 'second').value;

        clockElement.innerText = `${d}/${m}/${y} // ${hh}:${mm}:${ss} EAT`;
    } catch (e) {
        // Fallback if Intl fails
        clockElement.innerText = now.toLocaleString();
    }
}

// 2. SYSTEM INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Start Telemetry
    updateClock();
    setInterval(updateClock, 1000);

    const consoleArea = document.querySelector('.console');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    const logContainer = document.getElementById('status-log');

    // Smooth Scrolling Logic
    navItems.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
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

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'n') window.location.href = 'networking.html';
        if (key === 'h') window.location.href = 'index.html';
        if (key === 'c') document.querySelector('a[download]')?.click();
    });
});