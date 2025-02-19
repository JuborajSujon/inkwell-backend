import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlwares/validateRequest';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/add-to-cart',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(OrderValidation.createOrderValidationSchema),
  OrderController.addToCart,
);
router.get(
  '/my-add-to-cart-list',
  auth(USER_ROLE.user, USER_ROLE.admin),
  OrderController.addToCartList,
);
router.get('/revenue', auth(USER_ROLE.admin), OrderController.calculateRevenue);

export const OrderRoutes = router;
