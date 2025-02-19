import { Request, Response } from 'express';

import { OrderService } from './order.service';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';

// get all orders
const addToCartList = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const user = req.user as JwtPayload;

  if (!user) throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
  const result = await OrderService.addToCartList(user?.email);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Add to cart list retrieved successfully',
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

//  Add to cart order data
const addToCart = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const orderData = req.body;

  // Create a new order
  const result = await OrderService.addToCart(orderData);

  // Send response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

export const OrderController = {
  addToCartList,
  calculateRevenue,
  addToCart,
};
