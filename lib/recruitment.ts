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
// Only the dated information received from the organizer; no venue address or time inferred.
export const firstCohortDetails = {
  deadline: "2027-01-10",
  eligible: "施術経験者・未経験者のどちらも受講可能",
  application: { status: "preparing", url: null },
  venues: [
    { id: "tokyo", name: "東京", capacity: 6, address: null, startTime: null, endTime: null,
      dates: ["2027-01-15", "2027-02-08", "2027-03-08", "2027-04-20", "2027-05-18", "2027-06-22"] },
    { id: "osaka", name: "大阪", capacity: 6, address: null, startTime: null, endTime: null,
      dates: ["2027-01-12", "2027-02-10", "2027-03-10", "2027-04-22", "2027-05-20", "2027-06-24"] },
    { id: "fukuoka", name: "福岡", capacity: 6, address: null, startTime: null, endTime: null,
      dates: ["2027-01-18", "2027-02-12", "2027-03-12", "2027-04-23", "2027-05-21", "2027-06-25"] },
  ],
} as const;

export function getFirstCohortSummary() {
  const dates = firstCohortDetails.venues.flatMap(venue => [...venue.dates]).sort();
  const [startYear, startMonth] = dates[0].split("-").map(Number);
  const [endYear, endMonth] = dates[dates.length - 1].split("-").map(Number);
  const sameCapacity = firstCohortDetails.venues.every(venue => venue.capacity === firstCohortDetails.venues[0].capacity);
  return {
    startYear, startMonth,
    period: `${startYear}年${startMonth}月〜${endYear === startYear ? "" : `${endYear}年`}${endMonth}月`,
    locations: firstCohortDetails.venues.map(venue => venue.name).join("・"),
    venueCount: firstCohortDetails.venues.length,
    capacityLabel: sameCapacity ? `各会場${firstCohortDetails.venues[0].capacity}名` : firstCohortDetails.venues.map(venue => `${venue.name}${venue.capacity}名`).join("・"),
    totalCapacity: firstCohortDetails.venues.reduce((total, venue) => total + venue.capacity, 0),
  };
}

export const firstCohortConfig: RecruitmentConfig = {
  status: "preparing",
  publicationApproved: false,
  confirmed: {
    ...unconfirmed,
    startDate: firstCohortDetails.venues.flatMap(venue => [...venue.dates]).sort()[0],
    deadline: firstCohortDetails.deadline,
    capacity: firstCohortDetails.venues.reduce((total, venue) => total + venue.capacity, 0),
    venue: firstCohortDetails.venues.map(venue => venue.name).join("・"),
  },
  draft: { ...unconfirmed },
};

export function isFirstCohortPreview(env = process.env) {
  return env.VERCEL_ENV === "preview" || (!env.VERCEL_ENV && env.NODE_ENV === "development");
}

export function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric", weekday: "short", timeZone: "Asia/Tokyo" })
    .format(new Date(`${value}T12:00:00+09:00`));
}

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
