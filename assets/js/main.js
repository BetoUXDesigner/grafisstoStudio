/* ============================================================
   GRAFISSTO STUDIO — MAIN JS
   Loader · Lenis · GSAP global · Cursor · Nav · Reveals · Form
   ============================================================ */

(function () {
  'use strict';

  // ── REGISTER GSAP PLUGINS ───────────────────────────────────
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof TextPlugin !== 'undefined') {
      gsap.registerPlugin(TextPlugin);
    }
  }

  // ── LENIS SMOOTH SCROLL ─────────────────────────────────────
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
    });

    // RAF loop
    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ({ progress }) => {
      ScrollTrigger.update();
      // Fire scroll event for hero.js
      window.dispatchEvent(new CustomEvent('grafisstoScroll', {
        detail: { progress }
      }));
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ── CUSTOM CURSOR ────────────────────────────────────────────
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && follower) {
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    // Smooth follower loop
    (function followCursor() {
      followerX += (cursorX - followerX) * 0.12;
      followerY += (cursorY - followerY) * 0.12;

      cursor.style.left   = cursorX + 'px';
      cursor.style.top    = cursorY + 'px';
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';

      requestAnimationFrame(followCursor);
    })();

    // Hover state
    const hoverTargets = document.querySelectorAll(
      'a, button, .vertiente-card, .proyecto-card, input, textarea, select, [tabindex="0"]'
    );
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        follower.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        follower.classList.remove('is-hovering');
      });
    });

    // Hide on mobile
    document.addEventListener('touchstart', () => {
      cursor.style.display = 'none';
      follower.style.display = 'none';
    }, { once: true });
  }

  // ── LOADER ───────────────────────────────────────────────────
  const loader    = document.getElementById('loader');
  const loaderFill = document.getElementById('loader-fill');
  const loaderNum  = document.getElementById('loader-num');

  function runLoader() {
    if (!loader) {
      window.dispatchEvent(new Event('grafisstoLoaded'));
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      // Non-linear: fast at start, slow near 90, burst to 100
      const increment = progress < 60 ? 3 : progress < 85 ? 1.2 : progress < 95 ? 0.4 : 2;
      progress = Math.min(100, progress + increment);

      if (loaderFill) loaderFill.style.width = progress + '%';
      if (loaderNum)  loaderNum.textContent  = Math.floor(progress) + '%';

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(dismissLoader, 200);
      }
    }, 28);
  }

  function dismissLoader() {
    if (!loader) return;
    const tl = gsap.timeline({
      onComplete: () => {
        loader.style.display = 'none';
        window.dispatchEvent(new Event('grafisstoLoaded'));
        revealHero();
      },
    });

    tl.to(loader, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.8,
      ease: 'power3.inOut',
    });
  }

  // ── HERO REVEAL ANIMATION ────────────────────────────────────
  function revealHero() {
    const heroLabel = document.getElementById('hero-label');
    const heroLines = document.querySelectorAll('.hero-title .line span');
    const heroSub   = document.getElementById('hero-sub');
    const heroScroll = document.getElementById('hero-scroll');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
      .to(heroLabel, { opacity: 1, y: 0, duration: 0.6 }, 0)
      .to(heroLines, {
        y: '0%',
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
      }, 0.2)
      .to(heroSub,    { opacity: 1, duration: 0.7 }, 0.8)
      .to(heroScroll, { opacity: 1, duration: 0.5 }, 1.1);
  }

  // ── NAV BEHAVIOR ─────────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger menu
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(10,10,10,0.98)';
      navLinks.style.padding = '2rem';
      navLinks.style.gap = '1.5rem';
      navLinks.style.borderBottom = '2px solid var(--c-red)';
      hamburger.setAttribute('aria-expanded', !isOpen);
    });

    // Close on link click only on mobile
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Clean up inline styles when resizing back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.style.display = '';
        navLinks.style.flexDirection = '';
        navLinks.style.position = '';
        navLinks.style.top = '';
        navLinks.style.left = '';
        navLinks.style.right = '';
        navLinks.style.background = '';
        navLinks.style.padding = '';
        navLinks.style.gap = '';
        navLinks.style.borderBottom = '';
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── SCROLL REVEAL — .reveal elements ─────────────────────────
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }

  // ── SECTION NUMBERS PARALLAX ─────────────────────────────────
  function initSectionNums() {
    document.querySelectorAll('.section-num').forEach((num) => {
      gsap.to(num, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: num.closest('section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  // ── GLITCH LOOP ──────────────────────────────────────────────
  function initGlitch() {
    const glitchEls = document.querySelectorAll('.glitch');
    glitchEls.forEach((el) => {
      setInterval(() => {
        if (Math.random() > 0.85) {
          el.style.textShadow = `
            ${(Math.random() - 0.5) * 8}px 0 #00ffff,
            ${(Math.random() - 0.5) * 8}px 0 var(--c-red)
          `;
          setTimeout(() => { el.style.textShadow = 'none'; }, 80);
        }
      }, 1800);
    });
  }

  // ── FUNDADOR IMAGE PARALLAX ──────────────────────────────────
  function initFundadorParallax() {
    const img = document.querySelector('.fundador-img');
    if (!img) return;

    gsap.to(img, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '#fundador',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // ── CONTACT FORM ─────────────────────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const btnText = document.getElementById('btn-submit-text');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (btnText) btnText.textContent = 'Enviando…';

      try {
        const data = new FormData(form);
        const res  = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          if (btnText) btnText.textContent = '¡Enviado! Te contactaré pronto.';
          form.reset();
          gsap.fromTo('#btn-submit', { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
        } else {
          if (btnText) btnText.textContent = 'Error — escríbeme directo a grafissto@gmail.com';
        }
      } catch {
        if (btnText) btnText.textContent = 'Error de red — grafissto@gmail.com';
      }
    });
  }

  // ── NAV ACTIVE LINK ──────────────────────────────────────────
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--c-white)'
              : '';
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach((s) => observer.observe(s));
  }

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.6 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── HERO VIDEO PLAYLIST ──────────────────────────────────────
  // neoT_noche → neoT_dia → neoT_noche → … con crossfade 1.8s
  function initHeroVideos() {
    const vid1 = document.getElementById('hero-vid-1'); // neoT_noche
    const vid2 = document.getElementById('hero-vid-2'); // neoT_dia
    if (!vid1 || !vid2) return;

    const PLAYBACK_RATE = 0.65; // 65% — reproducción lenta y cinematográfica
    const CROSSFADE_OFFSET = 1.8; // segundos antes del final para iniciar fade

    vid1.playbackRate = PLAYBACK_RATE;
    vid2.playbackRate = PLAYBACK_RATE;

    // Tracks which is active: 1 = vid1 active, 2 = vid2 active
    let active = 1;
    let crossfading = false;

    function crossfadeTo(incoming, outgoing) {
      if (crossfading) return;
      crossfading = true;

      // Start the incoming video from the beginning
      incoming.currentTime = 0;
      incoming.play().catch(() => {});

      // Swap classes — CSS handles the 1.8s opacity transition
      incoming.classList.add('hero-video--active');
      outgoing.classList.remove('hero-video--active');

      // After fade completes, pause outgoing & reset flag
      setTimeout(() => {
        outgoing.pause();
        crossfading = false;
      }, 2000); // slightly more than the CSS transition
    }

    // Monitor timeupdate to trigger crossfade before the video ends
    function onTimeUpdate(currentVid, nextVid) {
      currentVid.addEventListener('timeupdate', function handler() {
        const remaining = currentVid.duration - currentVid.currentTime;
        if (!isNaN(remaining) && remaining <= CROSSFADE_OFFSET) {
          currentVid.removeEventListener('timeupdate', handler);
          active = active === 1 ? 2 : 1;
          const incoming = active === 1 ? vid1 : vid2;
          const outgoing  = active === 1 ? vid2 : vid1;
          crossfadeTo(incoming, outgoing);
          // Set up listener for the next video
          onTimeUpdate(incoming, outgoing);
        }
      });
    }

    // Kick off first video
    vid1.play().catch(() => {
      // Autoplay blocked — wait for user interaction
      document.addEventListener('click', () => { vid1.play().catch(() => {}); }, { once: true });
      document.addEventListener('touchstart', () => { vid1.play().catch(() => {}); }, { once: true });
    });

    onTimeUpdate(vid1, vid2);
  }

  // ── INIT SEQUENCE ────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for loader to finish before heavy GSAP
    window.addEventListener('grafisstoLoaded', () => {
      initReveal();
      initSectionNums();
      initFundadorParallax();
      ScrollTrigger.refresh();
    });

    runLoader();
    initGlitch();
    initContactForm();
    initActiveNav();
    initHeroVideos();
  });

})();
