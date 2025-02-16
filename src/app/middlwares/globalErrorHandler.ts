import { ErrorRequestHandler } from 'express';
import { TErrorSources } from '../interface/error.interface';
import { ZodError } from 'zod';

export const globalErrorHandler: ErrorRequestHandler = (
  error: any,
  req: any,
  res: any,
  next: any,
) => {
  const statusCode = 500;
  const message = 'something went wrong';

  const errorSources: TErrorSources = [
    {
      path: '',
      message: 'something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
  }
};
