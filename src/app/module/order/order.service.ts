import { Order } from './order.model';
import { Product } from '../product/product.model';
import { TOrder } from './order.interface';
import {
  InsufficientStockError,
  NotFoundError,
} from '../errorHandler/customErrors';

// Create a new order
const createOrderIntoDB = async (orderData: TOrder) => {
  // get product from the database
  const product = await Product.findById(orderData.product);

  // if product not found
  if (!product) throw new NotFoundError('Product not found');

  // check stock availability
  if (product.quantity < orderData.quantity)
    throw new InsufficientStockError('Insufficient stock');

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
    // get product price from product collection
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product',
      },
    },

    // unwind product array
    { $unwind: '$product' },

    // calculate total revenue for each order
    {
      $project: {
        totalRevenue: { $multiply: ['$quantity', '$product.price'] },
      },
    },

    // calculate total revenue
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalRevenue' },
      },
    },

    // get total revenue
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  // get total revenue from the result
  const totalRevenue = result[0] || { totalRevenue: 0 };
  return totalRevenue;
};

export const OrderService = {
  createOrderIntoDB,
  calculateTotalRevenue,
};
