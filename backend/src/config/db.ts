import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// 7. Improve startup validation
const databaseUrl = process.env.DATABASE_URL;

// STEP 10: If DATABASE_URL is missing
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not configured.');
  process.exit(1); 
}

// STEP 5: Print safely without password
let dbHost = 'Unknown';
let dbPort = 'Unknown';
let dbName = 'Unknown';
let dbProvider = 'MySQL'; // Assuming MySQL for now based on context

try {
  const url = new URL(databaseUrl);
  dbHost = url.hostname;
  dbPort = url.port || '3306';
  dbName = url.pathname.replace('/', '');
  
  // STEP 6: If hostname is localhost
  if (dbHost === 'localhost' || dbHost === '127.0.0.1') {
    throw new Error('Production cannot use localhost database.');
  }
} catch (e: any) {
  if (e.message === 'Production cannot use localhost database.') {
    console.error(e.message);
    process.exit(1);
  }
  // Ignore purely URL parse errors but continue execution
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
    await prisma.$connect();
    console.log(`✅ Prisma connected successfully`);
    console.log(`🔌 Database Provider: ${dbProvider}`);
    console.log(`🌐 Database Host: ${dbHost}`);
    console.log(`🚪 Database Port: ${dbPort}`);
    console.log(`📂 Database Name: ${dbName}`);
  } catch (error: any) {
    console.error(`❌ Database connection failed.`);
    console.error(`Reason: ${error.message || error}`);
    console.error('Exiting gracefully.');
    process.exit(1);
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
