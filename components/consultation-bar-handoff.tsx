"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function ConsultationBarHandoff({ className, label, heroLinkSelector, children }: {
  className: string;
  label: string;
  heroLinkSelector: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const bar = ref.current;
    const link = document.querySelector<HTMLAnchorElement>(heroLinkSelector);
    const header = document.querySelector(".site-header");
    if (!bar || !link || !header || !window.IntersectionObserver) return;

    let observer: IntersectionObserver | undefined;
    let margin = "";
    const observe = () => {
      const top = Math.ceil(header.getBoundingClientRect().height) + 44;
      const bottom = Math.ceil(parseFloat(getComputedStyle(bar).paddingBottom)) + 44;
      const nextMargin = `-${top}px 0px -${bottom}px`;
      if (nextMargin === margin) return;
      margin = nextMargin;
      observer?.disconnect();
      // Switch only when a 44px slice is reachable below the header
      // and above the bottom inset, including the device safe area.
      observer = new IntersectionObserver((entries, currentObserver) => {
        const entry = entries[entries.length - 1];
        if (!entry || currentObserver !== observer) return;
        if (entry.isIntersecting && bar.contains(document.activeElement)) {
          link.focus({ preventScroll: true });
        }
        bar.toggleAttribute("data-hero-action-visible", entry.isIntersecting);
      }, { rootMargin: margin });
      observer.observe(link);
    };
    observe();
    const resize = window.ResizeObserver ? new ResizeObserver(observe) : undefined;
    resize?.observe(header);
    resize?.observe(bar, { box: "border-box" });

    return () => {
      resize?.disconnect();
      observer?.disconnect();
      bar.removeAttribute("data-hero-action-visible");
    };
  }, [heroLinkSelector]);

  return <nav ref={ref} className={className} aria-label={label}>{children}</nav>;
}
