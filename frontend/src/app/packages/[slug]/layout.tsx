import { Metadata } from 'next';

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/trips/${params.slug}`);
    if (!res.ok) return { title: 'Package Not Found' };
    
    const trip = await res.json();
    return {
      title: trip.seoTitle || `${trip.title} | Gowings`,
      description: trip.seoDescription || trip.overview,
      openGraph: {
        title: trip.seoTitle || trip.title,
        description: trip.seoDescription || trip.overview,
        images: trip.images?.length ? [{ url: trip.images[0] }] : [],
      }
    };
  } catch (error) {
    return { title: 'Gowings Package' };
  }
}

export default async function PackageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  let trip = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/trips/${params.slug}`);
    if (res.ok) {
      trip = await res.json();
    }
  } catch (e) {}

  const jsonLd = trip ? {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.overview,
    touristType: trip.category?.name || 'Tour',
    offers: {
      '@type': 'Offer',
      price: trip.price,
      priceCurrency: 'INR'
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
