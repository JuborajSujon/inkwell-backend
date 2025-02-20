import { Order } from './order.model';
import { Product } from '../product/product.model';
import { TOrder } from './order.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

// Add product to cart
const addToCart = async (orderData: TOrder) => {
  // get product from the database
  const product = await Product.findById(orderData.productId);

  // if product not found
  if (!product) throw new AppError(status.NOT_FOUND, 'Product not found');

  // check stock availability
  if (product.quantity < orderData.quantity)
    throw new AppError(status.BAD_REQUEST, 'Insufficient stock');

  // calculate total price of the order if total price is not provided
  const totalPrice = orderData.totalPrice || orderData.quantity * product.price;

  // create new order in the database
  const order = await Order.create({
    email: orderData.email,
    productId: orderData.productId,
    quantity: orderData.quantity,
    totalPrice,
  });

  // update product quantity in the database
  product.quantity -= orderData.quantity;
  product.inStock = product.quantity > 0;
  await product.save();

  return order;
};

// Create a new order
const addToCartList = async (email: Partial<TOrder>) => {
  // get product from the database
  const query = {
    email: email,
    status: 'pending',
    isDeleted: false,
  };
  const order = await Order.find(query).populate('productId');

  // if product not found
  if (!order) throw new AppError(status.NOT_FOUND, 'Product not found');

  return order;
};

// Calculate total revenue from all orders
// const calculateTotalRevenue = async () => {
//   const result = await Order.aggregate([
//     // calculate total revenue
//     {
//       $group: {
//         _id: null,
//         totalRevenue: { $sum: '$totalPrice' },
//       },
//     },
//   ]);

//   // get total revenue from the result
//   const totalRevenue = result[0]?.totalRevenue || 0;
//   return totalRevenue;
// };

const calculateTotalRevenue = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: '$status', // Group by order status
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  // Initialize revenue object with default values
  const revenueByStatus: Record<string, number> = {
    pending: 0,
    processing: 0,
    completed: 0,
  };

  // Populate the object with actual data
  result.forEach(({ _id, totalRevenue }) => {
    if (_id in revenueByStatus) {
      revenueByStatus[_id] = totalRevenue;
    }
  });

  return revenueByStatus;
};

// update order in the database
const updateAddToCart = async (
  orderId: string,
  updateData: Partial<TOrder>,
  user: JwtPayload,
) => {
  // Get order from the database
  const order = await Order.findById(orderId);

  // If order not found
  if (!order) throw new AppError(status.NOT_FOUND, 'Order not found');

  // Ensure the user can only update their own order
  if (order.email !== user.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // Ensure the user can only update quantity and totalPrice
  const allowedUpdates: (keyof TOrder)[] = ['quantity', 'totalPrice'];
  const filteredUpdates: Partial<TOrder> = {};

  for (const key of allowedUpdates) {
    if (key in updateData) {
      filteredUpdates[key] = updateData[key] as never;
    }
  }

  // Update order in the database
  const updatedOrder = await Order.findByIdAndUpdate(orderId, filteredUpdates, {
    new: true,
    runValidators: true,
  }).populate('productId');

  if (!updatedOrder) throw new AppError(status.NOT_FOUND, 'Order not found');

  return updatedOrder;
};

// delete order from the database

const deleteAddToCart = async (orderId: string, user: JwtPayload) => {
  // get product from the database
  const order = await Order.findById(orderId);

  // Ensure the user can only delete their own order
  if (order?.email !== user?.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // if product not found
  if (!order) throw new AppError(status.NOT_FOUND, 'Order not found');

  // delete order from the database
  const deletedOrder = await Order.findByIdAndDelete(orderId);

  return deletedOrder;
};

export const OrderService = {
  addToCartList,
  updateAddToCart,
  calculateTotalRevenue,
  addToCart,
  deleteAddToCart,
};
