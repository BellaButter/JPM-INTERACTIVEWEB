// Home hero: the JPM cube as a 3D character (Three.js, vendored in vendor/three).
// J on the left face, P on top (as in the logo) and a screen face with eyes that follow the pointer.
// Click or tap the cube, or use the mode tabs, to switch between Game, Touchscreen, LED and Sensor.
// Three.js loads only after the page has painted, only when WebGL works and the hero is on screen.
// The poster image stays visible until the first frame renders, so the hero never looks empty.

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
        .then(THREE => Promise.all([THREE, import('./vendor/three/RoundedBoxGeometry.js'), import('./vendor/three/RoomEnvironment.js'), document.fonts?.load('800 300px Manrope').catch(() => {})]))
        .then(([THREE, { RoundedBoxGeometry }, { RoomEnvironment }]) => {
          const api = scene(THREE, RoundedBoxGeometry, RoomEnvironment, stage, canvas, reduced, index => selectTab(index));
          setMode = index => { selectTab(index); api.mode(index); };
        })
        .catch(() => {});
    }, { rootMargin: '120px' });
    visible.observe(stage);
  };
  // The poster already shows the cube, so the live scene waits for the visitor's first interaction.
  // This keeps the first load light (and keeps page-speed tests that never interact free of 3D work).
  const events = ['pointermove', 'pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'];
  let started = false;
  const begin = () => { if (started) return; started = true; events.forEach(type => removeEventListener(type, begin, true)); start(); };
  events.forEach(type => addEventListener(type, begin, { capture: true, passive: true }));
}

// Brand palette: slate and lavender from the JPM CI, one pair per mode.
const MODES = [
  { key: 'game', glow: ['#a7aaf0', '#6d7099'], eyes: 'happy' },
  { key: 'touch', glow: ['#bfcaf4', '#6d7099'], eyes: 'round' },
  { key: 'led', glow: ['#cbb9f2', '#7a6fb3'], eyes: 'pixel' },
  { key: 'sensor', glow: ['#a9d4e6', '#5f7aa0'], eyes: 'ring' }
];
const INK = '#16161c';

function scene(THREE, RoundedBoxGeometry, RoomEnvironment, stage, canvas, reduced, onMode) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;

  const world = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  world.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0.4, 9.4);
  camera.lookAt(0, 0.05, 0);

  const key = new THREE.DirectionalLight('#ffffff', 1.4); key.position.set(-3, 5, 4); world.add(key);
  const rim = new THREE.DirectionalLight('#c9ccf0', 0.9); rim.position.set(4, 1, -3); world.add(rim);

  const font = getComputedStyle(document.body).fontFamily.includes('Manrope') ? 'Manrope' : 'Arial';
  const texture = draw => { const c = document.createElement('canvas'); c.width = c.height = 512; draw(c.getContext('2d'), 512); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const letterFace = (letter, rotate = 0) => texture((g, s) => {
    const grad = g.createLinearGradient(0, 0, s, s); grad.addColorStop(0, '#fbfbfd'); grad.addColorStop(1, '#e8e8ef');
    g.fillStyle = grad; g.fillRect(0, 0, s, s);
    g.save(); g.translate(s / 2, s / 2); g.rotate(rotate);
    g.fillStyle = INK; g.font = `800 ${s * 0.62}px ${font}, Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(letter, 0, s * 0.03); g.restore();
  });
  const plain = texture((g, s) => { g.fillStyle = '#f1f1f6'; g.fillRect(0, 0, s, s); });

  // Screen face: drawn on a canvas each time the eyes move or the mode changes.
  const screen = document.createElement('canvas'); screen.width = screen.height = 512;
  const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 512;
  const screenMap = new THREE.CanvasTexture(screen); screenMap.colorSpace = THREE.SRGBColorSpace;
  const glowMap = new THREE.CanvasTexture(glowCanvas); glowMap.colorSpace = THREE.SRGBColorSpace;

  const body = { color: '#ffffff', roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 0.9 };
  const mat = map => new THREE.MeshPhysicalMaterial({ ...body, map });
  const screenMat = new THREE.MeshPhysicalMaterial({ ...body, envMapIntensity: 0.22, clearcoat: 0.7, roughness: 0.38, map: screenMap, emissive: '#ffffff', emissiveMap: glowMap, emissiveIntensity: 1.4 });
  // Face order: +x, -x, +y, -y, +z, -z.
  const materials = [mat(plain), mat(letterFace('J')), mat(letterFace('P', Math.PI / 2)), mat(plain), screenMat, mat(plain)];
  const cube = new THREE.Mesh(new RoundedBoxGeometry(2, 2, 2, 6, 0.3), materials);
  const base = { x: 0.36, y: 0.44 };
  cube.rotation.set(base.x, base.y, 0);
  const group = new THREE.Group(); group.position.x = -0.3; group.add(cube); world.add(group);

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, map: texture((g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); r.addColorStop(0, '#2b2d4566'); r.addColorStop(0.55, '#2b2d4522'); r.addColorStop(1, '#2b2d4500');
    g.fillStyle = r; g.fillRect(0, 0, s, s);
  }) }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.75; group.add(shadow);

  const state = { mode: 0, look: { x: 0, y: 0 }, eye: { x: 0, y: 0 }, blink: 0, nextBlink: performance.now() + 2500, squash: 0, dirty: true };

  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h); }
  function drawEyes(g, colour, glow) {
    const { eyes } = MODES[state.mode];
    const cx = 256 + state.eye.x * 52, cy = 262 + state.eye.y * 34, gap = 74;
    const open = 1 - state.blink;
    g.fillStyle = colour; g.strokeStyle = colour; g.lineCap = 'round';
    for (const side of [-1, 1]) {
      const x = cx + side * gap;
      if (eyes === 'happy') {
        g.lineWidth = 26; g.beginPath(); g.arc(x, cy + 18, 40, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
      } else if (eyes === 'pixel') {
        const size = 26; for (let i = -1; i <= 1; i++) for (let j = -2; j <= 2; j++) { if (Math.abs(j) === 2 && i !== 0) continue; if (open < 0.5 && j !== 0) continue; g.fillRect(x + i * (size + 6) - size / 2, cy + j * (size + 6) - size / 2, size, size); }
      } else if (eyes === 'ring') {
        g.lineWidth = 16; g.beginPath(); g.ellipse(x, cy, 46, 46 * Math.max(open, 0.1), 0, 0, Math.PI * 2); g.stroke();
        g.beginPath(); g.ellipse(x, cy, 16, 16 * Math.max(open, 0.1), 0, 0, Math.PI * 2); g.fill();
      } else {
        const h = 120 * Math.max(open, 0.08); roundRect(g, x - 34, cy - h / 2, 68, h, 34); g.fill();
      }
    }
    if (glow) { g.globalCompositeOperation = 'source-over'; }
  }
  function paint() {
    const { glow } = MODES[state.mode];
    // Base colour layer.
    let g = screen.getContext('2d');
    g.clearRect(0, 0, 512, 512);
    const shell = g.createLinearGradient(0, 0, 512, 512); shell.addColorStop(0, '#fbfbfd'); shell.addColorStop(1, '#e9e9f0');
    g.fillStyle = shell; g.fillRect(0, 0, 512, 512);
    const ring = g.createLinearGradient(40, 40, 472, 472); ring.addColorStop(0, glow[0]); ring.addColorStop(1, glow[1]);
    g.fillStyle = ring; roundRect(g, 46, 70, 420, 372, 92); g.fill();
    const panel = g.createLinearGradient(0, 80, 0, 440); panel.addColorStop(0, '#111118'); panel.addColorStop(1, '#030305');
    g.fillStyle = panel; roundRect(g, 60, 84, 392, 344, 80); g.fill();
    g.fillStyle = '#ffffff0c'; roundRect(g, 78, 98, 280, 54, 36); g.fill();
    drawEyes(g, '#f4f4ff');
    // Emissive layer: glowing rim and eyes only.
    g = glowCanvas.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, 512, 512);
    g.save(); g.shadowColor = glow[0]; g.shadowBlur = 24; g.strokeStyle = glow[0]; g.lineWidth = 9; roundRect(g, 52, 76, 408, 360, 88); g.stroke(); g.restore();
    g.save(); g.shadowColor = '#ffffff'; g.shadowBlur = 18; drawEyes(g, '#d9dcff'); g.restore();
    screenMap.needsUpdate = true; glowMap.needsUpdate = true; state.dirty = false;
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

  stage.addEventListener('pointermove', event => {
    const r = stage.getBoundingClientRect();
    state.look.x = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1));
    state.look.y = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1));
    wake();
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { state.look.x = 0; state.look.y = 0; wake(); });

  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
  canvas.addEventListener('click', event => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.intersectObject(cube).length) return;
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
    if (now - last < 31) { requestAnimationFrame(frame); return; } // about 30 fps is plenty for a floating cube
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const still = reduced.matches;
    const ease = 1 - Math.pow(0.0015, dt);
    const prevEye = { ...state.eye };
    state.eye.x += (state.look.x - state.eye.x) * ease;
    state.eye.y += (state.look.y - state.eye.y) * ease;
    if (!still && now > state.nextBlink) { state.blink = Math.min(1, state.blink + dt * 14); if (state.blink >= 1) state.nextBlink = now + 2600 + Math.random() * 2600; }
    else if (state.blink > 0) state.blink = Math.max(0, state.blink - dt * 10);
    if (Math.abs(prevEye.x - state.eye.x) > 0.002 || Math.abs(prevEye.y - state.eye.y) > 0.002 || state.blink > 0) state.dirty = true;
    if (state.dirty) paint();

    const t = now / 1000;
    const bob = still ? 0 : Math.sin(t * 1.4) * 0.07;
    cube.position.y = bob;
    cube.rotation.y += (base.y + state.look.x * 0.32 - cube.rotation.y) * ease;
    cube.rotation.x += (base.x + state.look.y * 0.18 - cube.rotation.x) * ease;
    state.squash = Math.max(0, state.squash - dt * 3.2);
    const s = 1 + Math.sin(state.squash * Math.PI) * 0.06;
    cube.scale.set(s, 2 - s, s);
    shadow.material.opacity = 1 - bob * 2.5;
    shadow.scale.setScalar(1 - bob * 0.6);
    renderer.render(world, camera);
    if (!stage.classList.contains('is-live')) stage.classList.add('is-live');

    const settled = still && !state.dirty && Math.abs(state.look.x - state.eye.x) < 0.002 && Math.abs(state.look.y - state.eye.y) < 0.002 && state.squash === 0;
    if (!onScreen || document.hidden || settled) { running = false; return; }
    requestAnimationFrame(frame);
  }
  paint();
  wake();
  return { mode };
}
