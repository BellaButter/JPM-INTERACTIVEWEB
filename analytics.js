// GA4 for the public website only; local and Vercel previews do not send visits.
(() => {
  if (!['www.jpmmediaspace.com', 'jpmmediaspace.com'].includes(window.location.hostname)) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // Team devices: open any page once with ?jpm_team=on (?jpm_team=off undoes it).
  // The device is then tagged traffic_type=internal, which the GA4 "Internal
  // Traffic" data filter removes from reports. Storage holds no PII.
  const teamKey = 'jpm_team_device_v1';
  let team = false;
  try {
    const flag = new URL(window.location.href).searchParams.get('jpm_team');
    if (flag === 'on') window.localStorage.setItem(teamKey, '1');
    if (flag === 'off') window.localStorage.removeItem(teamKey);
    team = window.localStorage.getItem(teamKey) === '1';
  } catch { /* Storage may be blocked: count the visit normally. */ }
  window.gtag('config', 'G-YFTRX8QT22', ...(team ? [{ traffic_type: 'internal' }] : []));
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-YFTRX8QT22';
  document.head.appendChild(tag);

  // Send fixed labels only: never link URLs/text, form values or demo uploads.
  const language = document.documentElement.lang === 'th' ? 'th' : 'en';
  const send = (name, parameters = {}) => window.gtag('event', name, { site_language: language, ...parameters });
  const position = element => element.closest('footer') ? 'footer'
    : element.closest('.site-header') ? 'header'
    : element.closest('.demo-section') ? 'demo'
    : element.closest('.request-quote') ? 'quote_section'
    : element.closest('.hero,.page-hero') ? 'hero' : 'content';
  const quoteLocations = new Set(['home_hero', 'service_hero', 'service_brief', 'packages', 'playground', 'article_end', 'footer']);
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, window.location.href); } catch { return; }
    const contact = url.protocol === 'tel:' ? 'phone' : url.protocol === 'mailto:' ? 'email'
      : ['line.me', 'lin.ee'].includes(url.hostname) ? 'line' : null;
    if (contact) {
      const parameters = { contact_method: contact, cta_location: position(link) };
      // A normal LINE navigation waits briefly for the tag, with a bounded
      // fallback even if Analytics is blocked. Modified clicks and protocol
      // handlers retain their native behavior.
      if (contact === 'line' && event.button === 0 && !event.defaultPrevented &&
        !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey &&
        (!link.target || link.target === '_self')) {
        event.preventDefault();
        let followed = false;
        const follow = () => { if (!followed) { followed = true; window.location.assign(url.href); } };
        setTimeout(follow, 700);
        send('contact_click', { ...parameters, event_callback: follow, event_timeout: 600 });
      } else send('contact_click', parameters);
    }
    // Only buttons marked data-quote-cta ask for a brief or a quote; general
    // contact links (menu, "Let's talk", "Start a conversation") are not counted.
    else if (link.hasAttribute?.('data-quote-cta')) {
      const location = link.getAttribute('data-quote-cta');
      send('quote_cta_click', { cta_location: quoteLocations.has(location) ? location : 'other' });
    }
  });

  // A valid submission is an attempt. A lead is counted only after FormSubmit
  // returns this tab to Thank You, once, within 30 minutes. Storage holds no PII.
  const pendingKey = 'jpm_quote_pending_v1';
  document.addEventListener('submit', event => {
    const form = event.target;
    if (form.id !== 'quote-form' || event.defaultPrevented || !form.checkValidity()) return;
    try { window.sessionStorage.setItem(pendingKey, String(Date.now())); } catch { /* Storage may be blocked. */ }
    send('quote_form_submit', { form_id: 'quote-form' });
  });
  if (/\/(?:th\/)?thank-you\.html$/.test(window.location.pathname)) {
    try {
      const value = window.sessionStorage.getItem(pendingKey);
      window.sessionStorage.removeItem(pendingKey);
      const age = Date.now() - Number(value);
      if (value && age >= 0 && age < 30 * 60 * 1000) send('generate_lead', { form_id: 'quote-form' });
    } catch { /* Do not guess that a direct visit is a successful enquiry. */ }
  }
  // Returning from a cancelled/failed external submission must not leave a
  // pending lead on the form page. A subsequent valid submit sets a fresh marker.
  if (document.querySelector('#quote-form')) {
    window.addEventListener('pageshow', () => {
      try { window.sessionStorage.removeItem(pendingKey); } catch { /* Optional storage. */ }
    });
  }

  const demos = new Set(['catch-game', 'tap-game', 'memory-match', 'lucky-wheel', 'quick-quiz', 'shape-hunt',
    'scratch-reveal', 'product-explorer', 'atmosphere-room', 'sensor-trigger', 'light-canvas']);
  document.addEventListener('jpm:demo-start', event => {
    if (demos.has(event.detail?.demo_id)) send('demo_start', { demo_id: event.detail.demo_id });
  });
})();
