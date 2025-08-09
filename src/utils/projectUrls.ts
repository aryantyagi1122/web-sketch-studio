import { Project } from '@/types/project';

// Helper function to create URL-friendly slug from project name
export const createProjectSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Get category based on project context
export const getProjectCategory = (project: Project, context?: string): string => {
  if (context === 'pinned') return 'pinned';
  if (context === 'team') return 'team';
  if (context === 'community') return 'community';
  if (context === 'ai') return 'ai';
  return 'my-projects';
};

// Generate new URL structure: /page/category/projectname
export const generateProjectUrl = (
  project: Project, 
  type: 'editor' | 'preview' | 'share',
  context?: string
): string => {
  const category = getProjectCategory(project, context);
  const projectSlug = createProjectSlug(project.name);
  const baseUrl = window.location.origin;
  
  return `${baseUrl}/${type}/${category}/${projectSlug}`;
};

// Generate shareable URLs that work on any domain
export const generateShareableUrl = (
  project: Project,
  type: 'editor' | 'preview' | 'share',
  context?: string,
  customDomain?: string
): string => {
  const category = getProjectCategory(project, context);
  const projectSlug = createProjectSlug(project.name);
  const domain = customDomain || window.location.origin;
  
  return `${domain}/${type}/${category}/${projectSlug}`;
};

// Parse URL to extract project info
export const parseProjectUrl = (pathname: string): {
  type: 'editor' | 'preview' | 'share' | null;
  category: string | null;
  projectSlug: string | null;
} => {
  const parts = pathname.split('/').filter(Boolean);
  
  if (parts.length < 3) {
    return { type: null, category: null, projectSlug: null };
  }
  
  const [type, category, projectSlug] = parts;
  
  if (!['editor', 'preview', 'share'].includes(type)) {
    return { type: null, category: null, projectSlug: null };
  }
  
  return {
    type: type as 'editor' | 'preview' | 'share',
    category,
    projectSlug
  };
};

// Find project by slug and category
export const findProjectBySlug = (
  projects: Project[],
  projectSlug: string,
  category: string
): Project | null => {
  return projects.find(project => {
    const slug = createProjectSlug(project.name);
    return slug === projectSlug;
  }) || null;
};