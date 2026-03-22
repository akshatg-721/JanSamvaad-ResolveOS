import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary, UPLOAD_CONFIG } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
    }

    const formData = await req.formData();
    const filesFromArray = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;
    const files = filesFromArray.length > 0 ? filesFromArray : singleFile ? [singleFile] : [];

    if (!files || files.length === 0) {
      return validationErrorResponse('No files provided');
    }

    if (files.length > UPLOAD_CONFIG.MAX_FILES) {
      return validationErrorResponse(`Maximum ${UPLOAD_CONFIG.MAX_FILES} files allowed`);
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        return validationErrorResponse(`Invalid file type: ${file.name}`);
      }

      if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
        return validationErrorResponse(`File too large: ${file.name}`);
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const result = await uploadToCloudinary(buffer, filename);

      const attachment = await prisma.attachment.create({
        data: {
          filename: file.name,
          url: result.url,
          thumbnailUrl: result.thumbnailUrl,
          cloudinaryId: result.publicId,
          mimeType: file.type,
          size: file.size,
          userId: session.user.id,
        },
      });

      uploadedFiles.push(attachment);
    }

    return successResponse(uploadedFiles, 'Files uploaded successfully', 201);
  } catch (error) {
    console.error('[Upload Error]', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Upload failed',
      'UPLOAD_ERROR',
      500
    );
  }
}
