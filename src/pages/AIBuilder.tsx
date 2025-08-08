import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/SEOHead';
import CodeEditor from '@/components/CodeEditor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Bot, 
  Sparkles, 
  Code, 
  Save, 
  ArrowLeft,
  FileText,
  Palette,
  Zap,
  LayoutPanelLeft,
  ExternalLink
} from 'lucide-react';
import { ProjectFile } from '@/types/project';

const AIBuilder = () => {
  const { user } = useSupabase();
  const { createProject } = useProject();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // AI Generation State
  const [projectName, setProjectName] = useState('Untitled Project');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Editor State
  const [files, setFiles] = useState<ProjectFile[]>([
    {
      id: '1',
      name: 'index.html',
      type: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Project</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
            margin: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 2rem;
            font-weight: 600;
            text-align: center;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
            font-size: 1rem;
            text-align: center;
        }
        .btn {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: box-shadow 0.2s, transform 0.2s;
            margin-top: 10px;
            font-weight: 500;
            letter-spacing: 0.05em;
            box-shadow: 0 4px 16px rgba(102,126,234,0.15);
            outline: none;
        }
        .btn:focus {
            box-shadow: 0 0 0 2px #667eea44;
        }
        .btn:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 8px 24px rgba(102,126,234,0.18);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 AI Builder</h1>
        <p>Welcome to your AI-generated project!<br />Use the prompt above to generate HTML, CSS, and JavaScript code with AI assistance.</p>
        <button class="btn" onclick="showAlert()">Get Started</button>
    </div>
    
    <script>
        function showAlert() {
            alert('Welcome to AI Builder! Generate amazing code with AI assistance.');
        }
    </script>
</body>
</html>`
    }
  ]);
  
  const [currentFile, setCurrentFile] = useState<ProjectFile>(files[0]);
  const [activeView, setActiveView] = useState<'editor' | 'preview' | 'both'>('both');

  useEffect(() => {
    if (isMobile) {
      setActiveView('editor');
    } else {
      setActiveView('both');
    }
    // Remove scrollbar from body
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile]);

  // Handle preview in new tab
  useEffect(() => {
    if (activeView === 'preview') {
      // Build the preview HTML with CSS/JS injection
      const htmlFile = files.find(f => f.type === 'html');
      const cssFiles = files.filter(f => f.type === 'css');
      const jsFiles = files.filter(f => f.type === 'js');
      if (!htmlFile) return;
      let htmlContent = htmlFile.content;

      if (cssFiles.length > 0) {
        const styleContent = cssFiles.map(f => f.content).join('\n');
        const styleTag = `<style>\n${styleContent}\n</style>`;
        if (htmlContent.includes('</head>')) {
          htmlContent = htmlContent.replace('</head>', `${styleTag}\n</head>`);
        } else {
          htmlContent = `<head>${styleTag}</head>${htmlContent}`;
        }
      }

      if (jsFiles.length > 0) {
        const scriptContent = jsFiles.map(f => f.content).join('\n');
        const scriptTag = `<script>\n${scriptContent}\n</script>`;
        if (htmlContent.includes('</body>')) {
          htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);
        } else {
          htmlContent = `${htmlContent}\n${scriptTag}`;
        }
      }

      // Open preview in new tab
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
      // Reset back to editor after opening preview (optional for better UX)
      setActiveView('editor');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView]);


  const handleGenerate = async () => {
    if (!user) {
      toast.error('Please login to use AI Builder');
      navigate('/auth');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { 
          prompt: prompt.trim(),
          type: 'html' // fixed to html type
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      const generatedCode = data.code;
      
      // Generate a meaningful filename
      const timestamp = Date.now();
      let filename = prompt.toLowerCase().includes('index') || prompt.toLowerCase().includes('main') || prompt.toLowerCase().includes('home') 
        ? 'index.html' 
        : `generated-${timestamp}.html`;

      // Check if file already exists and replace it, or create new one
      const existingFileIndex = files.findIndex(f => f.name === filename);
      
      const newFile: ProjectFile = {
        id: timestamp.toString(),
        name: filename,
        type: 'html',
        content: generatedCode
      };

      if (existingFileIndex !== -1) {
        // Replace existing file
        const updatedFiles = [...files];
        updatedFiles[existingFileIndex] = newFile;
        setFiles(updatedFiles);
        setCurrentFile(newFile);
      } else {
        // Add new file
        setFiles(prev => [...prev, newFile]);
        setCurrentFile(newFile);
      }

      setPrompt('');
      toast.success(`HTML code generated successfully!`);
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error(`Failed to generate code: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsProject = async () => {
    if (!user) {
      toast.error('Please login to save projects');
      navigate('/auth');
      return;
    }

    try {
      createProject("AI Generated Project", 'AI Generated Project', files.length > 1 ? 'multiple' : 'single');
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const updateFileContent = (content: string) => {
    setCurrentFile({ ...currentFile, content });
    // Update the files array
    const updatedFiles = files.map(file => 
      file.id === currentFile.id ? { ...file, content } : file
    );
    setFiles(updatedFiles);
  };

  // Preview is only used for split/editor view now
  const AIPreview = () => {
    const htmlFile = files.find(f => f.type === 'html');
    const cssFiles = files.filter(f => f.type === 'css');
    const jsFiles = files.filter(f => f.type === 'js');

    if (!htmlFile) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <p className="text-gray-500">No HTML file to preview</p>
        </div>
      );
    }

    let htmlContent = htmlFile.content;

    // Inject CSS
    if (cssFiles.length > 0) {
      const styleContent = cssFiles.map(f => f.content).join('\n');
      const styleTag = `<style>\n${styleContent}\n</style>`;
      
      if (htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('</head>', `${styleTag}\n</head>`);
      } else {
        htmlContent = `<head>${styleTag}</head>${htmlContent}`;
      }
    }

    // Inject JS
    if (jsFiles.length > 0) {
      const scriptContent = jsFiles.map(f => f.content).join('\n');
      const scriptTag = `<script>\n${scriptContent}\n</script>`;
      
      if (htmlContent.includes('</body>')) {
        htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);
      } else {
        htmlContent = `${htmlContent}\n${scriptTag}`;
      }
    }

    return (
      <iframe
        srcDoc={htmlContent}
        className="w-full h-full border-0"
        title="AI Builder Preview"
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      />
    );
  };

  const deleteFile = (fileId: string) => {
    if (files.length === 1) {
      toast.error('Cannot delete the last file');
      return;
    }

    const filteredFiles = files.filter(f => f.id !== fileId);
    setFiles(filteredFiles);
    
    if (currentFile.id === fileId) {
      setCurrentFile(filteredFiles[0]);
    }
    
    toast.success('File deleted successfully');
  };

  // Only show split/editor view, preview button opens preview in new tab
  const renderContent = () => {
    if (isMobile) {
      return (
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="w-full h-full">
          <TabsList className="w-full">
            <TabsTrigger value="editor" className="flex-1">
              <Code size={16} className="mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              <ExternalLink size={16} className="mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="h-[calc(100vh-200px)] overflow-hidden">
            <CodeEditor 
              file={currentFile} 
              readOnly={false}
            />
          </TabsContent>
        </Tabs>
      );
    }

    switch (activeView) {
      case 'editor':
        return (
          <div className="h-full overflow-hidden bg-editor-bg" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <CodeEditor 
              file={currentFile} 
              readOnly={false}
            />
          </div>
        );
      case 'both':
      default:
        return (
          <ResizablePanelGroup direction="horizontal" className="h-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <ResizablePanel defaultSize={50} className="h-full overflow-hidden bg-editor-bg" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <CodeEditor 
                file={currentFile} 
                readOnly={false}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} className="h-full overflow-hidden bg-white" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <AIPreview />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
    }
  };

  return (
    <div
      className="h-screen flex flex-col bg-gray-900 text-white"
      style={{
        height: '100vh',
        overflow: 'hidden', // Remove scrollbar
      }}
    >
      <SEOHead
        title="AI Builder - Web Sketch Studio"
        description="Generate code with AI assistance"
        keywords="AI, code generation, web development"
      />
      
      {/* Header */}
      <div className="p-3 bg-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold">AI Builder</h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Beta
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-2">
          {!isMobile && (
            <>
              <Button 
                size="sm"
                onClick={() => setActiveView('editor')}
                className={`bg-blue-800 hover:bg-blue-700 text-white border-none px-4 py-2 rounded-lg ${
                  activeView === 'editor' ? 'bg-blue-600 hover:bg-blue-500' : ''
                }`}
              >
                <Code size={16} className="mr-1 md:mr-2" />
                <span className="hidden md:inline">Editor</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => setActiveView('preview')}
                className={`bg-blue-800 hover:bg-blue-700 text-white border-none px-4 py-2 rounded-lg`}
              >
                <ExternalLink size={16} className="mr-1 md:mr-2" />
                <span className="hidden md:inline">Preview</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => setActiveView('both')}
                className={`bg-blue-800 hover:bg-blue-700 text-white border-none px-4 py-2 rounded-lg ${
                  activeView === 'both' ? 'bg-blue-600 hover:bg-blue-500' : ''
                }`}
              >
                <LayoutPanelLeft size={16} className="mr-1 md:mr-2" />
                <span className="hidden md:inline">Split</span>
              </Button>
            </>
          )}
          <Button 
            size={isMobile ? "icon" : "sm"}
            onClick={handleSaveAsProject}
            className="bg-green-600 hover:bg-green-700 text-white border-none px-4 py-2 rounded-lg"
            disabled={!user}
          >
            <Save size={18} />
            {!isMobile && <span className="ml-1">Save Project</span>}
          </Button>
        </div>
      </div>

      {/* Project Name Section */}
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex flex-col items-center">
        <div className="w-full flex flex-col gap-2 lg:max-w-2xl mx-auto">
          <label htmlFor="project-name" className="text-gray-300 font-semibold mb-1">Project Name</label>
          <input
            id="project-name"
            type="text"
            placeholder="Untitled Project"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white px-4 py-2 rounded font-semibold focus:outline-none w-full"
            style={{ fontSize: '1.1rem', borderWidth: '2px', borderStyle: 'solid', boxShadow: 'none' }}
          />
        </div>
      </div>

      {/* AI Generation Input Panel */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex flex-col items-center">
        <div className="w-full flex flex-col gap-4 lg:max-w-2xl mx-auto">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Describe what you want to build..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white px-4 font-semibold focus:outline-none w-full"
              style={{
                borderRadius: 0, // sharp corners
                borderWidth: '2px',
                borderStyle: 'solid',
                boxShadow: 'none',
                height: '84px', // Increased height
                fontSize: '1.1rem',
                paddingRight: '48px'
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleGenerate();
                }
              }}
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !user || !prompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-2 flex items-center justify-center"
              style={{
                borderRadius: '6px',
                width: '38px',
                height: '38px'
              }}
            >
              {isGenerating ? (
                <Bot className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* File Tabs */}
      {files.length > 1 && (
        <div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
          <div className="flex gap-1 overflow-x-auto items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => setCurrentFile(file)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  currentFile.id === file.id
                    ? 'bg-gray-800 text-white border-t border-l border-r border-gray-600 font-bold'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
                style={{minWidth:120, justifyContent:'center'}}
              >
                {file.type === 'html' && <FileText size={14} />}
                {file.type === 'css' && <Palette size={14} />}
                {file.type === 'js' && <Zap size={14} />}
                <span style={{maxWidth:90,overflow:'hidden',textOverflow:'ellipsis'}}>{file.name}</span>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    className="ml-1 hover:text-red-400 font-bold"
                    style={{fontSize:18, lineHeight:'1'}}
                  >
                    ×
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {renderContent()}
      </div>
      {/* Footer */}
      <footer
        style={{
          height: '20px',
          minHeight: '20px',
          background: '#22223b',
          color: '#fff',
          width: '100%',
          textAlign: 'center',
          fontSize: '12px',
          lineHeight: '20px',
          position: 'fixed',
          left: 0,
          bottom: 0,
          zIndex: 50
        }}
      >
        © {new Date().getFullYear()} Web Sketch Studio
      </footer>
    </div>
  );
};

export default AIBuilder;