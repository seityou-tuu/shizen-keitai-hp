const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3120';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const out = process.env.QA_OUTPUT_DIR || 'work/premium-ux';
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const report = [];
  try {
    for (const width of [375, 390, 400, 768, 1440]) {
      for (const route of ['/', '/recruitment/first']) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.addInitScript(() => {
          sessionStorage.setItem('shizen-brand-intro-v1', 'seen');
          window.uxCalls = [];
          const original = Element.prototype.animate;
          Element.prototype.animate = function (...args) { window.uxCalls.push({ node: this, options: args[1] }); return original.apply(this, args); };
          window.cls = 0;
          new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
        });
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.addStyleTag({ content: 'html,body{scroll-behavior:auto!important}' });
        const selector = route === '/' ? '#features h2' : '#cohort-next-step-title';
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForFunction(s => document.querySelector(s).dataset.uxPlayed === 'message', selector);
        await page.waitForTimeout(850);
        const count = await page.evaluate(s => window.uxCalls.filter(c => c.node === document.querySelector(s)).length, selector);
        assert.equal(count, 1);
        if ([375, 400, 1440].includes(width)) await page.screenshot({ path: `${out}/${route === '/' ? 'home' : 'cohort'}-message-${width}.png` });
        await page.evaluate(() => scrollTo(0, 0));
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
        assert.equal(await page.evaluate(s => window.uxCalls.filter(c => c.node === document.querySelector(s)).length, selector), 1, 'once only');
        if (route !== '/') {
          await page.locator('#cohort-schedule h2').scrollIntoViewIfNeeded();
          await page.getByRole('tab', { name: /大阪会場/ }).click();
          const panel = page.locator('#schedule-osaka');
          await panel.scrollIntoViewIfNeeded();
          await page.waitForTimeout(850);
          assert.equal(await panel.locator('time').count(), 6);
          assert.equal(await panel.locator('.cohort-month').count(), 6);
          const rects = await panel.locator('.cohort-session-list li').evaluateAll(els => els.map(el => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y })));
          if (width < 701) assert.ok(rects.every((r, i) => i === 0 || r.y > rects[i - 1].y && r.x === rects[i - 1].x), 'vertical six-month sequence');
          if ([375, 400, 1440].includes(width)) await panel.screenshot({ path: `${out}/schedule-${width}.png` });
          assert.equal(await page.locator('.cohort-session-list time').count(), 18);
          assert.match(await page.locator('main').innerText(), /募集準備中/);
          assert.match(await page.locator('main').innerText(), /最少催行人数.*3名/);
          assert.equal(await page.locator('#cohort-contact .recruitment-button').getAttribute('href'), 'https://lin.ee/O3tJo01');
          assert.equal(await page.locator('#cohort-contact .recruitment-phone').getAttribute('href'), 'tel:0985747643');
        }
        // Switching the OS preference cancels any active enhancement immediately.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForTimeout(100);
        assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
        const calls = await page.evaluate(() => window.uxCalls.length);
        await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(200);
        assert.equal(await page.evaluate(() => window.uxCalls.length), calls);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert.deepEqual(errors, []);
        report.push({ width, route, once: true, reducedMotion: true, cls: await page.evaluate(() => window.cls) });
        await page.close();
      }
      console.log(`PASS both pages ${width}px`);
    }
    const nojs = await browser.newPage({ javaScriptEnabled: false });
    for (const route of ['/', '/recruitment/first']) {
      await nojs.goto(base + route);
      assert.ok(await nojs.locator('h2').count() > 5);
      assert.ok(await nojs.locator('main').isVisible());
    }
    await nojs.close();
    const intro = await browser.newPage();
    await intro.goto(base);
    await intro.locator('.brand-splash').waitFor();
    assert.equal(await intro.locator('[data-ux-played]').count(), 0, 'no scroll animations during splash');
    await intro.getByRole('button', { name: 'イントロをスキップ' }).click();
    await intro.locator('#features h2').scrollIntoViewIfNeeded();
    await intro.waitForFunction(() => document.querySelector('#features h2').dataset.uxPlayed === 'message');
    await intro.close();
    fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
    console.log('PASS no-JS, splash coordination, all facts and controls');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
