
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/contexts/SupabaseContext';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Collaborator {
  id: string;
  user_id: string;
  user_email: string;
  cursor_position: any;
  current_file_id: string | null;
  last_seen: string;
}

export interface FileChange {
  file_id: string;
  content: string;
  user_id: string;
  timestamp: number;
}

interface UseCollaborationProps {
  projectId: string;
  currentFileId?: string;
}

export const useCollaboration = ({ projectId, currentFileId }: UseCollaborationProps) => {
  const { user } = useSupabase();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Join project collaboration
  const joinProject = useCallback(async () => {
    if (!user || !projectId) return;

    try {
      const { error } = await supabase
        .from('project_collaborators')
        .upsert({
          project_id: projectId,
          user_id: user.id,
          user_email: user.email || '',
          current_file_id: currentFileId || null,
          last_seen: new Date().toISOString()
        });

      if (error) {
        console.error('Error joining project:', error);
      }
    } catch (error) {
      console.error('Error joining project:', error);
    }
  }, [user, projectId, currentFileId]);

  // Leave project collaboration
  const leaveProject = useCallback(async () => {
    if (!user || !projectId) return;

    try {
      await supabase
        .from('project_collaborators')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error leaving project:', error);
    }
  }, [user, projectId]);

  // Update presence
  const updatePresence = useCallback(async (fileId?: string, cursorPosition?: any) => {
    if (!user || !projectId) return;

    try {
      await supabase
        .from('project_collaborators')
        .update({
          current_file_id: fileId || null,
          cursor_position: cursorPosition || {},
          last_seen: new Date().toISOString()
        })
        .eq('project_id', projectId)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [user, projectId]);

  // Load collaborators
  const loadCollaborators = useCallback(async () => {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from('project_collaborators')
        .select('*')
        .eq('project_id', projectId)
        .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes

      if (error) {
        console.error('Error loading collaborators:', error);
        return;
      }

      setCollaborators(data || []);
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  }, [projectId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!projectId || !user) return;

    // Create channel for this project
    const projectChannel = supabase.channel(`project-${projectId}`);

    // Subscribe to collaborator changes
    projectChannel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_collaborators',
          filter: `project_id=eq.${projectId}`
        },
        () => {
          loadCollaborators();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        (payload) => {
          // Broadcast file changes to other users
          projectChannel.send({
            type: 'broadcast',
            event: 'file_change',
            payload: {
              files: payload.new.files,
              user_id: user.id,
              timestamp: Date.now()
            }
          });
        }
      )
      .on('broadcast', { event: 'file_change' }, (payload) => {
        // Handle incoming file changes from other users
        if (payload.payload.user_id !== user.id) {
          // Emit custom event for file changes
          window.dispatchEvent(new CustomEvent('collaboration-file-change', {
            detail: payload.payload
          }));
        }
      })
      .subscribe();

    setChannel(projectChannel);

    // Join the project
    joinProject();

    // Clean up on unmount
    return () => {
      leaveProject();
      projectChannel.unsubscribe();
    };
  }, [projectId, user, joinProject, leaveProject, loadCollaborators]);

  // Update presence when file changes
  useEffect(() => {
    updatePresence(currentFileId);
  }, [currentFileId, updatePresence]);

  // Load initial collaborators
  useEffect(() => {
    loadCollaborators();
  }, [loadCollaborators]);

  // Periodic presence update
  useEffect(() => {
    if (!user || !projectId) return;

    const interval = setInterval(() => {
      updatePresence(currentFileId);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [user, projectId, currentFileId, updatePresence]);

  const broadcastFileChange = useCallback((fileId: string, content: string) => {
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'file_change',
        payload: {
          file_id: fileId,
          content,
          user_id: user?.id,
          timestamp: Date.now()
        }
      });
    }
  }, [channel, user]);

  return {
    collaborators: collaborators.filter(c => c.user_id !== user?.id), // Exclude current user
    updatePresence,
    broadcastFileChange,
    joinProject,
    leaveProject
  };
};
