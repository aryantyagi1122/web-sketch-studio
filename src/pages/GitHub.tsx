
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { ArrowLeft, Github, GitBranch, GitFork, GitPullRequest, Code, Upload, Download, Loader2 } from 'lucide-react';

const GitHub = () => {
  const navigate = useNavigate();
  const { user } = useFirebase();
  const { projects, currentProject } = useProject();
  const [githubUsername, setGithubUsername] = useState('');
  const [repoName, setRepoName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [token, setToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Load GitHub connection status from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('github-token');
    const savedUsername = localStorage.getItem('github-username');
    
    if (savedToken && savedUsername) {
      setToken(savedToken);
      setGithubUsername(savedUsername);
      setIsConnected(true);
    }
    
    // Set default selected project to current project if any
    if (currentProject) {
      setSelectedProject(currentProject.id);
    }
  }, [currentProject]);

  const handleConnect = async () => {
    if (!githubUsername || !token) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Validate GitHub token by making a simple API request
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Invalid GitHub token');
      }
      
      // Store connection info in localStorage
      localStorage.setItem('github-token', token);
      localStorage.setItem('github-username', githubUsername);
      
      setIsConnected(true);
      toast.success('Connected to GitHub successfully!');
    } catch (error) {
      console.error('GitHub connection error:', error);
      toast.error('Failed to connect to GitHub: ' + (error.message || 'Unknown error'));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleExport = async () => {
    if (!selectedProject) {
      toast.error('Please select a project to export');
      return;
    }
    
    if (!repoName) {
      toast.error('Please enter a repository name');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const project = projects.find(p => p.id === selectedProject);
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      // Check if repo exists first
      const checkRepoResponse = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}`, {
        headers: {
          Authorization: `token ${token}`
        }
      });
      
      // If repo doesn't exist, create it
      if (checkRepoResponse.status === 404) {
        const createRepoResponse = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: repoName,
            description: project.description,
            private: true
          })
        });
        
        if (!createRepoResponse.ok) {
          throw new Error('Failed to create repository');
        }
      } else if (!checkRepoResponse.ok) {
        throw new Error('Error checking repository');
      }
      
      // For each file in the project, create a file in the repo
      for (const file of project.files) {
        await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/contents/${file.name}`, {
          method: 'PUT',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Add ${file.name}`,
            content: btoa(file.content), // Base64 encode the content
            branch: 'main'
          })
        });
      }
      
      // Create README.md if it doesn't exist
      const readmeContent = `# ${project.name}\n\n${project.description}\n\nCreated with Web Sketch Studio`;
      
      await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/contents/README.md`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Add README.md',
          content: btoa(readmeContent),
          branch: 'main'
        })
      });
      
      toast.success('Project exported to GitHub successfully!');
    } catch (error) {
      console.error('GitHub export error:', error);
      toast.error('Failed to export to GitHub: ' + (error.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImport = async () => {
    if (!repoUrl) {
      toast.error('Please enter a repository URL');
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Parse repo owner and name from URL
      const repoUrlPattern = /github\.com\/([^/]+)\/([^/]+)/;
      const matches = repoUrl.match(repoUrlPattern);
      
      if (!matches || matches.length < 3) {
        throw new Error('Invalid GitHub repository URL');
      }
      
      const [, owner, repo] = matches;
      
      // Get repo contents
      const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers: {
          Authorization: `token ${token}`
        }
      });
      
      if (!contentsResponse.ok) {
        throw new Error('Failed to access repository');
      }
      
      const contents = await contentsResponse.json();
      
      // Filter for supported file types
      const supportedFiles = contents.filter(item => 
        item.type === 'file' && 
        (item.name.endsWith('.html') || item.name.endsWith('.css') || item.name.endsWith('.js'))
      );
      
      if (supportedFiles.length === 0) {
        throw new Error('No supported files found in the repository');
      }
      
      // TODO: Actually create a project from these files
      // This would require modifications to the createProject function
      
      toast.success('Repository imported successfully! Project creation from import is not yet implemented.');
    } catch (error) {
      console.error('GitHub import error:', error);
      toast.error('Failed to import from GitHub: ' + (error.message || 'Unknown error'));
    } finally {
      setIsImporting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('github-token');
    localStorage.removeItem('github-username');
    setToken('');
    setGithubUsername('');
    setIsConnected(false);
    toast.success('Disconnected from GitHub');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">GitHub Integration</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Github className="h-8 w-8 mr-3 text-black" />
            <h2 className="text-xl font-semibold">{isConnected ? 'GitHub Connected' : 'Connect to GitHub'}</h2>
          </div>
          
          {isConnected ? (
            <div>
              <p className="text-gray-600 mb-6">
                You are connected to GitHub as <span className="font-medium">{githubUsername}</span>.
              </p>
              <Button onClick={handleDisconnect} variant="outline" className="flex items-center">
                <Github className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Link your GitHub account to push and pull your projects directly to and from GitHub repositories.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="github-username">GitHub Username</Label>
                  <Input 
                    id="github-username" 
                    placeholder="Enter your GitHub username" 
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="github-token">GitHub Personal Access Token</Label>
                  <Input 
                    id="github-token" 
                    type="password"
                    placeholder="Enter your GitHub token" 
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Create a token
                    </a> with 'repo' scope
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="flex items-center"
              >
                {isConnecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Github className="h-4 w-4 mr-2" />}
                {isConnecting ? 'Connecting...' : 'Connect GitHub Account'}
              </Button>
            </>
          )}
        </div>

        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Upload className="h-6 w-6 mr-2 text-blue-600" />
                <h2 className="text-lg font-semibold">Export to GitHub</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Push your project to a GitHub repository.
              </p>

              <div className="space-y-4 mb-4">
                <div>
                  <Label htmlFor="export-project">Select Project</Label>
                  <select 
                    id="export-project"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="repo-name">Repository Name</Label>
                  <Input 
                    id="repo-name" 
                    placeholder="Enter repository name" 
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleExport} 
                variant="outline" 
                className="w-full flex items-center justify-center"
                disabled={isExporting}
              >
                {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {isExporting ? 'Exporting...' : 'Export Project'}
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Download className="h-6 w-6 mr-2 text-green-600" />
                <h2 className="text-lg font-semibold">Import from GitHub</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Pull an existing repository into a new project.
              </p>

              <div className="mb-4">
                <Label htmlFor="repo-url">Repository URL</Label>
                <Input 
                  id="repo-url" 
                  placeholder="https://github.com/username/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
                disabled={isImporting}
                onClick={handleImport}
              >
                {isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {isImporting ? 'Importing...' : 'Import Repository'}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">GitHub Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <GitBranch className="h-10 w-10 mb-2 text-purple-600" />
              <h3 className="font-medium text-center">Branch Management</h3>
              <p className="text-sm text-gray-500 text-center mt-1">Create and manage branches</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <GitPullRequest className="h-10 w-10 mb-2 text-blue-600" />
              <h3 className="font-medium text-center">Pull Requests</h3>
              <p className="text-sm text-gray-500 text-center mt-1">Review and merge code</p>
            </div>
            
            <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
              <Code className="h-10 w-10 mb-2 text-green-600" />
              <h3 className="font-medium text-center">Code Reviews</h3>
              <p className="text-sm text-gray-500 text-center mt-1">Collaborate with others</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHub;
