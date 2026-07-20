import { Router } from 'express';
import { getTrips, getTripBySlug, createTrip, updateTrip, deleteTrip } from '../controllers/tripController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getTrips);
router.get('/:slug', getTripBySlug);
router.post('/', authenticate, authorizeAdmin, createTrip);
router.put('/:id', authenticate, authorizeAdmin, updateTrip);
router.delete('/:id', authenticate, authorizeAdmin, deleteTrip);

export default router;
