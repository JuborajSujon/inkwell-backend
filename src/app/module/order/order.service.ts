import { Order } from './order.model';
import { Product } from '../product/product.model';
import { TOrder } from './order.interface';

// Create a new order
const createOrderIntoDB = async (orderData: TOrder) => {
  // get product from the database
  const product = await Product.findById(orderData.product);

  // if product not found
  if (!product) throw new Error('Product not found');

  // check stock availability
  if (product.quantity < orderData.quantity)
    throw new Error('Insufficient stock');

  // calculate total price of the order
  const totalPrice = orderData.quantity * product.price;

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

export const OrderService = { createOrderIntoDB };
