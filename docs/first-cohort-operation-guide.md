# 第1期生募集LPの更新・公開前確認

2026年11月6日（日本時間）。既存PR #9の実装を更新した現在の手順です。旧手順にあった「トップに募集案内を出す」「サイトマップに募集ページを追加する」は適用しません。

## 現在の状態

- 2027年1月〜6月、東京・大阪・福岡、各会場6名・合計18名、募集締切2027年1月10日を反映。
- 施術経験者・未経験者のどちらも受講可能と確認済み。
- 申込み方法・公式LINEは未確定。電話0985-74-7643は相談用で、正式な申込み・契約・決済の受付ではありません。
- 住所・開始終了時刻、研修と各コースの対応、認定・支払・契約等は未確定です。プログラム共通の9:00〜17:00を、第1期生の確定時刻として流用しません。
- LPの既存研修写真3枚・研修説明・料金構成を活かし、PR #15までのmainを取り込んでいます。写真は第1期生の実施実績を示すものではありません。

## プレビュー限定の制御

`/recruitment/first`はVercel Previewとローカル開発時にだけ表示します。Productionでは404です。`publicationApproved`だけをtrueにしてもProductionの404は解除されません。現在はfalse・募集準備中のままです。

トップページの募集案内・リンクは外し、公開パス一覧・サイトマップには含めません。LPは常にmeta robotsとX-Robots-Tagでnoindex/nofollow、検索公開を許可したProductionのrobots.txtにも`/recruitment/`の除外を入れています。noindexはアクセス認証ではありません。VercelのPreview保護設定は管理者が別途確認してください。

申込み方法が決まるまでmainへマージ・本番公開しません。今回、環境設定・Vercel設定・本番デプロイは変更していません。Preview URLを一般募集用・QR用の正式URLとして配布しないでください。

## 確定情報を修正する場所

`lib/recruitment.ts`の`firstCohortDetails`で開催期間・締切・対象者・会場別6日程・定員を管理します。

期間・開講年月・開催地域・合計定員は会場データから算出し、冒頭・概要・日程・meta descriptionへ反映します。日程はこのデータを修正し、各画面と全18日程のテストを再確認してください。

- `venues[].dates`：2027年のISO日付。曜日はAsia/Tokyoで表示し、全18日程をテストで照合します。
- `venues[].capacity`：各会場の定員。合計定員は設定から算出します。
- `venues[].address/startTime/endTime`：現在null。正式原稿が届くまで値を推測しません。値を入れた場合は表示側への反映とテストも必要です。
- `deadline`：現在2027-01-10。締切時刻は未確定なので23:59等を補いません。
- `application`：現在preparing・URL null。正式窓口決定後の差し替え位置です。URLを入れるだけで申込みボタンが自動公開される実装にはしていません。

見出し・本文・料金は`app/recruitment/first/page.tsx`、会場切替は`components/cohort-schedule.tsx`、LP内スタイルは`app/recruitment.css`です。料金は既存の各コース990,000円（税込）／税抜900,000円、全3コース受講時2,970,000円（税込）／税抜2,700,000円を維持しています。

会場タブは矢印・Home・Endキーに対応します。全会場比較を選ぶと18日程を表示。JavaScriptが無効でも全会場の日程がHTMLに含まれます。

## 正式公開の前に主催者が決定する項目

1. 申込み窓口、受付開始日・締切時刻、定員管理・受付担当、申込みから契約成立までの手順。
2. 会場住所・アクセス・開始終了時刻、各日の実施内容、オンライン理論の開催日・接続方法。
3. 今回の研修とコースの対応、受講要件・認定・進級条件、3コース必須かどうか。
4. 支払方法・期限・追加費用、キャンセル・中途解約・返金、個人情報の扱い・正式な法定文面。
5. 動画の閲覧方法・期限、質問対応、取得後フォローの範囲・条件。

確認後、既存PR #9上で原稿・申込み導線・公開ガード・検索設定をまとめて見直し、Previewで再確認してください。主催者による公開承認は別途必要です。今回の検証成功は契約条件や正式な公開の承認を意味しません。

## ローカル検証

```sh
npm test
VERCEL_ENV=production SITE_INDEXING_ENABLED=true npm run build
# 同じ環境指定でローカル起動し、LP 404・noindex・サイトマップ除外を確認
VERCEL_ENV=production SITE_INDEXING_ENABLED=true npm run start -- --port 3101
```

Production検証サーバーを止めた後、Preview相当で再ビルドします。

```sh
VERCEL_ENV=preview npm run build
npm run typecheck
VERCEL_ENV=preview npm run start -- --port 3100
```

別セッションで既存の全体ブラウザーテストと募集LPのテストを実行します。

```sh
export PLAYWRIGHT_MODULE_PATH=/opt/codex/cua_node/lib/node_modules/playwright
export CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium
QA_OUTPUT_DIR=/tmp/shizen-cohort/main npm run test:browser
QA_OUTPUT_DIR=/tmp/shizen-cohort/lp node scripts/cohort-browser-check.cjs
```

ローカルProductionビルドは検証だけで、Vercel本番公開ではありません。実機の電話発信・応対、Safari/Android、Vercelの認証・Preview保護、本番計測は別途確認が必要です。
