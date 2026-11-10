"use client";

import { useLayoutEffect } from "react";
import "./brand-splash.css";

const SESSION_KEY = "shizen-brand-intro-v1";

/** Animate a measured copy, leaving the real header's layout untouched. */
export function BrandSplash() {
  useLayoutEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const brand = document.querySelector<HTMLAnchorElement>(".site-header .brand");
    if (!brand || motion.matches || location.hash || window.scrollY > 0) return;
    try { if (sessionStorage.getItem(SESSION_KEY)) return; } catch { /* Storage may be disabled. */ }

    const previousFocus = document.activeElement as HTMLElement | null;
    const overlay = document.createElement("div");
    overlay.className = "brand-splash";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "自然形体療法 資格取得プログラム イントロ");
    const background = document.createElement("div");
    background.className = "brand-splash-background";
    const flying = document.createElement("div");
    flying.className = "brand-splash-flight";
    flying.setAttribute("aria-hidden", "true");
    const copy = document.createElement("div");
    copy.innerHTML = brand.innerHTML;
    flying.append(copy);
    const skip = document.createElement("button");
    skip.className = "brand-splash-skip";
    skip.textContent = "イントロをスキップ";
    overlay.append(background, flying, skip);
    document.body.append(overlay);

    // Copy computed typography, including responsive rules and inherited fonts.
    const syncAppearance = () => {
      const source = [brand, ...brand.querySelectorAll<HTMLElement>("*")];
      const target = [copy, ...copy.querySelectorAll<HTMLElement>("*")];
      source.forEach((node, index) => {
        const styles = getComputedStyle(node);
        for (const property of Array.from(styles)) {
          if (property !== "visibility") target[index].style.setProperty(property, styles.getPropertyValue(property));
        }
      });
      Object.assign(copy.style, { position: "static", margin: "0", transform: "none", visibility: "visible" });
    };
    syncAppearance();
    const oldVisibility = brand.style.visibility;
    brand.style.visibility = "hidden";
    const inertElements = Array.from(document.body.children).filter((el): el is HTMLElement => el instanceof HTMLElement && el !== overlay && !el.inert);
    inertElements.forEach(el => { el.inert = true; });
    const oldOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    skip.focus({ preventScroll: true });
    let frame = 0;
    let ended = false;
    let userSkipped = false;
    let fontsReady = document.fonts.status === "loaded";
    let appearanceDirty = false;
    const start = performance.now();
    const finish = () => {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(frame);
      clearTimeout(watchdog);
      brand.style.visibility = oldVisibility;
      inertElements.forEach(el => { el.inert = false; });
      document.documentElement.style.overflow = oldOverflow;
      const restoreFocus = overlay.contains(document.activeElement);
      overlay.remove();
      if (restoreFocus && previousFocus && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
      else if (restoreFocus && userSkipped) brand.focus({ preventScroll: true });
      try { sessionStorage.setItem(SESSION_KEY, "seen"); } catch { /* Still usable without storage. */ }
    };
    const skipIntro = () => { userSkipped = true; finish(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") skipIntro(); };
    const markDirty = () => { appearanceDirty = true; };
    const restoreFromCache = (event: PageTransitionEvent) => { if (event.persisted) finish(); };
    const observer = new ResizeObserver(markDirty);
    observer.observe(brand);
    window.addEventListener("resize", markDirty);
    window.addEventListener("pageshow", restoreFromCache);
    window.addEventListener("pagehide", finish);
    document.addEventListener("keydown", escape);
    document.addEventListener("load", markDirty, true);
    document.fonts.addEventListener("loadingdone", markDirty);
    motion.addEventListener("change", finish);
    skip.addEventListener("click", skipIntro);
    void document.fonts.ready.then(() => { fontsReady = true; markDirty(); });
    const watchdog = window.setTimeout(finish, 2900);
    let revealAt: number | undefined;
    const tick = (now: number) => {
      if (ended) return;
      if (appearanceDirty) { syncAppearance(); appearanceDirty = false; }
      if (revealAt === undefined && (fontsReady || now - start >= 350)) revealAt = now;
      const elapsed = revealAt === undefined ? 0 : now - revealAt;
      const reveal = Math.min(1, elapsed / 350);
      const progress = Math.max(0, Math.min(1, (elapsed - 700) / 1450));
      // Quintic smoothstep has zero velocity at both ends, with no landing snap.
      const eased = progress * progress * progress * (progress * (progress * 6 - 15) + 10);
      const rect = brand.getBoundingClientRect();
      const scale = Math.min(2.1, (window.innerWidth - 48) / rect.width);
      const currentScale = scale + (1 - scale) * eased;
      const centerX = (window.innerWidth - rect.width * scale) / 2;
      const centerY = (window.innerHeight - rect.height * scale) / 2;
      const x = centerX + (rect.left - centerX) * eased;
      const y = centerY + (rect.top - centerY) * eased;
      Object.assign(flying.style, { width: `${rect.width}px`, height: `${rect.height}px`, opacity: String(reveal), transform: `translate3d(${x}px, ${y}px, 0) scale(${currentScale})` });
      background.style.opacity = String(1 - eased);
      skip.style.opacity = String(1 - eased);
      if (progress === 1) finish();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      finish();
      observer.disconnect();
      window.removeEventListener("resize", markDirty);
      window.removeEventListener("pageshow", restoreFromCache);
      window.removeEventListener("pagehide", finish);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("load", markDirty, true);
      document.fonts.removeEventListener("loadingdone", markDirty);
      motion.removeEventListener("change", finish);
    };
  }, []);
  return null;
}
