import assert from 'node:assert/strict';
import {demoProducts} from '../content/en/demo-products.mjs';
import {translateThai} from '../content/th/site.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
try {
 for(const locale of ['', 'th/']) {
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
  for(const width of [1440,390,320]) {
   await page.setViewportSize({width,height:1000});await page.goto(base+'/'+locale+'playground.html',{waitUntil:'networkidle'});
   assert(await page.locator('#catalog-details').isHidden());await page.locator('#catalog-next').click();assert.equal(await page.locator('#explorer-product-name').textContent(),'Grove');
   await page.locator('.catalog-carousel').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#explorer-product-name').textContent(),'Dusk');await page.locator('#catalog-next').click();assert.equal(await page.locator('#explorer-product-name').textContent(),'Coast');await page.locator('#catalog-prev').click();
   await page.locator('.catalog-carousel').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#explorer-product-name').textContent(),'Grove');await page.locator('#catalog-prev').click();assert.equal(await page.locator('#explorer-product-name').textContent(),'Coast');
   for(const product of demoProducts) {
    const button=page.locator('.product-choice[data-product='+product.id+']');
    await button.focus();await page.keyboard.press('Enter');
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#explorer-product-name').textContent(),product.name);
    assert((await page.locator('#explorer-product-image').getAttribute('src')).endsWith('/'+product.id+'.svg'));
    await page.waitForFunction(()=>document.querySelector('#explorer-product-image').complete&&document.querySelector('#explorer-product-image').naturalWidth>0);
    assert(await page.locator('#catalog-details').isHidden());
    for(const panel of ['story','features','notes']) {
     await page.locator('[data-explorer='+panel+']').click();
     assert(await page.locator('#catalog-details').isVisible());assert.equal(await page.locator('[data-explorer='+panel+']').getAttribute('aria-expanded'),'true');
     assert.equal(await page.locator('#explorer-text').textContent(),locale?translateThai(product[panel]):product[panel]);
     await page.locator('[data-explorer='+panel+']').click();assert(await page.locator('#catalog-details').isHidden());
    }
   }
   await page.locator('[data-explorer=story]').click();await page.locator('[data-explorer=features]').click();assert(await page.locator('#catalog-details').isVisible());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(width===1440)await page.locator('#product-explorer').screenshot({animations:'disabled',path:'.preview/catalog-'+(locale?'th':'en')+'.png'});
   if(width===390)await page.locator('.product-catalog').screenshot({animations:'disabled',path:'.preview/catalog-mobile-'+(locale?'th':'en')+'.png'});
   console.log('PASS: '+(locale||'en/')+width+'px — all product images, information panels, keyboard selection, and layout');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await mobile.newPage();await page.goto(base+'/th/playground.html');
 await page.locator('.catalog-carousel').scrollIntoViewIfNeeded();const bounds=await page.locator('.catalog-carousel').boundingBox(),cdp=await mobile.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:bounds.x+bounds.width*.8,y:bounds.y+100}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:bounds.x+bounds.width*.2,y:bounds.y+100}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await page.locator('#explorer-product-name').textContent(),'Grove');
 await page.locator('[data-product=grove].product-choice').tap();await page.locator('[data-explorer=features]').tap();
 assert.equal(await page.locator('#explorer-product-name').textContent(),'Grove');assert.equal(await page.locator('#explorer-text').textContent(),translateThai(demoProducts[1].features));
 await mobile.close();console.log('PASS: touchscreen product selection and details');
} finally {await browser.close();}
