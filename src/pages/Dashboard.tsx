import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { useSupabase } from '@/contexts/SupabaseContext';
import ProjectList from '@/components/ProjectList';
import PinnedProjects from '@/components/PinnedProjects';
import TeamProjects from '@/components/TeamProjects';
import CommunityProjects from '@/components/CommunityProjects';
import AIProjectsTab from '@/components/AIProjectsTab';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCode, Files, Star, Search, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const TAB_LIST = [
  { value: "my-projects", label: "My Projects", icon: FileCode },
  { value: "pinned", label: "Pinned", icon: Star },
  { value: "team-projects", label: "Team Projects", icon: Files },
  { value: "community", label: "Community", icon: Search },
  { value: "ai-projects", label: "AI Projects", icon: Sparkles },
];

const Dashboard = () => {
  const { projects, loadProjects } = useProject();
  const { user } = useSupabase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-projects');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const tabRefs = useRef({});

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user, loadProjects]);

  // Pagination logic
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const handlePinToggle = () => {
    setTimeout(() => {
      if (user) {
        loadProjects();
      }
    }, 100);
  };

  // Chrome-style underline position/width calculation
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const node = tabRefs.current[activeTab];
    if (node) {
      setUnderlineStyle({
        left: node.offsetLeft,
        width: node.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <Layout>
      <SEOHead
        title="Dashboard - Web Sketch Studio"
        description="Manage your web projects, create new HTML, CSS, and JavaScript projects"
        keywords="dashboard, web projects, HTML, CSS, JavaScript"
      />

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Tabs */}
          <div className="mb-6 relative">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Chrome-like Tabs */}
              <TabsList className="relative flex w-full bg-[#ecf2fa] rounded-2xl shadow-sm border-b border-blue-200 px-2 h-14 gap-x-3">
                {TAB_LIST.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      ref={el => tabRefs.current[tab.value] = el}
                      className={
                        "relative flex items-center gap-2 px-8 py-2 h-full font-medium text-blue-700 transition-colors " +
                        "rounded-2xl z-10 outline-none cursor-pointer " +
                        "hover:bg-white/60 hover:shadow-md " +
                        "focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:z-20 " +
                        "data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-800 " +
                        "data-[state=active]:font-semibold"
                      }
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
                {/* Animated underline */}
                <span
                  className="absolute bottom-0 h-1 bg-blue-600 rounded-full transition-all duration-300 ease-chrome-tab z-20"
                  style={{
                    left: underlineStyle.left,
                    width: underlineStyle.width,
                  }}
                  aria-hidden="true"
                />
              </TabsList>
              <style>{`
                .ease-chrome-tab {
                  transition-timing-function: cubic-bezier(.4,0,.2,1);
                }
              `}</style>
              
              {/* Tab Content */}
              <div className="mt-8">
                <TabsContent value="my-projects" className="mt-0">
                  {!user ? (
                    <div className="text-center py-12">
                      <h2 className="text-xl font-semibold mb-4">Welcome to Web Sketch Studio</h2>
                      <p className="text-gray-600 mb-6">Please log in to view and manage your projects</p>
                      <Button onClick={() => navigate('/auth')}>Log In</Button>
                    </div>
                  ) : (
                    <>
                      <ProjectList
                        projects={paginatedProjects}
                        onPinToggle={handlePinToggle}
                        showPinOption={true}
                        viewType="grid"
                      />
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1"
                          >
                            <ChevronLeft size={16} />
                            Previous
                          </Button>
                          <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-10"
                              >
                                {page}
                              </Button>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1"
                          >
                            Next
                            <ChevronRight size={16} />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="pinned" className="mt-0">
                  <PinnedProjects />
                </TabsContent>

                <TabsContent value="team-projects" className="mt-0">
                  <TeamProjects />
                </TabsContent>

                <TabsContent value="community" className="mt-0">
                  <CommunityProjects />
                </TabsContent>

                <TabsContent value="ai-projects" className="mt-0">
                  <AIProjectsTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;