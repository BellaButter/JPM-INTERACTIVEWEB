import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
try{
 for(const locale of ['', 'th/']){
  const page=await browser.newPage(),errors=[],sent=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(['POST','PUT'].includes(r.method()))sent.push(r.url());});
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/'+locale+'playground.html',{waitUntil:'networkidle'});
   const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');x.fillStyle='#ffbd69';x.beginPath();x.arc(48,48,40,0,Math.PI*2);x.fill();x.fillStyle='#3255a8';x.fillRect(25,30,46,36);return c.toDataURL();});
   const file={name:'my-product.png',mimeType:'image/png',buffer:Buffer.from(png.split(',')[1],'base64')};
   await page.locator('#catch-customization > summary').click();await page.locator('#catch-brand').fill('INSTANT CATCH');assert.equal(await page.locator('#game-brand').textContent(),'INSTANT CATCH');assert.equal(await page.locator('#catch-apply').count(),0);
   await page.locator('#catch-hazards').selectOption('0');await page.locator('#catch-upload').setInputFiles(file);await page.waitForFunction(()=>document.querySelector('.legend-spark img')?.complete&&document.querySelector('.legend-spark img').naturalWidth>0);
   const catchURL=await page.locator('.legend-spark img').getAttribute('src');assert(catchURL.startsWith('blob:'));assert(await page.locator('#catch-upload-preview').isVisible());assert(await page.locator('#catch-item').isDisabled());
   await page.locator('#game-start').click();await page.waitForFunction(()=>document.querySelector('.falling-object img')?.naturalWidth>0);assert.equal(await page.locator('.falling-object img').first().getAttribute('src'),catchURL);assert(await page.locator('#catch-upload').isDisabled());
   await page.locator('#catch-edit').click();assert.equal(await page.locator('.legend-spark img').getAttribute('src'),catchURL);await page.locator('#catch-remove-upload').click();assert.equal(await page.locator('.legend-spark img').count(),0);assert(await page.locator('#catch-item').isEnabled());
   await page.locator('#tap-customization > summary').click();await page.locator('#builder-item').selectOption('heart');await page.locator('#builder-upload').setInputFiles(file);await page.waitForFunction(()=>document.querySelector('.custom-game-item[data-item=upload] img')?.naturalWidth>0);
   const uploadedURL=await page.locator('#builder-upload-preview img').getAttribute('src');assert(uploadedURL.startsWith('blob:'));assert.equal(await page.locator('.custom-game-item[data-item=upload] img').count(),3);assert.equal(await page.locator('#builder-instruction img').getAttribute('src'),uploadedURL);
   await page.locator('#builder-activate').click();await page.locator('.custom-game-item[data-item=upload]').first().click();assert.equal(await page.locator('#builder-count').textContent(),'1');await page.locator('.custom-game-item.is-up:not([data-item=upload])').first().click();assert.equal(await page.locator('#builder-count').textContent(),'1');assert(await page.locator('#builder-upload').isDisabled());await page.locator('#builder-stop').click();
   await page.locator('#builder-upload').setInputFiles({name:'bad.png',mimeType:'image/png',buffer:Buffer.from('not an image')});await page.waitForFunction(()=>/could not|เปิดภาพนี้ไม่ได้/.test(document.querySelector('#builder-upload-status').textContent));assert.equal(await page.locator('#builder-upload-preview img').getAttribute('src'),uploadedURL);
   await page.locator('#builder-upload').setInputFiles({name:'too-big.png',mimeType:'image/png',buffer:Buffer.alloc(5*1024*1024+1)});assert.match(await page.locator('#builder-upload-status').textContent(),/5 MB/);assert.equal(await page.locator('#builder-upload-preview img').getAttribute('src'),uploadedURL);
   await page.locator('#builder-remove-upload').click();assert(await page.locator('#builder-upload-preview').isHidden());assert.equal(await page.locator('.custom-game-item img').count(),0);assert.equal(await page.locator('.custom-game-item[data-item=heart]').count(),3);assert(await page.locator('#builder-item').isEnabled());
   await page.locator('#reveal-customization > summary').click();await page.locator('#reveal-message').fill('LIVE MESSAGE');assert.equal(await page.locator('.reveal-brand-message').textContent(),'LIVE MESSAGE');assert.equal(await page.locator('#reveal-apply').count(),0);await page.locator('#reveal-color').selectOption('mint');assert.equal(await page.locator('.scratch-stage').getAttribute('data-color'),'mint');
   await page.locator('#reveal-message').fill('');await page.locator('#reveal-upload').setInputFiles(file);await page.waitForFunction(()=>document.querySelector('#reveal-background-image')?.naturalWidth>0&&!document.querySelector('#reveal-background-image').hidden);
   const photoURL=await page.locator('#reveal-background-image').getAttribute('src');assert(photoURL.startsWith('blob:'));assert(await page.locator('.scratch-message').isHidden());
   const fog=page.locator('#scratch-canvas');assert(await fog.isVisible());await page.locator('.scratch-stage').scrollIntoViewIfNeeded();await page.locator('#scratch-motion').click();
   const box=await fog.boundingBox();await page.mouse.move(box.x+80,box.y+80);await page.mouse.down();await page.mouse.move(box.x+150,box.y+110,{steps:8});await page.mouse.up();
   assert(await fog.evaluate(c=>{const d=Math.min(devicePixelRatio,2);return c.getContext('2d').getImageData(100*d,90*d,1,1).data[3]<240;}));assert(await fog.isVisible(),'upload must not automatically reveal the scene');
   if(width===1440)await page.locator('.scratch-stage').screenshot({path:'.preview/fog-upload-'+(locale?'th':'en')+'.png'});
   await page.locator('#scratch-reveal-button').click();assert(await fog.isHidden());
   await page.locator('#reveal-upload').setInputFiles({...file,name:'second.png'});await page.waitForFunction(previous=>document.querySelector('#reveal-background-image').getAttribute('src')!==previous,photoURL);assert(await fog.isVisible());
   await page.locator('#reveal-remove-upload').click();assert(await page.locator('#reveal-background-image').isHidden());assert(await page.locator('.reveal-brand-message').isVisible());assert.equal(await page.locator('#reveal-upload').inputValue(),'');
   await page.locator('#reveal-upload').setInputFiles(file);await page.waitForFunction(()=>!document.querySelector('#reveal-background-image').hidden);await page.locator('#reveal-reset-settings').click();assert(await page.locator('#reveal-background-image').isHidden());assert(await fog.isVisible());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));console.log('PASS: '+(locale||'en/')+width+'px — local image preview/play, auto apply, round locks, corrupt/oversized rejection, remove and preset fallback');
  }
  assert.deepEqual(errors,[]);assert.deepEqual(sent,[],'uploads must not send network requests');await page.close();
 }
}finally{await browser.close();}
