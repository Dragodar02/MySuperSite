/* Small UI behaviours: nav, filters, counters, clipboard, pipeline focus, contact form, year. */
(function () {
  'use strict';
  var ZS = window.ZS, u = ZS.utils;

  ZS.register('nav', function () {
    var nav = u.qs('.nav'); if (!nav) return;
    var toggle = u.qs('.nav__toggle', nav), last = 0;
    var onScroll = function () {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 24);
      if (!nav.classList.contains('is-open')) nav.classList.toggle('is-hidden', y > last && y > 400);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    if (toggle) {
      var close = function () { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
      toggle.addEventListener('click', function () {
        var open = !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open));
      });
      u.qsa('.nav__links a', nav).forEach(function (a) { a.addEventListener('click', close); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
    // Active section highlight
    var links = u.qsa('.nav__links a[href^="#"]', nav);
    if (!links.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = u.qs(a.getAttribute('href')); if (s) io.observe(s); });
  });

  ZS.register('filters', function () {
    u.qsa('[data-filters]').forEach(function (bar) {
      var grid = u.qs(bar.getAttribute('data-filters')); if (!grid) return;
      var chips = u.qsa('[data-filter]', bar), items = u.qsa('[data-cat]', grid);
      chips.forEach(function (c) {
        c.addEventListener('click', function () {
          var f = c.getAttribute('data-filter');
          chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
          items.forEach(function (it) { it.classList.toggle('is-filtered', f !== 'all' && it.getAttribute('data-cat').split(' ').indexOf(f) < 0); });
        });
      });
    });
  });

  ZS.register('counters', function () {
    var els = u.qsa('[data-count]'); if (!els.length) return;
    var run = function (el) {
      var end = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suffix') || '';
      if (u.reducedMotion()) { el.textContent = end + suf; return; }
      var t0 = performance.now(), dur = 1400;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(end * e) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    };
    u.inView(els, run);
  });

  ZS.register('clipboard', function () {
    u.qsa('[data-copy]').forEach(function (el) {
      var label = u.qs('[data-copy-label]', el), orig = label ? label.textContent : '';
      el.addEventListener('click', function (e) {
        if (!navigator.clipboard) return; // falls back to mailto: href
        e.preventDefault();
        navigator.clipboard.writeText(el.getAttribute('data-copy')).then(function () {
          el.classList.add('is-copied'); if (label) label.textContent = 'Copied ✓';
          setTimeout(function () { el.classList.remove('is-copied'); if (label) label.textContent = orig; }, 1800);
        }).catch(function () { window.location.href = el.href; });
      });
    });
  });

  ZS.register('pipeline', function () {
    var tools = u.qs('.tools'); if (!tools) return;
    u.qsa('.tool', tools).forEach(function (t) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        t.style.setProperty('--glow-x', (e.clientX - r.left) + 'px');
        t.style.setProperty('--glow-y', (e.clientY - r.top) + 'px');
      });
    });
    var stages = u.qsa('[data-stage-tools]');
    var light = function (stage) {
      var ids = stage ? stage.getAttribute('data-stage-tools').split(' ') : [];
      stages.forEach(function (s) { s.classList.toggle('is-active', s === stage); });
      tools.classList.toggle('is-focusing', !!stage);
      u.qsa('[data-tool]', tools).forEach(function (t) { t.classList.toggle('is-lit', ids.indexOf(t.getAttribute('data-tool')) > -1); });
    };
    stages.forEach(function (s) {
      s.addEventListener('pointerenter', function () { light(s); });
      s.addEventListener('focus', function () { light(s); });
      s.addEventListener('click', function () { light(s.classList.contains('is-active') ? null : s); });
    });
    var wrap = u.qs('.pipeline');
    if (wrap) { wrap.addEventListener('pointerleave', function () { light(null); }); wrap.addEventListener('focusout', function (e) { if (!wrap.contains(e.relatedTarget)) light(null); }); }
  });

  ZS.register('contactForm', function () {
    u.qsa('[data-mailto-form]').forEach(function (form) {
      var note = u.qs('.form__note', form);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        var d = new FormData(form);
        var subject = 'Project inquiry — ' + (d.get('type') || 'General') + ' — ' + d.get('name');
        var body = d.get('message') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')';
        window.location.href = 'mailto:' + form.getAttribute('data-mailto-form') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        if (note) note.textContent = 'Opening your email app…';
      });
    });
  });

  ZS.register('year', function () { u.qsa('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); }); });
})();
