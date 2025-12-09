document.addEventListener('DOMContentLoaded', () => {
    // --- CACHE DOM ELEMENTS ---
    const els = {
        time: document.getElementById('system-time'),
        updated: document.getElementById('last-updated'),
        cursorDot: document.getElementById('cursor-dot'),
        cursorOut: document.getElementById('cursor-outline'),
        glow: document.querySelector('.ambient-glow'),
        interactables: document.querySelectorAll('.interactable')
    };

    // --- STATE ---
    const mouse = { x: 0, y: 0 };
    const outline = { x: 0, y: 0 };
    const win = { w: window.innerWidth, h: window.innerHeight };

    // --- CLOCK ---
    const updateTime = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
        els.time.innerText = `SYSTEM DATE: ${dateStr} // ${now.toLocaleTimeString('en-US', { hour12: false })}`;
        if (!els.updated.innerText || els.updated.innerText === "Loading...") els.updated.innerText = dateStr;
    };
    setInterval(updateTime, 1000);
    updateTime();

    // --- MOUSE & PARALLAX EVENT (Consolidated) ---
    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Instant Dot Movement
        els.cursorDot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
        
        // Parallax Effect (Lightweight)
        const moveX = (win.w - mouse.x) / 40;
        const moveY = (win.h - mouse.y) / 40;
        els.glow.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    // --- SMOOTH CURSOR ANIMATION LOOP ---
    const animateCursor = () => {
        const speed = 0.2;
        outline.x += (mouse.x - outline.x) * speed;
        outline.y += (mouse.y - outline.y) * speed;
        
        els.cursorOut.style.transform = `translate3d(${outline.x}px, ${outline.y}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // --- INTERACTION HANDLERS ---
    els.interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const isCnu = el.classList.contains('cnu');
            const color = isCnu ? 'var(--gold)' : 'var(--jbnu-blue)';
            
            els.cursorOut.style.width = '60px';
            els.cursorOut.style.height = '60px';
            els.cursorOut.style.borderColor = color;
            els.cursorOut.style.backgroundColor = isCnu ? 'rgba(212, 175, 55, 0.05)' : 'rgba(75, 137, 220, 0.05)';
        });

        el.addEventListener('mouseleave', () => {
            els.cursorOut.style.width = '40px';
            els.cursorOut.style.height = '40px';
            els.cursorOut.style.borderColor = 'rgba(255,255,255,0.3)';
            els.cursorOut.style.backgroundColor = 'transparent';
        });
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        win.w = window.innerWidth;
        win.h = window.innerHeight;
    });
});