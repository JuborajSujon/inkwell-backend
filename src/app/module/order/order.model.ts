import mongoose, { Schema } from 'mongoose';
import { TOrder } from './order.interface';
import { ORDER_STATUS } from './order.constant';

const orderSchema = new Schema<TOrder>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: 'Invalid email',
      },
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product id required'],
      trim: true,
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: 'Invalid product id format',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      validate: {
        validator: (value: number) => value > 0,
        message: 'Quantity must be a positive number',
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      validate: {
        validator: (value: number) => value > 0,
        message: 'Total price must be a positive number',
      },
    },
    status: {
      type: String,
      enum: {
        values: ORDER_STATUS,
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
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

// Create the Mongoose model
export const Order = mongoose.model<TOrder>('Order', orderSchema);
