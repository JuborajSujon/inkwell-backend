import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlwares/validateRequest';

const router = Router();

router.post(
  '/block-user/:id',
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.changeBlockValidationSchema),
  UserController.blockUser,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.user),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus,
);
router.get(
  '/:userId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserController.getSingleUser,
);
router.get('/', UserController.getAllUsers);

export const UserRoutes = router;
