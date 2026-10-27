// Release build: canonical URLs, hreflang, index/follow, sitemap.xml, robots.txt and llms.txt.
// Usage: npm run build:release  (override with SITE_ORIGIN=https://example.com)
process.env.SITE_ORIGIN ||= 'https://www.jpmmediaspace.com';
await import('./build-site.mjs');
