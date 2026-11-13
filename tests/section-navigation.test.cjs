require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { homeSections, cohortSections, sectionAtPosition, pageProgress } = require("../lib/section-navigation.ts");

test("section selection holds a boundary dead band in both scroll directions", () => {
  assert.equal(sectionAtPosition([0, 100, 300], 105, 0), 0);
  assert.equal(sectionAtPosition([0, 100, 300], 115, 0), 1);
  assert.equal(sectionAtPosition([0, 100, 300], 95, 1), 1);
  assert.equal(sectionAtPosition([0, 100, 300], 85, 1), 0);
  assert.equal(sectionAtPosition([0, 100, 300], 350, 0), 2);
  assert.equal(sectionAtPosition([0, 100, 300], 50, 0, true), 2);
});
test("progress clamps overscroll and handles short documents", () => {
  assert.equal(pageProgress(-20, 1000), 0);
  assert.equal(pageProgress(500, 1000), 50);
  assert.equal(pageProgress(1100, 1000), 100);
  assert.equal(pageProgress(0, 0), 0);
});
test("each page has its own ordered, unique section destinations", () => {
  assert.equal(homeSections[0].id, "main");
  assert.equal(cohortSections[0].id, "recruitment-main");
  assert.equal(homeSections.at(-1).id, "contact");
  assert.equal(cohortSections.at(-1).id, "cohort-contact");
  for (const links of [homeSections, cohortSections]) assert.equal(new Set(links.map(link => link.id)).size, links.length);
});
