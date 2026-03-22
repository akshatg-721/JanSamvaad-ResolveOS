import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return errorResponse('User already exists with this email', 'CONFLICT', 409);
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        name: validated.name,
        phone: validated.phone || null,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(user, 'Registration successful', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse(error.errors[0]?.message || 'Validation failed');
    }
    console.error('[Register Error]', error);
    return errorResponse('Registration failed', 'INTERNAL_ERROR', 500);
  }
}
