# Instagram紹介セクション

公開済みmain `7f36574` から作成した `feat/instagram-reel-introduction`。講師紹介・YouTube実績・受賞写真の直後に、独立したInstagram紹介を追加しました。既存12セクションの内容・番号・写真・YouTubeリンクは変更していません。PR #9・main・本番公開設定は変更していません。

## 掲載内容とリンク

見出しは指定の「施術と考え方を、映像で確かめる。」。施術の様子や身体への向き合い方をInstagramから知るための補足文と、アカウントへの「Instagramを見る」ボタンを配置しました。新たな効果・実績・再生数は追加していません。

| 提供画像 | ユーザーが確認した内容 | リール |
| --- | --- | --- |
| 12.46.21.png | シーバー病 | https://www.instagram.com/reel/DcGE2FPKpHz/ |
| 12.46.32.png | オスグッド | https://www.instagram.com/reel/DcN4DM8K89p/ |
| 12.46.48.png | シンスプリント | https://www.instagram.com/reel/DapZQNvvtVR/ |

アカウント：https://www.instagram.com/ngtmyy_1990

4リンクすべてを別タブで開き、`rel="noopener noreferrer"` を指定。アクセシブル名で新しいタブが開くことを伝えています。

## 画像・デザイン

Instagramの直接取得は環境制限でできなかったため、提供ZIP内のスクリーンショット3枚を使用。初めは対応が不明でしたが、ユーザーが各URLを確認した回答に基づき対応を確定しています。

元の436×688／432×670／436×682pxを保持し、人物・文字・内容・再生数は改変していません。切り抜かず全体を表示。WebP化で合計1,472,506→119,664バイト（約92％削減）。Next Imageで寸法予約・遅延読み込み・幅別配信を行い、Instagram埋め込みや外部SDKは追加していません。

深緑・白・ゴールドを引き継ぎ、PCは3枚横並び、スマホは横スクロールとスナップにしました。スワイプの案内と次カードの一部を見せ、縦に長くなりすぎない構成です。スクロール領域はキーボードでも操作可能。小さなInstagramアイコンと再生マーク、控えめなホバー演出を加え、動きを減らす設定では動作を無効化します。

## 検証

- build・typecheck・テスト17件・git diff --check：成功。
- PC 1440px：3カード横並び、各リールとアカウントのクリック、別タブ・URL・opener切断を確認。
- スマホ390px：4リンクのタップ、横スクロールとキーボードスクロール、ページ全体に横スクロールがないことを確認。
- 320／360／375／390／400／414／430／768／1024／1440px：既存の表示・ナビゲーション・FAQ・電話・料金・YouTubeリンク・画像・コントラスト等の回帰検証。
- 既存12セクション＋新規1セクションを確認。Instagram iframe・SDK・表示時の外部通信はありません。
- リンク先はPlaywrightで応答を置き換え、URLと別タブ動作を検証しています。Instagram上の動画再生・ログイン状態・実機Safariは未確認です。

[PC画面](desktop.webp) ／ [スマホ画面](mobile.webp)

[リンク操作記録](link-report.json) ／ [回帰検証記録](regression-report.json)

## 再検証

ローカル本番ビルドを3100ポートで起動後、既存のPlaywrightとChromiumを指定します。

```sh
PLAYWRIGHT_MODULE_PATH=/path/to/playwright CHROMIUM_EXECUTABLE_PATH=/path/to/chromium node scripts/instagram-browser-check.cjs
```
