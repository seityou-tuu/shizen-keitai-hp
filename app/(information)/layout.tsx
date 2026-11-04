import { Header } from "@/components/header";
import { InformationLinks } from "@/components/information-links";
export default function InformationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <Header />
      <main id="main" className="information-main container">
        <a href="/" className="information-back">
          ← プログラムのご案内に戻る
        </a>
        {children}
      </main>
      <footer className="footer information-footer">
        <div className="container">
          <InformationLinks />
          <p>株式会社TSUNAGi · 代表取締役 永友裕也</p>
          <p className="small-note">掲載情報・各種方針は確認・整備中です。</p>
        </div>
      </footer>
    </>
  );
}
