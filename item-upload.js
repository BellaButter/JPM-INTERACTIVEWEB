// Local image selection only: no request or persistent storage is used.
export function setupItemUpload(prefix,{t,onChange,onBusy=()=>{},emptyMessage='Choose a picture to use as the collectible.'}){
 const input=document.querySelector('#'+prefix+'-upload'),preview=document.querySelector('#'+prefix+'-upload-preview'),image=preview.querySelector('img'),name=preview.querySelector('.upload-name'),remove=document.querySelector('#'+prefix+'-remove-upload'),status=document.querySelector('#'+prefix+'-upload-status');
 let url='',generation=0,busy=false,disabled=false;
 function setBusy(value){busy=value;onBusy(value);}
 function clear(notify=true){generation++;setBusy(false);if(url)URL.revokeObjectURL(url);url='';input.value='';preview.hidden=true;image.removeAttribute('src');name.textContent='';status.textContent=t(emptyMessage);if(notify)onChange();}
 input.addEventListener('change',async()=>{
  const file=input.files?.[0];if(!file||disabled)return;
  const token=++generation;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024||file.size===0){input.value='';setBusy(false);status.textContent=t('Choose a PNG, JPG, or WebP image up to 5 MB.');return;}
  setBusy(true);status.textContent=t('Preparing your image…');const candidate=URL.createObjectURL(file),probe=new Image();
  try{
   await new Promise((resolve,reject)=>{probe.onload=resolve;probe.onerror=reject;probe.src=candidate;});
   if(token!==generation||disabled){URL.revokeObjectURL(candidate);return;}
   if(url)URL.revokeObjectURL(url);url=candidate;image.src=url;name.textContent=file.name;preview.hidden=false;setBusy(false);status.textContent=t('Your image is ready. It stays in this browser.');onChange();
  }catch{URL.revokeObjectURL(candidate);if(token===generation){input.value='';setBusy(false);status.textContent=t('This image could not be opened. Choose another image.');}}
 });
 remove.addEventListener('click',()=>{if(!disabled)clear();});
 return {get url(){return url;},get busy(){return busy;},clear,setDisabled(value){disabled=value;input.disabled=remove.disabled=value;if(value&&busy){generation++;input.value='';setBusy(false);status.textContent=t('End the round to choose a new image.');}}};
}
