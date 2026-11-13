require('../tests/register-ts.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { lineFadeStops } = require('../lib/hero-network-fade.ts');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3160';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const report = { pages: [], crossing: null };
  try {
    for (const width of [390, 1280]) for (const route of ['/', '/recruitment/first']) {
      const p = await b.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: width === 390 ? 3 : 2, reducedMotion: 'reduce' });
      const errors = []; p.on('pageerror', e => errors.push(e.message));
      await p.addInitScript(() => {
        window.fadeQA = { gradients: 0, uniform: 0 };
        const stroke = CanvasRenderingContext2D.prototype.stroke;
        CanvasRenderingContext2D.prototype.stroke = function (...args) {
          if (this.canvas.classList.contains('hero-network') && this.lineWidth === .75) {
            window.fadeQA[this.strokeStyle instanceof CanvasGradient ? 'gradients' : 'uniform']++;
          }
          return stroke.apply(this, args);
        };
      });
      await p.goto(base + route, { waitUntil: 'networkidle' });
      await p.emulateMedia({ reducedMotion: 'no-preference' });
      await p.waitForTimeout(700);
      const result = await p.evaluate(async () => {
        const canvas = document.querySelector('.hero-network'), ctx = canvas.getContext('2d');
        const first = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        await new Promise(resolve => setTimeout(resolve, 700));
        const final = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let moving = 0; for (let i = 3; i < first.length; i += 4) if (Math.abs(first[i] - final[i]) > 2) moving++;
        const box = canvas.getBoundingClientRect(), photo = canvas.parentElement.querySelector('.hero-photograph, .cohort-hero-photo').getBoundingClientRect();
        const scale = canvas.width / box.width; let photoAlpha = 0;
        for (let y = Math.max(0, Math.ceil((photo.top - box.top + 2) * scale)); y < Math.min(canvas.height, (photo.bottom - box.top - 2) * scale); y += 5)
          for (let x = Math.max(0, Math.ceil((photo.left - box.left + 2) * scale)); x < Math.min(canvas.width, (photo.right - box.left - 2) * scale); x += 5)
            photoAlpha = Math.max(photoAlpha, final[(y * canvas.width + x) * 4 + 3]);
        return { ...window.fadeQA, moving, photoAlpha, devicePixelRatio, canvasRatio: scale };
      });
      // Protected copy can leave no eligible connection in a small viewport.
      assert.equal(result.uniform, 0); assert(result.moving > 0); assert.equal(result.photoAlpha, 0); assert.deepEqual(errors, []);
      report.pages.push({ width, route, ...result, errors }); await p.close();
    }
    const p = await b.newPage();
    const stops = lineFadeStops({ x: 350, y: 50 }, { x: 510, y: 50 }, 1280, 900, [{ x: 448, y: 0, width: 832, height: 900 }], []);
    report.crossing = await p.evaluate(stops => {
      const profile = {};
      for (const mode of ['before', 'after']) {
        const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 100;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.beginPath(); ctx.rect(0, 0, 640, 100); ctx.rect(447, -1, 834, 902); ctx.clip('evenodd');
        let style = 'rgba(219,199,155,.5)';
        if (mode === 'after') { style = ctx.createLinearGradient(350, 50, 510, 50); stops.forEach(s => style.addColorStop(s.offset, `rgba(219,199,155,${.5 * s.opacity})`)); }
        ctx.strokeStyle = style; ctx.lineWidth = .75; ctx.beginPath(); ctx.moveTo(350, 50); ctx.lineTo(510, 50); ctx.stroke();
        profile[mode] = [375, 390, 405, 420, 435, 442, 445, 446, 447, 448].map(x => ({ x, alpha: ctx.getImageData(x, 50, 1, 1).data[3] }));
      }
      return profile;
    }, stops);
    assert(report.crossing.before.find(p => p.x === 446).alpha > 0);
    assert.equal(report.crossing.after.find(p => p.x === 446).alpha, 0);
    const alpha = report.crossing.after.map(p => p.alpha); assert(alpha.every((value, i) => i === 0 || value <= alpha[i - 1]));
    if (process.env.QA_OUTPUT_DIR) { fs.mkdirSync(process.env.QA_OUTPUT_DIR, { recursive: true }); fs.writeFileSync(`${process.env.QA_OUTPUT_DIR}/fade-browser.json`, JSON.stringify(report, null, 2)); }
    console.log(JSON.stringify(report, null, 2));
  } finally { await b.close(); }
})().catch(e => { console.error(e); process.exit(1); });
