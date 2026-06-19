import { Router } from 'express';
import { register, login, getMe, updateProfile, updatePassword } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.get('/me', authenticate as any, getMe as any);
router.put('/profile', authenticate as any, updateProfile as any);
router.put('/password', authenticate as any, updatePassword as any);

export default router;
