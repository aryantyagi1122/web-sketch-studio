
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Project, ProjectFile } from '@/types/project';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, Code, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PublicPreview: React.FC = () => {
  const { slug, category, projectName } = useParams<{ 
    slug?: string; 
    category?: string; 
    projectName?: string; 
  }>();
  const { getPublicProject, incrementViewCount } = useSupabase();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!slug) {
        setError('Invalid project URL');
        setLoading(false);
        return;
      }

      try {
        const publicProject = await getPublicProject(slug);
        if (!publicProject) {
          setError('Project not found or not public');
        } else {
          setProject(publicProject);
          // Increment view count
          await incrementViewCount(publicProject.id);
        }
      } catch (err) {
        console.error('Error loading public project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug, getPublicProject, incrementViewCount]);

  const getHtmlContent = (project: Project, specificHtmlFile?: string | null) => {
    let mainHtmlFile: ProjectFile | undefined;
    
    if (specificHtmlFile) {
      mainHtmlFile = project.files.find(file => 
        file.type === 'html' && file.name === specificHtmlFile
      );
    }
    
    if (!mainHtmlFile) {
      const htmlFiles = project.files.filter(file => file.type === 'html');
      mainHtmlFile = htmlFiles.find(file => file.name.toLowerCase() === 'index.html') || htmlFiles[0];
    }
    
    if (!mainHtmlFile) {
      return `<!DOCTYPE html>
<html>
<head>
  <title>${project.name}</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="padding: 20px; font-family: sans-serif;">
  <h1>${project.name}</h1>
  <p>No HTML file found in this project.</p>
</body>
</html>`;
    }

    let htmlContent = mainHtmlFile.content;
    const cssFiles = project.files.filter(file => file.type === 'css');
    const jsFiles = project.files.filter(file => file.type === 'js');

    if (cssFiles.length > 0) {
      const styleTags = cssFiles.map(file => 
        `<style data-file="${file.name}">\n${file.content}\n</style>`
      ).join('\n');
      
      if (htmlContent.includes('<!-- CSS files will be injected here -->')) {
        htmlContent = htmlContent.replace('<!-- CSS files will be injected here -->', styleTags);
      } else if (htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('</head>', `${styleTags}\n</head>`);
      } else {
        htmlContent = `<head>${styleTags}</head>${htmlContent}`;
      }
    }

    if (jsFiles.length > 0) {
      const scriptTags = jsFiles.map(file => 
        `<script data-file="${file.name}">\n${file.content}\n</script>`
      ).join('\n');
      
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

  const handleOpenInNewWindow = () => {
    if (!project) return;
    
    const htmlContent = getHtmlContent(project);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600 mb-4">
            {error || 'The project you\'re looking for doesn\'t exist or is not public.'}
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Web Sketch Studio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  {project.userEmail && (
                    <div className="flex items-center">
                      <User size={14} className="mr-1" />
                      {project.userEmail}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Eye size={14} className="mr-1" />
                    {project.viewCount || 0} views
                  </div>
                  <div className="flex items-center">
                    <Code size={14} className="mr-1" />
                    {project.files.length} files
                  </div>
                  <span>
                    Updated {formatDistanceToNow(new Date(project.updatedAt))} ago
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleOpenInNewWindow}
                className="flex items-center space-x-2"
              >
                <ExternalLink size={16} />
                <span>Open in New Window</span>
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                Create Your Own
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Project Description */}
      {project.description && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-gray-700">{project.description}</p>
          </div>
        </div>
      )}

      {/* Preview Frame */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            <iframe
              title={`Preview of ${project.name}`}
              srcDoc={getHtmlContent(project)}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPreview;
