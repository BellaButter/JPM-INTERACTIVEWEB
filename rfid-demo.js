import {demoProducts} from './content/en/demo-products.mjs';
export function setupRFIDDemo(t){
 const reader=document.querySelector('#rfid-reader'),screen=document.querySelector('#rfid-display'),status=document.querySelector('#sensor-status');
 const readerImage=document.querySelector('#rfid-reader-product'),screenImage=document.querySelector('#sensor-product-image'),remove=document.querySelector('#rfid-remove');
 let selected=demoProducts[0],drag=null,ghost=null,suppressClick=false;
 const imageURL=product=>new URL('./assets/demo-products/'+product.id+'.svg',import.meta.url).href;
 function choose(product){selected=product;document.querySelectorAll('[data-rfid-product]').forEach(button=>{const on=button.dataset.rfidProduct===product.id;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on));});status.textContent=t('Selected product:')+' '+product.name+'. '+t('Place it on the reader.');}
 function place(product=selected){
  choose(product);reader.dataset.product=product.id;screen.dataset.product=product.id;reader.classList.add('has-product');
  const id='RFID-00'+(demoProducts.indexOf(product)+1);
  readerImage.src=screenImage.src=imageURL(product);readerImage.hidden=screenImage.hidden=false;
  screenImage.alt=product.name+' '+t('sample perfume bottle');
  document.querySelector('#rfid-reader-prompt').textContent=product.name;
  document.querySelector('#rfid-reader-state').textContent=t('Tag detected');document.querySelector('#rfid-tag-id').textContent=id;
  document.querySelector('#sensor-title').textContent=product.name;document.querySelector('#sensor-copy').textContent=t(product.story);document.querySelector('#sensor-notes').textContent=t(product.notes);
  remove.disabled=false;status.textContent=t('Tag detected:')+' '+id+' → '+product.name+'. '+t('The screen shows the matching product.');
 }
 function clear(){
  reader.removeAttribute('data-product');screen.removeAttribute('data-product');reader.classList.remove('has-product');readerImage.hidden=screenImage.hidden=true;
  document.querySelector('#rfid-reader-prompt').textContent=t('Place product here');document.querySelector('#rfid-reader-state').textContent=t('Waiting for a tag');document.querySelector('#rfid-tag-id').textContent='—';
  document.querySelector('#sensor-title').textContent=t('Waiting for a product');document.querySelector('#sensor-copy').textContent=t('Place a product on the reader to see its information.');document.querySelector('#sensor-notes').textContent='';
  remove.disabled=true;status.textContent=t('Product lifted. Try a different tagged product.');
 }
 function inside(event){const rect=reader.getBoundingClientRect();return event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;}
 function cleanDrag(){ghost?.remove();ghost=null;drag=null;reader.classList.remove('drop-ready');}
 document.querySelectorAll('[data-rfid-product]').forEach(button=>{
  const product=demoProducts.find(item=>item.id===button.dataset.rfidProduct);
  button.addEventListener('click',()=>{if(!suppressClick)choose(product);});
  button.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={product,x:event.clientX,y:event.clientY,active:false};button.setPointerCapture(event.pointerId);});
  button.addEventListener('pointermove',event=>{
   if(!drag)return;if(!drag.active&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<8)return;
   if(!drag.active){drag.active=true;choose(product);ghost=document.createElement('img');ghost.src=imageURL(product);ghost.className='rfid-drag-ghost';ghost.alt='';ghost.setAttribute('aria-hidden','true');document.body.append(ghost);}
   ghost.style.left=event.clientX+'px';ghost.style.top=event.clientY+'px';reader.classList.toggle('drop-ready',inside(event));
  });
  button.addEventListener('pointerup',event=>{if(drag?.active){suppressClick=true;setTimeout(()=>{suppressClick=false;},0);if(inside(event))place(product);else status.textContent=t('Drop the product on the reader to show its story.');}cleanDrag();});
  button.addEventListener('pointercancel',cleanDrag);button.addEventListener('lostpointercapture',cleanDrag);
 });
 reader.addEventListener('click',()=>place());remove.addEventListener('click',clear);
 window.addEventListener('blur',cleanDrag);document.addEventListener('visibilitychange',()=>{if(document.hidden)cleanDrag();});
}
