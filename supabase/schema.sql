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
