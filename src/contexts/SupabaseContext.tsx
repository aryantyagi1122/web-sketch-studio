import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Project, ProjectFile } from '@/types/project';
import { toast } from 'sonner';

interface SupabaseContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  saveProject: (project: Project) => Promise<void>;
  getUserProjects: () => Promise<Project[]>;
  deleteProject: (projectId: string) => Promise<void>;
  getPublicProject: (slug: string) => Promise<Project | null>;
  toggleProjectVisibility: (projectId: string, isPublic: boolean) => Promise<void>;
  getPublicProjectUrl: (slug: string) => string;
  incrementViewCount: (projectId: string) => Promise<void>;
  toggleProjectPin: (projectId: string) => Promise<void>;
  getUserPinnedProjects: () => Promise<Project[]>;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Sign in response:', { data, error });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else {
          toast.error(`Sign in failed: ${error.message}`);
        }
        throw error;
      }
      
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign up with email:', email);
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      console.log('Sign up response:', { data, error });
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please try signing in instead.');
        } else {
          toast.error(`Registration failed: ${error.message}`);
        }
        throw error;
      }
      
      if (data.user && !data.session) {
        toast.success('Registration successful! Please check your email and click the confirmation link to complete your account setup.');
      } else {
        toast.success('Account created successfully');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Use Supabase dashboard-configured callback URL for Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });

      if (error) {
        toast.error(`Google sign in failed: ${error.message}`);
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out');
      throw error;
    }
  };

  const parseProjectFiles = (files: any): ProjectFile[] => {
    try {
      if (Array.isArray(files)) {
        return files.map(file => ({
          id: file.id || '',
          name: file.name || '',
          content: file.content || '',
          type: file.type || 'js'
        }));
      }
      return [];
    } catch (error) {
      console.error('Error parsing project files:', error);
      return [];
    }
  };

  const saveProject = async (project: Project) => {
    if (!user) {
      toast.error('You must be logged in to save projects');
      return;
    }

    try {
      const projectData = {
        id: project.id,
        name: project.name,
        description: project.description,
        type: project.type,
        files: project.files as any,
        user_id: user.id,
        user_email: user.email,
        is_public: project.isPublic || false,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('projects')
        .upsert(projectData);

      if (error) throw error;
      toast.success('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
      throw error;
    }
  };

  const getUserProjects = async (): Promise<Project[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description || '',
        type: project.type as 'single' | 'multiple',
        files: parseProjectFiles(project.files),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        isPublic: project.is_public,
        slug: project.slug,
        viewCount: project.view_count || 0
      }));
    } catch (error) {
      console.error('Error getting projects:', error);
      toast.error('Failed to load projects');
      return [];
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete projects');
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      throw error;
    }
  };

  const getPublicProject = async (slug: string): Promise<Project | null> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        type: data.type as 'single' | 'multiple',
        files: parseProjectFiles(data.files),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isPublic: data.is_public,
        slug: data.slug,
        viewCount: data.view_count || 0,
        userEmail: data.user_email
      };
    } catch (error) {
      console.error('Error getting public project:', error);
      return null;
    }
  };

  const toggleProjectVisibility = async (projectId: string, isPublic: boolean) => {
    if (!user) {
      toast.error('You must be logged in to change project visibility');
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_public: isPublic })
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success(isPublic ? 'Project is now public' : 'Project is now private');
    } catch (error) {
      console.error('Error updating project visibility:', error);
      toast.error('Failed to update project visibility');
      throw error;
    }
  };

  const getPublicProjectUrl = (slug: string): string => {
    return `https://webeditor.shopingers.in/preview/${slug}`;
  };

  const incrementViewCount = async (projectId: string) => {
    try {
      const { data: currentProject, error: fetchError } = await supabase
        .from('projects')
        .select('view_count')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        console.error('Error fetching current view count:', fetchError);
        return;
      }

      const newViewCount = (currentProject.view_count || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('projects')
        .update({ view_count: newViewCount })
        .eq('id', projectId);

      if (updateError) {
        console.error('Error incrementing view count:', updateError);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const toggleProjectPin = async (projectId: string) => {
    if (!user) {
      toast.error('You must be logged in to pin projects');
      return;
    }

    try {
      // Check if project is already pinned
      const { data: existingPin, error: fetchError } = await supabase
        .from('user_pins')
        .select('id')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingPin) {
        // Unpin the project
        const { error: deleteError } = await supabase
          .from('user_pins')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', projectId);

        if (deleteError) throw deleteError;
        toast.success('Project unpinned!');
      } else {
        // Pin the project
        const { error: insertError } = await supabase
          .from('user_pins')
          .insert({
            user_id: user.id,
            project_id: projectId
          });

        if (insertError) throw insertError;
        toast.success('Project pinned!');
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to update pin status');
      throw error;
    }
  };

  const getUserPinnedProjects = async (): Promise<Project[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_pins')
        .select(`
          project_id,
          projects (
            id,
            name,
            description,
            type,
            files,
            created_at,
            updated_at,
            is_public,
            slug,
            view_count,
            user_email
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data
        .filter(pin => pin.projects)
        .map(pin => {
          const project = pin.projects as any;
          return {
            id: project.id,
            name: project.name,
            description: project.description || '',
            type: project.type as 'single' | 'multiple',
            files: parseProjectFiles(project.files),
            createdAt: project.created_at,
            updatedAt: project.updated_at,
            isPublic: project.is_public,
            slug: project.slug,
            viewCount: project.view_count || 0,
            userEmail: project.user_email,
            isPinned: true
          };
        });
    } catch (error) {
      console.error('Error getting pinned projects:', error);
      toast.error('Failed to load pinned projects');
      return [];
    }
  };

  return (
    <SupabaseContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      saveProject,
      getUserProjects,
      deleteProject,
      getPublicProject,
      toggleProjectVisibility,
      getPublicProjectUrl,
      incrementViewCount,
      toggleProjectPin,
      getUserPinnedProjects
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
