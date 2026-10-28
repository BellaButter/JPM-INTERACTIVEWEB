import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { layout } from './components.mjs';
import { localizeThai } from './localize-site.mjs';

const source = readFileSync(new URL('../analytics.js', import.meta.url), 'utf8');
for (const hostname of ['www.jpmmediaspace.com', 'jpmmediaspace.com', 'localhost', '127.0.0.1', 'jpm-preview.vercel.app', 'www.jpmmediaspace.com.example.org']) {
  test(`analytics host boundary: ${hostname}`, () => {
    const loaded = [];
    const window = { location: { hostname } };
    const document = { createElement: () => ({}), head: { appendChild: tag => loaded.push(tag) } };
    runInNewContext(source, { window, document });
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
        assert(en.includes('src="../analytics.js" defer'));
        assert(th.includes('src="../../analytics.js" defer'));
      }
    }
  } finally {
    if (previous === undefined) delete process.env.SITE_ORIGIN;
    else process.env.SITE_ORIGIN = previous;
  }
});
