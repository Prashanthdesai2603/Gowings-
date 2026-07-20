import { Router } from 'express';
import { submitContact, getContacts, respondToContactRequest, getMyContactRequests } from '../controllers/contactController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Public route to submit a contact form
router.post('/', submitContact);

// Admin route to get all contact requests
router.get('/', authenticate, authorizeAdmin, getContacts);

// User route to get their own contact requests
router.get('/my-requests', authenticate, getMyContactRequests);

// Admin route to respond to a contact request
router.post('/:id/respond', authenticate, authorizeAdmin, respondToContactRequest);

export default router;
