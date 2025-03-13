import { Request, Response } from 'express';

import { OrderService } from './order.service';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';

// get all orders
const getAllOrderList = catchAsync(async (req: Request, res: Response) => {
  // Fetch orders from the database
  const result = await OrderService.getAllOrderListFromDB(req.query);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order list retrieved successfully',
    data: result,
  });
});

// get my all orders
const getMyOrderList = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const user = req.user as JwtPayload;

  if (!user) throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
  const result = await OrderService.getMyOrderListFromDB(user?.email);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order list retrieved successfully',
    data: result,
  });
});

//  Add to cart order data
const createOrder = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const orderData = req.body;
  // Get user data from request body
  const user = req.user as JwtPayload;

  // Create a new order
  const result = await OrderService.createOrderIntoDB(orderData, user, req.ip!);

  // Send response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

// verify Payment
const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrderService.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Payment verified successfully',
    data: order,
  });
});

// get single order
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const { orderId } = req.params;

  const user = req.user as JwtPayload;

  if (!user) throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
  const result = await OrderService.getSingleOrderFromDB(orderId, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order retrieved successfully',
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
  const result = await OrderService.updateOrderDeliveryStatusFromDB(
    orderId,
    req.body,
    user,
  );

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

// delete single order
const deleteSingleOrder = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const { orderId } = req.params;

  const user = req.user as JwtPayload;

  if (!user) throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // Create a new order
  const result = await OrderService.deleteSingleOrderFromDB(orderId, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Cart updated successfully',
    data: result,
  });
});

// delete order
const deleteAllOrder = catchAsync(async (req: Request, res: Response) => {
  // Get order data from request body
  const user = req?.user as JwtPayload;

  if (!user) throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // delete order from the database
  // const result = await OrderService.deleteAddToCart(orderId, user);

  const result = await OrderService.deleteAllOrderFromDB(user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const OrderController = {
  getAllOrderList,
  getMyOrderList,
  getSingleOrder,
  createOrder,
  verifyPayment,
  updateOrderStatus,
  deleteSingleOrder,
  deleteAllOrder,
};
