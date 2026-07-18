import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// 7. Improve startup validation
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is missing. Please configure it in your environment variables.');
  process.exit(1); // Exit gracefully, never default to localhost
}

// Optional: Extract db host for logging without exposing passwords
let dbHost = 'Unknown';
try {
  const url = new URL(databaseUrl);
  dbHost = url.hostname;
} catch (e) {
  // Ignore URL parse error
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  // error and warn logs, but avoid exposing sensitive connection string info in stack traces
});

export const connectDatabase = async () => {
  try {
    // 6. Startup order: Generate Prisma Client -> Connect using DATABASE_URL -> Run migration or db push -> Start Express server
    // We will do validation here first
    await prisma.$connect();
    // 8. Improve server startup logging
    console.log(`✅ Prisma connected successfully`);
    console.log(`🔌 Database Provider: MySQL`);
    console.log(`🌐 Database Host: ${dbHost}`);
  } catch (error: any) {
    // 12. Improve production error handling
    console.error(`❌ Database connection failed.`);
    console.error(`Reason: ${error.message || error}`);
    console.error('Exiting gracefully.');
    process.exit(1); // Do not crash with unhandled stack traces
  }
};

export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('🛑 Database disconnected gracefully');
  } catch (error) {
    console.error('Error during database disconnection', error);
  }
};

export default prisma;
