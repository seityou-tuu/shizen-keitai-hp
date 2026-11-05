require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  CONTACT_PHONE,
  CONTACT_TEL,
  OFFICIAL_LINE_URL,
  getOfficialLineUrl,
} = require("../lib/contact.ts");

test("the published contact number uses the exact tap-to-call destination", () => {
  assert.equal(CONTACT_PHONE, "0985-74-7643");
  assert.equal(CONTACT_TEL, "tel:0985747643");
});
test("one shared setting controls LINE availability and blank values stay hidden", () => {
  assert.equal(getOfficialLineUrl(), getOfficialLineUrl(OFFICIAL_LINE_URL));
  assert.equal(getOfficialLineUrl(""), null);
  assert.equal(getOfficialLineUrl("  "), null);
});
test("only secure friend-add URLs on the official LINE hosts are accepted", () => {
  // These synthetic paths are validation fixtures, never published contact accounts.
  assert.equal(
    getOfficialLineUrl(" https://lin.ee/test123 "),
    "https://lin.ee/test123",
  );
  assert.equal(
    getOfficialLineUrl("https://line.me/R/ti/p/@test123"),
    "https://line.me/R/ti/p/@test123",
  );
  assert.equal(
    getOfficialLineUrl("https://line.me/R/ti/p/%40test123"),
    "https://line.me/R/ti/p/%40test123",
  );
  for (const value of [
    "not a URL",
    "javascript:alert(1)",
    "http://lin.ee/test123",
    "https://example.invalid/test123",
    "https://lin.ee.example.invalid/test123",
    "https://user:secret@lin.ee/test123",
    "https://lin.ee:8443/test123",
    "https://lin.ee/",
    "https://line.me/",
    "https://line.me/not-a-friend-link",
  ]) {
    assert.equal(getOfficialLineUrl(value), null, value);
  }
});

const contact = require("../lib/contact.ts");
const { renderToStaticMarkup } = require("react-dom/server");
const {
  LineConsultationLink,
} = require("../components/line-consultation-link.tsx");

test("no LINE anchor is rendered for an unset or invalid setting", () => {
  const originalGetter = contact.getOfficialLineUrl;
  try {
    for (const value of ["", "not a URL", "https://example.invalid/account"]) {
      contact.getOfficialLineUrl = () => originalGetter(value);
      assert.equal(renderToStaticMarkup(LineConsultationLink({})), "");
    }
  } finally {
    contact.getOfficialLineUrl = originalGetter;
  }
});
test("a configured LINE link renders the validated destination and safe new-tab attributes", () => {
  const originalGetter = contact.getOfficialLineUrl;
  try {
    contact.getOfficialLineUrl = () => originalGetter("https://lin.ee/test123");
    const html = renderToStaticMarkup(LineConsultationLink({}));
    assert.match(html, /href="https:\/\/lin\.ee\/test123"/);
    assert.match(html, /target="_blank"/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.match(html, /公式LINEで相談する/);
  } finally {
    contact.getOfficialLineUrl = originalGetter;
  }
});
