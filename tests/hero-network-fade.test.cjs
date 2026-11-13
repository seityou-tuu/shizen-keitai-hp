require('./register-ts.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boundaryOpacity, connectionOpacity, approachOpacity, lineFadeStops } = require('../lib/hero-network-fade.ts');
const { backgroundPocket, expandRect, segmentClearanceOpacity, segmentIntersectsRect } = require('../lib/hero-network-fade.ts');
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
test('a whole segment is rejected when it crosses protected copy, even with endpoints outside', () => {
  const text = { x: 60, y: 80, width: 20, height: 40 };
  assert(segmentIntersectsRect({ x: 10, y: 100 }, { x: 110, y: 100 }, text));
  assert.equal(segmentClearanceOpacity({ x: 10, y: 100 }, { x: 110, y: 100 }, [text]), 0);
  assert(segmentClearanceOpacity({ x: 10, y: 70 }, { x: 110, y: 70 }, [text]) < 1);
  assert.equal(segmentClearanceOpacity({ x: 10, y: 20 }, { x: 110, y: 20 }, [text]), 1);
});
test('photo clearance is a no-line area before the actual photograph', () => {
  const forbidden = [expandRect(photo, 56)];
  assert.equal(segmentClearanceOpacity({ x: 350, y: 300 }, { x: 420, y: 300 }, forbidden), 0);
  assert.equal(segmentClearanceOpacity({ x: 300, y: 300 }, { x: 350, y: 300 }, forbidden), 1);
});
test('ambient light pockets stay away from desktop and mobile photographs', () => {
  const desktop = backgroundPocket(1280, 900, [photo]);
  assert(desktop.x + desktop.width <= photo.x - 48);
  const mobile = backgroundPocket(390, 900, [{ x: 0, y: 0, width: 390, height: 300 }]);
  assert(mobile.y >= 348);
  assert(mobile.width > 0 && mobile.height > 0);
});
test('fully covered backgrounds yield an empty safe pocket', () => {
  const empty = backgroundPocket(100, 100, [{ x: 0, y: 0, width: 100, height: 100 }]);
  assert.equal(empty.width * empty.height, 0);
});
