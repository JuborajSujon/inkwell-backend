import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlwares/validateRequest';
import { AuthValidations } from './auth.validation';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/logout',
  auth(USER_ROLE.admin, USER_ROLE.user),
  AuthControllers.logoutUser,
);

router.post(
  '/register',
  validateRequest(AuthValidations.registerUserValidationSchema),
  AuthControllers.registerUser,
);

router.post(
  '/login',
  validateRequest(AuthValidations.loginValidatioinSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(AuthValidations.changePasswordValidatioinSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidations.resetPasswordValidationSchem),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
