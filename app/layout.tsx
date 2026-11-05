import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  isSearchIndexingEnabled,
} from "@/lib/site-config";
import "./globals.css";
import "./program-photos.css";
import "./renewal.css";
import "./contact.css";
import "./polish.css";

const title = `${SITE_NAME} | 株式会社TSUNAGi`;
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "ja_JP",
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/opengraph-image.png", alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image.png"],
  },
  robots: {
    index: isSearchIndexingEnabled(),
    follow: isSearchIndexingEnabled(),
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
