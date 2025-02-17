import { User } from './user.model';

const getSingleUserFromDB = async (userId: string) => {
  const result = await User.findOne({ _id: userId });
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

export const UserService = {
  getSingleUserFromDB,
  getAllUsersFromDB,
};
