import { demoStarted } from './demo-measurement.js';
import {overlayMascot,pop,shake,confetti,lowTime,sound} from './game-kit.js';
// Shape Hunt (owner idea 2026-11-24): "Tap every pink circle" among look-alikes. Each board has a few targets;
// clearing them all gives a bonus and deals a new board. +10 per right shape, +20 per cleared board, -5 per wrong tap
// (never below zero). The first board always asks for pink circles. The timer pauses while the tab is hidden.
const COLORS={pink:'#ff5fa2',blue:'#4fa8ff',yellow:'#ffd23f',green:'#3ddc84'};
const COLOR_NAMES={pink:'Pink',blue:'Blue',yellow:'Yellow',green:'Green'};
const SHAPES={
 circle:c=>`<circle r="38" fill="${c}"/>`,
 square:c=>`<rect x="-34" y="-34" width="68" height="68" rx="8" fill="${c}"/>`,
 triangle:c=>`<path d="M0-40L40 32H-40z" fill="${c}" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>`,
 star:c=>`<path d="M0-42l12 26 28 3-21 19 6 28L0 20l-25 14 6-28-21-19 28-3z" fill="${c}" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`
};
const SHAPE_NAMES={circle:'circle',square:'square',triangle:'triangle',star:'star'};
const LEVELS={easy:{items:8,targets:3,near:.5},normal:{items:12,targets:4,near:.75},hard:{items:16,targets:5,near:1}};
const COLS=5,ROWS=4;
const pick=list=>list[Math.floor(Math.random()*list.length)];
const shuffle=list=>{for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;};

export function setupShapeHunt(t){
 const $=selector=>document.querySelector(selector);
 const stage=$('.shape-stage');if(!stage)return;
 const brand=$('#shape-brand'),color=$('#shape-color'),duration=$('#shape-duration'),level=$('#shape-level'),mode=$('#shape-target-mode'),resetButton=$('#shape-reset-settings');
 const board=$('#shape-board'),prompt=$('#shape-prompt'),overlay=$('#shape-overlay'),start=$('#shape-start'),stop=$('#shape-stop'),status=$('#shape-status'),best=$('#shape-best');
 const settings=[brand,color,duration,level,mode,resetButton];
 const fill=(text,values)=>Object.entries(values).reduce((out,[key,value])=>out.replaceAll('{'+key+'}',value),t(text));
 const setMood=overlayMascot(overlay);
 const name=(c,s)=>fill('{color} {shape}',{color:t(COLOR_NAMES[c]).toLowerCase(),shape:t(SHAPE_NAMES[s])});
 let state='ready',score=0,boards=0,wrong=0,remaining=30,deadline=0,timer=0,target=null,left=0,boardNumber=0,bestScore=0,nextBoard=0;

 function svg(c,s){return `<svg viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">${SHAPES[s](COLORS[c])}</svg>`;}
 function preview(){$('#shape-brand-preview').textContent=brand.value.trim()||t('Your brand');stage.dataset.color=color.value;}
 function hud(){$('#shape-board-number').textContent=Math.max(1,boardNumber);$('#shape-score').textContent=score;$('#shape-time').textContent=Math.ceil(remaining);lowTime($('#shape-time'),state==='playing'?Math.ceil(remaining):0);}
 function setState(next){state=next;stage.dataset.state=next;const busy=next==='playing';settings.forEach(control=>control.disabled=busy);stop.disabled=!busy;}
 function showPrompt(){
  prompt.replaceChildren();
  const icon=document.createElement('span');icon.className='shape-prompt-icon';icon.innerHTML=svg(target.c,target.s);
  const text=document.createElement('span');text.textContent=fill('Tap every {target}',{target:name(target.c,target.s)});
  const count=document.createElement('span');count.className='shape-left';count.textContent=fill('{n} left',{n:left});
  prompt.append(icon,text,count);
 }
 function deal(){
  boardNumber++;
  const rules=LEVELS[level.value]||LEVELS.normal;
  const first=boardNumber===1||mode.value==='fixed';
  target=first?{c:'pink',s:'circle'}:{c:pick(Object.keys(COLORS)),s:pick(Object.keys(SHAPES))};
  const items=[];for(let i=0;i<rules.targets;i++)items.push({...target,hit:true});
  while(items.length<rules.items){
   let c,s;
   if(Math.random()<rules.near){if(Math.random()<.5){c=target.c;s=pick(Object.keys(SHAPES).filter(x=>x!==target.s));}else{s=target.s;c=pick(Object.keys(COLORS).filter(x=>x!==target.c));}}
   else{c=pick(Object.keys(COLORS).filter(x=>x!==target.c));s=pick(Object.keys(SHAPES).filter(x=>x!==target.s));}
   items.push({c,s,hit:false});
  }
  const cells=shuffle([...Array(COLS*ROWS).keys()]);
  board.replaceChildren();left=rules.targets;
  shuffle(items).forEach((item,i)=>{
   const cell=cells[i],x=(cell%COLS+.5+(Math.random()-.5)*.35)/COLS*100,y=(Math.floor(cell/COLS)+.5+(Math.random()-.5)*.3)/ROWS*100;
   const shape=document.createElement('button');shape.type='button';shape.className='shape-item';
   shape.style.left=x+'%';shape.style.top=y+'%';shape.style.setProperty('--tilt',(item.s==='circle'?0:Math.round((Math.random()-.5)*40))+'deg');shape.style.animationDelay=(i*25)+'ms, '+(Math.random()*2).toFixed(2)+'s';
   shape.innerHTML=svg(item.c,item.s);shape.setAttribute('aria-label',name(item.c,item.s));
   shape.addEventListener('click',()=>tap(shape,item.hit));
   board.append(shape);
  });
  stage.classList.toggle('shape-float',level.value==='hard');
  showPrompt();hud();
  status.textContent=fill('Board {n}: tap every {target}.',{n:boardNumber,target:name(target.c,target.s)});
 }
 function at(el){const a=el.getBoundingClientRect(),b=board.getBoundingClientRect();return [a.left-b.left+a.width/2,a.top-b.top];}
 function tap(shape,hit){
  if(state!=='playing'||shape.disabled)return;
  const [x,y]=at(shape);
  if(hit){
   shape.disabled=true;shape.classList.add('is-found');score+=10;left--;pop(board,x,y,'+10');sound.play('good');
   if(left<=0){score+=20;boards++;pop(board,board.clientWidth/2,board.clientHeight/2-20,t('Board clear!')+' +20');sound.play('win');setState('playing');clearTimeout(nextBoard);nextBoard=setTimeout(()=>{if(state==='playing')deal();},450);}
   else showPrompt();
  }else{
   wrong++;score=Math.max(0,score-5);shape.classList.remove('is-wrong');void shape.offsetWidth;shape.classList.add('is-wrong');shake(board);pop(board,x,y,'−5','bad');sound.play('bad');
   status.textContent=t('Wrong shape. −5 points.');
  }
  hud();
 }
 function run(){clearInterval(timer);timer=setInterval(()=>{remaining=Math.max(0,(deadline-performance.now())/1000);hud();if(remaining<=0)finish();},100);}
 function finish(){
  clearInterval(timer);clearTimeout(nextBoard);setState('result');overlay.hidden=false;board.querySelectorAll('.shape-item').forEach(shape=>shape.disabled=true);
  bestScore=Math.max(bestScore,score);
  const good=boards>=2;setMood(good?'happy':'sad');if(good){confetti(stage);sound.play('win');}else sound.play('lose');
  $('#shape-result').textContent=fill('{score} points',{score});
  $('#shape-result-copy').textContent=fill('{boards} boards cleared · {wrong} wrong taps',{boards,wrong});
  best.textContent=fill('Best this visit: {best}',{best:bestScore});best.hidden=false;
  start.textContent=t('Play again');status.textContent=fill('Round over: {score} points.',{score});
 }
 function begin(){
  demoStarted('shape-hunt');
  clearTimeout(nextBoard);score=0;boards=0;wrong=0;boardNumber=0;remaining=Number(duration.value);overlay.hidden=true;setState('playing');
  deal();deadline=performance.now()+remaining*1000;run();
  board.querySelector('.shape-item')?.focus({preventScroll:true});
 }
 function reset(message){
  clearInterval(timer);clearTimeout(nextBoard);score=0;boardNumber=0;remaining=Number(duration.value);setState('ready');overlay.hidden=false;setMood('ready');
  $('#shape-result').textContent=t('Ready to play?');$('#shape-result-copy').textContent=t('Find the shapes the game asks for. Look out for look-alikes.');
  start.textContent=t('Start game');board.replaceChildren();prompt.replaceChildren();stage.classList.remove('shape-float');hud();if(message)status.textContent=message;
 }
 start.addEventListener('click',begin);
 stop.addEventListener('click',()=>reset(t('Round ended. You can change the settings now.')));
 document.addEventListener('visibilitychange',()=>{if(state!=='playing')return;if(document.hidden)clearInterval(timer);else{deadline=performance.now()+remaining*1000;run();}});
 [brand,color].forEach(control=>control.addEventListener('input',preview));
 duration.addEventListener('change',()=>{remaining=Number(duration.value);hud();});
 resetButton.addEventListener('click',()=>{brand.value='';color.value='violet';duration.value='30';level.value='normal';mode.value='change';preview();reset();});
 preview();reset();
}
