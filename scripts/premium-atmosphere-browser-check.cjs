const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3160';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const out = process.env.QA_OUTPUT_DIR;
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const report = { conditions: 'Local production build; Chromium; visibility change simulated; no external messages or calls', pages: [], errors: [] };
  try {
    for (const route of ['/', '/recruitment/first']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', e => report.errors.push(e.message));
      await page.addInitScript(() => {
        window.networkDraws = 0;
        window.networkPoints = [];
        const clear = CanvasRenderingContext2D.prototype.clearRect;
        CanvasRenderingContext2D.prototype.clearRect = function (...args) {
          if (this.canvas.classList.contains('hero-network')) { window.networkDraws++; window.networkPoints = []; }
          return clear.apply(this, args);
        };
        const arc = CanvasRenderingContext2D.prototype.arc;
        CanvasRenderingContext2D.prototype.arc = function (...args) {
          if (this.canvas.classList.contains('hero-network')) window.networkPoints.push({ x: args[0], y: args[1] });
          return arc.apply(this, args);
        };
      });
      await page.goto(base + route, { waitUntil: 'networkidle' });
      const rail = page.locator('.section-rail');
      await rail.waitFor({ state: 'visible' });
      const hrefs = await rail.locator('a').evaluateAll(es => es.map(e => e.getAttribute('href')));
      for (const href of hrefs) {
        await rail.locator(`a[href="${href}"]`).click();
        await page.waitForFunction(href => document.querySelector('.section-rail a[aria-current]')?.getAttribute('href') === href, href);
        assert.equal(await rail.locator('.section-rail-name:visible').count(), 1);
        const target = page.locator(href);
        const rectangle = await target.boundingBox();
        assert(rectangle.y >= 90 || hrefs.indexOf(href) === 0, `header clearance ${href}: ${rectangle.y}`);
      }
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForFunction(() => document.querySelector('.section-rail-progress').getAttribute('aria-valuenow') === '100');
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForFunction(() => document.querySelector('.section-rail-progress').getAttribute('aria-valuenow') === '0');
      await rail.locator('a').first().focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), hrefs[1]);
      await page.keyboard.press('Enter');
      await page.waitForFunction(href => document.querySelector('.section-rail a[aria-current]')?.getAttribute('href') === href, hrefs[1]);
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(250);
      let count = await page.evaluate(() => window.networkDraws);
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => window.networkDraws), count, 'reduced motion is static');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.waitForTimeout(route === '/' ? 3500 : 300);
      count = await page.evaluate(() => window.networkDraws);
      await page.waitForTimeout(200);
      assert(await page.evaluate(() => window.networkDraws) > count, 'animation runs in view');
      const point = await page.evaluate(() => {
        const index = window.networkPoints.findIndex(p => p.x > 30 && p.x < 420 && p.y > 80 && p.y < 600);
        return { index, ...window.networkPoints[index] };
      });
      assert(point.index >= 0);
      const canvasBox = await page.locator('.hero-network').boundingBox();
      await page.mouse.move(canvasBox.x + point.x + 20, canvasBox.y + point.y);
      await page.waitForTimeout(350);
      const displacement = await page.evaluate(p => Math.hypot(window.networkPoints[p.index].x - p.x, window.networkPoints[p.index].y - p.y), point);
      assert(displacement > 0 && displacement < 18, 'pointer response stays subtle alongside the faster drift');
      await page.mouse.move(1400, 10);
      const photoTransparent = await page.evaluate(() => {
        const canvas = document.querySelector('.hero-network'), ctx = canvas.getContext('2d');
        const box = canvas.getBoundingClientRect(), photo = canvas.parentElement.querySelector('.hero-photograph, .cohort-hero-photo').getBoundingClientRect();
        const scale = canvas.width / box.width, data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let y = Math.max(0, Math.ceil((photo.top - box.top + 2) * scale)); y < Math.min(canvas.height, (photo.bottom - box.top - 2) * scale); y += 5)
          for (let x = Math.max(0, Math.ceil((photo.left - box.left + 2) * scale)); x < Math.min(canvas.width, (photo.right - box.left - 2) * scale); x += 5)
            if (data[(y * canvas.width + x) * 4 + 3]) return false;
        return true;
      });
      assert(photoTransparent, 'photograph area must be transparent');
      const pause = page.getByRole('button', { name: '背景の動きを停止' });
      await pause.click();
      await page.waitForTimeout(100);
      count = await page.evaluate(() => window.networkDraws);
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => window.networkDraws), count, 'manual pause');
      await page.getByRole('button', { name: '背景の動きを再開' }).click();
      await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
      count = await page.evaluate(() => window.networkDraws);
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => window.networkDraws), count, 'hidden tab pause');
      await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); scrollTo(0, document.documentElement.scrollHeight); });
      await page.waitForTimeout(250);
      count = await page.evaluate(() => window.networkDraws);
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => window.networkDraws), count, 'offscreen pause');
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await rail.locator(`a[href="${hrefs[1]}"]`).hover();
      assert.equal(await rail.locator('.section-rail-name:visible').count(), 1, 'hover never expands the menu');
      await rail.locator(`a[href="${hrefs[1]}"]`).click();
      await page.waitForFunction(href => document.querySelector('.section-rail a[aria-current]')?.getAttribute('href') === href, hrefs[1]);
      await page.setViewportSize({ width: 1024, height: 1000 });
      assert.equal(await rail.isVisible(), false);
      await page.setViewportSize({ width: 1440, height: 650 });
      await page.waitForFunction(() => !document.querySelector('.section-rail').hidden);
      assert.equal(await rail.isVisible(), true);
      const notebook = [];
      for (const [width, height] of [[1101,600], [1152,650], [1200,600], [1280,650], [1366,668], [1440,650]]) {
        await page.setViewportSize({ width, height });
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(120);
        assert.equal(await rail.isVisible(), true, `notebook rail ${width}x${height}`);
        const clear = await page.evaluate(() => {
          const rail = document.querySelector('.section-rail').getBoundingClientRect();
          const header = document.querySelector('.site-header').getBoundingClientRect();
          const content = document.querySelector('.hero-statement, .cohort-hero-grid').getBoundingClientRect();
          const name = document.querySelector('.section-rail a[aria-current] .section-rail-name').getBoundingClientRect();
          return rail.right <= content.left && rail.top >= header.bottom && rail.bottom <= innerHeight && name.right <= content.left;
        });
        assert(clear, `rail stays in gutter and below header at ${width}x${height}`);
        assert.equal(await rail.locator('.section-rail-name:visible').count(), 1);
        notebook.push({ width, height, visible: true, clear: true });
      }
      await page.setViewportSize({ width: 1280, height: 650 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const href of hrefs) {
        await rail.locator(`a[href="${href}"]`).click();
        await page.waitForFunction(href => document.querySelector('.section-rail a[aria-current]')?.getAttribute('href') === href, href);
      }
      report.pages.push({ route, destinations: hrefs.length, allMarkersAndKeyboard: true, firstAndLast: true, photoTransparent, reducedMotion: true, manualPause: true, hiddenTabSimulation: true, offscreenPause: true, smoothScroll: true, pointerDisplacement: displacement, notebook });
      await context.close();
    }
    assert.deepEqual(report.errors, []);
    if (out) { fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(`${out}/atmosphere.json`, JSON.stringify(report, null, 2)); }
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
