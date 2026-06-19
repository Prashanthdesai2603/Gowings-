const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Database Wipe...");
  
  const deletedTrips = await prisma.trip.deleteMany();
  console.log(`Deleted ${deletedTrips.count} trips.`);

  const deletedDestinations = await prisma.destination.deleteMany();
  console.log(`Deleted ${deletedDestinations.count} destinations.`);

  console.log("Clean slate ready!");
}

main().catch(console.error).then(() => prisma.$disconnect());
