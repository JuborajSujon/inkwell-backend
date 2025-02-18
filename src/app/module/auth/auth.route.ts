import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlwares/validateRequest';
import { AuthValidations } from './auth.validation';

const router = Router();

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

export const AuthRoutes = router;
