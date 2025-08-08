import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import JSZip from 'jszip';
import { Eye, Download, Share2, Info, Sparkles } from 'lucide-react';

interface AIProjectMeta {
  id: string;
  name: string;
  createdAt: string;
  files: { id: string; name: string; type: 'html' | 'css' | 'js'; content: string }[];
}

const AIProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<AIProjectMeta[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ai_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch {
        setProjects([]);
      }
    }
  }, []);

  const openPreview = (proj: AIProjectMeta) => {
    const htmlFile = proj.files.find(f => f.type === 'html') || proj.files.find(f => f.name.toLowerCase().endsWith('.html'));
    let htmlContent = htmlFile?.content || '<!DOCTYPE html><html><head><title>Preview</title></head><body><p>No HTML file found.</p></body></html>';

    const cssFiles = proj.files.filter(f => f.type === 'css');
    if (cssFiles.length) {
      const styleTag = `<style>\n${cssFiles.map(f => f.content).join('\n')}\n</style>`;
      if (htmlContent.includes('</head>')) htmlContent = htmlContent.replace('</head>', `${styleTag}\n</head>`);
      else htmlContent = `<head>${styleTag}</head>${htmlContent}`;
    }

    const jsFiles = proj.files.filter(f => f.type === 'js');
    if (jsFiles.length) {
      const scriptTag = `<script>\n${jsFiles.map(f => f.content).join('\n')}\n</script>`;
      if (htmlContent.includes('</body>')) htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);
      else htmlContent = `${htmlContent}\n${scriptTag}`;
    }

    const w = window.open('about:blank', '_blank');
    if (w) {
      w.document.write(htmlContent);
      w.document.close();
    }
  };

  const downloadZip = async (proj: AIProjectMeta) => {
    const zip = new JSZip();
    proj.files.forEach(file => zip.file(file.name, file.content));
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proj.name.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!projects.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Sparkles size={40} className="mx-auto text-purple-500 mb-3" />
        <h3 className="text-lg font-semibold">No AI Projects yet</h3>
        <p className="text-gray-600 mt-1">Use AI Builder to generate and save your first project.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(proj => (
        <div key={proj.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 flex flex-col">
          <div className="font-semibold text-base mb-1 truncate">{proj.name}</div>
          <div className="text-xs text-gray-500 mb-3">Saved {new Date(proj.createdAt).toLocaleString()}</div>
          <div className="mt-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => openPreview(proj)} className="flex items-center gap-1">
              <Eye size={16} /> Preview
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadZip(proj)} className="flex items-center gap-1">
              <Download size={16} /> Download
            </Button>
            <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
              <Share2 size={16} /> Share
            </Button>
            <Button variant="outline" size="sm" disabled className="flex items-center gap-1">
              <Info size={16} /> Info
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIProjectsTab;
