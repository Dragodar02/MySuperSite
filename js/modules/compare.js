/* High-poly / low-poly comparison slider.
   Markup: .compare[data-compare] > .compare__top, input.compare__range, .compare__handle
   Pointer drag (mouse instant; touch only after horizontal intent so page scroll still works),
   keyboard via the hidden range input. */
(function () {
  'use strict';
  var ZS = window.ZS, u = ZS.utils;

  function init(root) {
    var range = u.qs('.compare__range', root);
    var labels = (root.getAttribute('data-labels') || 'High|Low').split('|');
    var pos = parseFloat(range.value) || 50;

    var set = function (v) {
      pos = u.clamp(v, 0, 100);
      root.style.setProperty('--pos', pos + '%');
      range.value = Math.round(pos);
      range.setAttribute('aria-valuetext', Math.round(pos) + '% ' + labels[0] + ', ' + (100 - Math.round(pos)) + '% ' + labels[1]);
    };
    var fromEvent = function (e) { var r = root.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100; };

    range.addEventListener('input', function () { set(parseFloat(range.value)); });

    var start = null, dragging = false;
    root.addEventListener('pointerdown', function (e) {
      start = { x: e.clientX, y: e.clientY, id: e.pointerId, type: e.pointerType };
      if (e.pointerType === 'mouse') { dragging = true; root.setPointerCapture(e.pointerId); root.classList.add('is-dragging'); set(fromEvent(e)); }
    });
    root.addEventListener('pointermove', function (e) {
      if (!start) return;
      if (!dragging) {
        var dx = Math.abs(e.clientX - start.x), dy = Math.abs(e.clientY - start.y);
        if (dx > 6 && dx > dy) { dragging = true; try { root.setPointerCapture(e.pointerId); } catch (err) {} root.classList.add('is-dragging'); }
        else if (dy > 6) { start = null; return; }
      }
      if (dragging) set(fromEvent(e));
    });
    var end = function (e) {
      if (start && !dragging && e && e.type === 'pointerup' && start.type !== 'mouse') set(fromEvent(e)); // tap to jump
      start = null; dragging = false; root.classList.remove('is-dragging');
    };
    root.addEventListener('pointerup', end);
    root.addEventListener('pointercancel', end);

    set(pos);

    // Intro sweep the first time it enters the viewport
    if (!u.reducedMotion()) {
      u.inView([root], function () {
        var t0 = performance.now(), dur = 1600, base = pos;
        (function tick(t) {
          if (dragging) return;
          var p = Math.min(1, (t - t0) / dur);
          set(base + Math.sin(p * Math.PI * 2) * 22 * (1 - p));
          if (p < 1) requestAnimationFrame(tick); else set(base);
        })(t0);
      });
    }
  }

  ZS.register('compare', function () { u.qsa('[data-compare]').forEach(init); });
})();
