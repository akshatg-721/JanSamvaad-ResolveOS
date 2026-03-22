import { NextResponse } from "next/server";

export function successResponse<T>(data: T, message = "Success", status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function errorResponse(message: string, code = "INTERNAL_ERROR", status = 500) {
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

export function notFoundResponse(resource = "Resource") {
  return errorResponse(`${resource} not found`, "NOT_FOUND", 404);
}

export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse(message, "UNAUTHORIZED", 401);
}

export function forbiddenResponse(message = "Forbidden") {
  return errorResponse(message, "FORBIDDEN", 403);
}

export function validationErrorResponse(message: string) {
  return errorResponse(message, "VALIDATION_ERROR", 400);
}
