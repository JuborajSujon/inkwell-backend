import express from 'express';
import { ProductController } from './product.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlwares/validateRequest';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductController.createProduct,
);
router.get('/:productId', ProductController.getProductById);
router.put('/:productId', ProductController.updateProduct);
router.delete('/:productId', ProductController.deleteProduct);

export const ProductRoutes = router;
