import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">Stage</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Sign up</Button>
            <Button variant="portfolio" size="sm">Log in</Button>
          </div>
        </div>
      </div>
    </header>
  );
};
