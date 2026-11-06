const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = new URL(process.env.QA_BASE_URL || "http://127.0.0.1:3100");
assert.ok(["localhost", "127.0.0.1"].includes(base.hostname));
const target = new URL("/recruitment/first", base).href;
const out = process.env.QA_OUTPUT_DIR;
const expected = {
  東京: ["2027-01-15", "2027-02-08", "2027-03-08", "2027-04-20", "2027-05-18", "2027-06-22"],
  大阪: ["2027-01-12", "2027-02-10", "2027-03-10", "2027-04-22", "2027-05-20", "2027-06-24"],
  福岡: ["2027-01-18", "2027-02-12", "2027-03-12", "2027-04-23", "2027-05-21", "2027-06-25"],
};
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, args: ["--no-sandbox"] });
  const report = { conditions: "Local preview build, Chromium, DPR 1; no real phone calls or external playback", widths: [], externalRequests: [], errors: [] };
  if (out) fs.mkdirSync(out, { recursive: true });
  try {
    const main = await browser.newPage();
    await main.goto(base.href, { waitUntil: "networkidle" });
    const normalize = value => value.replace(/\s/g, "");
    const mainFees = (await main.locator(".tuition-amount p").allTextContents()).map(normalize);
    assert.equal(mainFees.length, 3);
    assert.equal(await main.locator('a[href="/recruitment/first"]').count(), 0);
    await main.close();
    for (const width of [320, 360, 375, 390, 400, 414, 430, 768, 1024, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
      await context.route("**/*", route => {
        if (new URL(route.request().url()).origin === base.origin) return route.continue();
        report.externalRequests.push(route.request().url()); return route.abort();
      });
      const page = await context.newPage();
      page.on("pageerror", error => report.errors.push(error.message));
      const response = await page.goto(target, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      assert.match(response.headers()["x-robots-tag"], /noindex/);
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
      assert.match(await page.title(), /第1期生/);
      assert.equal(await page.locator("h1").count(), 1);
      assert.match(await page.locator("h1").innerText(), /資格取得プログラム/);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://shizen-keitai-hp.vercel.app/recruitment/first");
      assert.equal(await page.locator("form,input,textarea").count(), 0);
      assert.ok(await page.locator('a[href="https://lin.ee/O3tJo01"]').count() >= 5);
      assert.ok(await page.locator('a[href*="lin.ee"],a[href*="line.me"]').evaluateAll(nodes => nodes.every(el => el.getAttribute("href") === "https://lin.ee/O3tJo01")));
      assert.match(await page.locator(".recruitment-status").innerText(), /募集準備中/);
      assert.ok(!(await page.locator("main").innerText()).includes("9:00〜17:00"));
      assert.deepEqual((await page.locator(".recruitment-fee").allTextContents()).map(normalize), mainFees);
      assert.match(await page.locator(".recruitment-total").innerText(), /2,970,000円（税込）/);
      for (const [city, dates] of Object.entries(expected)) {
        const tab = page.getByRole("tab", { name: city + "会場", exact: true });
        await tab.click();
        assert.equal(await tab.getAttribute("aria-selected"), "true");
        const panel = page.getByRole("tabpanel");
        assert.equal(await panel.count(), 1);
        assert.deepEqual(await panel.locator("time").evaluateAll(nodes => nodes.map(node => node.dateTime)), dates);
        assert.match(await panel.locator("h3").innerText(), new RegExp(city));
      }
      const tokyo = page.getByRole("tab", { name: "東京会場", exact: true });
      await tokyo.focus(); await page.keyboard.press("Home");
      await page.keyboard.press("ArrowRight");
      assert.equal(await page.getByRole("tab", { name: "大阪会場", exact: true }).getAttribute("aria-selected"), "true");
      await page.keyboard.press("End");
      assert.equal(await page.getByRole("tab", { name: "全会場を比較", exact: true }).getAttribute("aria-selected"), "true");
      assert.equal(await page.locator(".cohort-venue-panel:visible time").count(), 18);
      assert.equal(await page.locator(".cohort-venue-panel:visible").count(), 3);
      const clipping = await page.locator("main h1,main h2,main h3,main p,main a,main button,main dd,main dt,main time").evaluateAll(nodes => nodes.filter(el => {
        if (!el.getClientRects().length) return false;
        const rect = el.getBoundingClientRect();
        return rect.left < -1 || rect.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2;
      }).map(el => el.textContent));
      assert.deepEqual(clipping, [], `text clipping at ${width}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      for (const photo of await page.locator(".program-photo img").all()) {
        await photo.scrollIntoViewIfNeeded(); await photo.evaluate(img => img.decode());
        assert.ok(await photo.evaluate(img => Math.abs(img.naturalWidth / img.naturalHeight - img.getBoundingClientRect().width / img.getBoundingClientRect().height) < .015));
      }
      assert.equal(await page.locator(".program-photo img").count(), 3);
      for (const question of await page.locator(".recruitment-faq details").all()) {
        await question.locator("summary").click(); assert.equal(await question.evaluate(el => el.open), true);
        await question.locator("summary").focus(); await page.keyboard.press("Space"); assert.equal(await question.evaluate(el => el.open), false);
      }
      for (const [label, id] of [["研修内容", "cohort-learning"], ["日程・会場", "cohort-schedule"], ["受講料金", "cohort-tuition"], ["よくある質問", "cohort-faq"], ["お問い合わせ", "cohort-contact"]]) {
        if (width <= 1100) await page.getByRole("button", { name: "メニューを開く" }).click();
        const nav = page.getByRole("navigation", { name: width <= 1100 ? "モバイルナビゲーション" : "メインナビゲーション" });
        await nav.getByRole("link", { name: label }).click();
        assert.equal(new URL(page.url()).pathname, "/recruitment/first");
        assert.equal(new URL(page.url()).hash, "#" + id);
        if (width <= 1100) assert.equal(await page.evaluate(() => document.activeElement.id), id);
        assert.ok(await page.locator("#" + id).evaluate(el => el.getBoundingClientRect().top >= document.querySelector(".site-header").getBoundingClientRect().bottom - 1));
      }
      assert.ok(await page.locator('a[href^="tel:"]').evaluateAll(nodes => nodes.every(el => el.getAttribute("href") === "tel:0985747643")));
      for (const link of await page.locator('a[href^="#"]').all()) assert.equal(await page.locator(await link.getAttribute("href")).count(), 1);
      if (width <= 600) {
        assert.ok(await page.locator(".recruitment-contact-bar a").evaluateAll(nodes => nodes.every(el => el.getBoundingClientRect().height >= 44)));
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        assert.ok(await page.evaluate(() => document.querySelector(".recruitment-footer p:last-child").getBoundingClientRect().bottom <= document.querySelector(".recruitment-contact-bar").getBoundingClientRect().top));
      }
      if (out && [390, 1440].includes(width)) {
        for (const [selector, name] of [[".cohort-schedule-switcher", "schedule"], ["#cohort-tuition", "fees"]]) await page.locator(selector).screenshot({ path: path.join(out, `${name}-${width}.png`), style: ".site-header,.recruitment-contact-bar,.skip-link {visibility:hidden!important}" });
        await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
        await page.screenshot({ path: path.join(out, `hero-${width}.png`) });
      }
      report.widths.push({ width, all18Dates: true, keyboardTabs: true, compareAll: true, feesMatchHomepage: true, passed: true });
      await context.close();
    }
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 }, reducedMotion: "reduce" });
    const page = await noJs.newPage(); await page.goto(target, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".cohort-venue-panel time").count(), 18);
    assert.equal(await page.locator(".cohort-venue-panel:visible time").count(), 18);
    assert.equal(await page.getByRole("tab").count(), 0);
    await page.getByRole("navigation", { name: "会場別の日程へ移動" }).getByRole("link", { name: "福岡会場" }).click();
    assert.ok(page.url().endsWith("#schedule-fukuoka"));
    await page.locator(".recruitment-faq summary").first().click();
    assert.equal(await page.locator(".recruitment-faq details").first().getAttribute("open"), "");
    report.noJavaScriptAll18Dates = true;
    report.noJavaScriptAll18DatesVisible = true;
    await noJs.close();
    assert.deepEqual(report.externalRequests, []); assert.deepEqual(report.errors, []);
    if (out) fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2) + "\n");
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
