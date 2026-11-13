"use client";

import { useEffect, useRef, useState } from "react";
import "./premium-atmosphere.css";

type Particle = { x: number; y: number; vx: number; vy: number; radius: number; phase: number; age: number };
type Exclusion = { x: number; y: number; width: number; height: number };

/** Decorative only: never paints over photographs or intercepts their controls. */
export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const control = useRef<(paused: boolean) => void>(() => {});
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = canvas?.parentElement;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !root || !ctx) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0, height = 0, ratio = 1, frame = 0, last = 0, clock = 0;
    let userPaused = false, inView = false, particles: Particle[] = [], photos: Exclusion[] = [];
    let mouse: { x: number; y: number } | undefined;
    let pointerTarget: { x: number; y: number } | undefined;
    let pointerStrength = 0;
    const lowPower = () => innerWidth < 768 || (navigator.hardwareConcurrency || 4) <= 4;
    const splashActive = () => document.documentElement.hasAttribute("data-brand-intro");
    const running = () => "IntersectionObserver" in window && !preference.matches && !userPaused && inView && !document.hidden && !splashActive();
    const spawn = (fresh = false): Particle => {
      let x = 0, y = 0;
      for (let attempt = 0; attempt < 16; attempt++) {
        x = Math.random() * width; y = Math.random() * height;
        if (!photos.some(p => x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height)) break;
      }
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, radius: .65 + Math.random() * 1.1, phase: Math.random() * Math.PI * 2, age: fresh ? 0 : 5 };
    };
    const draw = () => {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, width, height);
      photos.forEach(p => ctx.rect(p.x - 1, p.y - 1, p.width + 2, p.height + 2));
      ctx.clip("evenodd");
      const points = particles.map(p => {
        let x = p.x, y = p.y;
        if (mouse && pointer.matches && !preference.matches && !userPaused && !lowPower()) {
          const dx = x - mouse.x, dy = y - mouse.y, distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < 110) { const force = (1 - distance / 110) * 7 * pointerStrength; x += dx / distance * force; y += dy / distance * force; }
        }
        const edge = Math.max(0, Math.min(1, x / 28, (width - x) / 28, y / 28, (height - y) / 28));
        return { ...p, x, y, alpha: (.3 + Math.sin(clock * .35 + p.phase) * .12) * edge * Math.min(1, p.age / 3) };
      });
      const reach = lowPower() ? 100 : 140;
      points.forEach((p, i) => {
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j], distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance >= reach) continue;
          ctx.strokeStyle = `rgba(219,199,155,${(1 - distance / reach) * Math.min(p.alpha, q.alpha) * .85})`;
          ctx.lineWidth = .65; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
        ctx.fillStyle = `rgba(219,199,155,${p.alpha})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    };
    const tick = (now: number) => {
      frame = 0;
      if (!running()) return;
      const interval = lowPower() ? 50 : 1000 / 30;
      if (!last || now - last >= interval) {
        const elapsed = last ? Math.min((now - last) / 1000, .08) : 0;
        clock += elapsed; last = now;
        pointerStrength += ((pointerTarget ? 1 : 0) - pointerStrength) * .12;
        if (pointerTarget) {
          mouse ??= { ...pointerTarget };
          mouse.x += (pointerTarget.x - mouse.x) * .12;
          mouse.y += (pointerTarget.y - mouse.y) * .12;
        }
        particles = particles.map(p => {
          p.x += p.vx * elapsed; p.y += p.vy * elapsed; p.age += elapsed;
          return p.x < -18 || p.x > width + 18 || p.y < -18 || p.y > height + 18 ? spawn(true) : p;
        });
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      setReduced(preference.matches);
      if (splashActive()) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
      if (!document.hidden && inView) draw();
      if (running()) frame = requestAnimationFrame(tick);
    };
    const measure = () => {
      const box = root.getBoundingClientRect();
      width = box.width; height = box.height;
      ratio = Math.min(devicePixelRatio || 1, lowPower() ? 1.5 : 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      photos = Array.from(root.querySelectorAll<HTMLElement>(".hero-photograph, .cohort-hero-photo")).map(photo => {
        const r = photo.getBoundingClientRect(); return { x: r.left - box.left, y: r.top - box.top, width: r.width, height: r.height };
      });
      const area = Math.max(0, width * height - photos.reduce((sum, p) => sum + p.width * p.height, 0));
      particles = Array.from({ length: Math.min(lowPower() ? 18 : 42, Math.max(8, Math.round(area / 15000))) }, () => spawn());
      inView = box.bottom > 0 && box.top < innerHeight;
      sync();
    };
    const moved = (event: PointerEvent) => {
      if (!running() || !pointer.matches || lowPower()) return;
      const box = root.getBoundingClientRect(); pointerTarget = { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const left = () => { pointerTarget = undefined; };
    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); });
    observer?.observe(root);
    const resize = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    resize?.observe(root);
    root.querySelectorAll(".hero-photograph, .cohort-hero-photo").forEach(photo => resize?.observe(photo));
    const splash = new MutationObserver(sync);
    splash.observe(document.documentElement, { attributes: true, attributeFilter: ["data-brand-intro"] });
    control.current = value => { userPaused = value; sync(); };
    root.addEventListener("pointermove", moved, { passive: true }); root.addEventListener("pointerleave", left);
    window.addEventListener("resize", measure); document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    measure(); setAvailable(true);
    return () => {
      cancelAnimationFrame(frame); observer?.disconnect(); resize?.disconnect(); splash.disconnect();
      root.removeEventListener("pointermove", moved); root.removeEventListener("pointerleave", left);
      window.removeEventListener("resize", measure); document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync); control.current = () => {};
    };
  }, []);
  useEffect(() => { control.current(paused); }, [paused]);

  return <>
    <canvas ref={canvasRef} className="hero-network" aria-hidden="true" />
    <button type="button" className="hero-network-toggle" hidden={!available || reduced} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span> 背景の動きを{paused ? "再開" : "停止"}
    </button>
  </>;
}
