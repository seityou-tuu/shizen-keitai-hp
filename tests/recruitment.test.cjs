require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { firstCohortConfig, firstCohortDetails, firstCohortMinimumNotice, getFirstCohort, getFirstCohortSummary, formatSessionDate, isFirstCohortPreview } = require("../lib/recruitment.ts");
// Static image imports are transformed by Next in production; use metadata stubs
// for this Node-only text/price test. Real image ratios are checked in Chromium.
require.extensions[".jpg"] = (module, filename) => {
  module.exports = { src: "/images/" + require("node:path").basename(filename), width: 1, height: 1 };
};
require.extensions[".webp"] = require.extensions[".jpg"];
require.extensions[".css"] = module => { module.exports = {}; };
const OriginalFirstPage = require("../app/recruitment/first/page.tsx").default;
function FirstPage() {
  const previous = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = "preview";
  try { return OriginalFirstPage(); } finally { if (previous === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous; }
}
const now = new Date("2026-11-06T03:00:00Z");
test("first-cohort alias redirects only in preview and always has noindex headers", async () => {
  const previous = process.env.VERCEL_ENV;
  const config = require("../next.config.ts").default;
  try {
    process.env.VERCEL_ENV = "production";
    assert.deepEqual(await config.redirects(), []);
    process.env.VERCEL_ENV = "preview";
    assert.deepEqual(await config.redirects(), [{ source: "/first-cohort", destination: "/recruitment/first", permanent: false }]);
    const headers = await config.headers();
    for (const source of ["/first-cohort", "/recruitment/:path*"]) {
      assert.ok(headers.find(rule => rule.source === source).headers.some(header => header.key === "X-Robots-Tag" && header.value.includes("noindex")));
    }
    assert.ok(!require("../lib/site-config.ts").PUBLIC_PATHS.includes("/first-cohort"));
  } finally { if (previous === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous; }
});
test("all 18 dates match the organizer's schedule and the 2027 Japanese calendar", () => {
  const expected = [
    ["東京", ["2027-01-15", "2027-02-08", "2027-03-08", "2027-04-20", "2027-05-18", "2027-06-22"], ["金", "月", "月", "火", "火", "火"]],
    ["大阪", ["2027-01-12", "2027-02-10", "2027-03-10", "2027-04-22", "2027-05-20", "2027-06-24"], ["火", "水", "水", "木", "木", "木"]],
    ["福岡", ["2027-01-18", "2027-02-12", "2027-03-12", "2027-04-23", "2027-05-21", "2027-06-25"], ["月", "金", "金", "金", "金", "金"]],
  ];
  firstCohortDetails.venues.forEach((venue, index) => {
    assert.equal(venue.name, expected[index][0]);
    assert.deepEqual([...venue.dates], expected[index][1]);
    venue.dates.forEach((date, i) => assert.ok(formatSessionDate(date).includes(expected[index][2][i])));
    assert.ok(venue.dates[0] > firstCohortDetails.deadline);
    assert.equal(venue.capacity, 6);
    assert.equal(venue.address, null);
    assert.equal(venue.startTime, null);
    assert.equal(venue.endTime, null);
  });
});
test("approved cohort page renders in production and local production without opening applications or indexing", () => {
  const previous = process.env.VERCEL_ENV;
  try {
    for (const environment of ["production", "preview", undefined]) {
      if (environment === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = environment;
      const html = renderToStaticMarkup(React.createElement(OriginalFirstPage));
      assert.match(html, /第1期生募集/);
      assert.match(html, /募集準備中/);
      assert.ok(html.includes("https://lin.ee/O3tJo01"));
      assert.ok(!/<form|<input|募集受付中/.test(html));
      const metadata = require("../app/recruitment/first/page.tsx").generateMetadata();
      assert.match(metadata.title, /第1期生/);
      assert.equal(metadata.alternates.canonical, "/recruitment/first");
      assert.deepEqual(metadata.robots, { index: false, follow: false });
    }
  } finally { if (previous === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous; }
  // The preview-only legacy alias and search indexing policy remain unchanged.
  assert.equal(isFirstCohortPreview({ VERCEL_ENV: "production", NODE_ENV: "development" }), false);
  assert.equal(isFirstCohortPreview({ VERCEL_ENV: "preview", NODE_ENV: "production" }), true);
  assert.equal(isFirstCohortPreview({ NODE_ENV: "development" }), true);
  assert.equal(isFirstCohortPreview({ NODE_ENV: "production" }), false);
  assert.equal(isFirstCohortPreview({}), false);
  assert.ok(!require("../lib/site-config.ts").PUBLIC_PATHS.includes("/recruitment/first"));
  const callout = require("../components/first-cohort-callout.tsx").FirstCohortCallout;
  const announcement = renderToStaticMarkup(React.createElement(callout));
  for (const text of ["第1期生募集案内", "募集準備中", "2027年1月", "東京・大阪・福岡", "各会場6名／合計18名", "2027年1月10日"]) assert.ok(announcement.includes(text), text);
  assert.ok(!announcement.includes("募集受付中"));
});
function config() { return structuredClone(firstCohortConfig); }

test("confirmed first cohort remains preparing with no application endpoint or invented times", () => {
  const info = getFirstCohort(config(), now);
  assert.equal(info.statusLabel, "募集準備中");
  assert.equal(info.confirmed.capacity, 18);
  assert.equal(info.confirmed.deadline, "2027-01-10");
  assert.equal(info.confirmed.trainingTime, null);
  assert.equal(firstCohortDetails.application.url, null);
  assert.equal(firstCohortConfig.publicationApproved, false);
  assert.equal(getFirstCohortSummary().period, "2027年1月〜6月");
  assert.equal(getFirstCohortSummary().capacityLabel, "各会場6名");
  assert.equal(getFirstCohortSummary().totalCapacity, 18);
});
test("draft information is never passed to the public recruitment view", () => {
  const input = config();
  input.draft.venue = "内部用の未確定会場";
  input.draft.startDate = "2099-01-01";
  input.draft.capacity = 999;
  const info = getFirstCohort(input, now);
  assert.ok(!JSON.stringify(info).includes("内部用"));
  assert.ok(!JSON.stringify(info).includes("2099"));
  assert.equal(info.confirmed.capacity, 18);
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
  assert.match(html, /2027年1月〜6月/);
  assert.match(html, /2,970,000円（税込）/);
  assert.match(html, /税抜2,700,000円/);
  assert.match(html, /990,000/);
  assert.match(html, /tel:0985747643/);
  assert.ok(!/<form|<input/.test(html));
  for (const name of ["practical-hands-on", "practical-observation", "group-guidance"]) assert.equal(html.split(`data-photo="${name}"`).length - 1, 1);
  assert.match(html, /第1期生・第0期生の実施状況を示すものではありません/);
  assert.equal((html.match(/<img/g) || []).length, 6);
  for (const url of ["https://youtu.be/yp_P0a_oedY", "https://youtu.be/yudalXPijCk"]) assert.ok(html.includes(url));
  assert.ok(!/<iframe|autoplay/.test(html));
  assert.ok(html.indexOf("cohort-next-step-title") < html.indexOf('id="cohort-learning"'));
  assert.ok(!html.includes("見るだけで</em>"));
  assert.equal((html.match(/確定後にご案内します/g) || []).length, 0);
  assert.match(html, /https:\/\/lin\.ee\/O3tJo01/);
  assert.ok(!/募集受付中|LINEも未開設/.test(html));
});


test("cohort introduces the approved instructor and the next cohort without invented benefits or quotes", () => {
  const html = renderToStaticMarkup(React.createElement(FirstPage));
  for (const fact of ["永友裕也", "柔道整復師（2012年取得）", "2017年 ながとも整骨院開院", "自然形体療法 理事", "15年", "220万回", "最新の再生数を示すものではなく", "0期生の研修が"]) assert.ok(html.includes(fact), fact);
  assert.ok(!/<blockquote|限定特典|優先選抜|創設メンバー|2024年|FANCHANNEL GP/.test(html));
  assert.ok(!html.includes("現在ご利用いただけるのは電話による受講相談です"));
  assert.equal(firstCohortDetails.application.url, null);
});

test("program header keeps its original navigation destinations", () => {
  const { Header } = require("../components/header.tsx");
  const html = renderToStaticMarkup(React.createElement(Header));
  const nav = html.match(/<nav aria-label="メインナビゲーション"[^>]*>(.*?)<\/nav>/s)[1];
  assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(match=>match[1]), ["/#about", "/#training", "/#roadmap", "/#courses", "/#faq", "/#contact", "https://lin.ee/O3tJo01"]);
  const homeHeader = renderToStaticMarkup(React.createElement(Header, { showFirstCohort: true }));
  assert.equal((homeHeader.match(/href="\/recruitment\/first"/g) || []).length, 2);
  assert.equal((homeHeader.match(/class="header-cohort-link"/g) || []).length, 2);

});

test("first cohort menus and content links use the dedicated page sections", () => {
  const html = renderToStaticMarkup(React.createElement(FirstPage));
  for (const label of ["メインナビゲーション", "モバイルナビゲーション"]) {
    const nav = html.match(new RegExp(`<nav[^>]*aria-label="${label}"[^>]*>(.*?)</nav>`, "s"))[1];
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(match=>match[1]), ["/#about", "#cohort-learning", "#cohort-schedule", "#cohort-tuition", "#cohort-faq", "#cohort-contact", "https://lin.ee/O3tJo01"]);
  }
  for (const oldDestination of ["/#training", "/#roadmap", "/#courses", "/#faq", "/#contact"]) assert.ok(!html.includes(`href="${oldDestination}"`));
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(match=>match[1]));
  for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(hash), hash);
});

test("minimum attendance is explicit for all three venues and does not change capacity", () => {
  assert.equal(firstCohortDetails.minimumParticipantsPerVenue, 3);
  assert.equal(firstCohortMinimumNotice, "各会場の申込人数が3名に満たない場合、開催を中止する場合がございます。");
  const html = renderToStaticMarkup(React.createElement(FirstPage)).replace(/<!--.*?-->/g, "");
  assert.ok(html.replace(/<[^>]+>/g, "").includes("各会場6名（最少催行人数3名）・合計18名"));
  assert.equal((html.match(/class="cohort-minimum-notice"/g) || []).length, 2);
  for (const venue of firstCohortDetails.venues) {
    const panel = html.match(new RegExp(`<article[^>]*id="schedule-${venue.id}"[^>]*>(.*?)</article>`, "s"))[1];
    assert.ok(panel.includes("最少催行人数3名"), venue.name);
    assert.ok(panel.includes("定員 <strong>6</strong>名"), venue.name);
    assert.equal((panel.match(/<time/g) || []).length, 6);
  }
});
