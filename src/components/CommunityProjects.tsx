
import React, { useEffect, useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import ProjectList from './ProjectList';
import { Project, FileType } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Search, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CommunityProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function to safely parse project files from Json
  const parseProjectFiles = (files: any) => {
    try {
      if (Array.isArray(files)) {
        return files.map(file => ({
          id: typeof file === 'object' && file?.id ? String(file.id) : '',
          name: typeof file === 'object' && file?.name ? String(file.name) : '',
          content: typeof file === 'object' && file?.content ? String(file.content) : '',
          type: (typeof file === 'object' && file?.type && ['html', 'css', 'js'].includes(file.type) ? file.type : 'js') as FileType
        }));
      }
      return [];
    } catch (error) {
      console.error('Error parsing project files:', error);
      return [];
    }
  };

  const loadCommunityProjects = async () => {
    try {
      setLoading(true);
      
      // Fetch all public projects from all users
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading community projects:', error);
        toast.error('Failed to load community projects');
        return;
      }

      const communityProjects: Project[] = (data || []).map(project => ({
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

      console.log("Community projects loaded:", communityProjects);
      setProjects(communityProjects);
      setFilteredProjects(communityProjects);
    } catch (error) {
      console.error('Error loading community projects:', error);
      toast.error('Failed to load community projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunityProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.userEmail && project.userEmail.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const handlePinToggle = () => {
    // Refresh community projects when a pin is toggled
    // This ensures the UI reflects the latest state
    setTimeout(() => {
      loadCommunityProjects();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Projects</h2>
          <p className="text-gray-600 mt-1">Discover and pin amazing projects created by our community</p>
        </div>
        {projects.length > 0 && (
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search community projects..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading community projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <Globe size={64} className="mx-auto text-blue-400 mb-6" />
          <h3 className="text-2xl font-semibold mb-3 text-gray-900">No Community Projects Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Be the first to share your project with the community! Make your project public to showcase your work.
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">No Projects Found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <ProjectList 
            projects={filteredProjects} 
            viewType="grid" 
            showPinOption={true}
            onPinToggle={handlePinToggle}
          />
        </div>
      )}
    </div>
  );
};

export default CommunityProjects;
