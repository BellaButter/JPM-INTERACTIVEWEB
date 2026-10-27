import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
try{
 for(const locale of ['', 'th/']){
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/'+locale+'playground.html',{waitUntil:'networkidle'});
   await page.locator('#tap-customization > summary').click();
   const brand=page.locator('#builder-brand'),preview=page.locator('.builder-preview');
   assert.equal(await brand.inputValue(),'');assert.equal(await brand.getAttribute('placeholder'),locale?'ชื่อแบรนด์ของคุณ':'Your brand name');
   await brand.fill('<img src=x>');assert.equal(await page.locator('#builder-preview-brand img').count(),0);assert.equal(await page.locator('#builder-preview-brand').textContent(),'<img src=x>');
   await brand.fill('JPM DEMO');await page.locator('#builder-item').selectOption('heart');await page.locator('#builder-color').selectOption('mint');await page.locator('#builder-goal').selectOption('5');
   assert.equal(await preview.getAttribute('data-color'),'mint');assert.match(await page.locator('#builder-instruction').textContent(),/♥ 5/);
   await page.locator('#builder-activate').click();assert.equal(await preview.getAttribute('data-state'),'playing');assert(await brand.isDisabled());
   await page.locator('.custom-game-item.is-up:not([data-item=heart])').first().click();assert.equal(await page.locator('#builder-count').textContent(),'0');
   await page.locator('.custom-game-item[data-item=heart]').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#builder-count').textContent(),'1');
   await page.locator('#builder-pause').click();const time=await page.locator('#builder-time').textContent();await page.clock.fastForward(4000);assert.equal(await page.locator('#builder-time').textContent(),time);assert.equal(await preview.getAttribute('data-state'),'paused');
   await page.locator('#builder-activate').click();for(let i=0;i<4;i++)await page.locator('.custom-game-item[data-item=heart]').first().click();
   assert.equal(await preview.getAttribute('data-state'),'won');assert.equal(await page.locator('#builder-count').textContent(),'5');assert(await brand.isEnabled());assert.equal(await page.locator('#builder-progress').getAttribute('value'),'5');
   if(width===1440)await page.locator('.custom-game-demo').screenshot({path:'.preview/custom-game-'+(locale?'th':'en')+'.png'});
   await page.locator('#builder-activate').click();assert.equal(await page.locator('#builder-count').textContent(),'0');await page.clock.fastForward(16000);assert.equal(await preview.getAttribute('data-state'),'timeup');assert.equal(await page.locator('#builder-time').textContent(),'0');
   await page.locator('#builder-item').selectOption('gem');await page.locator('#builder-activate').click();assert.equal(await preview.getAttribute('data-state'),'playing');await page.locator('#builder-stop').click();assert.equal(await preview.getAttribute('data-state'),'ready');
   await page.locator('#builder-reset').click();assert.equal(await brand.inputValue(),'');assert.equal(await page.locator('#builder-preview-brand').textContent(),locale?'แบรนด์ของคุณ':'Your brand');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));console.log('PASS: '+(locale||'en/')+width+'px — placeholder, configured game, correct/wrong items, keyboard, pause, win, timeout, replay and reset');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 const timing=await browser.newPage({viewport:{width:1100,height:1000}});await timing.clock.install();await timing.goto(base+'/th/playground.html');await timing.clock.pauseAt(new Date());
 await timing.locator('#tap-customization > summary').click();await timing.locator('#builder-activate').click();
 assert.equal(await timing.locator('.custom-game-item.is-up').count(),2);
 await timing.locator('.pop-character').evaluateAll(nodes=>nodes.forEach(node=>node.dataset.probe='initial'));
 await timing.clock.runFor(900);assert.equal(await timing.locator('[data-probe=initial]').count(),0);assert.equal(await timing.locator('#builder-count').textContent(),'0');
 const target=timing.locator('.custom-game-item[data-item=spark]').first();await target.click();assert.equal(await timing.locator('#builder-count').textContent(),'1');
 await timing.locator('.custom-game-item[data-item=empty]').first().evaluate(node=>node.click());assert.equal(await timing.locator('#builder-count').textContent(),'1');
 await timing.clock.runFor(600);const key=await timing.locator('.custom-game-item[data-item=spark]').first().evaluate(node=>String([...node.parentNode.querySelectorAll('button')].indexOf(node)+1));await timing.locator('.custom-game-board').focus();await timing.keyboard.press(key);assert.equal(await timing.locator('#builder-count').textContent(),'2');
 await timing.locator('#builder-stop').click();await timing.locator('#builder-speed').selectOption('fast');await timing.locator('#builder-activate').click();await timing.locator('.pop-character').evaluateAll(nodes=>nodes.forEach(node=>node.dataset.probe='fast'));await timing.clock.runFor(600);assert.equal(await timing.locator('[data-probe=fast]').count(),0);
 await timing.locator('.builder-preview').screenshot({path:'.preview/pop-up-th.png'});await timing.close();console.log('PASS: timed pop-up expiry, empty holes, number keys and fast speed');
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await mobile.newPage();await page.goto(base+'/th/playground.html');
 await page.locator('#tap-customization > summary').click();await page.locator('#builder-brand').fill('แบรนด์ทดลอง');await page.locator('#builder-item').selectOption('gem');await page.locator('#builder-activate').tap();await page.locator('.custom-game-item[data-item=gem]').first().tap();assert.equal(await page.locator('#builder-count').textContent(),'1');await mobile.close();console.log('PASS: actual touch play');
}finally{await browser.close();}
