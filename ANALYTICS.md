# Website measurement

GA4 stream: `G-YFTRX8QT22`. Collection starts only on
`www.jpmmediaspace.com` or `jpmmediaspace.com`, never localhost or Vercel previews.
The release shell loads `analytics.js`. Update the asset version when changing
tracking code so returning visitors receive the latest cached scripts.

| Event | Meaning | Fixed parameters |
| --- | --- | --- |
| `contact_click` | Click a LINE, telephone or email link; intent, not a completed conversation | `contact_method`, `cta_location`, `site_language` |
| `quote_cta_click` | Open the contact page or a same-site #contact section | `cta_location`, `site_language` |
| `quote_form_submit` | Valid quote form submitted, before leaving for FormSubmit; not yet a confirmed lead | `form_id`, `site_language` |
| `generate_lead` | Same tab returns to Thank You within 30 minutes after a valid quote submission | `form_id`, `site_language` |
| `demo_start` | First successful game start or actual interaction with each demo, once per page load | `demo_id`, `site_language` |

`generate_lead` is the enquiry key event. It confirms the success-page return;
it does not independently prove that the notification email reached the inbox.
Direct Thank You visits, reloads, invalid forms, demo signup forms and expired
pending markers do not count as leads. A return to the enquiry form clears its
pending marker. With session storage blocked the success event is intentionally
omitted rather than guessed.

The pending marker contains only a timestamp in sessionStorage, never form
values. Custom events do not include names, phone numbers, email addresses,
message text, free-text service choices, link text/URLs, scores, player names or
uploaded media. Keep event parameters on fixed allowlists. Demo signup stays local.

GA4 enhanced measurement remains enabled for standard page views, engagement,
90% scroll and supported outbound interactions. Generic automatic `form_submit`
is not the enquiry conversion: demos also contain forms.

Custom event dimensions: Contact method (`contact_method`), CTA location
(`cta_location`), Demo ID (`demo_id`), Site language (`site_language`).

Validate with `npm run build:release`, `npm run check`, and `npm test`.
Tests simulate valid/invalid/abandoned/successful form flows without contacting
FormSubmit. Do not submit a real enquiry as a test. Realtime test visits and demo
plays can appear in GA4 and must not be reported as customer activity.
