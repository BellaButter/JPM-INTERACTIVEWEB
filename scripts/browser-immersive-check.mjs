import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
try{
 for(const locale of ['', 'th/']){
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/'+locale+'playground.html',{waitUntil:'networkidle'});
   const scene=page.locator('.atmosphere-scene'),canvas=page.locator('#immersive-canvas');await scene.scrollIntoViewIfNeeded();
   const snapshot=()=>canvas.evaluate(c=>c.toDataURL());
   const first=await snapshot();await page.waitForTimeout(200);assert.notEqual(await snapshot(),first,'moving imagery');
   assert.equal(await page.locator('#immersive-pause, #immersive-interact').count(),0);await page.emulateMedia({reducedMotion:'reduce'});
   const images=[];
   for(const mode of ['ocean','forest','cosmic']){
    await page.locator('[data-mood-choice='+mode+']').click();assert.equal(await scene.getAttribute('data-mood'),mode);images.push(await snapshot());
    const bounds=await scene.boundingBox();
    for(const position of [{x:bounds.width*.45,y:bounds.height*.35},{x:bounds.width*.72,y:bounds.height*.85}]){
     const before=await snapshot(),count=Number(await scene.getAttribute('data-interactions'));
     await scene.click({position});assert.equal(Number(await scene.getAttribute('data-interactions')),count+1);
     assert.equal(await scene.getAttribute('data-effect'),mode);assert.notEqual(await snapshot(),before,'tap visibly changes the projected wall/floor');
    }
   }
   assert.equal(new Set(images).size,3,'each environment has distinct imagery');
   await page.locator('#immersive-left').click();assert(Number(await scene.getAttribute('data-view'))>0);
   await page.locator('#immersive-center').click();assert.equal(Number(await scene.getAttribute('data-view')),0);
   await scene.focus();await page.keyboard.press('ArrowRight');assert(Number(await scene.getAttribute('data-view'))<0);await page.keyboard.press('Home');
   const countBeforeDrag=Number(await scene.getAttribute('data-interactions'));
   const box=await scene.boundingBox();await page.mouse.move(box.x+box.width*.4,box.y+box.height*.45);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.45,{steps:6});await page.mouse.up();assert(Number(await scene.getAttribute('data-view'))>0);
   assert.equal(Number(await scene.getAttribute('data-interactions')),countBeforeDrag,'dragging does not also activate a tap');
   await scene.focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');await scene.focus();await page.keyboard.press('Enter');
   assert.equal(Number(await scene.getAttribute('data-interactions')),countBeforeDrag+3,'keyboard and explicit control trigger effects');
   await page.locator('#immersive-center').click();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('#immersive-fullscreen').click();
   await page.waitForFunction(()=>document.fullscreenElement===document.querySelector('.immersive-player')||document.querySelector('.immersive-player').classList.contains('is-expanded'));
   assert.equal(await page.locator('#immersive-fullscreen').getAttribute('aria-expanded'),'true');
   if(width===1440){await page.locator('[data-mood-choice=ocean]').click();await scene.focus();await page.keyboard.press('Enter');await page.screenshot({path:'.preview/immersive-fullscreen-'+(locale?'th':'en')+'.png'});}
   await page.locator('#immersive-fullscreen').click();await page.waitForFunction(()=>!document.fullscreenElement&&!document.querySelector('.immersive-player').classList.contains('is-expanded'));
   await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});await scene.scrollIntoViewIfNeeded();
   const still=await snapshot();await page.waitForTimeout(150);assert.equal(await snapshot(),still,'reduced motion stops animation');
   await scene.focus();await page.keyboard.press('Enter');const staticResponse=await snapshot();assert.notEqual(staticResponse,still,'reduced motion keeps a visible static response');await page.waitForTimeout(150);assert.equal(await snapshot(),staticResponse);
   await page.emulateMedia({reducedMotion:'no-preference'});
   console.log('PASS: '+(locale||'en/')+width+'px — themed wall/floor taps, drag separation, keyboard effects, fullscreen and reduced motion');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await mobile.newPage();await page.goto(base+'/th/playground.html');await page.locator('.atmosphere-scene').scrollIntoViewIfNeeded();
 const box=await page.locator('.atmosphere-scene').boundingBox(),cdp=await mobile.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+80,y:box.y+130}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+180,y:box.y+130}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const scene=page.locator('.atmosphere-scene');assert(Number(await scene.getAttribute('data-view'))>0);assert.equal(await scene.getAttribute('data-interactions'),'0');
 await scene.tap({position:{x:160,y:100}});assert.equal(await scene.getAttribute('data-interactions'),'1');assert.equal(await scene.getAttribute('data-effect'),'ocean');await mobile.close();
 console.log('PASS: touch drag changes perspective; touch tap activates the matching visual effect');
}finally{await browser.close();}
