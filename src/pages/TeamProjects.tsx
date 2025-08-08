import React from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import TeamProjects from '@/components/TeamProjects';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

const TeamProjectsPage = () => {
  const { user } = useSupabase();
  const navigate = useNavigate();

  return (
    <Layout>
      <SEOHead
        title="Team Projects - Web Sketch Studio"
        description="Collaborate on web projects with your team"
        keywords="team projects, collaboration, web development"
      />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-500" size={28} />
              <h1 className="text-3xl font-bold">Team Projects</h1>
            </div>
          </div>

          {!user ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <h2 className="text-xl font-semibold mb-4">Log in to access team projects</h2>
              <p className="text-gray-600 mb-6">Collaborate with your team on web projects</p>
              <Button onClick={() => navigate('/auth')}>Log In</Button>
            </div>
          ) : (
            <TeamProjects />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TeamProjectsPage;