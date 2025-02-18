import status from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { TUser } from '../user/user.interface';
import { createToken } from './auth.utils';
import config from '../../config';

// create a new user
const registerUser = async (payload: TUser) => {
  //check if the user exists
  const user = await User.isUserExistByEmail(payload?.email);

  if (user) throw new AppError(status.CONFLICT, 'User already exists !');

  // create a new user
  const result = await User.create(payload);

  return result;
};

// login user
const loginUser = async (payload: TLoginUser) => {
  //check if the user exists
  const user = await User.isUserExistByEmail(payload?.email);

  if (!user) throw new AppError(status.NOT_FOUND, 'This user is not found !');

  // check is the user is active or not
  const isActive = user?.status;
  if (isActive === 'inactive')
    throw new AppError(status.UNAUTHORIZED, 'This user is not active !');

  // checking if the user is already blocked
  const isBlocked = user?.isBlocked;
  if (isBlocked) throw new AppError(status.FORBIDDEN, 'This user is blocked !');

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(status.FORBIDDEN, 'Password does not match !');
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  // create token and send to the client
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  // refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};
