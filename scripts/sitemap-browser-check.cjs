// Check generated XML and actual metadata/headers on a local Production Build.
// QA_INDEXING_ENABLED describes the expected build policy; it does not change it.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const base = new URL(process.env.QA_BASE_URL || "http://127.0.0.1:3100");
assert(["localhost", "127.0.0.1"].includes(base.hostname), "Local builds only");
const enabled = process.env.QA_INDEXING_ENABLED === "true";
const site = "https://shizen-keitai-hp.vercel.app";
const paths = ["/", "/company", "/legal", "/privacy", "/terms"];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base.href, { waitUntil: "networkidle" });
    const xmlResponse = await page.request.get(new URL("/sitemap.xml", base).href);
    assert.equal(xmlResponse.status(), 200);
    assert.match(xmlResponse.headers()["content-type"], /(?:application|text)\/xml/);
    const parsed = await page.evaluate(xml => {
      const document = new DOMParser().parseFromString(xml, "application/xml");
      return {
        errors: document.querySelectorAll("parsererror").length,
        root: document.documentElement.localName,
        namespace: document.documentElement.namespaceURI,
        urls: [...document.getElementsByTagNameNS("http://www.sitemaps.org/schemas/sitemap/0.9", "url")]
          .map(node => [...node.children].filter(child => child.localName === "loc").map(child => child.textContent)),
      };
    }, await xmlResponse.text());
    assert.equal(parsed.errors, 0);
    assert.equal(parsed.root, "urlset");
    assert.equal(parsed.namespace, "http://www.sitemaps.org/schemas/sitemap/0.9");
    assert.deepEqual(parsed.urls, enabled ? paths.map(path => [`${site}${path}`]) : []);
    const robotsResponse = await page.request.get(new URL("/robots.txt", base).href);
    assert.equal(robotsResponse.status(), 200);
    const robots = (await robotsResponse.text()).split(/\r?\n/).filter(Boolean);
    if (enabled) {
      for (const line of ["User-Agent: *", "Allow: /", "Disallow: /api/", "Disallow: /recruitment/", "Disallow: /first-cohort", `Sitemap: ${site}/sitemap.xml`]) assert(robots.includes(line), line);
      assert(!robots.includes("Disallow: /"));
    } else {
      assert.deepEqual(robots, ["User-Agent: *", "Disallow: /"]);
    }
    const checked = [];
    for (const path of [...paths, "/recruitment/first"]) {
      const response = await page.goto(new URL(path, base).href, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      const indexable = enabled && path !== "/recruitment/first";
      // Metadata values live in content attributes, not text nodes.
      const meta = await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.map(node => node.content));
      assert(meta.length > 0);
      assert(meta.every(value => indexable ? /\bindex\b/.test(value) && !/\bnoindex\b/.test(value) : /\bnoindex\b/.test(value)), `${path}: ${meta}`);
      assert.equal(/noindex/.test(response.headers()["x-robots-tag"] || ""), !indexable);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      assert.equal(canonical, path === "/" ? site : `${site}${path}`);
      checked.push({ path, indexable, canonical });
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ enabled, xmlWellFormed: true, urls: parsed.urls.flat(), robots, pages: checked, errors }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
