import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Pencil, Trash2 } from "lucide-react";

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    location: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  workExperience: Array<{
    id: string;
    company: string;
    role: string;
    description?: string;
    duration: string;
    location: string;
    link?: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    duration: string;
    location: string;
    link?: string;
  }>;
  languages: string[];
  skills: string[];
  customSections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

interface ResumeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: ResumeData;
  onSave: (data: ResumeData) => void;
}

export const ResumeEditor = ({ open, onOpenChange, resumeData, onSave }: ResumeEditorProps) => {
  const [formData, setFormData] = useState<ResumeData>(resumeData);
  const [newLanguage, setNewLanguage] = useState("");
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (open) {
      setFormData(resumeData);
    }
  }, [open, resumeData]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        {
          id: Date.now().toString(),
          company: "",
          role: "",
          description: "",
          duration: "",
          location: "",
          link: ""
        }
      ]
    });
  };

  const updateWorkExperience = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      workExperience: formData.workExperience.map(work =>
        work.id === id ? { ...work, [field]: value } : work
      )
    });
  };

  const deleteWorkExperience = (id: string) => {
    setFormData({
      ...formData,
      workExperience: formData.workExperience.filter(work => work.id !== id)
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          id: Date.now().toString(),
          institution: "",
          degree: "",
          duration: "",
          location: "",
          link: ""
        }
      ]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      education: formData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const deleteEducation = (id: string) => {
    setFormData({
      ...formData,
      education: formData.education.filter(edu => edu.id !== id)
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()]
      });
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const addCustomSection = () => {
    setFormData({
      ...formData,
      customSections: [
        ...formData.customSections,
        {
          id: Date.now().toString(),
          title: "New Section",
          content: ""
        }
      ]
    });
  };

  const updateCustomSection = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      customSections: formData.customSections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    });
  };

  const deleteCustomSection = (id: string) => {
    setFormData({
      ...formData,
      customSections: formData.customSections.filter(section => section.id !== id)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resume</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.personalInfo.name}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, name: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={formData.personalInfo.title}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, title: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.personalInfo.location}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, location: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.personalInfo.email || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, email: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={formData.personalInfo.phone || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, phone: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                value={formData.personalInfo.website || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, website: e.target.value }
                })}
              />
            </div>
          </TabsContent>

          {/* Work Experience Tab */}
          <TabsContent value="work" className="space-y-4">
            <Button onClick={addWorkExperience} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Work Experience
            </Button>
            {formData.workExperience.map((work, index) => (
              <div key={work.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Experience #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteWorkExperience(work.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={work.company}
                      onChange={(e) => updateWorkExperience(work.id, 'company', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={work.role}
                      onChange={(e) => updateWorkExperience(work.id, 'role', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      placeholder="e.g. Jan 2020 - Present"
                      value={work.duration}
                      onChange={(e) => updateWorkExperience(work.id, 'duration', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={work.location}
                      onChange={(e) => updateWorkExperience(work.id, 'location', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={work.description || ""}
                    onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Link (Optional)</Label>
                  <Input
                    type="url"
                    placeholder="https://company.com"
                    value={work.link || ""}
                    onChange={(e) => updateWorkExperience(work.id, 'link', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <Button onClick={addEducation} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
            {formData.education.map((edu, index) => (
              <div key={edu.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Education #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEducation(edu.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      placeholder="e.g. 2015 - 2019"
                      value={edu.duration}
                      onChange={(e) => updateEducation(edu.id, 'duration', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Institution Link (Optional)</Label>
                  <Input
                    type="url"
                    placeholder="https://university.edu"
                    value={edu.link || ""}
                    onChange={(e) => updateEducation(edu.id, 'link', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. English (Fluent)"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
              />
              <Button onClick={addLanguage} className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((lang, index) => (
                <Badge key={index} variant="secondary" className="gap-1 px-3 py-1">
                  {lang}
                  <button onClick={() => removeLanguage(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. React, Python, AWS"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button onClick={addSkill} className="gap-2">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="gap-1 px-3 py-1">
                  {skill}
                  <button onClick={() => removeSkill(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </TabsContent>

          {/* Custom Sections Tab */}
          <TabsContent value="custom" className="space-y-4">
            <Button onClick={addCustomSection} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Custom Section
            </Button>
            {formData.customSections.map((section, index) => (
              <div key={section.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Section #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCustomSection(section.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    placeholder="e.g. Certifications, Awards, Publications"
                    value={section.title}
                    onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Add the content for this section..."
                    value={section.content}
                    onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
