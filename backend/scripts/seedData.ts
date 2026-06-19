import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create Categories
  const categoriesData = [
    { name: 'Domestic', slug: 'domestic', description: 'Travel within the country' },
    { name: 'International', slug: 'international', description: 'Travel abroad' },
    { name: 'Adventure', slug: 'adventure', description: 'Thrill seeking trips' },
    { name: 'Honeymoon', slug: 'honeymoon', description: 'Romantic getaways' },
    { name: 'Family', slug: 'family', description: 'Family friendly tours' },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[created.name] = created.id;
  }
  console.log("Categories seeded.");

  // Create Destinations
  const destinationsData = [
    { name: 'Coorg', slug: 'coorg', country: 'India', image: 'https://images.unsplash.com/photo-1596423735880-5c6fa9586144?auto=format&fit=crop&w=800&q=80' },
    { name: 'Goa', slug: 'goa', country: 'India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dubai', slug: 'dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Kerala', slug: 'kerala', country: 'India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80' },
    { name: 'Maldives', slug: 'maldives', country: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Kashmir', slug: 'kashmir', country: 'India', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80' },
  ];

  const destinations: Record<string, string> = {};
  for (const dest of destinationsData) {
    const created = await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {},
      create: dest,
    });
    destinations[created.name] = created.id;
  }
  console.log("Destinations seeded.");

  // Create Trips
  const tripsData = [
    {
      title: "Coorg Tour Package",
      slug: "coorg-tour",
      categoryId: categories['Domestic'],
      destinationId: destinations['Coorg'],
      overview: "Experience the Scotland of India.",
      highlights: ["Coffee Plantations", "Abbey Falls"],
      itinerary: [{ day: 1, desc: "Arrival" }, { day: 2, desc: "Sightseeing" }],
      inclusions: ["Hotel", "Breakfast"],
      exclusions: ["Flights"],
      price: 12500,
      availableDates: ["2026-07-01", "2026-08-01"],
      images: ["https://images.unsplash.com/photo-1596423735880-5c6fa9586144?auto=format&fit=crop&w=800&q=80"],
      isFeatured: true,
    },
    {
      title: "Goa Beach Holiday",
      slug: "goa-beach",
      categoryId: categories['Domestic'],
      destinationId: destinations['Goa'],
      overview: "Relax on the beautiful beaches of Goa.",
      highlights: ["Baga Beach", "Dudhsagar Falls"],
      itinerary: [{ day: 1, desc: "Arrival" }, { day: 2, desc: "Beach Hopping" }],
      inclusions: ["Resort", "Breakfast", "Transfers"],
      exclusions: ["Flights"],
      price: 18000,
      availableDates: ["2026-07-15", "2026-08-15"],
      images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"],
      isFeatured: true,
    },
    {
      title: "Dubai Luxury Tour",
      slug: "dubai-luxury",
      categoryId: categories['International'],
      destinationId: destinations['Dubai'],
      overview: "Experience the ultimate luxury in Dubai.",
      highlights: ["Burj Khalifa", "Desert Safari"],
      itinerary: [{ day: 1, desc: "Arrival" }, { day: 2, desc: "City Tour" }],
      inclusions: ["Hotel", "Breakfast", "Safari"],
      exclusions: ["Visa", "Flights"],
      price: 55000,
      availableDates: ["2026-09-01", "2026-10-01"],
      images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"],
      isFeatured: true,
    },
    {
      title: "Kerala Backwaters Tour",
      slug: "kerala-backwaters",
      categoryId: categories['Domestic'],
      destinationId: destinations['Kerala'],
      overview: "Sail through the serene backwaters of Kerala.",
      highlights: ["Houseboat Stay", "Munnar Tea Gardens"],
      itinerary: [{ day: 1, desc: "Arrival" }, { day: 2, desc: "Houseboat" }],
      inclusions: ["Houseboat", "All Meals on Houseboat"],
      exclusions: ["Flights"],
      price: 22000,
      availableDates: ["2026-08-10", "2026-09-10"],
      images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"],
      isFeatured: false,
    },
    {
      title: "Maldives Honeymoon Package",
      slug: "maldives-honeymoon",
      categoryId: categories['International'],
      destinationId: destinations['Maldives'],
      overview: "Romantic escape to the Maldives.",
      highlights: ["Water Villa", "Snorkeling"],
      itinerary: [{ day: 1, desc: "Arrival" }, { day: 2, desc: "Leisure" }],
      inclusions: ["Water Villa", "All Inclusive Meals"],
      exclusions: ["Flights"],
      price: 85000,
      availableDates: ["2026-11-01", "2026-12-01"],
      images: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80"],
      isFeatured: true,
    },
    {
      title: "Kashmir Delight",
      slug: "kashmir-delight",
      categoryId: categories['Domestic'],
      destinationId: destinations['Kashmir'],
      overview: "Discover the paradise on earth.",
      highlights: ["Dal Lake", "Gulmarg"],
      itinerary: [{ day: 1, desc: "Arrival" }, { day: 2, desc: "Shikara Ride" }],
      inclusions: ["Hotel", "Breakfast", "Dinner"],
      exclusions: ["Flights"],
      price: 32000,
      availableDates: ["2026-07-20", "2026-08-20"],
      images: ["https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80"],
      isFeatured: false,
    }
  ];

  for (const trip of tripsData) {
    await prisma.trip.upsert({
      where: { slug: trip.slug },
      update: {},
      create: trip,
    });
  }
  console.log("Trips seeded.");

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .then(async () => {
    await prisma.$disconnect();
  });
