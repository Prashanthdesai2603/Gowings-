import { Router } from 'express';
import { getDestinations, createDestination, updateDestination, deleteDestination } from '../controllers/destinationController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getDestinations);
router.post('/', authenticate, authorizeAdmin, createDestination);
router.put('/:id', authenticate, authorizeAdmin, updateDestination);
router.delete('/:id', authenticate, authorizeAdmin, deleteDestination);

export default router;
