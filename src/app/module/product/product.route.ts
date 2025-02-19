import express from 'express';
import { ProductController } from './product.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlwares/validateRequest';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductController.createProduct,
);
router.put(
  '/:productId',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductController.updateProduct,
);
router.delete(
  '/:productId',
  auth(USER_ROLE.admin),
  ProductController.deleteProduct,
);
router.get('/:productId', ProductController.getProductById);
router.get('/', ProductController.getAllProducts);

export const ProductRoutes = router;
