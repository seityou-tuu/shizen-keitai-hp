import { informationMetadata } from "@/lib/information-metadata";
import { InformationPage } from "@/components/information-page";
import { privacyRows } from "@/lib/site-information";
export const metadata = informationMetadata(
  "プライバシーポリシー | 自然形体療法 資格取得プログラム",
  "個人情報の取扱いに関する方針を掲載するための準備ページです。取得・利用・外部送信・保管・提供の実態を確認後、内容を確定します。",
  "/privacy",
);
export default function Page() {
  return (
    <InformationPage
      title="プライバシーポリシー"
      english="PRIVACY POLICY"
      description="個人情報の取扱いに関する方針を掲載するための準備ページです。取得・利用・外部送信・保管・提供の実態を確認後、内容を確定します。"
      rows={privacyRows}
    />
  );
}
