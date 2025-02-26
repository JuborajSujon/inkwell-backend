import { Request, Response } from 'express';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { UserServices } from './user.service';
import { JwtPayload } from 'jsonwebtoken';

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  // Get user data from request params
  const { userEmail } = req.params;

  const user = req.user as JwtPayload;

  // Create a new user
  const result = await UserServices.getSingleUserFromDB(userEmail, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  // Get user data from request params
  const { id } = req.params;

  const user = req.user as JwtPayload;

  if (!user) throw new Error('You are not authorized!');
  const result = await UserServices.changeStatus(id, req.body, user);

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

  const user = req.user as JwtPayload;
  const result = await UserServices.updateProfile(userId, req.body, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});
const updateProfilePhoto = catchAsync(async (req, res) => {
  // Get user data from request params
  const { userId } = req.params;

  const user = req.user as JwtPayload;
  const result = await UserServices.updateProfilePhoto(userId, req.body, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User profile photo updated successfully',
    data: result,
  });
});

export const UserController = {
  getSingleUser,
  getAllUsers,
  changeStatus,
  blockUser,
  updateProfile,
  updateProfilePhoto,
};
