import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CareerForm from "@/components/CareerForm";
import CareerResults from "@/components/CareerResults";
import { analyzeCareer, type CareerAnalysis } from "@/services/geminiApi";
import { useToast } from "@/hooks/use-toast";
import { Bot, Sparkles, Users, TrendingUp, Key, AlertCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [selectedCareerPath, setSelectedCareerPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value.trim()) {
      localStorage.setItem('gemini-api-key', value);
    } else {
      localStorage.removeItem('gemini-api-key');
    }
  };

  const handleFormSubmit = async (resume: string, careerPath: string) => {
    if (!apiKey.trim()) {
      setIsApiKeyDialogOpen(true);
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeCareer(resume, careerPath, apiKey);
      setAnalysis(result);
      setSelectedCareerPath(careerPath);
      toast({
        title: "Analysis Complete!",
        description: "Your personalized career report has been generated.",
      });
    } catch (error) {
      console.error('Error analyzing career:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating your report. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysis(null);
    setSelectedCareerPath("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-primary-foreground/10 rounded-full mb-6 animate-fade-in">
              <Bot className="mr-2 h-4 w-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground font-medium">AI-Powered Career Guidance</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in">
              AI Career Companion
            </h1>
            
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              Transform your career with personalized AI guidance. Get tailored role recommendations, 
              skill gap analysis, and a rewritten resume for your dream tech job.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-elegant">
                    <Key className="mr-2 h-4 w-4" />
                    Set API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter Your Gemini API Key</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apikey">Gemini API Key</Label>
                      <Input
                        id="apikey"
                        type="password"
                        placeholder="Enter your Gemini API key"
                        value={apiKey}
                        onChange={(e) => handleApiKeyChange(e.target.value)}
                      />
                    </div>
                    <div className="flex items-start space-x-2 p-3 bg-muted rounded-lg">
                      <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>. Your key is stored locally and never sent to our servers.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setIsApiKeyDialogOpen(false)} 
                      disabled={!apiKey.trim()}
                      className="w-full"
                    >
                      Save API Key
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {apiKey && (
                <span className="text-primary-foreground/80 text-sm">
                  ✓ API Key configured
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center shadow-card border-0">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Role Recommendations</h3>
              <p className="text-muted-foreground">Get the top 3 tech roles that match your background and career goals.</p>
            </Card>
            
            <Card className="p-6 text-center shadow-card border-0">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Skill Gap Analysis</h3>
              <p className="text-muted-foreground">Identify exactly what skills you need to develop for your target role.</p>
            </Card>
            
            <Card className="p-6 text-center shadow-card border-0">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Course Recommendations</h3>
              <p className="text-muted-foreground">Get specific online courses tailored to bridge your skill gaps.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {!analysis ? (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Start Your Career Transformation
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Share your current resume and desired career path to receive personalized AI guidance for your tech career transition.
                </p>
              </div>
              <CareerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <Button
                  variant="outline"
                  onClick={handleNewAnalysis}
                  className="mb-4"
                >
                  ← Start New Analysis
                </Button>
              </div>
              <CareerResults analysis={analysis} careerPath={selectedCareerPath} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent-foreground/80">
            Powered by AI • Built with ❤️ for career changers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
