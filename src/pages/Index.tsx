
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/contexts/SupabaseContext';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { seoConfig, structuredData } from '@/config/seo';
import { Code, FileCode, Files, Users, Star, BookOpen, Plus, LogIn } from 'lucide-react';

const Index = () => {
  const { user } = useSupabase();
  const navigate = useNavigate();

  // Auto-redirect logged in users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <>
      <SEOHead
        title={seoConfig.pages.home.title}
        description={seoConfig.pages.home.description}
        keywords={seoConfig.keywords.join(', ')}
        canonicalUrl={seoConfig.siteUrl}
        ogImage={seoConfig.ogImage}
        jsonLd={structuredData.website}
      />
      
      <div className="min-h-screen gradient-subtle">
        {/* Navigation */}
        <nav className="glass-effect border-b backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center group">
                <div className="p-2 rounded-xl gradient-primary shadow-elegant mr-3 transition-spring group-hover:scale-110">
                  <Code size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Web Sketch Studio
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/community')}
                  className="transition-spring hover:shadow-elegant border-border/50 hover:bg-primary/5"
                >
                  Browse Examples
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="gradient-primary shadow-elegant transition-spring hover:shadow-premium hover:scale-105"
                >
                  <LogIn size={16} className="mr-2" />
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center relative">
            {/* Floating background elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-20 left-1/4 w-72 h-72 gradient-hero rounded-full animate-float opacity-30 blur-3xl"></div>
              <div className="absolute top-40 right-1/4 w-96 h-96 gradient-hero rounded-full animate-float opacity-20 blur-3xl" style={{animationDelay: '1s'}}></div>
            </div>
            
            <div className="relative z-10">
              <div className="mb-8 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 shadow-elegant">
                  ✨ Professional Web Development Platform
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <span className="text-foreground">Build Web Projects</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  Instantly in Your Browser
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.4s'}}>
                Experience the future of web development with our premium, cloud-based IDE. 
                Create, collaborate, and deploy professional websites with zero setup time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-fade-in" style={{animationDelay: '0.6s'}}>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')} 
                  className="text-lg px-10 py-6 gradient-primary shadow-premium transition-spring hover:shadow-glass hover:scale-105 h-auto"
                >
                  <Plus size={24} className="mr-3" />
                  Start Creating for Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/community')} 
                  className="text-lg px-10 py-6 border-border/50 hover:bg-primary/5 transition-spring hover:shadow-elegant hover:scale-105 h-auto"
                >
                  <BookOpen size={24} className="mr-3" />
                  Explore Examples
                </Button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-28">
            <div className="group glass-effect rounded-2xl p-8 shadow-glass text-center transition-spring hover:scale-105 hover:shadow-premium border animate-scale-in" style={{animationDelay: '0.8s'}}>
              <div className="gradient-primary rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-elegant group-hover:animate-glow transition-spring group-hover:scale-110">
                <FileCode className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Single File Projects</h3>
              <p className="text-muted-foreground leading-relaxed">Perfect for rapid prototyping and lightning-fast experiments</p>
            </div>

            <div className="group glass-effect rounded-2xl p-8 shadow-glass text-center transition-spring hover:scale-105 hover:shadow-premium border animate-scale-in" style={{animationDelay: '1s'}}>
              <div className="gradient-primary rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-elegant group-hover:animate-glow transition-spring group-hover:scale-110">
                <Files className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Multi-File Architecture</h3>
              <p className="text-muted-foreground leading-relaxed">Build enterprise-grade applications with organized file structures</p>
            </div>

            <div className="group glass-effect rounded-2xl p-8 shadow-glass text-center transition-spring hover:scale-105 hover:shadow-premium border animate-scale-in" style={{animationDelay: '1.2s'}}>
              <div className="gradient-primary rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-elegant group-hover:animate-glow transition-spring group-hover:scale-110">
                <Users className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Real-time Collaboration</h3>
              <p className="text-muted-foreground leading-relaxed">Seamless teamwork with live editing and instant synchronization</p>
            </div>

            <div className="group glass-effect rounded-2xl p-8 shadow-glass text-center transition-spring hover:scale-105 hover:shadow-premium border animate-scale-in" style={{animationDelay: '1.4s'}}>
              <div className="gradient-primary rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-elegant group-hover:animate-glow transition-spring group-hover:scale-110">
                <Star className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Smart Organization</h3>
              <p className="text-muted-foreground leading-relaxed">Intelligent project management with advanced filtering and search</p>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="text-center mt-32">
            <div className="animate-fade-in" style={{animationDelay: '1.6s'}}>
              <h2 className="text-4xl font-bold text-foreground mb-4">Platform Access</h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Jump directly to any section of our comprehensive development environment
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto animate-scale-in" style={{animationDelay: '1.8s'}}>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="h-20 flex flex-col items-center gap-3 glass-effect border-border/50 hover:bg-primary/5 transition-spring hover:shadow-elegant hover:scale-105 group"
              >
                <div className="p-2 rounded-lg gradient-primary shadow-elegant group-hover:scale-110 transition-spring">
                  <Code size={24} className="text-white" />
                </div>
                <span className="font-semibold">Dashboard</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/pinned')}
                className="h-20 flex flex-col items-center gap-3 glass-effect border-border/50 hover:bg-primary/5 transition-spring hover:shadow-elegant hover:scale-105 group"
              >
                <div className="p-2 rounded-lg gradient-primary shadow-elegant group-hover:scale-110 transition-spring">
                  <Star size={24} className="text-white" />
                </div>
                <span className="font-semibold">Favorites</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/team-projects')}
                className="h-20 flex flex-col items-center gap-3 glass-effect border-border/50 hover:bg-primary/5 transition-spring hover:shadow-elegant hover:scale-105 group"
              >
                <div className="p-2 rounded-lg gradient-primary shadow-elegant group-hover:scale-110 transition-spring">
                  <Users size={24} className="text-white" />
                </div>
                <span className="font-semibold">Team Hub</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/community')}
                className="h-20 flex flex-col items-center gap-3 glass-effect border-border/50 hover:bg-primary/5 transition-spring hover:shadow-elegant hover:scale-105 group"
              >
                <div className="p-2 rounded-lg gradient-primary shadow-elegant group-hover:scale-110 transition-spring">
                  <BookOpen size={24} className="text-white" />
                </div>
                <span className="font-semibold">Gallery</span>
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="glass-effect border-t mt-32 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 rounded-xl gradient-primary shadow-elegant mr-4">
                  <Code size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Web Sketch Studio
                </h3>
              </div>
              <p className="text-muted-foreground text-lg mb-4">
                Empowering developers with next-generation web development tools
              </p>
              <p className="text-sm text-muted-foreground">
                &copy; 2024 Web Sketch Studio. Crafted with passion for the developer community.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
