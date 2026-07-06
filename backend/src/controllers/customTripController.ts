import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../utils/sendEmail';

const prisma = new PrismaClient();

export const submitCustomTripRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, destination, travelers, dates, budget, requirements } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !destination) {
      return res.status(400).json({ error: 'Name, email, phone, and destination are required' });
    }

    const newRequest = await prisma.customizedTripRequest.create({
      data: {
        name,
        email,
        phone,
        destination,
        travelers: travelers ? parseInt(travelers, 10) : 1,
        dates: dates || '',
        budget: budget ? budget.toString() : '',
        requirements: requirements || ''
      }
    });

    res.status(201).json({ message: 'Custom trip request submitted successfully', request: newRequest });
  } catch (error) {
    console.error('Submit custom trip request error:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
};

export const getCustomTripRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.customizedTripRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ requests });
  } catch (error) {
    console.error('Get custom trip requests error:', error);
    res.status(500).json({ error: 'Failed to get requests' });
  }
};

export const respondToCustomTrip = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { message } = req.body;

    // Validate
    if (!message) {
      return res.status(400).json({ error: 'Response message is required' });
    }

    // In a real application, you would integrate Nodemailer or SendGrid here
    // to actually email the user using the request.email address.
    console.log(`[SIMULATED EMAIL] Sending response for custom trip request ${id}:`, message);

    const updatedRequest = await prisma.customizedTripRequest.update({
      where: { id },
      data: {
        status: 'PROPOSED',
        responseMessage: message
      }
    });

    // Send the email
    const emailSubject = `Update on your custom trip request to ${updatedRequest.destination}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2>Hello ${updatedRequest.name},</h2>
        <p>We have an update regarding your custom trip request to <strong>${updatedRequest.destination}</strong>.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <p>You can also view this response and all your trip details by logging into your dashboard on our website.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Gowings Travel Team</strong></p>
      </div>
    `;
    
    // Attempt to send email, but don't fail the request if email fails (e.g. invalid credentials)
    try {
      await sendEmail(updatedRequest.email, emailSubject, emailHtml);
      console.log(`Email sent successfully to ${updatedRequest.email}`);
    } catch (emailErr) {
      console.error('Failed to send email (credentials might not be set):', emailErr);
    }

    res.status(200).json({ message: 'Response sent successfully', request: updatedRequest });
  } catch (error) {
    console.error('Respond to custom trip error:', error);
    res.status(500).json({ error: 'Failed to send response' });
  }
};

export const getMyCustomTripRequests = async (req: Request, res: Response) => {
  try {
    // req.user is set by the authenticate middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID not found' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) {
      return res.status(404).json({ error: 'User not found' });
    }

    const requests = await prisma.customizedTripRequest.findMany({
      where: { email: user.email },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ requests });
  } catch (error) {
    console.error('Get my custom trip requests error:', error);
    res.status(500).json({ error: 'Failed to get your requests' });
  }
};
