import { useResume } from '@/contexts/ResumeContext';
import { TemplateType } from '@/types/resume';
import { LayoutTemplate } from 'lucide-react';

const templates: { id: TemplateType; name: string; desc: string }[] = [
  { id: 'professional', name: 'Professional', desc: 'Classic & clean' },
  { id: 'modern', name: 'Modern', desc: 'Bold accents' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple & elegant' },
];

const TemplateSelector = () => {
  const { resumeData, setTemplate } = useResume();

  return (
    <div className="flex items-center gap-2">
      <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
      <div className="flex gap-1">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              resumeData.template === t.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            title={t.desc}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
