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
  assert.equal(urls.length, PUBLIC_PATHS.length);
  assert.ok(
    urls.every((url) => url.startsWith(SITE_URL) && !url.includes("/api/")),
  );
});
