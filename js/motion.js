// Motion-powered animations (loaded via CDN as an ES module).
// If this module fails to load, main.js has a failsafe that reveals all content.
import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@13/+esm";

// Signal to main.js's failsafe that Motion is alive.
window.__motionReady = true;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = [0.16, 1, 0.3, 1]; // easeOutExpo-ish

// Motion may pass either the element or an IntersectionObserverEntry.
const toEl = (x) => (x instanceof Element ? x : x && x.target);

/* ---- Reduced motion: reveal everything instantly, no animation ---- */
if (reduceMotion) {
    document.querySelectorAll('.fade-up').forEach((el) => el.classList.add('in'));
} else {
    /* ---- Hero entrance: stagger the left column on load ---- */
    const heroKids = document.querySelectorAll('.hero-left > *');
    if (heroKids.length) {
        animate(
            heroKids,
            { opacity: [0, 1], transform: ['translateY(18px)', 'translateY(0px)'] },
            { duration: 0.6, delay: stagger(0.1, { startDelay: 0.05 }), easing: EASE }
        );
    }
    /* ---- Hero title: words emerge (scale + blur + fade) from the centre ---- */
    const titleWords = document.querySelectorAll('.hero-title .word');
    if (titleWords.length) {
        animate(
            titleWords,
            { opacity: [0, 1], scale: [0, 1], filter: ['blur(4px)', 'blur(0px)'] },
            { duration: 0.5, delay: stagger(0.03, { startDelay: 0.15, from: 'center' }), easing: EASE }
        );
    }

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        animate(
            heroVisual,
            { opacity: [0, 1], transform: ['translateY(24px) scale(0.97)', 'translateY(0px) scale(1)'] },
            { duration: 0.8, delay: 0.25, easing: EASE }
        );
    }

    /* ---- Scroll reveals: replace the old IntersectionObserver fade-ups ---- */
    inView(
        '.fade-up',
        (entry) => {
            const el = toEl(entry);
            if (!el) return;
            const delayClass = [...el.classList].find((c) => /^delay-\d$/.test(c));
            const delay = delayClass ? parseInt(delayClass.slice(6), 10) * 0.09 : 0;
            animate(
                el,
                { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] },
                { duration: 0.6, delay, easing: EASE }
            );
            el.classList.add('in');
        },
        { amount: 0.15 }
    );

    /* ---- Count-up stat numbers when they scroll into view ---- */
    const countUp = (el) => {
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        const m = el.textContent.trim().match(/^(\D*)(\d[\d,]*)(.*)$/);
        if (!m) return;
        const [, prefix, numStr, suffix] = m;
        const target = parseInt(numStr.replace(/,/g, ''), 10);
        animate(0, target, {
            duration: 1.4,
            easing: EASE,
            onUpdate: (v) => {
                el.textContent = prefix + Math.round(v) + suffix;
            },
        });
    };
    inView('.stat-num, .hero-mini-num, .dash-stat-val, .about-badge-num', (entry) => {
        const el = toEl(entry);
        if (el) countUp(el);
    });
}
