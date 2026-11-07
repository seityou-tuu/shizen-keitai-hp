# 公式LINE連携の追加検証

2026年11月6日（日本時間）。主催者確認済みの`https://lin.ee/O3tJo01`を相談窓口として追加しました。

公開HP向けはmain `55b7009`から独立した`feat/official-line-contact`（`c8299d0`）です。募集LPの情報を含まないことを確認済み。既存PR #9には、その共通LINE変更を取り込み、LP固有の相談導線を追加しています。新しい募集PRは作成していません。

## 募集LPの変更

- ヘッダー、冒頭の主要CTA、相談欄、フッターにLINE相談を追加。
- スマホ固定バーを「LINEで相談」「電話相談」に変更。
- 電話0985-74-7643を保持し、LINEと電話はいずれも受講相談・お問い合わせであると案内。
- LINE未開設の旧案内を更新。LINE相談・友だち追加で正式な受講申込み・契約・決済が完了するとは案内していない。
- `firstCohortDetails.application.url`はnull、募集準備中のまま。開催情報・料金・写真は変更していない。

## 結果

- 単体30件、Production相当ビルド、Preview相当ビルド、型検査、差分検査：成功。Lint設定は既存なし。
- LPの10画面幅：文字切れ・横はみ出し、全18日程・タブ・比較・キーボード、既存料金との一致、写真、FAQ、固定バー、JavaScript無効の全日程表示が成功。
- LINEのPC1440px・スマホタッチ390px検証：各4つの見えている相談リンクで、正確なURL、別タブ、openerなし、電話の維持を確認。LINEへの通信はテストで置換し、友だち追加・メッセージ送信は行っていない。
- 本番HP・募集LPの両方でスマホメニューのLINEタップ、メニュー閉鎖、安全な別タブを追加確認。
- Production相当で、LPは404・noindex、トップはLINEと電話があり募集リンクなし、サイトマップにも募集LPなしを再確認。
- 公開HP向けの共通変更は、別ブランチで21件の単体テスト、本番ビルド・型検査、10画面幅・情報4ページ、PC・スマホのLINEクリック検証に成功している。

記録：[LINE操作](line-links.json) / [LP回帰](line-lp-regression.json) / [スマホメニュー](line-mobile-menu.json) / [公開制御](line-production-guard.json)。公開HP向けの画像・結果は[共通変更の資料](../official-line/README.md)を参照してください。

| 画面 | スマホ390px | PC1440px |
| --- | --- | --- |
| 募集LP冒頭 | [画像](line-hero-390.png) | [画像](line-hero-1440.png) |
| 募集LP相談欄 | [画像](line-contact-390.png) | [画像](line-contact-1440.png) |

## 公開前

主催者によるURL確認は受領済みです。実機のLINEアプリ起動、受付担当・回答体制・個人情報の取扱いは運営者の確認対象です。LINEの応答時間を推測して追加していません。

正式な申込み方法・コース対応・会場住所/時刻・契約条件は未確定のため、PR #9は引き続き未マージ・未公開です。Production 404・noindex・サイトマップ除外を維持しています。mainへのマージ・本番公開・Vercel設定変更は行っていません。

GitHub APIがForbiddenのため、公開HP用の新規PRは[手動作成画面](https://github.com/seityou-tuu/shizen-keitai-hp/pull/new/feat/official-line-contact)を案内します。[既存PR #9](https://github.com/seityou-tuu/shizen-keitai-hp/pull/9)は元ブランチを更新します。Vercel Preview URL・デプロイ成功はAPI制限により未確認です。
