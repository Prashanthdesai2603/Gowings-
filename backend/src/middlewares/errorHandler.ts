import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${err.name}: ${err.message}`);
  
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors gracefully
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'A unique constraint failed.', error: 'Conflict' });
    }
    if (err.code === 'P2021') {
      return res.status(200).json({ success: false, message: 'Data not found or table is missing.' });
    }
    return res.status(400).json({ success: false, message: 'A database error occurred.' });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ success: false, message: 'Invalid database request.' });
  }

  if (err.name === 'ValidationError') {
    // Mongoose/Zod/Custom validation errors
    return res.status(400).json({ error: 'Validation Error', details: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    // JWT/Auth errors
    return res.status(401).json({ error: 'Unauthorized', details: err.message });
  }

  // Unknown errors
  res.status(500).json({ error: 'Internal Server Error', details: process.env.NODE_ENV === 'production' ? undefined : err.message });
};
