require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { firstCohortConfig, getFirstCohort } = require("../lib/recruitment.ts");
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
test("recruitment page retains known fees and phone without forms or unapproved cohort photos", () => {
  const html = renderToStaticMarkup(React.createElement(FirstPage));
  assert.match(html, /募集準備中/);
  assert.match(html, /第0期生の研修が始まっています/);
  assert.match(html, /2,970,000円（税込）/);
  assert.match(html, /税抜2,700,000円/);
  assert.match(html, /990,000/);
  assert.match(html, /tel:0985747643/);
  assert.ok(!/<form|<input|<img/.test(html));
  assert.ok(!/lin\.ee|line\.me|募集受付中/.test(html));
});
