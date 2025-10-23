import { useState } from "react";
import { Header } from "@/components/Header";
import { ProfileHeader } from "@/components/ProfileHeader";
import { PortfolioItem } from "@/components/PortfolioItem";
import { ProjectDialog, ProjectData } from "@/components/ProjectDialog";
import { WorkExperience } from "@/components/WorkExperience";
import { SkillTree } from "@/components/SkillTree";
import { Endorsements } from "@/components/Endorsements";
import { Resume } from "@/components/Resume";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const portfolioItems: ProjectData[] = [
  { 
    id: 1, 
    image: portfolio1, 
    title: "Chat", 
    category: "Mobile App",
    tagline: "Fragmented communication → Unified messaging platform",
    techStack: ["React Native", "Firebase", "WebSocket", "TypeScript"],
    images: [portfolio1],
    readme: "A real-time chat application with end-to-end encryption.\n\nFeatures:\n- Group chats\n- Media sharing\n- Voice messages\n- Read receipts",
    teammates: [
      { name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", role: "UI/UX Designer" },
      { name: "Mike Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", role: "Backend Developer" }
    ],
    completionDate: "March 2024",
    links: {
      github: "https://github.com",
      demo: "https://demo.com"
    },
    outcome: "Successfully launched to 50+ users with 95% satisfaction rate. Reduced message delivery time by 40%.",
    endorsement: {
      name: "Dr. James Wilson",
      role: "CTO",
      company: "TechCorp",
      text: "Outstanding work on the chat architecture. The real-time performance is exceptional.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
    }
  },
  { 
    id: 2, 
    image: portfolio2, 
    title: "Shop", 
    category: "E-commerce",
    tagline: "Poor UX checkout → Streamlined shopping experience",
    techStack: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
    images: [portfolio2],
    readme: "Modern e-commerce platform with seamless checkout.\n\nKey Features:\n- One-click checkout\n- AI-powered recommendations\n- Inventory management\n- Analytics dashboard",
    completionDate: "January 2024",
    links: {
      github: "https://github.com",
      demo: "https://shop-demo.com",
      pdf: "https://shop-case-study.pdf"
    },
    outcome: "Increased conversion rate by 35% and reduced cart abandonment by 28%."
  },
  { 
    id: 3, 
    image: portfolio3, 
    title: "AI OS", 
    category: "Dashboard",
    tagline: "Complex AI tools → Intuitive AI workspace",
    techStack: ["React", "Python", "TensorFlow", "FastAPI", "Docker"],
    images: [portfolio3],
    readme: "An operating system-like interface for AI model management.\n\nCapabilities:\n- Model training UI\n- Dataset visualization\n- Performance metrics\n- Deployment automation",
    teammates: [
      { name: "Alex Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", role: "ML Engineer" }
    ],
    completionDate: "December 2023",
    links: {
      github: "https://github.com",
      caseStudy: "https://case-study.com"
    },
    outcome: "Used by 3 research teams. Reduced model deployment time from hours to minutes."
  },
  { 
    id: 4, 
    image: portfolio4, 
    title: "Widget Dashboard", 
    category: "iOS App",
    tagline: "Static widgets → Dynamic customizable home screen",
    techStack: ["Swift", "SwiftUI", "WidgetKit", "CoreData"],
    images: [portfolio4],
    readme: "iOS widget dashboard with customizable components.\n\nFeatures:\n- 15+ widget types\n- Real-time data sync\n- Custom themes\n- iCloud sync",
    completionDate: "October 2023",
    links: {
      demo: "https://apps.apple.com"
    },
    outcome: "Featured on App Store with 4.8★ rating. 1000+ downloads in first month."
  },
  { 
    id: 5, 
    image: portfolio5, 
    title: "Music Player", 
    category: "Streaming",
    tagline: "Cluttered interface → Clean audio experience",
    techStack: ["Vue.js", "Node.js", "MongoDB", "WebAudio API"],
    images: [portfolio5],
    readme: "Modern music streaming application.\n\nFeatures:\n- High-quality audio streaming\n- Playlist management\n- Social sharing\n- Offline mode",
    completionDate: "August 2023",
    links: {
      github: "https://github.com",
      demo: "https://music-demo.com"
    },
    outcome: "Improved audio quality perception by 45% through custom EQ settings."
  },
  { 
    id: 6, 
    image: portfolio6, 
    title: "Fitness Tracker", 
    category: "Health & Wellness",
    tagline: "Generic tracking → Personalized health insights",
    techStack: ["React", "GraphQL", "PostgreSQL", "TensorFlow Lite"],
    images: [portfolio6],
    readme: "AI-powered fitness tracking application.\n\nFeatures:\n- Activity tracking\n- Nutrition logging\n- AI workout recommendations\n- Progress analytics",
    teammates: [
      { name: "Emma Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", role: "Health Data Analyst" }
    ],
    completionDate: "June 2023",
    links: {
      github: "https://github.com",
      demo: "https://fitness-demo.com",
      caseStudy: "https://fitness-case-study.com"
    },
    outcome: "Helped 200+ users achieve fitness goals. 70% reported improved workout consistency.",
    endorsement: {
      name: "Dr. Lisa Anderson",
      role: "Health Technology Specialist",
      company: "WellnessTech",
      text: "The AI recommendations are impressively accurate and have helped many of our clients.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa"
    }
  },
];

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleProjectClick = (project: ProjectData) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProfileHeader />
      <ProjectDialog project={selectedProject} open={dialogOpen} onOpenChange={setDialogOpen} />
      
      <div className="border-b border-border">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="projects" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="bg-transparent border-none h-auto p-0">
                <TabsTrigger 
                  value="projects" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="experience"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                >
                  Work Experience
                </TabsTrigger>
                <TabsTrigger 
                  value="skills"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                >
                  Skill Trees
                </TabsTrigger>
                <TabsTrigger 
                  value="endorsements"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                >
                  Endorsements
                </TabsTrigger>
                <TabsTrigger 
                  value="resume"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                  data-testid="tab-resume"
                >
                  Resume
                </TabsTrigger>
              </TabsList>
              
              <Button variant="ghost" size="sm" className="gap-2">
                Featured Shots <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            <TabsContent value="projects" className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                  <PortfolioItem
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    category={item.category}
                    tagline={item.tagline}
                    techStack={item.techStack}
                    onClick={() => handleProjectClick(item)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="experience" className="py-12">
              <WorkExperience />
            </TabsContent>

            <TabsContent value="skills" className="py-12">
              <SkillTree />
            </TabsContent>

            <TabsContent value="endorsements" className="py-12">
              <Endorsements />
            </TabsContent>

            <TabsContent value="resume" className="py-12">
              <Resume />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
