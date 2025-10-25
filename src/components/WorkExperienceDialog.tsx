import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, X, Plus, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export interface WorkExperienceData {
  id: string;
  company: string;
  companyLogo?: string;
  companyDomain?: string;
  role: string;
  period: string;
  startDate: string;
  endDate: string;
  current: boolean;
  keyOutcome: string;
  projects: string[];
  skills: string[];
}

interface WorkExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: WorkExperienceData) => void;
  experience?: WorkExperienceData | null;
}

interface CompanyResult {
  name: string;
  domain: string;
  icon: string;
  description: string;
  industry: string;
}

export const WorkExperienceDialog = ({ open, onOpenChange, onSave, experience }: WorkExperienceDialogProps) => {
  const [formData, setFormData] = useState<Partial<WorkExperienceData>>({
    company: "",
    companyLogo: "",
    companyDomain: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    keyOutcome: "",
    projects: [],
    skills: []
  });

  const [companySearch, setCompanySearch] = useState("");
  const [companyResults, setCompanyResults] = useState<CompanyResult[]>([]);
  const [searchingCompany, setSearchingCompany] = useState(false);
  const [showCompanyResults, setShowCompanyResults] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const debouncedSearch = useDebounce(companySearch, 500);

  useEffect(() => {
    if (experience) {
      setFormData(experience);
      setCompanySearch(experience.company);
    } else {
      setFormData({
        company: "",
        companyLogo: "",
        companyDomain: "",
        role: "",
        startDate: "",
        endDate: "",
        current: false,
        keyOutcome: "",
        projects: [],
        skills: []
      });
      setCompanySearch("");
    }
  }, [experience, open]);

  useEffect(() => {
    const searchCompanies = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setCompanyResults([]);
        return;
      }

      setSearchingCompany(true);
      try {
        const response = await fetch(`/api/company/search?query=${encodeURIComponent(debouncedSearch)}`);
        if (response.ok) {
          const data = await response.json();
          setCompanyResults(data.companies || []);
          setShowCompanyResults(true);
        }
      } catch (error) {
        console.error('Company search failed:', error);
        setCompanyResults([]);
      } finally {
        setSearchingCompany(false);
      }
    };

    searchCompanies();
  }, [debouncedSearch]);

  const handleCompanySelect = (company: CompanyResult) => {
    setFormData({
      ...formData,
      company: company.name,
      companyLogo: company.icon,
      companyDomain: company.domain
    });
    setCompanySearch(company.name);
    setShowCompanyResults(false);
  };

  const addProject = () => {
    if (newProject.trim()) {
      setFormData({
        ...formData,
        projects: [...(formData.projects || []), newProject.trim()]
      });
      setNewProject("");
    }
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects?.filter((_, i) => i !== index) || []
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((_, i) => i !== index) || []
    });
  };

  const handleSave = () => {
    if (!formData.company || !formData.role || !formData.startDate) {
      alert("Please fill in company, role, and start date");
      return;
    }

    const period = formData.current 
      ? `${formData.startDate} - Present`
      : `${formData.startDate} - ${formData.endDate || 'Present'}`;

    onSave({
      id: experience?.id || Date.now().toString(),
      company: formData.company,
      companyLogo: formData.companyLogo,
      companyDomain: formData.companyDomain,
      role: formData.role || "",
      period,
      startDate: formData.startDate || "",
      endDate: formData.current ? "" : (formData.endDate || ""),
      current: formData.current || false,
      keyOutcome: formData.keyOutcome || "",
      projects: formData.projects || [],
      skills: formData.skills || []
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{experience ? "Edit" : "Add"} Work Experience</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Company Search */}
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  placeholder="Search for a company..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="pl-9 pr-9"
                  onFocus={() => companyResults.length > 0 && setShowCompanyResults(true)}
                />
                {searchingCompany && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Company Search Results */}
              {showCompanyResults && companyResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {companyResults.map((company, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCompanySelect(company)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                    >
                      <img 
                        src={company.icon} 
                        alt={company.name}
                        className="w-10 h-10 rounded object-contain bg-white"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ddd"/><text x="50%" y="50%" font-size="20" text-anchor="middle" dy=".3em" fill="%23999">?</text></svg>';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{company.name}</div>
                        {company.description && (
                          <div className="text-sm text-muted-foreground truncate">{company.description}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.companyLogo && (
              <div className="flex items-center gap-2 mt-2">
                <img 
                  src={formData.companyLogo} 
                  alt={formData.company}
                  className="w-12 h-12 rounded object-contain bg-white border border-border"
                />
                <span className="text-sm text-muted-foreground">Selected: {formData.company}</span>
              </div>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Job Title / Role *</Label>
            <Input
              id="role"
              placeholder="e.g. Senior Software Engineer"
              value={formData.role || ""}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate || ""}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.current}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.current || false}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: "" })}
                  className="rounded border-gray-300"
                />
                Currently working here
              </label>
            </div>
          </div>

          {/* Key Outcome */}
          <div className="space-y-2">
            <Label htmlFor="keyOutcome">Key Outcome / Achievement</Label>
            <Textarea
              id="keyOutcome"
              placeholder="Describe your main achievement or contribution..."
              value={formData.keyOutcome || ""}
              onChange={(e) => setFormData({ ...formData, keyOutcome: e.target.value })}
              rows={3}
            />
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <Label>Projects Worked On</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a project..."
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProject())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addProject}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.projects?.map((project, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {project}
                  <button type="button" onClick={() => removeProject(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills Used</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills?.map((skill, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  {skill}
                  <button type="button" onClick={() => removeSkill(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {experience ? "Save Changes" : "Add Experience"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
