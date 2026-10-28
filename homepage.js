const siteText = text => window.JPMI18n?.t(text) ?? text;
/* Shared progressive enhancements. The generated HTML remains readable without JS. */
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); }
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
nav?.addEventListener('click', event => { if (event.target.closest('a')) { closeMenu(); nav.querySelectorAll('details[open]').forEach(details => details.open = false); } });
document.addEventListener('keydown', event => { if (event.key !== 'Escape') return; const dropdown = nav?.querySelector('details[open]'); if (dropdown) { dropdown.open = false; dropdown.querySelector('summary').focus(); } else if (menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { document.querySelectorAll('.nav-dropdown[open]').forEach(dropdown => { if (!dropdown.contains(event.target)) dropdown.open = false; }); });
matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);
const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }, { threshold: .05 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('motion-enabled');
}
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
// The artwork reacts to the pointer; the card's text and controls stay stationary.
document.querySelectorAll('.service-detail').forEach(card => {
  let pending = 0;
  const properties = ['--service-pointer-x','--service-pointer-y','--art-shift-x','--art-shift-y','--catcher-shift'];
  function reset() { cancelAnimationFrame(pending); properties.forEach(property => card.style.removeProperty(property)); }
  card.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
      const y = Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
      card.style.setProperty('--service-pointer-x',`${x*100}%`);
      card.style.setProperty('--service-pointer-y',`${y*100}%`);
      card.style.setProperty('--art-shift-x',`${(x-.5)*10}px`);
      card.style.setProperty('--art-shift-y',`${(y-.5)*8}px`);
      card.style.setProperty('--catcher-shift',`${(x-.5)*20}px`);
    });
  });
  card.addEventListener('pointerleave',reset);
  card.addEventListener('pointercancel',reset);
  reducedMotion.addEventListener('change',reset);
  finePointer.addEventListener('change',reset);
});
document.querySelectorAll('[data-tilt]').forEach(card => {
  let pending = 0;
  function reset() { cancelAnimationFrame(pending); card.style.transform = ''; card.style.removeProperty('--mouse-x'); card.style.removeProperty('--mouse-y'); }
  card.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches) return;
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => { const rect = card.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width; const y = (event.clientY - rect.top) / rect.height; card.style.setProperty('--mouse-x', `${x*100}%`); card.style.setProperty('--mouse-y', `${y*100}%`); if (card.classList.contains('visible') || !card.classList.contains('reveal')) card.style.transform = `perspective(1000px) rotateX(${(y-.5)*-3}deg) rotateY(${(x-.5)*3}deg)`; });
  });
  card.addEventListener('pointerleave', reset);
  reducedMotion.addEventListener('change', reset);
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const value = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('active',active); item.setAttribute('aria-pressed',String(active)); });
  let count = 0;
  document.querySelectorAll('.work-gallery .project-card').forEach(card => { const visible = value === 'all' || value === card.dataset.category || value === 'employer' && card.dataset.employer === 'true'; card.hidden = !visible; if (visible) { card.classList.add('visible'); count++; } });
  document.querySelector('.filter-count').textContent = siteText(`${count} projects shown.`);
}));
// Article topics are plain links to topic hub pages (insights/<topic>.html), so no filtering script is needed.
const form = document.querySelector('#quote-form');
document.querySelectorAll('.catalog').forEach(catalog => {
  catalog.querySelectorAll('[data-library-filter]').forEach(button => button.addEventListener('click', () => {
    const value = button.dataset.libraryFilter;
    catalog.querySelectorAll('[data-library-filter]').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    let count = 0;
    catalog.querySelectorAll('[data-library-category]').forEach(card => { card.hidden = value !== 'all' && card.dataset.libraryCategory !== value; if (!card.hidden) { card.classList.add('visible'); count++; } });
    catalog.querySelector('.catalog-status').textContent = siteText(`${count} items shown.`);
  }));
});
if (form) {
  const selected = new URLSearchParams(location.search).get('service');
  if (selected) form.elements.service.value = siteText(selected);
  form.addEventListener('submit', event => {
    if (!form.reportValidity()) { event.preventDefault(); return; }
    if (form.dataset.sending === 'true') { event.preventDefault(); return; }
    form.elements._next.disabled = false;
    form.elements._next.value = new URL('thank-you.html', location.href).href;
    form.elements._subject.value = 'Project enquiry: ' + (form.elements.service.value || 'New project');
    form.dataset.sending = 'true';
    const submit = form.querySelector('[type="submit"]');
    submit.setAttribute('aria-disabled', 'true');
    submit.querySelector('.quote-submit-label').textContent = siteText('Sending…');
    document.querySelector('#quote-status').textContent = siteText('Continuing to secure submission. Please complete the verification if prompted.');
  });
  window.addEventListener('pageshow', () => {
    delete form.dataset.sending;
    form.querySelector('[type="submit"]').removeAttribute('aria-disabled');
    form.querySelector('.quote-submit-label').textContent = siteText('Send enquiry');
    document.querySelector('#quote-status').textContent = siteText('');
  });
}

// Preserve a normal Articles link when no same-site previous page is available.
document.querySelector('[data-article-back]')?.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (history.length > 1 && document.referrer && new URL(document.referrer).origin === location.origin) {
    event.preventDefault();
    history.back();
  }
});

// Real links also work without JavaScript; preserve the current section and enquiry context.
document.querySelectorAll('.language-option').forEach(link=>{const target=new URL(link.href);target.search=location.search;target.hash=location.hash;link.href=target.href;});

// FAQ: answers slide open and closed smoothly. Native <details> still works without JavaScript or with reduced motion.
document.querySelectorAll('.faq-item').forEach(item => {
  const summary = item.querySelector('summary');
  const answer = item.querySelector('summary ~ *');
  if (!summary || !answer || !item.animate) return;
  let running = null;
  summary.addEventListener('click', event => {
    if (reducedMotion.matches) return;
    event.preventDefault();
    const opening = !item.open || item.classList.contains('is-closing');
    const start = item.offsetHeight;
    running?.cancel();
    if (opening) { item.classList.remove('is-closing'); item.open = true; }
    else item.classList.add('is-closing');
    const end = opening ? item.offsetHeight : summary.offsetHeight + item.offsetHeight - item.clientHeight; // closed height includes the border
    item.style.overflow = 'hidden';
    running = item.animate({ height: [`${start}px`, `${end}px`] }, { duration: opening ? 420 : 320, easing: 'cubic-bezier(.22,.8,.24,1)' });
    if (opening) answer.animate({ opacity: [0, 1], transform: ['translateY(-6px)', 'none'] }, { duration: 380, delay: 80, easing: 'ease-out', fill: 'backwards' });
    // finished rejects when a newer click cancels this run, so only the latest animation settles the state.
    running.finished.then(() => {
      if (!opening) { item.open = false; item.classList.remove('is-closing'); }
      item.style.overflow = ''; running = null;
    }, () => {});
  });
});

// About stats: the divider draws down, the number counts up, then the suffix settles in.
(() => {
  const stats = document.querySelector('.company-stats');
  if (!stats || !('IntersectionObserver' in window) || reducedMotion.matches) return;
  const items = [...stats.children].map((card, index) => {
    const value = card.querySelector('strong');
    const match = value?.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match) return null;
    const target = Number(match[1]);
    value.setAttribute('aria-label', value.textContent.trim());
    value.textContent = '';
    // The figure gets its own element so styles (such as the Home gradient) never bleed into the suffix.
    const figure = document.createElement('span'); figure.className = 'stat-number'; figure.textContent = '0'; value.append(figure);
    const number = figure.firstChild;
    if (match[2]) { const suffix = document.createElement('small'); suffix.className = 'stat-suffix'; suffix.setAttribute('aria-hidden', 'true'); suffix.textContent = match[2]; value.append(suffix); }
    card.style.setProperty('--stat-delay', `${index * 180}ms`);
    return { card, number, target, delay: index * 180 };
  }).filter(Boolean);
  stats.classList.add('stats-animated');
  const ease = t => 1 - Math.pow(1 - t, 4);
  function run() {
    stats.classList.add('is-counting');
    const start = performance.now();
    items.forEach(({ card, number, target, delay }) => {
      const duration = 1500;
      const tick = now => {
        const t = Math.min(1, Math.max(0, (now - start - delay) / duration));
        number.nodeValue = String(Math.round(ease(t) * target));
        if (t < 1) requestAnimationFrame(tick); else card.classList.add('is-done');
      };
      requestAnimationFrame(tick);
    });
  }
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); run(); } }, { threshold: 0.4 });
  observer.observe(stats);
})();

// Thai two-part headings: show the second (highlighted) part on the same line
// whenever the whole heading fits on one line; otherwise keep the two-line layout.
(() => {
  if (document.documentElement.lang !== 'th') return;
  const headings = [...document.querySelectorAll('h1, h2')].filter(h => h.querySelector(':scope > .gradient-text, :scope > .arcade-highlight, :scope > .hero-line'));
  if (!headings.length) return;
  function lineCount(h) {
    const range = document.createRange();
    const kicker = h.querySelector(':scope > .hero-kicker, :scope > .eyebrow');
    if (kicker) { range.setStartAfter(kicker); range.setEnd(h, h.childNodes.length); } else range.selectNodeContents(h);
    const tops = [];
    for (const rect of range.getClientRects()) { if (rect.width < 1) continue; if (!tops.some(top => Math.abs(top - rect.top) < rect.height / 2)) tops.push(rect.top); }
    return tops.length;
  }
  // Add the class to every heading first and measure them together, so the browser lays out
  // the page once instead of once per heading (this ran before first paint on phones).
  function fit() {
    for (const h of headings) h.classList.add('th-one-line');
    const wrapped = headings.filter(h => lineCount(h) > 1);
    for (const h of wrapped) h.classList.remove('th-one-line');
  }
  let pending = 0;
  addEventListener('resize', () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(fit); });
  (document.fonts?.ready || Promise.resolve()).then(fit);
  fit();
})();

// Home process tabs (2026-10-27): one step at a time with a progress bar; advances while in view
// until the visitor picks a step. Without JS every step stays visible.
document.querySelectorAll('[data-process-tabs]').forEach(root => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('.process-panel')];
  if (!tabs.length) return;
  root.classList.add('is-enhanced');
  let index = 0, timer = 0, manual = false, inView = false;
  const DURATION = 5200;
  function show(next, focus = false) {
    index = (next + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => { const on = i === index; tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; tab.classList.toggle('is-done', i < index); });
    panels.forEach((panel, i) => panel.classList.toggle('is-active', i === index));
    if (focus) tabs[index].focus();
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    root.style.setProperty('--process-duration', manual || reducedMotion.matches ? '0ms' : DURATION + 'ms');
    root.classList.remove('is-timing'); void root.offsetWidth;
    if (manual || reducedMotion.matches || !inView) return;
    root.classList.add('is-timing');
    timer = setTimeout(() => show(index + 1), DURATION);
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { manual = true; show(i); });
    tab.addEventListener('keydown', event => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (step) { event.preventDefault(); manual = true; show(index + step, true); }
    });
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }, { threshold: 0.4 }).observe(root);
  show(0);
});

// Footer wordmark: a soft light follows the pointer across the dotted letters.
document.querySelectorAll('[data-wordmark]').forEach(mark => {
  if (!finePointer.matches) return;
  mark.parentElement.addEventListener('pointermove', event => {
    const rect = mark.getBoundingClientRect();
    mark.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    mark.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, { passive: true });
});
