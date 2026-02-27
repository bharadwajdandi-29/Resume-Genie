import { Link } from 'react-router-dom';
import { Wand2, Search, Sparkles, BarChart3, Target, BookOpen, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import heroBg from '@/assets/hero-bg.jpg';

const features = [
  { icon: BarChart3, title: 'Live ATS Score', desc: 'Real-time ATS compatibility scoring as you build your resume' },
  { icon: Target, title: 'JD Suggestions', desc: 'Get tailored suggestions based on job descriptions' },
  { icon: Wand2, title: 'Multiple Templates', desc: 'Choose from professional, modern, and minimal templates' },
  { icon: Sparkles, title: 'AI Career Objective', desc: 'Generate compelling career objectives with AI' },
  { icon: Search, title: 'Skill Gap Analysis', desc: 'Identify missing skills for your target roles' },
  { icon: Download, title: 'PDF & DOCX Export', desc: 'Download your resume in PDF or DOCX format' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" />
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
          <div className="flex justify-center mb-4">
            <Wand2 className="h-12 w-12 text-accent animate-fade-in-up" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 tracking-tight animate-fade-in-up">
            Resume Genie
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            AI-powered resume builder and analyzer with live ATS scoring, skill gap analysis, and interview preparation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/builder">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-8 shadow-lg">
                <Wand2 className="h-4 w-4" />Start Building <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/analyzer">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 px-8">
                <Search className="h-4 w-4" />Analyze Resume
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3">Everything You Need</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Powerful tools to build, optimize, and perfect your resume for any job application.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="p-6 rounded-xl border border-border bg-card shadow-card hover:shadow-elevated transition-shadow duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="bg-gradient-hero rounded-2xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">Ready to Stand Out?</h2>
          <p className="text-primary-foreground/70 mb-6 max-w-md mx-auto">Create a professional resume in minutes and land your dream job.</p>
          <Link to="/builder">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-8">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
