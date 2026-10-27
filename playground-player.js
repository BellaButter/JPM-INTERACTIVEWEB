import { sound } from './game-kit.js';
// Playground player (2026-10-27): shows one demo at a time with previous/next controls instead of ten stacked sections.
// Without JavaScript every demo stays visible. Links to #<demo-id> (cards, other pages, FAQ) open that demo.
const t=text=>window.JPMI18n?.t(text)??text;
const sections=[...document.querySelectorAll('main .demo-section[id]')];
if(sections.length>1){
 const names=new Map(sections.map(section=>{const card=document.querySelector(`.library-card a[href="#${section.id}"]`);return [section.id,card?.closest('.library-card')?.querySelector('h3')?.textContent.trim()||section.querySelector('h2')?.textContent.trim()||section.id];}));
 // Pause buttons start with their "pause" label; a running game is paused when the player moves on.
 const pauses=[...document.querySelectorAll('#game-pause,#builder-pause,#match-pause')];pauses.forEach(button=>button.dataset.pauseLabel=button.textContent);
 const bar=document.createElement('nav');bar.className='demo-player-bar';bar.setAttribute('aria-label',t('Choose a demo'));
 bar.innerHTML='<button type="button" class="pill demo-player-prev"></button><p class="demo-player-now"><span class="demo-player-count"></span><strong></strong></p><button type="button" class="pill demo-player-next"></button><a class="demo-player-all" href="#demo-library"></a>';
 // Sound effects for the games: off until the visitor turns them on (game-kit.js remembers the choice).
 const soundButton=document.createElement('button');soundButton.type='button';soundButton.className='pill demo-sound';bar.append(soundButton);
 sound.onChange(on=>{soundButton.textContent=t(on?'Sound on':'Sound off');soundButton.setAttribute('aria-pressed',String(on));});
 soundButton.addEventListener('click',()=>sound.set(!sound.on));
 const prev=bar.querySelector('.demo-player-prev'),next=bar.querySelector('.demo-player-next');
 bar.querySelector('.demo-player-all').textContent=t('All demos');
 let current=-1;
 function pauseIn(section){
  section.querySelectorAll('#game-pause,#builder-pause,#match-pause').forEach(button=>{if(!button.disabled&&button.textContent===button.dataset.pauseLabel)button.click();});
  const quizStop=section.querySelector('#quiz-stop');if(quizStop&&!quizStop.disabled)quizStop.click();
 }
 function label(button,index,text){const name=names.get(sections[index].id);button.textContent=`${text} · ${name}`;button.setAttribute('aria-label',`${text}: ${name}`);}
 function activate(index,{scroll=false,focus=false}={}){
  index=(index+sections.length)%sections.length;
  if(current>=0&&current!==index)pauseIn(sections[current]);
  sections.forEach((section,i)=>section.hidden=i!==index);current=index;
  const section=sections[index];section.before(bar);
  bar.querySelector('.demo-player-count').textContent=t('Game {n} of {total}').replace('{n}',index+1).replace('{total}',sections.length);
  bar.querySelector('strong').textContent=names.get(section.id);
  label(prev,(index-1+sections.length)%sections.length,t('Previous'));label(next,(index+1)%sections.length,t('Next'));
  document.querySelectorAll('.library-card').forEach(card=>card.classList.toggle('is-current',card.querySelector('a')?.getAttribute('href')===`#${section.id}`));
  dispatchEvent(new Event('resize'));
  if(scroll)bar.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  if(focus)section.querySelector('h2')?.setAttribute('tabindex','-1'),section.querySelector('h2')?.focus({preventScroll:true});
 }
 const indexOf=id=>sections.findIndex(section=>section.id===id);
 prev.addEventListener('click',()=>{activate(current-1,{scroll:true});history.replaceState(null,'',`#${sections[current].id}`);});
 next.addEventListener('click',()=>{activate(current+1,{scroll:true});history.replaceState(null,'',`#${sections[current].id}`);});
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');if(!link)return;
  const index=indexOf(link.getAttribute('href').slice(1));if(index<0)return;
  event.preventDefault();activate(index,{scroll:true,focus:true});history.replaceState(null,'',`#${sections[index].id}`);
 });
 addEventListener('hashchange',()=>{const index=indexOf(location.hash.slice(1));if(index>=0)activate(index,{scroll:true});});
 const start=indexOf(location.hash.slice(1));
 activate(start>=0?start:0,{scroll:start>=0});
}
