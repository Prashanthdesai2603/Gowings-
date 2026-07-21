import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/sitemap.xml`,
  };
}
