import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useProject } from '@/contexts/ProjectContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { toast } from 'sonner';
import { 
  Code, 
  FileCode, 
  Files, 
  Home, 
  Menu,
  LogIn,
  LogOut,
  User,
  UserPlus,
  Users,
  Bot,
  Info,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Mail,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Shield,
  FileText,
  Settings
} from 'lucide-react';
import TeamProjectDialog from '@/components/TeamProjectDialog';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useSupabase();
  const { createProject, projects } = useProject();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projectType, setProjectType] = useState<'single' | 'multiple'>('single');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [legalOpen, setLegalOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreateProject = (type: 'single' | 'multiple') => {
    if (!user) {
      toast.error('Please login to create projects');
      navigate('/auth');
      return;
    }
    
    setProjectType(type);
    setIsDialogOpen(true);
  };

  const handleSubmitProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName, "", projectType);
      setNewProjectName('');
      setIsDialogOpen(false);
      
      // Navigate to editor with the new project
      setTimeout(() => {
        const projectId = localStorage.getItem('currentProjectId');
        const project = projects.find(p => p.id === projectId);
        navigate(`/editor/${project?.name || projectId}`);
      }, 100);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const getNavCls = (path: string) => 
    isActive(path) 
      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold border-r-2 border-blue-500 shadow-sm" 
      : "hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 hover:translate-x-0.5";

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 w-full">
        

        <Sidebar variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-gray-200 shadow-lg bg-white/95 backdrop-blur-sm group data-[state=collapsed]:w-16">
          <SidebarHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-md">
            <div className="flex items-center justify-between px-4 py-4 group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:justify-center">
              <div className="flex items-center space-x-3 group-data-[state=collapsed]:space-x-0">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                  <Code size={24} className="text-white" />
                </div>
                <div className="flex flex-col group-data-[state=collapsed]:hidden">
                  <h1 className="text-xl font-bold tracking-tight">Web Sketch</h1>
                  <p className="text-xs text-blue-100 font-medium">Professional Studio</p>
                </div>
              </div>
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 transition-colors duration-200 flex-shrink-0 group-data-[state=collapsed]:hidden"
                >
                  {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                </Button>
              )}
            </div>
            {/* Collapsed state toggle button */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute -right-3 top-4 h-6 w-6 p-0 bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded-full shadow-md border border-gray-200 hidden group-data-[state=collapsed]:flex items-center justify-center z-10"
              >
                <PanelLeftOpen size={12} />
              </Button>
            )}
          </SidebarHeader>

          <SidebarContent className="py-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2 flex items-center group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2">
                <Home size={14} className="mr-2 group-data-[state=collapsed]:mr-0 flex-shrink-0" />
                <span className="group-data-[state=collapsed]:hidden">Navigation</span>
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-2 group-data-[state=collapsed]:px-1">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                <NavLink to="/dashboard" className={`${getNavCls('/dashboard')} rounded-lg px-3 py-2.5 flex items-center space-x-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0`}>
                        <Home size={18} className="flex-shrink-0" />
                        <span className="font-medium group-data-[state=collapsed]:hidden">Dashboard</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/ai-builder" className={`${getNavCls('/ai-builder')} rounded-lg px-3 py-2.5 flex items-center space-x-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0`}>
                        <div className="p-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-md flex-shrink-0">
                          <Bot size={18} className="text-purple-600" />
                        </div>
                        <span className="font-medium group-data-[state=collapsed]:hidden">AI Builder</span>
                        <Sparkles size={12} className="text-purple-500 ml-auto group-data-[state=collapsed]:hidden" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/ai-document" className={`${getNavCls('/ai-document')} rounded-lg px-3 py-2.5 flex items-center space-x-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0`}>
                        <div className="p-1 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-md flex-shrink-0">
                          <FileText size={18} className="text-emerald-600" />
                        </div>
                        <span className="font-medium group-data-[state=collapsed]:hidden">AI Document</span>
                        <Sparkles size={12} className="text-emerald-500 ml-auto group-data-[state=collapsed]:hidden" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/about" className={`${getNavCls('/about')} rounded-lg px-3 py-2.5 flex items-center space-x-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0`}>
                        <Info size={18} className="flex-shrink-0" />
                        <span className="font-medium group-data-[state=collapsed]:hidden">About</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4 group-data-[state=collapsed]:mx-2"></div>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2 flex items-center group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2">
                <FolderOpen size={14} className="mr-2 group-data-[state=collapsed]:mr-0 flex-shrink-0" />
                <span className="group-data-[state=collapsed]:hidden">Create Projects</span>
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-2 group-data-[state=collapsed]:px-1">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleCreateProject('single')}
                      className="rounded-lg px-3 py-2.5 flex items-center space-x-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 hover:shadow-sm group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0"
                    >
                      <div className="p-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-md flex-shrink-0">
                        <FileCode size={18} className="text-blue-600" />
                      </div>
                      <span className="font-medium group-data-[state=collapsed]:hidden">Single File Project</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => handleCreateProject('multiple')}
                      className="rounded-lg px-3 py-2.5 flex items-center space-x-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-700 transition-all duration-200 hover:shadow-sm group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0"
                    >
                      <div className="p-1 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-md flex-shrink-0">
                        <Files size={18} className="text-orange-600" />
                      </div>
                      <span className="font-medium group-data-[state=collapsed]:hidden">Multi-File Project</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <TeamProjectDialog>
                      <SidebarMenuButton 
                        onClick={() => {
                          if (!user) {
                            toast.error('Please login to create team projects');
                            navigate('/auth');
                            return;
                          }
                        }}
                        className="rounded-lg px-3 py-2.5 flex items-center space-x-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 hover:shadow-sm group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0"
                      >
                        <div className="p-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-md flex-shrink-0">
                          <Users size={18} className="text-green-600" />
                        </div>
                        <span className="font-medium group-data-[state=collapsed]:hidden">Team Project</span>
                      </SidebarMenuButton>
                    </TeamProjectDialog>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4 group-data-[state=collapsed]:mx-2"></div>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-2 flex items-center group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2">
                {user ? <User size={14} className="mr-2 group-data-[state=collapsed]:mr-0 flex-shrink-0" /> : <LogIn size={14} className="mr-2 group-data-[state=collapsed]:mr-0 flex-shrink-0" />}
                <span className="group-data-[state=collapsed]:hidden">Account</span>
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-2 group-data-[state=collapsed]:px-1">
                <SidebarMenu className="space-y-1">
                  {user ? (
                    <>
                      <SidebarMenuItem>
                        <div className="rounded-lg px-3 py-2.5 flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0">
                          <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0">
                            <User size={14} className="text-white" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1 group-data-[state=collapsed]:hidden">
                            <span className="font-medium text-gray-900 text-sm truncate">{user.email}</span>
                            <span className="text-xs text-green-600 font-medium">● Online</span>
                          </div>
                        </div>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={handleLogout}
                          className="rounded-lg px-3 py-2.5 flex items-center space-x-3 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0"
                        >
                          <LogOut size={18} className="flex-shrink-0" />
                          <span className="font-medium group-data-[state=collapsed]:hidden">Sign Out</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  ) : (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/auth" className={`${getNavCls('/auth')} rounded-lg px-3 py-2.5 flex items-center space-x-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0`}>
                            <div className="p-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-md flex-shrink-0">
                              <LogIn size={18} className="text-green-600" />
                            </div>
                            <span className="font-medium group-data-[state=collapsed]:hidden">Sign In</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <NavLink to="/auth" className={`${getNavCls('/auth')} rounded-lg px-3 py-2.5 flex items-center space-x-3 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:space-x-0`}>
                            <div className="p-1 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-md flex-shrink-0">
                              <UserPlus size={18} className="text-purple-600" />
                            </div>
                            <span className="font-medium group-data-[state=collapsed]:hidden">Register</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4 group-data-[state=collapsed]:mx-2"></div>

            {/* Collapsible Legal & Info group */}
            <SidebarGroup className="group-data-[state=collapsed]:hidden">
              <SidebarGroupLabel className="px-4 py-2">
                <button
                  type="button"
                  className="flex items-center w-full text-left focus:outline-none text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-200"
                  onClick={() => setLegalOpen(!legalOpen)}
                >
                  <Shield size={14} className="mr-2" />
                  <span className="flex-1">Legal & Support</span>
                  {legalOpen ? (
                    <ChevronDown size={14} className="transition-transform duration-200" />
                  ) : (
                    <ChevronRight size={14} className="transition-transform duration-200" />
                  )}
                </button>
              </SidebarGroupLabel>
              {legalOpen && (
                <SidebarGroupContent className="px-2">
                  <SidebarMenu className="space-y-1">
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/contact" className={`${getNavCls('/contact')} rounded-lg px-3 py-2.5 flex items-center space-x-3`}>
                          <Mail size={18} className="flex-shrink-0" />
                          <span className="font-medium">Contact Us</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/privacy-policy" className={`${getNavCls('/privacy-policy')} rounded-lg px-3 py-2.5 flex items-center space-x-3`}>
                          <Shield size={18} className="flex-shrink-0" />
                          <span className="font-medium">Privacy Policy</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/terms" className={`${getNavCls('/terms')} rounded-lg px-3 py-2.5 flex items-center space-x-3`}>
                          <FileText size={18} className="flex-shrink-0" />
                          <span className="font-medium">Terms & Conditions</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50 p-4 group-data-[state=collapsed]:p-2">
            <div className="text-center group-data-[state=collapsed]:hidden">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-gray-700">Web Sketch Studio</span>
              </div>
              <p className="text-xs text-gray-500">Version 1.0 • Professional</p>
            </div>
            <div className="hidden group-data-[state=collapsed]:flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 relative">
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center shadow-sm">
            {isMobile && (
              <SidebarTrigger className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Menu size={20} />
              </SidebarTrigger>
            )}
            <div className="flex-1">
              <div className="w-full max-w-sm">
                {/* You can add a search bar or breadcrumbs here */}
              </div>
            </div>
          </header>
          <div className="h-full overflow-auto">
            {children}
          </div>
          
          {/* Enhanced Create Project Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[450px] mx-4 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <DialogHeader className="pb-4 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Create New {projectType === 'single' ? 'Single File' : 'Multiple Files'} Project
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-2">
                  {projectType === 'single' 
                    ? 'Perfect for quick prototypes and simple web pages' 
                    : 'Ideal for complex applications with multiple components'
                  }
                </p>
              </DialogHeader>
              <div className="py-6">
                <div className="space-y-3">
                  <label htmlFor="project-name" className="text-sm font-semibold text-gray-700">
                    Project Name
                  </label>
                  <Input
                    id="project-name"
                    placeholder="Enter your project name..."
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitProject();
                      }
                    }}
                    className="h-12 px-4 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                  />
                  <p className="text-xs text-gray-500">
                    Choose a descriptive name for your project
                  </p>
                </div>
              </div>
              <DialogFooter className="pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6 py-2.5 font-medium"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitProject} 
                  disabled={!newProjectName.trim()}
                  className="px-6 py-2.5 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;