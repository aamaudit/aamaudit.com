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

// Scroll fade-in via IntersectionObserver
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.14 });
    fadeEls.forEach(el => obs.observe(el));
}

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
