import { useResume } from '@/contexts/ResumeContext';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const ResumePreview = () => {
  const { resumeData } = useResume();
  const { personalInfo, experience, education, skills, template } = resumeData;

  const hasContent = personalInfo.fullName || experience.length > 0 || education.length > 0 || skills.length > 0;

  if (!hasContent) {
    return (
      <div className="resume-paper p-8 flex items-center justify-center">
        <p className="text-muted-foreground text-sm text-center">Start filling in your details to see the live preview</p>
      </div>
    );
  }

  const templateStyles = {
    professional: {
      header: 'text-center border-b-2 border-foreground/20 pb-4 mb-4',
      name: 'text-2xl font-bold text-foreground tracking-wide',
      section: 'mb-3',
      sectionTitle: 'text-xs font-bold uppercase tracking-widest text-foreground border-b border-foreground/15 pb-1 mb-2',
      accent: 'text-foreground',
    },
    modern: {
      header: 'bg-primary/10 -mx-6 -mt-6 px-6 pt-6 pb-4 mb-4 rounded-t-sm',
      name: 'text-2xl font-bold text-primary',
      section: 'mb-3',
      sectionTitle: 'text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-primary/30 pb-1 mb-2',
      accent: 'text-primary',
    },
    minimal: {
      header: 'mb-4',
      name: 'text-2xl font-light text-foreground',
      section: 'mb-3',
      sectionTitle: 'text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2',
      accent: 'text-foreground',
    },
  };

  const s = templateStyles[template];

  return (
    <div id="resume-preview" className="resume-paper p-6 text-[10px] leading-relaxed text-foreground overflow-y-auto">
      {/* Header */}
      <div className={s.header}>
        <h1 className={s.name}>{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-muted-foreground">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="h-2.5 w-2.5" />{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="flex items-center gap-1"><Globe className="h-2.5 w-2.5" />{personalInfo.website}</span>}
        </div>
      </div>

      {/* Career Objective */}
      {personalInfo.careerObjective && (
        <div className={s.section}>
          <h2 className={s.sectionTitle}>Career Objective</h2>
          <p className="text-foreground/80">{personalInfo.careerObjective}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className={s.section}>
          <h2 className={s.sectionTitle}>Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`font-semibold ${s.accent}`}>{exp.position || 'Position'}</span>
                  {exp.company && <span className="text-muted-foreground"> — {exp.company}</span>}
                </div>
                <span className="text-muted-foreground text-[9px] shrink-0 ml-2">
                  {exp.startDate}{exp.startDate && (exp.endDate || exp.current) && ' – '}{exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && <p className="text-foreground/70 mt-0.5 whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className={s.section}>
          <h2 className={s.sectionTitle}>Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`font-semibold ${s.accent}`}>{edu.degree}{edu.field && ` in ${edu.field}`}</span>
                  {edu.institution && <span className="text-muted-foreground"> — {edu.institution}</span>}
                </div>
                <span className="text-muted-foreground text-[9px] shrink-0 ml-2">
                  {edu.startDate}{edu.startDate && edu.endDate && ' – '}{edu.endDate}
                </span>
              </div>
              {edu.gpa && <p className="text-muted-foreground">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className={s.section}>
          <h2 className={s.sectionTitle}>Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map(skill => (
              <span
                key={skill}
                className={`px-2 py-0.5 rounded text-[9px] font-medium ${
                  template === 'modern'
                    ? 'bg-primary/10 text-primary'
                    : template === 'minimal'
                    ? 'border border-border text-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
