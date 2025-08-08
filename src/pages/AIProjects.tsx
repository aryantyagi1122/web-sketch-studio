import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { FolderOpen, Eye, Download, Share2, Info } from 'lucide-react';

interface AIProjectMeta {
  id: string;
  name: string;
  createdAt: string;
  files: any[];
}

const AIProjects: React.FC = () => {
  const [projects, setProjects] = useState<AIProjectMeta[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ai_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center mb-6">
          <FolderOpen size={32} className="text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold">Community AI Projects</h2>
        </div>
        {projects.length === 0 ? (
          <div className="text-gray-500">No AI Builder projects saved yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                <div className="font-semibold text-lg mb-2">{proj.name}</div>
                <div className="text-xs text-gray-400 mb-2">Created: {new Date(proj.createdAt).toLocaleString()}</div>
                <div className="flex gap-2 mt-auto">
                  <button className="btn btn-sm btn-outline flex items-center gap-1"><Eye size={16} />Preview</button>
                  <button className="btn btn-sm btn-outline flex items-center gap-1"><Download size={16} />Download</button>
                  <button className="btn btn-sm btn-outline flex items-center gap-1"><Share2 size={16} />Share</button>
                  <button className="btn btn-sm btn-outline flex items-center gap-1"><Info size={16} />Info</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIProjects;
