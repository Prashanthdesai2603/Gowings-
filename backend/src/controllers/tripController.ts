import { Request, Response } from 'express';
import prisma from '../config/db';

// Get all trips
export const getTrips = async (req: Request, res: Response) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const destination = typeof req.query.destination === 'string' ? req.query.destination : undefined;
    const featured = typeof req.query.featured === 'string' ? req.query.featured : undefined;
    
    const filter: any = {};
    if (category) filter.category = { name: category };
    if (destination) filter.destination = { name: destination };
    if (featured === 'true') filter.isFeatured = true;

    const trips = await prisma.trip.findMany({
      where: filter,
      include: {
        category: true,
        destination: true,
      }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single trip by slug
export const getTripBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const trip = await prisma.trip.findUnique({
      where: { slug },
      include: {
        category: true,
        destination: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } }
        }
      }
    });

    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new trip (Admin only)
export const createTrip = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const trip = await prisma.trip.create({ data });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create trip', error });
  }
};

// Update an existing trip (Admin only)
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const trip = await prisma.trip.update({
      where: { id },
      data
    });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update trip', error });
  }
};

// Delete a trip (Admin only)
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.trip.delete({
      where: { id }
    });
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete trip', error });
  }
};
