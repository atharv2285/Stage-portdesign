import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">Stage</h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">Shots</a>
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">Designers</a>
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">Services</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="bg-transparent border-none outline-none text-sm w-64"
              />
            </div>
            <Button variant="ghost" size="sm">Sign up</Button>
            <Button variant="portfolio" size="sm">Log in</Button>
          </div>
        </div>
      </div>
    </header>
  );
};
