import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
try {
 for(const locale of ['', 'th/']) {
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{Math.random=()=>.5;});
  await page.route('**/game-config.json',route=>route.fulfill({json:{durationSeconds:10,spawnIntervalMs:300,fallSpeed:1.5,hazardChance:.75,hazardPenalty:10}}));
  for(const width of [1440,390,320]) {
   await page.setViewportSize({width,height:1000});await page.goto(base+'/'+locale+'playground.html',{waitUntil:'networkidle'});
   await page.locator('#game-start').click();
   await page.waitForFunction(()=>document.querySelector('.falling-hazard'));
   assert.equal(await page.locator('.falling-hazard').first().textContent(),'×');
   await page.waitForFunction(()=>document.querySelector('#game-feedback').textContent.includes('−10'));
   assert.equal(await page.locator('#game-score').textContent(),'0');
   assert.match(await page.locator('#game-status').textContent(),locale?/หลบไอเทมสีแดง/:/Avoid the red objects/);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('#game-pause').click();
   await page.locator('#game-restart').click();assert.equal(await page.locator('#game-score').textContent(),'0');
   console.log('PASS: '+(locale||'en/')+width+'px — rendered hazards, collision feedback at zero score, restart and layout');
  }
  assert.deepEqual(errors,[]);await page.close();
 }
} finally {await browser.close();}
