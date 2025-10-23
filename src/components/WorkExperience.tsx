import { Briefcase, Award, Code, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Experience {
  company: string;
  role: string;
  period: string;
  keyOutcome: string;
  badges: Array<{ label: string; icon: typeof Briefcase }>;
}

const experiences: Experience[] = [
  {
    company: "TechCorp AI",
    role: "Senior AI Engineer",
    period: "2023 - Present",
    keyOutcome: "Led development of ML pipeline processing 1M+ daily predictions",
    badges: [
      { label: "AI", icon: Lightbulb },
      { label: "Leadership", icon: Award },
    ],
  },
  {
    company: "InnovateLabs",
    role: "Full Stack Developer",
    period: "2021 - 2023",
    keyOutcome: "Built scalable e-commerce platform serving 500K+ users",
    badges: [
      { label: "Dev", icon: Code },
      { label: "Product", icon: Briefcase },
    ],
  },
  {
    company: "StartupVentures",
    role: "Frontend Developer",
    period: "2020 - 2021",
    keyOutcome: "Redesigned UI increasing user engagement by 40%",
    badges: [
      { label: "Dev", icon: Code },
      { label: "Product", icon: Briefcase },
    ],
  },
  {
    company: "CodeAcademy",
    role: "Software Engineering Intern",
    period: "2019 - 2020",
    keyOutcome: "Developed interactive learning modules for web development courses",
    badges: [
      { label: "Dev", icon: Code },
    ],
  },
];

export const WorkExperience = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-12">Work Experience</h2>
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-20">
              {/* Timeline dot */}
              <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-accent border-4 border-background" />
              
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{exp.role}</h3>
                    <p className="text-lg text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{exp.period}</span>
                </div>
                
                <p className="text-foreground mb-4">{exp.keyOutcome}</p>
                
                <div className="flex gap-2 flex-wrap">
                  {exp.badges.map((badge, idx) => {
                    const Icon = badge.icon;
                    return (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        <Icon className="w-3 h-3" />
                        {badge.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
