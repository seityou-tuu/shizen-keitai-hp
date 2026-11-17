// Regression checks for delayed images, touch targets and invalid-URL recovery.
// Uses the same optional Playwright installation as the existing browser checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const base = new URL(process.env.QA_BASE_URL || 'http://127.0.0.1:3100');
assert(['localhost', '127.0.0.1'].includes(base.hostname), 'Local builds only');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  const report = { conditions: 'Local production build; Chromium; DPR 1; reduced motion; image responses held until geometry is measured', pages: [], invalidUrls: [], errors: [] };
  try {
    for (const route of ['/', '/recruitment/first']) {
      for (const width of [390, 768, 1024, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        let release;
        const imagesReady = new Promise(resolve => { release = resolve; });
        await context.route('**/_next/image?*', async request => {
          await imagesReady;
          await request.continue();
        });
        const page = await context.newPage();
        page.on('pageerror', error => report.errors.push(error.message));
        page.on('console', message => {
          if (['error', 'warning'].includes(message.type())) report.errors.push(`${message.type()}: ${message.text()}`);
        });
        try {
          const response = await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded' });
          assert.equal(response.status(), 200);
          const photos = page.locator('.program-photo img');
          await photos.evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
          const before = await photos.evaluateAll(images => images.map(image => {
            const rect = image.getBoundingClientRect();
            return { top: rect.top + scrollY, width: rect.width, height: rect.height, loaded: image.complete && image.naturalWidth > 0 };
          }));
          assert(before.length >= 3);
          assert(before.every(image => !image.loaded && image.height > 0), `Image space must exist before responses: ${route} ${width}`);
          release();
          await photos.evaluateAll(images => Promise.all(images.map(image => image.decode())));
          const after = await photos.evaluateAll(images => images.map(image => {
            const rect = image.getBoundingClientRect();
            return { top: rect.top + scrollY, width: rect.width, height: rect.height };
          }));
          for (let index = 0; index < before.length; index++) {
            for (const dimension of ['top', 'width', 'height']) {
              assert(Math.abs(before[index][dimension] - after[index][dimension]) <= 1,
                `Image load moved ${dimension}: ${route} ${width} image ${index}`);
            }
          }
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          const targets = page.locator(width > 1100 ? '.information-links a, .desktop-nav > a' : '.information-links a');
          assert(await targets.evaluateAll(links => links.every(link => {
            const rect = link.getBoundingClientRect();
            return rect.width >= 44 && rect.height >= 44;
          })), `Touch targets: ${route} ${width}`);
          report.pages.push({ route, width, reservedImages: before.length, passed: true });
        } finally {
          release();
          await context.close();
        }
      }
    }
    for (const route of ['/missing-page', '/recruitment/not-a-page', '/%E0%A4%A']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
      page.on('pageerror', error => report.errors.push(error.message));
      const response = await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 404);
      assert.equal(await page.getByRole('main').count(), 1);
      assert.equal(await page.getByRole('heading', { level: 1, name: 'ページが見つかりません' }).count(), 1);
      assert(await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.some(node => node.content.includes('noindex'))));
      const back = page.getByRole('link', { name: 'トップページへ戻る' });
      assert.equal(await back.getAttribute('href'), '/');
      await back.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(base.href);
      assert.equal(await page.locator('h1').count(), 1);
      report.invalidUrls.push({ route, status: response.status(), keyboardRecovery: true });
      await page.close();
    }
    assert.deepEqual(report.errors, []);
    if (process.env.QA_OUTPUT_DIR) {
      fs.mkdirSync(process.env.QA_OUTPUT_DIR, { recursive: true });
      fs.writeFileSync(`${process.env.QA_OUTPUT_DIR}/post-launch-report.json`, JSON.stringify(report, null, 2));
    }
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
