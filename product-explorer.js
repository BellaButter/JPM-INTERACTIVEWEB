import { demoStarted } from './demo-measurement.js';
import {demoProducts} from './content/en/demo-products.mjs';
export function setupProductExplorer(t) {
 let index=0,panel=null,startPoint=null,suppressClick=false,suppressTimer;
 const carousel=document.querySelector('.catalog-carousel'),cards=[...carousel.querySelectorAll('.product-choice')],details=document.querySelector('#catalog-details');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),panels={story:'Product story',features:'Highlights',notes:'Scent notes'};
 function update(){
  const selected=demoProducts[index];carousel.dataset.product=selected.id;
  cards.forEach((card,i)=>{
   const on=i===index,offset=((i-index+demoProducts.length+1)%demoProducts.length)-1;
   card.style.setProperty('--offset',offset);card.style.zIndex=on?'3':'1';card.classList.toggle('active',on);card.setAttribute('aria-pressed',String(on));
   const image=card.querySelector('img'),name=card.querySelector('h3'),tagline=card.querySelector('.catalog-card-tagline');
   image.removeAttribute('id');name.removeAttribute('id');tagline.removeAttribute('id');tagline.textContent=t(demoProducts[i].tagline);image.alt=demoProducts[i].name+' '+t('sample perfume bottle');
  });
  const active=cards[index];active.querySelector('img').id='explorer-product-image';active.querySelector('h3').id='explorer-product-name';active.querySelector('.catalog-card-tagline').id='explorer-product-tagline';
  document.querySelector('#catalog-page').textContent=selected.name+' · '+(index+1)+' / '+demoProducts.length;
  details.hidden=!panel;
  document.querySelectorAll('[data-explorer]').forEach(button=>{const on=button.dataset.explorer===panel;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-expanded',String(on));});
  document.querySelector('#explorer-title').textContent=panel?selected.name+' · '+t(panels[panel]):'';
  document.querySelector('#explorer-text').textContent=panel?t(selected[panel]):'';
 }
 function select(next){next=(next+demoProducts.length)%demoProducts.length;if(next===index)return;demoStarted('product-explorer');index=next;panel=null;update();}
 cards.forEach((card,i)=>card.addEventListener('click',()=>{if(!suppressClick)select(i);}));
 document.querySelector('#catalog-prev').addEventListener('click',()=>select(index-1));document.querySelector('#catalog-next').addEventListener('click',()=>select(index+1));
 carousel.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(index+(event.key==='ArrowRight'?1:-1));}});
 carousel.addEventListener('pointerdown',event=>{if(event.button!==0)return;startPoint={x:event.clientX,y:event.clientY,id:event.pointerId};});
 carousel.addEventListener('pointerup',event=>{if(!startPoint||startPoint.id!==event.pointerId)return;const dx=event.clientX-startPoint.x,dy=event.clientY-startPoint.y;startPoint=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4){suppressClick=true;clearTimeout(suppressTimer);suppressTimer=setTimeout(()=>suppressClick=false,300);select(index+(dx<0?1:-1));}});
 carousel.addEventListener('pointercancel',()=>startPoint=null);
 document.querySelectorAll('[data-explorer]').forEach(button=>button.addEventListener('click',()=>{demoStarted('product-explorer');panel=panel===button.dataset.explorer?null:button.dataset.explorer;update();if(panel&&!reduced.matches)details.animate([{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});}));
 update();
}
