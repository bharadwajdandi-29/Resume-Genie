import Navbar from '@/components/layout/Navbar';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import ATSScore from '@/components/resume/ATSScore';
import TemplateSelector from '@/components/resume/TemplateSelector';
import ResumeDownload from '@/components/resume/ResumeDownload';
import { useResume } from '@/contexts/ResumeContext';

const Builder = () => {
  const { atsScore } = useResume();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Toolbar */}
      <div className="border-b border-border bg-card px-4 py-2 flex items-center justify-between">
        <TemplateSelector />
        <div className="flex items-center gap-4">
          <ResumeDownload />
          <ATSScore score={atsScore} size={48} label="ATS" />
        </div>
      </div>

      {/* Split Panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Form */}
        <div className="lg:w-1/2 p-4 overflow-y-auto border-r border-border">
          <ResumeForm />
        </div>

        {/* Preview */}
        <div className="lg:w-1/2 p-4 bg-muted/50 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[600px]">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
