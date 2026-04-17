/*!
 * QND Lab — GSAP animations
 * GSAP 3 + ScrollTrigger
 * Respects prefers-reduced-motion; degrades gracefully to static layout.
 */
(function () {
  'use strict';

  /* Register ScrollTrigger plugin */
  gsap.registerPlugin(ScrollTrigger);

  /* Honour system accessibility preference */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  /* ──────────────────────────────────────────────────────────────────────
     HERO ENTRANCE  (page-load, not scroll-triggered)
     Looks for .js-hero on the first section; animates its labelled children.
  ────────────────────────────────────────────────────────────────────── */
  const heroSection = document.querySelector('.js-hero');
  if (heroSection) {
    const super_  = heroSection.querySelector('.js-hero-super');
    const heading = heroSection.querySelector('.js-hero-heading');
    const body_   = heroSection.querySelector('.js-hero-body');
    const ctas    = heroSection.querySelector('.js-hero-ctas');
    const indic   = heroSection.querySelector('.js-scroll-indicator');

    const els = [super_, heading, body_, ctas].filter(Boolean);

    /* Set invisible before first paint */
    gsap.set(els, { opacity: 0, y: 22 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (super_)  tl.to(super_,  { opacity: 1, y: 0, duration: 0.55 }, 0.08);
    if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.70 }, 0.22);
    if (body_)   tl.to(body_,   { opacity: 1, y: 0, duration: 0.60 }, 0.42);
    if (ctas)    tl.to(ctas,    { opacity: 1, y: 0, duration: 0.50 }, 0.58);

    /* Scroll indicator: fade in then float */
    if (indic) {
      gsap.set(indic, { opacity: 0, y: 0 });
      tl.to(indic, { opacity: 0.3, duration: 0.4 }, 0.9);
      /* Continuous bob — starts after timeline */
      gsap.to(indic, {
        y: 7,
        duration: 1.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      });
    }
  }

  /* ──────────────────────────────────────────────────────────────────────
     FADE UP  — generic scroll-triggered reveal
     Add class .js-fade-up to any element.
  ────────────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.js-fade-up').forEach(function (el) {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.72,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });

  /* ──────────────────────────────────────────────────────────────────────
     STAGGER  — reveals direct children one by one
     Add class .js-stagger to the grid / list container.
  ────────────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.js-stagger').forEach(function (container) {
    var items = Array.from(container.children);
    gsap.fromTo(
      items,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.60,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: container,
          start: 'top 86%',
          once: true,
        },
      }
    );
  });

  /* ──────────────────────────────────────────────────────────────────────
     SLIDE LEFT / RIGHT  — for alternating two-column research theme panels
  ────────────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.js-slide-left').forEach(function (el) {
    gsap.fromTo(
      el,
      { opacity: 0, x: -36 },
      {
        opacity: 1,
        x: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });

  gsap.utils.toArray('.js-slide-right').forEach(function (el) {
    gsap.fromTo(
      el,
      { opacity: 0, x: 36 },
      {
        opacity: 1,
        x: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });

  /* ──────────────────────────────────────────────────────────────────────
     CARD HOVER LIFT
     Applied to every .card and .card-dark on the page.
  ────────────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.card, .card-dark').forEach(function (card) {
    /* Only desktop — skip on touch devices */
    if (window.matchMedia('(hover: hover)').matches) {
      card.addEventListener('mouseenter', function () {
        gsap.to(card, { y: -5, duration: 0.22, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { y: 0, duration: 0.28, ease: 'power2.inOut' });
      });
    }
  });

  /* ──────────────────────────────────────────────────────────────────────
     SECTION LABEL COUNTER ANIMATION  (research "Theme 01", "Theme 02" …)
     Pulses in from opacity 0 with a tiny blur → sharp reveal.
  ────────────────────────────────────────────────────────────────────── */
  gsap.utils.toArray('.js-theme-label').forEach(function (el) {
    gsap.fromTo(
      el,
      { opacity: 0, filter: 'blur(4px)' },
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      }
    );
  });

  /* ──────────────────────────────────────────────────────────────────────
     NAV BORDER  — show a subtle bottom separator after first scroll
  ────────────────────────────────────────────────────────────────────── */
  var header = document.querySelector('header');
  if (header) {
    var borderAdded = false;
    ScrollTrigger.create({
      start: 'top -1px',
      onToggle: function (self) {
        if (self.isActive && !borderAdded) {
          header.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
          borderAdded = true;
        } else if (!self.isActive) {
          header.style.borderBottom = '';
          borderAdded = false;
        }
      },
    });
  }

})();
