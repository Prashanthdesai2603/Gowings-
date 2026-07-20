import { Router } from 'express';
import { getTreks, getTrekBySlug, createTrek, updateTrek, deleteTrek } from '../controllers/trekController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getTreks);
router.get('/:slug', getTrekBySlug);
router.post('/', authenticate, authorizeAdmin, createTrek);
router.put('/:id', authenticate, authorizeAdmin, updateTrek);
router.delete('/:id', authenticate, authorizeAdmin, deleteTrek);

export default router;
