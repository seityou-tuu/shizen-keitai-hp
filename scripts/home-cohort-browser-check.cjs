// Local integration QA: navigation into the published recruitment page and back.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const base = new URL(process.env.QA_BASE_URL || "http://127.0.0.1:3100");
assert.ok(["127.0.0.1", "localhost"].includes(base.hostname));
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, args: ["--no-sandbox"] });
  const out = process.env.QA_OUTPUT_DIR;
  if (out) fs.mkdirSync(out, { recursive: true });
  const report = { widths: [], errors: [], conditions: "Local Chromium; no real LINE messages, calls or YouTube playback" };
  try {
    for (const width of [375, 390, 400, 430, 768, 1280, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
      page.on("pageerror", error => report.errors.push(error.message));
      await page.goto(base.href, { waitUntil: "networkidle" });
      await page.addStyleTag({ content: "html,body {scroll-behavior:auto!important}" });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const notice = page.getByRole("complementary", { name: /第1期生募集案内/ });
      const text = await notice.innerText();
      for (const value of ["募集準備中", "2027年1月", "東京・大阪・福岡", "各会場6名／合計18名", "2027年1月10日"]) assert.ok(text.includes(value), value);
      assert.ok(!text.includes("募集受付中"));
      if (width > 1100) assert.ok(await page.evaluate(() => {
        const header = document.querySelector(".site-header"), brand = header.querySelector(".brand").getBoundingClientRect(), nav = header.querySelector(".desktop-nav").getBoundingClientRect();
        return brand.right + 12 <= nav.left && nav.right <= innerWidth;
      }), `header fit ${width}`);
      const noticeClipping = await notice.locator("p,dt,dd,a").evaluateAll(nodes => nodes.filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.textContent));
      assert.deepEqual(noticeClipping, []);
      assert.ok(await notice.getByRole("link").evaluate(el => el.getBoundingClientRect().height >= 44));
      if (out && [375,400,1440].includes(width)) {
        await notice.screenshot({ path: path.join(out, `notice-${width}.png`), style: ".site-header,.mobile-consult-bar,.skip-link{visibility:hidden!important}" });
        await page.evaluate(() => scrollTo(0,0));
        await page.screenshot({ path: path.join(out, `hero-${width}.png`) });
      }
      const selectors = [".hero-statement a[href='/recruitment/first']", ".home-cohort-notice a", "#training .home-cohort-section-link", "#courses .home-cohort-section-link"];
      for (const selector of selectors) {
        await page.locator(selector).click();
        assert.equal(new URL(page.url()).pathname, "/recruitment/first");
        assert.match(await page.locator(".recruitment-status").innerText(), /募集準備中/);
        if (selector.startsWith("#training")) assert.equal(new URL(page.url()).hash, "#cohort-schedule");
        if (selector.startsWith("#courses")) assert.equal(new URL(page.url()).hash, "#cohort-tuition");
        await page.locator(".recruitment-back").click();
        assert.equal(new URL(page.url()).pathname, "/");
      }
      if (width <= 1100) await page.getByRole("button", { name: "メニューを開く" }).click();
      const nav = page.getByRole("navigation", { name: width <= 1100 ? "モバイルナビゲーション" : "メインナビゲーション" });
      const cohortLink = nav.getByRole("link", { name: "第1期生募集", exact: true });
      assert.ok(await cohortLink.evaluate(el => el.getBoundingClientRect().height >= 44));
      if (out && width === 400) await page.screenshot({ path: path.join(out, "menu-400.png") });
      await cohortLink.click();
      assert.equal(new URL(page.url()).pathname, "/recruitment/first");
      await page.locator(".recruitment-back").click();
      assert.equal(new URL(page.url()).pathname, "/");
      if (width <= 1100) assert.equal(await page.getByRole("button", { name: "メニューを開く" }).getAttribute("aria-expanded"), "false");
      report.widths.push({ width, announcement: true, headerFit: true, allFiveEntryPointsAndReturn: true, passed: true });
      await page.close();
    }
    assert.deepEqual(report.errors, []);
    if (out) fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
