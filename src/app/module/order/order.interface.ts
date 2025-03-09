import { Document, Types } from 'mongoose';
import { ORDER_STATUS } from './order.constant';

type TOrderStatusEnum = 'pending' | 'shipping';

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
  status?: TOrderStatusEnum;
  isDeleted?: boolean;
  totalPrice?: number;
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
