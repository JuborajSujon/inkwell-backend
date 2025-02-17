import { Request, Response } from 'express';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { UserService } from './user.service';

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  // Get user data from request params
  const { userId } = req.params;

  // Create a new user
  const result = await UserService.getSingleUserFromDB(userId);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const resutl = await UserService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: resutl,
  });
});

export const UserController = {
  getSingleUser,
  getAllUsers,
};
