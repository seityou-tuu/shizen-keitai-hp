import type { InformationRow } from "@/lib/site-information";
export function InformationPage({
  title,
  english,
  description,
  rows,
}: {
  title: string;
  english: string;
  description: string;
  rows: InformationRow[];
}) {
  return (
    <>
      <p className="eyebrow">{english}</p>
      <h1>{title}</h1>
      <p className="information-lead">{description}</p>
      <aside className="information-notice" aria-label="掲載状況">
        <strong>確認中の項目を含む、準備段階のページです。</strong>
        <p>
          未確定の情報は「確認中」と表示しています。契約条件や各種方針の確定版ではありません。確認・整備が完了するまでは、審査提出用の完成資料として扱わないでください。
        </p>
      </aside>
      <dl className="information-table">
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              {row.value ?? (
                <span className="pending-value">確認中・確定後に掲載予定</span>
              )}
              {row.note && <p className="information-note">{row.note}</p>}
            </dd>
          </div>
        ))}
      </dl>
      <div className="information-contact">
        <h2>お問い合わせについて</h2>
        <p>
          正式な連絡先は現在準備中です。このサイトには送信フォーム・申込・決済機能はありません。
        </p>
        <a href="/#contact" className="text-link">
          トップページのお問い合わせ案内へ ↗
        </a>
      </div>
    </>
  );
}
