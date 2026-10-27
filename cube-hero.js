// Home hero: a round 3D character (Three.js, vendored in vendor/three), after the owner's Orbii reference.
// White glossy sphere with a black visor screen; the head turns and the eyes look wherever the pointer goes.
// Click or tap the character, or use the mode tabs, to switch between Game, Touchscreen, LED and Sensor.
// Three.js loads only after the page has painted, only when WebGL works and the hero is on screen.
// The poster image stays visible until the first frame renders, so the hero never looks empty.
// (Class names keep the earlier "cube" prefix so the layout and translations stay stable.)

const stage = document.querySelector('[data-cube]');
if (stage) init(stage);

function init(stage) {
  const canvas = stage.querySelector('.cube-canvas');
  const tabs = [...stage.querySelectorAll('[data-cube-mode]')];
  const panels = [...stage.querySelectorAll('[data-cube-panel]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let setMode = index => selectTab(index);

  function selectTab(index) {
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    stage.dataset.mode = tabs[index]?.dataset.cubeMode || '';
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setMode(i));
    tab.addEventListener('keydown', event => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const next = (i + step + tabs.length) % tabs.length;
      setMode(next); tabs[next].focus();
    });
  });
  selectTab(0);

  const webgl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  if (!webgl || !canvas) return;

  const start = () => {
    const visible = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      visible.disconnect();
      import('./vendor/three/three.module.min.js')
        .then(THREE => Promise.all([THREE, import('./vendor/three/RoomEnvironment.js')]))
        .then(([THREE, { RoomEnvironment }]) => {
          const api = scene(THREE, RoomEnvironment, stage, canvas, reduced, index => selectTab(index));
          setMode = index => { selectTab(index); api.mode(index); };
        })
        .catch(() => {});
    }, { rootMargin: '120px' });
    visible.observe(stage);
  };
  // The poster already shows the character, so the live scene waits for the visitor's first interaction.
  // This keeps the first load light (and keeps page-speed tests that never interact free of 3D work).
  const events = ['pointermove', 'pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'];
  let started = false;
  const begin = () => { if (started) return; started = true; events.forEach(type => removeEventListener(type, begin, true)); start(); };
  events.forEach(type => addEventListener(type, begin, { capture: true, passive: true }));
}

// Visor rim colours (violet to periwinkle, close to the JPM lavender) and eye style, one per mode.
const MODES = [
  { key: 'game', rim: ['#8a63f2', '#5f86f5'], eyes: 'oval' },
  { key: 'touch', rim: ['#a46cf0', '#6f8cf7'], eyes: 'happy' },
  { key: 'led', rim: ['#c46ce6', '#7a6ff2'], eyes: 'pixel' },
  { key: 'sensor', rim: ['#6a78f0', '#4fb0e8'], eyes: 'ring' }
];
// Visor size on the sphere, in radians: width around the head, height, and centre (below pi/2 is above the equator).
const VISOR = { width: 1.95, height: 1.32, centre: 1.42 };
const TEX = { w: 1024, h: 680 };

function scene(THREE, RoomEnvironment, stage, canvas, reduced, onMode) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;

  const world = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  world.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 50);
  camera.position.set(0, 0.35, 9.4);
  camera.lookAt(0, 0.05, 0);

  const key = new THREE.DirectionalLight('#ffffff', 1.5); key.position.set(-3, 5, 4); world.add(key);
  const rim = new THREE.DirectionalLight('#c9ccf0', 1); rim.position.set(4, 1, -3); world.add(rim);

  const R = 1.32;
  const head = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.28, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.95 }));
  head.add(body);

  // The visor is a patch of a slightly larger sphere, so it wraps the head like a helmet screen.
  // Its canvas maps straight onto the patch: x runs around the head, y from top to bottom.
  const patch = scale => new THREE.SphereGeometry(R * scale, 96, 64, Math.PI / 2 - VISOR.width / 2, VISOR.width, VISOR.centre - VISOR.height / 2, VISOR.height);
  const layer = () => { const c = document.createElement('canvas'); c.width = TEX.w; c.height = TEX.h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, t }; };
  const rimTex = layer(), rimGlow = layer(), screenTex = layer(), screenGlow = layer();
  const rimMat = new THREE.MeshPhysicalMaterial({ map: rimTex.t, emissive: '#ffffff', emissiveMap: rimGlow.t, emissiveIntensity: 0.55, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true, depthWrite: false });
  const screenMat = new THREE.MeshPhysicalMaterial({ map: screenTex.t, emissive: '#ffffff', emissiveMap: screenGlow.t, emissiveIntensity: 1.5, roughness: 0.3, clearcoat: 0.4, clearcoatRoughness: 0.32, envMapIntensity: 0.22, transparent: true, depthWrite: false });
  const visorRim = new THREE.Mesh(patch(1.006), rimMat); visorRim.renderOrder = 1;
  const visorScreen = new THREE.Mesh(patch(1.016), screenMat); visorScreen.renderOrder = 2;
  head.add(visorRim, visorScreen);

  const base = { x: 0.08, y: -0.22 };
  head.rotation.set(base.x, base.y, 0);
  const group = new THREE.Group(); group.position.set(0, 0.08, 0); group.add(head); world.add(group);

  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 256;
  { const g = shadowCanvas.getContext('2d'); const r = g.createRadialGradient(128, 128, 0, 128, 128, 128); r.addColorStop(0, '#2b2d4566'); r.addColorStop(0.55, '#2b2d4522'); r.addColorStop(1, '#2b2d4500'); g.fillStyle = r; g.fillRect(0, 0, 256, 256); }
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, map: new THREE.CanvasTexture(shadowCanvas) }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.72; group.add(shadow);

  const state = { mode: 0, look: { x: 0, y: 0 }, eye: { x: 0, y: 0 }, blink: 0, nextBlink: performance.now() + 2500, squash: 0, dirty: true };

  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h); }
  // The patch squeezes x towards its sides, so shapes are drawn a little wide to read as round on the head.
  function drawEyes(g, colour) {
    const { eyes } = MODES[state.mode];
    const cx = TEX.w / 2 + state.eye.x * 120, cy = TEX.h * 0.47 + state.eye.y * 70, gap = 150;
    const open = 1 - state.blink;
    g.fillStyle = colour; g.strokeStyle = colour; g.lineCap = 'round'; g.lineJoin = 'round';
    for (const side of [-1, 1]) {
      const x = cx + side * gap;
      if (eyes === 'happy') {
        g.lineWidth = 34; g.beginPath(); g.arc(x, cy + 34, 62, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
      } else if (eyes === 'pixel') {
        const size = 34; for (let i = -1; i <= 1; i++) for (let j = -2; j <= 2; j++) { if (Math.abs(j) === 2 && i !== 0) continue; if (open < 0.5 && j !== 0) continue; g.fillRect(x + i * (size + 8) - size / 2, cy + j * (size + 8) - size / 2, size, size); }
      } else if (eyes === 'ring') {
        g.lineWidth = 22; g.beginPath(); g.ellipse(x, cy, 66, 66 * Math.max(open, 0.1), 0, 0, Math.PI * 2); g.stroke();
        g.beginPath(); g.ellipse(x, cy, 24, 24 * Math.max(open, 0.1), 0, 0, Math.PI * 2); g.fill();
      } else {
        g.beginPath(); g.ellipse(x, cy, 60, 92 * Math.max(open, 0.07), 0, 0, Math.PI * 2); g.fill();
      }
    }
  }
  // Rounded outline of the visor, inset by `pad` pixels on the canvas.
  const visorShape = (g, pad) => roundRect(g, pad, pad, TEX.w - pad * 2, TEX.h - pad * 2, TEX.h * 0.4 - pad * 0.6);
  function paint() {
    const { rim: colours } = MODES[state.mode];
    const gradient = g => { const r = g.createLinearGradient(0, TEX.h, TEX.w, 0); r.addColorStop(0, colours[0]); r.addColorStop(1, colours[1]); return r; };
    // Rim: the coloured band around the screen.
    let g = rimTex.c.getContext('2d');
    g.clearRect(0, 0, TEX.w, TEX.h); g.fillStyle = gradient(g); visorShape(g, 4); g.fill();
    g = rimGlow.c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, TEX.w, TEX.h); g.fillStyle = gradient(g); visorShape(g, 4); g.fill();
    // Screen: black glass with the eyes.
    g = screenTex.c.getContext('2d');
    g.clearRect(0, 0, TEX.w, TEX.h);
    const glass = g.createLinearGradient(0, 0, 0, TEX.h); glass.addColorStop(0, '#15151d'); glass.addColorStop(1, '#030305');
    g.fillStyle = glass; visorShape(g, 54); g.fill();
    g.save(); visorShape(g, 54); g.clip();
    const sheen = g.createLinearGradient(0, 40, 0, 220); sheen.addColorStop(0, '#ffffff1c'); sheen.addColorStop(1, '#ffffff00');
    g.fillStyle = sheen; g.beginPath(); g.ellipse(TEX.w * 0.42, 70, TEX.w * 0.36, 120, -0.08, 0, Math.PI * 2); g.fill();
    g.restore();
    drawEyes(g, '#ffffff');
    g = screenGlow.c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, TEX.w, TEX.h);
    g.save(); g.shadowColor = '#ffffff'; g.shadowBlur = 26; drawEyes(g, '#e4e6ff'); g.restore();
    for (const { t } of [rimTex, rimGlow, screenTex, screenGlow]) t.needsUpdate = true;
    state.dirty = false;
  }

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    state.dirty = true;
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  // The character watches the pointer anywhere on the page, measured from its own centre.
  // Each side is scaled by the room on that side, so the narrow right of the page turns the head as far as the wide left.
  addEventListener('pointermove', event => {
    const r = canvas.getBoundingClientRect();
    const cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.45;
    const dx = event.clientX - cx, dy = event.clientY - cy;
    state.look.x = Math.max(-1, Math.min(1, dx / Math.max(160, dx > 0 ? innerWidth - cx : cx)));
    state.look.y = Math.max(-1, Math.min(1, dy / Math.max(160, dy > 0 ? innerHeight - cy : cy)));
    wake();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { state.look.x = 0; state.look.y = 0; wake(); });

  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
  canvas.addEventListener('click', event => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.intersectObject(body).length) return;
    const next = (state.mode + 1) % MODES.length;
    mode(next); onMode(next);
  });
  canvas.style.cursor = 'pointer';

  function mode(index) { state.mode = index; state.squash = 1; state.dirty = true; wake(); }

  let running = false, onScreen = true, last = performance.now();
  const io = new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; if (onScreen) wake(); }, { threshold: 0 });
  io.observe(stage);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
  function wake() { if (!running && onScreen && !document.hidden) { running = true; last = performance.now() - 40; requestAnimationFrame(frame); } }

  function frame(now) {
    if (now - last < 31) { requestAnimationFrame(frame); return; } // about 30 fps is plenty for a floating character
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const still = reduced.matches;
    const ease = 1 - Math.pow(0.0015, dt);
    const prevEye = { ...state.eye };
    state.eye.x += (state.look.x * 0.7 - state.eye.x) * ease;
    state.eye.y += (state.look.y * 0.7 - state.eye.y) * ease;
    if (!still && now > state.nextBlink) { state.blink = Math.min(1, state.blink + dt * 14); if (state.blink >= 1) state.nextBlink = now + 2600 + Math.random() * 2600; }
    else if (state.blink > 0) state.blink = Math.max(0, state.blink - dt * 10);
    if (Math.abs(prevEye.x - state.eye.x) > 0.002 || Math.abs(prevEye.y - state.eye.y) > 0.002 || state.blink > 0) state.dirty = true;
    if (state.dirty) paint();

    const t = now / 1000;
    const bob = still ? 0 : Math.sin(t * 1.4) * 0.08;
    head.position.y = bob;
    // Turn up to the same angle either way, even though the resting pose already faces a little left.
    const turn = 0.62, yaw = base.y + state.look.x * (state.look.x > 0 ? turn - base.y : turn + base.y);
    head.rotation.y += (yaw - head.rotation.y) * ease;
    head.rotation.x += (base.x + state.look.y * 0.38 - head.rotation.x) * ease;
    head.rotation.z += (-state.look.x * 0.08 - head.rotation.z) * ease;
    state.squash = Math.max(0, state.squash - dt * 3.2);
    const s = 1 + Math.sin(state.squash * Math.PI) * 0.06;
    head.scale.set(s, 2 - s, s);
    shadow.material.opacity = 1 - bob * 2.5;
    shadow.scale.setScalar(1 - bob * 0.6);
    renderer.render(world, camera);
    if (!stage.classList.contains('is-live')) stage.classList.add('is-live');

    const settled = still && !state.dirty && Math.abs(state.look.x * 0.7 - state.eye.x) < 0.002 && Math.abs(state.look.y * 0.7 - state.eye.y) < 0.002 && state.squash === 0;
    if (!onScreen || document.hidden || settled) { running = false; return; }
    requestAnimationFrame(frame);
  }
  paint();
  wake();
  return { mode };
}
