import { Request, Response } from 'express';

import { OrderService } from './order.service';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';

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

// update order
const updateAddToCart = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const { orderId } = req.params;

  const user = req.user as JwtPayload;

  if (!user) throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // Create a new order
  const result = await OrderService.updateAddToCart(orderId, req.body, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Cart updated successfully',
    data: result,
  });
});

// update order status
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const { orderId } = req.params;

  const user = req.user as JwtPayload;

  if (!user) throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // Update order status in the database (only admin can update order status)
  const result = await OrderService.updateOrderStatus(orderId, req.body, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

// delete order
const deleteAddToCart = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const { orderId } = req.params;

  const user = req?.user as JwtPayload;

  if (!user) throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // delete order from the database
  const result = await OrderService.deleteAddToCart(orderId, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Cart deleted successfully',
    data: result,
  });
});

export const OrderController = {
  addToCartList,
  updateAddToCart,
  calculateRevenue,
  addToCart,
  deleteAddToCart,
  updateOrderStatus,
};
