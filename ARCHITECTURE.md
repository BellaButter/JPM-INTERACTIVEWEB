# JPM Media Space v2 architecture

## Baseline and source audit

The repository was cloned from `maytizlee/JPM-MEDIA-SPACE`, starting at `origin/main` commit `256857d`. Work continues on the separate local branch `redesign-v2`; production `main` is unchanged.

The baseline is a static site: a Homepage, two portfolio pages, three CSS files, `app.js`, and an `assets/` directory of installation photography, project images, logos, LINE QR artwork, and MP4 videos. There was no package manager configuration, frontend framework, CMS, backend, or build pipeline. Large MP4 files are retained and load only when requested on project detail pages (`preload="none"`). Google Fonts supplies Manrope with a system font fallback.

No GitHub Actions workflow, CNAME, hosting manifest, or provider-specific configuration was tracked. The unauthenticated GitHub Pages settings API returned HTTP 404. The supplied content-reference URL could not be read through the web tool, so repository content is the primary source. The supplied production URL redirects to `/en` and presents a separate JPM Interactive site; its provider and deployment branch rules are not established. The redesign preserves the user's requested JPM Media Space identity. No hosting settings, production files, or remote branches have been changed.

Reference URLs: https://maytizlee.github.io/JPM-MEDIA-SPACE/ and https://www.jpmmediaspace.com/en.

The original Homepage is preserved as `studio-archive.html`. Both original portfolios, their scripts/styles, and all original assets are retained. Their legacy layout/accessibility issues are outside the redesigned-page audit. Employer projects retain the explicit “Portfolio with Employer” credit in both the new gallery and detail pages. No client result, testimonial, delivery statistic, or specific project hardware was invented.

## Design system and implementation

The latest user reference is an arcade catalog layout, applied to both the Homepage and Playground: a wide framed hero, bold uppercase headline, capsule buttons, category filters, and three-column thumbnail cards. The content remains JPM's six actual technology services and three working demos. The brand colors come from the original repository's `style.css`, rather than the reference's cyan or the previous purple concept. Shared components, SVG illustrations, game graphics, and supporting pages use the same slate CI palette.

Shared CSS tokens:

| Token | Value |
| --- | --- |
| Background | `#141414` |
| Card | `#1F1F23` |
| Elevated surface | `#292A33` |
| JPM primary | `#6D7099` |
| JPM slate | `#7C7EA0` |
| Light accent / original border | `#D2D6E2` |
| Primary text | `#FFFFFF` |
| Secondary text / JPM muted | `#9498B3` |

`scripts/components.mjs` provides the shared page shell, header/dropdown, footer, CTA, buttons, headings, and SVG illustrations. `scripts/build-site.mjs` composes 56 static pages (28 per language) from `content/en/site.mjs`. The generated HTML remains checked in to preserve static hosting compatibility. Native SVG and CSS provide layered illustrations. Homepage service cards use stills from supplied project videos; sources and credits are documented in assets/service-photos/README.md.

`homepage.js` progressively enhances navigation, filters, reveals, cursor glow/tilt, and FormSubmit enquiry routing. Content and native navigation remain usable with JavaScript disabled. Pointer effects use one queued animation frame per card, only for precise pointers and when reduced motion is off. Scroll reveals unobserve after entry. The current framed heroes use static ambient gradients. Gameplay starts only by user action and has pause/resume; it automatically pauses when the page becomes hidden. Reduced-motion disables decorative animation and smooth scrolling while leaving explicitly initiated gameplay available.

## Page inventory

| Page | Route | Behavior |
| --- | --- | --- |
| Home | `index.html` | Framed hero, six filterable service cards, studio, projects, playable-demo links, five-step workflow, partnership, contact CTA |
| About Us | `about.html` | Original company overview, values, expertise, technologies, workflow |
| Services | `services.html` | Six service sections with deep links, illustrations, relevant examples, enquiry prefilling |
| Experience settings (legacy URL) | `industries.html` | Removed from navigation; existing URL retained with inclusive copy. A compact examples section now lives at `services.html#experience-settings`. |
| Packages | `packages.html` | Package descriptions, four owner-approved starting prices, custom solutions, sensor add-ons |
| Our Work | `case-studies.html` | Fifteen source portfolio references, discipline filters and preserved employer attribution |
| Project details | `case-studies/<slug>.html` | Project image, on-demand source video, discipline/interaction reference, original credit, enquiry CTA; two example narrative case studies |
| Playground | `playground.html` | Framed hero, filterable three-card demo catalog, three actual browser prototypes with controls, explanations, application examples, quote CTAs |
| Insights | `insights.html` | Draft studio guides, categories/filter, reusable article records |
| Article details | `insights/<slug>.html` | Semantic article template, byline, reading time, sections, related guides, internal links |
| Partner With Us | `partner-with-us.html` | Event agencies, production houses, LED providers, system integrators |
| Contact | `contact.html` | Original email/phone/LINE, QR code, validated project enquiry form, FormSubmit email delivery handoff |

Explicit `.html` routes and relative links work under a repository subpath or a domain root. Query strings prefill service/package/industry/partnership enquiries. No fake destinations or future-page placeholders are presented as completed pages.

## Content and publication review

The Home hero uses the user-approved “DESIGN TO ENGAGE / CREATE NEW EXPERIENCES” heading and the engineering/installation introduction. About Us uses the separately supplied company overview, original belief statement, four Core Values, and the supplied `50+`, `5+`, and `24/7` company figures. These are separate editable records in `content/en/site.mjs`, so updating one page's introduction does not replace the other.

Service detail cards have a subtle cursor-following glow and up to 5px artwork parallax; text and controls remain stationary. Each SVG illustration has a short response appropriate to its service (falling sparks/catcher, touch highlight, room glow, radar sweep, development signal, or projection wave). Decorative animations run for two iterations, end within approximately three seconds, and are gated to fine hover pointers with no reduced-motion preference. Pointer offsets reset on leave/cancel or preference change. Mobile does not simulate pointer-driven hover. Browser QA confirmed all six responses, stationary text, reset, reduced-motion suppression, and touch fallback.

Package prices are editable in `content/en/site.mjs`: Events touchscreen `30,000.-`, Events LED/projector `56,000.-`, Permanent touchscreen `39,000.-`, Permanent LED/projector `160,000.-`. Owner-approved price updates and customer-facing scope terms replace the preview review notice. Currency, tax and hardware inclusion are not invented; final quotation defines scope.

## Implemented Thai version

`th/` contains a Thai counterpart for every generated English page. `content/th/site.mjs` stores editorial translations; templates retain one set of IDs, prices, filter values and media credits. The language toggle links matching pages and preserves the current query and section with JavaScript. Static links are usable without JavaScript. Thai pages use Noto Sans Thai and localized controls, form labels, articles, case-study descriptions, demo instructions and runtime state announcements. The shared generated `site-i18n.js` keeps dynamically updated content in the selected language.

Both locales remain noindex in preview. When SITE_ORIGIN is configured for an approved release, pages emit self-referencing canonicals and reciprocal language alternates, and the sitemap includes both sets of published routes. Local tests do not deploy or send real email.
