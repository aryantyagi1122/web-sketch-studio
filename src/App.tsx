import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Pinned from '@/pages/Pinned';
import TeamProjectsPage from '@/pages/TeamProjects';
import Community from '@/pages/Community';
import Editor from '@/pages/Editor';
import Auth from '@/pages/Auth';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Settings from '@/pages/Settings';
import Trash from '@/pages/Trash';
import GitHub from '@/pages/GitHub';
import PublicPreview from '@/pages/PublicPreview';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';
import AIBuilder from '@/pages/AIBuilder';
import AIDocument from '@/pages/AIDocument';
import AIProjects from '@/pages/AIProjects';
import './App.css';
import './scrollbar.css';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SupabaseProvider>
            <ProjectProvider>
              <Router>
                <div className="App">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/landing" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pinned" element={<Pinned />} />
                    <Route path="/team-projects" element={<TeamProjectsPage />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/ai-builder" element={<AIBuilder />} />
                    <Route path="/ai-document" element={<AIDocument />} />
                    <Route path="/ai-projects" element={<AIProjects />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/trash" element={<Trash />} />
                    <Route path="/github" element={<GitHub />} />
                    
                    {/* New URL structure: /page/category/projectname */}
                    <Route path="/editor/:category/:projectName" element={<Editor />} />
                    <Route path="/preview/:category/:projectName" element={<PublicPreview />} />
                    <Route path="/share/:category/:projectName" element={<PublicPreview />} />
                    
                    {/* Legacy routes for backward compatibility */}
                    <Route path="/editor/:projectId" element={<Editor />} />
                    <Route path="/preview/:slug" element={<PublicPreview />} />
                    
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Router>
              <Toaster />
            </ProjectProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
