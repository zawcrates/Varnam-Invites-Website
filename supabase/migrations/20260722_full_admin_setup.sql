-- Combined Supabase Migration: Full Admin CMS Setup & Security RLS
-- Run this complete script in Supabase SQL Editor

-- ---------------------------------------------------------------------------
-- 1. Create public.templates Table
-- ---------------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_templates_visibility_order ON public.templates (visibility, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON public.templates (slug);

-- ---------------------------------------------------------------------------
-- 2. Create public.admins Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins (user_id);

-- ---------------------------------------------------------------------------
-- 3. Create Security Definer Helper Function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- 4. Enable Row Level Security (RLS) & Policies for public.admins
-- ---------------------------------------------------------------------------
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admins list" ON public.admins;
CREATE POLICY "Admins can view admins list" 
  ON public.admins FOR SELECT 
  USING (public.is_admin() = true);

-- ---------------------------------------------------------------------------
-- 5. Enable Row Level Security (RLS) & Policies for public.templates
-- ---------------------------------------------------------------------------
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Published Templates" ON public.templates;
CREATE POLICY "Public Read Published Templates" 
  ON public.templates FOR SELECT 
  USING (visibility = 'published' OR public.is_admin() = true);

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

-- ---------------------------------------------------------------------------
-- 6. Storage Buckets & Storage Security Policies
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('template-thumbnails', 'template-thumbnails', true),
  ('template-gallery', 'template-gallery', true),
  ('template-audio', 'template-audio', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Thumbnails" ON storage.objects;
CREATE POLICY "Public Read Thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'template-thumbnails');

DROP POLICY IF EXISTS "Public Read Gallery" ON storage.objects;
CREATE POLICY "Public Read Gallery" ON storage.objects FOR SELECT USING (bucket_id = 'template-gallery');

DROP POLICY IF EXISTS "Public Read Audio" ON storage.objects;
CREATE POLICY "Public Read Audio" ON storage.objects FOR SELECT USING (bucket_id = 'template-audio');

DROP POLICY IF EXISTS "Admin Upload Thumbnails" ON storage.objects;
CREATE POLICY "Admin Upload Thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'template-thumbnails');

DROP POLICY IF EXISTS "Admin Upload Gallery" ON storage.objects;
CREATE POLICY "Admin Upload Gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'template-gallery');

DROP POLICY IF EXISTS "Admin Upload Audio" ON storage.objects;
CREATE POLICY "Admin Upload Audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'template-audio');
