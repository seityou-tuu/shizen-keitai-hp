"use client";

import { useEffect } from "react";

/** One-time, progressive enhancement. Content stays visible without JavaScript. */
export function HomepageMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const root = document.querySelector(".homepage-quality");
    if (!root || !("IntersectionObserver" in window)) return;
    const elements = root.querySelectorAll<HTMLElement>(
      ".training-section-intro, .training-main-photo > figure, .theory-story > div:last-child, .renewal-instructors .section-heading, .renewal-instructor-photos > figure, .renewal-roadmap .section-heading, .renewal-tuition .section-intro-row",
    );
    const reset = () => {
      observer?.disconnect();
      elements.forEach((element) => element.classList.remove("arrival-ready", "arrival-visible"));
    };
    const setup = () => {
      reset();
      if (preference.matches) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.add("arrival-visible");
          observer?.unobserve(target);
        });
      }, { threshold: 0.08 });
      elements.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.classList.add("arrival-ready");
        observer?.observe(element);
      });
    };
    setup();
    preference.addEventListener("change", setup);
    return () => { reset(); preference.removeEventListener("change", setup); };
  }, []);
  return null;
}
