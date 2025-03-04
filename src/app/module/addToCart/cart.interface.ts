import { Document, Types } from 'mongoose';

// Define the Cart Item Interface
export interface ICartItem extends Document {
  productId: Types.ObjectId;
  quantity: number;
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Cart Interface
export interface ICart extends Document {
  userEmail: string;
  items: ICartItem[];
  totalPrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
