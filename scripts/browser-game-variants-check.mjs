import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
try{
 for(const locale of ['', 'th/']){
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/'+locale+'playground.html',{waitUntil:'networkidle'});
   assert.equal(await page.locator('.library-card').count(),8);await page.locator('[data-library-filter=games]').click();assert.equal(await page.locator('.library-card:visible').count(),3);
   await page.locator('#catch-customization > summary').click();assert.equal(await page.locator('#catch-brand').inputValue(),'');
   await page.locator('#catch-brand').fill('JPM CATCH');await page.locator('#catch-item').selectOption('♥');await page.locator('#catch-color').selectOption('#579AC4');await page.locator('#catch-duration').selectOption('15');await page.locator('#catch-hazards').selectOption('0');await page.locator('#catch-difficulty').selectOption('easy');
   assert.equal(await page.locator('#game-brand').textContent(),'JPM CATCH');assert.equal(await page.locator('#game-time').textContent(),'15');assert(await page.locator('.legend-hazard').isHidden());
   await page.locator('#game-start').click();assert(await page.locator('#catch-brand').isDisabled());
   await page.waitForFunction(()=>document.querySelector('.falling-object'));assert.equal(await page.locator('.falling-object').first().textContent(),'♥');
   await page.locator('#catch-edit').click();assert(await page.locator('#catch-brand').isEnabled());assert.equal(await page.locator('#game-score').textContent(),'0');await page.locator('#catch-reset-settings').click();assert.equal(await page.locator('#game-brand').textContent(),'JPM MEDIA SPACE');assert.equal(await page.locator('#game-time').textContent(),'30');
   await page.locator('#reveal-customization > summary').click();await page.locator('#reveal-brand').fill('JPM REVEAL');await page.locator('#reveal-message').fill('<img src=x> Hello brand');await page.locator('#reveal-color').selectOption('mint');await page.locator('#reveal-brush').fill('60');await page.locator('#scratch-reveal-button').click();
   assert.equal(await page.locator('.reveal-brand-message').textContent(),'<img src=x> Hello brand');assert.equal(await page.locator('.reveal-brand-message img').count(),0);assert.equal(await page.locator('#reveal-brand-preview').textContent(),'JPM REVEAL');assert.equal(await page.locator('.scratch-stage').getAttribute('data-color'),'mint');
   await page.locator('#reveal-reset-settings').click();assert(await page.locator('#reveal-brand-preview').isHidden());assert.equal(await page.locator('#reveal-brand').inputValue(),'');assert.equal(await page.locator('#reveal-brush').inputValue(),'80');assert(await page.locator('#scratch-canvas').isVisible());
   await page.locator('#match-customization > summary').click();await page.locator('#match-brand').fill('JPM MATCH');await page.locator('#match-theme').selectOption('fruit');await page.locator('#match-color').selectOption('blue');await page.locator('#match-pairs').selectOption('3');
   const preview=page.locator('.matching-preview');assert.equal(await preview.getAttribute('data-color'),'blue');assert.equal(await page.locator('.match-card').count(),6);
   await page.locator('#match-start').click();const values=await page.locator('.match-card').evaluateAll(cards=>cards.map(card=>card.dataset.symbol));const a=0,b=values.findIndex(symbol=>symbol!==values[a]);await page.locator('.match-card').nth(a).click();await page.locator('.match-card').nth(b).click();assert.equal(await page.locator('.match-card.is-open').count(),2);await page.clock.fastForward(900);assert.equal(await page.locator('.match-card.is-open').count(),0);
   for(const symbol of new Set(values)){const indices=values.map((value,i)=>value===symbol?i:-1).filter(i=>i>=0);await page.locator('.match-card').nth(indices[0]).focus();await page.keyboard.press('Enter');await page.locator('.match-card').nth(indices[1]).click();}
   assert.equal(await preview.getAttribute('data-state'),'won');assert.equal(await page.locator('#match-count').textContent(),'3');assert.equal(await page.locator('#match-attempts').textContent(),'4');assert.equal(await page.locator('.match-card.is-matched').count(),6);
   if(width===1440)await page.locator('#matching-game').screenshot({path:'.preview/matching-'+(locale?'th':'en')+'.png'});
   await page.locator('#match-start').click();await page.locator('#match-pause').click();const time=await page.locator('#match-time').textContent();await page.clock.fastForward(4000);assert.equal(await page.locator('#match-time').textContent(),time);await page.locator('#match-start').click();await page.clock.fastForward(31000);assert.equal(await preview.getAttribute('data-state'),'timeup');await page.locator('#match-reset-settings').click();assert.equal(await page.locator('#match-brand').inputValue(),'');assert.equal(await page.locator('.match-card').count(),8);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));console.log('PASS: '+(locale||'en/')+width+'px — independent games, catch settings, reveal branding, matching/mismatch, keyboard, pause, victory, timeout and reset');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await mobile.newPage();await page.goto(base+'/th/playground.html');await page.locator('#match-start').tap();const values=await page.locator('.match-card').evaluateAll(cards=>cards.map(card=>card.dataset.symbol)),second=values.indexOf(values[0],1);await page.locator('.match-card').nth(0).tap();await page.locator('.match-card').nth(second).tap();assert.equal(await page.locator('#match-count').textContent(),'1');await mobile.close();console.log('PASS: actual touch matching');
}finally{await browser.close();}
