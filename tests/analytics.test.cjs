require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { getGa4MeasurementId, getGoogleVerification } = require("../lib/analytics-config.ts");
const { startAnalytics } = require("../lib/analytics-client.ts");

// Synthetic fixtures only: never saved to environment settings or deployed.
const id = "G-QATEST0001";
test("GA4 requires production, an approved enable flag and a valid measurement ID", () => {
  assert.equal(getGa4MeasurementId({}), null);
  for (const VERCEL_ENV of [undefined, "preview", "development"]) {
    assert.equal(getGa4MeasurementId({ VERCEL_ENV, GA4_ENABLED: "true", GA4_MEASUREMENT_ID: id }), null);
  }
  for (const value of ["", "G-", "UA-123456", "G-<script>", "https://example.invalid"]) {
    assert.equal(getGa4MeasurementId({ VERCEL_ENV: "production", GA4_ENABLED: "true", GA4_MEASUREMENT_ID: value }), null);
  }
  assert.equal(getGa4MeasurementId({ VERCEL_ENV: "production", GA4_MEASUREMENT_ID: id }), null);
  assert.equal(getGa4MeasurementId({ VERCEL_ENV: "production", GA4_ENABLED: "true", GA4_MEASUREMENT_ID: id }), id);
});

test("Search Console emits no token for missing, invalid or preview settings", () => {
  const token = "verification_fixture_for_unit_test";
  assert.equal(getGoogleVerification({}), undefined);
  assert.equal(getGoogleVerification({ VERCEL_ENV: "preview", GOOGLE_SITE_VERIFICATION: token }), undefined);
  assert.equal(getGoogleVerification({ VERCEL_ENV: "production", GOOGLE_SITE_VERIFICATION: '<meta name="google-site-verification">' }), undefined);
  assert.equal(getGoogleVerification({ VERCEL_ENV: "production", GOOGLE_SITE_VERIFICATION: token }), token);
});

test("GA4 initializes once, sanitizes events and stops phone tracking on withdrawal", () => {
  const browser = {};
  const scripts = [];
  const root = new EventTarget();
  root.createElement = () => ({});
  root.head = { appendChild: script => scripts.push(script) };
  root.referrer = "https://example.invalid/private?health=secret";
  const click = (href, region = "#contact") => {
    const anchor = { getAttribute: () => href, closest: selector => selector === region ? {} : null };
    const event = new Event("click");
    Object.defineProperty(event, "target", { value: { closest: () => anchor } });
    root.dispatchEvent(event);
  };
  assert.equal(scripts.length, 0);
  const stopFirst = startAnalytics(id, browser, root);
  const stop = startAnalytics(id, browser, root); // StrictMode/reinitialization must replace listeners.
  stopFirst(); // Stale cleanup must not disable the current session.
  assert.equal(browser[`ga-disable-${id}`], false);
  assert.equal(scripts.length, 1);
  let commands = browser.dataLayer.map(item => Array.from(item));
  const config = commands.find(([name]) => name === "config")[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(commands.filter(([name, event]) => name === "event" && event === "page_view").length, 1);
  click("https://example.invalid/private");
  click("tel:0000000000");
  click("tel:0985747643");
  commands = browser.dataLayer.map(item => Array.from(item));
  const events = commands.filter(([name, event]) => name === "event" && event === "phone_click");
  assert.equal(events.length, 1);
  assert.deepEqual(events[0][2], { location: "contact", page_location: "https://shizen-keitai-hp.vercel.app/", page_referrer: "" });
  assert.ok(!JSON.stringify(commands).includes("0985747643"));
  assert.ok(!JSON.stringify(commands).includes("health=secret"));
  for (const href of ["https://lin.ee/O3tJo01", "/recruitment/first", "https://youtu.be/yp_P0a_oedY", "https://www.instagram.com/ngtmyy_1990"]) click(href);
  const tracked = browser.dataLayer.map(item => Array.from(item)).filter(item => item[0] === "event").map(item => item[1]);
  for (const name of ["line_click", "cohort_visit", "youtube_click", "instagram_click"]) assert.equal(tracked.filter(value => value === name).length, 1);
  stop();
  const count = browser.dataLayer.length;
  click("tel:0985747643");
  assert.equal(browser.dataLayer.length, count);
  assert.equal(browser[`ga-disable-${id}`], true);
});

test("an invalid GA4 ID cannot create scripts or listeners", () => {
  const browser = {};
  const stop = startAnalytics("not-an-id", browser, {});
  assert.deepEqual(browser, {});
  stop();
});
