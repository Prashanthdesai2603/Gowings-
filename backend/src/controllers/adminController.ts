import { Request, Response } from 'express';
import prisma from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Total Bookings
    const totalBookings = await prisma.booking.count();

    // Total Revenue (only from confirmed/completed? Let's just sum all for now, or just COMPLETED/CONFIRMED)
    // To be safe, we'll sum all totalAmount for bookings.
    const revenueAgg = await prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }
    });
    const totalRevenue = revenueAgg._sum.totalAmount || 0;

    // Total Customers
    const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    });

    // Pending Payments Count
    const pendingPaymentsCount = await prisma.payment.count({
      where: { status: 'PENDING' }
    });

    // Recent Bookings (last 5)
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        trip: { select: { title: true } }
      }
    });

    // Recent Pending Payments (last 5)
    const recentPayments = await prisma.payment.findMany({
      where: { status: 'PENDING' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: { select: { id: true } }
      }
    });

    res.json({
      totalBookings,
      totalRevenue,
      totalCustomers,
      pendingPaymentsCount,
      recentBookings,
      recentPayments
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
            trip: { select: { title: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    
    if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: { status }
    });

    res.json(payment);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.companyDetails.findFirst();
    if (!settings) {
      settings = await prisma.companyDetails.create({
        data: {
          name: "Gowings",
          tagline: "Your Trusted Travel Partner for Memorable Journeys",
          about: "Welcome to Gowings. We provide the best travel experiences.",
          address: "123 Main Street",
          city: "Metropolis",
          state: "NY",
          country: "USA",
          postalCode: "10001",
          phone1: "+1 234 567 8900",
          email: "info@gowings.com"
        }
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let settings = await prisma.companyDetails.findFirst();
    
    if (settings) {
      settings = await prisma.companyDetails.update({
        where: { id: settings.id },
        data
      });
    } else {
      settings = await prisma.companyDetails.create({
        data
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
