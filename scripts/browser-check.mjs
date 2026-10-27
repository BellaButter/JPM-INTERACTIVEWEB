import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL}:{})});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4173';
const errors=[];
async function scrollPage(page) {
  await page.evaluate(async()=> { for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo({top:y,behavior:'instant'});await new Promise(resolve=>setTimeout(resolve,60));}window.scrollTo({top:0,behavior:'instant'}); });
  await page.waitForTimeout(750);
}
try {
  const page=await browser.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=> {if(response.url().startsWith(base)&&response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  const routes=['index.html','about.html','services.html','industries.html','packages.html','case-studies.html','playground.html','insights.html','partner-with-us.html','contact.html','case-studies/punthai-coffee.html','insights/designing-for-participation.html'];
  await mkdir('.preview',{recursive:true});
  for(const width of (process.env.SKIP_LAYOUT_CHECKS ? [] : process.env.BROWSER_WIDTHS ? process.env.BROWSER_WIDTHS.split(',').map(Number) : [1440,768,390,320])) {
    await page.setViewportSize({width,height:900});
    for(const route of routes) {
      await page.goto(`${base}/${route}`,{waitUntil:'networkidle'});
      assert.equal(await page.locator('h1').count(),1,route);
      await scrollPage(page);
      const overflow=await page.evaluate(()=>[...document.querySelectorAll('main,header,footer')].some(element=>element.getBoundingClientRect().right>innerWidth+1)||document.documentElement.scrollWidth>innerWidth);
      assert(!overflow,`Overflow: ${route} at ${width}px`);
      // Upload preview <img> elements have no src until a visitor picks a file; only check real images.
      await page.waitForFunction(()=>[...document.images].filter(image=>image.getAttribute('src')).every(image=>image.complete&&image.naturalWidth>0));
      if(route==='index.html'&&[1440,390].includes(width)) {
        await page.screenshot({path:`.preview/homepage-${width}.png`,fullPage:true});
        await page.screenshot({path:`.preview/homepage-top-${width}.png`});
        await page.locator('.bento-grid').screenshot({path:`.preview/bento-${width}.png`,style:'.site-header,.skip-link{visibility:hidden}'});
      }
      if(route==='playground.html'&&[1440,390].includes(width)) { await page.screenshot({path:`.preview/playground-${width}.png`,fullPage:true}); await page.screenshot({path:`.preview/playground-top-${width}.png`}); }
    }
    console.log(`PASS: ${routes.length} pages at ${width}px — headings, images, no overflow`);
  }
  await page.setViewportSize({width:390,height:844});await page.goto(base);
  await page.getByRole('button',{name:'Technology',exact:true}).click();
  assert.equal(await page.locator('.bento-card:visible').count(),2);
  await page.getByRole('button',{name:'All services',exact:true}).click();
  assert.equal(await page.locator('.bento-card:visible').count(),6);
  await page.getByRole('button',{name:'Menu',exact:false}).click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  await page.getByRole('button',{name:'Menu',exact:false}).click();await page.locator('.nav-dropdown summary').click();
  await page.locator('#navigation').getByRole('link',{name:'Services',exact:true}).click();await page.waitForURL('**/services.html');
  await page.goto(`${base}/case-studies.html`);await page.getByRole('button',{name:'Touchscreen',exact:true}).click();
  assert.equal(await page.locator('.work-gallery .project-card:visible').count(),await page.locator('.work-gallery .project-card[data-category="Touchscreen"]').count());
  await page.goto(`${base}/insights.html`);await page.getByRole('button',{name:'Practical Guides',exact:true}).click();
  assert.equal(await page.locator('.article-card:visible').count(),1);
  await page.goto(`${base}/contact.html?service=Interactive%20Games`);
  assert.equal(await page.locator('input[name="service"]').inputValue(),'Interactive Games');
  await page.getByLabel('Your name').fill('Preview Test');await page.getByLabel('Email',{exact:true}).fill('preview@example.invalid');
  await page.getByLabel('Tell us about your project').fill('Local verification of the draft enquiry.');
  let enquiryPayload = '';
  await page.route('https://formsubmit.co/**', async route => {
    enquiryPayload = route.request().postData();
    await route.fulfill({status:303,headers:{location:base+'/thank-you.html'},body:''});
  });
  await page.getByRole('button',{name:'Send enquiry',exact:true}).click();
  await page.waitForURL('**/thank-you.html');
  assert(new URLSearchParams(enquiryPayload).get('message').includes('Local verification'));
  await page.unroute('https://formsubmit.co/**');
  console.log('PASS: mobile menu, dropdown, Escape, project/article filters, quote prefilling and intercepted FormSubmit POST (nothing sent)');

  // Short deterministic fixture exercises the full game lifecycle without a 30-second wait.
  await page.route('**/game-config.json',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({durationSeconds:4,spawnIntervalMs:100,fallSpeed:2,brandName:'Test brand'})}));
  await page.addInitScript(()=> {Math.random=()=>.5;});
  await page.goto(`${base}/playground.html`);
  await page.getByRole('button',{name:'Games',exact:true}).click();assert.equal(await page.locator('.library-card:visible').count(),3);
  await page.getByRole('button',{name:'Interactive',exact:true}).click();assert.equal(await page.locator('.library-card:visible').count(),2);
  await page.getByRole('button',{name:'All demos',exact:true}).click();assert.equal(await page.locator('.library-card:visible').count(),8);
  await page.getByRole('link',{name:'Try demo: Catch Game',exact:true}).click();
  assert.equal(new URL(page.url()).hash,'#catch-game');
  await page.getByRole('button',{name:'Start game'}).click();
  await page.waitForFunction(()=>Number(document.querySelector('#game-score').textContent)>0);
  await page.locator('#game-view').focus();const before=await page.locator('#game-basket').evaluate(element=>parseFloat(element.style.left));
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(150);await page.keyboard.up('ArrowRight');
  assert(await page.locator('#game-basket').evaluate(element=>parseFloat(element.style.left))>before);
  const rect=await page.locator('#game-view').boundingBox();await page.mouse.move(rect.x+rect.width*.25,rect.y+rect.height*.5);
  assert(Math.abs(await page.locator('#game-basket').evaluate(element=>parseFloat(element.style.left))-25)<2);
  await page.getByRole('button',{name:'Pause',exact:true}).click();const pausedTime=await page.locator('#game-time').textContent();
  await page.waitForTimeout(300);assert.equal(await page.locator('#game-time').textContent(),pausedTime);
  await page.getByRole('button',{name:'Resume game'}).click();
  await page.waitForFunction(()=>document.querySelector('#game-overlay-title').textContent==='That’s a wrap.',{timeout:10000});
  assert.equal(await page.locator('#game-time').textContent(),'0');
  await page.getByRole('button',{name:'Play again'}).click();assert.equal(await page.locator('#game-score').textContent(),'0');
  assert.equal(await page.locator('#game-objects').locator('.falling-object').count(),0);
  await page.getByRole('button',{name:'Pause',exact:true}).click();
  await page.locator('#scratch-canvas').scrollIntoViewIfNeeded();const scratch=await page.locator('#scratch-canvas').boundingBox();
  await page.mouse.move(scratch.x+40,scratch.y+60);await page.mouse.down();await page.mouse.move(scratch.x+170,scratch.y+130,{steps:8});await page.mouse.up();
  assert(await page.locator('#scratch-canvas').evaluate(canvas=>canvas.getContext('2d').getImageData(60*devicePixelRatio,70*devicePixelRatio,1,1).data[3]<255));
  await page.getByRole('button',{name:'Reveal scene'}).focus();await page.keyboard.press('Enter');assert(await page.locator('#scratch-canvas').isHidden());
  await page.getByRole('button',{name:'Reset',exact:true}).click();assert(await page.locator('#scratch-canvas').isVisible());
  await page.getByRole('button',{name:'Highlights',exact:true}).click();assert.equal(await page.locator('#explorer-title').textContent(),'Coast · Highlights');
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
  assert.equal(await page.locator('html').evaluate(element=>getComputedStyle(element).scrollBehavior),'auto');
  assert.equal(await page.locator('.hero-art').count(),0);
  assert.equal(await page.locator('.motion-enabled').count(),0);
  console.log('PASS: score/collision, countdown, game over, restart, pause/resume, mouse/keyboard movement, scratch, keyboard reveal/reset, product layers, reduced motion');
  const touchContext=await browser.newContext({hasTouch:true,viewport:{width:390,height:844}});
  const touch=await touchContext.newPage();await touch.goto(`${base}/playground.html`);await touch.getByRole('button',{name:'Start game'}).click();
  const touchRect=await touch.locator('#game-view').boundingBox();await touch.touchscreen.tap(touchRect.x+touchRect.width*.7,touchRect.y+touchRect.height*.5);
  assert(Math.abs(await touch.locator('#game-basket').evaluate(element=>parseFloat(element.style.left))-70)<3);
  const right=touch.getByRole('button',{name:'Move catcher right'});await right.dispatchEvent('click',{detail:0});
  assert(await touch.locator('#game-basket').evaluate(element=>parseFloat(element.style.left))>70);
  await touchContext.close();
  const plainContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const plain=await plainContext.newPage();await plain.goto(base);assert(await plain.locator('h1').isVisible());
  await plain.locator('.nav-dropdown summary').click();assert(await plain.locator('#navigation').getByRole('link',{name:'Services',exact:true}).isVisible());
  await plainContext.close();assert.deepEqual(errors,[]);
  console.log('PASS: touch movement, on-screen control, no-JavaScript content/navigation, no local resource or JavaScript errors');
}finally {await browser.close();}
