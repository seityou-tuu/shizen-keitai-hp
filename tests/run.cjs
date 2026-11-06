// Run in one process so restrictive build environments do not silently skip child tests.
require("./contact-links.test.cjs");
require("./seo.test.cjs");
require("./content.test.cjs");

require("./instructor.test.cjs");
require("./youtube-video-link.test.cjs");
require("./instagram.test.cjs");
