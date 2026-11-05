import { CONTACT_PHONE } from "./contact";

// null means unconfirmed. Replace only with operator-approved information.
export const operator = {
  name: "株式会社TSUNAGi",
  representative: "永友裕也",
  address: null,
  phone: CONTACT_PHONE,
  email: null,
  corporateNumber: null,
} satisfies Record<string, string | null>;

export const informationLinks = [
  { href: "/company", label: "会社概要" },
  { href: "/legal", label: "特定商取引法に基づく表記" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "受講規約" },
];
export type InformationRow = {
  label: string;
  value: string | null;
  note?: string;
};
export const legalRows: InformationRow[] = [
  { label: "サービス名", value: "自然形体療法 資格取得プログラム" },
  { label: "販売事業者", value: operator.name },
  { label: "代表者", value: operator.representative },
  { label: "所在地", value: operator.address },
  { label: "電話番号", value: operator.phone },
  { label: "メールアドレス", value: operator.email },
  {
    label: "販売価格",
    value:
      "準師範・師範・本部師範の各コース：990,000円（税込）／900,000円（税抜）。3コースの受講料合計：2,970,000円（税込）／2,700,000円（税抜）。消費税10％前提。",
  },
  {
    label: "受講料以外の費用",
    value: null,
    note: "教材費・交通費・通信費等の扱いと負担の有無を確認中です。",
  },
  {
    label: "支払方法",
    value: null,
    note: "カード決済の利用可否を含め、確認中です。",
  },
  { label: "支払時期", value: null },
  {
    label: "サービス提供時期",
    value: null,
    note: "各コースの受講期間は6ヶ月です。開始日・開催日・連続開講時期は未確定です。",
  },
  {
    label: "申込方法・申込期間",
    value: null,
    note: "現在、このサイトでの申込受付・決済は行っていません。",
  },
  { label: "キャンセル条件・手続き", value: null },
  { label: "中途解約条件・手続き", value: null },
  { label: "返金条件・返金時期・方法", value: null },
  { label: "休講・開催中止・日程変更時の対応", value: null },
  { label: "オンライン受講に必要な環境", value: null },
];
export const privacyRows: InformationRow[] = [
  { label: "個人情報の取扱事業者", value: operator.name },
  {
    label: "取得する情報・取得方法",
    value: null,
    note: "問い合わせ・申込・決済等の運用に応じて、項目と取得経路を確認します。",
  },
  { label: "利用目的", value: null },
  {
    label: "外部送信・Cookie・アクセス解析",
    value: null,
    note: "ホスティング、アクセスログ、導入ツール等の実際の動作を確認後に記載します。",
  },
  { label: "保管場所・保管期間・削除", value: null },
  { label: "安全管理措置", value: null },
  {
    label: "委託・第三者提供・国外での取扱い",
    value: null,
    note: "利用サービスと実際の情報の流れを確認後に記載します。",
  },
  { label: "開示・訂正・削除等の相談手続き", value: null },
  { label: "個人情報に関する問い合わせ窓口", value: null },
  { label: "制定日・改定日・変更の案内方法", value: null },
];
export const termsRows: InformationRow[] = [
  {
    label: "対象サービス・運営者",
    value: "自然形体療法 資格取得プログラム／株式会社TSUNAGi",
  },
  {
    label: "対象者・コース順序",
    value:
      "未経験者・施術経験者が対象です。準師範→師範→本部師範の順に取得します。",
  },
  {
    label: "期間・研修形式",
    value:
      "各コース6ヶ月。実技は月1回、対面9:00〜17:00。理論は月1回、オンライン2時間。月1回×6ヶ月で各研修6回を想定する頻度の目安です。正式な実施日程・振替等は確認中です。",
  },
  {
    label: "受講料",
    value:
      "各コース990,000円（税込）／900,000円（税抜）。3コース合計2,970,000円（税込）／2,700,000円（税抜）。消費税10％前提。",
  },
  { label: "申込手続き・契約成立時点", value: null },
  { label: "受講要件・認定基準・進級条件", value: null },
  { label: "支払方法・支払時期・追加費用", value: null },
  { label: "欠席・遅刻・振替・休講", value: null },
  { label: "キャンセル・中途解約・返金", value: null },
  { label: "教材の利用・知的財産・録音録画", value: null },
  { label: "受講上の注意・禁止事項", value: null },
  { label: "責任範囲・トラブル時の対応", value: null },
  {
    label: "個人情報の取扱い",
    value: null,
    note: "実際の運用を確認し、プライバシーポリシーと整合させます。",
  },
  { label: "規約変更・準拠法・紛争解決", value: null },
  { label: "制定日・適用開始日", value: null },
];
