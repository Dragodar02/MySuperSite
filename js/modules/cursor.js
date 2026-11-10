/* Subtle custom cursor: exact dot + lerped ring, hover + label states. */
(function () {
  'use strict';
  var ZS = window.ZS, u = ZS.utils;

  ZS.register('cursor', function () {
    var root = u.qs('.cursor');
    if (!root || !u.finePointer()) return;
    var dot = u.qs('.cursor__dot', root), ring = u.qs('.cursor__ring', root), label = u.qs('.cursor__label', root);
    document.documentElement.classList.add('has-cursor');

    var x = -100, y = -100, rx = x, ry = y, raf = null, k = u.reducedMotion() ? 1 : 0.18;
    var loop = function () {
      rx = u.lerp(rx, x, k); ry = u.lerp(ry, y, k);
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      raf = Math.abs(rx - x) + Math.abs(ry - y) > 0.1 ? requestAnimationFrame(loop) : null;
    };
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      root.classList.remove('is-hidden');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener('pointerleave', function () { root.classList.add('is-hidden'); });

    var interactive = 'a, button, [role="tab"], input, textarea, select, label, [data-cursor]';
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest(interactive);
      if (!t) { root.classList.remove('is-hover', 'is-label'); return; }
      var text = t.getAttribute('data-cursor');
      if (text) { label.textContent = text; root.classList.add('is-label'); root.classList.remove('is-hover'); }
      else { root.classList.add('is-hover'); root.classList.remove('is-label'); }
    });
  });
})();
