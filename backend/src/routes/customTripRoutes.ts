import { Router } from 'express';
import { submitCustomTripRequest, getCustomTripRequests, respondToCustomTrip, getMyCustomTripRequests } from '../controllers/customTripController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Public route to submit a custom trip request
router.post('/', submitCustomTripRequest);

// Admin route to get all custom trip requests
router.get('/', authenticate, authorizeAdmin, getCustomTripRequests);

// User route to get their own custom trip requests
router.get('/my-requests', authenticate, getMyCustomTripRequests);

// Admin route to respond to a custom trip request
router.post('/:id/respond', authenticate, authorizeAdmin, respondToCustomTrip);

export default router;
