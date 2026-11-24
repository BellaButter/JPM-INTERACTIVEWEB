import { demoStarted } from './demo-measurement.js';
import {overlayMascot,pop,shake,confetti,lowTime,sound} from './game-kit.js';
// Shape Hunt (owner idea 2026-11-24): "Tap every pink circle" among look-alikes. Each board has a few targets;
// clearing them all gives a bonus and deals a new board. +10 per right shape, +20 per cleared board, -5 per wrong tap
// (never below zero). The first board always asks for pink circles. The timer pauses while the tab is hidden.
// Hand mode (owner request 2026-11-24): the camera feed fills the board, MediaPipe Hand Landmarker finds index fingertips
// on this device, and holding a fingertip on a shape for DWELL ms taps it. Nothing from the camera leaves the browser.
// If the camera or the tracker is unavailable the round continues in tap mode.
const COLORS={pink:'#ff5fa2',blue:'#4fa8ff',yellow:'#ffd23f',green:'#3ddc84'};
const COLOR_NAMES={pink:'Pink',blue:'Blue',yellow:'Yellow',green:'Green'};
const SHAPES={
 circle:c=>`<circle r="38" fill="${c}"/>`,
 square:c=>`<rect x="-34" y="-34" width="68" height="68" rx="8" fill="${c}"/>`,
 triangle:c=>`<path d="M0-40L40 32H-40z" fill="${c}" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>`,
 star:c=>`<path d="M0-42l12 26 28 3-21 19 6 28L0 20l-25 14 6-28-21-19 28-3z" fill="${c}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`
};
const SHAPE_NAMES={circle:'circle',square:'square',triangle:'triangle',star:'star'};
// Tap mode uses a 5 x 4 grid; hand mode uses bigger shapes on a 4 x 3 grid, so fewer of them.
const LEVELS={easy:{items:8,targets:3,near:.5},normal:{items:12,targets:4,near:.75},hard:{items:16,targets:5,near:1}};
const HAND_LEVELS={easy:{items:6,targets:2,near:.5},normal:{items:8,targets:3,near:.75},hard:{items:10,targets:4,near:1}};
const DWELL=220;
const VISION='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const HAND_MODEL='https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const pick=list=>list[Math.floor(Math.random()*list.length)];
const shuffle=list=>{for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;};

export function setupShapeHunt(t){
 const $=selector=>document.querySelector(selector);
 const stage=$('.shape-stage');if(!stage)return;
 const brand=$('#shape-brand'),color=$('#shape-color'),duration=$('#shape-duration'),level=$('#shape-level'),mode=$('#shape-target-mode'),resetButton=$('#shape-reset-settings');
 const board=$('#shape-board'),prompt=$('#shape-prompt'),overlay=$('#shape-overlay'),start=$('#shape-start'),startTap=$('#shape-start-tap'),stop=$('#shape-stop'),status=$('#shape-status'),best=$('#shape-best');
 const settings=[brand,color,duration,level,mode,resetButton];
 const fill=(text,values)=>Object.entries(values).reduce((out,[key,value])=>out.replaceAll('{'+key+'}',value),t(text));
 const setMood=overlayMascot(overlay);
 const name=(c,s)=>fill('{color} {shape}',{color:t(COLOR_NAMES[c]).toLowerCase(),shape:t(SHAPE_NAMES[s])});
 let state='ready',score=0,boards=0,wrong=0,remaining=30,deadline=0,timer=0,target=null,left=0,boardNumber=0,bestScore=0,nextBoard=0;

 // Camera layer: mirrored video behind the shapes, one cursor per detected hand, and a hint when no hand is seen.
 const video=document.createElement('video');video.className='shape-video';video.muted=true;video.playsInline=true;video.setAttribute('aria-hidden','true');
 const cursors=[0,1].map(()=>{const dot=document.createElement('span');dot.className='shape-cursor';dot.hidden=true;return dot;});
 const hint=document.createElement('p');hint.className='shape-hand-hint';hint.hidden=true;
 let play='hand',stream=null,landmarker=null,loop=0,lastSeen=0,aim=new Map(),testPoints=null;

 function svg(c,s){return `<svg viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">${SHAPES[s](COLORS[c])}</svg>`;}
 function preview(){$('#shape-brand-preview').textContent=brand.value.trim()||t('Your brand');stage.dataset.color=color.value;}
 function hud(){$('#shape-board-number').textContent=Math.max(1,boardNumber);$('#shape-score').textContent=score;$('#shape-time').textContent=Math.ceil(remaining);lowTime($('#shape-time'),state==='playing'?Math.ceil(remaining):0);}
 function setState(next){state=next;stage.dataset.state=next;const busy=next==='playing'||next==='loading';settings.forEach(control=>control.disabled=busy);stop.disabled=!busy;start.disabled=startTap.disabled=next==='loading';}
 function showPrompt(){
  prompt.replaceChildren();
  const icon=document.createElement('span');icon.className='shape-prompt-icon';icon.innerHTML=svg(target.c,target.s);
  const text=document.createElement('span');text.textContent=fill('Tap every {target}',{target:name(target.c,target.s)});
  const count=document.createElement('span');count.className='shape-left';count.textContent=fill('{n} left',{n:left});
  prompt.append(icon,text,count);
 }
 function deal(){
  boardNumber++;aim.clear();
  const hand=play==='hand',rules=(hand?HAND_LEVELS:LEVELS)[level.value]||LEVELS.normal,cols=hand?4:5,rows=hand?3:4;
  const first=boardNumber===1||mode.value==='fixed';
  target=first?{c:'pink',s:'circle'}:{c:pick(Object.keys(COLORS)),s:pick(Object.keys(SHAPES))};
  const items=[];for(let i=0;i<rules.targets;i++)items.push({...target,hit:true});
  while(items.length<rules.items){
   let c,s;
   if(Math.random()<rules.near){if(Math.random()<.5){c=target.c;s=pick(Object.keys(SHAPES).filter(x=>x!==target.s));}else{s=target.s;c=pick(Object.keys(COLORS).filter(x=>x!==target.c));}}
   else{c=pick(Object.keys(COLORS).filter(x=>x!==target.c));s=pick(Object.keys(SHAPES).filter(x=>x!==target.s));}
   items.push({c,s,hit:false});
  }
  const cells=shuffle([...Array(cols*rows).keys()]);
  board.querySelectorAll('.shape-item').forEach(item=>item.remove());left=rules.targets;
  shuffle(items).forEach((item,i)=>{
   const cell=cells[i],x=(cell%cols+.5+(Math.random()-.5)*.35)/cols*100,y=(Math.floor(cell/cols)+.5+(Math.random()-.5)*.3)/rows*100;
   const shape=document.createElement('button');shape.type='button';shape.className='shape-item';
   shape.style.left=x+'%';shape.style.top=y+'%';shape.style.setProperty('--tilt',(item.s==='circle'?0:Math.round((Math.random()-.5)*40))+'deg');shape.style.animationDelay=(i*25)+'ms, '+(Math.random()*2).toFixed(2)+'s';
   shape.innerHTML=svg(item.c,item.s);shape.setAttribute('aria-label',name(item.c,item.s));shape.dataset.hit=item.hit?'1':'';
   shape.addEventListener('click',()=>tap(shape,item.hit));
   board.append(shape);
  });
  stage.classList.toggle('shape-float',level.value==='hard'&&!hand);
  showPrompt();hud();
  status.textContent=fill('Board {n}: tap every {target}.',{n:boardNumber,target:name(target.c,target.s)});
 }
 function at(el){const a=el.getBoundingClientRect(),b=board.getBoundingClientRect();return [a.left-b.left+a.width/2,a.top-b.top];}
 function tap(shape,hit){
  if(state!=='playing'||shape.disabled)return;
  const [x,y]=at(shape);shape.classList.remove('is-aiming');
  if(hit){
   shape.disabled=true;shape.classList.add('is-found');score+=10;left--;pop(board,x,y,'+10');sound.play('good');
   if(left<=0){score+=20;boards++;pop(board,board.clientWidth/2,board.clientHeight/2-20,t('Board clear!')+' +20');sound.play('win');clearTimeout(nextBoard);nextBoard=setTimeout(()=>{if(state==='playing')deal();},450);}
   else showPrompt();
  }else{
   wrong++;score=Math.max(0,score-5);shape.classList.remove('is-wrong');void shape.offsetWidth;shape.classList.add('is-wrong');shake(board);pop(board,x,y,'−5','bad');sound.play('bad');
   status.textContent=t('Wrong shape. −5 points.');
  }
  hud();
 }

 // ---- Hand mode ----
 async function openCamera(){
  if(!navigator.mediaDevices?.getUserMedia)throw new Error('no camera');
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:960},height:{ideal:720}},audio:false});
  video.srcObject=stream;await video.play();
 }
 async function loadTracker(){
  if(landmarker)return;
  let vision;try{vision=await import(VISION+'/vision_bundle.mjs');}catch(error){stage.dataset.tracker='failed';throw error;}
  const {FilesetResolver,HandLandmarker}=vision;
  const files=await FilesetResolver.forVisionTasks(VISION+'/wasm');
  const options=delegate=>({baseOptions:{modelAssetPath:HAND_MODEL,delegate},runningMode:'VIDEO',numHands:2});
  stage.dataset.tracker='loading';
  try{landmarker=await HandLandmarker.createFromOptions(files,options('GPU'));}
  catch{try{landmarker=await HandLandmarker.createFromOptions(files,options('CPU'));}catch(error){stage.dataset.tracker='failed';throw error;}}
  stage.dataset.tracker='ready';
 }
 // Why the camera did not start, in words the player can act on.
 function cameraMessage(error){
  const name=error?.name||'';
  if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)return t('This browser window cannot use the camera. Open the page in Chrome or Safari.');
  if(name==='NotAllowedError'||name==='SecurityError')return t('Camera access was blocked. Allow the camera in the address bar, then try again.');
  if(name==='NotFoundError'||name==='OverconstrainedError')return t('No camera was found on this device.');
  if(name==='NotReadableError')return t('The camera is in use by another app. Close it and try again.');
  if(stage.dataset.tracker==='failed')return t('Hand tracking could not load. Check the internet connection and try again.');
  return t('Camera unavailable. Playing by tapping instead.');
 }
 function closeCamera(){
  cancelAnimationFrame(loop);loop=0;stream?.getTracks().forEach(track=>track.stop());stream=null;video.srcObject=null;
  board.classList.remove('is-camera');cursors.forEach(dot=>dot.hidden=true);hint.hidden=true;aim.clear();board.querySelectorAll('.is-aiming').forEach(s=>s.classList.remove('is-aiming'));
 }
 // Fingertip (0..1, camera coordinates) -> board pixels, matching the mirrored, object-fit: cover video.
 function toBoard(p){
  const W=board.clientWidth,H=board.clientHeight,vw=video.videoWidth||4,vh=video.videoHeight||3,s=Math.max(W/vw,H/vh);
  return [(1-p.x)*vw*s-(vw*s-W)/2,p.y*vh*s-(vh*s-H)/2];
 }
 function track(now){
  loop=requestAnimationFrame(track);
  let points=testPoints;
  if(!points){
   if(!landmarker||video.readyState<2)return;
   try{points=landmarker.detectForVideo(video,now).landmarks.map(hand=>toBoard(hand[8]));}catch{return;}
  }
  cursors.forEach((dot,i)=>{const p=points[i];dot.hidden=!p;if(p){dot.style.left=p[0]+'px';dot.style.top=p[1]+'px';}});
  if(points.length)lastSeen=now;
  hint.hidden=state!=='playing'||now-lastSeen<1200;
  if(state!=='playing')return;
  // Each fingertip aims at the nearest shape within reach only, so a finger between two shapes never taps both.
  const rect=board.getBoundingClientRect(),shapes=[...board.querySelectorAll('.shape-item:not(:disabled)')].map(shape=>{const r=shape.getBoundingClientRect();return {shape,x:r.left-rect.left+r.width/2,y:r.top-rect.top+r.height/2,reach:r.width*.6};});
  const aimed=new Set(points.map(([x,y])=>{let best=null,dist=Infinity;for(const s of shapes){const d=Math.hypot(x-s.x,y-s.y);if(d<s.reach&&d<dist){best=s.shape;dist=d;}}return best;}).filter(Boolean));
  shapes.forEach(({shape})=>{
   const inside=aimed.has(shape);
   // A wrong shape counts once per visit: the finger has to leave it before it can count again.
   if(!inside){aim.delete(shape);shape.classList.remove('is-aiming');delete shape.dataset.cool;return;}
   if(shape.dataset.cool)return;
   if(!aim.has(shape)){aim.set(shape,now);shape.classList.add('is-aiming');}
   else if(now-aim.get(shape)>=DWELL){aim.delete(shape);shape.dataset.cool='1';tap(shape,shape.dataset.hit==='1');}
  });
 }

 function run(){clearInterval(timer);timer=setInterval(()=>{remaining=Math.max(0,(deadline-performance.now())/1000);hud();if(remaining<=0)finish();},100);}
 function finish(){
  clearInterval(timer);clearTimeout(nextBoard);setState('result');overlay.hidden=false;board.querySelectorAll('.shape-item').forEach(shape=>shape.disabled=true);closeCamera();
  bestScore=Math.max(bestScore,score);
  const good=boards>=2;setMood(good?'happy':'sad');if(good){confetti(stage);sound.play('win');}else sound.play('lose');
  $('#shape-result').textContent=fill('{score} points',{score});
  $('#shape-result-copy').textContent=fill('{boards} boards cleared · {wrong} wrong taps',{boards,wrong});
  best.textContent=fill('Best this visit: {best}',{best:bestScore});best.hidden=false;
  start.textContent=t('Play again with your hand');startTap.textContent=t('Play again by tapping');status.textContent=fill('Round over: {score} points.',{score});
 }
 async function begin(choice){
  demoStarted('shape-hunt');
  clearTimeout(nextBoard);play=choice;let fallback='';
  if(choice==='hand'){
   setState('loading');$('#shape-result').textContent=t('Starting the camera…');$('#shape-result-copy').textContent=t('Allow camera access when your browser asks.');best.hidden=true;
   try{
    await openCamera();
    $('#shape-result').textContent=t('Loading hand tracking…');$('#shape-result-copy').textContent=t('This takes a few seconds the first time.');
    await loadTracker();
    board.classList.add('is-camera');lastSeen=performance.now();cancelAnimationFrame(loop);loop=requestAnimationFrame(track);
   }catch(error){
    closeCamera();play='tap';fallback=cameraMessage(error);
   }
   if(state!=='loading'){closeCamera();return;}
  }
  score=0;boards=0;wrong=0;boardNumber=0;remaining=Number(duration.value);overlay.hidden=true;setState('playing');
  deal();deadline=performance.now()+remaining*1000;run();
  if(play==='tap'){board.querySelector('.shape-item')?.focus({preventScroll:true});if(fallback)status.textContent=fallback+' '+t('Playing by tapping for now.');}
  else status.textContent=fill('Board {n}: point at every {target}.',{n:boardNumber,target:name(target.c,target.s)});
 }
 function reset(message){
  clearInterval(timer);clearTimeout(nextBoard);closeCamera();score=0;boardNumber=0;remaining=Number(duration.value);setState('ready');overlay.hidden=false;setMood('ready');best.hidden=true;
  $('#shape-result').textContent=t('Ready to play?');$('#shape-result-copy').textContent=t('Find the shapes the game asks for. Look out for look-alikes.');
  start.textContent=t('Play with your hand (camera)');startTap.textContent=t('Play by tapping');board.querySelectorAll('.shape-item').forEach(item=>item.remove());prompt.replaceChildren();stage.classList.remove('shape-float');hud();if(message)status.textContent=message;
 }
 board.prepend(video);board.append(...cursors,hint);hint.textContent=t('Show your hand to the camera.');
 start.addEventListener('click',()=>begin('hand'));
 startTap.addEventListener('click',()=>begin('tap'));
 stop.addEventListener('click',()=>reset(t('Round ended. You can change the settings now.')));
 document.addEventListener('visibilitychange',()=>{if(state!=='playing')return;if(document.hidden)clearInterval(timer);else{deadline=performance.now()+remaining*1000;run();}});
 [brand,color].forEach(control=>control.addEventListener('input',preview));
 duration.addEventListener('change',()=>{remaining=Number(duration.value);hud();});
 resetButton.addEventListener('click',()=>{brand.value='';color.value='violet';duration.value='30';level.value='normal';mode.value='change';preview();reset();});
 // Test hook for browser checks without a camera: shapeHuntTest([[x,y],...]) feeds fingertip positions in board pixels.
 window.shapeHuntTest=points=>{testPoints=points;if(points&&!loop){board.classList.add('is-camera');loop=requestAnimationFrame(track);}};
 preview();reset();
}
