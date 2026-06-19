import { Request, Response } from 'express';
import prisma from '../config/db';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Using message field to store "Subject: [subject]\nMessage: [message]" 
    // since schema only has name, email, phone, message
    const contact = await prisma.contactRequest.create({
      data: {
        name,
        email,
        phone,
        message
      }
    });

    res.status(201).json({ success: true, contact });
  } catch (error) {
    console.error("Failed to submit contact request:", error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
