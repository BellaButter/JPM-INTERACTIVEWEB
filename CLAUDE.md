# JPM Media Space — project handoff

This is the latest local redesign of the JPM Media Space website, with English and Thai pages and interactive browser demos. Start by reading README.md and ARCHITECTURE.md. Preserve the current design and behavior unless the owner requests a change.

## Run and check

- Requires Node.js 18 or later. No dependency installation is needed for the site itself.
- `npm start` builds the pages and serves http://127.0.0.1:4173.
- Thai home: http://127.0.0.1:4173/th/index.html.
- If port 4173 is occupied by the existing preview, use that preview instead of starting another server.
- After template or copy edits: `npm run build`.
- Validation: `npm run check` and `npm test`.
- Optional browser tests need Playwright and Chrome. See README.md and package.json for the relevant demo checks. Do not submit a real contact enquiry while testing; intercept the request.

## Edit sources

- `scripts/build-site.mjs`: page composition.
- `scripts/components.mjs`: shared navigation, footer, form, demo library.
- `homepage.css`: shared design, typography, mobile layouts.
- `homepage.js`: shared interactions and enquiry form behavior.
- `content/en/site.mjs`: English content and shared records.
- `content/th/site.mjs` and `content/th/demos.mjs`: Thai copy.
- Individual demo modules and generators are described in README.md.

HTML pages and `site-i18n.js` are generated. Edit the source and rebuild; do not use generated HTML as the primary source of changes.

## Current approved details

- Main navigation selection uses an animated underline, with no underline on pointer hover. Explore dropdown items use the original filled selection highlight.
- Footer tagline sits close to the logo and is 2pt larger than its previous size.
- Thai contact name is คุณเม. Contact channel labels are 14px.
- Thai font is Noto Sans Thai Looped (owner choice 2026-10-26, replaces Noto Sans Thai); English uses Manrope. On Thai pages the stack is Manrope then Noto Sans Thai Looped, so English words and numbers stay in Manrope.
- Thai copy keeps English for the slogan, brand, client and project names, demo names and technical acronyms (LED, RFID, NFC, LiDAR); common terms use Thai transliteration (อินเทอร์แอคทีฟ, อิมเมอร์ซีฟ, ทัชสกรีน) for Thai search. Thai contact name is คุณเม everywhere, including the footer.
- Four promises (owner-approved core way of working), shown as "What you get from JPM Media Space" inside Home section 03 (Why JPM Media Space): before we start (see it before you decide; feasibility check and two prototype versions), while it runs (technical team on site from start to finish), after handover (usage summary such as engagement numbers, to refine strategy for the next project), next time (a system you can update, move, or expand). Source: `promises` in `scripts/components.mjs`.
- Write the company name in full as JPM Media Space (JPM MEDIA SPACE in uppercase labels) in visible copy, never "JPM" alone.
- Thai copy was rewritten on 2026-10-16 in an approved tone: confident, warm, a thinking partner; it addresses the reader as คุณ and the studio as เรา, describes outcomes rather than feature lists, and avoids literal translation. Keep new Thai copy in that tone.
- Demo library has four columns on desktop, two on tablet, one on mobile. Generic preview illustrations are removed; all actions say Try demo / ลองเดโม.
- Product catalog is a sliding card carousel. The selected card is centered. Topic details stay hidden until clicked and collapse when the same topic is clicked again. Changing products closes the details.
- Tap the Right Item uses timed pop-up targets and decoys, three speed settings, and local image upload support.
- Each game retains its own customization controls; changes apply automatically. The separate customization overview is removed.
- Fog reveal is manual, with soft edges, optional uploaded image behind it, and no automatic reveal threshold.
- Immersive scenes respond directly to taps. The Try interaction / Pause scene buttons and Light Canvas pattern button are removed.
- Positioning (owner-approved 2026-10-26, replaces 2026-10-16): interactive games for event booths. Message order: 1) games people queue to play (lead message), 2) no surprises on show day: tested before the event, the people who built it on site from opening to close (trust), 3) leads after the event: sign-up or QR before play and a player/engagement summary (add-on). Tailor-made and one team end to end stay as supporting points. Home hero, Why JPM (section 03, also on About), home stats strip (owner-supplied 50+ / 5+ / 24/7) and the home FAQ (section 08, with FAQPage JSON-LD) carry it. Do not advertise hardware supply; screens and projectors are not included. Do not invent client results, timelines or statistics.
- SEO release: `npm run build:release` sets SITE_ORIGIN to https://www.jpmmediaspace.com and emits index/follow, canonical, hreflang, sitemap.xml (with xhtml alternates), robots.txt and llms.txt. Plain `npm run build` stays noindex for preview. Thai JSON-LD (Organization description, FAQ) is swapped in after localization in build-site.mjs. Organization schema lists alternateName JPM Interactive (the previous site name).
- Structured data (2026-10-26): every page has Organization (@id /#organization); home adds WebSite and FAQPage; services adds an ItemList of Service; packages adds an OfferCatalog (minPrice, THB); case studies add CreativeWork; all indexable inner pages add BreadcrumbList. Built in `pageSchema()` in build-site.mjs and re-generated in Thai for /th/ pages. Schema URLs use SITE_ORIGIN, falling back to https://www.jpmmediaspace.com.
- Home service photos are WebP at 480/960 px with srcset (`assets/service-photos/<id>-480.webp`, `-960.webp`), made from the JPG originals. Thai localization rewrites srcset paths. `vercel.json` sets cache headers for assets, CSS and JS.
- SEO: keyword kicker inside each hero H1 (`.hero-kicker`), Organization JSON-LD, social meta, descriptive alt text, WebP images from `assets/web/` (run `python3 scripts/optimize-images.py` after changing photos).
- Light redesign (owner request 2026-10-27, replaces the dark theme): JPM CI in light mode on every page. Tokens in `:root` of homepage.css (bg #f2f2f5, ink #16161c, brand #6D7099, brand-dark #4f527a, brand-light #9a9dd0). The dark stylesheet was converted automatically; the 'Light redesign' block at the end of homepage.css holds the hand-tuned components: floating pill navigation with an ink 'Let's talk' pill, ink primary and white secondary pill buttons, white cards, dark contrast card for Better Together, two-column FAQ, quote card, dotted footer wordmark (pointer light). Demo stages and game screens deliberately stay dark. Logo uses `assets/jpm-brand-logo-dark.png` (web copy in assets/web).
- Home layout follows the owner's reference (Eloqwnt sales-tech site): hero copy left with proof ticks, 3D cube right, marquee band, stats, services, studio, Why JPM, selected work, playground, process tabs (`[data-process-tabs]` in homepage.js, auto-advance while visible, all steps visible without JS), dark partner card, FAQ, quote.
- Home hero 3D (owner request 2026-10-27, after the Orbii reference): `cube-hero.js` renders the JPM logo cube with Three.js r170 vendored in `vendor/three/` (MIT, LICENSE included). White glossy rounded cube, J on the left face and P on top as in the logo, a screen face with eyes that follow the pointer and blink, slate/lavender glow. Click the cube or use the mode tabs to switch Game / Touchscreen / LED / Sensors (happy, round, pixel and radar eyes). `assets/web/cube-poster.webp` shows the same cube instantly; the live scene starts on the visitor's first interaction (pointer, touch, scroll, key), runs at about 30 fps, pauses offscreen and stays still with reduced motion. To refresh the poster after changing the cube, render the scene with a transparent background at 1140x1050.
- Reading sizes (raised 2026-10-26 at owner request, see 'Readability scale' at the end of homepage.css): paragraphs 18px (17px mobile), hero intro 19px (17px mobile), list items 17px, card titles 22px (20px mobile), labels/eyebrows 13px, nav 16px, buttons 15px, footer 15px. Demo stages, game overlays and form internals keep their own sizes.
- Footer: links and contacts 14px, column labels 12px, bottom bar 13px; the tagline stays footer text + 2pt (16.7px). English and Thai use the same sizes for body, labels and footer; Thai headings track the English sizes at about 92% (Thai defaults use `:where()` so section-specific heading sizes still apply).

## Publication and data

The source originated from https://github.com/maytizlee/JPM-MEDIA-SPACE on branch `redesign-v2`. The handoff ZIP is a snapshot of local work; do not assume the remote repository has these changes.

The static preview is intentionally noindex. Publishing, pushing, or changing hosting requires the owner's explicit request. Preserve project credits, media, package prices, and links unless asked to change them.

Contact forms use the owner-approved FormSubmit endpoint for jpmmediaspace@gmail.com. Real email delivery/activation has not been confirmed. Uploaded demo images remain local to the browser and must not be sent to a server.

The ZIP excludes Git history, preview screenshots, and installed dependencies. In a fresh extracted folder, initialize Git if version control is needed; no remote access or login is required for local edits and preview.
