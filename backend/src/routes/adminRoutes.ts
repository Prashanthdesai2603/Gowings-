import { Router } from 'express';
import { getDashboardStats, getCustomers, getPayments, updatePaymentStatus, getSettings, updateSettings } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// Apply auth middlewares to all admin routes
router.use(authenticate as any);
router.use(authorizeAdmin as any);

router.get('/dashboard', getDashboardStats as any);
router.get('/customers', getCustomers as any);
router.get('/payments', getPayments as any);
router.patch('/payments/:id/status', updatePaymentStatus as any);
router.get('/settings', getSettings as any);
router.put('/settings', updateSettings as any);

export default router;
