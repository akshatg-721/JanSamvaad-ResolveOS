import { NextRequest } from 'next/server';
import { withErrorHandler, withAuth, withValidation } from '@/lib/api-wrapper';
import { updateProfileSchema } from '@/lib/validators';
import { userService } from '@/services/user.service';
import { successResponse } from '@/lib/api-response';

// Get Current User Profile
export const GET = withAuth(async (req: NextRequest, ctx: any) => {
  const userToken = ctx.user; 
  if (!userToken) throw new Error('Unauthorized');
  
  const profile = await userService.getProfile(userToken.id);
  return successResponse(profile, 'Profile retrieved successfully');
});

// Update Profile
export const PATCH = withAuth(
  withValidation(updateProfileSchema, async (req: NextRequest, ctx: any) => {
    const userToken = ctx.user;
    if (!userToken) throw new Error('Unauthorized');

    const updatedProfile = await userService.updateProfile(userToken.id, ctx.validatedData);
    const { passwordHash, ...safeProfile } = updatedProfile as any;
    
    return successResponse(safeProfile, 'Profile updated successfully');
  })
);
