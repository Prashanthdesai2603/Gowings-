import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const commonInclusions = [
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

const commonExclusions = [
  "Personal Expenses",
  "Medical Expenses",
  "Travel Insurance",
  "Anything not mentioned under inclusions",
  "Additional Food",
  "Camera Charges"
];

const commonThingsToCarry = [
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

const refundPolicy = `Refund Policy\n\nIf cancellations are made 30 days before the start date of the trip, 50% of the trip cost will be charged as cancellation fees.\nIf cancellations are made 15-30 days before the start date of the trip, 75% of the trip cost will be charged as cancellation fees.\nIf cancellations are made within 0-15 days before the start date of the trip, 100% of the trip cost will be charged as cancellation fees.\nIn the case of unforeseen weather conditions or government restrictions, certain activities may be canceled and in such cases, the operator will try his best to provide an alternate feasible activity.\nHowever, no refund will be provided.`;

const cancellationPolicy = `90 Days or more:\nNo Charge\n\n89 Days to 60 Days:\n30%\n\n59 Days to 45 Days:\n50%\n\n44 Days to 30 Days:\n60%\n\n29 Days to 15 Days:\n80%\n\n14 Days to 1 Day:\nNo Refund\n\nWeather or Government restrictions are non-refundable.`;

const paymentTerms = `Booking Amount:\n30%\n\nRemaining Amount:\nMust be paid before trek departure.\n\nPayments accepted:\nUPI\nBank Transfer\nCash`;

const treks = [
  { name: "Kudremukh Trek", price: 2999 },
  { name: "Mullayanagiri Trek", price: 2499 },
  { name: "Kumara Parvatha (Pushpagiri) Trek", price: 3499 },
  { name: "Tadiandamol Peak Trek", price: 2599 },
  { name: "Netravati Peak Trek", price: 2899 },
  { name: "Kodachadri Trek", price: 2799 },
  { name: "Bandaje Falls Trek", price: 3199 },
  { name: "Brahmagiri Trek", price: 2699 },
  { name: "Nishani Motte Trek", price: 2799 },
  { name: "Agumbe Ghat Trek", price: 2299 },
  { name: "Narasimha Parvatha Trek", price: 2999 }
];

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  // Ensure "Trekking" category exists
  let trekkingCategory = await prisma.category.findUnique({
    where: { slug: 'trekking' }
  });

  if (!trekkingCategory) {
    trekkingCategory = await prisma.category.create({
      data: {
        name: 'Trekking',
        slug: 'trekking',
        description: 'Explore the best trekking destinations.',
      }
    });
    console.log('Created Trekking category.');
  } else {
    console.log('Trekking category already exists.');
  }

  // Find a default destination, e.g., Karnataka, India
  let destination = await prisma.destination.findUnique({
    where: { slug: 'karnataka' }
  });

  if (!destination) {
    destination = await prisma.destination.create({
      data: {
        name: 'Karnataka',
        slug: 'karnataka',
        country: 'India',
        description: 'Trekking destinations in Karnataka.'
      }
    });
    console.log('Created Karnataka destination.');
  }

  for (const t of treks) {
    const slug = generateSlug(t.name);
    const existing = await prisma.trip.findUnique({
      where: { slug }
    });

    if (!existing) {
      await prisma.trip.create({
        data: {
          title: t.name,
          slug: slug,
          overview: `Experience the thrill of ${t.name}, one of the best trekking trails.`,
          highlights: JSON.stringify(["Beautiful Scenery", "Guided Trek", "Camping"]),
          itinerary: JSON.stringify([
            { day: 1, title: "Departure", description: "Start journey from pickup point." },
            { day: 2, title: "Trek Day", description: "Trek to the peak and return to base camp." },
            { day: 3, title: "Return", description: "Return back to the drop point." }
          ]),
          inclusions: JSON.stringify(commonInclusions),
          exclusions: JSON.stringify(commonExclusions),
          price: t.price,
          availableDates: JSON.stringify([]),
          images: JSON.stringify(["https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80"]),
          isFeatured: false,
          categoryId: trekkingCategory.id,
          destinationId: destination.id,
          duration: "2 Days / 1 Night",
          startingCity: "Bangalore",
          pickupPoint: "Majestic / Silk Board",
          dropPoint: "Same as pickup",
          transportation: "Non-AC / AC Pushback Vehicle",
          accommodation: "Dormitory / Tents",
          meals: "2 Breakfast, 1 Lunch, 1 Dinner",
          bestTime: "September to February",
          difficulty: "Moderate",
          thingsToCarry: JSON.stringify(commonThingsToCarry),
          faq: JSON.stringify([{ question: "Is this suitable for beginners?", answer: "Yes, it requires basic fitness." }]),
          cancellationPolicy,
          refundPolicy,
          paymentTerms,
          altitude: "TBD", // Added generic altitude
        }
      });
      console.log(`Created trek: ${t.name}`);
    } else {
      console.log(`Trek already exists: ${t.name}`);
    }
  }

  console.log('Seeding completed.');
}

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
