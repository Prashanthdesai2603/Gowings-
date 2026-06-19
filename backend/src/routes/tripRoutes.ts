import { Router } from 'express';
import { getTrips, getTripBySlug, createTrip, updateTrip, deleteTrip } from '../controllers/tripController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getTrips as any);
router.get('/:slug', getTripBySlug as any);
router.post('/', authenticate as any, authorizeAdmin as any, createTrip as any);
router.put('/:id', authenticate as any, authorizeAdmin as any, updateTrip as any);
router.delete('/:id', authenticate as any, authorizeAdmin as any, deleteTrip as any);

export default router;
