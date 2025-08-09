import React, { useState, useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Project } from '@/types/project';
import ProjectCard from '@/components/ProjectCard';
import { FileCode } from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';

interface ProjectListProps {
  projects: Project[];
  viewType: 'grid' | 'list';
  showPinOption?: boolean;
  showTeamBadge?: boolean;
  onPinToggle?: () => void;
  context?: 'my-projects' | 'pinned' | 'team' | 'community' | 'ai';
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  viewType, 
  showPinOption = false,
  showTeamBadge = false,
  onPinToggle,
  context = 'my-projects'
}) => {
  const { deleteProject, checkIfProjectIsPinned, toggleProjectPin, toggleProjectVisibility } = useProject();
  const { user } = useSupabase();
  const [pinnedProjects, setPinnedProjects] = useState<Set<string>>(new Set());

  // Load pinned status for projects when component mounts
  React.useEffect(() => {
    if (showPinOption && user) {
      const loadPinnedStatus = async () => {
        const pinnedSet = new Set<string>();
        for (const project of projects) {
          const isPinned = await checkIfProjectIsPinned(project.id);
          if (isPinned) {
            pinnedSet.add(project.id);
          }
        }
        setPinnedProjects(pinnedSet);
      };
      loadPinnedStatus();
    }
  }, [projects, showPinOption, user, checkIfProjectIsPinned]);

  const handleDeleteProject = useCallback(
    async (id: string) => {
      try {
        await deleteProject(id);
        toast.success('Project deleted successfully!');
        if (onPinToggle) {
          onPinToggle();
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    },
    [deleteProject, onPinToggle]
  );

  const handleTogglePin = async (projectId: string) => {
    if (!user) {
      toast.error('You must be logged in to pin projects');
      return;
    }

    try {
      await toggleProjectPin(projectId);
      
      // Update local pinned state
      setPinnedProjects(prev => {
        const newSet = new Set(prev);
        if (newSet.has(projectId)) {
          newSet.delete(projectId);
        } else {
          newSet.add(projectId);
        }
        return newSet;
      });

      // Call the parent callback to refresh the list
      if (onPinToggle) {
        onPinToggle();
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleToggleVisibility = async (projectId: string, currentVisibility: boolean) => {
    if (!user) {
      toast.error('You must be logged in to change project visibility');
      return;
    }

    try {
      await toggleProjectVisibility(projectId, !currentVisibility);
      toast.success(`Project is now ${!currentVisibility ? 'public' : 'private'}`);
      
      // Refresh projects list to show updated visibility
      if (onPinToggle) {
        onPinToggle();
      }
    } catch (error) {
      console.error('Error toggling project visibility:', error);
      toast.error('Failed to change project visibility');
    }
  };

  const handleExportProject = async (project: Project) => {
    try {
      const zip = new JSZip();
      
      // Add all project files to the zip
      project.files.forEach(file => {
        zip.file(file.name, file.content);
      });

      // Add a README file with project info
      const readmeContent = `# ${project.name}

${project.description || 'No description provided'}

## Project Details
- Type: ${project.type}
- Created: ${new Date(project.createdAt).toLocaleDateString()}
- Last Updated: ${new Date(project.updatedAt || project.updated_at).toLocaleDateString()}
- Files: ${project.files.length}

## Files Included
${project.files.map(file => `- ${file.name} (${file.type})`).join('\n')}

---
Exported from Web Sketch Studio
`;
      
      zip.file('README.md', readmeContent);

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Project exported successfully!');
    } catch (error) {
      console.error('Error exporting project:', error);
      toast.error('Failed to export project');
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center p-6 sm:p-8 bg-white rounded-lg border border-gray-200">
        <FileCode size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold mb-2">No Projects Found</h3>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          Create a new project to start coding.
        </p>
      </div>
    );
  }

  if (viewType === 'list') {
    return (
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <ProjectCard
              project={project}
              context={context}
              showPinOption={showPinOption}
              onDelete={handleDeleteProject}
              onTogglePin={handleTogglePin}
              onToggleVisibility={handleToggleVisibility}
              onExport={handleExportProject}
              isPinned={pinnedProjects.has(project.id)}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          context={context}
          showPinOption={showPinOption}
          onDelete={handleDeleteProject}
          onTogglePin={handleTogglePin}
          onToggleVisibility={handleToggleVisibility}
          onExport={handleExportProject}
          isPinned={pinnedProjects.has(project.id)}
        />
      ))}
    </div>
  );
};

export default ProjectList;