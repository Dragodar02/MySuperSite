/* Core utilities + tiny module registry (no build step needed). */
(function () {
  'use strict';
  var ZS = (window.ZS = window.ZS || { modules: [] });
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = window.matchMedia('(pointer: fine)');

  ZS.utils = {
    qs: function (sel, ctx) { return (ctx || document).querySelector(sel); },
    qsa: function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); },
    clamp: function (v, a, b) { return Math.min(b, Math.max(a, v)); },
    lerp: function (a, b, t) { return a + (b - a) * t; },
    reducedMotion: function () { return mqReduce.matches; },
    finePointer: function () { return mqFine.matches; },
    hasGSAP: function () { return !!(window.gsap && window.ScrollTrigger); },
    /* Calls cb(entry) once when el enters viewport. */
    inView: function (els, cb, opts) {
      if (!('IntersectionObserver' in window)) { els.forEach(function (el) { cb(el); }); return; }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } });
      }, Object.assign({ rootMargin: '0px 0px -12% 0px', threshold: 0.01 }, opts || {}));
      els.forEach(function (el) { io.observe(el); });
      return io;
    }
  };

  /* Register a feature module: ZS.register('name', function init(){...}) */
  ZS.register = function (name, init) { ZS.modules.push({ name: name, init: init }); };
})();
