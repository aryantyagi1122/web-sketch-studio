
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useProject } from '@/contexts/ProjectContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { toast } from 'sonner';
import { ArrowLeft, Trash2, RotateCcw, Search, AlertTriangle } from 'lucide-react';
import { Project } from '@/types/project';
import SEOHead from '@/components/SEOHead';
import { seoConfig } from '@/config/seo';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel, 
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Trash = () => {
  const navigate = useNavigate();
  const { user } = useSupabase();
  const { trashedProjects, loadTrashedProjects, restoreProject, permanentDeleteProject } = useProject();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadTrashedProjects();
    }
  }, [user, loadTrashedProjects]);

  const filteredProjects = trashedProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRestore = async (projectId: string) => {
    await restoreProject(projectId);
  };

  const handlePermanentDelete = async (projectId: string) => {
    await permanentDeleteProject(projectId);
  };

  const handleEmptyTrash = async () => {
    if (user && trashedProjects.length > 0) {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('trashed_projects' as any)
          .delete()
          .eq('user_id', user.id);
        
        loadTrashedProjects();
        toast.success('Trash emptied successfully!');
      } catch (error) {
        console.error('Error emptying trash:', error);
        toast.error('Failed to empty trash');
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <>
      <SEOHead
        title={seoConfig.pages.trash.title}
        description={seoConfig.pages.trash.description}
        canonicalUrl={`${seoConfig.siteUrl}/trash`}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/')}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold">Trash</h1>
            </div>
            {filteredProjects.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Empty Trash
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Empty Trash</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete all projects in trash? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-500 hover:bg-red-600"
                      onClick={handleEmptyTrash}
                    >
                      Empty Trash
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h2 className="text-xl font-semibold">Deleted Projects</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search deleted projects..." 
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Projects in trash will be automatically deleted after 30 days. You can restore them anytime before that.
            </p>

            <Separator className="my-4" />

            {filteredProjects.length > 0 ? (
              <div className="space-y-4">
                {filteredProjects.map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{project.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{project.description || 'No description'}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          Deleted {formatDate(project.deletedAt)} • {project.files.length} files
                        </p>
                      </div>
                      <div className="flex space-x-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRestore(project.id)}
                          className="flex items-center flex-1 sm:flex-none"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Restore
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="flex-1 sm:flex-none"
                            >
                              Delete Forever
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Permanently Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete "{project.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handlePermanentDelete(project.id)}
                              >
                                Delete Forever
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Trash2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Trash is Empty</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'No matching deleted projects found.' : 'You have no deleted projects.'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              <h2 className="text-lg font-semibold">About Deletion</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              When you delete a project, it's moved to the trash where it stays for 30 days before being automatically deleted. 
              You can restore projects from the trash at any time during this period.
            </p>
            
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
              <li>Deleted projects don't count towards your storage quota</li>
              <li>Project previews are disabled for items in trash</li>
              <li>Collaborators won't have access to deleted projects</li>
              <li>Once permanently deleted, projects cannot be recovered</li>
              <li>Trash is automatically emptied after 30 days</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trash;
