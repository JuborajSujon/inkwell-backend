import status from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/CatchAsync';
import { CartService } from './cart.service';

const createAndUpdateCart = catchAsync(async (req, res) => {
  // Get cart data from request body
  const items = req.body;

  // Get user data from request user
  const user = req.user;

  if (!user) throw new Error('You are not authorized!');

  // Create a new cart in the database
  const result = await CartService.createAndUpdateCartIntoDB({
    items,
    userEmail: user?.email,
  });

  // Send response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Cart created successfully',
    data: result,
  });
});

const getMyAddToCartList = catchAsync(async (req, res) => {
  // Get user data from request user
  const user = req.user;

  if (!user) throw new Error('You are not authorized!');
  // Get cart data from the database
  const result = await CartService.getCartByUserEmail(user?.email);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Cart retrieved successfully',
    data: result,
  });
});

const deleteSingleCart = catchAsync(async (req, res) => {
  // Get user data from request body
  const { productId } = req.body;
  // Get user data from request user
  const user = req.user;

  if (!user) throw new Error('You are not authorized!');
  // Delete cart data from the database
  const result = await CartService.deleteSingleCartFromDB(
    user?.email,
    productId,
  );

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Cart deleted successfully',
    data: result,
  });
});

const deleteAllCart = catchAsync(async (req, res) => {
  // Get user data from request user
  const user = req.user;

  if (!user) throw new Error('You are not authorized!');
  // Delete cart data from the database
  const result = await CartService.deleteUserCartFromDB(user?.email);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Cart deleted successfully',
    data: result,
  });
});

export const CartController = {
  createAndUpdateCart,
  getMyAddToCartList,
  deleteSingleCart,
  deleteAllCart,
};
