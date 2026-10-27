import test from 'node:test';
import assert from 'node:assert/strict';
import { CatchEngine, normalizeConfig } from '../catch-engine.mjs';
const config = normalizeConfig({ durationSeconds: 5, spawnIntervalMs: 100, fallSpeed: 1 });
test('catches falling objects inside the basket and ignores missed objects', () => {
  const game = new CatchEngine(config,()=>.5); game.start();
  game.objects = [{id:1,x:.5,y:.89},{id:2,x:.05,y:.89}];
  game.tick(.04); assert.equal(game.score,10); assert.equal(game.objects.length,1);
  game.tick(.3); assert.equal(game.score,10);
});
test('pause freezes score, objects, and countdown; resume continues', () => {
  const game = new CatchEngine(config); game.start(); game.tick(.3); game.pause();
  const before = JSON.stringify(game); game.tick(2); assert.equal(JSON.stringify(game),before);
  game.resume(); game.tick(.2); assert.equal(game.remaining,4.5);
});
test('game ends at zero; restart clears previous round and clamps movement', () => {
  const game = new CatchEngine(config); game.start(); game.tick(5);
  assert.equal(game.state,'finished'); assert.equal(game.remaining,0);
  game.tick(10); assert.equal(game.remaining,0); game.start();
  assert.equal(game.score,0); assert.equal(game.objects.length,0); assert.equal(game.remaining,5);
  game.move(-10); assert.equal(game.basketX,game.catchWidth/2);
  game.move(10); assert.equal(game.basketX,1-game.catchWidth/2);
});
test('configuration rejects invalid numbers and unsafe image paths', () => {
  const sanitized = normalizeConfig({ durationSeconds:-1,spawnIntervalMs:0,fallSpeed:NaN,objectImage:'../../secret.png',accentColor:'red' });
  assert.equal(sanitized.durationSeconds,1);assert.equal(sanitized.spawnIntervalMs,100);assert.equal(sanitized.fallSpeed,.23);assert.equal(sanitized.objectImage,'');assert.equal(sanitized.accentColor,'#9498B3');
});
test('hazards deduct points, never go below zero, and are removed on collision',()=>{
 const game=new CatchEngine(config);game.start();game.score=20;
 game.objects=[{id:1,x:.5,y:.89,hazard:true}];game.tick(.04);
 assert.equal(game.score,10);assert.equal(game.objects.length,0);assert.equal(game.lastCatch,'hazard');assert.equal(game.catchCount,1);
 game.score=0;game.objects=[{id:2,x:.5,y:.89,hazard:true}];game.tick(.04);
 assert.equal(game.score,0);assert.equal(game.catchCount,2);
 game.objects=[{id:3,x:.5,y:.89,hazard:false}];game.tick(.04);
 assert.equal(game.score,10);assert.equal(game.lastCatch,'spark');
 game.objects=[{id:4,x:.05,y:.89,hazard:true}];game.tick(.04);assert.equal(game.score,10);
 game.start();assert.equal(game.catchCount,0);assert.equal(game.lastCatch,null);
});
test('hazard spawning follows the configured probability and safe limits',()=>{
 const draws=[.5,.1,.5,.9];let i=0;
 const game=new CatchEngine(config,()=>draws[i++]);game.start();game.tick(.2);
 assert.deepEqual(game.objects.map(o=>o.hazard),[true,false]);
 const safe=normalizeConfig({hazardChance:5,hazardPenalty:-20});
 assert.equal(safe.hazardChance,.75);assert.equal(safe.hazardPenalty,1);
 const disabled=new CatchEngine(normalizeConfig({hazardChance:0}),()=>0);disabled.start();disabled.tick(.7);
 assert.equal(disabled.objects[0].hazard,false);
});
