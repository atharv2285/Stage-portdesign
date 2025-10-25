import { useState, useEffect } from 'react';
import { ProjectData } from '@/components/ProjectDialog';

const STORAGE_KEY = 'portfolio_projects';

export function useProjectStorage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
  }, []);

  const saveProjects = (newProjects: ProjectData[]) => {
    setProjects(newProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
  };

  const addProject = (project: ProjectData) => {
    const newProjects = [...projects, project];
    saveProjects(newProjects);
  };

  const updateProject = (id: number, updatedProject: Partial<ProjectData>) => {
    const newProjects = projects.map(p => 
      p.id === id ? { ...p, ...updatedProject } : p
    );
    saveProjects(newProjects);
  };

  const deleteProject = (id: number) => {
    const newProjects = projects.filter(p => p.id !== id);
    saveProjects(newProjects);
  };

  const getNextId = () => {
    return projects.length > 0 
      ? Math.max(...projects.map(p => p.id)) + 1 
      : 1;
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getNextId
  };
}
