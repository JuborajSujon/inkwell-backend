import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
    },
    email: {
      type: String,
      required: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [USER_ROLE.user, USER_ROLE.admin],
      default: USER_ROLE.user,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    shippingAddress: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>('User', userSchema);
