import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.post('/', ProductController.createProduct);
router.get('/:productId', ProductController.getProductById);
// router.put('/:productId');
// router.delete('/:productId');

export const ProductRoutes = router;
