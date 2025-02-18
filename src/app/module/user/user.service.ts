import { TUser } from './user.interface';
import { User } from './user.model';

const getSingleUserFromDB = async (userId: string) => {
  const result = await User.findOne({ _id: userId });
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
