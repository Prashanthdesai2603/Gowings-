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

// Trust the first proxy (e.g., Render, Nginx, Heroku). 
// This is required to accurately detect client IPs and prevent express-rate-limit warnings.
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: false })); // allow cross-origin images
app.use(compression());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gowings-cfykm8h5w-gowings.vercel.app'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin: any, callback: any) {
    const isAllowed = !origin || allowedOrigins.includes(origin);
    
    console.log(`[CORS] Origin: ${origin || 'undefined'}`);
    console.log(`[CORS] Allowed Origins: ${allowedOrigins.join(', ')}`);
    
    if (isAllowed) {
      console.log(`[CORS] Accepted`);
      callback(null, true);
    } else {
      console.log(`[CORS] Rejected. Reason: Origin not in allowed list.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'Credentials'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('/{*any}', cors(corsOptions)); // Handle preflight OPTIONS requests

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
