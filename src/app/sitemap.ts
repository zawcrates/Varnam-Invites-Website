import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { TEMPLATES } from '@/data/templates';
import { SEO_CATEGORIES } from '@/data/seoCategories';

export const revalidate = 3600; // Cache sitemap for 1 hour to reduce DB load

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://varnaminvites.com';
  const now = new Date().toISOString();
  
  // 1. Static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/templates',
    '/pricing',
    '/about',
    '/contact',
    '/faq',
    '/privacy-policy',
    '/terms',
    '/refund-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. SEO Landing Category routes
  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(SEO_CATEGORIES).map((slug) => ({
    url: `${baseUrl}/invitations/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Static Template Detail routes
  const templateRoutes: MetadataRoute.Sitemap = TEMPLATES.map((tpl) => ({
    url: `${baseUrl}/templates/${tpl.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // 4. Dynamic published invitations from Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  let publishedRoutes: MetadataRoute.Sitemap = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase
        .from('published_invitations')
        .select('slug, updated_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        publishedRoutes = data.map((item) => ({
          url: `${baseUrl}/invite/${item.slug}`,
          lastModified: new Date(item.updated_at).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      }
    } catch (err) {
      console.warn('[sitemap.ts] Failed to query published invitations for sitemap:', err);
    }
  }

  return [...staticRoutes, ...categoryRoutes, ...templateRoutes, ...publishedRoutes];
}
