const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log("Starting script to add Tirupati package...");

  // 1. Copy images
  const sourceImages = [
    "C:\\Users\\prash\\.gemini\\antigravity-ide\\brain\\9f2b66a3-4568-4bbd-8eb9-026af63e48da\\tirupati_temple_1783929312122.png",
    "C:\\Users\\prash\\.gemini\\antigravity-ide\\brain\\9f2b66a3-4568-4bbd-8eb9-026af63e48da\\luxury_bus_1783929321913.png",
    "C:\\Users\\prash\\.gemini\\antigravity-ide\\brain\\9f2b66a3-4568-4bbd-8eb9-026af63e48da\\hotel_room_1783929332536.png",
    "C:\\Users\\prash\\.gemini\\antigravity-ide\\brain\\9f2b66a3-4568-4bbd-8eb9-026af63e48da\\laddu_prasadam_1783929343541.png"
  ];
  
  const targetDir = path.resolve(__dirname, '../../frontend/public/images/tirupati');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const imageUrls = [];
  for (const src of sourceImages) {
    if (fs.existsSync(src)) {
      const fileName = path.basename(src);
      const dest = path.join(targetDir, fileName);
      fs.copyFileSync(src, dest);
      imageUrls.push(`/images/tirupati/${fileName}`);
    } else {
      console.warn(`Source image not found: ${src}`);
    }
  }

  // 2. Database records
  const catName = "Pilgrimage Tour";
  const catSlug = catName.toLowerCase().replace(/ /g, '-');
  const category = await prisma.category.upsert({
    where: { slug: catSlug },
    update: {},
    create: { name: catName, slug: catSlug, description: `Best ${catName} curated for you.` },
  });

  const destName = "Tirupati, Tirumala, Srikalahasti";
  const destSlug = destName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const destination = await prisma.destination.upsert({
    where: { slug: destSlug },
    update: {},
    create: { name: destName, slug: destSlug, country: "India" },
  });

  const tripData = {
    title: "Tirupati Balaji Darshan Package from Davanagere",
    slug: "tirupati-balaji-package-from-davanagere",
    categoryId: category.id,
    destinationId: destination.id,
    overview: "Experience a peaceful spiritual journey to the holy temples of Tirupati and Tirumala. This package is specially designed for devotees travelling from Davanagere with comfortable transportation, accommodation, meals, sightseeing, and assistance for Tirumala Darshan. Visit famous temples including Sri Padmavathi Temple, Srikalahasti Temple, Kapila Theertham, and Lord Venkateswara Temple while enjoying a hassle-free pilgrimage.",
    fullDescription: "Experience a peaceful spiritual journey to the holy temples of Tirupati and Tirumala. This package is specially designed for devotees travelling from Davanagere with comfortable transportation, accommodation, meals, sightseeing, and assistance for Tirumala Darshan. Visit famous temples including Sri Padmavathi Temple, Srikalahasti Temple, Kapila Theertham, and Lord Venkateswara Temple while enjoying a hassle-free pilgrimage.",
    highlights: [
      "Comfortable Bus Journey from Davanagere",
      "Hotel Stay in Tirupati",
      "Dinner, Breakfast, Lunch and Snacks Included",
      "Assistance for Tirumala Darshan Tickets",
      "Visit Sri Padmavathi Ammavari Temple",
      "Visit Srikalahasti Temple",
      "Visit Kapila Theertham",
      "Visit Tirumala Hills",
      "Darshan of Sri Bhu Varaha Swamy Temple",
      "Darshan of Lord Sri Venkateswara Swamy",
      "Free Time for Shopping",
      "Professional Tour Coordinator"
    ],
    itinerary: [
      {
        day: 1,
        title: "DAY 1 – 05 August 2026",
        desc: "09:00 AM Departure from Davanagere.\nPickup from KSRTC Bus Stand.\nJourney towards Tirupati.\nDuring the journey:\n• Morning Refreshments\n• Lunch Break\n• Evening Tea & Snacks\n08:00 PM\nReach Tirupati.\nHotel Check-in.\nRoom Allocation.\nDinner.\nOvernight Stay."
      },
      {
        day: 2,
        title: "DAY 2 – 06 August 2026",
        desc: "03:00 AM\nWake up.\nProceed to Tirumala Ticket Counter.\nCollect Darshan Ticket.\n(Depending upon ticket availability and TTD allotment.)\nReturn to Hotel.\nFreshen up.\nBreakfast.\nVisit:\n• Padmavathi Temple\n• Srikalahasti Temple\n• Kapila Theertham\n• Other nearby attractions (time permitting)\nLunch.\nRest.\nBased on TTD allotted slot:\nTravel to Tirumala by Local Bus.\nFirst Visit Sri Bhu Varaha Swamy Temple.\nThen Proceed for Lord Sri Venkateswara Swamy Darshan.\nAfter Darshan:\nLaddu Collection.\nShopping.\nDinner.\nReturn to Hotel.\nOvernight Stay."
      },
      {
        day: 3,
        title: "DAY 3",
        desc: "Morning\nBreakfast.\nHotel Check-out.\nBegin Return Journey.\nLunch on the way.\nEvening Tea & Snacks.\nReach Davanagere safely.\nTour Ends with Divine Blessings."
      }
    ],
    inclusions: [
      "Transportation from Davanagere",
      "Hotel Accommodation",
      "Breakfast",
      "Lunch",
      "Dinner",
      "Evening Snacks",
      "Tour Coordinator",
      "Local Sightseeing",
      "Tirumala Local Bus Assistance",
      "Driver Allowance",
      "Parking Charges",
      "Toll Charges"
    ],
    exclusions: [
      "Tirumala Darshan Ticket Charges",
      "Special Entry Darshan Charges",
      "VIP Darshan",
      "Personal Expenses",
      "Shopping",
      "Additional Food",
      "Camera Charges",
      "Any Extra Expenses"
    ],
    thingsToCarry: [
      "Original Aadhaar Card",
      "Comfortable Clothing",
      "Extra Dress",
      "Personal Medicines",
      "Water Bottle",
      "Power Bank",
      "Umbrella",
      "Mobile Charger",
      "Slippers",
      "Walking Shoes",
      "Cash",
      "Temple Dress (Traditional preferred)"
    ],
    price: 3999,
    availableDates: ["2026-08-05", "05 August 2026"],
    images: imageUrls,
    isFeatured: true,
    duration: "3 Days / 2 Nights",
    startingCity: "Davanagere",
    pickupPoint: "Davanagere KSRTC Bus Stand",
    dropPoint: "Same Pickup Location (Davanagere)",
    transportation: "Non-AC / AC Pushback Sleeper or Seater Bus (Configurable)",
    accommodation: "Hotel Stay in Tirupati",
    meals: "Dinner, Breakfast, Lunch and Snacks",
    bestTime: "Throughout the Year",
    difficulty: "Easy",
    seoTitle: "Tirupati Balaji Darshan Package from Davanagere | Gowings",
    seoDescription: "Book Tirupati Balaji Darshan Tour Package from Davanagere with accommodation, transportation, sightseeing, meals and Tirumala assistance at the best price.",
    faq: [
      { question: "Is Darshan Ticket Included?", answer: "No. It depends on TTD availability." },
      { question: "Is Hotel Included?", answer: "Yes." },
      { question: "Is Food Included?", answer: "Breakfast, Lunch, Dinner and Snacks." },
      { question: "Can Senior Citizens Join?", answer: "Yes." },
      { question: "Will Shopping Time be Given?", answer: "Yes." }
    ],
    cancellationPolicy: "90 Days or More: No Cancellation Charges\n89–60 Days: 30%\n59–45 Days: 50%\n44–30 Days: 60%\n29–15 Days: 80%\n14–1 Day: 100%",
    refundPolicy: "If cancellations are made 30 days before departure: 50% cancellation charges. 15–30 days: 75% cancellation charges. 0–15 days: No Refund. No refund will be provided for weather conditions, natural calamities or Government restrictions.",
    paymentTerms: "Booking Advance: 30%\nBalance Amount: Before Departure\nFull Payment Mandatory before Journey."
  };

  const trip = await prisma.trip.upsert({
    where: { slug: tripData.slug },
    update: tripData,
    create: tripData
  });

  console.log(`Trip successfully added/updated with ID: ${trip.id}`);
}

main().then(() => {
  prisma.$disconnect();
}).catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
