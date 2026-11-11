# Growth Journey

PR #23へ追加。通常HPの旧5枚カードを、5つの視点をつなぐロードマップに置換。指定コピー、統一ストロークの5種SVG、PCの上昇配置・スマホの縦ラインを実装。既存の資格・成果保証に関する注記を維持し、5ヶ月のカリキュラムや正式な進級条件ではないことを明記。

既存PageMotionは見出しにそのまま適用。対象セクション専用のIntersectionObserverとWeb Animations APIで番号・線画・線を一度だけ480msで表示。reduced-motionでは停止し、設定変更時の進行中アニメーションも解除。JavaScriptなしでも本文・ラインを表示。大型依存・画像リクエスト追加なし。スプラッシュ・募集ページ・SEO・分析・相談リンクに変更なし。

37テスト・型検査・production build・git diffチェック成功。scripts/growth-browser-check.cjsで320 / 360 / 375 / 390 / 400 / 430 / 768 / 1024 / 1440pxの5段階・SVG・配置・横はみ出し、JavaScript無効時の表示を確認。320 / 390 / 1440pxでスクリーンショットを取得し視覚確認。実機Safari・Vercel実画面は未確認。性能のフィールド計測は未実施。
