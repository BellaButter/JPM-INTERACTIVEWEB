import {setupItemUpload} from './item-upload.js';
export function setupCatchCustomization({config,apply,stop,t}){
 const defaults={...config},panel=document.querySelector('#catch-customization');
 const fields={brand:document.querySelector('#catch-brand'),color:document.querySelector('#catch-color'),item:document.querySelector('#catch-item'),duration:document.querySelector('#catch-duration'),difficulty:document.querySelector('#catch-difficulty'),hazards:document.querySelector('#catch-hazards'),penalty:document.querySelector('#catch-penalty')};
 const reset=document.querySelector('#catch-reset-settings'),edit=document.querySelector('#catch-edit');let active=false;
 const upload=setupItemUpload('catch',{t,onChange:applyFields,onBusy:value=>{document.querySelector('#game-start').disabled=value;}});
 function populate(){fields.brand.value='';fields.color.value=defaults.accentColor;fields.item.value=defaults.objectSymbol;for(const [key,value] of [['duration',defaults.durationSeconds],['hazards',defaults.hazardChance],['penalty',defaults.hazardPenalty],['color',defaults.accentColor],['item',defaults.objectSymbol]]){if(![...fields[key].options].some(option=>option.value===String(value))){const option=document.createElement('option');option.value=String(value);option.textContent=String(value);fields[key].append(option);}fields[key].value=String(value);}fields.difficulty.value='normal';}
 function applyFields(){if(active)return;const speeds={easy:[.18,900],normal:[.23,700],fast:[.35,500]},[fallSpeed,spawnIntervalMs]=speeds[fields.difficulty.value];apply({...config,brandName:fields.brand.value.trim()||defaults.brandName,accentColor:fields.color.value,objectSymbol:fields.item.value,objectImage:'',durationSeconds:Number(fields.duration.value),fallSpeed,spawnIntervalMs,hazardChance:Number(fields.hazards.value),hazardPenalty:Number(fields.penalty.value)},upload.url);}
 Object.values(fields).forEach(field=>field.addEventListener('input',applyFields));
 reset.addEventListener('click',()=>{upload.clear(false);populate();apply(defaults);});
 edit.addEventListener('click',()=>{stop();panel.open=true;});
 populate();
 return {lock(value){active=value;Object.entries(fields).forEach(([key,field])=>field.disabled=active||(key==='item'&&!!upload.url));reset.disabled=active;edit.disabled=!active;upload.setDisabled(active);}};
}
