import { rfidProductDemo } from './rfid-demo.mjs';
import { immersiveRoomDemo } from './immersive-demo.mjs';
import { services } from '../content/en/site.mjs';
import { button } from './components.mjs';
export const serviceDemoAnchors={games:'catch-game',touch:'product-explorer',immersive:'atmosphere-room',sensors:'sensor-trigger',custom:'demo-library',projection:'light-canvas'};
export function serviceDemoNavigation() {
 return `<section class="wrap demo-service-nav" aria-label="Try a demo for each service"><p>Explore our services through playable examples. Customize each game in its own panel.</p><div class="tag-list">${services.map(service=>`<a href="#${serviceDemoAnchors[service.id]}">${service.title}</a>`).join('')}</div></section>`;
}
function demo(id,service,title,intro,note,content) {
 const name=services.find(item=>item.id===service).title;
 return `<section class="wrap section demo-section" id="${id}"><div class="demo-description"><p class="eyebrow">${name}</p><h2>${title}</h2><p>${intro}</p><p class="demo-note">${note}</p>${button('contact.html?service='+encodeURIComponent(name),'Discuss your idea',true)}<a class="text-link demo-back-link" href="#demo-library">Back to demos</a></div><div class="surface simple-demo requires-js">${content}</div></section>`;
}
export function additionalServiceDemos() {
 return immersiveRoomDemo()
 +rfidProductDemo()
 +demo('light-canvas','projection','Make your mark.<br><span class="gradient-text">Paint with light.</span>','Draw with your mouse or finger, choose a color, and switch between an LED grid and a projection surface.','A digital canvas concept. Draw directly on the surface with a mouse or finger.',`
 <div class="light-stage" data-display="led"><canvas id="light-drawing" role="img" aria-label="Light drawing canvas"></canvas><span class="light-grid" aria-hidden="true"></span></div>
 <div class="simple-controls" role="group" aria-label="Choose drawing color"><button class="pill active" data-light-color="violet" aria-pressed="true">Violet</button><button class="pill" data-light-color="blue" aria-pressed="false">Blue</button><button class="pill" data-light-color="gold" aria-pressed="false">Gold</button></div><div class="simple-controls" role="group" aria-label="Choose display surface"><button class="pill active" data-light-display="led" aria-pressed="true">LED grid</button><button class="pill" data-light-display="projection" aria-pressed="false">Projection</button></div><label class="demo-range-label" for="light-size">Brush size</label><input id="light-size" type="range" min="3" max="24" value="9"><div class="simple-controls"><button class="pill" id="light-clear">Clear canvas</button></div><p id="light-status" class="demo-feedback" role="status">Draw on the surface.</p>`);
}
