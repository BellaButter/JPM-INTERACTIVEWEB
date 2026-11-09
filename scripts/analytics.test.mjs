import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { layout } from './components.mjs';
import { localizeThai } from './localize-site.mjs';

const source = readFileSync(new URL('../analytics.js', import.meta.url), 'utf8');
function harness(hostname = 'www.jpmmediaspace.com', options = {}) {
  const listeners = new Map(), loaded = [], timers = [], followed = [], storage = options.storage || new Map();
  const window = {
    location: new URL(`https://${hostname}${options.path || '/th/index.html'}`),
    sessionStorage: {
      setItem: (key, value) => storage.set(key, value),
      getItem: key => storage.get(key) ?? null,
      removeItem: key => storage.delete(key)
    },
    addEventListener: (name, callback) => listeners.set('window:' + name, callback)
  };
  window.location.assign = url => followed.push(url);
  const document = {
    documentElement: { lang: 'th' },
    createElement: () => ({}), head: { appendChild: tag => loaded.push(tag) },
    addEventListener: (name, callback) => listeners.set(name, callback),
    querySelector: () => options.form ? {} : null
  };
  runInNewContext(source, { window, document, URL, setTimeout: callback => timers.push(callback) });
  return { window, loaded, storage, timers, followed,
    fire: (name, event = {}) => listeners.get(name)?.(event),
    events: () => Array.from(window.dataLayer || [], args => Array.from(args)).filter(args => args[0] === 'event')
  };
}
for (const hostname of ['www.jpmmediaspace.com', 'jpmmediaspace.com', 'localhost', '127.0.0.1', 'jpm-preview.vercel.app', 'www.jpmmediaspace.com.example.org']) {
  test(`analytics host boundary: ${hostname}`, () => {
    const { loaded, window } = harness(hostname);
    if (['www.jpmmediaspace.com', 'jpmmediaspace.com'].includes(hostname)) {
      assert.equal(loaded.length, 1);
      assert.equal(loaded[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-YFTRX8QT22');
      assert.equal(loaded[0].async, true);
      assert.equal(window.dataLayer.length, 2);
      assert.deepEqual(Array.from(window.dataLayer[1]), ['config', 'G-YFTRX8QT22']);
    } else {
      assert.equal(loaded.length, 0);
      assert.equal(window.dataLayer, undefined);
    }
  });
}

test('shared shell includes analytics once on release EN/TH pages, absent on preview builds', () => {
  const previous = process.env.SITE_ORIGIN;
  try {
    for (const origin of ['', 'https://preview.example.org', 'https://www.jpmmediaspace.com']) {
      process.env.SITE_ORIGIN = origin;
      const en = layout({ title: 'Test', description: 'Test', body: '', path: 'insights/test.html', prefix: '../' });
      const th = localizeThai(en, 'insights/test.html');
      const expected = origin === 'https://www.jpmmediaspace.com' ? 1 : 0;
      for (const html of [en, th]) assert.equal((html.match(/analytics\.js/g) || []).length, expected);
      if (expected) {
        assert(en.includes('src="../analytics.js?v=4" defer'));
        assert(th.includes('src="../../analytics.js?v=4" defer'));
      }
    }
  } finally {
    if (previous === undefined) delete process.env.SITE_ORIGIN;
    else process.env.SITE_ORIGIN = previous;
  }
});

const testLink = (h, href, quote = null) => ({ href: new URL(href, h.window.location.href).href, closest: selector => selector === 'footer',
  hasAttribute: name => name === 'data-quote-cta' && quote !== null, getAttribute: name => name === 'data-quote-cta' ? quote : null });

test('contact clicks use fixed labels without transmitting URL or entered text', () => {
  const h = harness();
  for (const href of ['https://line.me/R/ti/p/@jpm', 'tel:+66123456789', 'mailto:private@example.org']) {
    const link = testLink(h, href);
    h.fire('click', { target: { closest: () => link } });
  }
  assert.deepEqual(h.events().map(e => e[1]), ['contact_click','contact_click','contact_click']);
  assert.deepEqual(h.events().map(e => e[2].contact_method), ['line','phone','email']);
  assert(!JSON.stringify(h.events()).includes('private'));
  assert(!JSON.stringify(h.events()).includes('123456789'));
});

test('quote_cta_click fires once only for marked brief/quote buttons, with their own location', () => {
  const h = harness();
  // General contact links: the "Contact" menu, "Let's talk", "Start a conversation", #contact without a marker.
  for (const href of ['/th/contact.html', '/th/contact.html?service=private', '#contact', '/th/services.html']) {
    const link = testLink(h, href);
    h.fire('click', { target: { closest: () => link } });
  }
  assert.equal(h.events().length, 0);
  for (const [href, quote] of [['/th/contact.html?service=Interactive%20Games', 'service_hero'], ['/th/contact.html?service=Interactive%20Games', 'service_brief'], ['/th/contact.html', 'made up <b>label</b>']]) {
    const link = testLink(h, href, quote);
    h.fire('click', { target: { closest: () => link } });
  }
  assert.deepEqual(h.events().map(e => [e[1], e[2].cta_location]), [['quote_cta_click','service_hero'], ['quote_cta_click','service_brief'], ['quote_cta_click','other']]);
  assert(!JSON.stringify(h.events()).includes('Interactive'));
});

test('built pages mark every brief/quote button and leave general contact links unmarked', () => {
  const page = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
  const marks = html => [...html.matchAll(/data-quote-cta="([a-z_]+)"/g)].map(m => m[1]);
  for (const [path, expected] of [['interactive-event-games.html', ['service_hero', 'service_brief', 'footer']], ['th/interactive-event-games.html', ['service_hero', 'service_brief', 'footer']],
    ['index.html', ['home_hero', 'footer']], ['packages.html', ['packages', 'packages', 'footer']], ['playground.html', ['playground', 'footer']], ['insights/event-game-budget.html', ['article_end', 'footer']]]) {
    assert.deepEqual(marks(page(path)), expected, path);
  }
  const html = page('th/interactive-event-games.html');
  assert(html.includes('href="contact.html?service=Interactive%20Games" data-quote-cta="service_hero"'));
  assert(html.includes('href="playground.html"'));
  // The header "Let's talk" pill and the shared "Start a conversation" section stay general contact links.
  assert(!/<a [^>]*data-quote-cta[^>]*><span>/.test(html));
  assert(!/data-quote-cta="[a-z_]+">เริ่มคุยกับเรา|data-quote-cta="[a-z_]+">Start a conversation/.test(html + page('about.html')));
});

test('invalid, cancelled and demo forms cannot generate a quote submission', () => {
  const h = harness();
  for (const [id, valid, cancelled] of [['quote-form',false,false],['quote-form',true,true],['wheel-form',true,false],['quiz-save',true,false]]) {
    h.fire('submit', { defaultPrevented: cancelled, target: { id, checkValidity: () => valid } });
  }
  assert.equal(h.events().length,0);
  assert.equal(h.storage.size,0);
});

test('LINE waits for measurement then navigates once, including a blocked-tag fallback', () => {
  const h = harness();
  const link = {href:'https://line.me/R/ti/p/@jpm',closest:()=>null};
  let prevented = false;
  h.fire('click', {button:0,target:{closest:()=>link},preventDefault:()=>{prevented=true;}});
  assert(prevented);
  assert.equal(h.followed.length,0);
  h.events()[0][2].event_callback();
  h.timers[0]();
  assert.equal(h.followed.length,1);
  const blocked = harness();
  blocked.fire('click', {button:0,target:{closest:()=>link},preventDefault:()=>{}});
  blocked.timers[0]();
  assert.equal(blocked.followed.length,1);
  const modified = harness();
  modified.fire('click', {button:0,ctrlKey:true,target:{closest:()=>link},preventDefault:()=>{throw Error('Must preserve new-tab click');}});
  assert.equal(modified.timers.length,0);
});

test('lead requires a fresh valid submission followed by Thank You, and is consumed once', () => {
  const h = harness();
  h.fire('submit', { target: { id:'quote-form', checkValidity: () => true, value:'PRIVATE FORM VALUES' } });
  assert.deepEqual(h.events().map(e => e[1]), ['quote_form_submit']);
  const success = harness(undefined, { path:'/th/thank-you.html', storage:h.storage });
  assert.deepEqual(success.events().map(e => e[1]), ['generate_lead']);
  assert.equal(harness(undefined, { path:'/th/thank-you.html',storage:h.storage }).events().length,0);
  assert.equal(harness(undefined, { path:'/thank-you.html' }).events().length,0);
  assert(!JSON.stringify(success.events()).includes('PRIVATE'));
});

test('expired pending lead and a return to the form do not count as successful enquiries', () => {
  const storage = new Map([['jpm_quote_pending_v1', String(Date.now()-31*60*1000)]]);
  assert.equal(harness(undefined, {path:'/thank-you.html',storage}).events().length,0);
  const h = harness(undefined, { form:true });
  h.fire('submit', {target:{id:'quote-form',checkValidity:()=>true}});
  h.fire('window:pageshow');
  assert.equal(h.storage.size,0);
});

test('demo IDs are allowlisted and player details are never forwarded', () => {
  const h = harness();
  h.fire('jpm:demo-start', {detail:{demo_id:'lucky-wheel', name:'PRIVATE',email:'secret@example.org'}});
  h.fire('jpm:demo-start', {detail:{demo_id:'arbitrary user supplied text'}});
  assert.equal(h.events().length,1);
  assert.equal(h.events()[0][2].demo_id,'lucky-wheel');
  assert(!JSON.stringify(h.events()).includes('PRIVATE'));
  assert(!JSON.stringify(h.events()).includes('secret'));
});

test('demo first use is counted once per page, not again on replay or resume', async () => {
  const calls = [];
  const helper = readFileSync(new URL('../demo-measurement.js',import.meta.url),'utf8').replace('export function','function');
  class CustomEvent { constructor(type, options) { this.type=type;this.detail=options.detail; } }
  runInNewContext(helper + "\ndemoStarted('catch-game');demoStarted('catch-game');demoStarted('memory-match');", {
    document:{dispatchEvent:event=>calls.push(event)}, CustomEvent
  });
  assert.deepEqual(calls.map(event=>event.detail.demo_id),['catch-game','memory-match']);
});
