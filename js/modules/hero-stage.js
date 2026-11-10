/* Hero stage — three interchangeable media modes, chosen by data attributes on .hero:
   1) data-video="assets/video/turntable.mp4"  -> muted looping turntable video
   2) data-model="assets/models/char.glb"      -> interactive Three.js GLB viewer (drag to rotate)
   3) default                                   -> Three.js reactive point-field behind the poster render
   Everything degrades to the static poster image if WebGL / network is unavailable. */
(function () {
  'use strict';
  var ZS = window.ZS, u = ZS.utils;

  function hud(hero) {
    var xy = u.qs('[data-hud-xy]', hero);
    var subj = u.qs('.hero__subject', hero);
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    var loop = function () {
      cx = u.lerp(cx, tx, 0.08); cy = u.lerp(cy, ty, 0.08);
      if (subj && !u.reducedMotion()) subj.style.transform = (getComputedStyle(subj).right === '50%' ? 'translateX(50%) ' : '') + 'translate3d(' + (cx * -14) + 'px,' + (cy * -10) + 'px,0)';
      raf = Math.abs(cx - tx) + Math.abs(cy - ty) > 0.001 ? requestAnimationFrame(loop) : null;
    };
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width * 2 - 1; ty = (e.clientY - r.top) / r.height * 2 - 1;
      if (xy) xy.textContent = 'X ' + tx.toFixed(3) + '  Y ' + (-ty).toFixed(3);
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    return function () { return { x: tx, y: ty }; };
  }

  function mountVideo(hero, stage, src) {
    var v = document.createElement('video');
    v.className = 'hero__video';
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = !u.reducedMotion();
    v.setAttribute('aria-hidden', 'true');
    v.preload = 'metadata';
    var poster = hero.getAttribute('data-poster'); if (poster) v.poster = poster;
    v.src = src;
    v.addEventListener('canplay', function () { v.classList.add('is-ready'); hero.classList.add('has-media'); }, { once: true });
    stage.appendChild(v);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !u.reducedMotion()) v.play().catch(function () {}); else v.pause(); }); }).observe(hero);
    }
  }

  function webglOK() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  }

  async function mountThree(hero, stage, pointer, modelUrl) {
    var THREE = await import('three');
    var canvas = document.createElement('canvas');
    canvas.className = 'hero__canvas';
    canvas.setAttribute('aria-hidden', 'true');
    stage.appendChild(canvas);

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 1.2, 7);

    // Reactive point field (wireframe-grid feel)
    var N = 90, geo = new THREE.BufferGeometry(), pos = new Float32Array(N * N * 3), k = 0;
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) { pos[k++] = (i / (N - 1) - 0.5) * 16; pos[k++] = 0; pos[k++] = (j / (N - 1) - 0.5) * 16; }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var uniforms = { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uColor: { value: new THREE.Color('#d4ff3a') } };
    var mat = new THREE.ShaderMaterial({
      uniforms: uniforms, transparent: true, depthWrite: false,
      vertexShader: 'uniform float uTime; uniform vec2 uMouse; varying float vA;' +
        'void main(){ vec3 p = position; float d = distance(p.xz, uMouse * 6.0);' +
        'p.y = sin(p.x*.6+uTime*.6)*.18 + cos(p.z*.5+uTime*.4)*.18 + exp(-d*d*.08)*.9;' +
        'vec4 mv = modelViewMatrix*vec4(p,1.); gl_PointSize = 2.2*(6./-mv.z); vA = clamp(1.-length(p.xz)/8.,0.,1.)*(.25+p.y*.6);' +
        'gl_Position = projectionMatrix*mv; }',
      fragmentShader: 'uniform vec3 uColor; varying float vA; void main(){ float r = length(gl_PointCoord-.5); if(r>.5) discard; gl_FragColor = vec4(uColor, vA*(1.-r*2.)); }'
    });
    var field = new THREE.Points(geo, mat);
    field.position.y = -1.6;
    scene.add(field);

    var model = null, dragX = 0, rotY = 0;
    if (modelUrl) {
      var mod = await import('three/addons/loaders/GLTFLoader.js');
      scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.2));
      var key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 5); scene.add(key);
      var rim = new THREE.DirectionalLight(0xd4ff3a, 2.5); rim.position.set(-4, 2, -4); scene.add(rim);
      new mod.GLTFLoader().load(modelUrl, function (g) {
        model = g.scene;
        var box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
        var s = 3.2 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(s); model.position.sub(c.multiplyScalar(s)); model.position.y += 0.2;
        scene.add(model);
        hero.classList.add('has-media');
        hero.setAttribute('data-cursor', 'Drag');
      });
      var down = null;
      hero.addEventListener('pointerdown', function (e) { if (e.target.closest('a,button')) return; down = e.clientX; });
      window.addEventListener('pointermove', function (e) { if (down !== null) { dragX += (e.clientX - down) * 0.01; down = e.clientX; } });
      window.addEventListener('pointerup', function () { down = null; });
    }

    var resize = function () {
      var w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize(); window.addEventListener('resize', resize);

    var running = true, clock = new THREE.Clock();
    var frame = function () {
      if (!running) return;
      var t = clock.getElapsedTime(), p = pointer();
      uniforms.uTime.value = t;
      uniforms.uMouse.value.lerp(new THREE.Vector2(p.x, p.y), 0.06);
      camera.position.x = u.lerp(camera.position.x, p.x * 0.6, 0.04);
      camera.position.y = u.lerp(camera.position.y, 1.2 - p.y * 0.3, 0.04);
      camera.lookAt(0, 0, 0);
      if (model) { rotY = u.lerp(rotY, dragX, 0.1); model.rotation.y = rotY + (u.reducedMotion() ? 0 : t * 0.25); }
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    };
    var setRunning = function (on) { if (on && !running) { running = true; clock.getDelta(); requestAnimationFrame(frame); } else if (!on) running = false; };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { setRunning(es[0].isIntersecting && !document.hidden); }).observe(hero);
    document.addEventListener('visibilitychange', function () { setRunning(!document.hidden); });
    requestAnimationFrame(function () { canvas.classList.add('is-ready'); frame(); });
  }

  ZS.register('heroStage', function () {
    var hero = u.qs('.hero[data-stage]');
    if (!hero) return;
    var stage = u.qs('.hero__stage', hero);
    var pointer = hud(hero);
    var video = hero.getAttribute('data-video'), model = hero.getAttribute('data-model');
    var save = navigator.connection && navigator.connection.saveData;
    if (video) { mountVideo(hero, stage, video); return; }
    if (!webglOK() || save || u.reducedMotion()) return;
    mountThree(hero, stage, pointer, model).catch(function (err) { console.info('[hero] WebGL layer skipped:', err && err.message); });
  });
})();
