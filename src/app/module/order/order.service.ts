import { Order } from './order.model';
import { IOrderItem, ISingleOrderItem } from './order.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ORDER_STATUS_CODE } from './order.constant';
import { Product } from '../product/product.model';
import mongoose, { Types } from 'mongoose';
import { User } from '../user/user.model';
import { orderUtils } from './order.utils';
import { Cart } from '../addToCart/cart.model';

// Get all orders
const getMyOrderListFromDB = async (email: string) => {
  const query = {
    userEmail: email, // search for orders with the user's email
  };

  // Fetch orders from the database, populate the orderItems
  const orders = await Order.find(query).populate(
    'productItems.orderItems.productId',
  );

  // Check if orders exist for the given user
  if (!orders || orders.length === 0) {
    throw new AppError(status.NOT_FOUND, 'No orders found');
  }

  return orders;
};

// Create a new order
const createOrderIntoDB = async (
  orderData: IOrderItem,
  user: JwtPayload,
  client_ip: string,
) => {
  const userEmail = user?.email;

  const userDetails = await User.findOne({ email: userEmail });

  if (!userDetails) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const { orderItems, orderTitle, shippingAddress } = orderData;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "Order items can't be empty or not an array",
    );
  }

  let order = await Order.findOne({ userEmail });

  if (!order) {
    order = new Order({
      _id: new Types.ObjectId(),
      userEmail,
      productItems: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  let totalPrice = 0;
  const orderItemProducts: ISingleOrderItem[] = [];

  for (const product of orderItems) {
    if (!mongoose.isValidObjectId(product.productId)) {
      throw new AppError(
        status.BAD_REQUEST,
        `Invalid product ID: ${product.productId}`,
      );
    }

    const productDetails = await Product.findById(product.productId);
    if (!productDetails) {
      throw new AppError(
        status.NOT_FOUND,
        `Product not found: ${product.productId}`,
      );
    }

    const price = productDetails.price * product.quantity;
    totalPrice += price;

    orderItemProducts.push({
      _id: new Types.ObjectId(),
      productId: new mongoose.Types.ObjectId(String(product.productId)),
      quantity: product.quantity,
      price,
    });
  }

  const transaction = {
    id: '',
    transactionStatus: '',
  };

  // payment intregration

  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'USD',
    customer_name: userDetails?.name,
    customer_email: userDetails?.email,
    customer_address: shippingAddress,
    customer_phone: 'phone number',
    customer_city: 'city',
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (!payment) {
    throw new AppError(status.BAD_REQUEST, 'Payment failed');
  }

  if (payment) {
    transaction.id = payment.sp_order_id;
    transaction.transactionStatus = payment.transactionStatus;

    const newOrderItem: IOrderItem = {
      _id: new Types.ObjectId(),
      orderTitle,
      orderItems: orderItemProducts,
      shippingAddress,
      totalPrice,
      transaction,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    order.productItems.push(newOrderItem);
    order.updatedAt = new Date();

    await order.save();

    // update cart
    const cart = await Cart.findOneAndUpdate(
      { userEmail },
      { $set: { items: [] } },
      { new: true },
    );

    if (!cart) throw new AppError(status.NOT_FOUND, 'Cart not found');

    // update product quantity
    for (const item of orderItemProducts) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new AppError(status.NOT_FOUND, 'Product not found');
      }
      product.quantity -= item.quantity;
      await product.save();
    }

    return { order, payment: payment.checkout_url };
  }
};

// verify payment
const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'productItems.transaction.id': order_id,
      },
      {
        $set: {
          'productItems.$.transaction.bank_status':
            verifiedPayment[0].bank_status,
          'productItems.$.transaction.sp_code': verifiedPayment[0].sp_code,
          'productItems.$.transaction.sp_message':
            verifiedPayment[0].sp_message,
          'productItems.$.transaction.transactionStatus':
            verifiedPayment[0].transaction_status,
          'productItems.$.transaction.method': verifiedPayment[0].method,
          'productItems.$.transaction.date_time': verifiedPayment[0].date_time,
          'productItems.$.paymentStatus':
            verifiedPayment[0].bank_status === 'Success'
              ? 'paid'
              : verifiedPayment[0].bank_status === 'Failed'
                ? 'pending'
                : verifiedPayment[0].bank_status === 'Cancel'
                  ? 'Cancelled'
                  : '',
          'productItems.$.orderInvoice': verifiedPayment[0].order_id,
        },
      },
      { new: true },
    );
  }

  return verifiedPayment;
};

// Get a orders from the productItems array
const getSingleOrderFromDB = async (orderId: string, user: JwtPayload) => {
  const query = {
    userEmail: user.email,
    'productItems._id': orderId,
  };

  // Fetch order from DB
  const order = await Order.findOne(query, { 'productItems.$': 1 }).populate(
    'productItems.orderItems.productId',
  );

  // If no order is found
  if (!order) throw new AppError(status.NOT_FOUND, 'Order not found');

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
    [ORDER_STATUS_CODE.pending]: 0,
    [ORDER_STATUS_CODE.shipping]: 0,
  };

  // Populate the object with actual data
  result.forEach(({ _id, totalRevenue }) => {
    if (_id in revenueByStatus) {
      revenueByStatus[_id] = totalRevenue;
    }
  });

  return revenueByStatus;
};

// update order status in the database
const updateOrderDeliveryStatusFromDb = async (
  orderId: string,
  updateData: Partial<IOrderItem>,
  user: JwtPayload,
) => {
  // Ensure only admin can update the status
  if (user?.role !== 'admin') {
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
  }

  // Define allowed fields to update
  const allowedUpdates: (keyof IOrderItem)[] = ['deliverystatus'];
  const filteredUpdates: Partial<IOrderItem> = {};

  for (const key of allowedUpdates) {
    if (key in updateData) {
      filteredUpdates[key] = updateData[key] as never;
    }
  }

  // Update the specific `productItems` inside the order
  const updatedOrder = await Order.findOneAndUpdate(
    { 'productItems._id': orderId }, // Find order by `productItems._id`
    {
      $set: { 'productItems.$.deliverystatus': filteredUpdates.deliverystatus },
    }, // Update `deliverystatus` inside the array
    { new: true, runValidators: true },
  ).populate('productItems.orderItems.productId');

  // If no matching order is found
  if (!updatedOrder) {
    throw new AppError(status.NOT_FOUND, 'Order not found');
  }

  return updatedOrder;
};

// delete single order from the database
const deleteSingleOrderFromDb = async (orderId: string, user: JwtPayload) => {
  // get product from the database
  const order = await Order.findById(orderId);

  // if product not found
  if (!order) throw new AppError(status.NOT_FOUND, 'Order not found');

  // Ensure the user can only delete their own order
  if (order?.userEmail !== user?.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
  // delete order from the database

  const result = {};

  return result;
};

// delete order from the database
const deleteAllOrderFromDb = async (orderId: string, user: JwtPayload) => {
  // get product from the database
  const order = await Order.findById(orderId);

  // if product not found
  if (!order) throw new AppError(status.NOT_FOUND, 'Order not found');

  // Ensure the user can only delete their own order
  if (order?.userEmail !== user?.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // delete order from the database
  const deletedOrder = await Order.findByIdAndDelete(orderId);

  return deletedOrder;
};

export const OrderService = {
  calculateTotalRevenue,
  getMyOrderListFromDB,
  getSingleOrderFromDB,
  createOrderIntoDB,
  verifyPayment,
  updateOrderDeliveryStatusFromDb,
  deleteSingleOrderFromDb,
  deleteAllOrderFromDb,
};
