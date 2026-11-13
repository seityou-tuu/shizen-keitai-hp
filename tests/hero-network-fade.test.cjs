require('./register-ts.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boundaryOpacity, connectionOpacity, approachOpacity, lineFadeStops } = require('../lib/hero-network-fade.ts');
const photo = { x: 448, y: 0, width: 832, height: 900 };

test('photo boundary fades to zero before the safety clip, with full strength away from it', () => {
  const sample = x => boundaryOpacity({ x, y: 300 }, 1280, 900, [photo]);
  assert.equal(sample(350), 1);
  assert(sample(400) < sample(380));
  assert(sample(430) < sample(400));
  assert.equal(sample(446), 0);
  assert.equal(sample(448), 0);
  assert.equal(sample(500), 0);
});
test('a crossing line has zero-opacity stops at exact photo and Canvas boundaries', () => {
  const stops = lineFadeStops({ x: 350, y: 300 }, { x: 510, y: 300 }, 1280, 900, [photo], []);
  const boundary = stops.find(s => Math.abs(s.offset - (446 - 350) / 160) < 1e-9);
  assert.equal(boundary.opacity, 0);
  assert(stops[0].opacity > .99);
  assert.equal(stops.at(-1).opacity, 0);
  const outer = lineFadeStops({ x: -10, y: 150 }, { x: 80, y: 150 }, 1280, 900, [], []);
  assert.equal(outer.find(s => Math.abs(s.offset - 10 / 90) < 1e-9).opacity, 0);
});
test('distance and time fades approach zero continuously instead of toggling visibility', () => {
  assert(connectionOpacity(170, 175) > connectionOpacity(174, 175));
  assert(connectionOpacity(174, 175) > 0);
  assert.equal(connectionOpacity(175, 175), 0);
  assert.equal(connectionOpacity(176, 175), 0);
  assert(approachOpacity(.5, 0, .033) > 0);
  assert(approachOpacity(0, .5, .033) < .5);
  assert.equal(approachOpacity(.3, .5, 0), .3);
});
test('line emphasis near text is reduced through a soft transition', () => {
  const a = { x: 100, y: 300 }, b = { x: 200, y: 300 };
  const plain = lineFadeStops(a, b, 1280, 900, [], []);
  const protectedText = lineFadeStops(a, b, 1280, 900, [], [{ x: 90, y: 290, width: 120, height: 30 }]);
  assert.equal(protectedText[0].opacity, plain[0].opacity * .5);
});
