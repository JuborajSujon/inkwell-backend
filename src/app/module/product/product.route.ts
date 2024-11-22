import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();

router.get('/', ProductController.createProduct);
// router.post('/');
// router.get('/:productId');
// router.put('/:productId');
// router.delete('/:productId');

export const ProductRoutes = router;
