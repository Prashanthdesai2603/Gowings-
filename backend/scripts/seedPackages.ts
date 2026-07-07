import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriesList = [
  "Karnataka Tours", "South India Tours", "North India Tours", "International Tours",
  "Honeymoon Packages", "Family Packages", "Group Tours", "Adventure Tours",
  "Trekking Packages", "Pilgrimage Tours", "Customized Tours", "Corporate Tours", "Student Tours"
];

const destinationsList = [
  { name: "Mysore", country: "India" }, { name: "Hampi", country: "India" }, { name: "Coorg", country: "India" },
  { name: "Gokarna", country: "India" }, { name: "Ooty", country: "India" }, { name: "Munnar", country: "India" },
  { name: "Kochi", country: "India" }, { name: "Jaipur", country: "India" }, { name: "Udaipur", country: "India" },
  { name: "Manali", country: "India" }, { name: "Leh Ladakh", country: "India" }, { name: "Varanasi", country: "India" },
  { name: "Rishikesh", country: "India" }, { name: "Bali", country: "Indonesia" }, { name: "Phuket", country: "Thailand" },
  { name: "Maldives", country: "Maldives" }, { name: "Dubai", country: "UAE" }, { name: "Singapore", country: "Singapore" },
  { name: "Paris", country: "France" }, { name: "Swiss Alps", country: "Switzerland" }
];

const images = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504280390224-4f8be9b23b49?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1533587851505-d119e13bf0b5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=800&q=80"
];

const adjectives = ["Magical", "Incredible", "Mystic", "Enchanting", "Ultimate", "Royal", "Serene", "Thrilling", "Classic", "Premium"];
const modifiers = ["Escape", "Getaway", "Expedition", "Journey", "Holiday", "Retreat", "Adventure", "Experience", "Tour", "Safari"];

function getRandom(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);
}

async function main() {
  console.log("Starting packages generation...");

  // Create Categories
  const categoryMap: Record<string, string> = {};
  for (const catName of categoriesList) {
    const slug = catName.toLowerCase().replace(/ /g, '-');
    const created = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: catName, slug, description: `Best ${catName} curated for you.` },
    });
    categoryMap[catName] = created.id;
  }
  console.log("Categories created.");

  // Create Destinations
  const destMap: Record<string, string> = {};
  for (const dest of destinationsList) {
    const slug = dest.name.toLowerCase().replace(/ /g, '-');
    const created = await prisma.destination.upsert({
      where: { slug },
      update: {},
      create: { name: dest.name, slug, country: dest.country },
    });
    destMap[dest.name] = created.id;
  }
  console.log("Destinations created.");

  // Generate 100 Packages
  let count = 0;
  for (let i = 0; i < 100; i++) {
    const dest = getRandom(destinationsList).name;
    const cat = getRandom(categoriesList);
    const adj = getRandom(adjectives);
    const mod = getRandom(modifiers);
    
    const title = `${adj} ${dest} ${mod}`;
    const slug = generateSlug(title);
    
    const days = Math.floor(Math.random() * 10) + 2; // 2 to 11 days
    const nights = days - 1;
    const durationStr = `${days} Days / ${nights} Nights`;
    
    const itinerary = Array.from({ length: days }).map((_, idx) => ({
      day: idx + 1,
      title: idx === 0 ? "Arrival and Check-in" : idx === days - 1 ? "Departure" : `Sightseeing and Activities in ${dest}`,
      desc: "Enjoy a fully guided and curated experience for the day with comfortable transfers and mesmerizing views."
    }));

    const price = Math.floor(Math.random() * 150000) + 5000;

    await prisma.trip.create({
      data: {
        title,
        slug,
        categoryId: categoryMap[cat],
        destinationId: destMap[dest],
        overview: `Experience the best of ${dest} with our exclusively crafted ${durationStr} package. Perfect for ${cat.toLowerCase()}.`,
        fullDescription: `Embark on an unforgettable journey to ${dest}. This package offers an immersive experience into the local culture, breathtaking landscapes, and thrilling activities. From comfortable stays to guided tours, everything is perfectly arranged to ensure you have a hassle-free and memorable trip. Book now to explore the hidden gems and popular attractions.`,
        duration: durationStr,
        startingCity: getRandom(["Bangalore", "Delhi", "Mumbai", "Chennai", "Kochi"]),
        price,
        highlights: ["Guided City Tour", "Premium Accommodation", "Local Cuisine Tasting", "Comfortable Transfers"],
        itinerary,
        inclusions: ["Accommodation in 3/4 Star Hotels", "Daily Breakfast", "Airport/Station Transfers", "Sightseeing as per itinerary"],
        exclusions: ["Flight/Train Tickets", "Personal Expenses", "Entry Fees at Monuments", "Travel Insurance"],
        thingsToCarry: ["Comfortable Clothing", "Valid ID Proof", "Personal Medications", "Camera", "Sunscreen"],
        pickupPoint: "Airport / Railway Station",
        dropPoint: "Airport / Railway Station",
        transportation: getRandom(["Private Cab (Sedan/SUV)", "AC Volvo Bus", "Flight + Cab"]),
        accommodation: getRandom(["3 Star Hotels", "4 Star Premium Hotels", "5 Star Luxury Resorts", "Boutique Homestays"]),
        meals: "Breakfast Included",
        bestTime: getRandom(["October to March", "Year-round", "Summer Season", "Winter Season"]),
        difficulty: cat === "Trekking Packages" || cat === "Adventure Tours" ? getRandom(["Moderate", "Hard", "Easy to Moderate"]) : "Easy",
        images: [getRandom(images), getRandom(images)],
        isFeatured: Math.random() > 0.8,
        seoTitle: `${title} - ${cat} by Gowings`,
        seoDescription: `Book the ${title} package to ${dest}. Enjoy a ${durationStr} trip with best prices and premium services by Gowings.`,
        faq: [
          { question: "Is this tour customizable?", answer: "Yes, you can customize this package according to your preferences by contacting our support team." },
          { question: "Are flights included?", answer: "No, flights are generally excluded unless specifically requested. We can arrange them at an additional cost." },
          { question: "What is the cancellation policy?", answer: "Please refer to the cancellation policy section for detailed terms and conditions." }
        ],
        cancellationPolicy: "Cancellations made 30 days before departure will incur a 10% fee. Cancellations made 15 days before will incur a 50% fee. No refunds for cancellations made within 7 days of departure.",
        availableDates: ["2026-08-01", "2026-09-01", "2026-10-01", "2026-11-01", "2026-12-01"]
      }
    });
    count++;
  }

  console.log(`Successfully generated ${count} packages!`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .then(async () => {
    await prisma.$disconnect();
  });
