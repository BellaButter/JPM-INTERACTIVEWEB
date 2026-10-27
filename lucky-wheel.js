// Lucky Wheel demo: weighted prizes, optional sign-up with PDPA consent, and a running player summary.
// Player details stay in memory only; nothing is stored or sent.
export const DEFAULT_PRIZES=[['Tote bag',1],['10% discount',3],['Sticker set',5],['Free drink',3],['Keychain',3],['Try again',5]];
export const PALETTES={violet:['#7d6fd0','#4f4787','#a99cf0'],blue:['#4f8fcb','#2f5d8a','#8cc4ee'],mint:['#4fa58c','#2f6b5c','#8fd8c2']};
// Draws equal segments with their labels into an SVG whose viewBox is centred on 0 0 (radius 100). Shared with the Playground hero.
export function drawWheel(svg,list,palette){
 const seg=360/list.length,ns='http://www.w3.org/2000/svg';
 svg.replaceChildren();
 const point=deg=>{const r=(deg-90)*Math.PI/180;return [100*Math.cos(r),100*Math.sin(r)];};
 list.forEach((prize,i)=>{
  const [x1,y1]=point(i*seg),[x2,y2]=point((i+1)*seg),path=document.createElementNS(ns,'path');
  path.setAttribute('d',`M0 0L${x1.toFixed(2)} ${y1.toFixed(2)}A100 100 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z`);
  path.setAttribute('fill',palette[i%2]);path.setAttribute('stroke','#ffffff40');path.setAttribute('stroke-width','1');svg.append(path);
  const label=document.createElementNS(ns,'text'),mid=(i+.5)*seg;
  label.setAttribute('transform',`rotate(${mid}) translate(0 -64) rotate(90)`);label.setAttribute('text-anchor','middle');label.setAttribute('dominant-baseline','middle');label.setAttribute('class','wheel-label');
  label.textContent=Array.from(prize.name).length>14?Array.from(prize.name).slice(0,13).join('')+'…':prize.name;svg.append(label);
 });
 const rim=document.createElementNS(ns,'circle');rim.setAttribute('r','101');rim.setAttribute('fill','none');rim.setAttribute('stroke',palette[2]);rim.setAttribute('stroke-width','4');svg.append(rim);
}
// Picks an index by weight, then returns the rotation (from `angle`) that lands that segment under the top pointer after five turns.
export function spinTo(list,angle){
 const total=list.reduce((sum,prize)=>sum+prize.weight,0);let roll=Math.random()*total,index=list.length-1;
 for(let i=0;i<list.length;i++){roll-=list[i].weight;if(roll<0){index=i;break;}}
 const seg=360/list.length,target=360-((index+.5)*seg+(Math.random()-.5)*seg*.6);
 return {index,angle:angle+((target-angle)%360+360)%360+360*5};
}
export function setupLuckyWheel(t){
 const $=selector=>document.querySelector(selector);
 const svg=$('#wheel-svg');if(!svg)return;
 const brand=$('#wheel-brand'),color=$('#wheel-color'),signup=$('#wheel-signup'),stage=$('.wheel-stage'),spin=$('#wheel-spin'),overlay=$('#wheel-overlay'),form=$('#wheel-form'),result=$('#wheel-result'),status=$('#wheel-status'),error=$('#wheel-form-error');
 const rows=[1,2,3,4,5,6].map(i=>({name:$('#wheel-prize-'+i),weight:$('#wheel-weight-'+i)}));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let angle=0,state='ready',player=null,players=0;const tally=new Map();
 const prizes=()=>rows.map((row,i)=>({name:row.name.value.trim()||t(DEFAULT_PRIZES[i][0]),weight:Number(row.weight.value)||1}));
 const fill=(text,values)=>Object.entries(values).reduce((out,[key,value])=>out.replace('{'+key+'}',value),t(text));
 function defaults(){rows.forEach((row,i)=>{row.name.value=t(DEFAULT_PRIZES[i][0]);row.weight.value=String(DEFAULT_PRIZES[i][1]);});brand.value='';color.value='violet';signup.checked=true;}
 function draw(){
  const list=prizes();drawWheel(svg,list,PALETTES[color.value]||PALETTES.violet);
  svg.setAttribute('aria-label',t('Prize wheel')+': '+list.map(prize=>prize.name).join(', '));
  $('#wheel-brand-preview').textContent=brand.value.trim()||t('Your brand');stage.dataset.color=color.value;
 }
 // focus: only after a player action, never on page load.
 function show(view,focus=false){overlay.hidden=!view;form.hidden=view!=='form';result.hidden=view!=='result';error.hidden=true;if(view==='form'){form.reset();if(focus)setTimeout(()=>$('#wheel-name').focus({preventScroll:true}),0);}}
 function setState(next){state=next;stage.dataset.state=next;const busy=next==='spinning';spin.disabled=busy;[brand,color,signup,...rows.flatMap(row=>[row.name,row.weight]),$('#wheel-reset-settings')].forEach(control=>control.disabled=busy);}
 function ready(focus=false){player=null;setState('ready');if(signup.checked){show('form',focus);status.textContent=t('Sign up, then spin the wheel.');}else{show(null);status.textContent=t('Press Spin to play.');}}
 function spinWheel(){
  if(state!=='ready')return;
  if(signup.checked&&!player){show('form',true);return;}
  const list=prizes(),spun=spinTo(list,angle),index=spun.index;angle=spun.angle;
  setState('spinning');status.textContent=t('Spinning…');
  const duration=reduced.matches?0:4200;svg.style.transition=duration?`transform ${duration}ms cubic-bezier(.12,.8,.18,1)`:'none';svg.style.transform=`rotate(${angle}deg)`;
  setTimeout(()=>finish(list[index].name),duration+60);
 }
 function finish(prize){
  players++;tally.set(prize,(tally.get(prize)||0)+1);const top=[...tally].sort((a,b)=>b[1]-a[1])[0];
  $('#wheel-players').textContent=players;$('#wheel-top').textContent=top?top[0]:'—';
  $('#wheel-result-title').textContent=prize;
  $('#wheel-result-copy').textContent=player?fill('{name}, this is your prize.',{name:player}):t('This is your prize.');
  status.textContent=player?fill('{name} won {prize}.',{name:player,prize}):fill('The wheel landed on {prize}.',{prize});
  setState('result');show('result');$('#wheel-again').focus({preventScroll:true});
 }
 form.addEventListener('submit',event=>{
  event.preventDefault();const name=$('#wheel-name').value.trim(),contact=$('#wheel-contact').value.trim();
  if(!name||!contact||!$('#wheel-consent').checked){error.textContent=t('Enter your name and contact, and accept the consent to play.');error.hidden=false;return;}
  player=name;show(null);status.textContent=fill('Thanks, {name}. Spin the wheel!',{name});spin.focus({preventScroll:true});
 });
 spin.addEventListener('click',spinWheel);
 $('#wheel-again').addEventListener('click',()=>ready(true));
 [brand,color,...rows.flatMap(row=>[row.name,row.weight])].forEach(control=>control.addEventListener('input',draw));
 signup.addEventListener('change',()=>{if(state==='ready')ready();});
 $('#wheel-reset-settings').addEventListener('click',()=>{defaults();draw();ready();});
 defaults();draw();ready();
}
