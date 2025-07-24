import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";

interface CareerFormProps {
  onSubmit: (resume: string, careerPath: string) => void;
  isLoading: boolean;
}

const careerPaths = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "UX/UI Designer",
  "Product Manager",
  "Cybersecurity Specialist",
  "Mobile Developer",
  "Cloud Engineer"
];

export default function CareerForm({ onSubmit, isLoading }: CareerFormProps) {
  const [resume, setResume] = useState("");
  const [careerPath, setCareerPath] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resume.trim() && careerPath) {
      onSubmit(resume.trim(), careerPath);
    }
  };

  const isValidForm = resume.trim() && careerPath;

  return (
    <Card className="p-8 shadow-card border-0 bg-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resume" className="text-base font-medium text-foreground">
            Your Current Resume
          </Label>
          <Textarea
            id="resume"
            placeholder="Paste your current resume here... Include your work experience, education, skills, and any relevant information."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="min-h-48 resize-none text-sm"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="career" className="text-base font-medium text-foreground">
            Target Career Path
          </Label>
          <Select value={careerPath} onValueChange={setCareerPath} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select your desired career path" />
            </SelectTrigger>
            <SelectContent>
              {careerPaths.map((path) => (
                <SelectItem key={path} value={path}>
                  {path}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={!isValidForm || isLoading}
          variant="hero"
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Your Career Report...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate My AI Career Report
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}