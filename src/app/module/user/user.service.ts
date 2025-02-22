import status from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';

const getSingleUserFromDB = async (userId: string, user: JwtPayload) => {
  const result = await User.findOne({ _id: userId });

  if (!result) throw new AppError(status.NOT_FOUND, 'User not found');

  if (result.email !== user.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

const changeStatus = async (
  id: string,
  payload: Partial<TUser>,
  user: JwtPayload,
) => {
  const userData = await User.findOne({ _id: id });

  if (!userData) throw new AppError(status.NOT_FOUND, 'User not found');

  if (userData.email !== user.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // Ensure the user can only update name, status and shippingAddress

  const allowedUpdates: (keyof TUser)[] = ['status'];
  const filteredUpdates: Partial<TUser> = {};

  for (const key of allowedUpdates) {
    if (key in payload) {
      filteredUpdates[key] = payload[key] as never;
    }
  }
  const updateUser = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  });
  return updateUser;
};

const blockUser = async (id: string, payload: Partial<TUser>) => {
  // Ensure the user can only update name, status and shippingAddress

  const allowedUpdates: (keyof TUser)[] = ['isBlocked'];
  const filteredUpdates: Partial<TUser> = {};

  for (const key of allowedUpdates) {
    if (key in payload) {
      filteredUpdates[key] = payload[key] as never;
    }
  }
  const updateUser = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  });
  return updateUser;
};

const updateProfile = async (
  id: string,
  payload: Partial<TUser>,
  user: JwtPayload,
) => {
  const userData = await User.findOne({ _id: id });

  if (!userData) throw new AppError(status.NOT_FOUND, 'User not found');

  if (userData.email !== user.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // // Ensure the user can only update name, status and shippingAddress

  const allowedUpdates: (keyof TUser)[] = ['name', 'shippingAddress'];
  const filteredUpdates: Partial<TUser> = {};

  for (const key of allowedUpdates) {
    if (key in payload) {
      filteredUpdates[key] = payload[key] as never;
    }
  }
  const updateUser = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  });
  return updateUser;
};
const updateProfilePhoto = async (
  id: string,
  payload: Partial<TUser>,
  user: JwtPayload,
) => {
  const userData = await User.findOne({ _id: id });

  if (!userData) throw new AppError(status.NOT_FOUND, 'User not found');

  if (userData.email !== user.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // // Ensure the user can only update name, status and shippingAddress

  const allowedUpdates: (keyof TUser)[] = ['photo'];
  const filteredUpdates: Partial<TUser> = {};

  for (const key of allowedUpdates) {
    if (key in payload) {
      filteredUpdates[key] = payload[key] as never;
    }
  }
  const updateUser = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  });
  return updateUser;
};

export const UserServices = {
  getSingleUserFromDB,
  getAllUsersFromDB,
  changeStatus,
  blockUser,
  updateProfile,
  updateProfilePhoto,
};
