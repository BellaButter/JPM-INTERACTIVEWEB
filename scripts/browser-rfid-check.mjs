import assert from 'node:assert/strict';
import {demoProducts} from '../content/en/demo-products.mjs';
import {translateThai} from '../content/th/site.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
try{
 for(const locale of ['', 'th/']){
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/'+locale+'playground.html',{waitUntil:'networkidle'});
   const reader=page.locator('#rfid-reader'),screen=page.locator('#rfid-display');
   for(const [i,product] of demoProducts.entries()){
    await page.locator('[data-rfid-product='+product.id+']').focus();await page.keyboard.press('Enter');
    assert.equal(await screen.getAttribute('data-product'),null,'selection alone must not scan the tag');
    await reader.focus();await page.keyboard.press('Enter');
    assert.equal(await reader.getAttribute('data-product'),product.id);assert.equal(await screen.getAttribute('data-product'),product.id);
    assert.equal(await page.locator('#rfid-tag-id').textContent(),'RFID-00'+(i+1));
    assert.equal(await page.locator('#sensor-title').textContent(),product.name);
    assert.equal(await page.locator('#sensor-copy').textContent(),locale?translateThai(product.story):product.story);
    assert(await page.locator('#sensor-product-image').isVisible());
    await page.locator('#rfid-remove').click();assert.equal(await screen.getAttribute('data-product'),null);assert(await page.locator('#sensor-product-image').isHidden());
   }
   // Dragging the physical-looking product onto the pad scans its own ID.
   const product=page.locator('[data-rfid-product=grove]');await product.scrollIntoViewIfNeeded();
   const a=await product.boundingBox(),b=await reader.boundingBox();
   await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:12});await page.mouse.up();
   assert.equal(await screen.getAttribute('data-product'),'grove');
   assert.match(await page.locator('#sensor-status').textContent(),/RFID-002/);
   assert.equal(await page.locator('.rfid-drag-ghost').count(),0);
   if(width===1440)await page.locator('#sensor-trigger').screenshot({path:'.preview/rfid-'+(locale?'th':'en')+'.png'});
   if(width===390)await page.locator('.rfid-demo').screenshot({path:'.preview/rfid-mobile-'+(locale?'th':'en')+'.png'});
   await page.locator('#rfid-remove').click();await product.scrollIntoViewIfNeeded();const outside=await product.boundingBox();
   await page.mouse.move(outside.x+20,outside.y+30);await page.mouse.down();await page.mouse.move(outside.x+40,outside.y+50,{steps:4});await page.mouse.up();assert.equal(await screen.getAttribute('data-product'),null,'drop outside reader must not scan');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   console.log('PASS: '+(locale||'en/')+width+'px — product identity, keyboard placement, drag/drop, lift/reset and layout');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await mobile.newPage();await page.goto(base+'/th/playground.html');
 await page.locator('[data-rfid-product=dusk]').tap();await page.locator('#rfid-reader').tap();assert.equal(await page.locator('#rfid-display').getAttribute('data-product'),'dusk');
 await page.locator('#rfid-remove').tap();const product=page.locator('[data-rfid-product=coast]');await product.scrollIntoViewIfNeeded();
 const a=await product.boundingBox(),b=await page.locator('#rfid-reader').boundingBox(),cdp=await mobile.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x+a.width/2,y:a.y+a.height/2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.equal(await page.locator('#rfid-display').getAttribute('data-product'),'coast');await mobile.close();
 console.log('PASS: touchscreen selection/placement and actual touch drag');
}finally{await browser.close();}
