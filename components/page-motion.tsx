"use client";

import { useEffect } from "react";
import "./page-motion.css";

type Kind = "heading" | "copy" | "image" | "message" | "step";

/** Progressive enhancement: nothing is hidden while JS or observers are unavailable. */
export function PageMotion({ variant }: { variant: "home" | "cohort" }) {
  useEffect(() => {
    const root = document.querySelector(variant === "home" ? ".homepage-quality" : ".recruitment-page");
    if (!root || !("IntersectionObserver" in window) || !Element.prototype.animate) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const played = new WeakSet<Element>();
    const animations = new Map<Element, Animation>();
    let observer: IntersectionObserver | undefined;
    let started = false;
    const groups: [Kind, string][] = variant === "home" ? [
      ["heading", ".story-section .section-heading h2, .training-section-intro h2, .renewal-tuition h2"],
      ["copy", ".training-section-intro > p, .theory-story > div:last-child > p, .instructor-learning-lead, .instructor-study-bridge > p"],
      ["image", ".training-main-photo > figure, .renewal-instructor-photos > figure:first-child"],
      ["message", "#future h2, #features h2"],
    ] : [
      ["heading", ".recruitment-section h2"],
      ["copy", ".recruitment-section-lead, .cohort-learning-lead, .cohort-training-copy > p:not(.recruitment-eyebrow), .cohort-next-step-copy > p"],
      ["image", ".cohort-observation-photo, .cohort-teacher-portrait"],
      ["message", "#cohort-next-step-title"],
      ["step", ".cohort-session-list > li"],
    ];
    const targets = new Map<HTMLElement, Kind>();
    groups.forEach(([kind, selector]) => root.querySelectorAll<HTMLElement>(selector).forEach(el => targets.set(el, kind)));
    const stop = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const setup = () => {
      stop();
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting || played.has(target)) return;
          played.add(target);
          observer?.unobserve(target);
          const el = target as HTMLElement;
          const kind = targets.get(el)!;
          // Never animate a focused control or its containing panel.
          if (el.contains(document.activeElement)) return;
          const delay = kind === "copy" ? 70 : kind === "image" ? 110 : kind === "step" ? (Array.from(el.parentElement!.children).indexOf(el) % 3) * 60 : 0;
          const frames: Keyframe[] = kind === "step" ? [
            { backgroundColor: "#f5f3eb", borderTopColor: "#dbc79b" },
            { backgroundColor: getComputedStyle(el).backgroundColor, borderTopColor: "#a68b58" },
          ] : [
            { opacity: kind === "copy" ? .35 : .15, transform: `translateY(${kind === "image" ? 8 : 12}px)`, ...(kind === "message" ? { clipPath: "inset(0 0 90% 0)" } : kind === "image" ? { clipPath: "inset(0 0 8% 0)" } : {}) },
            { opacity: 1, transform: "none", clipPath: "inset(0)" },
          ];
          const animation = el.animate(frames, { duration: kind === "image" ? 720 : kind === "step" ? 560 : 620, delay, easing: "cubic-bezier(.22,.65,.3,1)", fill: "backwards" });
          animations.set(el, animation);
          el.dataset.uxPlayed = kind;
          animation.onfinish = () => { animation.cancel(); animations.delete(el); };
        });
      }, { threshold: .06 });
      targets.forEach((_, el) => {
        if (played.has(el)) return;
        // Leave the first view and already-read content untouched, including splash handoff.
        if (el.getClientRects().length && el.getBoundingClientRect().top < innerHeight) { played.add(el); return; }
        observer?.observe(el);
      });
    };
    const begin = () => {
      if (document.documentElement.hasAttribute("data-brand-intro")) return;
      if (started) return;
      started = true;
      splashObserver.disconnect();
      setup();
    };
    const splashObserver = new MutationObserver(begin);
    splashObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-brand-intro"] });
    begin();
    const changed = () => { if (started) setup(); };
    const focused = () => {
      animations.forEach((animation, el) => { if (el.contains(document.activeElement)) { animation.cancel(); animations.delete(el); } });
    };
    preference.addEventListener("change", changed);
    root.addEventListener("focusin", focused);
    return () => { stop(); splashObserver.disconnect(); preference.removeEventListener("change", changed); root.removeEventListener("focusin", focused); };
  }, [variant]);
  return null;
}
