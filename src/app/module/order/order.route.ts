import express from 'express';
import { OrderController } from './order.controller';

const router = express.Router();

router.get('/', OrderController.createOrder);
router.get('/revenue', OrderController.calculateRevenue);

export const OrderRoutes = router;
