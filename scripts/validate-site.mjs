import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles, packages, projects } from '../content/en/site.mjs';
const root = fileURLToPath(new URL('../',import.meta.url));
const plan = JSON.parse(await readFile(path.join(root,'sitemap-plan.json'),'utf8'));
const routes = [...plan.englishRoutes,...plan.thaiRoutes,...(plan.noindexRoutes||[]),...articles.filter(article=>article.status!=='published').map(article=>`insights/${article.slug}.html`)];
const titles = new Set();
let localReferences = 0;
for (const route of routes) {
  const html = await readFile(path.join(root,route),'utf8');
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`One h1: ${route}`);
  const title = html.match(/<title>(.*?)<\/title>/)[1]; assert(!titles.has(title),`Unique title: ${route}`);titles.add(title);
  assert(/<meta name="description" content="[^"]+">/.test(html),`Description: ${route}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]); assert.equal(new Set(ids).size,ids.length,`Unique IDs: ${route}`);
  for (const [,attribute,raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(raw)) continue;
    const [file,anchor] = raw.replaceAll('&amp;','&').split('#');
    const target = path.resolve(root,path.dirname(route),decodeURIComponent(file.split('?')[0]||path.basename(route)));
    if (!file) {
      if (anchor) assert(ids.includes(anchor),`Anchor ${raw} in ${route}`);
    } else {
      await access(target);localReferences++;
      if(anchor && attribute==='href' && target.endsWith('.html')) {
        const targetHTML=await readFile(target,'utf8');assert(targetHTML.includes(`id="${anchor}"`),`Target anchor ${raw}`);
      }
    }
  }
}
assert.deepEqual(packages.flatMap(pack=>pack.items.map(item=>item.startingPrice)),[30000,56000,39000,160000]);
assert(packages.every(pack=>!pack.reviewRequired));
const homepage = await readFile(path.join(root,'index.html'),'utf8');
for (const anchor of ['about','services-overview','packages','sensors','portfolio','workflow','contact']) assert(homepage.includes(`id="${anchor}"`),`Preserved legacy Homepage anchor: ${anchor}`);
for (const project of projects.filter(project=>project.employer)) {
  const detail = await readFile(path.join(root,`case-studies/${project.slug}.html`),'utf8');
  assert(detail.includes('Portfolio with Employer'),project.slug);
}
for (const article of articles.filter(article=>article.status!=='published')) {
  assert(!plan.englishRoutes.includes(`insights/${article.slug}.html`));
  assert((await readFile(path.join(root,`insights/${article.slug}.html`),'utf8')).includes('noindex, nofollow'));
}
for (const route of plan.noindexRoutes||[]) assert((await readFile(path.join(root,route),'utf8')).includes('noindex, nofollow'),`noindex: ${route}`);
console.log(`PASS: ${routes.length} pages, unique headings/titles/IDs, ${localReferences} local references, package prices, project credits, draft SEO exclusions.`);
