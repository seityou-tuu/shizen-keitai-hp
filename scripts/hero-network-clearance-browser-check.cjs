const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3160';
assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const out = process.env.QA_OUTPUT_DIR || 'work/network-clearance';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const report = [];
  try {
    for (const width of [390, 1280, 1440]) for (const route of ['/', '/recruitment/first']) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => {
        let seed = 23; Math.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
        window.clearanceQA = { lines: 0, maxLength: 0, textCrossings: 0, photoCrossings: 0, bandStrokes: 0, softLightFills: 0 };
        const move = CanvasRenderingContext2D.prototype.moveTo, line = CanvasRenderingContext2D.prototype.lineTo;
        const stroke = CanvasRenderingContext2D.prototype.stroke, fill = CanvasRenderingContext2D.prototype.fill;
        CanvasRenderingContext2D.prototype.moveTo = function (x, y) { this.qaA = { x, y }; return move.call(this, x, y); };
        CanvasRenderingContext2D.prototype.lineTo = function (x, y) { this.qaB = { x, y }; return line.call(this, x, y); };
        CanvasRenderingContext2D.prototype.fill = function (...args) {
          if (this.canvas.classList.contains('hero-network') && this.fillStyle instanceof CanvasGradient) window.clearanceQA.softLightFills++;
          return fill.apply(this, args);
        };
        CanvasRenderingContext2D.prototype.stroke = function (...args) {
          if (this.canvas.classList.contains('hero-network') && window.clearanceMasks) {
            const q = window.clearanceQA;
            if (this.lineWidth !== .75) q.bandStrokes++;
            else {
              q.lines++; const a = this.qaA, b = this.qaB, length = Math.hypot(a.x - b.x, a.y - b.y); q.maxLength = Math.max(q.maxLength, length);
              const hits = rectangles => {
                for (let i = 0; i <= Math.ceil(length / 2); i++) {
                  const t = i / Math.max(1, Math.ceil(length / 2)), x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
                  if (rectangles.some(r => x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height)) return true;
                }
                return false;
              };
              if (hits(window.clearanceMasks.text)) q.textCrossings++;
              if (hits(window.clearanceMasks.photos)) q.photoCrossings++;
            }
          }
          return stroke.apply(this, args);
        };
      });
      await page.goto(base + route, { waitUntil: 'networkidle' });
      if (route === '/' && [390, 1280].includes(width)) {
        await page.screenshot({ path: `${out}/${width === 1280 ? 'after-all' : 'after-mobile'}.png` });
        if (width === 1280) {
          const photo = await page.locator('.hero-photograph').boundingBox(), heading = await page.locator('h1').boundingBox();
          await page.screenshot({ path: `${out}/after-detail.png`, clip: { x: photo.x - 180, y: heading.y, width: 360, height: heading.height } });
        }
      }
      await page.evaluate(() => {
        const canvas = document.querySelector('.hero-network'), root = canvas.parentElement, box = canvas.getBoundingClientRect();
        const rect = (r, margin) => ({ x: r.left - box.left - margin, y: r.top - box.top - margin, width: r.width + margin * 2, height: r.height + margin * 2 });
        // Independent glyph rectangles, not the component's block-level rectangles.
        const text = [];
        root.querySelectorAll('.hero-statement, .cohort-hero-heading, .cohort-hero-details, .cohort-launch-facts').forEach(block => {
          const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT); let node;
          while (node = walker.nextNode()) if (node.textContent.trim()) {
            const range = document.createRange(); range.selectNodeContents(node);
            for (const r of range.getClientRects()) if (r.width > 0 && r.height > 0) text.push(rect(r, 20));
          }
        });
        window.clearanceMasks = { text, photos: [...root.querySelectorAll('.hero-photograph, .cohort-hero-photo')].map(el => rect(el.getBoundingClientRect(), 48)) };
      });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.waitForTimeout(1800);
      const result = await page.evaluate(async () => {
        const canvas = document.querySelector('.hero-network'), ctx = canvas.getContext('2d');
        const first = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        await new Promise(r => setTimeout(r, 600));
        const final = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let changed = 0; for (let i = 3; i < first.length; i += 4) if (Math.abs(first[i] - final[i]) > 2) changed++;
        const box = canvas.getBoundingClientRect(), p = canvas.parentElement.querySelector('.hero-photograph, .cohort-hero-photo').getBoundingClientRect(), scale = canvas.width / box.width;
        let photoAlpha = 0;
        for (let y = Math.max(0, Math.ceil((p.top - box.top + 2) * scale)); y < Math.min(canvas.height, (p.bottom - box.top - 2) * scale); y += 5)
          for (let x = Math.max(0, Math.ceil((p.left - box.left + 2) * scale)); x < Math.min(canvas.width, (p.right - box.left - 2) * scale); x += 5) photoAlpha = Math.max(photoAlpha, final[(y * canvas.width + x) * 4 + 3]);
        return { ...window.clearanceQA, changed, photoAlpha };
      });
      assert.equal(result.textCrossings, 0); assert.equal(result.photoCrossings, 0); assert.equal(result.bandStrokes, 0);
      assert(result.maxLength <= (width < 768 ? 64 : 88) + .01); assert(result.softLightFills > 0); assert(result.changed > 0); assert.equal(result.photoAlpha, 0); assert.deepEqual(errors, []);
      report.push({ width, route, ...result, errors }); await page.close();
    }
    fs.writeFileSync(`${out}/clearance-browser.json`, JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
