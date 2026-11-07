require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

test("home and recruitment compare the same approved stages, six-month duration and inclusive fees", () => {
  const Home = require("../app/page.tsx").default;
  const FirstPage = require("../app/recruitment/first/page.tsx").default;
  const home = renderToStaticMarkup(React.createElement(Home));
  const first = renderToStaticMarkup(React.createElement(FirstPage));
  const homeFees = home.match(/<section id="courses"[^>]*>(.*?)<\/section>/s)[1];
  const cohortFees = first.match(/<div class="recruitment-fees">(.*?)<div class="recruitment-total">/s)[1];
  const titles = ["準師範コース", "師範コース", "本部師範コース"];
  for (const fees of [homeFees, cohortFees]) {
    const headings = [...fees.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map(match => match[1]);
    assert.deepEqual(headings.slice(0, 3), titles);
    assert.equal((fees.match(/990,000/g) || []).length, 3);
    assert.ok(fees.includes("税込"));
    assert.equal((fees.match(/6ヶ月/g) || []).length >= 3, true);
    for (const stage of ["資格取得の第一歩", "準師範コースに続く", "3段階のロードマップの最終コース"]) assert.ok(fees.includes(stage), stage);
  }
  assert.ok(home.includes("技術を覚えるだけで終わらない。"));
  assert.ok(first.includes("受講前の疑問を相談する"));
  assert.ok(!home.includes("2024年FAN CHANNEL GP"));
});
