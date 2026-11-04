import type { Metadata } from "next";
import { InformationPage } from "@/components/information-page";
import { operator } from "@/lib/site-information";
export const metadata: Metadata = {
  title: "会社概要 | 自然形体療法 資格取得プログラム",
  description:
    "プログラムの運営会社についてご案内します。所在地・連絡先等は現在確認中です。",
  openGraph: {
    title: "会社概要 | 自然形体療法 資格取得プログラム",
    description:
      "プログラムの運営会社についてご案内します。所在地・連絡先等は現在確認中です。",
  },
};
export default function Page() {
  return (
    <InformationPage
      title="会社概要"
      english="COMPANY"
      description="プログラムの運営会社についてご案内します。所在地・連絡先等は現在確認中です。"
      rows={[
        { label: "会社名", value: operator.name },
        { label: "代表取締役", value: operator.representative },
        { label: "会社所在地", value: operator.address },
        { label: "電話番号", value: operator.phone },
        { label: "メールアドレス", value: operator.email },
        { label: "法人番号", value: operator.corporateNumber },
        { label: "提供サービス", value: "自然形体療法 資格取得プログラム" },
      ]}
    />
  );
}
