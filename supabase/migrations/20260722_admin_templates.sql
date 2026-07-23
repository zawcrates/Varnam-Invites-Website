-- Supabase Migration: Admin Template Management & Storage Buckets
-- Created for Varnam Invites CMS

-- 1. Create templates table
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

-- Index for fast public catalog queries
CREATE INDEX IF NOT EXISTS idx_templates_visibility_order ON public.templates (visibility, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON public.templates (slug);

-- 2. Create Storage Buckets for Template Assets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('template-thumbnails', 'template-thumbnails', true),
  ('template-gallery', 'template-gallery', true),
  ('template-audio', 'template-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Security Policies (Public read, authenticated insert/update/delete)
CREATE POLICY "Public Read Thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'template-thumbnails');
CREATE POLICY "Public Read Gallery" ON storage.objects FOR SELECT USING (bucket_id = 'template-gallery');
CREATE POLICY "Public Read Audio" ON storage.objects FOR SELECT USING (bucket_id = 'template-audio');

CREATE POLICY "Admin Upload Thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'template-thumbnails');
CREATE POLICY "Admin Upload Gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'template-gallery');
CREATE POLICY "Admin Upload Audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'template-audio');
