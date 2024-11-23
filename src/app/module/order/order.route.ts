import express from 'express';
import { OrderController } from './order.controller';

const router = express.Router();

router.get('/', OrderController.createOrder);
// router.get('/revenue');

export const OrderRoutes = router;
