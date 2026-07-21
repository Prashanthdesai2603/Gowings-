import { Request, Response } from 'express';
import prisma from '../config/db';

export const getGallery = async (req: Request, res: Response) => {
  try {
    const galleryItems = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: galleryItems });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
};
