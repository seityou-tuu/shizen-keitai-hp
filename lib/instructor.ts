// Publish only operator-approved facts. Empty fields are not shown on the site.
export type InstructorProfile = {
  displayName: string;
  formalName: string;
  background: readonly string[];
  qualifications: readonly string[];
  practiceExperience: string;
  teachingExperience: string;
  message: string;
};

export const instructorProfile: InstructorProfile = {
  displayName: "永友先生",
  formalName: "",
  background: [],
  qualifications: [],
  practiceExperience: "",
  teachingExperience: "",
  message: "",
};
