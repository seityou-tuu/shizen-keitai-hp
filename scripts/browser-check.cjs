// Optional local QA using an existing Playwright installation; no browser dependency is bundled.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const base = new URL(process.env.QA_BASE_URL || "http://127.0.0.1:3100");
if (!["127.0.0.1", "localhost"].includes(base.hostname))
  throw Error(
    "This check is for a local build only; use the manual checklist for Vercel.",
  );
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE_PATH || "playwright",
);
const out = process.env.QA_OUTPUT_DIR;
if (out) fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({
    ...(process.env.CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH }
      : {}),
    headless: true,
    args: ["--no-sandbox"],
  });
  const report = {
    conditions:
      "Local Chromium, DPR 1, reduced motion, no CPU/network throttling, single navigation per width; not field or iPhone Safari data",
    widths: [],
    routes: [],
    externalRequests: [],
    errors: [],
  };
  try {
    for (const width of [320, 360, 375, 390, 400, 414, 430, 768, 1024, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });
      await context.route("**/*", (route) => {
        const url = new URL(route.request().url());
        if (url.origin === base.origin) return route.continue();
        report.externalRequests.push(url.origin + url.pathname);
        return route.abort();
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => report.errors.push(error.message));
      await page.addInitScript(() => {
        window.__qaMetrics = { lcp: null, cls: 0 };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries())
            window.__qaMetrics.lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries())
            if (!entry.hadRecentInput) window.__qaMetrics.cls += entry.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      const response = await page.goto(base.href, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator("html").getAttribute("lang"), "ja");
      assert.equal(await page.locator("h1").count(), 1);
      assert.match(await page.title(), /自然形体療法 資格取得プログラム/);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://shizen-keitai-hp.vercel.app");
      assert.ok((await page.locator('meta[name="description"]').getAttribute("content")).length > 40);
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute("content"), "https://shizen-keitai-hp.vercel.app");
      assert.equal(await page.locator('img:not([alt]), img[alt=""]').count(), 0);

      assert.match(response.headers()["x-robots-tag"], /noindex/);
      await page.waitForTimeout(150);
      const profileText = await page.locator("#instructors .instructor-details").innerText();
      for (const fact of ["柔道整復師（2012年取得）", "2017年 ながとも整骨院開院", "15年", "自然形体療法 理事", "YouTube総再生回数220万回", "2024年 FANCHANNEL グランプリ"]) {
        assert.equal(profileText.split(fact).length - 1, 1, `profile fact at ${width}: ${fact}`);
      }
      assert.ok(await page.locator("#about .section-heading, #about h2").evaluateAll(nodes => nodes.every(el => getComputedStyle(el).animationName === "none")), "reduced-motion headings must not animate");
      const initial = await page.evaluate(() => ({
        ...window.__qaMetrics,
        scroll: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      assert.ok(initial.scroll <= width, `horizontal overflow at ${width}`);
      const contrast = await page.evaluate(() => {
        const rgb = (value) => value.match(/[\d.]+/g).map(Number);
        const luminance = (color) =>
          color
            .slice(0, 3)
            .map((v) => {
              v /= 255;
              return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
            })
            .reduce(
              (sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i],
              0,
            );
        return [
          ".renewal-faq-list summary > span:first-child",
          ".renewal-faq-list h3",
          ".contact-phone",
          ".home-footer .eyebrow",
        ].map((selector) => {
          const element = document.querySelector(selector);
          const foreground = rgb(getComputedStyle(element).color);
          let ancestor = element,
            background = [253, 253, 250];
          while (ancestor) {
            const color = rgb(getComputedStyle(ancestor).backgroundColor);
            if (color.length === 3 || color[3] === 1) {
              background = color;
              break;
            }
            ancestor = ancestor.parentElement;
          }
          const a = luminance(foreground),
            b = luminance(background);
          return {
            selector,
            ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
          };
        });
      });
      assert.ok(
        contrast.every((sample) => sample.ratio >= 4.5),
        `text contrast at ${width}`,
      );
      const numbers = await page
        .locator(".renewal-faq-list summary > span:first-child")
        .evaluateAll((nodes) =>
          nodes.map((node) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            return {
              text: node.textContent,
              width: node.getBoundingClientRect().width,
              lines: new Set(
                [...range.getClientRects()].map((rect) => Math.round(rect.top)),
              ).size,
            };
          }),
        );
      assert.equal(numbers.length, 10);
      assert.ok(
        numbers.every((number) => number.lines === 1),
        `wrapped FAQ numbers at ${width}`,
      );
      for (let i = 0; i < 10; i++) {
        const details = page.locator(".renewal-faq-list details").nth(i);
        const summary = details.locator("summary");
        await summary.click();
        assert.equal(await details.evaluate((el) => el.open), true);
        assert.ok((await details.locator("p").innerText()).length > 15);
        await summary.focus();
        await page.keyboard.press("Space");
        assert.equal(await details.evaluate((el) => el.open), false);
      }
      await page
        .locator(".renewal-faq-list summary")
        .last()
        .scrollIntoViewIfNeeded();
      if (out && [320, 430, 1440].includes(width))
        await page.screenshot({ path: path.join(out, `faq-${width}.png`) });
      if (width <= 1100) {
        const menu = page.getByRole("button", { name: "メニューを開く" });
        await menu.click();
        await page.keyboard.press("Escape");
        assert.equal(await menu.getAttribute("aria-expanded"), "false");
        assert.equal(
          await menu.evaluate((el) => el === document.activeElement),
          true,
        );
      }
      const nav =
        width <= 1100
          ? page.getByRole("navigation", { name: "モバイルナビゲーション" })
          : page.getByRole("navigation", { name: "メインナビゲーション" });
      for (const label of [
        "自然形体療法とは",
        "研修内容",
        "資格取得コース",
        "受講料金",
        "よくある質問",
        "お問い合わせ",
      ]) {
        if (width <= 1100)
          await page.getByRole("button", { name: "メニューを開く" }).click();
        const link = nav.getByRole("link", { name: label, exact: true });
        const target = new URL(await link.getAttribute("href"), base).hash;
        await link.click();
        assert.ok(
          page.url().endsWith(target),
          `menu target ${label} at ${width}`,
        );
        const positions = await page.evaluate(
          (selector) => ({
            top: document.querySelector(selector).getBoundingClientRect().top,
            header: document
              .querySelector(".site-header")
              .getBoundingClientRect().bottom,
          }),
          target,
        );
        assert.ok(
          positions.top >= positions.header - 1,
          `menu hidden target ${target} at ${width}`,
        );
        if (width <= 1100)
          assert.equal(
            await page
              .getByRole("button", { name: "メニューを開く" })
              .getAttribute("aria-expanded"),
            "false",
          );
      }
      const sections = [];
      for (const section of await page.locator("#main > section").all()) {
        await section.scrollIntoViewIfNeeded();
        const audit = await section.evaluate((element) => {
          const overflow = [
            ...element.querySelectorAll("h1,h2,h3,p,dd,dt,li,img,a,button"),
          ]
            .filter((node) => {
              if (!node.getClientRects().length) return false;
              const rect = node.getBoundingClientRect();
              return (
                rect.left < -1 ||
                rect.right > innerWidth + 1 ||
                (node.matches("h1,h2,h3,p,dd,dt") &&
                  node.scrollWidth > node.clientWidth + 2)
              );
            })
            .map((node) => ({
              tag: node.tagName,
              text: node.textContent.slice(0, 60),
            }));
          return { id: element.id || "hero", overflow };
        });
        assert.deepEqual(
          audit.overflow,
          [],
          `section overflow ${audit.id} at ${width}`,
        );
        sections.push(audit.id);
      }
      assert.equal(sections.length, 12);
      const allNumbers = await page
        .locator(
          ".future-list li > span,.support-list li > span,.learning-cycle li > span,.section-heading .eyebrow > span,.perspective-number,.renewal-step-grid .renewal-kicker,.renewal-flow li > .renewal-kicker",
        )
        .evaluateAll((nodes) =>
          nodes.map((node) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            return {
              value: node.textContent,
              lines: new Set(
                [...range.getClientRects()].map((rect) => Math.round(rect.top)),
              ).size,
            };
          }),
        );
      assert.ok(
        allNumbers.every((number) => number.lines === 1),
        `wrapped section numbers at ${width}`,
      );
      const links = await page
        .locator("a[href]")
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
      for (const href of links) {
        assert.notEqual(href, "#", "ambiguous placeholder anchor");
        if (href.startsWith("tel:")) continue;
        const url = new URL(href, base);
        assert.equal(url.origin, base.origin);
        assert.ok(
          ["/", "/company", "/legal", "/privacy", "/terms"].includes(
            url.pathname,
          ),
        );
        if (url.hash && url.pathname === "/")
          assert.equal(await page.locator(url.hash).count(), 1, href);
      }
      if (out && [320, 375, 390, 400, 430, 1440].includes(width)) {
        for (const id of ["about", "features", "audience", "support", "training", "roadmap", "instructors", "future", "courses", "contact"]) {
          await page.locator(`#${id}`).scrollIntoViewIfNeeded();
          await page
            .locator(`#${id}`)
            .screenshot({ path: path.join(out, `${id}-${width}.png`), style: ".site-header,.mobile-consult-bar,.skip-link { visibility: hidden !important; }" });
        }
      }
      const phones = await page
        .locator('a[href^="tel:"]')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
      assert.ok(
        phones.length >= 7 && phones.every((href) => href === "tel:0985747643"),
      );
      assert.equal(
        await page.locator('a[href*="lin.ee"],a[href*="line.me"]').count(),
        0,
      );
      assert.equal(await page.locator("form,input,textarea,select").count(), 0);
      assert.equal(await page.locator(".line-preparing").count(), 1);
      if (width <= 600) {
        const sticky = page.getByRole("navigation", {
          name: "スマートフォンの受講相談",
        });
        assert.equal(
          await sticky.locator("a").first().getAttribute("href"),
          "tel:0985747643",
        );
        assert.equal(
          await sticky.locator("a").last().getAttribute("href"),
          "#contact",
        );
        const taps = await sticky.locator("a").evaluateAll((nodes) =>
          nodes.map((node) => ({
            width: node.getBoundingClientRect().width,
            height: node.getBoundingClientRect().height,
          })),
        );
        assert.ok(taps.every((rect) => rect.width >= 44 && rect.height >= 44));
        assert.ok(await sticky.locator("a").evaluateAll(nodes => nodes.every(el => el.scrollWidth <= el.clientWidth + 1)), `sticky CTA text overflow at ${width}`);
        await sticky.locator("a").last().click();
        assert.ok(page.url().endsWith("#contact"));
        await page.evaluate(() =>
          scrollTo(0, document.documentElement.scrollHeight),
        );
        const bottom = await page.evaluate(() => ({
          copyright: document
            .querySelector(".footer-bottom")
            .getBoundingClientRect().bottom,
          bar: document
            .querySelector(".mobile-consult-bar")
            .getBoundingClientRect().top,
        }));
        assert.ok(
          bottom.copyright <= bottom.bar,
          `footer hidden by sticky CTA at ${width}`,
        );
      }
      for (const photo of await page.locator(".program-photo img").all()) {
        await photo.scrollIntoViewIfNeeded();
        await photo.evaluate((img) => img.decode());
        const ratio = await photo.evaluate((img) => ({
          natural: img.naturalWidth / img.naturalHeight,
          fit: getComputedStyle(img).objectFit,
          name: img.closest("figure").dataset.photo,
          displayed:
            img.getBoundingClientRect().width /
            img.getBoundingClientRect().height,
        }));
        assert.ok(
          Math.abs(ratio.natural - ratio.displayed) < 0.015 ||
          (ratio.fit === "cover" && ["treatment-main", "instructor-portrait"].includes(ratio.name)),
          `image distortion or unintended cropping at ${width}`,
        );
      }
      assert.equal(await page.locator(".program-photo img").count(), 8);
      for (const course of await page.locator(".tuition-course").all()) {
        const text = (await course.innerText()).replace(/\s/g, "");
        for (const value of [
          "990,000円（税込）",
          "税抜900,000円",
          "6ヶ月",
          "月1回",
          "9:00〜17:00",
          "オンライン",
          "1回2時間",
        ])
          assert.ok(text.includes(value), value);
      }
      assert.match(
        await page.locator(".tuition-total").innerText(),
        /2,970,000/,
      );
      await page.evaluate(() => scrollTo(0, 0));
      if (out && [390, 1440].includes(width))
        await page.screenshot({ path: path.join(out, `top-${width}.png`) });
      report.widths.push({
        width,
        initialLcpMs: initial.lcp,
        sectionsChecked: sections,
        numberedItemsChecked: allNumbers.length,
        menuLinksChecked: 6,
        initialCls: initial.cls,
        faqNumberLines: numbers.map((number) => number.lines),
        contrast: contrast.map((sample) => ({
          selector: sample.selector,
          ratio: Number(sample.ratio.toFixed(2)),
        })),
        passed: true,
      });
      await context.close();
    }
    const page = await browser.newPage();
    for (const route of ["/company", "/legal", "/privacy", "/terms"]) {
      const response = await page.goto(new URL(route, base).href, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(
        await page.locator('link[rel="canonical"]').getAttribute("href"),
        `https://shizen-keitai-hp.vercel.app${route}`,
      );
      assert.equal(
        await page.locator(".information-phone").getAttribute("href"),
        "tel:0985747643",
      );
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${route} overflow`,
        );
      }
      if (out) {
        for (const width of [390, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          await page.screenshot({ path: path.join(out, `${route.slice(1)}-${width}.png`), fullPage: true });
        }
      }
      report.routes.push({ route, status: response.status(), passed: true });
    }
    assert.deepEqual(report.externalRequests, []);
    const motionPage = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: "no-preference" });
    await motionPage.goto(base.href, { waitUntil: "networkidle" });
    await motionPage.locator("#about").scrollIntoViewIfNeeded();
    assert.equal(await motionPage.locator("#about .section-heading").evaluate(el => getComputedStyle(el).opacity), "1", "scroll enhancement must keep content opaque");
    assert.ok(await motionPage.locator("#about h2").isVisible());
    await motionPage.close();
    assert.deepEqual(report.errors, []);
    if (out)
      fs.writeFileSync(
        path.join(out, "report.json"),
        JSON.stringify(report, null, 2),
      );
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
