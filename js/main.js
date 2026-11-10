/* Boot: run every registered module in isolation so one failure never breaks the page. */
(function () {
  'use strict';
  var boot = function () {
    (window.ZS.modules || []).forEach(function (m) {
      try { m.init(); } catch (err) { console.warn('[ZS] module "' + m.name + '" failed:', err); }
    });
    document.documentElement.classList.add('is-loaded');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
