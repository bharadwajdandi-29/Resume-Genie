import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, File } from 'lucide-react';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';

const ResumeDownload = () => {
  const { resumeData } = useResume();
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadPDF = async () => {
    setDownloading('pdf');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const el = document.getElementById('resume-preview');
      if (!el) { toast.error('Resume preview not found'); return; }

      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`${resumeData.personalInfo.fullName || 'Resume'}.pdf`);
      toast.success('PDF downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(null);
    }
  };

  const downloadDOCX = async () => {
    setDownloading('docx');
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
      const { saveAs } = await import('file-saver');
      const p = resumeData.personalInfo;

      const children: any[] = [];

      // Name
      children.push(new Paragraph({
        children: [new TextRun({ text: p.fullName || 'Your Name', bold: true, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }));

      // Contact
      const contact = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join(' | ');
      if (contact) {
        children.push(new Paragraph({
          children: [new TextRun({ text: contact, size: 18, color: '666666' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }));
      }

      // Career Objective
      if (p.careerObjective) {
        children.push(new Paragraph({ text: 'CAREER OBJECTIVE', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: p.careerObjective, size: 22 })], spacing: { after: 200 } }));
      }

      // Experience
      if (resumeData.experience.length > 0) {
        children.push(new Paragraph({ text: 'EXPERIENCE', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
        resumeData.experience.forEach(exp => {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: exp.position || 'Position', bold: true, size: 22 }),
              new TextRun({ text: exp.company ? ` — ${exp.company}` : '', size: 22, color: '666666' }),
            ],
            spacing: { before: 100 },
          }));
          const dates = [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ');
          if (dates) children.push(new Paragraph({ children: [new TextRun({ text: dates, size: 18, italics: true, color: '999999' })] }));
          if (exp.description) children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: 22 })], spacing: { after: 100 } }));
        });
      }

      // Education
      if (resumeData.education.length > 0) {
        children.push(new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
        resumeData.education.forEach(edu => {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, bold: true, size: 22 }),
              new TextRun({ text: edu.institution ? ` — ${edu.institution}` : '', size: 22, color: '666666' }),
            ],
            spacing: { before: 100 },
          }));
          const dates = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
          if (dates) children.push(new Paragraph({ children: [new TextRun({ text: dates, size: 18, italics: true, color: '999999' })] }));
          if (edu.gpa) children.push(new Paragraph({ children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 20 })] }));
        });
      }

      // Skills
      if (resumeData.skills.length > 0) {
        children.push(new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: resumeData.skills.join(', '), size: 22 })], spacing: { after: 200 } }));
      }

      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${p.fullName || 'Resume'}.docx`);
      toast.success('DOCX downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download DOCX');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={downloadPDF} disabled={!!downloading} className="gap-1.5">
        {downloading === 'pdf' ? <span className="animate-spin h-3 w-3 border-2 border-foreground/30 border-t-foreground rounded-full" /> : <FileText className="h-3.5 w-3.5" />}
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={downloadDOCX} disabled={!!downloading} className="gap-1.5">
        {downloading === 'docx' ? <span className="animate-spin h-3 w-3 border-2 border-foreground/30 border-t-foreground rounded-full" /> : <File className="h-3.5 w-3.5" />}
        DOCX
      </Button>
    </div>
  );
};

export default ResumeDownload;
