import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
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
  Lock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { generateProjectUrl, getProjectCategory } from '@/utils/projectUrls';

interface ProjectCardProps {
  project: Project;
  context?: 'my-projects' | 'pinned' | 'team' | 'community' | 'ai';
  showPinOption?: boolean;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleVisibility?: (id: string, isPublic: boolean) => void;
  onExport?: (project: Project) => void;
  isPinned?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  context = 'my-projects',
  showPinOption = false,
  onDelete,
  onTogglePin,
  onToggleVisibility,
  onExport,
  isPinned = false
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);

  const handleEdit = () => {
    const url = generateProjectUrl(project, 'editor', context);
    navigate(url.replace(window.location.origin, ''));
  };

  const handlePreview = () => {
    const url = generateProjectUrl(project, 'preview', context);
    window.open(url, '_blank');
  };

  const handleShare = () => {
    const url = generateProjectUrl(project, 'share', context);
    window.open(url, '_blank');
  };

  const handleCopyUrl = async (type: 'editor' | 'preview' | 'share') => {
    const url = generateProjectUrl(project, type, context);
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(type);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} URL copied!`);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const getProjectBadges = () => {
    const badges = [];
    
    if (project.isPublic || project.is_public) {
      badges.push(
        <Badge key="public" variant="default" className="text-xs px-2 py-0.5 bg-green-100 text-green-800 border border-green-200/50">
          <Globe size={12} className="mr-1" />
          Public
        </Badge>
      );
    } else {
      badges.push(
        <Badge key="private" variant="default" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 border border-gray-200/50">
          <Lock size={12} className="mr-1" />
          Private
        </Badge>
      );
    }

    if (context === 'team') {
      badges.push(
        <Badge key="team" variant="default" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200/50">
          <Users size={12} className="mr-1" />
          Team
        </Badge>
      );
    }

    if (isPinned) {
      badges.push(
        <Badge key="pinned" variant="default" className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 border border-yellow-200/50">
          <Pin size={12} className="mr-1" />
          Pinned
        </Badge>
      );
    }

    return badges;
  };

  return (
    <div className="group bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-200/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      {/* Project Preview */}
      <div className="w-full h-[240px] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
        <div className="h-full w-full">
          <ProjectPreview project={project} />
        </div>
        {/* Status badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2 z-20">
          {getProjectBadges()}
        </div>
        {/* Quick action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handlePreview}
          >
            <Eye size={14} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleShare}
          >
            <ExternalLink size={14} />
          </Button>
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
              <DropdownMenuItem onClick={handleEdit}>
                <Edit size={16} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePreview}>
                <Eye size={16} className="mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <ExternalLink size={16} className="mr-2" />
                Share
              </DropdownMenuItem>
              {onExport && (
                <DropdownMenuItem onClick={() => onExport(project)}>
                  <Download size={16} className="mr-2" />
                  Export
                </DropdownMenuItem>
              )}
              {showPinOption && onTogglePin && (
                <DropdownMenuItem onClick={() => onTogglePin(project.id)}>
                  {isPinned ? (
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
               {onToggleVisibility && (
                 <DropdownMenuItem onClick={() => onToggleVisibility(project.id, project.isPublic || project.is_public)}>
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
               )}
               <DropdownMenuItem onClick={() => handleCopyUrl('preview')}>
                 <Copy size={16} className="mr-2" />
                 {copied === 'preview' ? 'Copied!' : 'Copy Share URL'}
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleCopyUrl('editor')}>
                 <Users size={16} className="mr-2" />
                 {copied === 'editor' ? 'Copied!' : 'Copy Edit URL'}
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               {onDelete && (
                 <DropdownMenuItem 
                   onClick={() => onDelete(project.id)}
                   className="text-red-600"
                 >
                   <Trash2 size={16} className="mr-2" />
                   Delete
                 </DropdownMenuItem>
               )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Main action buttons */}
        <div className="flex gap-2">
          <Button onClick={handleEdit} className="flex-1" size="sm">
            <Edit size={14} className="mr-2" />
            Edit
          </Button>
          <Button onClick={handlePreview} variant="outline" size="sm">
            <Eye size={14} className="mr-2" />
            Preview
          </Button>
          <Button onClick={() => handleCopyUrl('share')} variant="outline" size="sm">
            <Share size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;