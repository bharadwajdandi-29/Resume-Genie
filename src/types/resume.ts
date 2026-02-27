export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  careerObjective: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export type TemplateType = 'professional' | 'modern' | 'minimal';

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  template: TemplateType;
}

export interface AnalysisResult {
  atsScore: number;
  skillGaps: string[];
  suggestions: string[];
  interviewQuestions: string[];
  strengths: string[];
  actionVerbs: { found: number; recommended: number };
  quantifiedAchievements: { found: number; recommended: number };
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    careerObjective: '',
  },
  experience: [],
  education: [],
  skills: [],
  template: 'professional',
};
