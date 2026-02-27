import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ResumeData, defaultResumeData, TemplateType } from '@/types/resume';

interface ResumeContextType {
  resumeData: ResumeData;
  updatePersonalInfo: (field: string, value: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string | boolean) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  setSkills: (skills: string[]) => void;
  setTemplate: (template: TemplateType) => void;
  atsScore: number;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

function calcATS(data: ResumeData): number {
  let score = 0;
  const p = data.personalInfo;
  if (p.fullName) score += 8;
  if (p.email) score += 7;
  if (p.phone) score += 5;
  if (p.location) score += 5;
  if (p.careerObjective && p.careerObjective.length > 20) score += 10;
  else if (p.careerObjective) score += 5;

  score += Math.min(30, data.experience.length * 10);
  data.experience.forEach(exp => {
    if (exp.description && exp.description.length > 30) score += 2;
  });

  score += Math.min(15, data.education.length * 8);
  score += Math.min(20, data.skills.length * 3);

  return Math.min(100, score);
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : defaultResumeData;
  });

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: crypto.randomUUID(),
        company: '', position: '', startDate: '', endDate: '', current: false, description: '',
      }],
    }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: crypto.randomUUID(),
        institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '',
      }],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const setSkills = (skills: string[]) => {
    setResumeData(prev => ({ ...prev, skills }));
  };

  const setTemplate = (template: TemplateType) => {
    setResumeData(prev => ({ ...prev, template }));
  };

  const atsScore = calcATS(resumeData);

  return (
    <ResumeContext.Provider value={{
      resumeData, updatePersonalInfo, addExperience, updateExperience, removeExperience,
      addEducation, updateEducation, removeEducation, setSkills, setTemplate, atsScore,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
