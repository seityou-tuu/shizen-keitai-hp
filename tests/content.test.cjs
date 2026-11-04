require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { CONTACT_PHONE } = require("../lib/contact.ts");
const {
  operator,
  legalRows,
  termsRows,
} = require("../lib/site-information.ts");
test("the operator and statutory contact use the confirmed shared telephone", () => {
  assert.equal(operator.phone, CONTACT_PHONE);
  assert.equal(
    legalRows.find((row) => row.label === "電話番号").value,
    CONTACT_PHONE,
  );
});
test("statutory and course terms retain the same inclusive and exclusive prices", () => {
  for (const value of [
    legalRows.find((row) => row.label === "販売価格").value,
    termsRows.find((row) => row.label === "受講料").value,
  ]) {
    for (const price of [
      "990,000円（税込）",
      "900,000円（税抜）",
      "2,970,000円（税込）",
      "2,700,000円（税抜）",
    ])
      assert.ok(value.includes(price), price);
  }
  const period = termsRows.find((row) => row.label === "期間・研修形式").value;
  for (const fact of [
    "各コース6ヶ月",
    "月1回",
    "9:00〜17:00",
    "オンライン2時間",
  ])
    assert.ok(period.includes(fact), fact);
});
test("unknown address and contractual conditions remain explicit placeholders", () => {
  assert.equal(operator.address, null);
  for (const label of [
    "支払方法",
    "支払時期",
    "サービス提供時期",
    "キャンセル条件・手続き",
    "返金条件・返金時期・方法",
    "受講料以外の費用",
  ])
    assert.equal(
      legalRows.find((row) => row.label === label).value,
      null,
      label,
    );
  assert.equal(
    termsRows.find((row) => row.label === "受講要件・認定基準・進級条件").value,
    null,
  );
});
