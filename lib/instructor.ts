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

export const instructorProfile: InstructorProfile = {
  displayName: "永友先生",
  formalName: "",
  background: ["2017年 ながとも整骨院開院"],
  role: "自然形体療法 理事",
  // Channel-wide views and the formal award name/year await confirmation.
  achievements: [],
  qualifications: ["柔道整復師（2012年取得）"],
  practiceExperience: "15年",
  teachingExperience: "",
  message: "",
};
