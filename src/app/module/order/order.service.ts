import { Order } from './order.model';
import { Product } from '../product/product.model';
import { TOrder } from './order.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';

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

const updateAddToCart = async (
  orderId: string,
  updateData: Partial<TOrder>,
) => {
  // get product from the database
  const order = await Order.findById(orderId);

  // if product not found
  if (!order) throw new AppError(status.NOT_FOUND, 'Order not found');

  // update order in the database
  const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: true,
  }).populate('productId');

  if (!updatedOrder) throw new AppError(status.NOT_FOUND, 'Order not found');

  return updatedOrder;
};

export const OrderService = {
  addToCartList,
  updateAddToCart,
  calculateTotalRevenue,
  addToCart,
};
