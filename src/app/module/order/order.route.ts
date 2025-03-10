import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlwares/validateRequest';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/create-order',
  auth(USER_ROLE.user),
  validateRequest(OrderValidation.createOrderValidationSchema),
  OrderController.createOrder,
);
router.get(
  '/my-order-list',
  auth(USER_ROLE.user),
  OrderController.getMyOrderList,
);

router.get(
  '/all-order-list',
  auth(USER_ROLE.admin),
  OrderController.getAllOrderList,
);

router.get(
  '/order-verify',
  auth(USER_ROLE.user),
  OrderController.verifyPayment,
);

router.get(
  '/single-order/:orderId',
  auth(USER_ROLE.user),
  OrderController.getSingleOrder,
);

router.patch(
  '/change-order-status/:orderId',
  auth(USER_ROLE.admin),
  validateRequest(OrderValidation.updateOrderStatusValidationSchema),
  OrderController.updateOrderStatus,
);

router.delete(
  '/delete-single-order/:orderId',
  auth(USER_ROLE.user),
  OrderController.deleteSingleOrder,
);
router.delete(
  '/delete-all-order',
  auth(USER_ROLE.user),
  OrderController.deleteAllOrder,
);

export const OrderRoutes = router;
