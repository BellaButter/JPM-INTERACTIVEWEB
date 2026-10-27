import { setupMatchingGame } from './matching-game.js';
import { setupCustomGame } from './custom-game-demo.js';
import { setupRFIDDemo } from './rfid-demo.js';
import { setupImmersiveRoom } from './immersive-demo.js';
import { setupLuckyWheel } from './lucky-wheel.js';
import { setupQuizGame } from './quiz-game.js';
const t=text=>window.JPMI18n?.t(text)??text;
function select(group,active){document.querySelectorAll(group).forEach(button=>{const on=button===active;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on));});}

setupImmersiveRoom(t);

setupRFIDDemo(t);

setupCustomGame(t);
setupMatchingGame(t);
setupLuckyWheel(t);
setupQuizGame(t);

// Light drawing: normalized strokes survive resizing.
const canvas=document.querySelector('#light-drawing'),ctx=canvas.getContext('2d'),stage=document.querySelector('.light-stage'),brush=document.querySelector('#light-size');
const palette={violet:'#c7a5ff',blue:'#80d8ff',gold:'#ffd480'};let selectedColor='violet',drawing=false,current=null,strokes=[];
function render(){if(!ctx)return;const rect=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);for(const stroke of strokes){ctx.strokeStyle=palette[stroke.color];ctx.fillStyle=palette[stroke.color];ctx.shadowColor=palette[stroke.color];ctx.shadowBlur=stroke.size*1.5;ctx.lineWidth=stroke.size;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();stroke.points.forEach((point,i)=>{const x=point.x*rect.width,y=point.y*rect.height;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});if(stroke.points.length===1){const point=stroke.points[0];ctx.arc(point.x*rect.width,point.y*rect.height,stroke.size/2,0,Math.PI*2);ctx.fill();}else ctx.stroke();}}
function point(event){const rect=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),y:Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height))};}
canvas.addEventListener('pointerdown',event=>{if(!ctx)return;drawing=true;canvas.setPointerCapture(event.pointerId);current={color:selectedColor,size:Number(brush.value),points:[point(event)]};strokes.push(current);if(strokes.length>100)strokes.shift();render();});
canvas.addEventListener('pointermove',event=>{if(!drawing||!current||current.points.length>=1200)return;current.points.push(point(event));render();});
function finishDrawing(){if(!drawing)return;drawing=false;current=null;document.querySelector('#light-status').textContent=t('Light sketch updated.');}
canvas.addEventListener('pointerup',finishDrawing);canvas.addEventListener('pointercancel',finishDrawing);
document.querySelectorAll('[data-light-color]').forEach(button=>button.addEventListener('click',()=>{select('[data-light-color]',button);selectedColor=button.dataset.lightColor;}));
document.querySelectorAll('[data-light-display]').forEach(button=>button.addEventListener('click',()=>{select('[data-light-display]',button);stage.dataset.display=button.dataset.lightDisplay;document.querySelector('#light-status').textContent=t(stage.dataset.display==='led'?'LED grid selected.':'Projection surface selected.');}));
document.querySelector('#light-clear').addEventListener('click',()=>{strokes=[];render();document.querySelector('#light-status').textContent=t('Canvas cleared.');});
new ResizeObserver(render).observe(stage);if(!ctx)document.querySelector('#light-status').textContent=t('Drawing is unavailable in this browser.');
