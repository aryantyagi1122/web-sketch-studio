import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import ProjectList from '@/components/ProjectList';
import PinnedProjects from '@/components/PinnedProjects';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const Pinned = () => {
  const { user } = useSupabase();
  const navigate = useNavigate();

  return (
    <Layout>
      <SEOHead
        title="Pinned Projects - Web Sketch Studio"
        description="View and manage your pinned web projects"
        keywords="pinned projects, favorites, web development"
      />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-500" size={28} />
              <h1 className="text-3xl font-bold">Pinned Projects</h1>
            </div>
          </div>

          {!user ? (
            <div className="text-center py-12">
              <Star className="mx-auto text-gray-400 mb-4" size={48} />
              <h2 className="text-xl font-semibold mb-4">Log in to see your pinned projects</h2>
              <p className="text-gray-600 mb-6">Pin your favorite projects for quick access</p>
              <Button onClick={() => navigate('/auth')}>Log In</Button>
            </div>
          ) : (
            <PinnedProjects />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Pinned;