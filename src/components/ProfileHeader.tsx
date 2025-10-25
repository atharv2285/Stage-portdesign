import { Button } from "@/components/ui/button";
import avatarImg from "@/assets/avatar.jpg";
import heroGraphic from "@/assets/hero-graphic.png";
import { AchievementBadges } from "./AchievementBadges";

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
                  <h1 className="text-2xl font-light mb-2 text-muted-foreground">Atharv Shukla</h1>
                  <p className="text-3xl font-bold mb-6" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800 }}>
                    👽 Visualizing the Craziest Ideas
                  </p>
                  
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
                    <Button variant="portfolio" size="lg">Message</Button>
                    <Button variant="outline" size="lg">Follow</Button>
                  </div>
                </div>
              </div>

              {/* Achievement Badges - utilizing white space */}
              <div className="mt-6">
                <AchievementBadges />
              </div>
            </div>

            <div className="hidden lg:block perspective-1000">
              <div className="flip-card w-96 h-96 cursor-pointer" data-testid="card-about-flip">
                <div className="flip-card-inner w-full h-full relative transition-transform duration-700 transform-style-3d">
                  {/* Front Side - Colorful Graphic */}
                  <div className="flip-card-front absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <img 
                        src={heroGraphic} 
                        alt="Creative design graphic" 
                        className="w-full h-full object-contain mix-blend-overlay"
                      />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="text-xl font-bold drop-shadow-lg">Hover to know me!</p>
                    </div>
                  </div>
                  
                  {/* Back Side - About Me */}
                  <div className="flip-card-back absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl p-8 flex flex-col justify-center items-center text-center rotate-y-180 border-4 border-primary/40">
                    <div className="space-y-6">
                      <p className="text-white/90 text-lg leading-relaxed max-w-sm">
                        I'm Atharv. I love building AI-powered apps, tinkering with drones, and turning wild ideas into real projects. When I'm not coding, you'll find me exploring startups or reading about tech trends.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
