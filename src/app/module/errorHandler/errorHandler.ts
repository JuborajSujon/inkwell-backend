import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { formatErrorResponse } from './errorFormatter';

export const errorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const environment = process.env.NODE_ENV || 'development';

  const response = formatErrorResponse(error, environment);

  // Set appropriate status code
  const statusCode = error.status || 500;
  res.status(statusCode).json(response);
  void next;
};
