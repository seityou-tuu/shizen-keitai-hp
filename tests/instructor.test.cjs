require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { renderToStaticMarkup } = require("react-dom/server");
const { instructorProfile } = require("../lib/instructor.ts");
const { InstructorProfile } = require("../components/instructor-profile.tsx");
const emptyProfile = { ...instructorProfile, background: [], qualifications: [], practiceExperience: "" };

test("unconfirmed profile facts are not published as empty headings or invented claims", () => {
  assert.equal(instructorProfile.displayName, "永友先生");
  const html = renderToStaticMarkup(InstructorProfile({ profile: emptyProfile }));
  assert.match(html, /永友先生/);
  for (const heading of [
    "<dt>氏名",
    "<dt>経歴",
    "<dt>保有資格",
    "<dt>施術歴",
    "<dt>指導実績",
    "<blockquote",
  ])
    assert.ok(!html.includes(heading), heading);
});
test("approved profile fields can be added independently without showing unspecified fields", () => {
  const html = renderToStaticMarkup(
    InstructorProfile({
      profile: {
        ...emptyProfile,
        formalName: "テスト用氏名",
        background: ["テスト用経歴"],
        message: "テスト用メッセージ <script>alert(1)</script>",
      },
    }),
  );
  assert.match(html, /<dt>氏名/);
  assert.match(html, /テスト用経歴/);
  assert.ok(!html.includes("<dt>保有資格"));
  assert.ok(!html.includes("<script>"));
  assert.match(html, /&lt;script&gt;/);
});

test("a message without biography does not produce an empty details list", () => {
  const html = renderToStaticMarkup(
    InstructorProfile({
      profile: { ...emptyProfile, message: "テスト用メッセージ" },
    }),
  );
  assert.match(html, /<blockquote/);
  assert.ok(!html.includes("<dl"));
});


test("the six operator-approved profile facts are shown once without inventing a formal name", () => {
  const html = renderToStaticMarkup(InstructorProfile({}));
  for (const fact of ["柔道整復師（2012年取得）", "2017年 ながとも整骨院開院", "15年", "自然形体療法 理事", "YouTube総再生回数220万回", "2024年 FANCHANNEL グランプリ"]) {
    assert.equal(html.split(fact).length - 1, 1, fact);
  }
  assert.ok(!html.includes("<dt>氏名"));
  assert.ok(!html.includes("<dt>指導実績"));
  assert.ok(!html.includes("詳しいプロフィールは"));
});
