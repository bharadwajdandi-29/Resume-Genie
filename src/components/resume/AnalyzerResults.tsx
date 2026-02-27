import { AnalysisResult } from '@/types/resume';
import ATSScore from './ATSScore';
import { AlertTriangle, CheckCircle, HelpCircle, TrendingUp } from 'lucide-react';

interface AnalyzerResultsProps {
  result: AnalysisResult;
}

const AnalyzerResults = ({ result }: AnalyzerResultsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
      {/* ATS Score */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-card flex flex-col items-center gap-4">
        <h3 className="text-sm font-semibold text-foreground">ATS Compatibility</h3>
        <ATSScore score={result.atsScore} size={140} />
        <p className="text-xs text-muted-foreground text-center">
          {result.atsScore >= 70 ? 'Great! Your resume is well-optimized.' :
           result.atsScore >= 40 ? 'Good start, but there\'s room for improvement.' :
           'Your resume needs significant improvements.'}
        </p>
      </div>

      {/* Strengths */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-card">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <CheckCircle className="h-4 w-4 text-score-high" />Strengths
        </h3>
        <ul className="space-y-1.5">
          {result.strengths.map((s, i) => (
            <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
              <span className="text-score-high mt-0.5">•</span>{s}
            </li>
          ))}
        </ul>
      </div>

      {/* Skill Gaps */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-card">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-score-medium" />Skill Gaps
        </h3>
        <ul className="space-y-1.5">
          {result.skillGaps.map((s, i) => (
            <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
              <span className="text-score-medium mt-0.5">•</span>{s}
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-card">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />Suggestions
        </h3>
        <ul className="space-y-1.5">
          {result.suggestions.map((s, i) => (
            <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>{s}
            </li>
          ))}
        </ul>
      </div>

      {/* Interview Prep */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-card md:col-span-2">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <HelpCircle className="h-4 w-4 text-accent" />Interview Preparation Questions
        </h3>
        <ol className="space-y-2">
          {result.interviewQuestions.map((q, i) => (
            <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
              <span className="font-semibold text-accent shrink-0">{i + 1}.</span>{q}
            </li>
          ))}
        </ol>
      </div>

      {/* Quick Stats */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-card md:col-span-2">
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Action Verbs</p>
            <p className="text-lg font-bold text-foreground">{result.actionVerbs.found}<span className="text-xs font-normal text-muted-foreground">/{result.actionVerbs.recommended} recommended</span></p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Quantified Achievements</p>
            <p className="text-lg font-bold text-foreground">{result.quantifiedAchievements.found}<span className="text-xs font-normal text-muted-foreground">/{result.quantifiedAchievements.recommended} recommended</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzerResults;
