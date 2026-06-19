import { Router } from 'express';
import { getDestinations, createDestination, updateDestination, deleteDestination } from '../controllers/destinationController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getDestinations as any);
router.post('/', authenticate as any, authorizeAdmin as any, createDestination as any);
router.put('/:id', authenticate as any, authorizeAdmin as any, updateDestination as any);
router.delete('/:id', authenticate as any, authorizeAdmin as any, deleteDestination as any);

export default router;
