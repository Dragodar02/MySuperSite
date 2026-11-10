/* Smooth scrolling (Lenis if loaded) + offset-aware anchor links. */
(function () {
  'use strict';
  var ZS = window.ZS, u = ZS.utils;

  ZS.register('smoothScroll', function () {
    var lenis = null;
    if (window.Lenis && !u.reducedMotion()) {
      lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
      if (u.hasGSAP()) {
        lenis.on('scroll', window.ScrollTrigger.update);
        window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        window.gsap.ticker.lagSmoothing(0);
      } else {
        (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
      }
    }
    ZS.lenis = lenis;

    var navH = function () { return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72; };
    ZS.scrollTo = function (target) {
      var y = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - navH() + 1;
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: u.reducedMotion() ? 'auto' : 'smooth' });
    };

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id === '#') return;
      if (id === '#top') { e.preventDefault(); ZS.scrollTo(0); return; }
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      ZS.scrollTo(el);
      if (el.hasAttribute('tabindex') || /^(A|BUTTON|INPUT)$/.test(el.tagName)) el.focus({ preventScroll: true });
      history.replaceState(null, '', id);
    });
  });
})();
