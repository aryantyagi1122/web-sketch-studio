
export type FileType = 'html' | 'css' | 'js';
export type ProjectType = 'single' | 'multiple';

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  type: FileType;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  type: ProjectType;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  slug?: string;
  viewCount?: number;
  userEmail?: string;
  isPinned?: boolean;
  deletedAt?: string;
  user_id?: string;
  updated_at?: string;
  is_public?: boolean;
}
