/* Accessible tab groups: viewport modes (Beauty / Wire / Topology) and PBR maps. */
(function () {
  'use strict';
  var ZS = window.ZS, u = ZS.utils;

  /* Generic roving-tabindex tablist with sliding pill. */
  ZS.tabs = function (list, itemSel, onChange) {
    var items = u.qsa(itemSel, list);
    var pill = u.qs('.segmented__pill', list);
    var movePill = function (btn) {
      if (!pill) return;
      pill.style.width = btn.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    };
    var select = function (btn, focus) {
      items.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });
      movePill(btn);
      if (focus) btn.focus();
      onChange(btn);
    };
    items.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = items[(i + 1) % items.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
        if (e.key === 'Home') n = items[0];
        if (e.key === 'End') n = items[items.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    var initial = items.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0] || items[0];
    if (initial) { requestAnimationFrame(function () { movePill(initial); }); select(initial); }
    window.addEventListener('resize', function () {
      var cur = items.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0];
      if (cur) movePill(cur);
    });
  };

  ZS.register('viewModes', function () {
    u.qsa('[data-modes]').forEach(function (list) {
      var view = u.qs(list.getAttribute('data-modes'));
      if (!view) return;
      var labelEl = u.qs('[data-mode-label]', view);
      ZS.tabs(list, '[data-mode]', function (btn) {
        var mode = btn.getAttribute('data-mode');
        u.qsa('[data-layer]', view).forEach(function (l) { l.classList.toggle('is-hidden', l.getAttribute('data-layer') !== mode); });
        if (labelEl) labelEl.textContent = btn.textContent.trim();
      });
    });
  });

  ZS.register('pbrTabs', function () {
    u.qsa('[data-pbr]').forEach(function (root) {
      var list = u.qs('[role="tablist"]', root);
      var badge = u.qs('.pbr__badge', root);
      ZS.tabs(list, '[data-map]', function (btn) {
        var map = btn.getAttribute('data-map');
        u.qsa('[data-map-img]', root).forEach(function (img) { img.classList.toggle('is-hidden', img.getAttribute('data-map-img') !== map); });
        if (badge) badge.textContent = btn.getAttribute('data-badge') || map;
      });
    });
  });
})();
