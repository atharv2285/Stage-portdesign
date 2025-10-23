import { useState } from "react";
import { Code2, Brain, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Skill {
  name: string;
  level: number;
  experience: string;
  projects?: string[];
}

interface SkillCategory {
  name: string;
  icon: typeof Code2;
  color: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Web Development",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    skills: [
      { name: "React", level: 90, experience: "Used in 15+ projects", projects: ["E-commerce Platform", "Dashboard App", "Portfolio Sites"] },
      { name: "TypeScript", level: 85, experience: "3 years professional experience", projects: ["API Services", "Full-stack Apps"] },
      { name: "Node.js", level: 80, experience: "Backend development for 10+ projects", projects: ["REST APIs", "Microservices"] },
      { name: "Tailwind CSS", level: 95, experience: "Primary styling framework", projects: ["All recent projects"] },
      { name: "Next.js", level: 75, experience: "Used in 5+ production apps", projects: ["Marketing Sites", "SaaS Products"] },
    ],
  },
  {
    name: "AI & Machine Learning",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    skills: [
      { name: "Python", level: 85, experience: "ML & Data Science projects", projects: ["Prediction Models", "Data Pipelines"] },
      { name: "TensorFlow", level: 70, experience: "Deep learning models", projects: ["Image Classification", "NLP Tasks"] },
      { name: "PyTorch", level: 65, experience: "Research & experimentation", projects: ["Custom Neural Networks"] },
      { name: "OpenAI APIs", level: 80, experience: "LLM integration in 8+ projects", projects: ["Chatbots", "Content Generation"] },
      { name: "LangChain", level: 75, experience: "RAG implementations", projects: ["Document Q&A", "AI Assistants"] },
    ],
  },
];

export const SkillTree = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-12">Skill Trees</h2>
      
      <div className="space-y-8">
        {skillCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.name} className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">{category.name}</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-lg border border-border hover:border-accent hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedSkill(selectedSkill?.name === skill.name ? null : skill)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{skill.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {skill.level >= 80 ? "Advanced" : skill.level >= 60 ? "Intermediate" : "Beginner"}
                      </Badge>
                    </div>
                    
                    <Progress value={skill.level} className="mb-3 h-2" />
                    
                    <p className="text-xs text-muted-foreground mb-2">{skill.experience}</p>
                    
                    {selectedSkill?.name === skill.name && skill.projects && (
                      <div className="mt-3 pt-3 border-t border-border animate-fade-in">
                        <p className="text-xs font-semibold mb-2">Projects using {skill.name}:</p>
                        <div className="flex flex-wrap gap-1">
                          {skill.projects.map((project, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
