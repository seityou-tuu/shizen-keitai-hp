const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3114';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const out = process.env.QA_OUTPUT_DIR;
if (out) fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const errors = [];
    for (const width of [375, 390, 400, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      page.on('pageerror', e => errors.push(String(e)));
      await page.addInitScript(() => {
        window.splashSamples = [];
        const sample = () => {
          const flight = document.querySelector('.brand-splash-flight');
          const brand = document.querySelector('.site-header .brand');
          if (flight && brand) {
            const a = flight.getBoundingClientRect(), b = brand.getBoundingClientRect();
            window.splashSamples.push({ x: a.x, y: a.y, w: a.width, h: a.height, tx: b.x, ty: b.y, tw: b.width, th: b.height, time: performance.now(), opacity: getComputedStyle(flight).opacity, hidden: getComputedStyle(brand).visibility });
          }
          requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      await page.locator('.brand-splash').waitFor();
      await page.waitForTimeout(500);
      if (out && [375, 1440].includes(width)) await page.screenshot({ path: `${out}/center-${width}.png` });
      await page.waitForTimeout(700);
      if (out && [375, 1440].includes(width)) await page.screenshot({ path: `${out}/moving-${width}.png` });
      await page.locator('.brand-splash').waitFor({ state: 'detached', timeout: 3500 });
      const samples = await page.evaluate(() => window.splashSamples);
      const visible = samples.filter(s => Number(s.opacity) > .95);
      assert.ok(visible.length > 20, 'continuous visible frames');
      assert.ok(visible.some(s => s.y > s.ty + 100 && s.w > s.tw * 1.15), 'visible travel and scaling');
      const last = visible.at(-1);
      assert.ok(Math.abs(last.x - last.tx) < 2 && Math.abs(last.y - last.ty) < 2 && Math.abs(last.w - last.tw) < 2, 'measured landing');
      assert.ok(visible.every(s => s.hidden === 'hidden'), 'real logo hidden throughout flight');
      assert.ok(samples.at(-1).time - samples[0].time < 2900, 'bounded duration');
      assert.equal(await page.locator('.site-header .brand').evaluate(el => getComputedStyle(el).visibility), 'visible');
      assert.equal(await page.locator('[inert]').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (out && [375, 1440].includes(width)) await page.screenshot({ path: `${out}/landed-${width}.png` });
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.brand-splash').count(), 0, 'reload does not replay');
      await page.goto(`${base}/recruitment/first`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.brand-splash').count(), 0, 'other page unaffected');
      await page.locator('.site-header .brand').click();
      await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('.brand-splash').count(), 0, 'return navigation does not replay');
      await context.close();
      console.log(`PASS ${width}px: continuous movement, measured landing, reload, navigation`);
    }
    const p = await browser.newPage();
    await p.goto(base);
    await p.getByRole('button', { name: 'イントロをスキップ' }).click();
    assert.equal(await p.locator('.brand-splash').count(), 0);
    assert.equal(await p.locator('[inert]').count(), 0);
    await p.close();
    const resize = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await resize.addInitScript(() => {
      window.lastFlight = null;
      const sample = () => {
        const a = document.querySelector('.brand-splash-flight');
        if (a) { const r = a.getBoundingClientRect(); window.lastFlight = { x: r.x, y: r.y, width: r.width }; }
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await resize.goto(base);
    await resize.locator('.brand-splash').waitFor();
    await resize.waitForTimeout(800);
    await resize.setViewportSize({ width: 375, height: 812 });
    // A late typography/layout change exercises the same measured-target path as fonts.
    await resize.evaluate(() => {
      document.querySelector('.site-header .brand').style.fontSize = '19px';
      document.fonts.dispatchEvent(new Event('loadingdone'));
    });
    await resize.locator('.brand-splash').waitFor({ state: 'detached' });
    const landing = await resize.evaluate(() => {
      const r = document.querySelector('.site-header .brand').getBoundingClientRect();
      return { flight: window.lastFlight, brand: { x: r.x, y: r.y, width: r.width } };
    });
    for (const key of ['x', 'y', 'width']) assert.ok(Math.abs(landing.flight[key] - landing.brand[key]) < 2, `resize/font landing ${key}`);
    assert.equal(await resize.locator('.site-header .brand').evaluate(el => getComputedStyle(el).visibility), 'visible');
    await resize.close();
    const reduced = await browser.newPage({ reducedMotion: 'reduce' });
    await reduced.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await reduced.locator('.brand-splash').count(), 0);
    await reduced.close();
    const keyboard = await browser.newPage();
    await keyboard.goto(base);
    await keyboard.locator('.brand-splash').waitFor();
    await keyboard.keyboard.press('Escape');
    assert.equal(await keyboard.locator('.brand-splash').count(), 0);
    await keyboard.close();
    const nojs = await browser.newPage({ javaScriptEnabled: false });
    await nojs.goto(base);
    assert.equal(await nojs.locator('.brand-splash').count(), 0);
    assert.equal(await nojs.locator('.site-header .brand').isVisible(), true);
    await nojs.close();
    assert.deepEqual(errors, []);
    console.log('PASS skip, Escape, reduced motion, responsive resize, no JavaScript; no page errors');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
