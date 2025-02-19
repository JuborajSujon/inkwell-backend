import { Types } from 'mongoose';
import { ORDER_STATUS } from './order.constant';

export type TOrder = {
  email: string;
  productId: Types.ObjectId; // Reference to Product
  quantity: number;
  totalPrice: number;
  status?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TOrderStatus = keyof typeof ORDER_STATUS;
