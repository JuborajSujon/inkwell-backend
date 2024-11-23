class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Product not found') {
    super(message, 404);
  }
}

class InsufficientStockError extends AppError {
  constructor(message = 'Insufficient stock') {
    super(message, 400);
  }
}

export { AppError, NotFoundError, InsufficientStockError };
