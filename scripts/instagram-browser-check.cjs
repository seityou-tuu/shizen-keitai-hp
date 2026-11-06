const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname));

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, args: ["--no-sandbox"] });
  const results = [];
  try {
    for (const mobile of [false, true]) {
      const context = await browser.newContext({ viewport: { width: mobile ? 390 : 1440, height: 1000 }, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
      const destinations = [];
      await context.route("https://www.instagram.com/**", route => {
        destinations.push(route.request().url());
        return route.fulfill({ contentType: "text/html", body: "<title>QA destination</title>" });
      });
      const page = await context.newPage();
      await page.goto(base);
      assert.equal(await page.locator("#instagram h2").textContent(), "施術と考え方を、映像で確かめる。");
      assert.equal(await page.locator(".evidence-video-link").count(), 2);
      const urls = ["https://www.instagram.com/reel/DcGE2FPKpHz/", "https://www.instagram.com/reel/DcN4DM8K89p/", "https://www.instagram.com/reel/DapZQNvvtVR/", "https://www.instagram.com/ngtmyy_1990"];
      const links = page.locator("#instagram a");
      assert.equal(await links.count(), 4);
      for (let i = 0; i < urls.length; i++) {
        const link = links.nth(i);
        assert.equal(await link.getAttribute("href"), urls[i]);
        assert.equal(await link.getAttribute("target"), "_blank");
        assert.equal(await link.getAttribute("rel"), "noopener noreferrer");
        if (i < 3) assert.ok((await link.locator("img").getAttribute("src")).includes(["heel", "knee", "shin"][i]));
        await link.scrollIntoViewIfNeeded();
        const popupPromise = page.waitForEvent("popup");
        if (mobile) await link.tap(); else await link.click();
        const popup = await popupPromise;
        await popup.waitForLoadState();
        assert.equal(popup.url(), urls[i]);
        assert.equal(await popup.evaluate(() => window.opener === null), true);
        await popup.close();
      }
      const positions = await page.locator(".instagram-reels li").evaluateAll(nodes => nodes.map(el => el.getBoundingClientRect().top));
      assert.ok(positions.every(top => Math.abs(top - positions[0]) < 1));
      const list = page.locator(".instagram-reels");
      await list.evaluate(el => { el.scrollLeft = 0; });
      if (mobile) {
        assert.ok(await list.evaluate(el => el.scrollWidth > el.clientWidth));
        await list.focus();
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(400);
        assert.ok(await list.evaluate(el => el.scrollLeft > 0));
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await list.evaluate(el => { el.scrollLeft = 0; });
      await page.evaluate(() => document.activeElement?.blur());
      if (process.env.QA_OUTPUT_DIR) {
        fs.mkdirSync(process.env.QA_OUTPUT_DIR, { recursive: true });
        await page.locator("#instagram").screenshot({ path: path.join(process.env.QA_OUTPUT_DIR, `instagram-${mobile ? "mobile" : "desktop"}.png`), style: ".site-header,.mobile-consult-bar,.skip-link { visibility:hidden !important; }" });
      }
      results.push({ device: mobile ? "mobile touch" : "desktop", destinations, passed: true });
      await context.close();
    }
    console.log(JSON.stringify({ conditions: "Local Chromium; Instagram navigation intercepted; external playback and real Safari untested", results }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
