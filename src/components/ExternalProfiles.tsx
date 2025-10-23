import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Award, Star, Code, Users, Activity } from "lucide-react";
import { SiGithub, SiLinkedin, SiLeetcode, SiDribbble, SiKaggle, SiYoutube } from "react-icons/si";

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
}

const profiles: PlatformProfile[] = [
  {
    id: "github",
    platform: "GitHub",
    username: "atharvshukla",
    profileUrl: "https://github.com/atharvshukla",
    color: "#181717",
    icon: SiGithub,
    stats: [
      { label: "Commits (2024)", value: "1,247", icon: Code },
      { label: "Repositories", value: 42, icon: Activity },
      { label: "Stars Received", value: 328, icon: Star },
      { label: "Followers", value: 156, icon: Users }
    ],
    recentActivity: "Pushed to react-portfolio-builder • 2 hours ago",
    badge: "Top Contributor",
    topSkills: ["TypeScript", "React", "Node.js"],
    visualData: {
      type: "graph",
      data: { commits: [12, 18, 25, 19, 32, 28, 35] }
    },
    engagementScore: 95
  },
  {
    id: "leetcode",
    platform: "LeetCode",
    username: "atharv_codes",
    profileUrl: "https://leetcode.com/atharv_codes",
    color: "#FFA116",
    icon: SiLeetcode,
    stats: [
      { label: "Problems Solved", value: 487, icon: Code },
      { label: "Current Streak", value: "42 days", icon: TrendingUp },
      { label: "Contest Rating", value: 1847, icon: Award },
      { label: "Global Rank", value: "Top 5%", icon: Star }
    ],
    recentActivity: "Solved 'Binary Tree Maximum Path Sum' • Hard",
    badge: "Problem Solver",
    topSkills: ["Algorithms", "Dynamic Programming", "Trees"],
    visualData: {
      type: "streak",
      data: { days: 42 }
    },
    engagementScore: 88
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    username: "Atharv Shukla",
    profileUrl: "https://linkedin.com/in/atharvshukla",
    color: "#0A66C2",
    icon: SiLinkedin,
    stats: [
      { label: "Connections", value: "2,500+", icon: Users },
      { label: "Endorsements", value: 127, icon: Award },
      { label: "Post Views (30d)", value: "15.2K", icon: Activity },
      { label: "Profile Views", value: 834, icon: TrendingUp }
    ],
    recentActivity: "Posted about React 19 features • 1 day ago",
    badge: "Active Creator",
    topSkills: ["Full Stack Development", "UI/UX Design", "System Architecture"],
    engagementScore: 82
  },
  {
    id: "dribbble",
    platform: "Dribbble",
    username: "atharv_designs",
    profileUrl: "https://dribbble.com/atharv_designs",
    color: "#EA4C89",
    icon: SiDribbble,
    stats: [
      { label: "Shots", value: 56, icon: Activity },
      { label: "Followers", value: 423, icon: Users },
      { label: "Likes", value: "3.2K", icon: Star },
      { label: "Views", value: "28.5K", icon: TrendingUp }
    ],
    recentActivity: "Published 'AI Dashboard Concept' • 3 days ago",
    badge: "Active Creator",
    topSkills: ["UI Design", "Branding", "Illustration"],
    visualData: {
      type: "thumbnails"
    },
    engagementScore: 76
  },
  {
    id: "kaggle",
    platform: "Kaggle",
    username: "atharvml",
    profileUrl: "https://kaggle.com/atharvml",
    color: "#20BEFF",
    icon: SiKaggle,
    stats: [
      { label: "Competitions", value: 12, icon: Award },
      { label: "Notebooks", value: 34, icon: Code },
      { label: "Tier", value: "Expert", icon: Star },
      { label: "Medals", value: "5 Gold", icon: Award }
    ],
    recentActivity: "Ranked #47 in Image Classification Challenge",
    badge: "Top Contributor",
    topSkills: ["Machine Learning", "Deep Learning", "Data Analysis"],
    engagementScore: 84
  },
  {
    id: "youtube",
    platform: "YouTube",
    username: "Code with Atharv",
    profileUrl: "https://youtube.com/@codewatharv",
    color: "#FF0000",
    icon: SiYoutube,
    stats: [
      { label: "Subscribers", value: "12.5K", icon: Users },
      { label: "Videos", value: 48, icon: Activity },
      { label: "Views", value: "285K", icon: TrendingUp },
      { label: "Avg. Watch Time", value: "8.2 min", icon: Star }
    ],
    recentActivity: "Uploaded 'React Server Components Explained' • 5 days ago",
    badge: "Active Creator",
    topSkills: ["Teaching", "Web Development", "Content Creation"],
    engagementScore: 79
  }
];

type SortOption = "engagement" | "activity" | "name";

export const ExternalProfiles = () => {
  const [sortBy, setSortBy] = useState<SortOption>("engagement");

  const sortedProfiles = [...profiles].sort((a, b) => {
    if (sortBy === "engagement") return b.engagementScore - a.engagementScore;
    if (sortBy === "name") return a.platform.localeCompare(b.platform);
    return 0;
  });

  const averageEngagement = Math.round(
    profiles.reduce((sum, p) => sum + p.engagementScore, 0) / profiles.length
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Linked Profiles & Stats</h2>
        <p className="text-muted-foreground mb-6">
          Connected platforms showcasing my activity and achievements across the web
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
                <p className="text-2xl font-bold">{profiles.length}</p>
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
          return (
            <Card
              key={profile.id}
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              onClick={() => window.open(profile.profileUrl, '_blank')}
              data-testid={`card-profile-${profile.id}`}
              style={{
                '--platform-color': profile.color,
              } as any}
            >
              {/* Engagement Score Badge */}
              <div className="absolute top-3 right-3 z-10">
                <Badge 
                  variant="secondary" 
                  className="bg-background/90 backdrop-blur-sm font-semibold"
                >
                  {profile.engagementScore}% active
                </Badge>
              </div>

              {/* Platform Header with Gradient */}
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
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  </div>
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
                </div>

                {profile.badge && (
                  <Badge 
                    className="mb-2"
                    style={{ 
                      backgroundColor: `${profile.color}20`,
                      color: profile.color,
                      borderColor: profile.color
                    }}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {profile.badge}
                  </Badge>
                )}
              </div>

              {/* Stats Grid */}
              <div className="p-6 pt-2">
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

                {/* Top Skills */}
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

                {/* Recent Activity */}
                {profile.recentActivity && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Recent Activity:</p>
                    <p className="text-xs mt-1 line-clamp-2">{profile.recentActivity}</p>
                  </div>
                )}

                {/* Visual Indicator */}
                {profile.visualData?.type === "graph" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-end justify-between h-12 gap-1">
                      {profile.visualData.data?.commits.map((value: number, idx: number) => (
                        <div
                          key={idx}
                          className="flex-1 rounded-t transition-all hover:opacity-80"
                          style={{
                            height: `${(value / 35) * 100}%`,
                            backgroundColor: profile.color,
                            opacity: 0.7
                          }}
                          title={`${value} commits`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">Last 7 days</p>
                  </div>
                )}

                {profile.visualData?.type === "streak" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-5 h-5" style={{ color: profile.color }} />
                      <div className="text-center">
                        <p className="text-2xl font-bold" style={{ color: profile.color }}>
                          {profile.visualData.data?.days}
                        </p>
                        <p className="text-xs text-muted-foreground">Day Streak 🔥</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Overlay Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                style={{ backgroundColor: profile.color }}
              />
            </Card>
          );
        })}
      </div>

      {/* Add New Profile Placeholder */}
      <Card className="mt-6 p-8 border-2 border-dashed hover:border-primary/50 transition-colors cursor-pointer group">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 group-hover:bg-primary/10 transition-colors">
            <ExternalLink className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="font-semibold mb-2">Connect More Platforms</h3>
          <p className="text-sm text-muted-foreground">
            Link additional profiles to showcase your activity across the web
          </p>
        </div>
      </Card>
    </div>
  );
};
