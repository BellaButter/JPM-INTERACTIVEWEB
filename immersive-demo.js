import { demoStarted } from './demo-measurement.js';
// Canvas room preview: one panoramic scene mapped onto three walls and a floor.
export function setupImmersiveRoom(t){
 const scene=document.querySelector('.atmosphere-scene'),canvas=document.querySelector('#immersive-canvas'),ctx=canvas.getContext('2d');
 const player=document.querySelector('.immersive-player'),status=document.querySelector('#atmosphere-status');
 const fullscreen=document.querySelector('#immersive-fullscreen');
 const panorama=document.createElement('canvas'),floor=document.createElement('canvas');panorama.width=floor.width=1024;panorama.height=floor.height=512;
 const p=panorama.getContext('2d'),f=floor.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const descriptions={ocean:'Underwater room · moving imagery surrounds the visitor.',forest:'Forest room · light and trees continue across the walls and floor.',cosmic:'Space room · stars and planets surround the visitor.'};
 let width=0,height=0,dpr=1,time=0,pan=0,drag=null,visible=false,frame=0,last=0,effects=[],interactionCount=0;
 const random=n=>{const v=Math.sin(n*127.1+73.7)*43758.5453;return v-Math.floor(v);};
 function gradient(c,colors){const g=c.createLinearGradient(0,0,0,512);colors.forEach((color,i)=>g.addColorStop(i/(colors.length-1),color));c.fillStyle=g;c.fillRect(0,0,1024,512);}
 function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
 function underwater(){
  gradient(p,['#399aaf','#095c7c','#062b48']);glow(p,480,-30,510,'#b5fff455');
  for(let i=0;i<8;i++){const x=i*160+Math.sin(time*.22+i)*50;p.fillStyle='#d2ffef12';p.beginPath();p.moveTo(x,-20);p.lineTo(x+50,-20);p.lineTo(x+270,512);p.lineTo(x+130,512);p.fill();}
  for(let i=0;i<32;i++){const x=i*35,y=430+random(i)*80;p.strokeStyle=i%2?'#0a4b4e':'#126966';p.lineWidth=9+random(i+30)*8;p.beginPath();p.moveTo(x,530);p.bezierCurveTo(x+35,420,x-30,370,x+Math.sin(time*.5+i)*25,y-130);p.stroke();}
  for(let i=0;i<24;i++){
   const x=((random(i+10)*1024+time*(20+random(i)*18))%1180)-70,y=90+random(i+20)*290+Math.sin(time*.8+i)*14,size=10+random(i+50)*14;
   p.save();p.translate(x,y);p.fillStyle=i%4===0?'#ffcba3':'#b9edeb';p.beginPath();p.ellipse(0,0,size,size*.38,0,0,Math.PI*2);p.fill();p.beginPath();p.moveTo(-size*.7,0);p.lineTo(-size*1.5,-size*.55);p.lineTo(-size*1.5,size*.55);p.closePath();p.fill();p.fillStyle='#163c51';p.beginPath();p.arc(size*.55,-1,1.8,0,Math.PI*2);p.fill();p.restore();
  }
  for(let i=0;i<24;i++){const y=512-((random(i+80)*512+time*18)%540);p.strokeStyle='#d3fbff60';p.lineWidth=1.5;p.beginPath();p.arc(random(i+90)*1024,y,2+random(i)*5,0,Math.PI*2);p.stroke();}
 }
 function forest(){
  gradient(p,['#315f50','#113c3b','#071e2b']);glow(p,600,150,450,'#cbe6b442');
  for(let i=0;i<22;i++){
   const x=i*50+random(i)*30,w=12+random(i+1)*26;p.fillStyle=i%2?'#123330':'#1d4940';p.beginPath();p.moveTo(x-w,512);p.lineTo(x-5,0);p.lineTo(x+8,0);p.lineTo(x+w,512);p.fill();
   p.strokeStyle='#244f43';p.lineWidth=6;p.beginPath();p.moveTo(x,230);p.lineTo(x-60,140);p.moveTo(x,180);p.lineTo(x+55,70);p.stroke();
  }
  for(let i=0;i<30;i++)glow(p,random(i+120)*1024,random(i+130)*180,80,'#749b6850');
  for(let i=0;i<48;i++){const x=random(i+200)*1024+Math.sin(time*.4+i)*20,y=150+random(i+210)*340+Math.cos(time*.3+i)*18;glow(p,x,y,8,'#e2ef8e88');p.fillStyle='#f4ffb7';p.beginPath();p.arc(x,y,1.5+Math.sin(time+i)*.5,0,Math.PI*2);p.fill();}
 }
 function cosmic(){
  gradient(p,['#080f29','#242454','#091527']);glow(p,300+Math.sin(time*.1)*40,270,300,'#9074c94d');glow(p,770,210,260,'#558bd844');
  for(let i=0;i<180;i++){p.globalAlpha=.35+(Math.sin(time*.6+i)+1)*.3;p.fillStyle='#e1edff';p.beginPath();p.arc((random(i+300)*1024+time*2)%1024,random(i+400)*512,.6+random(i+500)*1.5,0,Math.PI*2);p.fill();}p.globalAlpha=1;
  const x=690+Math.sin(time*.12)*18,y=210;p.fillStyle='#bda8e6';p.beginPath();p.ellipse(x,y,125,27,-.35,0,Math.PI*2);p.fill();
  const g=p.createRadialGradient(x-20,y-25,4,x,y,75);g.addColorStop(0,'#e5d4f7');g.addColorStop(.55,'#8e83bf');g.addColorStop(1,'#303f6c');p.fillStyle=g;p.beginPath();p.arc(x,y,68,0,Math.PI*2);p.fill();
 }
 function floorScene(){
  const mood=scene.dataset.mood;
  gradient(f,mood==='forest'?['#1e4c40','#0d2a2a']:mood==='cosmic'?['#20264e','#080f27']:['#1c7d8b','#073d58']);
  for(let row=0;row<14;row++){
   f.strokeStyle=mood==='forest'?'#c3e99533':mood==='cosmic'?'#b6bdff38':'#b9fff754';f.lineWidth=2;
   f.beginPath();for(let x=0;x<=1024;x+=16){const y=row*42+Math.sin(x*.014+time*.5+row)*18+Math.sin(x*.027-time*.3)*8;if(x===0)f.moveTo(x,y);else f.lineTo(x,y);}f.stroke();
  }
  for(let i=0;i<20;i++)glow(f,random(i+600)*1024,(random(i+610)*512+time*5)%512,20,scene.dataset.mood==='cosmic'?'#b0baff44':'#98ead533');
 }
 function paintInteractions(){
  effects=effects.filter(effect=>time-effect.started<3);
  for(const effect of effects){
   const c=effect.surface==='floor'?f:p,x=effect.u*1024,y=effect.v*512,age=Math.max(.2,time-effect.started),fade=Math.max(0,1-age/3);
   c.save();c.globalAlpha=fade;
   if(effect.mood==='ocean'){
    glow(c,x,y,60+age*35,'#8cf4ff66');
    for(let ring=0;ring<3;ring++){c.strokeStyle=ring%2?'#e3ffff':'#89eaff';c.lineWidth=3-ring*.6;c.beginPath();c.ellipse(x,y,14+age*75+ring*15,10+age*50+ring*10,0,0,Math.PI*2);c.stroke();}
    for(let i=0;i<16;i++){const bx=x+Math.sin(i*2.3+age)*age*48,by=y-age*(25+random(i+effect.id)*65),r=3+random(i+50)*8;glow(c,bx,by,r*2,'#a2f5ff66');c.strokeStyle='#dbffff';c.lineWidth=1.7;c.beginPath();c.arc(bx,by,r,0,Math.PI*2);c.stroke();}
   }else if(effect.mood==='forest'){
    glow(c,x,y,85+age*30,'#a6f79766');
    for(let i=0;i<24;i++){const angle=i*2.4,dist=(12+random(i+effect.id)*80)*age,bx=x+Math.cos(angle)*dist,by=y+Math.sin(angle)*dist*.65-age*30;glow(c,bx,by,12,'#eafa8e99');c.fillStyle=i%3?'#f6ffc2':'#9fffe1';c.beginPath();c.arc(bx,by,2.5+random(i)*2,0,Math.PI*2);c.fill();}
   }else{
    glow(c,x,y,100+age*35,'#c4acff77');
    c.strokeStyle='#dbc9ff';c.lineWidth=2;c.beginPath();c.arc(x,y,12+age*70,0,Math.PI*2);c.stroke();
    for(let i=0;i<18;i++){const angle=i*Math.PI*2/18,dist=(30+random(i+effect.id)*90)*age,bx=x+Math.cos(angle)*dist,by=y+Math.sin(angle)*dist*.75,size=4+random(i)*5;glow(c,bx,by,size*3,'#b4dcff88');c.strokeStyle=i%2?'#fff0c7':'#deebff';c.lineWidth=1.7;c.beginPath();c.moveTo(x+Math.cos(angle)*dist*.7,y+Math.sin(angle)*dist*.7*.75);c.lineTo(bx,by);c.moveTo(bx-size,by);c.lineTo(bx+size,by);c.moveTo(bx,by-size);c.lineTo(bx,by+size);c.stroke();}
   }
   c.restore();
  }
 }
 function surfaces(){
  const left=(.23+pan)*width,right=(.77+pan)*width,top=height*.07,bottom=height*.63;
  const tl={x:left,y:top},tr={x:right,y:top},br={x:right,y:bottom},bl={x:left,y:bottom};
  return [{corners:[{x:0,y:0},tl,bl,{x:0,y:height}],start:0,end:.25,surface:'wall'},
   {corners:[tl,tr,br,bl],start:.25,end:.75,surface:'wall'},
   {corners:[tr,{x:width,y:0},{x:width,y:height},br],start:.75,end:1,surface:'wall'},
   {corners:[bl,br,{x:width,y:height},{x:0,y:height}],start:0,end:1,surface:'floor'}];
 }
 const quadPoint=(corners,u,v)=>({x:corners[0].x*(1-u)*(1-v)+corners[1].x*u*(1-v)+corners[2].x*u*v+corners[3].x*(1-u)*v,y:corners[0].y*(1-u)*(1-v)+corners[1].y*u*(1-v)+corners[2].y*u*v+corners[3].y*(1-u)*v});
 function surfaceAt(x,y){
  for(const plane of surfaces().reverse())for(let col=0;col<4;col++)for(let row=0;row<2;row++){
   const uv=[[col/4,row/2],[(col+1)/4,row/2],[(col+1)/4,(row+1)/2],[col/4,(row+1)/2]];
   const d=uv.map(([u,v])=>quadPoint(plane.corners,u,v));
   for(const indices of [[0,1,2],[0,2,3]]){
    const [a,b,c]=indices.map(i=>d[i]),den=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);
    if(Math.abs(den)<.001)continue;
    const wa=((b.y-c.y)*(x-c.x)+(c.x-b.x)*(y-c.y))/den,wb=((c.y-a.y)*(x-c.x)+(a.x-c.x)*(y-c.y))/den,wc=1-wa-wb;
    if(Math.min(wa,wb,wc)<-.001)continue;
    const weights=[wa,wb,wc],u=indices.reduce((sum,i,n)=>sum+uv[i][0]*weights[n],0),v=indices.reduce((sum,i,n)=>sum+uv[i][1]*weights[n],0);
    return {surface:plane.surface,u:plane.start+u*(plane.end-plane.start),v};
   }
  }
  return {surface:'wall',u:.5,v:.2};
 }
 function interact(x=width*.5,y=height*.42){
  if(!ctx)return;
  demoStarted('atmosphere-room');
  effects.push({...surfaceAt(x,y),mood:scene.dataset.mood,started:time,id:++interactionCount});effects=effects.slice(-8);
  scene.dataset.interactions=String(interactionCount);scene.dataset.effect=scene.dataset.mood;
  status.textContent=t({ocean:'You touched the water: bubbles and ripples appear.',forest:'You touched the forest: fireflies gather around your touch.',cosmic:'You touched space: a burst of starlight appears.'}[scene.dataset.mood]);draw();
 }
 function triangle(texture,s,d){
  const [a,b,c]=s,[A,B,C]=d,den=(b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y);if(Math.abs(den)<.001)return;
  const ux=((B.x-A.x)*(c.y-a.y)-(C.x-A.x)*(b.y-a.y))/den,uy=((B.y-A.y)*(c.y-a.y)-(C.y-A.y)*(b.y-a.y))/den;
  const vx=((C.x-A.x)*(b.x-a.x)-(B.x-A.x)*(c.x-a.x))/den,vy=((C.y-A.y)*(b.x-a.x)-(B.y-A.y)*(c.x-a.x))/den;
  // Overlap mesh edges slightly to avoid antialiasing gaps between triangles.
  const center={x:(A.x+B.x+C.x)/3,y:(A.y+B.y+C.y)/3};
  const expand=v=>{const length=Math.hypot(v.x-center.x,v.y-center.y)||1;return{x:v.x+(v.x-center.x)/length,y:v.y+(v.y-center.y)/length};};
  const [aa,bb,cc]=[A,B,C].map(expand);
  ctx.save();ctx.beginPath();ctx.moveTo(aa.x,aa.y);ctx.lineTo(bb.x,bb.y);ctx.lineTo(cc.x,cc.y);ctx.closePath();ctx.clip();
  ctx.transform(ux,uy,vx,vy,A.x-ux*a.x-vx*a.y,A.y-uy*a.x-vy*a.y);ctx.drawImage(texture,0,0);ctx.restore();
 }
 function quad(texture,corners,start=0,end=1){
  const point=(u,v)=>quadPoint(corners,u,v);
  for(let x=0;x<4;x++)for(let y=0;y<2;y++){
   const uv=[[x/4,y/2],[(x+1)/4,y/2],[(x+1)/4,(y+1)/2],[x/4,(y+1)/2]];
   const s=uv.map(([u,v])=>({x:(start+u*(end-start))*1024,y:v*512})),d=uv.map(([u,v])=>point(u,v));
   triangle(texture,[s[0],s[1],s[2]],[d[0],d[1],d[2]]);triangle(texture,[s[0],s[2],s[3]],[d[0],d[2],d[3]]);
  }
 }
 function draw(){
  if(!ctx||!width)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#080d17';ctx.fillRect(0,0,width,height);
  ({ocean:underwater,forest,cosmic}[scene.dataset.mood])();floorScene();paintInteractions();
  const left=(.23+pan)*width,right=(.77+pan)*width,top=height*.07,bottom=height*.63;
  const tl={x:left,y:top},tr={x:right,y:top},br={x:right,y:bottom},bl={x:left,y:bottom},a={x:0,y:0},b={x:width,y:0},c={x:width,y:height},d={x:0,y:height};
  quad(panorama,[a,tl,bl,d],0,.25);quad(panorama,[tl,tr,br,bl],.25,.75);quad(panorama,[tr,b,c,br],.75,1);quad(floor,[bl,br,c,d]);
  ctx.strokeStyle='#07132188';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left,top);ctx.lineTo(left,bottom);ctx.lineTo(right,bottom);ctx.lineTo(right,top);ctx.moveTo(0,height);ctx.lineTo(left,bottom);ctx.moveTo(width,height);ctx.lineTo(right,bottom);ctx.stroke();
  // A small visitor silhouette makes the physical scale of the room legible.
  const x=width*(.53+pan*.3),y=height*.79,s=height*.0026;
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#07131bd9';ctx.beginPath();ctx.ellipse(0,59,24,6,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(0,-37,8,0,Math.PI*2);ctx.fill();ctx.lineCap='round';ctx.strokeStyle='#07131bf0';ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(0,16);ctx.stroke();ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-5,-18);ctx.lineTo(-15,9);ctx.moveTo(5,-18);ctx.lineTo(16,7);ctx.moveTo(-4,15);ctx.lineTo(-8,54);ctx.moveTo(4,15);ctx.lineTo(10,54);ctx.stroke();ctx.restore();
 }
 function resize(){const r=scene.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);draw();}
 const moving=()=>visible&&!document.hidden&&!reduced.matches;
 function loop(now){frame=0;if(!moving())return;if(now-last>=40){time+=Math.min((now-last)/1000,.1);last=now;draw();}frame=requestAnimationFrame(loop);}
 function sync(){cancelAnimationFrame(frame);frame=0;if(moving()){last=performance.now();frame=requestAnimationFrame(loop);}draw();}
 function look(value){pan=Math.max(-.16,Math.min(.16,value));scene.dataset.view=pan.toFixed(3);draw();}
 document.querySelectorAll('[data-mood-choice]').forEach(button=>button.addEventListener('click',()=>{effects=[];scene.removeAttribute('data-effect');scene.dataset.mood=button.dataset.moodChoice;document.querySelectorAll('[data-mood-choice]').forEach(item=>{const on=item===button;item.classList.toggle('active',on);item.setAttribute('aria-pressed',String(on));});status.textContent=t(descriptions[scene.dataset.mood]);draw();}));
 scene.addEventListener('pointerdown',event=>{if(event.button!==0||drag)return;drag={x:event.clientX,y:event.clientY,pan,id:event.pointerId,moved:false};scene.setPointerCapture(event.pointerId);});
 scene.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;if(Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>8)drag.moved=true;if(drag.moved)look(drag.pan+(event.clientX-drag.x)/width*.45);});
 scene.addEventListener('pointerup',event=>{if(!drag||drag.id!==event.pointerId)return;if(!drag.moved){const r=scene.getBoundingClientRect();interact(event.clientX-r.left,event.clientY-r.top);}drag=null;});
 for(const type of ['pointercancel','lostpointercapture'])scene.addEventListener(type,()=>{drag=null;});
 scene.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();look(pan+(event.key==='ArrowLeft'?.04:-.04));}if(event.key==='Home'){event.preventDefault();look(0);}if(event.key==='Enter'||event.code==='Space'){event.preventDefault();if(!event.repeat)interact();}});

 document.querySelector('#immersive-left').addEventListener('click',()=>look(pan+.04));document.querySelector('#immersive-right').addEventListener('click',()=>look(pan-.04));document.querySelector('#immersive-center').addEventListener('click',()=>look(0));

 let expanded=false,previousOverflow='';
 function fullscreenState(){const active=document.fullscreenElement===player||expanded;fullscreen.textContent=t(active?'Exit fullscreen':'Enter fullscreen');fullscreen.setAttribute('aria-expanded',String(active));resize();}
 function fallback(active){if(active){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}else document.body.style.overflow=previousOverflow;expanded=active;player.classList.toggle('is-expanded',active);fullscreenState();}
 fullscreen.addEventListener('click',async()=>{if(expanded){fallback(false);return;}if(document.fullscreenElement===player){await document.exitFullscreen();return;}try{if(!player.requestFullscreen||!document.fullscreenEnabled)throw new Error('fallback');await player.requestFullscreen();}catch{fallback(true);}});
 document.addEventListener('fullscreenchange',fullscreenState);document.addEventListener('keydown',event=>{if(event.key==='Escape'&&expanded)fallback(false);});
 reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(scene);new ResizeObserver(resize).observe(scene);resize();sync();
 if(!ctx){status.textContent=t('This browser cannot render the room preview.');fullscreen.disabled=true;}
}
