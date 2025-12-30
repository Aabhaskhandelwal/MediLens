import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, X, Search, ShieldCheck, Pill, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAnalyzePrescriptions } from "@/hooks/use-medicines";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [medicines, setMedicines] = useState<string[]>([]);
  const [currentMed, setCurrentMed] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [currentAllergy, setCurrentAllergy] = useState("");
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const analyzeMutation = useAnalyzePrescriptions();

  const handleAddMedicine = () => {
    if (!currentMed.trim()) return;
    if (medicines.includes(currentMed.trim())) {
      toast({
        title: "Already added",
        description: "This medicine is already in your list.",
        variant: "destructive",
      });
      return;
    }
    setMedicines([...medicines, currentMed.trim()]);
    setCurrentMed("");
  };

  const handleRemoveMedicine = (med: string) => {
    setMedicines(medicines.filter((m) => m !== med));
  };

  const handleAddAllergy = () => {
    if (!currentAllergy.trim()) return;
    if (allergies.includes(currentAllergy.trim())) {
      return;
    }
    setAllergies([...allergies, currentAllergy.trim()]);
    setCurrentAllergy("");
  };

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const handleAnalyze = async () => {
    if (medicines.length === 0) {
      toast({
        title: "No medicines added",
        description: "Please add at least one medicine to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      const results = await analyzeMutation.mutateAsync({
        prescriptions: medicines,
        allergies: allergies,
      });
      
      // Store results in history state and navigate
      // wouter doesn't have built-in state passing, so we use localStorage 
      // or simply rely on URL params if data was small. 
      // For this size of data, sessionStorage is appropriate.
      sessionStorage.setItem('analysisResults', JSON.stringify(results));
      setLocation('/results');
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Hero Text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full border-none">
              <Sparkles className="w-3 h-3 mr-2" />
              Smart Prescription Analysis
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-[1.1] mb-6">
              Understand your <br/>
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                prescriptions.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              MediLens helps you identify generic alternatives, potential savings, and dangerous allergy interactions instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Allergy Checks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Pill className="w-4 h-4" />
                </div>
                <span>Generic Finder</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 md:p-8 shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-accent" />
              
              <div className="space-y-6">
                
                {/* Medicines Input */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Prescribed Medicines</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="e.g. Lipitor, Amoxicillin..." 
                        className="pl-9 bg-background/50 focus:bg-background transition-all"
                        value={currentMed}
                        onChange={(e) => setCurrentMed(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddMedicine()}
                      />
                    </div>
                    <Button 
                      onClick={handleAddMedicine} 
                      size="icon" 
                      className="shrink-0 bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Medicine Tags */}
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg bg-muted/20 border border-border/50">
                    {medicines.length === 0 && (
                      <span className="text-sm text-muted-foreground/60 italic self-center">No medicines added yet</span>
                    )}
                    {medicines.map((med) => (
                      <Badge key={med} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-2 bg-white dark:bg-slate-800 shadow-sm border-border/50">
                        {med}
                        <button 
                          onClick={() => handleRemoveMedicine(med)}
                          className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allergies Input */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-destructive/80">Known Allergies (Optional)</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. Penicillin, Peanuts..." 
                      className="bg-background/50 focus:bg-background transition-all border-destructive/20 focus:border-destructive/50 focus:ring-destructive/20"
                      value={currentAllergy}
                      onChange={(e) => setCurrentAllergy(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy()}
                    />
                    <Button 
                      variant="outline"
                      onClick={handleAddAllergy} 
                      size="icon" 
                      className="shrink-0 border-destructive/20 hover:bg-destructive/5 text-destructive"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Allergy Tags */}
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy) => (
                      <Badge key={allergy} variant="outline" className="pl-3 pr-1 py-1 flex items-center gap-2 border-destructive/30 text-destructive bg-destructive/5">
                        {allergy}
                        <button 
                          onClick={() => handleRemoveAllergy(allergy)}
                          className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full text-lg h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" 
                    onClick={handleAnalyze}
                    disabled={analyzeMutation.isPending || medicines.length === 0}
                  >
                    {analyzeMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Analyze Prescriptions <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </div>
                
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
}
