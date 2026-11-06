const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = new URL(process.env.QA_BASE_URL || "http://127.0.0.1:3100");
assert.ok(["localhost", "127.0.0.1"].includes(base.hostname));
const routePath = process.env.QA_PATH || "/";
const line = "https://lin.ee/O3tJo01";
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, args: ["--no-sandbox"] });
  const report = { conditions: "Local Chromium; LINE requests intercepted; no friend-add, messages or real phone calls", path: routePath, devices: [] };
  try {
    for (const mobile of [false, true]) {
      const context = await browser.newContext({ viewport: { width: mobile ? 390 : 1440, height: 1000 }, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
      const destinations = [], errors = [];
      await context.route("https://lin.ee/**", route => {
        destinations.push(route.request().url());
        return route.fulfill({ contentType: "text/html; charset=utf-8", body: "<title>LINE test destination</title>" });
      });
      const page = await context.newPage(); page.on("pageerror", error => errors.push(error.message));
      const response = await page.goto(new URL(routePath, base).href, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      if (routePath === "/") assert.equal(await page.locator('a[href="/recruitment/first"]').count(), 0);
      const links = page.locator('a[href*="lin.ee"],a[href*="line.me"]');
      assert.ok(await links.count() >= 5);
      for (const link of await links.all()) {
        assert.equal(await link.getAttribute("href"), line);
        assert.equal(await link.getAttribute("target"), "_blank");
        assert.ok((await link.getAttribute("rel")).includes("noopener"));
        if (!(await link.isVisible())) continue;
        await link.scrollIntoViewIfNeeded();
        assert.ok(await link.evaluate(el => el.getBoundingClientRect().height >= 44));
        const popupPromise = page.waitForEvent("popup");
        if (mobile) await link.tap(); else await link.click();
        const popup = await popupPromise; await popup.waitForLoadState();
        assert.equal(popup.url(), line);
        assert.equal(await popup.evaluate(() => window.opener === null), true);
        await popup.close();
      }
      assert.ok(await page.locator('a[href^="tel:"]').evaluateAll(nodes => nodes.length > 0 && nodes.every(node => node.getAttribute("href") === "tel:0985747643")));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (mobile) {
        const bar = page.locator(routePath === "/" ? ".mobile-consult-bar" : ".recruitment-contact-bar");
        assert.equal(await bar.locator("a").count(), 2);
        assert.equal(await bar.locator("a").first().getAttribute("href"), line);
        assert.equal(await bar.locator("a").last().getAttribute("href"), "tel:0985747643");
        assert.ok(await bar.locator("a").evaluateAll(nodes => nodes.every(el => el.getBoundingClientRect().height >= 44 && el.scrollWidth <= el.clientWidth + 1)));
      }
      if (process.env.QA_OUTPUT_DIR) {
        fs.mkdirSync(process.env.QA_OUTPUT_DIR, { recursive: true });
        await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
        await page.screenshot({ path: path.join(process.env.QA_OUTPUT_DIR, `line-hero-${mobile ? "390" : "1440"}.png`) });
        await page.locator(routePath === "/" ? "#contact" : "#cohort-contact").screenshot({ path: path.join(process.env.QA_OUTPUT_DIR, `line-contact-${mobile ? "390" : "1440"}.png`), style: ".site-header,.mobile-consult-bar,.recruitment-contact-bar,.skip-link {visibility:hidden!important}" });
      }
      assert.deepEqual(errors, []);
      assert.ok(destinations.length > 0 && destinations.every(url => url === line));
      report.devices.push({ device: mobile ? "mobile touch" : "desktop", interceptedClicks: destinations.length, exactUrl: true, safeNewTab: true, phonePreserved: true, passed: true });
      await context.close();
    }
    if (process.env.QA_OUTPUT_DIR) fs.writeFileSync(path.join(process.env.QA_OUTPUT_DIR, "line-report.json"), JSON.stringify(report, null, 2) + "\n");
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
