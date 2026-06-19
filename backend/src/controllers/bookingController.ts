import { Request, Response } from 'express';
import prisma from '../config/db';

// Create a new booking
export const createBooking = async (req: any, res: Response) => {
  try {
    const { tripId, travelerDetails, totalAmount, paymentMethod, paymentScreenshot } = req.body;
    const userId = req.user.userId;

    const bookingData: any = {
      userId,
      tripId,
      travelerDetails,
      totalAmount,
      status: 'PENDING',
    };

    if (paymentScreenshot) {
      bookingData.payment = {
        create: {
          method: paymentMethod || "UPI",
          amount: totalAmount,
          screenshotUrl: paymentScreenshot,
          status: 'PENDING'
        }
      };
    }

    const booking = await prisma.booking.create({
      data: bookingData,
      include: { payment: true }
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error });
  }
};

// Get my bookings (Customer)
export const getMyBookings = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { trip: true, payment: true }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all bookings (Admin)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: true, trip: true, payment: true }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update booking status (Admin)
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error });
  }
};
