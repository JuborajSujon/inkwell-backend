import { ErrorRequestHandler } from 'express';
import { formatErrorResponse } from './errorFormatter';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const environment = process.env.NODE_ENV || 'development';

  const response = formatErrorResponse(error, environment);

  // Set appropriate status code
  const statusCode = error.status || 500;
  res.status(statusCode).json(response);
};
