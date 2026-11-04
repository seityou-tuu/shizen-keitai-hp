import type { Metadata } from "next";
import "./globals.css";
import "./learning-experience.css";
import "./public-training.css";

const title = "自然形体療法 資格取得プログラム | 株式会社TSUNAGi";
const description =
  "未経験者から施術経験者まで。自然形体療法を実技と理論で学ぶ、3段階の資格取得プログラム。各コース6ヶ月の研修内容・受講料金をご案内します。";
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "ja_JP",
    type: "website",
    siteName: "自然形体療法 資格取得プログラム",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: false, follow: false },
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
