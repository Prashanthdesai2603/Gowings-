import { Request, Response } from 'express';
import prisma from '../config/db';

export const getDestinations = async (req: Request, res: Response) => {
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        _count: {
          select: { trips: true }
        }
      }
    });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const dest = await prisma.destination.create({ data });
    res.status(201).json(dest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create destination', error });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const dest = await prisma.destination.update({
      where: { id },
      data
    });
    res.json(dest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update destination', error });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.destination.delete({
      where: { id }
    });
    res.json({ message: 'Destination deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'Cannot delete destination because it has attached trips. Delete the trips first.' });
    }
    res.status(500).json({ message: 'Failed to delete destination', error });
  }
};
