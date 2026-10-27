// Home hero light field: a grid of points like an LED wall or interactive floor.
// Points drift on a slow wave, gather light around the pointer, and a tap or click
// sends a ripple across the field. Static when reduced motion is requested.
const hero = document.querySelector('.page-home .arcade-hero');
const canvas = hero?.querySelector('.hero-field');
if (hero && canvas && canvas.getContext) {
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const SPACING = 26;
  let width = 0, height = 0, dpr = 1, points = [], ripples = [];
  let pointer = { x: -9999, y: -9999, active: false, strength: 0 };
  // Colour follows the pointer: blue toward the left, violet in the middle, magenta toward the right.
  const BASE_HUE = 238;
  let hue = BASE_HUE, hueTarget = BASE_HUE;
  const hueAt = (x, y) => 205 + Math.min(1, Math.max(0, x / width)) * 120 + (Math.min(1, Math.max(0, y / height)) - 0.5) * 24;
  let running = false, visible = true, frame = 0, last = 0;

  function resize() {
    const box = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(box.width));
    height = Math.max(1, Math.round(box.height));
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
    const cols = Math.ceil(width / SPACING) + 1, rows = Math.ceil(height / SPACING) + 1;
    const offsetX = (width - (cols - 1) * SPACING) / 2, offsetY = (height - (rows - 1) * SPACING) / 2;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) points.push({ x: offsetX + c * SPACING, y: offsetY + r * SPACING, seed: (c * 12.9898 + r * 78.233) % 6.283 });
    if (!running) draw(performance.now());
  }

  function draw(now) {
    const t = now / 1000;
    ctx.clearRect(0, 0, width, height);
    pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.08;
    hueTarget = pointer.active ? hueAt(pointer.x, pointer.y) : BASE_HUE;
    hue += (hueTarget - hue) * 0.06;
    hero.style.setProperty('--field-hue', hue.toFixed(1));
    ripples = ripples.filter(rp => now - rp.start < 2600);
    for (const p of points) {
      // Slow travelling wave, stronger toward the right so the copy on the left stays calm.
      const side = Math.min(1, Math.max(0.25, p.x / width * 1.4));
      const wave = Math.sin(p.x * 0.012 + t * 0.9 + Math.cos(p.y * 0.015 - t * 0.6)) * 0.5 + 0.5;
      let glow = 0.07 + wave * 0.24 * side;
      let dx = 0, dy = 0, lit = 0, litHue = hue;
      const px = p.x - pointer.x, py = p.y - pointer.y, dist = Math.hypot(px, py);
      if (pointer.strength > 0.01 && dist < 190) {
        const f = (1 - dist / 190) ** 2 * pointer.strength;
        glow += f * 0.85; lit = Math.max(lit, f);
        dx += (px / (dist || 1)) * f * 7; dy += (py / (dist || 1)) * f * 7;
      }
      for (const rp of ripples) {
        const age = (now - rp.start) / 1000, radius = age * 340, band = Math.abs(Math.hypot(p.x - rp.x, p.y - rp.y) - radius);
        if (band < 34) { const f = (1 - band / 34) * Math.max(0, 1 - age / 2.6); glow += f * 0.95; dy -= f * 3; if (f > lit) { lit = f; litHue = rp.hue; } }
      }
      glow = Math.min(1, glow);
      const size = 1 + glow * 2.2;
      // Idle points carry a faint tint of the current hue; points lit by the pointer or a ripple take its full colour.
      const sat = 16 + Math.min(1, lit * 1.6) * 64, light = glow > 0.45 ? 82 : 66;
      ctx.fillStyle = `hsla(${(lit > 0.05 ? litHue : hue).toFixed(0)}, ${sat.toFixed(0)}%, ${light}%, ${Math.min(1, glow + 0.08).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(p.x + dx, p.y + dy, size, 0, 6.283); ctx.fill();
    }
  }

  function loop(now) {
    if (!running) return;
    if (now - last > 30) { draw(now); last = now; }
    frame = requestAnimationFrame(loop);
  }
  function start() { if (running || reduced.matches || !visible || document.hidden) return; running = true; frame = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(frame); }

  function local(event) { const box = hero.getBoundingClientRect(); return { x: event.clientX - box.left, y: event.clientY - box.top }; }
  hero.addEventListener('pointermove', event => { const p = local(event); pointer.x = p.x; pointer.y = p.y; pointer.active = event.pointerType !== 'touch'; hero.style.setProperty('--mx', p.x + 'px'); hero.style.setProperty('--my', p.y + 'px'); hero.classList.add('field-hover'); });
  hero.addEventListener('pointerleave', () => { pointer.active = false; hero.classList.remove('field-hover'); });
  hero.addEventListener('pointerdown', event => {
    if (reduced.matches || event.target.closest('a, button')) return;
    const p = local(event);
    ripples.push({ x: p.x, y: p.y, start: performance.now(), hue: hueAt(p.x, p.y) });
    if (ripples.length > 6) ripples.shift();
    hero.classList.add('field-touched');
  });

  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; visible ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  reduced.addEventListener('change', () => { if (reduced.matches) { stop(); draw(performance.now()); } else start(); });
  resize();
  hero.classList.add('field-ready');
  start();
}
