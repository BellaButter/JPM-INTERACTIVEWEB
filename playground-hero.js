// Playground hero: the round mascot reacts to a six-key 3D keypad (and the real keys F P D B Z X).
// Feed fills it up (twelve bites and it bursts), Pet makes it blush, Dance makes it bounce, Boo scares it,
// Sleep sends it to sleep until the next key, and Overload bursts it straight away. It reboots after bursting.
// Plain SVG and requestAnimationFrame; with reduced motion it stays still and the pieces fade instead of flying.
const t=text=>window.JPMI18n?.t(text)??text;
const root=document.querySelector('.robot-stage');
if(root){
 const svg=root.querySelector('.feed-svg'),robot=svg.querySelector('.feed-robot'),eyes=svg.querySelector('.feed-eyes'),cheeks=svg.querySelector('.feed-cheeks'),mouth=svg.querySelector('.feed-mouth');
 const foodLayer=svg.querySelector('.feed-food'),debrisLayer=svg.querySelector('.feed-debris'),boom=svg.querySelector('.feed-boom');
 const keys=[...root.querySelectorAll('[data-robot]')],status=root.querySelector('.hero-play-result'),count=root.querySelector('.feed-count strong');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const BITES=12,CX=150,CY=158,ns='http://www.w3.org/2000/svg';
 const KEYMAP={f:'feed',p:'pet',d:'dance',b:'boo',z:'sleep',x:'boom'};
 const LINES={feed:['Yum!','Tasty. More, please.','Mmm… getting full.','Uh-oh. I’m very full…','Please… no more!'],pet:'Hehe, that tickles!',dance:'Dance break!',boo:'AAH! You scared me!',sleep:'Zzz… press any key to wake me.',wake:'I’m awake! What’s next?'};
 const FOODS=[
  '<circle r="13" fill="#ff8fb3"/><circle r="5" fill="#f2f2f5"/><path d="M-9 -6l3 2M4 -10l2 3M8 4l3 1" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  '<circle r="13" fill="#d9a066"/><circle cx="-4" cy="-3" r="2.4" fill="#5b3a1e"/><circle cx="5" cy="2" r="2.4" fill="#5b3a1e"/><circle cx="-2" cy="6" r="2" fill="#5b3a1e"/>',
  '<rect x="-8" y="-13" width="16" height="26" rx="3" fill="#59c99a"/><rect x="-4" y="-17" width="8" height="5" rx="1.5" fill="#59c99a"/><path d="M1 -7l-5 8h4l-2 7 6-9h-4z" fill="#14402c"/>',
  '<path d="M3 -15L-9 2h8l-4 13L11 -3H3z" fill="#ffc94d" stroke="#a07a10" stroke-width="1.5" stroke-linejoin="round"/>'
 ];
 let full=0,broken=0,state='ready',action=null,actionAt=0,look={x:0,y:0},blink=0,nextBlink=performance.now()+2400,chomp=0,flying=[],debris=[],floatAt=0,mood='';
 const el=(name,attrs={},html='')=>{const node=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,v);if(html)node.innerHTML=html;return node;};
 // Eyes: the current reaction wins; otherwise they follow how full the robot is.
 function eyeStyle(){
  if(state==='broken')return '';
  if(action==='sleep')return 'closed';if(action==='boo')return 'wide';if(action==='pet'||action==='dance')return 'happy';
  return full>=.9?'dizzy':full>=.75?'wide':full>=.25?'happy':'oval';
 }
 function drawEyes(){
  const style=eyeStyle(),key=style+(blink>.5&&style==='oval'?'-blink':'')+Math.round(look.x*4)+Math.round(look.y*4);if(key===mood)return;mood=key;
  const x=style==='closed'?0:look.x*6,y=style==='closed'?0:look.y*4,stroke='stroke="#f2f3ff" stroke-width="6" stroke-linecap="round" fill="none"';
  eyes.innerHTML=style==='happy'?`<path d="M${-40+x} ${-6+y}q10 -14 20 0M${20+x} ${-6+y}q10 -14 20 0" ${stroke}/>`
   :style==='wide'?`<circle cx="${-30+x}" cy="${-12+y}" r="15" fill="#f2f3ff"/><circle cx="${30+x}" cy="${-12+y}" r="15" fill="#f2f3ff"/><circle cx="${-30+x}" cy="${-12+y}" r="5" fill="#0b0b12"/><circle cx="${30+x}" cy="${-12+y}" r="5" fill="#0b0b12"/>`
   :style==='dizzy'?`<path d="M-40 -22l20 20M-20 -22l-20 20M20 -22l20 20M40 -22l-20 20" ${stroke}/>`
   :style==='closed'?`<path d="M-40 -10q10 8 20 0M20 -10q10 8 20 0" ${stroke}/>`
   :blink>.5?`<path d="M${-40+x} ${-12+y}h20M${20+x} ${-12+y}h20" ${stroke}/>`
   :style?`<ellipse cx="${-30+x}" cy="${-12+y}" rx="11" ry="16" fill="#f2f3ff"/><ellipse cx="${30+x}" cy="${-12+y}" rx="11" ry="16" fill="#f2f3ff"/>`:'';
 }
 function particle(x,y,{color='#ffc94d',size=3,speed=260,shape='',gravity=900,max=1.6+Math.random()*.8,angle=Math.random()*Math.PI*2}={}){
  const node=shape?el('g',{},shape):el('circle',{r:size,fill:color});debrisLayer.append(node);
  const v=speed*(.4+Math.random()*.8);
  const p={node,x,y,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v-speed*.4,r:0,vr:(Math.random()-.5)*720,life:0,max,gravity};debris.push(p);return p;
 }
 // A symbol that drifts upward and fades: hearts, notes, Z's, sweat.
 function floater(text,color,x=CX+(Math.random()-.5)*90,y=CY-80){const p=particle(x,y,{shape:`<text font-size="26" font-weight="800" fill="${color}" text-anchor="middle">${text}</text>`,speed:0,gravity:0,max:1.6});p.vy=-55;p.vx=(Math.random()-.5)*30;p.vr=(Math.random()-.5)*40;}
 function feed(){
  const food=el('g',{class:'feed-item'},FOODS[Math.floor(Math.random()*FOODS.length)]);
  foodLayer.append(food);flying.push({node:food,start:{x:20+Math.random()*30,y:285},time:reduced.matches?1:0,spin:(Math.random()-.5)*720});
 }
 function bite(){
  full=Math.min(1,full+1/BITES+1e-9);chomp=1;
  for(let i=0;i<4;i++)particle(CX+(Math.random()-.5)*20,CY+50,{color:'#d9a066',size:2.5,speed:120});
  if(full>=1){explode();return;}
  status.textContent=t(LINES.feed[Math.min(4,Math.floor(full*5))]);
 }
 function explode(){
  state='broken';action=null;broken++;count.textContent=broken;robot.style.visibility='hidden';flying.forEach(f=>f.node.remove());flying=[];mood='';drawEyes();
  // Each piece starts where it sat on the robot and flies outward from there.
  const speed=reduced.matches?0:380;
  const piece=(shape,x,y,angle,v=speed)=>{const p=particle(CX+x,CY+y,{shape,speed:0,max:2.6});p.vx=Math.cos(angle)*v*(.7+Math.random()*.6);p.vy=Math.sin(angle)*v*(.7+Math.random()*.6)-v*.5;};
  [45,135,225,315].forEach(deg=>{const a=deg*Math.PI/180;piece(`<path d="M-28 -28L34 -28A62 62 0 0 1 -28 34Z" transform="rotate(${deg-45})" fill="url(#feed-body)" stroke="#b9bbcc" stroke-width="1"/>`,Math.cos(a)*40,Math.sin(a)*40,a);});
  piece('<g transform="scale(.8)"><rect x="-68" y="-52" width="136" height="80" rx="38" fill="url(#feed-rim)"/><rect x="-62" y="-46" width="124" height="68" rx="33" fill="#0b0b12"/></g>',0,-14,-Math.PI/2,speed*.8);
  piece('<circle r="13" fill="#f2f3ff" stroke="#c3c5d6"/>',-30,-14,Math.PI*1.15);piece('<circle r="13" fill="#f2f3ff" stroke="#c3c5d6"/>',30,-14,-Math.PI*.15);
  piece('<rect x="-16" y="-4" width="32" height="8" rx="4" fill="#1a1a24"/>',0,50,Math.PI/2);
  for(let i=0;i<6;i++){const a=Math.random()*Math.PI*2;piece('<circle r="5" fill="#9a9dd0" stroke="#4f527a" stroke-width="2"/>',Math.cos(a)*60,Math.sin(a)*60,a);}
  for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2;piece('<path d="M-10 0q5 -8 10 0t10 0" stroke="#9a9dd0" stroke-width="3" fill="none"/>',Math.cos(a)*50,Math.sin(a)*50,a);}
  for(let i=0;i<26;i++)particle(CX,CY,{color:i%2?'#ffc94d':'#a98bf2',size:2+Math.random()*3,speed:reduced.matches?0:520});
  boom.textContent=t('OVERLOAD!');boom.classList.add('is-on');
  status.textContent=t('BOOM! System overload. Rebooting…');keys.forEach(key=>key.disabled=true);
  setTimeout(reboot,2800);wake();
 }
 function reboot(){
  debris.forEach(p=>p.node.remove());debris=[];full=0;boom.classList.remove('is-on');boom.textContent='';
  state='ready';robot.style.visibility='';robot.classList.add('is-rebooting');setTimeout(()=>robot.classList.remove('is-rebooting'),700);
  keys.forEach(key=>key.disabled=false);mood='';status.textContent=t('Rebooted and ready. Press a key!');wake();
 }
 function press(name){
  if(state==='broken')return;
  const key=keys.find(k=>k.dataset.robot===name);if(key){key.classList.add('is-down');setTimeout(()=>key.classList.remove('is-down'),160);}
  const wasAsleep=action==='sleep';
  if(name==='boom'){explode();return;}
  if(name==='feed'){if(wasAsleep)action=null;feed();wake();return;}
  if(wasAsleep&&name==='sleep'){action=null;status.textContent=t(LINES.wake);mood='';wake();return;}
  action=name;actionAt=performance.now();floatAt=0;mood='';status.textContent=t(LINES[name]);
  if(name==='boo')floater('!','#ff6b81',CX+70,CY-70);
  wake();
 }
 let running=false,last=0,inView=true;
 function wake(){if(!running){running=true;last=performance.now();requestAnimationFrame(frame);}}
 function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;const time=now/1000,still=reduced.matches,age=(now-actionAt)/1000;
  // Timed reactions end on their own; sleep lasts until the next key.
  const lengths={pet:1.8,dance:2.6,boo:1.4};if(lengths[action]&&age>lengths[action]){action=null;mood='';}
  chomp=Math.max(0,chomp-dt*4);
  const scale=1+full*.38;let x=0,y=still?0:Math.sin(time*2)*3,rot=0,sx=1,sy=1;
  const shake=still?0:full>.6?(full-.6)*10:0;if(shake){x+=Math.sin(time*40)*shake*.6;rot+=Math.sin(time*31)*shake;}
  if(!still&&action==='dance'){y+=-Math.abs(Math.sin(age*7))*26;rot+=Math.sin(age*7)*14;sx=1+Math.sin(age*14)*.04;sy=1-Math.sin(age*14)*.04;}
  if(!still&&action==='pet'){rot+=Math.sin(age*18)*5*Math.max(0,1-age/1.8);}
  if(!still&&action==='boo'){const k=Math.min(1,age/.45);y+=-Math.sin(k*Math.PI)*46;if(age>.45)x+=Math.sin(time*60)*4*Math.max(0,1-(age-.45));}
  if(action==='sleep'){y=still?0:Math.sin(time*1.2)*2;sx=1+(still?0:Math.sin(time*1.2)*.02);sy=sx;}
  robot.setAttribute('transform',`translate(${CX+x} ${CY+y}) rotate(${rot}) scale(${scale*sx*(1+chomp*.05)} ${scale*sy*(1-chomp*.08)})`);
  mouth.setAttribute('transform',`translate(0 50) scale(1 ${action==='boo'?2.4:1+chomp*2.2}) translate(0 -50)`);
  cheeks.style.opacity=String(action==='pet'?1:Math.max(0,(full-.3)*1.4));
  // Floating symbols for the current reaction.
  if(state==='ready'&&now>floatAt){
   if(action==='pet'){floatAt=now+260;floater('♥','#ff6b9a');}
   else if(action==='dance'){floatAt=now+320;floater(Math.random()<.5?'♪':'♫','#7d6fd0');}
   else if(action==='sleep'){floatAt=now+900;floater('Z','#7d6fd0',CX+40+Math.random()*30,CY-70);}
   else if(full>=.7&&!still){floatAt=now+380;const p=particle(CX+(Math.random()-.5)*60,CY-90*scale,{color:'#c9cbe0',size:6,speed:0,gravity:0,max:1.2});p.vy=-60;p.grow=true;}
  }
  if(!still&&now>nextBlink){blink=Math.min(1,blink+dt*14);if(blink>=1)nextBlink=now+2200+Math.random()*2600;}else blink=Math.max(0,blink-dt*10);
  drawEyes();
  // Food flies in an arc into the mouth.
  flying=flying.filter(f=>{f.time=Math.min(1,f.time+dt/.45);const k=f.time,end={x:CX,y:CY+50*scale},mid={x:(f.start.x+end.x)/2,y:Math.min(f.start.y,end.y)-90};
   const px=(1-k)**2*f.start.x+2*(1-k)*k*mid.x+k*k*end.x,py=(1-k)**2*f.start.y+2*(1-k)*k*mid.y+k*k*end.y;
   f.node.setAttribute('transform',`translate(${px} ${py}) rotate(${f.spin*k}) scale(${1-k*.5})`);
   if(k>=1){f.node.remove();if(state==='ready')bite();return false;}return true;});
  // Pieces and particles: gravity, a bounce on the floor, then fade.
  debris=debris.filter(p=>{p.life+=dt;p.vy+=p.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;
   if(p.gravity&&p.y>266){p.y=266;p.vy*=-.38;p.vx*=.7;p.vr*=.6;}
   const fade=Math.max(0,Math.min(1,(p.max-p.life)/.6));p.node.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${p.r})${p.grow?` scale(${1+p.life*2})`:''}`);p.node.setAttribute('opacity',String(p.grow?fade*.6:fade));
   if(p.life>=p.max){p.node.remove();return false;}return true;});
  const busy=flying.length||debris.length||chomp>0||blink>0||action||shake||(!still&&inView&&document.visibilityState==='visible');
  if(busy)requestAnimationFrame(frame);else running=false;
 }
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)wake();}).observe(root);
 keys.forEach(key=>key.addEventListener('click',()=>press(key.dataset.robot)));
 svg.addEventListener('pointerdown',()=>press('pet'));
 // Real keyboard: only while the hero is on screen and the visitor is not typing in a field.
 addEventListener('keydown',event=>{const name=KEYMAP[event.key.toLowerCase()];if(!name||!inView||event.ctrlKey||event.metaKey||event.altKey||event.target.closest?.('input,textarea,select,[contenteditable]'))return;press(name);});
 addEventListener('pointermove',event=>{const r=svg.getBoundingClientRect();look.x=Math.max(-1,Math.min(1,(event.clientX-r.left-r.width/2)/(r.width*.9)));look.y=Math.max(-1,Math.min(1,(event.clientY-r.top-r.height/2)/(r.height*.9)));if(inView)wake();},{passive:true});
 drawEyes();wake();
}
