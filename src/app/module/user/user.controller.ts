import { Request, Response } from 'express';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { UserServices } from './user.service';

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  // Get user data from request params
  const { userId } = req.params;

  // Create a new user
  const result = await UserServices.getSingleUserFromDB(userId);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const resutl = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: resutl,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  // Get user data from request params
  const { id } = req.params;
  const result = await UserServices.changeStatus(id, req.body);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User status updated succesfully',
    data: result,
  });
});

const blockUser = catchAsync(async (req, res) => {
  // Get user data from request params
  const { id } = req.params;
  const result = await UserServices.blockUser(id, req.body);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User blocked successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  // Get user data from request params
  const { userId } = req.params;
  const result = await UserServices.updateProfile(userId, req.body);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});

export const UserController = {
  getSingleUser,
  getAllUsers,
  changeStatus,
  blockUser,
  updateProfile,
};
