import { model, Schema } from 'mongoose';
import { IOrder, IOrderItem, ISingleOrderItem } from './order.interface';

const orderSingleItemSchema = new Schema<ISingleOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const orderItemSchema = new Schema<IOrderItem>(
  {
    orderItems: [orderSingleItemSchema],
    orderTitle: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    deliverystatus: {
      type: String,
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      default: 'pending',
    },
    orderInvoice: {
      type: String,
      default: '',
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const orderSchema = new Schema<IOrder>(
  {
    userEmail: {
      type: String,
      ref: 'User',
      required: true,
    },
    productItems: [orderItemSchema],
  },
  {
    timestamps: true,
  },
);

export const Order = model<IOrder>('Order', orderSchema);
