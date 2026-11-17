import { Header } from "@/components/header";

export default function NotFound() {
  return <>
    <a className="skip-link" href="#main">本文へ移動</a>
    <Header />
    <main id="main" className="information-main container">
      <p className="eyebrow">404</p>
      <h1>ページが見つかりません</h1>
      <p className="information-lead">URLをご確認いただくか、トップページからご覧ください。</p>
      <a className="text-link not-found-back" href="/">トップページへ戻る ↗</a>
    </main>
  </>;
}
