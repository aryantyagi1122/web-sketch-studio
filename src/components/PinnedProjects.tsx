
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import ProjectList from './ProjectList';
import { Project } from '@/types/project';
import { Star, RefreshCw, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PinnedProjects: React.FC = () => {
  const { user, getUserPinnedProjects } = useSupabase();
  const [pinnedProjects, setPinnedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadPinnedProjects = async () => {
    if (!user) {
      setPinnedProjects([]);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading pinned projects...');
      const projects = await getUserPinnedProjects();
      console.log('Loaded pinned projects:', projects);
      setPinnedProjects(projects);
    } catch (error) {
      console.error('Error loading pinned projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load pinned projects when component mounts and when user changes
  useEffect(() => {
    console.log('PinnedProjects component mounted or user changed');
    loadPinnedProjects();
  }, [user]);

  const handleRefresh = async () => {
    console.log('Refreshing pinned projects...');
    await loadPinnedProjects();
  };

  if (!user) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Star size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Login to Pin Projects</h3>
        <p className="text-gray-600 mb-4">
          Create an account or login to pin your favorite projects for quick access.
        </p>
        <p className="text-sm text-gray-500">
          Pinned projects will appear here for easy access.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading pinned projects...</p>
      </div>
    );
  }

  if (pinnedProjects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Pin size={48} className="mx-auto text-yellow-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Pinned Projects</h3>
        <p className="text-gray-600 mb-4">
          Pin your favorite projects to access them quickly from this section.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Use the pin icon in any project (yours or community projects) to pin them here.
        </p>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <Pin size={24} className="mr-2 text-yellow-500" />
            Pinned Projects
          </h2>
          <p className="text-gray-600">
            Quick access to your favorite projects ({pinnedProjects.length} pinned)
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <ProjectList 
        projects={pinnedProjects} 
        viewType="grid" 
        showPinOption={true}
        onPinToggle={handleRefresh}
      />
    </div>
  );
};

export default PinnedProjects;
