import { Request, Response, NextFunction } from 'express';

import { OrderService } from './order.service';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderData = req.body;

    // Create a new order
    const result = await OrderService.createOrderIntoDB(orderData);
    res.status(200).json({
      message: 'Order created successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const OrderController = {
  createOrder,
};
