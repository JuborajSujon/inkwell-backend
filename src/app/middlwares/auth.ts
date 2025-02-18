import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/CatchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../module/user/user.interface';
import { User } from '../module/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // if token does not exist
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorizated!');
    }

    // checking if token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, email, iat } = decoded;

    // check if the user exists
    const user = await User.isUserExistByEmail(email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if  the  user is already blockec
    const isBlocked = user?.isBlocked;
    if (isBlocked) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'This user is already blocked !',
      );
    }

    // checking if the user is already inactive
    // const userStatus = user?.status;
    // if (userStatus === 'inactive') {
    //   throw new AppError(
    //     httpStatus.FORBIDDEN,
    //     'This user is already inactive !',
    //   );
    // }

    // check if jwt issued timestamp less then password change timestamp

    if (
      user.passwordChangedAt &&
      User.isJwtIssuedBeforePasswordChange(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You're unauthrized to perform this action!",
      );
    }

    // check if user has required role
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized!');
    }

    // decoded token
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
