/* Scroll-triggered reveals, line-split headings, stagger groups, parallax. */
(function () {
  'use strict';
  var ZS = window.ZS, u = ZS.utils;

  ZS.register('reveal', function () {
    // Stagger children inside [data-reveal-group]
    u.qsa('[data-reveal-group]').forEach(function (g) {
      var step = parseFloat(g.getAttribute('data-reveal-group')) || 0.08;
      u.qsa('[data-reveal]', g).forEach(function (el, i) { el.style.setProperty('--reveal-delay', (i * step).toFixed(2) + 's'); });
    });
    // Line delays for split headings
    u.qsa('[data-split]').forEach(function (h) {
      u.qsa('.split-line > span', h).forEach(function (s, i) { s.style.setProperty('--line-delay', (i * 0.09).toFixed(2) + 's'); });
    });

    var targets = u.qsa('[data-reveal], [data-split], .meter');
    if (u.reducedMotion()) { targets.forEach(function (el) { el.classList.add('is-in'); }); }
    else u.inView(targets, function (el) { el.classList.add('is-in'); });

    // Parallax: [data-parallax="0.15"]
    var px = u.qsa('[data-parallax]');
    if (!px.length || u.reducedMotion()) return;
    if (u.hasGSAP()) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      px.forEach(function (el) {
        var amt = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        window.gsap.fromTo(el, { yPercent: -amt * 50 }, {
          yPercent: amt * 50, ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    } else {
      var ticking = false;
      var update = function () {
        var vh = window.innerHeight;
        px.forEach(function (el) {
          var r = el.parentElement.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          var p = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
          var amt = parseFloat(el.getAttribute('data-parallax')) || 0.12;
          el.style.transform = 'translate3d(0,' + (-p * amt * 100).toFixed(2) + 'px,0)';
        });
        ticking = false;
      };
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      update();
    }
  });
})();
