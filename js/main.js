// 1. CLOCK ENGINE
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
        clockElement.innerText = now.toLocaleString();
    }
}

// 2. SYSTEM INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    const consoleArea = document.querySelector('.console');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');

    // --- SMART SCROLL CONTROL (Integrated) ---
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const isMobile = window.innerWidth <= 1024;
                    
                    if (isMobile) {
                        // Mobile: Scroll the whole page
                        const offset = 140; // Adjust for your mobile header height
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    } else if (consoleArea) {
                        // Desktop: Scroll the console div
                        consoleArea.scrollTo({
                            top: targetElement.offsetTop - 50,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // --- SCROLL SPY (Tracking for Mobile & Desktop) ---
    const scrollTarget = (window.innerWidth <= 1024) ? window : consoleArea;
    
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

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'n') window.location.href = 'networking.html';
        if (key === 'h') window.location.href = 'index.html';
        if (key === 'c') document.querySelector('a[download]')?.click();
    });
});