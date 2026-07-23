import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriesConfig = [
  { name: "Karnataka Tours", destinations: ["Coorg", "Chikmagalur", "Mysore", "Hampi", "Jog Falls", "Murudeshwar", "Badami", "Gokarna", "Udupi", "Sakleshpur", "Shivanasamudra", "Bandipur", "Kabini", "Dandeli", "Agumbe", "Kodachadri", "Nandi Hills", "Belur Halebidu", "Kudremukh", "Yana Caves"] },
  { name: "South India Tours", destinations: ["Kerala", "Munnar", "Alleppey", "Wayanad", "Ooty", "Kodaikanal", "Rameswaram", "Madurai", "Pondicherry", "Kanyakumari", "Hyderabad", "Araku Valley", "Yercaud", "Varkala", "Kovalam", "Thekkady", "Cochin", "Athirapally", "Srisailam", "Horsley Hills"] },
  { name: "North India Tours", destinations: ["Manali", "Shimla", "Kashmir", "Leh Ladakh", "Amritsar", "Jaipur", "Udaipur", "Delhi", "Agra", "Varanasi", "Mussoorie", "Nainital", "Auli", "Rishikesh", "Haridwar", "Spiti", "Jaisalmer", "Mount Abu", "Dalhousie", "Dharamshala"] },
  { name: "International Tours", destinations: ["Dubai", "Singapore", "Malaysia", "Thailand", "Bali", "Maldives", "Vietnam", "Sri Lanka", "Bhutan", "Nepal", "Turkey", "Japan", "South Korea", "Switzerland", "Paris", "Italy", "London", "Mauritius", "Seychelles", "Australia"] },
  { name: "Honeymoon Packages", destinations: ["Santorini", "Maldives", "Bali", "Paris", "Bora Bora", "Venice", "Hawaii", "Fiji", "Seychelles", "Amalfi Coast", "Kyoto", "Lucerne", "Maui", "Tahiti", "Prague", "Banff", "Cape Town", "Queenstown", "Phuket", "Palawan"] },
  { name: "Family Packages", destinations: ["Orlando", "Tokyo", "London", "San Diego", "Gold Coast", "Singapore", "Costa Rica", "Yellowstone", "Copenhagen", "Amsterdam", "Honolulu", "Cancun", "Rome", "Barcelona", "Dubai", "Sydney", "Phuket", "Oahu", "Munich", "Reykjavik"] },
  { name: "Group Tours", destinations: ["Ibiza", "Las Vegas", "Amsterdam", "Berlin", "Bangkok", "Mykonos", "Goa", "Rio de Janeiro", "New Orleans", "Dublin", "Prague", "Budapest", "Miami", "Cancun", "Montreal", "Reykjavik", "Tulum", "Nashville", "Austin", "Tokyo"] },
  { name: "Adventure Tours", destinations: ["Rishikesh", "Manali", "Ladakh", "Auli", "Bir Billing", "Andaman", "Gulmarg", "Spiti", "Zanskar", "Meghalaya", "Dandeli", "Gokarna", "Munnar", "Wayanad", "Coorg", "Kamshet", "Kolad", "Goa", "Tawang", "Sikkim"] },
  { name: "Trekking Packages", destinations: ["Roopkund", "Kedarkantha", "Hampta Pass", "Valley of Flowers", "Bhrigu Lake", "Triund", "Goechala", "Kashmir Great Lakes", "Sandakphu", "Kudremukh", "Kumara Parvatha", "Tadiandamol", "Skandagiri", "Mullayanagiri", "Chembra Peak", "Agasthyakoodam", "Nagalapuram", "Dudhsagar", "Rajmachi", "Harishchandragad"] },
  { name: "Pilgrimage Tours", destinations: ["Tirupati", "Mantralaya", "Dharmasthala", "Sringeri", "Kukke", "Sabarimala", "Rameswaram", "Kashi", "Ayodhya", "Mathura", "Vrindavan", "Shirdi", "Somnath", "Dwarka", "Vaishno Devi", "Jagannath", "Puri", "Ujjain", "Omkareshwar", "Mahakaleshwar"] },
  { name: "Customized Tours", destinations: ["Custom India", "Custom Europe", "Custom Asia", "Custom Africa", "Custom America", "Custom Beach", "Custom Mountain", "Custom City", "Custom Village", "Custom Wildlife", "Custom Heritage", "Custom Spiritual", "Custom Adventure", "Custom Wellness", "Custom Culinary", "Custom Photography", "Custom Road Trip", "Custom Cruise", "Custom Train", "Custom Luxury"] },
  { name: "Corporate Tours", destinations: ["Corporate Goa", "Corporate Coorg", "Corporate Wayanad", "Corporate Lonavala", "Corporate Mahabaleshwar", "Corporate Pondicherry", "Corporate Jaipur", "Corporate Udaipur", "Corporate Agra", "Corporate Dubai", "Corporate Singapore", "Corporate Bangkok", "Corporate Pattaya", "Corporate Bali", "Corporate Phuket", "Corporate Colombo", "Corporate Kathmandu", "Corporate Pokhara", "Corporate Thimphu", "Corporate Paro"] },
  { name: "Student Tours", destinations: ["ISRO Bangalore", "NASA Houston", "CERN Geneva", "Silicon Valley", "IIT Bombay", "Oxford University", "Cambridge University", "Harvard University", "MIT Boston", "Stanford University", "Historical Delhi", "Heritage Rajasthan", "Cultural Varanasi", "Wildlife Ranthambore", "Science City Kolkata", "Tech Park Hyderabad", "Eco Tour Kerala", "Adventure Manali", "Space Camp Alabama", "Museums of London"] }
];

const images = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504280390224-4f8be9b23b49?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1533587851505-d119e13bf0b5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80"
];

const adjectives = ["Magical", "Incredible", "Mystic", "Enchanting", "Ultimate", "Royal", "Serene", "Thrilling", "Classic", "Premium", "Exquisite", "Spectacular", "Majestic", "Vibrant", "Peaceful"];
const modifiers = ["Escape", "Getaway", "Expedition", "Journey", "Holiday", "Retreat", "Adventure", "Experience", "Tour", "Safari", "Voyage", "Trek", "Quest"];
const startingCities = ["Bangalore", "Delhi", "Mumbai", "Chennai", "Hyderabad", "Kochi", "Pune", "Kolkata", "Ahmedabad", "Jaipur"];

function getRandom(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000000);
}

function getPriceForDays(days: number, isInternational: boolean) {
  if (isInternational) {
    return Math.floor(Math.random() * (150000 - 25000 + 1)) + 25000;
  }
  if (days === 1) return Math.floor(Math.random() * (2999 - 999 + 1)) + 999;
  if (days === 2) return Math.floor(Math.random() * (6999 - 2999 + 1)) + 2999;
  if (days === 3) return Math.floor(Math.random() * (9999 - 4999 + 1)) + 4999;
  if (days >= 4) return Math.floor(Math.random() * (18999 - 8999 + 1)) + 8999;
  return 9999;
}

async function main() {
  console.log("Starting full packages generation...");

  for (const catConf of categoriesConfig) {
    const catName = catConf.name;
    const destinations = catConf.destinations;
    const isInternational = catName === "International Tours";
    
    // Create/Find Category
    const categorySlug = catName.toLowerCase().replace(/ /g, '-');
    let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      category = await prisma.category.create({
        data: { name: catName, slug: categorySlug, description: `Explore the best of ${catName} with Gowings. Custom curated travel experiences just for you.` }
      });
    }

    // Determine how many packages we need to generate
    const currentPackagesCount = await prisma.trip.count({
      where: { categoryId: category.id }
    });

    const packagesToGenerate = Math.max(0, 20 - currentPackagesCount);
    if (packagesToGenerate === 0) {
      console.log(`Category "${catName}" already has ${currentPackagesCount} packages. Skipping...`);
      continue;
    }

    console.log(`Generating ${packagesToGenerate} packages for "${catName}"...`);

    for (let i = 0; i < packagesToGenerate; i++) {
      const destName = destinations[i % destinations.length];
      
      const destSlug = destName.toLowerCase().replace(/ /g, '-');
      let destination = await prisma.destination.findUnique({ where: { slug: destSlug } });
      if (!destination) {
        destination = await prisma.destination.create({
          data: { name: destName, slug: destSlug, country: isInternational ? "International" : "India" }
        });
      }

      const adj = getRandom(adjectives);
      const mod = getRandom(modifiers);
      const title = `${adj} ${destName} ${mod}`;
      const slug = generateSlug(title);

      const days = Math.floor(Math.random() * 5) + 1; // 1 to 5 days
      const nights = days > 1 ? days - 1 : 0;
      const durationStr = `${days} Days / ${nights} Nights`;

      const itinerary = Array.from({ length: days }).map((_, idx) => ({
        day: idx + 1,
        title: idx === 0 ? `Arrival in ${destName} and Check-in` : idx === days - 1 ? "Departure and Final Memories" : `Exploring the Best of ${destName}`,
        desc: `Experience a fully guided and curated day in ${destName}. From vibrant local markets to stunning landmarks, enjoy comfortable transfers and memorable sights.`
      }));

      const price = getPriceForDays(days, isInternational);
      const originalPrice = Math.floor(price * 1.25);

      await prisma.trip.create({
        data: {
          title,
          slug,
          categoryId: category.id,
          destinationId: destination.id,
          overview: `Experience the finest aspects of ${destName} with our ${durationStr} package. Specifically curated for ${catName}, this trip promises unforgettable memories.`,
          fullDescription: `Embark on an extraordinary journey to ${destName}. This package provides an immersive dive into the local culture, scenic beauty, and key attractions. We handle everything from premium stays to seamless transfers so you can focus on creating memories. Ideal for anyone looking for the ultimate ${catName} experience.`,
          duration: durationStr,
          startingCity: getRandom(startingCities),
          price: originalPrice,
          discountedPrice: price,
          highlights: ["Guided City Tour", "Premium Accommodation", "Local Cuisine Tasting", "Comfortable Transfers", "Experienced Guide"],
          itinerary,
          inclusions: ["Accommodation in 3/4 Star properties", "Daily Breakfast and Dinner", "All necessary transfers and sightseeing", "Professional Driver/Guide"],
          exclusions: ["Flight/Train Tickets", "Personal Expenses", "Entry Fees at Monuments", "Travel Insurance"],
          thingsToCarry: ["Comfortable Clothing & Shoes", "Valid Government ID Proof", "Personal Medications", "Camera & Power Bank", "Sunscreen & Sunglasses"],
          pickupPoint: "Airport / Railway Station / Central Hub",
          dropPoint: "Airport / Railway Station / Central Hub",
          transportation: getRandom(["Private Cab (Sedan/SUV)", "AC Volvo Bus", "Flight + Cab", "Traveller"]),
          accommodation: getRandom(["3 Star Hotels", "4 Star Premium Hotels", "5 Star Luxury Resorts", "Boutique Homestays", "Luxury Camps"]),
          meals: "Breakfast & Dinner Included",
          bestTime: getRandom(["October to March", "Year-round", "Summer Season", "Winter Season"]),
          difficulty: catName === "Trekking Packages" || catName === "Adventure Tours" ? getRandom(["Moderate", "Hard", "Easy to Moderate"]) : "Easy",
          images: [getRandom(images), getRandom(images), getRandom(images)],
          isFeatured: Math.random() > 0.7,
          seoTitle: `${title} | Best ${catName} Package by Gowings`,
          seoDescription: `Book the ${title} package to ${destName}. Enjoy a perfectly planned ${durationStr} trip with premium services at Gowings.`,
          faq: [
            { question: "Is this tour customizable?", answer: "Yes, you can customize this package according to your preferences by contacting our support team." },
            { question: "Are flights included?", answer: "No, flights are excluded by default. However, we can arrange them upon request at an additional cost." },
            { question: "What is the cancellation policy?", answer: "Please refer to our standard cancellation and refund policy." }
          ],
          cancellationPolicy: "Cancellations made 30 days before departure: 10% fee. Cancellations made 15 days before: 50% fee. No refunds for cancellations made within 7 days of departure.",
          refundPolicy: "Refunds are processed within 5-7 business days to the original source of payment after the cancellation is confirmed.",
          paymentTerms: "50% advance at the time of booking. Remaining 50% must be paid at least 7 days before the travel date.",
          availableDates: ["2026-08-01", "2026-08-15", "2026-09-01", "2026-10-10", "2026-11-05", "2026-12-20"]
        }
      });
    }
  }

  console.log("Successfully generated packages for all categories!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .then(async () => {
    await prisma.$disconnect();
  });
