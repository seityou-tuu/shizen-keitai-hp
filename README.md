# 自然形体療法 資格取得プログラムHP

正式URL：https://shizen-keitai-hp.vercel.app/
対象：`seityou-tuu/shizen-keitai-hp`、PR #6 / `feat/program-site-renewal`

現在は作業ブランチで確認中です。mainへのマージ・本番への直接反映は行っていません。プレビューを確認してから管理者が公開を判断します。

## お問い合わせ

- 現在の正式な窓口：電話 **0985-74-7643**（`tel:0985747643`）。受付時間・休業日は未確認のため掲載していません。
- 公式LINEは未開設です。URLがない間はLINEボタン・QRコードを表示せず、準備中の案内を問い合わせ欄に1回だけ表示します。
- 電話番号と将来のLINE URLは **`lib/contact.ts`** にまとめています。公開用の友だち追加URLが確定したら、`OFFICIAL_LINE_URL`の空文字をそのURLへ置き換えます。すべてのLINE相談ボタンへ反映されます。
- LINEのURLはHTTPSの`lin.ee`短縮URLか`line.me`の友だち追加URLを使います。空欄・不正形式・別ドメイン・認証情報付きURLは表示しません。実際のアカウントとの一致は主催者が確認してください。
- HPでは正式な受講申込み・契約・決済を受け付けません。相談しただけで申込みや決済が成立するものではありません。

## 維持している情報

深緑・白・ゴールド、既存写真8枚、各コース6ヶ月・990,000円（税込）、すべて受講した場合の3コース合計2,970,000円（税込）を維持しています。実技は月1回・対面9:00〜17:00、理論は月1回・オンライン1回2時間です。

3コースすべてが必須か、認定基準、契約・解約・返金条件等は未確認です。確認済みの電話番号を会社概要・特商法にも共通反映し、古い問い合わせ案内を修正しました。所在地や契約・返金・個人情報などの未確認条件は補完していません。必要な確認事項は管理資料へ記録しています。

## 開発・検証

Vercelと同じNode.js 24.xを推奨します。

```sh
npm ci
npm test
npm run build
npm run typecheck
npm run dev
```

`npm test`では電話リンク、共通LINE設定、未設定・不正URLの扱い、プレビュー検索除外を確認します。外部のLINEアカウントを作成したり、メッセージを送ったりはしません。Lintは既存設定がありません。依存ライブラリは追加していません。ローカル本番ビルドをPlaywright/Chromiumの9画面幅で確認する任意の`npm run test:browser`も追加しています。実機・Vercel固有の確認とは区別します。

トップ画像は優先読み込み、残りの7枚は遅延読み込み。FAQ10項目は標準の`details/summary`で開閉します。LINEの表示切替はサーバー側で行い、追加のクライアントJavaScriptを使いません。

## SEOと公開設定

canonical・OGPは正式URLへ統一。favicon、robots.txt、sitemap.xmlを用意しています。プレビューは常にnoindexです。本番も現在の検索登録停止を初期値として維持しています。法定情報・公開準備の確認後、検索登録を希望する場合はVercelのProductionのみ`SITE_INDEXING_ENABLED=true`にして再デプロイします。雛形は[.env.example](.env.example)です。

## 管理用資料

- [決済審査の確認リスト](docs/payment-review-checklist.md)
- [永友先生への確認事項と、そのまま送れる短い確認文](docs/nagatomo-confirmation-list.md)
- [公開前チェックリスト](docs/pre-launch-checklist.md)
- [MacBook・Chrome向け運用マニュアル](docs/site-operation-guide.md)
- [アクセス解析の導入設計（未接続）](docs/analytics-measurement-plan.md)

これらは`docs/`内の管理資料で、HPのページや`public/`へは配置していません。ただし、GitHubリポジトリ自体が公開の場合は閲覧できます。機密情報・認証情報・相談者の個人情報は記載しないでください。
