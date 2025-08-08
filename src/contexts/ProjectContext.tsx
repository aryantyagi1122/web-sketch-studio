
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectFile, FileType, ProjectType } from '@/types/project';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useSupabase } from './SupabaseContext';

interface ProjectContextType {
  projects: Project[];
  trashedProjects: Project[];
  currentProject: Project | null;
  currentFile: ProjectFile | null;
  setCurrentFile: (file: ProjectFile | null) => void;
  createProject: (name: string, description: string, type: ProjectType) => void;
  saveProject: () => void;
  updateFile: (fileId: string, content: string) => void;
  addFile: (name: string, type: FileType) => void;
  removeFile: (fileId: string) => void;
  openProject: (projectId: string) => void;
  previewProject: (specificFile?: string) => void;
  getHtmlContent: (specificHtmlFile?: string | null) => string;
  loadProjects: () => Promise<void>;
  loadTrashedProjects: () => Promise<void>;
  deleteProject: (projectId: string) => void;
  restoreProject: (projectId: string) => void;
  permanentDeleteProject: (projectId: string) => void;
  toggleProjectVisibility: (projectId: string, isPublic: boolean) => void;
  toggleProjectPin: (projectId: string) => void;
  getPublicShareUrl: (project: Project) => string | null;
  checkIfProjectIsPinned: (projectId: string) => Promise<boolean>;
  loadProjectById: (projectId: string) => Promise<Project | null>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const defaultFiles: ProjectFile[] = [
  {
    id: uuidv4(),
    name: 'index.html',
    content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Web Sketch</title>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <!-- CSS files will be injected here -->\n</head>\n<body>\n  <h1>Hello Web Sketch Studio!</h1>\n  <p>Start editing to see some magic happen 🪄</p>\n  <p><a href="about.html">About Us</a></p>\n  \n  <!-- JS files will be injected here -->\n</body>\n</html>',
    type: 'html'
  },
  {
    id: uuidv4(),
    name: 'about.html',
    content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>About Us - Web Sketch</title>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <!-- CSS files will be injected here -->\n</head>\n<body>\n  <h1>About Us</h1>\n  <p>This is the about page of Web Sketch Studio.</p>\n  <p><a href="index.html">Back to Home</a></p>\n  \n  <!-- JS files will be injected here -->\n</body>\n</html>',
    type: 'html'
  },
  {
    id: uuidv4(),
    name: 'styles.css',
    content: 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f7f7f7;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  color: #666;\n}\n\na {\n  color: #0066cc;\n  text-decoration: none;\n}\n\na:hover {\n  text-decoration: underline;\n}',
    type: 'css'
  },
  {
    id: uuidv4(),
    name: 'script.js',
    content: 'console.log("Hello from Web Sketch Studio!");\n\n// Your JavaScript code goes here',
    type: 'js'
  }
];

const getFileTypeFromName = (fileName: string): FileType => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'html' || extension === 'htm') return 'html';
  if (extension === 'css') return 'css';
  if (extension === 'js') return 'js';
  
  return 'js';
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [trashedProjects, setTrashedProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentFile, setCurrentFile] = useState<ProjectFile | null>(null);
  
  const { 
    user, 
    loading,
    saveProject: saveProjectToSupabase, 
    getUserProjects, 
    deleteProject: deleteProjectFromSupabase, 
    toggleProjectVisibility: toggleVisibility, 
    getPublicProjectUrl,
    toggleProjectPin: togglePinInSupabase,
    getPublicProject
  } = useSupabase();

  useEffect(() => {
    if (user) {
      loadProjects();
      loadTrashedProjects();
    } else {
      const savedProjects = localStorage.getItem('web-sketch-projects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user && projects.length > 0) {
      localStorage.setItem('web-sketch-projects', JSON.stringify(projects));
    }
  }, [projects, user]);

  useEffect(() => {
    if (currentProject && currentProject.files.length > 0 && !currentFile) {
      setCurrentFile(currentProject.files[0]);
    }
  }, [currentProject, currentFile]);

  // Show loading while Supabase auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const loadProjectById = async (projectId: string): Promise<Project | null> => {
    try {
      const existingProject = projects.find(p => p.id === projectId);
      if (existingProject) {
        return existingProject;
      }

      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error loading project by ID:', error);
        return null;
      }

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

      const project: Project = {
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

      setCurrentProject(project);
      setCurrentFile(project.files[0] || null);
      
      return project;
    } catch (error) {
      console.error('Error loading project by ID:', error);
      return null;
    }
  };

  const loadProjects = async () => {
    if (user) {
      try {
        const userProjects = await getUserProjects();
        console.log('Loaded projects from backend:', userProjects);
        setProjects(userProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast.error('Failed to load projects');
      }
    } else {
      const savedProjects = localStorage.getItem('web-sketch-projects');
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects);
          console.log('Loaded projects from localStorage:', parsedProjects);
          setProjects(parsedProjects);
        } catch (error) {
          console.error('Error parsing localStorage projects:', error);
          setProjects([]);
        }
      }
    }
  };

  const loadTrashedProjects = async () => {
    if (user) {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase
          .from('trashed_projects' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('deleted_at', { ascending: false });

        if (error) {
          console.error('Error loading trashed projects:', error);
          return;
        }

        const trashedProjects = data?.map((project: any) => ({
          id: project.project_id,
          name: project.project_data.name,
          description: project.project_data.description || '',
          type: project.project_data.type,
          files: project.project_data.files || [],
          createdAt: project.project_data.created_at,
          updatedAt: project.project_data.updated_at,
          deletedAt: project.deleted_at,
          isPublic: false,
          userEmail: user.email
        })) || [];

        setTrashedProjects(trashedProjects);
      } catch (error) {
        console.error('Error loading trashed projects:', error);
      }
    }
  };

  const createProject = (name: string, description: string, type: ProjectType) => {
    const projectId = uuidv4();
    const newProject: Project = {
      id: projectId,
      name,
      description,
      files: [...defaultFiles],
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      isPinned: false
    };

    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    setCurrentFile(newProject.files[0]);
    toast.success('Project created successfully!');
    
    localStorage.setItem('currentProjectId', newProject.id);

    if (user) {
      saveProjectToSupabase(newProject);
    }
  };

  const saveProject = async () => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        updatedAt: new Date().toISOString()
      };

      const updatedProjects = projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      );

      setProjects(updatedProjects);
      setCurrentProject(updatedProject);
      
      if (user) {
        await saveProjectToSupabase(updatedProject);
      } else {
        localStorage.setItem('web-sketch-projects', JSON.stringify(updatedProjects));
        toast.success('Project saved locally');
      }
    }
  };

  const updateFile = (fileId: string, content: string) => {
    if (currentProject) {
      const updatedFiles = currentProject.files.map(file => 
        file.id === fileId ? { ...file, content } : file
      );

      const updatedProject = {
        ...currentProject,
        files: updatedFiles,
        updatedAt: new Date().toISOString()
      };

      setCurrentProject(updatedProject);
      
      if (currentFile && currentFile.id === fileId) {
        setCurrentFile({ ...currentFile, content });
      }
    }
  };

  const addFile = (name: string, type: FileType) => {
    if (currentProject) {
      if (currentProject.files.some(file => file.name === name)) {
        toast.error('A file with that name already exists!');
        return;
      }

      const fileType = type || getFileTypeFromName(name);

      const newFile: ProjectFile = {
        id: uuidv4(),
        name,
        content: '',
        type: fileType
      };

      const updatedProject = {
        ...currentProject,
        files: [...currentProject.files, newFile],
        updatedAt: new Date().toISOString()
      };

      setCurrentProject(updatedProject);
      setCurrentFile(newFile);
      toast.success(`File ${name} created successfully!`);
    }
  };

  const removeFile = (fileId: string) => {
    if (currentProject) {
      if (currentProject.files.length <= 1) {
        toast.error("You can't remove the last file!");
        return;
      }

      const updatedFiles = currentProject.files.filter(file => file.id !== fileId);
      
      const updatedProject = {
        ...currentProject,
        files: updatedFiles,
        updatedAt: new Date().toISOString()
      };

      setCurrentProject(updatedProject);
      
      if (currentFile && currentFile.id === fileId) {
        setCurrentFile(updatedFiles[0]);
      }

      toast.success('File removed successfully!');
    }
  };

  const openProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      setCurrentFile(project.files[0]);
    }
  };

  const getHtmlContent = (specificHtmlFile?: string | null) => {
    if (!currentProject) return '';

    let mainHtmlFile: ProjectFile | undefined;
    
    if (specificHtmlFile) {
      mainHtmlFile = currentProject.files.find(file => 
        file.type === 'html' && file.name === specificHtmlFile
      );
    }
    
    if (!mainHtmlFile) {
      const htmlFiles = currentProject.files.filter(file => file.type === 'html');
      mainHtmlFile = htmlFiles.find(file => file.name.toLowerCase() === 'index.html') || htmlFiles[0];
    }
    
    if (!mainHtmlFile) {
      return `<!DOCTYPE html>
<html>
<head>
  <title>Web Sketch</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${generateStyleTags(currentProject.files)}
</head>
<body>
  <p>No HTML file found. Create an HTML file to see your content.</p>
  ${generateScriptTags(currentProject.files)}
</body>
</html>`;
    }

    let htmlContent = mainHtmlFile.content;
    const cssFiles = currentProject.files.filter(file => file.type === 'css');
    const jsFiles = currentProject.files.filter(file => file.type === 'js');

    if (cssFiles.length > 0) {
      const styleTags = generateStyleTags(cssFiles);
      
      if (htmlContent.includes('<!-- CSS files will be injected here -->')) {
        htmlContent = htmlContent.replace('<!-- CSS files will be injected here -->', styleTags);
      } else if (htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('</head>', `${styleTags}\n</head>`);
      } else {
        htmlContent = `<head>${styleTags}</head>${htmlContent}`;
      }
    }

    if (jsFiles.length > 0) {
      const scriptTags = generateScriptTags(jsFiles);
      
      if (htmlContent.includes('<!-- JS files will be injected here -->')) {
        htmlContent = htmlContent.replace('<!-- JS files will be injected here -->', scriptTags);
      } else if (htmlContent.includes('</body>')) {
        htmlContent = htmlContent.replace('</body>', `${scriptTags}\n</body>`);
      } else {
        htmlContent = `${htmlContent}\n${scriptTags}`;
      }
    }

    return htmlContent;
  };

  const generateStyleTags = (files: ProjectFile[]) => {
    const cssFiles = files.filter(file => file.type === 'css');
    return cssFiles.map(file => 
      `<style data-file="${file.name}">\n${file.content}\n</style>`
    ).join('\n');
  };

  const generateScriptTags = (files: ProjectFile[]) => {
    const jsFiles = files.filter(file => file.type === 'js');
    return jsFiles.map(file => 
      `<script data-file="${file.name}">\n${file.content}\n</script>`
    ).join('\n');
  };

  const previewProject = (specificFile?: string) => {
    const htmlContent = getHtmlContent(specificFile);
    
    if (htmlContent) {
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.open();
        previewWindow.document.write(htmlContent);
        previewWindow.document.close();
      } else {
        toast.error("Unable to open preview window. Please check your popup blocker settings.");
      }
    } else {
      toast.error("No content to preview. Create some files first!");
    }
  };

  const deleteProject = async (projectId: string) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    
    if (!projectToDelete) {
      toast.error("Project not found!");
      return;
    }
    
    if (user) {
      try {
        // Move to trash instead of permanent delete
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('trashed_projects' as any).insert({
          user_id: user.id,
          project_id: projectId,
          project_data: projectToDelete as any
        });
        
        await deleteProjectFromSupabase(projectId);
        loadTrashedProjects();
      } catch (error) {
        console.error('Error moving project to trash:', error);
        toast.error('Failed to delete project');
        return;
      }
    }
    
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject(null);
      setCurrentFile(null);
    }
    
    if (!user) {
      localStorage.setItem('web-sketch-projects', JSON.stringify(updatedProjects));
    }
    
    toast.success("Project moved to trash");
  };

  const restoreProject = async (projectId: string) => {
    const projectToRestore = trashedProjects.find(p => p.id === projectId);
    
    if (!projectToRestore) {
      toast.error("Project not found in trash!");
      return;
    }
    
    if (user) {
      try {
        // Restore from trash
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('projects').insert({
          id: projectToRestore.id,
          user_id: user.id,
          name: projectToRestore.name,
          description: projectToRestore.description,
          type: projectToRestore.type,
          files: projectToRestore.files as any,
          is_public: false,
          user_email: user.email
        });
        
        // Remove from trash
        await supabase.from('trashed_projects' as any)
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id);
        
        loadProjects();
        loadTrashedProjects();
      } catch (error) {
        console.error('Error restoring project:', error);
        toast.error('Failed to restore project');
        return;
      }
    }
    
    toast.success("Project restored successfully!");
  };

  const permanentDeleteProject = async (projectId: string) => {
    if (user) {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('trashed_projects' as any)
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id);
        
        loadTrashedProjects();
      } catch (error) {
        console.error('Error permanently deleting project:', error);
        toast.error('Failed to permanently delete project');
        return;
      }
    }
    
    const updatedTrashedProjects = trashedProjects.filter(p => p.id !== projectId);
    setTrashedProjects(updatedTrashedProjects);
    
    toast.success("Project permanently deleted!");
  };

  const toggleProjectVisibility = async (projectId: string, isPublic: boolean) => {
    if (!user) {
      toast.error('You must be logged in to share projects');
      return;
    }

    await toggleVisibility(projectId, isPublic);
    
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, isPublic } : p
    );
    setProjects(updatedProjects);
    
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject({ ...currentProject, isPublic });
    }
  };

  const toggleProjectPin = async (projectId: string) => {
    if (!user) {
      toast.error('You must be logged in to pin projects');
      return;
    }

    try {
      await togglePinInSupabase(projectId);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const checkIfProjectIsPinned = async (projectId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('user_pins')
        .select('id')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking pin status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking pin status:', error);
      return false;
    }
  };

  const getPublicShareUrl = (project: Project): string | null => {
    if (!project.isPublic) return null;
    return `https://webeditor.shopingers.in/editor/${project.id}`;
  };

  const value = {
    projects,
    trashedProjects,
    currentProject,
    currentFile,
    setCurrentFile,
    createProject,
    saveProject,
    updateFile,
    addFile,
    removeFile,
    openProject,
    previewProject,
    getHtmlContent,
    loadProjects,
    loadTrashedProjects,
    deleteProject,
    restoreProject,
    permanentDeleteProject,
    toggleProjectVisibility,
    toggleProjectPin,
    getPublicShareUrl,
    checkIfProjectIsPinned,
    loadProjectById
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
