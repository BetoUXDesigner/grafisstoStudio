/* ============================================================
   GRAFISSTO STUDIO — FOUNDER PAGE JS
   Skills animadas · Timeline IntersectionObserver · Hero entrada
   ============================================================ */

(function () {
  'use strict';

  // ── HERO ENTRANCE ────────────────────────────────────────────
  function initFounderHero() {
    if (typeof gsap === 'undefined') return;

    const nameLines = document.querySelectorAll('.founder-hero-name .name-line span');
    const eyebrow   = document.querySelector('.founder-hero-eyebrow span');
    const roles     = document.querySelectorAll('.founder-hero-roles .role');
    const ctas      = document.querySelector('.founder-hero-ctas');
    const photo     = document.querySelector('.founder-hero-photo');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.3 });

    tl
      .fromTo(photo,
        { scale: 1.08, filter: 'brightness(0)' },
        { scale: 1, filter: 'brightness(0.75) grayscale(1) contrast(1.15)', duration: 1.2 },
        0
      )
      .fromTo(eyebrow,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.3
      )
      .fromTo(nameLines,
        { y: '110%' },
        { y: '0%', duration: 1, stagger: 0.1 },
        0.4
      )
      .fromTo(roles,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
        0.8
      )
      .fromTo(ctas,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        1.1
      );
  }

  // ── SKILLS BARS — IntersectionObserver ──────────────────────
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar    = entry.target;
          const target = bar.dataset.target || '0';

          if (typeof gsap !== 'undefined') {
            gsap.to(bar, {
              width: target + '%',
              duration: 1.4,
              ease: 'power3.out',
              delay: 0.1,
            });
          } else {
            bar.style.transition = 'width 1.4s cubic-bezier(0.16,1,0.3,1)';
            bar.style.width = target + '%';
          }

          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach((bar) => observer.observe(bar));
  }

  // ── TIMELINE — IntersectionObserver ─────────────────────────
  function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, i * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach((item) => observer.observe(item));
  }

  // ── SCROLL REVEALS ───────────────────────────────────────────
  function initReveal() {
    if (typeof gsap === 'undefined') return;

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
          delay: (i % 3) * 0.08,
        }
      );
    });
  }

  // ── LENIS FOR FOUNDER PAGE ───────────────────────────────────
  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', () => ScrollTrigger.update());
      gsap.ticker.lagSmoothing(0);
    }

    // Smooth anchors
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      });
    });
  }

  // ── NAV SCROLL ───────────────────────────────────────────────
  function initNav() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      if (!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── CURSOR ───────────────────────────────────────────────────
  function initCursor() {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let cx = 0, cy = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => { cx = e.clientX; cy = e.clientY; });
    document.addEventListener('touchstart', () => {
      cursor.style.display = 'none';
      follower.style.display = 'none';
    }, { once: true });

    (function loop() {
      fx += (cx - fx) * 0.12;
      fy += (cy - fy) * 0.12;
      cursor.style.left   = cx + 'px';
      cursor.style.top    = cy + 'px';
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .skill-item, [tabindex="0"]').forEach((el) => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('is-hovering'); follower.classList.add('is-hovering'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('is-hovering'); follower.classList.remove('is-hovering'); });
    });
  }

  // ── INIT ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initFounderHero();
    initSkillBars();
    initTimeline();
    initReveal();
    initLenis();
    initNav();
    initCursor();

    // Hamburger
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isOpen);
        navLinks.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
          Object.assign(navLinks.style, {
            flexDirection: 'column', position: 'absolute',
            top: '100%', left: '0', right: '0',
            background: 'rgba(10,10,10,0.98)',
            padding: '2rem', gap: '1.5rem',
            borderBottom: '2px solid var(--c-red)',
          });
        }
      });
    }
  });

})();
