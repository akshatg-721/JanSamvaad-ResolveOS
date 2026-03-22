export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  FORBIDDEN_OPERATION: 'FORBIDDEN_OPERATION'
} as const;

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource could not be found.',
  VALIDATION_FAILED: 'Please check your inputs and try again.',
  RATE_LIMIT: 'Too many requests. Please try again in a few minutes.'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;
