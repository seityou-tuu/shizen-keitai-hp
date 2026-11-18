const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");

const base = new URL(process.env.QA_BASE_URL || "http://127.0.0.1:3100");
assert(["127.0.0.1", "localhost"].includes(base.hostname));

const scenarios = [
  ["/", ".hero-statement .renewal-button", ".mobile-consult-bar", "#courses"],
  ["/recruitment/first", ".cohort-hero-actions .recruitment-button", ".recruitment-contact-bar", "#cohort-tuition"],
];

async function verify(browser, [path, heroSelector, barSelector, anchor]) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  let releaseScripts;
  const pending = new Promise(resolve => { releaseScripts = resolve; });
  await page.route("**/_next/static/**/*.js", async route => {
    await pending;
    await route.continue();
  });

  try {
    await page.goto(new URL(path, base).href, { waitUntil: "commit" });
    const hero = page.locator(heroSelector);
    const bar = page.locator(barSelector);
    await hero.waitFor();
    await page.waitForFunction(() => [...document.styleSheets].some(sheet => sheet.href));
    if (path !== "/") {
      await hero.evaluate(link => link.scrollIntoView({ block: "center", behavior: "instant" }));
    }
    const assertHeroHit = async () => {
      assert(await hero.evaluate(link => {
        const bounds = link.getBoundingClientRect();
        return link.contains(document.elementFromPoint(
          bounds.left + bounds.width / 2, bounds.top + bounds.height / 2,
        ));
      }));
    };
    assert(await bar.isHidden(), "server-rendered fixed bar must be hidden");
    await assertHeroHit();

    releaseScripts();
    await page.waitForLoadState("networkidle");
    assert(await bar.isHidden(), "hydration must not show a bar over the hero action");
    await assertHeroHit();

    await page.locator(anchor).evaluate(section => section.scrollIntoView({ behavior: "instant" }));
    await bar.waitFor({ state: "visible" });
    assert(await bar.locator("a").evaluateAll(links =>
      links.every(link => link.getBoundingClientRect().height >= 44)));
    await bar.locator("a").first().focus();
    await hero.evaluate(link => link.scrollIntoView({ block: "center", behavior: "instant" }));
    await bar.waitFor({ state: "hidden" });
    assert(await hero.evaluate(link => link === document.activeElement));
    await assertHeroHit();

    await page.setViewportSize({ width: 1440, height: 900 });
    assert(await bar.isHidden());
    await page.setViewportSize({ width: 390, height: 568 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await bar.waitFor({ state: "visible" });
    assert.deepEqual(errors, []);
  } finally {
    releaseScripts();
    await page.close();
  }

  const noScript = await browser.newPage({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  });
  try {
    await noScript.goto(new URL(path, base).href);
    const bar = noScript.locator(barSelector);
    assert.equal(await bar.evaluate(el => getComputedStyle(el).position), "static");
    assert(await bar.isVisible());
    assert.match(await bar.locator("a").first().getAttribute("href"), /^https:/);
    assert.match(await noScript.locator(heroSelector).getAttribute("href"), /^https:/);
  } finally {
    await noScript.close();
  }
  console.log(`PASS ${path}: first paint, hydration, return focus, resize and no JS`);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox"],
  });
  try {
    for (const scenario of scenarios) await verify(browser, scenario);
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
