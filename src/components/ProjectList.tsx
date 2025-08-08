import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useProject } from '@/contexts/ProjectContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProjectPreview from '@/components/ProjectPreview';
import ShareProjectDialog from '@/components/ShareProjectDialog';
import { 
  FileCode, 
  Files, 
  Edit, 
  Trash2, 
  Users,
  Share,
  Pin,
  PinOff,
  MoreVertical,
  Eye,
  Copy,
  Download,
  Globe,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';

interface ProjectListProps {
  projects: Project[];
  viewType: 'grid' | 'list';
  showPinOption?: boolean;
  showTeamBadge?: boolean;
  onPinToggle?: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  viewType, 
  showPinOption = false,
  showTeamBadge = false,
  onPinToggle 
}) => {
  const { deleteProject, checkIfProjectIsPinned, toggleProjectPin, toggleProjectVisibility } = useProject();
  const { user } = useSupabase();
  const navigate = useNavigate();
  const [pinnedProjects, setPinnedProjects] = useState<Set<string>>(new Set());
  const [shareDialogProject, setShareDialogProject] = useState<Project | null>(null);

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

  const handleEditProject = (id: string) => {
    localStorage.setItem('currentProjectId', id);
    navigate(`/editor/${id}`);
  };

  const handlePreviewProject = (project: Project) => {
    if (project.slug) {
      window.open(`/preview/${project.slug}`, '_blank');
    } else {
      window.open(`/preview/${project.id}`, '_blank'); // fallback
    }
  };

  const handleDeleteProject = useCallback(
    async (id: string) => {
      try {
        await deleteProject(id);
        toast.success('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    },
    [deleteProject]
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

  const isTeamProject = (project: Project) => {
    return (project.isPublic || project.is_public) && project.description === '';
  };

  const handleCopyUrl = (project: Project, type: 'editor' | 'preview') => {
    const url = type === 'editor' 
      ? `https://webeditor.shopingers.in/editor/${project.id}`
      : `https://webeditor.shopingers.in/preview/${project.slug}`;
    
    navigator.clipboard.writeText(url);
    toast.success(`${type === 'editor' ? 'Editor' : 'Preview'} URL copied to clipboard!`);
  };

  const getProjectBadges = (project: Project) => {
    const badges = [];
    
    if (project.isPublic || project.is_public) {
      badges.push(
        <Badge key="public" variant="default" className="text-xs px-2 py-0.5 bg-green-100 text-green-800 border border-green-200/50 shadow-sm">
          <Globe size={12} className="mr-1" />
          Public
        </Badge>
      );
    } else {
      badges.push(
        <Badge key="private" variant="default" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 border border-gray-200/50 shadow-sm">
          <Lock size={12} className="mr-1" />
          Private
        </Badge>
      );
    }

    // Only show "Team" badge when showTeamBadge is true AND it's a team project
    if (showTeamBadge && isTeamProject(project)) {
      badges.push(
        <Badge key="team" variant="default" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200/50 shadow-sm">
          <Users size={12} className="mr-1" />
          Team
        </Badge>
      );
    }

    if (pinnedProjects.has(project.id)) {
      badges.push(
        <Badge key="pinned" variant="default" className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 border border-yellow-200/50 shadow-sm">
          <Pin size={12} className="mr-1" />
          Pinned
        </Badge>
      );
    }

    return badges;
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
      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0 w-20 h-12 rounded overflow-hidden border">
                <ProjectPreview project={project} />
              </div>
              <div className="flex-shrink-0">
                {project.type === 'single' ? (
                  <FileCode size={20} className="text-blue-500" />
                ) : (
                  <Files size={20} className="text-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                  <div className="flex gap-1">
                    {getProjectBadges(project)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Updated {formatDistanceToNow(new Date(project.updatedAt || project.updated_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                    <Edit size={16} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePreviewProject(project)}>
                    <Eye size={16} className="mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportProject(project)}>
                    <Download size={16} className="mr-2" />
                    Export
                  </DropdownMenuItem>
                  {showPinOption && user && (
                    <DropdownMenuItem onClick={() => handleTogglePin(project.id)}>
                      {pinnedProjects.has(project.id) ? (
                        <>
                          <PinOff size={16} className="mr-2" />
                          Unpin
                        </>
                      ) : (
                        <>
                          <Pin size={16} className="mr-2" />
                          Pin
                        </>
                      )}
                    </DropdownMenuItem>
                   )}
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => handleToggleVisibility(project.id, project.isPublic || project.is_public)}>
                     {(project.isPublic || project.is_public) ? (
                       <>
                         <Lock size={16} className="mr-2" />
                         Make Private
                       </>
                     ) : (
                       <>
                         <Globe size={16} className="mr-2" />
                         Make Public
                       </>
                     )}
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleCopyUrl(project, 'preview')}>
                     <Copy size={16} className="mr-2" />
                     Copy Preview URL
                   </DropdownMenuItem>
                  {/* Only show Copy Collab URL for team projects */}
                  {showTeamBadge && isTeamProject(project) && (
                    <DropdownMenuItem onClick={() => handleCopyUrl(project, 'editor')}>
                      <Users size={16} className="mr-2" />
                      Copy Collab URL
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setShareDialogProject(project)}>
                    <Share size={16} className="mr-2" />
                    Share Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        {shareDialogProject && (
          <ShareProjectDialog
            project={shareDialogProject}
            onClose={() => setShareDialogProject(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="group bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-200/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
          {/* Project Preview */}
          <div className="w-full h-[240px] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
            <div className="h-full w-full">
              <ProjectPreview project={project} />
            </div>
            {/* Status badges overlay */}
            <div className="absolute top-3 left-3 flex gap-2 z-20">
              {getProjectBadges(project)}
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  {project.type === 'single' ? (
                    <FileCode size={18} className="text-blue-600" />
                  ) : (
                    <Files size={18} className="text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 truncate text-base tracking-tight">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Updated {formatDistanceToNow(new Date(project.updatedAt || project.updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100/80"
                  >
                    <MoreVertical size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                    <Edit size={16} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePreviewProject(project)}>
                    <Eye size={16} className="mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportProject(project)}>
                    <Download size={16} className="mr-2" />
                    Export
                  </DropdownMenuItem>
                  {showPinOption && user && (
                    <DropdownMenuItem onClick={() => handleTogglePin(project.id)}>
                      {pinnedProjects.has(project.id) ? (
                        <>
                          <PinOff size={16} className="mr-2" />
                          Unpin
                        </>
                      ) : (
                        <>
                          <Pin size={16} className="mr-2" />
                          Pin
                        </>
                      )}
                    </DropdownMenuItem>
                   )}
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => handleToggleVisibility(project.id, project.isPublic || project.is_public)}>
                     {(project.isPublic || project.is_public) ? (
                       <>
                         <Lock size={16} className="mr-2" />
                         Make Private
                       </>
                     ) : (
                       <>
                         <Globe size={16} className="mr-2" />
                         Make Public
                       </>
                     )}
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleCopyUrl(project, 'preview')}>
                     <Copy size={16} className="mr-2" />
                     Copy Preview URL
                   </DropdownMenuItem>
                  {/* Only show Copy Collab URL for team projects */}
                  {showTeamBadge && isTeamProject(project) && (
                    <DropdownMenuItem onClick={() => handleCopyUrl(project, 'editor')}>
                      <Users size={16} className="mr-2" />
                      Copy Collab URL
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setShareDialogProject(project)}>
                    <Share size={16} className="mr-2" />
                    Share Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-gray-500">
                Updated {formatDistanceToNow(new Date(project.updatedAt || project.updated_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      ))}
      {shareDialogProject && (
        <ShareProjectDialog
          project={shareDialogProject}
          onClose={() => setShareDialogProject(null)}
        />
      )}
    </div>
  );
};

export default ProjectList;
