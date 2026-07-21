import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // Cache sitemap for 1 hour to reduce DB load

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://varnaminvites.com';
  
  // 1. Define static marketing routes
  const staticRoutes = ['', '/templates', '/pricing', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch all active slugs from the database to generate dynamic invitation pages
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  if (supabaseUrl && supabaseKey) {
    try {
      // Connect using public anon client (since active invitations should be discoverable by search bots)
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase
        .from('published_invitations')
        .select('slug, updated_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        dynamicRoutes = data.map((item) => ({
          url: `${baseUrl}/invite/${item.slug}`,
          lastModified: new Date(item.updated_at).toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      }
    } catch (err) {
      console.warn('[sitemap.ts] Failed to query dynamic slugs for sitemap:', err);
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}
