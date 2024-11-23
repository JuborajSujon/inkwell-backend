import { Error } from 'mongoose';
import { TErrorDetail, TErrorResponse } from './errorHander.interface';

export const formatErrorResponse = (error: any): TErrorResponse => {
  let message = 'An unexpected error occurred';
  let errorDetails: Record<string, TErrorDetail> | undefined;
  let name = 'UnknownError';

  // Handle Mongoose ValidationError
  if (error instanceof Error.ValidationError) {
    message = 'Validation failed';
    name = 'ValidationError';
    errorDetails = Object.keys(error.errors).reduce(
      (acc, key) => {
        const err = error.errors[key] as any;
        acc[key] = {
          message: err.message,
          name: err.name,
          properties: err.properties,
          kind: err.kind,
          path: err.path,
          value: err.value,
        };
        return acc;
      },
      {} as Record<string, TErrorDetail>,
    );
  }
  // Handle MongoDB Duplicate Key Error (code: 11000)
  else if (error.code === 11000) {
    message = `Duplicate value for field: ${Object.keys(error.keyValue)[0]}`;
    name = 'MongoError';
    errorDetails = { keyValue: error.keyValue };
  }
  // Handle Other Errors
  else {
    message = error.message || message;
    name = error.name || name;
  }

  return {
    message,
    success: false,
    error: {
      name,
      errors: errorDetails,
    },
    stack: error.stack,
  };
};
