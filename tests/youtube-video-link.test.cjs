require("./register-ts.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { renderToStaticMarkup } = require("react-dom/server");
const { YoutubeVideoLink } = require("../components/youtube-video-link.tsx");

test("each supplied view count links to its own video in a safe new tab", () => {
  for (const [count, id] of [["86万回", "yp_P0a_oedY"], ["132万回", "yudalXPijCk"]]) {
    const html = renderToStaticMarkup(YoutubeVideoLink({ count, children: "thumbnail" }));
    assert.ok(html.includes(`href="https://youtu.be/${id}"`));
    assert.ok(html.includes('target="_blank"'));
    assert.ok(html.includes('rel="noopener noreferrer"'));
    assert.ok(html.includes(`表示再生数${count}の動画をYouTubeで見る（新しいタブで開きます）`));
    assert.ok(html.includes('aria-hidden="true"'));
    assert.ok(html.includes("thumbnail"));
  }
});
