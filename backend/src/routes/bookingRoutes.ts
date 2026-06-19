import { Router } from 'express';
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus } from '../controllers/bookingController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Customer routes
router.post('/', authenticate as any, createBooking as any);
router.get('/my-bookings', authenticate as any, getMyBookings as any);

// Admin routes
router.get('/', authenticate as any, authorizeAdmin as any, getAllBookings as any);
router.patch('/:id/status', authenticate as any, authorizeAdmin as any, updateBookingStatus as any);

export default router;
