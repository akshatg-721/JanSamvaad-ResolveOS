import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ZodSchema } from 'zod';
import { errorResponse, validationErrorResponse } from './api-response';

export interface ApiContext {
  user?: any;
  session?: any;
  validatedData?: any;
  params?: any;
}

export type ApiHandler<T = any> = (
  req: NextRequest,
  ctx?: ApiContext
) => Promise<NextResponse<T>>;

/**
 * Wrap API handler with error handling
 */
export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, ctx?: ApiContext) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      console.error('[API Error]', error);

      if (error instanceof Error) {
        // Handle specific error messages
        if (error.message.includes('Unauthorized')) {
          return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
        }
        if (error.message.includes('not found')) {
          return errorResponse(error.message, 'NOT_FOUND', 404);
        }
        if (error.message.includes('already exists')) {
          return errorResponse(error.message, 'CONFLICT', 409);
        }

        return errorResponse(error.message, 'INTERNAL_ERROR', 500);
      }

      return errorResponse('Internal server error', 'INTERNAL_ERROR', 500);
    }
  };
}

/**
 * Wrap API handler with authentication check
 */
export function withAuth(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, ctx?: ApiContext) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    return handler(req, {
      ...ctx,
      user: session.user,
      session
    });
  };
}

/**
 * Require specific roles
 */
export function withRole(roles: string[]) {
  return (handler: ApiHandler): ApiHandler => {
    return async (req: NextRequest, ctx?: ApiContext) => {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
      }

      if (!roles.includes((session.user as any).role)) {
        return errorResponse('Forbidden', 'FORBIDDEN', 403);
      }

      return handler(req, {
        ...ctx,
        user: session.user,
        session
      });
    };
  };
}

/**
 * Wrap API handler with request validation
 */
export function withValidation(schema: ZodSchema): (handler: ApiHandler) => ApiHandler;
export function withValidation(schema: ZodSchema, handler: ApiHandler): ApiHandler;
export function withValidation(schema: ZodSchema, maybeHandler?: ApiHandler) {
  const wrapper = (handler: ApiHandler): ApiHandler => {
    return async (req: NextRequest, ctx?: ApiContext) => {
      try {
        const body = await req.json();
        const validated = schema.parse(body);

        return handler(req, {
          ...ctx,
          validatedData: validated
        });
      } catch (error: any) {
        return validationErrorResponse(
          error?.errors?.[0]?.message || 'Invalid request'
        );
      }
    };
  };

  return maybeHandler ? wrapper(maybeHandler) : wrapper;
}

/**
 * Compose multiple wrappers
 */
export function compose(...fns: ((handler: ApiHandler) => ApiHandler)[]) {
  return (handler: ApiHandler): ApiHandler => {
    return fns.reduceRight((acc, fn) => fn(acc), handler);
  };
}
