import { demoCopy } from './demos.mjs';
// Thai editorial copy keyed to the shared English source. Brand/project names remain unchanged.
import { studio, services, coreValues, companyStats, industries, workflow, packages, projects, articles, articleTopics, faqs, eventGameFaqs, topicGuides } from '../en/site.mjs';
export const thaiCopy = new Map();
const add=(en,th)=>thaiCopy.set(en.replace(/\s+/g,' ').trim(),th);
const fields=(source,thai)=>Object.entries(thai).forEach(([key,value])=>add(source[key],value));
fields(studio,{
 heroIntroduction:'เกมและคอนเทนต์อินเทอร์แอคทีฟสำหรับทัชสกรีน จอ LED โปรเจกเตอร์ และเซนเซอร์ ออกแบบมาเพื่อบูธงานอีเวนต์โดยเฉพาะ เราทดสอบระบบก่อนวันงานทุกครั้ง และทีมที่ลงมือทำอยู่หน้างานจนจบอีเวนต์',
 introduction:'เราคือสตูดิโอครีเอทีฟเทคโนโลยีที่ดูแลงานของคุณตั้งแต่ไอเดียแรกจนถึงหลังส่งมอบ ทั้งคิดคอนเซปต์ คิดเนื้อหา พัฒนาโปรแกรม ติดตั้ง และดูแลระบบ ครบในทีมเดียว',
 overview:'เราทำงานในพื้นที่หลากหลาย ทั้งนิทรรศการ โชว์รูมองค์กร กิจกรรมแบรนด์ ศูนย์สร้างประสบการณ์แบรนด์ ล็อบบี้ต้อนรับ และนิทรรศการแบบถาวร',
 aboutBelief:'JPM Media Space เริ่มต้นจากความเชื่อว่าเทคโนโลยีไม่ควรเป็นแค่จอแสดงข้อมูล แต่ควรสร้าง “ประสบการณ์” ระหว่างผู้คนกับแบรนด์ เพราะการสื่อสารขององค์กรวันนี้ต้องทำให้คนอยากมีส่วนร่วมและจดจำได้ ไม่ใช่แค่รับข้อมูลทางเดียว',
 belief:'เราเชื่อว่าเทคโนโลยีไม่ได้มีไว้แค่โชว์ แต่เป็นเครื่องมือที่ทำให้คนได้สัมผัสแบรนด์ของคุณจริง ๆ เราจึงนำการออกแบบ ซอฟต์แวร์ และฮาร์ดแวร์มาทำงานร่วมกัน ให้ทุกคนอยากเข้ามามีส่วนร่วม และจดจำแบรนด์ได้นานกว่าเดิม'
});
const thaiServices=[
 {title:'เกมอินเทอร์แอคทีฟ',label:'ความสนุกสั้น ๆ แต่คนจดจำได้นาน',description:'เกมของแบรนด์ เกมตอบคำถามที่เล่นแข่งกันได้หลายคน และกิจกรรมสนุก ๆ ที่เปลี่ยนคนดูให้กลายเป็นผู้เล่น',detail:'เกมอินเทอร์แอคทีฟที่ออกแบบเฉพาะสำหรับงานแสดงสินค้า เทศกาล งานเปิดตัว และกิจกรรมของแบรนด์ เริ่มจากต้นแบบบนเบราว์เซอร์ให้เห็นภาพก่อน แล้วค่อยคุยกันเรื่องจอและวิธีเล่นที่เหมาะกับหน้างาน',examples:['เกมที่ทำให้คนมีส่วนร่วมกับแบรนด์','เกมตอบคำถามแข่งกันหลายคน','กิจกรรมในงานอีเวนต์']},
 {title:'แอปพลิเคชันทัชสกรีน',label:'เรื่องราวของคุณ แค่แตะก็เห็น',description:'แคตตาล็อกสินค้า สมุดเยี่ยมชมดิจิทัล ระบบนำทาง และคลังข้อมูลพิพิธภัณฑ์ ที่ผู้ชมแตะสำรวจได้ด้วยตัวเอง',detail:'แอปให้ลูกค้าเลือกและปรับแต่งสินค้า แกลเลอรีสำหรับทีมขาย โต๊ะทัชสกรีนที่ใช้ร่วมกันได้หลายคน และระบบจัดการเนื้อหาเฉพาะงาน สำหรับทั้งอีเวนต์และพื้นที่ถาวร',examples:['แคตตาล็อกสินค้าอินเทอร์แอคทีฟ','สมุดเยี่ยมชมดิจิทัล','ระบบนำทางและคลังข้อมูลพิพิธภัณฑ์']},
 {title:'ประสบการณ์อิมเมอร์ซีฟ',label:'ก้าวเข้าไปเป็นส่วนหนึ่งของเรื่องราว',description:'ใช้แสง ภาพเคลื่อนไหว และเนื้อหา เปลี่ยนห้องธรรมดาให้เป็นพื้นที่ที่ตอบรับทุกการเคลื่อนไหวของผู้คน',detail:'ประสบการณ์อิมเมอร์ซีฟสำหรับนิทรรศการ โชว์รูมองค์กร ศูนย์ประสบการณ์ ล็อบบี้ต้อนรับ และงานติดตั้งถาวร เราออกแบบงานภาพและเทคโนโลยีไปพร้อมกัน โดยคิดจากผู้ชมและพื้นที่เป็นหลัก',examples:['ห้องอิมเมอร์ซีฟ','ล็อบบี้ต้อนรับองค์กร','การเล่าเรื่องผ่านพื้นที่']},
 {title:'เทคโนโลยีเซนเซอร์',label:'พื้นที่ที่ตอบสนองเมื่อคุณมายืนอยู่',description:'เปลี่ยนการขยับตัว การแตะ หรือการหยิบสินค้า ให้เกิดเป็นภาพบนจอทันที ด้วย LiDAR กล้องวัดความลึก RFID และ NFC',detail:'LiDAR ช่วยติดตามตำแหน่งคนในพื้นที่ กล้องวัดความลึกจับท่าทางและการเคลื่อนไหว ส่วน RFID และ NFC ให้บัตร ป้ายชื่อ หรือวัตถุจริงเปิดเนื้อหาบนจอได้ทันที เราเลือกอุปกรณ์ตามวิธีเล่นและสภาพหน้างานจริง',examples:['ติดตามตำแหน่งด้วย LiDAR','ควบคุมด้วยท่าทางผ่านกล้องวัดความลึก','สั่งงานด้วย RFID และ NFC']},
 {title:'พัฒนาระบบอินเทอร์แอคทีฟเฉพาะงาน',label:'สร้างขึ้นจากไอเดียของคุณ',description:'ซอฟต์แวร์และระบบมัลติมีเดียที่พัฒนาขึ้นเพื่องานของคุณโดยเฉพาะ ตั้งแต่คิดคอนเซปต์จนติดตั้งเสร็จ',detail:'เราพัฒนาโปรแกรมเฉพาะงานให้ทำงานร่วมกับจอ เซนเซอร์ และฮาร์ดแวร์ ครบทุกขั้นตอนในทีมเดียว ตั้งแต่วางกลยุทธ์ วางระบบ พัฒนางานภาพ ทดสอบ ติดตั้ง ไปจนถึงดูแลต่อเนื่อง',examples:['ซอฟต์แวร์เฉพาะงาน','เชื่อมต่อระบบฮาร์ดแวร์','ระบบมัลติมีเดีย']},
 {title:'คอนเทนต์อินเทอร์แอคทีฟสำหรับ LED และโปรเจกชัน',label:'เมื่อแสงกลายเป็นภาษา',description:'คอนเทนต์และซอฟต์แวร์อินเทอร์แอคทีฟสำหรับจอ LED และโปรเจกเตอร์ ทั้งผนังที่ขยับตามผู้คน พื้นที่ตอบสนองทุกก้าวเดิน และโปรเจกชันแมปปิ้ง ใช้กับจอที่คุณมีได้',detail:'เราสร้างคอนเทนต์และซอฟต์แวร์อินเทอร์แอคทีฟที่ทำให้ผนัง LED พื้น LED และโปรเจกเตอร์มีชีวิต ทั้งกำแพงวาดภาพดิจิทัล แสงที่ผสานกับสถาปัตยกรรม งานภาพที่เปลี่ยนตามเซนเซอร์ และอุโมงค์โปรเจกชันแมปปิ้ง เราไม่ได้ให้เช่าหรือจำหน่ายจอและโปรเจกเตอร์ แต่งานของเราทำงานกับจอและโปรเจกเตอร์ที่คุณมีอยู่ได้',examples:['คอนเทนต์ผนัง LED อินเทอร์แอคทีฟ','คอนเทนต์พื้นตอบสนองทุกก้าวเดิน','โปรเจกชันแมปปิ้ง']}
];
services.forEach((service,i)=>{fields(service,Object.fromEntries(Object.entries(thaiServices[i]).filter(([key])=>key!=='examples')));service.examples.forEach((text,j)=>add(text,thaiServices[i].examples[j]));});
const values=[['ความคิดสร้างสรรค์','เรากล้าคิดนอกกรอบ ด้วยไอเดียที่แตกต่างและภาพที่น่าจดจำ'],['ประสบการณ์','ทุกโครงการออกแบบมาให้ผู้ชมอยากมีส่วนร่วม และได้แรงบันดาลใจกลับไป'],['เทคโนโลยี','ผสานการออกแบบกับเทคโนโลยีให้ทำงานไปด้วยกันอย่างลงตัว'],['พาร์ทเนอร์','อยู่กับลูกค้าตั้งแต่วันแรกจนจบงาน และช่วยกันแก้ทุกปัญหาไปด้วยกัน']];
coreValues.forEach((pair,i)=>pair.forEach((text,j)=>add(text,values[i][j])));
companyStats.forEach((pair,i)=>add(pair[1],['โครงการที่ส่งมอบ','ปีประสบการณ์','การดูแลและช่วยเหลือ'][i]));
const settings=[
 ['อีเวนต์และนิทรรศการ','บูธกิจกรรม งานเปิดตัวสินค้า งาน VIP และงานแสดงสินค้า','เกมของแบรนด์ ผนัง LED อินเทอร์แอคทีฟ สมุดเยี่ยมชมดิจิทัล และกิจกรรมสั้น ๆ ที่ผู้ร่วมงานเล่นได้ทันที'],
 ['โชว์รูม','แอปให้ลูกค้าเลือกและปรับแต่งสินค้า แกลเลอรีสำหรับทีมขาย และจอแสดงสินค้าในโชว์รูม','ให้ลูกค้าดูสเปกและเรื่องราวของสินค้าได้ ด้วยการแตะหรือใช้ท่าทาง'],
 ['พิพิธภัณฑ์','ผนังประวัติศาสตร์อินเทอร์แอคทีฟเพื่อการเรียนรู้ โต๊ะคลังข้อมูลดิจิทัล และสื่อโปรเจกชันเล่าประวัติศาสตร์','เชื่อมชิ้นงาน คลังข้อมูล และการจัดวางห้อง ให้เป็นเรื่องเล่าเดียวที่ผู้ชมสำรวจได้'],
 ['ศูนย์การค้า','โฆษณาในรูปแบบเกม ระบบนำทางอินเทอร์แอคทีฟ และพื้นโปรเจกชันที่ขยับตามผู้คน','สื่อตามเทศกาลที่ตอบสนองต่อผู้คน และกิจกรรมที่ชวนทุกคนในพื้นที่สาธารณะให้เข้ามาร่วมสนุก'],
 ['งานติดตั้งถาวร','ล็อบบี้องค์กรแบบอิมเมอร์ซีฟ ร้านแฟลกชิป และพื้นที่สาธารณะที่ใช้งานระยะยาว','สื่อดิจิทัลที่ผสานกับสถาปัตยกรรม ระบบจัดการเนื้อหา และเซนเซอร์ที่ทำงานร่วมกัน']
];
industries.forEach((item,i)=>['title','text','ideas'].forEach((key,j)=>add(item[key],settings[i][j])));
const steps=[
 ['วางกลยุทธ์และประสบการณ์','เริ่มจากทำความเข้าใจเป้าหมายธุรกิจของคุณ แล้วออกแบบคอนเซปต์ประสบการณ์ที่ตอบโจทย์และไปในทิศทางเดียวกับแบรนด์'],
 ['ออกแบบคอนเซปต์และวางระบบ','ออกแบบภาพ การเล่าเรื่อง และวิธีที่ผู้ชมจะเล่นหรือโต้ตอบ พร้อมเลือกฮาร์ดแวร์ให้เหมาะกับหน้างานจริง'],
 ['พัฒนาภาพและโปรแกรม','พัฒนาโปรแกรมอินเทอร์แอคทีฟและงานภาพเฉพาะงาน เพื่อเปลี่ยนไอเดียให้เกิดขึ้นจริงในพื้นที่ของคุณ'],
 ['ทดสอบ ปรับจูน และติดตั้ง','ติดตั้งหน้างาน ปรับเซนเซอร์และโปรเจกเตอร์ให้แม่นยำ แล้วทดสอบจนมั่นใจว่าใช้งานได้จริง'],
 ['ดูแลหลังการขาย','ช่วยเรื่องการติดตั้ง บำรุงรักษา รับเรื่องประกัน และดูแลระบบสำหรับงานติดตั้งถาวร']
];
workflow.forEach((pair,i)=>pair.forEach((text,j)=>add(text,steps[i][j])));
add(packages[0].title,'แพ็กเกจอีเวนต์');add(packages[1].title,'แพ็กเกจติดตั้งถาวร');
add(packages[0].description,'สำหรับกิจกรรมระยะสั้น งานแสดงสินค้า เทศกาล และงานเปิดตัวสินค้า');add(packages[1].description,'สำหรับพิพิธภัณฑ์ พื้นที่ต้อนรับองค์กร ร้านแฟลกชิป และพื้นที่สาธารณะระยะยาว');
const itemCopy=[
 ['ประสบการณ์ทัชสกรีน','สมุดเยี่ยมชมดิจิทัล แคตตาล็อกสินค้าอินเทอร์แอคทีฟ เกมตอบคำถามแข่งกันหลายคน และแอปของแบรนด์ ที่ผู้ร่วมงานเล่นได้ทันทีในเวลาสั้น ๆ'],
 ['คอนเทนต์อินเทอร์แอคทีฟสำหรับ LED และโปรเจกชัน','คอนเทนต์และซอฟต์แวร์สำหรับผนังโปรเจกชันที่ขยับตามผู้คน พื้น LED ที่ตอบสนองทุกก้าวเดิน กำแพงวาดภาพดิจิทัล และฉากหลังเวทีที่เปลี่ยนตามท่าทาง ราคานี้ไม่รวมจอและโปรเจกเตอร์ ใช้กับอุปกรณ์ที่คุณมีได้'],
 ['ประสบการณ์ทัชสกรีน','ตู้นำทางขนาดใหญ่ โต๊ะทัชสกรีนที่ใช้ร่วมกันได้ คลังข้อมูลพิพิธภัณฑ์แบบอินเทอร์แอคทีฟ และระบบจัดการเนื้อหา (CMS) เฉพาะงานที่อัปเดตเองได้ง่าย'],
 ['คอนเทนต์อินเทอร์แอคทีฟสำหรับ LED และโปรเจกชัน','คอนเทนต์และซอฟต์แวร์สำหรับแสงที่ผสานกับสถาปัตยกรรม อุโมงค์โปรเจกชันแมปปิ้งแบบอิมเมอร์ซีฟ ผนังงานศิลป์ที่เปลี่ยนตามเซนเซอร์ และเสาแบรนด์ดิจิทัลแบบอินเทอร์แอคทีฟ ราคานี้ไม่รวมจอและโปรเจกเตอร์ ใช้กับอุปกรณ์ที่คุณมีได้']
];
packages.flatMap(p=>p.items).forEach((item,i)=>{add(item.title,itemCopy[i][0]);add(item.text,itemCopy[i][1]);});
const stories={
 'punthai-coffee':[
 'ประสบการณ์บนจอขนาดใหญ่ที่พาโลกของแบรนด์พันธุ์ไทยเข้าสู่พื้นที่นิทรรศการ ผู้ชมได้ยืนอยู่หน้าภาพแอนิเมชัน และใช้การเคลื่อนไหวของตัวเองเป็นส่วนหนึ่งของการพบกับแบรนด์',
 'วิดีโอโครงการแสดงให้เห็นผู้ชมยืนหน้าจอและเอื้อมมือไปหาฉากแอนิเมชัน จอนี้จึงกลายเป็นจุดดึงดูดของบูธ และชวนให้คนรอบ ๆ อยากเข้ามาลองเล่น',
 'ภาพประกอบของแบรนด์ แอนิเมชัน และจอขนาดใหญ่ทำงานร่วมกันเป็นประสบการณ์เดียว เกิดเป็นการโต้ตอบผ่านภาพที่ผู้คนสนุกไปด้วยกันในพื้นที่จริง'
 ],
 dynasty:[
 'แอปพลิเคชันประวัติศาสตร์แบบอินเทอร์แอคทีฟที่พาผู้ชมไปดูภาพเก่าผ่านหน้าจอที่เลือกสำรวจได้ ผู้ชมไม่ต้องดูตามลำดับตายตัว แต่เลือกเรื่องที่อยากรู้ได้เอง',
 'ตัวอย่างแอปแบ่งหมวดด้วยภาพ ทั้งสถานที่ ประวัติศาสตร์ราชวงศ์ และบุคคล พร้อมเลือกภาษาไทยหรืออังกฤษได้ ผู้ชมจึงเริ่มจากเรื่องที่ตัวเองสนใจได้ทันที',
 'ปุ่มเลือกขนาดใหญ่ ภาพประวัติศาสตร์ และหน้าจอที่ใช้งานง่ายแบบเดียวกันทั้งหมด เปลี่ยนข้อมูลจำนวนมากให้เป็นประสบการณ์ดิจิทัลที่น่าสำรวจ เหมาะกับการเล่าเรื่องบนทัชสกรีนและงานนิทรรศการ'
 ]
};
projects.filter(p=>p.story).forEach(project=>Object.values(project.story).forEach((text,i)=>add(text,stories[project.slug][i])));
const articleCopy=[
 {title:'ออกแบบให้คนอยากมีส่วนร่วม ไม่ใช่แค่ดู',summary:'มุมมองของเราในการเชื่อมผู้คน แบรนด์ และพื้นที่จริงเข้าด้วยกัน',sections:[
 ['เริ่มจากคนที่อยู่ในพื้นที่','ที่ JPM Media Space เราเชื่อว่าเทคโนโลยีควรเป็นมากกว่าเครื่องมือแสดงข้อมูล ประสบการณ์อินเทอร์แอคทีฟที่ดีจะชวนให้ผู้ชมได้ลงมือทำอะไรสักอย่าง ไม่ว่าจะแตะหน้าจอ เดินผ่านพื้นที่ หรือสำรวจเรื่องราว คำถามแรกของเราจึงเป็น “อยากให้เขาได้สัมผัสประสบการณ์แบบไหน”'],
 ['เลือกวิธีโต้ตอบที่มีจุดประสงค์','แคตตาล็อกทัชสกรีนชวนให้ผู้ชมสำรวจข้อมูล เกมเปิดโอกาสให้ทุกคนได้ร่วมสนุก ส่วนจอที่ควบคุมด้วยท่าทางก็เชื่อมการเคลื่อนไหวเข้ากับภาพบนจอ แต่ละรูปแบบเหมาะกับไอเดียที่ต่างกัน และวิธีโต้ตอบที่ดีควรทำให้เรื่องราวเข้าถึงง่ายขึ้น'],
 ['ออกแบบประสบการณ์ให้ครบทั้งระบบ','งานภาพ ซอฟต์แวร์ จอ และเซนเซอร์ต้องทำงานไปด้วยกัน เราจึงเริ่มจากการวางกลยุทธ์และวางระบบ ก่อนจะพัฒนา ทดสอบ ติดตั้ง และดูแลต่อ โดยคิดถึงพื้นที่จริงตั้งแต่วันแรก']
 ]},
 {title:'อีเวนต์ครั้งเดียว หรือพื้นที่ประสบการณ์ระยะยาว?',summary:'ใช้แพ็กเกจอีเวนต์และงานติดตั้งถาวรเป็นจุดเริ่มต้น เพื่อคุยและวางแผนโครงการให้ชัดขึ้น',sections:[
 ['เริ่มจากพื้นที่ที่จะใช้งาน','แพ็กเกจอีเวนต์เหมาะกับกิจกรรมระยะสั้น งานแสดงสินค้า เทศกาล และงานเปิดตัว ส่วนแพ็กเกจติดตั้งถาวรเหมาะกับพิพิธภัณฑ์ ล็อบบี้องค์กร ร้านแฟลกชิป และพื้นที่สาธารณะระยะยาว ลองเริ่มจากเล่าว่างานนี้จะอยู่ที่ไหน และใครจะเป็นคนใช้'],
 ['คิดถึงสิ่งที่ผู้ชมอยากสำรวจ','งานอีเวนต์อาจเหมาะกับเกมสั้น ๆ หรือสมุดเยี่ยมชมดิจิทัล ส่วนพื้นที่ถาวรอาจต้องมีระบบนำทาง คลังข้อมูล หรือระบบจัดการเนื้อหาเฉพาะงาน ทั้งแอปทัชสกรีน LED อินเทอร์แอคทีฟ และโปรเจกชัน ปรับให้เข้ากับเนื้อหาและพื้นที่ได้ทั้งหมด'],
 ['เตรียมข้อมูลก่อนคุยกับทีม','เล่าให้เราฟังเรื่องกลุ่มผู้ชม สถานที่ ระยะเวลา จอที่ต้องการ และเนื้อหาที่มีอยู่ แล้วเราจะคุยกันต่อเรื่องเซนเซอร์ ขอบเขตการพัฒนา การติดตั้ง และการดูแล ราคาเริ่มต้นช่วยให้เห็นภาพคร่าว ๆ ส่วนใบเสนอราคาจริงจะคิดตามเนื้อหา ฮาร์ดแวร์ และขอบเขตการติดตั้งที่ตกลงกัน']
 ]},
 {title:'ไอเดียเกมออกบูธสำหรับแบรนด์ เลือกอย่างไรให้คนเข้าใจและอยากเล่น',metaTitle:'ไอเดียเกมออกบูธสำหรับแบรนด์ เลือกอย่างไรให้คนอยากเล่น',description:'ไอเดียเกมบูธ 5 แบบที่เอาสินค้าเป็นส่วนหนึ่งของการเล่น เกมตอบคำถาม จับคู่ภาพ รับไอเทม แตะเป้าหมาย และวงล้อสุ่ม พร้อมเดโมให้ลองเล่น',summary:'ไอเดียเกมบูธที่ดีที่สุดไม่ใช่ไอเดียที่แปลกที่สุด แต่เป็นไอเดียที่ทำให้สินค้าของคุณเป็นส่วนหนึ่งของการเล่น คนเข้าใจได้ทันทีที่เห็น และเล่นจบแล้วจำแบรนด์ได้ ด้านล่างคือ 5 แนวที่เราใช้บ่อย ทุกแนวลองเล่นได้จริงในพื้นที่ทดลอง',cover:{alt:'เดโม Tap the Right Item ไอเทมเด้งขึ้นจากหลุมเรืองแสงบนเวทีสีเข้ม',caption:'Tap the Right Item หนึ่งในเดโมจากพื้นที่ทดลองของเรา'},sections:[
 ['เริ่มจากประโยคที่อยากให้คนจำ',['ก่อนเลือกเกม ลองเขียนสิ่งที่อยากให้คนจำให้เหลือประโยคเดียว เช่น "กาแฟแต่ละรส บ่งบอกบุคลิก" แล้วถามต่อว่าผู้เล่นจะได้เลือก สังเกต หรือแก้โจทย์อะไรเกี่ยวกับประโยคนี้','ทดสอบง่าย ๆ: ถ้าเอาโลโก้ออกแล้วเกมยังเหมือนเดิมทุกอย่าง แปลว่าแบรนด์ยังเป็นแค่ของตกแต่ง เกมที่ดีจะให้สินค้าเป็นไอเทม เป็นคำตอบ หรือเป็นรางวัล']],
 ['1. เกมตอบคำถาม: เมื่อมีเรื่องอยากเล่า',['ตั้งคำถามจากสถานการณ์ที่ลูกค้าเจอจริง แล้วใช้คำเฉลยสั้น ๆ เล่าจุดเด่นสินค้า คนจะจำคำตอบที่เขาเกือบตอบผิดได้ดีกว่าป้ายโฆษณา Quick Quiz บนเว็บมี 3 ตัวเลือกต่อข้อ จับเวลา 10–20 วินาที และตารางคะแนนที่ทำให้คนอยากเล่นอีกรอบ','เคล็ดลับ: ให้ทีมแบรนด์ตรวจคำถามและคำเฉลยทุกข้อก่อนส่งให้เรา จะได้ไม่ต้องแก้ในนาทีสุดท้าย']],
 ['2. เกมจับคู่ภาพ: เมื่ออยากให้จำหน้าตาสินค้า','Memory Match ให้ผู้เล่นเปิดการ์ดหาคู่ เขาจะได้เห็นสินค้าซ้ำหลายรอบโดยไม่รู้ตัว เหมาะกับแบรนด์ที่มีหลายรุ่นหรือหลายรส เลือกภาพที่แยกกันชัดด้วยสีและรูปทรง ถ้าต่างกันแค่ตัวหนังสือเล็ก ๆ เกมจะยากเพราะอ่านไม่ออก ไม่ใช่เพราะจำไม่ได้'],
 ['3. เกมรับไอเทม: เมื่ออยากให้บูธคึกคัก','Catch ให้ผู้เล่นรับของที่ตกลงมาและหลบระเบิด เข้าใจได้ในวินาทีเดียว และคนที่ยืนดูก็ลุ้นไปด้วย ให้สินค้าเป็นของที่ต้องรับ และให้ "ปัญหา" ที่สินค้าแก้ได้เป็นของที่ต้องหลบ เกมก็เล่าเรื่องแบรนด์ไปด้วยในตัว'],
 ['4. เกมแตะเป้าหมาย: เมื่ออยากให้คนเลือกสิ่งที่ถูก',['Tap the Right Item ให้ไอเทมเด้งขึ้นมาสลับกับตัวหลอก ผู้เล่นต้องแตะให้ถูกอัน เหมาะกับการสอนให้คนแยกสินค้าของคุณออกจากสิ่งอื่น เดโมมี 3 ระดับความเร็ว และอัปโหลดภาพสินค้าของคุณเข้าไปลองได้เลย','ความเร็วที่ทีมพัฒนาว่าสนุก อาจเร็วเกินไปสำหรับคนที่เพิ่งเดินเข้าบูธ เราจึงปรับความเร็วและขนาดเป้าหมายจากการทดสอบ prototype ก่อนวันงาน']],
 ['5. วงล้อสุ่ม: เมื่อมีของรางวัลและอยากได้รายชื่อ','Lucky Wheel เล่นง่ายที่สุดในกลุ่ม ผู้เล่นกดหมุนแล้วลุ้นรางวัล ตั้งโอกาสได้รางวัลแต่ละชิ้นได้ และใส่การลงทะเบียนก่อนหมุนพร้อมความยินยอม PDPA ได้ เหมาะกับงานที่เป้าหมายหลักคือเก็บ lead'],
 ['คัดให้เหลือแนวเดียว','เอาแนวที่ชอบมาเทียบ 4 เรื่อง: สิ่งที่อยากให้คนจำ สิ่งที่ผู้เล่นต้องทำ เวลาต่อรอบ และจอที่มี แนวไหนต้องอธิบายเยอะแต่ไม่ช่วยให้จำแบรนด์ได้ ตัดออกก่อน ยังเลือกไม่ได้ ส่งธีมแบรนด์มา เราช่วยคัดและทำ prototype ให้ลองก่อนตัดสินใจ']
 ],faqs:[
 ['ต้องทำเกมใหม่ทั้งหมดไหม?','ไม่จำเป็น ถ้ากติกาเดิมตอบเป้าหมายอยู่แล้ว เราออกแบบภาพและเนื้อหาใหม่ให้เข้ากับแบรนด์ได้ ถ้าอยากได้วิธีเล่นใหม่ เราก็พัฒนาให้ได้'],
 ['ใส่สินค้าในเกมอย่างไรให้มีความหมาย?','ให้สินค้าเป็นส่วนหนึ่งของกติกา เช่น เป็นของที่ต้องรับ คำตอบที่ถูก หรือรางวัล ไม่ใช่แค่ภาพพื้นหลัง'],
 ['ลองเกมก่อนจ้างได้ไหม?','ได้ เล่นเดโมในพื้นที่ทดลองได้เลย และทุกงานเราทำ prototype ให้ลองก่อนตัดสินใจ']
 ],actions:['ส่งธีมแบรนด์ให้เราช่วยคัดเกม','ลองเดโม']}
];
// Article topics (2026-10-27): hub names, intros and page titles. Dates read in Thai with the Buddhist year.
const topicCopy={
 'event-booth-games':['เกมบูธอีเวนต์','เกมที่ทำให้คนต่อคิวในงานแสดงสินค้า งานเปิดตัว และกิจกรรมของแบรนด์ เล่าให้ฟังว่าเกมทำงานอย่างไร งบประมาณเริ่มที่เท่าไร และวางแผนอย่างไรให้วันงานราบรื่น'],
 'touchscreens-kiosks':['ทัชสกรีนและคีออสก์','แอปทัชสกรีน แคตตาล็อกดิจิทัล และคีออสก์ สำหรับบูธ โชว์รูม พิพิธภัณฑ์ และล็อบบี้ ที่ผู้ชมแตะสำรวจได้ด้วยตัวเอง'],
 'led-projection-immersive':['LED โปรเจกชัน และห้องอิมเมอร์ซีฟ','คอนเทนต์อินเทอร์แอคทีฟสำหรับจอ LED โปรเจกชัน พื้น และห้องอิมเมอร์ซีฟ ใช้กับจอและโปรเจกเตอร์ที่คุณมีอยู่แล้วได้'],
 'sensors-technology':['เซนเซอร์และเทคโนโลยี','LiDAR กล้องวัดความลึก RFID และ NFC เซนเซอร์แบบไหนเหมาะกับพื้นที่แบบไหน และการเคลื่อนไหวหรือสิ่งของกลายเป็นคอนเทนต์ได้อย่างไร'],
 'planning-leads':['วางแผนงานและเก็บ lead','วางแผนงานอินเทอร์แอคทีฟตั้งแต่บรีฟจนถึงวันงาน ทั้งแพ็กเกจ สิ่งที่ควรเตรียม และวิธีเก็บ lead กับสรุปข้อมูลผู้เล่น']
};
articleTopics.forEach(topic=>{const [name,intro]=topicCopy[topic.slug];add(topic.name,name);add(topic.intro,intro);add(topic.name+': Articles and Guides','บทความและคู่มือเรื่อง'+name);});
export const articleDate=(iso,lang='en')=>new Date(iso+'T00:00:00Z').toLocaleDateString(lang==='th'?'th-TH':'en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
articles.forEach(article=>[article.published,article.updated].filter(Boolean).forEach(iso=>add(articleDate(iso),articleDate(iso,'th'))));
Object.entries({'Articles worth reading':'บทความที่น่าสนใจ','ARTICLE TOPIC':'หัวข้อบทความ','Article topics':'หัวข้อบทความ','Browse by topic':'เลือกอ่านตามหัวข้อ','Articles on this topic are coming soon.':'บทความในหัวข้อนี้กำลังจะมาเร็ว ๆ นี้','In the meantime, see how we work on this.':'ระหว่างนี้ ลองดูบริการและผลงานที่เกี่ยวข้องของเราได้เลย','RELATED SERVICES & WORK':'บริการและผลงานที่เกี่ยวข้อง','See it in practice':'ดูจากงานจริง','Published':'เผยแพร่','Updated':'อัปเดต','MORE ON THIS TOPIC':'อ่านต่อในหัวข้อนี้','View topic':'ดูหัวข้อนี้','Coming soon':'เร็ว ๆ นี้'}).forEach(([en,th])=>add(en,th));
// Image alt text and captions: articleCopy[i].cover and the third item of a section ({ alt, caption }).
const addMedia=(media,th)=>{if(!media||!th)return;if(media.alt&&th.alt)add(media.alt,th.alt);if(media.caption&&th.caption)add(media.caption,th.caption);};
articles.forEach((article,i)=>{add(article.title,articleCopy[i].title);add(article.summary,articleCopy[i].summary);addMedia(article.cover,articleCopy[i].cover);article.sections.forEach((pair,j)=>pair.forEach((item,k)=>{const th=articleCopy[i].sections[j]?.[k];if(typeof item==='string')add(item,th);else if(Array.isArray(item))item.forEach((p,m)=>add(p,th[m]));else addMedia(item,th);}));const copy=articleCopy[i];if(article.metaTitle)add(article.metaTitle,copy.metaTitle);if(article.description)add(article.description,copy.description);(article.faqs||[]).forEach(([q,a],m)=>{add(q,copy.faqs[m][0]);add(a,copy.faqs[m][1]);});(article.actions||[]).forEach(([label],m)=>add(label,copy.actions[m]));});

export const uiCopy = {
 'Skip to content':'ข้ามไปยังเนื้อหา','Explore':'สำรวจ','Our Work':'ผลงานของเรา','Playground':'พื้นที่ทดลอง','Articles':'บทความ','Partner With Us':'ร่วมงานกับเรา','Let’s talk':'คุยกับเรา','Menu':'เมนู',
 'About Us':'เกี่ยวกับเรา','Services':'บริการ','Packages':'แพ็กเกจ','Request Quote':'ขอใบเสนอราคา','EXPLORE':'สำรวจ','DISCOVER':'ค้นพบ','SAY HELLO':'ติดต่อเรา','Back to top ↑':'กลับด้านบน ↑',' — current section':' — หมวดปัจจุบัน',
 'DESIGN TO ENGAGE':'ออกแบบให้คนอยากมีส่วนร่วม','CREATE NEW EXPERIENCES':'สร้างประสบการณ์ที่น่าจดจำ','Explore Our Work':'ดูผลงานของเรา','Try Interactive Demos':'ลองเล่นเดโม','Explore what we create':'สิ่งที่เราสร้างสรรค์ให้คุณได้','All services':'บริการทั้งหมด','Interactive':'อินเทอร์แอคทีฟ','Immersive':'อิมเมอร์ซีฟ','Technology':'เทคโนโลยี','Explore service':'ดูรายละเอียดบริการ','Explore event & permanent packages':'ดูแพ็กเกจอีเวนต์และงานติดตั้งถาวร',
 '02 / MEET JPM MEDIA SPACE':'02 / รู้จัก JPM MEDIA SPACE','We don’t just':'เราไม่ได้แค่','fill a space.':'เติมพื้นที่ให้เต็ม','We bring it to life.':'แต่ทำให้พื้นที่มีชีวิต','More about the studio':'รู้จักสตูดิโอของเรา','04 / SELECTED WORK':'04 / ผลงานที่คัดสรร','Real spaces.':'จากความคิด สู่พื้นที่จริง','Extraordinary possibilities.':'','Explore our work':'ดูผลงานของเรา','05 / THE PLAYGROUND':'05 / พื้นที่ทดลอง','Less watching.':'ดูอย่างเดียวไม่พอ','More playing.':'ต้องได้ลองเล่น',
 'Explore the possibilities with browser-based experiments. No installation. No special hardware. Just a little curiosity.':'ลองเล่นเดโมบนเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้งโปรแกรม ไม่ต้องใช้อุปกรณ์พิเศษ แค่มีความอยากรู้ก็พอ','Play the Catch Game':'เล่นเกมรับไอเทม','EXPERIMENT 001':'การทดลอง 001','PLAY NOW':'เล่นเลย','06 / OUR PROCESS':'06 / กระบวนการทำงาน','From “what if”':'สร้างสรรค์ “ทุกไอเดีย”','to real-world experience.':'ให้เกิดขึ้นได้ในพื้นที่จริง','How we work':'วิธีทำงานของเรา','07 / BETTER TOGETHER':'07 / เติบโตไปด้วยกัน','Your vision.':'เป้าหมายของคุณ','Our shared ambition.':'คือเป้าหมายของเราด้วย',
 'We are ready to be your partner in helping your brand and organization step confidently into the era of digital experiences.':'เราพร้อมเป็นพาร์ทเนอร์ที่ช่วยให้แบรนด์และองค์กรของคุณก้าวสู่ยุคประสบการณ์ดิจิทัลอย่างมั่นใจ',
 'WHO WE ARE':'รู้จักเรา','Creative Technology Company':'บริษัทด้านครีเอทีฟเทคโนโลยี','Specializing in Interactive and':'ผู้เชี่ยวชาญด้านอินเทอร์แอคทีฟและ','Immersive Experience':'ประสบการณ์อิมเมอร์ซีฟ','Our Core Values':'คุณค่าที่เราเชื่อ','OUR EXPERTISE':'ความเชี่ยวชาญของเรา','Touch. Motion. Light.':'สัมผัส การเคลื่อนไหว และแสง','Explore the technology':'สำรวจเทคโนโลยีของเรา','OUR FIVE-STEP WORKFLOW':'5 ขั้นตอนการทำงานของเรา','Every detail.':'ทุกรายละเอียด','Connected from the start.':'คิดเชื่อมกันตั้งแต่วันแรก',
 'OUR SERVICES':'บริการของเรา','Creative thinking.':'ความคิดสร้างสรรค์','Technical possibility.':'ที่เป็นจริงได้ด้วยเทคโนโลยี','One studio. Six connected disciplines. Built around your audience, your story, and your space.':'หนึ่งสตูดิโอ หกความเชี่ยวชาญที่เชื่อมกัน เพื่อผู้ชม เรื่องราว และพื้นที่ของคุณ','Discuss your idea':'คุยเรื่องไอเดียของคุณ','POSSIBILITIES FOR YOUR SPACE':'ความเป็นไปได้สำหรับพื้นที่ของคุณ','Where experiences happen.':'ทุกพื้นที่สร้างประสบการณ์ได้',
 'From a one-day event to a permanent installation, we shape each experience around your audience, goals, and space.':'ตั้งแต่อีเวนต์วันเดียวไปจนถึงงานติดตั้งถาวร เราออกแบบแต่ละประสบการณ์ให้เข้ากับผู้ชม เป้าหมาย และพื้นที่ของคุณ','These are just starting points. Have a different space, audience, or idea? Let’s explore what we can create together.':'นี่เป็นแค่ตัวอย่างเริ่มต้น ถ้าพื้นที่ ผู้ชม หรือไอเดียของคุณต่างออกไป มาคุยกันว่าเราจะสร้างอะไรด้วยกันได้บ้าง','CHOOSE YOUR FRAMEWORK':'เลือกรูปแบบโครงการ','An activation. A destination.':'งานอีเวนต์ หรือพื้นที่ถาวร','Explore Events and Permanent packages as a starting point for your project. We’ll tailor the scope to your space and goals.':'เริ่มจากแพ็กเกจอีเวนต์หรืองานติดตั้งถาวร แล้วเราจะปรับขอบเขตให้พอดีกับพื้นที่และเป้าหมายของคุณ','Explore packages':'ดูแพ็กเกจ',
 'EXPERIENCE SETTINGS':'ตัวอย่างพื้นที่สร้างประสบการณ์','A different experience.':'ประสบการณ์ที่แตกต่าง','For every space.':'ในแบบที่เหมาะกับทุกพื้นที่','These settings are just starting points. We design around your space, audience, and idea, including possibilities beyond the examples below.':'ตัวอย่างเหล่านี้เป็นแค่จุดเริ่มต้น เราออกแบบตามพื้นที่ ผู้ชม และไอเดียของคุณ รวมถึงไอเดียใหม่ ๆ ที่อยู่นอกเหนือจากตัวอย่างด้านล่าง','Explore your space with us':'คุยเรื่องพื้นที่ของคุณกับเรา',
 'PACKAGES & CUSTOM SOLUTIONS':'แพ็กเกจและโซลูชันเฉพาะงาน','The right framework.':'เริ่มจากแนวทางที่ใช่','Room for your ambition.':'ต่อยอดได้ตามเป้าหมายของคุณ','Choose the framework that fits your activation timeline and architectural scope.':'เลือกแพ็กเกจที่เหมาะกับระยะเวลาของงานและขอบเขตพื้นที่ของคุณ','Starting prices are a guide. Your final quotation is tailored to the agreed content, hardware, installation, and support requirements.':'ราคาเริ่มต้นช่วยให้เห็นภาพงบประมาณคร่าว ๆ ส่วนใบเสนอราคาจริงจะคิดตามเนื้อหา ฮาร์ดแวร์ การติดตั้ง และการดูแลที่ตกลงกัน','FLEXIBLE PROJECT PACKAGES':'แพ็กเกจที่ปรับได้ตามโครงการ','Start':'เริ่มต้น','Request a quote':'ขอใบเสนอราคา','CUSTOM SOLUTIONS':'โซลูชันเฉพาะงาน','An idea outside the package?':'มีไอเดียที่ไม่อยู่ในแพ็กเกจ?',
 'Custom programs, hardware integration, content management, and installation are scoped around your project. Share your brief for a tailored proposal.':'โปรแกรม การเชื่อมต่อฮาร์ดแวร์ ระบบจัดการเนื้อหา และการติดตั้ง ล้วนกำหนดได้ตามโครงการของคุณ ส่งบรีฟมาให้เรา แล้วรับข้อเสนอที่ออกแบบมาเพื่องานนี้โดยเฉพาะ','Let’s shape it together':'มาคิดไปด้วยกัน','ADD-ON TECHNOLOGIES':'เทคโนโลยีเสริม','Make the space respond.':'ให้พื้นที่โต้ตอบกับผู้คน','LiDAR Scanning':'การสแกนด้วย LiDAR','Spatial tracking for responsive walls and floor projections.':'ติดตามตำแหน่งคนในพื้นที่ สำหรับผนังและพื้นโปรเจกชันที่ตอบสนองได้ทันที','Depth Cameras':'กล้องวัดความลึก','Skeleton and gesture mapping to control graphics or trigger actions.':'จับโครงร่างร่างกายและท่าทาง เพื่อควบคุมภาพหรือสั่งให้ระบบทำงาน','Cards, badges, and physical tokens that trigger personalized display content.':'ใช้บัตร ป้ายชื่อ หรือวัตถุจริง เพื่อเปิดเนื้อหาเฉพาะบุคคลบนจอ','Explore sensors':'ดูเทคโนโลยีเซนเซอร์',
 'OUR WORK':'ผลงานของเรา','Experiences made real.':'จากไอเดียบนกระดาษ','Possibilities made visible.':'สู่ประสบการณ์ที่จับต้องได้','Project references and videos from our existing portfolio. Explore each experience in its original context.':'ชมภาพและวิดีโอจากผลงานจริงของเรา เพื่อเห็นว่าแต่ละประสบการณ์ทำงานอย่างไรในพื้นที่จริง','All work':'ผลงานทั้งหมด','Touchscreen':'ทัชสกรีน','Interactive & immersive':'อินเทอร์แอคทีฟและอิมเมอร์ซีฟ','PORTFOLIO WITH EMPLOYER · IMMERSIVE':'ผลงานร่วมกับนายจ้างเดิม · อิมเมอร์ซีฟ','PORTFOLIO WITH EMPLOYER · TOUCHSCREEN':'ผลงานร่วมกับนายจ้างเดิม · ทัชสกรีน','IMMERSIVE':'อิมเมอร์ซีฟ','TOUCHSCREEN':'ทัชสกรีน','Portfolio with Employer — retained attribution from the original website.':'ผลงานที่ทำร่วมกับนายจ้างเดิม โดยคงเครดิตตามเว็บไซต์เดิม','From the JPM Media Space project portfolio.':'จากแฟ้มผลงานของ JPM Media Space','THE EXPERIENCE':'ประสบการณ์','PROJECT CONTEXT':'บริบทของโครงการ','From a visual story':'จากเรื่องเล่าผ่านภาพ','to participation.':'สู่การได้ลงมือเล่น','The interaction':'การโต้ตอบกับผู้ชม','The approach':'แนวทางการออกแบบ','Experience at a glance.':'ภาพรวมประสบการณ์','Designed to be explored.':'ออกแบบให้น่าค้นหา','Made for interaction.':'สร้างมาให้เล่นได้จริง',
 'Watch the project video above to see the visual experience in context. Contact us to explore a similar direction for your own space and audience.':'ชมวิดีโอด้านบนเพื่อเห็นประสบการณ์ในพื้นที่จริง แล้วคุยกับเราได้ หากอยากต่อยอดแนวทางแบบนี้ให้เข้ากับพื้นที่และผู้ชมของคุณ','This project appears in the original Touch Screen Program portfolio. Watch the supplied video to explore the application and interaction.':'โครงการนี้อยู่ในแฟ้มผลงานโปรแกรมทัชสกรีนเดิม ชมวิดีโอเพื่อดูหน้าจอและวิธีใช้งาน','This project appears in the original Interactive & Immersive Experiences portfolio. Watch the supplied video to see the experience in context.':'โครงการนี้อยู่ในแฟ้มผลงานอินเทอร์แอคทีฟและอิมเมอร์ซีฟเดิม ชมวิดีโอเพื่อเห็นประสบการณ์ในพื้นที่จริง','Discipline':'ประเภทงาน','Touchscreen application':'แอปพลิเคชันทัชสกรีน','Interactive & immersive experience':'ประสบการณ์อินเทอร์แอคทีฟและอิมเมอร์ซีฟ','Technology reference':'เทคโนโลยีอ้างอิง','Touchscreen program, as classified in the source portfolio.':'โปรแกรมทัชสกรีนตามประเภทในแฟ้มผลงานเดิม','Interactive installation. Specific hardware is subject to project confirmation.':'งานติดตั้งอินเทอร์แอคทีฟ รายละเอียดฮาร์ดแวร์ขึ้นอยู่กับแต่ละโครงการ','Credit':'เครดิต','Portfolio with Employer. Original employer attribution retained; not represented as a direct JPM Media Space client engagement.':'ผลงานที่ทำร่วมกับนายจ้างเดิม คงเครดิตตามต้นฉบับ และไม่ระบุว่าเป็นงานที่ลูกค้าว่าจ้าง JPM Media Space โดยตรง','Listed in the JPM Media Space project portfolio.':'ระบุอยู่ในแฟ้มผลงานของ JPM Media Space','Back to all work':'กลับไปดูผลงานทั้งหมด','Download the project video':'ดาวน์โหลดวิดีโอโครงการ','Your browser does not support this video.':'เบราว์เซอร์ของคุณไม่รองรับวิดีโอนี้',
 'THE JPM MEDIA SPACE INTERACTIVE PLAYGROUND':'พื้นที่ทดลองอินเทอร์แอคทีฟของ JPM Media Space','WHICH IDEA FITS YOU?':'ไอเดียไหนที่ใช่สำหรับคุณ','PLAY IT NOW.':'ลองเล่นเลย','Explore playable creative technology experiments, right in your browser. No downloads or special hardware. Just a little curiosity.':'ลองเล่นเดโมครีเอทีฟเทคโนโลยีได้ทันทีบนเบราว์เซอร์ ไม่ต้องดาวน์โหลด ไม่ต้องใช้อุปกรณ์พิเศษ แค่มีความอยากรู้ก็พอ','Explore Demos':'สำรวจเดโม','Build Your Experience':'สร้างประสบการณ์ของคุณ','Explore the Playground':'สำรวจพื้นที่ทดลอง','All demos':'เดโมทั้งหมด','Games':'เกม','Play now':'เล่นเลย','Try demo':'ลองเดโม','Catch falling sparks, beat the clock, and make every interaction count.':'รับไอเทมที่ตกลงมาให้ทันเวลา แล้วเปลี่ยนทุกการเคลื่อนไหวให้เป็นคะแนน','A little suspense. Scratch the surface and discover the message underneath.':'สร้างความอยากรู้ด้วยการขูดเปิดข้อความที่ซ่อนอยู่','Explore the layers of an installation concept, one perspective at a time.':'สำรวจแต่ละมุมของแนวคิดงานติดตั้งผ่านชั้นข้อมูลที่เลือกดูได้','Catch the':'รับไอเทม','possibilities.':'ค้นพบความเป็นไปได้',
 'A timed catching game for a little friendly competition. Imagine branded objects, a campaign theme, or a product launch challenge.':'เกมรับไอเทมแบบจับเวลาสำหรับการแข่งขันสนุก ๆ ลองนึกถึงไอเทมของแบรนด์ ธีมแคมเปญ หรือกิจกรรมเปิดตัวสินค้า','Mouse / touch: move across the play field.':'เมาส์หรือสัมผัส: เลื่อนตัวรับไปในพื้นที่เล่น','Keyboard: focus the field and use ← / → or A / D.':'คีย์บอร์ด: เลือกพื้นที่เล่น แล้วใช้ ← / → หรือ A / D','Mobile: drag or use the on-screen arrow buttons.':'มือถือ: ลากหรือใช้ปุ่มลูกศรบนหน้าจอ','Branding and game settings are configurable. This prototype runs entirely in your browser.':'ปรับแบรนด์และตั้งค่าเกมได้ ต้นแบบนี้ทำงานบนเบราว์เซอร์ของคุณทั้งหมด','Request a game quote':'ขอใบเสนอราคาเกม','Score':'คะแนน','Time':'เวลา','READY WHEN YOU ARE':'พร้อมเมื่อคุณพร้อม','Make every':'รับทุกไอเทม','catch count.':'ให้เป็นคะแนน','Catch falling sparks. You have 30 seconds.':'รับไอเทมที่ตกลงมา คุณมีเวลา 30 วินาที','Start game':'เริ่มเกม','Pause':'พักเกม','Restart':'เริ่มใหม่','Drag to move · ← → or A / D to catch · Space to start':'ลากเพื่อเคลื่อนที่ · ใช้ ← → หรือ A / D · กด Space เพื่อเริ่ม','Game ready.':'เกมพร้อมแล้ว','A little suspense.':'เริ่มจากความอยากรู้','A bigger reveal.':'สู่สิ่งที่รอให้ค้นพบ',
 'Scratch away the surface to reveal a message. A simple starting point for event surprises, product reveals, and branded campaigns.':'ขูดพื้นผิวเพื่อเปิดข้อความ เป็นจุดเริ่มต้นสำหรับกิจกรรมเซอร์ไพรส์ การเปิดตัวสินค้า และแคมเปญของแบรนด์','Use a mouse or touch. The Reveal button provides the same experience with a keyboard. This is a demonstration with no prize or reward attached.':'ใช้เมาส์หรือการสัมผัส หรือกดปุ่มเปิดข้อความด้วยคีย์บอร์ด เดโมนี้เป็นตัวอย่างและไม่มีของรางวัล','Explore a reveal experience':'คุยเรื่องประสบการณ์ขูดเปิดภาพ','YOU FOUND A POSSIBILITY':'คุณพบความเป็นไปได้ใหม่','Your next idea':'ไอเดียต่อไปของคุณ','starts here.':'เริ่มต้นที่นี่','Reveal message':'เปิดข้อความ','Reset':'รีเซ็ต','Scratch the surface or reveal the message.':'ขูดพื้นผิวหรือกดเปิดข้อความ','One display.':'หนึ่งหน้าจอ','Many perspectives.':'หลายมุมมอง','Tap through an illustrative installation concept. A browser prototype for product stories, touchscreen catalogs, and showroom displays.':'เลือกสำรวจแนวคิดงานติดตั้งผ่านต้นแบบบนเบราว์เซอร์ สำหรับเรื่องราวสินค้า แคตตาล็อกทัชสกรีน และจอในโชว์รูม','Illustrative concept, not a specification or a quoted hardware product.':'ตัวอย่างแนวคิด ไม่ใช่ข้อมูลจำเพาะหรือใบเสนอราคาฮาร์ดแวร์','Build your product story':'สร้างเรื่องราวให้สินค้าของคุณ','Display':'การแสดงผล','Interaction':'ปฏิสัมพันธ์','Content':'เนื้อหา','A canvas for your story':'พื้นที่สำหรับเรื่องราวของคุณ','LED and projection create a visual environment around your audience. Select a layer to explore the concept.':'LED และโปรเจกชันสร้างสภาพแวดล้อมทางภาพรอบผู้ชม เลือกแต่ละชั้นข้อมูลเพื่อสำรวจแนวคิด',
 'ARTICLES':'บทความ','Ideas worth':'ไอเดียที่','exploring.':'น่าคิดต่อ','Studio perspectives on interaction, experience, and the spaces in between.':'มุมมองจากสตูดิโอเรื่องการออกแบบการโต้ตอบ ประสบการณ์ และพื้นที่ที่เชื่อมผู้คนเข้าด้วยกัน','All Articles':'บทความทั้งหมด','Inspiration':'แรงบันดาลใจ','Behind the Experience':'เบื้องหลังประสบการณ์','Practical Guides':'คู่มือวางแผนงาน','INSPIRATION':'แรงบันดาลใจ','BEHIND THE EXPERIENCE':'เบื้องหลังประสบการณ์','PRACTICAL GUIDES':'คู่มือวางแผนงาน','Articles in this category are coming soon.':'บทความในหมวดนี้จะมาเร็ว ๆ นี้','Read guide':'อ่านบทความ','3 min read':'อ่าน 3 นาที','JPM Media Space · 3 min read':'JPM Media Space · อ่าน 3 นาที','Back':'ย้อนกลับ','Explore':'สำรวจ','our services':'บริการของเรา',', review':'ดูเพิ่มเติมที่','the packages':'แพ็กเกจ',', or':'หรือ','discuss your project':'คุยเรื่องโครงการของคุณ','with the studio.':'กับทีมสตูดิโอ','KEEP EXPLORING':'สำรวจต่อ','Related perspectives':'บทความที่เกี่ยวข้อง',
 'PARTNER WITH US':'ร่วมงานกับเรา','Bring the brief, the space, or the possibility. We work alongside your team to connect creative ideas with interactive technology.':'จะมาพร้อมบรีฟ พื้นที่ หรือแค่ไอเดีย ก็คุยกับเราได้ เราพร้อมทำงานเคียงข้างทีมของคุณ เพื่อเปลี่ยนไอเดียสร้างสรรค์ให้เป็นเทคโนโลยีอินเทอร์แอคทีฟที่ใช้งานได้จริง','Event Agencies':'เอเจนซีอีเวนต์','Interactive games, branded activations, and participatory experiences for your next event.':'เกมอินเทอร์แอคทีฟ กิจกรรมแบรนด์ และประสบการณ์ที่ชวนผู้ร่วมงานมาเล่นด้วย สำหรับงานอีเวนต์ครั้งต่อไปของคุณ','Production Houses':'ทีมโปรดักชัน','Custom software, visual content, and interactive systems to connect the production.':'ซอฟต์แวร์เฉพาะงาน งานภาพ และระบบอินเทอร์แอคทีฟ ที่ช่วยต่อยอดงานโปรดักชันของคุณ','LED Providers':'ผู้ให้บริการจอ LED','Responsive content and software that bring LED walls, floors, and display environments to life.':'คอนเทนต์และซอฟต์แวร์อินเทอร์แอคทีฟ ที่ทำให้ผนัง LED พื้น LED และพื้นที่จอแสดงผลมีชีวิตขึ้นมา','System Integrators':'ผู้วางระบบ','Connect hardware, sensors, content, and custom applications around the installation.':'เชื่อมฮาร์ดแวร์ เซนเซอร์ เนื้อหา และแอปเฉพาะงาน ให้ทำงานเป็นระบบเดียวในหน้างาน','Start a partnership conversation':'เริ่มต้นร่วมงาน','A CONNECTED WAY OF WORKING':'ทำงานเชื่อมกันเป็นทีมเดียว','From first idea':'จากไอเดียแรก','to final interaction.':'จนถึงวันที่ผู้คนได้เล่นจริง',
 'Share the audience, project scope, timeline, and available hardware. We can discuss interaction design, custom programs, integration, testing, installation, and support as part of one connected plan.':'เล่าให้เราฟังเรื่องกลุ่มผู้ชม ขอบเขตงาน ระยะเวลา และฮาร์ดแวร์ที่มี แล้วเราจะวางแผนร่วมกันในแผนเดียว ทั้งการออกแบบวิธีเล่น โปรแกรมเฉพาะงาน การเชื่อมระบบ การทดสอบ การติดตั้ง และการดูแลหลังส่งมอบ','Every partnership begins with a conversation about responsibilities, deliverables, and the experience you want to create.':'ทุกการร่วมงานเริ่มจากการคุยให้ชัดว่าใครดูแลส่วนไหน จะส่งมอบอะไร และอยากสร้างประสบการณ์แบบไหนให้ผู้ชม','Tell us about your project':'เล่าโครงการของคุณให้เราฟัง',
 'LET’S TALK':'คุยกับเรา','A possibility begins':'ทุกความเป็นไปได้','with a conversation.':'เริ่มจากการคุยกัน','Tell us about the experience you have in mind. We’ll explore the idea, the space, and the technology together.':'เล่าให้เราฟังว่าคุณอยากสร้างประสบการณ์แบบไหน แล้วมาคิดเรื่องไอเดีย พื้นที่ และเทคโนโลยีไปด้วยกัน','Say hello.':'ติดต่อเรา','EMAIL':'อีเมล','PHONE / K. MAY':'โทรศัพท์ / คุณเม','Prefer a quick conversation? Call K. May or connect with our LINE account.':'อยากคุยกันเร็ว ๆ โทรหาคุณเม หรือทักมาทาง LINE ได้เลย','PROJECT ENQUIRY':'สอบถามรายละเอียดโครงการ','What are you imagining?':'ไอเดียของคุณคืออะไร?','Your name':'ชื่อของคุณ','Company':'บริษัทหรือองค์กร','Email':'อีเมล','Phone':'เบอร์โทรศัพท์','What can we help with?':'อยากให้เราช่วยเรื่องอะไร?','Select a service or type your own':'เลือกบริการหรือพิมพ์ความต้องการเอง','Timeline':'ช่วงเวลาที่ต้องการ','Budget (optional)':'งบประมาณ (ไม่บังคับ)','Your target date or project phase':'วันที่ต้องการหรือระยะของโครงการ','Your indicative budget and currency':'งบประมาณโดยประมาณและสกุลเงิน','Your idea, audience, venue, available hardware, and any questions.':'เล่าไอเดีย กลุ่มผู้ชม สถานที่ อุปกรณ์ที่มีอยู่ หรือคำถามที่อยากถาม','Your enquiry is sent to JPM Media Space through FormSubmit. We’ll use your contact details to respond to your project.':'แบบฟอร์มนี้ส่งข้อมูลถึง JPM Media Space ผ่าน FormSubmit เราจะใช้ข้อมูลติดต่อของคุณเพื่อตอบกลับเรื่องโครงการ','Send enquiry':'ส่งรายละเอียด','Custom Solution':'โซลูชันเฉพาะงาน','Partnership':'ความร่วมมือ','Email your brief directly to':'หรือส่งบรีฟทางอีเมลได้ที่','Share your project brief.':'ส่งรายละเอียดโครงการของคุณ','Email your idea, audience, venue, and timeline directly to':'ส่งไอเดีย กลุ่มผู้ชม สถานที่ และช่วงเวลาทางอีเมลได้ที่','Email your idea, audience, venue, and timeline to':'ส่งไอเดีย กลุ่มผู้ชม สถานที่ และช่วงเวลามาที่',
 'LET’S BUILD YOUR NEXT EXPERIENCE':'มาสร้างประสบการณ์ครั้งใหม่ไปด้วยกัน','Request':'ขอ','a quote.':'ใบเสนอราคา','Discuss your project with JPM Media Space. Tell us about your space, audience, and goals, and we’ll help shape the right interactive experience.':'คุยเรื่องโครงการกับ JPM Media Space เล่าพื้นที่ ผู้ชม และเป้าหมาย แล้วเราจะช่วยออกแบบประสบการณ์อินเทอร์แอคทีฟที่เหมาะกับคุณ','Interactive Installation':'งานติดตั้งอินเทอร์แอคทีฟ','Creative Technology':'ครีเอทีฟเทคโนโลยี','LET’S BUILD SOMETHING THAT CONNECTS':'มาสร้างสิ่งที่เชื่อมผู้คนเข้าด้วยกัน','Your next idea.':'ไอเดียต่อไปของคุณ','Our next conversation.':'เริ่มจากการคุยกัน','Tell us what you have in mind. We’ll explore what’s possible.':'มีไอเดียอยู่แล้ว หรือยังไม่แน่ใจว่าจะเริ่มตรงไหน ก็คุยกับเราได้ เราพร้อมช่วยคิดไปกับคุณตั้งแต่วันแรก','Start a conversation':'คุยกับเรา','THANK YOU FOR REACHING OUT':'ขอบคุณที่ติดต่อเรา','Your next experience':'ประสบการณ์ครั้งใหม่ของคุณ','Your enquiry has been submitted. Our team will review your project details and get in touch using the contact information you provided.':'เราได้รับข้อมูลของคุณแล้ว ทีมงานจะดูรายละเอียดโครงการ และติดต่อกลับตามช่องทางที่คุณให้ไว้','If you need to reach us directly, call':'หากต้องการติดต่อโดยตรง โทร', 'or message us on':'หรือส่งข้อความผ่าน',
 'INTERACTIVE / CREATIVE TECHNOLOGY':'อินเทอร์แอคทีฟ / ครีเอทีฟเทคโนโลยี','TOUCHSCREEN / CREATIVE TECHNOLOGY':'ทัชสกรีน / ครีเอทีฟเทคโนโลยี','IMMERSIVE / CREATIVE TECHNOLOGY':'อิมเมอร์ซีฟ / ครีเอทีฟเทคโนโลยี','TECHNOLOGY / CREATIVE TECHNOLOGY':'เทคโนโลยี / ครีเอทีฟเทคโนโลยี','WHERE DIGITAL MEETS PHYSICAL':'เมื่อโลกดิจิทัลมาอยู่บนพื้นที่จริง','EXPERIMENT 001 / CATCH GAME':'การทดลอง 001 / CATCH GAME','EXPERIMENT 002 / SCRATCH REVEAL':'การทดลอง 002 / SCRATCH REVEAL','EXPERIMENT 003 / PRODUCT EXPLORER':'การทดลอง 003 / PRODUCT EXPLORER',
 'Play again':'เล่นอีกครั้ง','Resume game':'เล่นต่อ','Resume':'เล่นต่อ','That’s a wrap.':'จบรอบแล้ว','Take a moment.':'พักสักครู่','Game paused.':'พักเกมแล้ว','Game started. Move left and right to catch the falling objects.':'เริ่มเกมแล้ว เลื่อนซ้ายและขวาเพื่อรับไอเทมที่ตกลงมา','Revealed: Your next idea starts here.':'เปิดแล้ว: ไอเดียต่อไปของคุณเริ่มต้นที่นี่','Your next idea starts here.':'ไอเดียต่อไปของคุณเริ่มต้นที่นี่','A possibility awaits.':'มีสิ่งใหม่รอให้ค้นพบ','SCRATCH TO DISCOVER':'ขูดเพื่อค้นพบ','The audience becomes the input':'ให้ผู้ชมเป็นผู้ควบคุม','Touch, movement, and sensor signals can connect a visitor’s action with a response in the display.':'เชื่อมการสัมผัส การเคลื่อนไหว และสัญญาณเซนเซอร์เข้ากับการตอบสนองของภาพบนจอ','Your story, brought to life':'ทำให้เรื่องราวของคุณมีชีวิต','Custom visuals, product information, and interactive programs connect the experience to your brand.':'ภาพเฉพาะงาน ข้อมูลสินค้า และโปรแกรมอินเทอร์แอคทีฟเชื่อมประสบการณ์กับแบรนด์ของคุณ','Sending…':'กำลังส่ง…','Continuing to secure submission. Please complete the verification if prompted.':'กำลังไปยังหน้าส่งข้อมูล กรุณายืนยันตัวตนหากระบบร้องขอ',
 'Filter services':'กรองบริการ','Filter projects':'กรองผลงาน','Filter articles':'กรองบทความ','Filter playable demos':'กรองเดโม','Main navigation':'เมนูหลัก','Back to previous page':'ย้อนกลับหน้าก่อนหน้า','Examples of experience settings':'ตัวอย่างพื้นที่สร้างประสบการณ์','Move catcher left':'เลื่อนตัวรับไปทางซ้าย','Move catcher right':'เลื่อนตัวรับไปทางขวา','Explore the installation':'สำรวจแนวคิดงานติดตั้ง','QR code for JPM Media Space LINE account':'คิวอาร์โค้ด LINE ของ JPM Media Space','JPM Media Space LINE QR code':'คิวอาร์โค้ด LINE ของ JPM Media Space'
};
Object.entries(uiCopy).forEach(([en,th])=>add(en,th));
Object.entries({
 'Interactive experiences. Creative possibilities.':'ประสบการณ์อินเทอร์แอคทีฟและความเป็นไปได้เชิงสร้างสรรค์',
 'Interactive Technology Services':'บริการเทคโนโลยีอินเทอร์แอคทีฟ','Where Experiences Happen':'พื้นที่แห่งประสบการณ์','Events & Permanent Installation Packages':'แพ็กเกจอีเวนต์และงานติดตั้งถาวร','Our Work & Case Studies':'ผลงานและตัวอย่างโครงการ','Interactive Playground — Playable Demos':'พื้นที่ทดลองอินเทอร์แอคทีฟ — เดโมที่ลองเล่นได้','Partner With Us — B2B Creative Technology':'ร่วมงานกับเรา — ครีเอทีฟเทคโนโลยีสำหรับธุรกิจ','Contact & Request a Quote':'ติดต่อและขอใบเสนอราคา','Thank You — Enquiry Received':'ขอบคุณ — ได้รับคำขอแล้ว',
 'JPM Media Space creates interactive games, touchscreen applications, immersive environments, and integrated technology for brands and physical spaces.':'JPM Media Space สร้างเกมอินเทอร์แอคทีฟ แอปทัชสกรีน ประสบการณ์อิมเมอร์ซีฟ และระบบเทคโนโลยีสำหรับแบรนด์และพื้นที่จริง',
 'Meet JPM Media Space, a creative technology company specializing in interactive and immersive experience.':'รู้จัก JPM Media Space บริษัทครีเอทีฟเทคโนโลยีผู้เชี่ยวชาญด้านประสบการณ์อินเทอร์แอคทีฟและอิมเมอร์ซีฟ',
 'Explore JPM Media Space’s interactive games, touchscreen applications, LED and projection, immersive experiences, sensor technologies, and custom development.':'สำรวจบริการเกมอินเทอร์แอคทีฟ แอปทัชสกรีน LED โปรเจกชัน ประสบการณ์อิมเมอร์ซีฟ เซนเซอร์ และการพัฒนาระบบเฉพาะงานของ JPM Media Space',
 'Examples of settings for interactive experiences, designed around your space, audience, and idea.':'ตัวอย่างพื้นที่สร้างประสบการณ์อินเทอร์แอคทีฟที่ออกแบบตามพื้นที่ ผู้ชม และไอเดียของคุณ',
 'Explore JPM Media Space’s event and permanent installation packages, touchscreen programs, LED and projection services, and sensor add-ons.':'ดูแพ็กเกจงานอีเวนต์ งานติดตั้งถาวร โปรแกรมทัชสกรีน LED โปรเจกชัน และเทคโนโลยีเซนเซอร์เสริมจาก JPM Media Space',
 'Explore existing JPM Media Space portfolio references, touchscreen applications, interactive installations, and immersive experiences.':'สำรวจผลงานของ JPM Media Space ทั้งแอปทัชสกรีน งานติดตั้งอินเทอร์แอคทีฟ และประสบการณ์อิมเมอร์ซีฟ',
 'Play JPM Media Space’s Catch Game, Scratch Reveal, and Product Explorer browser prototypes. Try touch, mouse, and keyboard interactions without special hardware.':'ลองเล่น Catch Game, Scratch Reveal และ Product Explorer ของ JPM Media Space บนเบราว์เซอร์ ด้วยสัมผัส เมาส์ หรือคีย์บอร์ด โดยไม่ต้องใช้อุปกรณ์พิเศษ',
 'Explore JPM Media Space studio perspectives on interactive experience design, physical spaces, project planning, and creative technology.':'อ่านมุมมองของ JPM Media Space เรื่องการออกแบบประสบการณ์อินเทอร์แอคทีฟ พื้นที่จริง การวางแผนโครงการ และครีเอทีฟเทคโนโลยี',
 'Creative technology partnerships for event agencies, production houses, LED providers, and system integrators. Build interactive experiences with JPM Media Space.':'ร่วมสร้างประสบการณ์อินเทอร์แอคทีฟกับ JPM Media Space พาร์ทเนอร์ด้านครีเอทีฟเทคโนโลยีสำหรับเอเจนซี ทีมโปรดักชัน ผู้ให้บริการ LED และผู้วางระบบ',
 'Talk to JPM Media Space about an interactive experience, immersive installation, creative technology project, or B2B partnership.':'คุยกับ JPM Media Space เรื่องประสบการณ์อินเทอร์แอคทีฟ งานติดตั้งอิมเมอร์ซีฟ โครงการครีเอทีฟเทคโนโลยี หรือความร่วมมือทางธุรกิจ',
 'Thank you for contacting JPM Media Space about your project.':'ขอบคุณที่ติดต่อ JPM Media Space เกี่ยวกับโครงการของคุณ',
 'JPM Media Space. All rights reserved.':'JPM Media Space. สงวนลิขสิทธิ์',
 'Dynasty · Touchscreen application':'Dynasty · แอปพลิเคชันทัชสกรีน','LAZADA Run Thailand · Interactive running game':'LAZADA Run Thailand · เกมวิ่งอินเทอร์แอคทีฟ','Crowne Plaza · Interactive floor':'Crowne Plaza · พื้นอินเทอร์แอคทีฟ','Punthai Coffee · Interactive installation':'Punthai Coffee · งานติดตั้งอินเทอร์แอคทีฟ','Kepler · Custom application':'Kepler · แอปพลิเคชันเฉพาะงาน',
 'These interactive prototypes need JavaScript. You can still explore our services or':'เดโมเหล่านี้ต้องใช้ JavaScript คุณยังสามารถสำรวจบริการหรือ','request a quote':'ขอใบเสนอราคา','with the studio.':'กับทีมสตูดิโอ',
 'Blue and violet immersive LED walls with an interactive illuminated floor':'ผนัง LED สีน้ำเงินและม่วง พร้อมพื้นอินเทอร์แอคทีฟที่มีแสง',
 'Catch Game play field. Use left and right arrows or A and D to move.':'พื้นที่เล่น Catch Game ใช้ลูกศรซ้ายขวาหรือ A และ D เพื่อเคลื่อนที่',
 'Scratchable surface. Use the Reveal message button for keyboard access.':'พื้นผิวขูดเปิดข้อความ ใช้ปุ่มเปิดข้อความเพื่อเล่นด้วยคีย์บอร์ด'
}).forEach(([en,th])=>add(en,th));
// SEO titles, descriptions, keyword kickers and image alt text (2026-10-16).
Object.entries({
 'Interactive & Immersive Experiences in Thailand':'ประสบการณ์อินเทอร์แอคทีฟและอิมเมอร์ซีฟในประเทศไทย',
 'JPM Media Space designs interactive games, touchscreen applications, immersive rooms, and LED and projection installations for brands, events, and museums in Thailand.':'JPM Media Space ออกแบบเกมอินเทอร์แอคทีฟ แอปพลิเคชันทัชสกรีน ห้องอิมเมอร์ซีฟ และงานติดตั้ง LED และโปรเจกชัน สำหรับแบรนด์ อีเวนต์ และพิพิธภัณฑ์ในประเทศไทย',
 'About Us — Creative Technology Studio':'เกี่ยวกับเรา — สตูดิโอครีเอทีฟเทคโนโลยี',
 'Meet JPM Media Space, a creative technology studio in Thailand specializing in interactive installations, touchscreen applications, and immersive experiences.':'รู้จัก JPM Media Space สตูดิโอครีเอทีฟเทคโนโลยีในประเทศไทย ผู้เชี่ยวชาญงานติดตั้งอินเทอร์แอคทีฟ แอปพลิเคชันทัชสกรีน และประสบการณ์อิมเมอร์ซีฟ',
 'Services: Interactive Games, Touchscreen, LED & Projection':'บริการ: เกมอินเทอร์แอคทีฟ ทัชสกรีน LED และโปรเจกชัน',
 'Interactive games, touchscreen applications, LED and projection mapping, immersive rooms, sensor technologies, and custom interactive development for brands and venues in Thailand.':'บริการเกมอินเทอร์แอคทีฟ แอปพลิเคชันทัชสกรีน LED และโปรเจกชันแมปปิ้ง ห้องอิมเมอร์ซีฟ เทคโนโลยีเซนเซอร์ และการพัฒนางานอินเทอร์แอคทีฟเฉพาะงาน สำหรับแบรนด์และสถานที่ในประเทศไทย',
 'INTERACTIVE TECHNOLOGY SERVICES':'บริการเทคโนโลยีอินเทอร์แอคทีฟ',
 'Interactive Experiences for Events, Showrooms, Museums & Malls':'ประสบการณ์อินเทอร์แอคทีฟสำหรับอีเวนต์ โชว์รูม พิพิธภัณฑ์ และห้างสรรพสินค้า',
 'Interactive and immersive experience ideas for events and exhibitions, showrooms, museums, shopping malls, and permanent installations, designed around your space and audience.':'ไอเดียประสบการณ์อินเทอร์แอคทีฟและอิมเมอร์ซีฟสำหรับอีเวนต์และนิทรรศการ โชว์รูม พิพิธภัณฑ์ ห้างสรรพสินค้า และงานติดตั้งถาวร ออกแบบตามพื้นที่และกลุ่มผู้ชมของคุณ',
 'INTERACTIVE EXPERIENCES BY SETTING':'ประสบการณ์อินเทอร์แอคทีฟตามประเภทพื้นที่',
 'Event & Permanent Interactive Installation Packages':'แพ็กเกจงานอินเทอร์แอคทีฟสำหรับอีเวนต์และงานติดตั้งถาวร',
 'INTERACTIVE INSTALLATION PACKAGES':'แพ็กเกจงานติดตั้งอินเทอร์แอคทีฟ',
 'Portfolio: Interactive & Immersive Projects':'ผลงาน: โครงการอินเทอร์แอคทีฟและอิมเมอร์ซีฟ',
 'Portfolio of interactive floors, immersive walls, touchscreen applications, and branded games for brands such as Punthai Coffee, LAZADA, Crowne Plaza, Bangchak, and PTTEP, with original project credits.':'รวมผลงานพื้นอินเทอร์แอคทีฟ ผนังอิมเมอร์ซีฟ แอปพลิเคชันทัชสกรีน และเกมสำหรับแบรนด์ เช่น Punthai Coffee, LAZADA, Crowne Plaza, บางจาก และ PTTEP พร้อมเครดิตโครงการตามต้นฉบับ',
 'OUR WORK · INTERACTIVE & IMMERSIVE PORTFOLIO':'ผลงานของเรา · อินเทอร์แอคทีฟและอิมเมอร์ซีฟ',
 'Interactive Playground: Try Playable Demos':'พื้นที่ทดลองอินเทอร์แอคทีฟ: ลองเล่นเดโมได้ทันที',
 'THE JPM MEDIA SPACE INTERACTIVE PLAYGROUND • PLAYABLE DEMOS':'พื้นที่ทดลองอินเทอร์แอคทีฟของ JPM Media Space • เดโมที่ลองเล่นได้',
 'Articles on Interactive Experience Design':'บทความเรื่องการออกแบบประสบการณ์อินเทอร์แอคทีฟ',
 'ARTICLES · INTERACTIVE EXPERIENCE DESIGN':'บทความ · การออกแบบประสบการณ์อินเทอร์แอคทีฟ',
 'PARTNER WITH US · B2B CREATIVE TECHNOLOGY':'ร่วมงานกับเรา · ครีเอทีฟเทคโนโลยีสำหรับธุรกิจ',
 'Contact Us & Request a Quote':'ติดต่อเราและขอใบเสนอราคา',
 'Talk to JPM Media Space about an interactive experience, immersive installation, or creative technology project in Thailand. Call, email, LINE, or request a quote.':'คุยกับ JPM Media Space เรื่องประสบการณ์อินเทอร์แอคทีฟ งานติดตั้งอิมเมอร์ซีฟ หรือโครงการครีเอทีฟเทคโนโลยีในประเทศไทย ติดต่อทางโทรศัพท์ อีเมล LINE หรือขอใบเสนอราคา',
 'CONTACT & REQUEST A QUOTE':'ติดต่อและขอใบเสนอราคา',
 'Colourful LAZADA Run Thailand running game on a portrait screen':'เกมวิ่ง LAZADA Run Thailand สีสันสดใสบนจอแนวตั้ง',
 'Dynasty touchscreen archive showing three framed historic photographs':'แอปทัชสกรีน Dynasty แสดงภาพถ่ายเก่าในกรอบสามภาพ',
 'Immersive projection of Blessed Nicholas Bunkerd in an illustrated landscape':'ภาพฉายอิมเมอร์ซีฟของบุญราศีนิโคลาส บุญเกิด ในทิวทัศน์ภาพวาด',
 'Punthai Coffee interactive wall at an exhibition booth':'ผนังอินเทอร์แอคทีฟของ Punthai Coffee ในบูธนิทรรศการ',
 'Kepler touchscreen application with a portrait of Johannes Kepler':'แอปทัชสกรีน Kepler พร้อมภาพเหมือนของโยฮันเนส เคปเลอร์',
 'Visitor walking on the Crowne Plaza interactive floor projection':'ผู้เข้าชมเดินบนพื้นโปรเจกชันอินเทอร์แอคทีฟของ Crowne Plaza',
 'Visitor interacting with the large Punthai Coffee interactive wall':'ผู้เข้าชมเล่นกับผนังอินเทอร์แอคทีฟขนาดใหญ่ของ Punthai Coffee',
 'Exterior of the Shrine of Blessed Nicholas Bunkerd church':'ภายนอกสักการสถานบุญราศีนิโคลาส บุญเกิด',
 'BCC Power Technologies (BPT) logo':'โลโก้ BCC Power Technologies (BPT)',
 'Dynasty touchscreen archive with three framed historic photographs':'แอปทัชสกรีน Dynasty พร้อมภาพถ่ายเก่าในกรอบสามภาพ',
 'Portrait of Johannes Kepler from the Kepler touchscreen application':'ภาพเหมือนโยฮันเนส เคปเลอร์ จากแอปทัชสกรีน Kepler',
 'Jungle Story touchscreen game for the Walailak University museum':'เกมทัชสกรีน Jungle Story ของพิพิธภัณฑ์มหาวิทยาลัยวลัยลักษณ์',
 'Oishi Green Tea and One Piece logos':'โลโก้โออิชิ กรีนที และ One Piece',
 'KIA logo':'โลโก้ KIA',
 'LAZADA Run Thailand logo':'โลโก้ LAZADA Run Thailand',
 'Crowne Plaza Bangkok Lumpini Park logo':'โลโก้ Crowne Plaza Bangkok Lumpini Park',
 'Café Amazon bottled coffee touchscreen menu':'หน้าจอทัชสกรีนเมนูกาแฟขวดของคาเฟ่ อเมซอน',
 'Bangchak 38th anniversary fortune wheel graphic':'กราฟิกวงล้อเสี่ยงโชคครบรอบ 38 ปีบางจาก',
 'XSpring Digital logo':'โลโก้ XSpring Digital',
 'PTTEP logo':'โลโก้ PTTEP',
 'Discover Muaythai exhibition poster for World Grand Prix Sport Weekend':'โปสเตอร์นิทรรศการ Discover Muaythai งาน World Grand Prix Sport Weekend',
 'Visitors using an interactive touchscreen kiosk at a corporate event':'ผู้ร่วมงานใช้คีออสก์ทัชสกรีนอินเทอร์แอคทีฟในงานอีเวนต์องค์กร',
 'Large interactive LED wall in a corporate lobby':'ผนัง LED อินเทอร์แอคทีฟขนาดใหญ่ในล็อบบี้องค์กร'
}).forEach(([en,th])=>add(en,th));
// JPM positioning: one team end to end, a thinking partner (2026-10-16).
Object.entries({
 'One team from concept to after-sales. JPM Media Space designs interactive games, touchscreen applications, immersive rooms, and interactive content for LED and projection for brands in Thailand.':'ทีมเดียวดูแลตั้งแต่คิดคอนเซปต์จนถึงหลังการขาย JPM Media Space ออกแบบเกมอินเทอร์แอคทีฟ แอปพลิเคชันทัชสกรีน ห้องอิมเมอร์ซีฟ และคอนเทนต์อินเทอร์แอคทีฟสำหรับ LED และโปรเจกชัน สำหรับแบรนด์ในประเทศไทย',
 'Meet JPM Media Space, a creative technology studio in Thailand. One team handles concept, content, software, installation, and after-sales care for interactive and immersive experiences.':'รู้จัก JPM Media Space สตูดิโอครีเอทีฟเทคโนโลยีในประเทศไทย ทีมเดียวดูแลทั้งคอนเซปต์ เนื้อหา โปรแกรม การติดตั้ง และบริการหลังการขาย สำหรับประสบการณ์อินเทอร์แอคทีฟและอิมเมอร์ซีฟ',
 'WHY JPM MEDIA SPACE':'ทำไมต้อง JPM Media Space',
 'One team.':'ทีมเดียว',
 'End to end.':'ดูแลครบทุกขั้นตอน',
 'From the first idea to after-sales care, JPM Media Space is the one team behind your experience: fewer handovers, fewer steps, and a partner who cares about the result.':'ตั้งแต่ไอเดียแรกจนถึงหลังส่งมอบ JPM Media Space คือทีมเดียวที่ดูแลประสบการณ์ของคุณ ส่งต่องานน้อยลง ขั้นตอนน้อยลง และมีคู่คิดที่ใส่ใจผลลัพธ์จริง ๆ',
 'One team, end to end':'ทีมเดียว ดูแลครบวงจร',
 'What you get from JPM Media Space':'สิ่งที่คุณจะได้รับจาก JPM Media Space',
 'Stage of work':'ช่วงงาน',
 'What we aim to deliver':'สิ่งที่เราอยากส่งมอบ',
 'What you get':'สิ่งที่คุณจะได้รับ',
 'Before we start':'ก่อนเริ่ม',
 'See it before you decide, and your idea can get even better':'เห็นก่อนตัดสินใจ ไอเดียของคุณดีขึ้นได้อีก',
 'A feasibility check and one prototype to try':'ตรวจความเป็นไปได้ และ prototype 1 เวอร์ชันให้ลองก่อน',
 'While it runs':'ระหว่างใช้งาน',
 'No worries on site':'ไม่ต้องกังวลหน้างาน',
 'A technical team ready to fix issues on the spot, from start to finish':'ทีมเทคนิคพร้อมแก้ทันที ตั้งแต่ต้นจนจบงาน',
 'After handover':'หลังส่งมอบ',
 'The work does not end at handover':'งานไม่จบแค่วันส่งมอบ',
 'A usage summary, such as engagement numbers, to refine your strategy for the next project':'สรุปผลการใช้งาน เช่น ตัวเลขการมีส่วนร่วม เพื่อการปรับกลยุทธ์ในโปรเจกต์ต่อไป',
 'Next time':'ครั้งต่อไป',
 'Invest once, build on it':'ลงทุนครั้งเดียว ต่อยอดได้',
 'A system you can update, move, or expand':'ระบบที่อัปเดตคอนเทนต์ ย้ายไปใช้ หรือขยายต่อได้',
 'Try it out':'ทดลองเล่น',
 'Move or tap to play with the light':'ขยับหรือแตะเพื่อเล่นกับแสง',
 '096-282-6224 / K. May':'096-282-6224 / คุณเม',
 'Concept, content, software development, installation, and after-sales care are handled by one team. No separate vendors to brief, coordinate, or chase.':'คิดคอนเซปต์ คิดเนื้อหา พัฒนาโปรแกรม ติดตั้ง และดูแลหลังการขาย ครบในทีมเดียว คุณไม่ต้องคุยแยกหลาย vendor และไม่ต้องคอยประสานงานเอง',
 'A thinking partner for your business':'คู่คิดทางธุรกิจ',
 'We start from the problem you need to solve, not just the brief, and think it through with you as if we were part of your business.':'เราเริ่มจากปัญหาที่คุณต้องการแก้ ไม่ใช่แค่ทำตามบรีฟ และช่วยคิดไปด้วยกันเหมือนเป็นหุ้นส่วนธุรกิจของคุณจริง ๆ',
 'Full attention for every client':'มีเวลาให้ลูกค้าอย่างเต็มที่',
 'As a small studio, we give every project real time and focus. You talk directly with the people who design and build your experience.':'เราเป็นทีมเล็ก จึงมีเวลาให้ทุกโครงการอย่างเต็มที่ และคุณได้คุยกับคนที่ออกแบบและลงมือทำงานโดยตรง',
 'Partners when you need more':'มีพาร์ทเนอร์พร้อมเสริม',
 'Need a service beyond our scope? We bring in trusted partners and coordinate them for you, so you still have one point of contact.':'ถ้าต้องการบริการที่นอกเหนือจากงานของเรา เราจะคุยและประสานพาร์ทเนอร์ให้เอง คุณยังคุยกับเราที่เดียวเหมือนเดิม',
 'We work like a business partner. We start from your goals, think the problem through with you, and stay with you after launch, so your experience keeps delivering.':'เราทำงานแบบคู่คิดทางธุรกิจ เริ่มจากเป้าหมายของคุณ ช่วยกันคิดแก้โจทย์ และอยู่ข้าง ๆ คุณต่อหลังเปิดใช้งาน เพื่อให้งานสร้างผลลัพธ์ได้อย่างต่อเนื่อง',
 'One team. Six connected disciplines. From concept to after-sales, built around your audience, your story, and your space.':'ทีมเดียว 6 ความเชี่ยวชาญที่ทำงานเชื่อมกัน ดูแลตั้งแต่คอนเซปต์จนถึงหลังการขาย โดยคิดจากผู้ชม เรื่องราว และพื้นที่ของคุณ',
 'Discuss your project with JPM Media Space. Tell us about your space, audience, and goals, and we’ll help shape the right interactive experience. You work directly with the team that builds it, from concept to after-sales.':'เล่าให้เราฟังเรื่องพื้นที่ กลุ่มผู้ชม และเป้าหมายของคุณ แล้วเราจะช่วยออกแบบประสบการณ์อินเทอร์แอคทีฟที่เหมาะที่สุด คุณได้คุยกับทีมที่ลงมือทำจริงโดยตรง ตั้งแต่คอนเซปต์จนถึงหลังการขาย'
}).forEach(([en,th])=>add(en,th));
// Positioning: event booth games (owner-approved 2026-10-26). Queue first, no surprises on show day, leads after.
const thaiEventPrice = index => packages[0].items[index].startingPrice.toLocaleString('en-US') + '.-';
const thaiFaqs = [
 ['JPM Media Space รับทำอะไรบ้าง?','JPM Media Space คือสตูดิโอครีเอทีฟเทคโนโลยีในประเทศไทย เราออกแบบและพัฒนาเกมอินเทอร์แอคทีฟ แอปพลิเคชันทัชสกรีน และคอนเทนต์อินเทอร์แอคทีฟสำหรับจอ LED โปรเจกเตอร์ และเซนเซอร์ โดยเน้นงานบูธอีเวนต์และกิจกรรมแบรนด์ รวมถึงงานติดตั้งถาวร'],
 ['ทำเกมอินเทอร์แอคทีฟสำหรับบูธงานอีเวนต์ ราคาเท่าไหร่?',`แพ็กเกจงานอีเวนต์เริ่มต้นที่ ${thaiEventPrice(0)} สำหรับงานทัชสกรีน และ ${thaiEventPrice(1)} สำหรับคอนเทนต์อินเทอร์แอคทีฟบนจอ LED และโปรเจกชัน ราคาสุดท้ายขึ้นกับรูปแบบเกม เนื้อหา และขอบเขตงาน โดยจะระบุชัดในใบเสนอราคา`],
 ['เกมบูธมีแบบไหนบ้าง?','รูปแบบที่นิยม เช่น เกมรับไอเทม เกมจับคู่ภาพ เกมสุ่ม เกมตอบคำถาม เกมแนว Guitar Hero/Fruit Ninja และเกมที่ใช้เซนเซอร์จับการเคลื่อนไหว เกมแบบจับเวลารอบสั้น ๆ ช่วยให้คิวเดินเร็ว และคนที่ยืนดูก็อยากเข้ามาเล่นต่อ คุณลองเล่นบางรูปแบบได้ในพื้นที่ทดลองของเรา'],
 ['ใส่โลโก้ สินค้า และสีของแบรนด์ในเกมได้ไหม?','ได้ ทุกเกมออกแบบรอบแบรนด์ของคุณ ทั้งโลโก้ สีแบรนด์ สินค้าที่กลายเป็นไอเทมในเกม และข้อความแคมเปญ ลองอัปโหลดภาพของคุณเองในเดโมที่พื้นที่ทดลองได้เลย'],
 ['ทำเกมบูธใช้เวลานานแค่ไหน?','โดยทั่วไปใช้เวลาอย่างน้อย 1 สัปดาห์ ขึ้นอยู่กับรูปแบบเกมและเนื้อหา แจ้งวันงานมาพร้อมกับการขอใบเสนอราคา แล้วเราจะวางตารางงานแล้วลองทำ prototype ให้ทดสอบดูก่อนใช้งานจริง'],
 ['ใช้จอที่มีอยู่แล้วได้ไหม?','ได้ คอนเทนต์และโปรแกรมของเราใช้กับทัชสกรีน จอ LED หรือโปรเจกเตอร์ของคุณได้เลย แพ็กเกจของเราไม่รวมจอและโปรเจกเตอร์ แค่แจ้งขนาดและความละเอียดจอมา แล้วเราจะออกแบบให้พอดี'],
 ['ถ้าระบบมีปัญหาระหว่างงาน ทำอย่างไร?','เราทดสอบระบบทั้งหมดที่หน้างานก่อนเปิดงาน และทีมเทคนิคอยู่หน้างานตั้งแต่ต้นจนจบ พร้อมแก้ปัญหาได้ทันที'],
 ['เกมเก็บข้อมูลผู้เล่นตาม PDPA ได้ไหม?','ได้ เราเพิ่มแบบฟอร์มลงทะเบียนหรือการสแกน QR ก่อนเล่นได้ พร้อมขั้นตอนขอความยินยอมตาม PDPA ที่คุณอนุมัติก่อนเก็บข้อมูล หลังจบงานคุณจะได้รับสรุปจำนวนผู้เล่นและการมีส่วนร่วม เพื่อใช้วางแผนกิจกรรมครั้งต่อไป'],
 ['งานติดตั้งถาวรมีรับประกันไหม?','มี งานติดตั้งถาวรรับประกัน 1 ปี และทีมของเราดูแลหลังการขายและบำรุงรักษาให้ ขอบเขตการรับประกันจะระบุไว้ในใบเสนอราคา'],
 ['รับงานร่วมกับเอเจนซีและผู้จัดงานไหม?','รับ เราทำงานทั้งกับแบรนด์โดยตรง และเป็นทีมอินเทอร์แอคทีฟให้เอเจนซีอีเวนต์ โปรดักชันเฮาส์ และผู้ให้บริการจอ LED']
];
if (thaiFaqs.length !== faqs.length) throw new Error('Thai FAQ count must match English FAQ count.');
faqs.forEach(([q,a],i)=>{ add(q,thaiFaqs[i][0]); add(a,thaiFaqs[i][1]); });
Object.entries({
 'Interactive Booth Games for Events in Thailand':'เกมอินเทอร์แอคทีฟสำหรับบูธงานอีเวนต์ ทัชสกรีน จอ LED',
 'JPM Media Space designs interactive games and touchscreen experiences for event booths in Thailand: games that draw a queue, tested before show day, with on-site support and a player summary after the event.':'JPM Media Space ออกแบบเกมอินเทอร์แอคทีฟและทัชสกรีนสำหรับบูธงานอีเวนต์ ดึงคนเข้าบูธ ทดสอบระบบก่อนวันงาน มีทีมดูแลหน้างาน และสรุปข้อมูลผู้เล่นให้หลังจบงาน',
 'INTERACTIVE GAMES FOR EVENT BOOTHS':'เกมอินเทอร์แอคทีฟสำหรับบูธงานอีเวนต์',
 'MAKE YOUR BOOTH':'ทำให้บูธคุณ',
 'BUSIER THAN EVER':'คนแน่นกว่าใคร',
 'JPM Media Space in numbers':'JPM Media Space ในตัวเลข',
 'Built for the booth.':'ออกแบบมาเพื่อบูธ',
 'Ready on show day.':'พร้อมตั้งแต่วันแรกของงาน',
 'Event days leave no room for a second take. We design games that pull a crowd, test them before the doors open, and stay with you until the last player leaves. One team handles it all, from concept to on-site support.':'งานอีเวนต์ไม่มีโอกาสให้แก้ตัว เราจึงออกแบบเกมที่ดึงคนเข้าบูธ ทดสอบระบบก่อนเปิดงาน และอยู่กับคุณจนผู้เล่นคนสุดท้าย ทั้งหมดดูแลโดยทีมเดียว ตั้งแต่คิดคอนเซปต์จนถึงหน้างาน',
 'Games people queue to play':'เกมที่คนต่อคิวรอเล่น',
 'Easy to understand at a glance, quick rounds that keep the line moving, and visuals that make people watching want a turn.':'เข้าใจได้ทันทีที่เห็น เล่นจบไวให้คิวเดินเร็ว และภาพที่ทำให้คนที่ยืนดูอยากเข้ามาเล่นต่อ',
 'No surprises on show day':'หน้างานสมูธ ไม่มีสะดุด',
 'We test the full system before the event, and the people who built it are on site to fix issues on the spot, from opening to close.':'เราทดสอบระบบทั้งหมดก่อนวันงาน และคนที่เขียนโปรแกรมเองอยู่หน้างาน พร้อมแก้ปัญหาทันทีตั้งแต่เปิดจนปิดงาน',
 'Leads, not just footfall':'ได้ข้อมูลลูกค้ากลับไป',
 'Add a sign-up or QR scan before play, then get a summary of players and engagement after the event to plan your next one.':'เพิ่มการลงทะเบียนหรือสแกน QR ก่อนเล่นได้ และรับสรุปจำนวนผู้เล่นและการมีส่วนร่วมหลังจบงาน เพื่อใช้วางแผนครั้งต่อไป',
 'FAQ':'คำถามที่พบบ่อย',
 'Home':'หน้าแรก',
 'Game':'เกม',
 'Touchscreen':'ทัชสกรีน',
 'Sensors':'เซนเซอร์',
 'Interactive games':'เกมอินเทอร์แอคทีฟ',
 'Touchscreen experiences':'ประสบการณ์ทัชสกรีน',
 'LED & projection content':'คอนเทนต์ LED และโปรเจกชัน',
 'Sensor technology':'เทคโนโลยีเซนเซอร์',
 'Quick rounds that keep the queue moving and the crowd watching.':'เล่นจบไว คิวเดินเร็ว และคนที่ยืนดูก็อยากเข้ามาเล่นต่อ',
 'Catalogs, guestbooks and stories people explore on their own.':'แคตตาล็อก สมุดเยี่ยมชม และเรื่องราวที่ผู้ชมแตะสำรวจได้เอง',
 'Walls and floors that react to every move, on the screens you already have.':'ผนังและพื้นที่ขยับตามทุกการเคลื่อนไหว ใช้กับจอที่คุณมีอยู่แล้วได้',
 'LiDAR, depth cameras, RFID and NFC turn movement into content.':'LiDAR กล้องวัดความลึก RFID และ NFC เปลี่ยนการเคลื่อนไหวให้เป็นคอนเทนต์',
 'Character modes':'โหมดของตัวละคร',
 'MODE':'โหมด',
 'Tap the character to switch mode':'แตะที่ตัวละครเพื่อเปลี่ยนโหมด',
 'What your booth gets':'สิ่งที่บูธของคุณได้รับ',
 'Draws people into your booth':'คนดึงเข้าบูธ',
 'Smooth on show day':'หน้างานสมูธ',
 'Captures customer leads':'เก็บ lead ลูกค้า',
 '1-year warranty on permanent installs':'งานถาวรรับประกัน 1 ปี',
 'One team, end to end':'ทีมเดียวดูแลครบวงจร',
 'The JPM Media Space mascot, a round character with a screen face':'มาสคอตของ JPM Media Space ตัวละครทรงกลมที่มีหน้าจอเป็นใบหน้า',
 'Request a Quote':'ขอใบเสนอราคา',
 'Tested before show day':'ทดสอบระบบก่อนวันงาน',
 'Team on site until close':'ทีมอยู่หน้างานจนปิดงาน',
 'Player summary after the event':'สรุปข้อมูลผู้เล่นหลังจบงาน',
 'Interactive games ':'เกมอินเทอร์แอคทีฟ',
 'LED walls':'จอ LED',
 'Projection mapping':'โปรเจกชันแมปปิ้ง',
 'LiDAR & depth cameras':'LiDAR และกล้องวัดความลึก',
 'RFID & NFC':'RFID และ NFC',
 'Player sign-up & QR':'ลงทะเบียนผู้เล่นและ QR',
 'On-site support':'ทีมดูแลหน้างาน',
 'WHAT WE CREATE':'สิ่งที่เราสร้างสรรค์',
 'Our process':'ขั้นตอนการทำงาน',
 'Can’t find your answer? Talk to the team that builds it.':'ยังไม่เจอคำตอบที่ต้องการ? คุยกับทีมที่ลงมือทำงานได้โดยตรง',
 'Ask us directly':'ถามเราโดยตรง',
 'YOUR SPACE':'พื้นที่ของคุณ',
 'Contact Us':'ติดต่อเรา',
 'Questions brands':'คำถามที่ลูกค้า',
 'ask us first.':'ถามเราบ่อยที่สุด'
}).forEach(([en,th])=>add(en,th));
Object.entries(demoCopy).forEach(([en,th])=>add(en,th));

// Interactive event games page (S0): owner-reviewed Thai copy, 2026-10-29.
const thaiEventGameFaqs = [
 ['ใส่โลโก้และสินค้าในเกมได้ไหม?','ได้ ทุกเกมออกแบบรอบแบรนด์ของคุณ ทั้งโลโก้ สี สินค้า และข้อความแคมเปญ'],
 ['รวมจอหรือโปรเจกเตอร์ด้วยไหม?','ไม่รวม เกมของเราใช้กับทัชสกรีน จอ LED หรือโปรเจกเตอร์ที่คุณมีได้ แจ้งขนาดและความละเอียดจอมา เราออกแบบให้พอดี'],
 ['ใช้เวลาทำนานแค่ไหน?','อย่างน้อย 1 สัปดาห์ ขึ้นกับรูปแบบเกมและเนื้อหา แจ้งวันงานมาตั้งแต่ตอนขอใบเสนอราคา เราจะวางตารางให้มีเวลาลอง prototype ก่อนใช้จริง'],
 ['ราคาเริ่มต้นเท่าไร?',`แพ็กเกจงานอีเวนต์เริ่มต้นที่ ${thaiEventPrice(0)} สำหรับงานทัชสกรีน และ ${thaiEventPrice(1)} สำหรับคอนเทนต์บนจอ LED และโปรเจกชัน ราคาสุดท้ายระบุในใบเสนอราคาตามขอบเขตงาน`]
];
if (thaiEventGameFaqs.length !== eventGameFaqs.length) throw new Error('Thai event game FAQ count must match English.');
eventGameFaqs.forEach(([q,a],i)=>{ add(q,thaiEventGameFaqs[i][0]); add(a,thaiEventGameFaqs[i][1]); });
Object.entries({
 'Interactive Games for Event Booths':'รับทำเกมอินเทอร์แอคทีฟสำหรับบูธงานอีเวนต์',
 'Interactive Event Games':'รับทำเกมอินเทอร์แอคทีฟ',
 'Booth games people queue to play, designed for your brand. Try a prototype before you decide, tested before show day, with our technical team on site from opening to close.':'เกมบูธที่คนต่อคิวรอเล่น ออกแบบเพื่อแบรนด์คุณ ลอง prototype ก่อนตัดสินใจ ทดสอบก่อนวันงาน และมีทีมเทคนิคอยู่หน้างานตั้งแต่เปิดจนปิด',
 'INTERACTIVE GAME DEVELOPMENT FOR EVENTS':'รับทำเกมอินเทอร์แอคทีฟสำหรับบูธและงานอีเวนต์',
 'Make your booth':'เราจะทำให้บูธของคุณ',
 'the one people notice.':'เป็นที่สนใจของคนในงาน',
 'JPM Media Space designs and builds interactive games for events, product launches, and brand activations. Games people understand at a glance, finish quickly, and that make people watching want a turn. One team handles it all, from concept to handover.':'JPM Media Space ออกแบบและพัฒนาเกมอินเทอร์แอคทีฟสำหรับงานอีเวนต์ งานเปิดตัวสินค้า และกิจกรรมแบรนด์ เกมที่เข้าใจได้ทันที เล่นจบไว และทำให้คนที่ยืนดูอยากเข้ามาเล่นต่อ ทั้งหมดดูแลโดยทีมเดียว ตั้งแต่คิดคอนเซปต์จนส่งมอบงาน',
 'Catch game demo: the round mascot catches falling stars and dodges bombs on a dark booth stage':'เดโมเกม Catch ตัวละครกลมรับดาวที่ตกลงมาและหลบระเบิดบนเวทีบูธสีเข้ม',
 'Catch, one of the demos in our Playground.':'Catch หนึ่งในเดโมจากพื้นที่ทดลองของเรา',
 'START WITH YOUR GOAL':'เริ่มจากเป้าหมายของคุณ',
 'Games that start from what your brand wants.':'เกมที่เริ่มจากสิ่งที่แบรนด์อยากได้',
 'We start with one question: when the game ends, what do you want players to remember or do next? Some events want people to discover a new product, some want a list of interested visitors, and some simply want the liveliest booth in the hall. The answer lets us choose the game format, the rules, and the pace of play.':'เราเริ่มจากคำถามเดียว: เล่นจบแล้ว คุณอยากให้ผู้เล่นจำอะไรหรือทำอะไรต่อ บางงานอยากให้คนรู้จักสินค้ารุ่นใหม่ บางงานอยากได้รายชื่อคนที่สนใจ และบางงานแค่อยากให้บูธคึกคักที่สุดในฮอลล์ คำตอบนี้ทำให้เราเลือกแนวเกม กติกา และจังหวะการเล่นได้ตรงจุด',
 'Every game is designed for your brand: your logo, colours, products that become in-game items, and campaign messages. You don’t need a game idea first. Tell us your goal and your audience, and we’ll take it from there.':'ทุกเกมออกแบบเพื่อแบรนด์ของคุณ ทั้งโลโก้ สี สินค้าที่กลายเป็นไอเทมในเกม และข้อความแคมเปญ คุณไม่ต้องมีไอเดียเกมมาก่อน แค่บอกเป้าหมายและกลุ่มผู้ร่วมงาน เราช่วยคิดต่อให้',
 'TRY BEFORE YOU BRIEF':'ลองก่อนส่งบรีฟ',
 'Play first,':'ลองเล่นก่อน',
 'then let’s talk.':'แล้วค่อยคุยกัน',
 'In our Playground you can play sample games right in your browser, such as Catch, Tap the Right Item, Memory Match, Lucky Wheel, and Quick Quiz. Some let you upload your own product images. Found a style you like? Bring it to our first conversation.':'ในพื้นที่ทดลองของเรา คุณเล่นเกมตัวอย่างได้จริงบนเบราว์เซอร์ เช่น Catch, Tap the Right Item, Memory Match, Lucky Wheel และ Quick Quiz บางเกมอัปโหลดภาพสินค้าของคุณเข้าไปลองได้เลย เล่นแล้วชอบแนวไหน หยิบมาเป็นจุดเริ่มคุยกันได้ทันที',
 'These demos are a starting point. Your game is designed fresh to fit your brand, your space, and the screens you will actually use.':'เดโมเหล่านี้เป็นจุดตั้งต้น เกมจริงของคุณจะออกแบบใหม่ให้เข้ากับแบรนด์ พื้นที่ และจอที่ใช้จริง',
 'WHAT YOU GET':'สิ่งที่คุณได้',
 'We check feasibility and build one prototype version for you to try before you decide.':'เราตรวจความเป็นไปได้ และทำ prototype หนึ่งเวอร์ชันให้คุณลองก่อนตัดสินใจ',
 'Show day':'วันงาน',
 'We test the full system before the doors open, and the team who wrote the program is on site from opening to close.':'ทดสอบระบบทั้งหมดก่อนเปิดงาน และทีมที่เขียนโปรแกรมเองอยู่หน้างานตั้งแต่เปิดจนปิด',
 'After the event':'หลังจบงาน',
 'A summary of players and engagement to plan your next event (if you want this data).':'สรุปจำนวนผู้เล่นและการมีส่วนร่วม ไว้วางแผนงานครั้งต่อไป (ถ้าคุณต้องการข้อมูลนี้)',
 'A system you can update, move, or expand. Invest once and keep using it.':'ระบบที่อัปเดต ย้ายงาน หรือต่อยอดได้ ลงทุนครั้งเดียวแล้วใช้ต่อ',
 'Want a list of interested visitors? We can add a sign-up form or QR scan before play, with the PDPA consent step you approve.':'ถ้าคุณอยากได้รายชื่อผู้สนใจ เราเพิ่มการลงทะเบียนหรือสแกน QR ก่อนเล่นได้ พร้อมขั้นตอนขอความยินยอมตาม PDPA ที่คุณอนุมัติ',
 'Our real on-site work':'ผลงานหน้างานจริงของเรา',
 'View our work':'ดูผลงานทั้งหมด',
 'See the booth games we have built for events on our portfolio page.':'คุณสามารถชมผลงานการสร้างเกมสำหรับบูธในงานอีเวนต์ได้ที่หน้าผลงานของเรา',
 'START WITH A SHORT BRIEF':'เริ่มจากบรีฟสั้น ๆ',
 'Five things are enough to start.':'ส่ง 5 เรื่องมาก่อนก็พอ',
 'Send us your activity goal, your players, the event date, your booth size, and the screen you plan to use. If you liked a game in our Playground, mention it too. We’ll reply with a direction and a scope of work.':'เป้าหมายของกิจกรรม, กลุ่มผู้เล่น, วันงาน, ขนาดบูธ และจอที่จะใช้ ถ้ามีเกมที่ชอบจากพื้นที่ทดลอง แนบมาด้วย เราจะตอบกลับพร้อมแนวทางและขอบเขตงาน',
 'Send us your brief':'ส่งบรีฟให้เรา',
 'Not sure which game yet? Read our event booth game articles.':'ยังเลือกแนวเกมไม่ได้? อ่านบทความเรื่องเกมบูธอีเวนต์ก่อน',
 'Questions about':'คำถามเรื่อง',
 'booth games.':'เกมบูธ',
 'Booth game details':'รายละเอียดเกมบูธ'
}).forEach(([en,th])=>add(en,th));

// Event Booth Games topic guide (P1): owner-reviewed Thai copy, 2026-10-30.
const boothGuide = topicGuides['event-booth-games'];
const thaiBoothGuide = {
 title:'เกมบูธอีเวนต์ คู่มือเลือกเกมออกบูธให้คนอยากเล่น',
 description:'เลือกเกมบูธจากเป้าหมาย ผู้เล่น และพื้นที่ เทียบเกมตอบคำถาม จับคู่ รับไอเทม วงล้อสุ่ม พร้อมวิธีวางคิว งบ และการเก็บ lead',
 lead:'เกมบูธที่ดีเริ่มจากคำถามว่า คุณอยากให้ผู้ร่วมงานทำอะไรและจำอะไรกลับไป จากนั้นเลือกวิธีเล่นที่เข้าใจได้ในไม่กี่วินาที เล่นจบไวพอให้คิวเดิน และเข้ากับพื้นที่บูธจริง คู่มือนี้พาคุณไล่ตั้งแต่เลือกแนวเกมจนถึงวันงาน',
 sections:[
  ['เริ่มจากเป้าหมาย ไม่ใช่ชื่อเกม',['เกมที่เหมาะกับแบรนด์คุณ อาจไม่ใช่เกมที่คนเล่นเยอะในบูธของคนอื่น ลองเลือกเป้าหมายหลักหนึ่งข้อก่อน แล้วเกมที่เหมาะจะชัดขึ้นเอง'],[
   ['ให้คนเข้าใจจุดเด่นสินค้า','เกมตอบคำถาม ที่ใช้คำเฉลยเล่าเรื่องสินค้า','Quick Quiz'],
   ['ให้คนจำหน้าตาสินค้าหลายรุ่น','เกมจับคู่ภาพ','Memory Match'],
   ['ให้บูธคึกคัก คนยืนดูเยอะ','เกมรับไอเทม หรือเกมแตะเป้าหมายจับเวลา','Catch, Tap the Right Item'],
   ['แจกของรางวัลและเก็บรายชื่อ','วงล้อสุ่ม พร้อมลงทะเบียนก่อนหมุน','Lucky Wheel'],
   ['ให้คนขยับตัว เป็นภาพที่คนอยากถ่าย','เกมเซนเซอร์จับการเคลื่อนไหว บนจอ LED หรือโปรเจกชัน','ดูผลงาน LAZADA Run']
  ]],
  ['คนเดินผ่านต้องเข้าใจได้ในไม่กี่วินาที',['ในฮอลล์งานอีเวนต์ คนตัดสินใจเร็วมากว่าจะหยุดหรือเดินต่อ เกมที่ดีจึงต้องเห็นแล้วเข้าใจทันทีว่าเล่นอย่างไร โดยไม่ต้องอ่านกติกายาว และคนที่ยืนดูอยู่ก็สนุกไปด้วย','เกมรอบสั้นที่จับเวลาชัดเจนช่วยให้คิวเดินเร็ว เวลาคำนวณคิว ให้นับเวลาอธิบายกติกา เปลี่ยนคน และแจกรางวัลรวมด้วย ไม่ใช่นับแค่เวลาในเกม ตัวอย่างสมมติ: เล่น 45 วินาที บวกเปลี่ยนคน 15 วินาที เท่ากับรอบละ 1 นาที หนึ่งจอจะรับได้ไม่เกินชั่วโมงละ 60 รอบ']],
  ['จอ พื้นที่ และวิธีควบคุม',['เกมเดียวกันอาจเล่นบนทัชสกรีน จอ LED หรือโปรเจกเตอร์ แต่ประสบการณ์ต่างกันมาก ทัชสกรีนเหมาะกับบูธเล็กและเกมที่ต้องเลือกคำตอบ ส่วนเซนเซอร์จับการเคลื่อนไหวต้องการพื้นที่ยืนและแสงที่เหมาะ แต่เรียกคนดูได้มากกว่า','เกมของ JPM Media Space ใช้กับจอที่คุณมีอยู่แล้วได้ แค่แจ้งขนาดจอ ความละเอียด และผังบูธ เราออกแบบให้พอดีกับระยะที่คนยืนเล่นจริง']],
  ['ได้มากกว่าคนเดินผ่าน: เก็บ lead และสรุปผล',['เกมเป็นจังหวะที่เหมาะที่สุดในการขอข้อมูล เพราะคนอยากเล่นอยู่แล้ว เราเพิ่มการลงทะเบียนหรือสแกน QR ก่อนเล่นได้ พร้อมขั้นตอนขอความยินยอมตาม PDPA ที่คุณอนุมัติ หลังจบงานคุณจะได้สรุปจำนวนผู้เล่นและการมีส่วนร่วม ไว้วางแผนงานครั้งต่อไป']],
  ['งบ บรีฟ และเวลา',[`พอเลือกแนวเกมได้ คำถามต่อไปคืองบและเวลา แพ็กเกจงานอีเวนต์เริ่มต้นที่ ${thaiEventPrice(0)} สำหรับงานทัชสกรีน และใช้เวลาทำอย่างน้อย 1 สัปดาห์ ขึ้นกับเกมและเนื้อหา บรีฟที่ครบตั้งแต่แรกทำให้ใบเสนอราคาแม่นและเริ่มงานได้เร็ว`]]
 ],
 faqs:[
  ['เกมแบบไหนเหมาะกับแบรนด์เรา?','เริ่มจากสิ่งที่อยากให้คนจำ แล้วเทียบกับตารางด้านบน ถ้ายังไม่แน่ใจ ส่งธีมงานมา เราช่วยคัดให้ได้'],
  ['ต้องมีจอเองไหม?','ใช่ แพ็กเกจไม่รวมจอและโปรเจกเตอร์ แต่เกมของเราใช้กับจอที่คุณหรือผู้จัดงานมีได้'],
  ['เก็บข้อมูลผู้เล่นได้ไหม?','ได้ ด้วยการลงทะเบียนหรือ QR ก่อนเล่น พร้อมขั้นตอนขอความยินยอมตาม PDPA']
 ]
};
['title','description','lead'].forEach(key=>add(boothGuide[key],thaiBoothGuide[key]));
boothGuide.sections.forEach(([title,paras,rows],i)=>{const [th,thParas,thRows]=thaiBoothGuide.sections[i];add(title,th);paras.forEach((p,j)=>add(p,thParas[j]));(rows||[]).forEach((row,r)=>[0,1,2].forEach(c=>add(row[c],thRows[r][c])));});
boothGuide.faqs.forEach(([q,a],i)=>{add(q,thaiBoothGuide.faqs[i][0]);add(a,thaiBoothGuide.faqs[i][1]);});
Object.entries({
 'Event booth games:':'เกมบูธอีเวนต์:',
 'a guide to choosing the right game.':'คู่มือเลือกเกมให้เข้ากับแบรนด์และพื้นที่',
 'Main goal':'เป้าหมายหลัก',
 'Game format that fits':'แนวเกมที่เข้ากัน',
 'Try it':'ลองเดโม',
 'Send us your event theme':'ส่งธีมงานให้เราช่วยเลือกเกม',
 'IN THIS TOPIC':'ในหมวดนี้',
 'Articles on this topic':'บทความในหมวดนี้',
 'Read next: Booth game ideas for brands':'อ่านต่อ: ไอเดียเกมออกบูธสำหรับแบรนด์'
}).forEach(([en,th])=>add(en,th));

// Thai copy polish (2026-10-16): entries whose Thai text is shared by several
// English keys or built in code. Applied last so they take precedence.
Object.entries({
 "Say hello.":'ติดต่อเราได้เลย',
 "Your next idea.":'ไอเดียใหม่ของคุณ',
 "Our next conversation.":'เริ่มได้แค่ลองคุยกับเรา'
}).forEach(([en,th])=>add(en,th));
export function translateThai(text) {
 const key=text.replace(/\s+/g,' ').trim();
 if (thaiCopy.has(key)) return thaiCopy.get(key);
 for(const [en,th] of thaiCopy) if(en.toLowerCase()===key.toLowerCase()) return th;
 if(key.endsWith(' — JPM Media Space')) return translateThai(key.slice(0,-18))+' — JPM Media Space';
 if(key.startsWith(': ')) return ': '+translateThai(key.slice(2));
 if(key==='— current section') return '— หมวดปัจจุบัน';
 if(key.startsWith('View project reference: ')) return 'ดูผลงานอ้างอิง: '+translateThai(key.slice(24));
 if(key.startsWith('Explore ') && /Catch Game|Scratch Reveal|Product Explorer|Atmosphere Room|Projection Room|Sensor Trigger|RFID Product Display|Experience Builder|Your Brand’s Game|Tap the Right Item|Memory Match|Light Canvas/.test(key)) return key.replace('Explore ','สำรวจ ');
 if(key.endsWith(' project video')) return 'วิดีโอโครงการ '+key.slice(0,-14);
 if(key.endsWith(' project reference')) return 'ผลงานอ้างอิง '+key.slice(0,-18);
 if(key.endsWith(' installation reference')) return 'ภาพอ้างอิง '+translateThai(key.slice(0,-23));
 if(/ — (Touchscreen|Immersive) Project$/.test(key)) { const [name,kind]=key.split(/ — (?=(?:Touchscreen|Immersive) Project$)/); return translateThai(name)+(kind.startsWith('Touch')?' — ผลงานแอปพลิเคชันทัชสกรีน':' — ผลงานอิมเมอร์ซีฟ'); }
 if(key.endsWith(' in the JPM Media Space portfolio, with project video and original credits.')) { const [name,rest]=key.split(/: (?=(?:a touchscreen application|an immersive and interactive experience) in the JPM)/); return translateThai(name)+(rest.startsWith('a touch')?' — แอปพลิเคชันทัชสกรีน':' — ประสบการณ์อิมเมอร์ซีฟและอินเทอร์แอคทีฟ')+'ในผลงานของ JPM Media Space พร้อมวิดีโอโครงการและเครดิตตามต้นฉบับ'; }
 if(key.includes(': an existing ') && key.endsWith('portfolio reference with project video and original attribution.')) return key.split(': an existing ')[0]+' — ผลงานอ้างอิงพร้อมวิดีโอโครงการและเครดิตตามต้นฉบับ';
 if (/^0[1-9] \/ /.test(key)) {const [n,...rest]=key.split(' / ');return n+' / '+translateThai(rest.join(' / '));}
 if (/^(TOUCHSCREEN|IMMERSIVE) \/ PROJECT REFERENCE$/.test(key)) return (key.startsWith('TOUCH')?'ทัชสกรีน':'อิมเมอร์ซีฟ')+' / ผลงานอ้างอิง';
 if (/Portfolio with Employer/.test(key)) return key.replaceAll('Portfolio with Employer','ผลงานร่วมกับนายจ้างเดิม');
 if (/^\d+ min read$/.test(key)) return 'อ่าน '+key.split(' ')[0]+' นาที';
 if (/^Catch falling sparks\. You have \d+ seconds\.$/.test(key)) return 'รับไอเทมที่ตกลงมา คุณมีเวลา '+key.match(/\d+/)[0]+' วินาที';
 if (/^Avoid the red objects! Score \d+\.$/.test(key)) return 'หลบไอเทมสีแดง! คะแนน '+key.match(/\d+/)[0];
 if (/^Caught! Score \d+\.$/.test(key)) return 'รับได้แล้ว! คะแนน '+key.match(/\d+/)[0];
 if (/^You scored \d+ points\. Ready for another round\?$/.test(key)) return 'คุณได้ '+key.match(/\d+/)[0]+' คะแนน พร้อมเล่นอีกรอบไหม?';
 if (/^Your score is \d+\. Resume when you’re ready\.$/.test(key)) return 'คะแนนของคุณคือ '+key.match(/\d+/)[0]+' พร้อมแล้วกดเล่นต่อได้เลย';
 if (/^Game over\. Final score \d+ points\.$/.test(key)) return 'จบเกม ได้ทั้งหมด '+key.match(/\d+/)[0]+' คะแนน';
 if (/^\d+ (projects|items) shown\.$/.test(key)) return 'แสดง '+key.match(/\d+/)[0]+' รายการ';
 return text;
}
