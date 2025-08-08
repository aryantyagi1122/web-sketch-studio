
-- Enable realtime for the projects table to sync file changes
ALTER TABLE public.projects REPLICA IDENTITY FULL;

-- Add the projects table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;

-- Create a table to track active collaborators on projects
CREATE TABLE public.project_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  cursor_position JSONB DEFAULT '{}',
  current_file_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on project_collaborators
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_collaborators
CREATE POLICY "Users can view collaborators on projects they can access" 
  ON public.project_collaborators 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_id 
      AND (p.user_id = auth.uid() OR p.is_public = true)
    )
  );

CREATE POLICY "Users can insert their own collaborator record" 
  ON public.project_collaborators 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collaborator record" 
  ON public.project_collaborators 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collaborator record" 
  ON public.project_collaborators 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to clean up old collaborator records
CREATE OR REPLACE FUNCTION cleanup_old_collaborators()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.project_collaborators 
  WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$;
