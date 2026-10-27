import { translateThai } from '../content/th/site.mjs';

const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const decode = value => value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
export function languageControl(pagePath, locale) {
  const prefix = '../'.repeat(pagePath.split('/').length - 1);
  const en = locale === 'th' ? prefix + '../' + pagePath : prefix + pagePath;
  const th = locale === 'th' ? prefix + pagePath : prefix + 'th/' + pagePath;
  return `<div class="language-toggle" role="group" aria-label="${locale==='th'?'เลือกภาษา':'Website language'}"><a class="language-option${locale==='en'?' is-active':''}" href="${en}" lang="en" hreflang="en"${locale==='en'?' aria-current="page"':''} aria-label="EN, English">EN</a><a class="language-option${locale==='th'?' is-active':''}" href="${th}" lang="th" hreflang="th"${locale==='th'?' aria-current="page"':''} aria-label="TH, ภาษาไทย">TH</a></div>`;
}
export function localizeThai(html, pagePath) {
  let skip = '';
  html = html.replace(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g, token => {
    if (token.startsWith('<')) {
      if (/^<(script|style|svg)\b/i.test(token)) skip=token.match(/^<(\w+)/)[1];
      else if (skip && token.startsWith(`</${skip}`)) skip='';
      if (skip || /^<\//.test(token)) return token;
      return token.replace(/\b(alt|aria-label|placeholder|content|value)="([^"]*)"/g,(match,attribute,value) => {
        if (attribute==='content' && !/name="description"|property="og:(title|description)"|name="twitter:(title|description)"/.test(token)) return match;
        if (attribute==='value' && (!/^<option\b/i.test(token) || token.includes('data-stable-value'))) return match;
        return `${attribute}="${escape(translateThai(decode(value)))}"`;
      });
    }
    if (skip || !token.trim()) return token;
    const trimmed=token.trim();
    return token.replace(trimmed,escape(translateThai(decode(trimmed))));
  });
  html=html.replace('<html lang="en">','<html lang="th">');
  html=html.replace('<meta property="og:locale" content="en_US">','<meta property="og:locale" content="th_TH">');
  html=html.replace(/<div class="language-toggle"[\s\S]*?<\/div>/,languageControl(pagePath,'th'));
  // HTML routes stay relative inside /th/. Shared media, CSS and scripts resolve to the root.
  html=html.replace(/\b(href|src|poster)="([^"]+)"/g,(match,attribute,value)=>{
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(value) || /\.html(?:[?#]|$)/.test(value)) return match;
    return `${attribute}="../${value}"`;
  });
  html=html.replace(/\bsrcset="([^"]+)"/g,(match,list)=>`srcset="${list.split(',').map(entry=>{const item=entry.trim();return /^(?:https?:|data:)/.test(item)?item:'../'+item;}).join(', ')}"`);
  html=html.replace(/url\('assets\//g,"url('../assets/");
  if (process.env.SITE_ORIGIN) {
    const origin=process.env.SITE_ORIGIN.replace(/\/$/,'');
    html=html.replace(/<link rel="canonical"[^>]*>/,`<link rel="canonical" href="${origin}/th/${pagePath}">`);
    html=html.replace(/<meta property="og:url"[^>]*>/,`<meta property="og:url" content="${origin}/th/${pagePath}">`);
  }
  // Thai copy needs its own wrapping instead of English's forced heading breaks;
  // a space keeps the two Thai phrases apart, except after a lead-in that reads as one phrase with the next line.
  html=html.replace(/(<h[1-3]\b[^>]*>)([\s\S]*?)(<\/h[1-3]>)/g,(_,open,copy,close)=>open+copy.replace(/\s*<br\s*\/?>\s*/g,(_,offset,text)=>/(?:^|\s)(?:ขอ|ไอเดียที่|ก้าวเข้าไปอยู่|เราไม่ได้แค่|คำถามที่ลูกค้า)$/.test(text.slice(0,offset).split(/<[^>]+>/).pop().trim())?'':' ')+close);
  if(pagePath==='about.html') {
    html=html.replace(/(<section class="page-hero wrap">[\s\S]*?<h1>)[\s\S]*?(<\/h1>)/, '$1<span class="thai-title-line">บริษัทด้านครีเอทีฟเทคโนโลยี</span><span class="thai-title-line">ผู้เชี่ยวชาญด้านอินเทอร์แอคทีฟ</span><span class="gradient-text thai-title-line">และประสบการณ์อิมเมอร์ซีฟ</span>$2');
  }
  html=html.replace(/(<h[1-3]\b[^>]*>)([\s\S]*?)(<\/h[1-3]>)/g,(_,open,copy,close)=>open+copy.replace(/มีส่วนร่วม|อินเทอร์แอคทีฟ|อิมเมอร์ซีฟ|ครีเอทีฟเทคโนโลยี|ต่อยอด/g,phrase=>'<span class="thai-phrase">'+phrase+'</span>')+close);
  // Kickers left in English (e.g. the JPM slogan) keep English tracking on Thai pages.
  html=html.replace(/<span class="hero-kicker-text">([^<\u0E00-\u0E7F]*)<\/span>/g,'<span class="hero-kicker-text" lang="en">$1</span>');
  html=html.replace('family=Manrope:wght@400;500;600;700;800&display=swap','family=Manrope:wght@400;500;600;700;800&family=Prompt:wght@400;500;600;700;800&display=swap');
  return html;
}
export function languageAlternates(pagePath) {
  if (!process.env.SITE_ORIGIN) return '';
  const origin=process.env.SITE_ORIGIN.replace(/\/$/,'');
  return `<link rel="alternate" hreflang="en" href="${origin}/${pagePath}"><link rel="alternate" hreflang="th" href="${origin}/th/${pagePath}"><link rel="alternate" hreflang="x-default" href="${origin}/${pagePath}">`;
}
