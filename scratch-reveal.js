import { demoStarted } from './demo-measurement.js';
import {setupItemUpload} from './item-upload.js';
// Soft fog reveal: the persistent mask is independent of the animated fog.
export function setupFogReveal(t) {
 const canvas=document.querySelector('#scratch-canvas'),stage=canvas.parentElement;
 const ctx=canvas.getContext('2d'),mask=document.createElement('canvas'),maskCtx=mask.getContext('2d');
 const status=document.querySelector('#scratch-status'),motion=document.querySelector('#scratch-motion');
 const messageNode=document.querySelector('.reveal-brand-message'),defaultMessage=messageNode.textContent;
 const brandField=document.querySelector('#reveal-brand'),messageField=document.querySelector('#reveal-message'),colorField=document.querySelector('#reveal-color'),brushField=document.querySelector('#reveal-brush');
 const backgroundImage=document.querySelector('#reveal-background-image'),imageBackdrop=document.querySelector('#reveal-image-backdrop'),messageContainer=document.querySelector('.scratch-message');
 const upload=setupItemUpload('reveal',{t,emptyMessage:'Choose a picture to reveal behind the mist.',onChange:()=>{applySettings();resetMist();}});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 // Tileable fractal cloud textures make the front layer look like mist,
 // rather than a flat gradient. Generate once; drift the cached layers.
 function fogTexture(seed,tint) {
  const texture=document.createElement('canvas');texture.width=256;texture.height=160;
  const textureCtx=texture.getContext('2d'),pixels=textureCtx.createImageData(256,160);
  const smooth=x=>x*x*(3-2*x);
  const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7+seed*71.3)*43758.5453;return n-Math.floor(n);};
  function noise(u,v,grid) {
   const x=u*grid,y=v*grid,ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy);
   const a=hash(ix%grid,iy%grid),b=hash((ix+1)%grid,iy%grid),c=hash(ix%grid,(iy+1)%grid),d=hash((ix+1)%grid,(iy+1)%grid);
   return (a+(b-a)*fx)*(1-fy)+(c+(d-c)*fx)*fy;
  }
  for(let y=0;y<160;y++)for(let x=0;x<256;x++) {
   const u=x/256,v=y/160;
   const density=noise(u,v,4)*.53+noise(u,v,8)*.27+noise(u,v,16)*.13+noise(u,v,32)*.07;
   const alpha=Math.max(0,Math.min(1,(density-.27)*2.2));
   const i=(y*256+x)*4;pixels.data[i]=tint[0];pixels.data[i+1]=tint[1];pixels.data[i+2]=tint[2];pixels.data[i+3]=Math.round(alpha*235);
  }
  textureCtx.putImageData(pixels,0,0);return texture;
 }
 const fogLayers=[fogTexture(7,[204,218,228]),fogTexture(23,[232,239,242])];
 let width=0,height=0,dpr=1,revealed=false,dragging=false,touched=false,last=null,inView=false,paused=false,frame=0,lastFrame=0,time=0;
 const canMove=()=>inView&&!document.hidden&&!paused&&!reduced.matches;
 function paint() {
  // The Playground player hides this demo until it is opened; a hidden canvas has no size to paint.
  if(!ctx||revealed||!width||!height||!mask.width||!mask.height)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,width,height);
  const base=ctx.createLinearGradient(0,0,width,height);base.addColorStop(0,'#243340');base.addColorStop(.5,'#566b7a');base.addColorStop(1,'#263540');
  ctx.fillStyle=base;ctx.fillRect(0,0,width,height);
  for(let i=0;i<fogLayers.length;i++) {
   const layerWidth=width*(i?1.65:1.2),layerHeight=height*1.5;
   const offset=((time*(i?-5:7))%layerWidth+layerWidth)%layerWidth;
   const y=-height*.25+Math.sin(time*.12+i)*height*.08;
   ctx.globalAlpha=i?.65:.9;
   ctx.drawImage(fogLayers[i],offset-layerWidth,y,layerWidth,layerHeight);
   ctx.drawImage(fogLayers[i],offset,y,layerWidth,layerHeight);
  }
  ctx.globalAlpha=1;
  if(!touched){
   ctx.shadowColor='#102030';ctx.shadowBlur=8;
   ctx.fillStyle='#f0f0fb';ctx.font='500 18px Manrope, Prompt, sans-serif';ctx.textAlign='center';ctx.fillText(t('A possibility awaits.'),width/2,height/2);
   ctx.font='12px Manrope, Prompt, sans-serif';ctx.fillStyle='#e0e2f0';ctx.fillText(t('SWIPE THROUGH THE MIST'),width/2,height/2+30);
   ctx.shadowBlur=0;
  }
  ctx.globalCompositeOperation='destination-out';ctx.drawImage(mask,0,0,width,height);ctx.globalCompositeOperation='source-over';
 }
 function loop(now) {
  frame=0;if(!canMove()||revealed)return;
  if(now-lastFrame>32){time+=Math.min((now-lastFrame)/1000,.05);lastFrame=now;paint();}
  frame=requestAnimationFrame(loop);
 }
 function syncMotion() {
  cancelAnimationFrame(frame);frame=0;stage.classList.toggle('motion-stopped',!canMove());
  motion.disabled=reduced.matches;motion.textContent=t(paused?'Resume visual':'Pause visual');motion.setAttribute('aria-pressed',String(paused||reduced.matches));
  if(canMove()&&!revealed){lastFrame=performance.now();frame=requestAnimationFrame(loop);}paint();
 }
 function resize() {
  const rect=stage.getBoundingClientRect(),nextDpr=Math.min(devicePixelRatio||1,2);
  if(!rect.width||!rect.height)return; // hidden by the Playground player: keep the cleared mask for when it opens again
  if(width===rect.width&&height===rect.height&&dpr===nextDpr)return;
  const saved=document.createElement('canvas');saved.width=mask.width;saved.height=mask.height;
  if(saved.width&&saved.height)saved.getContext('2d').drawImage(mask,0,0);
  width=rect.width;height=rect.height;dpr=nextDpr;
  canvas.width=mask.width=Math.round(width*dpr);canvas.height=mask.height=Math.round(height*dpr);
  if(saved.width&&saved.height)maskCtx.drawImage(saved,0,0,mask.width,mask.height);
  maskCtx.setTransform(dpr,0,0,dpr,0,0);dragging=false;last=null;paint();
 }
 function reveal() {
  demoStarted('scratch-reveal');
  revealed=true;dragging=false;last=null;canvas.hidden=true;cancelAnimationFrame(frame);frame=0;
  status.textContent=upload.url?t('Your uploaded image has been revealed.'):t('Revealed:')+' '+messageNode.textContent;
 }
 function dab(x,y) {
  const radius=Math.min(80,Math.max(48,width*.15))*Number(brushField.value)/100;
  const brush=maskCtx.createRadialGradient(x,y,0,x,y,radius);
  brush.addColorStop(0,'rgba(255,255,255,.65)');brush.addColorStop(.35,'rgba(255,255,255,.5)');brush.addColorStop(.7,'rgba(255,255,255,.17)');brush.addColorStop(1,'rgba(255,255,255,0)');
  maskCtx.fillStyle=brush;maskCtx.fillRect(x-radius,y-radius,radius*2,radius*2);
 }
 function swipe(event) {
  if(!dragging||revealed||!ctx)return;
  const rect=canvas.getBoundingClientRect(),point={x:event.clientX-rect.left,y:event.clientY-rect.top};
  const distance=last?Math.hypot(point.x-last.x,point.y-last.y):0,n=Math.max(1,Math.ceil(distance/8));
  for(let i=1;i<=n;i++)dab(last?last.x+(point.x-last.x)*i/n:point.x,last?last.y+(point.y-last.y)*i/n:point.y);
  last=point;paint();
  if(!revealed)status.textContent=t('Keep swiping to let the scene emerge.');
 }
 canvas.addEventListener('pointerdown',event=>{if(event.button!==0||revealed)return;demoStarted('scratch-reveal');touched=true;dragging=true;last=null;canvas.setPointerCapture(event.pointerId);swipe(event);});
 canvas.addEventListener('pointermove',swipe);
 function finish(){dragging=false;last=null;}
 canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);canvas.addEventListener('lostpointercapture',finish);
 document.querySelector('#scratch-reveal-button').addEventListener('click',reveal);
 function resetMist(){
  revealed=false;dragging=false;touched=false;last=null;canvas.hidden=false;
  maskCtx.setTransform(1,0,0,1,0,0);maskCtx.clearRect(0,0,mask.width,mask.height);maskCtx.setTransform(dpr,0,0,dpr,0,0);
  status.textContent=t('Swipe through the mist or reveal the scene.');syncMotion();
 }
 document.querySelector('#scratch-reset').addEventListener('click',resetMist);
 function applySettings(){
  const brandNode=document.querySelector('#reveal-brand-preview');brandNode.textContent=brandField.value.trim();brandNode.hidden=!brandNode.textContent;
  messageNode.textContent=messageField.value.trim()||defaultMessage;messageNode.hidden=!!upload.url&&!messageField.value.trim();
  messageContainer.hidden=messageNode.hidden&&brandNode.hidden;
  if(upload.url){backgroundImage.src=upload.url;backgroundImage.hidden=false;imageBackdrop.style.backgroundImage=`url("${upload.url}")`;imageBackdrop.hidden=false;}else{backgroundImage.hidden=true;backgroundImage.removeAttribute('src');imageBackdrop.hidden=true;imageBackdrop.style.removeProperty('background-image');}
  stage.classList.toggle('has-uploaded-background',!!upload.url);stage.dataset.color=colorField.value;status.textContent=t(upload.url?'Swipe through the mist to reveal your uploaded image.':'Settings applied. Swipe to reveal your message.');
 }
 for(const field of [brandField,messageField,colorField,brushField])field.addEventListener('input',applySettings);
 document.querySelector('#reveal-reset-settings').addEventListener('click',()=>{upload.clear(false);brandField.value='';messageField.value='';colorField.value='violet';brushField.value='80';applySettings();resetMist();});
 motion.addEventListener('click',()=>{paused=!paused;syncMotion();});
 reduced.addEventListener('change',syncMotion);document.addEventListener('visibilitychange',syncMotion);
 new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;syncMotion();},{threshold:.05}).observe(stage);
 new ResizeObserver(resize).observe(stage);resize();syncMotion();
 if(!ctx){canvas.hidden=true;revealed=true;status.textContent=messageNode.textContent;}
}
