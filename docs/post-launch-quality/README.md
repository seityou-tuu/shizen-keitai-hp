# 公開後品質監査（PR #26後）

基準: `ed9fbc24bbf9f97dd899e6b2bc019eb25e645779`（PR #26マージ済みmain）。作業ブランチ: `quality/post-launch-audit`。2026-11-17実施。mainへの直接コミット、PR #25の変更、マージ、本番デプロイ、外部への申込み・送信・通話は行っていません。

## 確認した問題と修正

|優先度|確認できた問題|対応|
|---|---|---|
|中|通常HPの実技写真・講師写真、募集ページの講師写真は、CSSの`aspect-ratio: auto`がHTMLの寸法から導かれる比率を上書きし、未読込時の高さが0pxになる|既存の静的画像インポートのwidth/heightからCSS変数を生成し、自然比率のフォールバックを指定。読み込み後の写真サイズ・切り取りは維持|
|中|404が英語のNext.js既定表示で、mainランドマークとサイトに戻る導線がない|ブランド既存色・共通ヘッダーを使った日本語404とキーボードで使える復帰リンクを追加。HTTP 404とNext.jsの自動noindexを維持|
|中|会社情報・各種方針リンクが高さ19〜22px、スマホでは一部幅40px。募集ページのPCヘッダーの通常リンクも高さ約21px|補助リンクを縦横44px以上に、ヘッダーは文字位置を保ったまま上下paddingで操作領域を拡張|
|低|Canvasの固定候補から外れる組合せにも、毎フレーム距離計算を実施|既存候補条件を距離計算の前に評価。粒子数・速度・光・接続線の選び方・FPS・DPR・停止条件は変更なし|

初回の追加テストでスマホリンクの幅40pxが残っていることを検出し、min-widthも修正しました。最終検証では解消しています。同じ追加テストを基準コミットの別worktreeに適用すると、最初の390px通常HPで画像領域の検証が失敗し、修正後は全ケース成功しました。

## ページ・導線・デザイン

- 通常HPは既存の10幅（320/360/375/390/400/414/430/768/1024/1440px）、募集ページは1280pxも含む11幅で回帰成功。主要4幅は追加の遅延画像・axe・静止画比較も実施。
- 横はみ出し、画像の意図しない変形、アンカーと固定ヘッダーの重なり、FAQ、会場タブ、スマホメニューの開閉・Escape・移動後のフォーカス、横向きメニューを既存スクリプトで確認。
- サイドナビの全移動先・現在位置・ページ末尾100%・キーボード移動・画面幅切替を確認。実装・CSSは変更なし。
- 通常HP⇔募集ページの既存導線、LINE `https://lin.ee/O3tJo01`、電話 `tel:0985747643`、YouTube/Instagramの承認済みURL・別タブ属性を既存テストで確認。外部サービスの実再生・申込み・通話は未実施。
- 通常HP・募集ページ・404の390/768/1024/1440pxでaxe違反0、横はみ出し0、ページ内JS例外0。通常HP・募集ページの通常読み込みでconsole warning/errorも追加テストで監視。
- 不正URL `/missing-page`、`/recruitment/not-a-page`、`/%E0%A4%A` はHTTP 404。復帰リンクでEnterを押すとトップへ戻れることを確認。404へのアクセス自体に伴うブラウザのHTTP 404通知は想定されるもの。
- 主要4幅×2ページのファーストビューは、同じseed・DPR 1・動き低減設定で撮影し、デコードしたPNGの全画素が修正前と一致（8/8）。WebPは閲覧用の再圧縮画像で、画素比較には元PNGを使用。
- 全写真をdecodeした後の本文・見出し・画像・リンクの矩形も比較。通常HPの先頭194要素、募集ページの先頭119要素が各4幅で一致。最初の差分は「会社概要」補助リンク。操作領域拡大に伴い、補助ナビ以降の下部余白・フッター位置は変わります。
- 通常モーションの描画検証は390/1280/1440px×2ページ。文字・写真の保護範囲を横切る接続線0、写真内alpha=0、帯の輪郭ストローク0。粒子・柔らかな光の画素変化も確認。
- スプラッシュの初期カバー、連続したロゴ移動、着地点、スキップ・Escape、再訪、動き低減、JS読込失敗時の解除を再検証。

## SEO監査・変更しなかった項目

タイトル・description・canonical・OGP・Twitter Card・lang・見出し階層・構造化データ・内部リンクを確認。通常HP・募集ページのh1は各1つで、見出し階層の飛び越しはなし。既存のWebPage/WebSite/Organization参照、ページ別canonicalを回帰テストで確認しました。

通常HPと会社情報等は、Productionかつ`SITE_INDEXING_ENABLED=true`のときだけインデックス対象になります。それまではnoindex/nofollow、robots全拒否、sitemapは空です。募集ページは常時noindexで、sitemap対象外。`/first-cohort`はPreview/開発でのみ正規の募集パスへ一時リダイレクトし、Productionには追加しません。既存設定を維持しています。

PR #25の`lib/analytics-config.ts`と`tests/analytics.test.cjs`、Google所有権確認コード、Metadata、robots/sitemap、募集情報・公開フラグ、写真・動画素材、文章、料金・日程、LINE/電話接続先は変更していません。正式ドメインの採用、noindex解除、Search Console確認・サイトマップ送信は運営判断として残しています。会社・規約等の「確認中」の内容も補完していません。

画像は既にNext Imageによるサイズ生成・最適化・遅延読み込みとLCP画像のpreloadがあり、動画は外部リンク方式でiframeの初期読み込みはありません。フォントはシステムフォントで外部フォント取得はありません。CSSは多数の既存デザイン上書きを含むため、測定で根拠のない削除・統合は行っていません。既存JSの一括削除やライブラリ追加も行っていません。

## パフォーマンス

計測値と条件は [results.json](results.json) に記録します。初回の単発測定では通常HPのTBTが216→329msと増加したため、単発結果を改善の根拠にはせず、基準コードを別worktreeでビルドして前後を交互に3回ずつ再測定しました。

同一端末・同一依存・Lighthouse 13.6.0 / Headless Chromium 156の既定モバイル設定で、画像最適化キャッシュを双方同様に準備し、各呼出しは新しいブラウザで直列実行。基準は3101、修正後は3100ポートです。以下は各3回の中央値です。

|ページ|Performance|LCP|TBT|CLS|
|---|---|---|---|---|
|通常HP|85 → 93|2.675 → 2.643秒|357 → 142.5ms|0 → 0|
|募集ページ|95 → 94|2.939 → 2.955秒|85 → 76.5ms|0 → 0|

通常HPのTBT中央値は改善しましたが、LCPは両ページで概ね同程度、募集ページのPerformance中央値は1点低下しています。小標本かつローカルの模擬計測なので、全面的な速度向上や実環境での改善率は断言しません。各回の値と初回の単発結果もresults.jsonに残しています。CLSは初期表示の値であり、全スクロール操作の実ユーザーCLSを保証しません。TBTをINPとして扱っていません。Accessibility / Best Practicesは初回前後とも100、SEOは意図的なnoindex/robots制限を維持したため69でした。

Canvasは通常モーションの2秒間を計測し、drawあたりの`Math.hypot`呼出数を比較しました。固定候補外の距離計算が各フレーム161回減少（22粒子時の全組合せ231回→候補70回）。周辺のフェード等も含む全呼出数では画面ごとに約58〜70%減少しました。これは距離計算回数の削減であり、サイト全体のCPU/GPU使用率や電池消費が同率改善したという意味ではありません。

画像レスポンスを保留した追加テストでは、全ProgramPhotoの表示領域が読み込み前から存在し、読み込み後のtop/width/heightの変動は1px以内でした。初期表示のCLSが0でも、スクロール先の未読込画像の高さ0は別問題なので修正しています。

## 実行した検証

|検証|結果|
|---|---|
|`npm test`|既存48件成功|
|`npm run typecheck`|成功|
|`npm run build`|Production Build成功|
|`npm run test:browser`|通常HP10幅・情報ページ・横向き・JSなし成功|
|`scripts/cohort-browser-check.cjs`|募集ページ11幅・18日程・会場タブ・JSなし成功|
|`npm run test:post-launch`|両ページ4幅の遅延画像・44px操作領域、不正URL3件の404・キーボード復帰、通常読み込みconsole監視が成功|
|`scripts/premium-atmosphere-browser-check.cjs`|サイドナビ・現在位置・進行率・手動停止・画面外/非表示停止・動き低減成功|
|`scripts/hero-network-clearance-browser-check.cjs`|文字・写真・帯・粒子の保護と動作成功|
|`scripts/hero-network-fade-browser-check.cjs`|距離・境界フェード・写真保護成功|
|`scripts/premium-ux-browser-check.cjs`|両ページ5幅・一度限りの演出・動き低減・JSなし成功|
|`scripts/splash-browser-check.cjs`|5幅と各フォールバック成功|
|axe自動監査|通常HP・募集・404の4幅すべて違反0|
|`git diff --check`|成功|

追加テストの要約: [browser-regressions.json](browser-regressions.json)。Playwrightは既存の任意QA環境を利用し、本番依存は増やしていません。`npm run start -- --port 3100`でProduction Buildを起動後、`CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:post-launch`で再現できます。別ポートは`QA_BASE_URL`、Playwrightの場所は`PLAYWRIGHT_MODULE_PATH`で指定できます。axe/Lighthouseは作業ディレクトリの一時ツールとして導入し、package.json/lockfileの依存には追加していません。

## 閲覧用キャプチャ

|通常HP|募集ページ|
|---|---|
|[390px](home-390.webp)|[390px](cohort-390.webp)|
|[1440px](home-1440.webp)|[1440px](cohort-1440.webp)|

404: [修正前](404-before.webp) / [修正後](404-final.webp)。

## 手動確認・未確認

実機iPhone/Safari、実機スクリーンリーダー、実際の低速回線・低性能端末の電力消費、実ユーザーINP、LINE追加・通話・外部動画再生は未確認です。ブラウザの自動検証やaxeはこれらの代替にはなりません。Lint設定は既存にないためLintは未実施。Previewの実画面とVercelのReady状態は区別して報告します。運営者のPreview確認が終わるまでマージ・本番公開は行いません。
