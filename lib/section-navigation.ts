export type SectionLink = { id: string; label: string; selector?: string };

export const homeSections: SectionLink[] = [
  { id: "main", label: "はじめに", selector: ".renewal-hero" },
  { id: "about", label: "療法とは" }, { id: "features", label: "4つの視点" },
  { id: "audience", label: "対象の方" }, { id: "support", label: "学習支援" },
  { id: "training", label: "研修内容" }, { id: "roadmap", label: "取得の道" },
  { id: "instructors", label: "講師紹介" }, { id: "future", label: "成長の先" },
  { id: "courses", label: "受講料金" }, { id: "faq", label: "よくある質問" },
  { id: "contact", label: "受講相談" },
];
export const cohortSections: SectionLink[] = [
  { id: "recruitment-main", label: "募集案内", selector: ".recruitment-hero" },
  { id: "cohort-next-step-title", label: "次の一歩", selector: ".cohort-next-step" },
  { id: "cohort-learning", label: "学び方" }, { id: "cohort-instructor", label: "講師紹介" },
  { id: "cohort-overview", label: "募集概要", selector: ".cohort-overview" },
  { id: "cohort-schedule", label: "日程会場" }, { id: "cohort-tuition", label: "受講料金" },
  { id: "cohort-flow", label: "受講前に" }, { id: "cohort-faq", label: "よくある質問" },
  { id: "cohort-contact", label: "受講相談" },
];

/** A small dead band prevents oscillation around section boundaries. */
export function sectionAtPosition(tops: number[], position: number, previous: number, atEnd = false) {
  if (!tops.length) return 0;
  if (atEnd) return tops.length - 1;
  let next = 0;
  tops.forEach((top, index) => { if (position >= top) next = index; });
  const current = Math.min(previous, tops.length - 1);
  if (next > current && position < tops[next] + 12) return current;
  if (next < current && position > tops[current] - 12) return current;
  return next;
}
export function pageProgress(scroll: number, maximum: number) {
  return maximum > 0 ? Math.round(Math.max(0, Math.min(1, scroll / maximum)) * 100) : 0;
}
