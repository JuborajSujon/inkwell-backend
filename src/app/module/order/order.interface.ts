import { Document, Types } from 'mongoose';
import { ORDER_STATUS } from './order.constant';

type TOrderDeliveryStatusEnum = 'pending' | 'shipping';
type TPaymentStatusEnum = 'pending' | 'paid' | 'canceled';

export interface ISingleOrderItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  price?: number;
}

// Define the Order Item Interface
export interface IOrderItem {
  _id?: Types.ObjectId;
  orderItems: ISingleOrderItem[];
  orderTitle: string;
  shippingAddress: string;
  orderInvoice?: string;
  paymentStatus?: TPaymentStatusEnum;
  deliverystatus?: TOrderDeliveryStatusEnum;
  isDeleted?: boolean;
  totalPrice?: number;
  transaction: {
    id?: string;
    transactionStatus?: string;
    bank_status?: string;
    sp_code?: string;
    sp_message?: string;
    method?: string;
    date_time?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Order Interface
export interface IOrder extends Document {
  _id: Types.ObjectId;
  userEmail: string;
  productItems: IOrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type TOrderStatus = keyof typeof ORDER_STATUS;
