import { Link } from "wouter";
import { Pill, Activity } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <Activity className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            MediLens
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <a 
            href="#" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </a>
          <a 
            href="#" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy
          </a>
        </nav>
      </div>
    </header>
  );
}
