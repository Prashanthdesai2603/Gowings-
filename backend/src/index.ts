import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

dotenv.config();

import { connectDatabase, disconnectDatabase } from './config/db';
import prisma from './config/db';
import { validateEnvVariables } from './utils/envValidator';
import { errorHandler } from './middlewares/errorHandler';

// Validate environment variables on startup
validateEnvVariables();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/authRoutes';
import tripRoutes from './routes/tripRoutes';
import bookingRoutes from './routes/bookingRoutes';
import destinationRoutes from './routes/destinationRoutes';
import adminRoutes from './routes/adminRoutes';
import categoryRoutes from './routes/categoryRoutes';
import contactRoutes from './routes/contactRoutes';
import customTripRoutes from './routes/customTripRoutes';
import trekRoutes from './routes/trekRoutes';

app.use(helmet({ crossOriginResourcePolicy: false })); // allow cross-origin images
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

const allowedOrigins = [
  'http://localhost:3000',
  'https://gowings-five.vercel.app'
];
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/treks', trekRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/custom-trips', customTripRoutes);

// Basic health check route
app.get('/health', async (req, res) => {
  try {
    // Perform a lightweight query to verify the database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      server: 'Running',
      database: 'Connected',
      environment: process.env.NODE_ENV || 'Production'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'OK', // Server is running
      server: 'Running',
      database: 'Disconnected',
      environment: process.env.NODE_ENV || 'Production'
    });
  }
});

// API health route for backward compatibility
app.get('/api/health', async (req, res) => {
  res.redirect('/health');
});

// Root API route
app.get(['/api', '/api/'], (req, res) => {
  res.json({ message: 'Welcome to Gowings API. Available routes: /api/auth, /api/trips, /api/bookings' });
});

app.get('/', (req, res) => {
  res.json({ status: 'OK' });
});

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Centralized error handler (must be registered last)
app.use(errorHandler);

// Start the server immediately so Render detects the port
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize database connection in the background
connectDatabase();

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Received shutdown signal, closing server and database...');
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
