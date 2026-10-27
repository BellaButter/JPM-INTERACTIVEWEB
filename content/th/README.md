# Thai website copy

Thai pages are generated under /th/ from the same templates, project IDs, asset references, prices, and employer credits as English. Edit Thai editorial copy in content/th/site.mjs; do not edit generated th/*.html directly.

The dictionary covers company text, services, packages, workflow, case-study narratives, both articles, navigation, forms, accessibility labels and dynamic Playground states. Brand names, project names, demo names and the JPM tagline remain in English where intentional. When adding or changing English copy, add the corresponding Thai mapping and check the rendered page.

The build localizes text and accessibility/form labels without modifying route slugs, filter IDs, field names or SVG markup. site-i18n.js is generated for runtime status messages. Shared CSS/media/scripts resolve outside /th/; language links always point to the matching page. Query parameters and section anchors are retained with JavaScript; native links work without it.

Noto Sans Thai is used on Thai pages, with Thai line-height and mobile type adjustments. English keeps Manrope. Preview pages in both languages remain noindex until deployment is explicitly approved. SITE_ORIGIN enables self-referencing canonicals and reciprocal en/th/x-default alternates.

Run npm run build, npm test, and npm run test:localization (with Playwright configured) after changes.
