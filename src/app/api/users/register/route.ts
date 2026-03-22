import { NextRequest } from 'next/server';
import { withErrorHandler, withValidation } from '@/lib/api-wrapper';
import { registerSchema } from '@/lib/validators';
import { userService } from '@/services/user.service';
import { successResponse } from '@/lib/api-response';

export const POST = withErrorHandler(
  withValidation(registerSchema, async (req: NextRequest, ctx: any) => {
    const user = await userService.register(ctx.validatedData);
    
    // Strip sensitive fields before returning
    const { passwordHash, ...safeUser } = user;
    return successResponse(safeUser, 'User registered successfully', 201);
  })
);
