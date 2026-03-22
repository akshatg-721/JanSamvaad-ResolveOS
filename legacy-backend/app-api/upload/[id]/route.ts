import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, notFoundResponse, forbiddenResponse } from '@/lib/api-response';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const { id } = await params;
    const attachment = await prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      return notFoundResponse('Attachment');
    }

    if (attachment.userId !== session.user.id && (session.user as any).role !== 'ADMIN') {
      return forbiddenResponse('You can only delete your own files');
    }

    if (attachment.cloudinaryId) {
      await deleteFromCloudinary(attachment.cloudinaryId);
    }

    await prisma.attachment.delete({
      where: { id },
    });

    return successResponse(null, 'File deleted successfully');
  } catch (error) {
    console.error('[Delete Upload Error]', error);
    return errorResponse('Failed to delete file', 'DELETE_ERROR', 500);
  }
}
