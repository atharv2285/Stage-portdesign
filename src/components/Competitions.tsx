import { Trophy, Medal, Award, Users, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Competition {
  id: number;
  name: string;
  organizer: string;
  date: string;
  placement: string;
  placementIcon: "gold" | "silver" | "bronze" | "finalist";
  description: string;
  teamMembers: Array<{
    name: string;
    avatar: string;
    role: string;
  }>;
  projectId: number; // Links to project in portfolio
  projectTitle: string;
  image: string;
  websiteUrl?: string;
  tags: string[];
}

interface CompetitionsProps {
  onProjectClick: (projectId: number) => void;
}

const getPlacementColor = (placement: string) => {
  if (placement.includes("1st") || placement.includes("Winner")) return "text-yellow-500";
  if (placement.includes("2nd")) return "text-gray-400";
  if (placement.includes("3rd")) return "text-orange-600";
  return "text-primary";
};

const getPlacementIcon = (iconType: string) => {
  switch (iconType) {
    case "gold":
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case "silver":
      return <Medal className="w-6 h-6 text-gray-400" />;
    case "bronze":
      return <Award className="w-6 h-6 text-orange-600" />;
    default:
      return <Award className="w-6 h-6 text-primary" />;
  }
};

export const competitions: Competition[] = [
  {
    id: 1,
    name: "TechCrunch Disrupt Hackathon 2024",
    organizer: "TechCrunch",
    date: "March 2024",
    placement: "1st Place Winner",
    placementIcon: "gold",
    description: "Built a real-time chat application with end-to-end encryption that won first place among 200+ teams. Implemented innovative WebSocket architecture for instant messaging.",
    teamMembers: [
      { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", role: "UI/UX Designer" },
      { name: "Mike Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", role: "Backend Developer" }
    ],
    projectId: 1,
    projectTitle: "Chat",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    websiteUrl: "https://techcrunch.com/disrupt",
    tags: ["Real-time", "WebSocket", "React Native"]
  },
  {
    id: 2,
    name: "Google Cloud Hackathon",
    organizer: "Google Cloud",
    date: "January 2024",
    placement: "2nd Place",
    placementIcon: "silver",
    description: "Developed an AI-powered e-commerce platform with smart recommendations. Integrated Stripe for seamless payments and used Google Cloud services for scalability.",
    teamMembers: [
      { name: "Alex Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", role: "ML Engineer" }
    ],
    projectId: 2,
    projectTitle: "Shop",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
    websiteUrl: "https://cloud.google.com/hackathon",
    tags: ["E-commerce", "AI/ML", "Cloud"]
  },
  {
    id: 3,
    name: "AI Innovation Challenge",
    organizer: "MIT Technology Review",
    date: "December 2023",
    placement: "1st Place Winner",
    placementIcon: "gold",
    description: "Created an operating system-like interface for AI model management. Judges praised the intuitive UX and powerful automation features.",
    teamMembers: [
      { name: "Alex Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", role: "ML Engineer" }
    ],
    projectId: 3,
    projectTitle: "AI OS",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    tags: ["AI/ML", "Dashboard", "Python"]
  },
  {
    id: 4,
    name: "Apple WWDC Student Challenge",
    organizer: "Apple",
    date: "June 2023",
    placement: "Winner",
    placementIcon: "gold",
    description: "Developed an innovative iOS widget dashboard that was selected as a winner. Featured customizable widgets with real-time data synchronization.",
    teamMembers: [],
    projectId: 4,
    projectTitle: "Widget Dashboard",
    image: "https://images.unsplash.com/photo-1621570074981-c4ae7a4c03c8?w=800",
    websiteUrl: "https://developer.apple.com/wwdc/",
    tags: ["iOS", "Swift", "WidgetKit"]
  },
  {
    id: 5,
    name: "HealthTech Hackathon 2023",
    organizer: "Health Innovation Hub",
    date: "June 2023",
    placement: "3rd Place",
    placementIcon: "bronze",
    description: "Built an AI-powered fitness tracker with personalized workout recommendations. Used TensorFlow Lite for on-device ML inference.",
    teamMembers: [
      { name: "Emma Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", role: "Health Data Analyst" }
    ],
    projectId: 6,
    projectTitle: "Fitness Tracker",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    tags: ["Health", "AI/ML", "Mobile"]
  },
];

export const Competitions = ({ onProjectClick }: CompetitionsProps) => {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Competitions & Hackathons</h2>
      <p className="text-muted-foreground mb-12">
        Recognition and achievements from hackathons and coding competitions
      </p>

      <div className="space-y-6">
        {competitions.map((competition) => (
          <Card 
            key={competition.id} 
            className="p-6 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onProjectClick(competition.projectId)}
            data-testid={`card-competition-${competition.id}`}
          >
            <div className="grid md:grid-cols-[200px_1fr] gap-6">
              {/* Competition Image */}
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={competition.image} 
                  alt={competition.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  data-testid={`img-competition-${competition.id}`}
                />
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full p-2">
                  {getPlacementIcon(competition.placementIcon)}
                </div>
              </div>

              {/* Competition Details */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {competition.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                      <span>{competition.organizer}</span>
                      <span>•</span>
                      <span>{competition.date}</span>
                    </div>
                    <div className={`flex items-center gap-2 font-semibold ${getPlacementColor(competition.placement)}`}>
                      {getPlacementIcon(competition.placementIcon)}
                      <span>{competition.placement}</span>
                    </div>
                  </div>

                  {competition.websiteUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(competition.websiteUrl, '_blank');
                      }}
                      data-testid={`button-website-${competition.id}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {competition.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {competition.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Team Members */}
                {competition.teamMembers.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Team:</span>
                    <div className="flex items-center gap-3">
                      {competition.teamMembers.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="text-xs">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-muted-foreground"> - {member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Link */}
                <div className="pt-2 border-t border-border">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProjectClick(competition.projectId);
                    }}
                    data-testid={`button-view-project-${competition.id}`}
                  >
                    View Project: {competition.projectTitle} →
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
