import { Router } from 'express';
import { submitCustomTripRequest, getCustomTripRequests, respondToCustomTrip, getMyCustomTripRequests } from '../controllers/customTripController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Public route to submit a custom trip request
router.post('/', submitCustomTripRequest as any);

// Admin route to get all custom trip requests
router.get('/', authenticate as any, authorizeAdmin as any, getCustomTripRequests as any);

// User route to get their own custom trip requests
router.get('/my-requests', authenticate as any, getMyCustomTripRequests as any);

// Admin route to respond to a custom trip request
router.post('/:id/respond', authenticate as any, authorizeAdmin as any, respondToCustomTrip as any);

export default router;
