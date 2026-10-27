import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { chromium }=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
const plan=JSON.parse(await readFile(new URL('../sitemap-plan.json',import.meta.url),'utf8'));
const errors=[];
try {
 const page=await browser.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)errors.push(response.status()+' '+response.url());});
 for(const width of [1440,390,320]) {
  await page.setViewportSize({width,height:1000});
  const routes=width===1440?plan.thaiRoutes:plan.thaiRoutes.filter(route=>route.split('/').length===2);
  for(const route of routes) {
   await page.goto(base+'/'+route,{waitUntil:'networkidle'});
   assert.equal(await page.locator('html').getAttribute('lang'),'th');
   assert.equal(await page.locator('h1').count(),1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${route}`);
   assert.equal(await page.locator('.language-option[lang="th"]').getAttribute('aria-current'),'page');
   assert.equal(await page.locator('.language-option[lang="en"]').getAttribute('href').then(href=>new URL(href).pathname),'/'+route.slice(3));
  }
  console.log(`PASS: ${routes.length} Thai pages at ${width}px, paired languages and no overflow`);
 }
 await page.goto(base+'/insights/designing-for-participation.html?service=Interactive%20Games#section-2');
 await page.locator('.language-option[lang=th]').click();
 await page.waitForURL('**/th/insights/designing-for-participation.html?service=Interactive%20Games#section-2');
 assert((await page.locator('h1').textContent()).includes('ออกแบบ'));
 await page.locator('.language-option[lang=en]').click();await page.waitForURL('**/insights/designing-for-participation.html?service=Interactive%20Games#section-2');
 await page.goto(base+'/th/index.html');await page.getByRole('button',{name:'เทคโนโลยี',exact:true}).click();assert.equal(await page.locator('.bento-card:visible').count(),2);assert((await page.locator('.catalog-status').textContent()).includes('รายการ'));
 await page.goto(base+'/th/insights.html');await page.getByRole('button',{name:'เบื้องหลังประสบการณ์',exact:true}).click();assert(await page.locator('.article-empty').isVisible());await page.getByRole('button',{name:'คู่มือวางแผนงาน',exact:true}).click();assert.equal(await page.locator('.article-card:visible').count(),1);
 await page.goto(base+'/th/contact.html?service=Interactive%20Games');assert.equal(await page.getByLabel('อยากให้เราช่วยเรื่องอะไร?').inputValue(),'เกมอินเทอร์แอคทีฟ');
 let payload;
 await page.route('https://formsubmit.co/**',async route=>{payload=new URLSearchParams(route.request().postData());await route.fulfill({status:303,headers:{location:base+'/th/thank-you.html'},body:''});});
 await page.getByLabel('ชื่อของคุณ').fill('ทดสอบภาษาไทย');await page.getByLabel('อีเมล',{exact:true}).fill('preview@example.invalid');await page.getByLabel('เล่าโครงการของคุณให้เราฟัง').fill('ทดสอบในเครื่อง ไม่ส่งอีเมลจริง');await page.getByRole('button',{name:'ส่งรายละเอียด',exact:true}).click();await page.waitForURL('**/th/thank-you.html');assert.equal(payload.get('name'),'ทดสอบภาษาไทย');assert.equal(payload.get('_next'),base+'/th/thank-you.html');
 await page.goto(base+'/th/playground.html');await page.getByRole('button',{name:'เริ่มเกม',exact:true}).click();await page.getByRole('button',{name:'พักเกม',exact:true}).click();assert.equal(await page.locator('.game-start-label').textContent(),'เล่นต่อ');await page.getByRole('button',{name:'เปิดภาพ',exact:true}).click();assert((await page.locator('#scratch-status').textContent()).includes('เปิดแล้ว'));await page.getByRole('button',{name:'จุดเด่น',exact:true}).click();assert.equal(await page.locator('#explorer-title').textContent(),'Coast · จุดเด่น');
 const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}});const native=await plain.newPage();await native.goto(base+'/th/services.html');await native.locator('.language-option[lang=en]').click();await native.waitForURL('**/services.html');await plain.close();
 assert.deepEqual(errors,[]);
 console.log('PASS: language query/hash, Thai filters, enquiry POST intercepted, demo states, no-JavaScript language links, no local errors');
} finally {await browser.close();}
