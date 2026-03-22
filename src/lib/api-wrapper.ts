import { NextRequest } from 'next/server';
import { handleError } from './error-handler';
import { errorResponse } from './api-response';

type RouteHandler = (req: NextRequest, context: any) => Promise<any> | any;

export function withErrorHandler(handler: RouteHandler) {
  return async (req: NextRequest, context: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      const appError = handleError(error);
      return errorResponse(appError);
    }
  };
}

// Stubs for withAuth and withValidation (to be expanded in later phases)
export function withAuth(handler: RouteHandler) {
  return withErrorHandler(async (req: NextRequest, context: any) => {
    // TODO: Verify Session/Token via NextAuth or JWT
    // const session = await getSession();
    // if (!session) throw new UnauthorizedError();
    // context.session = session;
    return handler(req, context);
  });
}

import { sanitizeObject } from './sanitize';

export function withValidation<T>(schema: any, handler: RouteHandler) {
  return withErrorHandler(async (req: NextRequest, context: any) => {
    const rawBody = await req.json();
    
    // Automatically sanitize payload before validation
    const sanitizedBody = sanitizeObject(rawBody);
    
    // Zod will parse the already-safe object
    const validatedData = await schema.parseAsync(sanitizedBody);
    
    // Attach to context for handlers
    context.validatedData = validatedData;
    
    return handler(req, context);
  });
}
