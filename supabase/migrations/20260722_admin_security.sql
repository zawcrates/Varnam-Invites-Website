-- Supabase Migration: Admin Security & Row Level Security (RLS)
-- Created for Varnam Invites Platform

-- Ensure public.templates exists before applying policies
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  original_price NUMERIC NOT NULL CHECK (original_price >= 0),
  rating NUMERIC DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('Vintage', 'Traditional', 'Modern', 'Floral')),
  description TEXT,
  thumbnail TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  audio_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  default_data JSONB NOT NULL,
  seo_metadata JSONB DEFAULT '{}'::jsonb,
  visibility TEXT DEFAULT 'published' CHECK (visibility IN ('draft', 'published', 'archived', 'hidden')),
  featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  priority INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 1. Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins (user_id);

-- 2. Security Definer Helper Function to verify if auth.uid() is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Enable RLS on public.admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admins list" ON public.admins;
CREATE POLICY "Admins can view admins list" 
  ON public.admins FOR SELECT 
  USING (public.is_admin() = true);

-- 4. Enable RLS on public.templates
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Public read access restricted strictly to published templates (or full access if admin)
DROP POLICY IF EXISTS "Public Read Published Templates" ON public.templates;
CREATE POLICY "Public Read Published Templates" 
  ON public.templates FOR SELECT 
  USING (visibility = 'published' OR public.is_admin() = true);

-- Admin-only write operations
DROP POLICY IF EXISTS "Admin Insert Templates" ON public.templates;
CREATE POLICY "Admin Insert Templates" 
  ON public.templates FOR INSERT 
  WITH CHECK (public.is_admin() = true);

DROP POLICY IF EXISTS "Admin Update Templates" ON public.templates;
CREATE POLICY "Admin Update Templates" 
  ON public.templates FOR UPDATE 
  USING (public.is_admin() = true);

DROP POLICY IF EXISTS "Admin Delete Templates" ON public.templates;
CREATE POLICY "Admin Delete Templates" 
  ON public.templates FOR DELETE 
  USING (public.is_admin() = true);
