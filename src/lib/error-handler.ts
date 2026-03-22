import { ERROR_CODES, HTTP_STATUS } from '../constants/api.constants';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, errorCode: string, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

export class ValidationError extends AppError {
  public readonly details: any;
  constructor(message: string, details?: any) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED_ACCESS);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden operation') {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN_OPERATION);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT_ERROR);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, ERROR_CODES.RATE_LIMIT_EXCEEDED);
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return error;
  }
  
  // Log unexpected errors securely
  console.error('[UNEXPECTED ERROR]', error);
  
  const msg = error instanceof Error ? error.message : 'Internal Server Error';
  return new AppError(msg, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR, false);
}
