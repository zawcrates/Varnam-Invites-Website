-- PostgreSQL Database Schema for Varnam Invites (Supabase)

-- 1. Create Templates Table
CREATE TABLE public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    original_price INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url VARCHAR(500),
    features TEXT[] DEFAULT '{}',
    default_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Invitations Table
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_slug VARCHAR(100) NOT NULL REFERENCES public.templates(slug) ON DELETE RESTRICT,
    invite_data JSONB NOT NULL,
    billing_details JSONB NOT NULL,
    is_paid BOOLEAN DEFAULT false NOT NULL,
    payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add Index for lookup speeds
CREATE INDEX idx_invitations_paid ON public.invitations (is_paid);

-- 3. Set up Row Level Security (RLS) policies for Supabase
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Templates policies: Anyone can read templates, only admins can modify (DB level bypass or custom service role)
CREATE POLICY "Allow public read-only access to templates"
ON public.templates
FOR SELECT
TO public
USING (true);

-- Invitations policies:
-- Anyone can read an invitation if it's paid
CREATE POLICY "Allow public read access to paid invitations"
ON public.invitations
FOR SELECT
TO public
USING (is_paid = true);

-- Anyone can insert a new draft invitation (during checkout before payment)
CREATE POLICY "Allow public creation of invitations"
ON public.invitations
FOR INSERT
TO public
WITH CHECK (true);

-- Update trigger for updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invitations_modtime
    BEFORE UPDATE ON public.invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- 4. Seed initial templates data
INSERT INTO public.templates (slug, name, price, original_price, category, description, thumbnail_url, features, default_data)
VALUES (
    'vintage-parchment',
    'Vintage Parchment Scroll',
    999,
    1999,
    'Vintage',
    'A premium classic invitation showcasing real-time parallax mountain sky scrolling, authentic calligraphy fonts, a torn-paper parchment feel, custom map directions, and background music player.',
    '/invite.webp',
    ARRAY['Smooth Parallax scrolling animation', 'Traditional calligraphy typography', 'Embedded Interactive Google Maps', 'One-click WhatsApp RSVP integration', 'Background audio player (MP3 auto-play)'],
    '{"showPreloader": true, "preloaderTime": 0.7, "groomName": "Virat Kohli", "connector": "Weds", "brideName": "Anushka Sharma", "welcomeTop": "TOGETHER WITH THEIR FAMILIES", "andText": "AND", "inviteText1": "cordially invite you and your family to join the occasion of", "inviteText2": "their joyous wedding festivities", "month": "NOVEMBER", "dateDetails": "SUNDAY | 23 | 2025", "time": "7:45 AM - 8:45 AM", "locationLine1": "THE GRAND BALLROOM", "locationLine2": "123 WEDDING AVENUE, NEW YORK", "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001696423075!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin", "storyText": "Our journey together began with a simple conversation, and now we are embarking on a lifelong adventure of love and companionship. Join us as we exchange our vows and celebrate the beginning of our forever.", "whatsappNumber": "1234567890", "audioSrc": "/bg_music.mp3"}'::jsonb
),
(
    'royal-heritage',
    'Royal Rajputana Palace',
    1299,
    2499,
    'Traditional',
    'A majestic traditional Indian invitation featuring deep crimson backgrounds, ornate golden mandalas, and palace arch visuals with sitar ambient music.',
    '/canvas 1.webp',
    ARRAY['Rich golden mandala motifs', 'Traditional Indian palace artwork', 'Sitar instrumental background music', 'Personalized wedding functions timeline', 'One-click WhatsApp RSVP integration'],
    '{"showPreloader": true, "preloaderTime": 0.7, "groomName": "Ranveer Singh", "connector": "Weds", "brideName": "Deepika Padukone", "welcomeTop": "WITH THE BLESSINGS OF ALMIGHTY AND ANCESTORS", "andText": "AND", "inviteText1": "humbly solicit your gracious presence at the wedding ceremony of", "inviteText2": "their beloved children", "month": "DECEMBER", "dateDetails": "WEDNESDAY | 18 | 2026", "time": "6:00 PM onwards", "locationLine1": "THE PALACE PALAZZO", "locationLine2": "JAIPUR ROAD, JAIPUR", "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.673891461947!2d75.7872709!3d26.9124336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db61234b5f8ef%3A0x8677c77c07b6c8d7!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin", "storyText": "Two hearts bound by love, celebrating a union of two families. We invite you to bless our union as we take our sacred vows in the royal heritage of Rajasthan.", "whatsappNumber": "9876543210", "audioSrc": "/bg_music.mp3"}'::jsonb
);

-- 5. Create Profiles Table (Sprint 2)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Allow users to view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Allow trigger to insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Trigger for auto-syncing profiles from auth.users (idempotent)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, avatar_url, phone)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Guest'),
        new.raw_user_meta_data->>'avatar_url',
        COALESCE(new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'mobile')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Trigger for profiles updated_at modification time
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- ==========================================================================
-- 6. Create Projects Table (Sprint 3)
-- ==========================================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title           TEXT NOT NULL DEFAULT 'My Invitation Draft',
    template_slug   TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'draft' CHECK (status = 'draft'),
    draft_data      JSONB NOT NULL,
    last_opened_at  TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at      TIMESTAMP WITH TIME ZONE
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_projects_user_id    ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_template   ON public.projects(template_slug);
CREATE INDEX IF NOT EXISTS idx_projects_status     ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON public.projects(deleted_at);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users may only see their own non-deleted projects
CREATE POLICY "Allow users to view own projects"
ON public.projects
FOR SELECT
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Users may only insert their own projects
CREATE POLICY "Allow users to insert own projects"
ON public.projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users may only update their own projects
CREATE POLICY "Allow users to update own projects"
ON public.projects
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at on every row change
CREATE TRIGGER update_projects_modtime
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- ==========================================================================
-- 7. Create Published Invitations Table (Sprint 5)
-- ==========================================================================

CREATE TABLE IF NOT EXISTS public.published_invitations (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id         UUID UNIQUE NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    slug               TEXT UNIQUE NOT NULL,
    is_active          BOOLEAN DEFAULT TRUE NOT NULL,
    published_version  INTEGER DEFAULT 1 NOT NULL,
    published_at       TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_pub_inv_slug       ON public.published_invitations(slug);
CREATE INDEX IF NOT EXISTS idx_pub_inv_project_id ON public.published_invitations(project_id);
CREATE INDEX IF NOT EXISTS idx_pub_inv_is_active  ON public.published_invitations(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.published_invitations ENABLE ROW LEVEL SECURITY;

-- Owner Policies (Only the authenticated user who owns the associated project can view or manage its publication)
CREATE POLICY "Allow owners to view own publications"
ON public.published_invitations
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Allow owners to insert own publications"
ON public.published_invitations
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid() AND p.status = 'paid'
    )
);

CREATE POLICY "Allow owners to update own publications"
ON public.published_invitations
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = project_id AND p.user_id = auth.uid()
    )
);

-- Secure RPC function (SECURITY DEFINER)
-- Bypasses table-level RLS to fetch only the necessary rendering payload for public routes.
CREATE OR REPLACE FUNCTION public.get_public_invitation(p_slug TEXT)
RETURNS TABLE (
    template_slug TEXT,
    draft_data JSONB
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT p.template_slug, p.draft_data
    FROM public.published_invitations pi
    JOIN public.projects p ON pi.project_id = p.id
    WHERE pi.slug = p_slug 
      AND pi.is_active = TRUE 
      AND p.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on published_invitations row changes
CREATE TRIGGER update_published_invitations_modtime
    BEFORE UPDATE ON public.published_invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

