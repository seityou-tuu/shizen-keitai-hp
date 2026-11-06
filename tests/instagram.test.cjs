require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { INSTAGRAM_PROFILE_URL, instagramReels, instagramReelUrl } = require("../lib/instagram.ts");

test("Instagram links and screenshot mapping match the owner's confirmation", () => {
  assert.equal(INSTAGRAM_PROFILE_URL, "https://www.instagram.com/ngtmyy_1990");
  assert.deepEqual(instagramReels.map(({ id, image }) => [id, image]), [
    ["DcGE2FPKpHz", "heel"], ["DcN4DM8K89p", "knee"], ["DapZQNvvtVR", "shin"],
  ]);
  for (const { id } of instagramReels) {
    const url = new URL(instagramReelUrl(id));
    assert.equal(url.origin, "https://www.instagram.com");
    assert.equal(url.pathname, `/reel/${id}/`);
  }
});
