import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COMMON_INCLUSIONS = [
  "Transportation",
  "Trek Permit",
  "Forest Entry Fees",
  "Trek Leader",
  "Guide",
  "First Aid",
  "Dormitory Stay",
  "Campfire (If Weather Permits)",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Tea & Snacks"
];

const COMMON_EXCLUSIONS = [
  "Personal Expenses",
  "Medical Expenses",
  "Travel Insurance",
  "Anything not mentioned under inclusions",
  "Additional Food",
  "Camera Charges"
];

const THINGS_TO_CARRY = [
  "Backpack",
  "Trekking Shoes",
  "Water Bottle",
  "Raincoat",
  "Extra Clothes",
  "Torch",
  "Power Bank",
  "Personal Medicines",
  "Energy Snacks",
  "Cap",
  "Sunglasses",
  "Jacket",
  "Identity Proof"
];

const REFUND_POLICY = `Refund Policy

If cancellations are made 30 days before the start date of the trip, 50% of the trip cost will be charged as cancellation fees.

If cancellations are made 15-30 days before the start date of the trip, 75% of the trip cost will be charged as cancellation fees.

If cancellations are made within 0-15 days before the start date of the trip, 100% of the trip cost will be charged as cancellation fees.

In the case of unforeseen weather conditions or government restrictions, certain activities may be canceled and in such cases, the operator will try his best to provide an alternate feasible activity.

However, no refund will be provided.`;

const CANCELLATION_POLICY = `90 Days or more:
No Charge

89 Days to 60 Days:
30%

59 Days to 45 Days:
50%

44 Days to 30 Days:
60%

29 Days to 15 Days:
80%

14 Days to 1 Day:
No Refund

Weather or Government restrictions are non-refundable.`;

const PAYMENT_TERMS = `Booking Amount:
30%

Remaining Amount:
Must be paid before trek departure.

Payments accepted:

UPI

Bank Transfer

Cash`;

const defaultItinerary = [
  {
    title: "Departure from Bangalore",
    description: "Start your journey from Bangalore at night. Briefing by the trek leader."
  },
  {
    title: "Trek Day",
    description: "Reach base camp, have breakfast, and start the trek. Enjoy the breathtaking views from the peak. Descend back to the base camp, have dinner, and rest."
  },
  {
    title: "Sightseeing and Return",
    description: "Wake up, have breakfast, visit nearby attractions if time permits, and start the journey back to Bangalore. Reach Bangalore by night."
  }
];

const treksData = [
  {
    title: "Kudremukh Trek",
    slug: "kudremukh-trek",
    location: "Chikmagalur, Karnataka",
    price: 2999,
    discountedPrice: 2899,
    altitude: "6,207 ft",
    difficulty: "Moderate",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1598091383021-14d7971842cc?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Mullayanagiri Trek",
    slug: "mullayanagiri-trek",
    location: "Chikmagalur, Karnataka",
    price: 2499,
    discountedPrice: 2399,
    altitude: "6,330 ft",
    difficulty: "Easy to Moderate",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1626019230554-046645391d4d?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Kumara Parvatha (Pushpagiri) Trek",
    slug: "kumara-parvatha-trek",
    location: "Coorg, Karnataka",
    price: 3499,
    discountedPrice: 3299,
    altitude: "5,624 ft",
    difficulty: "Difficult",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1596707323891-fb45f1b20af0?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Tadiandamol Peak Trek",
    slug: "tadiandamol-peak-trek",
    location: "Coorg, Karnataka",
    price: 2599,
    discountedPrice: 2499,
    altitude: "5,724 ft",
    difficulty: "Moderate",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1627885746377-2f7d983e25b3?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Netravati Peak Trek",
    slug: "netravati-peak-trek",
    location: "Chikmagalur, Karnataka",
    price: 2899,
    discountedPrice: 2799,
    altitude: "5,000+ ft",
    difficulty: "Moderate",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1599385611417-7a5611e3b6eb?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Kodachadri Trek",
    slug: "kodachadri-trek",
    location: "Shimoga, Karnataka",
    price: 2799,
    discountedPrice: 2699,
    altitude: "4,406 ft",
    difficulty: "Moderate to Difficult",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1601242337775-7cc8a0b0d6dc?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Bandaje Falls Trek",
    slug: "bandaje-falls-trek",
    location: "Dakshina Kannada, Karnataka",
    price: 3199,
    discountedPrice: 2999,
    altitude: "4,800 ft",
    difficulty: "Moderate to Difficult",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1579624599187-57fa4ec5e96a?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Brahmagiri Trek",
    slug: "brahmagiri-trek",
    location: "Kodagu, Karnataka",
    price: 2699,
    discountedPrice: 2599,
    altitude: "5,276 ft",
    difficulty: "Moderate",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1600868848135-e4659bba3526?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Nishani Motte Trek",
    slug: "nishani-motte-trek",
    location: "Coorg, Karnataka",
    price: 2799,
    discountedPrice: 2699,
    altitude: "4,167 ft",
    difficulty: "Moderate",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1596707323891-fb45f1b20af0?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Agumbe Ghat Trek",
    slug: "agumbe-ghat-trek",
    location: "Shimoga, Karnataka",
    price: 2299,
    discountedPrice: 2199,
    altitude: "2,700 ft",
    difficulty: "Easy to Moderate",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1623869850125-992a061805f1?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Narasimha Parvatha Trek",
    slug: "narasimha-parvatha-trek",
    location: "Agumbe, Karnataka",
    price: 2999,
    discountedPrice: 2899,
    altitude: "3,779 ft",
    difficulty: "Difficult",
    duration: "2 Days / 1 Night",
    images: ["https://images.unsplash.com/photo-1601242337775-7cc8a0b0d6dc?auto=format&fit=crop&w=800&q=80"],
  }
];

async function main() {
  console.log("Starting DB seed for Treks...");

  // Ensure Trekking Category exists
  let category = await prisma.category.findUnique({ where: { slug: 'trekking' } });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Trekking',
        slug: 'trekking',
        description: 'Explore the best trekking destinations in Karnataka.',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
      }
    });
    console.log("Created Trekking Category");
  } else {
    console.log("Trekking Category already exists");
  }

  // Ensure a Destination exists (e.g. Karnataka)
  let destination = await prisma.destination.findFirst({ where: { name: 'Karnataka' } });
  if (!destination) {
    destination = await prisma.destination.create({
      data: {
        name: 'Karnataka',
        slug: 'karnataka',
        description: 'One state, many worlds.',
        country: 'India',
        image: 'https://images.unsplash.com/photo-1598091383021-14d7971842cc?auto=format&fit=crop&w=800&q=80'
      }
    });
    console.log("Created Karnataka Destination");
  }

  for (const trek of treksData) {
    const exists = await prisma.trip.findUnique({ where: { slug: trek.slug } });
    if (!exists) {
      await prisma.trip.create({
        data: {
          title: trek.title,
          slug: trek.slug,
          overview: `Experience the thrill of ${trek.title} in ${trek.location}. This trek offers amazing landscapes and a refreshing escape.`,
          fullDescription: `The ${trek.title} is one of the most popular trails in Karnataka. Reaching an altitude of ${trek.altitude}, this ${trek.difficulty.toLowerCase()} trek provides stunning views of the Western Ghats.`,
          highlights: JSON.stringify(["Scenic views of Western Ghats", "Dense Shola forests", "Beautiful sunsets", "Stream crossings"]),
          itinerary: JSON.stringify(defaultItinerary),
          inclusions: JSON.stringify(COMMON_INCLUSIONS),
          exclusions: JSON.stringify(COMMON_EXCLUSIONS),
          thingsToCarry: JSON.stringify(THINGS_TO_CARRY),
          price: trek.price,
          discountedPrice: trek.discountedPrice,
          availableDates: JSON.stringify(["Every Weekend", "Custom Dates on Request"]),
          images: JSON.stringify(trek.images),
          isFeatured: true, // Make all these new ones featured for testing
          categoryId: category.id,
          destinationId: destination.id,
          duration: trek.duration,
          startingCity: "Bangalore",
          pickupPoint: "Multiple pickup points in Bangalore",
          dropPoint: "Same as pickup",
          transportation: "Non-AC Pushback Vehicle",
          accommodation: "Dormitory / Tents",
          meals: "2 Breakfasts, 1 Lunch, 1 Dinner",
          bestTime: "September to February",
          difficulty: trek.difficulty,
          altitude: trek.altitude,
          seoTitle: `${trek.title} | Book Online`,
          seoDescription: `Book the ${trek.title} from Bangalore. Best price guaranteed. Includes transport, food, and guide.`,
          refundPolicy: REFUND_POLICY,
          cancellationPolicy: CANCELLATION_POLICY,
          paymentTerms: PAYMENT_TERMS
        }
      });
      console.log(`Created trek: ${trek.title}`);
    } else {
      console.log(`Trek already exists: ${trek.title}`);
      // Update just in case we need to sync prices
      await prisma.trip.update({
        where: { slug: trek.slug },
        data: {
          price: trek.price,
          discountedPrice: trek.discountedPrice,
          categoryId: category.id,
          refundPolicy: REFUND_POLICY,
          cancellationPolicy: CANCELLATION_POLICY,
          paymentTerms: PAYMENT_TERMS,
          thingsToCarry: JSON.stringify(THINGS_TO_CARRY),
          inclusions: JSON.stringify(COMMON_INCLUSIONS),
          exclusions: JSON.stringify(COMMON_EXCLUSIONS)
        }
      });
      console.log(`Updated trek prices and policies: ${trek.title}`);
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
