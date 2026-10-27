import test from 'node:test';
import assert from 'node:assert/strict';
import { localizeThai, languageControl, languageAlternates } from './localize-site.mjs';
import { translateThai } from '../content/th/site.mjs';

test('Thai localization preserves IDs, filter keys, form fields and shared resource paths',()=>{
 const html='<html lang="en"><head><title>Articles — JPM Media Space</title></head><body><a href="../contact.html?service=Interactive%20Games">Services</a><img src="../assets/Punthai.png"><script src="../homepage.js"></script><button data-filter="Touchscreen">Touchscreen</button><input name="email" placeholder="Your name"><svg><text>Score</text></svg></body></html>';
 const thai=localizeThai(html,'case-studies/punthai-coffee.html');
 assert(thai.includes('lang="th"'));assert(thai.includes('บทความ — JPM Media Space'));assert(thai.includes('src="../../assets/Punthai.png"'));assert(thai.includes('src="../../homepage.js"'));assert(thai.includes('href="../contact.html?service=Interactive%20Games"'));assert(thai.includes('data-filter="Touchscreen">ทัชสกรีน'));assert(thai.includes('name="email" placeholder="ชื่อของคุณ"'));assert(thai.includes('<svg><text>Score</text></svg>'));
});
test('language controls link paired detail routes without changing project slugs',()=>{
 assert(languageControl('insights/designing-for-participation.html','en').includes('href="../th/insights/designing-for-participation.html"'));
 assert(languageControl('insights/designing-for-participation.html','th').includes('href="../../insights/designing-for-participation.html"'));
});
test('release language alternates are reciprocal and Thai canonical references itself',()=>{
 const previous=process.env.SITE_ORIGIN;
 try {
  process.env.SITE_ORIGIN='https://example.test/JPM-MEDIA-SPACE';
  assert(languageAlternates('about.html').includes('hreflang="th" href="https://example.test/JPM-MEDIA-SPACE/th/about.html"'));
  const html='<html lang="en"><head><title>About Us</title><link rel="canonical" href="https://example.test/JPM-MEDIA-SPACE/about.html"></head></html>';
  assert(localizeThai(html,'about.html').includes('rel="canonical" href="https://example.test/JPM-MEDIA-SPACE/th/about.html"'));
 } finally {if(previous===undefined)delete process.env.SITE_ORIGIN;else process.env.SITE_ORIGIN=previous;}
});
test('runtime state messages translate numbers without altering scores',()=>{
 assert.equal(translateThai('Caught! Score 12.'),'รับได้แล้ว! คะแนน 12');
 assert.equal(translateThai('Catch falling sparks. You have 30 seconds.'),'รับไอเทมที่ตกลงมา คุณมีเวลา 30 วินาที');
 assert.equal(translateThai('6 projects shown.'),'แสดง 6 รายการ');
});
test('Thai demo controls translate labels while preserving machine option values',()=>{
 const html='<select><option data-stable-value value="motion">Motion</option><option data-stable-value value="blue">Blue</option></select><datalist><option value="Interactive Games"></option></datalist>';
 const thai=localizeThai(html,'playground.html');
 assert(thai.includes('value="motion">เคลื่อนไหว'));
 assert(thai.includes('value="blue">ฟ้า'));
 assert(thai.includes('value="เกมอินเทอร์แอคทีฟ"'));
});
