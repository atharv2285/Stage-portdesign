import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Github, Download, Calendar, Award } from "lucide-react";

export interface ProjectData {
  id: number;
  image: string;
  title: string;
  category: string;
  tagline: string;
  techStack: string[];
  images?: string[];
  demoVideo?: string;
  readme: string;
  teammates?: Array<{
    name: string;
    avatar: string;
    role: string;
  }>;
  completionDate: string;
  links: {
    github?: string;
    demo?: string;
    caseStudy?: string;
    pdf?: string;
  };
  outcome: string;
  endorsement?: {
    name: string;
    role: string;
    company: string;
    text: string;
    avatar: string;
  };
  attachments?: Array<{
    fileName: string;
    fileType: string;
    fileData: string;
    preview?: string;
  }>;
}

interface ProjectDialogProps {
  project: ProjectData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDialog = ({ project, open, onOpenChange }: ProjectDialogProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{project.title}</DialogTitle>
          <p className="text-muted-foreground">{project.tagline}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <Badge key={idx} variant="secondary">{tech}</Badge>
              ))}
            </div>
          </div>

          {/* Images & Demo */}
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="notes">Project Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="space-y-4">
              {project.demoVideo && (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Demo Video: {project.demoVideo}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {project.images?.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                  {project.readme}
                </pre>
              </div>
            </TabsContent>
          </Tabs>

          {/* Team */}
          {project.teammates && project.teammates.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Project Team</h3>
              <div className="flex flex-wrap gap-4">
                {project.teammates.map((teammate, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={teammate.avatar} />
                      <AvatarFallback>{teammate.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{teammate.name}</p>
                      <p className="text-xs text-muted-foreground">{teammate.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Completed: {project.completionDate}</span>
          </div>

          {/* Outcome */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Outcome & Impact</h3>
            <p className="text-sm text-muted-foreground">{project.outcome}</p>
          </div>

          {/* Endorsement */}
          {project.endorsement && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-accent mt-1" />
                <div className="flex-1">
                  <p className="text-sm italic mb-2">"{project.endorsement.text}"</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={project.endorsement.avatar} />
                      <AvatarFallback>{project.endorsement.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{project.endorsement.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.endorsement.role} at {project.endorsement.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2">
            {project.links.github && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
            {project.links.demo && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.links.caseStudy && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.links.caseStudy} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Case Study
                </a>
              </Button>
            )}
            {project.links.pdf && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.links.pdf} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
