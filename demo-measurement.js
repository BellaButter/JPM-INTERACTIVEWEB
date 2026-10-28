// One first-use signal per demo per page load, including keyboard/touch play.
// No player input, uploaded media, names or scores are included.
const started = new Set();
export function demoStarted(demoId) {
  if (started.has(demoId)) return;
  started.add(demoId);
  document.dispatchEvent(new CustomEvent('jpm:demo-start', { detail: { demo_id: demoId } }));
}
