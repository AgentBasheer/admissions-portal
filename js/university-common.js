// --- REALTIME CLOCK LOGIC ---
function updateTime() {
    const now = new Date();
    const dateOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions).toUpperCase();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const timeEl = document.getElementById('system-time');
    if (timeEl) timeEl.innerText = `SYSTEM DATE: ${dateStr} // ${timeStr}`;
}

const KRW_TO_PKR_RATE = 1 / 5.25; // Accurate exchange rate
let isPKR = false;

function toggleCurrency() {
    isPKR = !isPKR;
    const toggleBtn = document.getElementById('currency-toggle');

    if (isPKR) {
        toggleBtn.classList.add('active-mode');
    } else {
        toggleBtn.classList.remove('active-mode');
    }

    const moneyElements = document.querySelectorAll('.money');

    moneyElements.forEach(el => {
        const krwVal = parseFloat(el.getAttribute('data-krw'));

        if (isPKR) {
            // Convert to PKR
            const pkrVal = krwVal * KRW_TO_PKR_RATE;
            el.innerText = formatMoney(pkrVal, 'PKR');
        } else {
            // Revert to KRW
            el.innerText = formatMoney(krwVal, 'KRW');
        }
    });
}

function formatMoney(value, currency) {
    // If value is in millions (e.g. 1.2M) or negative
    if (Math.abs(value) >= 1000000) {
        let millions = (value / 1000000).toFixed(2);
        const cleanMillions = parseFloat(millions); // Removes trailing zeros
        return `${cleanMillions}M ${currency}`;
    }

    if (value === 0) return `0 ${currency}`;

    // Standard comma separation for thousands
    return Math.round(value).toLocaleString('en-US') + ` ${currency}`;
}

// --- MOUSE PHYSICS ---
let mouse = { x: 0, y: 0 };
let outline = { x: 0, y: 0 };

function animateCursor() {
    const cursorOutline = document.getElementById('cursor-outline');
    if (!cursorOutline) return;

    let speed = 0.2;
    outline.x += (mouse.x - outline.x) * speed;
    outline.y += (mouse.y - outline.y) * speed;
    cursorOutline.style.transform = `translate(${outline.x}px, ${outline.y}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
}

// --- CATEGORY TAB FUNCTIONALITY ---
function showCategory(categoryName) {
    // Hide all content sections
    const allContents = document.querySelectorAll('.category-content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tabs
    const allTabs = document.querySelectorAll('.category-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected content
    const selectedContent = document.getElementById(`${categoryName}-content`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // Add active class to clicked tab
    // Using window.event as fallback for inline handlers
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    } else if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
}

// --- FAQ GROUP TOGGLE FUNCTIONALITY ---
function toggleFaqGroup(header) {
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');

    // Close all FAQ groups
    document.querySelectorAll('.faq-group-header').forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.classList.remove('active');
    });

    // Open clicked group if it wasn't active
    if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    animateCursor();

    // Mouse Move
    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        const cursorDot = document.getElementById('cursor-dot');
        if (cursorDot) {
            cursorDot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
        }

        // Parallax
        const glow = document.querySelector('.ambient-glow');
        if (glow) {
            const x = (window.innerWidth - e.pageX) / 40;
            const y = (window.innerHeight - e.pageY) / 40;
            glow.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    // Hover Interaction
    const cursorOutline = document.getElementById('cursor-outline');
    if (cursorOutline) {
        document.querySelectorAll('.interactable').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.borderColor = 'var(--gold-primary)';
                cursorOutline.style.backgroundColor = 'var(--cursor-hover-bg)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.borderColor = 'rgba(255,255,255,0.3)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }
});