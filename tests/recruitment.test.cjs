require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { firstCohortConfig, getFirstCohort } = require("../lib/recruitment.ts");
// Static image imports are transformed by Next in production; use metadata stubs
// for this Node-only text/price test. Real image ratios are checked in Chromium.
require.extensions[".jpg"] = (module, filename) => {
  module.exports = { src: "/images/" + require("node:path").basename(filename), width: 1, height: 1 };
};
const FirstPage = require("../app/recruitment/first/page.tsx").default;
const now = new Date("2026-11-06T03:00:00Z");
function config() { return structuredClone(firstCohortConfig); }

test("first cohort starts as preparing with no invented dates, capacity or venue", () => {
  const info = getFirstCohort(config(), now);
  assert.equal(info.statusLabel, "募集準備中");
  assert.ok(Object.values(info.confirmed).every(value => value === null));
});
test("draft information is never passed to the public recruitment view", () => {
  const input = config();
  input.draft.venue = "内部用の未確定会場";
  input.draft.startDate = "2099-01-01";
  input.draft.capacity = 999;
  const info = getFirstCohort(input, now);
  assert.ok(!JSON.stringify(info).includes("内部用"));
  assert.ok(!JSON.stringify(info).includes("2099"));
  assert.equal(info.confirmed.capacity, null);
  assert.equal(info.draft, undefined);
});
test("open status requires explicit approval and a confirmed opening date already reached", () => {
  const input = config();
  input.status = "open";
  assert.equal(getFirstCohort(input, now).status, "preparing");
  input.confirmed.recruitmentStartDate = "2026-11-01";
  assert.equal(getFirstCohort(input, now).status, "preparing");
  input.publicationApproved = true;
  assert.equal(getFirstCohort(input, now).status, "open");
  assert.ok(!getFirstCohort(input, now).summary.includes("準備中"));
  input.confirmed.recruitmentStartDate = "2099-01-01";
  assert.equal(getFirstCohort(input, now).status, "preparing");
});
test("invalid dates/capacities stay unconfirmed and an expired announcement is not open", () => {
  const input = config();
  input.confirmed.startDate = "2026-02-31";
  input.confirmed.capacity = -1;
  assert.equal(getFirstCohort(input, now).confirmed.startDate, null);
  assert.equal(getFirstCohort(input, now).confirmed.capacity, null);
  input.status = "open";
  input.publicationApproved = true;
  input.confirmed.recruitmentStartDate = "2026-11-01";
  input.confirmed.deadline = "2026-11-05";
  assert.equal(getFirstCohort(input, now).status, "closed");
  assert.match(getFirstCohort(input, now).summary, /終了しました/);
});
test("recruitment page retains known fees and phone with only the approved existing training assets", () => {
  const html = renderToStaticMarkup(React.createElement(FirstPage));
  assert.match(html, /募集準備中/);
  assert.match(html, /第0期生の研修が始まっています/);
  assert.match(html, /2,970,000円（税込）/);
  assert.match(html, /税抜2,700,000円/);
  assert.match(html, /990,000/);
  assert.match(html, /tel:0985747643/);
  assert.ok(!/<form|<input/.test(html));
  for (const name of ["practical-hands-on", "practical-observation", "group-guidance"]) assert.equal(html.split(`data-photo="${name}"`).length - 1, 1);
  assert.match(html, /第1期生・第0期生の実施状況を示すものではありません/);
  assert.equal((html.match(/<img/g) || []).length, 3);
  assert.equal((html.match(/確定後にご案内します/g) || []).length, 0);
  assert.ok(!/lin\.ee|line\.me|募集受付中/.test(html));
});


test("program header keeps its original navigation destinations", () => {
  const { Header } = require("../components/header.tsx");
  const html = renderToStaticMarkup(React.createElement(Header));
  const nav = html.match(/<nav aria-label="メインナビゲーション"[^>]*>(.*?)<\/nav>/s)[1];
  assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(match=>match[1]), ["/#about", "/#training", "/#roadmap", "/#courses", "/#faq", "/#contact"]);
});

test("first cohort menus and content links use the dedicated page sections", () => {
  const html = renderToStaticMarkup(React.createElement(FirstPage));
  for (const label of ["メインナビゲーション", "モバイルナビゲーション"]) {
    const nav = html.match(new RegExp(`<nav[^>]*aria-label="${label}"[^>]*>(.*?)</nav>`, "s"))[1];
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(match=>match[1]), ["/#about", "#cohort-learning", "#cohort-schedule", "#cohort-tuition", "#cohort-faq", "#cohort-contact"]);
  }
  for (const oldDestination of ["/#training", "/#roadmap", "/#courses", "/#faq", "/#contact"]) assert.ok(!html.includes(`href="${oldDestination}"`));
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(match=>match[1]));
  for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(hash), hash);
});
