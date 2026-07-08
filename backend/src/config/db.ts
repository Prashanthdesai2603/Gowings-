import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// Use DATABASE_URL directly as requested by Render best practices
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('⚠️ DATABASE_URL is not set. Prisma will attempt to use the URL from schema.prisma or it may fail.');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: ['error', 'warn'],
});

export const connectDatabase = async (retries = 5) => {
  while (retries > 0) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      return;
    } catch (error) {
      console.error(`❌ Database connection failed. Retries left: ${retries - 1}`);
      retries -= 1;
      if (retries === 0) {
        console.error('❌ Failed to connect to the database after multiple attempts. Server will remain running, but database features will fail.');
        return;
      }
      // Wait 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
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
