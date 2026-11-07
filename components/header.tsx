"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { FIRST_COHORT_PATH } from "@/lib/recruitment";
import { LineConsultationLink } from "@/components/line-consultation-link";
const links = [
  ["自然形体療法とは", "/#about"],
  ["研修内容", "/#training"],
  ["資格取得コース", "/#roadmap"],
  ["受講料金", "/#courses"],
  ["よくある質問", "/#faq"],
];
const cohortLinks = [
  ["自然形体療法とは", "/#about"],
  ["研修内容", "#cohort-learning"],
  ["日程・会場", "#cohort-schedule"],
  ["受講料金", "#cohort-tuition"],
  ["よくある質問", "#cohort-faq"],
];
export function Header({ variant = "program", showFirstCohort = false }: { variant?: "program" | "first-cohort"; showFirstCohort?: boolean }) {
  const navigation = variant === "first-cohort" ? cohortLinks : showFirstCohort ? [...links, ["第1期生募集", FIRST_COHORT_PATH]] : links;
  const contactHref = variant === "first-cohort" ? "#cohort-contact" : "/#contact";
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const followMobileLink = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setOpen(false);
    const destination = new URL(event.currentTarget.href);
    if (destination.pathname !== window.location.pathname) return;
    const target = document.getElementById(destination.hash.slice(1));
    if (target) {
      // The clicked link becomes hidden: continue keyboard navigation at its destination.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  };
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
    <header className={showFirstCohort ? "site-header home-cohort-header" : "site-header"}>
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
        {navigation.map(([label, href]) => (
          <a key={href} href={href} className={href === FIRST_COHORT_PATH ? "header-cohort-link" : undefined}>
            {label}
          </a>
        ))}
        <a className="header-contact-details" href={contactHref}>
          お問い合わせ <span aria-hidden="true">↗</span>
        </a>
        <LineConsultationLink className="header-contact header-line-contact" />
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
        {[...navigation, ["お問い合わせ", contactHref]].map(([label, href]) => (
          <a key={href} href={href} onClick={followMobileLink} className={href === FIRST_COHORT_PATH ? "header-cohort-link" : undefined}>
            {label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
        <LineConsultationLink className="header-line-contact" onClick={() => setOpen(false)} />
      </nav>
    </header>
  );
}
