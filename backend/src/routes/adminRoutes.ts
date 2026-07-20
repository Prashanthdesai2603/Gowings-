import { Router } from 'express';
import { getDashboardStats, getCustomers, getPayments, updatePaymentStatus, getSettings, updateSettings } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Apply auth middlewares to all admin routes
router.use(authenticate);
router.use(authorizeAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/customers', getCustomers);
router.get('/payments', getPayments);
router.patch('/payments/:id/status', updatePaymentStatus);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
