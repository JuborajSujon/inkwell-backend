import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.get(
  '/:userId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.getSingleUser,
);
router.get('/', UserController.getAllUsers);

export const UserRoutes = router;
