import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// Determine connection URL from variables or fallback to DATABASE_URL directly
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.DB_USER && process.env.DB_HOST && process.env.DB_NAME) {
  const port = process.env.DB_PORT || '3306';
  // Note: ensure process.env.DB_PASSWORD is URL encoded if it contains special characters
  const password = process.env.DB_PASSWORD ? encodeURIComponent(process.env.DB_PASSWORD) : '';
  databaseUrl = `mysql://${process.env.DB_USER}:${password}@${process.env.DB_HOST}:${port}/${process.env.DB_NAME}`;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
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
