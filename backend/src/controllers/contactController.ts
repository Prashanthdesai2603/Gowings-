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

export const respondToContactRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Response message is required' });
    }

    const updatedRequest = await prisma.contactRequest.update({
      where: { id },
      data: {
        status: 'RESPONDED',
        responseMessage: message
      }
    });

    // Send the email
    const emailSubject = `Response to your inquiry at Gowings Travel`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2>Hello ${updatedRequest.name},</h2>
        <p>Thank you for reaching out to us. We have an update regarding your inquiry:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <p>You can also view this response by logging into your dashboard on our website.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Gowings Travel Team</strong></p>
      </div>
    `;
    
    try {
      const { sendEmail } = await import('../utils/sendEmail.js');
      await sendEmail(updatedRequest.email, emailSubject, emailHtml);
      console.log(`Email sent successfully to ${updatedRequest.email}`);
    } catch (emailErr) {
      console.error('Failed to send email (credentials might not be set):', emailErr);
    }

    res.status(200).json({ success: true, message: 'Response sent successfully', request: updatedRequest });
  } catch (error) {
    console.error('Respond to inquiry error:', error);
    res.status(500).json({ success: false, error: 'Failed to send response' });
  }
};

export const getMyContactRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized: User ID not found' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const requests = await prisma.contactRequest.findMany({
      where: { email: user.email },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Get my inquiries error:', error);
    res.status(500).json({ success: false, error: 'Failed to get your inquiries' });
  }
};
