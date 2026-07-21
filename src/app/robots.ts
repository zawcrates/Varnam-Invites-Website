import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://varnaminvites.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/my-invites',
        '/my-invitations',
        '/checkout',
        '/success',
        '/admin',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
