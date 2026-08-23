'use strict';

// Sticky navbar shadow
const header = document.getElementById('site-header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    });
}

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mobileNav = document.getElementById('mobile-nav');
if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });
}

// Back to top
const btt = document.getElementById('btt');
if (btt) {
    window.addEventListener('scroll', () => {
        btt.classList.toggle('show', window.scrollY > 450);
    });
    btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Scroll fade-ins are handled by js/motion.js (Motion library, loaded via CDN).
// Failsafe: if that module fails to load (e.g. CDN offline), reveal all content
// via CSS so nothing is ever left invisible.
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!window.__motionReady) {
            document.querySelectorAll('.fade-up').forEach(el => el.classList.add('in'));
        }
    }, 1000);
});

// FAQ accordion
document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        // close all in same list
        btn.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(el => {
            el.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
    });
});
