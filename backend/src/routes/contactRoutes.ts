import { Router } from 'express';
import { submitContact, getContacts } from '../controllers/contactController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Public route to submit a contact form
router.post('/', submitContact as any);

// Admin route to get all contact requests
router.get('/', authenticate as any, authorizeAdmin as any, getContacts as any);

export default router;
