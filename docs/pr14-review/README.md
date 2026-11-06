# 品質改善・解析準備のレビュー資料

2026年11月6日（日本時間）。基準main：`6a671c0`（PR #13反映済み）。作業ブランチ：`feat/pr14-trust-and-analytics`。

PR #14として依頼された作業ですが、GitHubの採番は未確認です。API接続がForbiddenのため、PRが作成済みであるという意味ではありません。

## 変更と理由

- 最下部の「デザイン試作版」を削除。個別の未確認情報・契約条件・効果や取得を保証しない注意書きは保持しました。
- 施術見学と18ヶ月の説明を短く整理。資格取得条件や研修内容は変更していません。
- 仮案の「お問い合わせ→申込み→受講開始」を、既存情報に基づく「研修の学び方・復習と質問・期間と料金・受講条件」の確認欄へ変更。受付手順が確定済みだと誤解させないためです。
- 問い合わせ欄の「資料請求」を、実在する電話窓口に合わせて「受講内容や研修についてのご質問は、お電話でご相談ください」へ整理。フォーム・資料送付機能は追加していません。
- 料金欄にFAQへのリンクを追加。PR #13の各コース料金リンク、電話・窓口案内の導線は維持しました。
- 構造化データのOrganization参照を`about`から`publisher`へ変更し、サイト運営者として関連付けました。title・description・canonical・OGPに変更が必要な問題は確認されず維持。robots・sitemapの検索停止とPreviewのnoindexも維持しました。
- GA4とSearch Consoleの設定口を追加しました。正式ID・コードは未設定で、現在は無効です。GA4はProduction、有効化フラグ、測定ID、訪問者の許可が揃うまでスクリプトを読み込みません。許可後の電話クリックは設置場所の固定値だけで区別します。

深緑・白・ゴールド、元の12セクション＋PR #12のInstagram欄、写真、講師プロフィール、研修形式・頻度・時間、コース順序・期間・料金、正式電話0985-74-7643、YouTube・Instagramのリンクを維持しました。公式LINEのリンク・仮ID、医学的効果・治癒・収益・資格取得を保証する文言は追加していません。PR #9には触れていません。

## 検証

- `npm test`：21件成功、失敗・skip 0件。従来の17件に、GA4/確認コードの設定条件、二重計測防止・停止・イベント値の制限を検証する4件を追加。
- `npm run build` / `npm run typecheck` / `git diff --check`：成功。
- Lint：package.jsonにスクリプト・既存設定がないため未実行。新しいLint設定は追加していません。
- 本番ビルドをローカルChromiumで320 / 360 / 375 / 390 / 400 / 414 / 430 / 768 / 1024 / 1440pxで検証。主要導線・メニューとフォーカス・固定電話CTA・FAQ・料金・画像読み込みと比率・横はみ出し・番号・見出し・構造化データを確認。
- `/company` / `/legal` / `/privacy` / `/terms`はHTTP 200、canonical・電話・画面幅を検証。会社概要・特商法・プライバシー・受講規約へのリンクを保持。
- GA4未設定時の選択欄なし・Googleスクリプトなし・Search Console仮タグなしを確認。外部リクエスト0件、JavaScriptエラー0件。
- 667×375pxの横向きメニュー、JavaScript無効の390px画面でも主要導線・FAQ・電話リンクが利用可能。
- YouTube / InstagramのPCクリック・スマホタッチ・正しいリンク先・別タブ・openerなしを既存テストで確認。外部の実再生はテストしていません。
- 解析の隔離React StrictModeテストで、許可前無通信・拒否・許可・停止・再許可・画面離脱を検証。スクリプト1回、ページビュー1回、許可後の操作ごとの電話イベント1回を確認。合成IDはテスト内部だけで、外部通信をすべて置換しています。公開設定や環境変数には仮IDを入れていません。

既知の未解決テスト失敗はありません。実機・本番の計測値やGoogleへの実配送を確認した結果ではありません。

記録：[ブラウザー](browser-report.json) / [SEO・見出し・法定リンク](seo-report.json) / [解析の隔離テスト](analytics-report.json) / [YouTube](youtube-report.json) / [Instagram](instagram-report.json)。

## PC・スマホのレビュー画像

Chromium、DPR 1、reduced motion。冒頭のデザイン・写真は保持し、変更は料金後の確認欄・問い合わせ文言・最下部に限定しています。長い領域の撮影時のみ固定ヘッダー・固定CTA・スキップリンクを非表示にしています。これらの実際の表示・操作はブラウザーテストで確認しています。

| 対象 | スマホ390px | PC1440px |
| --- | --- | --- |
| ファーストビュー | [画像](hero-390.png) | [画像](hero-1440.png) |
| 相談前の確認事項 | [画像](before-consultation-390.png) | [画像](before-consultation-1440.png) |
| 電話窓口 | [画像](contact-390.png) | [画像](contact-1440.png) |

## 人間側の確認事項・未対応

| 項目 | 状態・次の対応 |
| --- | --- |
| 受講対象者 | 現行の「施術経験者・未経験者」を未変更。過去仕様との不一致として、主催者に正式な対象範囲の確認が必要 |
| 事業者・法定情報 | 所在地・メール・受付時間、支払い・追加費用・契約・解約・返金・個人情報の取扱い等は責任者確認待ち。今回推測で追加していない |
| 研修・認定 | 会場・日程・連続開講時期、認定・進級条件、全3コースの必須性、復習動画・質問対応・取得後フォローの条件は確認待ち |
| 公式LINE・資料 | LINE未開設を維持。資料送付の受付機能はなし。将来資料対応を始める場合は、窓口・送付方法・個人情報の扱いを運営者が確定する |
| GA4 | 正式な測定IDとプロパティ、プライバシー文面、拡張計測OFF、重複タグ、保持・共有・同意の運用確認が必要。現在は未接続で、Googleでの受信は未検証 |
| Search Console | プロパティ・所有者・正式確認コードまたはDNS TXT設定、所有者による確認操作が必要。検索登録停止は解除していない |
| 実環境 | 実機Safari/Android、電話の実発信・応対、本番の速度・INP・Vercel側注入設定は未確認 |
| PR・プレビュー | GitHub APIはForbidden。本番URLもプロキシのCONNECT段階で403。PR作成・VercelプレビューURL取得・本番の直接監査は未完了。GitHubのGit接続・作業ブランチpushとは区別する |

GA4・Search Consoleの詳しい有効化手順とプライバシーへの影響は[専用手順書](../analytics-search-console-setup.md)を参照してください。現在のプライバシーページは準備段階のため、解析を有効化する前に正式な方針を整備してください。

## 再検証

`npm test` → `npm run build` → `npm run typecheck`、別セッションで`npm run start -- --port 3100`。

```sh
export PLAYWRIGHT_MODULE_PATH=/opt/codex/cua_node/lib/node_modules/playwright
export CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium
QA_OUTPUT_DIR=/tmp/shizen-pr14/browser npm run test:browser
node scripts/analytics-browser-check.cjs
node scripts/youtube-link-browser-check.cjs
node scripts/instagram-browser-check.cjs
```

ブラウザー本体・Playwrightは環境付属のものを使用します。テスト用の新しい依存関係・アプリルートは追加していません。
