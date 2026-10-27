import { mkdir, writeFile } from 'node:fs/promises';
import * as content from '../content/en/site.mjs';
import { thaiCopy, translateThai } from '../content/th/site.mjs';

const groups={studio:'ข้อมูลบริษัท',services:'บริการ',coreValues:'คุณค่าของเรา',companyStats:'ตัวเลขบริษัท',industries:'ตัวอย่างพื้นที่',workflow:'ขั้นตอนทำงาน',packages:'แพ็กเกจ',projects:'ผลงาน',articles:'บทความ',articleCategories:'หมวดบทความ'};
const source=new Map();
function collect(value,path,group) {
 if(typeof value==='string') {
  if(/\.(id|slug|image|video|art|status|category)$/.test(path))return;
  const references=source.get(value)||[];references.push({path,group});source.set(value,references);
 } else if(Array.isArray(value))value.forEach((item,i)=>collect(item,path+'['+i+']',group));
 else if(value&&typeof value==='object')Object.entries(value).forEach(([key,item])=>collect(item,path+'.'+key,group));
}
for(const [key,group] of Object.entries(groups))collect(content[key],key,group);
const entries=[];
for(const en of new Set([...source.keys(),...thaiCopy.keys(),'Crafting Interactive Experiences','JPM MEDIA SPACE • CRAFTING INTERACTIVE EXPERIENCES'])) {
 const targets=source.get(en)||[];
 const th=translateThai(en);
 entries.push({id:'copy-'+String(entries.length+1).padStart(4,'0'),group:targets[0]?.group||'เมนู ปุ่ม และข้อความหน้าเว็บ',label:targets[0]?.path||en.slice(0,90),targets:targets.map(t=>t.path),originalEn:en,originalTh:th,en,th});
}
const payload={format:'jpm-content-review',version:1,branch:'redesign-v2',created:'2026-10-15',entries};
const json=JSON.stringify(payload,null,2).replaceAll('<','\\u003c');
const html=`<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>JPM · แก้ไขข้อความเว็บไซต์</title><style>
:root{color-scheme:dark;--bg:#141414;--card:#202025;--brand:#6d7099;--line:#ffffff21;--muted:#b9bbce}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:#fff;font:15px/1.7 system-ui,Tahoma,sans-serif}header{padding:28px max(20px,calc((100vw - 1200px)/2));border-bottom:1px solid var(--line);background:#1a1a1e}h1{font-size:26px;margin:0 0 8px}p{margin:0;color:var(--muted)}.toolbar{position:sticky;top:0;z-index:2;padding:15px max(20px,calc((100vw - 1200px)/2));display:flex;gap:12px;flex-wrap:wrap;align-items:center;background:#19191df5;border-bottom:1px solid var(--line)}input,select,textarea,button{font:inherit}input,select,textarea{color:#fff;background:#141418;border:1px solid #77798b;border-radius:10px;padding:10px 12px}#search{flex:1;min-width:180px}button{color:white;border:1px solid #9498b3;border-radius:999px;background:var(--brand);padding:10px 18px;cursor:pointer;font-weight:600}button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:3px solid #c6ccff;outline-offset:3px}.secondary{background:transparent}main{max-width:1200px;margin:auto;padding:24px 20px 60px}#summary{margin-bottom:20px}.field{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin-bottom:16px}.field.changed{border-color:#b4b8ed}.field h2{font-size:16px;margin:0 0 14px;overflow-wrap:anywhere}.badge{color:#cacdf0;font-size:12px;margin-right:10px}.columns{display:grid;grid-template-columns:1fr 1fr;gap:20px}label{display:block;font-size:13px;color:#d1d3e0}textarea{display:block;width:100%;min-height:105px;line-height:1.8;resize:vertical;margin-top:6px}.original{font-size:12px;color:var(--muted);margin-top:12px;overflow-wrap:anywhere}summary{cursor:pointer}.instructions{margin-top:14px;font-size:14px}.instructions ol{margin-bottom:0;padding-left:24px}#save-state{font-size:13px;color:#dddff4}.empty{padding:40px;text-align:center}footer{color:var(--muted);font-size:13px;margin-top:24px}.row-actions{margin-top:12px}.row-actions button{font-size:12px;padding:5px 12px}.note{margin-top:8px;font-size:12px}@media(max-width:650px){.columns{grid-template-columns:1fr}.toolbar>*{max-width:100%}h1{font-size:22px}.field{padding:16px}}@media print{.toolbar,.row-actions{display:none}body{color:black;background:white}.field{break-inside:avoid;background:white;border-color:#ccc}textarea{color:black;background:white}p,label,.original{color:#333}}
</style></head><body>
<header><h1>JPM Media Space · แก้ไขข้อความเว็บไซต์</h1><p>แก้ภาษาไทยและอังกฤษในไฟล์นี้ แล้วบันทึกส่งกลับให้มีนาเพื่อนำไปอัปเดตเว็บไซต์</p><details class="instructions"><summary>วิธีใช้งาน</summary><ol><li>ค้นหาข้อความหรือเลือกหมวดที่ต้องการแก้</li><li>แก้ในช่อง English และภาษาไทยได้โดยตรง แก้เฉพาะภาษาที่ต้องการได้</li><li>กด “บันทึกไฟล์ HTML” ทุกครั้งก่อนปิด จะได้ไฟล์ใหม่ที่เก็บข้อความล่าสุด</li><li>เปิดไฟล์ที่บันทึกใหม่เพื่อตรวจ แล้วแนบไฟล์นั้นกลับมาในแชต</li></ol><p class="note">ไฟล์นี้ใช้รวบรวมข้อความ ไม่มีการส่งข้อมูลออกอินเทอร์เน็ต และยังไม่เปลี่ยนเว็บไซต์จริง ข้อความต้นฉบับเก็บไว้สำหรับเทียบเสมอ</p></details></header>
<div class="toolbar"><input id="search" type="search" aria-label="ค้นหาข้อความ" placeholder="ค้นหาข้อความไทยหรืออังกฤษ…"><select id="group" aria-label="เลือกหมวด"><option value="">ทุกหมวด</option></select><label><input id="only-changed" type="checkbox"> เฉพาะที่แก้</label><button id="save" type="button">บันทึกไฟล์ HTML</button><span id="save-state" role="status">ยังไม่มีการแก้ไข</span></div>
<main><p id="summary" role="status"></p><div id="fields"></div><footer>ไม่จำเป็นต้องแก้ทุกช่อง · ช่องที่เป็นชื่อแบรนด์หรือชื่อโครงการสามารถคงชื่อเดิมไว้ได้ · การบันทึกจะดาวน์โหลดไฟล์ใหม่ ไม่เขียนทับไฟล์เดิมอัตโนมัติ</footer></main>
<script id="content-data" type="application/json">${json}</script>
<script>
(()=>{
 const data=JSON.parse(document.getElementById('content-data').textContent);let dirty=false;
 const host=document.getElementById('fields'),search=document.getElementById('search'),group=document.getElementById('group'),only=document.getElementById('only-changed'),state=document.getElementById('save-state');
 const changed=e=>e.en!==e.originalEn||e.th!==e.originalTh;
 group.replaceChildren(new Option('ทุกหมวด',''));
 [...new Set(data.entries.map(e=>e.group))].forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=value;group.append(option)});
 function status(){const count=data.entries.filter(changed).length;document.getElementById('summary').textContent='ทั้งหมด '+data.entries.length+' รายการ · แก้แล้ว '+count+' รายการ';state.textContent=dirty?'มีข้อความที่ยังไม่ได้บันทึก':'พร้อมบันทึกหรือส่งกลับ';}
 function render(){host.replaceChildren();let shown=0;const query=search.value.toLocaleLowerCase().trim();for(const entry of data.entries){if(group.value&&entry.group!==group.value||only.checked&&!changed(entry)||query&&![entry.en,entry.th,entry.originalEn,entry.originalTh,entry.label].join(' ').toLocaleLowerCase().includes(query))continue;shown++;
  const card=document.createElement('section');card.className='field'+(changed(entry)?' changed':'');const heading=document.createElement('h2');const badge=document.createElement('span');badge.className='badge';badge.textContent=entry.group;heading.append(badge,document.createTextNode(entry.label));card.append(heading);const columns=document.createElement('div');columns.className='columns';
  for(const [lang,labelText] of [['en','English'],['th','ภาษาไทย']]){const label=document.createElement('label');label.textContent=labelText;const area=document.createElement('textarea');area.lang=lang;area.value=entry[lang];area.setAttribute('aria-label',entry.id+' '+labelText);area.rows=entry[lang].length>250?7:3;area.addEventListener('input',()=>{entry[lang]=area.value;dirty=true;card.classList.toggle('changed',changed(entry));status()});label.append(area);columns.append(label)}card.append(columns);
  const details=document.createElement('details');details.className='original';const summary=document.createElement('summary');summary.textContent='ดูข้อความเดิม';details.append(summary);for(const value of [entry.originalEn,entry.originalTh]){const p=document.createElement('p');p.textContent=value;details.append(p)}card.append(details);
  const actions=document.createElement('div');actions.className='row-actions';const reset=document.createElement('button');reset.type='button';reset.className='secondary';reset.textContent='คืนข้อความเดิมรายการนี้';reset.onclick=()=>{entry.en=entry.originalEn;entry.th=entry.originalTh;dirty=true;render()};actions.append(reset);card.append(actions);host.append(card);
 }if(!shown){const p=document.createElement('p');p.className='empty';p.textContent='ไม่พบรายการที่ตรงกับตัวกรอง';host.append(p)}status();}
 search.addEventListener('input',render);group.addEventListener('change',render);only.addEventListener('change',render);
 document.getElementById('save').addEventListener('click',()=>{data.savedAt=new Date().toISOString();document.getElementById('content-data').textContent=JSON.stringify(data,null,2).replaceAll('<','\\u003c');const output='<!doctype html>\\n'+document.documentElement.outerHTML;const url=URL.createObjectURL(new Blob([output],{type:'text/html;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='JPM-Website-Content-Edited.html';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);dirty=false;state.textContent='ดาวน์โหลดแล้ว · กรุณาส่งไฟล์ที่บันทึกล่าสุดกลับมา';});
 window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue=''}});render();
})();
</script></body></html>`;
await mkdir(new URL('../deliverables/',import.meta.url),{recursive:true});
await writeFile(new URL('../deliverables/JPM-Website-Content-Editor.html',import.meta.url),html);
console.log(`Exported ${entries.length} bilingual copy entries to deliverables/JPM-Website-Content-Editor.html`);
