'use strict';

// Services coverflow carousel — big active card centred, flanking cards
// rendered as thin flat slats. Desktop/tablet-wide only; narrower viewports
// (and any environment JS doesn't run in) fall back to a plain responsive
// grid via CSS, so content always stays fully visible either way.
(function () {
    const root = document.getElementById('servicesCf');
    if (!root) return;

    const stage = root.querySelector('.cf-stage');
    const cards = Array.from(stage.querySelectorAll('.cf-card'));
    const count = cards.length;
    if (!count) return;

    const prevBtn = root.querySelector('.cf-arrow-prev');
    const nextBtn = root.querySelector('.cf-arrow-next');
    const dotsWrap = root.querySelector('.cf-dots');

    let active = cards.findIndex((c) => c.classList.contains('is-active'));
    if (active < 0) active = 0;

    const DESKTOP_MIN = 992;
    let mobile = null; // forces applyMode() to run its full setup on the first call

    function sizing() {
        return window.innerWidth < 1200
            ? { activeW: 380, activeH: 580, restW: 96, restH: 380, gap: 16 }
            : { activeW: 460, activeH: 540, restW: 120, restH: 400, gap: 20 };
    }

    // Signed distance of card `index` from `pos`, wrapped into (-count/2, count/2].
    function relOf(index, pos, n) {
        let rel = (((index - pos) % n) + n) % n;
        if (rel > n / 2) rel -= n;
        return rel;
    }

    // Horizontal offset from centre for a given signed distance.
    function xForRel(rel, s) {
        const ar = Math.abs(rel);
        const c1 = s.activeW / 2 + s.gap + s.restW / 2;
        const pitch = s.restW + s.gap;
        const mag = ar <= 1 ? ar * c1 : c1 + (ar - 1) * pitch;
        return (rel < 0 ? -1 : 1) * mag;
    }

    // How many slats stay fully visible each side before fading at the seam.
    const R = Math.max(1, Math.min(3, Math.floor(count / 2) - (count % 2 === 0 ? 1 : 0)));

    function buildDots() {
        dotsWrap.innerHTML = '';
        cards.forEach((_, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'cf-dot' + (i === active ? ' is-active' : '');
            b.setAttribute('role', 'tab');
            b.setAttribute('aria-label', 'Go to service ' + (i + 1));
            b.addEventListener('click', () => setActive(i));
            dotsWrap.appendChild(b);
        });
    }

    function updateDots() {
        Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('is-active', i === active));
    }

    function layout() {
        const s = sizing();
        stage.style.height = Math.max(s.activeH, s.restH) + 'px';

        cards.forEach((card, i) => {
            const rel = relOf(i, active, count);
            const ar = Math.abs(rel);
            card.classList.toggle('is-active', ar === 0);

            const blend = Math.min(ar, 1);
            const width = s.activeW + (s.restW - s.activeW) * blend;
            const height = s.activeH + (s.restH - s.activeH) * blend;
            const x = xForRel(rel, s);
            const opacity = ar <= R ? 1 : ar >= R + 1 ? 0 : 1 - (ar - R);

            card.style.width = width + 'px';
            card.style.height = height + 'px';
            card.style.transform = 'translate(-50%, -50%) translateX(' + x + 'px)';
            card.style.opacity = String(opacity);
            card.style.zIndex = String(Math.round(1000 - ar * 100));
            card.style.pointerEvents = ar >= R + 1 ? 'none' : 'auto';
        });

        updateDots();
    }

    function clearInline() {
        cards.forEach((card) => { card.style.cssText = ''; });
        stage.style.height = '';
    }

    function setActive(i) {
        active = ((i % count) + count) % count;
        if (mobile) { updateDots(); return; }
        layout();
    }

    function applyMode() {
        const nowMobile = window.innerWidth < DESKTOP_MIN;
        if (nowMobile !== mobile) {
            mobile = nowMobile;
            root.classList.toggle('cf-mobile', mobile);
            root.classList.toggle('cf-ready', !mobile);
            if (mobile) clearInline();
        }
        if (!mobile) layout();
    }

    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            if (mobile) return;
            setActive(i);
        });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => setActive(active - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => setActive(active + 1));

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', (e) => {
        if (mobile) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(active - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); setActive(active + 1); }
    });

    // Basic swipe support
    let touchX = null;
    stage.addEventListener('touchstart', (e) => {
        if (mobile) return;
        touchX = e.touches[0].clientX;
    }, { passive: true });
    stage.addEventListener('touchend', (e) => {
        if (mobile || touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) setActive(active + (dx < 0 ? 1 : -1));
        touchX = null;
    });

    buildDots();
    applyMode();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(applyMode, 150);
    });
})();
