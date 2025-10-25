import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { 
  Github, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Loader2, 
  Search,
  Plus,
  X,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { getAuthenticatedUserRepos, getRepoDetails, RepoDetails } from '@/services/githubService';
import { handleFileUpload, FileUploadResult } from '@/services/fileService';
import { ProjectData } from '@/components/ProjectDialog';

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: ProjectData) => void;
  nextId: number;
}

export function AddProjectDialog({ open, onOpenChange, onSave, nextId }: AddProjectDialogProps) {
  const [activeTab, setActiveTab] = useState<'github' | 'upload'>('github');
  const [loading, setLoading] = useState(false);
  
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<RepoDetails | null>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResult[]>([]);
  
  const [projectData, setProjectData] = useState<Partial<ProjectData>>({
    id: nextId,
    title: '',
    category: '',
    tagline: '',
    techStack: [],
    readme: '',
    completionDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    links: {},
    outcome: '',
    image: '',
    images: []
  });

  const [techInput, setTechInput] = useState('');
  const [useFirstSlideAsCover, setUseFirstSlideAsCover] = useState(false);

  const loadGithubRepos = async () => {
    setLoading(true);
    try {
      const repos = await getAuthenticatedUserRepos();
      if (!repos || repos.length === 0) {
        toast.error('No repositories found. Make sure you have repositories in your GitHub account.');
        setLoading(false);
        return;
      }
      setGithubRepos(repos);
      toast.success(`Loaded ${repos.length} repositories`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      toast.error(`Failed to load repositories: ${errorMessage}`);
      console.error('GitHub load error:', error);
      
      if (errorMessage.includes('GitHub not connected')) {
        toast.error('Please make sure GitHub connection is set up in the Replit integrations.');
      } else if (errorMessage.includes('X_REPLIT_TOKEN')) {
        toast.error('Environment variables not available. This feature may not work in preview mode.');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectGithubRepo = async (repoFullName: string) => {
    setLoading(true);
    try {
      const [owner, repo] = repoFullName.split('/');
      const details = await getRepoDetails(owner, repo);
      setSelectedRepo(details);
      
      const topLanguages = Object.keys(details.languages)
        .sort((a, b) => details.languages[b] - details.languages[a])
        .slice(0, 5);
      
      const updatedAt = new Date(details.repo.updated_at);
      const completionDate = updatedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      const outcome = `${details.repo.stargazers_count} stars, ${details.repo.forks_count} forks. Last updated ${completionDate}.`;
      
      setProjectData({
        ...projectData,
        title: details.repo.name,
        category: details.repo.language || 'Development',
        tagline: details.repo.description || `${details.repo.name} - ${details.repo.language || 'Project'}`,
        techStack: [...topLanguages, ...(details.repo.topics || [])].slice(0, 8),
        readme: details.readme,
        completionDate: completionDate,
        outcome: outcome,
        links: {
          github: details.repo.html_url
        },
        image: details.repo.owner.avatar_url || '',
        images: details.repo.owner.avatar_url ? [details.repo.owner.avatar_url] : []
      });
      
      toast.success('Repository imported successfully');
    } catch (error) {
      toast.error('Failed to fetch repository details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        acceptedFiles.map(file => handleFileUpload(file))
      );
      
      setUploadedFiles(prev => [...prev, ...results]);
      
      const pdfFile = results.find(r => r.fileType === 'application/pdf');
      if (pdfFile) {
        setProjectData(prev => ({
          ...prev,
          links: {
            ...prev.links,
            pdf: pdfFile.fileData
          }
        }));
        
        if (pdfFile.preview && !projectData.image) {
          setProjectData(prev => ({
            ...prev,
            image: pdfFile.preview,
            images: [pdfFile.preview]
          }));
          setUseFirstSlideAsCover(true);
        }
      }
      
      toast.success(`Uploaded ${acceptedFiles.length} file(s)`);
    } catch (error) {
      toast.error('Failed to upload files');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [projectData.image]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProjectData(prev => ({
          ...prev,
          image: imageUrl,
          images: [imageUrl, ...(prev.images || [])]
        }));
        setUseFirstSlideAsCover(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTechStack = () => {
    if (techInput.trim()) {
      setProjectData(prev => ({
        ...prev,
        techStack: [...(prev.techStack || []), techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechStack = (tech: string) => {
    setProjectData(prev => ({
      ...prev,
      techStack: prev.techStack?.filter(t => t !== tech) || []
    }));
  };

  const handleSave = () => {
    if (!projectData.title || !projectData.category) {
      toast.error('Please fill in at least title and category');
      return;
    }

    const completeProject: ProjectData = {
      id: projectData.id || nextId,
      title: projectData.title,
      category: projectData.category,
      tagline: projectData.tagline || '',
      techStack: projectData.techStack || [],
      readme: projectData.readme || '',
      completionDate: projectData.completionDate || '',
      links: projectData.links || {},
      outcome: projectData.outcome || '',
      image: projectData.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      images: projectData.images || [],
      teammates: projectData.teammates,
      endorsement: projectData.endorsement,
      attachments: uploadedFiles.map(file => ({
        fileName: file.fileName,
        fileType: file.fileType,
        fileData: file.fileData,
        preview: file.preview
      }))
    };

    onSave(completeProject);
    toast.success('Project added successfully!');
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setProjectData({
      id: nextId + 1,
      title: '',
      category: '',
      tagline: '',
      techStack: [],
      readme: '',
      completionDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      links: {},
      outcome: '',
      image: '',
      images: []
    });
    setSelectedRepo(null);
    setUploadedFiles([]);
    setGithubRepos([]);
    setUseFirstSlideAsCover(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Import projects from GitHub or upload project files (PDF, PPT, DOC) to showcase your work.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="github" className="gap-2">
              <Github className="w-4 h-4" />
              Import from GitHub
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="github" className="space-y-4">
              {!selectedRepo && (
                <>
                  <Button 
                    onClick={loadGithubRepos} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Load My Repositories
                      </>
                    )}
                  </Button>

                  {githubRepos.length > 0 && (
                    <div className="space-y-2">
                      {githubRepos.map((repo) => (
                        <div
                          key={repo.full_name}
                          onClick={() => selectGithubRepo(repo.full_name)}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{repo.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {repo.description || 'No description'}
                              </p>
                              <div className="flex gap-2 mt-2">
                                {repo.language && (
                                  <Badge variant="secondary" className="text-xs">
                                    {repo.language}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  ⭐ {repo.stargazers_count}
                                </Badge>
                              </div>
                            </div>
                            <Check className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-accent' : 'border-border'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p>Drop files here...</p>
                ) : (
                  <div>
                    <p className="mb-2">Drag & drop files here, or click to select</p>
                    <p className="text-sm text-muted-foreground">
                      Supports: PDF, PPT, PPTX, DOC, DOCX, Images
                    </p>
                  </div>
                )}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files</Label>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 border rounded-lg">
                      <FileText className="w-4 h-4" />
                      <span className="flex-1 text-sm">{file.fileName}</span>
                      {file.preview && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(file.preview, '_blank')}
                        >
                          Preview
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
                          if (projectData.links?.pdf === file.fileData) {
                            setProjectData(prev => ({
                              ...prev,
                              links: { ...prev.links, pdf: undefined }
                            }));
                          }
                          if (projectData.image === file.preview) {
                            setProjectData(prev => ({
                              ...prev,
                              image: '',
                              images: []
                            }));
                          }
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <div className="space-y-4 mt-6 pb-4">
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={projectData.title}
                      onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Project title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={projectData.category}
                      onChange={(e) => setProjectData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Mobile App, Web Development, AI/ML"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={projectData.tagline}
                      onChange={(e) => setProjectData(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Problem → Solution"
                    />
                  </div>

                  <div>
                    <Label>Tech Stack</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                        placeholder="Add technology"
                      />
                      <Button type="button" onClick={addTechStack} size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {projectData.techStack?.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1">
                          {tech}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeTechStack(tech)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="readme">Description / README</Label>
                    <Textarea
                      id="readme"
                      value={projectData.readme}
                      onChange={(e) => setProjectData(prev => ({ ...prev, readme: e.target.value }))}
                      placeholder="Project description, features, etc."
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="outcome">Outcome / Results</Label>
                    <Textarea
                      id="outcome"
                      value={projectData.outcome}
                      onChange={(e) => setProjectData(prev => ({ ...prev, outcome: e.target.value }))}
                      placeholder="Project achievements and results"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="completionDate">Completion Date</Label>
                    <Input
                      id="completionDate"
                      value={projectData.completionDate}
                      onChange={(e) => setProjectData(prev => ({ ...prev, completionDate: e.target.value }))}
                      placeholder="e.g., March 2024"
                    />
                  </div>

                  <div>
                    <Label htmlFor="demo">Demo URL</Label>
                    <Input
                      id="demo"
                      value={projectData.links?.demo || ''}
                      onChange={(e) => setProjectData(prev => ({ 
                        ...prev, 
                        links: { ...prev.links, demo: e.target.value }
                      }))}
                      placeholder="https://demo.com"
                    />
                  </div>

                  <div>
                    <Label>Cover Image</Label>
                    <div className="space-y-2">
                      {projectData.image && (
                        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                          <img 
                            src={projectData.image} 
                            alt="Cover" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <Button type="button" variant="outline" className="w-full" asChild>
                            <span>
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Upload Custom Cover
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        {uploadedFiles.find(f => f.preview) && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const pdfPreview = uploadedFiles.find(f => f.preview);
                              if (pdfPreview?.preview) {
                                setProjectData(prev => ({
                                  ...prev,
                                  image: pdfPreview.preview,
                                  images: [pdfPreview.preview]
                                }));
                                setUseFirstSlideAsCover(true);
                              }
                            }}
                          >
                            Use First Slide
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Project'
              )}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
