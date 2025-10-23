import { Button } from "@/components/ui/button";
import avatarImg from "@/assets/avatar.jpg";
import heroGraphic from "@/assets/hero-graphic.png";

export const ProfileHeader = () => {
  return (
    <div className="bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
              <div className="flex items-start gap-6">
                <img 
                  src={avatarImg} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-border"
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">Stage</h1>
                  <p className="text-xl text-muted-foreground mb-6">👽 Visualizing the Craziest Ideas</p>
                  
                  <div className="flex items-center gap-8 mb-6">
                    <div>
                      <div className="text-2xl font-bold">44,107</div>
                      <div className="text-sm text-muted-foreground">followers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">235</div>
                      <div className="text-sm text-muted-foreground">following</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">62,699</div>
                      <div className="text-sm text-muted-foreground">likes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="portfolio" size="lg">Get in touch</Button>
                    <Button variant="outline" size="lg">Follow</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <img 
                src={heroGraphic} 
                alt="Creative design graphic" 
                className="w-96 h-96 object-contain animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
