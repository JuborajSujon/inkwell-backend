import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';

// Login user
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  const { accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'development',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 365,
  });

  // Send Response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: { accessToken },
  });
});

// Register user
const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req.body);

  // Send Response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'User is registered successfully!',
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  await AuthService.changePassword(req?.user as JwtPayload, passwordData);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is changed password succesfully!',
    data: null,
  });
});

// refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

// forget password
const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await AuthService.forgetPassword(email);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reset link is generated succesfully! And sent to your email',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  registerUser,
  changePassword,
  refreshToken,
  forgetPassword,
};
