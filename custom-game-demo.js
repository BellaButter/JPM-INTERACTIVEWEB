import { demoStarted } from './demo-measurement.js';
import {setupItemUpload} from './item-upload.js';
import {icon,overlayMascot,pop as kitPop,shake,confetti,lowTime,sound} from './game-kit.js';
export function setupCustomGame(t){
 const brand=document.querySelector('#builder-brand'),item=document.querySelector('#builder-item'),color=document.querySelector('#builder-color'),duration=document.querySelector('#builder-duration'),goal=document.querySelector('#builder-goal');
 const speed=document.querySelector('#builder-speed'),controls=[brand,item,color,duration,goal,speed],preview=document.querySelector('.builder-preview'),grid=document.querySelector('#builder-items'),overlay=document.querySelector('#builder-overlay'),board=document.querySelector('.custom-game-board');
 const start=document.querySelector('#builder-activate'),pause=document.querySelector('#builder-pause'),stop=document.querySelector('#builder-stop'),status=document.querySelector('#builder-status');
 const title=document.querySelector('#builder-result-title'),copy=document.querySelector('#builder-result-copy'),progress=document.querySelector('#builder-progress');
 const symbols={spark:'✦',heart:'♥',gem:'◆'},names={spark:'Stars',heart:'Hearts',gem:'Diamonds'},reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let state='ready',score=0,remaining=15,deadline=0,interval=0,activeItem='spark',activeGoal=8,particles=new Set(),roundDuration=15,nextSpawn=0,lastHole=-1;
 const live=new Map(),speeds={easy:{life:1300,gap:900},normal:{life:850,gap:600},fast:{life:550,gap:400}};
 const upload=setupItemUpload('builder',{t,onChange:settings,onBusy:value=>{start.disabled=value;}});
 // Game kit look (2026-10-27): drawn items, arcade holes, the mascot on the start/result screen.
 const ICON_FOR={spark:'star',heart:'heart',gem:'gem'},setMood=overlayMascot(overlay);
 const cells=Array.from({length:6},()=>{const button=document.createElement('button');button.type='button';button.className='custom-game-item';grid.append(button);return button;});
 function clearParticles(){for(const particle of particles){clearTimeout(particle.timer);particle.node.remove();}particles.clear();}
 function setState(next){state=next;preview.dataset.state=next;const playing=next==='playing'||next==='paused';controls.forEach(control=>control.disabled=playing||(control===item&&!!upload.url));upload.setDisabled(playing);pause.disabled=stop.disabled=!playing;pause.textContent=t(next==='paused'?'Resume round':'Pause round');cells.forEach(cell=>cell.disabled=next!=='playing'||!live.has(cell));}
 function drawHUD(){document.querySelector('#builder-count').textContent=score;document.querySelector('#builder-time').textContent=Math.ceil(remaining);lowTime(document.querySelector('#builder-time'),state==='playing'?Math.ceil(remaining):0);document.querySelector('#builder-goal-display').textContent=activeGoal;progress.max=activeGoal;progress.value=score;}
 function cellItem(button,type){button.dataset.item=type;button.replaceChildren();const character=document.createElement('span');character.className='pop-character';if(type==='upload'){const image=document.createElement('img');image.src=upload.url;image.alt='';character.append(image);}else character.innerHTML=icon(ICON_FOR[type]);button.append(character);button.classList.add('is-up');button.setAttribute('aria-label',(cells.indexOf(button)+1)+' · '+t('Item:')+' '+t(type==='upload'?'Your uploaded item':names[type]));}
 function hideCell(button){live.delete(button);button.dataset.item='empty';button.replaceChildren();button.classList.remove('is-up');button.disabled=true;button.setAttribute('aria-label',t('Empty hole')+' '+(cells.indexOf(button)+1));}
 function clearLive(){cells.forEach(hideCell);nextSpawn=0;lastHole=-1;}
 const elapsed=()=>Math.max(0,(roundDuration-remaining)*1000);
 function spawnWave(){
  const profile=speeds[speed.value];let empty=cells.filter(cell=>!live.has(cell));
  const show=type=>{if(!empty.length)return;let choices=empty.filter(cell=>cells.indexOf(cell)!==lastHole);if(!choices.length)choices=empty;const button=choices[Math.floor(Math.random()*choices.length)];lastHole=cells.indexOf(button);cellItem(button,type);button.disabled=false;live.set(button,{expires:elapsed()+profile.life});empty=empty.filter(cell=>cell!==button);};
  show(activeItem);show(otherItem());nextSpawn=elapsed()+profile.gap;
 }
 function otherItem(){const others=Object.keys(symbols).filter(type=>type!==activeItem);return others[Math.floor(Math.random()*others.length)];}
 function fill(){cells.forEach((cell,i)=>cellItem(cell,i%2===0?activeItem:otherItem()));}
 function settings(){
  clearInterval(interval);clearParticles();clearLive();score=0;remaining=roundDuration=Number(duration.value);activeItem=upload.url?'upload':item.value;activeGoal=Number(goal.value);
  document.querySelector('#builder-preview-brand').textContent=brand.value.trim()||t('Your brand');preview.dataset.color=color.value;
  const instruction=document.querySelector('#builder-instruction');instruction.replaceChildren(document.createTextNode(t('Collect')+' '));if(upload.url){const image=document.createElement('img');image.src=upload.url;image.alt=t('Your uploaded item');instruction.append(image);}else{const art=document.createElement('span');art.className='inline-icon';art.innerHTML=icon(ICON_FOR[activeItem]);art.setAttribute('role','img');art.setAttribute('aria-label',t(names[activeItem]));instruction.append(art);}instruction.append(document.createTextNode(' '+activeGoal+' '+t('items')+' '+t('within')+' '+remaining+' '+t('seconds')));
  setMood('ready');title.textContent=t('Ready to play?');copy.textContent=t('Items pop up briefly. Tap the target before it disappears.');start.textContent=t('Play your game');overlay.hidden=false;setState('ready');fill();drawHUD();
 }
 function finish(won){
  clearInterval(interval);setState(won?'won':'timeup');overlay.hidden=false;setMood(won?'happy':'sad');if(won){confetti(preview);sound.play('win');}else sound.play('lose');title.textContent=t(won?'You reached the goal!':'Time is up!');
  copy.textContent=t('Collected')+' '+score+' / '+activeGoal+' '+t('items');start.textContent=t('Play again');drawHUD();
  status.textContent=t(won?'Goal reached. This is your brand’s game result.':'Time is up. Try again or change your game settings.');
 }
 function tick(){if(state!=='playing')return;remaining=Math.max(0,(deadline-performance.now())/1000);drawHUD();if(remaining===0){finish(false);return;}for(const [button,pop] of live)if(elapsed()>=pop.expires)hideCell(button);if(elapsed()>=nextSpawn)spawnWave();}
 function run(){
  if(state==='paused'){deadline=performance.now()+remaining*1000;setState('playing');}
  else{demoStarted('tap-game');clearParticles();clearLive();score=0;remaining=roundDuration=Number(duration.value);activeItem=upload.url?'upload':item.value;activeGoal=Number(goal.value);deadline=performance.now()+remaining*1000;setState('playing');spawnWave();}
  overlay.hidden=true;drawHUD();clearInterval(interval);interval=setInterval(tick,50);status.textContent=t('Tap the target as it pops up. Use the mouse, touch, or keys 1–6.');board.focus({preventScroll:true});
 }
 function pauseRound(){if(state!=='playing')return;tick();if(state!=='playing')return;clearInterval(interval);setState('paused');overlay.hidden=false;setMood('sleep');title.textContent=t('Round paused');copy.textContent=t('Your time and collected items are saved for this round.');start.textContent=t('Resume round');status.textContent=t('Round paused');}
 function pop(button,correct){
  if(!reduced.matches)button.animate(correct?[{transform:'scale(.8)',opacity:.5},{transform:'scale(1)',opacity:1}]:[{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:220});
  const a=button.getBoundingClientRect(),b=grid.getBoundingClientRect();kitPop(grid,a.left-b.left+a.width/2,a.top-b.top+a.height/3,correct?'+1':t('Try another item'),correct?'good':'bad');
  if(correct)sound.play('good');else{shake(board);sound.play('bad');}
 }
 function hit(button,keyboard=false){
  if(state!=='playing')return;tick();if(state!=='playing')return;
  if(!live.has(button))return;
  if(button.dataset.item!==activeItem){pop(button,false);hideCell(button);status.textContent=t('That is not the selected item. Look for')+' '+(activeItem==='upload'?t('your uploaded image'):symbols[activeItem]);if(keyboard)board.focus({preventScroll:true});return;}
  score++;pop(button,true);hideCell(button);drawHUD();
  if(score>=activeGoal)finish(true);else status.textContent=t('Collected')+' '+score+' / '+activeGoal;
  if(keyboard)board.focus({preventScroll:true});
 }
 cells.forEach(button=>button.addEventListener('click',event=>hit(button,event.detail===0)));
 board.addEventListener('keydown',event=>{if(/^[1-6]$/.test(event.key)&&!event.repeat){event.preventDefault();hit(cells[Number(event.key)-1],true);}});
 controls.forEach(control=>control.addEventListener('input',settings));start.addEventListener('click',run);pause.addEventListener('click',()=>state==='paused'?run():pauseRound());
 stop.addEventListener('click',()=>{settings();document.querySelector('#tap-customization').open=true;status.textContent=t('Round ended. Change your settings and try again.');});
 document.querySelector('#builder-reset').addEventListener('click',()=>{upload.clear(false);brand.value='';item.value='spark';color.value='violet';duration.value='15';goal.value='8';speed.value='normal';settings();status.textContent=t('Settings reset. Create a new game.');});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseRound();});settings();
}
