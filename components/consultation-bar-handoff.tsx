"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function ConsultationBarHandoff({ className, label, heroLinkSelector, maxWidth, children }: {
  className: string;
  label: string;
  heroLinkSelector: string;
  maxWidth: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const bar = ref.current;
    const link = document.querySelector<HTMLAnchorElement>(heroLinkSelector);
    const header = document.querySelector(".site-header");
    if (!bar || !link || !header || !window.IntersectionObserver) return;

    const mobile = matchMedia(`(max-width: ${maxWidth}px)`);
    let intersection: IntersectionObserver | undefined;
    let resize: ResizeObserver | undefined;
    let margin = "";

    const observe = () => {
      const top = Math.ceil(header.getBoundingClientRect().height) + 44;
      const bottom = Math.ceil(parseFloat(getComputedStyle(bar).paddingBottom)) + 44;
      const nextMargin = `-${top}px 0px -${bottom}px`;
      if (nextMargin === margin) return;
      margin = nextMargin;
      intersection?.disconnect();
      // Wait until the hero offers a reachable 44px slice before handing off.
      intersection = new IntersectionObserver((entries, observer) => {
        const entry = entries[entries.length - 1];
        if (!entry || observer !== intersection) return;
        if (entry.isIntersecting && bar.contains(document.activeElement)) {
          link.focus({ preventScroll: true });
        }
        // The first observation decides whether the fixed bar may be painted.
        bar.toggleAttribute("data-consultation-available", !entry.isIntersecting);
      }, { rootMargin: margin });
      intersection.observe(link);
    };

    const stop = () => {
      intersection?.disconnect();
      resize?.disconnect();
      intersection = undefined;
      margin = "";
      bar.removeAttribute("data-consultation-available");
    };

    const update = () => {
      stop();
      if (!mobile.matches) return;
      if (window.ResizeObserver) {
        // Read the header and safe-area padding after layout.
        resize = new ResizeObserver(observe);
        resize.observe(header);
        resize.observe(bar, { box: "border-box" });
      } else {
        observe();
      }
    };

    update();
    mobile.addEventListener("change", update);
    return () => {
      mobile.removeEventListener("change", update);
      stop();
    };
  }, [heroLinkSelector, maxWidth]);

  return <nav ref={ref} className={className} aria-label={label}>{children}</nav>;
}
