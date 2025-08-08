
-- Create a separate table to track user pins for any project
CREATE TABLE public.user_pins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_pins ENABLE ROW LEVEL SECURITY;

-- Users can only see their own pins
CREATE POLICY "Users can view their own pins" 
  ON public.user_pins 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own pins
CREATE POLICY "Users can create their own pins" 
  ON public.user_pins 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own pins
CREATE POLICY "Users can delete their own pins" 
  ON public.user_pins 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_pins_user_id ON public.user_pins(user_id);
CREATE INDEX idx_user_pins_project_id ON public.user_pins(project_id);
