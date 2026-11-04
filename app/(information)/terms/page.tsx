import { informationMetadata } from "@/lib/information-metadata";
import { InformationPage } from "@/components/information-page";
import { termsRows } from "@/lib/site-information";
export const metadata = informationMetadata(
  "受講規約 | 自然形体療法 資格取得プログラム",
  "受講に関する確定情報と、今後整備する契約条件を整理しています。現在の内容は規約の土台であり、確定した受講契約の条項ではありません。",
  "/terms",
);
export default function Page() {
  return (
    <InformationPage
      title="受講規約"
      english="COURSE TERMS"
      description="受講に関する確定情報と、今後整備する契約条件を整理しています。現在の内容は規約の土台であり、確定した受講契約の条項ではありません。"
      rows={termsRows}
    />
  );
}
