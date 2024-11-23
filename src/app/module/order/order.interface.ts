import { Types } from 'mongoose';

export type TOrder = {
  email: string;
  product: Types.ObjectId; // Reference to Product
  quantity: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
};
