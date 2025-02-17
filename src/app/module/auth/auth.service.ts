import status from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { TUser } from '../user/user.interface';

const registerUser = async (payload: TUser) => {
  //check if the user exists
  const user = await User.isUserExistByEmail(payload?.email);

  if (user) throw new AppError(status.CONFLICT, 'User already exists !');

  // create a new user
  const result = await User.create(payload);

  return result;
};

const loginUser = async (payload: TLoginUser) => {
  //check if the user exists
  const user = await User.isUserExistByEmail(payload?.email);

  if (!user) throw new AppError(status.NOT_FOUND, 'This user is not found !');

  // checking if the user is already blocked
  const isBlocked = user?.isBlocked;

  if (!isBlocked)
    throw new AppError(status.FORBIDDEN, 'This user is blocked !');
};
export const AuthService = {
  registerUser,
  loginUser,
};
