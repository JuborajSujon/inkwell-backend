import { model, Schema } from 'mongoose';
import { ICart, ICartItem } from './cart.interface';

const cartItemSchema = new Schema<ICartItem>(
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

const cartSchema = new Schema<ICart>(
  {
    userEmail: {
      type: String,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Cart = model<ICart>('Cart', cartSchema);
