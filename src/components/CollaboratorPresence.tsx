
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users } from 'lucide-react';
import { Collaborator } from '@/hooks/useCollaboration';

interface CollaboratorPresenceProps {
  collaborators: Collaborator[];
  currentFileId?: string;
}

const CollaboratorPresence: React.FC<CollaboratorPresenceProps> = ({ 
  collaborators, 
  currentFileId 
}) => {
  const activeCollaborators = collaborators.filter(c => 
    Date.now() - new Date(c.last_seen).getTime() < 2 * 60 * 1000 // Active in last 2 minutes
  );

  const currentFileCollaborators = activeCollaborators.filter(c => 
    c.current_file_id === currentFileId
  );

  if (activeCollaborators.length === 0) {
    return null;
  }

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (email: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    const index = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <Users size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">
          {activeCollaborators.length} online
        </span>
      </div>
      
      <div className="flex -space-x-2">
        <TooltipProvider>
          {activeCollaborators.slice(0, 5).map((collaborator) => (
            <Tooltip key={collaborator.id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarFallback className={`${getAvatarColor(collaborator.user_email)} text-white text-xs`}>
                      {getInitials(collaborator.user_email)}
                    </AvatarFallback>
                  </Avatar>
                  {collaborator.current_file_id === currentFileId && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 border border-white rounded-full" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <div>{collaborator.user_email}</div>
                  {collaborator.current_file_id === currentFileId && (
                    <div className="text-green-400">Editing this file</div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        
        {activeCollaborators.length > 5 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-8 w-8 bg-gray-200 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    +{activeCollaborators.length - 5}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  {activeCollaborators.slice(5).map(c => (
                    <div key={c.id}>{c.user_email}</div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {currentFileCollaborators.length > 0 && (
        <Badge variant="secondary" className="text-xs">
          {currentFileCollaborators.length} editing
        </Badge>
      )}
    </div>
  );
};

export default CollaboratorPresence;
