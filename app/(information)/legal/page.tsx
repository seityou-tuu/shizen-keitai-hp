import { informationMetadata } from "@/lib/information-metadata";
import { InformationPage } from "@/components/information-page";
import { legalRows } from "@/lib/site-information";
export const metadata = informationMetadata(
  "特定商取引法に基づく表記 | 自然形体療法 資格取得プログラム",
  "販売事業者とサービスの条件を整理するためのページです。必要な情報と法令の適用関係を確認したうえで、正式な表記に更新します。",
  "/legal",
);
export default function Page() {
  return (
    <InformationPage
      title="特定商取引法に基づく表記"
      english="TRANSACTION INFORMATION"
      description="販売事業者とサービスの条件を整理するためのページです。必要な情報と法令の適用関係を確認したうえで、正式な表記に更新します。"
      rows={legalRows}
    />
  );
}
