// Browser-independent game rules, also exercised by the unit checks.
export class CatchEngine {
  constructor(config, random = Math.random) {
    this.config = config;
    this.random = random;
    this.catchWidth = .18;
    this.reset();
  }
  reset() { this.state = 'ready'; this.score = 0; this.remaining = this.config.durationSeconds; this.objects = []; this.basketX = .5; this.spawnClock = 0; this.nextId = 1; this.catchCount = 0; this.lastCatch = null; }
  start() { this.reset(); this.state = 'playing'; }
  pause() { if (this.state === 'playing') this.state = 'paused'; }
  resume() { if (this.state === 'paused') this.state = 'playing'; }
  move(x) { this.basketX = Math.max(this.catchWidth / 2, Math.min(1 - this.catchWidth / 2, x)); }
  tick(seconds) {
    if (this.state !== 'playing' || seconds <= 0) return;
    const dt = Math.min(seconds, this.remaining);
    this.remaining = Math.max(0, this.remaining - dt);
    this.spawnClock += dt;
    const interval = this.config.spawnIntervalMs / 1000;
    while (this.spawnClock >= interval) {
      this.spawnClock -= interval;
      this.objects.push({ id: this.nextId++, x: .06 + this.random() * .88, y: -.05, hazard: this.random() < this.config.hazardChance });
    }
    this.objects = this.objects.filter(object => {
      const previous = object.y;
      object.y += this.config.fallSpeed * dt;
      if (previous < .91 && object.y >= .91 && Math.abs(object.x - this.basketX) <= this.catchWidth / 2 + .025) {
        this.score = Math.max(0, this.score + (object.hazard ? -this.config.hazardPenalty : this.config.pointsPerCatch));
        this.catchCount++;
        this.lastCatch = object.hazard ? 'hazard' : 'spark';
        return false;
      }
      return object.y < 1.08;
    });
    if (this.remaining === 0) this.state = 'finished';
  }
}
export function normalizeConfig(raw = {}) {
  const number = (key, fallback, min, max) => Number.isFinite(raw[key]) ? Math.max(min,Math.min(max,raw[key])) : fallback;
  return {
    brandName: String(raw.brandName || 'JPM Media Space').slice(0,60),
    durationSeconds: number('durationSeconds',30,1,180),
    spawnIntervalMs: number('spawnIntervalMs',700,100,3000),
    fallSpeed: number('fallSpeed',.23,.1,3),
    pointsPerCatch: number('pointsPerCatch',10,1,1000),
    hazardChance: number('hazardChance',.25,0,.75),
    hazardPenalty: number('hazardPenalty',10,1,1000),
    accentColor: /^#[\da-f]{6}$/i.test(raw.accentColor || '') ? raw.accentColor : '#9498B3',
    objectImage: /^assets\/[a-z\d _./%-]+\.(png|webp|jpg|svg)$/i.test(raw.objectImage || '') && !raw.objectImage.includes('..') ? raw.objectImage : '',
    objectSymbol: String(raw.objectSymbol || '✦').slice(0,4)
  };
}
