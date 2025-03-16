import { Order } from './order.model';
import { IOrderItem, ISingleOrderItem } from './order.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { Product } from '../product/product.model';
import mongoose, { Types } from 'mongoose';
import { User } from '../user/user.model';
import { orderUtils } from './order.utils';
import { Cart } from '../addToCart/cart.model';

// Get all orders
// const getAllOrderListFromDB = async (query: Record<string, unknown>) => {
//   const aggregationPipeline: mongoose.PipelineStage[] = [
//     {
//       $unwind: {
//         path: '$productItems',
//         preserveNullAndEmptyArrays: true, // Ensure orders without productItems are kept
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         userEmail: 1,
//         'productItems._id': 1,
//         'productItems.orderTitle': 1,
//         'productItems.shippingAddress': 1,
//         'productItems.totalPrice': 1,
//         'productItems.deliverystatus': 1,
//         'productItems.paymentStatus': 1,
//         'productItems.orderInvoice': 1,
//         'productItems.isDeleted': 1,
//         'productItems.createdAt': 1,
//         'productItems.updatedAt': 1,
//         'productItems.orderItems': 1,
//         'productItems.transaction': {
//           $ifNull: [
//             '$productItems.transaction',
//             {
//               id: '$productItems.orderInvoice',
//               transactionStatus: null,
//               bank_status: 'failed',
//               date_time: new Date().toISOString(),
//               method: 'COD',
//               sp_code: '1000',
//               sp_message: 'failed',
//             },
//           ],
//         },
//       },
//     },
//   ];

//   // Apply search, filter, sort, pagination manually for aggregation
//   if (query.searchTerm) {
//     const searchRegex = { $regex: query.searchTerm, $options: 'i' };

//     aggregationPipeline.push({
//       $match: {
//         $or: [
//           { userEmail: searchRegex },
//           { 'productItems.orderTitle': searchRegex },
//           { 'productItems.deliverystatus': searchRegex },
//           { 'productItems.paymentStatus': searchRegex },
//           { 'productItems.orderInvoice': searchRegex },
//         ],
//       },
//     });
//   }

//   // Apply filter if query contains filter conditions
//   if (query.filter) {
//     aggregationPipeline.push({
//       $match: query.filter,
//     });
//   }

//   // Apply sorting
//   if (query.sort) {
//     const sortField = query.sort as string;
//     const sortOrder = query.order === 'desc' ? -1 : 1;
//     aggregationPipeline.push({
//       $sort: { [sortField]: sortOrder },
//     });
//   }

//   // Pagination: Skip & Limit
//   const page = query.page ? parseInt(query.page as string, 10) : 1;
//   const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
//   const skip = (page - 1) * limit;

//   aggregationPipeline.push({ $skip: skip });
//   aggregationPipeline.push({ $limit: limit });

//   // Execute aggregation
//   const result = await Order.aggregate(aggregationPipeline);

//   // Count total orders (without pagination)
//   const countPipeline = [...aggregationPipeline];
//   countPipeline.push({ $count: 'total' });
//   const countResult = await Order.aggregate(countPipeline);
//   const totalRecords = countResult.length ? countResult[0].total : 0;

//   return {
//     result,
//     meta: {
//       total: totalRecords,
//       page,
//       limit,
//       totalPages: Math.ceil(totalRecords / limit),
//     },
//   };
// };

const getAllOrderListFromDB = async (query: Record<string, unknown>) => {
  const aggregationPipeline: mongoose.PipelineStage[] = [
    // Unwind productItems to process each productItem individually
    {
      $unwind: {
        path: '$productItems',
        preserveNullAndEmptyArrays: true, // Ensure orders without productItems are kept
      },
    },
    // Unwind orderItems to process each orderItem individually
    {
      $unwind: {
        path: '$productItems.orderItems',
        preserveNullAndEmptyArrays: true, // Ensure productItems without orderItems are kept
      },
    },
    // Lookup productDetails for each orderItem
    {
      $lookup: {
        from: 'products', // The collection to join with
        localField: 'productItems.orderItems.productId', // Field from the input documents
        foreignField: '_id', // Field from the documents of the "from" collection
        as: 'productItems.orderItems.productDetails', // Output array field
      },
    },
    // Unwind productDetails to merge it with orderItems
    {
      $unwind: {
        path: '$productItems.orderItems.productDetails',
        preserveNullAndEmptyArrays: true, // Ensure orderItems without productDetails are kept
      },
    },
    // Group back to reconstruct the orderItems array for each productItem
    {
      $group: {
        _id: {
          orderId: '$_id',
          productItemId: '$productItems._id', // Group by productItem ID to keep them separate
        },
        userEmail: { $first: '$userEmail' },
        productItems: { $first: '$productItems' },
        orderItems: { $push: '$productItems.orderItems' },
      },
    },
    // Reshape the document to include the reconstructed orderItems array
    {
      $project: {
        _id: '$_id.orderId',
        userEmail: 1,
        productItems: {
          _id: '$productItems._id',
          orderTitle: '$productItems.orderTitle',
          shippingAddress: '$productItems.shippingAddress',
          totalPrice: '$productItems.totalPrice',
          deliverystatus: '$productItems.deliverystatus',
          paymentStatus: '$productItems.paymentStatus',
          orderInvoice: '$productItems.orderInvoice',
          isDeleted: '$productItems.isDeleted',
          createdAt: '$productItems.createdAt',
          updatedAt: '$productItems.updatedAt',
          transaction: '$productItems.transaction',
          orderItems: '$orderItems',
        },
      },
    },
  ];

  // Apply search, filter, sort, pagination manually for aggregation
  if (query.searchTerm) {
    const searchRegex = { $regex: query.searchTerm, $options: 'i' };

    aggregationPipeline.push({
      $match: {
        $or: [
          { userEmail: searchRegex },
          { 'productItems.orderTitle': searchRegex },
          { 'productItems.deliverystatus': searchRegex },
          { 'productItems.paymentStatus': searchRegex },
          { 'productItems.orderInvoice': searchRegex },
          { 'productItems.shippingAddress': searchRegex },
        ],
      },
    });
  }

  // Apply filter if query contains filter conditions
  if (query.filter) {
    aggregationPipeline.push({
      $match: query.filter,
    });
  }

  // Apply sorting
  if (query.sort) {
    const sortField = query.sort as string;
    const sortOrder = query.order === 'desc' ? -1 : 1;
    aggregationPipeline.push({
      $sort: { [sortField]: sortOrder },
    });
  }

  // Pagination: Skip & Limit
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
  const skip = (page - 1) * limit;

  aggregationPipeline.push({ $skip: skip });
  aggregationPipeline.push({ $limit: limit });

  // Execute aggregation
  const result = await Order.aggregate(aggregationPipeline);

  // Count total orders (without pagination)
  const countPipeline = [...aggregationPipeline];
  countPipeline.push({ $count: 'total' });
  const countResult = await Order.aggregate(countPipeline);
  const totalRecords = countResult.length ? countResult[0].total : 0;

  return {
    result,
    meta: {
      total: totalRecords,
      page,
      limit,
      totalPages: Math.ceil(totalRecords / limit),
    },
  };
};

// Get my all orders
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
      { $set: { items: [], totalPrice: 0 } },
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

    return payment.checkout_url;
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

// update order status in the database
const updateOrderDeliveryStatusFromDB = async (
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
const deleteSingleOrderFromDB = async (orderId: string, user: JwtPayload) => {
  const updatedOrder = await Order.findOneAndUpdate(
    { userEmail: user.email },
    { $pull: { productItems: { _id: orderId } } },
    { new: true },
  ).populate('productItems.orderItems.productId');

  if (!updatedOrder) {
    throw new AppError(status.NOT_FOUND, 'Order not found or already deleted');
  }

  return updatedOrder;
};

// delete order from the database
const deleteAllOrderFromDB = async (user: JwtPayload) => {
  const updatedOrder = await Order.findOneAndUpdate(
    { userEmail: user.email },
    { $set: { productItems: [] } },
    { new: true },
  );

  // If no order is found or updated
  if (!updatedOrder) {
    throw new AppError(status.NOT_FOUND, 'Order not found or already deleted');
  }

  return updatedOrder;
};

export const OrderService = {
  getAllOrderListFromDB,
  getMyOrderListFromDB,
  getSingleOrderFromDB,
  createOrderIntoDB,
  verifyPayment,
  updateOrderDeliveryStatusFromDB,
  deleteSingleOrderFromDB,
  deleteAllOrderFromDB,
};
