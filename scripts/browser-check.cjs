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
    recruitmentWidths: [],
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
      const trainingLayout = await page.locator("#training").evaluate(el => {
        const rect = selector => { const r = el.querySelector(selector).getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}; };
        return {heading:rect(".training-practical-details .section-heading"),photo:rect(".training-main-photo > .program-photo"),copy:rect(".training-practical-details > .training-story-copy"),secondary:rect(".training-secondary-photo")};
      });
      if (width > 900) {
        assert.ok(trainingLayout.photo.right < trainingLayout.heading.left, `training must be side by side at ${width}`);
        assert.ok(Math.abs(trainingLayout.photo.top - trainingLayout.heading.top) < 2, `training heading/photo top alignment at ${width}`);
      } else {
        assert.ok(trainingLayout.heading.bottom <= trainingLayout.photo.top + 1, `training heading before photo at ${width}`);
        assert.ok(trainingLayout.photo.bottom <= trainingLayout.copy.top + 1, `training copy after photo at ${width}`);
        assert.ok(trainingLayout.copy.bottom <= trainingLayout.secondary.top + 1, `training secondary after copy at ${width}`);
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
      assert.equal(sections.length, 13);
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
          ["/", "/company", "/legal", "/privacy", "/terms", "/recruitment/first"].includes(
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
          (ratio.fit === "cover" && ["treatment-main", "instructor-portrait", "practical-hands-on"].includes(ratio.name)),
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
    const recruitment = await browser.newPage({ reducedMotion: "reduce" });
    recruitment.on("pageerror", error => report.errors.push(error.message));
    for (const width of [320, 360, 375, 390, 400, 414, 430, 768, 1024, 1440]) {
      await recruitment.setViewportSize({ width, height: 900 });
      const response = await recruitment.goto(new URL("/recruitment/first", base).href, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      assert.match(response.headers()["x-robots-tag"], /noindex/);
      assert.equal(await recruitment.locator("h1").count(), 1);
      assert.equal(await recruitment.locator(".program-photo img").count(), 3);
      for (const photo of await recruitment.locator(".program-photo img").all()) {
        await photo.scrollIntoViewIfNeeded();
        await photo.evaluate(img=>img.decode());
        assert.ok(await photo.evaluate(img=>Math.abs(img.naturalWidth/img.naturalHeight-img.getBoundingClientRect().width/img.getBoundingClientRect().height)<0.015), `recruitment uncropped photo at ${width}`);
      }
      assert.match(await recruitment.locator(".cohort-photo-note").innerText(), /第1期生・第0期生の実施状況を示すものではありません/);
      assert.equal(await recruitment.locator('link[rel="canonical"]').getAttribute("href"), "https://shizen-keitai-hp.vercel.app/recruitment/first");
      assert.match(await recruitment.title(), /第1期生/);
      assert.equal(await recruitment.locator("form,input,textarea").count(), 0);
      assert.equal(await recruitment.locator('a[href*="line.me"],a[href*="lin.ee"]').count(), 0);
      assert.match(await recruitment.locator(".recruitment-status").innerText(), /募集準備中/);
      assert.ok(!(await recruitment.locator("main").innerText()).includes("募集受付中"));
      assert.ok(await recruitment.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `recruitment overflow at ${width}`);
      const clipped = await recruitment.locator("main h1,main h2,main h3,main p,main a,main dd,main dt").evaluateAll(nodes => nodes.filter(el => { const r=el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth+1 || el.scrollWidth > el.clientWidth+2; }).map(el=>el.textContent));
      assert.deepEqual(clipped, [], `recruitment text clipping at ${width}`);
      for (const link of await recruitment.locator(".recruitment-quick-nav a").all()) {
        const hash = await link.getAttribute("href");
        await link.click();
        assert.ok(recruitment.url().endsWith(hash));
        assert.ok(await recruitment.locator(hash).evaluate(el => el.getBoundingClientRect().top >= document.querySelector(".site-header").getBoundingClientRect().bottom - 1), `recruitment anchor under header at ${width}`);
      }
      for (const item of await recruitment.locator(".recruitment-faq details").all()) {
        await item.locator("summary").click();
        assert.ok(await item.evaluate(el=>el.open));
        await item.locator("summary").focus();
        await recruitment.keyboard.press("Space");
        assert.ok(!(await item.evaluate(el=>el.open)));
      }
      assert.equal(await recruitment.locator(".recruitment-faq details").count(), 6);
      for (const fee of await recruitment.locator(".recruitment-fees article").all()) {
        const text=(await fee.innerText()).replace(/\s/g, "");
        for (const value of ["990,000円（税込）", "税抜900,000円", "6ヶ月"]) assert.ok(text.includes(value));
      }
      assert.match(await recruitment.locator(".recruitment-total").innerText(), /2,970,000円（税込）/);
      assert.ok(await recruitment.locator('a[href^="tel:"]').evaluateAll(nodes=>nodes.every(el=>el.getAttribute("href")==="tel:0985747643")));
      for (const link of await recruitment.locator('a[href^="#"]').all()) assert.equal(await recruitment.locator(await link.getAttribute("href")).count(), 1);
      if (width <= 700) {
        const bar=recruitment.locator(".recruitment-contact-bar");
        assert.ok(await bar.locator("a").evaluateAll(nodes=>nodes.every(el=>{const r=el.getBoundingClientRect();return r.height>=44 && r.width>=44 && el.scrollWidth<=el.clientWidth+1;})));
        await recruitment.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
        assert.ok(await recruitment.evaluate(()=>document.querySelector(".recruitment-footer p:last-child").getBoundingClientRect().bottom <= document.querySelector(".recruitment-contact-bar").getBoundingClientRect().top));
      }
      await recruitment.evaluate(()=>scrollTo(0,0));
      if (out && [320,390,768,1440].includes(width)) await recruitment.screenshot({path:path.join(out,`recruitment-${width}.png`),fullPage:true});
      report.recruitmentWidths.push({ width, passed:true });
    }
    await recruitment.close();
    const motionPage = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: "no-preference" });
    await motionPage.goto(base.href, { waitUntil: "networkidle" });
    await motionPage.locator("#about").scrollIntoViewIfNeeded();
    assert.equal(await motionPage.locator("#about .section-heading").evaluate(el => getComputedStyle(el).opacity), "1", "scroll enhancement must keep content opaque");
    assert.ok(await motionPage.locator("#about h2").isVisible());
    await motionPage.goto(new URL("/recruitment/first", base).href, { waitUntil: "networkidle" });
    await motionPage.locator(".cohort-observation-photo").scrollIntoViewIfNeeded();
    assert.ok(await motionPage.locator(".cohort-observation-photo").evaluate(el=>Number(getComputedStyle(el).opacity)>=.95), "recruitment scroll photo remains visible");
    await motionPage.emulateMedia({ reducedMotion: "reduce" });
    assert.ok(await motionPage.locator(".cohort-photo, #cohort-learning h2").evaluateAll(nodes=>nodes.every(el=>getComputedStyle(el).animationName==="none")), "recruitment reduced motion disables animation");
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
