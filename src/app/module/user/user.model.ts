import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
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

// find user by using email
userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

export const User = model<TUser, UserModel>('User', userSchema);
