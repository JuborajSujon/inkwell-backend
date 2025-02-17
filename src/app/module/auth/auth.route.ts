import { Router } from 'express';
import { AuthControllers } from './auth.controller';

const router = Router();

// router.post('./login');

router.post('/register', AuthControllers.registerUser);

export const AuthRoutes = router;
