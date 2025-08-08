
import React, { useEffect, useRef, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Maximize, Minimize, Play } from 'lucide-react';
import { toast } from 'sonner';

const Preview: React.FC = () => {
  const { getHtmlContent, currentProject } = useProject();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currentHtmlFile, setCurrentHtmlFile] = useState<string | null>(null);

  useEffect(() => {
    const updatePreview = () => {
      if (!autoRefresh) return;
      
      try {
        const htmlContent = getHtmlContent(currentHtmlFile);
        
        if (iframeRef.current) {
          const iframe = iframeRef.current;
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          
          if (doc) {
            doc.open();
            doc.write(htmlContent);
            doc.close();
            
            // Handle navigation between HTML files
            if (iframe.contentWindow) {
              iframe.contentWindow.addEventListener('click', handleIframeClick);
            }
          }
        }
        setLastUpdate(Date.now());
      } catch (error) {
        console.error("Error updating preview:", error);
        toast.error("Error updating preview. Check your code.");
      }
    };

    // Update preview on mount
    updatePreview();

    // Set up a timer to update the preview periodically if autoRefresh is enabled
    const timer = autoRefresh ? setInterval(updatePreview, 1000) : null;
    
    return () => {
      if (timer) clearInterval(timer);
      
      // Clean up event listeners
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.removeEventListener('click', handleIframeClick);
      }
    };
  }, [getHtmlContent, autoRefresh, currentHtmlFile]);

  // Handle clicks inside the iframe to capture navigation
  const handleIframeClick = (e: MouseEvent) => {
    if (!iframeRef.current || !currentProject) return;
    
    // Check if a link was clicked
    const target = e.target as HTMLElement;
    const link = target.closest('a') as HTMLAnchorElement;
    
    if (link && link.href) {
      const url = new URL(link.href);
      
      // Only handle relative links (same-origin navigation)
      if (url.origin === iframeRef.current.contentWindow?.location.origin) {
        e.preventDefault();
        
        // Extract the pathname and find the corresponding file
        const path = url.pathname.split('/').pop() || '';
        if (path) {
          setCurrentHtmlFile(path);
        }
      }
    }
  };

  const handleRefresh = () => {
    try {
      const htmlContent = getHtmlContent(currentHtmlFile);
      
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (doc) {
          doc.open();
          doc.write(htmlContent);
          doc.close();
          
          // Reattach click handlers
          if (iframe.contentWindow) {
            iframe.contentWindow.addEventListener('click', handleIframeClick);
          }
        }
      }
      setLastUpdate(Date.now());
      toast.success("Preview refreshed");
    } catch (error) {
      console.error("Error refreshing preview:", error);
      toast.error("Error refreshing preview. Check your code.");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.info(autoRefresh ? "Auto-refresh disabled" : "Auto-refresh enabled");
  };

  return (
    <div className={`flex flex-col h-full bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">
            Preview
          </span>
          <span className="ml-2 text-xs text-gray-400">
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
          {currentHtmlFile && (
            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
              {currentHtmlFile}
            </span>
          )}
          {!autoRefresh && (
            <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
              Manual Refresh
            </span>
          )}
        </div>
        <div className="flex space-x-1">
          <Button 
            variant={autoRefresh ? "default" : "outline"} 
            size="icon" 
            className="h-8 w-8"
            onClick={toggleAutoRefresh}
            title={autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"}
          >
            <Play size={16} className={autoRefresh ? "" : "text-amber-500"} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleRefresh}
            title="Refresh preview"
          >
            <RefreshCw size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          title="Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
        />
      </div>
    </div>
  );
};

export default Preview;
