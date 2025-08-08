import React from 'react';
import CommunityProjects from '@/components/CommunityProjects';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { BookOpen } from 'lucide-react';

const Community = () => {
  return (
    <Layout>
      <SEOHead
        title="Community Projects - Web Sketch Studio"
        description="Explore public web projects shared by the community"
        keywords="community projects, public projects, web examples, inspiration"
      />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="text-green-500" size={28} />
              <h1 className="text-3xl font-bold">Community Projects</h1>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Discover amazing web projects created by our community. Get inspired and learn from others!
            </p>
          </div>

          <CommunityProjects />
        </div>
      </div>
    </Layout>
  );
};

export default Community;