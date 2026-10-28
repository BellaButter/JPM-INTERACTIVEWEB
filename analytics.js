// GA4 for the public website only; local and Vercel previews do not send visits.
(() => {
  if (!['www.jpmmediaspace.com', 'jpmmediaspace.com'].includes(window.location.hostname)) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-YFTRX8QT22');
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-YFTRX8QT22';
  document.head.appendChild(tag);
})();
