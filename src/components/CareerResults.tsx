import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, BookOpen, Target, TrendingUp, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CareerAnalysis {
  roles: string[];
  skillGaps: string[];
  courses: string[];
  rewrittenResume: string;
}

interface CareerResultsProps {
  analysis: CareerAnalysis;
  careerPath: string;
}

export default function CareerResults({ analysis, careerPath }: CareerResultsProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: `${type} has been copied to your clipboard.`,
    });
  };

  const downloadResults = () => {
    const content = `AI Career Report for ${careerPath}

RECOMMENDED ROLES:
${analysis.roles.map((role, i) => `${i + 1}. ${role}`).join('\n')}

SKILL GAPS TO FILL:
${analysis.skillGaps.map((skill, i) => `${i + 1}. ${skill}`).join('\n')}

RECOMMENDED COURSES:
${analysis.courses.map((course, i) => `${i + 1}. ${course}`).join('\n')}

REWRITTEN RESUME:
${analysis.rewrittenResume}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-report-${careerPath.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started!",
      description: "Your career report is being downloaded.",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          <Target className="mr-2 h-4 w-4" />
          {careerPath}
        </Badge>
        <h2 className="text-3xl font-bold text-foreground mb-2">Your AI Career Report</h2>
        <p className="text-muted-foreground">Personalized guidance for your tech career transition</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommended Roles */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center mb-4">
            <TrendingUp className="mr-3 h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Recommended Tech Roles</h3>
          </div>
          <div className="space-y-3">
            {analysis.roles.map((role, index) => (
              <div key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-foreground">{role}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill Gaps */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center mb-4">
            <Target className="mr-3 h-5 w-5 text-warning" />
            <h3 className="text-xl font-semibold text-foreground">Key Skill Gaps</h3>
          </div>
          <div className="space-y-3">
            {analysis.skillGaps.map((skill, index) => (
              <div key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-warning text-warning-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-foreground">{skill}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommended Courses */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center mb-4">
          <BookOpen className="mr-3 h-5 w-5 text-success" />
          <h3 className="text-xl font-semibold text-foreground">Recommended Online Courses</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {analysis.courses.map((course, index) => (
            <div key={index} className="p-4 border border-border rounded-lg bg-muted/30">
              <div className="flex items-center mb-2">
                <span className="flex-shrink-0 w-6 h-6 bg-success text-success-foreground rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <h4 className="font-medium text-foreground">Course Recommendation</h4>
              </div>
              <p className="text-sm text-muted-foreground">{course}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Rewritten Resume */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FileText className="mr-3 h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Rewritten Resume</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(analysis.rewrittenResume, "Resume")}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Resume
          </Button>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
            {analysis.rewrittenResume}
          </pre>
        </div>
      </Card>

      {/* Download Options */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={downloadResults}
          variant="hero"
          size="lg"
          className="shadow-elegant"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Full Report
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => copyToClipboard(
            `Recommended Roles: ${analysis.roles.join(', ')}\nSkill Gaps: ${analysis.skillGaps.join(', ')}\nCourses: ${analysis.courses.join(', ')}`,
            "Summary"
          )}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Summary
        </Button>
      </div>
    </div>
  );
}