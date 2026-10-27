// Shared look and feel for the Playground games (2026-10-27): the mascot on start and result screens, drawn item icons,
// score pops, confetti, a short shake, a low-time warning and optional sound effects (off until the visitor turns them on).
const reduced=matchMedia('(prefers-reduced-motion: reduce)');

// Drawn icons, 100 x 100 centred on 0 0. Used instead of text symbols and emoji so every game shares one art style.
export const ICONS={
 star:'<path d="M0-40l11 24 26 3-19 18 5 26L0 18-23 31l5-26-19-18 26-3z" fill="#ffd166" stroke="#c99a1d" stroke-width="3" stroke-linejoin="round"/><path d="M-6-14l6-14 4 9" stroke="#fff6d6" stroke-width="4" fill="none" stroke-linecap="round"/>',
 heart:'<path d="M0 34C-32 12-40-6-34-20c6-14 26-16 34-2 8-14 28-12 34 2 6 14-2 32-34 54z" fill="#ff6b9a" stroke="#c23d6c" stroke-width="3"/><ellipse cx="-17" cy="-14" rx="7" ry="5" fill="#ffc2d6"/>',
 gem:'<path d="M-30-14l12-18h36l12 18L0 36z" fill="#7fd6f2" stroke="#2f8fb3" stroke-width="3" stroke-linejoin="round"/><path d="M-30-14h60M-18-32l8 18L0 36M18-32l-8 18" stroke="#2f8fb3" stroke-width="2.5" fill="none"/><path d="M-10-14l10-18 10 18z" fill="#c9f1ff"/>',
 coin:'<circle r="32" fill="#ffd166" stroke="#c99a1d" stroke-width="4"/><circle r="22" fill="none" stroke="#e8b33a" stroke-width="3"/><path d="M-6-12h10a7 7 0 0 1 0 14H-6h12a7 7 0 0 1 0 14H-6zM0-18v40" stroke="#a87b10" stroke-width="4" fill="none" stroke-linecap="round"/>',
 gift:'<rect x="-30" y="-10" width="60" height="42" rx="6" fill="#a98bf2" stroke="#6b52c9" stroke-width="3"/><rect x="-34" y="-22" width="68" height="16" rx="5" fill="#c3b0fa" stroke="#6b52c9" stroke-width="3"/><path d="M0-22v54" stroke="#ffd166" stroke-width="9"/><path d="M0-22c-14-18-28-8-16 0M0-22c14-18 28-8 16 0" stroke="#ffd166" stroke-width="6" fill="none" stroke-linecap="round"/>',
 coupon:'<path d="M-38-18h76v10a8 8 0 0 0 0 16v10h-76V8a8 8 0 0 0 0-16z" fill="#7be0b0" stroke="#2f9a6c" stroke-width="3"/><path d="M-12-14v28" stroke="#2f9a6c" stroke-width="3" stroke-dasharray="4 4"/><text x="13" y="7" font-size="20" font-weight="800" text-anchor="middle" fill="#14402c">%</text>',
 bomb:'<circle cy="6" r="28" fill="#2a2c40" stroke="#ff6b81" stroke-width="4"/><path d="M14-18l10-12" stroke="#2a2c40" stroke-width="6" stroke-linecap="round"/><circle cx="27" cy="-33" r="6" fill="#ffd166"/><path d="M-12-6l24 24M12-6l-24 24" stroke="#ff6b81" stroke-width="7" stroke-linecap="round"/>',
 strawberry:'<path d="M0 36C-26 22-34-2-26-14c8-10 44-10 52 0 8 12 0 36-26 50z" fill="#ff5a6e" stroke="#c22f45" stroke-width="3"/><path d="M-20-16l8-12 12 8 12-8 8 12" fill="#52b86e" stroke="#2f7a45" stroke-width="3" stroke-linejoin="round"/><g fill="#ffe08a"><circle cx="-10" cy="2" r="2.5"/><circle cx="8" cy="0" r="2.5"/><circle cx="-2" cy="16" r="2.5"/><circle cx="12" cy="14" r="2.5"/></g>',
 lemon:'<ellipse rx="34" ry="24" fill="#ffe066" stroke="#c9a51d" stroke-width="3"/><path d="M-34 0l-8-4M34 0l8 4" stroke="#c9a51d" stroke-width="4" stroke-linecap="round"/><ellipse cx="-12" cy="-10" rx="10" ry="5" fill="#fff6b8"/>',
 grapes:'<g fill="#9b6bdf" stroke="#5e3aa0" stroke-width="2.5"><circle cx="-14" cy="-8" r="11"/><circle cx="8" cy="-8" r="11"/><circle cx="-4" cy="10" r="11"/><circle cx="18" cy="10" r="11"/><circle cx="6" cy="27" r="11"/></g><path d="M0-20c0-10 6-16 14-18" stroke="#2f7a45" stroke-width="4" fill="none" stroke-linecap="round"/>',
 cherry:'<path d="M-14 8C-8-20 6-32 20-36M14 12C14-12 18-26 20-36" stroke="#2f7a45" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-14" cy="18" r="15" fill="#e8334f" stroke="#a51d33" stroke-width="3"/><circle cx="14" cy="22" r="15" fill="#e8334f" stroke="#a51d33" stroke-width="3"/><circle cx="-19" cy="13" r="4" fill="#ffb3c0"/>',
 watermelon:'<path d="M-38-6a38 38 0 0 0 76 0z" fill="#3fae6a" stroke="#256e42" stroke-width="3"/><path d="M-31-6a31 31 0 0 0 62 0z" fill="#ff5a6e"/><g fill="#2a2c40"><ellipse cx="-14" cy="6" rx="3" ry="4.5"/><ellipse cx="0" cy="12" rx="3" ry="4.5"/><ellipse cx="14" cy="6" rx="3" ry="4.5"/></g>',
 orange:'<circle cy="4" r="31" fill="#ff9a3d" stroke="#c9671a" stroke-width="3"/><path d="M0-27c4-8 12-10 18-8-4 6-10 9-18 8z" fill="#52b86e"/><ellipse cx="-12" cy="-8" rx="8" ry="5" fill="#ffd0a3"/>',
 sun:'<g stroke="#ffb020" stroke-width="5" stroke-linecap="round"><path d="M0-42v10M0 32v10M-42 0h10M32 0h10M-30-30l7 7M23 23l7 7M-30 30l7-7M23-23l7-7"/></g><circle r="22" fill="#ffd166" stroke="#e09a12" stroke-width="3"/>',
 moon:'<path d="M12-34a34 34 0 1 0 22 52A28 28 0 0 1 12-34z" fill="#fff1b8" stroke="#d9b75a" stroke-width="3"/><circle cx="-8" cy="6" r="4" fill="#e8d18a"/><circle cx="4" cy="20" r="3" fill="#e8d18a"/>',
 comet:'<path d="M-36 30L4-6" stroke="#8fd8ff" stroke-width="10" stroke-linecap="round" opacity=".5"/><path d="M-26 34L8 2" stroke="#c9f1ff" stroke-width="5" stroke-linecap="round"/><circle cx="14" cy="-12" r="16" fill="#8fd8ff" stroke="#2f8fb3" stroke-width="3"/>',
 planet:'<circle r="22" fill="#a98bf2" stroke="#6b52c9" stroke-width="3"/><ellipse rx="40" ry="11" fill="none" stroke="#ffd166" stroke-width="5" transform="rotate(-18)"/><path d="M-14-8a16 16 0 0 1 12-10" stroke="#e0d4ff" stroke-width="4" fill="none" stroke-linecap="round"/>',
 sparkle:'<path d="M0-38c4 22 16 34 38 38-22 4-34 16-38 38-4-22-16-34-38-38 22-4 34-16 38-38z" fill="#c7a5ff" stroke="#7d6fd0" stroke-width="3" stroke-linejoin="round"/>',
 circle:'<circle r="30" fill="#7fd6f2" stroke="#2f8fb3" stroke-width="4"/><circle cx="-10" cy="-10" r="8" fill="#c9f1ff"/>',
 triangle:'<path d="M0-34L34 28H-34z" fill="#7be0b0" stroke="#2f9a6c" stroke-width="4" stroke-linejoin="round"/>',
 square:'<rect x="-28" y="-28" width="56" height="56" rx="10" fill="#ff9a3d" stroke="#c9671a" stroke-width="4"/>'
};
export const icon=(name,className='kit-icon')=>`<svg class="${className}" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">${ICONS[name]||ICONS.star}</svg>`;

// The round mascot (same character as the Home and Playground heroes) with a few moods for game screens.
const EYES={
 ready:'<ellipse cx="-24" cy="-10" rx="9" ry="13" fill="#f2f3ff"/><ellipse cx="24" cy="-10" rx="9" ry="13" fill="#f2f3ff"/>',
 happy:'<path d="M-33-6q9-12 18 0M15-6q9-12 18 0" stroke="#f2f3ff" stroke-width="5" stroke-linecap="round" fill="none"/>',
 wow:'<circle cx="-24" cy="-10" r="12" fill="#f2f3ff"/><circle cx="24" cy="-10" r="12" fill="#f2f3ff"/><circle cx="-24" cy="-10" r="4" fill="#0b0b12"/><circle cx="24" cy="-10" r="4" fill="#0b0b12"/>',
 sad:'<path d="M-33-14q9 10 18 0M15-14q9 10 18 0" stroke="#f2f3ff" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M28 0q4 8 0 12q-4-4 0-12z" fill="#8fd8ff"/>',
 sleep:'<path d="M-33-8q9 7 18 0M15-8q9 7 18 0" stroke="#f2f3ff" stroke-width="5" stroke-linecap="round" fill="none"/>',
 dizzy:'<path d="M-32-18l14 14M-18-18l-14 14M18-18l14 14M32-18l-14 14" stroke="#f2f3ff" stroke-width="5" stroke-linecap="round"/>'
};
let gradientId=0;
export function mascot(mood='ready',className='kit-mascot-svg'){
 const id='kit-m'+(++gradientId);
 return `<svg class="${className}" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false"><defs><radialGradient id="${id}b" cx="35%" cy="28%" r="78%"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#e9e9f2"/><stop offset="1" stop-color="#c3c5d6"/></radialGradient><linearGradient id="${id}r" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8a63f2"/><stop offset="1" stop-color="#5f86f5"/></linearGradient></defs><ellipse cx="0" cy="88" rx="52" ry="8" fill="#0000004d"/><circle r="72" fill="url(#${id}b)"/><rect x="-54" y="-42" width="108" height="64" rx="30" fill="url(#${id}r)"/><rect x="-49" y="-37" width="98" height="54" rx="26" fill="#0b0b12"/><g class="kit-eyes">${EYES[mood]||EYES.ready}</g><rect x="-12" y="${mood==='wow'?32:36}" width="24" height="${mood==='wow'?12:6}" rx="3" fill="#1a1a24"/></svg>`;
}
// Puts the mascot at the top of a start/result overlay and returns a function that changes its mood.
export function overlayMascot(overlay){
 let holder=overlay.querySelector(':scope > .kit-mascot');
 if(!holder){holder=document.createElement('div');holder.className='kit-mascot';overlay.prepend(holder);}
 const set=mood=>{if(holder.dataset.mood===mood)return;holder.dataset.mood=mood;holder.innerHTML=mascot(mood);};
 set('ready');return set;
}

// A short "+10" style label that floats up from a point inside `host` (positioned relative).
export function pop(host,x,y,text,kind='good'){
 const node=document.createElement('span');node.className='kit-pop kit-pop-'+kind;node.textContent=text;node.style.left=x+'px';node.style.top=y+'px';
 host.append(node);setTimeout(()=>node.remove(),900);
}
export function shake(el){if(reduced.matches)return;el.classList.remove('kit-shake');void el.offsetWidth;el.classList.add('kit-shake');setTimeout(()=>el.classList.remove('kit-shake'),400);}
export function confetti(host,count=46){
 if(reduced.matches)return;
 const colors=['#a98bf2','#7fd6f2','#ffd166','#ff6b9a','#7be0b0','#ffffff'];
 const layer=document.createElement('div');layer.className='kit-confetti';layer.setAttribute('aria-hidden','true');
 for(let i=0;i<count;i++){const bit=document.createElement('i');bit.style.left=Math.random()*100+'%';bit.style.background=colors[i%colors.length];bit.style.setProperty('--x',(Math.random()-.5)*160+'px');bit.style.setProperty('--r',Math.random()*900-450+'deg');bit.style.animationDelay=Math.random()*.35+'s';bit.style.animationDuration=1.2+Math.random()*.9+'s';layer.append(bit);}
 host.append(layer);setTimeout(()=>layer.remove(),2600);
}
// Adds .is-low to a timer chip in the last five seconds.
export function lowTime(el,seconds){el?.closest('span')?.classList.toggle('is-low',seconds>0&&seconds<=5);}

// Sound: tiny synthesized blips, off by default. The choice is remembered on this device only.
let audio=null,soundOn=false;
try{soundOn=localStorage.getItem('jpm-game-sound')==='on';}catch{}
const listeners=new Set();
export const sound={
 get on(){return soundOn;},
 set(on){soundOn=on;try{localStorage.setItem('jpm-game-sound',on?'on':'off');}catch{}listeners.forEach(fn=>fn(on));if(on)this.play('good');},
 onChange(fn){listeners.add(fn);fn(soundOn);},
 play(name){
  if(!soundOn)return;
  try{audio??=new AudioContext();}catch{return;}
  const notes={good:[[880,.06],[1320,.08]],bad:[[180,.16]],tick:[[660,.04]],win:[[523,.1],[659,.1],[784,.1],[1047,.22]],lose:[[392,.14],[311,.22]],flip:[[520,.04]],spin:[[440,.03]]}[name]||[[600,.05]];
  let at=audio.currentTime;
  for(const [freq,length] of notes){const osc=audio.createOscillator(),gain=audio.createGain();osc.type=name==='bad'?'sawtooth':'triangle';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.12,at+.01);gain.gain.exponentialRampToValueAtTime(.0001,at+length);osc.connect(gain).connect(audio.destination);osc.start(at);osc.stop(at+length+.02);at+=length*.9;}
 }
};
