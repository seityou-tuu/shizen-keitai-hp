# 全体品質改善（2026年11月6日・日本時間）

基準：PR #12反映済みmain `39688c015f345f0e0b0fa57ba542f3e028044caf`。
作業ブランチ：`feat/site-quality-improvements`。

深緑・白・ゴールド、元の12セクションとPR #12のInstagram欄、料金・講師プロフィール・研修条件・写真と動画URLを維持しました。第1期生募集ページとPR #9は変更していません。mainへのpush・マージ・本番公開は行っていません。

## 改善内容

| 項目 | 実施したこと |
| --- | --- |
| 問い合わせ | ロードマップ・料金欄の電話CTAに、発信前に電話番号や窓口の説明を確認できるリンクを併設。窓口欄から研修・ステップ・料金へ戻れるリンクを追加 |
| スマホ | 主要情報への近道を2列で配置。追加リンクは44px以上の操作領域を確保。Instagramの横スクロールを強制スナップから近接時のスナップへ変更し、フォーカス枠の余白も確保 |
| 資格取得への導線 | 冒頭の基本情報の下に研修・講師・料金・FAQへの近道を追加。各コースから対応する料金へ直接移動できるリンクを追加。正式な受講・認定条件は推測で追加していない |
| 信頼性 | YouTubeへの遷移をアイコンだけでなく「YouTubeで見る」と明示。Instagramは各提供画像の見出しを表示し、読み上げ名でも動画を区別。提供画像時点の再生数・効果非保証・研修写真の説明・確認中の受賞情報は維持 |
| SEO | WebSite / Organizationに識別子を設定し、WebPageの名称・説明・正式URL・言語と関係を構造化データに追加。canonical・OGP・robots・sitemapを回帰確認。検索登録停止とPreviewのnoindexは維持 |
| 速度・アクセシビリティ | ヒーロー画像のsizesを実表示幅に調整。スマホメニューのリンクが閉じるとフォーカスがBODYへ戻る問題を修正。本文スキップ先をフォーカス可能に変更。新規のクライアントコンポーネント・依存ライブラリ・外部埋め込みは追加していない |
| 解析 | コードのSDK・タグ・依存関係・環境変数雛形を確認。計測は未導入で、外部送信を追加していない。Vercel側の設定は未確認。[導入状況と設計](../analytics-measurement-plan.md)を更新 |

## 検証結果

- `npm test`：17件成功、失敗・skipとも0件。
- `npm run build`、`npm run typecheck`、`git diff --check`：成功。Lintは既存設定なし。
- 拡張した既存ブラウザー検証：320 / 360 / 375 / 390 / 400 / 414 / 430 / 768 / 1024 / 1440pxすべて成功。元の12セクション＋Instagram、写真、料金、電話リンク、FAQ、ナビゲーション、番号、固定CTA、横はみ出しを確認。
- `/company`、`/legal`、`/privacy`、`/terms`：HTTP 200、canonical・電話・狭い画面を確認。
- 追加した近道の遷移・ヘッダーで移動先が隠れないこと・44px以上のリンク操作領域・メニュー6項目のフォーカス引継ぎを確認。
- 667×375pxの横向きメニューで最後のリンクまで操作可能。JavaScript無効の390px画面でも主要情報へのリンク、本文、FAQ、電話リンクが利用可能。
- スキップリンクが最初のTab操作で選択でき、Enterで本文にフォーカスすることを390 / 1440pxで確認。追加リンク・動画見出しの文字コントラストは4.5:1以上。
- Instagram：PCクリック・スマホタッチで3動画＋プロフィールの対応、別タブ、openerなしを確認。YouTube：2動画のサムネイル・再生アイコンをPC・スマホで確認。外部遷移はテストで置換しており、実際の再生やアカウントの公開状況は検証していない。
- ローカル本番ビルドの10画面幅チェックではJavaScriptエラー0件、外部リクエスト0件。

1440px・DPR 1でヒーローの実表示幅は936px。ブラウザーが選ぶ配信画像は改善前1920px→改善後1080pxになりました。390px・DPR 1では640pxの選択を維持。これはローカル環境の画像サイズ選択結果であり、本番のCore Web Vitals改善率や転送量削減率ではありません。

記録：[ブラウザー](browser-report.json) / [追加のアクセシビリティ](accessibility-report.json) / [画像配信サイズ](image-sizes.json) / [YouTube](youtube-report.json) / [Instagram](instagram-report.json)。

## レビュー画像

Chromium・DPR 1・reduced motion。固定ヘッダー・固定CTA・スキップリンクは、長い領域の撮影時だけ非表示にしています。これらの実際の表示・操作はブラウザーテストで確認しています。

| 箇所 | スマホ390px | PC1440px |
| --- | --- | --- |
| 資格コース・相談への導線 | [画像](roadmap-390.png) | [画像](roadmap-1440.png) |
| 講師の映像・実績紹介 | [画像](evidence-390.png) | [画像](evidence-1440.png) |
| 問い合わせ | [画像](contact-390.png) | [画像](contact-1440.png) |

## 再検証方法

リポジトリで `npm test` → `npm run build` → `npm run typecheck` を実行し、`npm run start -- --port 3100` で本番サーバーを起動します。既存のPlaywright / Chromiumを使って以下を実行します。プロジェクトへのブラウザー依存追加は不要です。

```sh
export PLAYWRIGHT_MODULE_PATH=/opt/codex/cua_node/lib/node_modules/playwright
export CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium
QA_OUTPUT_DIR=/tmp/shizen-quality/after npm run test:browser
node scripts/youtube-link-browser-check.cjs
node scripts/instagram-browser-check.cjs
```

## 未対応・外部確認事項

- GitHubのGit接続は利用可能ですが、PR作成用の `api.github.com` はForbiddenです。ユーザーの指示により設定変更・APIの反復試行はせず、作業ブランチ・コミットを保存します。
- 新規PR番号・VercelプレビューURLは、作成・取得が確認できた場合のみ報告します。ブランチpushだけでデプロイ成功とは判断しません。
- 実機iPhone Safari / Android、電話の実発信・応対、本番の表示速度・INPは未確認です。
- Vercelの解析・Toolbar設定は未確認です。計測サービスの選定・運用方針が決まるまで、タグや追跡・Cookieを追加しません。
- LINE開設、受付時間、会場・開催日、認定・進級・申込・契約・返金等の未確定情報は従来どおり主催者確認待ちです。検索登録停止も解除していません。
