import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkExperienceDialog, WorkExperienceData } from "./WorkExperienceDialog";

const STORAGE_KEY = "portfolio_work_experience";

const defaultExperiences: WorkExperienceData[] = [
  {
    id: "work-exp-1",
    company: "TechCorp AI",
    role: "Senior AI Engineer",
    period: "2023 - Present",
    startDate: "2023-01",
    endDate: "",
    current: true,
    keyOutcome: "Led development of ML pipeline processing 1M+ daily predictions",
    projects: ["AutoML Platform", "Real-time Fraud Detection"],
    skills: ["Python", "TensorFlow", "AWS", "Docker"],
  },
  {
    id: "work-exp-2",
    company: "InnovateLabs",
    role: "Full Stack Developer",
    period: "2021 - 2023",
    startDate: "2021-06",
    endDate: "2023-01",
    current: false,
    keyOutcome: "Built scalable e-commerce platform serving 500K+ users",
    projects: ["E-commerce Platform", "Payment Gateway Integration"],
    skills: ["React", "Node.js", "PostgreSQL", "Redis"],
  },
];

export const WorkExperience = () => {
  const [experiences, setExperiences] = useState<WorkExperienceData[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<WorkExperienceData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setExperiences(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse work experience data:", error);
        setExperiences(defaultExperiences);
      }
    } else {
      setExperiences(defaultExperiences);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
  }, [experiences]);

  const handleAddNew = () => {
    setSelectedExperience(null);
    setDialogOpen(true);
  };

  const handleEdit = (exp: WorkExperienceData) => {
    setSelectedExperience(exp);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this work experience?")) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const handleSave = (data: WorkExperienceData) => {
    if (selectedExperience) {
      // Update existing
      setExperiences(experiences.map((exp) => (exp.id === data.id ? data : exp)));
    } else {
      // Add new
      setExperiences([...experiences, data]);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold">Work Experience</h2>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-8">
          {experiences.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No work experience added yet.</p>
              <p className="text-sm mt-2">Click "Add Experience" to get started.</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="relative pl-20">
                {/* Timeline dot */}
                <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-accent border-4 border-background z-10" />

                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Company Logo */}
                      {exp.companyLogo ? (
                        <img
                          src={exp.companyLogo}
                          alt={exp.company}
                          className="w-14 h-14 rounded-lg object-contain bg-white border border-border flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 border border-border">
                          <Briefcase className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold">{exp.role}</h3>
                        <p className="text-lg text-muted-foreground">{exp.company}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(exp)}
                        className="h-8 w-8"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(exp.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Key Outcome */}
                  {exp.keyOutcome && (
                    <p className="text-foreground mb-4">{exp.keyOutcome}</p>
                  )}

                  {/* Projects */}
                  {exp.projects && exp.projects.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">
                        Projects:
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {exp.projects.map((project, idx) => (
                          <Badge key={idx} variant="secondary">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {exp.skills && exp.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">
                        Skills:
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {exp.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <WorkExperienceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        experience={selectedExperience}
      />
    </div>
  );
};
