"use client";
import { useEffect, useRef, useState } from "react";
const programLinks = [
  ["自然形体療法とは", "/#about"],
  ["研修内容", "/#training"],
  ["資格取得コース", "/#roadmap"],
  ["受講料金", "/#courses"],
  ["よくある質問", "/#faq"],
];
const recruitmentLinks = [
  ["自然形体療法とは", "/#about"],
  ["研修内容", "#cohort-learning"],
  ["募集情報", "#cohort-schedule"],
  ["受講料金", "#cohort-tuition"],
  ["よくある質問", "#cohort-faq"],
];
export function Header({ variant = "program" }: { variant?: "program" | "first-cohort" }) {
  const links = variant === "first-cohort" ? recruitmentLinks : programLinks;
  const contactHref = variant === "first-cohort" ? "#cohort-contact" : "/#contact";
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1101px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);
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
        <a className="header-contact" href={contactHref}>
          お問い合わせ <span aria-hidden="true">↗</span>
        </a>
      </nav>
      <button
        ref={toggleRef}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        onClick={() => setOpen(!open)}
      >
        {open ? "閉じる −" : "メニュー ＋"}
      </button>
      <nav
        hidden={!open}
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="モバイルナビゲーション"
      >
        {[...links, ["お問い合わせ", contactHref]].map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
