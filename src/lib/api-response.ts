import { NextResponse } from 'next/server';

export function successResponse<T>(data: T, message: string = 'Success', status: number = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function errorResponse(message: string, code: string = 'INTERNAL_ERROR', status: number = 500) {
  return NextResponse.json({ success: false, error: message, code }, { status });
}

export function paginatedResponse<T>(data: T[], page: number, limit: number, total: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
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
