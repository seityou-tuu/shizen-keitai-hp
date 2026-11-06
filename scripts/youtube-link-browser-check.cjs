// Use the existing optional Playwright installation; never contact YouTube in QA.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname));
const expected = [["86万回", "yp_P0a_oedY"], ["132万回", "yudalXPijCk"]];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox"],
  });
  const results = [];
  try {
    for (const mobile of [false, true]) {
      const context = await browser.newContext({
        viewport: { width: mobile ? 390 : 1440, height: 1000 },
        isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce",
      });
      const destinations = [];
      await context.route("https://youtu.be/**", async route => {
        destinations.push(route.request().url());
        await route.fulfill({ contentType: "text/html", body: "<title>QA destination</title>" });
      });
      const page = await context.newPage();
      await page.goto(base);
      for (const [count, id] of expected) {
        const link = page.getByRole("link", { name: `表示再生数${count}の動画をYouTubeで見る（新しいタブで開きます）` });
        assert.ok((await link.locator("img").getAttribute("src")).includes(count === "86万回" ? "youtube-860k" : "youtube-1320k"));
        for (const target of [link.locator("img"), link.locator(".evidence-play")]) {
          const popupPromise = page.waitForEvent("popup");
          await target.scrollIntoViewIfNeeded();
          const box = await target.boundingBox();
          assert.ok(box);
          const x = box.x + box.width / 2, y = box.y + box.height / 2;
          if (mobile) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
          const popup = await popupPromise;
          await popup.waitForLoadState();
          assert.equal(popup.url(), `https://youtu.be/${id}`);
          assert.equal(await popup.evaluate(() => window.opener === null), true);
          await popup.close();
        }
        if (!mobile) {
          await link.focus();
          const popupPromise = page.waitForEvent("popup");
          await page.keyboard.press("Enter");
          const popup = await popupPromise;
          await popup.waitForLoadState();
          assert.equal(popup.url(), `https://youtu.be/${id}`);
          await popup.close();
        }
      }
      if (!mobile) {
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.locator(".evidence-video-link").first().hover();
        await page.waitForTimeout(250);
        assert.notEqual(await page.locator(".evidence-play").first().evaluate(el => getComputedStyle(el).transform), "none");
        await page.emulateMedia({ reducedMotion: "reduce" });
        assert.equal(await page.locator(".evidence-play").first().evaluate(el => getComputedStyle(el).transform), "none");
        await page.mouse.move(0, 0);
      }
      await page.evaluate(() => document.activeElement?.blur());
      if (process.env.QA_OUTPUT_DIR) {
        fs.mkdirSync(process.env.QA_OUTPUT_DIR, { recursive: true });
        await page.locator(".instructor-evidence").screenshot({
          path: path.join(process.env.QA_OUTPUT_DIR, `youtube-${mobile ? "mobile" : "desktop"}.png`),
          style: ".site-header,.mobile-consult-bar,.skip-link { visibility: hidden !important; }",
        });
      }
      assert.equal(destinations.length, mobile ? 4 : 6);
      results.push({ device: mobile ? "mobile touch" : "desktop mouse and keyboard", destinations, passed: true });
      await context.close();
    }
    console.log(JSON.stringify({ conditions: "Local Chromium; external destinations intercepted, video playback untested", results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
