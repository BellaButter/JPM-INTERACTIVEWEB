import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
try {
 for(const locale of ['', 'th/']) {
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});
  for(const width of [1440,390,320]) {
   await page.setViewportSize({width,height:900});await page.goto(base+'/'+locale+'playground.html',{waitUntil:'networkidle'});
   const canvas=page.locator('#scratch-canvas'),stage=page.locator('.scratch-stage');
   await stage.scrollIntoViewIfNeeded();await page.waitForFunction(()=>!document.querySelector('.scratch-stage').classList.contains('motion-stopped'));
   await page.locator('#scratch-motion').click();assert(await stage.evaluate(e=>e.classList.contains('motion-stopped')));
   const box=await canvas.boundingBox();const x=box.width*.28,y=box.height*.35;
   await page.mouse.move(box.x+x,box.y+y);await page.mouse.down();await page.mouse.up();
   const alpha=await canvas.evaluate((c,{x,y})=>{const d=Math.min(devicePixelRatio,2),ctx=c.getContext('2d');return [0,35,70].map(offset=>ctx.getImageData(Math.round((x+offset)*d),Math.round(y*d),1,1).data[3]);},{x,y});
   assert(alpha[0]<alpha[1]&&alpha[1]<alpha[2], 'feathered brush edge '+alpha);
   assert(alpha[0]>0&&alpha[2]<=255);
   const outsideBrush=await canvas.evaluate((c,{x,y,width})=>{
    const d=Math.min(devicePixelRatio,2),oldRadius=Math.min(80,Math.max(48,width*.15));
    return c.getContext('2d').getImageData(Math.round((x+oldRadius*.9)*d),Math.round(y*d),1,1).data[3];
   },{x,y,width:box.width});
   assert.equal(outsideBrush,255,'brush radius is 20% smaller');
   if(width===1440){
    // Reveal most of the surface: it must never finish automatically.
    for(let row=30;row<box.height;row+=35){
     await page.mouse.move(box.x+15,box.y+row);await page.mouse.down();
     await page.mouse.move(box.x+box.width-15,box.y+row,{steps:24});await page.mouse.up();
    }
    assert(await canvas.isVisible(),'large coverage must not trigger an automatic reveal');
    const coverage=await canvas.evaluate(c=>{
     const ctx=c.getContext('2d'),pixels=ctx.getImageData(0,0,c.width,c.height).data;let cleared=0,total=0;
     for(let i=3;i<pixels.length;i+=64){total++;if(pixels[i]<75)cleared++;}return cleared/total;
    });
    assert(coverage>.55,'regression exercises the previous automatic reveal threshold');
   }
   await page.setViewportSize({width:width+4,height:900});await page.waitForTimeout(80);
   const preserved=await canvas.evaluate((c,{x,y})=>{const d=Math.min(devicePixelRatio,2);return c.getContext('2d').getImageData(Math.round(x*d),Math.round(y*d),1,1).data[3];},{x,y});
   assert(preserved<240,'resize should preserve the revealed region');
   await page.locator('#scratch-reset').click();
   assert.equal(await canvas.evaluate(c=>c.getContext('2d').getImageData(20,20,1,1).data[3]),255);
   await page.locator('#scratch-reveal-button').focus();await page.keyboard.press('Enter');assert(await canvas.isHidden());
   await page.locator('#scratch-motion').click();assert.equal(await stage.evaluate(e=>e.classList.contains('motion-stopped')),false);
   if(width===1440)await stage.screenshot({path:'.preview/fog-revealed-'+(locale?'th':'en')+'.png'});
   await page.locator('#scratch-reset').click();
   await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>document.querySelector('#scratch-motion').disabled);
   assert.equal(await page.locator('.reveal-orb').first().evaluate(e=>getComputedStyle(e).animationName),'none');
   await page.emulateMedia({reducedMotion:'no-preference'});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   console.log('PASS: '+(locale||'en/')+width+'px — soft edge, resize, reset, keyboard reveal, motion toggle and reduced motion');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await mobile.newPage();await page.goto(base+'/th/playground.html');await page.locator('.scratch-stage').scrollIntoViewIfNeeded();
 await page.locator('#scratch-motion').tap();
 const c=page.locator('#scratch-canvas'),box=await c.boundingBox();
 const cdp=await mobile.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+70,y:box.y+90}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+170,y:box.y+140}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert(await c.evaluate(c=>{const d=Math.min(devicePixelRatio,2);return c.getContext('2d').getImageData(120*d,115*d,1,1).data[3]<240;}));
 await page.locator('.scratch-stage').screenshot({path:'.preview/fog-touch-mobile.png'});
 await mobile.close();console.log('PASS: actual touch swipe reveals a soft trail');
} finally {await browser.close();}
