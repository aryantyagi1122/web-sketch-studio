
import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Share, Copy, Check } from 'lucide-react';
import { Project } from '@/types/project';

interface ShareProjectDialogProps {
  project: Project;
  onClose: () => void;
}

const ShareProjectDialog: React.FC<ShareProjectDialogProps> = ({ project, onClose }) => {
  const { toggleProjectVisibility } = useProject();
  const { user } = useSupabase();
  const [isPublic, setIsPublic] = useState(project.isPublic || project.is_public || false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://webeditor.shopingers.in/editor/${project.id}`;
  const previewUrl = `https://webeditor.shopingers.in/preview/${project.slug}`;

  const handleTogglePublic = async () => {
    const projectUserId = project.user_id || (project as any).userId;
    if (!user || projectUserId !== user.id) {
      toast.error('You can only share your own projects');
      return;
    }

    setIsLoading(true);
    try {
      await toggleProjectVisibility(project.id, !isPublic);
      setIsPublic(!isPublic);
      toast.success(isPublic ? 'Project is now private' : 'Project is now public');
    } catch (error) {
      console.error('Error updating project visibility:', error);
      toast.error('Failed to update project visibility');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${type} link copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share size={20} />
            Share "{project.name}"
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Access</Label>
              <div className="text-sm text-muted-foreground">
                Allow anyone with the link to view and edit this project
              </div>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
              disabled={isLoading || (project.user_id || (project as any).userId) !== user?.id}
            />
          </div>

          {isPublic && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Editor Link (Full Access)</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(shareUrl, 'Editor')}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Collaborators can edit the project in real-time
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preview Link (View Only)</Label>
                <div className="flex gap-2">
                  <Input
                    value={previewUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(previewUrl, 'Preview')}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  View-only access to see the project output
                </div>
              </div>
            </div>
          )}

          {!isPublic && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Enable public access to generate shareable links
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProjectDialog;
