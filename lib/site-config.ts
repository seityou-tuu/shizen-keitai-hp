export const SITE_URL = "https://shizen-keitai-hp.vercel.app";
export const SITE_NAME = "自然形体療法 資格取得プログラム";
export const SITE_DESCRIPTION =
  "自然形体療法を理論と実技で学ぶ資格取得プログラム。施術経験者から未経験者まで、各コース6ヶ月の研修内容・受講料金・学習サポート・受講相談をご案内します。";
export const PUBLIC_PATHS = ["/", "/company", "/legal", "/privacy", "/terms", "/recruitment/first"];
// Preserve the existing indexing hold until the operator finishes publication checks.
// Preview deployments can never enable indexing, even if the flag is copied there.
export function isSearchIndexingEnabled() {
  return (
    process.env.VERCEL_ENV === "production" &&
    process.env.SITE_INDEXING_ENABLED === "true"
  );
}
