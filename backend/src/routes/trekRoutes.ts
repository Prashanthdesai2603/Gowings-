import { Router } from 'express';
import { getTreks, getTrekBySlug, createTrek, updateTrek, deleteTrek } from '../controllers/trekController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getTreks as any);
router.get('/:slug', getTrekBySlug as any);
router.post('/', authenticate as any, authorizeAdmin as any, createTrek as any);
router.put('/:id', authenticate as any, authorizeAdmin as any, updateTrek as any);
router.delete('/:id', authenticate as any, authorizeAdmin as any, deleteTrek as any);

export default router;
