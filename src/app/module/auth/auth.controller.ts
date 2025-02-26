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
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
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

// reset password
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const result = await AuthService.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Password is reset succesfully!',
    data: result,
  });
});

const logoutUser = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: 'Refresh token not found',
      data: null,
    });
  }
  await AuthService.logoutUser(refreshToken);

  res.clearCookie('refreshToken', {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is logged out successfully!',
    data: null,
  });
});

export const AuthControllers = {
  loginUser,
  registerUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  logoutUser,
};
