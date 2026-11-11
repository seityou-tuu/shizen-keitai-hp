# サイト総合品質監査

## 基準と依存関係
PR #21 → PR #22（3e1f5bf）→ 本ブランチ feat/site-quality-audit。Next.js 16 / React 19 / TypeScript。mainへの変更・マージ・本番公開なし。スプラッシュ・演出本体・写真素材・料金・日程・募集データは変更なし。

## 問題・優先度・対応
|優先度|発見事項|対応|
|---|---|---|
|重大|今回の調査では確認されず|npm auditは全依存関係で0件。ただし完全な安全性の保証ではない|
|中程度|同意後の計測が電話だけ|既存リスナーを拡張しLINE・募集ページ遷移・YouTube・Instagram・FAQ相談誘導を分類。二重リスナー防止・停止機能を維持|
|中程度|FAQから相談への直接導線不足|募集ページFAQ下に相談CTA。相談だけでは契約にならないと明記|
|中程度|募集ページのアンカー移動が固定ヘッダーを考慮しない|画面幅別にscroll-marginを確保|
|中程度|小さいゴールド文字のコントラスト不足|白・淡色背景上の文字を落ち着いた濃いゴールドに調整|
|中程度|表示文言とアクセシブルネームの不一致|ロゴ・Instagram・電話リンクを可視テキストに基づく名前へ整理|
|中程度|同名の方針ナビゲーションが複数|本文とフッターで名前を区別|
|軽微|articleにtabpanelを割当|汎用divへ変更し、見た目と会場切替は維持|
|軽微|通常HP回帰テストが古い受賞注記を期待|主催者承認済みの受賞名に更新|

## 維持した項目・理由
- ファーストビュー・講師紹介・特徴・学習内容・6ヶ月案内・3コース・募集概要・日程・動画・Instagram・フッターの構成は既存の品質を優先。全面リデザインしない。
- canonical・OG・Xメタ情報・日本語設定・ページ別説明・Organization/WebSite/WebPage構造化データを確認。架空の口コミや資格制度、FAQリッチリザルト保証を追加しない。
- sitemap/robotsは既存の公開承認フラグに従う。募集ページはnoindexを維持。検索インデックス有効化は別途運営判断が必要。
- LCP画像のpriority、他画像のNext Imageサイズ生成・遅延読み込み、寸法指定を維持。測定の裏付けなしに圧縮や演出削除を行わない。
- 分析は本番環境・有効化フラグ・正しいID・明示同意がすべて必要。現行の同意UIは通常HPのみのため、募集ページ内のクリック計測は未導入。ページ横断の同意保存はプライバシー方針と運用確認後の課題。

## 計測
Lighthouseのローカルproduction build・モバイル設定による単発測定（同時実行のためスコアの厳密比較には不向き）。通常HP performance 74 / accessibility 96 / best practices 100 / SEO 69、募集ページ93 / 97 / 100 / 69。LCPは双方2.7秒、CLSは双方0。アクセシビリティ修正前の監査値であり最終スコアではない。SEOは意図的なnoindexの影響あり。改善前後比較・実ユーザー計測は未実施。

## 検証と制限
37ユニットテスト・型検査・production build・git diffチェック。既存の通常HP・募集ページ・演出のPlaywright回帰検証を実施。axeの初回違反を上記修正へ反映。Lighthouse/axeは一時ディレクトリに導入し、本番依存を増やしていない。
Lint設定・スクリプトは既存にないため未実施。実機Safari・スクリーンリーダー実機・Vercel実画面・LINE友だち追加・通話・外部動画の実再生は未実施。外部リンクは既存の承認済みURLと安全な別タブ属性を維持。

## 本番前・追加課題
公開承認とインデックス設定、実機Safariと音声操作の確認、Vercel上での確認、GA4設定とプライバシー方針の運営確認、募集ページの計測同意設計。通常HPのLCPは複数回の端末別測定で画像・スプラッシュ・CSS/JSの寄与を切り分けてから最適化する。検索流入・問い合わせ増加は保証しない。

### 最終結果
最終ビルド後のaxe自動監査は両ページとも違反0件（390px、Chromium、reduced motion）。全アクセシビリティ要件を保証するものではない。通常HPは320 / 360 / 375 / 390 / 400 / 414 / 430 / 768 / 1024 / 1440px、募集ページは同幅に1280pxを加えた11幅で既存回帰成功。最終の文字色だけの調整後は型検査・37テスト・ビルド・axeを再実行し成功。スクロール演出は5幅の両ページ検証に成功。スプラッシュ本体・演出本体の差分なし。

変更ファイル：app/cohort-premium.css, app/globals.css, app/homepage-quality.css, app/page.tsx, app/recruitment/first/page.tsx, components/cohort-schedule.tsx, components/header.tsx, components/information-links.tsx, components/instagram-section.tsx, lib/analytics-client.ts, scripts/browser-check.cjs, tests/analytics.test.cjs, tests/recruitment.test.cjs。ほか本監査記録。
