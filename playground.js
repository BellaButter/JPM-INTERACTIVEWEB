import { setupCatchCustomization } from './catch-customization.js';
import { setupProductExplorer } from './product-explorer.js';
import { setupFogReveal } from './scratch-reveal.js';
const demoText = text => window.JPMI18n?.t(text) ?? text;
import { CatchEngine, normalizeConfig } from './catch-engine.mjs';

let rawConfig = {};
try { const response = await fetch(new URL('./game-config.json',import.meta.url)); if (response.ok) rawConfig = await response.json(); } catch { /* Use safe defaults when no config is available. */ }
const config = normalizeConfig(rawConfig);
const game = new CatchEngine(config);
const field = document.querySelector('#game-view');
const objectsLayer = document.querySelector('#game-objects');
const basket = document.querySelector('#game-basket');
const score = document.querySelector('#game-score');
const timer = document.querySelector('#game-time');
const overlay = document.querySelector('#game-overlay');
const startButton = document.querySelector('#game-start');
const pauseButton = document.querySelector('#game-pause');
const status = document.querySelector('#game-status');
const keys = new Set();
let heldDirection = 0, frame = 0, lastTime = 0, announcedCatch = 0, feedbackTimeout;
const legend=document.querySelector('#game-legend');
const feedback=document.querySelector('#game-feedback');
legend.querySelector('.legend-spark').textContent=config.objectImage?'✦':config.objectSymbol;
legend.querySelector('.legend-points').textContent='+'+config.pointsPerCatch;
legend.querySelector('.legend-penalty').textContent='−'+config.hazardPenalty;
document.querySelector('#game-brand').textContent = config.brandName.toUpperCase();
field.style.setProperty('--brand-light',config.accentColor);
document.querySelector('#game-overlay-text').textContent = demoText(`Catch falling sparks. You have ${config.durationSeconds} seconds.`);

function draw() {
  score.textContent = game.score;
  timer.textContent = Math.ceil(game.remaining);
  basket.style.left = `${game.basketX*100}%`;
  const activeIds = new Set(game.objects.map(object => String(object.id)));
  for (const node of [...objectsLayer.children]) if (!activeIds.has(node.dataset.id)) node.remove();
  for (const object of game.objects) {
    let node = objectsLayer.querySelector(`[data-id="${object.id}"]`);
    if (!node) {
      node = document.createElement('span'); node.className = 'falling-object'+(object.hazard?' falling-hazard':''); node.dataset.id = object.id;
      if(object.hazard)node.textContent='×';
      else if (config.objectImage) { const image = document.createElement('img'); image.src = config.objectImage; image.alt = ''; image.onerror = () => { node.textContent = config.objectSymbol; }; node.append(image); } else node.textContent = config.objectSymbol;
      objectsLayer.append(node);
    }
    node.style.left = `${object.x*100}%`; node.style.top = `${object.y*100}%`;
  }
  if (game.catchCount !== announcedCatch) {
    const hazard=game.lastCatch==='hazard';
    status.textContent=demoText(hazard?`Avoid the red objects! Score ${game.score}.`:`Caught! Score ${game.score}.`);
    feedback.textContent=hazard?demoText('Avoid')+' −'+config.hazardPenalty:'+'+config.pointsPerCatch;
    feedback.classList.toggle('is-hazard',hazard);feedback.hidden=false;
    clearTimeout(feedbackTimeout);feedbackTimeout=setTimeout(()=>{feedback.hidden=true;},900);
    announcedCatch=game.catchCount;
  }
}
function stopFrame() { cancelAnimationFrame(frame); frame = 0; keys.clear(); heldDirection = 0; }
function finish() {
  stopFrame(); catchCustomizer.lock(false); field.classList.remove('is-playing'); overlay.hidden = false; pauseButton.disabled = true;
  document.querySelector('#game-overlay-title').textContent = demoText('That’s a wrap.');
  document.querySelector('#game-overlay-text').textContent = demoText(`You scored ${game.score} points. Ready for another round?`);
  startButton.querySelector('.game-start-label').textContent = demoText('Play again');
  status.textContent = demoText(`Game over. Final score ${game.score} points.`);
  // Do not steal focus when the visitor has moved to another section.
  if (field.contains(document.activeElement) || document.activeElement === pauseButton) startButton.focus({preventScroll:true});
}
function animate(now) {
  if (game.state !== 'playing') return;
  const dt = Math.min((now-lastTime)/1000,.05); lastTime = now;
  const direction = (keys.has('ArrowRight') || keys.has('d') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('a') ? 1 : 0) + heldDirection;
  if (direction) game.move(game.basketX + Math.sign(direction)*dt*.85);
  game.tick(dt); draw();
  if (game.state === 'finished') finish(); else frame = requestAnimationFrame(animate);
}
function run(restart = false) {
  stopFrame();
  if (!restart && game.state === 'paused') game.resume(); else { game.start(); announcedCatch = 0; clearTimeout(feedbackTimeout);feedback.hidden=true; }
  catchCustomizer.lock(true);
  overlay.hidden = true; pauseButton.disabled = false; pauseButton.textContent = demoText('Pause'); field.classList.add('is-playing');
  field.focus({preventScroll:true}); lastTime = performance.now(); draw(); frame = requestAnimationFrame(animate);
  status.textContent = demoText('Game started. Catch sparks and avoid the red × objects.');
}
function pause() {
  if (game.state !== 'playing') return;
  game.pause(); stopFrame(); overlay.hidden = false; field.classList.remove('is-playing');
  document.querySelector('#game-overlay-title').textContent = demoText('Take a moment.');
  document.querySelector('#game-overlay-text').textContent = demoText(`Your score is ${game.score}. Resume when you’re ready.`);
  startButton.querySelector('.game-start-label').textContent = demoText('Resume game'); pauseButton.textContent = demoText('Resume'); status.textContent = demoText('Game paused.');
}
function configureCatch(next,uploadedImage=''){
 stopFrame();clearTimeout(feedbackTimeout);Object.assign(config,normalizeConfig(next));if(uploadedImage)config.objectImage=uploadedImage;game.reset();announcedCatch=0;feedback.hidden=true;field.classList.remove('is-playing');overlay.hidden=false;pauseButton.disabled=true;pauseButton.textContent=demoText('Pause');
 document.querySelector('#game-brand').textContent=config.brandName.toUpperCase();field.style.setProperty('--brand-light',config.accentColor);
 legend.querySelector('.legend-spark').replaceChildren();if(config.objectImage){const image=document.createElement('img');image.src=config.objectImage;image.alt=demoText('Your uploaded item');legend.querySelector('.legend-spark').append(image);}else legend.querySelector('.legend-spark').textContent=config.objectSymbol;legend.querySelector('.legend-points').textContent='+'+config.pointsPerCatch;legend.querySelector('.legend-penalty').textContent='−'+config.hazardPenalty;legend.children[1].hidden=config.hazardChance===0;document.querySelector('.game-rules').textContent=demoText('Catch')+' '+demoText(config.objectImage?'your uploaded image':config.objectSymbol)+'. '+demoText(config.hazardChance?'Avoid the red × objects.':'No forbidden items in this round.');
 document.querySelector('#game-overlay-title').textContent=demoText('Ready to play?');document.querySelector('#game-overlay-text').textContent=demoText('Collect')+' '+demoText(config.objectImage?'your uploaded image':config.objectSymbol)+' · '+config.durationSeconds+' '+demoText('seconds');startButton.querySelector('.game-start-label').textContent=demoText('Start game');
 catchCustomizer.lock(false);draw();status.textContent=demoText('Settings applied. Start the game when ready.');
}
const catchCustomizer=setupCatchCustomization({config,apply:configureCatch,stop:()=>configureCatch(config,config.objectImage.startsWith('blob:')?config.objectImage:''),t:demoText});catchCustomizer.lock(false);
startButton.addEventListener('click',()=>run());
document.querySelector('#game-restart').addEventListener('click',()=>run(true));
pauseButton.addEventListener('click',()=>game.state === 'paused' ? run() : pause());
field.addEventListener('keydown',event=> {
  if (event.target !== field) return;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (['ArrowLeft','ArrowRight','a','d'].includes(key)) { event.preventDefault(); keys.add(key); }
  if (event.code === 'Space' && !event.repeat) { event.preventDefault(); if(game.state === 'playing') pause(); else run(); }
  if (key === 'Escape') pause();
});
window.addEventListener('keyup',event=>keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key));
field.addEventListener('blur',()=>keys.clear());
function pointerMove(event) { if (game.state !== 'playing') return; const rect=field.getBoundingClientRect(); game.move((event.clientX-rect.left)/rect.width); draw(); }
field.addEventListener('pointermove',pointerMove);
field.addEventListener('pointerdown',event=> { if(game.state!=='playing') return; field.setPointerCapture(event.pointerId); field.focus({preventScroll:true}); pointerMove(event); });
for (const [id,direction] of [['game-left',-1],['game-right',1]]) {
  const control = document.getElementById(id);
  control.addEventListener('pointerdown',event=> { heldDirection=direction; control.setPointerCapture(event.pointerId); });
  control.addEventListener('pointerup',()=>heldDirection=0);
  control.addEventListener('pointercancel',()=>heldDirection=0);
  control.addEventListener('click',event=> { if(event.detail===0) { game.move(game.basketX+direction*.1); draw(); } });
}
document.addEventListener('visibilitychange',()=> { if(document.hidden) pause(); });
window.addEventListener('blur',()=> { keys.clear(); heldDirection=0; });
new ResizeObserver(()=> { game.catchWidth=Math.min(.32,70/field.getBoundingClientRect().width); game.move(game.basketX); draw(); }).observe(field);
draw();

setupFogReveal(demoText);

setupProductExplorer(demoText);
