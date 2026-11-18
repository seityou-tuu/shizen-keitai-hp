require("./register-ts.cjs");
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const {
  SITE_URL,
  PUBLIC_PATHS,
  isSearchIndexingEnabled,
} = require("../lib/site-config.ts");
const robots = require("../app/robots.ts").default;
const sitemap = require("../app/sitemap.ts").default;
const previous = {
  env: process.env.VERCEL_ENV,
  indexing: process.env.SITE_INDEXING_ENABLED,
};
after(() => {
  for (const [key, value] of [
    ["VERCEL_ENV", previous.env],
    ["SITE_INDEXING_ENABLED", previous.indexing],
  ]) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});
test("preview and local deployments are noindex even if production indexing is enabled", () => {
  process.env.SITE_INDEXING_ENABLED = "true";
  for (const env of ["preview", "development", ""]) {
    process.env.VERCEL_ENV = env;
    assert.equal(isSearchIndexingEnabled(), false);
    assert.equal(robots().rules.disallow, "/");
    assert.deepEqual(sitemap(), []);
  }
});
test("production indexing is opt-in and sitemap contains only canonical public pages", () => {
  process.env.VERCEL_ENV = "production";
  process.env.SITE_INDEXING_ENABLED = "false";
  assert.equal(isSearchIndexingEnabled(), false);
  process.env.SITE_INDEXING_ENABLED = "true";
  assert.equal(isSearchIndexingEnabled(), true);
  assert.equal(robots().sitemap, `${SITE_URL}/sitemap.xml`);
  const urls = sitemap().map((item) => item.url);
  const expectedPaths = ["/", "/company", "/legal", "/privacy", "/terms"];
  assert.deepEqual(PUBLIC_PATHS, expectedPaths);
  assert.deepEqual(urls, expectedPaths.map(path => `${SITE_URL}${path}`));
  assert.equal(new Set(urls).size, urls.length);
  assert.deepEqual(robots().rules, {
    userAgent: "*", allow: "/", disallow: ["/api/", "/recruitment/", "/first-cohort"],
  });
});
test("missing or non-exact production approval keeps sitemap empty and robots closed", () => {
  process.env.VERCEL_ENV = "production";
  for (const flag of [undefined, "", "false", "TRUE", "1", " true "]) {
    if (flag === undefined) delete process.env.SITE_INDEXING_ENABLED;
    else process.env.SITE_INDEXING_ENABLED = flag;
    assert.equal(isSearchIndexingEnabled(), false, `flag: ${flag}`);
    assert.deepEqual(sitemap(), []);
    assert.deepEqual(robots(), { rules: { userAgent: "*", disallow: "/" } });
  }
});
test("ownership verification does not grant search publication approval", () => {
  const previousVerification = process.env.GOOGLE_SITE_VERIFICATION;
  try {
    process.env.VERCEL_ENV = "production";
    process.env.SITE_INDEXING_ENABLED = "false";
    process.env.GOOGLE_SITE_VERIFICATION = "test-verification-token";
    assert.equal(require("../lib/analytics-config.ts").getGoogleVerification(), "test-verification-token");
    assert.equal(isSearchIndexingEnabled(), false);
    assert.deepEqual(sitemap(), []);
    assert.equal(robots().rules.disallow, "/");
  } finally {
    if (previousVerification === undefined) delete process.env.GOOGLE_SITE_VERIFICATION;
    else process.env.GOOGLE_SITE_VERIFICATION = previousVerification;
  }
});
test("HTTP noindex follows the same approval gate and always protects recruitment", async () => {
  const config = require("../next.config.ts").default;
  for (const [environment, flag, enabled] of [
    ["production", "false", false], ["production", "true", true], ["preview", "true", false],
  ]) {
    process.env.VERCEL_ENV = environment;
    process.env.SITE_INDEXING_ENABLED = flag;
    const headers = await config.headers();
    const hasNoindex = source => headers.find(rule => rule.source === source).headers
      .some(header => header.key === "X-Robots-Tag" && header.value === "noindex, nofollow");
    assert.equal(hasNoindex("/:path*"), !enabled);
    assert.equal(hasNoindex("/recruitment/:path*"), true);
    assert.equal(hasNoindex("/first-cohort"), true);
    assert.equal(sitemap().length, enabled ? 5 : 0);
    assert.equal(Boolean(robots().sitemap), enabled);
  }
});
