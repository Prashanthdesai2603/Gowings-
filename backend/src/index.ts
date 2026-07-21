import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

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
import galleryRoutes from './routes/galleryRoutes';

const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [];
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

app.use(helmet({ crossOriginResourcePolicy: false })); // allow cross-origin images
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // limit each IP to 5000 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/packages', tripRoutes); // Alias for trips to match frontend/UI expectations
app.use('/api/gallery', galleryRoutes);
app.use('/api/treks', trekRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/custom-trips', customTripRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// API health route for backward compatibility
app.get('/api/health', async (req, res) => {
  res.redirect('/health');
});

// Root API route
app.get(['/api', '/api/'], (req, res) => {
  res.json({
    status: 'running',
    routes: [
      '/api/packages',
      '/api/destinations',
      '/api/categories',
      '/api/gallery',
      '/api/contact'
    ]
  });
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

// Start the server only after connecting to the DB
const startServer = async () => {
  // 9. Improve startup validation. Print before connecting.
  console.log(`\n--- Server Startup ---`);
  console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'Production'}`);
  console.log(`🚀 PORT: ${PORT}`);

  // 6. Startup order: connect database first
  await connectDatabase();
  
  const server = app.listen(PORT, () => {
    // 8. Improve server startup logging
    console.log(`✅ Application started successfully`);
    console.log(`🟢 Node Version: ${process.version}`);
    console.log(`----------------------\n`);
  });

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
};

startServer();
