import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import ProjectList from '@/components/ProjectList';
import { Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const TeamProjects: React.FC = () => {
  const { user } = useSupabase();
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (user) {
      loadTeamProjects();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadTeamProjects = async () => {
    try {
      setLoading(true);
      
      // Get all public projects that are team projects (public + empty description)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .eq('description', '')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const projects = data.map(project => ({
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
        userEmail: project.user_email
      }));

      setTeamProjects(projects);
    } catch (error) {
      console.error('Error loading team projects:', error);
      toast.error('Failed to load team projects');
    } finally {
      setLoading(false);
    }
  };

  const parseProjectFiles = (files: any) => {
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

  if (!user) {
    return (
      <div className="text-center p-6 sm:p-8 bg-white rounded-lg border border-gray-200">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Login to View Team Projects</h3>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          Sign in to discover and collaborate on team projects created by other developers.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-6 sm:p-8 bg-white rounded-lg border border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Loading team projects...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-500" />
          <h2 className="text-lg md:text-xl font-semibold">Team Projects</h2>
          <span className="text-sm text-gray-500">({teamProjects.length} projects)</span>
        </div>
        <div className="flex gap-1 md:gap-2">
          <button 
            onClick={() => setViewType('grid')}
            className={`px-3 py-1 text-sm rounded border ${
              viewType === 'grid' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewType('list')}
            className={`px-3 py-1 text-sm rounded border ${
              viewType === 'list' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {teamProjects.length === 0 ? (
        <div className="text-center p-6 sm:p-8 bg-white rounded-lg border border-gray-200">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No Team Projects Found</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            There are no team projects available yet. Create a team project to start collaborating!
          </p>
        </div>
      ) : (
        <ProjectList 
          viewType={viewType} 
          projects={teamProjects}
          showTeamBadge={true}
        />
      )}
    </div>
  );
};

export default TeamProjects;
