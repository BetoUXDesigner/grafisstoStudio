/* ============================================================
   GRAFISSTO STUDIO — HERO WebGL Scene (Three.js)
   Partículas tipo ink splash + viñetas flotantes
   ============================================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── SETUP ──────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0a0a, 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  // ── PARTICLES — INK SPLATTER ────────────────────────────────
  const PARTICLE_COUNT = 2000;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const sizes     = new Float32Array(PARTICLE_COUNT);

  // Color palette: mostly dark with red accents
  const palette = [
    new THREE.Color(0xD90429), // red
    new THREE.Color(0x9B0000), // dark red
    new THREE.Color(0xF5F0E8), // white paper
    new THREE.Color(0x333333), // grey
    new THREE.Color(0x111111), // near black
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    // Position — distributed in a sphere volume, elongated vertically
    const r = Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);

    positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.8;
    positions[i3 + 2] = (Math.random() - 0.5) * 6 - 2;

    // Color
    const col = palette[Math.floor(Math.random() * palette.length)];
    // Weight: 70% dark, 20% red, 10% white
    const w = Math.random();
    let finalCol;
    if (w < 0.7)       finalCol = palette[4]; // dark
    else if (w < 0.90) finalCol = palette[0]; // red
    else               finalCol = palette[2]; // white paper

    colors[i3]     = finalCol.r;
    colors[i3 + 1] = finalCol.g;
    colors[i3 + 2] = finalCol.b;

    sizes[i] = Math.random() * 3.5 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',  new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('vColorAttr', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size',      new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      attribute vec3 vColorAttr;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      uniform float uScroll;

      void main() {
        vColor = vColorAttr;
        vec3 pos = position;

        // Gentle float animation
        pos.y += sin(uTime * 0.3 + position.x * 0.5) * 0.05;
        pos.x += cos(uTime * 0.2 + position.z * 0.3) * 0.03;

        // Scroll parallax — particles move up on scroll
        pos.y -= uScroll * 3.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;

        // Fade by depth
        vAlpha = clamp(1.0 - (-mvPosition.z - 1.0) / 10.0, 0.1, 0.8);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Soft circle
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;

        // Ink-like sharp edge with soft center
        float alpha = smoothstep(0.5, 0.2, d) * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    uniforms: {
      uTime:   { value: 0.0 },
      uScroll: { value: 0.0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, particleMaterial);
  scene.add(particles);

  // ── COMIC PANELS (wireframe planes) ────────────────────────
  const panelMaterial = new THREE.MeshBasicMaterial({
    color: 0xD90429,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });

  const panels = [];
  const panelData = [
    { x: -3.5, y:  1, z: -2, rx: 0.2, ry: -0.3, w: 2.4, h: 3.2 },
    { x:  3.2, y: -0.5, z: -3, rx: -0.1, ry: 0.4, w: 2, h: 2.8 },
    { x:  0.5, y:  2.5, z: -4, rx: 0.3, ry: 0.1, w: 3, h: 2 },
    { x: -1.5, y: -2.5, z: -2.5, rx: -0.2, ry: -0.2, w: 1.8, h: 2.4 },
  ];

  panelData.forEach((d) => {
    const geo  = new THREE.PlaneGeometry(d.w, d.h, 4, 4);
    const mesh = new THREE.Mesh(geo, panelMaterial.clone());
    mesh.position.set(d.x, d.y, d.z);
    mesh.rotation.set(d.rx, d.ry, 0);
    mesh.userData.baseX = d.x;
    mesh.userData.baseY = d.y;
    scene.add(mesh);
    panels.push(mesh);
  });

  // ── MOUSE PARALLAX ─────────────────────────────────────────
  const mouse   = { x: 0, y: 0 };
  const mouseLerp = { x: 0, y: 0 };

  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── SCROLL STATE ────────────────────────────────────────────
  let scrollProgress = 0;

  // Listen for Lenis scroll or fallback
  window.addEventListener('grafisstoScroll', (e) => {
    scrollProgress = e.detail.progress;
  });

  // ── CLOCK & RENDER LOOP ─────────────────────────────────────
  const clock = new THREE.Clock();
  let animFrameId;

  function animate() {
    animFrameId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Lerp mouse
    mouseLerp.x += (mouse.x - mouseLerp.x) * 0.04;
    mouseLerp.y += (mouse.y - mouseLerp.y) * 0.04;

    // Update shader uniforms
    particleMaterial.uniforms.uTime.value   = elapsed;
    particleMaterial.uniforms.uScroll.value = scrollProgress;

    // Rotate particle cloud slowly
    particles.rotation.y  = elapsed * 0.04 + mouseLerp.x * 0.12;
    particles.rotation.x  = mouseLerp.y * 0.06;

    // Animate panels
    panels.forEach((panel, i) => {
      const t = elapsed * 0.15 + i * 1.3;
      panel.position.x = panel.userData.baseX + Math.sin(t) * 0.12 + mouseLerp.x * 0.2;
      panel.position.y = panel.userData.baseY + Math.cos(t * 1.1) * 0.08 - scrollProgress * 3;
      panel.rotation.z = Math.sin(t * 0.4) * 0.05;
    });

    // Camera drift
    camera.position.x = mouseLerp.x * 0.3;
    camera.position.y = -mouseLerp.y * 0.15 - scrollProgress * 1.5;
    camera.lookAt(0, -scrollProgress * 0.5, 0);

    renderer.render(scene, camera);
  }

  animate();

  // ── RESIZE ─────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ── GSAP INTRO ANIMATION (triggers after loader) ────────────
  window.addEventListener('grafisstoLoaded', () => {
    gsap.to(particles.material.uniforms.uTime, { duration: 0 }); // already running
  });

})();
