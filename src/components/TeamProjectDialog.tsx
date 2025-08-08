
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Users, Plus } from 'lucide-react';
import { ProjectType } from '@/types/project';

interface TeamProjectDialogProps {
  children: React.ReactNode;
}

const TeamProjectDialog: React.FC<TeamProjectDialogProps> = ({ children }) => {
  const { createProject } = useProject();
  const { user } = useSupabase();
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('multiple');
  const [isPublic, setIsPublic] = useState(true);
  const [collaboratorEmails, setCollaboratorEmails] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTeamProject = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    if (!user) {
      toast.error('Please login to create team projects');
      return;
    }

    setIsLoading(true);

    try {
      // Create the project (description is empty for team projects)
      createProject(projectName, '', projectType);
      
      // Send invitations to collaborators if emails are provided
      if (collaboratorEmails.trim()) {
        const emails = collaboratorEmails
          .split(',')
          .map(email => email.trim())
          .filter(email => email && email.includes('@'));

        if (emails.length > 0) {
          toast.success(`Team project created! Collaborators can access it via the public link.`);
        }
      } else {
        toast.success('Team project created successfully!');
      }

      // Reset form
      setProjectName('');
      setCollaboratorEmails('');
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error creating team project:', error);
      toast.error('Failed to create team project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={20} />
            Create Team Project
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-project-name">Project Name *</Label>
            <Input
              id="team-project-name"
              placeholder="My Team Project"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-type">Project Type</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={projectType === 'single' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProjectType('single')}
                className="flex-1"
              >
                Single File
              </Button>
              <Button
                type="button"
                variant={projectType === 'multiple' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProjectType('multiple')}
                className="flex-1"
              >
                Multiple Files
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-project">Public Project</Label>
              <div className="text-sm text-muted-foreground">
                Allow anyone with the link to view and edit
              </div>
            </div>
            <Switch
              id="public-project"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collaborator-emails">Collaborator Emails (Optional)</Label>
            <Input
              id="collaborator-emails"
              placeholder="user1@example.com, user2@example.com"
              value={collaboratorEmails}
              onChange={(e) => setCollaboratorEmails(e.target.value)}
            />
            <div className="text-sm text-muted-foreground">
              Separate multiple emails with commas. They'll be able to access the project via the public link.
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateTeamProject}
            disabled={isLoading || !projectName.trim()}
          >
            {isLoading ? (
              <>Creating...</>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Create Team Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamProjectDialog;
