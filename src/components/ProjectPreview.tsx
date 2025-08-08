
import React, { useState, useEffect, useRef } from 'react';
import { Project } from '@/types/project';

interface ProjectPreviewProps {
  project: Project;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project }) => {
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    const generatePreview = () => {
      try {
        setHasError(false);
        setIsReady(false);
        
        const htmlFiles = project.files.filter(file => file.type === 'html');
        const cssFiles = project.files.filter(file => file.type === 'css');
        const jsFiles = project.files.filter(file => file.type === 'js');
        
        let htmlContent = '';
        
        if (htmlFiles.length > 0) {
          // Find main HTML file (index.html or first HTML file)
          const mainHtmlFile = htmlFiles.find(f => f.name.toLowerCase() === 'index.html') || htmlFiles[0];
          htmlContent = mainHtmlFile.content;
          
          // Inject CSS styles
          if (cssFiles.length > 0) {
            const allCss = cssFiles.map(file => file.content).join('\n');
            const styleTag = `<style>\n${allCss}\n</style>`;
            
            if (htmlContent.includes('</head>')) {
              htmlContent = htmlContent.replace('</head>', `${styleTag}\n</head>`);
            } else if (htmlContent.includes('<head>')) {
              htmlContent = htmlContent.replace('<head>', `<head>\n${styleTag}`);
            } else {
              htmlContent = `<head>\n${styleTag}\n</head>\n${htmlContent}`;
            }
          }
          
          // Add JavaScript as comments for security (no execution in preview)
          if (jsFiles.length > 0) {
            const jsComment = `<!-- JavaScript files: ${jsFiles.map(f => f.name).join(', ')} -->`;
            if (htmlContent.includes('</body>')) {
              htmlContent = htmlContent.replace('</body>', `${jsComment}\n</body>`);
            } else {
              htmlContent = `${htmlContent}\n${jsComment}`;
            }
          }
        } else {
          // Create a beautiful fallback when no HTML files exist
          htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .preview-card {
      background: rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      text-align: center;
      max-width: 320px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    .project-icon {
      width: 48px;
      height: 48px;
      background: rgba(255,255,255,0.15);
      border-radius: 12px;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    h2 { 
      margin: 0 0 8px 0; 
      font-size: 18px; 
      font-weight: 600; 
      line-height: 1.3;
    }
    .description {
      margin: 0 0 12px 0;
      opacity: 0.9;
      font-size: 14px;
      line-height: 1.4;
    }
    .files-info {
      opacity: 0.8;
      font-size: 12px;
      background: rgba(255,255,255,0.1);
      padding: 6px 12px;
      border-radius: 20px;
      display: inline-block;
    }
    ${cssFiles.map(f => f.content).join('\n')}
  </style>
</head>
<body>
  <div class="preview-card">
    <div class="project-icon">📁</div>
    <h2>${project.name}</h2>
    ${project.description ? `<p class="description">${project.description}</p>` : ''}
    <div class="files-info">
      ${project.files.length} files: ${project.files.map(f => f.type.toUpperCase()).join(', ')}
    </div>
  </div>
</body>
</html>`;
        }
        
        // Add preview-specific styles to prevent interaction and scale properly
        const previewStyles = `
<style id="preview-override">
  * { 
    pointer-events: none !important; 
    user-select: none !important;
  }
  html, body { 
    margin: 0 !important; 
    padding: 0 !important; 
    overflow: hidden !important;
    width: 100% !important;
    height: 100% !important;
  }
  body {
    transform: scale(0.75);
    transform-origin: top left;
    width: 133.33% !important;
    height: 133.33% !important;
  }
  script { display: none !important; }
  img { max-width: 100% !important; height: auto !important; }
  video { max-width: 100% !important; height: auto !important; }
</style>
`;
        
        // Inject preview styles
        if (htmlContent.includes('</head>')) {
          htmlContent = htmlContent.replace('</head>', `${previewStyles}</head>`);
        } else {
          htmlContent = `<head>${previewStyles}</head>${htmlContent}`;
        }
        
        setPreviewContent(htmlContent);
        setIsReady(true);
        
      } catch (error) {
        console.error('Preview generation error:', error);
        setHasError(true);
        setIsReady(false);
      }
    };

    generatePreview();
  }, [project]);

  const handleIframeLoad = () => {
    // Ensure we're ready when iframe loads
    if (previewContent && !isReady) {
      setIsReady(true);
    }
  };

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-md overflow-hidden">
      {/* Loading State */}
      {!isReady && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 z-20">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-gray-600 font-medium">Loading preview...</span>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 z-20">
          <div className="text-center">
            <div className="text-red-400 mb-2 text-lg">⚠️</div>
            <span className="text-sm text-red-600 font-medium">Preview Error</span>
          </div>
        </div>
      )}
      
      {/* Preview Content */}
      {previewContent && (
        <iframe
          ref={iframeRef}
          title={`Preview of ${project.name}`}
          srcDoc={previewContent}
          className={`w-full h-full border-0 transition-opacity duration-300 ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
          sandbox="allow-same-origin"
          onLoad={handleIframeLoad}
          style={{
            background: 'white',
            minHeight: '256px'
          }}
        />
      )}
    </div>
  );
};

export default ProjectPreview;
