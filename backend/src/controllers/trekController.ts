import { Request, Response } from 'express';
import prisma from '../config/db';

const getTrekkingCategory = async () => {
  let cat = await prisma.category.findUnique({ where: { slug: 'trekking' } });
  if (!cat) {
    cat = await prisma.category.create({
      data: { name: 'Trekking', slug: 'trekking', description: 'Trekking Packages' }
    });
  }
  return cat;
};

// Get all treks
export const getTreks = async (req: Request, res: Response) => {
  try {
    const category = await getTrekkingCategory();
    
    const destination = typeof req.query.destination === 'string' ? req.query.destination : undefined;
    const featured = typeof req.query.featured === 'string' ? req.query.featured : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 20;
    
    const filter: Record<string, any> = { categoryId: category.id };
    if (destination) filter.destination = { name: destination };
    if (featured === 'true') filter.isFeatured = true;
    if (search) {
      filter.OR = [
        { title: { contains: search } },
        { overview: { contains: search } }
      ];
    }

    const skip = (page - 1) * limit;

    const treks = await prisma.trip.findMany({
      where: filter,
      include: {
        category: true,
        destination: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.trip.count({ where: filter });

    res.json({
      data: treks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single trek by slug
export const getTrekBySlug = async (req: Request, res: Response) => {
  try {
    const category = await getTrekkingCategory();
    const slug = req.params.slug as string;
    
    const trek = await prisma.trip.findFirst({
      where: { slug, categoryId: category.id },
      include: {
        category: true,
        destination: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } }
        }
      }
    });

    if (!trek) return res.status(404).json({ message: 'Trek not found' });
    res.json(trek);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new trek (Admin only)
export const createTrek = async (req: Request, res: Response) => {
  try {
    const category = await getTrekkingCategory();
    const data = { ...req.body, categoryId: category.id };
    const trek = await prisma.trip.create({ data });
    res.status(201).json(trek);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create trek', error });
  }
};

// Update an existing trek (Admin only)
export const updateTrek = async (req: Request, res: Response) => {
  try {
    const category = await getTrekkingCategory();
    const id = req.params.id as string;
    
    // Ensure it's a trek
    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing || existing.categoryId !== category.id) {
      return res.status(404).json({ message: 'Trek not found' });
    }

    const data = req.body;
    const trek = await prisma.trip.update({
      where: { id },
      data
    });
    res.json(trek);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update trek', error });
  }
};

// Delete a trek (Admin only)
export const deleteTrek = async (req: Request, res: Response) => {
  try {
    const category = await getTrekkingCategory();
    const id = req.params.id as string;
    
    // Ensure it's a trek
    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing || existing.categoryId !== category.id) {
      return res.status(404).json({ message: 'Trek not found' });
    }

    await prisma.trip.delete({
      where: { id }
    });
    res.json({ message: 'Trek deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete trek', error });
  }
};
