// Change only confirmed facts. Draft values are never returned to the public UI.
export const FIRST_COHORT_PATH = "/recruitment/first";
export type RecruitmentFacts = {
  startDate: string | null;
  trainingTime: string | null;
  recruitmentStartDate: string | null;
  deadline: string | null;
  capacity: number | null;
  venue: string | null;
};
export type RecruitmentConfig = {
  status: "preparing" | "open" | "closed";
  publicationApproved: boolean;
  confirmed: RecruitmentFacts;
  draft: RecruitmentFacts;
};
const unconfirmed: RecruitmentFacts = {
  startDate: null,
  trainingTime: null,
  recruitmentStartDate: null,
  deadline: null,
  capacity: null,
  venue: null,
};
export const firstCohortConfig: RecruitmentConfig = {
  status: "preparing",
  publicationApproved: false,
  confirmed: { ...unconfirmed },
  draft: { ...unconfirmed },
};

function validDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? value : null;
}
export function getFirstCohort(config = firstCohortConfig, now = new Date()) {
  const confirmed: RecruitmentFacts = {
    startDate: validDate(config.confirmed.startDate),
    recruitmentStartDate: validDate(config.confirmed.recruitmentStartDate),
    deadline: validDate(config.confirmed.deadline),
    trainingTime: config.confirmed.trainingTime?.trim() || null,
    venue: config.confirmed.venue?.trim() || null,
    capacity: Number.isInteger(config.confirmed.capacity) && (config.confirmed.capacity ?? 0) > 0
      ? config.confirmed.capacity : null,
  };
  const today = now.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  const mayOpen = config.publicationApproved && confirmed.recruitmentStartDate &&
    confirmed.recruitmentStartDate <= today && (!confirmed.deadline || confirmed.deadline >= today);
  const expired = config.publicationApproved && config.status === "open" && confirmed.deadline && confirmed.deadline < today;
  const status = expired ? "closed" : config.status === "open" && mayOpen ? "open"
    : config.status === "closed" && config.publicationApproved ? "closed" : "preparing";
  return {
    status,
    statusLabel: status === "open" ? "募集受付中" : status === "closed" ? "募集終了" : "募集準備中",
    summary: status === "open"
      ? "第1期生の募集情報をご確認ください。受講相談はお電話で承ります。"
      : status === "closed"
        ? "第1期生の募集は終了しました。今後のご案内については、お電話でご相談ください。"
        : "開催日程・募集条件は、確認が取れた内容からご案内します。",
    confirmed,
  };
}
export function formatRecruitmentDate(value: string | null) {
  if (!value) return "確定後にご案内します";
  const [year, month, day] = value.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}
