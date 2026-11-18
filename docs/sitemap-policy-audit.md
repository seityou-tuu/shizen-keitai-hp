# 空のサイトマップと検索公開方針の調査

2026-11-18 / 基準 `bbd5a66`（PR #25・#27マージ後のmain）。今回の変更は回帰テスト・検証スクリプト・本記録のみ。アプリコード、SEO設定、所有権確認コード、環境変数、募集状態、表示内容・デザインには変更なし。

## 原因と今回の判断

`app/sitemap.ts` は `isSearchIndexingEnabled()` がfalseのとき `[]` を返します。判定は `lib/site-config.ts` の次のAND条件です。

- `VERCEL_ENV === "production"`
- `SITE_INDEXING_ENABLED === "true"`（完全一致）

この条件がビルド時に揃わない場合、Next.jsが生成する `/sitemap.xml` のURLは0件です。`README.md`、`.env.example`、`docs/site-operation-guide.md`、`docs/analytics-search-console-setup.md` にも、公開準備・法定情報等の確認と責任者の承認が終わるまで検索登録を停止し、停止中は空のサイトマップにする方針が明記されています。

Search Consoleの所有権確認はユーザー報告により成功していますが、検索公開の許可とは独立しています。確認コードの存在や所有権確認の成功で上記条件が自動的に有効になる実装ではありません。

したがって、今回新たに掲載したURLは **0件** です。noindexの解除やrobotsの拒否設定を無断で変更してまでURLを追加しません。アプリにURL生成の不具合は再現されず、現在の検索公開停止方針を保ちます。

本番URLへの直接接続は作業環境のCONNECTプロキシが403を返すため未確認です。本番の空XMLはユーザー提示の内容を根拠としています。本番デプロイの環境変数・ビルド時の値は読み取っていないため、「どちらの変数が未設定だったか」「設定変更後に再ビルドしていないか」までは断定しません。ローカルでは条件ごとの出力を再現しています。

## ページごとの設定

canonicalの基準URLは `https://shizen-keitai-hp.vercel.app` です。

|ページ|検索公開停止中のmeta / HTTPヘッダー|既存の承認条件を満たしたProduction|canonical|
|---|---|---|---|
|通常HP `/`|noindex, nofollow|index, follow / sitemap対象|基準URL|
|会社概要 `/company`|noindex, nofollow（ルート継承）|index, follow / sitemap対象|基準URL + `/company`|
|特商法 `/legal`|同上|同上|基準URL + `/legal`|
|プライバシー `/privacy`|同上|同上|基準URL + `/privacy`|
|受講規約 `/terms`|同上|同上|基準URL + `/terms`|
|第1期生募集 `/recruitment/first`|常時noindex, nofollow|引き続きnoindex / sitemap除外|基準URL + `/recruitment/first`|
|旧URL `/first-cohort`|noindex。Productionは404|引き続き除外|Preview/開発のみ募集ページへ一時リダイレクト。別の掲載URLにしない|

募集ページはページ固有のmeta robotsと `next.config.ts` のHTTPヘッダーの両方で検索を除外しています。canonicalが存在してもindex許可を意味しません。募集準備中・申込み方法の準備状態も維持しています。Preview/開発はProduction用フラグがtrueでも検索公開しません。

## robots.txtとの整合性

|条件|robots.txt|sitemap.xml|
|---|---|---|
|検索公開停止中、またはPreview/開発|`User-Agent: *` / `Disallow: /`、Sitemap指定なし|URL 0件|
|既存の承認条件を満たすProduction|`Allow: /`。`/api/`、`/recruitment/`、`/first-cohort`を拒否。正式sitemapを指定|公開パス一覧の5件のみ|

承認条件が満たされた場合に既存コードが生成する5件は、次のとおりです。**今回これらの検索公開を承認したり、本番へ追加したりしたわけではありません。**

- `https://shizen-keitai-hp.vercel.app/`
- `https://shizen-keitai-hp.vercel.app/company`
- `https://shizen-keitai-hp.vercel.app/legal`
- `https://shizen-keitai-hp.vercel.app/privacy`
- `https://shizen-keitai-hp.vercel.app/terms`

## 追加テストと検証結果

`tests/seo.test.cjs` を拡張し、未設定・空文字・false・大文字・数値文字列・前後空白のフラグでは公開されないこと、所有権確認用の有効な設定があっても公開されないこと、承認時のURLが上記5件だけで重複しないこと、robotsとHTTP noindexが同じ公開条件に従うこと、募集のHTTP noindexが常に維持されることを検証しました。

`scripts/sitemap-browser-check.cjs` はローカルProduction BuildのHTTP応答を読み、XMLのパース・ルート要素・名前空間・全URL、robots.txt、6ページのcanonical・meta robots・HTTPヘッダーを確認します。XMLの整形式を確認するもので、Googleでの受理やXSD全体の適合性を保証するものではありません。停止中の空サイトマップは検索送信用の完成品として扱いません。

|検証|結果|
|---|---|
|`npm test`|51件成功（既存48件＋追加3件、既存SEOテストも強化）|
|`npm run typecheck`|成功|
|Production・`SITE_INDEXING_ENABLED=false` のbuildとHTTP検証|成功：0件、全ページnoindex、robots全拒否|
|Production・`SITE_INDEXING_ENABLED=true` のローカルテスト用buildとHTTP検証|成功：5件、通常5ページindex、募集noindex、robotsと整合|
|Preview・`SITE_INDEXING_ENABLED=true` のbuildとHTTP検証|成功：0件、全ページnoindex、robots全拒否|
|`git diff --check`|成功|

再現例（既定の検索公開停止を確認する場合）:

```sh
VERCEL_ENV=production SITE_INDEXING_ENABLED=false npm run build
VERCEL_ENV=production SITE_INDEXING_ENABLED=false npm run start -- --port 3120
# 別のターミナル。既存QAと同様にPlaywrightとChromiumが必要です。
QA_BASE_URL=http://127.0.0.1:3120 QA_INDEXING_ENABLED=false node scripts/sitemap-browser-check.cjs
```

`QA_INDEXING_ENABLED` は期待値の指定だけで、アプリやVercelの公開設定は変えません。`PLAYWRIGHT_MODULE_PATH` と `CHROMIUM_EXECUTABLE_PATH` で既存のQA環境を指定できます。新しい依存ライブラリは追加していません。

## 残る運営判断

検索公開を進めるには、既存方針に沿って公開準備・法定情報等を確認した責任者が承認する必要があります。その後に管理者がProductionのフラグと再ビルドを扱い、本番のmeta / HTTPヘッダー / robots / sitemapを確認してからSearch Consoleへ送信します。今回は環境設定変更・サイトマップ送信・マージ・本番公開を行っていません。
