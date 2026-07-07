import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import { connectDatabase, disconnectDatabase } from './config/db';
import prisma from './config/db';

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

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
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
      server: 'running',
      database: 'connected'
    });
  } catch (error: any) {
    res.status(500).json({
      server: 'running',
      database: 'disconnected'
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
