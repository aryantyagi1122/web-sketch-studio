import React from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Code, FileText, Palette, Zap, Globe, Users, Shield, Sparkles, ChevronRight, Play } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Code,
      title: "Code Editor",
      description: "Write HTML, CSS, and JavaScript with syntax highlighting and auto-completion"
    },
    {
      icon: FileText,
      title: "Project Management",
      description: "Organize your projects with our intuitive file and folder management system"
    },
    {
      icon: Palette,
      title: "Live Preview",
      description: "See your changes instantly with our real-time preview functionality"
    },
    {
      icon: Zap,
      title: "AI Builder",
      description: "Generate code using artificial intelligence to speed up your development"
    },
    {
      icon: Globe,
      title: "Instant Deployment",
      description: "Deploy your projects instantly and share them with the world"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team in real-time collaborative editing"
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your projects are stored securely in the cloud with automatic backups"
    },
    {
      icon: Sparkles,
      title: "Modern Interface",
      description: "Beautiful, responsive interface that works on all devices"
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="About - Web Sketch Studio"
        description="Learn about Web Sketch Studio - the ultimate online code editor for HTML, CSS, and JavaScript"
        keywords="about, web editor, online IDE, code editor"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
        {/* Enhanced Hero Section */}
        <div className="relative w-full flex items-center justify-center px-4 pt-6 pb-12 lg:pb-20 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/15 to-pink-600/15 rounded-full blur-3xl"></div>
          </div>

          {/* Main hero content */}
          <div className="relative w-full max-w-7xl mx-auto">
            <div 
              className="shadow-2xl p-8 sm:p-12 lg:p-16 xl:p-20 relative overflow-hidden rounded-none"
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
                boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(37, 99, 235, 0.3)"
              }}
            >              
              {/* Content */}
              <div className="relative z-10 text-center">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full shadow-lg mb-8 hover:bg-white/30 transition-all duration-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-wide">Professional Web Development Platform</span>
                </div>

                {/* Main heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                  Free Online
                  <br />
                  Code Editor
                </h1>

                {/* Subtitle */}


                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                  <Button
                    size="lg"
                    className="group bg-white text-blue-700 hover:bg-blue-50 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                    onClick={() => navigate('/')}
                  >
                    <span className="flex items-center gap-2 text-blue-700">
                      <Code className="w-5 h-5" />
                      Start Coding Now
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="group bg-white/20 backdrop-blur border-2 border-white/30 text-white hover:bg-white/30 hover:border-white/50 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => navigate('/ai-builder')}
                  >
                    <span className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Try AI Builder
                    </span>
                  </Button>
                </div>

                {/* Stats or features preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
                    <div className="text-3xl font-bold text-white mb-2">50K+</div>
                    <div className="text-sm text-blue-100 font-medium">Active Developers</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
                    <div className="text-3xl font-bold text-white mb-2">100K+</div>
                    <div className="text-sm text-blue-100 font-medium">Projects Created</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
                    <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-sm text-blue-100 font-medium">Uptime</div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent"></div>
            </div>
          </div>

          {/* Floating code snippets decoration */}
          <div className="absolute top-20 left-10 hidden lg:block">
            <div className="bg-white/80 backdrop-blur border border-white/30 rounded-lg p-3 shadow-lg rotate-12 hover:rotate-6 transition-transform duration-500">
              <code className="text-blue-600 text-xs">&lt;div class="hero"&gt;</code>
            </div>
          </div>
          
          <div className="absolute bottom-32 right-16 hidden lg:block">
            <div className="bg-white/80 backdrop-blur border border-white/30 rounded-lg p-3 shadow-lg -rotate-12 hover:-rotate-6 transition-transform duration-500">
              <code className="text-indigo-600 text-xs">function build() {}</code>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build amazing web projects, all in one place
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white shadow-lg group hover:scale-[1.035] hover:shadow-xl transition-all duration-250 border border-blue-100">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-blue-700">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-blue-800">Why Choose Web Sketch Studio?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-blue-700">Lightning Fast</h3>
                    <p className="text-gray-600">No downloads, no setup. Start coding instantly in your browser.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-blue-700">Collaborative</h3>
                    <p className="text-gray-600">Work with your team in real-time with shared projects.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-blue-700">Secure & Reliable</h3>
                    <p className="text-gray-600">Your projects are safely stored in the cloud with automatic backups.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white border border-blue-100 shadow-lg rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 opacity-50"></div>
                <div className="relative">
                  <h3 className="text-2xl font-bold mb-4 text-blue-700">Ready to Start Building?</h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of developers who use Web Sketch Studio to bring their ideas to life.
                  </p>
                  <Button
                    className="bg-blue-700 text-white font-bold shadow-lg hover:bg-blue-800 transition"
                    onClick={() => navigate('/')}
                  >
                    Get Started Today
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;