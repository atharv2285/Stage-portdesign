import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Award, Star, Code, Users, Activity, Link as LinkIcon, Plus, Zap } from "lucide-react";
import { SiGithub, SiLinkedin, SiLeetcode, SiDribbble, SiKaggle, SiYoutube, SiCodeforces } from "react-icons/si";
import { githubAuthService } from "@/services/githubAuthService";
import { getAuthenticatedUser } from "@/services/githubService";
import { ConnectPlatformDialog } from "./ConnectPlatformDialog";
import { toast } from "sonner";

interface PlatformProfile {
  id: string;
  platform: string;
  username: string;
  profileUrl: string;
  color: string;
  icon: any;
  stats: {
    label: string;
    value: string | number;
    icon?: any;
  }[];
  recentActivity?: string;
  badge?: string;
  topSkills?: string[];
  visualData?: {
    type: "graph" | "streak" | "thumbnails";
    data?: any;
  };
  engagementScore: number;
  connected: boolean;
}

interface ConnectedPlatforms {
  leetcode?: any;
  youtube?: any;
  linkedin?: any;
}

type SortOption = "engagement" | "activity" | "name";

export const ExternalProfiles = () => {
  const [sortBy, setSortBy] = useState<SortOption>("engagement");
  const [githubProfile, setGithubProfile] = useState<PlatformProfile | null>(null);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);
  const [connectDialogPlatform, setConnectDialogPlatform] = useState<string | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatforms>({});

  const placeholderProfiles: PlatformProfile[] = [
    {
      id: "leetcode",
      platform: "LeetCode",
      username: "Connect Account",
      profileUrl: "#",
      color: "#FFA116",
      icon: SiLeetcode,
      stats: [],
      badge: "Not Connected",
      engagementScore: 0,
      connected: false,
    },
    {
      id: "codeforces",
      platform: "Codeforces",
      username: "Connect Account",
      profileUrl: "#",
      color: "#1F8ACB",
      icon: SiCodeforces,
      stats: [],
      badge: "Not Connected",
      engagementScore: 0,
      connected: false,
    },
    {
      id: "youtube",
      platform: "YouTube",
      username: "Connect Account",
      profileUrl: "#",
      color: "#FF0000",
      icon: SiYoutube,
      stats: [],
      badge: "Not Connected",
      engagementScore: 0,
      connected: false,
    },
    {
      id: "linkedin",
      platform: "LinkedIn",
      username: "Connect Account",
      profileUrl: "#",
      color: "#0A66C2",
      icon: SiLinkedin,
      stats: [],
      badge: "Not Connected",
      engagementScore: 0,
      connected: false,
    },
    {
      id: "kaggle",
      platform: "Kaggle",
      username: "Coming Soon",
      profileUrl: "#",
      color: "#20BEFF",
      icon: SiKaggle,
      stats: [],
      badge: "Coming Soon",
      engagementScore: 0,
      connected: false,
    },
  ];

  useEffect(() => {
    const checkGitHubConnection = async () => {
      const connected = githubAuthService.isAuthenticated();
      setIsGitHubConnected(connected);
      
      if (connected) {
        setIsLoadingGitHub(true);
        try {
          const user = await getAuthenticatedUser();
          const githubData: PlatformProfile = {
            id: "github",
            platform: "GitHub",
            username: user.login,
            profileUrl: user.html_url,
            color: "#181717",
            icon: SiGithub,
            stats: [
              { label: "Repositories", value: user.public_repos, icon: Code },
              { label: "Followers", value: user.followers, icon: Users },
              { label: "Following", value: user.following, icon: Activity }
            ],
            recentActivity: "Connected via OAuth",
            badge: "Connected Account",
            engagementScore: 100,
            connected: true,
          };
          setGithubProfile(githubData);
        } catch (error) {
          console.error('Failed to fetch GitHub profile:', error);
        } finally {
          setIsLoadingGitHub(false);
        }
      }
    };

    checkGitHubConnection();
  }, []);

  const handlePlatformConnect = (platform: string, data: any) => {
    let profile: PlatformProfile | null = null;

    switch (platform) {
      case "leetcode":
        const stats = data.submitStatsGlobal?.acSubmissionNum || [];
        const totalSolved = stats.find((s: any) => s.difficulty === 'All')?.count || 0;
        const easySolved = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
        const mediumSolved = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
        const hardSolved = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;
        
        profile = {
          id: "leetcode",
          platform: "LeetCode",
          username: data.username,
          profileUrl: `https://leetcode.com/${data.username}`,
          color: "#FFA116",
          icon: SiLeetcode,
          stats: [
            { label: "Total Solved", value: totalSolved, icon: Code },
            { label: "Easy", value: easySolved, icon: TrendingUp },
            { label: "Medium", value: mediumSolved, icon: Award },
            { label: "Hard", value: hardSolved, icon: Star },
          ],
          recentActivity: `Ranking: ${data.profile?.ranking || 'N/A'}`,
          badge: "Active Coder",
          topSkills: ["Algorithms", "Data Structures", "Problem Solving"],
          engagementScore: Math.min(100, (totalSolved / 5)),
          connected: true,
        };
        break;

      case "codeforces":
        const rating = data.rating || 0;
        const maxRating = data.maxRating || 0;
        const rank = data.rank || 'Unrated';
        
        profile = {
          id: "codeforces",
          platform: "Codeforces",
          username: data.handle || "Unknown",
          profileUrl: `https://codeforces.com/profile/${data.handle}`,
          color: "#1F8ACB",
          icon: SiCodeforces,
          stats: [
            { label: "Rating", value: rating, icon: Star },
            { label: "Max Rating", value: maxRating, icon: TrendingUp },
            { label: "Rank", value: rank, icon: Award },
            { label: "Contests", value: data.totalContests || 0, icon: Code },
          ],
          recentActivity: `${rank} • ${data.totalContests || 0} contests participated`,
          badge: rank !== 'Unrated' ? rank : 'Competitive Programmer',
          topSkills: ["Algorithms", "Competitive Programming", "Problem Solving"],
          engagementScore: Math.min(100, maxRating / 30),
          connected: true,
        };
        break;

      case "youtube":
        profile = {
          id: "youtube",
          platform: "YouTube",
          username: data.snippet?.title || "Channel",
          profileUrl: `https://youtube.com/channel/${data.id}`,
          color: "#FF0000",
          icon: SiYoutube,
          stats: [
            { label: "Subscribers", value: formatNumber(data.statistics?.subscriberCount || 0), icon: Users },
            { label: "Videos", value: data.statistics?.videoCount || 0, icon: Activity },
            { label: "Views", value: formatNumber(data.statistics?.viewCount || 0), icon: TrendingUp },
            { label: "Custom URL", value: data.snippet?.customUrl || 'N/A', icon: Star },
          ],
          recentActivity: `Channel: ${data.snippet?.title}`,
          badge: "Content Creator",
          topSkills: ["Video Content", "Teaching", "Communication"],
          engagementScore: Math.min(100, parseInt(data.statistics?.subscriberCount || 0) / 100),
          connected: true,
        };
        break;

      case "linkedin":
        const linkedinData = data.data || data;
        profile = {
          id: "linkedin",
          platform: "LinkedIn",
          username: linkedinData.name || "Professional",
          profileUrl: linkedinData.url || "#",
          color: "#0A66C2",
          icon: SiLinkedin,
          stats: [
            { label: "Connections", value: linkedinData.connectionsCount || 0, icon: Users },
            { label: "Followers", value: linkedinData.followersCount || 0, icon: Award },
            { label: "Headline", value: linkedinData.headline?.substring(0, 20) || 'N/A', icon: Activity },
          ],
          recentActivity: linkedinData.headline || "Connected",
          badge: "Professional",
          topSkills: linkedinData.skills?.slice(0, 3) || ["Professional", "Networking"],
          engagementScore: Math.min(100, (linkedinData.connectionsCount || 0) / 25),
          connected: true,
        };
        break;
    }

    if (profile) {
      setConnectedPlatforms((prev) => ({
        ...prev,
        [platform]: profile,
      }));
    }
  };

  const getProfiles = (): PlatformProfile[] => {
    const profiles: PlatformProfile[] = [];
    
    if (githubProfile) {
      profiles.push(githubProfile);
    }
    
    placeholderProfiles.forEach((placeholder) => {
      const connected = connectedPlatforms[placeholder.id as keyof ConnectedPlatforms];
      profiles.push(connected || placeholder);
    });
    
    return profiles;
  };

  const allProfiles = getProfiles();

  const sortedProfiles = [...allProfiles].sort((a, b) => {
    if (sortBy === "engagement") return b.engagementScore - a.engagementScore;
    if (sortBy === "name") return a.platform.localeCompare(b.platform);
    return 0;
  });

  const connectedCount = sortedProfiles.filter((p) => p.connected).length;
  const averageEngagement = connectedCount > 0
    ? Math.round(
        sortedProfiles
          .filter((p) => p.connected)
          .reduce((sum, p) => sum + p.engagementScore, 0) / connectedCount
      )
    : 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Linked Profiles & Stats</h2>
        <p className="text-muted-foreground mb-6">
          Connect platforms to showcase your activity and achievements across the web
        </p>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Overall Engagement</p>
                <p className="text-2xl font-bold">{averageEngagement}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Platforms Connected</p>
                <p className="text-2xl font-bold">{connectedCount}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button
              variant={sortBy === "engagement" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("engagement")}
              data-testid="button-sort-engagement"
            >
              Engagement
            </Button>
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("name")}
              data-testid="button-sort-name"
            >
              Name
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProfiles.map((profile) => {
          const Icon = profile.icon;
          const isNotConnected = !profile.connected;
          const isComingSoon = profile.badge === "Coming Soon";
          
          return (
            <Card
              key={profile.id}
              className={`group relative overflow-hidden transition-all duration-300 border-2 ${
                isNotConnected
                  ? "hover:border-primary/50 cursor-default"
                  : "hover:shadow-xl hover:border-primary/50 cursor-pointer"
              }`}
              onClick={() => !isNotConnected && window.open(profile.profileUrl, '_blank')}
              data-testid={`card-profile-${profile.id}`}
              style={{
                '--platform-color': profile.color,
              } as any}
            >
              {!isNotConnected && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge 
                    variant="secondary" 
                    className="bg-background/90 backdrop-blur-sm font-semibold"
                  >
                    {profile.engagementScore}% active
                  </Badge>
                </div>
              )}

              <div 
                className="p-6 pb-4 relative"
                style={{
                  background: `linear-gradient(135deg, ${profile.color}15 0%, ${profile.color}05 100%)`
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div 
                    className="p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: profile.color }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{profile.platform}</h3>
                    <p className="text-sm text-muted-foreground">
                      {isNotConnected ? "Not connected" : `@${profile.username}`}
                    </p>
                  </div>
                  {!isNotConnected && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(profile.profileUrl, '_blank');
                      }}
                      data-testid={`button-external-${profile.id}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {profile.badge && (
                  <Badge 
                    className="mb-2"
                    style={{ 
                      backgroundColor: isNotConnected ? "#94a3b8" : `${profile.color}20`,
                      color: isNotConnected ? "#475569" : profile.color,
                      borderColor: isNotConnected ? "#94a3b8" : profile.color
                    }}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {profile.badge}
                  </Badge>
                )}
              </div>

              <div className="p-6 pt-2">
                {isNotConnected ? (
                  <div className="flex items-center justify-center py-8">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isComingSoon) {
                          setConnectDialogPlatform(profile.id);
                        }
                      }}
                      disabled={isComingSoon}
                      className="gap-2"
                      style={{
                        backgroundColor: isComingSoon ? undefined : profile.color,
                      }}
                    >
                      {isComingSoon ? (
                        <>
                          <span>Coming Soon</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4" />
                          Connect {profile.platform}
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {profile.stats.map((stat, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {stat.icon && <stat.icon className="w-3 h-3" />}
                            <span>{stat.label}</span>
                          </div>
                          <p className="text-lg font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {profile.topSkills && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Top Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.topSkills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.recentActivity && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground">Recent Activity:</p>
                        <p className="text-xs mt-1 line-clamp-2">{profile.recentActivity}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                style={{ backgroundColor: profile.color }}
              />
            </Card>
          );
        })}
      </div>

      <ConnectPlatformDialog
        platform={connectDialogPlatform || ""}
        isOpen={connectDialogPlatform !== null}
        onClose={() => setConnectDialogPlatform(null)}
        onConnect={(data) => handlePlatformConnect(connectDialogPlatform!, data)}
      />
    </div>
  );
};

function formatNumber(num: string | number): string {
  const n = typeof num === 'string' ? parseInt(num) : num;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}
