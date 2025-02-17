import { Request, Response } from 'express';

import { OrderService } from './order.service';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

// Create a new order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const orderData = req.body;

  // Create a new order
  const result = await OrderService.createOrderIntoDB(orderData);

  // Send response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

// calculate order revenue
const calculateRevenue = catchAsync(async (req: Request, res: Response) => {
  // get total revenue
  const result = await OrderService.calculateTotalRevenue();

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  calculateRevenue,
};
