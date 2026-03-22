import { NextResponse } from 'next/server';
import { ApiResponse, PaginatedResponse, PaginationMeta } from '../types';
import { HTTP_STATUS } from '../constants/api.constants';
import { AppError, ValidationError } from './error-handler';

export function successResponse<T>(data: T, message?: string, statusCode = HTTP_STATUS.OK) {
  const payload: ApiResponse<T> = { success: true, data };
  if (message) payload.message = message;
  
  return NextResponse.json(payload, { status: statusCode });
}

export function paginatedResponse<T>(data: T[], pagination: PaginationMeta, message?: string) {
  const payload = { success: true, data, meta: pagination, message };
  return NextResponse.json(payload, { status: HTTP_STATUS.OK });
}

export function errorResponse(error: AppError | string, statusCode = HTTP_STATUS.BAD_REQUEST) {
  if (typeof error === 'string') {
    return NextResponse.json({
      success: false,
      message: error,
      error: { code: 'UNKNOWN_ERROR' }
    }, { status: statusCode });
  }

  const payload: ApiResponse<null> = {
    success: false,
    message: error.message,
    error: {
      code: error.errorCode
    }
  };

  if (error instanceof ValidationError && error.details) {
    payload.error!.details = error.details;
  }

  return NextResponse.json(payload, { status: error.statusCode });
}

export function notFoundResponse(resource = 'Resource') {
  return errorResponse(`${resource} not found`, HTTP_STATUS.NOT_FOUND);
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, HTTP_STATUS.UNAUTHORIZED);
}

export function forbiddenResponse(message = 'Forbidden') {
  return errorResponse(message, HTTP_STATUS.FORBIDDEN);
}

export function validationErrorResponse(details: any) {
  const err = new ValidationError('Validation failed', details);
  return errorResponse(err, err.statusCode);
}
