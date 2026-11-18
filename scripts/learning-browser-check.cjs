// Optional local QA, using the same Playwright setup as the other browser checks.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = new URL(process.env.QA_BASE_URL || "http://127.0.0.1:3130");
assert(["localhost", "127.0.0.1"].includes(base.hostname));

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] });
  const report = { conditions: "Local production build; Chromium; DPR 1; reduced motion; external services not contacted", widths: [], errors: [] };
  try {
    for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      page.on("pageerror", error => report.errors.push(error.message));
      page.on("console", message => {
        if (["error", "warning"].includes(message.type())) report.errors.push(message.text());
      });
      await page.goto(base.href, { waitUntil: "networkidle" });
      await page.locator("img").evaluateAll(async images => {
        images.forEach(image => { image.loading = "eager"; });
        await Promise.all(images.map(image => image.decode()));
      });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const growth = await page.locator(".growth-stage").evaluateAll(stages => stages.map(stage => {
        const rect = selector => { const r = stage.querySelector(selector).getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, width: r.width }; };
        return { number: rect(".growth-number"), icon: rect(".growth-icon"), copy: rect(".growth-copy") };
      }));
      assert.equal(growth.length, 5);
      if (width <= 700) {
        assert(growth.every(stage => Math.abs(stage.number.top - stage.copy.top) <= 1), "Copy starts beside the number, not below the icon");
        assert(growth.every(stage => stage.icon.left < stage.copy.left && stage.icon.top > stage.number.top));
        const headings = await page.locator(".tuition-course").evaluateAll(courses => courses.map(course => {
          const step = course.querySelector(".renewal-kicker").getBoundingClientRect();
          const title = course.querySelector("h3").getBoundingClientRect();
          return { step, title };
        }));
        assert(headings.every(({ step, title }) => step.right <= title.left && step.top < title.bottom && step.bottom > title.top), "Course names and step labels share a row");
      } else if (width <= 1100) {
        assert(growth.every(stage => stage.copy.width > width / 2), "Tablet descriptions have a wide reading column");
      }
      if (width > 700) {
        const tops = await page.locator(".renewal-step-grid h3").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().top));
        assert(Math.max(...tops) - Math.min(...tops) <= 1, "Course headings share a comparison axis");
      }
      const videos = await page.locator("#instructors .evidence-video img").evaluateAll(images => images.map(image => {
        const r = image.getBoundingClientRect();
        return { top: r.top, width: r.width, height: r.height, fit: getComputedStyle(image).objectFit };
      }));
      assert.equal(videos.length, 2);
      assert(Math.abs(videos[0].top - videos[1].top) <= 1);
      assert(Math.abs(videos[0].width - videos[1].width) <= 1);
      assert(Math.abs(videos[0].height - videos[1].height) <= 1);
      assert(videos.every(video => video.fit === "contain" && video.width >= 120));
      assert.equal(await page.locator("iframe").count(), 0);
      assert.equal(await page.locator("#contact a[href='https://lin.ee/O3tJo01']").count(), 1);
      const detail = page.locator("#contact .contact-cohort-link");
      assert.equal(await detail.getAttribute("href"), "/recruitment/first#cohort-tuition");
      assert(await detail.evaluate(link => link.getBoundingClientRect().height >= 44));
      await detail.click();
      await page.waitForURL("**/recruitment/first#cohort-tuition");
      assert(await page.locator("#cohort-tuition").isVisible());
      assert((await page.locator('meta[name="robots"]').getAttribute("content")).includes("noindex"));
      report.widths.push({ width, growthStages: growth.length, comparableVideos: videos.length, finalCohortLink: true, passed: true });
      await page.close();
    }
    assert.deepEqual(report.errors, []);
    if (process.env.QA_OUTPUT_DIR) {
      fs.mkdirSync(process.env.QA_OUTPUT_DIR, { recursive: true });
      fs.writeFileSync(`${process.env.QA_OUTPUT_DIR}/learning-report.json`, JSON.stringify(report, null, 2));
    }
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
