import { demoStarted } from './demo-measurement.js';
import {overlayMascot,pop,shake,confetti,lowTime,sound} from './game-kit.js';
// Quick Quiz demo: four timed questions, 100 points per correct answer plus 10 per second left,
// and a leaderboard kept in memory for this visit only. The timer pauses while the tab is hidden.
const DEFAULT_QUESTIONS=[
 ['Which fragrance is inspired by a morning on the coast?',['Coast','Grove','Dusk'],0],
 ['Which notes belong to Grove?',['Citrus · sea breeze · soft musk','Green leaves · cedarwood · moss','Amber · vanilla · sandalwood'],1],
 ['Which fragrance suits a slower evening?',['Coast','Grove','Dusk'],2],
 ['How many fragrances are in the sample collection?',['Two','Three','Four'],1]
];
export function setupQuizGame(t){
 const $=selector=>document.querySelector(selector);
 const stage=$('.quiz-stage');if(!stage)return;
 const brand=$('#quiz-brand'),color=$('#quiz-color'),duration=$('#quiz-duration'),edit=$('#quiz-edit'),question=$('#quiz-question'),answers=[0,1,2].map(i=>$('#quiz-answer-'+i)),correct=$('#quiz-correct');
 const prompt=$('#quiz-prompt'),choices=$('#quiz-answers'),overlay=$('#quiz-overlay'),start=$('#quiz-start'),stop=$('#quiz-stop'),save=$('#quiz-save'),board=$('#quiz-leaderboard'),status=$('#quiz-status'),bar=$('#quiz-timer-bar');
 const settings=[brand,color,duration,edit,question,...answers,correct,$('#quiz-reset-settings')];
 const fill=(text,values)=>Object.entries(values).reduce((out,[key,value])=>out.replace('{'+key+'}',value),t(text));
 const setMood=overlayMascot(overlay);
 let questions=[],state='ready',current=0,score=0,right=0,remaining=15,deadline=0,timer=0,next=0,leaders=[],saved=false;
 function defaults(){questions=DEFAULT_QUESTIONS.map(([q,a,c])=>({q:t(q),a:a.map(t),c}));brand.value='';color.value='violet';duration.value='15';edit.value='0';load();}
 function load(){const item=questions[Number(edit.value)];question.value=item.q;answers.forEach((input,i)=>input.value=item.a[i]);correct.value=String(item.c);}
 function store(){const item=questions[Number(edit.value)];item.q=question.value.trim()||item.q;answers.forEach((input,i)=>item.a[i]=input.value.trim()||item.a[i]);item.c=Number(correct.value);}
 function preview(){$('#quiz-brand-preview').textContent=brand.value.trim()||t('Your brand');stage.dataset.color=color.value;}
 function hud(){$('#quiz-index').textContent=Math.min(current+1,questions.length);$('#quiz-total').textContent=questions.length;$('#quiz-score').textContent=score;$('#quiz-time').textContent=Math.ceil(remaining);lowTime($('#quiz-time'),state==='playing'?Math.ceil(remaining):0);bar.style.transform=`scaleX(${Math.max(0,remaining/Number(duration.value))})`;}
 function setState(next){state=next;stage.dataset.state=next;const busy=next==='playing'||next==='feedback';settings.forEach(control=>control.disabled=busy);stop.disabled=!busy;}
 function render(){
  const item=questions[current];prompt.textContent=item.q;choices.replaceChildren();
  item.a.forEach((text,i)=>{const option=document.createElement('button');option.type='button';option.className='quiz-answer';option.dataset.index=String(i);const key=document.createElement('span');key.className='quiz-key';key.textContent=String(i+1);option.append(key,document.createTextNode(text));option.addEventListener('click',()=>answer(i));choices.append(option);});
  remaining=Number(duration.value);deadline=performance.now()+remaining*1000;hud();run();
 }
 function run(){clearInterval(timer);timer=setInterval(()=>{remaining=Math.max(0,(deadline-performance.now())/1000);hud();if(remaining<=0)answer(-1);},100);}
 function answer(index){
  if(state!=='playing')return;clearInterval(timer);setState('feedback');
  const item=questions[current],ok=index===item.c,gained=ok?100+Math.ceil(remaining)*10:0;score+=gained;if(ok)right++;
  choices.querySelectorAll('.quiz-answer').forEach(option=>{const i=Number(option.dataset.index);option.disabled=true;option.classList.toggle('is-correct',i===item.c);option.classList.toggle('is-wrong',i===index&&!ok);});
  {const button=choices.querySelector(`[data-index="${ok?index:item.c}"]`),a=button?.getBoundingClientRect(),b=choices.getBoundingClientRect();if(ok&&a)pop(choices,a.right-b.left-50,a.top-b.top+a.height/2,'+'+gained);if(!ok)shake(choices);sound.play(ok?'good':'bad');}
  status.textContent=ok?fill('Correct! +{points} points.',{points:gained}):index<0?fill('Time’s up. The answer was {answer}.',{answer:item.a[item.c]}):fill('Not quite. The answer was {answer}.',{answer:item.a[item.c]});
  hud();next=setTimeout(()=>{current++;if(current<questions.length){setState('playing');render();}else finish();},1100);
 }
 function leaderboard(){board.replaceChildren(...leaders.slice(0,5).map(entry=>{const row=document.createElement('li');const name=document.createElement('span');name.textContent=entry.name;const points=document.createElement('strong');points.textContent=entry.score;row.append(name,points);return row;}));board.hidden=!leaders.length;}
 function finish(){
  clearInterval(timer);setState('result');overlay.hidden=false;saved=false;
  const good=right>=Math.ceil(questions.length/2);setMood(good?'happy':'sad');if(good){confetti(stage);sound.play('win');}else sound.play('lose');
  $('#quiz-result').textContent=fill('{score} points',{score});$('#quiz-result-copy').textContent=fill('{right} of {total} correct.',{right,total:questions.length});
  save.hidden=false;save.reset();leaderboard();start.textContent=t('Play again');status.textContent=fill('Round over: {score} points.',{score});
 }
 function begin(){
  demoStarted('quick-quiz');
  store();clearTimeout(next);current=0;score=0;right=0;overlay.hidden=true;save.hidden=true;board.hidden=true;setState('playing');status.textContent=t('Choose an answer before the timer runs out.');render();
  choices.querySelector('.quiz-answer')?.focus({preventScroll:true});
 }
 function reset(message){clearInterval(timer);clearTimeout(next);current=0;score=0;remaining=Number(duration.value);setState('ready');overlay.hidden=false;setMood('ready');save.hidden=true;leaderboard();$('#quiz-result').textContent=t('Ready to play?');$('#quiz-result-copy').textContent=t('Answer 4 questions. Faster answers score more points.');start.textContent=t('Start quiz');prompt.textContent='';choices.replaceChildren();hud();if(message)status.textContent=message;}
 save.addEventListener('submit',event=>{event.preventDefault();if(saved)return;saved=true;const name=$('#quiz-player').value.trim()||fill('Player {n}',{n:leaders.length+1});leaders.push({name,score});leaders.sort((a,b)=>b.score-a.score);save.hidden=true;leaderboard();status.textContent=fill('{name} saved with {score} points.',{name,score});});
 start.addEventListener('click',begin);
 stop.addEventListener('click',()=>reset(t('Round ended. You can edit the quiz now.')));
 document.addEventListener('keydown',event=>{if(state!=='playing'||!/^[1-3]$/.test(event.key)||event.target.closest?.('input,select,textarea'))return;const rect=stage.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;event.preventDefault();answer(Number(event.key)-1);});
 document.addEventListener('visibilitychange',()=>{if(state!=='playing')return;if(document.hidden)clearInterval(timer);else{deadline=performance.now()+remaining*1000;run();}});
 edit.addEventListener('change',load);
 [question,...answers,correct].forEach(control=>control.addEventListener('input',store));
 [brand,color].forEach(control=>control.addEventListener('input',preview));
 duration.addEventListener('change',()=>{remaining=Number(duration.value);hud();});
 $('#quiz-reset-settings').addEventListener('click',()=>{defaults();preview();reset();});
 defaults();preview();reset();
}
