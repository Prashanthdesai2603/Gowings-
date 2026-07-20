import { Router } from 'express';
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus } from '../controllers/bookingController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Customer routes
router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getMyBookings);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllBookings);
router.patch('/:id/status', authenticate, authorizeAdmin, updateBookingStatus);

export default router;
