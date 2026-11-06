# 募集LPのプレビューパスと404調査

2026年11月6日（日本時間）。既存PR #9を更新し、mainへのマージ・本番公開は行っていません。最新mainはPR #16反映済みの`5ca6850`で、これをPR #9側へ取り込んでいます。

## 原因・正規URL

実装は`app/recruitment/first/page.tsx`、定数は`FIRST_COHORT_PATH = "/recruitment/first"`です。従来`/first-cohort`というルート・リダイレクトがなかったため、このパスでは404になります。

ユーザー提供のPreviewホストに対する正規URL：

<https://shizen-keitai-hp-git-feat-first-cohort-recruitme-b68853-seityou.vercel.app/recruitment/first>

今回、Preview・ローカル開発時だけ`/first-cohort`から正規パスへ307リダイレクトを追加しました。恒久転送ではありません。新しいデプロイ反映後には次の別名パスも利用できます。

<https://shizen-keitai-hp-git-feat-first-cohort-recruitme-b68853-seityou.vercel.app/first-cohort>

## 公開制御

- Productionではリダイレクトを登録せず、別名・正規パスとも404のままです。
- Productionの両パスは404とX-Robots-Tagのnoindex/nofollowを確認。Previewの別名は本文を持たない307転送で、転送先の正規LPはX-Robots-Tagとmeta robotsでnoindexです。Next.jsのリダイレクト応答自体にはカスタムヘッダーが付かないため、転送先も含めて確認しています。
- 検索登録を有効にしたProductionでも両パスをrobotsで除外し、サイトマップには含めません。
- トップの募集導線は追加せず、申込み方法未確定・募集準備中・申込みURL nullを維持しました。
- Preview判定は`VERCEL_ENV=preview`を維持し、Productionや不明な環境を許可するようには緩めていません。ビルド時の設定が反映されるため、PR #9の新コミットでPreviewを再ビルドする必要があります。

## 検証・制限

31件の単体テスト、本番相当・Preview相当のビルド、型検査を実施。HTTPでProductionの両パス404/noindex、トップ・サイトマップへの非露出を確認し、Previewの307→正規ページ200とブラウザー表示を確認しています。料金・日程・LINE等の本文は変更していません。

記録：[Production](preview-path-production.json) / [Preview・PC/スマホ](preview-path-preview.json)。

提供されたVercelホストには、Codex実行環境のプロキシがCONNECT時に403を返し、直接アクセスできませんでした。これはVercelがLPを404にしているという確認結果ではありません。上記はユーザーが開けているPreviewホストと実装上の正規パスを組み合わせた完全URLです。Vercel上の実際の応答・デプロイ完了は未確認です。

正規URLでも表示されない場合は、Vercel管理画面で対象がPR #9の最新コミットを使うPreviewデプロイか、ビルドが成功しているか、Preview保護の認証を通過しているかを確認してください。Productionガードを外して解消する対応は行いません。
