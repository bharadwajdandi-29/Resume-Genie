import { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AnalyzerResults from '@/components/resume/AnalyzerResults';
import { AnalysisResult } from '@/types/resume';
import { Search, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

const ACTION_VERBS = ['led', 'managed', 'developed', 'created', 'implemented', 'designed', 'built', 'launched', 'improved', 'increased', 'reduced', 'achieved', 'established', 'coordinated', 'delivered', 'optimized', 'streamlined', 'spearheaded', 'drove', 'mentored'];

function analyzeResume(text: string, jd: string): AnalysisResult {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  const verbsFound = ACTION_VERBS.filter(v => lower.includes(v)).length;
  const numbers = text.match(/\d+%|\$[\d,]+|\d+\+/g) || [];

  const hasContact = /email|phone|@/.test(lower);
  const hasExperience = /experience|work history|employment/.test(lower);
  const hasEducation = /education|university|degree|bachelor|master/.test(lower);
  const hasSkills = /skills|technologies|proficiencies/.test(lower);

  let score = 0;
  if (hasContact) score += 15;
  if (hasExperience) score += 20;
  if (hasEducation) score += 15;
  if (hasSkills) score += 15;
  score += Math.min(15, verbsFound * 3);
  score += Math.min(10, numbers.length * 3);
  if (words.length > 100) score += 5;
  if (words.length > 300) score += 5;

  const jdWords = jd ? jd.toLowerCase().split(/\s+/).filter(w => w.length > 4) : [];
  const jdMatches = jdWords.filter(w => lower.includes(w));
  if (jd && jdWords.length > 0) {
    score = Math.round(score * 0.7 + (jdMatches.length / jdWords.length) * 30);
  }

  score = Math.min(100, Math.max(0, score));

  const strengths: string[] = [];
  if (hasContact) strengths.push('Contact information is present');
  if (hasExperience) strengths.push('Work experience section included');
  if (hasEducation) strengths.push('Education details provided');
  if (verbsFound >= 3) strengths.push(`Uses ${verbsFound} strong action verbs`);
  if (numbers.length >= 2) strengths.push('Includes quantified achievements');
  if (strengths.length === 0) strengths.push('Resume text has been provided');

  const skillGaps: string[] = [];
  if (!hasSkills) skillGaps.push('Missing a dedicated skills section');
  if (verbsFound < 3) skillGaps.push('Not enough action verbs used');
  if (numbers.length < 2) skillGaps.push('Few quantified achievements or metrics');
  if (!hasContact) skillGaps.push('Missing contact information');
  if (jd && jdMatches.length < jdWords.length * 0.3) skillGaps.push('Low keyword match with job description');

  // JD-based missing skills
  if (jd && jdWords.length > 0) {
    const missingKeywords = jdWords.filter(w => !lower.includes(w));
    const uniqueMissing = [...new Set(missingKeywords)].slice(0, 5);
    if (uniqueMissing.length > 0) {
      skillGaps.push(`Missing JD keywords: ${uniqueMissing.join(', ')}`);
    }
  }

  if (skillGaps.length === 0) skillGaps.push('No major gaps detected');

  const suggestions = [
    !hasSkills ? 'Add a dedicated "Skills" section with relevant technologies and tools' : null,
    verbsFound < 5 ? 'Use more action verbs like "led", "implemented", "achieved"' : null,
    numbers.length < 3 ? 'Add more quantified achievements (percentages, dollar amounts)' : null,
    words.length < 150 ? 'Your resume seems short — add more detail to work experiences' : null,
    words.length > 800 ? 'Consider condensing — aim for 1-2 pages' : null,
    !hasContact ? 'Add clear contact information (email, phone number)' : null,
    !hasExperience ? 'Include a work experience section with job titles and responsibilities' : null,
    'Tailor your resume keywords to match the job description',
    'Include a professional summary or career objective at the top',
    'Use bullet points for better readability and ATS parsing',
  ].filter(Boolean) as string[];

  const interviewQuestions = [
    'Tell me about a challenging project and how you handled it.',
    'What are your key strengths relevant to this role?',
    'Describe a time you improved a process or system.',
    'How do you prioritize tasks when managing multiple deadlines?',
    'Where do you see yourself in 5 years?',
    'Tell me about a time you worked in a team and what your role was.',
  ];

  return {
    atsScore: score,
    skillGaps,
    suggestions,
    interviewQuestions,
    strengths,
    actionVerbs: { found: verbsFound, recommended: 8 },
    quantifiedAchievements: { found: numbers.length, recommended: 5 },
  };
}

const Analyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(analyzeResume(resumeText, jobDescription));
      setLoading(false);
    }, 800);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setExtracting(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }

      if (text.trim()) {
        setResumeText(text.trim());
        toast.success(`Extracted text from ${pdf.numPages} page(s)`);
      } else {
        toast.error('Could not extract text from PDF. It may be image-based.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to read PDF file');
    } finally {
      setExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Resume Analyzer</h1>
          <p className="text-muted-foreground">Upload your resume PDF or paste text, optionally add a job description for targeted analysis.</p>
        </div>

        {/* PDF Upload */}
        <div className="flex justify-center mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
          />
          <Button
            variant="outline"
            size="lg"
            className="gap-2 px-8 border-dashed border-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={extracting}
          >
            {extracting ? (
              <span className="animate-spin h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {extracting ? 'Extracting text...' : 'Upload Resume PDF'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label className="text-sm font-medium mb-1 block">Resume Text</Label>
            <Textarea
              placeholder="Paste your resume content here or upload a PDF above..."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-1 block">Job Description (Optional)</Label>
            <Textarea
              placeholder="Paste the job description for targeted analysis..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            onClick={handleAnalyze}
            disabled={!resumeText.trim() || loading}
            size="lg"
            className="gap-2 px-8"
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
        </div>

        {result && <AnalyzerResults result={result} />}
      </div>
    </div>
  );
};

export default Analyzer;
