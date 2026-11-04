import type { MetadataRoute } from "next";
import { SITE_URL, isSearchIndexingEnabled } from "@/lib/site-config";
export default function robots(): MetadataRoute.Robots {
  return isSearchIndexingEnabled()
    ? {
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
