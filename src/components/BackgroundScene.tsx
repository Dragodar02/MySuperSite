import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  fieldFragmentShader,
  fieldVertexShader,
  posFragmentShader,
  simQuadVertexShader,
  skyFragmentShader,
  skyVertexShader,
  starFragmentShader,
  starVertexShader,
  velFragmentShader,
} from './scene/shaders';

// Desktop: 320 x 320 = 102,400 flowers | Mobile: 160 x 160 = 25,600 flowers
const DESKTOP_TEX_SIZE = 320;
const MOBILE_TEX_SIZE = 160;

// Extended foreground Z-near (+12.4 right under camera at z = 13.0) so bottom half of screen is 100% lush
const FIELD_HALF_WIDTH = 52;
const FIELD_Z_FAR = -66;
const FIELD_Z_NEAR = 12.4;
const FIELD_DEPTH = FIELD_Z_NEAR - FIELD_Z_FAR; // 78.4
const VORTEX_RADIUS_PX = 205; // ~150-250px screen-space vortex radius

interface SceneProps {
  isMobile: boolean;
  reducedMotion: boolean;
}

function SkyAndStars({ reducedMotion }: { reducedMotion: boolean }) {
  const skyMatRef = useRef<THREE.ShaderMaterial>(null);
  const starMatRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const skyUniforms = useMemo(
    () => ({
      uPitchShift: { value: 0 },
    }),
    []
  );

  const { starPositions, starSizes, starPhases, starSeeds } = useMemo(() => {
    const count = 650;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 185;
      positions[i * 3 + 1] = 4.5 + Math.pow(Math.random(), 0.85) * 44;
      positions[i * 3 + 2] = -26 - Math.random() * 72;

      sizes[i] = 0.85 + Math.random() * 1.45;
      phases[i] = Math.random() * Math.PI * 2;
      seeds[i] = Math.random();
    }

    return {
      starPositions: positions,
      starSizes: sizes,
      starPhases: phases,
      starSeeds: seeds,
    };
  }, []);

  const starUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
    }),
    [gl]
  );

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const dt = Math.min(delta, 0.05);

    if (starMatRef.current) {
      starMatRef.current.uniforms.uTime.value += dt;
      starMatRef.current.uniforms.uPixelRatio.value = Math.min(
        state.gl.getPixelRatio(),
        1.5
      );
    }

    if (skyMatRef.current) {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress =
        docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
      skyMatRef.current.uniforms.uPitchShift.value = THREE.MathUtils.lerp(
        skyMatRef.current.uniforms.uPitchShift.value,
        scrollProgress,
        0.06
      );
    }
  });

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-20}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={skyMatRef}
          vertexShader={skyVertexShader}
          fragmentShader={skyFragmentShader}
          uniforms={skyUniforms}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      <points frustumCulled={false} renderOrder={-10}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSize"
            count={starSizes.length}
            array={starSizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            count={starPhases.length}
            array={starPhases}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aColorSeed"
            count={starSeeds.length}
            array={starSeeds}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={starMatRef}
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          uniforms={starUniforms}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </points>
    </>
  );
}

function GPGPUFlowerValley({ isMobile, reducedMotion }: SceneProps) {
  const renderMatRef = useRef<THREE.ShaderMaterial>(null);
  const { camera, gl, invalidate } = useThree();

  const simSize = isMobile ? MOBILE_TEX_SIZE : DESKTOP_TEX_SIZE;

  // Pointer & lazy vortex tail state (lerp ~0.05 per frame)
  const rawMousePx = useRef(new THREE.Vector2(0, 0));
  const lazyMousePx = useRef(new THREE.Vector2(0, 0));
  const pointerNDC = useRef(new THREE.Vector2(0, 0));
  const pointerInside = useRef(false);
  const pointerHasMoved = useRef(false);
  const pointerIdleTimeRef = useRef(10);
  const vortexActiveRef = useRef(0);
  const smoothParallax = useRef(new THREE.Vector2(0, 0));

  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollVelocityBoost = useRef(0);
  const smoothScrollProgress = useRef(0);
  const travelRef = useRef(0);
  const simInitializedRef = useRef(false);
  const pingPongIdxRef = useRef(0);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const lazyNDCVec = useMemo(() => new THREE.Vector2(), []);
  const viewProjMatrix = useMemo(() => new THREE.Matrix4(), []);

  useEffect(() => {
    // Camera positioned & tilted so valley blossoms fill the entire lower screen up to the foreground
    camera.position.set(0, 3.25, 13.0);
    camera.lookAt(0, -1.75, -22.0);
    camera.updateMatrixWorld();
    invalidate();
  }, [camera, invalidate]);

  useEffect(() => {
    if (reducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const px = e.clientX;
      const py = window.innerHeight - e.clientY; // WebGL bottom-left pixel origin
      rawMousePx.current.set(px, py);

      if (!pointerHasMoved.current) {
        lazyMousePx.current.set(px, py);
        pointerHasMoved.current = true;
      }

      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerNDC.current.set(nx, ny);
      pointerInside.current = true;
      pointerIdleTimeRef.current = 0;
    };

    const handlePointerLeave = () => {
      pointerInside.current = false;
    };

    const handleBlur = () => {
      pointerInside.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handleBlur);
    };
  }, [reducedMotion]);

  /**
   * Static particle attributes + GPGPU lookup textures:
   * - Desktop: 320x320 = 102,400 particles | Mobile: 160x160 = 25,600 particles
   * - Dense botanical clustering across the entire valley floor, foreground, and slopes
   * - ~1.5% dedicated as autonomous ambient sky-drifting petals
   */
  const simResources = useMemo(() => {
    const count = simSize * simSize;
    const homeArr = new Float32Array(count * 4);
    const seedArr = new Float32Array(count * 4);
    const dummyPos = new Float32Array(count * 3);
    const simUvs = new Float32Array(count * 2);

    const skyPetalCount = Math.floor(count * 0.015);
    const meadowCount = count - skyPetalCount;
    const clusteredCount = Math.floor(meadowCount * 0.74);

    // Rich botanical clusters concentrated across central/foreground valley + outer slopes
    const patchCount = isMobile ? 420 : 1450;
    const patches = new Array<{
      x: number;
      z: number;
      radius: number;
      hueBias: number;
      hasLimeAccent: boolean;
    }>(patchCount);

    for (let p = 0; p < patchCount; p++) {
      // Bias X slightly toward the central & foreground frustum corridor while covering wide horizon slopes
      const signed = (Math.random() - 0.5) * 2;
      const x =
        Math.sign(signed) *
        Math.pow(Math.abs(signed), 1.28) *
        (FIELD_HALF_WIDTH - 1.5);

      patches[p] = {
        x,
        z: Math.random() * FIELD_DEPTH,
        radius: 0.75 + Math.pow(Math.random(), 1.35) * 3.1,
        hueBias: Math.random(),
        hasLimeAccent: Math.random() > 0.62,
      };
    }

    for (let i = 0; i < count; i++) {
      const col = i % simSize;
      const row = Math.floor(i / simSize);
      simUvs[i * 2] = (col + 0.5) / simSize;
      simUvs[i * 2 + 1] = (row + 0.5) / simSize;

      let x = 0;
      let z = 0;
      let scaleSeed = 0.5;
      let role = 0; // 0 = meadow flower, 1 = ambient falling sky petal
      let colorSeed = Math.random();

      if (i < clusteredCount) {
        // 1. Dense meadow flower clusters & micro-bouquets
        const patch = patches[i % patchCount];
        const angle = Math.random() * Math.PI * 2;
        const distNorm = Math.pow(Math.random(), 1.55);
        const r = distNorm * patch.radius;

        const microAngle = Math.random() * Math.PI * 2;
        const microR = Math.random() * 0.2;

        const rawX =
          patch.x + Math.cos(angle) * r + Math.cos(microAngle) * microR;
        x = Math.max(
          -FIELD_HALF_WIDTH + 0.4,
          Math.min(FIELD_HALF_WIDTH - 0.4, rawX)
        );
        z =
          (((patch.z + Math.sin(angle) * r + Math.sin(microAngle) * microR) %
            FIELD_DEPTH) +
            FIELD_DEPTH) %
          FIELD_DEPTH;

        colorSeed =
          patch.hasLimeAccent && Math.random() > 0.74
            ? 0.88 + Math.random() * 0.11
            : Math.min(
                0.86,
                (patch.hueBias + (Math.random() - 0.5) * 0.22 + 1) % 1
              );

        scaleSeed = Math.min(
          1,
          (1 - distNorm * 0.42) * (0.45 + Math.random() * 0.65)
        );
      } else if (i < meadowCount) {
        // 2. Continuous foreground-to-horizon meadow carpet eliminating any dark gaps
        const signed = (Math.random() - 0.5) * 2;
        x =
          Math.sign(signed) *
          Math.pow(Math.abs(signed), 1.18) *
          (FIELD_HALF_WIDTH - 0.5);
        z = Math.random() * FIELD_DEPTH;
        scaleSeed = 0.3 + Math.random() * 0.68;
      } else {
        // 3. Solitary ambient petals slowly drifting down from above across the viewport
        x = (Math.random() - 0.5) * 44;
        z = Math.random() * FIELD_DEPTH;
        scaleSeed = 0.45 + Math.random() * 0.55;
        role = 1;
      }

      homeArr[i * 4] = x;
      homeArr[i * 4 + 1] = z;
      homeArr[i * 4 + 2] = scaleSeed;
      homeArr[i * 4 + 3] = role;

      seedArr[i * 4] = colorSeed;
      seedArr[i * 4 + 1] = Math.random(); // individual fall speed seed
      seedArr[i * 4 + 2] = Math.random() * Math.PI * 2; // base angle
      seedArr[i * 4 + 3] = Math.random(); // 5- vs 6-petal variant

      dummyPos[i * 3] = x;
      dummyPos[i * 3 + 1] = 0;
      dummyPos[i * 3 + 2] = z;
    }

    const homeTex = new THREE.DataTexture(
      homeArr,
      simSize,
      simSize,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    homeTex.minFilter = THREE.NearestFilter;
    homeTex.magFilter = THREE.NearestFilter;
    homeTex.generateMipmaps = false;
    homeTex.needsUpdate = true;

    const seedTex = new THREE.DataTexture(
      seedArr,
      simSize,
      simSize,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    seedTex.minFilter = THREE.NearestFilter;
    seedTex.magFilter = THREE.NearestFilter;
    seedTex.generateMipmaps = false;
    seedTex.needsUpdate = true;

    // Detect Float vs HalfFloat FBO renderability
    const ctx = gl.getContext();
    const supportsFloatFBO = Boolean(
      gl.extensions.has('EXT_color_buffer_float') ||
        ctx.getExtension('EXT_color_buffer_float')
    );
    const rtType = supportsFloatFBO ? THREE.FloatType : THREE.HalfFloatType;

    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: rtType,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    };

    const rtOffsetA = new THREE.WebGLRenderTarget(simSize, simSize, rtOptions);
    const rtOffsetB = new THREE.WebGLRenderTarget(simSize, simSize, rtOptions);
    const rtVelA = new THREE.WebGLRenderTarget(simSize, simSize, rtOptions);
    const rtVelB = new THREE.WebGLRenderTarget(simSize, simSize, rtOptions);

    // Offscreen GPGPU scenes & materials (Pass 1: Velocity/State, Pass 2: Symplectic Position/Spin)
    const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    const velMat = new THREE.ShaderMaterial({
      vertexShader: simQuadVertexShader,
      fragmentShader: velFragmentShader,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
      uniforms: {
        uInit: { value: 1 },
        uHomeTex: { value: homeTex },
        uSeedTex: { value: seedTex },
        uPrevOffset: { value: null },
        uPrevVel: { value: null },
        uTime: { value: 0 },
        uDt: { value: 0.016 },
        uTravel: { value: 0 },
        uPrevTravel: { value: 0 },
        uFieldDepth: { value: FIELD_DEPTH },
        uZFar: { value: FIELD_Z_FAR },
        uViewProjMatrix: { value: new THREE.Matrix4() },
        uViewportSize: { value: new THREE.Vector2(1920, 1080) },
        uVortexCenterPx: { value: new THREE.Vector2(-9999, -9999) },
        uVortexRadiusPx: { value: VORTEX_RADIUS_PX },
        uVortexActive: { value: 0 },
        uVortexRayOrigin: { value: new THREE.Vector3() },
        uVortexRayDir: { value: new THREE.Vector3(0, 0, -1) },
      },
    });

    const posMat = new THREE.ShaderMaterial({
      vertexShader: simQuadVertexShader,
      fragmentShader: posFragmentShader,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
      uniforms: {
        uInit: { value: 1 },
        uHomeTex: { value: homeTex },
        uSeedTex: { value: seedTex },
        uPrevOffset: { value: null },
        uCurrVel: { value: null },
        uDt: { value: 0.016 },
        uTravel: { value: 0 },
        uPrevTravel: { value: 0 },
        uFieldDepth: { value: FIELD_DEPTH },
      },
    });

    const velScene = new THREE.Scene();
    velScene.add(new THREE.Mesh(quadGeo, velMat));

    const posScene = new THREE.Scene();
    posScene.add(new THREE.Mesh(quadGeo, posMat));

    simInitializedRef.current = false;
    pingPongIdxRef.current = 0;

    return {
      count,
      dummyPos,
      simUvs,
      homeTex,
      seedTex,
      rtOffset: [rtOffsetA, rtOffsetB] as const,
      rtVel: [rtVelA, rtVelB] as const,
      orthoCam,
      quadGeo,
      velMat,
      posMat,
      velScene,
      posScene,
    };
  }, [gl, isMobile, simSize]);

  // Clean up GPU FBOs, textures, geometries & materials on unmount or resize tier switch
  useEffect(() => {
    return () => {
      simResources.homeTex.dispose();
      simResources.seedTex.dispose();
      simResources.rtOffset[0].dispose();
      simResources.rtOffset[1].dispose();
      simResources.rtVel[0].dispose();
      simResources.rtVel[1].dispose();
      simResources.quadGeo.dispose();
      simResources.velMat.dispose();
      simResources.posMat.dispose();
    };
  }, [simResources]);

  const renderUniforms = useMemo(
    () => ({
      uHomeTex: { value: simResources.homeTex },
      uSeedTex: { value: simResources.seedTex },
      uTexOffset: { value: simResources.rtOffset[0].texture },
      uTexVel: { value: simResources.rtVel[0].texture },
      uTime: { value: 0 },
      uTravel: { value: 0 },
      uFieldDepth: { value: FIELD_DEPTH },
      uZFar: { value: FIELD_Z_FAR },
      uZNear: { value: FIELD_Z_NEAR },
      uHalfWidth: { value: FIELD_HALF_WIDTH },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
      uReducedMotion: { value: reducedMotion ? 1 : 0 },
    }),
    [gl, reducedMotion, simResources]
  );

  // Initialize GPGPU textures immediately so even reducedMotion static frame has clean zeroed textures
  useEffect(() => {
    const prevTarget = gl.getRenderTarget();

    simResources.velMat.uniforms.uInit.value = 1;
    simResources.posMat.uniforms.uInit.value = 1;

    gl.setRenderTarget(simResources.rtVel[0]);
    gl.render(simResources.velScene, simResources.orthoCam);

    gl.setRenderTarget(simResources.rtOffset[0]);
    gl.render(simResources.posScene, simResources.orthoCam);

    simResources.velMat.uniforms.uInit.value = 0;
    simResources.posMat.uniforms.uInit.value = 0;
    simInitializedRef.current = true;
    pingPongIdxRef.current = 0;

    gl.setRenderTarget(prevTarget);
    invalidate();
  }, [gl, invalidate, simResources]);

  useFrame((state, delta) => {
    const renderMat = renderMatRef.current;
    if (!renderMat) return;

    renderMat.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0;
    if (reducedMotion) return;

    const dt = Math.min(delta, 0.05);

    // 1. Scroll velocity & pitch modulation
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
    lastScrollY.current = currentScrollY;

    const targetBoost = Math.min(scrollDelta * 0.08, 3.5);
    scrollVelocityBoost.current = THREE.MathUtils.lerp(
      scrollVelocityBoost.current,
      targetBoost,
      1 - Math.exp(-7.5 * dt)
    );

    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const rawProgress =
      docHeight > 0 ? Math.min(Math.max(currentScrollY / docHeight, 0), 1) : 0;
    smoothScrollProgress.current = THREE.MathUtils.lerp(
      smoothScrollProgress.current,
      rawProgress,
      1 - Math.exp(-4.5 * dt)
    );

    // 2. Continuous calm flight through the dense flower valley
    const prevTravel = travelRef.current;
    const baseFlightSpeed = 1.75;
    travelRef.current += (baseFlightSpeed + scrollVelocityBoost.current) * dt;

    // 3. Camera mouse parallax + gentle scroll pitch modulation
    const targetPx = pointerInside.current ? pointerNDC.current.x : 0;
    const targetPy = pointerInside.current ? pointerNDC.current.y : 0;
    const parallaxLerp = 1 - Math.exp(-3.6 * dt);

    smoothParallax.current.x = THREE.MathUtils.lerp(
      smoothParallax.current.x,
      targetPx,
      parallaxLerp
    );
    smoothParallax.current.y = THREE.MathUtils.lerp(
      smoothParallax.current.y,
      targetPy,
      parallaxLerp
    );

    const camX = smoothParallax.current.x * 0.62;
    const camY =
      3.25 +
      smoothParallax.current.y * 0.24 +
      smoothScrollProgress.current * 0.5;
    const lookY =
      -1.75 +
      smoothParallax.current.y * 0.32 -
      smoothScrollProgress.current * 0.55;

    state.camera.position.set(camX, camY, 13.0);
    state.camera.lookAt(camX * 0.3, lookY, -22.0);
    state.camera.updateMatrixWorld();

    viewProjMatrix.multiplyMatrices(
      state.camera.projectionMatrix,
      state.camera.matrixWorldInverse
    );

    // 4. Lazy tail cursor update (lerp ~0.05 per 60Hz frame) + 3D vortex ray
    if (!isMobile && pointerHasMoved.current) {
      pointerIdleTimeRef.current += dt;

      const lazyAlpha = 1 - Math.pow(1 - 0.05, dt * 60);
      lazyMousePx.current.lerp(rawMousePx.current, lazyAlpha);

      const tailLagDist = lazyMousePx.current.distanceTo(rawMousePx.current);
      const isActivelySwirling =
        pointerInside.current &&
        (pointerIdleTimeRef.current < 0.75 || tailLagDist > 3.5);

      const targetActive = isActivelySwirling ? 1.0 : 0.0;
      vortexActiveRef.current = THREE.MathUtils.lerp(
        vortexActiveRef.current,
        targetActive,
        1 - Math.exp((isActivelySwirling ? -8.5 : -3.2) * dt)
      );

      lazyNDCVec.set(
        (lazyMousePx.current.x / window.innerWidth) * 2 - 1,
        (lazyMousePx.current.y / window.innerHeight) * 2 - 1
      );
      raycaster.setFromCamera(lazyNDCVec, state.camera);
    } else {
      vortexActiveRef.current = 0;
    }

    // 5. GPGPU Ping-Pong Simulation Step (Pass 1: Velocity/State -> Pass 2: Position/Spin)
    const readIdx = pingPongIdxRef.current;
    const writeIdx = 1 - readIdx;

    const velUniforms = simResources.velMat.uniforms;
    velUniforms.uPrevOffset.value = simResources.rtOffset[readIdx].texture;
    velUniforms.uPrevVel.value = simResources.rtVel[readIdx].texture;
    velUniforms.uTime.value = renderMat.uniforms.uTime.value + dt;
    velUniforms.uDt.value = dt;
    velUniforms.uTravel.value = travelRef.current;
    velUniforms.uPrevTravel.value = prevTravel;
    velUniforms.uViewProjMatrix.value.copy(viewProjMatrix);
    velUniforms.uViewportSize.value.set(window.innerWidth, window.innerHeight);
    velUniforms.uVortexCenterPx.value.copy(lazyMousePx.current);
    velUniforms.uVortexRadiusPx.value = VORTEX_RADIUS_PX;
    velUniforms.uVortexActive.value = isMobile ? 0 : vortexActiveRef.current;
    velUniforms.uVortexRayOrigin.value.copy(raycaster.ray.origin);
    velUniforms.uVortexRayDir.value.copy(raycaster.ray.direction);

    const prevRenderTarget = state.gl.getRenderTarget();

    state.gl.setRenderTarget(simResources.rtVel[writeIdx]);
    state.gl.render(simResources.velScene, simResources.orthoCam);

    const posUniforms = simResources.posMat.uniforms;
    posUniforms.uPrevOffset.value = simResources.rtOffset[readIdx].texture;
    posUniforms.uCurrVel.value = simResources.rtVel[writeIdx].texture;
    posUniforms.uDt.value = dt;
    posUniforms.uTravel.value = travelRef.current;
    posUniforms.uPrevTravel.value = prevTravel;

    state.gl.setRenderTarget(simResources.rtOffset[writeIdx]);
    state.gl.render(simResources.posScene, simResources.orthoCam);

    state.gl.setRenderTarget(prevRenderTarget);
    pingPongIdxRef.current = writeIdx;

    // 6. Bind updated GPGPU state textures to the 102,400-flower Points material
    renderMat.uniforms.uTexOffset.value =
      simResources.rtOffset[writeIdx].texture;
    renderMat.uniforms.uTexVel.value = simResources.rtVel[writeIdx].texture;
    renderMat.uniforms.uTime.value += dt;
    renderMat.uniforms.uTravel.value = travelRef.current;
    renderMat.uniforms.uPixelRatio.value = Math.min(
      state.gl.getPixelRatio(),
      1.5
    );
  });

  return (
    <points key={simSize} frustumCulled={false} renderOrder={0}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={simResources.count}
          array={simResources.dummyPos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSimUv"
          count={simResources.count}
          array={simResources.simUvs}
          itemSize={2}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={renderMatRef}
        vertexShader={fieldVertexShader}
        fragmentShader={fieldFragmentShader}
        uniforms={renderUniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </points>
  );
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function BackgroundScene() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth < 768 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    const handleResize = () => {
      const mobileNow =
        window.innerWidth < 768 ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsMobile((prev) => (prev !== mobileNow ? mobileNow : prev));
    };

    mqMotion.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      mqMotion.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const staticFallback = (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,#160B2D_0%,#090612_48%,#020204_100%)]"
    />
  );

  return (
    <WebGLErrorBoundary fallback={staticFallback}>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      >
        <Canvas
          dpr={[1, 1.5]}
          frameloop={reducedMotion ? 'demand' : 'always'}
          camera={{ fov: 52, near: 0.4, far: 140, position: [0, 3.25, 13.0] }}
          gl={{
            antialias: false,
            alpha: false,
            stencil: false,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <SkyAndStars reducedMotion={reducedMotion} />
          <GPGPUFlowerValley
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
        </Canvas>

        {/* Subtle edge vignette preserving full lower-screen flower visibility */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(2,2,5,0.38)_100%)]" />
      </div>
    </WebGLErrorBoundary>
  );
}

export default BackgroundScene;
