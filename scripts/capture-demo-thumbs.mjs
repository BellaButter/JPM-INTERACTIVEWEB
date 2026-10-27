// Captures a real screenshot of each Playground game for the demo library cards (EN and TH).
// Usage: start the preview (npm start), then: node scripts/capture-demo-thumbs.mjs
// Needs Google Chrome. Set CHROME_PATH if it is not in the default Windows location.
// Output: assets/playground/<demo-id>.webp and assets/playground/th/<demo-id>.webp (640 px wide).
import { spawn } from 'node:child_process';
import { mkdir, writeFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333, WIDTH = 640;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
// Each demo: the element to capture and a short script that puts the game in an "in play" state.
const DEMOS = [
  ['catch-game', '#game-view', `document.querySelector('#game-start')?.click(); await wait(4200);`],
  ['tap-game', '.custom-game-preview', `document.querySelector('#builder-activate')?.click(); await wait(1600);`],
  ['matching-game', '.matching-preview', `document.querySelector('#match-start').click(); await wait(300); const cards=[...document.querySelectorAll('#match-cards button')]; cards[0]?.click(); cards[3]?.click(); await wait(250);`],
  ['lucky-wheel', '.wheel-stage', `const box=document.querySelector('#wheel-signup'); box.checked=false; box.dispatchEvent(new Event('change')); await wait(200);`],
  ['quiz-game', '.quiz-stage', `document.querySelector('#quiz-start').click(); await wait(2500);`],
  ['scratch-reveal', '.scratch-stage', `document.querySelector('#scratch-reveal-button')?.click(); await wait(1400);`],
  ['product-explorer', '#product-explorer .catalog-carousel', `await wait(600);`],
  ['atmosphere-room', '.atmosphere-scene', `await wait(1500);`],
  ['sensor-trigger', '.rfid-display', `document.querySelector('.rfid-product')?.click(); await wait(200); document.querySelector('#rfid-reader')?.click(); await wait(900);`],
  ['light-canvas', '.light-stage', `const c=document.querySelector('#light-drawing'), r=c.getBoundingClientRect(); const ev=(type,x,y)=>c.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:1,pointerType:'mouse',isPrimary:true,buttons:type==='pointerup'?0:1,clientX:r.left+x*r.width,clientY:r.top+y*r.height}));
    for (const [y0,amp] of [[.35,.12],[.62,.1]]) { ev('pointerdown',.08,y0); for (let i=1;i<=40;i++) ev('pointermove',.08+i*.021,y0+Math.sin(i/4)*amp); ev('pointerup',.92,y0); } await wait(300);`]
];

const profile = await mkdtemp(path.join(tmpdir(), 'jpm-thumbs-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
try {
  let target;
  for (let i = 0; i < 40 && !target; i++) { await wait(250); target = await fetch(`http://127.0.0.1:${PORT}/json/list`).then(r => r.json()).then(list => list.find(t => t.type === 'page')).catch(() => null); }
  if (!target) throw new Error('Chrome did not start');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0; const pending = new Map();
  socket.onmessage = ({ data }) => { const message = JSON.parse(data); if (pending.has(message.id)) { const { resolve, reject } = pending.get(message.id); pending.delete(message.id); message.error ? reject(new Error(message.error.message)) : resolve(message.result); } };
  const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); socket.send(JSON.stringify({ id: n, method, params })); });
  const evaluate = async expression => (await send('Runtime.evaluate', { expression: `(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));${expression}})()`, awaitPromise: true, returnByValue: true })).result.value;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  for (const lang of ['', 'th/']) {
    await mkdir(new URL(`../assets/playground/${lang}`, import.meta.url), { recursive: true });
    for (const [demo, selector, prepare] of DEMOS) {
      await send('Page.navigate', { url: `${BASE}/${lang}playground.html#${demo}` });
      await wait(2200);
      await evaluate(`document.head.insertAdjacentHTML('beforeend','<style>.reveal{opacity:1!important;transform:none!important;animation:none!important}html{scroll-behavior:auto!important}</style>'); document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center'}); await wait(400); ${prepare}`);
      const rect = await evaluate(`const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height};`);
      const shot = await send('Page.captureScreenshot', { format: 'webp', quality: 82, captureBeyondViewport: true, clip: { ...rect, scale: WIDTH / rect.width } });
      await writeFile(new URL(`../assets/playground/${lang}${demo}.webp`, import.meta.url), Buffer.from(shot.data, 'base64'));
      console.log(`${lang || 'en/'}${demo}: ${Math.round(rect.width)}x${Math.round(rect.height)}`);
    }
  }
  socket.close();
} finally {
  chrome.kill();
}
