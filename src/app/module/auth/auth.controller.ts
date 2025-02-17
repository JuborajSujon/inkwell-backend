import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  // Login user
  const result = await AuthService.loginUser(req.body);

  // Send Response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {},
  });
});

const registerUser = catchAsync(async (req, res) => {
  // Register user
  const result = await AuthService.registerUser(req.body);

  // Send Response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'User is registered successfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  registerUser,
};
