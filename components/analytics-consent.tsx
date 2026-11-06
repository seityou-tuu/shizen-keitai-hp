"use client";

import { useEffect, useState } from "react";
import { startAnalytics } from "@/lib/analytics-client";
import "@/app/analytics-consent.css";

/** Homepage only. No saved opt-in: a new page load requires consent again. */
export function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    if (allowed !== true) return;
    return startAnalytics(measurementId);
  }, [allowed, measurementId]);
  return (
    <aside className="analytics-consent" aria-labelledby="analytics-title">
      <h2 id="analytics-title">アクセス解析について</h2>
      <p>サイト改善のため、Google AnalyticsとCookieを使用します。許可するまで解析は開始しません。<a href="/privacy">プライバシーポリシー</a></p>
      <p role="status">{allowed === true ? "アクセス解析を許可しています。" : allowed === false ? "アクセス解析は停止中です。" : "アクセス解析は任意です。"}</p>
      <div>
        {allowed !== true && <button type="button" onClick={() => setAllowed(true)}>アクセス解析を許可する</button>}
        {allowed !== false && <button type="button" onClick={() => setAllowed(false)}>{allowed ? "アクセス解析を停止する" : "許可しない"}</button>}
      </div>
    </aside>
  );
}
