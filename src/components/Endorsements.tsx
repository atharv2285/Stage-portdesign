import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Endorsement {
  name: string;
  role: string;
  company: string;
  avatar: string;
  endorsement: string;
  profileUrl: string;
}

const endorsements: Endorsement[] = [
  {
    name: "Sarah Chen",
    role: "CTO",
    company: "TechVision Inc",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    endorsement: "An exceptional developer with a rare combination of technical excellence and creative vision. Their AI implementations have transformed our product capabilities.",
    profileUrl: "#",
  },
  {
    name: "Michael Rodriguez",
    role: "Lead Designer",
    company: "CreativeStudio",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    endorsement: "Outstanding collaboration skills and ability to bridge design and development. Consistently delivers pixel-perfect implementations ahead of schedule.",
    profileUrl: "#",
  },
  {
    name: "Emily Watson",
    role: "Product Manager",
    company: "InnovateLabs",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    endorsement: "A problem-solver who brings innovative solutions to complex challenges. Their work on our ML pipeline was instrumental in scaling to millions of users.",
    profileUrl: "#",
  },
  {
    name: "David Kim",
    role: "Engineering Manager",
    company: "StartupVentures",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    endorsement: "Exceptional technical skills combined with strong leadership. Mentored junior developers while delivering high-quality code on tight deadlines.",
    profileUrl: "#",
  },
  {
    name: "Jessica Brown",
    role: "Senior Developer",
    company: "CodeAcademy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    endorsement: "A talented developer who quickly became an invaluable team member. Their interactive learning modules set new standards for our platform.",
    profileUrl: "#",
  },
  {
    name: "Alex Turner",
    role: "VP of Engineering",
    company: "DataCorp",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    endorsement: "Brilliant engineer with deep expertise in both frontend and backend. Their architecture decisions have proven robust and scalable.",
    profileUrl: "#",
  },
];

export const Endorsements = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Endorsements</h2>
      <p className="text-muted-foreground mb-12">
        What colleagues and collaborators say about working with me
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {endorsements.map((endorsement, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={endorsement.avatar} alt={endorsement.name} />
                <AvatarFallback>{endorsement.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{endorsement.name}</h3>
                    <p className="text-sm text-muted-foreground">{endorsement.role}</p>
                    <p className="text-sm text-muted-foreground">{endorsement.company}</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent"
                    onClick={() => window.open(endorsement.profileUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <blockquote className="text-sm text-foreground leading-relaxed italic border-l-2 border-accent pl-4">
              "{endorsement.endorsement}"
            </blockquote>
          </Card>
        ))}
      </div>
    </div>
  );
};
