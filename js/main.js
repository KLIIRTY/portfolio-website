// ==========================================
// PACOS ENGINE — MAIN SYSTEM CORE
// ==========================================

/* ==========================================
   1. CLOCK ENGINE
========================================== */
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;

    const now = new Date();

    try {
        const formatter = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Africa/Nairobi'
        });

        const parts = formatter.formatToParts(now);

        const get = (type) =>
            parts.find(p => p.type === type)?.value || "00";

        clockElement.innerText =
            `${get('day')}/${get('month')}/${get('year')} // ${get('hour')}:${get('minute')}:${get('second')} EAT`;

    } catch (err) {
        clockElement.innerText = now.toLocaleString();
    }
}


/* ==========================================
   2. NOC LAB INVENTORY
========================================== */
async function refreshNOCInventory() {
    const grid = document.getElementById('dynamic-lab-grid');
    if (!grid) return;

    try {
        const res = await fetch('https://pacosnet-api.onrender.com/get-labs');
        const labs = await res.json();

        grid.innerHTML = "";

        labs.forEach(lab => {
            const card = document.createElement("article");
            card.className = "module-card";

            card.innerHTML = `
                <div class="module-id">L-ID: ${lab.id}</div>
                <h3>${lab.title}</h3>
                <p>${lab.description}</p>
                <div class="actions">
                    <span style="color:#00ff88;">[ ${lab.status} ]</span>
                </div>
            `;

            grid.appendChild(card);
        });

    } catch (err) {
        console.warn("Lab fetch failed:", err);
    }
}


/* ==========================================
   3. NETWORK STATUS
========================================== */
async function fetchNetworkStatus() {
    const el = document.getElementById('pacos-status-display');
    if (!el) return;

    try {
        const res = await fetch('https://pacosnet-api.onrender.com/latest-policy');
        const data = await res.json();

        const policy = data?.instruction || "Node Standby - Awaiting Command";

        el.innerText = `Active Policy: ${policy}`;
        el.style.color = "#00ff88";

    } catch (err) {
        el.innerText = "Active Policy: STANDALONE_MODE";
        el.style.color = "#ff9f1c";
    }
}


/* ==========================================
   4. BOOT SEQUENCE (RUN ONCE PER SESSION)
========================================== */
function runBootSequence() {
    const boot = document.getElementById("boot-screen");
    const line = document.getElementById("boot-line");

    if (!boot || !line) return;

    const bootLines = [
        "INITIALIZING CORE MODULES",
        "CHECKING NETWORK STACK",
        "LOADING PACOS ENGINE",
        "SYNCING GITHUB BUILD",
        "MOUNTING SYSTEM UI",
        "STARTUP COMPLETE"
    ];

    let i = 0;

    const interval = setInterval(() => {
        line.textContent = bootLines[i];
        i++;

        if (i >= bootLines.length) {
            clearInterval(interval);

            setTimeout(() => {
                boot.style.transition = "opacity 0.8s ease";
                boot.style.opacity = "0";

                setTimeout(() => boot.remove(), 900);
            }, 600);
        }
    }, 700);
}

function setTheme(theme) {
    const body = document.body;
    const toggle = document.getElementById('theme-toggle');

    if (theme === 'light') {
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
    }

    if (toggle) {
        toggle.textContent = theme === 'light' ? '🌙' : '🌗';
    }

    localStorage.setItem('site-theme', theme);
}

function initThemeToggle() {
    const savedTheme = localStorage.getItem('site-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        setTheme(nextTheme);
    });
}

function initSectionObserver() {
    const sections = document.querySelectorAll('main .console-content section[id]');
    const navLinks = document.querySelectorAll('.side-nav .nav-item');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
    }, {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0.25
    });

    sections.forEach(section => observer.observe(section));
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = (formData.get('name') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const message = (formData.get('message') || '').toString().trim();

        if (!name || !email || !message) {
            if (status) status.textContent = 'Please complete all fields before sending.';
            return;
        }

        const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

        if (status) status.textContent = 'Opening your email client...';
        window.location.href = `mailto:Nyagakevin822@gmail.com?subject=${subject}&body=${body}`;
    });
}


/* ==========================================
   5. SYSTEM INITIALIZATION
========================================== */
document.addEventListener('DOMContentLoaded', () => {

    // CLOCK
    updateClock();
    setInterval(updateClock, 1000);

    // DATA
    refreshNOCInventory();
    fetchNetworkStatus();
    setInterval(fetchNetworkStatus, 30000);

    // UX Enhancements
    initThemeToggle();
    initSectionObserver();
    initContactForm();

    // BOOT CONTROL (IMPORTANT FIX)
    const bootAlreadyRun = sessionStorage.getItem("pacos_boot_done");

    if (!bootAlreadyRun) {
        setTimeout(() => {
            runBootSequence();
            sessionStorage.setItem("pacos_boot_done", "true");
        }, 500);
    } else {
        const boot = document.getElementById("boot-screen");
        if (boot) boot.remove();
    }
});

const sidebar = document.querySelector(".sidebar");
const openBtn = document.getElementById("menu-open");
const closeBtn = document.getElementById("menu-close");

if (openBtn && sidebar) {
    openBtn.addEventListener("click", () => {
        sidebar.classList.add("active");
        document.body.classList.add("sidebar-open");
    });
}

if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("active");
        document.body.classList.remove("sidebar-open");
    });
}

const navLinks = document.querySelectorAll('.side-nav .nav-item');
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });
});

// close when clicking outside sidebar (nice UX)
document.addEventListener("click", (e) => {
    if (!sidebar || !openBtn) return;

    const isClickInside = sidebar.contains(e.target) || openBtn.contains(e.target);

    if (!isClickInside && window.innerWidth <= 900) {
        sidebar.classList.remove("active");
        document.body.classList.remove("sidebar-open");
    }
});