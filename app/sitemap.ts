import type { MetadataRoute } from "next";
import {
  SITE_URL,
  PUBLIC_PATHS,
  isSearchIndexingEnabled,
} from "@/lib/site-config";
export default function sitemap(): MetadataRoute.Sitemap {
  return isSearchIndexingEnabled()
    ? PUBLIC_PATHS.map((path) => ({
        url: `${SITE_URL}${path === "/" ? "/" : path}`,
      }))
    : [];
}
