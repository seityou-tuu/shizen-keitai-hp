"use client";
import { useState } from "react";
const links = [
  ["プログラムについて", "/#about"],
  ["資格取得の道筋", "/#roadmap"],
  ["コース・料金", "/#courses"],
  ["よくある質問", "/#faq"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a
        href="/"
        className="brand"
        aria-label="自然形体療法 資格取得プログラム トップ"
      >
        <span className="brand-symbol" aria-hidden="true">
          自然
        </span>
        <span>
          自然形体療法<small>資格取得プログラム</small>
        </span>
      </a>
      <nav aria-label="メインナビゲーション" className="desktop-nav">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
        <a className="header-contact" href="/#contact">
          お問い合わせ <span>↗</span>
        </a>
      </nav>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        onClick={() => setOpen(!open)}
      >
        {open ? "閉じる −" : "メニュー ＋"}
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="モバイルナビゲーション"
        >
          {[...links, ["お問い合わせ", "/#contact"]].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <span>↗</span>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
