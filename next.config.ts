import type { NextConfig } from "next";
import { isSearchIndexingEnabled } from "./lib/site-config";
import { FIRST_COHORT_PATH, isFirstCohortPreview } from "./lib/recruitment";
const config: NextConfig = {
  async redirects() {
    return isFirstCohortPreview()
      ? [{ source: "/first-cohort", destination: FIRST_COHORT_PATH, permanent: false }]
      : [];
  },
  async headers() {
    return [
      { source: "/first-cohort", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/recruitment/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          ...(!isSearchIndexingEnabled()
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
        ],
      },
    ];
  },
};
export default config;
