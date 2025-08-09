import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useCollaboration } from '@/hooks/useCollaboration';
import FileTabs from '@/components/FileTabs';
import CodeEditor from '@/components/CodeEditor';
import Preview from '@/components/Preview';
import CollaboratorPresence from '@/components/CollaboratorPresence';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';
import { Save, ExternalLink, ArrowLeft, LayoutPanelLeft, Code, FileSymlink, Play, Eye, Lock, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Editor: React.FC = () => {
  const { projectId, category, projectName } = useParams<{ 
    projectId?: string; 
    category?: string; 
    projectName?: string; 
  }>();
  const navigate = useNavigate();
  const { projects, currentProject, currentFile, saveProject, previewProject, openProject, loadProjectById } = useProject();
  const { user, incrementViewCount } = useSupabase();
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [activeView, setActiveView] = useState<'editor' | 'preview' | 'both'>('both');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const isMobile = useIsMobile();

  // Initialize collaboration
  const { collaborators, updatePresence } = useCollaboration({
    projectId: projectId || '',
    currentFileId: currentFile?.id
  });

  useEffect(() => {
    if (isMobile) {
      setActiveView('editor');
    } else {
      setActiveView('both');
    }
  }, [isMobile]);

  useEffect(() => {
    if (projectId && (!currentProject || currentProject.id !== projectId)) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        openProject(projectId);
        
        // Check if user is the owner of the project
        const isOwner = user && project.userEmail === user.email;
        setIsReadOnly(!isOwner);
        
        // Increment view count if it's not the owner viewing
        if (!isOwner) {
          incrementViewCount(projectId);
        }
      } else {
        // Try to load the project from the database (could be a public project)
        loadProjectById(projectId).then((loadedProject) => {
          if (loadedProject) {
            const isOwner = user && loadedProject.userEmail === user.email;
            setIsReadOnly(!isOwner);
            
            // Increment view count if it's not the owner viewing
            if (!isOwner) {
              incrementViewCount(projectId);
            }
          } else {
            navigate('/');
          }
        });
      }
    }
  }, [projectId, currentProject, projects, navigate, openProject, user, incrementViewCount, loadProjectById]);

  if (!currentProject || !currentFile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const handlePreviewCurrentFile = () => {
    if (currentFile?.type === 'html') {
      previewProject(currentFile.name);
    } else {
      toast.info("Only HTML files can be directly previewed. Using index.html as base.");
      previewProject();
    }
  };

  const handleOpenPreview = () => {
    previewProject();
  };

  const handleSaveProject = () => {
    if (isReadOnly) {
      toast.error("You can't save changes to this project. Only the owner can make changes.");
      return;
    }
    saveProject();
  };

  const handleCopyProjectUrl = async () => {
    const projectUrl = `https://webeditor.shopingers.in/editor/${currentProject.id}`;
    try {
      await navigator.clipboard.writeText(projectUrl);
      toast.success('Project URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy URL');
    }
  };

  const renderContent = () => {
    if (isMobile) {
      return (
        <Tabs defaultValue="editor" className="w-full h-full">
          <TabsList className="w-full">
            <TabsTrigger 
              value="editor" 
              className="flex-1"
              onClick={() => setActiveView('editor')}
            >
              <Code size={16} className="mr-2" />
              {isReadOnly ? 'View' : 'Editor'}
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="flex-1"
              onClick={() => setActiveView('preview')}
            >
              <ExternalLink size={16} className="mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="h-[calc(100vh-160px)] overflow-hidden">
            {currentFile && <CodeEditor file={currentFile} readOnly={isReadOnly} />}
          </TabsContent>
          <TabsContent value="preview" className="h-[calc(100vh-160px)] overflow-hidden bg-white">
            <Preview />
          </TabsContent>
        </Tabs>
      );
    }

    switch (activeView) {
      case 'editor':
        return (
          <div className="h-full overflow-hidden bg-editor-bg">
            {currentFile && <CodeEditor file={currentFile} readOnly={isReadOnly} />}
          </div>
        );
      case 'preview':
        return (
          <div className="h-full overflow-hidden bg-white">
            <Preview />
          </div>
        );
      case 'both':
      default:
        return (
          <ResizablePanelGroup
            direction={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
            className="h-full"
          >
            <ResizablePanel defaultSize={50} className="h-full overflow-hidden bg-editor-bg">
              {currentFile && <CodeEditor file={currentFile} readOnly={isReadOnly} />}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} className="h-full overflow-hidden bg-white">
              <Preview />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="p-2 bg-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-xl font-bold truncate max-w-[150px] md:max-w-xs">{currentProject?.name}</h1>
          {isReadOnly && (
            <div className="ml-2 flex items-center">
              <Lock size={14} className="mr-1" />
              <span className="text-xs bg-gray-600 px-2 py-0.5 rounded-full">Read Only</span>
            </div>
          )}
          {currentProject?.type === 'single' && (
            <span className="ml-2 text-xs bg-blue-500 px-2 py-0.5 rounded-full">Single File</span>
          )}
          {currentProject?.type === 'multiple' && (
            <span className="ml-2 text-xs bg-indigo-500 px-2 py-0.5 rounded-full">Multiple Files</span>
          )}
          
          {/* Collaborator Presence */}
          <div className="ml-4">
            <CollaboratorPresence 
              collaborators={collaborators} 
              currentFileId={currentFile?.id}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-2">
          {!isMobile && (
            <>
              <Button 
                size="sm"
                onClick={() => setActiveView('editor')}
                className={`bg-blue-800 hover:bg-blue-700 text-white border-none ${
                  activeView === 'editor' ? 'bg-blue-600 hover:bg-blue-500' : ''
                }`}
              >
                {isReadOnly ? <Eye size={16} className="mr-1 md:mr-2" /> : <Code size={16} className="mr-1 md:mr-2" />}
                <span className="hidden md:inline">{isReadOnly ? 'View' : 'Editor'}</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => setActiveView('preview')}
                className={`bg-blue-800 hover:bg-blue-700 text-white border-none ${
                  activeView === 'preview' ? 'bg-blue-600 hover:bg-blue-500' : ''
                }`}
              >
                <ExternalLink size={16} className="mr-1 md:mr-2" />
                <span className="hidden md:inline">Preview</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => setActiveView('both')}
                className={`bg-blue-800 hover:bg-blue-700 text-white border-none ${
                  activeView === 'both' ? 'bg-blue-600 hover:bg-blue-500' : ''
                }`}
              >
                <LayoutPanelLeft size={16} className="mr-1 md:mr-2" />
                <span className="hidden md:inline">Split</span>
              </Button>
              <Button 
                size="sm"
                onClick={toggleOrientation}
                className="hidden md:flex bg-blue-800 hover:bg-blue-700 text-white border-none"
              >
                {orientation === 'horizontal' ? 'Split H' : 'Split V'}
              </Button>
            </>
          )}
          {currentFile?.type === 'html' && (
            <Button 
              size={isMobile ? "icon" : "sm"}
              onClick={handlePreviewCurrentFile}
              title={`Preview ${currentFile.name}`}
              className="bg-blue-800 hover:bg-blue-700 text-white border-none"
            >
              <Play size={18} />
              {!isMobile && <span className="ml-1">Run</span>}
            </Button>
          )}
          <Button 
            size={isMobile ? "icon" : "sm"}
            onClick={handleOpenPreview}
            className="bg-blue-800 hover:bg-blue-700 text-white border-none"
          >
            <FileSymlink size={18} />
            {!isMobile && <span className="ml-1">Open</span>}
          </Button>
          <Button 
            size={isMobile ? "icon" : "sm"}
            onClick={handleCopyProjectUrl}
            className="bg-blue-800 hover:bg-blue-700 text-white border-none"
            title="Copy project URL"
          >
            <Copy size={18} />
            {!isMobile && <span className="ml-1">Copy URL</span>}
          </Button>
          {!isReadOnly && (
            <Button 
              size={isMobile ? "icon" : "sm"}
              onClick={handleSaveProject}
              className="bg-blue-800 hover:bg-blue-700 text-white border-none"
            >
              <Save size={18} />
              {!isMobile && <span className="ml-1">Save</span>}
            </Button>
          )}
        </div>
      </div>

      {currentProject?.type === 'multiple' && <FileTabs readOnly={isReadOnly} />}

      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default Editor;
