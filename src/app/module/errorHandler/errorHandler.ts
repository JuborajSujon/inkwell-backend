import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { formatErrorResponse } from './errorFormatter';
import { AppError } from './customErrors';

export const errorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const response = formatErrorResponse(error);

  // Set appropriate status code
  res.status(statusCode).json(response);
  void next;
};
