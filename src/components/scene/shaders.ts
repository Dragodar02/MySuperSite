// Shared Ashima 2D Simplex Noise + Dark Valley Topography (identical across GPGPU & Render passes)
const valleyTerrainGLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float computeValleyElevation(float xWorld, float zWorld, out float normalizedCrest) {
    float valleyMeander = sin(zWorld * 0.032) * 4.0 + cos(zWorld * 0.016) * 2.0;
    float dxValley = xWorld - valleyMeander;
    float valleySlopes = pow(clamp(abs(dxValley) / 40.0, 0.0, 1.35), 1.82) * 4.5;

    float hillPrimary = snoise(vec2(xWorld * 0.054, zWorld * 0.050));
    float hillDetail  = snoise(vec2(xWorld * 0.130 + 19.4, zWorld * 0.120 - 11.7));
    float microMound  = snoise(vec2(xWorld * 0.270 - 7.2, zWorld * 0.270 + 5.1));

    normalizedCrest = clamp((hillPrimary * 1.85 + hillDetail * 0.68 + 2.3) / 4.6, 0.0, 1.0);

    return hillPrimary * 1.85 + hillDetail * 0.68 + microMound * 0.22 + valleySlopes - 2.35;
  }
`;

export const skyVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const skyFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uPitchShift;
  varying vec2 vUv;

  void main() {
    float y = clamp(vUv.y + uPitchShift * 0.08, 0.0, 1.0);

    vec3 zenithColor = vec3(0.088, 0.044, 0.176);   // #160B2D
    vec3 upperMid    = vec3(0.042, 0.022, 0.094);   // #0B0618
    vec3 horizonCol  = vec3(0.016, 0.013, 0.032);   // #040308
    vec3 valleyFloor = vec3(0.009, 0.009, 0.015);   // #020204

    vec3 col = mix(valleyFloor, horizonCol, smoothstep(0.0, 0.38, y));
    col = mix(col, upperMid, smoothstep(0.34, 0.74, y));
    col = mix(col, zenithColor, smoothstep(0.66, 1.0, y));

    float crownDist = length(vec2((vUv.x - 0.5) * 0.85, (y - 0.86) * 1.35));
    col += vec3(0.034, 0.015, 0.064) * (1.0 - smoothstep(0.0, 0.75, crownDist));

    float dither = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    col += (dither - 0.5) / 255.0;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const starVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aColorSeed;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vTwinkle;
  varying float vColorSeed;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizeAtten = 52.0 / max(12.0, -mvPosition.z);
    gl_PointSize = clamp(aSize * uPixelRatio * sizeAtten, 1.0, 3.2);

    float wave = 0.72 + 0.28 * sin(uTime * (0.55 + aColorSeed * 0.8) + aPhase);
    vTwinkle = wave;
    vColorSeed = aColorSeed;
  }
`;

export const starFragmentShader = /* glsl */ `
  precision highp float;

  varying float vTwinkle;
  varying float vColorSeed;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    float mask = 1.0 - smoothstep(0.08, 0.5, dist);
    if (mask < 0.01) discard;

    vec3 starWhite = vec3(0.85, 0.83, 0.96);
    vec3 starLavender = vec3(0.76, 0.70, 0.98);
    vec3 starLime = vec3(0.831, 1.0, 0.227);

    vec3 color = mix(starWhite, starLavender, smoothstep(0.2, 0.8, vColorSeed));
    if (vColorSeed > 0.93) {
      color = mix(starWhite, starLime, 0.65);
    }

    float alpha = mask * vTwinkle * 0.34;
    gl_FragColor = vec4(color, alpha);
  }
`;

// ============================================================================
// GPGPU SIMULATION SHADERS (Velocity + Lifecycle State, then Symplectic Position)
// ============================================================================

export const simQuadVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const velFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uInit;
  uniform sampler2D uHomeTex; // r: homeX, g: seedZ, b: scaleSeed, a: role (0 = meadow, 1 = sky petal)
  uniform sampler2D uSeedTex; // r: colorSeed, g: fallSpeedSeed, b: baseAngle, a: petalVariant
  uniform sampler2D uPrevOffset; // rgb: offsetXYZ, a: spinAngle
  uniform sampler2D uPrevVel;    // rgb: velXYZ, a: stateTimer

  uniform float uTime;
  uniform float uDt;
  uniform float uTravel;
  uniform float uPrevTravel;
  uniform float uFieldDepth;
  uniform float uZFar;

  uniform mat4 uViewProjMatrix;
  uniform vec2 uViewportSize;
  uniform vec2 uVortexCenterPx;
  uniform float uVortexRadiusPx;
  uniform float uVortexActive;
  uniform vec3 uVortexRayOrigin;
  uniform vec3 uVortexRayDir;

  varying vec2 vUv;

  ${valleyTerrainGLSL}

  void main() {
    vec4 homeData = texture2D(uHomeTex, vUv);
    vec4 seedData = texture2D(uSeedTex, vUv);

    float isSkyPetal = step(0.5, homeData.a);

    if (uInit > 0.5) {
      if (isSkyPetal > 0.5) {
        float initFall = -mix(0.38, 0.82, seedData.g);
        gl_FragColor = vec4(0.0, initFall, 0.0, -2.0);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
      return;
    }

    float prevRelZ = mod(homeData.g + uPrevTravel, uFieldDepth);
    float currRelZ = mod(homeData.g + uTravel, uFieldDepth);
    bool wrappedZ = currRelZ < prevRelZ;

    if (wrappedZ) {
      if (isSkyPetal > 0.5) {
        gl_FragColor = vec4(0.0, -mix(0.38, 0.82, seedData.g), 0.0, -2.0);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
      return;
    }

    vec4 prevOff = texture2D(uPrevOffset, vUv);
    vec4 prevVelState = texture2D(uPrevVel, vUv);

    vec3 offset = prevOff.xyz;
    vec3 vel = prevVelState.xyz;
    float timer = prevVelState.w;

    float zCam = uZFar + currRelZ;
    float zWorld = zCam - uTravel;
    float xWorld = homeData.r;
    float crestDummy;
    float homeY = computeValleyElevation(xWorld, zWorld, crestDummy);

    vec3 curPos = vec3(xWorld, homeY, zCam) + offset;

    // Screen-space projection for ~150-250px lazy vortex check
    float vortexInfluence = 0.0;
    vec3 vortexTargetVel = vec3(0.0);

    if (uVortexActive > 0.01) {
      vec4 clipPos = uViewProjMatrix * vec4(curPos, 1.0);
      if (clipPos.w > 0.25) {
        vec2 ndc = clipPos.xy / clipPos.w;
        vec2 screenPx = (ndc * 0.5 + 0.5) * uViewportSize;
        float distPx = length(screenPx - uVortexCenterPx);

        if (distPx < uVortexRadiusPx) {
          float u = clamp(distPx / uVortexRadiusPx, 0.0, 1.0);
          // Smooth C1 bell falloff to 0 at edge of vortex radius
          float radialFalloff = (1.0 - u) * (1.0 - u) * (1.0 + 2.0 * u);
          float coreSmooth = smoothstep(0.0, 0.10, u);
          vortexInfluence = radialFalloff * uVortexActive;

          // 3D vortex axis point at the particle's exact distance from the camera
          float camDist = length(curPos - uVortexRayOrigin);
          vec3 axisPoint = uVortexRayOrigin + uVortexRayDir * camDist;
          vec3 rel = curPos - axisPoint;

          vec2 relXZ = rel.xz;
          float rXZ = length(relXZ);
          vec2 radDir = (rXZ > 0.001)
            ? (relXZ / rXZ)
            : vec2(cos(seedData.b), sin(seedData.b));

          // Fast whirlwind tangential spin (faster closer to the eye) + centripetal funnel pull
          vec2 tangDir = vec2(-radDir.y, radDir.x);
          float eyeBoost = mix(1.55, 0.85, u);
          float swirlSpeed = mix(8.8, 13.8, seedData.r) * coreSmooth * eyeBoost;
          float inwardPull = (u > 0.16)
            ? (-mix(2.6, 4.3, u) * coreSmooth)
            : (1.25 * (0.16 - u));

          vec2 horizVel = tangDir * swirlSpeed + radDir * inwardPull;

          // Energetic upward funnel lift, capped smoothly at vortex top
          float heightCap = clamp(1.0 - offset.y / 4.6, 0.0, 1.0);
          float liftSpeed = mix(1.55, 3.10, seedData.g) * heightCap;

          vortexTargetVel = vec3(horizVel.x, liftSpeed, horizVel.y);
        }
      }
    }

    // Autonomous ambient sky-drifting petals (~1.5% of population)
    if (isSkyPetal > 0.5) {
      if (vortexInfluence > 0.05) {
        vel = mix(vel, vortexTargetVel, 1.0 - exp(-11.0 * uDt * (0.35 + vortexInfluence)));
      } else {
        float swayFreq = mix(1.2, 2.5, seedData.b * 0.15);
        float swayAmp  = mix(0.32, 0.78, seedData.r);
        float targetVx = cos(uTime * swayFreq + seedData.a * 6.28318) * swayAmp;
        float targetVz = sin(uTime * swayFreq * 0.8 + seedData.r * 6.28318) * (swayAmp * 0.6);
        float targetVy = -mix(0.38, 0.82, seedData.g);

        vel.x = mix(vel.x, targetVx, 1.0 - exp(-2.2 * uDt));
        vel.z = mix(vel.z, targetVz, 1.0 - exp(-2.2 * uDt));
        vel.y = mix(vel.y, targetVy, 1.0 - exp(-2.0 * uDt));
      }

      gl_FragColor = vec4(vel, -2.0);
      return;
    }

    // Meadow blossom 4-stage state machine:
    // 1) Caught in lazy cursor vortex -> fast spiral whirlwind + funnel lift
    if (vortexInfluence > 0.045) {
      float blend = 1.0 - exp(-11.5 * uDt * (0.35 + vortexInfluence));
      vel = mix(vel, vortexTargetVel, blend);
      timer = 1.0; // Start/refresh post-cursor inertia countdown
    }
    // 2) Cursor moved away -> 2 to 4 seconds of swirling inertia (damping ~0.97 per frame)
    else if (timer >= 1.0) {
      timer += uDt;
      float inertiaDuration = mix(2.1, 3.9, seedData.r);

      // Damping ~0.97 per 60fps frame
      float frameDamping = pow(0.970, uDt * 60.0);
      vel *= frameDamping;

      // Residual hurricane curl smoothly unwinding from fast spin
      float inertiaProgress = clamp((timer - 1.0) / inertiaDuration, 0.0, 1.0);
      float curlAngularVel = mix(4.4, 0.65, inertiaProgress);
      float ca = cos(curlAngularVel * uDt);
      float sa = sin(curlAngularVel * uDt);
      vel.xz = mat2(ca, -sa, sa, ca) * vel.xz;

      // Soft buoyant vertical settle before transitioning into petal descent
      vel.y -= 0.14 * uDt;

      if (timer >= 1.0 + inertiaDuration) {
        timer = -2.0; // Enter slow petal-fall phase
      }
    }
    // 3) Slow petal descent: individual fall speed + sinusoidal side-to-side sway
    else if (timer <= -1.5) {
      if (offset.y > 0.025) {
        float terminalFall = -mix(0.42, 1.08, seedData.g);
        float swayFreq = mix(1.6, 3.3, fract(seedData.b));
        float swayAmp  = mix(0.36, 0.88, seedData.r);

        float swayVx = cos(uTime * swayFreq + seedData.a * 6.28318) * swayAmp;
        float swayVz = sin(uTime * swayFreq * 0.76 + seedData.r * 6.28318) * (swayAmp * 0.65);

        vel.x = mix(vel.x, swayVx, 1.0 - exp(-3.0 * uDt));
        vel.z = mix(vel.z, swayVz, 1.0 - exp(-3.0 * uDt));
        vel.y = mix(vel.y, terminalFall, 1.0 - exp(-2.6 * uDt));
      } else {
        // Touchdown on the valley floor -> transition to smooth home return
        vel = vec3(0.0);
        timer = -0.5;
      }
    }
    // 4) Landed -> velocity stays zero while posShader glides flower smoothly home
    else if (timer < 0.0) {
      vel = vec3(0.0);
      if (length(offset) < 0.008) {
        timer = 0.0;
      }
    } else {
      vel = vec3(0.0);
      timer = 0.0;
    }

    gl_FragColor = vec4(vel, timer);
  }
`;

export const posFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uInit;
  uniform sampler2D uHomeTex;
  uniform sampler2D uSeedTex;
  uniform sampler2D uPrevOffset; // rgb: offsetXYZ, a: spinAngle
  uniform sampler2D uCurrVel;    // rgb: velXYZ, a: stateTimer

  uniform float uDt;
  uniform float uTravel;
  uniform float uPrevTravel;
  uniform float uFieldDepth;

  varying vec2 vUv;

  void main() {
    vec4 homeData = texture2D(uHomeTex, vUv);
    vec4 seedData = texture2D(uSeedTex, vUv);
    float isSkyPetal = step(0.5, homeData.a);

    if (uInit > 0.5) {
      if (isSkyPetal > 0.5) {
        // Scatter initial ambient sky petals across all altitudes from the first frame
        float startY = 0.8 + fract(seedData.r * 7.13 + seedData.a * 3.71) * 13.5;
        gl_FragColor = vec4(0.0, startY, 0.0, seedData.b);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
      return;
    }

    float prevRelZ = mod(homeData.g + uPrevTravel, uFieldDepth);
    float currRelZ = mod(homeData.g + uTravel, uFieldDepth);
    bool wrappedZ = currRelZ < prevRelZ;

    if (wrappedZ) {
      if (isSkyPetal > 0.5) {
        float respawnY = 9.0 + seedData.r * 5.5;
        gl_FragColor = vec4(0.0, respawnY, 0.0, seedData.b);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
      return;
    }

    vec4 prevOff = texture2D(uPrevOffset, vUv);
    vec4 currVelState = texture2D(uCurrVel, vUv);

    vec3 offset = prevOff.xyz;
    float spin = prevOff.w;
    vec3 vel = currVelState.xyz;
    float timer = currVelState.w;

    float spinDir = (seedData.r > 0.5) ? 1.0 : -1.0;

    // Ambient sky-drifting petals
    if (isSkyPetal > 0.5) {
      offset += vel * uDt;
      offset.xz = clamp(offset.xz, vec2(-18.0), vec2(18.0));
      spin = mod(spin + spinDir * mix(0.85, 2.2, seedData.g) * uDt, 62.831853);

      // Respawn high above once the petal reaches the valley meadow
      if (offset.y <= 0.05) {
        offset = vec3(
          (seedData.a - 0.5) * 4.0,
          9.5 + seedData.r * 5.5,
          (seedData.g - 0.5) * 4.0
        );
      }

      gl_FragColor = vec4(offset, spin);
      return;
    }

    // Active vortex, inertia, or petal descent
    if (timer >= 1.0 || timer <= -1.5) {
      offset += vel * uDt;
      offset.y = max(0.0, offset.y);
      offset.xz = clamp(offset.xz, vec2(-22.0), vec2(22.0));

      // Rotate briskly around own axis while whipping inside the whirlwind, slower when fluttering down
      float speedMag = length(vel);
      float axialSpinRate = mix(1.4, 3.8, seedData.g) * (0.65 + min(speedMag * 0.48, 2.8));
      spin = mod(spin + spinDir * axialSpinRate * uDt, 62.831853);
    }
    // Landed on the ground -> smoothly glide back to resting spot in the field
    else if (timer < 0.0) {
      offset.y = 0.0;
      float returnLerp = pow(0.962, uDt * 60.0);
      offset.xz *= returnLerp;

      float rem = length(offset.xz);
      if (rem > 0.0001) {
        offset.xz -= (offset.xz / rem) * min(rem, 0.12 * uDt);
      }

      // Gently settle axial spin back to rest
      if (spin > 31.415926) spin -= 62.831853;
      spin *= pow(0.94, uDt * 60.0);
      if (abs(spin) < 0.005) spin = 0.0;
      if (spin < 0.0) spin += 62.831853;

      if (length(offset.xz) < 0.008) {
        offset = vec3(0.0);
        spin = 0.0;
      }
    } else {
      offset = vec3(0.0);
      spin = 0.0;
    }

    gl_FragColor = vec4(offset, spin);
  }
`;

// ============================================================================
// FLOWER RENDER SHADERS (102k Desktop / 25.6k Mobile Points)
// ============================================================================

export const fieldVertexShader = /* glsl */ `
  attribute vec2 aSimUv;

  uniform sampler2D uHomeTex;
  uniform sampler2D uSeedTex;
  uniform sampler2D uTexOffset;
  uniform sampler2D uTexVel;

  uniform float uTime;
  uniform float uTravel;
  uniform float uFieldDepth;
  uniform float uZFar;
  uniform float uZNear;
  uniform float uHalfWidth;
  uniform float uPixelRatio;
  uniform float uReducedMotion;

  varying float vAlpha;
  varying float vSeed;
  varying float vAngle;
  varying float vSpin;
  varying float vVariant;
  varying float vElevation;
  varying float vAirborne;
  varying float vDepth;
  varying float vPointSize;

  ${valleyTerrainGLSL}

  void main() {
    vec4 homeData = texture2D(uHomeTex, aSimUv);
    vec4 seedData = texture2D(uSeedTex, aSimUv);
    vec4 offData  = texture2D(uTexOffset, aSimUv);
    vec4 velData  = texture2D(uTexVel, aSimUv);

    float isSkyPetal = step(0.5, homeData.a);

    // Hide autonomous falling sky petals when prefers-reduced-motion is active
    if (uReducedMotion > 0.5 && isSkyPetal > 0.5) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vAlpha = 0.0;
      return;
    }

    float zCam = uZFar + mod(homeData.g + uTravel, uFieldDepth);
    float zWorld = zCam - uTravel;
    float xWorld = homeData.r;

    float normCrest;
    float baseElevation = computeValleyElevation(xWorld, zWorld, normCrest);

    vec3 simOffset = (uReducedMotion > 0.5) ? vec3(0.0) : offData.xyz;
    float spinAngle = (uReducedMotion > 0.5) ? 0.0 : offData.w;

    // Gentle ambient valley wind swaying undisturbed flowers
    float motionGate = 1.0 - step(0.5, uReducedMotion);
    float windWave1 = sin(uTime * 1.15 + xWorld * 0.24 + zWorld * 0.21 + seedData.b);
    float windWave2 = cos(uTime * 0.82 - xWorld * 0.16 + zWorld * 0.28 + seedData.r * 6.28);
    vec3 ambientWind = vec3(
      windWave1 * 0.085 + windWave2 * 0.04,
      windWave1 * 0.025,
      windWave2 * 0.075
    ) * motionGate * (1.0 - isSkyPetal);

    vec3 finalPos = vec3(xWorld, baseElevation, zCam) + simOffset + ambientWind;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float viewDepth = max(1.2, -mvPosition.z);
    float airborneAmount = clamp(simOffset.y / 1.4, 0.0, 1.0);
    if (isSkyPetal > 0.5) airborneAmount = 1.0;

    // Perspective depth sizing: larger blossoms in the close foreground, fine delicate blooms in distance
    float baseScale = mix(11.5, 25.5, pow(homeData.b, 0.82)) * (1.0 + airborneAmount * 0.18);
    float pSize = clamp(baseScale * uPixelRatio * (18.5 / viewDepth), 1.5, 54.0 * uPixelRatio);
    gl_PointSize = pSize;

    // Full-screen coverage: foreground stays opaque all the way past the bottom screen edge
    float farFade  = smoothstep(uZFar, uZFar + 20.0, finalPos.z);
    float nearFade = smoothstep(uZNear, uZNear - 2.2, finalPos.z);
    float sideFade = smoothstep(uHalfWidth, uHalfWidth - 10.0, abs(xWorld));

    // Smooth entry/exit fade for autonomous sky-drifting petals
    float skyPetalFade = 1.0;
    if (isSkyPetal > 0.5) {
      skyPetalFade = smoothstep(0.08, 1.1, simOffset.y) * smoothstep(15.2, 12.2, simOffset.y) * 0.88;
    }

    float windRock = sin(uTime * 1.1 + seedData.b) * 0.14 * motionGate;

    vAlpha = farFade * nearFade * sideFade * skyPetalFade;
    vSeed = seedData.r;
    vAngle = seedData.b + windRock + spinAngle;
    vSpin = spinAngle;
    vVariant = seedData.a;
    vElevation = normCrest;
    vAirborne = max(airborneAmount, step(0.5, abs(velData.w)));
    vDepth = viewDepth;
    vPointSize = pSize;
  }
`;

export const fieldFragmentShader = /* glsl */ `
  precision highp float;

  varying float vAlpha;
  varying float vSeed;
  varying float vAngle;
  varying float vSpin;
  varying float vVariant;
  varying float vElevation;
  varying float vAirborne;
  varying float vDepth;
  varying float vPointSize;

  void main() {
    if (vAlpha < 0.01) discard;

    vec2 uv = (gl_PointCoord - 0.5) * 2.0;
    if (dot(uv, uv) > 1.05) discard;

    float c = cos(vAngle);
    float s = sin(vAngle);
    vec2 p = mat2(c, -s, s, c) * uv;

    // Subtle 3D petal flutter foreshortening when airborne/falling
    float flutterTilt = mix(1.0, 0.68 + 0.32 * abs(cos(vSpin * 0.75 + vSeed * 6.2831)), clamp(vAirborne, 0.0, 1.0));
    p.y /= max(0.55, flutterTilt);

    float r = length(p);

    // 5-petal and 6-petal rounded valley blossoms
    float theta = atan(p.y, p.x);
    float petals = (vVariant < 0.58) ? 5.0 : 6.0;
    float wave = abs(cos(theta * petals * 0.5));

    float lobe = pow(wave, 0.64);
    float petalTipCup = 1.0 - 0.055 * pow(wave, 6.0);
    float flowerRadius = mix(0.21, 0.92, lobe) * petalTipCup;

    float d = r - flowerRadius;

    // Crisp anti-aliasing + subtle shallow depth-of-field softness on large close foreground flowers
    float foregroundBokeh = (1.0 - smoothstep(3.0, 9.5, vDepth)) * 0.14;
    float aa = clamp(2.1 / max(vPointSize, 2.0), 0.045, 0.28) + foregroundBokeh;
    float flowerMask = 1.0 - smoothstep(-aa, aa, d);
    if (flowerMask < 0.01) discard;

    // Flower center dot + soft calyx depth shading
    float coreMask = 1.0 - smoothstep(0.11, 0.23, r);
    float calyxRing = smoothstep(0.17, 0.38, r);
    float petalShade = 0.74 + 0.26 * calyxRing * (1.0 - 0.18 * smoothstep(0.66, 0.94, r));

    // Darker, moody nocturnal valley blossom palette + muted #D4FF3A accents
    vec3 duskySilver = vec3(0.35, 0.36, 0.44);
    vec3 darkViolet  = vec3(0.32, 0.24, 0.48);
    vec3 midnightBlu = vec3(0.23, 0.32, 0.46);
    vec3 duskyPlum   = vec3(0.40, 0.25, 0.37);
    vec3 restingLime = vec3(0.50, 0.63, 0.15);
    vec3 activeLime  = vec3(0.831, 1.000, 0.227); // #D4FF3A

    float hueWave = 0.5 + 0.5 * sin(vSeed * 6.28318 + vElevation * 2.8);
    vec3 darkTint = mix(darkViolet, midnightBlu, hueWave);
    darkTint = mix(darkTint, duskyPlum, smoothstep(0.62, 1.0, fract(vSeed * 4.1 + vElevation * 0.35)));

    float valleyLight = mix(0.50, 0.88, vElevation);
    vec3 petalColor = mix(duskySilver, darkTint, 0.52 + 0.18 * (1.0 - vElevation));

    float isAccent = step(0.88, vSeed);
    vec3 limeTone = mix(restingLime, activeLime, clamp(vAirborne * 0.65, 0.0, 0.65));
    petalColor = mix(petalColor, limeTone, isAccent);

    // Subtle moonlit highlight when blossoms are lifted into the spinning whirlwind
    petalColor = mix(petalColor, mix(vec3(0.56, 0.54, 0.68), activeLime, 0.28), clamp(vAirborne * 0.32, 0.0, 0.32));
    petalColor *= petalShade * valleyLight;

    vec3 darkFlowerCore = mix(vec3(0.52, 0.50, 0.56), restingLime, 0.38);
    vec3 limeFlowerCore = vec3(0.76, 0.88, 0.42);
    vec3 coreColor = mix(darkFlowerCore, limeFlowerCore, isAccent);

    vec3 finalColor = mix(petalColor, coreColor, coreMask * 0.88);

    float baseOpacity = mix(0.58, 0.80, isAccent);
    float alpha = flowerMask * vAlpha * min(0.92, baseOpacity + vAirborne * 0.16);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
