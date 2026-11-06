// Publish only operator-approved facts. Empty fields are not shown on the site.
export type InstructorProfile = {
  displayName: string;
  formalName: string;
  background: readonly string[];
  qualifications: readonly string[];
  role?: string;
  achievements?: readonly string[];
  practiceExperience: string;
  teachingExperience: string;
  message: string;
};

// Reconfirmed by the organizer on 2026-11-06; no current/live count is implied.
export const historicalYouTubeRecord = {
  label: "YouTube総再生回数",
  total: "220万回",
  note: "過去に確認された値です。最新の再生数ではありません。",
} as const;

export const instructorProfile: InstructorProfile = {
  displayName: "永友先生",
  formalName: "永友裕也",
  background: ["2017年 ながとも整骨院開院"],
  role: "自然形体療法 理事",
  // The formal award name/year still await reliable confirmation.
  achievements: [`${historicalYouTubeRecord.label}${historicalYouTubeRecord.total}（${historicalYouTubeRecord.note}）`],
  qualifications: ["柔道整復師（2012年取得）"],
  practiceExperience: "15年",
  teachingExperience: "",
  message: "",
};
