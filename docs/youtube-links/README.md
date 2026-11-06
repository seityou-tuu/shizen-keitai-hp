# YouTube実績画像へのリンク追加

main `667f25c` から作成した `feat/youtube-evidence-links` の変更です。本番公開・mainへのマージは行いません。PR #9のブランチ・第1期生募集ページは変更していません。

| 表示再生数 | リンク先 |
| --- | --- |
| 86万回 | https://youtu.be/yp_P0a_oedY |
| 132万回 | https://youtu.be/yudalXPijCk |

既存の各画像をリンクで囲み、小さな深緑とゴールドの再生マークを重ねました。画像と再生マークは同じリンクを利用し、`target="_blank" rel="noopener noreferrer"` を指定。アクセシブル名で動画の区別と新しいタブで開くことを伝えています。

ホバー時は再生マークだけを控えめに拡大し、`prefers-reduced-motion` では動きを無効化します。最小タップ領域44pxとキーボードのフォーカス表示を確保。画像ファイル・掲載文章・再生数・他セクションは変更していません。新しいライブラリやYouTube埋め込みはありません。

## 検証

- build・typecheck・テスト16件・git diff --check：成功。
- PC 1440px：2画像それぞれで画像・再生マーク・Enterキーから新しいタブが開き、指定の動画IDへ遷移することを確認。サムネイルのファイル名と再生数の対応、外部タブの `window.opener === null`、通常ホバーと動きを減らす設定も確認。
- スマホ390px・タッチ操作：両画像と両再生マークのタップで、正しい動画の別タブが開くことを確認。
- 320／360／375／390／400／414／430／768／1024／1440px：既存のページ表示・ナビゲーション・FAQ・電話・料金・画像比率等の検証に成功。
- 外部宛先はPlaywrightで応答を置き換えて検証し、実際のYouTubeへの通信・動画再生は行っていません。実機Safariは未確認です。

[PC画面](desktop.webp) ／ [スマホ画面](mobile.webp)

[リンク操作の記録](link-report.json) ／ [ページ回帰検証の記録](regression-report.json)

## 再検証

ローカル本番ビルドを3100ポートで起動後、既存のPlaywright・Chromiumのパスを指定します。

```sh
PLAYWRIGHT_MODULE_PATH=/path/to/playwright CHROMIUM_EXECUTABLE_PATH=/path/to/chromium node scripts/youtube-link-browser-check.cjs
```
