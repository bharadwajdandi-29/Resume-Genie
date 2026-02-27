import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, User, Briefcase, GraduationCap, Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

const ResumeForm = () => {
  const {
    resumeData, updatePersonalInfo,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    setSkills,
  } = useResume();
  const [skillInput, setSkillInput] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [generatingObjective, setGeneratingObjective] = useState(false);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !resumeData.skills.includes(trimmed)) {
      setSkills([...resumeData.skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(resumeData.skills.filter(s => s !== skill));
  };

  const generateObjective = async () => {
  try {
    setGeneratingObjective(true);

    const response = await fetch("http://localhost:5000/generate-objective", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skills: resumeData.skills.join(", "),
        role: targetRole,
      }),
    });

    const data = await response.json();

    if (data.result) {
      updatePersonalInfo("careerObjective", data.result);
      toast.success("Career objective generated successfully!");
    } else {
      toast.error("AI generation failed");
    }

  } catch (error) {
    console.error("AI generation failed:", error);
    toast.error("Something went wrong");
  } finally {
    setGeneratingObjective(false);
  }
};

  return (
    <div className="h-full overflow-y-auto">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full grid grid-cols-5 mb-4">
          <TabsTrigger value="personal" className="text-xs gap-1"><User className="h-3 w-3" />Personal</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs gap-1"><Briefcase className="h-3 w-3" />Work</TabsTrigger>
          <TabsTrigger value="education" className="text-xs gap-1"><GraduationCap className="h-3 w-3" />Education</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs gap-1"><Lightbulb className="h-3 w-3" />Skills</TabsTrigger>
          <TabsTrigger value="objective" className="text-xs gap-1"><Sparkles className="h-3 w-3" />Objective</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Full Name</Label><Input placeholder="John Doe" value={resumeData.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} /></div>
            <div><Label className="text-xs">Email</Label><Input placeholder="john@email.com" value={resumeData.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} /></div>
            <div><Label className="text-xs">Phone</Label><Input placeholder="+1 234 567 8900" value={resumeData.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} /></div>
            <div><Label className="text-xs">Location</Label><Input placeholder="New York, NY" value={resumeData.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} /></div>
            <div><Label className="text-xs">LinkedIn</Label><Input placeholder="linkedin.com/in/johndoe" value={resumeData.personalInfo.linkedin} onChange={e => updatePersonalInfo('linkedin', e.target.value)} /></div>
            <div><Label className="text-xs">Website</Label><Input placeholder="johndoe.com" value={resumeData.personalInfo.website} onChange={e => updatePersonalInfo('website', e.target.value)} /></div>
          </div>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          {resumeData.experience.map((exp, i) => (
            <div key={exp.id} className="p-3 rounded-lg border border-border bg-muted/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Experience {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Company</Label><Input placeholder="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} /></div>
                <div><Label className="text-xs">Position</Label><Input placeholder="Position" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} /></div>
                <div><Label className="text-xs">Start Date</Label><Input placeholder="Jan 2022" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} /></div>
                <div><Label className="text-xs">End Date</Label><Input placeholder="Present" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} /></div>
              </div>
              <div><Label className="text-xs">Description</Label><Textarea placeholder="Describe your responsibilities and achievements..." value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} rows={3} /></div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addExperience} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Experience</Button>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          {resumeData.education.map((edu, i) => (
            <div key={edu.id} className="p-3 rounded-lg border border-border bg-muted/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Education {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Institution</Label><Input placeholder="University" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} /></div>
                <div><Label className="text-xs">Degree</Label><Input placeholder="Bachelor's" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} /></div>
                <div><Label className="text-xs">Field</Label><Input placeholder="Computer Science" value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} /></div>
                <div><Label className="text-xs">GPA</Label><Input placeholder="3.8" value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} /></div>
                <div><Label className="text-xs">Start Date</Label><Input placeholder="Sep 2018" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} /></div>
                <div><Label className="text-xs">End Date</Label><Input placeholder="Jun 2022" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} /></div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addEducation} className="w-full"><Plus className="h-3.5 w-3.5 mr-1" />Add Education</Button>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button variant="outline" size="sm" onClick={addSkill}><Plus className="h-3.5 w-3.5" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => removeSkill(skill)}
              >
                {skill} <span className="text-primary/50">×</span>
              </span>
            ))}
          </div>
          {resumeData.skills.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">Add skills to improve your ATS score</p>
          )}
        </TabsContent>

        <TabsContent value="objective" className="space-y-3">
          <div>
            <Label className="text-xs">Target Role (for AI generation)</Label>
            <Input
              placeholder="e.g. Senior Frontend Developer"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Career Objective</Label>
            <Textarea
              placeholder="Write a compelling career objective that highlights your goals, skills, and what you bring to the role..."
              value={resumeData.personalInfo.careerObjective}
              onChange={e => updatePersonalInfo('careerObjective', e.target.value)}
              rows={6}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1"
            onClick={generateObjective}
            disabled={generatingObjective}
          >
            {generatingObjective ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {generatingObjective ? 'Generating...' : 'Generate with AI'}
          </Button>
          <p className="text-xs text-muted-foreground">
            AI will generate a tailored career objective based on your experience, skills, education, and target role.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeForm;
