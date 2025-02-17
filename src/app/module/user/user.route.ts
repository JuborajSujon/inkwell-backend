import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.get('/:userId', UserController.getSingleUser);
router.get('/', UserController.getAllUsers);

export const UserRoutes = router;
