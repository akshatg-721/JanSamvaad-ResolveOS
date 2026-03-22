import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export function successResponse<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200
) {
  return NextResponse.json(
    { success: true, data, message },
    { status: statusCode }
  );
}

export function errorResponse(
  message: string,
  code: string = 'INTERNAL_ERROR',
  statusCode: number = 500
) {
  return NextResponse.json(
    { success: false, error: message, code },
    { status: statusCode }
  );
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode: number = 200
) {
  const totalPages = Math.ceil(total / limit);
  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    },
    { status: statusCode }
  );
}

export function notFoundResponse(resource: string = 'Resource') {
  return errorResponse(`${resource} not found`, 'NOT_FOUND', 404);
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return errorResponse(message, 'UNAUTHORIZED', 401);
}

export function forbiddenResponse(message: string = 'Forbidden') {
  return errorResponse(message, 'FORBIDDEN', 403);
}

export function validationErrorResponse(message: string) {
  return errorResponse(message, 'VALIDATION_ERROR', 400);
}

export function rateLimitResponse(retryAfter: number = 60) {
  const response = errorResponse('Too many requests', 'RATE_LIMITED', 429);
  response.headers.set('Retry-After', retryAfter.toString());
  return response;
}
