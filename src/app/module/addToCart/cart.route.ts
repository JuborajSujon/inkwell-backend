import express from 'express';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlwares/validateRequest';
import { CartController } from './cart.controller';
import { CartValidation } from './cart.validation';

const router = express.Router();

router.post(
  '/create-and-update-cart',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(CartValidation.createCartValidationSchema),
  CartController.createAndUpdateCart,
);

router.get(
  '/my-add-to-cart-list',
  auth(USER_ROLE.admin, USER_ROLE.user),
  CartController.getMyAddToCartList,
);

router.delete(
  '/delete-single-cart/:productId',
  auth(USER_ROLE.admin, USER_ROLE.user),
  CartController.deleteSingleCart,
);

router.delete(
  '/delete-all-cart',
  auth(USER_ROLE.admin, USER_ROLE.user),
  CartController.deleteAllCart,
);
export const CartRoutes = router;
