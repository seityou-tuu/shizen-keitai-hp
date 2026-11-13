"use client";

import { useEffect, useRef, useState, type MouseEvent, type CSSProperties } from "react";
import { cohortSections, homeSections, pageProgress, sectionAtPosition } from "@/lib/section-navigation";
import "./premium-atmosphere.css";

export function SectionRail({ variant }: { variant: "home" | "cohort" }) {
  const links = variant === "home" ? homeSections : cohortSections;
  const [position, setPosition] = useState({ active: 0, progress: 0, visible: false });
  const railRef = useRef<HTMLElement>(null);
  const navigate = useRef<(event: MouseEvent<HTMLAnchorElement>, index: number) => void>(() => {});

  useEffect(() => {
    const desktop = matchMedia("(min-width: 1101px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const targets = links.map(link => document.querySelector<HTMLElement>(link.selector || `#${link.id}`));
    if (targets.some(target => !target)) return;
    let tops: number[] = [], maximum = 0, header = 94, active = 0, frame = 0;
    const temporaryFocus = new Set<HTMLElement>();
    const update = () => {
      frame = 0;
      const visible = desktop.matches && innerHeight - header >= 300 && !document.documentElement.hasAttribute("data-brand-intro");
      if (!visible) { setPosition(old => old.visible ? { ...old, visible: false } : old); return; }
      active = sectionAtPosition(tops, scrollY + header + 56, active, maximum > 0 && scrollY >= maximum - 2);
      const progress = pageProgress(scrollY, maximum);
      setPosition(old => old.active === active && old.progress === progress && old.visible === visible ? old : { active, progress, visible });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      header = document.querySelector(".site-header")?.getBoundingClientRect().height || 94;
      railRef.current?.style.setProperty("--rail-header", `${header}px`);
      tops = targets.map(target => target!.getBoundingClientRect().top + scrollY);
      maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      schedule();
    };
    navigate.current = (event, index) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      measure();
      const target = document.getElementById(links[index].id)!;
      if (!target.hasAttribute("tabindex")) { target.setAttribute("tabindex", "-1"); temporaryFocus.add(target); }
      target.focus({ preventScroll: true });
      history.pushState(null, "", `#${links[index].id}`);
      window.scrollTo({ top: Math.max(0, tops[index] - header - 40), behavior: reduced.matches ? "auto" : "smooth" });
    };
    const resize = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    resize?.observe(document.body);
    const splash = new MutationObserver(schedule);
    splash.observe(document.documentElement, { attributes: true, attributeFilter: ["data-brand-intro"] });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pageshow", measure);
    desktop.addEventListener("change", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame); resize?.disconnect(); splash.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", measure);
      window.removeEventListener("pageshow", measure); desktop.removeEventListener("change", measure);
      temporaryFocus.forEach(target => target.removeAttribute("tabindex"));
      navigate.current = () => {};
    };
  }, [links]);

  return <nav ref={railRef} className="section-rail" style={{ "--rail-count": links.length } as CSSProperties} aria-label={variant === "home" ? "プログラムの閲覧位置" : "第1期生募集の閲覧位置"} hidden={!position.visible}>
    <ol style={{ "--rail-index": position.active } as CSSProperties}>
      {links.map((link, index) => <li key={link.id}>
        <a href={`#${link.id}`} aria-label={`${link.label}へ移動`} aria-current={position.active === index ? "location" : undefined}
          onClick={event => navigate.current(event, index)}>
          <span className="section-rail-dot" aria-hidden="true" />
          <span className="section-rail-name" hidden={position.active !== index} aria-hidden="true">{link.label}</span>
        </a>
      </li>)}
      <li className="section-rail-diamond" aria-hidden="true" />
    </ol>
    <span className="section-rail-progress" role="progressbar" aria-label="ページの進行率" aria-valuemin={0} aria-valuemax={100} aria-valuenow={position.progress}>{position.progress}<small>%</small></span>
  </nav>;
}
