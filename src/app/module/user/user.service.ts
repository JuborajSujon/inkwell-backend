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

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const blockUser = async (id: string, payload: { isBlocked: boolean }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const updateProfile = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};
const updateProfilePhoto = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  getSingleUserFromDB,
  getAllUsersFromDB,
  changeStatus,
  blockUser,
  updateProfile,
  updateProfilePhoto,
};
