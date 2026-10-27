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
- Thai font is Prompt (owner choice 2026-10-27, replaces Noto Sans Thai Looped); English uses Manrope. On Thai pages the stack is Manrope then Prompt, so English words and numbers stay in Manrope. Thai text has a 14px floor (15px for labels, eyebrows and captions); see "Thai minimum sizes" at the end of homepage.css.
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
- Structured data (2026-10-26): every page has Organization (@id /#organization); home adds WebSite and FAQPage; services adds an ItemList of Service; packages adds an OfferCatalog (minPrice, THB); case studies add CreativeWork; all indexable inner pages add BreadcrumbList; articles add Article and topic hubs/Articles page add CollectionPage (2026-10-27). Built in `pageSchema()` in build-site.mjs and re-generated in Thai for /th/ pages. Schema URLs use SITE_ORIGIN, falling back to https://www.jpmmediaspace.com.
- Home service photos are WebP at 480/960 px with srcset (`assets/service-photos/<id>-480.webp`, `-960.webp`), made from the JPG originals. Thai localization rewrites srcset paths. `vercel.json` sets cache headers for assets, CSS and JS.
- SEO: keyword kicker inside each hero H1 (`.hero-kicker`), Organization JSON-LD, social meta, descriptive alt text, WebP images from `assets/web/` (run `python3 scripts/optimize-images.py` after changing photos).
- Light redesign (owner request 2026-10-27, replaces the dark theme): JPM CI in light mode on every page. Tokens in `:root` of homepage.css (bg #f2f2f5, ink #16161c, brand #6D7099, brand-dark #4f527a, brand-light #9a9dd0). The dark stylesheet was converted automatically; the 'Light redesign' block at the end of homepage.css holds the hand-tuned components: floating pill navigation with an ink 'Let's talk' pill, ink primary and white secondary pill buttons, white cards, dark contrast card for Better Together, two-column FAQ, quote card, dotted footer wordmark (pointer light). Demo stages and game screens deliberately stay dark. Logo uses `assets/jpm-brand-logo-dark.png` (web copy in assets/web).
- Home layout follows the owner's reference (Eloqwnt sales-tech site): hero copy left with proof ticks, 3D cube right, marquee band, stats, services, studio, Why JPM, selected work, playground, process tabs (`[data-process-tabs]` in homepage.js, auto-advance while visible, all steps visible without JS), dark partner card, FAQ, quote.
- Home hero 3D (owner request 2026-10-27, revised the same day after the Orbii reference): `cube-hero.js` renders a round mascot with Three.js r170 vendored in `vendor/three/` (MIT, LICENSE included). It no longer uses the logo letters. White glossy sphere with a black visor screen and a violet-to-periwinkle rim. The head turns and the eyes look wherever the pointer is on the page, and the eyes blink. Click the character or use the mode tabs to switch Game / Touchscreen / LED / Sensors (oval, happy, pixel and ring eyes; rim colour changes per mode). The mode card beside it is wider (410px) with larger text. Five owner-written chips float around it (`cubeChips` in build-site.mjs; Thai: คนดึงเข้าบูธ / หน้างานสมูธ / เก็บ lead ลูกค้า / งานถาวรรับประกัน 1 ปี / ทีมเดียวดูแลครบวงจร); they stay off the face at owner-marked spots (above the head, upper right, upper left, right, low left); on phones they wrap in a row under the character. Class names keep the `cube-` prefix. `assets/web/cube-poster.webp` shows the same character instantly; the live scene starts on the visitor's first interaction (pointer, touch, scroll, key), runs at about 30 fps, pauses offscreen and stays still with reduced motion. To refresh the poster after changing the character, render the scene with a transparent background at 1140x1050 with the pointer at the stage centre (headless Chrome, `canvas.toBlob('image/webp')`).
- Home marquee: two identical groups, each listing the items twice, slide by one group width for a seamless loop; 48px spacing between items. Home stats keep the original strip design (divider lines, count-up, suffix) with larger figures: 46–62px desktop, 36px phones.
- English letter spacing (owner request 2026-10-27): body text +0.012em, h1/h2 and big figures -0.02em, h3 -0.005em; see the block at the end of homepage.css. Thai pages unchanged.
- Package prices (owner request 2026-10-27): 30–42px desktop, 30px phones (halved from the first enlargement), brand-dark, with a small uppercase Start / เริ่มต้น label; see 'Package prices' at the end of homepage.css (needs !important to beat the readability scale).
- FAQ answers slide open and closed (owner request 2026-10-27): homepage.js animates the <details> height with the Web Animations API; native <details> behaviour stays without JavaScript or with reduced motion.
- Playground contrast (2026-10-27): game stages (Catch, Tap the Right Item, Memory Match, RFID reader and screen) are dark with light text; text on white surfaces uses ink/muted; pills are white with ink text, active pill ink. See 'Playground contrast' at the end of homepage.css.
- Articles (insights/*.html) sit on a white reading panel (920px, 28px radius); see 'Article reading panel' in homepage.css.
- Article topics (owner-approved 2026-10-27, for SEO/AEO/GEO): articles are grouped by topic, not format. `articleTopics` in content/en/site.mjs (Thai names and intros in content/th/site.mjs): Event Booth Games (lead), Touchscreens & Kiosks, LED, Projection & Immersive Rooms, Sensors & Technology, Planning & Lead Capture. Each topic has a hub at `insights/<slug>.html` (intro, its articles, related services and two case studies); a hub stays noindex and out of the sitemap until it has a published article. Format (Inspiration / Behind the Experience / Practical Guides) stays as a secondary label in `category`. The Articles page links to hubs (no JS filter). Articles carry `published`/`updated` dates (both starter articles: 2026-10-27, owner-confirmed), shown in the byline (Thai dates in the Buddhist year) and used in Article JSON-LD, sitemap lastmod and llms.txt. Hubs and the Articles page add CollectionPage JSON-LD; article breadcrumbs go Home > Articles > Topic > Article. To add an article: append to `articles` with `topic`, `category`, `published`, `updated`, and add its Thai copy to `articleCopy`.
- Article images (2026-10-27): `cover: { image, alt, caption? }` on an article and an optional third section item `{ image, alt, caption? }` for an inline figure (scripts/article-media.mjs). New photos go in assets/articles/ (keep them about 1600px wide, ideally WebP under 300 KB; the Python optimizer only scans assets/), or reuse a photo in assets/ by name. Width/height come from the file header. The cover is the hero image, the card thumbnail, og:image (og:type article) and the Article JSON-LD image; Thai alt/caption go in articleCopy (cover, section third item). Starter covers reuse hero_installation.jpg and events_package.jpg. Owner submission form (Claude Doc, export to Word/Google Docs): https://claude.ai/artifact/NNpkB1MzLuPLNLD527Zq1Z
- Reading sizes (raised 2026-10-26 at owner request, see 'Readability scale' at the end of homepage.css): paragraphs 18px (17px mobile), hero intro 19px (17px mobile), list items 17px, card titles 22px (20px mobile), labels/eyebrows 13px, nav 16px, buttons 15px, footer 15px. Demo stages, game overlays and form internals keep their own sizes.
- Footer: links and contacts 14px, column labels 12px, bottom bar 13px; the tagline stays footer text + 2pt (16.7px). English and Thai use the same sizes for body, labels and footer; Thai headings track the English sizes at about 92% (Thai defaults use `:where()` so section-specific heading sizes still apply).

## Publication and data

The source originated from https://github.com/maytizlee/JPM-MEDIA-SPACE on branch `redesign-v2`. The handoff ZIP is a snapshot of local work; do not assume the remote repository has these changes.

The static preview is intentionally noindex. Publishing, pushing, or changing hosting requires the owner's explicit request. Preserve project credits, media, package prices, and links unless asked to change them.

Contact forms use the owner-approved FormSubmit endpoint for jpmmediaspace@gmail.com. Real email delivery/activation has not been confirmed. Uploaded demo images remain local to the browser and must not be sent to a server.

The ZIP excludes Git history, preview screenshots, and installed dependencies. In a fresh extracted folder, initialize Git if version control is needed; no remote access or login is required for local edits and preview.
