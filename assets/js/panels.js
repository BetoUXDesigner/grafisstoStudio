/* ============================================================
   GRAFISSTO STUDIO — HORIZONTAL PANELS SCROLL
   Scroll tipo "páginas de cómic" con GSAP ScrollTrigger
   ============================================================ */

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // ── HORIZONTAL SCROLL DE PROYECTOS ─────────────────────────
  // (Removido para usar grid responsivo normal)

  // ── VERTIENTES STAGGER ENTRANCE ─────────────────────────────
  const vertienteCards = document.querySelectorAll('.vertiente-card');
  vertienteCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, x: i === 0 ? -80 : i === 2 ? 80 : 0, y: i === 1 ? 60 : 0 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#vertientes',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        delay: i * 0.15,
      }
    );
  });

})();
