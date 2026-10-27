# JPM Media Space — Redesign v2

Static multi-page creative technology website on `redesign-v2`. No runtime framework or dependency installation is required.

## Local preview

Requires Node.js 18 or later:

```sh
npm start
```

Open http://127.0.0.1:4173 (English) or http://127.0.0.1:4173/th/index.html (Thai). Ctrl+C stops the preview. `npm start` regenerates the HTML from the source components before serving it. After editing content or templates, run `npm run build` and refresh. CSS and browser JavaScript edits need only a refresh.

## Edit the website

- `content/en/site.mjs`: company text, six services, five industries, five workflow steps, original package details/prices, all fifteen project records and their employer credits, and article records.
- `scripts/components.mjs`: shared navigation, footer, page shell, CTA, and code-native SVG illustrations.
- `scripts/build-site.mjs`: page compositions and article/project detail templates.
- `homepage.css`: JPM CI palette from the original `style.css`, typography, framed heroes, thumbnail catalogs, responsive rules, and interaction styles.
- `homepage.js`: navigation, scroll reveals, pointer effects, filters, and FormSubmit enquiry submission.
- `playground.js` and `catch-engine.mjs`: Catch Game, Scratch Reveal, and Product Explorer.
- `game-config.json`: game brand, duration, speed, scoring, color, and optional local object asset.

Generated HTML is checked in for compatibility with the existing static-host setup. Edit the source components/content and rebuild instead of editing generated HTML directly. Original portfolio pages, scripts, styles, and assets remain available; `studio-archive.html` retains the original Homepage.

## Checks

```sh
npm run build
npm run check
npm test
```

Optional browser checks require Playwright and a browser. Set `PLAYWRIGHT_MODULE` to an existing Playwright module entry if it is not installed locally. Set `BROWSER_CHANNEL=chrome` to use installed Chrome. With the preview running:

```sh
npm run test:browser
```

The browser checks save ignored screenshots under `.preview/` and exercise desktop/mobile layouts, navigation, filters, the intercepted quote submission, and the actual demos. Short game settings are intercepted by the test only; the preview retains its 30-second default.

## Publication

Do not deploy without explicit approval. Package pricing is displayed with scope-based quotation terms; the two starter articles are approved for display. Thai pages are available under `/th/` and linked through the EN/TH toggle. Preview pages use `noindex, nofollow`. `SITE_ORIGIN` can enable canonical URLs and sitemap generation after the release URL is approved; it is not set in this preview. See `ARCHITECTURE.md` for details and deployment limitations.

## FormSubmit activation

The owner approved FormSubmit for `jpmmediaspace@gmail.com`. Home and Contact forms POST directly to `https://formsubmit.co/jpmmediaspace@gmail.com`; CAPTCHA stays enabled. The first real submission triggers a verification email to the recipient. Click its activation link before relying on production enquiries. Local browser tests intercept requests and never send email, so live inbox delivery and activation have not been verified. With JavaScript, successful submissions return to `thank-you.html`. Without JavaScript, FormSubmit shows its own confirmation page. The visitor email is supplied as the Reply-To field.

To activate, open the local Request Quote form, send a clearly labeled setup enquiry, and confirm the resulting FormSubmit email (check spam). No production deployment is required for this step. Confirm one real enquiry arrives after activation.

## SEO, social sharing and images (2026-10-16)

- Titles, meta descriptions and H1s carry search terms (interactive, immersive, touchscreen, LED and projection, Thailand). Each page hero's eyebrow/chip sits inside its H1 as `.hero-kicker`, so the keyword line is read with the headline while keeping the original look. About keeps its separate eyebrow because its H1 is already descriptive.
- Every page has `og:site_name`, `og:locale` (en_US / th_TH), Twitter card tags and Organization JSON-LD (email, phone, LINE). With `SITE_ORIGIN` set, the build also emits `og:url`, `og:image` (`assets/web/og-cover.jpg`, 1200×630), canonical, hreflang and `sitemap.xml`. Add a `robots.txt` that points to the sitemap at release.
- `thank-you.html` is `noindex` and excluded from the sitemap (listed as `noindexRoutes` in `sitemap-plan.json`). Thai titles no longer carry the "| ภาษาไทย" suffix.
- Image alt text is descriptive. Project and package alt text lives in `content/en/site.mjs` (`alt`), service-photo alt text in `serviceReferences` in `scripts/build-site.mjs`; Thai alt text is in `content/th/site.mjs`.
- Large photos are served from WebP copies in `assets/web/` (originals stay in `assets/`). `scripts/components.mjs` reads `assets/web/manifest.json`, so `asset()` picks the light file and adds width/height automatically. After adding or replacing a photo, run `python3 scripts/optimize-images.py` (requires Pillow) and rebuild.
- Reading sizes: body text 16px, desktop navigation 14px (13px from 851–1100px), card and demo descriptions 15px, small labels at least 11px. Footer links 14px, footer labels 12px, footer bottom 13px. English and Thai share body, label and footer sizes; Thai headings follow the English heading sizes at about 92%.

## Positioning: one team, end to end

The site states JPM's positioning in both languages: one team handles concept, content, software, installation and after-sales care, so clients do not coordinate separate vendors; JPM works as a thinking business partner; and as a small studio it gives every client full attention. Partner coordination and hardware supply are not advertised. The `whyJpm()` section in `scripts/components.mjs` appears on the Home page (section 03) and the About page. Hero and studio introductions, the services intro, the Better Together banner and the quote form intro follow the same message.

## English and Thai

The build generates 28 English and 28 Thai pages. Thai copy lives in `content/th/site.mjs`; English data remains the shared source for project IDs, prices and media. `scripts/localize-site.mjs` generates paired routes, translated metadata and language links. `site-i18n.js` supplies translated dynamic status messages. Run `npm run test:localization` with the same Playwright environment variables as the browser checks.

## Editable copy handoff

Run `npm run export:content` to generate `deliverables/JPM-Website-Content-Editor.html`. This standalone offline editor includes bilingual copy, original values and source references. Open it in a browser, edit the fields, and use the Save HTML button to download `JPM-Website-Content-Edited.html`. Return the latest downloaded file for review and application to the source; edits do not directly change the website. The embedded `content-data` JSON carries the changes. Treat returned HTML as untrusted data: parse its JSON without executing its scripts, compare original values and paths to the current repository, and apply reviewed text changes. Never regenerate the handoff over a user-edited file.

## Service demos

The Playground has eight playable examples. Three independent games (Catch Game, Tap the Right Item, and Memory Match) each own their customization panel; Scratch Reveal is a customizable creative activity. Product Explorer, Projection Room, RFID Product Display, and Light Canvas cover the other service examples. Custom Interactive Development links to the demo library; customization remains inside each game.

Shared demo composition lives in scripts/demo-components.mjs and service-demos.js, with individual modules for each experience. Thai copy is in content/th/demos.mjs. Hardware interactions are browser simulations; no external reader, sensor, or camera is connected. User-entered names and messages render as text and remain in the browser. Run npm run test:service-demos for both language variants and mobile layouts.

Catch Game also spawns red cross hazards (25% by default). Sparks add 10 points; hazards deduct 10 with a zero floor. The legend and collision feedback explain both object types in English and Thai. `hazardChance` and `hazardPenalty` are editable in `game-config.json`. `npm run test:hazards` exercises rendered hazards, collisions, restart, and responsive layouts in both languages; engine tests cover mixed catches and scoring.

The Scratch Reveal now uses `scratch-reveal.js`: a moving abstract light scene sits beneath a drifting fog canvas. Pointer swipes build a persistent radial mask with feathered edges; the mask survives resizing. Reveal/reset controls support keyboards. Motion can be paused and respects reduced-motion settings; offscreen and hidden-tab effects stop running. The visuals use local CSS/canvas without external media. Run `npm run test:fog` for gradient-edge, resize, reset, keyboard, motion, and real touch-input checks in both languages.

The fog brush radius is reduced by 20%. Swiping only clears the areas the visitor touches, with no coverage threshold or automatic full reveal. The explicit reveal button remains available for keyboard access.

Product Explorer now demonstrates the Touchscreen Applications service as a working product catalog: browse three fictional fragrances in a carousel with the selected card enlarged in the center and neighboring cards visible on either side. Arrows, horizontal swipes, side-card selection, and keyboard arrows change the product and reset the details. Details remain hidden until a topic is chosen, and choosing that topic again collapses it. Carousel and reveal animations respect reduced motion. Product data lives in `content/en/demo-products.mjs`, markup in `scripts/product-demo.mjs`, and interaction in `product-explorer.js`. Bottle illustrations are original local SVGs in `assets/demo-products`; products are explicitly labeled as samples. Run `npm run test:products` to verify all product/panel combinations, keyboard and touchscreen input, and Thai/English layouts.

The Immersive demo is now a panoramic projection-room preview (`immersive-demo.js`, `scripts/immersive-demo.mjs`). Animated underwater, forest, and space scenes span three perspective walls and a floor; a visitor silhouette establishes physical scale. Drag, keyboard arrows, or view buttons change the viewing angle. Fullscreen uses the native API with an accessible expanded-panel fallback. Pause, reduced-motion preferences, offscreen state, and document visibility control animation. It is an illustrated concept, explicitly distinguished from a real installation or VR tour. `npm run test:immersive` covers rendering, animation/pause, scene selection, drag/keyboard views, fullscreen, reduced motion, and actual touchscreen input.

The RFID demo now shows a physical product interaction (`rfid-demo.js`, `scripts/rfid-demo.mjs`): each sample bottle carries a distinct tag ID; dragging it onto a reader (or selecting it and tapping the reader) reveals that product’s information on a separate screen. Selection alone does not scan. Lifting the product clears the reader and screen. The UI explicitly describes simulated browser behavior versus real RFID hardware. `npm run test:rfid` covers every product/ID mapping, keyboard and tap controls, actual mouse/touch drag, invalid drops, clearing, and English/Thai mobile layouts.

The immersive room now responds to taps on projected walls and the floor: ocean bubbles/ripples, forest fireflies, and a space starlight burst. Hit testing maps each tap into the projected surface, so effects remain attached to the room when the view changes. Taps and drags are distinguished; Enter/Space and the explicit interaction button offer keyboard access. Effects are bounded and fade during playback; paused/reduced-motion scenes show a static response. The immersive browser checks cover all theme/surface combinations plus touch input.

Tap the Right Item is a standalone configurable game (`custom-game-demo.js`, `scripts/custom-game-demo.mjs`). Visitors choose brand name, collectible, palette, round duration, goal, and pop-up speed. Targets and decoys briefly pop out of six random holes; only tapping the selected item before it disappears scores. Easy/normal/fast presets control visibility and spawn timing; keys 1–6 provide a keyboard alternative. Reaching the goal or running out of time shows a result. Pause/resume preserves the round, and hidden tabs pause automatically. Brand input starts empty with a localized placeholder; fallback preview text is never inserted into the input. `npm run test:custom-game` covers settings, safe brand rendering, correct/wrong items, keyboard/touch play, pause, victory, timeout, replay, reset, and both language layouts.


Memory Match (`matching-game.js`, `scripts/matching-game.mjs`) supports branded card backs, palettes, image themes, pair counts, and round duration. It handles mismatches, matched pairs, pause, victory, timeout, and reset. Catch Game has local brand/palette/item/time/difficulty/hazard controls in `catch-customization.js`. Scratch Reveal has local brand/message/palette/brush settings while retaining the default 20% smaller brush and manual reveal. `scripts/game-settings.mjs` supplies these panels. `npm run test:game-variants` checks all three game categories, matching gameplay, Catch settings, and reveal customization in both languages and on touchscreens. The old #experience-builder anchor remains an alias for #tap-game.

Collectible uploads are available in Catch Game and Tap the Right Item through the shared `item-upload.js` helper. PNG/JPEG/WebP files up to 5 MB are decoded locally, shown in a preview, and used as actual collectible images; removing/resetting restores the preset item. Object URLs are revoked on replacement/reset, pending loads are invalidated when a round starts, and uploads never leave the browser. All customization fields now update immediately; Catch and Reveal no longer have Apply buttons. Reveal edits preserve the current cleared mask until the visitor resets it. `npm run test:uploads` verifies actual image play, live updates, invalid/oversized files, removal, locks during play, and English/Thai layouts.

Scratch Reveal also accepts a locally uploaded background image through the shared uploader. The image is displayed in full with contain sizing beneath the fog, with no default text obscuring it; custom brand/message fields can still add an overlay. Uploading/replacing/removing an image starts a fresh fog mask without automatic reveal. Removing the image restores the original animated scene and message. The upload browser checks cover photo reveal, replacement, removal, and reset in both languages and at desktop/mobile widths.

The Playground omits the separate customization overview, the immersive Try interaction/Pause scene buttons, and the Light Canvas pattern button. Immersive scenes respond directly to tapping or Enter/Space; drawing happens directly on the light canvas.

Demo library cards omit the generic illustrations and use uniform Try demo actions. The desktop grid has four columns, tablet two, and mobile one.
