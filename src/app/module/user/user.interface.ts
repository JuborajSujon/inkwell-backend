/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

type Role = 'user' | 'admin';
type Status = 'active' | 'inactive';

export interface TUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: Status;
  shippingAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isBlocked?: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistByEmail(email: string): Promise<TUser | null>;
}

export type TUserRole = keyof typeof USER_ROLE;
