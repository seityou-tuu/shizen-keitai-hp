"use client";
import { useEffect, useRef } from "react";
import "./growth-journey.css";
const stages = [
  ["NOTICE", "身体の反応を観察する", "施術前後の動きや反応を見つめ、身体を捉える視点を養う。"],
  ["TOUCH", "触れ方を磨く", "力加減や手の位置を考え、身体に負担をかけにくい触れ方を学ぶ。"],
  ["UNDERSTAND", "理論と実技を結びつける", "なぜその技術を使うのか。実践と理論を照らし合わせて理解を深める。"],
  ["PRACTICE", "学びを自分のものにする", "復習動画や質問の機会を活かし、繰り返し学ぶ習慣を育てる。"],
  ["GROW", "仲間とともに視野を広げる", "同じ技術を学ぶ仲間との交流から、新しい気づきと視点を得る。"],
];
const drawings = [
  <g key="notice"><circle cx="48" cy="18" r="8"/><path d="M35 68V43c0-15 26-15 26 0v25M35 49l-9 12m35-12 9 12M45 68v12m10-12v12"/><path className="gold" d="M77 24q14 8 0 16q-14-8 0-16Z"/><circle cx="77" cy="32" r="2"/></g>,
  <g key="touch"><path d="M23 76 14 56q-3-8 3-9q4-1 11 10V24q0-9 7-7v31-33q0-9 7-7v40-31q0-9 7-7v39-23q0-9 7-7v34q0 14-10 23"/><path className="gold" d="M66 49q16-8 23 2M68 60q12-5 21 0M70 71h18"/></g>,
  <g key="understand"><circle cx="50" cy="48" r="18"/><circle cx="20" cy="20" r="8"/><circle cx="81" cy="22" r="8"/><circle cx="77" cy="78" r="8"/><path d="m26 26 12 11m26-2 11-8m-12 34 9 11"/><path className="gold" d="M44 48h12m-6-6v12M16 48a34 34 0 0 0 34 34"/></g>,
  <g key="practice"><path d="M50 28q-18-12-34-5v48q18-6 34 6q16-12 34-6V23q-16-7-34 5v49M24 36q9-2 18 3m-18 9q9-2 18 3m16-12q9-5 18-3m-18 15q9-5 18-3"/><path className="gold" d="M21 82q17-1 29 6q12-7 29-6"/></g>,
  <g key="grow"><circle cx="50" cy="23" r="9"/><circle cx="19" cy="48" r="7"/><circle cx="81" cy="48" r="7"/><path d="M35 49v-5q0-13 15-13t15 13v5M7 75v-9q0-10 12-10t12 10v9m38 0v-9q0-10 12-10t12 10v9"/><path className="gold" d="M35 69q15 15 30 0M27 19 19 12m54 7 8-7M50 4V0"/></g>,
];
export function GrowthJourney() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const running = new Set<Animation>();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (media.matches || document.documentElement.hasAttribute("data-brand-intro")) return;
      const elements = entry.target.querySelectorAll(".growth-number,.growth-icon,.growth-segment,.growth-finish-line");
      elements.forEach(el => {
        const line = el.classList.contains("growth-segment") || el.classList.contains("growth-finish-line");
        const a = el.animate(line ? [{strokeDashoffset: 1}, {strokeDashoffset: 0}] : [{opacity: .3, transform:"translateY(6px)"}, {opacity:1, transform:"none"}], {duration: 480, easing:"ease-out"});
        running.add(a); a.onfinish = () => { running.delete(a); a.cancel(); };
      });
    }), {threshold: .2});
    root.querySelectorAll(".growth-stage,.growth-finish").forEach(el=>observer.observe(el));
    const stop=()=>{running.forEach(a=>a.cancel());running.clear();};
    media.addEventListener("change",stop);
    return ()=>{observer.disconnect();stop();media.removeEventListener("change",stop);};
  }, []);
  return <section ref={ref} id="future" className="story-section renewal-future growth-journey">
    <div className="renewal-wrap">
      <header className="growth-heading"><p className="growth-label">GROWTH JOURNEY</p><h2>技術を学ぶ。その先の自分へ。</h2><p>観察する力、触れる技術、理論的な理解。5つの視点を重ねながら、施術への向き合い方を深めていく。</p></header>
      <ol className="growth-roadmap">{stages.map(([label,title,text],i)=><li className="growth-stage" key={label} style={{"--stage":i} as React.CSSProperties}>
        <svg className="growth-connector" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path className="growth-segment" pathLength="1" d="M0 100 200 0"/></svg>
        <svg className="growth-vertical" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path className="growth-segment" pathLength="1" d="M1 0v100"/></svg><span className="growth-number"><small>STEP</small> 0{i+1}</span>
        <svg className="growth-icon" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">{drawings[i]}</svg>
        <div className="growth-copy"><p className="growth-label">{label}</p><h3>{title}</h3><p>{text}</p></div>
      </li>)}</ol>
      <div className="growth-finish"><svg viewBox="0 0 200 2" aria-hidden="true" focusable="false"><path className="growth-finish-line" pathLength="1" d="M0 1h200"/></svg><p className="growth-label">BEYOND CERTIFICATION</p><h3>学びを、日々の施術へ。</h3><p>資格取得をゴールにせず、その後の実践につながる土台を育てる。</p></div>
      <p className="growth-note">5つの段階は学びの視点を表現したもので、正式な進級制度・達成保証・5ヶ月の固定カリキュラムを意味するものではありません。</p>
      <p className="growth-note">本プログラムの資格は、国家資格や法的な開業資格の取得を示すものではありません。収入・集客・独立開業の実現を保証するものではありません。取得後のフォロー内容・参加条件・費用等は、確認後にご案内します。</p>
    </div>
  </section>;
}
