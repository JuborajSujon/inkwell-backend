import { Order } from './order.model';
import { Product } from '../product/product.model';
import { TOrder } from './order.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';

// Create a new order
const createOrderIntoDB = async (orderData: TOrder) => {
  // get product from the database
  const product = await Product.findById(orderData.product);

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
    product: orderData.product,
    quantity: orderData.quantity,
    totalPrice,
  });

  // update product quantity in the database
  product.quantity -= orderData.quantity;
  product.inStock = product.quantity > 0;
  await product.save();

  return order;
};

// Calculate total revenue from all orders
const calculateTotalRevenue = async () => {
  const result = await Order.aggregate([
    // calculate total revenue
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  // get total revenue from the result
  const totalRevenue = result[0]?.totalRevenue || 0;
  return totalRevenue;
};

export const OrderService = {
  createOrderIntoDB,
  calculateTotalRevenue,
};
