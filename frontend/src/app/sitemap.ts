import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gowings.onrender.com';
  
  // Base routes
  const routes = [
    '',
    '/packages',
    '/destinations',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch dynamic trips
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips?limit=1000`);
    if (res.ok) {
      const { data } = await res.json();
      const tripRoutes = (data || []).map((trip: any) => ({
        url: `${baseUrl}/packages/${trip.slug}`,
        lastModified: new Date(trip.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
      return [...routes, ...tripRoutes];
    }
  } catch (error) {
    console.error('Error generating sitemap for trips', error);
  }

  return routes;
}
