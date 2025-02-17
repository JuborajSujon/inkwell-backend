import { Request, Response } from 'express';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { UserService } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  // Get user data from request body
  const userData = req.body;

  // Create a new user
  const result = await UserService.createUserIntoDB(userData);

  // Send response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
};
