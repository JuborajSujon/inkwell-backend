import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import { USER_ROLE } from './user.constant';
import bcrypt from 'bcrypt';

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
    photo: {
      type: String,
      default: '',
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
      default: '',
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

// use hook to hash password before saving user
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // hashing password before saving
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

// find user by using email
userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

export const User = model<TUser, UserModel>('User', userSchema);
