/* Magnetic micro-interaction for buttons: [data-magnetic="0.3"] */
(function () {
  'use strict';
  var ZS = window.ZS, u = ZS.utils;

  ZS.register('magnetic', function () {
    if (!u.finePointer() || u.reducedMotion()) return;
    u.qsa('[data-magnetic]').forEach(function (el) {
      var s = parseFloat(el.getAttribute('data-magnetic')) || 0.3;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transition = 'transform .15s linear';
        el.style.transform = 'translate3d(' + dx * s + 'px,' + dy * s + 'px,0)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
      });
    });
  });
})();
