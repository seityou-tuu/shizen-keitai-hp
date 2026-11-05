import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "./site-config";

// Page bodies and legal source data are independent of these sharing/search settings.
export function informationMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      type: "website",
      locale: "ja_JP",
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}/opengraph-image.png`, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/twitter-image.png`],
    },
  };
}
